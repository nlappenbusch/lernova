import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Briefcase, Building2, GraduationCap, Sparkles } from "lucide-react";
import { ButtonLink, Card } from "@/components/ui";

export const metadata: Metadata = {
  title: "Weiterbildung & IT-Schulungen | Lernova",
  description:
    "Unternehmensschulungen, Mitarbeiter-Weiterbildung, Azubi-Programme und Trainer-Ausbildung für ICT, Microsoft und digitale Kompetenzen.",
  alternates: { canonical: "/weiterbildung" },
};

const GROUPS = [
  {
    title: "Microsoft & Zertifizierungen",
    text: "Microsoft 365, Endpoint Administration, Security, AI-Workflows und praxisnahe Zertifizierungs- und Intensivschulungen.",
    href: "/microsoft",
    icon: Sparkles,
  },
  {
    title: "Für Unternehmen",
    text: "Microsoft 365, Azure, Security, Cloud, AI und digitale Arbeitsprozesse für Teams, Führungskräfte und IT-Abteilungen.",
    href: "/unternehmen",
    icon: Building2,
  },
  {
    title: "Für Mitarbeitende & Azubis",
    text: "Praxisnahe Weiterbildung für neue Mitarbeitende, Auszubildende und bestehende Teams mit klaren Lernpfaden und Projekten.",
    href: "/azubis",
    icon: GraduationCap,
  },
  {
    title: "Für Trainer & MCT",
    text: "Train-the-Trainer, MCT-Qualifizierung, didaktische Methodik und professionelle Schulungskompetenz für interne Wissensweitergabe.",
    href: "/trainer",
    icon: Sparkles,
  },
];

export default function WeiterbildungPage() {
  return (
    <>
      <section className="hero-glow border-b border-edge-soft">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">Weiterbildung</p>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">
              Mehr als Nachhilfe. Ausbildung, Weiterbildung und Schulung für die IT-Welt.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-mute sm:text-lg">
              Wir begleiten Lernende, Mitarbeitende, Azubis, Unternehmen und Trainer:innen mit
              praxisnahen Programmen für ICT, Microsoft, digitale Arbeitsprozesse und pädagogische
              Wissensvermittlung.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/anfrage" size="lg">
                Angebot anfragen
                <ArrowRight className="h-4 w-4" aria-hidden />
              </ButtonLink>
              <ButtonLink href="/unternehmen" variant="outline" size="lg">
                Für Unternehmen
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {GROUPS.map(({ title, text, href, icon: Icon }) => (
            <Link key={title} href={href} className="group block h-full">
              <Card className="h-full p-6 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-accent/30 group-hover:shadow-card-lg">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft">
                  <Icon className="h-5 w-5 text-accent" aria-hidden />
                </div>
                <h2 className="mt-4 text-xl font-bold tracking-tight text-ink">{title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-mute">{text}</p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                  Mehr erfahren
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <section className="mt-16 rounded-2xl border border-edge-soft bg-card p-6 shadow-card sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft">
              <Briefcase className="h-5 w-5 text-accent" aria-hidden />
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
              Warum Lernova für Weiterbildung?
            </h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Card className="p-5">
              <h3 className="text-base font-semibold text-ink">Praxisnah</h3>
              <p className="mt-2 text-sm leading-relaxed text-mute">
                Inhalte basieren auf realen ICT-Anforderungen, echten Schulungszielen und beruflicher Praxis.
              </p>
            </Card>
            <Card className="p-5">
              <h3 className="text-base font-semibold text-ink">Sauber strukturiert</h3>
              <p className="mt-2 text-sm leading-relaxed text-mute">
                Lernpfade, Ziele, Zeitrahmen und Kompetenzabgleich sind klar nachvollziehbar.
              </p>
            </Card>
            <Card className="p-5">
              <h3 className="text-base font-semibold text-ink">Schweizer Kontexte</h3>
              <p className="mt-2 text-sm leading-relaxed text-mute">
                Wir verstehen die Ausbildungspraxis, Arbeitgeberanforderungen und die Realität von Teams im Betrieb.
              </p>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
}
