// Filter-Tabs als Links (Server-kompatibel, Filterung via searchParams).

import Link from "next/link";
import { cn } from "@/components/ui";

export type FilterTabItem = {
  key: string;
  label: string;
  href: string;
  count?: number;
};

export function FilterTabs({ items, activeKey }: { items: FilterTabItem[]; activeKey: string }) {
  return (
    <div className="mb-4 flex w-fit max-w-full flex-wrap gap-1 rounded-lg border border-edge-soft bg-surface p-1">
      {items.map((t) => (
        <Link
          key={t.key}
          href={t.href}
          className={cn(
            "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
            t.key === activeKey
              ? "border-edge bg-card text-ink"
              : "border-transparent text-mute hover:text-ink"
          )}
        >
          {t.label}
          {typeof t.count === "number" ? (
            <span className="ml-1.5 text-faint">{t.count}</span>
          ) : null}
        </Link>
      ))}
    </div>
  );
}
