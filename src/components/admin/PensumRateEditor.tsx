"use client";

// Raten-Editor für offene Pensen (PATCH /api/admin/pensen/[id]).
// Eingabe in CHF, gespeichert werden Rappen pro 60 Minuten.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Field, Input } from "@/components/ui";

function toRappen(input: string): number | null {
  const v = parseFloat(input.replace(",", "."));
  if (!Number.isFinite(v) || v <= 0 || v > 10000) return null;
  return Math.round(v * 100);
}

export function PensumRateEditor({
  pensumId,
  rateCustomer,
  rateTutor,
}: {
  pensumId: string;
  rateCustomer: number;
  rateTutor: number;
}) {
  const router = useRouter();
  const [customer, setCustomer] = useState((rateCustomer / 100).toFixed(2));
  const [tutor, setTutor] = useState((rateTutor / 100).toFixed(2));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function save() {
    const c = toRappen(customer);
    const t = toRappen(tutor);
    if (c === null || t === null) {
      setError("Bitte gültige Beträge in CHF eingeben.");
      return;
    }
    setLoading(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/pensen/${pensumId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rateCustomer: c, rateTutor: t }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error || "Speichern fehlgeschlagen");
        return;
      }
      setSaved(true);
      router.refresh();
    } catch {
      setError("Netzwerkfehler — bitte erneut versuchen");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Kundenrate (CHF/h)">
          <Input
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            inputMode="decimal"
          />
        </Field>
        <Field label="Tutor-Rate (CHF/h)">
          <Input value={tutor} onChange={(e) => setTutor(e.target.value)} inputMode="decimal" />
        </Field>
      </div>
      <div className="flex items-center gap-3">
        <Button type="button" size="sm" variant="secondary" onClick={save} disabled={loading}>
          {loading ? "Wird gespeichert…" : "Raten speichern"}
        </Button>
        {saved ? <span className="text-xs text-ok">Gespeichert.</span> : null}
      </div>
      {error ? <p className="text-xs text-danger">{error}</p> : null}
      <p className="text-[11px] text-faint">
        Editierbar, solange das Pensum offen ist. Bei der Vermittlung werden die Raten in den
        Vertrag übernommen.
      </p>
    </div>
  );
}
