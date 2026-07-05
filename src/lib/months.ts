// Monatsabschluss-Status (gemeinsam genutzt von Tutor-Portal, Admin & Billing).

import { prisma } from "./db";

/** true, wenn der Monat administrativ geschlossen ist (TimeEntries gesperrt). */
export async function isMonthClosed(year: number, month: number): Promise<boolean> {
  const row = await prisma.monthClose.findUnique({
    where: { year_month: { year, month } },
    select: { id: true },
  });
  return row !== null;
}

export async function listClosedMonths(): Promise<
  Array<{ year: number; month: number; closedAt: Date }>
> {
  return prisma.monthClose.findMany({
    select: { year: true, month: true, closedAt: true },
    orderBy: [{ year: "desc" }, { month: "desc" }],
  });
}

/** Prueft, ob ein Datum in einem geschlossenen Monat liegt. */
export async function isDateLocked(date: Date): Promise<boolean> {
  return isMonthClosed(date.getFullYear(), date.getMonth() + 1);
}
