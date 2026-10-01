// ICT-Berufsbildungs-Katalog Schweiz (Berufe + Modulbaukasten).
// STUB — wird vom Public-Agent aus docs/research/ict-berufe-module.md befuellt.
// Signaturen sind fixer Kontrakt (siehe docs/CONTRACTS.md).

export type IctModule = {
  code: string;
  title: string;
  year?: number;
  type: "BFS" | "UK";
  professions: string[];
  summary?: string;
  pitfalls?: string;
  subjects?: string[];
};

export type IctProfession = {
  slug: string;
  name: string;
  short: string;
  description: string;
  durationYears: number;
  direction?: string;
  qv: string;
  nextSteps: string[];
  modulesByYear: Record<number, string[]>;
};

export const ICT_PROFESSIONS: IctProfession[] = [];

export const ICT_MODULES: IctModule[] = [];

export function getProfession(slug: string): IctProfession | undefined {
  return ICT_PROFESSIONS.find((p) => p.slug === slug);
}

export function getModule(code: string): IctModule | undefined {
  return ICT_MODULES.find((m) => m.code === code);
}
