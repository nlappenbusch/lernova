// Stunden-Übersicht: alle Zeiteinträge eines Monats, gruppiert nach Tutor:in,
// mit Subtotalen (Minuten + Honorar), Gesamtsumme und Lock-Banner.

import Link from "next/link";
import { Lock } from "lucide-react";
import { prisma } from "@/lib/db";
import { chf, formatDate, minutesLabel, monthLabel, monthRange } from "@/lib/format";
import { isMonthClosed } from "@/lib/months";
import { getSubject } from "@/lib/subjects";
import {
  Card,
  CardHeader,
  EmptyState,
  PageHeader,
  StatCard,
  Table,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "@/components/ui";
import { Markdown } from "@/components/Markdown";
import { MonthPicker } from "@/components/admin/MonthPicker";
import { entryAmount, parseMonthParams } from "@/components/admin/utils";

export default async function StundenPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const { year, month } = parseMonthParams(sp);
  const { start, end } = monthRange(year, month);

  const [entries, closed] = await Promise.all([
    prisma.timeEntry.findMany({
      where: { date: { gte: start, lt: end } },
      include: {
        tutor: { select: { id: true, name: true } },
        contract: {
          select: {
            id: true,
            rateTutor: true,
            pensum: { select: { customerName: true, subject: true } },
          },
        },
      },
      orderBy: { date: "asc" },
    }),
    isMonthClosed(year, month),
  ]);

  type Entry = (typeof entries)[number];
  const groups = new Map<string, { name: string; entries: Entry[]; minutes: number; amount: number }>();
  for (const e of entries) {
    const g = groups.get(e.tutorId) ?? { name: e.tutor.name, entries: [], minutes: 0, amount: 0 };
    g.entries.push(e);
    g.minutes += e.minutes;
    g.amount += entryAmount(e.minutes, e.contract.rateTutor);
    groups.set(e.tutorId, g);
  }
  const tutorGroups = [...groups.entries()]
    .map(([tutorId, g]) => ({ tutorId, ...g }))
    .sort((a, b) => a.name.localeCompare(b.name, "de-CH"));

  const totalMinutes = entries.reduce((s, e) => s + e.minutes, 0);
  const totalAmount = tutorGroups.reduce((s, g) => s + g.amount, 0);

  return (
    <>
      <PageHeader
        title="Stunden"
        subtitle={`Alle Zeiteinträge im ${monthLabel(year, month)}`}
        action={<MonthPicker year={year} month={month} basePath="/admin/stunden" />}
      />

      {closed ? (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-warn/30 bg-warn/10 px-4 py-3 text-sm text-warn">
          <Lock size={15} />
          {monthLabel(year, month)} ist abgeschlossen — die Zeiteinträge sind gesperrt und
          fakturiert.
        </div>
      ) : null}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Einträge" value={entries.length} />
        <StatCard label="Stunden gesamt" value={minutesLabel(totalMinutes)} />
        <StatCard label="Honorar gesamt (Tutor:innen)" value={chf(totalAmount)} />
      </div>

      {entries.length === 0 ? (
        <EmptyState
          title="Keine Zeiteinträge in diesem Monat"
          description="Wähle oben einen anderen Monat oder warte auf neue Einträge."
        />
      ) : (
        <div className="space-y-6">
          {tutorGroups.map((g) => (
            <Card key={g.tutorId}>
              <CardHeader
                title={
                  <Link href={`/admin/tutoren/${g.tutorId}`} className="hover:text-accent">
                    {g.name}
                  </Link>
                }
                subtitle={`${g.entries.length} Einträge`}
                action={
                  <span className="text-xs font-medium tabular-nums text-mute">
                    {minutesLabel(g.minutes)} · {chf(g.amount)}
                  </span>
                }
              />
              <div className="p-4">
                <Table>
                  <THead>
                    <tr>
                      <TH>Datum</TH>
                      <TH>Vertrag / Kunde</TH>
                      <TH className="text-right">Minuten</TH>
                      <TH className="text-right">Honorar</TH>
                      <TH>Notizen</TH>
                    </tr>
                  </THead>
                  <TBody>
                    {g.entries.map((e) => (
                      <TR key={e.id}>
                        <TD className="whitespace-nowrap">{formatDate(e.date)}</TD>
                        <TD>
                          <Link
                            href={`/admin/vertraege/${e.contract.id}`}
                            className="text-ink transition-colors hover:text-accent"
                          >
                            {getSubject(e.contract.pensum.subject)?.name ??
                              e.contract.pensum.subject}{" "}
                            · {e.contract.pensum.customerName}
                          </Link>
                        </TD>
                        <TD className="text-right tabular-nums">{e.minutes}</TD>
                        <TD className="text-right tabular-nums">
                          {chf(entryAmount(e.minutes, e.contract.rateTutor))}
                        </TD>
                        <TD className="max-w-md">
                          {e.notes ? (
                            <details>
                              <summary className="cursor-pointer text-xs text-accent hover:underline">
                                Notizen anzeigen
                              </summary>
                              <div className="mt-2 rounded-lg border border-edge-soft bg-surface p-3">
                                <Markdown>{e.notes}</Markdown>
                              </div>
                            </details>
                          ) : (
                            "—"
                          )}
                        </TD>
                      </TR>
                    ))}
                  </TBody>
                </Table>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
