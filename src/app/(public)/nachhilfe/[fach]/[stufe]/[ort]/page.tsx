// Lokale SEO-Landingpage: /nachhilfe/[fach]/[stufe]/[ort]
// Voll ausgebaute Seite mit komponierten Texten (Fach + Stufe + Ort),
// JSON-LD (Service, BreadcrumbList, FAQPage) und CTA mit Prefill.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ChevronRight,
  CircleCheck,
  MapPin,
  NotebookPen,
  QrCode,
  ShieldCheck,
  Users,
} from "lucide-react";
import { ButtonLink, Card } from "@/components/ui";
import { SUBJECTS, LEVELS, SEO_CITY_SLUGS, getSubject, getLevel } from "@/lib/subjects";
import { findBySlug } from "@/lib/plz";
import { config } from "@/lib/config";
import { chf } from "@/lib/format";
import { SubjectIcon } from "@/components/public/SubjectIcon";
import { FaqAccordion, type FaqItem } from "@/components/public/FaqAccordion";
import { JsonLd, LEVEL_SHORT, cantonName, pickTitle } from "@/components/public/seo";

type Params = { params: Promise<{ fach: string; stufe: string; ort: string }> };

// Nur die ersten 3 Staedte pro Fach/Stufe vorrendern — Rest on-demand.
export const dynamicParams = true;

export function generateStaticParams() {
  const cities = SEO_CITY_SLUGS.slice(0, 3);
  return SUBJECTS.flatMap((s) =>
    LEVELS.flatMap((l) => cities.map((c) => ({ fach: s.slug, stufe: l.slug, ort: c })))
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { fach, stufe, ort } = await params;
  const subject = getSubject(fach);
  const level = getLevel(stufe);
  const city = findBySlug(ort);
  if (!subject || !level || !city) return {};
  const short = LEVEL_SHORT[level.slug] ?? level.name;
  const title = pickTitle([
    `${subject.name}-Nachhilfe ${city.name} für ${short} | Lernova`,
    `${subject.name}-Nachhilfe ${city.name} | Lernova`,
    `${subject.name}-Nachhilfe ${city.name}`,
  ]);
  const description = `${subject.name}-Nachhilfe für ${level.name} in ${city.name}: geprüfte Tutor:innen vor Ort, faire Preise, QR-Rechnung statt Abo. Jetzt unverbindlich anfragen.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/nachhilfe/${subject.slug}/${level.slug}/${city.slug}` },
  };
}

