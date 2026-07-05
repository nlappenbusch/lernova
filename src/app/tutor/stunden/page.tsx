// Stunden — Time-Tracking mit Monats-Navigation und Monats-Sperre.

import { requirePageUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isMonthClosed } from "@/lib/months";
import { currentMonth, monthRange } from "@/lib/format";
import { getSubject } from "@/lib/subjects";
import { PageHeader } from "@/components/ui";
import { TimeTracking } from "@/components/tutor/TimeTracking";

export const metadata = { title: "Stunden" };

function toIsoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export default async function StundenPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string | string[]; month?: string | string[] }>;
}) {
  const user = await requirePageUser("TUTOR");
  const sp = await searchParams;
  const now = currentMonth();

  const yearRaw = Array.isArray(sp.year) ? sp.year[0] : sp.year;
  const monthRaw = Array.isArray(sp.month) ? sp.month[0] : sp.month;
  let year = parseInt(yearRaw ?? "", 10);
  let month = parseInt(monthRaw ?? "", 10);
  if (
    !Number.isFinite(year) ||
    !Number.isFinite(month) ||
    month < 1 ||
    month > 12 ||
    year < 2020 ||
    year > 2100
  ) {
    year = now.year;
    month = now.month;
  }
  // Nicht in die Zukunft navigieren.
  if (year > now.year || (year === now.year && month > now.month)) {
    year = now.year;
    month = now.month;
  }

  const { start, end } = monthRange(year, month);
  const [closed, contracts, entries] = await Promise.all([
    isMonthClosed(year, month),
    prisma.contract.findMany({
      where: { tutorId: user.id, status: "ACTIVE" },
      include: { pensum: { select: { subject: true, customerName: true, city: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.timeEntry.findMany({
      where: { tutorId: user.id, date: { gte: start, lt: end } },
      include: {
        contract: {
          select: {
            rateTutor: true,
            pensum: { select: { subject: true, customerName: true } },
          },
        },
      },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    }),
  ]);

  const isCurrent = year === now.year && month === now.month;
  const lastDayOfMonth = new Date(year, month, 0);
  const defaultDate = isCurrent ? toIsoDate(new Date()) : toIsoDate(lastDayOfMonth);

  return (
    <div>
      <PageHeader
        title="Stunden"
        subtitle="Erfasse deine Lektionen — bis zum Monatsabschluss jederzeit editierbar."
      />
      <TimeTracking
        year={year}
        month={month}
        closed={closed}
        canNext={!isCurrent}
        todayIso={toIsoDate(new Date())}
        defaultDate={defaultDate}
        contracts={contracts.map((c) => ({
          id: c.id,
          label: `${getSubject(c.pensum.subject)?.name ?? c.pensum.subject} — ${c.pensum.customerName} (${c.pensum.city})`,
          rateTutor: c.rateTutor,
        }))}
        entries={entries.map((e) => ({
          id: e.id,
          contractId: e.contractId,
          contractLabel: `${getSubject(e.contract.pensum.subject)?.name ?? e.contract.pensum.subject} — ${e.contract.pensum.customerName}`,
          date: toIsoDate(e.date),
          minutes: e.minutes,
          notes: e.notes,
          rateTutor: e.contract.rateTutor,
        }))}
      />
    </div>
  );
}
