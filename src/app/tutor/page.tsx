// Tutor-Dashboard: Kennzahlen, letzte Zeiteinträge, nächste Schritte.

import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  MapPin,
  Sparkles,
  TimerReset,
  Users,
} from "lucide-react";
import { requirePageUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { withinRadius } from "@/lib/geo";
import { geocodePlz } from "@/lib/plz";
import { getSubject } from "@/lib/subjects";
import { roundTo5Rappen } from "@/lib/swiss";
import { chf, formatDate, minutesLabel, currentMonth, monthRange, monthLabel } from "@/lib/format";
import {
  PageHeader,
  StatCard,
  Card,
  CardHeader,
  CardBody,
  ButtonLink,
  EmptyState,
  Table,
  THead,
  TH,
  TBody,
  TR,
  TD,
} from "@/components/ui";

export default async function TutorDashboardPage() {
  const user = await requirePageUser("TUTOR");
  const { year, month } = currentMonth();
  const { start, end } = monthRange(year, month);

  const [activeContracts, monthEntries, lastEntries, openPensen] = await Promise.all([
    prisma.contract.count({ where: { tutorId: user.id, status: "ACTIVE" } }),
    prisma.timeEntry.findMany({
      where: { tutorId: user.id, date: { gte: start, lt: end } },
      include: { contract: { select: { rateTutor: true } } },
    }),
    prisma.timeEntry.findMany({
      where: { tutorId: user.id },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      take: 5,
      include: { contract: { select: { pensum: { select: { subject: true, city: true } } } } },
    }),
    prisma.pensum.findMany({
      where: { status: "OPEN" },
      select: { id: true, lat: true, lng: true },
    }),
  ]);

  const monthMinutes = monthEntries.reduce((sum, e) => sum + e.minutes, 0);
  const monthHonorar = roundTo5Rappen(
    monthEntries.reduce((sum, e) => sum + Math.round((e.minutes * e.contract.rateTutor) / 60), 0)
  );

  const center =
    user.lat != null && user.lng != null
      ? { lat: user.lat, lng: user.lng }
      : user.plz
        ? geocodePlz(user.plz)
        : null;
  const pensenNearby = center ? withinRadius(openPensen, center, user.radiusKm).length : null;

  const firstName = user.name.split(" ")[0] ?? user.name;

  return (
    <div>
      <div className="mb-6 overflow-hidden rounded-2xl border border-edge-soft bg-gradient-to-br from-violet-50 via-white to-emerald-50 p-5 shadow-card md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-violet-700">
              <Sparkles className="h-3.5 w-3.5" />
              Tutor Workspace
            </div>
            <h1 className="font-display text-2xl font-bold text-ink md:text-3xl">
              Willkommen zurück, {firstName}
            </h1>
            <p className="mt-2 text-sm text-mute">
              Dein Überblick für {monthLabel(year, month)} — inklusive Stunden, Einnahmen und neuer Match-Opportunität.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/tutor/stunden" variant="secondary" size="sm">
              <TimerReset size={14} /> Stunden erfassen
            </ButtonLink>
            <ButtonLink href="/tutor/pensen" variant="secondary" size="sm">
              <BriefcaseBusiness size={14} /> Offene Pensen
            </ButtonLink>
          </div>
        </div>
      </div>

      {user.lat == null ? (
        <Card className="mb-6 border-accent/30 bg-accent-soft/30">
          <CardBody className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft">
                <MapPin size={17} className="text-accent-deep" />
              </span>
              <div>
                <p className="text-sm font-medium text-ink">Profil vervollständigen für Umkreissuche</p>
                <p className="mt-0.5 text-xs text-mute">
                  Hinterlege deine PLZ im Profil, damit wir dir offene Pensen in deiner Nähe anzeigen können.
                </p>
              </div>
            </div>
            <ButtonLink href="/tutor/profil" variant="secondary" size="sm">
              Zum Profil
            </ButtonLink>
          </CardBody>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Aktive Verträge" value={activeContracts} tone="accent" />
        <StatCard
          label="Stunden diesen Monat"
          value={minutesLabel(monthMinutes)}
          hint={`${monthEntries.length} ${monthEntries.length === 1 ? "Eintrag" : "Einträge"}`}
        />
        <StatCard
          label="Voraussichtliches Honorar"
          value={chf(monthHonorar)}
          hint={monthLabel(year, month)}
          tone="ok"
        />
        <StatCard
          label="Offene Pensen im Umkreis"
          value={pensenNearby ?? "—"}
          hint={pensenNearby != null ? `Radius ${user.radiusKm} km` : "Profil unvollständig"}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Letzte Zeiteinträge"
            subtitle="Deine zuletzt erfassten Lektionen"
            action={
              <ButtonLink href="/tutor/stunden" variant="ghost" size="sm">
                Alle ansehen
              </ButtonLink>
            }
          />
          <CardBody className="px-0 py-0">
            {lastEntries.length === 0 ? (
              <div className="p-5">
                <EmptyState
                  title="Noch keine Zeiteinträge"
                  description="Erfasse deine erste Lektion unter Stunden."
                  action={
                    <ButtonLink href="/tutor/stunden" size="sm">
                      Stunden erfassen
                    </ButtonLink>
                  }
                />
              </div>
            ) : (
              <Table className="rounded-none border-0">
                <THead>
                  <tr>
                    <TH>Datum</TH>
                    <TH>Vertrag / Fach</TH>
                    <TH className="text-right">Dauer</TH>
                  </tr>
                </THead>
                <TBody>
                  {lastEntries.map((e) => (
                    <TR key={e.id}>
                      <TD className="whitespace-nowrap">{formatDate(e.date)}</TD>
                      <TD className="text-ink">
                        {getSubject(e.contract.pensum.subject)?.name ?? e.contract.pensum.subject}
                        <span className="text-faint"> · {e.contract.pensum.city}</span>
                      </TD>
                      <TD className="text-right tabular-nums">{minutesLabel(e.minutes)}</TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Nächste Schritte" subtitle="Das bringt dich weiter" />
          <CardBody className="space-y-1">
            {[
              { href: "/tutor/pensen", label: "Offene Pensen im Umkreis ansehen" },
              { href: "/tutor/stunden", label: "Lektionen dieses Monats erfassen" },
              { href: "/tutor/bewerbungen", label: "Status deiner Bewerbungen prüfen" },
              { href: "/tutor/profil", label: "Profil & Fächer aktuell halten" },
            ].map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-mute transition-colors hover:bg-surface hover:text-ink"
              >
                {s.label}
                <ArrowRight
                  size={14}
                  className="text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
                />
              </Link>
            ))}
          </CardBody>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink">Arbeitsstatus</h3>
            <Users className="h-4 w-4 text-faint" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-mute">Aktive Verträge</span>
              <span className="font-semibold text-ink">{activeContracts}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-mute">Stunden im Monat</span>
              <span className="font-semibold text-ink">{minutesLabel(monthMinutes)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-mute">Erwartetes Honorar</span>
              <span className="font-semibold text-ink">{chf(monthHonorar)}</span>
            </div>
          </div>
        </Card>

        <Card className="p-4 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink">Warum das wichtig ist</h3>
            <MapPin className="h-4 w-4 text-faint" />
          </div>
          <p className="text-sm leading-relaxed text-mute">
            Die Nähe zum Lernort, das passende Fachprofil und klare Lernziele sind die Basis für gute Nachhilfe. Ein gepflegtes Profil erhöht deine Chancen auf passende Pensen spürbar.
          </p>
        </Card>
      </div>
    </div>
  );
}
