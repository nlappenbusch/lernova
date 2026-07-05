// Public-Footer: Top-Faecher, beliebte Staedte (SEO-Links), Kontakt & Rechtliches.

import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { config } from "@/lib/config";
import { getSubject, SEO_CITY_SLUGS } from "@/lib/subjects";
import { findBySlug } from "@/lib/plz";

const TOP_SUBJECT_SLUGS = [
  "programmieren-python",
  "programmieren-java",
  "applikationsentwicklung-efz",
  "netzwerktechnik",
  "datenbanken-sql",
  "mathematik",
  "statistik",
  "rechnungswesen",
];

const FOOTER_CITY_SLUGS = SEO_CITY_SLUGS.slice(0, 10);

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-edge-soft bg-surface/40">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="text-lg font-bold tracking-tight text-ink">
              lernova<span className="text-accent">.ch</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-mute">
              {config.claim}. 1:1-Nachhilfe vor Ort — mit Schwerpunkt ICT &amp; Informatik, von
              der Lehre bis zum Studium.
            </p>
            <div className="mt-4 flex flex-col gap-2 text-sm text-mute">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-faint" aria-hidden />
                {config.company.name}, {config.company.street}, {config.company.zip}{" "}
                {config.company.city}
              </span>
              <a
                href={`mailto:${config.company.email}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-ink"
              >
                <Mail className="h-4 w-4 text-faint" aria-hidden />
                {config.company.email}
              </a>
              <a
                href={`tel:${config.company.phone.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-ink"
              >
                <Phone className="h-4 w-4 text-faint" aria-hidden />
                {config.company.phone}
              </a>
            </div>
          </div>

          {/* Top-Faecher */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-faint">
              Top-Fächer
            </h3>
            <ul className="mt-4 space-y-2.5">
              {TOP_SUBJECT_SLUGS.map((slug) => {
                const subject = getSubject(slug);
                if (!subject) return null;
                return (
                  <li key={slug}>
                    <Link
                      href={`/nachhilfe/${slug}`}
                      className="text-sm text-mute transition-colors hover:text-ink"
                    >
                      {subject.name}-Nachhilfe
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link
                  href="/nachhilfe"
                  className="text-sm font-medium text-accent transition-opacity hover:opacity-80"
                >
                  Alle Fächer →
                </Link>
              </li>
            </ul>
          </div>

          {/* Beliebte Staedte */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-faint">
              Beliebte Städte
            </h3>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_CITY_SLUGS.map((slug) => {
                const city = findBySlug(slug);
                if (!city) return null;
                return (
                  <li key={slug}>
                    <Link
                      href={`/nachhilfe/mathematik/sekundarschule/${slug}`}
                      className="text-sm text-mute transition-colors hover:text-ink"
                    >
                      Nachhilfe {city.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Lernova */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-faint">Lernova</h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/anfrage"
                  className="text-sm text-mute transition-colors hover:text-ink"
                >
                  Nachhilfe anfragen
                </Link>
              </li>
              <li>
                <Link
                  href="/fuer-tutoren"
                  className="text-sm text-mute transition-colors hover:text-ink"
                >
                  Tutor:in werden
                </Link>
              </li>
              <li>
                <Link
                  href="/#so-funktionierts"
                  className="text-sm text-mute transition-colors hover:text-ink"
                >
                  So funktioniert&rsquo;s
                </Link>
              </li>
              <li>
                <Link
                  href="/impressum"
                  className="text-sm text-mute transition-colors hover:text-ink"
                >
                  Impressum
                </Link>
              </li>
              <li>
                <Link
                  href="/datenschutz"
                  className="text-sm text-mute transition-colors hover:text-ink"
                >
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-faint transition-colors hover:text-mute">
                  Login für Tutor:innen
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-edge-soft pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-faint">
            © {year} {config.company.name} — Alle Rechte vorbehalten.
          </p>
          <p className="text-xs text-faint">Mit Sorgfalt gebaut in der Schweiz 🇨🇭</p>
        </div>
      </div>
    </footer>
  );
}
