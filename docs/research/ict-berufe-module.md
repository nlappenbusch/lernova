# Schweizer ICT-Berufsbildung — Berufe & Modulbaukasten (Stand 2025/2026)

> **Zweck:** Grundlage für einen TypeScript-Datenkatalog. Modulnummern und -titel sind
> maschinen-verifiziert (siehe Quelle/Methodik), nicht geraten.
>
> **Datenquelle Module:** Offizieller **Modulbaukasten** von ICT-Berufsbildung Schweiz
> (`modulbaukasten.ch`). Die Modul-Zuordnungen (Nummer, Titel, Lehrjahr, Lernort BFS/üK,
> Pflicht/Wahlpflicht) wurden direkt aus der zugrundeliegenden Dataverse-API
> (`ictbb.crm17.dynamics.com`, Entität `beembk_modulmappings` mit Expand auf `beembk_Modul`)
> pro Abschlussprofil abgefragt. Damit entsprechen die Listen dem offiziellen, tagesaktuellen
> Datenbestand (cutoffDate der App: 2026-01-01).
>
> **Legende Tabellen:** LJ = empfohlenes Lehrjahr · Typ = Lernort (BFS = Berufsfachschule,
> üK = überbetrieblicher Kurs) · Kat = Pflicht- oder Wahlpflichtmodul im jeweiligen Profil.
> Ein Modul kann in verschiedenen Berufen unterschiedlichem Lehrjahr/Lernort zugeordnet sein.

---

## 1. Übersicht: ICT-Lehrberufe der Schweiz (berufliche Grundbildung)

| Beruf (offizielle Bezeichnung) | Abschluss | Dauer | Bildungserlass | Fachrichtungen |
|---|---|---|---|---|
| **Informatiker/in EFZ** | EFZ | 4 Jahre | BiVo 2021 | Applikationsentwicklung · Plattformentwicklung |
| **Mediamatiker/in EFZ** | EFZ | 4 Jahre | BiVo 2019 | — |
| **Entwickler/in digitales Business EFZ** | EFZ | 4 Jahre | BiVo 2023 | — (neu ab 2023) |
| **ICT-Fachfrau/-mann EFZ** | EFZ | 3 Jahre | BiVo 2017 (revidiert, neu ab 2026) | — |
| **Gebäudeinformatiker/in EFZ** | EFZ | 4 Jahre | BiVo 2021 | Gebäudeautomation · Kommunikation & Multimedia · Planung |
| **Betriebsinformatiker/in EFZ** | EFZ | 3 Jahre (verkürzt, für Erwachsene/2. Weg) | BiVo 2014-basiert (auslaufend) | — |
| **Informatikpraktiker/in EBA** | EBA | 2 Jahre | **abgeschafft** (2018 durch ICT-Fachmann/-frau EFZ ersetzt) | — |

**Wichtige Hinweise zur Systematik:**
- Es gibt **kein** aktuelles ICT-EBA (2-jährig) mehr. Der frühere *Informatikpraktiker/in EBA*
  wurde per 2018 eingestellt und durch die 3-jährige *ICT-Fachfrau/ICT-Fachmann EFZ* ersetzt
  (Begründung: EBA-Absolvent/innen fanden auf dem Arbeitsmarkt kaum Anschluss).
- Frühere Fachrichtungen von *Informatiker/in EFZ* aus BiVo 2014 (*Applikationsentwicklung*,
  *Systemtechnik*, *Betriebsinformatik*) sind ausgelaufen. Seit **BiVo 2021** gibt es zwei
  Fachrichtungen: **Applikationsentwicklung (APL)** und **Plattformentwicklung (PLE)**
  (PLE = Nachfolger von «Systemtechnik»).
- *Gebäudeinformatiker/in EFZ* liegt an der Schnittstelle Elektro/ICT (Trägerschaft mit
  EIT.swiss/suissetec); hier nur summarisch geführt.

---

## 2. Informatiker/in EFZ (BiVo 2021)

**Dauer:** 4 Jahre. Betrieb + i.d.R. 2 Tage/Woche Berufsfachschule + **35 Tage überbetriebliche
Kurse (üK)** über alle Lehrjahre.
**Fachrichtungen:** Applikationsentwicklung (APL) und Plattformentwicklung (PLE, ehem.
Systemtechnik). Das erste Lehrjahr ist weitgehend fachrichtungsübergreifend (gemeinsame
Grundlagenmodule), danach Spezialisierung.

### 2.1 Qualifikationsverfahren (QV)

Das QV besteht aus mehreren Qualifikationsbereichen (Gewichtung gemäss Ausführungsbestimmungen
zum QV BiVo 2021):

| Qualifikationsbereich | Gewichtung |
|---|---|
| **IPA** — Individuelle Praktische Arbeit (praktische Arbeit im Betrieb) | 30 % |
| Erfahrungsnote **Berufskenntnisse / Informatikkompetenzen** (BFS) | 30 % |
| Erfahrungsnote **Erweiterte Grundkompetenzen** (nur für Erlasse vor 2023) | 20 % |
| **Allgemeinbildung** (ABU) | 20 % |

- **IPA:** individuelle praktische Arbeit über **10 Arbeitstage**, Richtzeit **70–90 Stunden**;
  Aufgabenstellung durch den Lehrbetrieb nach nationalen Rahmenvorgaben, Bewertung durch
  Expert/innen (Expertenbesuch 0–4 Tage nach IPA-Start). Kriterien laut nationalem
  *Kriterienkatalog QV BiVo 2021*.
- *Hinweis:* Die BiVo 2021 wurde per Lehrbeginn 2023 leicht revidiert; die Erfahrungsnote
  «Erweiterte Grundkompetenzen» entfällt für neuere Erlasse (Gewichtungen entsprechend
  angepasst). Für den Datenkatalog exakte Gewichtung aus der aktuellen Ausführungsbestimmung
  ziehen.

