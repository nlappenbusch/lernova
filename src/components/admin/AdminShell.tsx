"use client";

// Admin-Shell: Sidebar-Navigation (Desktop fix, Mobile einklappbar) + Logout.

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Inbox,
  ClipboardList,
  FileText,
  Clock,
  CalendarCheck,
  Receipt,
  Bell,
  Wallet,
  Users,
  Mail,
  LogOut,
  Menu,
  X,
  GraduationCap,
} from "lucide-react";
import { Badge, cn } from "@/components/ui";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/pensen", label: "Pensen", icon: Inbox },
  { href: "/admin/bewerbungen", label: "Bewerbungen", icon: ClipboardList },
  { href: "/admin/vertraege", label: "Verträge", icon: FileText },
  { href: "/admin/stunden", label: "Stunden", icon: Clock },
  { href: "/admin/monatsabschluss", label: "Monatsabschluss", icon: CalendarCheck },
  { href: "/admin/rechnungen", label: "Rechnungen", icon: Receipt },
  { href: "/admin/mahnwesen", label: "Mahnwesen", icon: Bell },
  { href: "/admin/auszahlungen", label: "Auszahlungen", icon: Wallet },
  { href: "/admin/tutoren", label: "Tutor:innen", icon: Users },
  { href: "/admin/emails", label: "E-Mail-Log", icon: Mail },
];

export function AdminShell({ userName, children }: { userName: string; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Cookie-Löschung schlug fehl — trotzdem zur Login-Seite.
    }
    router.push("/login");
    router.refresh();
  }

  const brand = (
    <span className="flex items-center gap-2">
      <GraduationCap size={20} className="text-accent" />
      <span className="font-bold tracking-tight text-ink">Lernova</span>
      <Badge tone="accent">Admin</Badge>
    </span>
  );

  return (
    <div className="min-h-screen lg:flex">
      {/* Mobile-Topbar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-edge-soft bg-base/90 px-4 py-3 backdrop-blur lg:hidden">
        <Link href="/admin">{brand}</Link>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="rounded-lg border border-edge p-2 text-mute transition-colors hover:text-ink"
          aria-label="Navigation öffnen"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {/* Mobile-Backdrop */}
      {open ? (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      ) : null}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-edge-soft bg-surface transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="hidden items-center border-b border-edge-soft px-5 py-4 lg:flex">
          <Link href="/admin">{brand}</Link>
        </div>
        <div className="flex items-center justify-between border-b border-edge-soft px-5 py-4 lg:hidden">
          {brand}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-mute hover:text-ink"
            aria-label="Navigation schliessen"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {NAV.map((item) => {
            const active =
              item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-accent-soft font-medium text-ink"
                    : "text-mute hover:bg-card hover:text-ink"
                )}
              >
                <Icon size={16} className={active ? "text-accent" : "text-faint"} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-edge-soft px-4 py-3">
          <p className="truncate px-2 text-xs font-medium text-ink">{userName}</p>
          <button
            type="button"
            onClick={logout}
            disabled={loggingOut}
            className="mt-1.5 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-mute transition-colors hover:bg-card hover:text-ink disabled:opacity-50"
          >
            <LogOut size={14} />
            {loggingOut ? "Wird abgemeldet…" : "Abmelden"}
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 lg:px-8 lg:py-8">{children}</div>
      </main>
    </div>
  );
}
