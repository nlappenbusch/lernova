// Icon-Zuordnung fuer Faecher (lucide-react) — server- und clienttauglich.

import {
  Atom,
  Binary,
  BookOpen,
  Braces,
  Calculator,
  ChartLine,
  ClipboardCheck,
  Cloud,
  CodeXml,
  Coffee,
  Coins,
  Cpu,
  Database,
  FlaskConical,
  Globe,
  GraduationCap,
  Hash,
  Languages,
  MessagesSquare,
  Network,
  Palette,
  Scale,
  Server,
  ShieldCheck,
  SquareCode,
  Terminal,
  type LucideIcon,
} from "lucide-react";

const SUBJECT_ICONS: Record<string, LucideIcon> = {
  "programmieren-python": CodeXml,
  "programmieren-java": Coffee,
  "programmieren-csharp": Hash,
  "programmieren-cpp": Cpu,
  "javascript-typescript": Braces,
  "web-entwicklung": Globe,
  netzwerktechnik: Network,
  "datenbanken-sql": Database,
  "linux-systemadministration": Terminal,
  "cloud-devops": Cloud,
  cybersecurity: ShieldCheck,
  "applikationsentwicklung-efz": SquareCode,
  "systemtechnik-efz": Server,
  mediamatik: Palette,
  "ict-modulpruefungen": ClipboardCheck,
  "informatik-grundlagen": Binary,
  mathematik: Calculator,
  physik: Atom,
  chemie: FlaskConical,
  deutsch: BookOpen,
  franzoesisch: Languages,
  englisch: MessagesSquare,
  rechnungswesen: Coins,
  "wirtschaft-und-recht": Scale,
  statistik: ChartLine,
};

export function subjectIcon(slug: string): LucideIcon {
  return SUBJECT_ICONS[slug] ?? GraduationCap;
}

export function SubjectIcon({ slug, className }: { slug: string; className?: string }) {
  const Icon = subjectIcon(slug);
  return <Icon className={className} aria-hidden />;
}
