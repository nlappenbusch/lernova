// Faecher-Katalog (ICT-Schwerpunkt) + Schulstufen + SEO-Staedte.
// Grundlage fuer Programmatic SEO (/nachhilfe/[fach]/[stufe]/[ort]),
// das Lead-Formular und das Tutor-Matching.

export type SubjectCategory = "ict" | "school" | "business";

export type Subject = {
  slug: string;
  name: string;
  category: SubjectCategory;
  /** Kurzbeschreibung fuer Karten/Listen */
  short: string;
  /** SEO-Text-Baustein (1-3 Saetze, wird auf Landingpages verwendet) */
  blurb: string;
  keywords: string[];
};

export const SUBJECTS: Subject[] = [
  // ===== ICT (Schwerpunkt) =====
  {
    slug: "programmieren-python",
    name: "Python",
    category: "ict",
    short: "Von den Grundlagen bis zu Datenanalyse und Automatisierung.",
    blurb:
      "Python ist die meistgefragte Einstiegssprache — an Berufsschulen, Gymnasien und Hochschulen. Unsere Tutor:innen begleiten von den ersten Skripten über OOP bis zu Datenanalyse, Automatisierung und Prüfungsvorbereitung.",
    keywords: ["python nachhilfe", "python lernen", "programmieren lernen", "python prüfung"],
  },
  {
    slug: "programmieren-java",
    name: "Java",
    category: "ict",
    short: "OOP, Collections, Spring — sattelfest für Modul- und Semesterprüfungen.",
    blurb:
      "Java ist Standard in der Applikationsentwicklung EFZ und an vielen Hochschulen. Wir helfen bei OOP-Konzepten, Datenstrukturen, JUnit und der Vorbereitung auf Modul- und Semesterprüfungen.",
    keywords: ["java nachhilfe", "java lernen", "oop verstehen", "applikationsentwicklung java"],
  },
  {
    slug: "programmieren-csharp",
    name: "C#",
    category: "ict",
    short: ".NET, Objektorientierung und saubere Architektur.",
    blurb:
      "C# und .NET sind in Schweizer Lehrbetrieben weit verbreitet. Unsere Tutor:innen unterstützen bei Übungen aus dem Betrieb, üK-Modulen und Projektarbeiten — praxisnah und auf Augenhöhe.",
    keywords: ["c# nachhilfe", ".net lernen", "csharp hilfe"],
  },
  {
    slug: "programmieren-cpp",
    name: "C++",
    category: "ict",
    short: "Pointer, Memory Management und Systemnähe verständlich erklärt.",
    blurb:
      "C++ gehört zu den anspruchsvollsten Sprachen im Studium. Wir erklären Pointer, Referenzen, RAII und die STL so, dass es klick macht — inklusive Vorbereitung auf Semesterprüfungen.",
    keywords: ["c++ nachhilfe", "cpp lernen", "c++ studium hilfe"],
  },
  {
    slug: "javascript-typescript",
    name: "JavaScript & TypeScript",
    category: "ict",
    short: "Die Sprache des Webs — vom DOM bis zu modernen Frameworks.",
    blurb:
      "JavaScript und TypeScript sind das Fundament der Webentwicklung. Wir begleiten von den Sprachgrundlagen über asynchrone Programmierung bis zu React, Node.js und Typsystemen.",
    keywords: ["javascript nachhilfe", "typescript lernen", "webentwicklung hilfe"],
  },
  {
    slug: "web-entwicklung",
    name: "Web-Entwicklung",
    category: "ict",
    short: "HTML, CSS, Responsive Design und moderne Frontends.",
    blurb:
      "Von semantischem HTML über CSS-Layouts bis zu kompletten Web-Projekten für üK und IPA: Unsere Tutor:innen zeigen, wie professionelle Frontends entstehen.",
    keywords: ["webentwicklung nachhilfe", "html css lernen", "frontend hilfe"],
  },
  {
    slug: "netzwerktechnik",
    name: "Netzwerktechnik",
    category: "ict",
    short: "OSI, Subnetting, Routing & Switching — pruefungssicher.",
    blurb:
      "Subnetting, VLANs, Routing-Protokolle und Firewalls: Netzwerktechnik ist Kernstoff der Systemtechnik EFZ und vieler Weiterbildungen. Wir üben an realen Szenarien bis zur Prüfungssicherheit.",
    keywords: ["netzwerktechnik nachhilfe", "subnetting lernen", "ccna vorbereitung"],
  },
  {
    slug: "datenbanken-sql",
    name: "Datenbanken & SQL",
    category: "ict",
    short: "Normalisierung, Joins, Transaktionen — von Grund auf verstanden.",
    blurb:
      "ER-Modelle, Normalformen, komplexe Joins und Performance: Datenbanken sind fester Bestandteil jeder Informatik-Ausbildung. Wir bringen SQL vom Auswendiglernen zum echten Verständnis.",
    keywords: ["sql nachhilfe", "datenbanken lernen", "er-modell hilfe"],
  },
  {
    slug: "linux-systemadministration",
    name: "Linux & Systemadministration",
    category: "ict",
    short: "Shell, Services, Server-Setups — hands-on erklärt.",
    blurb:
      "Bash, systemd, Rechteverwaltung und Server-Dienste: Wir machen fit für Betrieb und üK — vom ersten Terminal-Befehl bis zum sauber aufgesetzten Server.",
    keywords: ["linux nachhilfe", "linux lernen", "systemadministration hilfe"],
  },
  {
    slug: "cloud-devops",
    name: "Cloud & DevOps",
    category: "ict",
    short: "Docker, CI/CD, Azure & AWS praxisnah.",
    blurb:
      "Container, Pipelines und Cloud-Architekturen gehören heute in jede ICT-Ausbildung. Unsere Tutor:innen erklären Docker, CI/CD und Cloud-Services an konkreten Projekten.",
    keywords: ["devops lernen", "docker nachhilfe", "cloud kurs"],
  },
  {
    slug: "cybersecurity",
    name: "Cyber Security",
    category: "ict",
    short: "Grundlagen, Härtung, Security-Module der ICT-Berufe.",
    blurb:
      "Von CIA-Triade über Verschlüsselung bis zu praktischer System-Härtung: Wir begleiten durch Security-Module der ICT-Lehren und Studiengänge — verständlich und aktuell.",
    keywords: ["cybersecurity nachhilfe", "it-sicherheit lernen"],
  },
  {
    slug: "applikationsentwicklung-efz",
    name: "Applikationsentwicklung EFZ",
    category: "ict",
    short: "Begleitung durch alle Module der Lehre — bis zur IPA.",
    blurb:
      "Gezielte Unterstützung für Lernende Informatik EFZ Fachrichtung Applikationsentwicklung: Modulprüfungen, üK-Kompetenznachweise, Berufsschulstoff und IPA-Vorbereitung mit Tutor:innen, die die Lehre selbst durchlaufen haben.",
    keywords: ["applikationsentwicklung nachhilfe", "informatik efz hilfe", "ipa vorbereitung"],
  },
  {
    slug: "systemtechnik-efz",
    name: "Systemtechnik EFZ",
    category: "ict",
    short: "Netzwerke, Server, Virtualisierung — modulgenau begleitet.",
    blurb:
      "Für Lernende Informatik EFZ Fachrichtung Plattformentwicklung/Systemtechnik: Wir begleiten durch Netzwerk-, Server- und Virtualisierungsmodule bis zur IPA — mit Profis aus der Praxis.",
    keywords: ["systemtechnik nachhilfe", "plattformentwicklung efz", "informatik lehre hilfe"],
  },
  {
    slug: "mediamatik",
    name: "Mediamatik",
    category: "ict",
    short: "Design, Web, Marketing und Technik — die ganze Bandbreite.",
    blurb:
      "Mediamatiker:innen EFZ jonglieren Design, Web, Marketing und ICT. Unsere Tutor:innen unterstützen in genau den Modulen, die gerade brennen — von Adobe bis Webtechnik.",
    keywords: ["mediamatik nachhilfe", "mediamatiker efz hilfe"],
  },
  {
    slug: "ict-modulpruefungen",
    name: "ICT-Modulprüfungen",
    category: "ict",
    short: "Gezielte Vorbereitung auf einzelne ICT-Module (üK & BFS).",
    blurb:
      "Ein bestimmtes Modul steht an — 117, 231, 293, 320? Wir matchen mit Tutor:innen, die genau dieses Modul kennen, und bereiten gezielt auf den Kompetenznachweis vor.",
    keywords: ["ict module nachhilfe", "modulprüfung vorbereitung", "ük hilfe"],
  },
  {
    slug: "informatik-grundlagen",
    name: "Informatik-Grundlagen",
    category: "ict",
    short: "Von Binärzahlen bis Algorithmen — solides Fundament.",
    blurb:
      "Zahlensysteme, Logik, Algorithmen und Datenstrukturen: das Fundament jeder Informatik-Ausbildung. Ideal für Gymnasium, BMS und Studienbeginn.",
    keywords: ["informatik nachhilfe", "algorithmen lernen", "informatik gymnasium"],
  },
  // ===== Schule =====
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
  // ===== KV / Wirtschaft =====
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
  /** Wen sprechen wir an (fuer SEO-Texte) */
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

/** Staedte, fuer die SEO-Landingpages generiert & in der Sitemap gelistet werden. */
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

export function getSubject(slug: string): Subject | undefined {
  return subjectMap.get(slug);
}

export function getLevel(slug: string): Level | undefined {
  return levelMap.get(slug);
}

export const ICT_SUBJECTS = SUBJECTS.filter((s) => s.category === "ict");
export const SCHOOL_SUBJECTS = SUBJECTS.filter((s) => s.category !== "ict");