### 2.2 Anschlusswege (Weiterbildung)

- **Berufsmaturität (BM):** lehrbegleitend (BM1) oder nach der Lehre (BM2) → prüfungsfreier
  FH-Zugang.
- **Höhere Berufsbildung:** eidg. Fachausweise (BP), z. B. *ICT-Application Development
  Specialist* / *ICT-Platform Development Specialist* / *Cyber Security Specialist*;
  eidg. Diplome (HFP): *ICT-Manager*, *Information Security Manager*.
- **Höhere Fachschule (HF):** *Dipl. Informatiker/in HF*.
- **Fachhochschule (FH):** BSc Informatik / Wirtschaftsinformatik (mit BM).

### 2.3 Module — Fachrichtung Applikationsentwicklung (APL, ab 2021)

| Nr | Titel | LJ | Typ | Kat |
|---|---|---|---|---|
| 106 | Datenbanken abfragen, bearbeiten und warten | 1 | üK | Pflicht |
| 107 | ICT-Lösungen mit Blockchain Technologie umsetzen | 2 | üK | Wahlpflicht |
| 109 | Dienste in der Public Cloud betreiben und überwachen | 2 | üK | Wahlpflicht |
| 110 | Daten mit Tools analysieren und darstellen | 3 | üK | Wahlpflicht |
| 114 | Codierungs-, Kompressions- und Verschlüsselungsverfahren einsetzen | 2 | BFS | Pflicht |
| 117 | Informatik- und Netzinfrastruktur für ein kleines Unternehmen realisieren | 1 | BFS | Pflicht |
| 122 | Abläufe mit einer Scriptsprache automatisieren | 1 | BFS | Pflicht |
| 162 | Daten analysieren und modellieren | 1 | BFS | Pflicht |
| 164 | Datenbanken erstellen und Daten einfügen | 1 | BFS | Pflicht |
| 165 | NoSQL-Datenbanken einsetzen | 2 | BFS | Pflicht |
| 183 | Applikationssicherheit implementieren | 3 | BFS | Pflicht |
| 185 | Sicherheitsmassnahmen für KMU IT analysieren & implementieren | 3 | üK | Wahlpflicht |
| 187 | ICT-Arbeitsplatz mit Betriebssystem in Betrieb nehmen | 1 | üK | Pflicht |
| 190 | Virtualisierungsplattform aufbauen und betreiben | 2 | üK | Wahlpflicht |
| 210 | Public Cloud für Anwendungen nutzen | 2 | üK | Wahlpflicht |
| 216 | Internet of Everything-Endgeräte in bestehende Plattform integrieren | 1 | üK | Wahlpflicht |
| 217 | Service für Internet of Everything konzipieren, planen und aufbauen | 3 | üK | Wahlpflicht |
| 223 | Multi-User-Applikationen objektorientiert realisieren | 3 | üK | Wahlpflicht |
| 231 | Datenschutz und Datensicherheit anwenden | 1 | BFS | Pflicht |
| 241 | Innovative ICT-Lösungen initialisieren | 4 | BFS | Pflicht |
| 245 | Innovative ICT-Lösungen umsetzen | 4 | BFS | Pflicht |
| 248 | ICT-Lösungen mit aktuellen Technologien realisieren | 2 | üK | Wahlpflicht |
| 254 | Geschäftsprozesse im eigenen Berufsumfeld beschreiben | 2 | BFS | Pflicht |
| 259 | ICT-Lösungen mit Machine Learning entwickeln | 2 | üK | Wahlpflicht |
| 293 | Webauftritt erstellen und veröffentlichen | 1 | BFS | Pflicht |
| 294 | Frontend einer interaktiven Webapplikation realisieren | 2 | üK | Pflicht |
| 295 | Backend für Applikationen realisieren | 2 | üK | Pflicht |
| 306 | Kleinprojekte im eigenen Berufsumfeld abwickeln | 3 | BFS | Pflicht |
| 319 | Applikationen entwerfen und implementieren | 1 | BFS | Pflicht |
| 320 | Objektorientiert Programmieren | 2 | BFS | Pflicht |
| 321 | Verteilte Systeme programmieren | 4 | BFS | Pflicht |
| 322 | Benutzerschnittstellen entwerfen und implementieren | 2 | BFS | Pflicht |
| 323 | Funktional Programmieren | 3 | BFS | Pflicht |
| 324 | DevOps-Prozesse mit Tools unterstützen | 4 | BFS | Pflicht |
| 335 | Mobile-Applikation realisieren | 3 | üK | Wahlpflicht |
| 346 | Cloud Lösungen konzipieren und realisieren | 2 | BFS | Pflicht |
| 347 | Dienst mit Container anwenden | 2 | BFS | Pflicht |
| 426 | Software mit agilen Methoden entwickeln | 2 | BFS | Pflicht |
| 431 | Aufträge im eigenen Berufsumfeld selbstständig durchführen | 1 | BFS | Pflicht |
| 450 | Applikationen testen | 3 | BFS | Pflicht |

### 2.4 Module — Fachrichtung Plattformentwicklung (PLE, ab 2021)

