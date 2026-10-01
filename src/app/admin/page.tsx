// Admin-Dashboard: Kennzahlen, neueste offene Pensen & Bewerbungen, Quick-Actions.

import Link from "next/link";
import {
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  CalendarCheck,
  CircleDollarSign,
  ClipboardList,
  Sparkles,
  Users,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { chf, currentMonth, formatDate, minutesLabel, monthRange } from "@/lib/format";
import { getSubject } from "@/lib/subjects";
import {
  Badge,
  ButtonLink,
  Card,
  CardHeader,
  PageHeader,
  StatCard,
} from "@/components/ui";

export default async function AdminDashboardPage() {
  const now = new Date();
  const { year, month } = currentMonth();
  const { start, end } = monthRange(year, month);

  const [
    openPensen,
    pendingApplications,
    activeContracts,
    minutesAgg,
    openInvoiceAgg,
    overdueInvoices,
    latestPensen,
    latestApplications,
  ] = await Promise.all([
    prisma.pensum.count({ where: { status: "OPEN" } }),
    prisma.application.count({ where: { status: "PENDING" } }),
    prisma.contract.count({ where: { status: "ACTIVE" } }),
    prisma.timeEntry.aggregate({
      _sum: { minutes: true },
      where: { date: { gte: start, lt: end } },
    }),
    prisma.invoice.aggregate({ _sum: { amount: true }, where: { status: "OPEN" } }),
    prisma.invoice.count({ where: { status: "OPEN", dueDate: { lt: now } } }),
    prisma.pensum.findMany({
      where: { status: "OPEN" },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { _count: { select: { applications: true } } },
    }),
    prisma.application.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        tutor: { select: { name: true } },
        pensum: { select: { id: true, subject: true, plz: true, city: true } },
      },
    }),
  ]);

  const monthMinutes = minutesAgg._sum.minutes ?? 0;
  const openAmount = openInvoiceAgg._sum.amount ?? 0;

  return (
    <>
      <div className="mb-6 overflow-hidden rounded-2xl border border-edge-soft bg-gradient-to-br from-violet-50 via-white to-teal-50 p-5 shadow-card md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-violet-700">
              <Sparkles className="h-3.5 w-3.5" />
              Operations Overview
            </div>
            <h1 className="font-display text-2xl font-bold text-ink md:text-3xl">Willkommen im Lernova-Admin</h1>
            <p className="mt-2 max-w-xl text-sm text-mute">
              Verfolgen Sie Vermittlungen, Stunden, offene Rechnungen und neue Bewerbungen in einem klaren Workflow.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/admin/monatsabschluss" variant="secondary" size="sm">
              <CalendarCheck size={14} /> Monatsabschluss
            </ButtonLink>
            <ButtonLink href="/admin/mahnwesen" variant="secondary" size="sm">
              <Bell size={14} /> Mahnlauf
            </ButtonLink>
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-faint">Pensen</p>
              <p className="mt-2 text-2xl font-bold text-ink">{openPensen}</p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              <ClipboardList className="h-5 w-5" />
            </span>
          </div>
          <p className="mt-3 text-xs text-mute">Offene Anfragen warten auf Vermittlung.</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-faint">Bewerbungen</p>
              <p className="mt-2 text-2xl font-bold text-ink">{pendingApplications}</p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <Users className="h-5 w-5" />
            </span>
          </div>
          <p className="mt-3 text-xs text-mute">Ausstehende Tutor:innen-Bewerbungen.</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-faint">Umsatz offen</p>
              <p className="mt-2 text-2xl font-bold text-ink">{chf(openAmount)}</p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <CircleDollarSign className="h-5 w-5" />
            </span>
          </div>
          <p className="mt-3 text-xs text-mute">Gesamtwert der offenen Rechnungen.</p>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Offene Pensen" value={openPensen} tone="accent" hint="Warten auf Vermittlung" />
        <StatCard label="Offene Bewerbungen" value={pendingApplications} tone={pendingApplications > 0 ? "warn" : undefined} hint="Status PENDING" />
        <StatCard label="Aktive Verträge" value={activeContracts} tone="ok" />
        <StatCard label="Stunden im laufenden Monat" value={minutesLabel(monthMinutes)} />
        <StatCard label="Offener Rechnungsbetrag" value={chf(openAmount)} hint="Summe aller offenen Rechnungen" />
        <StatCard
          label="Überfällige Rechnungen"
          value={overdueInvoices}
          tone={overdueInvoices > 0 ? "danger" : "ok"}
          hint={overdueInvoices > 0 ? "Mahnlauf empfohlen" : "Alles im grünen Bereich"}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader
            title="Neueste offene Pensen"
            subtitle="Die 5 jüngsten unvermittelten Anfragen"
            action={
              <ButtonLink href="/admin/pensen" variant="ghost" size="sm">
                Alle <ArrowRight size={12} />
              </ButtonLink>
            }
          />
          {latestPensen.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-mute">Keine offenen Pensen.</p>
          ) : (
            <ul className="divide-y divide-edge-soft">
              {latestPensen.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/admin/pensen/${p.id}`}
                    className="flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-card-hover"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">
                        {getSubject(p.subject)?.name ?? p.subject}
                        <span className="text-mute"> · {p.plz} {p.city}</span>
                      </p>
                      <p className="mt-0.5 text-xs text-faint">
                        {p.customerName} · erstellt {formatDate(p.createdAt)}
                      </p>
                    </div>
                    <Badge tone={p._count.applications > 0 ? "accent" : "default"}>
                      {p._count.applications} Bewerbungen
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div className="space-y-6">
          <Card className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink">Schnellzugriff</h3>
              <BriefcaseBusiness className="h-4 w-4 text-faint" />
            </div>
            <div className="space-y-2">
              <ButtonLink href="/admin/tutoren" variant="secondary" className="w-full justify-between">
                Tutor:innen <ArrowRight size={13} />
              </ButtonLink>
              <ButtonLink href="/admin/pensen" variant="secondary" className="w-full justify-between">
                Pensen <ArrowRight size={13} />
              </ButtonLink>
              <ButtonLink href="/admin/rechnungen" variant="secondary" className="w-full justify-between">
                Rechnungen <ArrowRight size={13} />
              </ButtonLink>
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Neueste Bewerbungen"
              subtitle="Die 5 jüngsten ausstehenden Bewerbungen"
              action={
                <ButtonLink href="/admin/bewerbungen" variant="ghost" size="sm">
                  Alle <ArrowRight size={12} />
                </ButtonLink>
              }
            />
            {latestApplications.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-mute">Keine ausstehenden Bewerbungen.</p>
            ) : (
              <ul className="divide-y divide-edge-soft">
                {latestApplications.map((a) => (
                  <li key={a.id}>
                    <Link
                      href={`/admin/pensen/${a.pensum.id}`}
                      className="flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-card-hover"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink">{a.tutor.name}</p>
                        <p className="mt-0.5 text-xs text-faint">
                          {getSubject(a.pensum.subject)?.name ?? a.pensum.subject} · {a.pensum.plz}{" "}
                          {a.pensum.city} · {formatDate(a.createdAt)}
                        </p>
                      </div>
                      <ArrowRight size={14} className="shrink-0 text-faint" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
