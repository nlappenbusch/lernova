// Billing-Engine: Monatsabschluss -> Rechnungen (Swiss QR) + Tutoren-Payouts.
// Geld-Regeln: alle Betraege in Rappen; Position = Math.round(minutes*rate/60);
// Rechnungs-/Payout-Total = roundTo5Rappen(Summe).

import { prisma } from "./db";
import { config } from "./config";
import { chf, formatDate, monthLabel, monthRange } from "./format";
import { formatIban, formatQrReference, qrReference, roundTo5Rappen } from "./swiss";
import { isMonthClosed } from "./months";
import { getSubject } from "./subjects";
import { sendMail } from "./mailer";
import { renderInvoicePdf, type InvoicePdfInput } from "./qrbill";

export type CloseMonthResult = {
  year: number;
  month: number;
  invoicesCreated: number;
  payoutsCreated: number;
  invoiceTotal: number; // Rappen
  payoutTotal: number; // Rappen
};

type CreatedInvoiceInfo = {
  number: string;
  amount: number;
  reference: string;
  dueDate: Date;
  to: string;
  customerName: string;
};

/**
 * Schliesst einen Monat ab: sperrt TimeEntries, erzeugt pro Vertrag mit
 * Stunden im Monat eine Rechnung (inkl. QR-Referenz) und pro Tutor einen
 * Payout. Wirft Error bei bereits geschlossenem oder laufendem Monat.
 */