| Nr | Titel | LJ | Typ | Kat |
|---|---|---|---|---|
| 106 | Datenbanken abfragen, bearbeiten und warten | 1 | üK | Pflicht |
| 107 | ICT-Lösungen mit Blockchain Technologie umsetzen | 2 | üK | Wahlpflicht |
| 109 | Dienste in der Public Cloud betreiben und überwachen | 2 | üK | Wahlpflicht |
| 110 | Daten mit Tools analysieren und darstellen | 3 | üK | Wahlpflicht |
| 114 | Codierungs-, Kompressions- und Verschlüsselungsverfahren einsetzen | 2 | BFS | Pflicht |
| 117 | Informatik- und Netzinfrastruktur für ein kleines Unternehmen realisieren | 1 | BFS | Pflicht |
| 122 | Abläufe mit einer Scriptsprache automatisieren | 1 | BFS | Pflicht |
| 123 | Serverdienste in Betrieb nehmen | 1 | BFS | Pflicht |
| 129 | LAN-Komponenten in Betrieb nehmen | 2 | BFS | Pflicht |
| 141 | Datenbanksystem in Betrieb nehmen | 2 | BFS | Pflicht |
| 143 | Backup- und Restore-Systeme implementieren | 2 | BFS | Pflicht |
| 145 | Netzwerk betreiben und erweitern | 3 | BFS | Pflicht |
| 157 | IT-System-Einführung planen und durchführen | 4 | BFS | Pflicht |
| 158 | Software-Migration planen und durchführen | 2 | BFS | Pflicht |
| 159 | Directoryservices konfigurieren und in Betrieb nehmen | 3 | BFS | Pflicht |
| 162 | Daten analysieren und modellieren | 1 | BFS | Pflicht |
| 164 | Datenbanken erstellen und Daten einfügen | 1 | BFS | Pflicht |
| 169 | Services mit Containern bereitstellen | 2 | BFS | Pflicht |
| 182 | Systemsicherheit implementieren | 4 | BFS | Pflicht |
| 184 | Netzwerksicherheit implementieren | 2 | üK | Pflicht |
| 185 | Sicherheitsmassnahmen für KMU IT analysieren & implementieren | 3 | üK | Wahlpflicht |
| 187 | ICT-Arbeitsplatz mit Betriebssystem in Betrieb nehmen | 1 | üK | Pflicht |
| 188 | Services betreiben, warten und überwachen | 2 | üK | Pflicht |
| 190 | Virtualisierungsplattform aufbauen und betreiben | 2 | üK | Wahlpflicht |
| 210 | Public Cloud für Anwendungen nutzen | 2 | üK | Wahlpflicht |
| 216 | Internet of Everything-Endgeräte in bestehende Plattform integrieren | 1 | üK | Wahlpflicht |
| 217 | Service für Internet of Everything konzipieren, planen und aufbauen | 3 | üK | Wahlpflicht |
| 223 | Multi-User-Applikationen objektorientiert realisieren | 3 | üK | Wahlpflicht |
| 231 | Datenschutz und Datensicherheit anwenden | 1 | BFS | Pflicht |
| 241 | Innovative ICT-Lösungen initialisieren | 4 | BFS | Pflicht |
| 245 | Innovative ICT-Lösungen umsetzen | 4 | BFS | Pflicht |
| 248 | ICT-Lösungen mit aktuellen Technologien realisieren | 2 | üK | Wahlpflicht |
| 254 | Geschäftsprozesse im eigenen Berufsumfeld beschreiben | 2 | BFS | Pflicht |
| 259 | ICT-Lösungen mit Machine Learning entwickeln | 2 | üK | Wahlpflicht |
| 300 | Plattformübergreifende Dienste in ein Netzwerk integrieren | 3 | BFS | Pflicht |
| 306 | Kleinprojekte im eigenen Berufsumfeld abwickeln | 3 | BFS | Pflicht |
| 319 | Applikationen entwerfen und implementieren | 1 | BFS | Pflicht |
| 335 | Mobile-Applikation realisieren | 3 | üK | Wahlpflicht |
| 346 | Cloud Lösungen konzipieren und realisieren | 2 | BFS | Pflicht |
| 431 | Aufträge im eigenen Berufsumfeld selbstständig durchführen | 1 | BFS | Pflicht |

> **Gemeinsame Grundlagenmodule APL+PLE** (Auszug 1. LJ): 106, 117, 122, 162, 164, 187, 231,
> 293/—, 319, 431. Ab 2. LJ divergieren die Fachrichtungen (APL: 165, 294, 295, 320, 322, 323,
> 324, 346, 347, 426, 450 · PLE: 123, 129, 141, 143, 145, 157, 158, 159, 169, 182, 184, 188, 300).

---

## 3. Mediamatiker/in EFZ (BiVo 2019)

**Dauer:** 4 Jahre. Generalistische Ausbildung an der Schnittstelle Gestaltung / Marketing /
Kommunikation / ICT (Multimedia-Produktion, Grafik/Print, Marketing, Web, Administration).
**QV:** IPA + Erfahrungsnoten Berufskenntnisse + Allgemeinbildung (Details in den
Ausführungsbestimmungen Mediamatiker/in EFZ).
**Anschluss:** BM → FH (z. B. Kommunikation/Multimedia Design), eidg. Fachausweise
(*Multimedia Content Creator*, *Digital Collaboration Specialist*), HF.

