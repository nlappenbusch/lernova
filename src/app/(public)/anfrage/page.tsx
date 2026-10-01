// Lead-Formular-Seite mit Prefill aus searchParams (fach, stufe, ort).

import type { Metadata } from "next";
import { BadgeCheck, Clock, ShieldCheck, Sparkles } from "lucide-react";
import { getLevel, getSubject } from "@/lib/subjects";
import { findBySlug } from "@/lib/plz";
import { LeadForm } from "@/components/public/LeadForm";

export const metadata: Metadata = {
  title: "Nachhilfe anfragen",
  description:
    "Stellen Sie Ihre unverbindliche Nachhilfe-Anfrage in 2 Minuten: Fach, Stufe, PLZ — wir melden uns innert 24 Stunden mit einem passenden Vorschlag aus Ihrer Region.",
  robots: { index: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AnfragePage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;

  const fachParam = typeof sp.fach === "string" ? sp.fach : "";
  const stufeParam = typeof sp.stufe === "string" ? sp.stufe : "";
  const ortParam = typeof sp.ort === "string" ? sp.ort : "";

  const subject = getSubject(fachParam);
  const level = getLevel(stufeParam);
  const city = ortParam ? findBySlug(ortParam) : undefined;

  return (
    <div className="hero-glow min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-700">
            <Sparkles className="h-3.5 w-3.5" />
            Nachhilfe in 24h
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">
            Nachhilfe anfragen.
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-mute sm:text-base">
            Drei kurze Schritte — unverbindlich und kostenlos. Wir finden dir die passende
            Lehrperson in deiner Region.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative overflow-hidden rounded-[26px] bg-slate-950 p-6 text-white shadow-card-lg md:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.35),transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(45,212,191,0.2),transparent_34%)]" />
            <div className="relative flex h-full flex-col justify-between gap-8">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-300">
                  Warum Lernova
                </p>
                <h2 className="mt-4 max-w-md font-display text-2xl font-bold leading-tight md:text-3xl">
                  Starten ohne Aufwand, mit klarem Match und transparentem Ablauf.
                </h2>
              </div>

              <div className="space-y-3">
                {[
                  { icon: Clock, text: "Antwort innerhalb von 24 Stunden" },
                  { icon: ShieldCheck, text: "Geprüfte Tutor:innen mit Fachkompetenz" },
                  { icon: BadgeCheck, text: "Ohne Abo, ohne Mindestlaufzeit" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 backdrop-blur-sm">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20 text-violet-200">
                      <item.icon className="h-4 w-4" aria-hidden />
                    </span>
                    {item.text}
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-300">
                  Typischer Weg
                </p>
                <div className="mt-3 space-y-2 text-sm text-slate-200">
                  <div className="flex items-center justify-between gap-4">
                    <span>1. Fach + Stufe wählen</span>
                    <span className="text-violet-300">✓</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>2. PLZ + Lernbedarf eingeben</span>
                    <span className="text-violet-300">✓</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>3. Match + erste Lektion planen</span>
                    <span className="text-violet-300">✓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full">
            <LeadForm
              initialSubject={subject?.slug ?? ""}
              initialLevel={level?.slug ?? ""}
              initialPlz={city?.plz ?? ""}
              initialCity={city?.name ?? ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
