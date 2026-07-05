// Pensum-Detail: Kundendaten, Raten (editierbar solange OPEN), Status-Aktionen,
// Bewerbungen mit Distanz/Fach-Match und Annehmen/Ablehnen.

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, MapPin } from "lucide-react";
import { prisma } from "@/lib/db";
import { chf, formatDate } from "@/lib/format";
import { haversineKm } from "@/lib/geo";
import { getLevel, getSubject } from "@/lib/subjects";
import {
  Badge,
  ButtonLink,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  PageHeader,
  StatusBadge,
} from "@/components/ui";
import { ActionButton } from "@/components/admin/ActionButton";
import { PensumRateEditor } from "@/components/admin/PensumRateEditor";
import { parseSubjectSlugs } from "@/components/admin/utils";

export default async function PensumDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pensum = await prisma.pensum.findUnique({
    where: { id },
    include: {
      applications: {
        include: {
          tutor: {
            select: { id: true, name: true, plz: true, city: true, lat: true, lng: true, subjects: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      contract: { include: { tutor: { select: { id: true, name: true } } } },
    },
  });
  if (!pensum) notFound();

  const subjectName = getSubject(pensum.subject)?.name ?? pensum.subject;
  const levelName = getLevel(pensum.level)?.name ?? pensum.level;
  const pending = pensum.applications.filter((a) => a.status === "PENDING");

  return (
    <>
      <Link
        href="/admin/pensen"
        className="mb-4 inline-flex items-center gap-1.5 text-xs text-mute transition-colors hover:text-ink"
      >
        <ArrowLeft size={13} /> Zurück zu den Pensen
      </Link>

      <PageHeader
        title={
          <span className="flex items-center gap-3">
            {subjectName}
            <StatusBadge status={pensum.status} />
          </span>
        }
        subtitle={`${levelName} · ${pensum.plz} ${pensum.city} · erstellt ${formatDate(pensum.createdAt)}`}
        action={
          pensum.status === "OPEN" ? (
            <ActionButton
              url={`/api/admin/pensen/${pensum.id}`}
              method="PATCH"
              body={{ status: "CANCELLED" }}
              confirmText="Dieses Pensum wirklich stornieren? Offene Bewerbungen bleiben bestehen, das Pensum wird aber nicht mehr vermittelt."
              label="Pensum stornieren"
              variant="danger"
            />
          ) : undefined
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader title="Kundendaten" />
            <CardBody>
              <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-faint">Name</dt>
                  <dd className="mt-0.5 font-medium text-ink">{pensum.customerName}</dd>
                </div>
                <div>
                  <dt className="text-xs text-faint">E-Mail</dt>
                  <dd className="mt-0.5 text-mute">
                    <a
                      href={`mailto:${pensum.customerEmail}`}
                      className="transition-colors hover:text-accent"
                    >
                      {pensum.customerEmail}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-faint">Telefon</dt>
                  <dd className="mt-0.5 text-mute">{pensum.customerPhone || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-faint">Adresse</dt>
                  <dd className="mt-0.5 text-mute">
                    {pensum.street ? `${pensum.street}, ` : ""}
                    {pensum.plz} {pensum.city}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-faint">Lektionen pro Woche</dt>
                  <dd className="mt-0.5 text-mute">{pensum.lessonsPerWeek}</dd>
                </div>
                <div>
                  <dt className="text-xs text-faint">Bevorzugte Zeiten</dt>
                  <dd className="mt-0.5 text-mute">{pensum.preferredTimes || "—"}</dd>
                </div>
              </dl>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Beschreibung" subtitle="Angaben aus der Anfrage" />
            <CardBody>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-mute">
                {pensum.description || "—"}
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Bewerbungen"
              subtitle={`${pensum.applications.length} gesamt · ${pending.length} ausstehend`}
            />
            {pensum.applications.length === 0 ? (
              <CardBody>
                <EmptyState
                  title="Noch keine Bewerbungen"
                  description="Sobald sich Tutor:innen auf dieses Pensum bewerben, erscheinen sie hier."
                />
              </CardBody>
            ) : (
              <ul className="divide-y divide-edge-soft">
                {pensum.applications.map((a) => {
                  const distance =
                    pensum.lat != null && pensum.lng != null && a.tutor.lat != null && a.tutor.lng != null
                      ? Math.round(
                          haversineKm(
                            { lat: pensum.lat, lng: pensum.lng },
                            { lat: a.tutor.lat, lng: a.tutor.lng }
                          ) * 10
                        ) / 10
                      : null;
                  const subjectMatch = parseSubjectSlugs(a.tutor.subjects).includes(pensum.subject);
                  return (
                    <li key={a.id} className="px-5 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/admin/tutoren/${a.tutor.id}`}
                          className="text-sm font-semibold text-ink hover:text-accent"
                        >
                          {a.tutor.name}
                        </Link>
                        <StatusBadge status={a.status} />
                        {subjectMatch ? (
                          <Badge tone="ok">Fach-Match</Badge>
                        ) : (
                          <Badge tone="warn">Kein Fach-Match</Badge>
                        )}
                        <span className="inline-flex items-center gap-1 text-xs text-faint">
                          <MapPin size={12} />
                          {a.tutor.plz} {a.tutor.city}
                          {distance !== null ? ` · ${distance.toLocaleString("de-CH")} km entfernt` : ""}
                        </span>
                        <span className="ml-auto text-xs text-faint">{formatDate(a.createdAt)}</span>
                      </div>
                      {a.message ? (
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-mute">
                          {a.message}
                        </p>
                      ) : null}
                      {a.status === "PENDING" && pensum.status === "OPEN" ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          <ActionButton
                            url={`/api/admin/applications/${a.id}/accept`}
                            method="POST"
                            confirmText={`Bewerbung von ${a.tutor.name} annehmen?\n\nAlle anderen ausstehenden Bewerbungen werden abgelehnt, das Pensum wird als vermittelt markiert und ein Vertrag erstellt.`}
                            label="Annehmen"
                            variant="primary"
                          />
                          <ActionButton
                            url={`/api/admin/applications/${a.id}/reject`}
                            method="POST"
                            confirmText={`Bewerbung von ${a.tutor.name} ablehnen?`}
                            label="Ablehnen"
                            variant="danger"
                          />
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Raten" subtitle="Rappen-genau, pro 60 Minuten" />
            <CardBody>
              {pensum.status === "OPEN" ? (
                <PensumRateEditor
                  pensumId={pensum.id}
                  rateCustomer={pensum.rateCustomer}
                  rateTutor={pensum.rateTutor}
                />
              ) : (
                <dl className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-mute">Kundenrate</dt>
                    <dd className="font-semibold tabular-nums text-ink">{chf(pensum.rateCustomer)} / h</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-mute">Tutor-Rate</dt>
                    <dd className="font-semibold tabular-nums text-ink">{chf(pensum.rateTutor)} / h</dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-edge-soft pt-3">
                    <dt className="text-mute">Marge</dt>
                    <dd className="font-semibold tabular-nums text-accent2">
                      {chf(pensum.rateCustomer - pensum.rateTutor)} / h
                    </dd>
                  </div>
                </dl>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Eckdaten" />
            <CardBody>
              <dl className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-mute">Status</dt>
                  <dd>
                    <StatusBadge status={pensum.status} />
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-mute">Quelle</dt>
                  <dd className="text-ink">{pensum.source}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-mute">Erstellt</dt>
                  <dd className="text-ink">{formatDate(pensum.createdAt)}</dd>
                </div>
              </dl>
            </CardBody>
          </Card>

          {pensum.contract ? (
            <Card>
              <CardHeader title="Vertrag" subtitle={`Tutor:in ${pensum.contract.tutor.name}`} />
              <CardBody>
                <div className="flex items-center justify-between gap-3">
                  <StatusBadge status={pensum.contract.status} />
                  <ButtonLink href={`/admin/vertraege/${pensum.contract.id}`} variant="secondary" size="sm">
                    <FileText size={13} /> Zum Vertrag
                  </ButtonLink>
                </div>
              </CardBody>
            </Card>
          ) : null}
        </div>
      </div>
    </>
  );
}