| Nr | Titel | LJ | Typ | Kat |
|---|---|---|---|---|
| 101 | Webauftritt erstellen und veröffentlichen | 1 | üK | Pflicht |
| 213 | Teamverhalten entwickeln | 1 | BFS | Pflicht |
| 264 | Digitale Medienproduktionen vorbereiten | 1 | BFS | Pflicht |
| 265 | Digitale Fotografien produzieren | 1 | BFS | Pflicht |
| 266 | Digitale Animationen produzieren | 2 | BFS | Pflicht |
| 267 | Digitale Audioaufnahmen produzieren | 3 | BFS | Pflicht |
| 268 | Digitale Filme produzieren | 3 | BFS | Pflicht |
| 269 | Fotografieprojekt realisieren | 2 | üK | Pflicht |
| 270 | Farbe und Typografie bestimmen und einsetzen | 1 | BFS | Pflicht |
| 271 | Vektordaten erstellen und Bilder bearbeiten | 1 | BFS | Pflicht |
| 272 | Printprodukte entwerfen und umsetzen | 1 | üK | Pflicht |
| 273 | Layouts anlegen | 2 | BFS | Pflicht |
| 274 | Druckdaten aufbereiten und ausgeben | 3 | BFS | Pflicht |
| 275 | Gestaltungsentwürfe entwickeln und präsentieren | 4 | BFS | Pflicht |
| 276 | Medien für eine Marketingaktion erstellen | 3 | üK | Pflicht |
| 278 | Den Markt analysieren und strategische Ziele ableiten | 2 | BFS | Pflicht |
| 279 | Marketingkonzept entwickeln und präsentieren | 2 | BFS | Pflicht |
| 280 | Analoge und digitale Marketingprodukte konzipieren | 3 | BFS | Pflicht |
| 281 | Social-Media-Kanäle aufbauen und bewirtschaften | 3 | BFS | Pflicht |
| 282 | Marketingkennzahlen auswerten und Inhalte für die betriebliche Kommunikation aufbereiten | 4 | BFS | Pflicht |
| 283 | Offerten rechtskonform erstellen und überprüfen | 1 | BFS | Pflicht |
| 284 | Leistungserbringung kalkulieren und Zahlungsprozess abwickeln | 2 | BFS | Pflicht |
| 285 | Jahresabschluss analysieren und Wirtschaftlichkeitsrechnung durchführen | 3 | BFS | Pflicht |
| 286 | Eigene ICT-Arbeitsinstrumente einrichten und bedienen | 1 | BFS | Pflicht |
| 287 | Websites mit CSS gestalten | 1 | BFS | Pflicht |
| 288 | Programmiertechniken im Webfrontend einsetzen | 2 | BFS | Pflicht |
| 289 | CMS einsetzen und bewirtschaften | 2 | üK | Pflicht |
| 290 | Datenbanken abfragen und verändern | 3 | BFS | Pflicht |
| 291 | Oberflächen (UIs) mit Webtechnologien entwickeln | 3 | BFS | Pflicht |
| 306 | Kleinprojekte im eigenen Berufsumfeld abwickeln | 3 | BFS | Pflicht |
| 307 | Interaktive Webseite mit Formular erstellen | 2 | BFS | Pflicht |
| 431 | Aufträge im eigenen Berufsumfeld selbstständig durchführen | 2 | BFS | Pflicht |

---

## 4. Entwickler/in digitales Business EFZ (BiVo 2023)

**Dauer:** 4 Jahre. Jüngster ICT-Beruf (Start 2023); Schnittstelle zwischen Business,
Technik und Mensch — Prozessanalyse, Datenanalyse, Projektbegleitung, digitale Lösungen.
**Besonderheit:** stark modularisiert mit **Standardpfad** (StdPfad, empfohlene Kombination)
und zahlreichen Wahlpflichtmodulen. Viele Module haben Bildungsteil-Kategorie
«BK-Pflicht/Wahlpflicht» (Bildungskompetenzen) bzw. üK.

| Nr | Titel | LJ | Typ | Kat |
|---|---|---|---|---|
| 119 | Im Digital Business Umfeld auftreten und präsentieren | 1 | BFS | Pflicht |
| 134 | Projektentwicklung mit agilen Methoden ermöglichen | 1 | BFS | Pflicht |
| 162 | Daten analysieren und modellieren | 1 | BFS | Pflicht |
| 164 | Datenbanken erstellen und Daten einfügen | 2 | BFS | Wahlpflicht |
| 168 | Geschäftsprozesse mit ICT-Mitteln unterstützen | 3 | BFS | Pflicht |
| 213 | Teamverhalten entwickeln | 2 | BFS | Pflicht |
| 218 | Einführung von Softwaresystemen und IT-Services koordinieren und fachlich begleiten | 2 | BFS | Wahlpflicht |
| 219 | Benutzerdokumentation und Schulungsunterlagen erstellen | 3 | BFS | Pflicht |
| 220 | Anlässe unter Anleitung durchführen | 3 | BFS | Pflicht |
| 224 | Mit digitalen Kollaborationstools arbeiten | 1 | BFS | Wahlpflicht |
| 229 | Wirkungsvoll kommunizieren und moderieren | 4 | BFS | Pflicht |
| 230 | Geschäftsprozesse nach Grundsätzen des Prozessmanagements modellieren | 1 | BFS | Pflicht |
| 231 | Datenschutz und Datensicherheit anwenden | 2 | BFS | Pflicht |
| 235 | Daten zielgruppengerecht visualisieren | 4 | BFS | Pflicht |
| 248 | ICT-Lösungen mit aktuellen Technologien realisieren | 2 | üK | Wahlpflicht |
| 254 | Geschäftsprozesse im eigenen Berufsumfeld beschreiben | 1 | BFS | Pflicht |
| 278 | Den Markt analysieren und strategische Ziele ableiten | 2 | BFS | Wahlpflicht |
| 279 | Marketingkonzept entwickeln und präsentieren | 2 | BFS | Wahlpflicht |
| 282 | Marketingkennzahlen auswerten und Inhalte für die betriebliche Kommunikation aufbereiten | 3 | BFS | Wahlpflicht |
| 310 | Einen Workshop selbständig methodisch vorbereiten und durchführen | 3 | üK | Wahlpflicht |
| 319 | Applikationen entwerfen und implementieren | 1 | BFS | Pflicht |
| 325 | Prozesse mit einer Programmiersprache automatisieren | 2 | üK | Pflicht |
| 331 | Aufträge methodenunterstützt ausführen | 1 | BFS | Pflicht |
| 332 | Angebote evaluieren | 1 | BFS | Wahlpflicht |
| 333 | Projektumsetzung mit Methoden unterstützen | 2 | BFS | Pflicht |
| 336 | Projekte mit traditionellem Projektmanagement umsetzen | 2 | BFS | Pflicht |
| 337 | Agiles Vorgehen im traditionellen Projektumfeld ermöglichen | 4 | BFS | Wahlpflicht |
| 338 | Lösungen kreativ und innovativ entwickeln | 2 | üK | Wahlpflicht |
| 339 | Innovatives Projektmanagement ermöglichen | 4 | BFS | Pflicht |
| 348 | Geschäftsprozesse erfassen, modellieren und kritische Punkte ermitteln | 1 | üK | Pflicht |
| 349 | Geschäftsprozesse optimieren | 2 | BFS | Pflicht |
| 367 | Anforderungen an die Automatisierung von Geschäftsprozessen definieren und überprüfen | 2 | BFS | Pflicht |
| 368 | Lösungsmöglichkeiten für Kundenerlebnisse erarbeiten | 3 | üK | Pflicht |
| 370 | Mit verschiedenen Anspruchsgruppen in einer Fremdsprache kommunizieren | 1 | BFS | Pflicht |
| 371 | Präsentation in einer Fremdsprache durchführen (bilingualer Unterricht) | 2 | BFS | Pflicht |
| 372 | Schulungssequenz in einer Fremdsprache durchführen (bilingualer Unterricht) | 3 | BFS | Wahlpflicht |
| 373 | Mit Stakeholdern in einer Fremdsprache kommunizieren (bilingualer Unterricht) | 4 | BFS | Wahlpflicht |
| 374 | Daten mit verschiedenen Methoden erheben | 1 | BFS | Pflicht |
| 375 | Daten statistisch auswerten | 1 | BFS | Wahlpflicht |
| 376 | Daten erheben und auswerten | 1 | üK | Pflicht |
| 377 | Logik in der Datenanalyse anwenden | 2 | BFS | Wahlpflicht |
| 378 | Daten bereinigen und deren Plausibilität sowie Qualität überprüfen | 3 | BFS | Pflicht |
| 379 | Daten auswerten und interpretieren | 4 | BFS | Pflicht |
| 392 | Nutzer-Daten mittels Analysetools auswerten | 3 | BFS | Wahlpflicht |
| 393 | Daten mit künstlicher Intelligenz (KI) / Machine Learning (ML) auswerten | 3 | üK | Wahlpflicht |
| 394 | Digitale Transformation untersuchen | 3 | üK | Wahlpflicht |
| 395 | Ideen und Szenarien für digitale Geschäftsmodelle evaluieren | 2 | üK | Wahlpflicht |
| 396 | Geschäftsmodelle entwerfen | 4 | BFS | Wahlpflicht |

