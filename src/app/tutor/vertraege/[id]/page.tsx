// Vertrags-Detail: Kundenkontakt (bei Vertrag erlaubt), Pensum-Beschreibung,
// Zeiteinträge gruppiert nach Monat (geschlossene Monate mit Lock).
// SECURITY: findFirst mit tutorId — nie fremde Verträge.

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, Mail, MapPin, Phone, User } from "lucide-react";
import { requirePageUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { listClosedMonths } from "@/lib/months";
import { getSubject, getLevel } from "@/lib/subjects";
import { roundTo5Rappen } from "@/lib/swiss";
import { chf, formatDate, minutesLabel, monthLabel } from "@/lib/format";
import {
  PageHeader,
  Card,
  CardHeader,
  CardBody,
  StatusBadge,
  Badge,
  EmptyState,
  Divider,
} from "@/components/ui";
import { Markdown } from "@/components/Markdown";

export const metadata = { title: "Vertrag" };

type MonthGroup = {
  year: number;
  month: number;
  minutes: number;
  honorar: number;
  closed: boolean;
  entries: Array<{ id: string; date: Date; minutes: number; notes: string }>;
};

export default async function VertragDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requirePageUser("TUTOR");
  const { id } = await params;

  const contract = await prisma.contract.findFirst({
    where: { id, tutorId: user.id },
    include: {
      pensum: true,
      timeEntries: { orderBy: { date: "desc" } },
    },
  });
  if (!contract) notFound();

  const closedSet = new Set(
    (await listClosedMonths()).map((c) => `${c.year}-${c.month}`)
  );

  const groups = new Map<string, MonthGroup>();
  for (const e of contract.timeEntries) {
    const y = e.date.getFullYear();
    const m = e.date.getMonth() + 1;
    const key = `${y}-${m}`;
    let group = groups.get(key);
    if (!group) {
      group = {
        year: y,
        month: m,
        minutes: 0,
        honorar: 0,
        closed: closedSet.has(key),
        entries: [],
      };
      groups.set(key, group);
    }
    group.minutes += e.minutes;
    group.honorar += Math.round((e.minutes * contract.rateTutor) / 60);
    group.entries.push({ id: e.id, date: e.date, minutes: e.minutes, notes: e.notes });
  }
  const monthGroups = [...groups.values()].sort(
    (a, b) => b.year - a.year || b.month - a.month
  );

  const subjectName = getSubject(contract.pensum.subject)?.name ?? contract.pensum.subject;
  const levelName = getLevel(contract.pensum.level)?.name ?? contract.pensum.level;
  const totalMinutes = contract.timeEntries.reduce((sum, e) => sum + e.minutes, 0);

  return (
    <div>
      <Link
        href="/tutor/vertraege"
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-mute hover:text-ink"
      >
        <ArrowLeft size={13} />
        Zurück zu den Verträgen
      </Link>

      <PageHeader
        title={
          <span className="flex flex-wrap items-center gap-3">
            {subjectName}
            <StatusBadge status={contract.status} />
          </span>
        }
        subtitle={`${levelName} · ${contract.pensum.plz} ${contract.pensum.city} · seit ${formatDate(contract.startDate)}${contract.endDate ? ` · beendet am ${formatDate(contract.endDate)}` : ""}`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <Card>
            <CardHeader title="Kundenkontakt" subtitle="Für die Terminabsprache" />
            <CardBody className="space-y-3 text-sm">
              <p className="flex items-center gap-2.5 text-ink">
                <User size={14} className="shrink-0 text-faint" />
                {contract.pensum.customerName}
              </p>
              {contract.pensum.customerPhone ? (
                <p className="flex items-center gap-2.5 text-mute">
                  <Phone size={14} className="shrink-0 text-faint" />
                  <a href={`tel:${contract.pensum.customerPhone}`} className="hover:text-accent">
                    {contract.pensum.customerPhone}
                  </a>
                </p>
              ) : null}
              <p className="flex items-center gap-2.5 text-mute">
                <Mail size={14} className="shrink-0 text-faint" />
                <a
                  href={`mailto:${contract.pensum.customerEmail}`}
                  className="break-all hover:text-accent"
                >
                  {contract.pensum.customerEmail}
                </a>
              </p>
              <p className="flex items-start gap-2.5 text-mute">
                <MapPin size={14} className="mt-0.5 shrink-0 text-faint" />
                <span>
                  {contract.pensum.street ? (
                    <>
                      {contract.pensum.street}
                      <br />
                    </>
                  ) : null}
                  {contract.pensum.plz} {contract.pensum.city}
                </span>
              </p>
              <Divider />
              <div className="flex items-center justify-between text-xs">
                <span className="text-faint">Dein Honorar</span>
                <span className="font-semibold text-ink">{chf(contract.rateTutor)}/h</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-faint">Stunden gesamt</span>
                <span className="font-semibold tabular-nums text-ink">
                  {minutesLabel(totalMinutes)}
                </span>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Pensum" subtitle="Beschreibung der Anfrage" />
            <CardBody>
              <p className="text-sm leading-relaxed text-mute">{contract.pensum.description}</p>
              {contract.pensum.preferredTimes ? (
                <p className="mt-3 text-xs text-faint">
                  Bevorzugte Zeiten:{" "}
                  <span className="text-mute">{contract.pensum.preferredTimes}</span>
                </p>
              ) : null}
              <p className="mt-1 text-xs text-faint">
                Frequenz:{" "}
                <span className="text-mute">{contract.pensum.lessonsPerWeek}×/Woche</span>
              </p>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          {monthGroups.length === 0 ? (
            <EmptyState
              title="Noch keine Zeiteinträge"
              description="Erfasste Lektionen zu diesem Vertrag erscheinen hier, gruppiert nach Monat."
            />
          ) : (
            monthGroups.map((g) => (
              <Card key={`${g.year}-${g.month}`}>
                <CardHeader
                  title={
                    <span className="flex items-center gap-2">
                      {monthLabel(g.year, g.month)}
                      {g.closed ? (
                        <Badge tone="default">
                          <Lock size={11} />
                          abgerechnet
                        </Badge>
                      ) : null}
                    </span>
                  }
                  subtitle={`${minutesLabel(g.minutes)} · ${chf(roundTo5Rappen(g.honorar))}`}
                />
                <CardBody className="space-y-4">
                  {g.entries.map((e) => (
                    <div
                      key={e.id}
                      className="rounded-lg border border-edge-soft bg-surface px-4 py-3"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-ink">{formatDate(e.date)}</span>
                        <span className="tabular-nums text-mute">{minutesLabel(e.minutes)}</span>
                      </div>
                      {e.notes.trim() ? (
                        <div className="mt-2">
                          <Markdown>{e.notes}</Markdown>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </CardBody>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
