"use client";

// Tutor-Portal Shell: fixe Sidebar (Desktop), einklappbares Drawer (Mobile).

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  Send,
  FileSignature,
  Clock,
  Wallet,
  User,
  LogOut,
  Menu,
  X,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/components/ui";

const NAV = [
  { href: "/tutor", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tutor/pensen", label: "Offene Pensen", icon: MapPin },
  { href: "/tutor/bewerbungen", label: "Bewerbungen", icon: Send },
  { href: "/tutor/vertraege", label: "Verträge", icon: FileSignature },
  { href: "/tutor/stunden", label: "Stunden", icon: Clock },
  { href: "/tutor/abrechnung", label: "Abrechnung", icon: Wallet },
  { href: "/tutor/profil", label: "Profil", icon: User },
] as const;

export function TutorShell({
  userName,
  children,
}: {
  userName: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/login");
      router.refresh();
    }
  }

  function isActive(href: string): boolean {
    if (href === "/tutor") return pathname === "/tutor";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-edge-soft px-5 py-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft">
          <GraduationCap className="h-4.5 w-4.5 text-accent" size={18} />
        </span>
        <span className="text-base font-bold tracking-tight text-ink">
          Lernova
          <span className="ml-2 rounded-full bg-edge-soft px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-mute">
            Tutor
          </span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-accent-soft text-ink"
                  : "text-mute hover:bg-card hover:text-ink"
              )}
            >
              <Icon size={16} className={cn(active ? "text-accent" : "text-faint")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-edge-soft px-4 py-4">
        <p className="truncate text-sm font-medium text-ink" title={userName}>
          {userName}
        </p>
        <p className="text-xs text-faint">Tutor:in</p>
        <button
          type="button"
          onClick={logout}
          disabled={loggingOut}
          className="mt-3 flex w-full items-center gap-2 rounded-lg border border-edge px-3 py-2 text-xs font-medium text-mute transition-colors hover:border-danger/40 hover:text-danger disabled:opacity-50"
        >
          <LogOut size={14} />
          {loggingOut ? "Wird abgemeldet…" : "Abmelden"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-base">
      {/* Mobile Topbar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-edge-soft bg-surface/90 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2">
          <GraduationCap size={18} className="text-accent" />
          <span className="text-sm font-bold text-ink">Lernova Tutor</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Menü schliessen" : "Menü öffnen"}
          className="rounded-lg border border-edge p-2 text-mute hover:text-ink"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {/* Mobile Overlay */}
      {open ? (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r border-edge-soft bg-surface transition-transform duration-200 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebar}
      </aside>

      {/* Content */}
      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8 lg:py-8">{children}</div>
      </main>
    </div>
  );
}
