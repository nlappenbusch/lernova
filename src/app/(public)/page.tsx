// Landingpage — die Visitenkarte von Lernova.

import Link from "next/link";
import {
  ArrowRight,
  Backpack,
  Briefcase,
  CodeXml,
  GraduationCap,
  MapPin,
  NotebookPen,
  QrCode,
  ShieldCheck,
  Sparkles,
  University,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Badge, ButtonLink, Card } from "@/components/ui";
import { ICT_SUBJECTS, LEVELS, SCHOOL_SUBJECTS } from "@/lib/subjects";
import { config } from "@/lib/config";
import { chf } from "@/lib/format";
import { SubjectIcon } from "@/components/public/SubjectIcon";
import { Reveal } from "@/components/public/Reveal";
import { FaqAccordion, type FaqItem } from "@/components/public/FaqAccordion";
import { JsonLd } from "@/components/public/seo";

const LEVEL_ICONS: Record<string, LucideIcon> = {
  lernende: Wrench,
  sekundarschule: Backpack,
  gymnasium: GraduationCap,
  studierende: University,
  erwachsene: Briefcase,
};

const STATS = [
  { value: "500+", label: "vermittelte Pensen" },
  { value: "4.9/5", label: "Zufriedenheit" },
  { value: "26", label: "Kantone abgedeckt" },
];

const STEPS = [
  {
    nr: "01",
    title: "Anfrage stellen",
    text: "Sagen Sie uns in zwei Minuten, wer was lernen möchte — Fach, Stufe, PLZ. Unverbindlich und kostenlos.",
  },
  {
    nr: "02",
    title: "Wir matchen lokal",
    text: "Wir suchen geprüfte Tutor:innen in Ihrem Umkreis und melden uns innert 24 Stunden mit einem konkreten Vorschlag.",
  },
  {
    nr: "03",
    title: "Lernen & fair abrechnen",
    text: "Der Unterricht startet bei Ihnen vor Ort. Jede Lektion wird protokolliert — abgerechnet wird monatlich per Schweizer QR-Rechnung.",
  },
];

const USPS = [
  {
    icon: ShieldCheck,
    title: "Geprüft & lokal",
    text: "Jede:r Tutor:in durchläuft ein persönliches Gespräch und eine fachliche Prüfung. Vermittelt wird nur, wer wirklich in Ihrer Nähe unterrichtet.",
  },
  {
    icon: CodeXml,
    title: "ICT-Expertise aus der Praxis",
    text: "Unsere Tutor:innen haben die ICT-Lehre oder das Informatikstudium selbst durchlaufen — viele arbeiten heute in Schweizer Tech-Firmen.",
  },
  {
    icon: QrCode,
    title: "Faire, transparente Abrechnung",
    text: "Ein klarer Tarif, keine Abos, keine versteckten Kosten. Monatliche Sammelrechnung mit Schweizer QR-Einzahlungsschein.",
  },
  {
    icon: NotebookPen,
    title: "Nachvollziehbare Stundenprotokolle",
    text: "Nach jeder Lektion halten Tutor:innen fest, was erarbeitet wurde. Sie sehen jederzeit, wofür Sie bezahlen.",
  },
];

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Wie schnell finden wir eine:n passende:n Tutor:in?",
    a: "In der Regel melden wir uns innert 24 Stunden mit einem konkreten Vorschlag. Weil wir gezielt im Umkreis Ihrer PLZ matchen, klappt der Start meist innerhalb einer Woche.",
  },
  {
    q: "Was kostet Nachhilfe bei Lernova?",
    a: `Eine Lektion à 60 Minuten kostet ${chf(config.billing.defaultRateCustomer)} — ohne Anmeldegebühr, ohne Abo und ohne Mindestlaufzeit. Sie bezahlen nur die Lektionen, die tatsächlich stattgefunden haben.`,
  },
  {
    q: "Wo findet der Unterricht statt?",
    a: "Bei Ihnen zu Hause oder an einem vereinbarten Ort in Ihrer Nähe — zum Beispiel in der Bibliothek. Lernova ist bewusst kein Video-Portal: 1:1 vor Ort wirkt am besten.",
  },
  {
    q: "Wie funktioniert die Bezahlung?",
    a: "Sie erhalten einmal pro Monat eine Sammelrechnung mit Schweizer QR-Einzahlungsschein über alle protokollierten Lektionen. Kein Vorauszahlen, keine Guthaben-Modelle.",
  },
  {
    q: "Wer sind die Tutor:innen?",
    a: "Studierende von Universitäten, ETH und Fachhochschulen sowie Berufsleute aus der ICT-Praxis. Alle durchlaufen ein persönliches Kennenlern-Gespräch und eine fachliche Prüfung, bevor sie vermittelt werden.",
  },
  {
    q: "Gibt es eine Mindestlaufzeit oder ein Abo?",
    a: "Nein. Sie können jederzeit pausieren oder aufhören — ohne Kündigungsfrist. Viele Familien nutzen Nachhilfe gezielt vor Prüfungen und setzen danach aus.",
  },
  {
    q: "Für welche Stufen bietet Lernova Nachhilfe an?",
    a: "Für Lernende in der Berufslehre (EFZ/EBA), Sekundarschüler:innen, Gymnasiast:innen, Studierende sowie Erwachsene in Weiterbildungen — von der BMS bis zum eidgenössischen Fachausweis.",
  },
  {
    q: "Was passiert, wenn es zwischenmenschlich nicht passt?",
    a: "Sagen Sie uns einfach Bescheid — wir schlagen kostenlos eine:n andere:n Tutor:in vor. Die Chemie muss stimmen, sonst bringt die beste Fachkompetenz wenig.",
  },
];

