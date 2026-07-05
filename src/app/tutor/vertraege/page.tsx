// Eigene Verträge: Fach, Kunde, Ort, Honorar, Start, Status, Stunden gesamt.

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { requirePageUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getSubject } from "@/lib/subjects";
import { chf, formatDate, minutesLabel } from "@/lib/format";
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

export const metadata = { title: "Verträge" };

export default async function VertraegePage() {
  const user = await requirePageUser("TUTOR");

  const contracts = await prisma.contract.findMany({
    where: { tutorId: user.id },
    include: {
      pensum: { select: { subject: true, customerName: true, plz: true, city: true } },
      timeEntries: { select: { minutes: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Verträge"
        subtitle="Deine vermittelten Nachhilfe-Verträge mit allen Eckdaten."
      />

      {contracts.length === 0 ? (
        <EmptyState
          title="Noch keine Verträge"
          description="Sobald eine deiner Bewerbungen angenommen wird, erscheint der Vertrag hier."
          action={<ButtonLink href="/tutor/pensen">Offene Pensen ansehen</ButtonLink>}
        />
      ) : (
        <Table>
          <THead>
            <tr>
              <TH>Fach</TH>
              <TH>Kunde</TH>
              <TH>Ort</TH>
              <TH className="text-right">Honorar</TH>
              <TH>Start</TH>
              <TH>Status</TH>
              <TH className="text-right">Stunden gesamt</TH>
              <TH />
            </tr>
          </THead>
          <TBody>
            {contracts.map((c) => {
              const totalMinutes = c.timeEntries.reduce((sum, e) => sum + e.minutes, 0);
              return (
                <TR key={c.id}>
                  <TD className="whitespace-nowrap font-medium text-ink">
                    <Link href={`/tutor/vertraege/${c.id}`} className="hover:text-accent">
                      {getSubject(c.pensum.subject)?.name ?? c.pensum.subject}
                    </Link>
                  </TD>
                  <TD className="whitespace-nowrap">{c.pensum.customerName}</TD>
                  <TD className="whitespace-nowrap">
                    {c.pensum.plz} {c.pensum.city}
                  </TD>
                  <TD className="whitespace-nowrap text-right tabular-nums text-ink">
                    {chf(c.rateTutor)}/h
                  </TD>
                  <TD className="whitespace-nowrap">{formatDate(c.startDate)}</TD>
                  <TD>
                    <StatusBadge status={c.status} />
                  </TD>
                  <TD className="text-right tabular-nums">{minutesLabel(totalMinutes)}</TD>
                  <TD className="text-right">
                    <Link
                      href={`/tutor/vertraege/${c.id}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
                    >
                      Details
                      <ArrowRight size={12} />
                    </Link>
                  </TD>
                </TR>
              );
            })}
          </TBody>
        </Table>
      )}
    </div>
  );
}
