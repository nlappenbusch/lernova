"use client";

// Aktiv-Schalter für Tutor:innen (PATCH /api/admin/tutors/[id]).

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/components/ui";

export function TutorActiveToggle({ tutorId, active }: { tutorId: string; active: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/tutors/${tutorId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !active }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error || "Fehler");
        return;
      }
      router.refresh();
    } catch {
      setError("Netzwerkfehler");
    } finally {
      setLoading(false);
    }
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={active}
        aria-label={active ? "Tutor:in deaktivieren" : "Tutor:in aktivieren"}
        onClick={toggle}
        disabled={loading}
        className={cn(
          "relative h-5 w-9 rounded-full transition-colors disabled:opacity-50",
          active ? "bg-ok" : "bg-edge"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0 h-4 w-4 rounded-full bg-white transition-transform",
            active ? "translate-x-[18px]" : "translate-x-0.5"
          )}
        />
      </button>
      {error ? <span className="text-[11px] text-danger">{error}</span> : null}
    </span>
  );
}
