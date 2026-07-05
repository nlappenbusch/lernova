// Server-seitige Helfer für das Admin-Portal (kein "use client").

import { currentMonth } from "@/lib/format";

/** subjects-JSON eines Users sicher in ein String-Array parsen. */
export function parseSubjectSlugs(json: string): string[] {
  try {
    const v: unknown = JSON.parse(json);
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

/** Erstes String-Element eines searchParams-Werts. */
export function spString(v: string | string[] | undefined): string | undefined {
  return typeof v === "string" ? v : Array.isArray(v) ? v[0] : undefined;
}

/** ?year=&month= parsen, Fallback: aktueller Monat. */
export function parseMonthParams(sp: Record<string, string | string[] | undefined>): {
  year: number;
  month: number;
} {
  const now = currentMonth();
  const y = parseInt(spString(sp.year) ?? "", 10);
  const m = parseInt(spString(sp.month) ?? "", 10);
  return {
    year: Number.isFinite(y) && y >= 2000 && y <= 2100 ? y : now.year,
    month: Number.isFinite(m) && m >= 1 && m <= 12 ? m : now.month,
  };
}

/** Positionsbetrag in Rappen: minutes * rate / 60, kaufmännisch gerundet. */
export function entryAmount(minutes: number, ratePerHour: number): number {
  return Math.round((minutes * ratePerHour) / 60);
}

/** Datum + Uhrzeit (de-CH), z. B. für das E-Mail-Log. */
export function formatDateTime(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleString("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
