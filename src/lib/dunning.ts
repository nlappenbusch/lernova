// Automatisiertes Mahnwesen (mehrstufig, gemaess config.billing.dunningLevelDays).

import { prisma } from "./db";
import { config } from "./config";
import { chf, formatDate } from "./format";
import { formatIban, formatQrReference } from "./swiss";
import { sendMail } from "./mailer";

export type DunningRunResult = {
  checkedInvoices: number;
  dunningsSent: Array<{ invoiceNumber: string; level: number; to: string }>;
};

type DunningInvoiceInfo = {
  number: string;
  amount: number;
  reference: string;
  dueDate: Date;
  customerName: string;
};

function paymentBlock(inv: DunningInvoiceInfo): string {
  return [
    `Rechnungsnummer: ${inv.number}`,
    `Betrag: ${chf(inv.amount)}`,
    `QR-Referenz: ${formatQrReference(inv.reference)}`,
    `Konto (QR-IBAN): ${formatIban(config.company.qrIban)}`,
    `Ursprüngliche Fälligkeit: ${formatDate(inv.dueDate)}`,
  ].join("\n");
}

function dunningTemplate(
  level: number,
  inv: DunningInvoiceInfo
): { subject: string; body: string } {
  const footer = [
    ``,
    `Freundliche Grüsse`,
    config.company.name,
    `${config.company.email} · ${config.company.phone}`,
  ].join("\n");

  if (level === 1) {
    return {
      subject: `Zahlungserinnerung: Rechnung ${inv.number}`,
      body: [
        `Guten Tag ${inv.customerName}`,
        ``,
        `Sicher ist es Ihrer Aufmerksamkeit entgangen: Die folgende Rechnung ist noch offen. Wir erlauben uns, Sie freundlich daran zu erinnern.`,
        ``,
        paymentBlock(inv),
        ``,
        `Falls sich Ihre Zahlung mit dieser Erinnerung gekreuzt hat, betrachten Sie dieses Schreiben bitte als gegenstandslos. Herzlichen Dank!`,
        footer,
      ].join("\n"),
    };
  }

  if (level === 2) {
    return {
      subject: `Zweite Mahnung: Rechnung ${inv.number}`,
      body: [
        `Guten Tag ${inv.customerName}`,
        ``,
        `Trotz unserer Zahlungserinnerung ist die folgende Rechnung weiterhin offen. Wir bitten Sie, den Betrag innert 10 Tagen zu begleichen.`,
        ``,
        paymentBlock(inv),
        ``,
        `Sollte die Zahlung bereits erfolgt sein, danken wir Ihnen und bitten Sie, dieses Schreiben zu ignorieren.`,
        footer,
      ].join("\n"),
    };
  }

  return {
    subject: `Letzte Mahnung: Rechnung ${inv.number}`,
    body: [
      `Guten Tag ${inv.customerName}`,
      ``,
      `Die folgende Rechnung ist trotz zweifacher Mahnung noch immer offen. Wir fordern Sie letztmals auf, den ausstehenden Betrag innert 10 Tagen zu überweisen.`,
      ``,
      paymentBlock(inv),
      ``,
      `Sollte die Zahlung nicht fristgerecht eingehen, sehen wir uns leider gezwungen, weitere Schritte einzuleiten (Übergabe an das Inkasso bzw. Einleitung der Betreibung). Damit verbundene Kosten gehen zu Ihren Lasten.`,
      ``,
      `Bei Fragen oder Unklarheiten kontaktieren Sie uns bitte umgehend — gemeinsam finden wir eine Lösung.`,
      footer,
    ].join("\n"),
  };
}

/**
 * Prueft alle offenen, ueberfaelligen Rechnungen und verschickt die jeweils
 * naechste Mahnstufe (1-3) gemaess config.billing.dunningLevelDays.
 */
export async function runDunning(): Promise<DunningRunResult> {
  const now = new Date();
  const maxLevel = config.billing.dunningLevelDays.length;

  const invoices = await prisma.invoice.findMany({
    where: { status: "OPEN", dueDate: { lt: now } },
    include: { dunnings: true, contract: { include: { pensum: true } } },
    orderBy: { dueDate: "asc" },
  });

  const dunningsSent: DunningRunResult["dunningsSent"] = [];

  for (const invoice of invoices) {
    const nextLevel = invoice.dunnings.reduce((max, d) => Math.max(max, d.level), 0) + 1;
    if (nextLevel > maxLevel) continue;

    const threshold = config.billing.dunningLevelDays[nextLevel - 1];
    const overdueDays = Math.floor((now.getTime() - invoice.dueDate.getTime()) / 86400000);
    if (overdueDays < threshold) continue;

    await prisma.dunning.create({ data: { invoiceId: invoice.id, level: nextLevel } });

    const info: DunningInvoiceInfo = {
      number: invoice.number,
      amount: invoice.amount,
      reference: invoice.reference,
      dueDate: invoice.dueDate,
      customerName: invoice.contract.pensum.customerName,
    };
    const { subject, body } = dunningTemplate(nextLevel, info);
    const to = invoice.contract.pensum.customerEmail;
    await sendMail({ to, subject, body, kind: `dunning-${nextLevel}` });

    dunningsSent.push({ invoiceNumber: invoice.number, level: nextLevel, to });
  }

  return { checkedInvoices: invoices.length, dunningsSent };
}
