import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookText, GraduationCap, PencilRuler, Sparkles } from "lucide-react";
import { ButtonLink, Card } from "@/components/ui";

export const metadata: Metadata = {
  title: "Trainer & MCT | Lernova",
  description: "Train-the-Trainer, MCT-Qualifizierung, didaktische Kompetenzen und professionelle Wissensvermittlung für interne Schulungen.",
  alternates: { canonical: "/trainer" },
};

const PROGRAMS = [
  { title: "MCT & Microsoft-Schulungskompetenz", text: "Ausbildung für Personen, die Microsoft-Inhalte professionell weitergeben wollen.", icon: Sparkles },
  { title: "Didaktischer Trainer", text: "Methodik, Moderation, Feedback, Lernziele und praxisnahe Gruppendynamik für gute Schulungen.", icon: PencilRuler },
  { title: "Train-the-Trainer", text: "Interne Wissensvermittlung mit strukturierter Vorbereitung, didaktischer Planung und moderationsstarker Durchführung.", icon: BookText },
  { title: "Schulungsdesign & Lernführung", text: "Von der Lernziele-Definition bis zur Umsetzung mit klaren Materialien, Struktur und Wirkung.", icon: GraduationCap },
];

export default function TrainerPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Trainer &amp; MCT</p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">
          Gute Schulungen brauchen gute Trainer:innen.
        </h1>
        <p className="mt-5 text-base leading-relaxed text-mute sm:text-lg">
          Für Unternehmen und Bildungsakteure entwickeln wir Formate, die fachliches Wissen und
          didaktische Kompetenz miteinander verbinden — klar, praxisnah und wirksam. Hier klar getrennt:
          fachliche Qualifizierung, didaktische Methodik und die Umsetzung in echte Trainingsangebote.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="rounded-full border border-accent/20 bg-accent-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">
            1. MCT &amp; Microsoft
          </span>
          <span className="rounded-full border border-edge bg-card px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-faint">
            2. Didaktik
          </span>
          <span className="rounded-full border border-edge bg-card px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-faint">
            3. Train-the-Trainer
          </span>
        </div>
        <div className="mt-8">
          <ButtonLink href="/anfrage" size="lg">
            Trainerprogramm anfragen
            <ArrowRight className="h-4 w-4" aria-hidden />
          </ButtonLink>
        </div>
      </div>

      <div className="mt-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">Bereich 1–3</p>
        <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">
          Die drei Säulen unserer Trainerqualifizierung
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
