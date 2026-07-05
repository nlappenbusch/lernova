// Automatisiertes Mahnwesen (mehrstufig).
// STUB — wird von der Billing-Engine implementiert (Signaturen sind fixer Kontrakt).

export type DunningRunResult = {
  checkedInvoices: number;
  dunningsSent: Array<{ invoiceNumber: string; level: number; to: string }>;
};

/**
 * Prueft alle offenen, ueberfaelligen Rechnungen und verschickt die jeweils
 * naechste Mahnstufe (1-3) gemaess config.billing.dunningLevelDays.
 */
export async function runDunning(): Promise<DunningRunResult> {
  throw new Error("runDunning: noch nicht implementiert");
}
