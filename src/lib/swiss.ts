// Schweizer Zahlungs-Utilities: QR-Referenz (QRR, Modulo-10 rekursiv), Betraege.

const MOD10_TABLE = [0, 9, 4, 6, 8, 2, 7, 1, 3, 5];

/** Modulo-10 rekursiv Pruefziffer (Standard fuer QR-/ESR-Referenzen). */
export function mod10CheckDigit(digits: string): number {
  let carry = 0;
  for (const ch of digits) {
    carry = MOD10_TABLE[(carry + (ch.charCodeAt(0) - 48)) % 10];
  }
  return (10 - carry) % 10;
}

/**
 * Erzeugt eine gueltige 27-stellige QR-Referenz (QRR) aus einer beliebigen
 * numerischen Basis (z.B. Rechnungsnummer). Links mit Nullen aufgefuellt.
 */
export function qrReference(base: string | number): string {
  const digits = String(base).replace(/\D/g, "").padStart(26, "0").slice(-26);
  return digits + String(mod10CheckDigit(digits));
}

/** Validiert eine 27-stellige QR-Referenz. */
export function isValidQrReference(ref: string): boolean {
  const clean = ref.replace(/\s+/g, "");
  if (!/^\d{27}$/.test(clean)) return false;
  return mod10CheckDigit(clean.slice(0, 26)) === Number(clean[26]);
}

/** Formatiert eine QR-Referenz in 5er-Bloecke (Darstellung auf Rechnung). */
export function formatQrReference(ref: string): string {
  const clean = ref.replace(/\s+/g, "");
  // Format: XX XXXXX XXXXX XXXXX XXXXX XXXXX
  return clean.replace(/^(\d{2})(\d{5})(\d{5})(\d{5})(\d{5})(\d{5})$/, "$1 $2 $3 $4 $5 $6");
}

/** Formatiert eine IBAN in 4er-Bloecke. */
export function formatIban(iban: string): string {
  return iban
    .replace(/\s+/g, "")
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

/** Rappen -> CHF-Dezimalwert (fuer swissqrbill: amount in Franken). */
export function rappenToFrancs(rappen: number): number {
  return Math.round(rappen) / 100;
}

/** Rundet Rappen kaufmaennisch auf 5 Rappen (Schweizer Rundung). */
export function roundTo5Rappen(rappen: number): number {
  return Math.round(rappen / 5) * 5;
}
