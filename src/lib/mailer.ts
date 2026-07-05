// Mail-Versand: SMTP wenn konfiguriert, sonst nur EmailLog (Dev).
// STUB — wird von der Billing-Engine implementiert (Signaturen sind fixer Kontrakt).

export type MailOptions = {
  to: string;
  subject: string;
  body: string; // Plaintext
  kind: string; // invoice | dunning-1 | dunning-2 | dunning-3 | lead-confirm | ...
};

/** Versendet (oder loggt) eine Mail. Schreibt immer einen EmailLog-Eintrag. */
export async function sendMail(_opts: MailOptions): Promise<boolean> {
  throw new Error("sendMail: noch nicht implementiert");
}
