// Plattform-Einstellungen: DB-Overlay (Setting-Tabelle) ueber die ENV-Defaults
// aus config.ts. Super-Admin editiert via /admin/einstellungen; alle Billing-/
// Mail-/Preis-Konsumenten lesen ueber getEffectiveConfig().

import { prisma } from "./db";
import { config } from "./config";

export type EffectiveConfig = {
  brandName: string;
  claim: string;
  baseUrl: string;
  company: typeof config.company;
  billing: typeof config.billing;
  smtp: typeof config.smtp;
};

/** Editierbare Sektionen (key der Setting-Tabelle -> Teilobjekt). */
export type SettingsPatch = {
  company?: Partial<typeof config.company>;
  billing?: Partial<typeof config.billing>;
  smtp?: Partial<typeof config.smtp>;
  brand?: { brandName?: string; claim?: string };
};

const SECTION_KEYS = ["company", "billing", "smtp", "brand"] as const;
type SectionKey = (typeof SECTION_KEYS)[number];

let cache: { value: EffectiveConfig; at: number } | null = null;
const CACHE_MS = 10_000;

export function invalidateSettingsCache(): void {
  cache = null;
}

function parseRow(value: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

/**
 * ENV-Defaults + DB-Overrides zusammengefuehrt. Leere Strings in Overrides
 * gelten als "nicht gesetzt" (Fallback auf ENV/Default).
 */
export async function getEffectiveConfig(): Promise<EffectiveConfig> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.value;

  const rows = await prisma.setting.findMany({
    where: { key: { in: [...SECTION_KEYS] } },
  });
  const bySection = new Map(rows.map((r) => [r.key as SectionKey, parseRow(r.value)]));

  const merge = <T extends Record<string, unknown>>(base: T, patch: Record<string, unknown>): T => {
    const out: Record<string, unknown> = { ...base };
    for (const [k, v] of Object.entries(patch)) {
      if (v === undefined || v === null) continue;
      if (typeof v === "string" && v.trim() === "") continue;
      if (Array.isArray(v) && v.length === 0) continue;
      out[k] = v;
    }
    return out as T;
  };

  const brand = bySection.get("brand") ?? {};
  const value: EffectiveConfig = {
    brandName: typeof brand.brandName === "string" && brand.brandName.trim() !== "" ? brand.brandName : config.brandName,
    claim: typeof brand.claim === "string" && brand.claim.trim() !== "" ? brand.claim : config.claim,
    baseUrl: config.baseUrl,
    company: merge(config.company, bySection.get("company") ?? {}),
    billing: merge(config.billing, bySection.get("billing") ?? {}),
    smtp: merge(config.smtp, bySection.get("smtp") ?? {}),
  };

  cache = { value, at: Date.now() };
  return value;
}

/** Speichert Sektions-Patches (shallow merge auf bestehende DB-Werte). */
export async function saveSettings(patch: SettingsPatch): Promise<void> {
  for (const key of SECTION_KEYS) {
    const section = patch[key];
    if (!section) continue;
    const existing = await prisma.setting.findUnique({ where: { key } });
    const merged = { ...(existing ? parseRow(existing.value) : {}), ...section };
    await prisma.setting.upsert({
      where: { key },
      create: { key, value: JSON.stringify(merged) },
      update: { value: JSON.stringify(merged) },
    });
  }
  invalidateSettingsCache();
}

/** Rohwerte der DB-Overrides (fuer das Einstellungs-Formular). */
export async function getRawSettings(): Promise<Record<SectionKey, Record<string, unknown>>> {
  const rows = await prisma.setting.findMany({ where: { key: { in: [...SECTION_KEYS] } } });
  const out = Object.fromEntries(SECTION_KEYS.map((k) => [k, {}])) as Record<
    SectionKey,
    Record<string, unknown>
  >;
  for (const row of rows) out[row.key as SectionKey] = parseRow(row.value);
  return out;
}
