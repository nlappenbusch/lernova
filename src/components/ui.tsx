// Lernova UI-Kit — dark-first, shadcn-inspiriert, ohne Client-Hooks
// (in Server- und Client-Komponenten verwendbar).

import Link from "next/link";
import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/* ---------- Buttons ---------- */

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-deep shadow-sm shadow-accent/25 hover:shadow-md hover:shadow-accent/25 hover:-translate-y-px",
  secondary: "bg-card border border-edge text-ink shadow-sm hover:bg-card-hover hover:border-accent/40",
  ghost: "text-mute hover:text-ink hover:bg-surface",
  danger: "bg-danger/10 border border-danger/25 text-danger hover:bg-danger/15",
  outline: "border border-edge bg-card text-ink hover:border-accent/50 hover:bg-accent-soft/40",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "text-xs px-3 py-1.5",
  md: "text-sm px-4 py-2",
  lg: "text-base px-6 py-3",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return (
    <button
      className={cn(buttonBase, buttonVariants[variant], buttonSizes[size], className)}
      {...props}
    />
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(buttonBase, buttonVariants[variant], buttonSizes[size], className)}
    >
      {children}
    </Link>
  );
}

/* ---------- Card ---------- */

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("rounded-xl border border-edge-soft bg-card shadow-card", className)}>
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4 border-b border-edge-soft px-5 py-4", className)}>
      <div>
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        {subtitle ? <p className="mt-0.5 text-xs text-mute">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function CardBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("px-5 py-4", className)}>{children}</div>;
}

/* ---------- Form ---------- */

const inputBase =
  "w-full rounded-lg border border-edge bg-card px-3 py-2 text-sm text-ink shadow-sm placeholder:text-faint transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50 disabled:bg-surface";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(inputBase, className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(inputBase, "min-h-[100px] leading-relaxed", className)} {...props} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(inputBase, "appearance-none pr-8", className)} {...props}>
      {children}
    </select>
  );
}

export function Label({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-medium text-mute">
      {children}
    </label>
  );
}

export function Field({
  label,
  children,
  hint,
  className,
}: {
  label: ReactNode;
  children: ReactNode;
  hint?: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      {children}
      {hint ? <p className="mt-1 text-[11px] text-faint">{hint}</p> : null}
    </div>
  );
}

/* ---------- Badge ---------- */

type BadgeTone = "default" | "accent" | "ok" | "warn" | "danger" | "teal";

const badgeTones: Record<BadgeTone, string> = {
  default: "bg-surface text-mute border border-edge-soft",
  accent: "bg-accent-soft text-accent-deep",
  ok: "bg-ok/10 text-ok",
  warn: "bg-warn/10 text-warn",
  danger: "bg-danger/10 text-danger",
  teal: "bg-accent2/10 text-accent2",
};

export function Badge({
  tone = "default",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium",
        badgeTones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

/* ---------- Status-Badges (Domain) ---------- */

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; tone: BadgeTone }> = {
    OPEN: { label: "Offen", tone: "accent" },
    MATCHED: { label: "Vermittelt", tone: "ok" },
    CLOSED: { label: "Abgeschlossen", tone: "default" },
    CANCELLED: { label: "Storniert", tone: "danger" },
    PENDING: { label: "Ausstehend", tone: "warn" },
    ACCEPTED: { label: "Angenommen", tone: "ok" },
    REJECTED: { label: "Abgelehnt", tone: "danger" },
    WITHDRAWN: { label: "Zurückgezogen", tone: "default" },
    ACTIVE: { label: "Aktiv", tone: "ok" },
    ENDED: { label: "Beendet", tone: "default" },
    PAID: { label: "Bezahlt", tone: "ok" },
    // Lead-CRM-Pipeline
    NEW: { label: "Neu", tone: "accent" },
    CONTACTED: { label: "Kontaktiert", tone: "teal" },
    QUALIFIED: { label: "Qualifiziert", tone: "warn" },
    PUBLISHED: { label: "Ausgeschrieben", tone: "accent" },
    LOST: { label: "Verloren", tone: "danger" },
  };
  const entry = map[status] ?? { label: status, tone: "default" as BadgeTone };
  return <Badge tone={entry.tone}>{entry.label}</Badge>;
}

/* ---------- Table ---------- */

export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-x-auto rounded-xl border border-edge-soft bg-card shadow-card", className)}>
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function THead({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-surface text-left text-[11px] uppercase tracking-wider text-faint">
      {children}
    </thead>
  );
}

export function TH({ children, className }: { children?: ReactNode; className?: string }) {
  return <th className={cn("px-4 py-3 font-medium", className)}>{children}</th>;
}

export function TBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-edge-soft">{children}</tbody>;
}

export function TR({ children, className }: { children: ReactNode; className?: string }) {
  return <tr className={cn("bg-card transition-colors hover:bg-card-hover", className)}>{children}</tr>;
}

export function TD({ children, className }: { children?: ReactNode; className?: string }) {
  return <td className={cn("px-4 py-3 text-mute", className)}>{children}</td>;
}

/* ---------- Misc ---------- */

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-xl font-bold tracking-tight text-ink">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-mute">{subtitle}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: "accent" | "ok" | "warn" | "danger";
}) {
  const toneClass =
    tone === "ok"
      ? "text-ok"
      : tone === "warn"
        ? "text-warn"
        : tone === "danger"
          ? "text-danger"
          : tone === "accent"
            ? "text-accent"
            : "text-ink";
  return (
    <Card className="px-5 py-4">
      <p className="text-[11px] font-medium uppercase tracking-wider text-faint">{label}</p>
      <p className={cn("mt-1 text-2xl font-bold tabular-nums", toneClass)}>{value}</p>
      {hint ? <p className="mt-0.5 text-xs text-mute">{hint}</p> : null}
    </Card>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-edge px-6 py-14 text-center">
      <p className="text-sm font-medium text-ink">{title}</p>
      {description ? <p className="mt-1 max-w-sm text-xs text-mute">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function Divider({ className }: { className?: string }) {
  return <hr className={cn("border-edge-soft", className)} />;
}
