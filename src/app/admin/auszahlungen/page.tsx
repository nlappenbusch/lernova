// Auszahlungen: Payouts pro Monat, Summenzeile, CSV-Export, "ausbezahlt" markieren.

import Link from "next/link";
import { Download } from "lucide-react";
import { prisma } from "@/lib/db";
import { chf, minutesLabel, monthLabel } from "@/lib/format";
import { formatIban } from "@/lib/swiss";
import {
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
import { MonthPicker } from "@/components/admin/MonthPicker";
import { ActionButton } from "@/components/admin/ActionButton";
import { parseMonthParams } from "@/components/admin/utils";

const csvLinkCls =
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-edge px-3 py-2 text-sm font-medium text-ink transition-colors hover:border-accent/50 hover:bg-accent-soft/40";

export default async function AuszahlungenPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const { year, month } = parseMonthParams(sp);

  const payouts = await prisma.payout.findMany({
    where: { year, month },
    include: { tutor: { select: { id: true, name: true, iban: true } } },
  });
  payouts.sort((a, b) => a.tutor.name.localeCompare(b.tutor.name, "de-CH"));

  const totalMinutes = payouts.reduce((s, p) => s + p.minutes, 0);
  const totalAmount = payouts.reduce((s, p) => s + p.amount, 0);

  return (
    <>
      <PageHeader
        title="Auszahlungen"
        subtitle={`Tutoren-Payouts im ${monthLabel(year, month)}`}
        action={
          <div className="flex flex-wrap items-center gap-3">
            <MonthPicker year={year} month={month} basePath="/admin/auszahlungen" />
            <a
              href={`/api/admin/payouts/export?year=${year}&month=${month}`}
              className={csvLinkCls}
            >
              <Download size={14} /> CSV exportieren
            </a>
          </div>
        }
      />

      {payouts.length === 0 ? (
        <EmptyState
          title="Keine Auszahlungen in diesem Monat"
          description="Payouts entstehen beim Monatsabschluss — pro Tutor:in und Monat einer."
        />
      ) : (
        <Table>
          <THead>
            <tr>
              <TH>Tutor:in</TH>
              <TH>IBAN</TH>
              <TH className="text-right">Stunden</TH>
              <TH className="text-right">Betrag</TH>
              <TH>Status</TH>
              <TH className="text-right">Aktion</TH>
            </tr>
          </THead>
          <TBody>
            {payouts.map((p) => (
              <TR key={p.id}>
                <TD>
                  <Link
                    href={`/admin/tutoren/${p.tutor.id}`}
                    className="font-medium text-ink hover:text-accent"
                  >
                    {p.tutor.name}
                  </Link>
                </TD>
                <TD className="whitespace-nowrap font-mono text-xs">
                  {p.tutor.iban ? formatIban(p.tutor.iban) : <span className="text-danger">fehlt</span>}
                </TD>
                <TD className="text-right tabular-nums">{minutesLabel(p.minutes)}</TD>
                <TD className="text-right tabular-nums">{chf(p.amount)}</TD>
                <TD>
                  <StatusBadge status={p.status} />
                </TD>
                <TD className="text-right">
                  {p.status === "PENDING" ? (
                    <ActionButton
                      url={`/api/admin/payouts/${p.id}`}
                      method="PATCH"
                      body={{ action: "markPaid" }}
                      label="Als ausbezahlt markieren"
                      variant="secondary"
                    />
                  ) : null}
                </TD>
              </TR>
            ))}
            <TR className="bg-surface">
              <TD className="font-semibold text-ink">Total</TD>
              <TD />
              <TD className="text-right font-semibold tabular-nums text-ink">
                {minutesLabel(totalMinutes)}
              </TD>
              <TD className="text-right font-semibold tabular-nums text-ink">{chf(totalAmount)}</TD>
              <TD />
              <TD />
            </TR>
          </TBody>
        </Table>
      )}
    </>
  );
}
