// Pensen-Übersicht mit Status-Filter-Tabs (searchParams).

import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { getLevel, getSubject } from "@/lib/subjects";
import { PENSUM_STATUS } from "@/lib/types";
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
import { FilterTabs } from "@/components/admin/FilterTabs";
import { spString } from "@/components/admin/utils";

const STATUS_LABELS: Record<string, string> = {
  OPEN: "Offen",
  MATCHED: "Vermittelt",
  CLOSED: "Abgeschlossen",
  CANCELLED: "Storniert",
};

export default async function PensenPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const statusParam = spString(sp.status) ?? "";
  const active = (PENSUM_STATUS as readonly string[]).includes(statusParam) ? statusParam : "alle";

  const [pensen, counts] = await Promise.all([
    prisma.pensum.findMany({
      where: active === "alle" ? {} : { status: active },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { applications: true } } },
    }),
    prisma.pensum.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  const countByStatus = new Map(counts.map((c) => [c.status, c._count._all]));
  const total = counts.reduce((s, c) => s + c._count._all, 0);

  const tabs = [
    { key: "alle", label: "Alle", href: "/admin/pensen", count: total },
    ...PENSUM_STATUS.map((s) => ({
      key: s,
      label: STATUS_LABELS[s] ?? s,
      href: `/admin/pensen?status=${s}`,
      count: countByStatus.get(s) ?? 0,
    })),
  ];

  return (
    <>
      <PageHeader title="Pensen" subtitle="Alle Nachhilfe-Anfragen (Leads) und ihr Vermittlungsstatus" />

      <FilterTabs items={tabs} activeKey={active} />

      {pensen.length === 0 ? (
        <EmptyState
          title="Keine Pensen gefunden"
          description="Für den gewählten Filter gibt es aktuell keine Einträge."
        />
      ) : (
        <Table>
          <THead>
            <tr>
              <TH>Erstellt</TH>
              <TH>Fach</TH>
              <TH>Stufe</TH>
              <TH>Kunde</TH>
              <TH>Ort</TH>
              <TH className="text-right">Bewerbungen</TH>
              <TH>Status</TH>
              <TH />
            </tr>
          </THead>
          <TBody>
            {pensen.map((p) => (
              <TR key={p.id}>
                <TD className="whitespace-nowrap">{formatDate(p.createdAt)}</TD>
                <TD className="font-medium text-ink">{getSubject(p.subject)?.name ?? p.subject}</TD>
                <TD>{getLevel(p.level)?.name ?? p.level}</TD>
                <TD>{p.customerName}</TD>
                <TD className="whitespace-nowrap">
                  {p.plz} {p.city}
                </TD>
                <TD className="text-right tabular-nums">{p._count.applications}</TD>
                <TD>
                  <StatusBadge status={p.status} />
                </TD>
                <TD className="text-right">
                  <ButtonLink href={`/admin/pensen/${p.id}`} variant="ghost" size="sm">
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
