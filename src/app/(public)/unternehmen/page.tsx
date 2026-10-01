import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Briefcase, Cloud, ShieldCheck, Sparkles } from "lucide-react";
import { ButtonLink, Card } from "@/components/ui";

export const metadata: Metadata = {
  title: "IT-Schulungen für Unternehmen | Lernova",
  description: "Microsoft 365, Azure, Security, Cloud und digitale Weiterbildung für Firmen, Teams und IT-Abteilungen.",
  alternates: { canonical: "/unternehmen" },
};

const PROGRAMS = [
  { title: "Microsoft 365 & Workflows", text: "Effizienter Einsatz von Teams, SharePoint, Excel, Power Platform und kollaborativen Workflows.", icon: Briefcase },
  { title: "Cloud & Azure", text: "Einführung in Azure, Grundlagen von Cloud-Services, Governance, Sicherheit und Betrieb.", icon: Cloud },
  { title: "Security & Resilience", text: "Cybersecurity, M365-Sicherheit, Identitäten, Zugriffsmodelle, Sensibilisierung und Risikomanagement.", icon: ShieldCheck },
  { title: "AI & digitale Transformation", text: "Praxisbezogene Schulungen für KI, Automatisierung, neue Prozesse und digitale Zusammenarbeit.", icon: Sparkles },
];

export default function UnternehmenPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Für Unternehmen</p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">
          IT-Schulungen, die zum Betrieb passen.
        </h1>
        <p className="mt-5 text-base leading-relaxed text-mute sm:text-lg">
          Wir entwickeln und vermitteln Schulungen für Mitarbeitende, Teams und IT-Abteilungen —
          praxisnah, verständlich und im realen Schweizer Arbeitskontext verankert. Unser Angebot ist
          bewusst in klar getrennte Bereiche gegliedert: Mitarbeitende, Cloud &amp; Infrastruktur und
          Security &amp; Transformation.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="rounded-full border border-accent/20 bg-accent-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">
            1. Mitarbeitende
          </span>
          <span className="rounded-full border border-edge bg-card px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-faint">
            2. Cloud &amp; Azure
          </span>
          <span className="rounded-full border border-edge bg-card px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-faint">
            3. Security &amp; AI
          </span>
        </div>
        <div className="mt-8">
          <ButtonLink href="/anfrage" size="lg">
            Angebot für Ihr Unternehmen
            <ArrowRight className="h-4 w-4" aria-hidden />
          </ButtonLink>
        </div>
      </div>

      <div className="mt-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">Bereich 1–3</p>
        <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">
          Teilbereiche unseres Unternehmensangebots
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

      <div className="mt-12 rounded-2xl border border-edge-soft bg-card p-6 shadow-card">
        <h2 className="font-display text-2xl font-bold tracking-tight text-ink">Typische Formate</h2>
        <ul className="mt-5 space-y-3 text-sm leading-relaxed text-mute">
          <li>• Kickoff-Seminare für neue Mitarbeitende und Teams</li>
          <li>• Betriebsnahe Workshops zu Microsoft 365, Security und Cloud</li>
          <li>• Team- und Abteilungs-Seminare mit Praxisbeispielen</li>
          <li>• Coaching für interne Wissensvermittlung und digitale Transformation</li>
        </ul>
        <div className="mt-6">
          <Link href="/weiterbildung" className="inline-flex items-center gap-2 text-sm font-medium text-accent">
            Zurück zur Übersicht
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}
