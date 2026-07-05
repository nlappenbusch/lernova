// Gemeinsame Validierung fuer Time-Entry-Routen (Tutor-Portal).

/** Parst "YYYY-MM-DD" als lokales Datum (Mitternacht). null bei ungueltigem Datum. */
export function parseDateOnly(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(y, m - 1, d, 0, 0, 0, 0);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
    return null;
  }
  return date;
}

/**
 * Fachliche Datums-Regeln: nicht in der Zukunft, nicht mehr als 30 Tage vor
 * Vertragsbeginn. Gibt eine deutsche Fehlermeldung oder null zurueck.
 */
export function dateWindowError(date: Date, contractStart: Date): string | null {
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  if (date.getTime() > endOfToday.getTime()) {
    return "Das Datum darf nicht in der Zukunft liegen.";
  }
  const min = new Date(contractStart);
  min.setDate(min.getDate() - 30);
  min.setHours(0, 0, 0, 0);
  if (date.getTime() < min.getTime()) {
    return "Das Datum liegt zu weit vor Vertragsbeginn (max. 30 Tage davor).";
  }
  return null;
}

export const MONTH_LOCKED_ERROR =
  "Dieser Monat ist bereits abgeschlossen — Einträge sind gesperrt.";
