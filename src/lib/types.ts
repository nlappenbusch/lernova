// Zentrale Werte-Kontrakte fuer String-Status-Felder (SQLite kennt keine Enums).

export const ROLES = ["ADMIN", "TUTOR"] as const;
export type Role = (typeof ROLES)[number];

export const PENSUM_STATUS = ["OPEN", "MATCHED", "CLOSED", "CANCELLED"] as const;
export type PensumStatus = (typeof PENSUM_STATUS)[number];

export const APPLICATION_STATUS = ["PENDING", "ACCEPTED", "REJECTED", "WITHDRAWN"] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUS)[number];

export const CONTRACT_STATUS = ["ACTIVE", "ENDED"] as const;
export type ContractStatus = (typeof CONTRACT_STATUS)[number];

export const INVOICE_STATUS = ["OPEN", "PAID", "CANCELLED"] as const;
export type InvoiceStatus = (typeof INVOICE_STATUS)[number];

export const PAYOUT_STATUS = ["PENDING", "PAID"] as const;
export type PayoutStatus = (typeof PAYOUT_STATUS)[number];

export type SessionPayload = {
  uid: string;
  role: Role;
  exp: number; // unix seconds
};