---

## 5. ICT-Fachfrau / ICT-Fachmann EFZ

**Dauer:** 3 Jahre. Praxisnaher Beruf für den Betrieb/Support von ICT-Mitteln (Endgeräte,
Netzwerk, Server-Grundlagen, Benutzersupport). Fremdsprache (Englisch) im Bildungsplan verankert.
**Zwei Erlasse relevant:** die bisherige **BiVo 2017** (auslaufend) und die **revidierte
Fassung mit Start 2026** (BiVo 2026). Der revidierte Bildungsplan wurde 2025 beim SBFI
eingereicht/genehmigt. Für Neu-Lehrverhältnisse ab 2026 gilt die 2026er-Liste.

### 5.1 Module — ICT-Fachfrau/-mann EFZ (BiVo 2026, neu)

| Nr | Titel | LJ | Typ | Kat |
|---|---|---|---|---|
| 117 | Informatik- und Netzinfrastruktur für ein kleines Unternehmen realisieren | 1 | BFS | Pflicht |
| 122 | Abläufe mit einer Scriptsprache automatisieren | 2 | BFS | Pflicht |
| 123 | Serverdienste in Betrieb nehmen | 1 | BFS | Pflicht |
| 126 | Peripheriegeräte im Netzwerkbetrieb einsetzen | 1 | BFS | Pflicht |
| 129 | LAN-Komponenten in Betrieb nehmen | 2 | BFS | Pflicht |
| 187 | ICT-Benutzerendgeräte und Arbeitsplatz in Betrieb nehmen | 1 | BFS | Pflicht |
| 208 | Störungen in Virtualisierungs- und Cloudsystemen bearbeiten | 2 | üK | Pflicht |
| 214 | Benutzerinnen und Benutzer im Umgang mit Informatikmitteln instruieren | 1 | BFS | Pflicht |
| 261 | Funktion von ICT-Benutzer-Endgeräten in Netzinfrastruktur gewährleisten | 2 | üK | Pflicht |
| 263 | Sicherheit von ICT-Benutzerendgeräten gewährleisten | 3 | BFS | Pflicht |
| 313 | ICT-Mittel in Betrieb nehmen und kleines LAN aufbauen | 1 | üK | Pflicht |
| 327 | Automatisierungstechnologien einsetzen | 2 | üK | Pflicht |
| 334 | Fachinformationen recherchieren und für sich selbst dokumentieren (Englisch) | 1 | BFS | Pflicht |
| 369 | Konflikte im Support erkennen und deeskalieren (Englisch) | 3 | BFS | Pflicht |
| 370 | Mit verschiedenen Anspruchsgruppen in einer Fremdsprache kommunizieren (Englisch) | 3 | BFS | Pflicht |
| 431 | Aufträge im eigenen Berufsumfeld selbstständig durchführen | 1 | BFS | Pflicht |
| 437 | Supportarbeiten durchführen (Englisch) | 2 | BFS | Pflicht |

### 5.2 Module — ICT-Fachfrau/-mann EFZ (BiVo 2017, auslaufend)

