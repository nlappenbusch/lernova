"use client";

// Monats-Picker: navigiert via searchParams (?year=&month=) auf derselben Seite.

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Select } from "@/components/ui";
import { MONTH_NAMES } from "@/lib/format";

export function MonthPicker({
  year,
  month,
  basePath,
}: {
  year: number;
  month: number;
  basePath: string;
}) {
  const router = useRouter();

  function go(y: number, m: number) {
    router.push(`${basePath}?year=${y}&month=${m}`);
  }

  const nowYear = new Date().getFullYear();
  const years: number[] = [];
  for (let y = nowYear - 3; y <= nowYear + 1; y++) years.push(y);
  if (!years.includes(year)) {
    years.push(year);
    years.sort((a, b) => a - b);
  }

  const prev = month === 1 ? { y: year - 1, m: 12 } : { y: year, m: month - 1 };
  const next = month === 12 ? { y: year + 1, m: 1 } : { y: year, m: month + 1 };
  const arrowCls =
    "rounded-lg border border-edge p-2 text-mute transition-colors hover:border-accent/50 hover:text-ink";

  return (
    <div className="flex items-center gap-2">
      <button type="button" className={arrowCls} onClick={() => go(prev.y, prev.m)} aria-label="Vormonat">
        <ChevronLeft size={14} />
      </button>
      <Select
        value={String(month)}
        onChange={(e) => go(year, parseInt(e.target.value, 10))}
        className="w-36"
        aria-label="Monat"
      >
        {MONTH_NAMES.map((name, i) => (
          <option key={name} value={String(i + 1)}>
            {name}
          </option>
        ))}
      </Select>
      <Select
        value={String(year)}
        onChange={(e) => go(parseInt(e.target.value, 10), month)}
        className="w-24"
        aria-label="Jahr"
      >
        {years.map((y) => (
          <option key={y} value={String(y)}>
            {y}
          </option>
        ))}
      </Select>
      <button type="button" className={arrowCls} onClick={() => go(next.y, next.m)} aria-label="Folgemonat">
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
