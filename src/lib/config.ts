// Zentrale Konfiguration — ENV mit sinnvollen Dev-Defaults.

function env(name: string, fallback: string): string {
  const v = process.env[name];
  return v && v.trim() !== "" ? v.trim() : fallback;
}

export const config = {
  brandName: "Lernova",
  claim: "Die moderne Nachhilfe-Engine der Schweiz",
  baseUrl: env("BASE_URL", "http://localhost:3210"),

  company: {
    name: env("COMPANY_NAME", "Lernova GmbH"),
    street: env("COMPANY_STREET", "Technoparkstrasse 1"),
    zip: env("COMPANY_ZIP", "8005"),
    city: env("COMPANY_CITY", "Zürich"),
    qrIban: env("COMPANY_QR_IBAN", "CH4431999123000889012").replace(/\s+/g, ""),
    email: env("COMPANY_EMAIL", "hallo@lernova.ch"),
    phone: env("COMPANY_PHONE", "+41 44 000 00 00"),
  },

  billing: {
    dueDays: parseInt(env("INVOICE_DUE_DAYS", "30"), 10),
    // Tage NACH Faelligkeit fuer Mahnstufe 1, 2, 3
    dunningLevelDays: env("DUNNING_LEVEL_DAYS", "7,14,21")
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => Number.isFinite(n)),
    // Default-Stundensaetze in Rappen (pro 60 Min)
    defaultRateCustomer: 7500,
    defaultRateTutor: 4500,
  },

  smtp: {
    host: env("SMTP_HOST", ""),
    port: parseInt(env("SMTP_PORT", "587"), 10),
    user: env("SMTP_USER", ""),
    pass: env("SMTP_PASS", ""),
    from: env("SMTP_FROM", "Lernova <no-reply@lernova.ch>"),
  },

  sessionSecret: env("SESSION_SECRET", "lernova-dev-secret-bitte-in-prod-aendern"),
  cronSecret: env("CRON_SECRET", "lernova-cron-dev"),
};