| Nr | Titel | LJ | Typ | Kat |
|---|---|---|---|---|
| 117 | Informatik- und Netzinfrastruktur für ein kleines Unternehmen realisieren | 1 | BFS | Pflicht |
| 122 | Abläufe mit einer Scriptsprache automatisieren | 3 | BFS | Pflicht |
| 123 | Serverdienste in Betrieb nehmen | 1 | BFS | Pflicht |
| 126 | Peripheriegeräte im Netzwerkbetrieb einsetzen | 1 | BFS | Pflicht |
| 129 | LAN-Komponenten in Betrieb nehmen | 2 | BFS | Pflicht |
| 214 | Benutzer/innen im Umgang mit Informatikmitteln instruieren | 1 | BFS | Pflicht |
| 260 | Office Werkzeuge praxisorientiert einsetzen | 1 | üK | Pflicht |
| 261 | Funktion von ICT-Benutzer-Endgeräten in Netzinfrastruktur gewährleisten | 2 | üK | Pflicht |
| 262 | Evaluation von ICT-Mitteln durchführen | 3 | BFS | Pflicht |
| 263 | Sicherheit von ICT-Benutzerendgeräten gewährleisten | 2 | BFS | Pflicht |
| 304 | Einzelplatz-Computer in Betrieb nehmen | 1 | üK | Pflicht |
| 305 | Betriebssysteme installieren, konfigurieren und administrieren | 1 | üK | Pflicht |
| 431 | Aufträge im eigenen Berufsumfeld selbstständig durchführen | 1 | BFS | Pflicht |
| 437 | Im Support arbeiten | 1 | BFS | Pflicht |

---

## 6. Betriebsinformatiker/in EFZ (auslaufend, BiVo-2014-Systematik)

**Kontext:** Verkürztes/2.-Weg-EFZ (häufig für Erwachsene / Quereinsteiger), stark auf
betriebliche Informatik ausgerichtet. Grosser Anteil an **Wahlmodulen** (Schul-Wahlmodul,
üK-Wahlmodul). Wird durch die neue Systematik (Informatiker EFZ / ICT-Fachmann EFZ) abgelöst;
nur zur Vollständigkeit geführt. Kat-Werte hier: `Pflicht` bzw. `Wahl` (Wahlmodul).

<details>
<summary>Modulliste Betriebsinformatiker/in EFZ (57 Einträge) — aufklappen</summary>

| Nr | Titel | LJ | Typ | Kat |
|---|---|---|---|---|
| 100 | Daten charakterisieren, aufbereiten und auswerten | 1 | BFS | Pflicht |
| 101 | Webauftritt erstellen und veröffentlichen | 1 | üK | Pflicht |
| 104 | Datenmodell implementieren | 1 | BFS | Pflicht |
| 105 | Datenbanken mit SQL bearbeiten | 3 | üK | Wahl |
| 114 | Codierungs-, Kompressions- und Verschlüsselungsverfahren einsetzen | 1 | BFS | Pflicht |
| 115 | Multimedia-Einrichtungen in Betrieb nehmen | 2 | BFS | Wahl |
| 117 | Informatik- und Netzinfrastruktur für ein kleines Unternehmen realisieren | 1 | BFS | Pflicht |
| 120 | Benutzerschnittstellen implementieren | 2 | BFS | Wahl |
| 121 | Steuerungsaufgaben bearbeiten | 2 | BFS | Wahl |
| 122 | Abläufe mit einer Scriptsprache automatisieren | 2 | BFS | Pflicht |
| 123 | Serverdienste in Betrieb nehmen | 1 | BFS | Pflicht |
| 124 | Einzelplatzcomputer auf-/umrüsten | 2 | BFS | Wahl |
| 126 | Peripheriegeräte im Netzwerkbetrieb einsetzen | 2 | BFS | Wahl |
| 127 | Server betreiben | 2 | üK | Pflicht |
| 129 | LAN-Komponenten in Betrieb nehmen | 2 | BFS | Pflicht |
| 130 | LAN ausmessen und prüfen | 2 | üK | Wahl |
| 133 | Web-Applikation mit Session-Handling realisieren | 3 | BFS | Pflicht |
| 138 | Informatik-Arbeitsplätze planen und einrichten | 3 | BFS | Wahl |
| 140 | Datenbanksysteme betreiben | 3 | BFS | Wahl |
| 141 | Datenbanksystem in Betrieb nehmen | 3 | BFS | Wahl |
| 143 | Backup- und Restore-Systeme implementieren | 3 | BFS | Pflicht |
| 145 | Netzwerk betreiben und erweitern | 3 | BFS | Wahl |
| 146 | Internetanbindung für ein Unternehmen realisieren | 3 | BFS | Wahl |
| 151 | Datenbanken in Web-Applikation einbinden | 3 | BFS | Wahl |
| 153 | Datenmodelle entwickeln | 4 | BFS | Wahl |
| 157 | IT-System-Einführung planen und durchführen | 4 | BFS | Wahl |
| 158 | Software-Migration planen und durchführen | 4 | BFS | Wahl |
| 159 | Directoryservices konfigurieren und in Betrieb nehmen | 4 | BFS | Pflicht |
| 182 | Systemsicherheit implementieren | 4 | BFS | Wahl |
| 183 | Applikationssicherheit implementieren | 4 | BFS | Wahl |
| 184 | Netzwerksicherheit implementieren | 4 | üK | Wahl |
| 213 | Teamverhalten entwickeln | 2 | BFS | Wahl |
| 214 | Benutzer/innen im Umgang mit Informatikmitteln instruieren | 2 | BFS | Pflicht |
| 223 | Multi-User-Applikationen objektorientiert realisieren | 4 | üK | Wahl |
| 239 | Internetserver in Betrieb nehmen | 3 | BFS | Wahl |
| 256 | Clientseitige Anwendung realisieren | 2 | üK | Wahl |
| 300 | Plattformübergreifende Dienste in ein Netzwerk integrieren | 3 | BFS | Wahl |
| 301 | Office Werkzeuge anwenden | 1 | BFS | Wahl |
| 302 | Fortgeschrittene Funktionen von Office Werkzeugen nutzen | 1 | üK | Wahl |
| 304 | Einzelplatz-Computer in Betrieb nehmen | 1 | üK | Pflicht |
| 305 | Betriebssysteme installieren, konfigurieren und administrieren | 1 | üK | Pflicht |
| 306 | Kleinprojekte im eigenen Berufsumfeld abwickeln | 3 | BFS | Pflicht |
| 307 | Interaktive Webseite mit Formular erstellen | 2 | üK | Wahl |
| 318 | Analysieren und objektbasiert programmieren mit Komponenten | 2 | üK | Wahl |
| 326 | Objektorientiert entwerfen und implementieren | 3 | BFS | Wahl |
| 330 | IP-Telefoniesystem in Betrieb nehmen | 4 | üK | Wahl |
| 340 | IT Infrastruktur virtualisieren | 4 | üK | Wahl |
| 403 | Programmabläufe prozedural implementieren | 1 | BFS | Pflicht |
| 404 | Objektbasiert programmieren nach Vorgabe | 1 | BFS | Pflicht |
| 411 | Datenstrukturen und Algorithmen entwerfen und anwenden | 2 | BFS | Wahl |
| 426 | Software mit agilen Methoden entwickeln | 2 | BFS | Wahl |
| 431 | Aufträge im eigenen Berufsumfeld selbstständig durchführen | 1 | BFS | Pflicht |
| 437 | Im Support arbeiten | 2 | BFS | Wahl |
| 226A | Objektorientiert (ohne Vererbung) implementieren | 2 | BFS | Pflicht |
| 226B | Objektorientiert (mit Vererbung) implementieren | 2 | BFS | Pflicht |

