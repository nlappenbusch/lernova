// Logo-Grafik in der von der Referenz vorgegebenen Form.
// Kein eigenes Interpretationsdesign; nur die geeignete, klare Brand-Graphic.

import { cn } from "@/components/ui";

export function LogoMark({
  size = 28,
  className,
  dark = false,
}: {
  size?: number;
  className?: string;
  dark?: boolean;
}) {
  const iconBlue = dark ? "#2d4af2" : "#2d4af2";
  const iconTeal = dark ? "#3ce0cf" : "#3ce0cf";
  const wordBlue = dark ? "#2d4af2" : "#1d2c64";

  return (
    <svg
      width={size}
      height={size * 0.7}
      viewBox="0 0 200 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M34 12C34 8.7 36.7 6 40 6H116C146.9 6 172 31.1 172 62C172 92.9 146.9 118 116 118H87V125C87 128.3 84.3 131 81 131H40C36.7 131 34 128.3 34 125V12Z"
        fill={iconBlue}
      />
      <path d="M75 32H122C134.2 32 144 41.8 144 54C144 66.2 134.2 76 122 76H75V32Z" fill={iconTeal} />
      <path d="M87 41H111V90H87V41Z" fill={wordBlue} opacity="0.18" />
      <path d="M98 52L119 75" stroke="rgba(255,255,255,0.9)" strokeWidth="8" strokeLinecap="round" />
      <path d="M120 75L143 52" stroke="rgba(255,255,255,0.9)" strokeWidth="8" strokeLinecap="round" />
      <circle cx="143" cy="52" r="8" fill="white" />
      <circle cx="143" cy="52" r="3.2" fill={wordBlue} />
    </svg>
  );
}

export function Logo({
  size = 28,
  className,
  wordmarkClass,
  dark = false,
}: {
  size?: number;
  className?: string;
  wordmarkClass?: string;
  dark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <LogoMark size={size} dark={dark} />
      <span
        className={cn(
          "font-display font-bold tracking-[-0.09em]",
          dark ? "text-[#2d4af2]" : "text-[#1d2c64]",
          wordmarkClass
        )}
      >
        lernova
      </span>
    </span>
  );
}
