"use client";

// Sticky Public-Navbar mit Burger-Menue fuer Mobile — helles Premium-Design.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ButtonLink, cn } from "@/components/ui";

const NAV_LINKS = [
  { href: "/nachhilfe", label: "Fächer" },
  { href: "/#so-funktionierts", label: "So funktioniert's" },
  { href: "/fuer-tutoren", label: "Für Tutor:innen" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  function isActive(href: string): boolean {
    if (href.includes("#")) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-edge-soft bg-card/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-tight text-ink transition-opacity hover:opacity-80"
          onClick={() => setOpen(false)}
        >
          lernova<span className="text-accent">.ch</span>
        </Link>

        {/* Desktop-Navigation */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Hauptnavigation">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-accent-soft text-accent-deep"
                    : "text-mute hover:bg-surface hover:text-ink"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/login"
            className="text-sm font-medium text-mute transition-colors hover:text-ink"
          >
            Login
          </Link>
          <ButtonLink href="/anfrage" size="sm">
            Nachhilfe anfragen
          </ButtonLink>
        </div>

        {/* Burger (Mobile) */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-mute transition-colors hover:bg-surface hover:text-ink md:hidden"
          aria-label={open ? "Menü schliessen" : "Menü öffnen"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile-Menue */}
      <div
        className={cn(
          "overflow-hidden border-edge-soft bg-card transition-all duration-200 md:hidden",
          open ? "max-h-96 border-t" : "max-h-0"
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Mobile Navigation">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-accent-soft text-accent-deep"
                    : "text-mute hover:bg-surface hover:text-ink"
                )}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/login"
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-mute transition-colors hover:bg-surface hover:text-ink"
            onClick={() => setOpen(false)}
          >
            Login
          </Link>
          <div className="px-3 pt-2">
            <ButtonLink href="/anfrage" className="w-full" size="md">
              Nachhilfe anfragen
            </ButtonLink>
          </div>
        </nav>
      </div>
    </header>
  );
}
