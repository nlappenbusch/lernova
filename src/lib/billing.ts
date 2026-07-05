// Billing-Engine: Monatsabschluss -> Rechnungen (Swiss QR) + Tutoren-Payouts.
// STUB — wird von der Billing-Engine implementiert (Signaturen sind fixer Kontrakt).

export type CloseMonthResult = {
  year: number;
  month: number;
  invoicesCreated: number;
  payoutsCreated: number;
  invoiceTotal: number; // Rappen
  payoutTotal: number; // Rappen
};

/**
 * Schliesst einen Monat ab: sperrt TimeEntries, erzeugt pro Vertrag mit
 * Stunden im Monat eine Rechnung (inkl. QR-Referenz) und pro Tutor einen
 * Payout. Wirft Error bei bereits geschlossenem oder laufendem Monat.
 */
export async function closeMonth(
  _year: number,
  _month: number,
  _adminId: string
): Promise<CloseMonthResult> {
  throw new Error("closeMonth: noch nicht implementiert");
}

/** Rendert die Rechnung als PDF mit Swiss-QR-Zahlteil. */
export async function generateInvoicePdf(_invoiceId: string): Promise<Buffer> {
  throw new Error("generateInvoicePdf: noch nicht implementiert");
}
