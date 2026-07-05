// Fach-Seite: /nachhilfe/[fach] — Blurb, Stufen-Cards, Staedte-Grid, CTA.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight, MapPin } from "lucide-react";
import { ButtonLink, Card } from "@/components/ui";
import { SUBJECTS, LEVELS, SEO_CITY_SLUGS, getSubject } from "@/lib/subjects";
import { findBySlug } from "@/lib/plz";
import { SubjectIcon } from "@/components/public/SubjectIcon";
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
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
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

      <div className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 sm:pb-20">
      {/* Stufen */}
      <section className="mt-14">
        <h2 className="font-display text-xl font-bold tracking-tight text-ink">
          {subject.name} für jede Stufe
        </h2>
        <p className="mt-1.5 max-w-2xl text-sm text-mute">
          Wählen Sie die passende Stufe — die Inhalte und das Tempo richten sich danach.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
      </div>
    </>
  );
}
