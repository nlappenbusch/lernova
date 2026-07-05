// SEO-Helfer fuer die Public Site: Kantonsnamen, Stufen-Kurzlabels,
// Default-Stufe pro Fach-Kategorie, Title-Builder und JSON-LD-Renderer.

import type { Subject } from "@/lib/subjects";

export const CANTON_NAMES: Record<string, string> = {
  ZH: "Zürich",
  BE: "Bern",
  LU: "Luzern",
  UR: "Uri",
  SZ: "Schwyz",
  OW: "Obwalden",
  NW: "Nidwalden",
  GL: "Glarus",
  ZG: "Zug",
  FR: "Freiburg",
  SO: "Solothurn",
  BS: "Basel-Stadt",
  BL: "Basel-Landschaft",
  SH: "Schaffhausen",
  AR: "Appenzell Ausserrhoden",
  AI: "Appenzell Innerrhoden",
  SG: "St. Gallen",
  GR: "Graubünden",
  AG: "Aargau",
  TG: "Thurgau",
  TI: "Tessin",
  VD: "Waadt",
  VS: "Wallis",
  NE: "Neuenburg",
  GE: "Genf",
  JU: "Jura",
};

export function cantonName(code: string): string {
  return CANTON_NAMES[code] ?? code;
}

/** Kurzlabels der Stufen fuer knappe Meta-Titles. */
export const LEVEL_SHORT: Record<string, string> = {
  lernende: "Lernende",
  sekundarschule: "Sek",
  gymnasium: "Gymnasium",
  studierende: "Studierende",
  erwachsene: "Erwachsene",
};

/** Sinnvolle Default-Stufe, wenn von einer Fach-Seite direkt auf eine Orts-Seite verlinkt wird. */
export function defaultLevelSlug(subject: Subject): string {
  return subject.category === "school" ? "sekundarschule" : "lernende";
}

/** Waehlt den ersten Title-Kandidaten, der ins 60-Zeichen-Budget passt. */
export function pickTitle(candidates: string[], maxLength = 60): string {
  for (const c of candidates) {
    if (c.length <= maxLength) return c;
  }
  return candidates[candidates.length - 1].slice(0, maxLength);
}

/** Rendert ein JSON-LD-Script-Tag (Server-Komponente). */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
