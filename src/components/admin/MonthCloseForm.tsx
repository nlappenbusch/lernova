"use client";

// Monatsabschluss: Auswahl eines abschliessbaren Monats, Preview, Bestätigung,
// POST /api/admin/month-close, Ergebnis-Panel mit Summen.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button, Select } from "@/components/ui";
import { chf, minutesLabel } from "@/lib/format";

export type CloseableMonth = {
  year: number;
  month: number;
  label: string;
  entries: number;
  minutes: number;
  contracts: number;
};

type CloseResult = {
  year: number;
  month: number;
  invoicesCreated: number;
  payoutsCreated: number;
  invoiceTotal: number;
  payoutTotal: number;
};

export function MonthCloseForm({ options }: { options: CloseableMonth[] }) {
  const router = useRouter();
  const [key, setKey] = useState(options.length > 0 ? `${options[0].year}-${options[0].month}` : "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CloseResult | null>(null);
  const [resultLabel, setResultLabel] = useState("");

  const selected = options.find((o) => `${o.year}-${o.month}` === key) ?? null;

  async function close() {
    if (!selected) return;
    const msg =
      `${selected.label} abschliessen?\n\n` +
      `Dies erzeugt ${selected.contracts} Rechnung(en) und sperrt ` +
      `${selected.entries} Zeiteintrag/-einträge (${minutesLabel(selected.minutes)}) endgültig.`;
    if (!window.confirm(msg)) return;

    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/admin/month-close", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: selected.year, month: selected.month }),
      });
      const data = (await res.json().catch(() => null)) as
        | { error?: string; result?: CloseResult }
        | null;
      if (!res.ok || !data?.result) {
        setError(data?.error || "Monatsabschluss fehlgeschlagen");
        return;
      }
      setResult(data.result);
      setResultLabel(selected.label);
      router.refresh();
    } catch {
      setError("Netzwerkfehler — bitte erneut versuchen");
    } finally {
      setLoading(false);
    }
  }

  if (options.length === 0 && !result) {
    return (
      <p className="text-sm text-mute">
        Aktuell gibt es keine abschliessbaren Monate — alle vergangenen Monate mit Zeiteinträgen
        sind bereits abgeschlossen.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {options.length > 0 ? (
        <>
          <div className="flex flex-wrap items-end gap-3">
            <div className="w-full max-w-xs">
              <label className="mb-1.5 block text-xs font-medium text-mute">Monat</label>
              <Select value={key} onChange={(e) => setKey(e.target.value)}>
                {options.map((o) => (
                  <option key={`${o.year}-${o.month}`} value={`${o.year}-${o.month}`}>
                    {o.label} — {o.entries} Einträge
                  </option>
                ))}
              </Select>
            </div>
            <Button type="button" onClick={close} disabled={loading || !selected}>
              {loading ? "Wird abgeschlossen…" : "Monat abschliessen"}
            </Button>
          </div>

          {selected ? (
            <div className="rounded-lg border border-edge-soft bg-surface px-4 py-3 text-xs text-mute">
              <span className="font-medium text-ink">{selected.label}:</span>{" "}
              {selected.entries} nicht fakturierte Einträge · {minutesLabel(selected.minutes)} ·{" "}
              {selected.contracts} Verträge betroffen. Der Abschluss erzeugt pro Vertrag eine
              Rechnung und pro Tutor:in einen Payout; die Einträge werden gesperrt.
            </div>
          ) : null}
        </>
      ) : null}

      {error ? (
        <div className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="rounded-lg border border-ok/30 bg-ok/10 px-4 py-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-ok">
            <CheckCircle2 size={16} /> {resultLabel} erfolgreich abgeschlossen
          </p>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-xs text-mute">Rechnungen</dt>
              <dd className="font-semibold text-ink">{result.invoicesCreated}</dd>
            </div>
            <div>
              <dt className="text-xs text-mute">Rechnungssumme</dt>
              <dd className="font-semibold text-ink">{chf(result.invoiceTotal)}</dd>
            </div>
            <div>
              <dt className="text-xs text-mute">Payouts</dt>
              <dd className="font-semibold text-ink">{result.payoutsCreated}</dd>
            </div>
            <div>
              <dt className="text-xs text-mute">Payout-Summe</dt>
              <dd className="font-semibold text-ink">{chf(result.payoutTotal)}</dd>
            </div>
          </dl>
        </div>
      ) : null}
    </div>
  );
}
