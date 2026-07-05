// Recruiting-Seite fuer Tutor:innen — Ton: "du".

import type { Metadata } from "next";
import {
  ArrowRight,
  Banknote,
  CalendarClock,
  CircleCheck,
  GraduationCap,
  Mail,
  MapPin,
  NotebookPen,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: "Tutor:in werden — CHF 40–60 pro Stunde",
  description:
    "Unterrichte, was du kannst: ICT, Mathe, Sprachen. CHF 40–60 pro Stunde, flexible Pensen in deinem Umkreis, schnelle monatliche Auszahlung. Jetzt bei Lernova bewerben.",
  alternates: { canonical: "/fuer-tutoren" },
};

const BENEFITS = [
  {
    icon: Banknote,
    title: "CHF 40–60 pro Stunde",
    text: "Fair und transparent: Dein Honorar richtet sich nach Fach, Stufe und Erfahrung — und steht vor der ersten Lektion fest.",
  },
  {
    icon: MapPin,
    title: "Pensen in deinem Umkreis",
    text: "Du legst deinen Radius fest, wir matchen nur Anfragen, die du gut erreichst. Keine Pendelei quer durch den Kanton.",
  },
  {
    icon: CalendarClock,
    title: "Flexibel neben Studium & Job",
    text: "Eine Lektion pro Woche oder fünf: Du entscheidest, wie viele Pensen du übernimmst — und kannst jederzeit pausieren.",
  },
  {
    icon: Wallet,
    title: "Schnelle Auszahlung",
    text: "Stunden erfassen, fertig. Wir rechnen monatlich ab und zahlen dein Honorar direkt auf dein Konto aus — ohne Rennerei.",
  },
  {
    icon: NotebookPen,
    title: "Einfache Stundenerfassung",
    text: "Lektion protokollieren, Notizen festhalten — alles in deinem Portal. Rechnungen und Administration übernehmen wir.",
  },
  {
    icon: Users,
    title: "Du unterrichtest, wir machen den Rest",
    text: "Kundenakquise, Verträge, Inkasso, Mahnwesen: alles bei uns. Du konzentrierst dich aufs Erklären.",
  },
];

const STEPS = [
  {
    nr: "01",
    title: "Bewirb dich per Mail",
    text: "Kurz und formlos: Wer bist du, was unterrichtest du, wo wohnst du? Lebenslauf hilft, ist aber kein Muss.",
  },
  {
    nr: "02",
    title: "Kennenlern-Gespräch",
    text: "Wir reden 30 Minuten über deine Fächer, deine Erfahrung und wie du erklärst. Persönlich oder per Telefon.",
  },
  {
    nr: "03",
    title: "Profil & Matching",
    text: "Du legst Fächer, Stufen und Radius fest. Sobald eine passende Anfrage reinkommt, bekommst du sie in deinen Feed.",
  },
  {
    nr: "04",
    title: "Unterrichten & verdienen",
    text: "Du bewirbst dich auf Pensen, die dir passen. Nach jedem Monat rechnest du automatisch ab — Auszahlung folgt zügig.",
  },
];

const REQUIREMENTS = [
  "Du bist fachlich sattelfest — z. B. durch ICT-Lehre, Studium (Uni/ETH/FH) oder Berufspraxis.",
  "Du erklärst gern und geduldig — auf Augenhöhe, nicht von oben herab.",
  "Du bist zuverlässig: Termine gelten, Absagen kommen früh genug.",
  "Du bist im Umkreis deines Wohnorts mobil (ÖV reicht völlig).",
  "Du hast mindestens 2–3 Stunden pro Woche Zeit — mehr geht immer.",
];

export default function FuerTutorenPage() {
  const mailto = `mailto:${config.company.email}?subject=${encodeURIComponent(
    "Bewerbung als Tutor:in"
  )}&body=${encodeURIComponent(
    "Hallo Lernova-Team\n\nIch möchte Tutor:in werden.\n\nName:\nWohnort (PLZ/Ort):\nFächer:\nStufen (z. B. Sek, Gymnasium, Lernende EFZ):\nHintergrund (Ausbildung/Beruf):\nVerfügbarkeit:\n\nBeste Grüsse"
  )}`;

  return (
    <>
      {/* Hero */}
      <section className="hero-glow relative overflow-hidden">
        <div className="grid-pattern pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-24">
          <div className="max-w-2xl">
            <Badge tone="teal" className="px-3 py-1">
              <Sparkles className="h-3 w-3" aria-hidden />
              Wir suchen Tutor:innen in der ganzen Schweiz
            </Badge>
            <h1 className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
              Gib dein Wissen weiter — <span className="text-gradient">und verdiene fair dabei.</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-mute sm:text-lg">
              Du kannst Python erklären, Subnetting entwirren oder Analysis entzaubern? Dann
              unterrichte bei Lernova: CHF 40–60 pro Stunde, flexible Pensen in deinem Umkreis,
              null Administration.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={mailto}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-accent px-6 py-3 text-base font-medium text-white shadow-sm shadow-accent/25 transition-all duration-150 hover:-translate-y-px hover:bg-accent-deep hover:shadow-md hover:shadow-accent/25"
              >
                <Mail className="h-4 w-4" aria-hidden />
                Jetzt bewerben
              </a>
              <a
                href="#ablauf"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-edge bg-card px-6 py-3 text-base font-medium text-ink shadow-sm transition-all duration-150 hover:border-accent/50 hover:bg-accent-soft/40"
              >
                So läuft&rsquo;s ab
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-t border-edge-soft">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Was du davon hast.
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <Card
                key={benefit.title}
                className="h-full p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-card-lg"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent2/10">
                  <benefit.icon className="h-5 w-5 text-accent2" aria-hidden />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-ink">{benefit.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-mute">{benefit.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ablauf */}
      <section id="ablauf" className="grid-pattern border-t border-edge-soft bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Von der Bewerbung zur ersten Lektion.
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <div key={step.nr}>
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft font-display text-sm font-bold text-accent-deep">
                  {i + 1}
                </div>
                <h3 className="mt-4 text-sm font-semibold text-ink">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-mute">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Anforderungen */}
      <section className="border-t border-edge-soft">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                Was du mitbringst.
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-mute">
                Kein Lehrdiplom nötig — aber Fachwissen, Geduld und Verlässlichkeit. Besonders
                gesucht: Leute aus der ICT-Praxis, die Lernenden die Lehre leichter machen.
              </p>
              <ul className="mt-6 space-y-3">
                {REQUIREMENTS.map((req) => (
                  <li key={req} className="flex items-start gap-3">
                    <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-ok" aria-hidden />
                    <span className="text-sm text-mute">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Card className="flex h-full flex-col justify-center p-8 shadow-card-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft">
                <GraduationCap className="h-6 w-6 text-accent" aria-hidden />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-ink">
                Bereit? Schreib uns.
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-mute">
                Schick deine Bewerbung formlos an{" "}
                <a href={`mailto:${config.company.email}`} className="text-accent underline">
                  {config.company.email}
                </a>{" "}
                — wir melden uns innert weniger Tage für ein Kennenlern-Gespräch.
              </p>
              <a
                href={mailto}
                className="mt-6 inline-flex items-center justify-center gap-2 self-start whitespace-nowrap rounded-lg bg-accent px-6 py-3 text-base font-medium text-white shadow-sm shadow-accent/25 transition-all duration-150 hover:-translate-y-px hover:bg-accent-deep hover:shadow-md hover:shadow-accent/25"
              >
                Bewerbung starten
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
