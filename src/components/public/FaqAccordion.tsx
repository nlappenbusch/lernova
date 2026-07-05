"use client";

// Barrierearmes FAQ-Accordion (eine Frage offen, sanfte Hoehen-Transition).

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/components/ui";

export type FaqItem = { q: string; a: string };

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-edge-soft overflow-hidden rounded-xl border border-edge-soft bg-card shadow-card">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-card-hover"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span className="text-sm font-medium text-ink">{item.q}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-faint transition-transform duration-200",
                  isOpen && "rotate-180 text-accent"
                )}
                aria-hidden
              />
            </button>
            <div
              className={cn(
                "grid transition-all duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm leading-relaxed text-mute">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
