// Swiss-QR-Rechnungs-PDF: Brand-Layout Seite 1 + QR-Zahlteil (swissqrbill v4).
// Wird ausschliesslich von der Billing-Engine (./billing) verwendet.
// Fonts: nur pdfkit-Standardfonts (Helvetica / Helvetica-Bold).

import PDFDocument from "pdfkit";
import { SwissQRBill } from "swissqrbill/pdf";
import type { Data } from "swissqrbill/types";
import { config } from "./config";
import { chfPlain, formatDate, minutesLabel, monthLabel } from "./format";
import { formatQrReference, rappenToFrancs } from "./swiss";

const ACCENT = "#6d7cff";
const INK = "#1c1f2b";
const MUTE = "#5b6172";
const EDGE = "#d8dbe4";

export type InvoicePdfItem = {
  date: Date;
  description: string;
  minutes: number;
  rate: number; // Rappen pro 60 Min
  amount: number; // Rappen
};

export type InvoicePdfInput = {
  number: string;
  year: number;
  month: number;
  amount: number; // Rappen (auf 5 Rp. gerundetes Total)
  reference: string; // QRR, 27-stellig
  issueDate: Date;
  dueDate: Date;
  customerName: string;
  street: string | null;
  plz: string;
  city: string;
  items: InvoicePdfItem[];
};

/** "Technoparkstrasse 1" -> { address: "Technoparkstrasse", buildingNumber: "1" } */
function splitStreet(street: string): { address: string; buildingNumber?: string } {
  const m = street.trim().match(/^(.+?)[\s,]+(\d[\w./-]*)$/);
  if (!m) return { address: street.trim() };
  return { address: m[1].trim(), buildingNumber: m[2] };
}

/** Baut die swissqrbill-Daten (amount in FRANKEN, Referenz QRR — QR-IBAN). */
export function buildQrBillData(inv: InvoicePdfInput): Data {
  const creditorStreet = splitStreet(config.company.street);
  const data: Data = {
    amount: rappenToFrancs(inv.amount),
    currency: "CHF",
    reference: inv.reference,
    message: `Rechnung ${inv.number} — ${monthLabel(inv.year, inv.month)}`,
    creditor: {
      account: config.company.qrIban,
      name: config.company.name,
      address: creditorStreet.address,
      buildingNumber: creditorStreet.buildingNumber,
      zip: config.company.zip,
      city: config.company.city,
      country: "CH",
    },
  };
  if (inv.street && inv.street.trim() !== "") {
    const debtorStreet = splitStreet(inv.street);
    data.debtor = {
      name: inv.customerName,
      address: debtorStreet.address,
      buildingNumber: debtorStreet.buildingNumber,
      zip: inv.plz,
      city: inv.city,
      country: "CH",
    };
  }
  return data;
}

const LEFT = 50;
const RIGHT = 545; // A4 (595.28 pt) minus Rand

// Positionstabelle: Datum | Beschreibung | Dauer | Ansatz | Betrag
const COL = {
  date: { x: LEFT, w: 68, align: "left" as const },
  desc: { x: 124, w: 206, align: "left" as const },
  minutes: { x: 336, w: 56, align: "right" as const },
  rate: { x: 398, w: 62, align: "right" as const },
  amount: { x: 466, w: RIGHT - 466, align: "right" as const },
};

function tableRule(doc: PDFKit.PDFDocument, y: number, color = EDGE): void {
  doc.moveTo(LEFT, y).lineTo(RIGHT, y).lineWidth(0.7).strokeColor(color).stroke();
}

