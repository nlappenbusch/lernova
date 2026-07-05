// Impressum — statische Rechtsseite mit Firmendaten aus der Config.

import type { Metadata } from "next";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: "Impressum",
  description: `Impressum der ${config.company.name} — Betreiberin der Nachhilfe-Plattform lernova.ch.`,
  robots: { index: false },
};

export default function ImpressumPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-ink">Impressum</h1>

      <div className="mt-10 space-y-10">
        <section>
          <h2 className="text-base font-semibold text-ink">Betreiberin dieser Website</h2>
          <div className="mt-3 rounded-xl border border-edge-soft bg-card px-5 py-4 text-sm leading-relaxed text-mute">
            <p className="font-medium text-ink">{config.company.name}</p>
            <p>{config.company.street}</p>
            <p>
              {config.company.zip} {config.company.city}
            </p>
            <p>Schweiz</p>
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink">Kontakt</h2>
          <div className="mt-3 space-y-1 text-sm leading-relaxed text-mute">
            <p>
              E-Mail:{" "}
              <a href={`mailto:${config.company.email}`} className="text-accent underline">
                {config.company.email}
              </a>
            </p>
            <p>
              Telefon:{" "}
              <a
                href={`tel:${config.company.phone.replace(/\s+/g, "")}`}
                className="text-accent underline"
              >
                {config.company.phone}
              </a>
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink">Zweck der Plattform</h2>
          <p className="mt-3 text-sm leading-relaxed text-mute">
            lernova.ch vermittelt 1:1-Nachhilfe vor Ort zwischen Kund:innen (in der Regel Eltern
            bzw. erwachsene Lernende) und selbstständig unterrichtenden Tutor:innen in der
            Schweiz. Die Abrechnung der vermittelten Lektionen erfolgt über die{" "}
            {config.company.name}.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink">Haftungsausschluss</h2>
          <p className="mt-3 text-sm leading-relaxed text-mute">
            Die Inhalte dieser Website wurden mit grösstmöglicher Sorgfalt erstellt. Die{" "}
            {config.company.name} übernimmt jedoch keine Gewähr für die Richtigkeit,
            Vollständigkeit und Aktualität der bereitgestellten Inhalte. Haftungsansprüche wegen
            Schäden materieller oder immaterieller Art, die aus dem Zugriff oder der Nutzung bzw.
            Nichtnutzung der veröffentlichten Informationen entstehen, sind ausgeschlossen, soweit
            gesetzlich zulässig.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink">Urheberrecht</h2>
          <p className="mt-3 text-sm leading-relaxed text-mute">
            Die Inhalte und Gestaltungselemente dieser Website sind urheberrechtlich geschützt.
            Eine Verwendung ausserhalb der gesetzlich zulässigen Fälle bedarf der vorherigen
            schriftlichen Zustimmung der {config.company.name}.
          </p>
        </section>
      </div>
    </div>
  );
}
