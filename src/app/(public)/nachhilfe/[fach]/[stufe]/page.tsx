// Kombi-Seite: /nachhilfe/[fach]/[stufe] — Fach- und Stufen-Blurb verwoben,
// Staedte-Links, CTA mit Prefill.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight, CircleCheck, MapPin } from "lucide-react";
import { ButtonLink, Card } from "@/components/ui";
import { SUBJECTS, LEVELS, SEO_CITY_SLUGS, getSubject, getLevel } from "@/lib/subjects";
import { findBySlug } from "@/lib/plz";
import { SubjectIcon } from "@/components/public/SubjectIcon";
import { LEVEL_SHORT, pickTitle } from "@/components/public/seo";

type Params = { params: Promise<{ fach: string; stufe: string }> };

export function generateStaticParams() {
  return SUBJECTS.flatMap((s) => LEVELS.map((l) => ({ fach: s.slug, stufe: l.slug })));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { fach, stufe } = await params;
  const subject = getSubject(fach);
  const level = getLevel(stufe);
  if (!subject || !level) return {};
  return {
    title: pickTitle([
      `${subject.name}-Nachhilfe für ${level.name}`,
      `${subject.name}-Nachhilfe für ${LEVEL_SHORT[level.slug] ?? level.name}`,
      `${subject.name}-Nachhilfe`,
    ]),
    description: `${subject.name}-Nachhilfe für ${level.name}: geprüfte Tutor:innen kommen zu Ihnen — lokal, fair und ohne Abo. Jetzt unverbindlich anfragen.`,
    alternates: { canonical: `/nachhilfe/${subject.slug}/${level.slug}` },
  };
}

const BENEFITS = [
  "Geprüfte Tutor:innen mit persönlichem Kennenlern-Gespräch",
  "1:1-Unterricht bei Ihnen zu Hause — kein Video-Portal",
  "Match innert 24 Stunden, Start meist innerhalb einer Woche",
  "Transparente Abrechnung per Schweizer QR-Rechnung, kein Abo",
];

export default async function FachStufePage({ params }: Params) {
  const { fach, stufe } = await params;
  const subject = getSubject(fach);
  const level = getLevel(stufe);
  if (!subject || !level) notFound();

  const cities = SEO_CITY_SLUGS.map((slug) => findBySlug(slug)).filter(
    (c): c is NonNullable<typeof c> => Boolean(c)
  );
  const otherLevels = LEVELS.filter((l) => l.slug !== level.slug);

  return (
    <>
      <section className="hero-glow border-b border-edge-soft">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-xs text-faint"
          >
            <Link href="/nachhilfe" className="transition-colors hover:text-mute">
              Nachhilfe
            </Link>
            <ChevronRight className="h-3 w-3" aria-hidden />
            <Link href={`/nachhilfe/${subject.slug}`} className="transition-colors hover:text-mute">
              {subject.name}
            </Link>
            <ChevronRight className="h-3 w-3" aria-hidden />
            <span className="text-mute">{level.name}</span>
          </nav>

          {/* Kopf */}
          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent-soft">
              <SubjectIcon slug={subject.slug} className="h-7 w-7 text-accent" />
            </div>
            <div className="max-w-3xl">
              <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                {subject.name}-Nachhilfe für {level.name}.
              </h1>
              <p className="mt-4 text-base leading-relaxed text-mute">{subject.blurb}</p>
              <p className="mt-3 text-base leading-relaxed text-mute">
                {level.blurb} Genau hier setzen wir an: Wir vermitteln Tutor:innen, die{" "}
                {level.audience} gezielt in {subject.name} begleiten — vor Ort und im passenden
                Tempo.
              </p>
              <div className="mt-6">
                <ButtonLink href={`/anfrage?fach=${subject.slug}&stufe=${level.slug}`} size="lg">
                  Jetzt anfragen
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 sm:pb-20">
        {/* Vorteile */}
        <section className="mt-14 grid gap-3 sm:grid-cols-2">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit}
              className="flex items-start gap-3 rounded-xl border border-edge-soft bg-card px-5 py-4 shadow-card"
            >
              <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-ok" aria-hidden />
              <p className="text-sm text-mute">{benefit}</p>
            </div>
          ))}
        </section>

        {/* Staedte */}
        <section className="grid-pattern mt-14 rounded-2xl border border-edge-soft bg-card p-6 shadow-card sm:p-8">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent2/10">
              <MapPin className="h-4 w-4 text-accent2" aria-hidden />
            </span>
            <h2 className="font-display text-xl font-bold tracking-tight text-ink">
              {subject.name} für {level.name} — in Ihrer Stadt
            </h2>
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={`/nachhilfe/${subject.slug}/${level.slug}/${city.slug}`}
                className="rounded-lg border border-edge bg-card px-4 py-2.5 text-sm text-mute transition-all hover:border-accent/30 hover:text-ink hover:shadow-card"
              >
                {city.name}
              </Link>
            ))}
          </div>
        </section>

        {/* Andere Stufen */}
        <section className="mt-14">
          <h2 className="text-base font-semibold text-ink">Andere Stufe gesucht?</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {otherLevels.map((l) => (
              <Link
                key={l.slug}
                href={`/nachhilfe/${subject.slug}/${l.slug}`}
                className="rounded-full border border-edge bg-card px-4 py-2 text-sm text-mute shadow-card transition-all hover:-translate-y-0.5 hover:border-accent/30 hover:text-ink hover:shadow-card-lg"
              >
                {subject.name} für {l.name}
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="hero-glow mt-14 overflow-hidden rounded-2xl border border-edge p-8 text-center shadow-card sm:p-10">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
            Der nächste Schritt dauert 2 Minuten.
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-mute">
            Fach und Stufe sind schon vorausgewählt — Sie ergänzen nur noch PLZ und ein paar
            Angaben zum Bedarf.
          </p>
          <div className="mt-6">
            <ButtonLink href={`/anfrage?fach=${subject.slug}&stufe=${level.slug}`} size="lg">
              Nachhilfe anfragen
              <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
          </div>
        </div>
      </div>
    </>
  );
}