/** Rendert die Rechnung als PDF-Buffer (Seite 1 Layout + QR-Zahlteil). */
export async function renderInvoicePdf(inv: InvoicePdfInput): Promise<Buffer> {
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 50, bottom: 50, left: LEFT, right: 50 },
    info: { Title: `Rechnung ${inv.number}`, Author: config.company.name },
  });

  const chunks: Buffer[] = [];
  const done = new Promise<Buffer>((resolve, reject) => {
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });

  // --- Brand-Kopf ---
  doc.font("Helvetica-Bold").fontSize(26).fillColor(ACCENT).text(config.brandName, LEFT, 50);
  doc.font("Helvetica").fontSize(9).fillColor(MUTE).text(config.claim, LEFT, 82);
  tableRule(doc, 104, ACCENT);
  const sender = [
    config.company.name,
    config.company.street,
    `${config.company.zip} ${config.company.city}`,
    config.company.email,
    config.company.phone,
  ].join("  ·  ");
  doc.font("Helvetica").fontSize(7.5).fillColor(MUTE).text(sender, LEFT, 110);

  // --- Empfaengerblock (links) ---
  let y = 152;
  doc.font("Helvetica-Bold").fontSize(10.5).fillColor(INK).text(inv.customerName, LEFT, y);
  y += 15;
  if (inv.street && inv.street.trim() !== "") {
    doc.font("Helvetica").fontSize(10).fillColor(INK).text(inv.street, LEFT, y);
    y += 14;
  }
  doc.font("Helvetica").fontSize(10).fillColor(INK).text(`${inv.plz} ${inv.city}`, LEFT, y);

  // --- Meta (rechts) ---
  const metaRows: Array<[string, string]> = [
    ["Rechnungsnummer", inv.number],
    ["Rechnungsdatum", formatDate(inv.issueDate)],
    ["Zahlbar bis", formatDate(inv.dueDate)],
    ["Leistungsmonat", monthLabel(inv.year, inv.month)],
  ];
  let metaY = 152;
  for (const [label, value] of metaRows) {
    doc.font("Helvetica").fontSize(9).fillColor(MUTE).text(label, 330, metaY, { width: 105 });
    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .fillColor(INK)
      .text(value, 435, metaY, { width: RIGHT - 435, align: "right" });
    metaY += 15;
  }

  // --- Titel ---
  doc.font("Helvetica-Bold").fontSize(16).fillColor(INK).text(`Rechnung ${inv.number}`, LEFT, 246);

  // --- Positionstabelle ---
  y = 280;
  doc.font("Helvetica-Bold").fontSize(8).fillColor(MUTE);
  doc.text("DATUM", COL.date.x, y, { width: COL.date.w, align: COL.date.align });
  doc.text("BESCHREIBUNG", COL.desc.x, y, { width: COL.desc.w, align: COL.desc.align });
  doc.text("DAUER", COL.minutes.x, y, { width: COL.minutes.w, align: COL.minutes.align });
  doc.text("ANSATZ", COL.rate.x, y, { width: COL.rate.w, align: COL.rate.align });
  doc.text("BETRAG", COL.amount.x, y, { width: COL.amount.w, align: COL.amount.align });
  y += 13;
  tableRule(doc, y);
  y += 8;

  doc.font("Helvetica").fontSize(9).fillColor(INK);
  for (const item of inv.items) {
    if (y > 700) {
      doc.addPage();
      y = 60;
    }
    doc.fillColor(MUTE).text(formatDate(item.date), COL.date.x, y, { width: COL.date.w });
    doc.fillColor(INK).text(item.description, COL.desc.x, y, {
      width: COL.desc.w,
      ellipsis: true,
      height: 12,
    });
    doc.fillColor(INK).text(minutesLabel(item.minutes), COL.minutes.x, y, {
      width: COL.minutes.w,
      align: "right",
    });
    doc.fillColor(MUTE).text(chfPlain(item.rate), COL.rate.x, y, {
      width: COL.rate.w,
      align: "right",
    });
    doc.fillColor(INK).text(chfPlain(item.amount), COL.amount.x, y, {
      width: COL.amount.w,
      align: "right",
    });
    y += 18;
  }

  tableRule(doc, y);
  y += 10;

  // --- Summen ---
  const subtotal = inv.items.reduce((sum, item) => sum + item.amount, 0);
  const roundingDiff = inv.amount - subtotal;

  const sumRow = (label: string, value: string, bold = false) => {
    if (y > 700) {
      doc.addPage();
      y = 60;
    }
    doc
      .font(bold ? "Helvetica-Bold" : "Helvetica")
      .fontSize(bold ? 11 : 9)
      .fillColor(bold ? INK : MUTE)
      .text(label, COL.desc.x, y, { width: COL.rate.x + COL.rate.w - COL.desc.x, align: "right" });
    doc
      .font(bold ? "Helvetica-Bold" : "Helvetica")
      .fontSize(bold ? 11 : 9)
      .fillColor(INK)
      .text(value, COL.amount.x, y, { width: COL.amount.w, align: "right" });
    y += bold ? 20 : 15;
  };

  sumRow("Zwischensumme", chfPlain(subtotal));
  if (roundingDiff !== 0) {
    sumRow("Rundung (5 Rp.)", `${roundingDiff > 0 ? "+" : ""}${chfPlain(roundingDiff)}`);
  }
  tableRule(doc, y);
  y += 8;
  sumRow("Total", `CHF ${chfPlain(inv.amount)}`, true);

  // --- Dankes-/Hinweiszeile ---
  y += 14;
  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor(MUTE)
    .text(
      `Herzlichen Dank für Ihr Vertrauen. Zahlbar per QR-Rechnung bis ${formatDate(inv.dueDate)}.`,
      LEFT,
      y,
      { width: RIGHT - LEFT }
    );
  y += 14;
  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor(MUTE)
    .text(`QR-Referenz: ${formatQrReference(inv.reference)}`, LEFT, y, { width: RIGHT - LEFT });

  // --- QR-Zahlteil (eigene Seite, falls kein Platz) ---
  const qrBill = new SwissQRBill(buildQrBillData(inv), { language: "DE" });
  qrBill.attachTo(doc);

  doc.end();
  return done;
}
