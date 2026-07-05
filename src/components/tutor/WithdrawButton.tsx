"use client";

// Zurückziehen einer PENDING-Bewerbung (PATCH + router.refresh).

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Undo2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui";

export function WithdrawButton({ applicationId }: { applicationId: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function withdraw() {
    if (!window.confirm("Bewerbung wirklich zurückziehen?")) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/tutor/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "withdraw" }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Zurückziehen fehlgeschlagen.");
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unbekannter Fehler");
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button variant="outline" size="sm" onClick={() => void withdraw()} disabled={busy}>
        {busy ? <Loader2 size={13} className="animate-spin" /> : <Undo2 size={13} />}
        Zurückziehen
      </Button>
      {error ? <p className="text-[11px] text-danger">{error}</p> : null}
    </div>
  );
}
