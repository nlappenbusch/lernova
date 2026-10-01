// Fächer-Katalog (ICT-Schwerpunkt) + Schulstufen + SEO-Städte.
// Grundlage für Programmatic SEO (/nachhilfe/[fach]/[stufe]/[ort]),
// das Lead-Formular und das Tutor-Matching.

export type SubjectCategory = "ict" | "school" | "business";

export type CurriculumModule = {
  code: string;
  year: string;
  title: string;
  focus: string;
  summary?: string;
  learningGoals?: string[];
  practicalExamples?: string[];
  prerequisites?: string[];
  bestWayToLearn?: string[];
  support?: string[];
};

export type LearningPhase = {
  phase: string;
  title: string;
  detail: string;
};

export type Subject = {
  slug: string;
  name: string;
  category: SubjectCategory;
  short: string;
  blurb: string;
  keywords: string[];
  officialGroup?: string;
  track?: string;
  officialCatalog?: string;
  modules?: CurriculumModule[];
  learningPlan?: LearningPhase[];
};

export const OFFICIAL_ICT_CATALOG =
  "Schweizer ICT-Modulbaukasten – fachbereichsbezogene Ausbildungs- und Lernmodule mit klarer Reihenfolge und Kompetenzziel.";

export const SUBJECTS: Subject[] = [
  {
    slug: "programmieren-python",
    name: "Python",
    category: "ict",
    short: "Von den Grundlagen bis zu Datenanalyse und Automatisierung.",
    blurb:
      "Python ist die meistgefragte Einstiegssprache — an Berufsschulen, Gymnasien und Hochschulen. Unsere Tutor:innen begleiten von den ersten Skripten über OOP bis zu Datenanalyse, Automatisierung und Prüfungsvorbereitung.",
    keywords: ["python nachhilfe", "python lernen", "programmieren lernen", "python prüfung"],
    officialGroup: "Application Engineering",
    track: "Programmierung & Automation",
    modules: [
      { code: "PY-01", year: "1. Lehrjahr", title: "Einführung in Python", focus: "Variablen, Bedingungen, Schleifen, Funktionen und erste Projekte." },
      { code: "PY-02", year: "1./2. Lehrjahr", title: "Datenstrukturen & Logik", focus: "Listen, Dictionaries, Strings, Algorithmen und Fehlerbehandlung." },
      { code: "PY-03", year: "2. Lehrjahr", title: "Objektorientierung", focus: "Klassen, Objekte, Vererbung, Module und saubere Projektstrukturen." },
      { code: "PY-04", year: "2./3. Lehrjahr", title: "Datenanalyse & Automatisierung", focus: "CSV, APIs, Pandas, Automationen und kleine Praxisprojekte." },
      { code: "PY-05", year: "3. Lehrjahr", title: "Projekt & Prüfung", focus: "IPA- und Modulvorbereitung mit Code-Review und Dokumentation." },
    ],
    learningPlan: [
      { phase: "Grundlagen", title: "Programmieren verstehen", detail: "Syntax, Ablauf, Funktionen und erste kleine Projekte mit Python." },
      { phase: "Vertiefung", title: "Strukturen & OOP", detail: "Datenstrukturen, Klassen, Vererbung und robuste Projektarchitekturen." },
      { phase: "Prüfung & Praxis", title: "Automatisierung & Analyse", detail: "Daten verarbeiten, Prozesse automatisieren und gezielt prüfen." },
    ],
  },
  {
    slug: "programmieren-java",
    name: "Java",
    category: "ict",
    short: "OOP, Collections, Spring — sattelfest für Modul- und Semesterprüfungen.",
    blurb:
      "Java ist Standard in der Applikationsentwicklung EFZ und an vielen Hochschulen. Wir helfen bei OOP-Konzepten, Datenstrukturen, JUnit und der Vorbereitung auf Modul- und Semesterprüfungen.",
    keywords: ["java nachhilfe", "java lernen", "oop verstehen", "applikationsentwicklung java"],
    officialGroup: "Application Engineering",
    track: "Objektorientierte Softwareentwicklung",
    modules: [
      { code: "JAVA-01", year: "1. Lehrjahr", title: "Java-Grundlagen", focus: "Syntax, Datentypen, Kontrollstrukturen, Methoden und Debugging." },
      { code: "JAVA-02", year: "1./2. Lehrjahr", title: "Objektorientierung", focus: "Klassen, Objekte, Interfaces, Vererbung und Polymorphie." },
      { code: "JAVA-03", year: "2. Lehrjahr", title: "Datenstrukturen", focus: "Arrays, Collections, Maps, Sortierung und Algorithmen." },
      { code: "JAVA-04", year: "2./3. Lehrjahr", title: "APIs & Datenbanken", focus: "JDBC, Fehlerbehandlung, REST und Datenzugriff in Projekten." },
      { code: "JAVA-05", year: "3. Lehrjahr", title: "Projekt & Prüfung", focus: "Modulprüfungen, Clean Code und Projekt-Qualitätskriterien." },
    ],
    learningPlan: [
      { phase: "Grundlagen", title: "Java lesen & schreiben", detail: "Syntax, Methoden und der erste Umgang mit Objekten." },
      { phase: "Vertiefung", title: "Daten & Architektur", detail: "Collections, APIs und saubere Programmentwicklung." },
      { phase: "Prüfung & Praxis", title: "Modultraining", detail: "Projektmuster, Code-Review und Prüfungsstrategie." },
    ],
  },
  {
    slug: "programmieren-csharp",
    name: "C#",
    category: "ict",
    short: ".NET, Objektorientierung und saubere Architektur.",
    blurb:
      "C# und .NET sind in Schweizer Lehrbetrieben weit verbreitet. Unsere Tutor:innen unterstützen bei Übungen aus dem Betrieb, üK-Modulen und Projektarbeiten — praxisnah und auf Augenhöhe.",
    keywords: ["c# nachhilfe", ".net lernen", "csharp hilfe"],
    officialGroup: "Softwareentwicklung & App-Engineering",
    track: ".NET & Objektorientierte Softwareentwicklung",
    modules: [
      { code: "CSH-01", year: "1. Lehrjahr", title: "C#-Grundlagen", focus: "Variablen, Operatoren, Schleifen, Methoden und einfache Klassen." },
      { code: "CSH-02", year: "2. Lehrjahr", title: "OOP mit .NET", focus: "Vererbung, Interfaces, Eigenschaften, Exceptions und Delegates." },
      { code: "CSH-03", year: "2./3. Lehrjahr", title: "Datenzugriff & GUI", focus: "LINQ, Datenmodelle, WinForms und praxisnahe Interfaces." },
      { code: "CSH-04", year: "3. Lehrjahr", title: "Architektur & Qualität", focus: "SOLID, Tests, Projektstruktur und Abschlussprojekte." },
    ],
    learningPlan: [
      { phase: "Grundlagen", title: "Programmieren mit C#", detail: "Syntax, Klassen und erste kleine Projekte verstehen." },
      { phase: "Vertiefung", title: "OOP im .NET-Umfeld", detail: "Datenmodellierung, Wiederverwendung und sauberer Aufbau." },
      { phase: "Prüfung & Praxis", title: "Projekt- & Testszenarien", detail: "Modulvorbereitung, Qualitätskriterien und reale Aufgaben." },
    ],
  },
  {
    slug: "javascript-typescript",
    name: "JavaScript & TypeScript",
    category: "ict",
    short: "Die Sprache des Webs — vom DOM bis zu modernen Frameworks.",
    blurb:
      "JavaScript und TypeScript sind das Fundament der Webentwicklung. Wir begleiten von den Sprachgrundlagen über asynchrone Programmierung bis zu React, Node.js und Typsystemen.",
    keywords: ["javascript nachhilfe", "typescript lernen", "webentwicklung hilfe"],
    officialGroup: "Application Engineering",
    track: "Frontend & Web-Interfaces",
    modules: [
      { code: "JS-01", year: "1. Lehrjahr", title: "JavaScript Grundlagen", focus: "Variablen, Funktionen, DOM, Events und Bedingungen." },
      { code: "JS-02", year: "1./2. Lehrjahr", title: "Asynchronität & APIs", focus: "Promises, fetch, JSON und client-seitige Datenverarbeitung." },
      { code: "JS-03", year: "2. Lehrjahr", title: "TypeScript & Typisierung", focus: "Interfaces, Generics, Typsicherheit und robuste Frontend-Logik." },
      { code: "JS-04", year: "2./3. Lehrjahr", title: "Frameworks & Architektur", focus: "Components, State-Handling und moderne Web-Apps." },
    ],
    learningPlan: [
      { phase: "Grundlagen", title: "Web-Logik verstehen", detail: "JavaScript, DOM und einfache Interaktionen im Browser." },
      { phase: "Vertiefung", title: "Daten & Typen", detail: "Async/Await, APIs und saubere TypeScript-Strukturen." },
      { phase: "Prüfung & Praxis", title: "Frontend-Architektur", detail: "Komponenten, Zustände und praxisnahe Anwendungsvorbereitung." },
    ],
  },
  {
    slug: "web-entwicklung",
    name: "Web-Entwicklung",
    category: "ict",
    short: "HTML, CSS, Responsive Design und moderne Frontends.",
    blurb:
      "Von semantischem HTML über CSS-Layouts bis zu kompletten Web-Projekten für üK und IPA: Unsere Tutor:innen zeigen, wie professionelle Frontends entstehen.",
    keywords: ["webentwicklung nachhilfe", "html css lernen", "frontend hilfe"],
    officialGroup: "Application Engineering",
    track: "UX, Frontend & Web-Projekte",
    modules: [
      { code: "WEB-01", year: "1. Lehrjahr", title: "HTML & CSS", focus: "Semantik, Layout, Responsive Design und Formulare." },
      { code: "WEB-02", year: "1./2. Lehrjahr", title: "Interaktivität & JS", focus: "DOM-Events, Scripting, Animationen und kleine UI-Mechaniken." },
      { code: "WEB-03", year: "2./3. Lehrjahr", title: "Frontend-Architektur", focus: "Komponenten, State-Management und Struktur von Webprojekten." },
      { code: "WEB-04", year: "3. Lehrjahr", title: "Projekt & Qualitätsprüfung", focus: "UX, Performance, Accessibility und Abschlussprojekt." },
    ],
    learningPlan: [
      { phase: "Grundlagen", title: "Website aufbauen", detail: "HTML, CSS und erste responsive Layouts verstehen." },
      { phase: "Vertiefung", title: "Interaktivität & UX", detail: "Frontend-Logik, User Experience und saubere UI-Mechanik." },
      { phase: "Prüfung & Praxis", title: "Projekt & Qualitätsniveau", detail: "Abschlussprojekt, A11y, Performance und professionelle Umsetzung." },
    ],
  },
  {
    slug: "netzwerktechnik",
    name: "Netzwerktechnik",
    category: "ict",
    short: "OSI, Subnetting, Routing & Switching — prüfungssicher.",
    blurb:
      "Subnetting, VLANs, Routing-Protokolle und Firewalls: Netzwerktechnik ist Kernstoff der Systemtechnik EFZ und vieler Weiterbildungen. Wir üben an realen Szenarien bis zur Prüfungssicherheit.",
    keywords: ["netzwerktechnik nachhilfe", "subnetting lernen", "ccna vorbereitung"],
    officialGroup: "IT Infrastructure / Networking",
    track: "Netzwerkdesign & Betrieb",
    modules: [
      { code: "NET-01", year: "1. Lehrjahr", title: "Netzwerkgrundlagen", focus: "OSI, IP, MAC, Geräte und Topologien." },
      { code: "NET-02", year: "1./2. Lehrjahr", title: "Subnetting & Routing", focus: "VLSM, Routing, Switching und Fehlersuche." },
      { code: "NET-03", year: "2./3. Lehrjahr", title: "Sicherheit & Dienste", focus: "Firewall, VLAN, DHCP, DNS und Netzwerkdienste." },
      { code: "NET-04", year: "3. Lehrjahr", title: "Projekt & Prüfung", focus: "Netzwerk-Design, Troubleshooting und Modulvorbereitung." },
    ],
    learningPlan: [
      { phase: "Grundlagen", title: "Netzwerke verstehen", detail: "OSI, IP, MAC, Switches und erste Adresskonzepte." },
      { phase: "Vertiefung", title: "Kommunikation & Sicherheit", detail: "Routing, VLAN, DNS, Firewall und Fehlersuche." },
      { phase: "Prüfung & Praxis", title: "Netzwerk-Design", detail: "Anlagen planen, Probleme diagnostizieren und sicher bestehen." },
    ],
  },
  {
    slug: "datenbanken-sql",
    name: "Datenbanken & SQL",
    category: "ict",
    short: "Normalisierung, Joins, Transaktionen — von Grund auf verstanden.",
    blurb:
      "ER-Modelle, Normalformen, komplexe Joins und Performance: Datenbanken sind fester Bestandteil jeder Informatik-Ausbildung. Wir bringen SQL vom Auswendiglernen zum echten Verständnis.",
    keywords: ["sql nachhilfe", "datenbanken lernen", "er-modell hilfe"],
    officialGroup: "Security, Data & Cloud",
    track: "Datenmodellierung & Abfragen",
    modules: [
      { code: "DB-01", year: "1. Lehrjahr", title: "Datenmodellierung", focus: "Entitäten, Beziehungen, ER-Modell und Normalformen." },
      { code: "DB-02", year: "1./2. Lehrjahr", title: "SQL-Grundlagen", focus: "SELECT, WHERE, JOIN, GROUP BY und Aggregationen." },
      { code: "DB-03", year: "2./3. Lehrjahr", title: "Transaktionen & Performance", focus: "ACID, Indexes, Optimierung und Sicherheitsaspekte." },
      { code: "DB-04", year: "3. Lehrjahr", title: "Projekt & Prüfungslogik", focus: "Praxisfälle, Datenbankdesign und Klausurvorbereitung." },
    ],
    learningPlan: [
      { phase: "Grundlagen", title: "Daten verstehen", detail: "Entitäten, Beziehungen und das erste Datenmodell." },
      { phase: "Vertiefung", title: "Abfragen & Integrität", detail: "SQL, Joins, Transaktionen und Normalisierung." },
      { phase: "Prüfung & Praxis", title: "Datenbank-Entscheidungen", detail: "Ergebnisse bewerten, Performance optimieren und Aufgaben sicher lösen." },
    ],
  },
  {
    slug: "linux-systemadministration",
    name: "Linux & Systemadministration",
    category: "ict",
    short: "Shell, Services, Server-Setups — hands-on erklärt.",
    blurb:
      "Bash, systemd, Rechteverwaltung und Server-Dienste: Wir machen fit für Betrieb und üK — vom ersten Terminal-Befehl bis zum sauber aufgesetzten Server.",
    keywords: ["linux nachhilfe", "linux lernen", "systemadministration hilfe"],
    officialGroup: "IT Infrastructure / Operations",
    track: "Serverbetrieb & Systemservices",
    modules: [
      { code: "LINUX-01", year: "1. Lehrjahr", title: "Linux-Grundlagen", focus: "Shell, Pfade, Rechte, Prozesse und Paketverwaltung." },
      { code: "LINUX-02", year: "1./2. Lehrjahr", title: "Systemdienste", focus: "systemd, Cron, Logs und Server-Management." },
      { code: "LINUX-03", year: "2./3. Lehrjahr", title: "Sicherheit & Netzdienste", focus: "SSH, Firewall, DNS, Webserver und Benutzerverwaltung." },
      { code: "LINUX-04", year: "3. Lehrjahr", title: "Projekt & Diagnose", focus: "Troubleshooting, Betrieb, Automatisierung und Abschlussprojekt." },
    ],
    learningPlan: [
      { phase: "Grundlagen", title: "Befehle sicher nutzen", detail: "Shell, Rechte, Verzeichnisse und erste administrative Aufgaben." },
      { phase: "Vertiefung", title: "Dienste & Sicherheit", detail: "Serverdienste, Logs, Automatisierung und Laufzeitverwaltung." },
      { phase: "Prüfung & Praxis", title: "Betrieb im Alltag", detail: "Fehlersuche, Server-Diagnostik und reale Betriebsaufgaben." },
    ],
  },
  {
    slug: "cloud-devops",
    name: "Cloud & DevOps",
    category: "ict",
    short: "Docker, CI/CD, Azure & AWS praxisnah.",
    blurb:
      "Container, Pipelines und Cloud-Architekturen gehören heute in jede ICT-Ausbildung. Unsere Tutor:innen erklären Docker, CI/CD und Cloud-Services an konkreten Projekten.",
    keywords: ["devops lernen", "docker nachhilfe", "cloud kurs"],
    officialGroup: "Security, Data & Cloud",
    track: "Automation & Plattformbetrieb",
    modules: [
      { code: "DEVOPS-01", year: "1./2. Lehrjahr", title: "Container & Virtualisierung", focus: "Docker, Images, Volumes und Container-Lebenszyklus." },
      { code: "DEVOPS-02", year: "2. Lehrjahr", title: "CI/CD & Automatisierung", focus: "Pipelines, Tests, Build-Prozesse und Deployment-Workflows." },
      { code: "DEVOPS-03", year: "2./3. Lehrjahr", title: "Cloud-Grundlagen", focus: "Compute, Storage, IAM, Skalierung und Sicherheitsmodelle." },
      { code: "DEVOPS-04", year: "3. Lehrjahr", title: "Projekt & Betrieb", focus: "Monitoring, Deployment-Strategien und produktiver Stack." },
    ],
    learningPlan: [
      { phase: "Grundlagen", title: "Umgebungen verstehen", detail: "Container, Virtualisierung und die Grundidee von Cloud-Infrastruktur." },
      { phase: "Vertiefung", title: "Automatisierung & Delivery", detail: "Pipelines, Deployment und sichere Workflows im Team." },
      { phase: "Prüfung & Praxis", title: "Operations & Stabilität", detail: "Cloud-Services, Monitoring und produktionsreife Abläufe." },
    ],
  },
  {
    slug: "cybersecurity",
    name: "Cyber Security",
    category: "ict",
    short: "Grundlagen, Härtung, Security-Module der ICT-Berufe.",
    blurb:
      "Von CIA-Triade über Verschlüsselung bis zu praktischer System-Härtung: Wir begleiten durch Security-Module der ICT-Lehren und Studiengänge — verständlich und aktuell.",
    keywords: ["cybersecurity nachhilfe", "it-sicherheit lernen"],
    officialGroup: "Security, Data & Cloud",
    track: "Sicherheitsarchitektur & Risiko",
    modules: [
      { code: "SEC-01", year: "1./2. Lehrjahr", title: "Security-Grundlagen", focus: "CIA, Angriffsarten, Risiken und Sicherheitsziele." },
      { code: "SEC-02", year: "2. Lehrjahr", title: "Netzwerk- & Systemhärtung", focus: "Firewall, Zugriffsrechte, Patchmanagement und Konfiguration." },
      { code: "SEC-03", year: "2./3. Lehrjahr", title: "Verschlüsselung & Authentisierung", focus: "SSL/TLS, Hashing, MFA und Identitätsmanagement." },
      { code: "SEC-04", year: "3. Lehrjahr", title: "Sicherheitsanalyse", focus: "Risikoanalyse, Audits und Incident-Handling." },
    ],
    learningPlan: [
      { phase: "Grundlagen", title: "Sicherheit denken", detail: "Risiken, Angriffsmodelle und die wichtigsten Security-Grundlagen." },
      { phase: "Vertiefung", title: "Härtung & Absicherung", detail: "Rechte, Firewall, Authentisierung und Netzwerksicherheit." },
      { phase: "Prüfung & Praxis", title: "Analyse & Reaktion", detail: "Risikobewertung, Incident-Handling und Sicherheit in Projekten." },
    ],
  },
  {
    slug: "applikationsentwicklung-efz",
    name: "Applikationsentwicklung EFZ",
    category: "ict",
    short: "Offizielle EFZ-Module der Fachrichtung Applikationsentwicklung mit praxisnaher Begleitung.",
    blurb:
      "Für Lernende in der Informatik-Ausbildung EFZ ist die Fachrichtung Applikationsentwicklung ein klar strukturierter Lernpfad: von der ersten kleinen Anwendung über OOP, Web- und Backend-Module bis hin zu Cloud, Container, Testing und IPA. Wir begleiten modulgenau entlang dieses offiziellen Kompetenzpfads.",
    keywords: ["applikationsentwicklung nachhilfe", "informatik efz hilfe", "ipa vorbereitung", "applikationsentwicklung efz"],
    officialGroup: "Informatiker/in EFZ – Fachrichtung Applikationsentwicklung",
    track: "Applikationsentwicklung EFZ",
    officialCatalog:
      "Offizieller Modulbaukasten: Informatiker/in EFZ (BiVo 2021), Fachrichtung Applikationsentwicklung (APL). Die Lernreise verläuft vom ersten Programmierverständnis über OOP, Frontend, Backend, Cloud und Container bis zur IPA und Abschlussarbeit.",
    modules: [
      {
        code: "319",
        year: "1. Lehrjahr",
        title: "Applikationen entwerfen und implementieren",
        focus: "Konzeption, Aufbau und Umsetzung kleinerer Applikationen mit sauberem Prozess.",
        summary:
          "Dieses Modul bildet die Grundlage der Applikationsentwicklung: Lernende verstehen, wie eine kleine Anwendung von der Idee über die Struktur bis zur Umsetzung entsteht. Dabei stehen sauberer Ablauf, logisches Denken und verständliche Programmierung im Zentrum.",
        learningGoals: [
          "Kleine Anwendungen mit klarer Struktur und sinnvoller Logik planen und umsetzen.",
          "Probleme in einzelne Arbeitsschritte zerlegen und mit nachvollziehbarer Programmlogik lösen.",
          "Die Umsetzung sauber dokumentieren, testen und auf Verständlichkeit prüfen.",
        ],
        practicalExamples: [
          "Ein kleines Formular mit Validierung und Ausgabe über eine einfache Benutzeroberfläche bauen.",
          "Codieraufgaben mit if/else-, Schleifen- und Funktionenlogik lösen und erklären.",
          "Fehler im Ablauf gezielt erkennen und mit sauberem Debugging korrigieren.",
        ],
      },
      {
        code: "320",
        year: "2. Lehrjahr",
        title: "Objektorientiert Programmieren",
        focus: "Klassen, Objekte, Vererbung, Wiederverwendung und strukturierte Softwareentwicklung.",
        summary:
          "Im zweiten Lehrjahr wird das Programmieren systematischer. Lernende entwickeln ein Gefühl für Objekte, Klassen und Wiederverwendung. Das Modul ist zentral für saubere Architektur, Lesbarkeit und langlebige Softwareentwicklung.",
        learningGoals: [
          "Klassen, Objekte und Beziehungen zwischen Entitäten sauber modellieren.",
          "Vererbung, Kapselung und Wiederverwendung gezielt einsetzen.",
          "Code nach Prinzipien wie Übersichtlichkeit, Struktur und Wartbarkeit entwickeln.",
        ],
        practicalExamples: [
          "Ein kleines Objektmodell für Kunden, Produkte oder Bestellungen aufbauen.",
          "Vererbung und Klassenstrukturen in kleinen Programmen vergleichen und beurteilen.",
          "Code mit besseren Namen, klaren Methoden und kleinerer Verantwortung strukturieren.",
        ],
      },
      {
        code: "294",
        year: "2. Lehrjahr",
        title: "Frontend einer interaktiven Webapplikation realisieren",
        focus: "UI-Design, Interaktion, Frontend-Logik und Nutzerführung.",
        summary:
          "Das Frontend-Modul verbindet Technik mit Benutzererlebnis. Lernende verstehen, wie eine Weboberfläche aufgebaut wird, wie Interaktionen funktionieren und welche Rolle Design, Logik und Nutzerführung spielen.",
        learningGoals: [
          "Frontends mit verständlicher Struktur und sauberem Aufbau realisieren.",
          "Interaktionen, Zustände und Benutzerführung gezielt planen und umsetzen.",
          "Die Oberfläche auf Benutzerbedürfnisse, Klarheit und Zugänglichkeit ausrichten.",
        ],
        practicalExamples: [
          "Eine Produktliste mit Filter, Auswahl und Detailansicht umsetzen.",
          "Formulare mit Validierung und klaren Feedbacks entwickeln.",
          "Aufgaben mit Responsive Design, Anwenderfluss und UI-Logik lösen.",
        ],
      },
      {
        code: "295",
        year: "2. Lehrjahr",
        title: "Backend für Applikationen realisieren",
        focus: "Logik, APIs, Datenfluss und serverseitige Verarbeitung.",
        summary:
          "Backend ist die Grundlage für funktionierende Anwendungen. Lernende verstehen, wie Daten zwischen Client und Server laufen, wie Logik verarbeitet wird und welche Rolle APIs im Gesamtprozess spielen.",
        learningGoals: [
          "Serverseitige Logik sauber strukturieren und nachvollziehbar implementieren.",
          "Datenflüsse zwischen Frontend, Server und Datenhaltung verstehen.",
          "APIs und Verarbeitungsschritte so aufbauen, dass sie stabil und wartbar bleiben.",
        ],
        practicalExamples: [
          "Ein simples API-Endpunkt für Login, Abfrage oder Speicherung entwickeln.",
          "Request- und Response-Logik mit Datenvalidierung und Fehlerbehandlung umsetzen.",
          "Datenstrukturen für reale Aufgaben wie Bestellungen, Benutzer oder Inhalte modellieren.",
        ],
      },
      {
        code: "346",
        year: "2. Lehrjahr",
        title: "Cloud Lösungen konzipieren und realisieren",
        focus: "Cloud-Architektur, Services und praxisnahe Lösungskonzepte.",
        summary:
          "Cloud-Lernen ist heute Teil jeder modernen IT-Ausbildung. Dieses Modul zeigt, wie sich Services für reale Anwendungsfälle sinnvoll einordnen und wie Lösungen mit Cloud-Komponenten geplant, dokumentiert und umgesetzt werden.",
        learningGoals: [
          "Cloud-Modelle und Services anhand konkreter Use Cases einordnen und vergleichen.",
          "Architekturentscheidungen nachvollziehbar begründen und dokumentieren.",
          "Lösungsansätze für Hosting, Skalierung und Zugriffe auf fachlicher Ebene verstehen.",
        ],
        practicalExamples: [
          "Eine kleine Lösung mit Web-Frontend, Backend und Cloud-Service skizzieren.",
          "Begriffe wie Skalierung, Sicherheit, Verfügbarkeit und Services im Betrieb einordnen.",
          "Lösungsarchitekturen dokumentieren und mit Abhängigkeiten erklären.",
        ],
      },
      {
        code: "347",
        year: "2. Lehrjahr",
        title: "Dienst mit Container anwenden",
        focus: "Containerisierung, Deployment und Betrieb von Services.",
        summary:
          "Container sind ein zentrales Werkzeug moderner Softwareentwicklung. Dieses Modul erklärt den Aufbau, die Nutzung und den Betrieb von Containern und zeigt, wie moderne Dienste zuverlässig bereitgestellt werden.",
        learningGoals: [
          "Containerisierung als Lösung für Laufzeit, Portabilität und Betrieb verstehen.",
          "Einfachen Service-Deploymentprozess mit Wiederholbarkeit und Struktur umsetzen.",
          "Betrieb, Konfiguration und gemeinsame Nutzung von Services fachlich begründen.",
        ],
        practicalExamples: [
          "Eine einfache Anwendung in einem Container laufen lassen und testen.",
          "Konfigurations- und Laufzeitunterschiede zwischen lokalen und produktiven Umgebungen verstehen.",
          "Containeransätze mit praktischen Beispielen vergleichen und bewerten.",
        ],
      },
      {
        code: "426",
        year: "2. Lehrjahr",
        title: "Software mit agilen Methoden entwickeln",
        focus: "Agile Zusammenarbeit, Backlog, Iteration und Team-Prozesse.",
        summary:
          "Digitale Produkte entstehen heute im Team. Dieses Modul zeigt, wie agile Zusammenarbeit, Priorisierung, Iterationen und gemeinsame Planung zu stabilen Ergebnissen führen.",
        learningGoals: [
          "Agile Prozesse und Teamarbeit in nachhaltige Projektabläufe übersetzen.",
          "Backlog, Priorisierung und Iteration in der Praxis sinnvoll einsetzen.",
          "Verantwortung, Kommunikation und Qualitätskontrolle im Team verständlich machen.",
        ],
        practicalExamples: [
          "Ein kleines Projekt in Aufgaben und Einzelziele aufteilen.",
          "Feedback-Runden, Priorisierung und Anpassung im Verlauf eines Projekts nachvollziehen.",
          "Teamprozesse mit Ziel, Zeitfenster und Verantwortung planen und reflektieren.",
        ],
      },
      {
        code: "450",
        year: "3. Lehrjahr",
        title: "Applikationen testen",
        focus: "Test-Strategien, Qualitätssicherung und sichere Abläufe.",
        summary:
          "Qualitätsmanagement ist kein Zusatz, sondern Teil professioneller Softwareentwicklung. Dieses Modul zeigt, wie Tests, Fehleranalyse und sichere Abläufe helfen, robuste Anwendungen zu entwickeln.",
        learningGoals: [
          "Teststrategien auf reale Aufgaben und Varianten anwenden.",
          "Fehlerquellen erkennen und systematisch analysieren.",
          "Qualität und Sicherheit als Teil des Entwicklungsprozesses verstehen.",
        ],
        practicalExamples: [
          "Einfachen Code mit Tests absichern und das Verhalten nachvollziehbar prüfen.",
          "Eingaben, Grenzfälle und Fehlerpfade bewusst testen.",
          "Mängel dokumentieren und gezielt beheben, damit sie nicht wieder auftauchen.",
        ],
      },
      {
        code: "306",
        year: "3. Lehrjahr",
        title: "Kleinprojekte im eigenen Berufsumfeld abwickeln",
        focus: "Projektarbeit, Umsetzung, Dokumentation und Abschlussprüfung.",
        summary:
          "Im letzten Abschnitt wird das bisher Gelernte zu einem echten beruflichen Vorgehen zusammengeführt. Lernende lösen ein kleineres Projekt vollständig von der Anforderung bis zur Dokumentation und Reflexion.",
        learningGoals: [
          "Ein kleines Projekt strukturiert planen, umsetzen und reflektieren.",
          "Ergebnisse fachlich sauber dokumentieren und präsentieren.",
          "Die Entwicklung mit Qualitätskriterien, Zeitplanung und Abschlussprüfung verknüpfen.",
        ],
        practicalExamples: [
          "Ein eigenes Projekt mit Anforderung, Planung, Umsetzung und Abschlussdokumentation durchlaufen.",
          "Ergebnisse mit Dokumentation, Verifikation und kurzen Retrospektiven erklären.",
          "Aus einem praktischen Problem eine Lösung mit klarer Struktur und Zielerreichung entwickeln.",
        ],
      },
    ],
    learningPlan: [
      { phase: "1. Lehrjahr", title: "Grundlagen & erste Anwendungen", detail: "Programmieren, Logik, Abläufe und erste reale Umsetzung mit klarer Struktur." },
      { phase: "2. Lehrjahr", title: "Module & Architektur", detail: "Objektorientierung, Datenbanken, APIs, Frontend, Backend, Cloud und Container sind die Kernmodule dieses Abschnitts." },
      { phase: "3. Lehrjahr", title: "IPA & Abschluss", detail: "Großes Projekt, fachliche Qualität, Prüfungsstrategie, Dokumentation und letzte Reife für die Abschlussphase." },
    ],
  },
  {
    slug: "systemtechnik-efz",
    name: "Systemtechnik EFZ",
    category: "ict",
    short: "Offizielle PLE-Module für Infrastruktur, Betrieb, Sicherheit und Services.",
    blurb:
      "Die Fachrichtung Plattformentwicklung/Systemtechnik fokussiert sich auf den stabilen Betrieb von Systemen, Netzwerkkomponenten, Serverdiensten und sicheren Betriebsabläufen. Die Ausbildung verläuft logisch von Grundwissen bis zur verantwortungsvollen Umsetzung in echten IT-Umgebungen.",
    keywords: ["systemtechnik nachhilfe", "plattformentwicklung efz", "informatik lehre hilfe", "systemtechnik efz"],
    officialGroup: "Informatiker/in EFZ – Fachrichtung Plattformentwicklung",
    track: "Server, Virtualisierung & Betrieb",
    officialCatalog:
      "Offizieller Modulbaukasten: Informatiker/in EFZ (BiVo 2021), Fachrichtung Plattformentwicklung (PLE). Schwerpunkte: Infrastruktur, Betriebsumgebungen, Servicebereitstellung, Sicherheit und Projektumsetzung.",
    modules: [
      {
        code: "123",
        year: "1. Lehrjahr",
        title: "Serverdienste in Betrieb nehmen",
        focus: "Systemdienste, Betrieb, Rechte und erste reale Serverumgebungen.",
        summary:
          "Dieses Modul legt die Grundlage für das Verständnis von Serverumgebungen. Lernende erkennen, wie Dienste installiert, konfiguriert und sicher im Betrieb gehalten werden und wie Rechte, Zuständigkeiten und grundlegende Serverfunktionen zusammenwirken.",
        learningGoals: [
          "Serverdienste in einer realen Umgebung verstehen und betreiben.",
          "Zugriffsrechte, Dienste und Benutzerverwaltung nachvollziehbar einordnen.",
          "Grundlagen für stabilen Betrieb und Fehlerdiagnostik aufbauen.",
        ],
        practicalExamples: [
          "Einfachen Dienst wie Webserver oder Datenbankservice in einer Testumgebung einrichten.",
          "Rechte und Zugriffe kontrolliert prüfen und dokumentieren.",
          "Betriebsfehler mit Logs und Konfigurationen analysieren.",
        ],
      },
      {
        code: "129",
        year: "2. Lehrjahr",
        title: "LAN-Komponenten in Betrieb nehmen",
        focus: "Netzwerkgeräte, Topologien und lokale Infrastruktur.",
        summary:
          "Netzwerke werden in der Praxis als verbindendes Element zwischen Geräten und Diensten sichtbar. Dieses Modul erklärt klassische Netzwerktopologien, Geräte und typische Betriebsprozesse im lokalen Umfeld.",
        learningGoals: [
          "Netzwerkkomponenten und ihre Aufgaben im Betrieb einordnen.",
          "Topologien, Adressierung und lokale Infrastruktur verständlich erklären.",
          "Fehler im Netzwerk gezielt erkennen und mit systematischem Vorgehen lösen.",
        ],
        practicalExamples: [
          "Ein kleines Netzwerk mit Switches, Router und Geräten aufbauen und analysieren.",
          "Adressbereiche und Verbindungen in einem LAN nachvollziehen.",
          "Fehlersituationen in der Netzwerkfunktion systematisch diagnosen.",
        ],
      },
      {
        code: "145",
        year: "3. Lehrjahr",
        title: "Netzwerk betreiben und erweitern",
        focus: "Netzwerkbetrieb, Erweiterung, Fehlersuche und Skalierung.",
        summary:
          "Dieses Modul ist der Übergang vom reinen Verständnis zur verantwortungsvollen Betriebsführung. Lernende erkennen, wie ein bestehendes Netzwerk erweitert, stabilisiert und bei Störungen gezielt wiederhergestellt wird.",
        learningGoals: [
          "Netzwerke im Betrieb sicher und effizient erweitern.",
          "Fehlerursachen systematisch analysieren und korrigieren.",
          "Skalierung, Struktur und Stabilität in einem realen System betrachten.",
        ],
        practicalExamples: [
          "Ein Netzwerk mit einer zusätzlichen Umgebung oder einem Subnetz erweitern.",
          "Fehler in der Verteiler- oder Routing-Logik nachvollziehen und beheben.",
          "Betriebsdokumentation und Fehleranalyse in einem realistischen Szenario anwenden.",
        ],
      },
      {
        code: "169",
        year: "2. Lehrjahr",
        title: "Services mit Containern bereitstellen",
        focus: "Container-Deployment, Betrieb und Service-Integration.",
        summary:
          "Container sind ein Standard für moderne Servicebereitstellung. Lernende verstehen, wie Anwendungen in isolierten Umgebungen laufen, wie sie bereitgestellt und in einen Betrieb integriert werden.",
        learningGoals: [
          "Container als Lösung für Dienste und Anwendungen verstehen.",
          "Deployments mit klaren Aufträgen, Abhängigkeiten und Laufzeit konzipieren.",
          "Service-Integration in ein bestehendes System sauber planen.",
        ],
        practicalExamples: [
          "Eine einfache Anwendung in einem Container bereitstellen und prüfen.",
          "Dienste mit Abhängigkeiten und Port-Konfigurationen korrekt aufsetzen.",
          "Container als Teil einer größeren Infrastruktur einordnen und erklären.",
        ],
      },
      {
        code: "182",
        year: "4. Lehrjahr",
        title: "Systemsicherheit implementieren",
        focus: "Hardening, Sicherheitsmaßnahmen und sichere Infrastruktur.",
        summary:
          "Sichere IT-Systeme sind kein Nebenprodukt, sondern Teil des Betriebs. Dieses Modul zeigt Lernenden, wie Zugriffe, Dienste und Konfigurationen so gestaltet werden, dass Risiken kontrolliert und reduzierte werden.",
        learningGoals: [
          "Sicherheitsmaßnahmen gezielt auf Server- und Netzwerkumgebungen anwenden.",
          "Hardening-Maßnahmen mit Betriebsanforderungen abgleichen.",
          "Sichere Infrastruktur als Teil des Gesamtsystems verstehen.",
        ],
        practicalExamples: [
          "Zugriffsrechte und Passwort-/Service-Policies analysieren und verbessern.",
          "Kritische Dienste mit Sicherheitsmaßnahmen absichern.",
          "Risiko und Betrieb in einem realen Szenario gegeneinander abwägen.",
        ],
      },
    ],
    learningPlan: [
      { phase: "1. Lehrjahr", title: "Grundlagen der Infrastruktur", detail: "Serverdienste, Rechte und Betrieb verstehen." },
      { phase: "2. Lehrjahr", title: "Netzwerk & Services", detail: "LAN, Container und Servicebereitstellung in realen Systemen.", },
      { phase: "3. Lehrjahr", title: "Betrieb & Sicherheit", detail: "Erweiterung, Stabilität, Monitoring und sichere Betriebsführung." },
    ],
  },
  {
    slug: "mediamatik",
    name: "Mediamatik",
    category: "ict",
    short: "Offizielle Mediamatik-Module für Gestaltung, Web, Content und digitale Produktion.",
    blurb:
      "Mediamatiker:innen verbinden Gestaltung, Technik, Kommunikation und digitale Produktion. Die Ausbildung richtet sich auf kreative Lösungen, verständliche Webauftritte und die professionelle Umsetzung digitaler Inhalte im beruflichen Kontext.",
    keywords: ["mediamatik nachhilfe", "mediamatiker efz hilfe", "mediamatik efz"],
    officialGroup: "Mediamatiker/in EFZ",
    track: "Design, Content & digitale Produktion",
    officialCatalog:
      "Offizieller Modulbaukasten: Mediamatiker/in EFZ (BiVo 2019). Schwerpunkt: Gestaltung, Medienproduktion, Web, Marketing, Content-Management und digitale Kommunikation.",
    modules: [
      {
        code: "101",
        year: "1. Lehrjahr",
        title: "Webauftritt erstellen und veröffentlichen",
        focus: "Website-Aufbau, Veröffentlichung und digitale Präsentation.",
        summary:
          "Das erste Berührungspunkt mit digitalen Medien ist oft ein einfacher Webauftritt. Lernende verstehen, wie Inhalte, Gestaltung und technische Umsetzung zusammenlaufen, damit ein professioneller digitaler Auftritt entsteht.",
        learningGoals: [
          "Eine einfache, saubere Website planen und erstellen.",
          "Inhalte, Struktur und Design zielgerichtet auf die Zielgruppe abstimmen.",
          "Webauftritte technisch und visuell verständlich veröffentlichen.",
        ],
        practicalExamples: [
          "Eine kleine Unternehmensseite mit Inhalt, Layout und Webauftritt aufbauen.",
          "Struktur, Inhalt und grafische Gestaltung bewusst aufeinander abstimmen.",
          "Ein digitales Produkt mit klarer Zielsetzung und sinnvoller Darstellung veröffentlichen.",
        ],
      },
      {
        code: "287",
        year: "1. Lehrjahr",
        title: "Websites mit CSS gestalten",
        focus: "Styling, Layout, Farbe und Typografie im Web.",
        summary:
          "Das Gestalten einer Website beginnt mit Layout, Typografie und visueller Sprache. Lernende verstehen, wie Farbe, Struktur und Stilentscheidungen die Lesbarkeit und Wirkung einer Benutzeroberfläche beeinflussen.",
        learningGoals: [
          "CSS-Layouts sinnvoll gestalten und visuelle Hierarchien erkennen.",
          "Farb-, Typografie- und Spacing-Entscheidungen fachlich begründen.",
          "Websites sauber strukturieren und die Benutzerführung verbessern.",
        ],
        practicalExamples: [
          "Eine Landingpage mit klarer visuellem Aufbau erstellen.",
          "Farbschema, Abstände und Typografie bewusst für Lesbarkeit einsetzen.",
          "Responsive Layouts auf unterschiedliche Bildschirmgrößen prüfen.",
        ],
      },
      {
        code: "288",
        year: "2. Lehrjahr",
        title: "Programmiertechniken im Webfrontend einsetzen",
        focus: "Interaktivität, Client-Logik und Webtechnik.",
        summary:
          "Interaktive Elemente machen Webauftritte zu echten Nutzererlebnissen. Dieses Modul zeigt, wie JavaScript und Webtechniken verwendet werden, damit Inhalte auf Nutzeraktionen reagieren und logisch funktionieren.",
        learningGoals: [
          "Interaktive Elemente auf der Client-Seite sauber umsetzen.",
          "Benutzeraktionen, Zustände und Logik nachvollziehbar verknüpfen.",
          "Frontend-Funktionalität mit klaren, nachvollziehbaren Strukturen bauen.",
        ],
        practicalExamples: [
          "Ein Formular mit Interaktion und Feedbacks bauen.",
          "Menüs, Tabs oder Filter mit verständlicher Logik umsetzen.",
          "State- und Event-Mechaniken in realen Webaufgaben nachvollziehen.",
        ],
      },
      {
        code: "289",
        year: "2. Lehrjahr",
        title: "CMS einsetzen und bewirtschaften",
        focus: "Content-Management, Nutzung und Pflege digitaler Inhalte.",
        summary:
          "Ein professioneller Webauftritt lebt von guter Pflege und verständlicher Inhalte. Dieses Modul zeigt, wie Content verwaltet, strukturiert und mit einem CMS gezielt gepflegt wird.",
        learningGoals: [
          "Content-Strukturen im CMS sinnvoll organisieren.",
          "Inhalte zielgruppengerecht veröffentlichen und pflegen.",
          "Medien- und Webinhalte mit klaren Abläufen betreiben.",
        ],
        practicalExamples: [
          "Seiten, Blöcke und Inhalte in einem CMS strukturieren.",
          "Texte, Bilder und Seiten auf eine klare Strategie ausrichten.",
          "Eine kleine Produkt- oder Projektseite professionell pflegen.",
        ],
      },
      {
        code: "291",
        year: "3. Lehrjahr",
        title: "Oberflächen (UIs) mit Webtechnologien entwickeln",
        focus: "Weboberflächen, Interaktionen und Anwenderzentrierung.",
        summary:
          "Die Gestaltung von Oberflächen ist ein wichtiges Bindeglied zwischen Design und Technik. Lernende verstehen, wie eine Benutzeroberfläche nicht nur schön, sondern auch verständlich, effizient und nutzerfreundlich gestaltet wird.",
        learningGoals: [
          "UI-Komponenten sauber planen, entwickeln und testbar machen.",
          "Usability und Benutzerführung als zentrale Qualitätskriterien begreifen.",
          "Oberflächen mit gezielter Interaktion und klarer Information strukturieren.",
        ],
        practicalExamples: [
          "Eine digitale Oberfläche mit klarer Navigationsstruktur planen.",
          "Interaktionspunkte wie Buttons, Formulare und Inhalte an Nutzerbedürfnisse anpassen.",
          "UI-Elemente mit Fokus auf Klarheit und Konsistenz zusammenführen.",
        ],
      },
    ],
    learningPlan: [
      { phase: "1. Lehrjahr", title: "Design & Grundlagen", detail: "Gestaltung, Webauftritt und erste digitale Inhalte professionell planen und umsetzen." },
      { phase: "2. Lehrjahr", title: "Web & Content", detail: "CSS, Interaktion, CMS und digitale Produktion werden systematisch erweitert." },
      { phase: "3. Lehrjahr", title: "Projekt & Präsentation", detail: "UI- und Medienprojekte mit klarer Umsetzung, Dokumentation und Präsentation." },
    ],
  },
  {
    slug: "ict-modulpruefungen",
    name: "ICT-Modulprüfungen",
    category: "ict",
    short: "Gezielte Vorbereitung auf einzelne ICT-Module (üK & BFS).",
    blurb:
      "Ein bestimmtes Modul steht an — 117, 231, 293, 320? Wir matchen mit Tutor:innen, die genau dieses Modul kennen, und bereiten gezielt auf den Kompetenznachweis vor.",
    keywords: ["ict module nachhilfe", "modulprüfung vorbereitung", "ük hilfe"],
    officialGroup: "Digital Media & Business",
    track: "Modulprüfung & Prüfungsstrategie",
    modules: [
      { code: "MOD-01", year: "1.-3. Lehrjahr", title: "Modulanalyse", focus: "Ziel, Prüfungsform, Themencluster und typische Stolpersteine." },
      { code: "MOD-02", year: "1.-3. Lehrjahr", title: "Lernstrategie", focus: "Gezielte Wiederholung und praxisnahe Übung." },
      { code: "MOD-03", year: "1.-3. Lehrjahr", title: "Praktische Übung", focus: "Projektaufgaben, Musterlösungen und Wissensabfrage." },
      { code: "MOD-04", year: "1.-3. Lehrjahr", title: "Prüfungsvorbereitung", focus: "Zeitmanagement, Abschlussfragen und sichere Prüfungsstrategie." },
    ],
    learningPlan: [
      { phase: "Analyse", title: "Prüfungsprofil verstehen", detail: "Module, Anforderungen, Aufgabenformate und Erwartungshorizonte." },
      { phase: "Training", title: "Gezieltes Üben", detail: "Konzentration auf Stoffgebiete, Aufgabenformats und Fehlerquellen." },
      { phase: "Prüfung", title: "Sicherheit & Tempo", detail: "Zeitmanagement, Kontrolle, Fehleranalyse und letzte Sicherheit." },
    ],
  },
  {
    slug: "informatik-grundlagen",
    name: "Informatik-Grundlagen",
    category: "ict",
    short: "Von Binärzahlen bis Algorithmen — solides Fundament.",
    blurb:
      "Zahlensysteme, Logik, Algorithmen und Datenstrukturen: das Fundament jeder Informatik-Ausbildung. Ideal für Gymnasium, BMS und Studienbeginn.",
    keywords: ["informatik nachhilfe", "algorithmen lernen", "informatik gymnasium"],
    officialGroup: "Softwareentwicklung & App-Engineering",
    track: "Logik, Algorithmen & systematisches Denken",
    modules: [
      { code: "INF-01", year: "Sek I / Gymnasium", title: "Grundlagen der Informatik", focus: "Zahlensysteme, Logik, Boolesche Algebra und Problemlösung." },
      { code: "INF-02", year: "Sek II / BMS", title: "Algorithmen & Datenstrukturen", focus: "Schleifen, Rekursion, Listen, Stack und Queue." },
      { code: "INF-03", year: "Studium / Oberstufe", title: "Abstraktion & Modellierung", focus: "Komplexität, Datenmodelle und systematisches Denken." },
      { code: "INF-04", year: "Studium / Fachrichtung", title: "Vertiefung & Projekt", focus: "Implementierung, Evaluation, Dokumentation und Präsentation." },
    ],
    learningPlan: [
      { phase: "Grundlagen", title: "Denken wie ein Informatiker", detail: "Logik, Mengen, Zustände und systematische Problemlösung." },
      { phase: "Vertiefung", title: "Strukturen & Algorithmen", detail: "Listen, Rekursion, Effizienz und saubere Modellierung." },
      { phase: "Prüfung & Praxis", title: "Modellierung & Beweisen", detail: "Lösungen sauber erklären, bewerten und anwenden." },
    ],
  },
  {
    slug: "mathematik",
    name: "Mathematik",
    category: "school",
    short: "Von Algebra bis Analysis — für jede Stufe.",
    blurb:
      "Mathematik ist das häufigste Nachhilfefach der Schweiz. Ob Sek, Gymi, BMS oder Studium: Unsere Tutor:innen holen jede:n dort ab, wo es hakt — und bauen echtes Verständnis auf.",
    keywords: ["mathematik nachhilfe", "mathe hilfe", "algebra lernen", "analysis nachhilfe"],
  },
  {
    slug: "physik",
    name: "Physik",
    category: "school",
    short: "Mechanik, Elektrik, Thermodynamik — anschaulich erklärt.",
    blurb:
      "Physik wird greifbar, wenn jemand die richtigen Bilder liefert. Wir begleiten durch Gymnasium, BMS und Grundlagenvorlesungen — von Kinematik bis Elektrotechnik.",
    keywords: ["physik nachhilfe", "physik lernen"],
  },
  {
    slug: "chemie",
    name: "Chemie",
    category: "school",
    short: "Stöchiometrie, Bindungen, organische Chemie.",
    blurb:
      "Vom Periodensystem bis zur organischen Chemie: Unsere Tutor:innen bringen Struktur in den Stoff — für Sek, Gymnasium und naturwissenschaftliche Ausbildungen.",
    keywords: ["chemie nachhilfe", "chemie lernen"],
  },
  {
    slug: "deutsch",
    name: "Deutsch",
    category: "school",
    short: "Grammatik, Aufsätze, Textanalyse und DaZ.",
    blurb:
      "Sichere Sprache öffnet Türen — in der Schule, der Lehre und im Beruf. Wir unterstützen bei Grammatik, Aufsätzen, Textanalysen und Deutsch als Zweitsprache.",
    keywords: ["deutsch nachhilfe", "aufsatz hilfe", "daz unterricht"],
  },
  {
    slug: "franzoesisch",
    name: "Französisch",
    category: "school",
    short: "Vom Vocabulaire bis zur DELF-Vorbereitung.",
    blurb:
      "Französisch bleibt Pflicht — und Chance. Unsere Tutor:innen üben Grammatik, Konversation und Prüfungsformate (inkl. DELF) mit System und Geduld.",
    keywords: ["französisch nachhilfe", "franz hilfe", "delf vorbereitung"],
  },
  {
    slug: "englisch",
    name: "Englisch",
    category: "school",
    short: "Grammar, Speaking, Cambridge-Zertifikate.",
    blurb:
      "Ob Schulstoff, Cambridge First/Advanced oder Bewerbungsgespräch auf Englisch: Wir bauen Sprachsicherheit auf — schriftlich und mündlich.",
    keywords: ["englisch nachhilfe", "cambridge vorbereitung", "englisch lernen"],
  },
  {
    slug: "rechnungswesen",
    name: "Rechnungswesen",
    category: "business",
    short: "Buchhaltung, Abschluss, Kalkulation — KV-erprobt.",
    blurb:
      "Soll und Haben endlich verstehen: Wir begleiten KV-Lernende und BMS-Schüler:innen durch Finanzbuchhaltung, Abschlüsse und Kalkulation — bis zur QV-Sicherheit.",
    keywords: ["rechnungswesen nachhilfe", "buchhaltung lernen", "kv hilfe"],
  },
  {
    slug: "wirtschaft-und-recht",
    name: "Wirtschaft & Recht",
    category: "business",
    short: "VWL, BWL und Recht für KV, BMS und Gymnasium.",
    blurb:
      "Von Angebot und Nachfrage bis OR-Vertragsrecht: Wir machen Wirtschaft und Recht verständlich — für KV, BMS, Gymnasium und Zwischenprüfungen.",
    keywords: ["wirtschaft nachhilfe", "recht lernen", "wr hilfe"],
  },
  {
    slug: "statistik",
    name: "Statistik",
    category: "business",
    short: "Deskriptiv bis Inferenz — inkl. R, Python & SPSS.",
    blurb:
      "Statistik ist die häufigste Hürde im Studium. Unsere Tutor:innen erklären Verteilungen, Tests und Regressionen — auf Wunsch direkt in R, Python oder SPSS.",
    keywords: ["statistik nachhilfe", "statistik studium hilfe", "spss hilfe"],
  },
];

