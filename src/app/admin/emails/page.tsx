// E-Mail-Log: die letzten 100 versendeten (oder geloggten) Mails.

import { prisma } from "@/lib/db";
import {
  Badge,
  EmptyState,
  PageHeader,
  Table,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "@/components/ui";
import { formatDateTime } from "@/components/admin/utils";

function kindTone(kind: string): "warn" | "accent" | "ok" | "default" {
  if (kind.startsWith("dunning")) return "warn";
  if (kind === "invoice") return "accent";
  if (kind.includes("accept")) return "ok";
  return "default";
}

export default async function EmailsPage() {
  const logs = await prisma.emailLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <>
      <PageHeader
        title="E-Mail-Log"
        subtitle="Die letzten 100 System-Mails (Rechnungen, Mahnungen, Bestätigungen)"
      />

      {logs.length === 0 ? (
        <EmptyState
          title="Noch keine E-Mails"
          description="Sobald das System Mails verschickt oder loggt, erscheinen sie hier."
        />
      ) : (
        <Table>
          <THead>
            <tr>
              <TH>Datum</TH>
              <TH>Typ</TH>
              <TH>Empfänger</TH>
              <TH>Betreff</TH>
              <TH>Status</TH>
              <TH>Inhalt</TH>
            </tr>
          </THead>
          <TBody>
            {logs.map((m) => (
              <TR key={m.id}>
                <TD className="whitespace-nowrap">{formatDateTime(m.createdAt)}</TD>
                <TD>
                  <Badge tone={kindTone(m.kind)}>{m.kind}</Badge>
                </TD>
                <TD>{m.to}</TD>
                <TD className="max-w-xs truncate text-ink">{m.subject}</TD>
                <TD>
                  {m.ok ? (
                    <Badge tone="ok">OK</Badge>
                  ) : (
                    <span className="flex flex-col gap-1">
                      <Badge tone="danger">Fehler</Badge>
                      {m.error ? (
                        <span className="max-w-[200px] truncate text-[11px] text-danger" title={m.error}>
                          {m.error}
                        </span>
                      ) : null}
                    </span>
                  )}
                </TD>
                <TD className="max-w-md">
                  <details>
                    <summary className="cursor-pointer text-xs text-accent hover:underline">
                      Anzeigen
                    </summary>
                    <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg border border-edge-soft bg-surface p-3 text-xs leading-relaxed text-mute">
                      {m.body}
                    </pre>
                  </details>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </>
  );
}
