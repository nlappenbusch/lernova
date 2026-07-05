// Mail-Versand: SMTP wenn konfiguriert (nodemailer, lazy import), sonst nur
// EmailLog (Dev). Schreibt IMMER einen EmailLog-Eintrag und wirft NIE.

import { prisma } from "./db";
import { config } from "./config";

export type MailOptions = {
  to: string;
  subject: string;
  body: string; // Plaintext
  kind: string; // invoice | dunning-1 | dunning-2 | dunning-3 | lead-confirm | ...
};

/** Versendet (oder loggt) eine Mail. Schreibt immer einen EmailLog-Eintrag. */
export async function sendMail(opts: MailOptions): Promise<boolean> {
  let ok = true;
  let error: string | null = null;

  if (config.smtp.host) {
    try {
      const nodemailer = (await import("nodemailer")).default;
      const transporter = nodemailer.createTransport({
        host: config.smtp.host,
        port: config.smtp.port,
        secure: config.smtp.port === 465,
        auth: config.smtp.user
          ? { user: config.smtp.user, pass: config.smtp.pass }
          : undefined,
      });
      await transporter.sendMail({
        from: config.smtp.from,
        to: opts.to,
        subject: opts.subject,
        text: opts.body,
      });
    } catch (e) {
      ok = false;
      error = e instanceof Error ? e.message : String(e);
    }
  }

  try {
    await prisma.emailLog.create({
      data: {
        to: opts.to,
        subject: opts.subject,
        body: opts.body,
        kind: opts.kind,
        ok,
        error,
      },
    });
  } catch {
    // Selbst der Log-Eintrag darf den Aufrufer nie crashen.
    return false;
  }

  return ok;
}
