// Alle ausstehenden Bewerbungen quer über alle Pensen, mit Inline-Aktionen.

import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { getSubject } from "@/lib/subjects";
import Link from "next/link";
import {
  ButtonLink,
  EmptyState,
  PageHeader,
  Table,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "@/components/ui";
import { ActionButton } from "@/components/admin/ActionButton";

export default async function BewerbungenPage() {
  const applications = await prisma.application.findMany({
    where: { status: "PENDING" },
    include: {
      tutor: { select: { id: true, name: true } },
      pensum: { select: { id: true, subject: true, plz: true, city: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <PageHeader
        title="Bewerbungen"
        subtitle={`${applications.length} ausstehende Bewerbungen über alle Pensen`}
      />

      {applications.length === 0 ? (
        <EmptyState
          title="Keine ausstehenden Bewerbungen"
          description="Neue Bewerbungen von Tutor:innen erscheinen hier automatisch."
        />
      ) : (
        <Table>
          <THead>
            <tr>
              <TH>Datum</TH>
              <TH>Tutor:in</TH>
              <TH>Fach</TH>
              <TH>Ort</TH>
              <TH>Nachricht</TH>
              <TH className="text-right">Aktionen</TH>
            </tr>
          </THead>
          <TBody>
            {applications.map((a) => (
              <TR key={a.id}>
                <TD className="whitespace-nowrap">{formatDate(a.createdAt)}</TD>
                <TD>
                  <Link
                    href={`/admin/tutoren/${a.tutor.id}`}
                    className="font-medium text-ink hover:text-accent"
                  >
                    {a.tutor.name}
                  </Link>
                </TD>
                <TD>{getSubject(a.pensum.subject)?.name ?? a.pensum.subject}</TD>
                <TD className="whitespace-nowrap">
                  {a.pensum.plz} {a.pensum.city}
                </TD>
                <TD className="max-w-xs">
                  {a.message ? (
                    <details>
                      <summary className="cursor-pointer text-xs text-accent hover:underline">
                        Anzeigen
                      </summary>
                      <p className="mt-2 whitespace-pre-wrap rounded-lg border border-edge-soft bg-surface p-3 text-xs leading-relaxed text-mute">
                        {a.message}
                      </p>
                    </details>
                  ) : (
                    "—"
                  )}
                </TD>
                <TD>
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <ActionButton
                      url={`/api/admin/applications/${a.id}/accept`}
                      method="POST"
                      confirmText={`Bewerbung von ${a.tutor.name} annehmen? Alle anderen ausstehenden Bewerbungen dieses Pensums werden abgelehnt und ein Vertrag wird erstellt.`}
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
                    <ButtonLink href={`/admin/pensen/${a.pensum.id}`} variant="ghost" size="sm">
                      Pensum
                    </ButtonLink>
                  </div>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </>
  );
}
