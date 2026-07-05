// Abrechnung: Payout-Historie, laufender Monat (Schätzung), IBAN (maskiert).

import { Info, Landmark } from "lucide-react";
import Link from "next/link";
import { requirePageUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { roundTo5Rappen } from "@/lib/swiss";
import { chf, currentMonth, monthLabel, monthRange, minutesLabel } from "@/lib/format";
import {
  PageHeader,
  Card,
  CardHeader,
  CardBody,
  Table,
  THead,
  TH,
  TBody,
  TR,
  TD,
  Badge,
  EmptyState,
} from "@/components/ui";

export const metadata = { title: "Abrechnung" };

function maskIban(iban: string): string {
  const clean = iban.replace(/\s+/g, "").toUpperCase();
  if (clean.length <= 4) return clean;
  const masked = "•".repeat(clean.length - 4) + clean.slice(-4);
  return masked.replace(/(.{4})/g, "$1 ").trim();
}

export default async function AbrechnungPage() {
  const user = await requirePageUser("TUTOR");
  const { year, month } = currentMonth();
  const { start, end } = monthRange(year, month);

  const [payouts, monthEntries] = await Promise.all([
    prisma.payout.findMany({
      where: { tutorId: user.id },
      orderBy: [{ year: "desc" }, { month: "desc" }],
    }),
    prisma.timeEntry.findMany({
      where: { tutorId: user.id, date: { gte: start, lt: end } },
      include: { contract: { select: { rateTutor: true } } },
    }),
  ]);

  const runningMinutes = monthEntries.reduce((sum, e) => sum + e.minutes, 0);
  const runningAmount = roundTo5Rappen(
    monthEntries.reduce((sum, e) => sum + Math.round((e.minutes * e.contract.rateTutor) / 60), 0)
  );
  // Laufenden Monat nicht doppelt zeigen, falls bereits ein Payout existiert.
  const hasCurrentPayout = payouts.some((p) => p.year === year && p.month === month);

  return (
    <div>
      <PageHeader
        title="Abrechnung"
        subtitle="Deine monatlichen Auszahlungen im Überblick."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {payouts.length === 0 && runningMinutes === 0 ? (
            <EmptyState
              title="Noch keine Auszahlungen"
              description="Sobald du Stunden erfasst hast und der Monat abgeschlossen wird, erscheint deine Auszahlung hier."
            />
          ) : (
            <Table>
              <THead>
                <tr>
                  <TH>Monat</TH>
                  <TH className="text-right">Stunden</TH>
                  <TH className="text-right">Betrag</TH>
                  <TH>Status</TH>
                </tr>
              </THead>
              <TBody>
                {!hasCurrentPayout ? (
                  <TR>
                    <TD className="whitespace-nowrap text-ink">
                      {monthLabel(year, month)}
                      <span className="ml-2 text-xs text-faint">laufend</span>
                    </TD>
                    <TD className="text-right tabular-nums">{minutesLabel(runningMinutes)}</TD>
                    <TD className="text-right tabular-nums">{chf(runningAmount)}</TD>
                    <TD>
                      <Badge tone="accent">Laufend (Schätzung)</Badge>
                    </TD>
                  </TR>
                ) : null}
                {payouts.map((p) => (
                  <TR key={p.id}>
                    <TD className="whitespace-nowrap text-ink">{monthLabel(p.year, p.month)}</TD>
                    <TD className="text-right tabular-nums">{minutesLabel(p.minutes)}</TD>
                    <TD className="text-right tabular-nums text-ink">{chf(p.amount)}</TD>
                    <TD>
                      {p.status === "PAID" ? (
                        <Badge tone="ok">Ausbezahlt</Badge>
                      ) : (
                        <Badge tone="warn">In Auszahlung</Badge>
                      )}
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Auszahlungskonto" />
            <CardBody>
              {user.iban ? (
                <p className="flex items-center gap-2.5 font-mono text-sm tracking-wide text-ink">
                  <Landmark size={15} className="shrink-0 text-faint" />
                  {maskIban(user.iban)}
                </p>
              ) : (
                <p className="text-sm text-mute">
                  Noch keine IBAN hinterlegt —{" "}
                  <Link href="/tutor/profil" className="text-accent hover:underline">
                    jetzt im Profil ergänzen
                  </Link>
                  , damit wir auszahlen können.
                </p>
              )}
            </CardBody>
          </Card>

          <Card className="border-accent/20 bg-accent-soft/20">
            <CardBody className="flex items-start gap-3">
              <Info size={16} className="mt-0.5 shrink-0 text-accent" />
              <p className="text-xs leading-relaxed text-mute">
                Die Auszahlung erfolgt nach Monatsabschluss, jeweils Anfang Monat. Der laufende
                Monat ist eine Schätzung auf Basis deiner erfassten Stunden.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
