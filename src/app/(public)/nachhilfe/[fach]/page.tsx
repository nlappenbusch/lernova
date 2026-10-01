// Fach-Seite: /nachhilfe/[fach] — Blurb, Stufen-Cards, Staedte-Grid, CTA.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight, MapPin } from "lucide-react";
import { ButtonLink, Card } from "@/components/ui";
import {
  SUBJECTS,
  LEVELS,
  SEO_CITY_SLUGS,
  getSubject,
  moduleSlug,
} from "@/lib/subjects";
import { findBySlug } from "@/lib/plz";
import { SubjectIcon } from "@/components/public/SubjectIcon";
import { ModuleOverview } from "@/components/public/ModuleOverview";
import { defaultLevelSlug, pickTitle } from "@/components/public/seo";

type Params = { params: Promise<{ fach: string }> };

export function generateStaticParams() {
  return SUBJECTS.map((s) => ({ fach: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { fach } = await params;
  const subject = getSubject(fach);
  if (!subject) return {};
  return {
    title: pickTitle([
      `${subject.name}-Nachhilfe in der Schweiz — vor Ort`,
      `${subject.name}-Nachhilfe in der Schweiz`,
    ]),
    description: `${subject.name}-Nachhilfe vor Ort: geprüfte Tutor:innen in Ihrer Nähe, für alle Stufen von der Lehre bis zum Studium. Faire Preise, keine Abos. Jetzt anfragen.`,
    alternates: { canonical: `/nachhilfe/${subject.slug}` },
  };
}

export default async function FachPage({ params }: Params) {
  const { fach } = await params;
  const subject = getSubject(fach);
  if (!subject) notFound();

  const cities = SEO_CITY_SLUGS.map((slug) => findBySlug(slug)).filter(
    (c): c is NonNullable<typeof c> => Boolean(c)
  );
  const cityLevel = defaultLevelSlug(subject);

  return (
    <>
      <section className="hero-glow border-b border-edge-soft">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-faint">
            <Link href="/nachhilfe" className="transition-colors hover:text-mute">
              Nachhilfe
            </Link>
            <ChevronRight className="h-3 w-3" aria-hidden />
            <span className="text-mute">{subject.name}</span>
          </nav>

          {/* Kopf */}
          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent-soft">
              <SubjectIcon slug={subject.slug} className="h-7 w-7 text-accent" />
            </div>
            <div className="max-w-3xl">
              <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                {subject.name}-Nachhilfe — vor Ort in Ihrer Nähe.
              </h1>
              <p className="mt-4 text-base leading-relaxed text-mute">{subject.blurb}</p>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-accent/25 bg-accent-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">
                  {subject.officialGroup ?? "ICT-Fachbereich"}
                </span>
                {subject.track ? (
                  <span className="rounded-full border border-edge bg-card px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-faint">
                    {subject.track}
                  </span>
                ) : null}
              </div>
              <div className="mt-6">
                <ButtonLink href={`/anfrage?fach=${subject.slug}`} size="lg">
                  {subject.name}-Nachhilfe anfragen
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 sm:pb-24">
        <section className="mt-10">
          <div className="rounded-2xl border border-edge-soft bg-card p-5 shadow-card">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="max-w-2xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
                  Offizieller Modulbaukasten
                </p>
                <h2 className="mt-2 font-display text-xl font-bold text-ink">
                  {subject.officialGroup ?? "ICT-Ausbildung"}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-mute">
                  {subject.officialCatalog ??
                    "Schweizer ICT-Modulbaukasten – modulare Fachrichtung mit klarer Lernreihenfolge und Kompetenzzielen."}
                </p>
              </div>
              <div className="rounded-xl border border-accent/20 bg-accent-soft px-3 py-2 text-sm font-medium text-accent">
                {subject.track ?? "Lernpfad / Kompetenzbereich"}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="rounded-2xl border border-edge-soft bg-card p-5 shadow-card">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
                  Fachrichtung / Modulstruktur
                </p>
                <h2 className="mt-2 font-display text-xl font-bold text-ink">
                  {subject.officialGroup ?? "ICT-Ausbildung"}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {subject.keywords.slice(0, 4).map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full border border-edge bg-card px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.08em] text-mute"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {subject.modules && subject.modules.length > 0 ? (
        <section className="mt-14">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <h2 className="font-display text-xl font-bold tracking-tight text-ink">
              Lernpfad & Module
            </h2>
            <p className="mt-1.5 max-w-3xl text-sm text-mute">
              So sieht der typische Ausbildungs- und Lernweg für {subject.name} in der Praxis aus — mit Fokus
              auf das passende Lehrjahr, die Inhalte, das Lernziel und den roten Faden zum Erfolg.
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-6xl px-5 sm:px-8">
            <ModuleOverview modules={subject.modules} subjectSlug={subject.slug} subjectName={subject.name} />
          </div>
        </section>
      ) : null}

      {subject.learningPlan && subject.learningPlan.length > 0 ? (
        <section className="mt-14">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <h2 className="font-display text-xl font-bold tracking-tight text-ink">
              Lernplan nach Phase
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {subject.learningPlan.map((phase, index) => (
                <div key={phase.phase} className="rounded-2xl border border-edge-soft bg-card p-5 shadow-card">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent">
                      0{index + 1}
                    </span>
                    <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-faint">
                      {phase.phase}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-ink">{phase.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mute">{phase.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Stufen */}
      <section className="mt-14">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="font-display text-xl font-bold tracking-tight text-ink">
            {subject.name} für jede Stufe
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm text-mute">
            Wählen Sie die passende Stufe — die Inhalte und das Tempo richten sich danach.
          </p>
        </div>
        <div className="mx-auto mt-6 max-w-6xl px-5 sm:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LEVELS.map((level) => (
            <Link
              key={level.slug}
              href={`/nachhilfe/${subject.slug}/${level.slug}`}
              className="group block h-full"
            >
              <Card className="h-full p-5 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-accent/30 group-hover:shadow-card-lg">
                <h3 className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                  {subject.name} für {level.name}
                  <ArrowRight
                    className="h-3.5 w-3.5 text-faint opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent group-hover:opacity-100"
                    aria-hidden
                  />
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-mute">{level.blurb}</p>
              </Card>
            </Link>
          ))}
          </div>
        </div>
      </section>

      {/* Staedte */}
      <section className="grid-pattern mt-16 rounded-2xl border border-edge-soft bg-card p-6 shadow-card sm:p-8">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent2/10">
            <MapPin className="h-4 w-4 text-accent2" aria-hidden />
          </span>
          <h2 className="font-display text-xl font-bold tracking-tight text-ink">
            {subject.name}-Nachhilfe in Ihrer Stadt
          </h2>
        </div>
        <p className="mt-3 max-w-2xl text-sm text-mute">
          Wir vermitteln Tutor:innen im Umkreis Ihrer PLZ — hier die meistgefragten Standorte.
        </p>
        <div className="mt-5 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/nachhilfe/${subject.slug}/${cityLevel}/${city.slug}`}
              className="rounded-lg border border-edge bg-card px-4 py-2.5 text-sm text-mute transition-all hover:border-accent/30 hover:text-ink hover:shadow-card"
            >
              {subject.name} in {city.name}
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="hero-glow mt-14 overflow-hidden rounded-2xl border border-edge p-8 text-center shadow-card sm:p-10">
        <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
          Unverbindlich anfragen — in 2 Minuten.
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-mute">
          Beschreiben Sie kurz, wo es hakt. Wir melden uns innert 24 Stunden mit einem konkreten
          Vorschlag aus Ihrer Region.
        </p>
        <div className="mt-6">
          <ButtonLink href={`/anfrage?fach=${subject.slug}`} size="lg">
            Jetzt anfragen
            <ArrowRight className="h-4 w-4" aria-hidden />
          </ButtonLink>
        </div>
      </div>
    </>
  );
}
