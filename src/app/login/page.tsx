"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Sparkles,
  UserRound,
  Wrench,
} from "lucide-react";
import { Button, Card, Field, Input } from "@/components/ui";
import { Logo, LogoMark } from "@/components/Logo";

const demoAccounts = [
  { label: "Admin", email: "admin@lernova.ch", password: "admin123!" },
  { label: "Tutor", email: "tutor@lernova.ch", password: "tutor123!" },
];

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

  const fillDemo = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError(null);
  };

  return (
    <div className="grid w-full max-w-6xl gap-6 rounded-[28px] border border-edge-soft bg-white/70 p-4 shadow-card-lg backdrop-blur-sm md:grid-cols-[1.05fr_0.95fr]">
      <div className="relative overflow-hidden rounded-[22px] bg-slate-950 p-6 text-white md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.35),transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(45,212,191,0.25),transparent_34%)]" />
        <div className="relative flex h-full flex-col justify-between gap-8">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium text-slate-200 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-violet-300" />
              Lernova Access
            </div>
            <h1 className="max-w-md font-display text-3xl font-bold leading-tight md:text-4xl">
              Dein Nachhilfe-Management, sicher und klar.
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-300">
              Tutor:innen, Admins und Buchhaltung arbeiten in einem zentralen System — mit transparentem Status, klaren Rollen und schnellen Workflows.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: ShieldCheck, label: "Sichere Session-basierte Authentifizierung" },
              { icon: UserRound, label: "Rollenbasiert: Admin und Tutor" },
              { icon: Wrench, label: "Pensen, Stunden, Mahnwesen und Abrechnung" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20 text-violet-200">
                  <Icon className="h-4 w-4" />
                </span>
                {label}
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-300">
              Demo-Logins
            </p>
            <div className="flex flex-wrap gap-2">
              {demoAccounts.map((demo) => (
                <button
                  key={demo.label}
                  type="button"
                  onClick={() => fillDemo(demo.email, demo.password)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/60 px-3 py-2 text-left text-xs text-slate-100 transition hover:border-violet-400/40 hover:bg-slate-800"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-500/20 text-violet-200">
                    {demo.label === "Admin" ? <ShieldCheck className="h-3 w-3" /> : <BriefcaseBusiness className="h-3 w-3" />}
                  </span>
                  {demo.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center rounded-[22px] bg-slate-50 p-4 md:p-8">
        <Card className="w-full max-w-md border-0 bg-transparent shadow-none">
          <div className="mb-8 flex flex-col items-center text-center">
            <Link href="/" className="mb-5 inline-flex opacity-90 transition-opacity hover:opacity-100">
              <Logo size={22} />
            </Link>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
              <LogoMark size={28} />
            </div>
            <h2 className="font-display text-2xl font-bold text-slate-900">Willkommen zurück</h2>
            <p className="mt-1 text-sm text-slate-500">Login für Tutor:innen und Administration</p>
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
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            ) : null}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              {loading ? "Anmeldung..." : "Anmelden"}
            </Button>
          </form>

          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-3 text-center text-xs text-slate-500">
            Noch kein Tutor-Account?{" "}
            <Link href="/fuer-tutoren" className="font-medium text-violet-700 hover:underline">
              Jetzt bewerben
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="hero-glow flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
