// Lead-Formular-Seite mit Prefill aus searchParams (fach, stufe, ort).

import type { Metadata } from "next";
import { ShieldCheck, Clock, BadgeCheck } from "lucide-react";
import { getSubject, getLevel } from "@/lib/subjects";
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
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Nachhilfe anfragen.
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-mute">
          Drei kurze Schritte — unverbindlich und kostenlos. Wir melden uns innert 24 Stunden mit
          einem konkreten Vorschlag.
        </p>
      </div>

      <div className="mt-10">
        <LeadForm
          initialSubject={subject?.slug ?? ""}
          initialLevel={level?.slug ?? ""}
          initialPlz={city?.plz ?? ""}
          initialCity={city?.name ?? ""}
        />
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          { icon: Clock, text: "Antwort innert 24 Stunden" },
          { icon: ShieldCheck, text: "Geprüfte Tutor:innen" },
          { icon: BadgeCheck, text: "Kein Abo, keine Gebühren" },
        ].map((item) => (
          <div
            key={item.text}
            className="flex items-center justify-center gap-2 rounded-lg border border-edge-soft bg-surface/50 px-3 py-2.5"
          >
            <item.icon className="h-4 w-4 shrink-0 text-accent2" aria-hidden />
            <span className="text-xs text-mute">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