export type Level = {
  slug: string;
  name: string;
  audience: string;
  blurb: string;
};

export const LEVELS: Level[] = [
  {
    slug: "lernende",
    name: "Lernende (Berufslehre)",
    audience: "Lernende in der beruflichen Grundbildung (EFZ/EBA), inkl. ICT- und KV-Lehren",
    blurb:
      "Berufsschule, üK und QV parallel zum Betrieb: Lernende stehen unter Druck. Unsere Tutor:innen kennen die Schweizer Berufsbildung aus eigener Erfahrung und begleiten modulgenau.",
  },
  {
    slug: "sekundarschule",
    name: "Sekundarschule",
    audience: "Schüler:innen der Sekundarstufe I (Sek A/B/C, Bezirksschule)",
    blurb:
      "Ob Notendruck oder Gymivorbereitung: In der Sek werden die Weichen gestellt. Wir stabilisieren Grundlagen und bauen Selbstvertrauen auf.",
  },
  {
    slug: "gymnasium",
    name: "Gymnasium",
    audience: "Gymnasiast:innen bis zur Matura",
    blurb:
      "Vom Untergymi bis zur Matura: Unsere Tutor:innen kennen die Anforderungen der Schweizer Gymnasien und bereiten gezielt auf Prüfungen und die Matura vor.",
  },
  {
    slug: "studierende",
    name: "Studierende",
    audience: "Studierende an Universitäten, ETH, FH und HF",
    blurb:
      "Assessment, Basisprüfung, Statistik-Schein: Im Studium entscheidet oft ein Semester. Unsere Tutor:innen haben die Prüfungen selbst bestanden — und wissen, worauf es ankommt.",
  },
  {
    slug: "erwachsene",
    name: "Erwachsene & Weiterbildung",
    audience: "Berufsleute in Weiterbildungen (BMS, Passerelle, HF/FH, eidg. Fachausweise)",
    blurb:
      "Weiterbildung neben dem Job ist anspruchsvoll. Wir unterstützen flexibel — von der BMS bis zum eidgenössischen Fachausweis.",
  },
];