export default async function LokaleLandingpage({ params }: Params) {
  const { fach, stufe, ort } = await params;
  const subject = getSubject(fach);
  const level = getLevel(stufe);
  const city = findBySlug(ort);
  if (!subject || !level || !city) notFound();

  const kanton = cantonName(city.canton);
  const rate = chf(config.billing.defaultRateCustomer);
  const anfrageUrl = `/anfrage?fach=${subject.slug}&stufe=${level.slug}&ort=${city.slug}`;
  const pageUrl = `${config.baseUrl}/nachhilfe/${subject.slug}/${level.slug}/${city.slug}`;

  const faqItems: FaqItem[] = [
    {
      q: `Was kostet ${subject.name}-Nachhilfe in ${city.name}?`,
      a: `Eine Lektion à 60 Minuten kostet ${rate} — einheitlich in der ganzen Schweiz, also auch in ${city.name}. Es gibt keine Anmeldegebühr, kein Abo und keine Mindestlaufzeit: Sie bezahlen monatlich per QR-Rechnung nur die Lektionen, die stattgefunden haben.`,
    },
    {
      q: `Wie schnell finden wir eine:n ${subject.name}-Tutor:in in ${city.name}?`,
      a: `Wir matchen über die PLZ im Umkreis von ${city.name} und melden uns in der Regel innert 24 Stunden mit einem konkreten Vorschlag. Der Unterricht startet meist innerhalb einer Woche.`,
    },
    {
      q: `Wo findet der Unterricht in ${city.name} statt?`,
      a: `Bei Ihnen zu Hause in ${city.name} oder an einem vereinbarten Ort in der Umgebung — etwa in einer Bibliothek. Lernova ist bewusst kein Video-Portal: 1:1 vor Ort wirkt am besten.`,
    },
    {
      q: `Passt das Angebot für ${level.name}?`,
      a: `Ja — wir vermitteln gezielt Tutor:innen für ${level.audience}. Inhalte, Tempo und Prüfungsvorbereitung richten sich nach genau dieser Stufe.`,
    },
  ];

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${subject.name}-Nachhilfe für ${level.name} in ${city.name}`,
    serviceType: `${subject.name}-Nachhilfe`,
    description: `1:1-${subject.name}-Nachhilfe vor Ort in ${city.name} für ${level.audience}.`,
    url: pageUrl,
    areaServed: {
      "@type": "City",
      name: city.name,
      address: {
        "@type": "PostalAddress",
        postalCode: city.plz,
        addressRegion: kanton,
        addressCountry: "CH",
      },
    },
    provider: {
      "@type": "Organization",
      name: config.company.name,
      url: config.baseUrl,
      email: config.company.email,
      telephone: config.company.phone,
    },
    offers: {
      "@type": "Offer",
      price: (config.billing.defaultRateCustomer / 100).toFixed(2),
      priceCurrency: "CHF",
      description: "Preis pro Lektion à 60 Minuten",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Nachhilfe", item: `${config.baseUrl}/nachhilfe` },
      {
        "@type": "ListItem",
        position: 2,
        name: subject.name,
        item: `${config.baseUrl}/nachhilfe/${subject.slug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: level.name,
        item: `${config.baseUrl}/nachhilfe/${subject.slug}/${level.slug}`,
      },
      { "@type": "ListItem", position: 4, name: city.name, item: pageUrl },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const otherCities = SEO_CITY_SLUGS.filter((slug) => slug !== city.slug)
    .map((slug) => findBySlug(slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .slice(0, 8);

  const relatedSubjects = SUBJECTS.filter(
    (s) => s.slug !== subject.slug && s.category === subject.category
  ).slice(0, 6);

  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={faqJsonLd} />

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
            <Link
              href={`/nachhilfe/${subject.slug}/${level.slug}`}
              className="transition-colors hover:text-mute"
            >
              {level.name}
            </Link>
            <ChevronRight className="h-3 w-3" aria-hidden />
            <span className="text-mute">{city.name}</span>
          </nav>

          {/* Kopf + Intro */}
          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent-soft">
              <SubjectIcon slug={subject.slug} className="h-7 w-7 text-accent" />
            </div>
            <div className="max-w-3xl">
              <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
                {subject.name}-Nachhilfe für {level.name} in {city.name}
              </h1>
          <p className="mt-5 text-base leading-relaxed text-mute">
            {subject.blurb} In {city.name} vermitteln wir dafür Tutor:innen, die zu Ihnen nach
            Hause kommen — persönlich, geprüft und aus der Region.
          </p>
          <p className="mt-3 text-base leading-relaxed text-mute">
            {level.blurb} Unsere Tutor:innen begleiten {level.audience} deshalb nicht mit
            Standardprogramm, sondern genau dort, wo es in {subject.name} gerade hakt.
          </p>
          <p className="mt-3 text-base leading-relaxed text-mute">
            {city.name} ({city.plz}, Kanton {kanton}) gehört zu unseren aktivsten Regionen: Über
            die PLZ matchen wir im ganzen Umkreis — auch in den umliegenden Gemeinden. Der
            Unterricht findet bei Ihnen vor Ort statt, die Abrechnung läuft transparent über eine
            monatliche Schweizer QR-Rechnung ({rate} pro Lektion à 60 Minuten).
          </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink href={anfrageUrl} size="lg">
                  Jetzt in {city.name} anfragen
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </ButtonLink>
                <span className="text-xs text-faint">
                  Unverbindlich &amp; kostenlos — Antwort innert 24 Stunden
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 sm:pb-20">
      {/* Vorteile */}
      <section className="mt-14">
        <h2 className="font-display text-xl font-bold tracking-tight text-ink">
          Ihre Vorteile mit Lernova in {city.name}
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            {
              icon: Users,
              title: "Lokales Matching",
              text: `Wir vermitteln ausschliesslich Tutor:innen, die ${city.name} und Umgebung gut erreichen — kurze Wege, verlässliche Termine.`,
            },
            {
              icon: ShieldCheck,
              title: "Geprüfte Tutor:innen",
              text: "Persönliches Kennenlern-Gespräch und fachliche Prüfung, bevor jemand vermittelt wird. Passt die Chemie nicht, wechseln wir kostenlos.",
            },
            {
              icon: QrCode,
              title: "Transparente Abrechnung",
              text: `Ein Tarif (${rate}/60 Min.), monatliche Sammelrechnung mit Schweizer QR-Einzahlungsschein. Kein Abo, keine Mindestlaufzeit.`,
            },
            {
              icon: NotebookPen,
              title: "Stundenprotokolle",
              text: "Nach jeder Lektion wird festgehalten, was erarbeitet wurde — Sie sehen den Fortschritt schwarz auf weiss.",
            },
          ].map((item) => (
            <Card
              key={item.title}
              className="flex items-start gap-4 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-lg"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-soft">
                <item.icon className="h-5 w-5 text-accent" aria-hidden />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-mute">{item.text}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Ablauf */}
      <section className="grid-pattern mt-16 rounded-2xl border border-edge-soft bg-card p-6 shadow-card sm:p-8">
        <h2 className="font-display text-xl font-bold tracking-tight text-ink">
          So starten Sie in {city.name}
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {[
            {
              nr: "01",
              title: "Anfrage stellen",
              text: `Fach und Stufe sind vorausgewählt — Sie ergänzen PLZ ${city.plz} und ein paar Angaben zum Bedarf.`,
            },
            {
              nr: "02",
              title: "Vorschlag erhalten",
              text: "Innert 24 Stunden schlagen wir eine:n geprüfte:n Tutor:in aus Ihrem Umkreis vor — unverbindlich.",
            },
            {
              nr: "03",
              title: "Lernen & abrechnen",
              text: "Die erste Lektion findet bei Ihnen statt. Abgerechnet wird monatlich per QR-Rechnung — nur effektive Lektionen.",
            },
          ].map((step, i) => (
            <div key={step.nr}>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft font-display text-sm font-bold text-accent-deep">
                {i + 1}
              </div>
              <h3 className="mt-3 text-sm font-semibold text-ink">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-mute">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Lokaler Bezug */}
      <section className="mt-16">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent2/10">
            <MapPin className="h-4 w-4 text-accent2" aria-hidden />
          </span>
          <h2 className="font-display text-xl font-bold tracking-tight text-ink">
            Verwurzelt im Kanton {kanton}
          </h2>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-mute">
          Nachhilfe wirkt am besten, wenn sie zur Schule passt: Unsere Tutor:innen im Kanton{" "}
          {kanton} kennen die lokalen Lehrpläne, Prüfungsformate und Übertrittsanforderungen. Ob
          der Unterricht in {city.name} selbst oder in einer Nachbargemeinde stattfindet — wir
          finden über Ihre PLZ die kürzeste Distanz zwischen Bedarf und Können.
        </p>
        {otherCities.length > 0 ? (
          <div className="mt-5">
            <p className="text-xs font-medium uppercase tracking-wider text-faint">
              {subject.name} für {level.name} — weitere Städte
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {otherCities.map((c) => (
                <Link
                  key={c.slug}
                  href={`/nachhilfe/${subject.slug}/${level.slug}/${c.slug}`}
                  className="rounded-full border border-edge bg-card px-4 py-2 text-sm text-mute shadow-card transition-all hover:-translate-y-0.5 hover:border-accent/30 hover:text-ink hover:shadow-card-lg"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
        {relatedSubjects.length > 0 ? (
          <div className="mt-5">
            <p className="text-xs font-medium uppercase tracking-wider text-faint">
              Andere Fächer in {city.name}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {relatedSubjects.map((s) => (
                <Link
                  key={s.slug}
                  href={`/nachhilfe/${s.slug}/${level.slug}/${city.slug}`}
                  className="rounded-full border border-edge bg-card px-4 py-2 text-sm text-mute shadow-card transition-all hover:-translate-y-0.5 hover:border-accent/30 hover:text-ink hover:shadow-card-lg"
                >
                  {s.name} in {city.name}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {/* Mini-FAQ */}
      <section className="mt-16">
        <h2 className="font-display text-xl font-bold tracking-tight text-ink">
          Häufige Fragen zu {subject.name}-Nachhilfe in {city.name}
        </h2>
        <div className="mt-6">
          <FaqAccordion items={faqItems} />
        </div>
      </section>

      {/* CTA */}
      <div className="hero-glow mt-16 overflow-hidden rounded-2xl border border-edge p-8 text-center shadow-card sm:p-12">
        <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          {subject.name}-Nachhilfe in {city.name} — <span className="text-gradient">jetzt starten.</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-mute">
          Zwei Minuten Anfrage, Antwort innert 24 Stunden. Unverbindlich, kostenlos, ohne Abo.
        </p>
        <div className="mt-7 flex justify-center">
          <ButtonLink href={anfrageUrl} size="lg">
            Nachhilfe anfragen
            <ArrowRight className="h-4 w-4" aria-hidden />
          </ButtonLink>
        </div>
        <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-faint">
          <CircleCheck className="h-3.5 w-3.5 text-ok" aria-hidden />
          {rate} pro Lektion à 60 Minuten — keine versteckten Kosten
        </p>
      </div>
      </div>
    </>
  );
}
