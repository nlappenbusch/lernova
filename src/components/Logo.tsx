// Lernova Logo — Marke: aufsteigender Lernpfad mit Wegpunkt (Umkreis-Matching
// + Fortschritt). Ueberall dieses Logo verwenden (Navbar, Footer, Shells, Login).

import { cn } from "@/components/ui";

export function LogoMark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="lernova-mark" x1="0" y1="32" x2="32" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4f46e5" />
          <stop offset="0.6" stopColor="#6d5ae8" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8.5" fill="url(#lernova-mark)" />
      {/* aufsteigender Lernpfad */}
      <path
        d="M7.5 23.5 L13 18 L17 21 L24 12.5"
        stroke="white"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Wegpunkt am Ziel */}
      <circle cx="24" cy="12.5" r="2.9" fill="white" />
      <circle cx="24" cy="12.5" r="1.15" fill="#7c3aed" />
      {/* Startpunkt */}
      <circle cx="7.5" cy="23.5" r="1.5" fill="white" fillOpacity="0.85" />
    </svg>
  );
}

export function Logo({
  size = 28,
  className,
  wordmarkClass,
}: {
  size?: number;
  className?: string;
  wordmarkClass?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark size={size} />
      <span
        className={cn(
          "font-display text-lg font-bold tracking-tight text-ink",
          wordmarkClass
        )}
      >
        lernova
      </span>
    </span>
  );
}
