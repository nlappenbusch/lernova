// Tutor-Detail: Profil, Statistik, Verträge, Auszahlungen.

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { chf, formatDate, minutesLabel, monthLabel } from "@/lib/format";
import { formatIban } from "@/lib/swiss";
import { getSubject } from "@/lib/subjects";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  PageHeader,
  StatCard,
  StatusBadge,
  Table,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "@/components/ui";
import { Markdown } from "@/components/Markdown";
import { TutorActiveToggle } from "@/components/admin/TutorActiveToggle";
import { entryAmount, parseSubjectSlugs } from "@/components/admin/utils";

export default async function TutorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tutor = await prisma.user.findFirst({
    where: { id, role: "TUTOR" },
    include: {
      contracts: {
        include: {
          pensum: { select: { subject: true, customerName: true, plz: true, city: true } },
        },
        orderBy: { startDate: "desc" },
      },
      payouts: { orderBy: [{ year: "desc" }, { month: "desc" }] },
    },
  });
  if (!tutor) notFound();

  const entries = await prisma.timeEntry.findMany({
    where: { tutorId: id },
    select: { minutes: true, contract: { select: { rateTutor: true } } },
  });

  const totalMinutes = entries.reduce((s, e) => s + e.minutes, 0);
  const totalHonorar = entries.reduce((s, e) => s + entryAmount(e.minutes, e.contract.rateTutor), 0);
  const activeContracts = tutor.contracts.filter((c) => c.status === "ACTIVE").length;
  const pendingPayouts = tutor.payouts
    .filter((p) => p.status === "PENDING")
    .reduce((s, p) => s + p.amount, 0);
  const subjects = parseSubjectSlugs(tutor.subjects);

  return (
    <>
      <Link
        href="/admin/tutoren"
        className="mb-4 inline-flex items-center gap-1.5 text-xs text-mute transition-colors hover:text-ink"
      >
        <ArrowLeft size={13} /> Zurück zu den Tutor:innen
      </Link>

      <PageHeader
        title={
          <span className="flex items-center gap-3">
            {tutor.name}
            {tutor.active ? <Badge tone="ok">Aktiv</Badge> : <Badge tone="danger">Deaktiviert</Badge>}
          </span>
        }
        subtitle={`${tutor.plz ?? ""} ${tutor.city ?? ""} · dabei seit ${formatDate(tutor.createdAt)}`}
        action={
          <span className="flex items-center gap-2 text-xs text-mute">
            Aktiv <TutorActiveToggle tutorId={tutor.id} active={tutor.active} />
          </span>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Aktive Verträge" value={activeContracts} tone="ok" />
        <StatCard label="Stunden gesamt" value={minutesLabel(totalMinutes)} />
        <StatCard label="Honorar gesamt" value={chf(totalHonorar)} />
        <StatCard
          label="Offene Auszahlungen"
          value={chf(pendingPayouts)}
          tone={pendingPayouts > 0 ? "warn" : undefined}
        />
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Profil" />
          <CardBody>
            <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-faint">E-Mail</dt>
                <dd className="mt-0.5 text-mute">{tutor.email}</dd>
              </div>
              <div>
                <dt className="text-xs text-faint">Telefon</dt>
                <dd className="mt-0.5 text-mute">{tutor.phone || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-faint">Adresse</dt>
                <dd className="mt-0.5 text-mute">
                  {tutor.street ? `${tutor.street}, ` : ""}
                  {tutor.plz} {tutor.city}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-faint">Einsatzradius</dt>
                <dd className="mt-0.5 text-mute">{tutor.radiusKm} km</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs text-faint">IBAN (Auszahlungskonto)</dt>
                <dd className="mt-0.5 font-mono text-xs text-mute">
                  {tutor.iban ? formatIban(tutor.iban) : <span className="text-danger">nicht hinterlegt</span>}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs text-faint">Fächer</dt>
                <dd className="mt-1">
                  {subjects.length === 0 ? (
                    <span className="text-faint">Keine Fächer hinterlegt</span>
                  ) : (
                    <span className="flex flex-wrap gap-1">
                      {subjects.map((slug) => (
                        <Badge key={slug} tone="teal">
                          {getSubject(slug)?.name ?? slug}
                        </Badge>
                      ))}
                    </span>
                  )}
                </dd>
              </div>
            </dl>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Bio" />
          <CardBody>
            {tutor.bio ? (
              <Markdown>{tutor.bio}</Markdown>
            ) : (
              <p className="text-sm text-mute">Keine Bio hinterlegt.</p>
            )}
          </CardBody>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader title="Verträge" subtitle={`${tutor.contracts.length} gesamt`} />
        {tutor.contracts.length === 0 ? (
          <CardBody>
            <p className="text-sm text-mute">Noch keine Verträge.</p>
          </CardBody>
        ) : (
          <div className="p-4">
            <Table>
              <THead>
                <tr>
                  <TH>Fach</TH>
                  <TH>Kunde</TH>
                  <TH>Ort</TH>
                  <TH className="text-right">Tutor-Rate</TH>
                  <TH>Start</TH>
                  <TH>Status</TH>
                  <TH />
                </tr>
              </THead>
              <TBody>
                {tutor.contracts.map((c) => (
                  <TR key={c.id}>
                    <TD className="font-medium text-ink">
                      {getSubject(c.pensum.subject)?.name ?? c.pensum.subject}
                    </TD>
                    <TD>{c.pensum.customerName}</TD>
                    <TD className="whitespace-nowrap">
                      {c.pensum.plz} {c.pensum.city}
                    </TD>
                    <TD className="text-right tabular-nums">{chf(c.rateTutor)} / h</TD>
                    <TD className="whitespace-nowrap">{formatDate(c.startDate)}</TD>
                    <TD>
                      <StatusBadge status={c.status} />
                    </TD>
                    <TD className="text-right">
                      <Link
                        href={`/admin/vertraege/${c.id}`}
                        className="text-xs text-accent hover:underline"
                      >
                        Detail
                      </Link>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </div>
        )}
      </Card>

      <Card>
        <CardHeader title="Auszahlungen" subtitle={`${tutor.payouts.length} gesamt`} />
        {tutor.payouts.length === 0 ? (
          <CardBody>
            <p className="text-sm text-mute">Noch keine Auszahlungen.</p>
          </CardBody>
        ) : (
          <div className="p-4">
            <Table>
              <THead>
                <tr>
                  <TH>Monat</TH>
                  <TH className="text-right">Stunden</TH>
                  <TH className="text-right">Betrag</TH>
                  <TH>Status</TH>
                  <TH>Ausbezahlt am</TH>
                </tr>
              </THead>
              <TBody>
                {tutor.payouts.map((p) => (
                  <TR key={p.id}>
                    <TD className="font-medium text-ink">{monthLabel(p.year, p.month)}</TD>
                    <TD className="text-right tabular-nums">{minutesLabel(p.minutes)}</TD>
                    <TD className="text-right tabular-nums">{chf(p.amount)}</TD>
                    <TD>
                      <StatusBadge status={p.status} />
                    </TD>
                    <TD>{p.paidAt ? formatDate(p.paidAt) : "—"}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </div>
        )}
      </Card>
    </>
  );
}
