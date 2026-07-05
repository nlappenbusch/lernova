// Rechnungs-Detail: Positionen, QR-Referenz, Kunde, Mahnhistorie, Aktionen.

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/db";
import { chf, formatDate, monthLabel } from "@/lib/format";
import { formatQrReference } from "@/lib/swiss";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  PageHeader,
  StatusBadge,
  Table,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "@/components/ui";
import { ActionButton } from "@/components/admin/ActionButton";

const pdfLinkCls =
  "inline-flex items-center gap-1 whitespace-nowrap rounded-lg border border-edge px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-accent/50 hover:bg-accent-soft/40";

export default async function RechnungDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      items: { orderBy: { date: "asc" } },
      dunnings: { orderBy: { level: "asc" } },
      contract: {
        include: {
          pensum: true,
          tutor: { select: { id: true, name: true } },
        },
      },
    },
  });
  if (!invoice) notFound();

  const now = new Date();
  const overdue = invoice.status === "OPEN" && invoice.dueDate < now;
  const itemsTotal = invoice.items.reduce((s, i) => s + i.amount, 0);

  return (
    <>
      <Link
        href="/admin/rechnungen"
        className="mb-4 inline-flex items-center gap-1.5 text-xs text-mute transition-colors hover:text-ink"
      >
        <ArrowLeft size={13} /> Zurück zu den Rechnungen
      </Link>

      <PageHeader
        title={
          <span className="flex items-center gap-3">
            Rechnung {invoice.number}
            <StatusBadge status={invoice.status} />
            {overdue ? <Badge tone="danger">Überfällig</Badge> : null}
          </span>
        }
        subtitle={`Leistungsmonat ${monthLabel(invoice.year, invoice.month)} · ${invoice.contract.pensum.customerName}`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`/api/admin/invoices/${invoice.id}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className={pdfLinkCls}
            >
              PDF <ExternalLink size={11} />
            </a>
            {invoice.status === "OPEN" ? (
              <>
                <ActionButton
                  url={`/api/admin/invoices/${invoice.id}`}
                  method="PATCH"
                  body={{ action: "markPaid" }}
                  label="Als bezahlt markieren"
                  variant="primary"
                />
                <ActionButton
                  url={`/api/admin/invoices/${invoice.id}`}
                  method="PATCH"
                  body={{ action: "cancel" }}
                  confirmText={`Rechnung ${invoice.number} wirklich stornieren?`}
                  label="Stornieren"
                  variant="danger"
                />
              </>
            ) : null}
          </div>
        }
      />

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Rechnungsdaten" />
          <CardBody>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-mute">Betrag</dt>
                <dd className="text-lg font-bold tabular-nums text-ink">{chf(invoice.amount)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-mute">Ausgestellt</dt>
                <dd className="text-ink">{formatDate(invoice.issueDate)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-mute">Fällig</dt>
                <dd className={overdue ? "font-medium text-danger" : "text-ink"}>
                  {formatDate(invoice.dueDate)}
                </dd>
              </div>
              {invoice.paidAt ? (
                <div className="flex items-center justify-between">
                  <dt className="text-mute">Bezahlt am</dt>
                  <dd className="font-medium text-ok">{formatDate(invoice.paidAt)}</dd>
                </div>
              ) : null}
              <div className="border-t border-edge-soft pt-3">
                <dt className="text-xs text-faint">QR-Referenz</dt>
                <dd className="mt-1 font-mono text-xs text-ink">
                  {formatQrReference(invoice.reference)}
                </dd>
              </div>
            </dl>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Kunde & Vertrag" />
          <CardBody>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs text-faint">Kunde</dt>
                <dd className="mt-0.5 font-medium text-ink">{invoice.contract.pensum.customerName}</dd>
              </div>
              <div>
                <dt className="text-xs text-faint">E-Mail</dt>
                <dd className="mt-0.5 text-mute">{invoice.contract.pensum.customerEmail}</dd>
              </div>
              <div>
                <dt className="text-xs text-faint">Adresse</dt>
                <dd className="mt-0.5 text-mute">
                  {invoice.contract.pensum.street ? `${invoice.contract.pensum.street}, ` : ""}
                  {invoice.contract.pensum.plz} {invoice.contract.pensum.city}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-faint">Vertrag</dt>
                <dd className="mt-0.5">
                  <Link
                    href={`/admin/vertraege/${invoice.contractId}`}
                    className="text-accent hover:underline"
                  >
                    Zum Vertrag (Tutor:in {invoice.contract.tutor.name})
                  </Link>
                </dd>
              </div>
            </dl>
          </CardBody>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader title="Positionen" subtitle={`${invoice.items.length} Positionen`} />
        <div className="p-4">
          <Table>
            <THead>
              <tr>
                <TH>Datum</TH>
                <TH>Beschreibung</TH>
                <TH className="text-right">Minuten</TH>
                <TH className="text-right">Ansatz / h</TH>
                <TH className="text-right">Betrag</TH>
              </tr>
            </THead>
            <TBody>
              {invoice.items.map((item) => (
                <TR key={item.id}>
                  <TD className="whitespace-nowrap">{formatDate(item.date)}</TD>
                  <TD>{item.description}</TD>
                  <TD className="text-right tabular-nums">{item.minutes}</TD>
                  <TD className="text-right tabular-nums">{chf(item.rate)}</TD>
                  <TD className="text-right tabular-nums">{chf(item.amount)}</TD>
                </TR>
              ))}
              <TR className="bg-surface">
                <TD className="font-semibold text-ink">Total</TD>
                <TD />
                <TD />
                <TD className="text-right text-xs text-faint">inkl. 5-Rappen-Rundung</TD>
                <TD className="text-right font-semibold tabular-nums text-ink">
                  {chf(invoice.amount)}
                  {itemsTotal !== invoice.amount ? (
                    <span className="block text-[10px] font-normal text-faint">
                      Positionen: {chf(itemsTotal)}
                    </span>
                  ) : null}
                </TD>
              </TR>
            </TBody>
          </Table>
        </div>
      </Card>

      <Card>
        <CardHeader title="Mahnhistorie" />
        <CardBody>
          {invoice.dunnings.length === 0 ? (
            <p className="text-sm text-mute">Keine Mahnungen verschickt.</p>
          ) : (
            <ul className="space-y-2">
              {invoice.dunnings.map((d) => (
                <li key={d.id} className="flex items-center gap-3 text-sm">
                  <Badge tone={d.level >= 3 ? "danger" : "warn"}>Mahnstufe {d.level}</Badge>
                  <span className="text-mute">verschickt am {formatDate(d.sentAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </>
  );
}
