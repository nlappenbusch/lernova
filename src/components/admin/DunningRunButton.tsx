"use client";

// Startet den Mahnlauf (POST /api/admin/dunning/run) und zeigt das Ergebnis an.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { Badge, Button } from "@/components/ui";

type RunResult = {
  checkedInvoices: number;
  dunningsSent: Array<{ invoiceNumber: string; level: number; to: string }>;
};

export function DunningRunButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RunResult | null>(null);

  async function run() {
    if (!window.confirm("Mahnlauf jetzt starten? Für alle fälligen Rechnungen wird die nächste Mahnstufe verschickt.")) {
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/admin/dunning/run", { method: "POST" });
      const data = (await res.json().catch(() => null)) as
        | { error?: string; result?: RunResult }
        | null;
      if (!res.ok || !data?.result) {
        setError(data?.error || "Mahnlauf fehlgeschlagen");
        return;
      }
      setResult(data.result);
      router.refresh();
    } catch {
      setError("Netzwerkfehler — bitte erneut versuchen");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <Button type="button" onClick={run} disabled={loading}>
        <Send size={14} />
        {loading ? "Mahnlauf läuft…" : "Mahnlauf jetzt starten"}
      </Button>

      {error ? (
        <div className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="rounded-lg border border-edge-soft bg-surface px-4 py-3">
          <p className="text-sm text-ink">
            <span className="font-semibold">{result.checkedInvoices}</span> Rechnungen geprüft,{" "}
            <span className="font-semibold">{result.dunningsSent.length}</span> Mahnungen
            verschickt.
          </p>
          {result.dunningsSent.length > 0 ? (
            <ul className="mt-2 space-y-1">
              {result.dunningsSent.map((d) => (
                <li key={`${d.invoiceNumber}-${d.level}`} className="flex items-center gap-2 text-xs text-mute">
                  <Badge tone="warn">Stufe {d.level}</Badge>
                  <span className="font-medium text-ink">{d.invoiceNumber}</span>
                  <span>→ {d.to}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
