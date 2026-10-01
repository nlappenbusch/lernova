export type MicrosoftOfferCategory = "cert" | "modern" | "security";

export type MicrosoftOffer = {
  slug: string;
  title: string;
  badge?: string;
  category: MicrosoftOfferCategory;
  summary: string;
  audience: string;
  format: string;
  learningGoals: string[];
  outcomes: string[];
  nextStep: string;
};

export const MICROSOFT_OFFERS: MicrosoftOffer[] = [
  {
    slug: "microsoft-365-administrator-expert",
    title: "Microsoft 365 Administrator Expert",
    badge: "Expert Track",
    category: "cert",
    summary:
      "Umfassende Microsoft 365-Expertise für Administration, Governance, Security und moderne Endbenutzer-Workflows.",
    audience: "IT-Administrierende, Microsoft-Teams, Betrieb & Security-Owner",
    format: "Expert Track / Coaching-Format",
    learningGoals: [
      "Microsoft 365-Umgebungen sicher administrieren und dokumentieren.",
      "Governance, Benutzer- und Lizenzmanagement verständlich aufsetzen.",
      "Security- und Compliance-Mechanismen in realen Betriebsprozessen einordnen.",
      "Workflows mit Teams, Exchange, SharePoint und Intune zielgerichtet betreiben.",
    ],
    outcomes: [
      "Mehr Sicherheit und Klarheit in der täglichen Administration.",
      "Bessere Governance- und Betriebsprozesse für Microsoft 365.",
      "Stärkere inhouse-Kompetenz für Mitarbeitende, Teams und Verantwortliche.",
    ],
    nextStep:
      "Ideal, wenn du ein Unternehmen, Team oder Administratorenbereich mit anspruchsvollen Microsoft 365-Prozessen auf das nächste Level bringen willst.",
  },
  {
    slug: "microsoft-365-administrator-essentials-intensive",
    title: "Microsoft 365 Administrator Essentials – Intensive",
    badge: "Bootcamp",
    category: "cert",
    summary:
      "Intensiv-Format für zentrale Administration, Governance und Stabilität in realen Microsoft 365-Umgebungen.",
    audience: "Einsteiger in Microsoft 365, Support, Admins, Teams mit Praxisbedarf",
    format: "Intensives Bootcamp",
    learningGoals: [
      "Zentrale Microsoft 365-Administration verständlich strukturieren.",
      "Benutzer, Lizenzen, Rollen und Berechtigungen sicher verwalten.",
      "Microsoft 365 mit Fokus auf Stabilität, Governance und Nutzerführung betreiben.",
      "Typische Admin-Aufgaben mit realen Arbeitsabläufen üben.",
    ],
    outcomes: [
      "Schnelleres Verständnis für Microsoft 365 im Betrieb.",
      "Mehr Sicherheit bei Benutzer- und Rollendefinitionen.",
      "Klarere Arbeitsteilung zwischen Support, IT und Fachbereichen.",
    ],
    nextStep:
      "Perfekt für Teams, die schnell in die zentrale Administration einsteigen und das Wissen in kurzer Zeit praktisch nutzbar machen wollen.",
  },
  {
    slug: "microsoft-365-certified-endpoint-administrator-associate",
    title: "Microsoft 365 Certified: Endpoint Administrator Associate",
    badge: "Associate",
    category: "cert",
    summary:
      "Zertifizierungsrelevante Vorbereitung für Endpoint Administration, Device Management und Sicherheits-Setup.",
    audience: "Endpoint-Administrierende, IT-Support, Workplace-Teams, Berufsanfänger mit IT-Fokus",
    format: "Zertifizierungsorientiert mit Praxiseinheiten",
    learningGoals: [
      "Endpoint-Umgebungen mit Intune, Policies und Device-Management verstehen.",
      "Geräte- und Sicherheitskonfigurationen im Microsoft 365-Umfeld umsetzen.",
      "Zertifizierungsrelevante Themen in verständlichen, praxisnahen Einheiten lernen.",
      "Typische Prüfungs- und Betriebsfragen sicher beantworten.",
    ],
    outcomes: [
      "Mehr Sicherheit im Device-Management und bei Endpoints.",
      "Stärkeres Verständnis für moderne Workplace-Architekturen.",
      "Mehr Selbstvertrauen bei Zertifizierungs- und Betriebsfragen.",
    ],
    nextStep:
      "Ideal für Personen, die Ihre Endpoints sauber verwalten und gleichzeitig eine klare Zertifizierungsbasis aufbauen wollen.",
  },
  {
    slug: "microsoft-365-endpoint-administrator",
    title: "Microsoft 365 Endpoint Administrator",
    badge: "Intensive Training",
    category: "cert",
    summary:
      "Praxisnaher Kurs zur Verwaltung von Endpoint-Umgebungen, Policies, Intune und modernen Workplace-Szenarien.",
    audience: "IT-Teams, Endpoints, Device-Management, Security-Beauftragte",
    format: "Intensive Schulung mit praxisnahen Übungen",
    learningGoals: [
      "Endpoint-Umgebungen in Microsoft 365 sauber planen und verwalten.",
      "Intune, Policies und Geräte-Workflow verstehen und anwenden.",
      "Security- und Compliance-Settings für Endpoints im Alltag sicher nutzen.",
      "Reale Workplace-Szenarien mit klaren Verantwortlichkeiten durchgehen.",
    ],
    outcomes: [
      "Schnellerer Betrieb von Endpoints und Workplace-Umgebungen.",
      "Stärkere Absicherung bei Geräten, Zugriff und Standardisierung.",
      "Viel klarere Umsetzung im realen betrieblichen Alltag.",
    ],
    nextStep:
      "Wenn du die Verwaltung der Endpoints im Alltag ernsthaft strukturieren und verbessern willst, ist dieser Track die passende Grundlage.",
  },
  {
    slug: "proxmox-ve-basic",
    title: "Proxmox VE: Basic",
    badge: "Infra",
    category: "modern",
    summary:
      "Open-Source-Foundation für Virtualisierung, Linux-Umgebungen und moderne Infrastruktur-Szenarien.",
    audience: "IT-Admin, Infrastructure-Team, Lernende mit Interesse an Virtualisierung",
    format: "Grundlagen-Workshop",
    learningGoals: [
      "Virtualisierung mit Proxmox als Grundlage verstehen und nutzen.",
      "Linux-Umgebungen, Storage, Netzwerke und virtuelle Maschinen logisch einordnen.",
      "Moderne Infrastruktur-Szenarien in verständlichen Schritten erleben.",
      "Stabilität, Struktur und Betrieb als zentrale Kriterien begreifen.",
    ],
    outcomes: [
      "Mehr Verständnis für moderne Server- und Infrastruktur-Modelle.",
      "Bessere Einordnung von VMs, Storage und Betrieb in realen Umgebungen.",
      "Stärkeres Grundwissen für eigene Infrastrukturprojekte.",
    ],
    nextStep:
      "Wenn du eine moderne Infrastruktur ohne Overhead verstehen willst, ist Proxmox ein idealer Einstieg in reale Betriebslogik.",
  },
  {
    slug: "master-class-ai-agent-specialist",
    title: "Master Class AI Agent Specialist",
    badge: "AI & Automation",
    category: "modern",
    summary:
      "Praxisorientierte AI-Workshops zum Aufbau von Agenten, Automations und intelligenter Kollaboration in realen Prozessen.",
    audience: "Teams, Manager, Fachbereiche, IT-Strategen, digitale Praxis- und Prozessverantwortliche",
    format: "Masterclass / Workshop-Format",
    learningGoals: [
      "AI-Agenten, Automationen und Arbeitsprozesse in der Praxis verstehen.",
      "Reale Use Cases mit Sinn, Nutzen und Grenzen sauber einordnen.",
      "AI-Workflows für Teamarbeit, Dokumentation und Entscheidungsprozesse nutzen.",
      "Verantwortung, Governance und praktische Einbindung im Betrieb beachten.",
    ],
    outcomes: [
      "Mehr Klarheit bei der Nutzung von AI in echten Prozessen.",
      "Stärkere Zusammenarbeit zwischen Technik und Fachbereich.",
      "Praktisch nutzbare Ideen für Automatisierung und Prozessverbesserung.",
    ],
    nextStep:
      "Für Teams, die nicht nur “KI” wollen, sondern wirklich intelligente und verantwortungsvolle Workflows im Betrieb bauen möchten.",
  },
  {
    slug: "cis-und-security-review",
    title: "CIS- und Security-Review",
    badge: "Security Review",
    category: "security",
    summary:
      "Bestandsaufnahme von Zugriff, Identitäten, Endpoint-Sicherheit und Governance gegen gängige CIS-Standards.",
    audience: "Unternehmen, IT-Leitungen, Security-Verantwortliche, Betriebs- und Governance-Teams",
    format: "Review / Workshop / Bestandsanalyse",
    learningGoals: [
      "Sicherheitslage strukturieren und mit gängigen Standards vergleichen.",
      "Identitäten, Zugriffsrechte und Endpoint-Settings bewusst bewerten.",
      "Lücken erkennen und priorisieren.",
      "Handlungsempfehlungen mit klaren Verantwortlichkeiten ableiten.",
    ],
    outcomes: [
      "Mehr Transparenz in der aktuellen Sicherheitslage.",
      "Klarere Bewertung von Risiken und Prioritäten.",
      "Eine belastbare Grundlage für weitere Maßnahmen und Governance.",
    ],
    nextStep:
      "Wenn du wissen willst, wo die größten Sicherheitslücken tatsächlich liegen, ist das die richtige Startbasis.",
  },
  {
    slug: "finma-konforme-risikopruefung",
    title: "FINMA-konforme Risikoprüfung",
    badge: "Governance",
    category: "security",
    summary:
      "Beurteilung von Prozessen, Governance und dokumentierten Abläufen für sichere, nachvollziehbare Betriebsmodelle.",
    audience: "Verantwortliche, Management, Compliance-Beauftragte, interne Audit- und Operate-Teams",
    format: "Risikobewertung mit Workshopcharakter",
    learningGoals: [
      "Prozesse, Rollen und Verantwortlichkeiten gegen Risiken bewerten.",
      "Governance-Strukturen und Dokumentationspflichten einordnen.",
      "Nachvollziehbare Risikobetrachtungen für Betrieb und Management entwickeln.",
      "Klarheit über Prioritäten, Kontrollen und nächsten Schritte gewinnen.",
    ],
    outcomes: [
      "Mehr Sicherheit bei Governance und Ablaufsteuerung.",
      "Bessere Nachvollziehbarkeit für interne und externe Anforderungen.",
      "Stabilere Prozesse für verantwortungsbewussten Betrieb.",
    ],
    nextStep:
      "Für Organisationen, die Prozesse, Verantwortung und Kontrolle nicht nur “hintenherum”, sondern gezielt aufbauen wollen.",
  },
  {
    slug: "workshops-sensibilisierung",
    title: "Workshops & Sensibilisierung",
    badge: "Team Training",
    category: "security",
    summary:
      "Praxisbezogene Schulungen mit realen Fallbeispielen, Verantwortlichkeiten und klaren Handlungsempfehlungen für Teams.",
    audience: "Mitarbeitende, Führungskräfte, Teams, Verantwortliche in IT und Betriebsprozessen",
    format: "Praxisworkshop / Sensibilisierung",
    learningGoals: [
      "Sicherheitsbewusstsein in realen Alltagsfällen gezielt stärken.",
      "Verantwortlichkeiten, Reaktionen und Risiken verständlich diskutieren.",
      "Teams mit echten Beispielen und klaren Handlungsempfehlungen trainieren.",
      "Wissen in Verhalten und tägliche Praxis überführen.",
    ],
    outcomes: [
      "Stärkere Sensibilisierung und bessere Reaktionen im Alltag.",
      "Mehr Klarheit über Verantwortlichkeiten und Sicherheitsprozesse.",
      "Verlässlicheres Verhalten in kritischen Situationen.",
    ],
    nextStep:
      "Wenn du mit deinem Team echte Sicherheit im Alltag stärken willst, ist das die passende Form der Schulung.",
  },
  {
    slug: "umsetzungsplan-roadmap",
    title: "Umsetzungsplan & Roadmap",
    badge: "Roadmap",
    category: "security",
    summary:
      "Konkreter Maßnahmenplan mit Prioritäten, Rollen, Zeitfenstern und klaren nächsten Schritten.",
    audience: "Unternehmen, IT, Management, Architektur- und Sicherheitsverantwortliche",
    format: "Roadmap-Workshop und Maßnahmenplanung",
    learningGoals: [
      "Sicherheits- und Transformationsmaßnahmen nach Priorität strukturieren.",
      "Rollen, Verantwortlichkeiten und Zeitfenster klar definieren.",
      "Umsetzungschritte mit echten nächsten Aktionen verbinden.",
      "Verantwortung und Fortschritt messbar machen.",
    ],
    outcomes: [
      "Mehr Klarheit über den nächsten konkreten Weg.",
      "Verlässlichere Umsetzung statt allgemeiner Ideen ohne Handlungsplan.",
      "Bessere Priorisierung und Verantwortung im Betrieb.",
    ],
    nextStep:
      "Ideal, wenn eine Sicherheitslage analysiert wurde und jetzt dringend ein realistischer, umsetzbarer Fahrplan benötigt wird.",
  },
];

export const MICROSOFT_OFFER_MAP = new Map(MICROSOFT_OFFERS.map((offer) => [offer.slug, offer]));
