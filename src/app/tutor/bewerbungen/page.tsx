// Eigene Bewerbungen: Fach, Ort, Datum, Status, Nachricht, Zurückziehen.

import { requirePageUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getSubject } from "@/lib/subjects";
import { formatDate } from "@/lib/format";
import {
  PageHeader,
  Table,
  THead,
  TH,
  TBody,
  TR,
  TD,
  StatusBadge,
  EmptyState,
  ButtonLink,
} from "@/components/ui";
import { WithdrawButton } from "@/components/tutor/WithdrawButton";

export const metadata = { title: "Bewerbungen" };

export default async function BewerbungenPage() {
  const user = await requirePageUser("TUTOR");

  const applications = await prisma.application.findMany({
    where: { tutorId: user.id },
    include: {
      pensum: { select: { subject: true, plz: true, city: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Bewerbungen"
        subtitle="Deine Bewerbungen auf offene Pensen und deren Status."
      />

      {applications.length === 0 ? (
        <EmptyState
          title="Noch keine Bewerbungen"
          description="Stöbere durch die offenen Pensen in deinem Umkreis und bewirb dich auf passende Anfragen."
          action={<ButtonLink href="/tutor/pensen">Offene Pensen ansehen</ButtonLink>}
        />
      ) : (
        <Table>
          <THead>
            <tr>
              <TH>Fach</TH>
              <TH>Ort</TH>
              <TH>Datum</TH>
              <TH>Status</TH>
              <TH>Nachricht</TH>
              <TH className="text-right">Aktion</TH>
            </tr>
          </THead>
          <TBody>
            {applications.map((a) => (
              <TR key={a.id}>
                <TD className="whitespace-nowrap font-medium text-ink">
                  {getSubject(a.pensum.subject)?.name ?? a.pensum.subject}
                </TD>
                <TD className="whitespace-nowrap">
                  {a.pensum.plz} {a.pensum.city}
                </TD>
                <TD className="whitespace-nowrap">{formatDate(a.createdAt)}</TD>
                <TD>
                  <StatusBadge status={a.status} />
                </TD>
                <TD>
                  <p className="max-w-xs truncate text-xs" title={a.message}>
                    {a.message}
                  </p>
                </TD>
                <TD className="text-right">
                  {a.status === "PENDING" ? <WithdrawButton applicationId={a.id} /> : null}
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
}