</details>

---

## 7. Gebäudeinformatiker/in EFZ (BiVo 2021) — Kurzprofil

4-jähriges EFZ an der Schnittstelle Elektro/Gebäudetechnik ↔ ICT. Drei Fachrichtungen:
**Gebäudeautomation (GA)**, **Kommunikation und Multimedia (MMK)**, **Planung (PLA)**.
Inhalte: Smart Home, Netzwerk-/Multimediaverkabelung, Gebäudeautomation, Planung.
Modullisten pro Fachrichtung sind im Modulbaukasten verfügbar (hier nicht ausgeführt, da
näher an der Elektrobranche als am Kern-ICT-Cluster).

---

## 8. Besonders anspruchsvolle / prüfungsrelevante Module (Erfahrungswerte)

> Hinweis: Zu einzelnen Modulen liessen sich in öffentlich indexierten Foren
> (Reddit r/informatik_schweiz etc.) **keine belastbaren, zitierfähigen** Erfahrungsberichte
> über Suchmaschinen abrufen. Die folgende Einschätzung basiert auf der inhaltlichen Schwere
> der Modulbeschreibungen und der üblichen Studien-/Lehrpraxis, **nicht** auf verifizierten
> Foren-Zitaten — entsprechend mit Vorsicht in den Datenkatalog übernehmen (Feld z. B. als
> «difficulty: heuristic»).

**Informatiker EFZ Applikationsentwicklung — erfahrungsgemäss fordernd:**
- **320 Objektorientiert Programmieren** und **323 Funktional Programmieren** — abstrakte
  Programmierparadigmen, hoher Konzeptanteil.
- **321 Verteilte Systeme programmieren** (4. LJ) — Nebenläufigkeit/Netzwerk, prüfungsnah.
- **114 Codierungs-, Kompressions- und Verschlüsselungsverfahren einsetzen** — mathematik-
  und theorielastig.
- **450 Applikationen testen** und **324 DevOps** — konzeptionell breit, QV-relevant.

**Informatiker EFZ Plattformentwicklung — erfahrungsgemäss fordernd:**
- **145 Netzwerk betreiben und erweitern**, **159 Directoryservices**,
  **182 Systemsicherheit**, **184 Netzwerksicherheit** — dichte Infrastruktur-/Security-Themen.
- **300 Plattformübergreifende Dienste integrieren** — Integrationskomplexität.

**Querschnitt/Alle:** Die **IPA** (30 % QV-Gewicht) gilt als der prüfungsentscheidende Block;
zusätzlich sind **231 Datenschutz und Datensicherheit** und **254 Geschäftsprozesse** als
Grundlagen QV-relevant.

---

## 9. Weiterbildungen / Höhere Berufsbildung ICT

### 9.1 Eidg. Fachausweise (Berufsprüfung BP) — NQR 6 (≈ Bachelor-Niveau)

| Fachausweis (aktuelle Bezeichnung) | frühere Bezeichnung |
|---|---|
| **AI Business Specialist mit eidg. Fachausweis** | (neu ab 2026) |
| **Cyber Security Specialist mit eidg. Fachausweis** | — |
| **Digital Collaboration Specialist mit eidg. Fachausweis** | — |
| **ICT-Application Development Specialist mit eidg. Fachausweis** | ICT-Applikationsentwickler/in |
| **ICT-Platform Development Specialist mit eidg. Fachausweis** | ICT-System- und Netzwerktechniker/in |
| **Multimedia Content Creator mit eidg. Fachausweis** | — |
| **Wirtschaftsinformatiker/in mit eidg. Fachausweis** | — |

### 9.2 Eidg. Diplome (Höhere Fachprüfung HFP) — NQR 7 (≈ Master-Niveau)

