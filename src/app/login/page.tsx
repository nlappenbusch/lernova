"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button, Card, Field, Input } from "@/components/ui";
import { Logo, LogoMark } from "@/components/Logo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login fehlgeschlagen.");
        return;
      }
      const next = searchParams.get("next");
      router.push(next && next.startsWith("/") ? next : data.redirect);
      router.refresh();
    } catch {
      setError("Verbindungsfehler — bitte erneut versuchen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-sm p-8">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-3">
          <LogoMark size={44} />
        </div>
        <h1 className="font-display text-lg font-bold">Willkommen zurück</h1>
        <p className="mt-1 text-xs text-mute">
          Login für Tutor:innen und Administration
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="E-Mail">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@beispiel.ch"
            autoComplete="email"
            required
            autoFocus
          />
        </Field>
        <Field label="Passwort">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </Field>

        {error ? (
          <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
            {error}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Anmelden
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-faint">
        Noch kein Tutor-Account?{" "}
        <Link href="/fuer-tutoren" className="text-accent hover:underline">
          Jetzt bewerben
        </Link>
      </p>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <main className="hero-glow flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-6 flex justify-center opacity-90 transition-opacity hover:opacity-100">
          <Logo size={24} />
        </Link>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
