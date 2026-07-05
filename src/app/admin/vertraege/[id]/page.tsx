// Vertrags-Detail: Stammdaten, Zeiteinträge nach Monat (mit Summen), Vertrag beenden.

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { chf, formatDate, minutesLabel, monthLabel } from "@/lib/format";
import { getLevel, getSubject } from "@/lib/subjects";
import {
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  PageHeader,
  StatusBadge,
  Table,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "@/components/ui";
import { Markdown } from "@/components/Markdown";
import { ActionButton } from "@/components/admin/ActionButton";
import { entryAmount } from "@/components/admin/utils";

export default async function VertragDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const contract = await prisma.contract.findUnique({
    where: { id },
    include: {
      pensum: true,
      tutor: { select: { id: true, name: true, email: true } },
      timeEntries: { orderBy: { date: "desc" } },
    },
  });
  if (!contract) notFound();

  const subjectName = getSubject(contract.pensum.subject)?.name ?? contract.pensum.subject;

  // Zeiteinträge nach Monat gruppieren (neueste zuerst).
  type Entry = (typeof contract.timeEntries)[number];
  const monthGroups = new Map<string, { year: number; month: number; entries: Entry[] }>();
  for (const e of contract.timeEntries) {
    const y = e.date.getFullYear();
    const m = e.date.getMonth() + 1;
    const key = `${y}-${m}`;
    const g = monthGroups.get(key) ?? { year: y, month: m, entries: [] };
    g.entries.push(e);
    monthGroups.set(key, g);
  }
  const groups = [...monthGroups.values()].sort((a, b) => b.year - a.year || b.month - a.month);
  const totalMinutes = contract.timeEntries.reduce((s, e) => s + e.minutes, 0);

  return (
    <>
      <Link
        href="/admin/vertraege"
        className="mb-4 inline-flex items-center gap-1.5 text-xs text-mute transition-colors hover:text-ink"
      >
        <ArrowLeft size={13} /> Zurück zu den Verträgen
      </Link>

      <PageHeader
        title={
          <span className="flex items-center gap-3">
            {subjectName} — {contract.pensum.customerName}
            <StatusBadge status={contract.status} />
          </span>
        }
        subtitle={`Tutor:in ${contract.tutor.name} · Start ${formatDate(contract.startDate)} · ${minutesLabel(totalMinutes)} gesamt`}
        action={
          contract.status === "ACTIVE" ? (
            <ActionButton
              url={`/api/admin/contracts/${contract.id}`}
              method="PATCH"
              body={{ action: "end" }}
              confirmText={`Vertrag ${subjectName} — ${contract.pensum.customerName} wirklich beenden? Das Enddatum wird auf heute gesetzt.`}
              label="Vertrag beenden"
              variant="danger"
            />
          ) : undefined
        }
      />

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Stammdaten" />
          <CardBody>
            <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-faint">Kunde</dt>
                <dd className="mt-0.5 font-medium text-ink">{contract.pensum.customerName}</dd>
              </div>
              <div>
                <dt className="text-xs text-faint">Tutor:in</dt>
                <dd className="mt-0.5">
                  <Link
                    href={`/admin/tutoren/${contract.tutor.id}`}
                    className="font-medium text-ink hover:text-accent"
                  >
                    {contract.tutor.name}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-faint">Fach / Stufe</dt>
                <dd className="mt-0.5 text-mute">
                  {subjectName} · {getLevel(contract.pensum.level)?.name ?? contract.pensum.level}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-faint">Ort</dt>
                <dd className="mt-0.5 text-mute">
                  {contract.pensum.plz} {contract.pensum.city}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-faint">Laufzeit</dt>
                <dd className="mt-0.5 text-mute">
                  {formatDate(contract.startDate)} –{" "}
                  {contract.endDate ? formatDate(contract.endDate) : "offen"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-faint">Pensum</dt>
                <dd className="mt-0.5">
                  <Link
                    href={`/admin/pensen/${contract.pensumId}`}
                    className="text-accent hover:underline"
                  >
                    Zum Pensum
                  </Link>
                </dd>
              </div>
            </dl>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Raten" subtitle="Pro 60 Minuten" />
          <CardBody>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-mute">Kundenrate</dt>
                <dd className="font-semibold tabular-nums text-ink">{chf(contract.rateCustomer)} / h</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-mute">Tutor-Rate</dt>
                <dd className="font-semibold tabular-nums text-ink">{chf(contract.rateTutor)} / h</dd>
              </div>
              <div className="flex items-center justify-between border-t border-edge-soft pt-3">
                <dt className="text-mute">Marge</dt>
                <dd className="font-semibold tabular-nums text-accent2">
                  {chf(contract.rateCustomer - contract.rateTutor)} / h
                </dd>
              </div>
            </dl>
          </CardBody>
        </Card>
      </div>

      <h2 className="mb-3 text-sm font-semibold text-ink">Zeiteinträge nach Monat</h2>
      {groups.length === 0 ? (
        <EmptyState
          title="Noch keine Zeiteinträge"
          description="Sobald die Tutor:in Stunden erfasst, erscheinen sie hier."
        />
      ) : (
        <div className="space-y-6">
          {groups.map((g) => {
            const subMinutes = g.entries.reduce((s, e) => s + e.minutes, 0);
            const subAmount = g.entries.reduce(
              (s, e) => s + entryAmount(e.minutes, contract.rateTutor),
              0
            );
            return (
              <Card key={`${g.year}-${g.month}`}>
                <CardHeader
                  title={monthLabel(g.year, g.month)}
                  action={
                    <span className="text-xs tabular-nums text-mute">
                      {minutesLabel(subMinutes)} · Honorar {chf(subAmount)}
                    </span>
                  }
                />
                <div className="p-4">
                  <Table>
                    <THead>
                      <tr>
                        <TH>Datum</TH>
                        <TH className="text-right">Minuten</TH>
                        <TH className="text-right">Honorar</TH>
                        <TH>Notizen</TH>
                      </tr>
                    </THead>
                    <TBody>
                      {g.entries.map((e) => (
                        <TR key={e.id}>
                          <TD className="whitespace-nowrap">{formatDate(e.date)}</TD>
                          <TD className="text-right tabular-nums">{e.minutes}</TD>
                          <TD className="text-right tabular-nums">
                            {chf(entryAmount(e.minutes, contract.rateTutor))}
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
            );
          })}
        </div>
      )}
    </>
  );
}