| Diplom | frühere Bezeichnung |
|---|---|
| **ICT-Manager mit eidg. Diplom** | — |
| **Information Security Manager mit eidg. Diplom** | ICT Security Expert |

### 9.3 Höhere Fachschulen (HF)

- **Dipl. Informatiker/in HF** (Vertiefungen u. a. Applikationsentwicklung, Systemtechnik)
- **Dipl. Wirtschaftsinformatiker/in HF**
- **Dipl. Gebäudeautomatiker/in HF**

### 9.4 Fachhochschule (FH)

- BSc **Informatik**, **Wirtschaftsinformatik**, **Data Science**, **Cyber Security** u. a.
  (Zugang mit Berufsmaturität; ohne BM via Passerelle/Aufnahmeverfahren).

---

## 10. Methodik & Verlässlichkeit

- **Modullisten (Kap. 2–6):** direkt aus dem offiziellen Modulbaukasten-Datenbestand
  (Dataverse `beembk_modulmappings` + `beembk_Modul`) je Abschlussprofil abgefragt →
  **hohe Verlässlichkeit** bei Nummern, Titeln, Lernort (BFS/üK) und Pflicht/Wahlpflicht.
  Das «Lehrjahr» ist die im System hinterlegte Empfehlung (Level) und kann je Berufsfachschule/
  Kanton im konkreten Semesterplan abweichen.
- Vereinzelt liefert das System für einzelne Zuordnungen doppelte Mapping-Einträge
  (z. B. Regionen/Sprachvarianten); diese wurden je Modul+Lernort dedupliziert.
- **QV-Gewichtungen, Berufsbeschriebe, Weiterbildungstitel:** aus offiziellen Seiten von
  ICT-Berufsbildung Schweiz und berufsberatung.ch — verlässlich, exakte QV-Prozentzahlen
  jedoch für den finalen Katalog gegen die tagesaktuelle *Ausführungsbestimmung zum QV*
  des jeweiligen Erlassjahres verifizieren.
- **«Schwierige Module» (Kap. 8):** heuristisch, **nicht** durch zitierfähige Foren-Quellen
  belegt.

---

## 11. Quellen (URLs)

**Primär (Berufe/Struktur):**
- ICT-Berufsbildung Schweiz — ICT-Lehren Übersicht: https://www.ict-berufsbildung.ch/grundbildung/ict-lehren
- Informatiker/in EFZ: https://www.ict-berufsbildung.ch/grundbildung/ict-lehren/informatiker-in-efz
- Informatiker/in EFZ AP (BiVo 2021): https://ict-berufsbildung.ch/berufsbildung/informatikerin-efz-applikationsentwicklung-bivo-2021
- Mediamatiker/in EFZ: https://www.ict-berufsbildung.ch/grundbildung/ict-lehren/mediamatiker-in-efz
- ICT-Fachfrau/-mann EFZ (Info): https://www.ict-berufsbildung.ch/grundbildung/ict-lehren/ict-fachmann-frau-efz
- Entwickler/in digitales Business EFZ: https://www.ict-berufsbildung.ch/grundbildung/ict-lehren/entwickler-in-digitales-business-efz
- Revision ICT-Fachmann/-frau EFZ 2026 (Netzwoche): https://www.netzwoche.ch/news/2025-06-13/ict-berufsbildung-reicht-revidierten-bildungsplan-fuer-ict-fachmann-frau-efz-ein
- Ablösung Informatikpraktiker EBA → ICT-Fachmann EFZ (zebis): https://www.zebis.ch/news/neues-berufsbild-fuer-die-digitale-zukunft

**Modulbaukasten (Modul-Daten):**
- Modulbaukasten App: https://www.modulbaukasten.ch/
- Direktansicht APL 2021: https://www.modulbaukasten.ch/?d=Informatiker%2Fin-EFZ-Applikationsentwicklung-%28ab-2021%29
- Datengrundlage (Dataverse, öffentlich über App-Token): `https://ictbb.crm17.dynamics.com/api/data/v9.1/` (Entitäten `beembk_abschlusses`, `beembk_modulmappings`, `beembk_moduls`)
- Einzelmodul-PDFs: `https://modulbaukasten.ch/Module/<pdfName>`

**Qualifikationsverfahren:**
- QV-Übersicht ICT-Berufsbildung: https://www.ict-berufsbildung.ch/grundbildung/fuer-lernende/qualifikationsverfahren
- Kriterienkatalog QV BiVo 2021 (PDF): https://www.ict-berufsbildung.ch/resources/Kriterienkatalog_QV_BiVO2021_DE-20251025.pdf
- Ausführungsbestimmungen QV Informatiker EFZ (PDF): https://www.ict-berufsbildung.ch/resources/Informatiker-EFZ_Ausfuehrungsbestimmungen_QV_202406121.pdf
- QV-Leitfaden PK19 Zürich 2026 (PDF): https://www.pk19.ch/wp-content/uploads/2025/11/INF_QV-Leitfaden_2026.pdf

**Weiterbildung:**
- ICT-Weiterbildung Fachausweise/Diplome: https://www.ict-berufsbildung.ch/weiterbildung/fachausweis
- Höhere Berufsbildung (ZLI): https://www.zli.ch/ict-berufe/hoehere-berufsbildung

**Berufsberatung / SBFI:**
- berufsberatung.ch — Mediamatiker/in EFZ: https://www.berufsberatung.ch/dyn/show/1900?id=4034
- berufsberatung.ch — Informatiker/in EFZ: https://www.berufsberatung.ch/dyn/show/1900?id=7671
- berufsberatung.ch — EBA-Berufe (2-jährig): https://www.berufsberatung.ch/dyn/show/2101

_Stand der Recherche: Juli 2026. Modul-Datenbestand des Modulbaukastens mit App-Cutoff 2026-01-01._