export default function HomePage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <JsonLd data={faqJsonLd} />

      {/* ===== Hero ===== */}
      <section className="hero-glow relative overflow-hidden">
        <div className="grid-pattern pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-28">
          <Reveal className="flex flex-col items-center text-center">
            <Badge tone="accent" className="px-3 py-1">
              <Sparkles className="h-3 w-3" aria-hidden />
              Nr. 1 für ICT-Nachhilfe in der Schweiz
            </Badge>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-ink sm:text-6xl">
              Nachhilfe, die ankommt.{" "}
              <span className="text-gradient">Vor Ort. Auf Augenhöhe.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-mute sm:text-lg">
              Lernova vermittelt geprüfte Tutor:innen für Informatik, Programmieren, Mathematik
              und mehr — direkt in Ihrer Nähe. Für Lernende EFZ, Sekundarschule, Gymnasium und
              Studium. Persönlich statt Plattform-Dschungel.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/anfrage" size="lg">
                Nachhilfe anfragen
                <ArrowRight className="h-4 w-4" aria-hidden />
              </ButtonLink>
              <ButtonLink href="/fuer-tutoren" variant="outline" size="lg">
                Tutor:in werden
              </ButtonLink>
            </div>
            <div className="mt-14 grid w-full max-w-2xl grid-cols-3 divide-x divide-edge-soft rounded-xl border border-edge-soft bg-card/60 backdrop-blur">
              {STATS.map((stat) => (
                <div key={stat.label} className="px-2 py-5 text-center">
                  <p className="text-2xl font-bold tabular-nums text-ink sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[11px] text-faint sm:text-xs">{stat.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== Faecher ===== */}
      <section className="border-t border-edge-soft">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">Fächer</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              ICT ist unser Zuhause.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-mute">
              Vom ersten Python-Skript bis zur IPA: Unsere Tutor:innen kommen aus der Praxis und
              kennen die Schweizer ICT-Ausbildung von innen. Und wenn es in Mathe, Sprachen oder
              Wirtschaft brennt, helfen wir genauso.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ICT_SUBJECTS.map((subject, i) => (
              <Reveal key={subject.slug} delay={Math.min(i * 0.04, 0.3)}>
                <Link href={`/nachhilfe/${subject.slug}`} className="group block h-full">
                  <Card className="h-full p-5 transition-all duration-200 group-hover:border-accent/40 group-hover:bg-card-hover">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft">
                      <SubjectIcon slug={subject.slug} className="h-5 w-5 text-accent" />
                    </div>
                    <h3 className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-ink">
                      {subject.name}
                      <ArrowRight
                        className="h-3.5 w-3.5 text-faint opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent group-hover:opacity-100"
                        aria-hidden
                      />
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-mute">{subject.short}</p>
                  </Card>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10">
            <p className="text-xs font-medium uppercase tracking-wider text-faint">
              Auch stark in Schule, KV &amp; Wirtschaft
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {SCHOOL_SUBJECTS.map((subject) => (
                <Link
                  key={subject.slug}
                  href={`/nachhilfe/${subject.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-edge bg-surface px-4 py-2 text-sm text-mute transition-all hover:border-accent/40 hover:text-ink"
                >
                  <SubjectIcon slug={subject.slug} className="h-3.5 w-3.5 text-accent2" />
                  {subject.name}
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== So funktioniert's ===== */}
      <section id="so-funktionierts" className="border-t border-edge-soft bg-surface/30">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <Reveal className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              So funktioniert&rsquo;s
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              In drei Schritten zur passenden Lehrperson.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal key={step.nr} delay={i * 0.1}>
                <Card className="relative h-full overflow-hidden p-6">
                  <span className="text-gradient text-4xl font-bold tabular-nums">{step.nr}</span>
                  <h3 className="mt-4 text-base font-semibold text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mute">{step.text}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Zielgruppen ===== */}
      <section className="border-t border-edge-soft">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">Für wen</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Von der Lehre bis zum Studium.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-mute">
              Jede Stufe hat ihre eigenen Hürden — unsere Tutor:innen kennen sie aus eigener
              Erfahrung.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LEVELS.map((level, i) => {
              const Icon = LEVEL_ICONS[level.slug] ?? GraduationCap;
              return (
                <Reveal key={level.slug} delay={Math.min(i * 0.06, 0.3)}>
                  <Card className="flex h-full flex-col p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent2/10">
                      <Icon className="h-5 w-5 text-accent2" aria-hidden />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-ink">{level.name}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-mute">{level.blurb}</p>
                    <Link
                      href={`/anfrage?stufe=${level.slug}`}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-opacity hover:opacity-80"
                    >
                      Nachhilfe anfragen
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </Link>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== USPs ===== */}
      <section className="grid-pattern border-t border-edge-soft bg-surface/30">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <Reveal className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Warum Lernova
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Nachhilfe ohne Reibung.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {USPS.map((usp, i) => (
              <Reveal key={usp.title} delay={i * 0.07}>
                <Card className="flex h-full items-start gap-4 p-6">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent-soft">
                    <usp.icon className="h-5 w-5 text-accent" aria-hidden />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-ink">{usp.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-mute">{usp.text}</p>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="border-t border-edge-soft">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-24">
          <Reveal className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">FAQ</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Häufige Fragen.
            </h2>
          </Reveal>
          <Reveal className="mt-10" delay={0.1}>
            <FaqAccordion items={FAQ_ITEMS} />
          </Reveal>
        </div>
      </section>

      {/* ===== Abschluss-CTA ===== */}
      <section className="border-t border-edge-soft">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <Reveal>
            <div className="hero-glow relative overflow-hidden rounded-2xl border border-edge px-6 py-14 text-center sm:px-12 sm:py-20">
              <div className="grid-pattern pointer-events-none absolute inset-0" aria-hidden />
              <div className="relative">
                <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                  Bereit für bessere Noten — <span className="text-gradient">und mehr Ruhe zu Hause?</span>
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-mute">
                  Stellen Sie jetzt Ihre unverbindliche Anfrage. Wir melden uns innert 24 Stunden
                  mit einem passenden Vorschlag aus Ihrer Region.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <ButtonLink href="/anfrage" size="lg">
                    Jetzt Nachhilfe anfragen
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </ButtonLink>
                  <span className="inline-flex items-center gap-1.5 text-xs text-faint">
                    <MapPin className="h-3.5 w-3.5" aria-hidden />
                    Vermittlung in der ganzen Deutschschweiz &amp; Romandie
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
