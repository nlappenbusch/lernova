// SEO-Hub: alle Faecher nach Kategorie + Staedte-Cloud.

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { ButtonLink, Card } from "@/components/ui";
import { SUBJECTS, SEO_CITY_SLUGS, type SubjectCategory } from "@/lib/subjects";
import { findBySlug } from "@/lib/plz";
import { SubjectIcon } from "@/components/public/SubjectIcon";

export const metadata: Metadata = {
  title: "Nachhilfe-Fächer & Standorte",
  description:
    "Alle Nachhilfe-Fächer bei Lernova im Überblick: Informatik & ICT, Mathematik, Sprachen, KV & Wirtschaft — vor Ort in der ganzen Schweiz. Jetzt Fach wählen.",
  alternates: { canonical: "/nachhilfe" },
};

const CATEGORIES: Array<{ key: SubjectCategory; title: string; text: string }> = [
  {
    key: "ict",
    title: "Informatik & ICT",
    text: "Unser Schwerpunkt: Programmieren, Netzwerke, Datenbanken und die Begleitung durch die ICT-Lehren — von Tutor:innen aus der Praxis.",
  },
  {
    key: "school",
    title: "Schulfächer",
    text: "Die Klassiker von der Sekundarschule bis zur Matura: Mathematik, Naturwissenschaften und Sprachen.",
  },
  {
    key: "business",
    title: "KV & Wirtschaft",
    text: "Rechnungswesen, Wirtschaft & Recht und Statistik — für KV-Lernende, BMS und Studium.",
  },
];

export default function NachhilfeHubPage() {
  const cities = SEO_CITY_SLUGS.map((slug) => findBySlug(slug)).filter(
    (c): c is NonNullable<typeof c> => Boolean(c)
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Fächer</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Nachhilfe-Fächer im Überblick.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-mute">
          Wählen Sie ein Fach — auf der Fachseite finden Sie Stufen, Standorte und alles zum
          Ablauf. Oder stellen Sie direkt eine Anfrage, wir kümmern uns um den Rest.
        </p>
      </div>

      {CATEGORIES.map((category) => {
        const items = SUBJECTS.filter((s) => s.category === category.key);
        return (
          <section key={category.key} className="mt-14">
            <h2 className="text-xl font-bold tracking-tight text-ink">{category.title}</h2>
            <p className="mt-1.5 max-w-2xl text-sm text-mute">{category.text}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((subject) => (
                <Link
                  key={subject.slug}
                  href={`/nachhilfe/${subject.slug}`}
                  className="group block h-full"
                >
                  <Card className="h-full p-5 transition-all duration-200 group-hover:border-accent/40 group-hover:bg-card-hover">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-soft">
                        <SubjectIcon slug={subject.slug} className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                          {subject.name}
                          <ArrowRight
                            className="h-3.5 w-3.5 text-faint opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent group-hover:opacity-100"
                            aria-hidden
                          />
                        </h3>
                        <p className="mt-1 text-xs leading-relaxed text-mute">{subject.short}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {/* Staedte-Cloud */}
      <section className="mt-16 rounded-2xl border border-edge-soft bg-surface/40 p-6 sm:p-8">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-accent2" aria-hidden />
          <h2 className="text-xl font-bold tracking-tight text-ink">
            Nachhilfe in Ihrer Stadt
          </h2>
        </div>
        <p className="mt-1.5 max-w-2xl text-sm text-mute">
          Wir vermitteln lokal — hier eine Auswahl der meistgefragten Standorte. Ihre Gemeinde
          fehlt? Kein Problem: Wir matchen über die PLZ im ganzen Umkreis.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/nachhilfe/mathematik/sekundarschule/${city.slug}`}
              className="rounded-full border border-edge bg-card px-4 py-2 text-sm text-mute transition-all hover:border-accent/40 hover:text-ink"
            >
              {city.name}
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-14 text-center">
        <ButtonLink href="/anfrage" size="lg">
          Nachhilfe anfragen
          <ArrowRight className="h-4 w-4" aria-hidden />
        </ButtonLink>
      </div>
    </div>
  );
}
