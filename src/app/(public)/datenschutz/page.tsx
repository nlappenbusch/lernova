// Datenschutzerklaerung — ehrlich und knapp (revDSG), Firmendaten aus Config.

import type { Metadata } from "next";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: `Datenschutzerklärung der ${config.company.name}: Welche Daten lernova.ch erhebt, wofür sie verwendet werden und welche Rechte Sie haben.`,
  robots: { index: false },
};

export default function DatenschutzPage() {
  return (
    <>
      <section className="hero-glow border-b border-edge-soft">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
            Datenschutzerklärung
          </h1>
          <p className="mt-3 text-sm text-mute">
            Kurz gesagt: Wir erheben nur, was wir für die Vermittlung und Abrechnung von Nachhilfe
            brauchen — und geben nichts an Dritte weiter, die damit Werbung machen.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 pb-14 sm:px-6 sm:pb-20">
        <div className="mt-10 space-y-10">
        <section>
          <h2 className="text-base font-semibold text-ink">1. Verantwortliche Stelle</h2>
          <p className="mt-3 text-sm leading-relaxed text-mute">
            {config.company.name}, {config.company.street}, {config.company.zip}{" "}
            {config.company.city}, Schweiz. Bei Fragen zum Datenschutz erreichen Sie uns unter{" "}
            <a href={`mailto:${config.company.email}`} className="text-accent underline">
              {config.company.email}
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink">2. Welche Daten wir erheben</h2>
          <p className="mt-3 text-sm leading-relaxed text-mute">
            Wenn Sie über das Anfrage-Formular Nachhilfe anfragen, erheben wir die Angaben, die
            Sie uns dort mitteilen: Fach und Stufe, PLZ und Ort, gewünschte Lektionen und
            Wunschzeiten, eine Beschreibung des Bedarfs sowie Ihren Namen, Ihre E-Mail-Adresse
            und optional Telefonnummer und Strasse. Tutor:innen, die sich bewerben, teilen uns
            per E-Mail die Angaben mit, die sie in ihrer Bewerbung machen.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink">3. Wofür wir die Daten verwenden</h2>
          <p className="mt-3 text-sm leading-relaxed text-mute">
            Ausschliesslich für die Vermittlung einer passenden Nachhilfe-Lehrperson in Ihrem
            Umkreis, die Kommunikation mit Ihnen sowie — bei zustande gekommenem Unterricht — für
            die Erfassung der Lektionen und die Rechnungsstellung. Es findet kein Verkauf und
            keine Weitergabe Ihrer Daten zu Werbezwecken statt.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink">4. Weitergabe an Tutor:innen</h2>
          <p className="mt-3 text-sm leading-relaxed text-mute">
            Vor einer Vermittlung sehen Tutor:innen nur anonymisierte Eckdaten Ihrer Anfrage
            (Fach, Stufe, PLZ/Ort, Beschreibung). Ihre Kontaktdaten (Name, E-Mail, Telefon,
            Adresse) erhält ausschliesslich die Lehrperson, die tatsächlich für Ihren Unterricht
            eingesetzt wird.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink">5. Cookies</h2>
          <p className="mt-3 text-sm leading-relaxed text-mute">
            lernova.ch verwendet keine Marketing- oder Tracking-Cookies und keine
            Analyse-Dienste von Drittanbietern. Es kommt lediglich ein technisch notwendiges
            Session-Cookie zum Einsatz, wenn sich Tutor:innen oder Administrator:innen in ihr
            Portal einloggen. Für Besucher:innen der öffentlichen Seiten werden keine Cookies
            gesetzt.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink">6. Aufbewahrung</h2>
          <p className="mt-3 text-sm leading-relaxed text-mute">
            Anfragedaten bewahren wir so lange auf, wie es für die Vermittlung und eine allfällige
            spätere Zusammenarbeit nötig ist. Buchhaltungsrelevante Daten (Rechnungen,
            Stundenprotokolle) unterliegen der gesetzlichen Aufbewahrungspflicht von 10 Jahren
            (Art. 958f OR). Danach werden die Daten gelöscht.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink">7. Ihre Rechte</h2>
          <p className="mt-3 text-sm leading-relaxed text-mute">
            Nach dem Schweizer Datenschutzgesetz (revDSG) haben Sie jederzeit das Recht auf
            Auskunft über die zu Ihrer Person gespeicherten Daten sowie auf deren Berichtigung
            oder Löschung, soweit keine gesetzliche Aufbewahrungspflicht entgegensteht. Eine
            kurze E-Mail an{" "}
            <a href={`mailto:${config.company.email}`} className="text-accent underline">
              {config.company.email}
            </a>{" "}
            genügt.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink">8. Datensicherheit & Hosting</h2>
          <p className="mt-3 text-sm leading-relaxed text-mute">
            Die Übertragung sämtlicher Daten erfolgt verschlüsselt (TLS). Der Zugriff auf
            personenbezogene Daten ist auf die Personen beschränkt, die ihn für Vermittlung und
            Abrechnung benötigen.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink">9. Änderungen</h2>
          <p className="mt-3 text-sm leading-relaxed text-mute">
            Wir können diese Datenschutzerklärung bei Bedarf anpassen. Es gilt die jeweils hier
            veröffentlichte Fassung. Stand: Juli 2026.
          </p>
        </section>
        </div>
      </div>
    </>
  );
}
