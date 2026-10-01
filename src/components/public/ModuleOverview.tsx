"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { Card } from "@/components/ui";
import { buildModuleNarrative, moduleSlug, type CurriculumModule } from "@/lib/subjects";

type ModuleOverviewProps = {
  modules: CurriculumModule[];
  subjectSlug: string;
  subjectName: string;
};

export function ModuleOverview({ modules, subjectSlug, subjectName }: ModuleOverviewProps) {
  const years = ["Alle", ...new Set(modules.map((module) => module.year))];
  const [selectedYear, setSelectedYear] = useState<string>("Alle");
  const [query, setQuery] = useState("");

  const filteredModules = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return modules.filter((module) => {
      const matchesYear = selectedYear === "Alle" || module.year === selectedYear;
      const haystack = `${module.title} ${module.focus} ${module.summary ?? ""} ${module.code}`.toLowerCase();
      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
      return matchesYear && matchesQuery;
    });
  }, [modules, query, selectedYear]);

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-2xl border border-edge-soft bg-card p-4 shadow-card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" aria-hidden />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Module in ${subjectName} suchen`}
              className="w-full rounded-xl border border-edge bg-card pl-9 pr-3 py-2.5 text-sm text-ink placeholder:text-faint outline-none transition focus:border-accent/40"
              aria-label={`Module in ${subjectName} suchen`}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {years.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => setSelectedYear(year)}
                className={[
                  "rounded-full border px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition-all",
                  selectedYear === year
                    ? "border-accent/20 bg-accent-soft text-accent"
                    : "border-edge bg-card text-faint hover:border-accent/25 hover:text-ink",
                ].join(" ")}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredModules.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-edge bg-card p-8 text-center text-sm text-mute">
          Keine Module gefunden. Verkleinere deine Suche oder wähle eine andere Lehrjahr-Kategorie.
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {filteredModules.map((module) => {
          const narrative = buildModuleNarrative(module);

          return (
            <Link
              key={module.code}
              href={`/nachhilfe/${subjectSlug}/module/${moduleSlug(module.title)}`}
              className="group block h-full"
            >
              <Card className="h-full p-5 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-accent/30 group-hover:shadow-card-lg">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
                    {module.code}
                  </span>
                  <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-faint">
                    {module.year}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold tracking-tight text-ink">{module.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">{narrative.baseSummary}</p>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <div className="rounded-xl border border-edge bg-card p-3">
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-faint">
                      <Sparkles className="h-3 w-3 text-accent" aria-hidden />
                      Voraussetzungen
                    </div>
                    <ul className="mt-2 space-y-1 text-[11px] leading-relaxed text-mute">
                      {narrative.prerequisites.slice(0, 2).map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-edge bg-card p-3">
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-faint">
                      <ArrowRight className="h-3 w-3 text-accent" aria-hidden />
                      Lernweg
                    </div>
                    <ul className="mt-2 space-y-1 text-[11px] leading-relaxed text-mute">
                      {narrative.bestWayToLearn.slice(0, 2).map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-edge bg-card p-3">
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-faint">
                      <Sparkles className="h-3 w-3 text-accent" aria-hidden />
                      Unterstützung
                    </div>
                    <ul className="mt-2 space-y-1 text-[11px] leading-relaxed text-mute">
                      {narrative.support.slice(0, 2).map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                  Modul ansehen
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
