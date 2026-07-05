"use client";

// Sticky Public-Navbar mit Burger-Menue fuer Mobile.

import Link from "next/link";
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

  return (
    <header className="sticky top-0 z-50 border-b border-edge-soft bg-base/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-ink transition-opacity hover:opacity-80"
          onClick={() => setOpen(false)}
        >
          lernova<span className="text-accent">.ch</span>
        </Link>

        {/* Desktop-Navigation */}
        <nav className="hidden items-center gap-7 md:flex" aria-label="Hauptnavigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-mute transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link href="/login" className="text-sm text-faint transition-colors hover:text-mute">
            Login
          </Link>
          <ButtonLink href="/anfrage" size="sm">
            Nachhilfe anfragen
          </ButtonLink>
        </div>

        {/* Burger (Mobile) */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-mute transition-colors hover:bg-card hover:text-ink md:hidden"
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
          "overflow-hidden border-edge-soft transition-all duration-200 md:hidden",
          open ? "max-h-96 border-t" : "max-h-0"
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Mobile Navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2.5 text-sm text-mute transition-colors hover:bg-card hover:text-ink"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="rounded-lg px-3 py-2.5 text-sm text-faint transition-colors hover:bg-card hover:text-mute"
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