export const SEO_CITY_SLUGS = [
  "zuerich",
  "winterthur",
  "bern",
  "basel",
  "luzern",
  "st-gallen",
  "zug",
  "aarau",
  "baden",
  "olten",
  "solothurn",
  "biel",
  "thun",
  "chur",
  "frauenfeld",
  "schaffhausen",
  "rapperswil-jona",
  "uster",
] as const;

const subjectMap = new Map(SUBJECTS.map((s) => [s.slug, s]));
const levelMap = new Map(LEVELS.map((l) => [l.slug, l]));

export function moduleSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getSubject(slug: string): Subject | undefined {
  return subjectMap.get(slug);
}

export function getLevel(slug: string): Level | undefined {
  return levelMap.get(slug);
}

export function getModuleBySlug(subject: Subject, moduleSlugValue: string): CurriculumModule | undefined {
  return subject.modules?.find((module) => moduleSlug(module.title) === moduleSlugValue);
}

export function buildModuleNarrative(module: CurriculumModule) {
  const lowerTitle = module.title.toLowerCase();

  const apiDatabaseSummary =
    "In diesem Modul lernst du, wie Anwendungen Daten austauschen, abrufen und speichern. Du verstehst, wie ein Frontend mit einer API spricht, wie Datenbankabfragen funktionieren und wie Fehler, Abfragen und Zugriffskontrollen in echten Projekten sauber umgesetzt werden.";

  const apiDatabaseGoals = [
    "API-Endpunkte, HTTP-Anfragen und Datenflüsse in verständlichen Schritten nachvollziehen.",
    "Datenbankabfragen, Tabellenbeziehungen und CRUD-Logik sicher verstehen und anwenden.",
    "Typische Fehler bei Datenzugriff, Validierung und Antwortformaten gezielt erkennen und beheben.",
  ];

  const apiDatabaseExamples = [
    "Ein Bestellformular so bauen, dass es Daten an eine API sendet und später wieder anzeigt.",
    "Produkte, Kunden oder Benutzer aus einer Datenbank abrufen und in einer kleinen Anwendung darstellen.",
    "Fehler beim Zugriff, bei der Antwort oder bei der Datenvalidierung mit gezielter Logik beheben.",
  ];

  const apiDatabasePrerequisites = [
    "Grundlagen aus Logik, Funktionen und Datenstrukturen sicher beherrschen.",
    "Verstanden haben, wie Informationen in Tabellen, Listen und Objekten gespeichert werden.",
    "Bereits kleine Anwendungen mit eigenen Inputs und Ausgaben selbstständig lösen können.",
  ];

  const apiDatabaseLearning = [
    "Das Modul in kleinen Schritten lernen: erst Anfrage, dann Antwort, dann Datenbank und zuletzt Fehlerbehandlung.",
    "Jedes Konzept direkt mit einem echten Beispiel verbinden, zum Beispiel ein Produkt, ein Login oder eine Bestellung.",
    "Erst verstehen, dann selbstständig mit echten Aufgaben üben und dabei sauber dokumentieren.",
  ];

  const apiDatabaseSupport = [
    "Wir erklären dir, wie ein Request durch die API läuft und wo die Datenbank genau eingebunden ist.",
    "Wir zeigen dir, wie du typische Aufgaben zu CRUD, Filter, JSON und Fehlerbehandlung sauber löst.",
    "Wir geben dir gezielte Rückmeldungen, damit du die Logik nicht nur merkst, sondern wirklich verstehst.",
  ];

  const matchesApiDatabase = lowerTitle.includes("api") || lowerTitle.includes("datenbank") || lowerTitle.includes("sql");

  const baseSummary =
    module.summary ??
    (matchesApiDatabase
      ? apiDatabaseSummary
      : `${module.title} ist ein zentrales Modul im Lernpfad von ${module.year}. Es verbindet fachliches Wissen mit praktischer Anwendung und bildet die Grundlage für spätere Projekte, Prüfungen und den Übergang in den Berufsalltag.`);

  const learningGoals =
    module.learningGoals?.length
      ? module.learningGoals
      : matchesApiDatabase
        ? apiDatabaseGoals
        : [
            `Die Kernprinzipien von ${module.title.toLowerCase()} sicher verstehen.`,
            `Die fachlichen Inhalte in kleine, nachvollziehbare Schritte zerlegen.`,
            `Die Inhalte in realen Übungsaufgaben mit Fokus auf Qualität und Struktur anwenden.`,
          ];

  const practicalExamples =
    module.practicalExamples?.length
      ? module.practicalExamples
      : matchesApiDatabase
        ? apiDatabaseExamples
        : [
            "Kleine Praxisaufgaben mit realem Anwendungsbezug lösen.",
            "Ergebnisse strukturiert dokumentieren und erklären.",
            "Typische Fehler erkennen und gezielt verbessern.",
          ];

  const prerequisites =
    module.prerequisites?.length
      ? module.prerequisites
      : matchesApiDatabase
        ? apiDatabasePrerequisites
        : [
            "Grundlagen aus dem vorherigen Lernabschnitt sicher beherrschen.",
            "Ein gewisses Verständnis für logisches Denken und Strukturierung voraussetzen.",
            "Kleine Übungsaufgaben ohne Druck regelmäßig lösen können.",
          ];

  const bestWayToLearn =
    module.bestWayToLearn?.length
      ? module.bestWayToLearn
      : matchesApiDatabase
        ? apiDatabaseLearning
        : [
            "Das Modul in kleinen Einheiten mit kurzen Übungseinheiten lernen.",
            "Jede Theorie direkt mit einem passenden Beispiel verbinden.",
            "Erst verstehen, dann selbständig lösen und reflektieren.",
          ];

  const support =
    module.support?.length
      ? module.support
      : matchesApiDatabase
        ? apiDatabaseSupport
        : [
            "Wir erklären die Kernidee verständlich und in Alltagssprache.",
            "Wir zeigen dir, wie du typische Aufgaben sauber löst.",
            "Wir geben dir gezielte Rückmeldung, damit du effizient weiterkommst.",
          ];

  return { baseSummary, learningGoals, practicalExamples, prerequisites, bestWayToLearn, support };
}

export const ICT_SUBJECTS = SUBJECTS.filter((s) => s.category === "ict");
export const SCHOOL_SUBJECTS = SUBJECTS.filter((s) => s.category !== "ict");
