"use client";

// Generischer Aktions-Button für Admin-Mutationen:
// fetch (POST/PATCH/DELETE) + optionale Bestätigung + router.refresh().

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

type Props = {
  url: string;
  method?: "POST" | "PATCH" | "DELETE";
  body?: Record<string, unknown>;
  /** Wenn gesetzt: window.confirm vor dem Ausführen. */
  confirmText?: string;
  label: string;
  loadingLabel?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function ActionButton({
  url,
  method = "POST",
  body,
  confirmText,
  label,
  loadingLabel,
  variant = "secondary",
  size = "sm",
  className,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    if (confirmText && !window.confirm(confirmText)) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error || "Aktion fehlgeschlagen");
        return;
      }
      router.refresh();
    } catch {
      setError("Netzwerkfehler — bitte erneut versuchen");
    } finally {
      setLoading(false);
    }
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <Button
        type="button"
        variant={variant}
        size={size}
        className={className}
        onClick={run}
        disabled={loading}
      >
        {loading ? (loadingLabel ?? "Bitte warten…") : label}
      </Button>
      {error ? <span className="text-[11px] text-danger">{error}</span> : null}
    </span>
  );
}
