// Rechnungs-Übersicht mit Filter-Tabs (Alle/Offen/Überfällig/Bezahlt) und Aktionen.

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { prisma } from "@/lib/db";
import { chf, formatDate, monthLabel } from "@/lib/format";
import {
  Badge,
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
import { ActionButton } from "@/components/admin/ActionButton";
import { spString } from "@/components/admin/utils";

const pdfLinkCls =
  "inline-flex items-center gap-1 whitespace-nowrap rounded-lg border border-edge px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-accent/50 hover:bg-accent-soft/40";

export default async function RechnungenPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const filterParam = spString(sp.filter) ?? "alle";
  const filter = ["alle", "offen", "ueberfaellig", "bezahlt"].includes(filterParam)
    ? filterParam
    : "alle";

  const invoices = await prisma.invoice.findMany({
    include: {
      contract: { select: { pensum: { select: { customerName: true } } } },
      dunnings: { select: { level: true } },
    },
    orderBy: { issueDate: "desc" },
  });

  const now = new Date();
  const isOverdue = (inv: (typeof invoices)[number]) => inv.status === "OPEN" && inv.dueDate < now;

  const filtered = invoices.filter((inv) => {
    if (filter === "offen") return inv.status === "OPEN";
    if (filter === "ueberfaellig") return isOverdue(inv);
    if (filter === "bezahlt") return inv.status === "PAID";
    return true;
  });

  const tabs = [
    { key: "alle", label: "Alle", href: "/admin/rechnungen", count: invoices.length },
    {
      key: "offen",
      label: "Offen",
      href: "/admin/rechnungen?filter=offen",
      count: invoices.filter((i) => i.status === "OPEN").length,
    },
    {
      key: "ueberfaellig",
      label: "Überfällig",
      href: "/admin/rechnungen?filter=ueberfaellig",
      count: invoices.filter(isOverdue).length,
    },
    {
      key: "bezahlt",
      label: "Bezahlt",
      href: "/admin/rechnungen?filter=bezahlt",
      count: invoices.filter((i) => i.status === "PAID").length,
    },
  ];

  return (
    <>
      <PageHeader title="Rechnungen" subtitle="Kundenrechnungen aus den Monatsabschlüssen" />

      <FilterTabs items={tabs} activeKey={filter} />

      {filtered.length === 0 ? (
        <EmptyState
          title="Keine Rechnungen gefunden"
          description="Für den gewählten Filter gibt es aktuell keine Rechnungen."
        />
      ) : (
        <Table>
          <THead>
            <tr>
              <TH>Nummer</TH>
              <TH>Kunde</TH>
              <TH>Leistungsmonat</TH>
              <TH className="text-right">Betrag</TH>
              <TH>Fällig</TH>
              <TH>Status</TH>
              <TH className="text-right">Aktionen</TH>
            </tr>
          </THead>
          <TBody>
            {filtered.map((inv) => {
              const maxLevel = inv.dunnings.reduce((m, d) => Math.max(m, d.level), 0);
              return (
                <TR key={inv.id}>
                  <TD>
                    <Link
                      href={`/admin/rechnungen/${inv.id}`}
                      className="font-medium text-ink hover:text-accent"
                    >
                      {inv.number}
                    </Link>
                  </TD>
                  <TD>{inv.contract.pensum.customerName}</TD>
                  <TD className="whitespace-nowrap">{monthLabel(inv.year, inv.month)}</TD>
                  <TD className="text-right tabular-nums">{chf(inv.amount)}</TD>
                  <TD className="whitespace-nowrap">{formatDate(inv.dueDate)}</TD>
                  <TD>
                    <span className="flex flex-wrap items-center gap-1">
                      <StatusBadge status={inv.status} />
                      {isOverdue(inv) ? <Badge tone="danger">Überfällig</Badge> : null}
                      {maxLevel > 0 ? <Badge tone="warn">Mahnstufe {maxLevel}</Badge> : null}
                    </span>
                  </TD>
                  <TD>
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <a
                        href={`/api/admin/invoices/${inv.id}/pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={pdfLinkCls}
                      >
                        PDF <ExternalLink size={11} />
                      </a>
                      {inv.status === "OPEN" ? (
                        <>
                          <ActionButton
                            url={`/api/admin/invoices/${inv.id}`}
                            method="PATCH"
                            body={{ action: "markPaid" }}
                            label="Als bezahlt markieren"
                            variant="secondary"
                          />
                          <ActionButton
                            url={`/api/admin/invoices/${inv.id}`}
                            method="PATCH"
                            body={{ action: "cancel" }}
                            confirmText={`Rechnung ${inv.number} wirklich stornieren?`}
                            label="Stornieren"
                            variant="danger"
                          />
                        </>
                      ) : null}
                    </div>
                  </TD>
                </TR>
              );
            })}
          </TBody>
        </Table>
      )}
    </>
  );
}
