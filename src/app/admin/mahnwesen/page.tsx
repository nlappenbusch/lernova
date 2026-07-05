// Mahnwesen: überfällige Rechnungen, Mahnlauf-Trigger, Stufen-Konfiguration, Mahn-Mail-Log.

import Link from "next/link";
import { prisma } from "@/lib/db";
import { config } from "@/lib/config";
import { chf, formatDate } from "@/lib/format";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  PageHeader,
  Table,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "@/components/ui";
import { DunningRunButton } from "@/components/admin/DunningRunButton";
import { formatDateTime } from "@/components/admin/utils";

export default async function MahnwesenPage() {
  const now = new Date();
  const [overdueInvoices, dunningMails] = await Promise.all([
    prisma.invoice.findMany({
      where: { status: "OPEN", dueDate: { lt: now } },
      include: {
        contract: { select: { pensum: { select: { customerName: true } } } },
        dunnings: { select: { level: true, sentAt: true }, orderBy: { level: "asc" } },
      },
      orderBy: { dueDate: "asc" },
    }),
    prisma.emailLog.findMany({
      where: { kind: { startsWith: "dunning" } },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const maxLevels = config.billing.dunningLevelDays.length;

  return (
    <>
      <PageHeader
        title="Mahnwesen"
        subtitle={`${overdueInvoices.length} überfällige Rechnungen`}
      />

      <div className="space-y-6">
        <Card>
          <CardHeader
            title="Überfällige Rechnungen"
            subtitle="Offene Rechnungen mit überschrittenem Fälligkeitsdatum"
            action={<DunningRunButton />}
          />
          {overdueInvoices.length === 0 ? (
            <CardBody>
              <EmptyState
                title="Keine überfälligen Rechnungen"
                description="Alle offenen Rechnungen sind innerhalb der Zahlungsfrist."
              />
            </CardBody>
          ) : (
            <div className="p-4">
              <Table>
                <THead>
                  <tr>
                    <TH>Nummer</TH>
                    <TH>Kunde</TH>
                    <TH className="text-right">Betrag</TH>
                    <TH>Fällig seit</TH>
                    <TH>Bisherige Mahnstufen</TH>
                    <TH>Nächste Stufe</TH>
                  </tr>
                </THead>
                <TBody>
                  {overdueInvoices.map((inv) => {
                    const daysOverdue = Math.floor(
                      (now.getTime() - inv.dueDate.getTime()) / 86_400_000
                    );
                    const maxLevel = inv.dunnings.reduce((m, d) => Math.max(m, d.level), 0);
                    const nextLevel = maxLevel + 1;
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
                        <TD className="text-right tabular-nums">{chf(inv.amount)}</TD>
                        <TD className="whitespace-nowrap">
                          {formatDate(inv.dueDate)}{" "}
                          <span className="text-danger">({daysOverdue} Tage)</span>
                        </TD>
                        <TD>
                          {inv.dunnings.length === 0 ? (
                            <span className="text-faint">—</span>
                          ) : (
                            <span className="flex flex-wrap gap-1">
                              {inv.dunnings.map((d) => (
                                <Badge key={d.level} tone={d.level >= 3 ? "danger" : "warn"}>
                                  Stufe {d.level}
                                </Badge>
                              ))}
                            </span>
                          )}
                        </TD>
                        <TD>
                          {nextLevel <= maxLevels ? (
                            <Badge tone="accent">Stufe {nextLevel}</Badge>
                          ) : (
                            <span className="text-xs text-faint">Alle Stufen verschickt</span>
                          )}
                        </TD>
                      </TR>
                    );
                  })}
                </TBody>
              </Table>
            </div>
          )}
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader
              title="Stufen-Konfiguration"
              subtitle="Tage nach Fälligkeit pro Mahnstufe"
            />
            <CardBody>
              <ul className="space-y-2">
                {config.billing.dunningLevelDays.map((days, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <Badge tone={i + 1 >= 3 ? "danger" : "warn"}>Mahnstufe {i + 1}</Badge>
                    <span className="text-mute">
                      ab {days} Tagen nach Fälligkeit
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[11px] text-faint">
                Zahlungsfrist: {config.billing.dueDays} Tage ab Rechnungsdatum. Pro Rechnung und
                Stufe wird höchstens eine Mahnung verschickt.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Letzte Mahn-Mails" subtitle="Aus dem E-Mail-Log" />
            {dunningMails.length === 0 ? (
              <CardBody>
                <p className="text-sm text-mute">Noch keine Mahn-Mails verschickt.</p>
              </CardBody>
            ) : (
              <ul className="divide-y divide-edge-soft">
                {dunningMails.map((m) => (
                  <li key={m.id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm text-ink">{m.subject}</p>
                      <p className="mt-0.5 text-xs text-faint">
                        {m.to} · {formatDateTime(m.createdAt)}
                      </p>
                    </div>
                    <span className="flex shrink-0 items-center gap-1.5">
                      <Badge tone="warn">{m.kind}</Badge>
                      {m.ok ? <Badge tone="ok">OK</Badge> : <Badge tone="danger">Fehler</Badge>}
                    </span>
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
