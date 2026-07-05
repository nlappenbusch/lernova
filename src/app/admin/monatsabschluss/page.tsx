// Monatsabschluss: Liste geschlossener Monate + Abschluss-Card mit Preview.

import { prisma } from "@/lib/db";
import { chf, currentMonth, formatDate, minutesLabel, monthLabel } from "@/lib/format";
import { listClosedMonths } from "@/lib/months";
import {
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  PageHeader,
  Table,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "@/components/ui";
import { MonthCloseForm, type CloseableMonth } from "@/components/admin/MonthCloseForm";

export default async function MonatsabschlussPage() {
  const [closedMonths, invoiceAgg, openEntries] = await Promise.all([
    listClosedMonths(),
    prisma.invoice.groupBy({
      by: ["year", "month"],
      where: { status: { not: "CANCELLED" } },
      _count: { _all: true },
      _sum: { amount: true },
    }),
    prisma.timeEntry.findMany({
      where: { invoiceItem: { is: null } },
      select: { date: true, minutes: true, contractId: true },
    }),
  ]);

  const invoiceByMonth = new Map(
    invoiceAgg.map((a) => [`${a.year}-${a.month}`, { count: a._count._all, sum: a._sum.amount ?? 0 }])
  );
  const closedSet = new Set(closedMonths.map((c) => `${c.year}-${c.month}`));
  const now = currentMonth();

  // Abschliessbare Monate: vergangen, nicht geschlossen, mit nicht-fakturierten Einträgen.
  const candidates = new Map<
    string,
    { year: number; month: number; entries: number; minutes: number; contracts: Set<string> }
  >();
  for (const e of openEntries) {
    const y = e.date.getFullYear();
    const m = e.date.getMonth() + 1;
    if (y > now.year || (y === now.year && m >= now.month)) continue;
    const key = `${y}-${m}`;
    if (closedSet.has(key)) continue;
    const c = candidates.get(key) ?? { year: y, month: m, entries: 0, minutes: 0, contracts: new Set<string>() };
    c.entries += 1;
    c.minutes += e.minutes;
    c.contracts.add(e.contractId);
    candidates.set(key, c);
  }
  const options: CloseableMonth[] = [...candidates.values()]
    .sort((a, b) => a.year - b.year || a.month - b.month)
    .map((c) => ({
      year: c.year,
      month: c.month,
      label: monthLabel(c.year, c.month),
      entries: c.entries,
      minutes: c.minutes,
      contracts: c.contracts.size,
    }));

  return (
    <>
      <PageHeader
        title="Monatsabschluss"
        subtitle="Sperrt die Zeiteinträge eines Monats und erzeugt Rechnungen & Payouts"
      />

      <div className="space-y-6">
        <Card>
          <CardHeader
            title="Geschlossene Monate"
            subtitle="Bereits abgerechnete Perioden mit Rechnungsvolumen"
          />
          {closedMonths.length === 0 ? (
            <CardBody>
              <EmptyState
                title="Noch kein Monat abgeschlossen"
                description="Schliesse unten den ersten Monat ab, um Rechnungen und Payouts zu erzeugen."
              />
            </CardBody>
          ) : (
            <div className="p-4">
              <Table>
                <THead>
                  <tr>
                    <TH>Monat</TH>
                    <TH>Geschlossen am</TH>
                    <TH className="text-right">Rechnungen</TH>
                    <TH className="text-right">Rechnungssumme</TH>
                  </tr>
                </THead>
                <TBody>
                  {closedMonths.map((c) => {
                    const agg = invoiceByMonth.get(`${c.year}-${c.month}`);
                    return (
                      <TR key={`${c.year}-${c.month}`}>
                        <TD className="font-medium text-ink">{monthLabel(c.year, c.month)}</TD>
                        <TD>{formatDate(c.closedAt)}</TD>
                        <TD className="text-right tabular-nums">{agg?.count ?? 0}</TD>
                        <TD className="text-right tabular-nums">{chf(agg?.sum ?? 0)}</TD>
                      </TR>
                    );
                  })}
                </TBody>
              </Table>
            </div>
          )}
        </Card>

        <Card>
          <CardHeader
            title="Monat abschliessen"
            subtitle="Nur vergangene, noch nicht geschlossene Monate mit offenen Einträgen"
          />
          <CardBody>
            <MonthCloseForm options={options} />
            {options.length > 0 ? (
              <p className="mt-4 text-[11px] text-faint">
                Vorschau:{" "}
                {options
                  .map((o) => `${o.label} (${o.entries} Einträge, ${minutesLabel(o.minutes)})`)
                  .join(" · ")}
              </p>
            ) : null}
          </CardBody>
        </Card>
      </div>
    </>
  );
}
