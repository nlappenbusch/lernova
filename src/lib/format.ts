// Formatierungs-Helfer (de-CH).

const chfFormatter = new Intl.NumberFormat("de-CH", {
  style: "currency",
  currency: "CHF",
});

/** Rappen -> "CHF 75.00" */
export function chf(rappen: number): string {
  return chfFormatter.format(rappen / 100);
}

/** Rappen -> "75.00" (ohne Waehrungszeichen) */
export function chfPlain(rappen: number): string {
  return (rappen / 100).toFixed(2);
}

export function formatDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("de-CH", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function formatDateLong(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("de-CH", { day: "numeric", month: "long", year: "numeric" });
}

export const MONTH_NAMES = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
] as const;

export function monthLabel(year: number, month: number): string {
  return `${MONTH_NAMES[month - 1]} ${year}`;
}

/** Minuten -> "1.5 h" bzw. "45 min" */
export function minutesLabel(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = minutes / 60;
  return `${Number.isInteger(h) ? h : h.toFixed(2).replace(/0+$/, "").replace(/\.$/, "")} h`;
}

/** Aktueller Monat als {year, month} (month 1-12). */
export function currentMonth(): { year: number; month: number } {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

/** Vormonat zu {year, month}. */
export function previousMonth(year: number, month: number): { year: number; month: number } {
  return month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 };
}

/** Erster/letzter Zeitpunkt eines Monats (lokal). */
export function monthRange(year: number, month: number): { start: Date; end: Date } {
  const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const end = new Date(year, month, 1, 0, 0, 0, 0);
  return { start, end };
}