export async function closeMonth(
  year: number,
  month: number,
  adminId: string
): Promise<CloseMonthResult> {
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error("Ungültiger Monat.");
  }

  const now = new Date();
  const currentIndex = now.getFullYear() * 12 + (now.getMonth() + 1);
  if (year * 12 + month >= currentIndex) {
    throw new Error(
      `${monthLabel(year, month)} kann noch nicht abgeschlossen werden — es lassen sich nur vollständig vergangene Monate abschliessen.`
    );
  }
  if (await isMonthClosed(year, month)) {
    throw new Error(`${monthLabel(year, month)} ist bereits abgeschlossen.`);
  }

  // TimeEntries des Monats ohne bestehende Rechnungsposition
  const { start, end } = monthRange(year, month);
  const entries = await prisma.timeEntry.findMany({
    where: { date: { gte: start, lt: end }, invoiceItem: null },
    include: { contract: { include: { pensum: true, tutor: true } } },
    orderBy: { date: "asc" },
  });

  const byContract = new Map<string, typeof entries>();
  for (const entry of entries) {
    const group = byContract.get(entry.contractId) ?? [];
    group.push(entry);
    byContract.set(entry.contractId, group);
  }

  const txResult = await prisma.$transaction(async (tx) => {
    await tx.monthClose.create({ data: { year, month, closedById: adminId } });

    // Fortlaufende Nummer pro Jahr: bestehende Rechnungen + laufender Index
    let seq = await tx.invoice.count({ where: { year } });

    const created: CreatedInvoiceInfo[] = [];
    let invoiceTotal = 0;

    const issueDate = new Date();
    const dueDate = new Date(issueDate.getTime() + config.billing.dueDays * 86400000);

    for (const group of byContract.values()) {
      seq += 1;
      const contract = group[0].contract;
      const number = `${year}-${String(seq).padStart(4, "0")}`;
      const reference = qrReference(
        `${year}${String(month).padStart(2, "0")}${String(seq).padStart(6, "0")}`
      );
      const subjectName = getSubject(contract.pensum.subject)?.name ?? contract.pensum.subject;

      const items = group.map((entry) => ({
        timeEntryId: entry.id,
        date: entry.date,
        description: `Nachhilfe ${subjectName} — ${formatDate(entry.date)}`,
        minutes: entry.minutes,
        rate: contract.rateCustomer,
        amount: Math.round((entry.minutes * contract.rateCustomer) / 60),
      }));
      const amount = roundTo5Rappen(items.reduce((sum, item) => sum + item.amount, 0));

      await tx.invoice.create({
        data: {
          number,
          contractId: contract.id,
          year,
          month,
          amount,
          reference,
          issueDate,
          dueDate,
          status: "OPEN",
          items: { create: items },
        },
      });

      invoiceTotal += amount;
      created.push({
        number,
        amount,
        reference,
        dueDate,
        to: contract.pensum.customerEmail,
        customerName: contract.pensum.customerName,
      });
    }

    // Payout pro Tutor (Summe aller Eintraege des Monats)
    const byTutor = new Map<string, { minutes: number; amount: number }>();
    for (const entry of entries) {
      const agg = byTutor.get(entry.contract.tutorId) ?? { minutes: 0, amount: 0 };
      agg.minutes += entry.minutes;
      agg.amount += Math.round((entry.minutes * entry.contract.rateTutor) / 60);
      byTutor.set(entry.contract.tutorId, agg);
    }

    let payoutTotal = 0;
    for (const [tutorId, agg] of byTutor) {
      const amount = roundTo5Rappen(agg.amount);
      await tx.payout.upsert({
        where: { tutorId_year_month: { tutorId, year, month } },
        create: { tutorId, year, month, minutes: agg.minutes, amount, status: "PENDING" },
        update: { minutes: agg.minutes, amount, status: "PENDING" },
      });
      payoutTotal += amount;
    }

    return { created, invoiceTotal, payoutsCreated: byTutor.size, payoutTotal };
  });

  // Kunden-Mails ausserhalb der Transaktion (Mail-Fehler blockieren den Abschluss nicht)
  for (const inv of txResult.created) {
    try {
      await sendMail({
        to: inv.to,
        subject: `Ihre Rechnung ${inv.number} — ${config.brandName}`,
        body: [
          `Guten Tag ${inv.customerName}`,
          ``,
          `Vielen Dank für Ihr Vertrauen in ${config.brandName}. Für den Leistungsmonat ${monthLabel(year, month)} stellen wir Ihnen folgende Rechnung:`,
          ``,
          `Rechnungsnummer: ${inv.number}`,
          `Betrag: ${chf(inv.amount)}`,
          `QR-Referenz: ${formatQrReference(inv.reference)}`,
          `Konto (QR-IBAN): ${formatIban(config.company.qrIban)}`,
          `Zahlungsfrist: ${formatDate(inv.dueDate)}`,
          ``,
          `Die Rechnung ist bequem per QR-Rechnung zahlbar. Bei Fragen erreichen Sie uns unter ${config.company.email} oder ${config.company.phone}.`,
          ``,
          `Freundliche Grüsse`,
          config.company.name,
        ].join("\n"),
        kind: "invoice",
      });
    } catch {
      // sendMail wirft nie — doppelte Absicherung
    }
  }

  return {
    year,
    month,
    invoicesCreated: txResult.created.length,
    payoutsCreated: txResult.payoutsCreated,
    invoiceTotal: txResult.invoiceTotal,
    payoutTotal: txResult.payoutTotal,
  };
}

/** Rendert die Rechnung als PDF mit Swiss-QR-Zahlteil. */
export async function generateInvoicePdf(invoiceId: string): Promise<Buffer> {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      items: { orderBy: { date: "asc" } },
      contract: { include: { pensum: true } },
    },
  });
  if (!invoice) {
    throw new Error("Rechnung nicht gefunden.");
  }

  const input: InvoicePdfInput = {
    number: invoice.number,
    year: invoice.year,
    month: invoice.month,
    amount: invoice.amount,
    reference: invoice.reference,
    issueDate: invoice.issueDate,
    dueDate: invoice.dueDate,
    customerName: invoice.contract.pensum.customerName,
    street: invoice.contract.pensum.street,
    plz: invoice.contract.pensum.plz,
    city: invoice.contract.pensum.city,
    items: invoice.items.map((item) => ({
      date: item.date,
      description: item.description,
      minutes: item.minutes,
      rate: item.rate,
      amount: item.amount,
    })),
  };

  return renderInvoicePdf(input);
}
