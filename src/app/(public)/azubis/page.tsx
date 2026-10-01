import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Briefcase, Code2, Users } from "lucide-react";
import { ButtonLink, Card } from "@/components/ui";

export const metadata: Metadata = {
  title: "Azubis & Mitarbeitende | Lernova",
  description: "Praxisnahe Weiterbildung, Berufseinstieg und ICT-Kompetenz für Azubis, neue Mitarbeitende und berufsbegleitende Lernende.",
  alternates: { canonical: "/azubis" },
};

const PROGRAMS = [
  { title: "Berufseinstieg ICT", text: "Einstieg in digitale Abläufe, IT-Grundlagen, Geschäftsprozesse und Berufskompetenz im Betrieb.", icon: Code2 },
  { title: "Mitarbeitende mit Fokus auf Praxis", text: "Einfach verständliche Schulungen für Personen im Alltag mit Microsoft, Dokumentation, Daten und Tools.", icon: Users },
  { title: "Berufsbegleitende Lernwege", text: "Ein strukturierter Lernpfad mit klaren Kompetenzen, kleinen Zielen und nachvollziehbarer Begleitung.", icon: BookOpen },
  { title: "Betriebsnahe Begleitung", text: "Kurse mit Bezug auf reale Aufgaben, Lernziele und die Anforderungen am Arbeitsplatz.", icon: Briefcase },
];

export default function AzubisPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Azubis &amp; Mitarbeitende</p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">
          Beruflicher Einstieg mit klaren Kompetenzen.
        </h1>
        <p className="mt-5 text-base leading-relaxed text-mute sm:text-lg">
          Für Auszubildende, neue Mitarbeitende und berufsbegleitende Lernende bauen wir nachhaltige
          ICT-Kompetenzen auf — mit klaren Lernzielen, realen Aufgaben und verständlicher Begleitung.
          Wir trennen dabei zwischen Berufseinstieg, Arbeit im Alltag und berufsbegleitender Weiterbildung,
          damit der Lernweg immer verständlich bleibt.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="rounded-full border border-accent/20 bg-accent-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">
            1. Berufseinstieg ICT
          </span>
          <span className="rounded-full border border-edge bg-card px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-faint">
            2. Mitarbeitende &amp; Alltag
          </span>
          <span className="rounded-full border border-edge bg-card px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-faint">
            3. Lernpfade &amp; Begleitung
          </span>
        </div>
        <div className="mt-8">
          <ButtonLink href="/anfrage" size="lg">
            Lernweg anfragen
            <ArrowRight className="h-4 w-4" aria-hidden />
          </ButtonLink>
        </div>
      </div>

      <div className="mt-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">Bereich 1–3</p>
        <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">
          Was in diesem Angebot enthalten ist
        </h2>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {PROGRAMS.map(({ title, text, icon: Icon }) => (
          <Card key={title} className="p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft">
              <Icon className="h-5 w-5 text-accent" aria-hidden />
            </div>
            <h2 className="mt-4 text-xl font-bold tracking-tight text-ink">{title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-mute">{text}</p>
          </Card>
        ))}
      </div>

      <div className="mt-12">
        <Link href="/weiterbildung" className="inline-flex items-center gap-2 text-sm font-medium text-accent">
          Zur Überblicksseite
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
