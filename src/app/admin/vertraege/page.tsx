// Vertrags-Übersicht: Fach, Kunde, Tutor, Raten, Start, Stunden gesamt, Status.

import Link from "next/link";
import { prisma } from "@/lib/db";
import { chf, formatDate, minutesLabel } from "@/lib/format";
import { getSubject } from "@/lib/subjects";
import {
  ButtonLink,
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

export default async function VertraegePage() {
  const [contracts, minuteSums] = await Promise.all([
    prisma.contract.findMany({
      include: {
        pensum: { select: { subject: true, customerName: true, plz: true, city: true } },
        tutor: { select: { id: true, name: true } },
      },
      orderBy: { startDate: "desc" },
    }),
    prisma.timeEntry.groupBy({ by: ["contractId"], _sum: { minutes: true } }),
  ]);

  const minutesByContract = new Map(minuteSums.map((m) => [m.contractId, m._sum.minutes ?? 0]));

  return (
    <>
      <PageHeader title="Verträge" subtitle={`${contracts.length} Verträge insgesamt`} />

      {contracts.length === 0 ? (
        <EmptyState
          title="Noch keine Verträge"
          description="Verträge entstehen automatisch, sobald eine Bewerbung angenommen wird."
        />
      ) : (
        <Table>
          <THead>
            <tr>
              <TH>Fach</TH>
              <TH>Kunde</TH>
              <TH>Tutor:in</TH>
              <TH>Raten (Kunde / Tutor)</TH>
              <TH>Start</TH>
              <TH className="text-right">Stunden gesamt</TH>
              <TH>Status</TH>
              <TH />
            </tr>
          </THead>
          <TBody>
            {contracts.map((c) => (
              <TR key={c.id}>
                <TD className="font-medium text-ink">
                  {getSubject(c.pensum.subject)?.name ?? c.pensum.subject}
                </TD>
                <TD>{c.pensum.customerName}</TD>
                <TD>
                  <Link href={`/admin/tutoren/${c.tutor.id}`} className="hover:text-ink">
                    {c.tutor.name}
                  </Link>
                </TD>
                <TD className="whitespace-nowrap tabular-nums">
                  {chf(c.rateCustomer)} / {chf(c.rateTutor)}
                </TD>
                <TD className="whitespace-nowrap">{formatDate(c.startDate)}</TD>
                <TD className="text-right tabular-nums">
                  {minutesLabel(minutesByContract.get(c.id) ?? 0)}
                </TD>
                <TD>
                  <StatusBadge status={c.status} />
                </TD>
                <TD className="text-right">
                  <ButtonLink href={`/admin/vertraege/${c.id}`} variant="ghost" size="sm">
                    Detail
                  </ButtonLink>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </>
  );
}
