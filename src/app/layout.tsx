import type { Metadata, Viewport } from "next";
import { config } from "@/lib/config";
import "@fontsource-variable/inter/index.css";
import "@fontsource-variable/space-grotesk/index.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(config.baseUrl),
  title: {
    default: `${config.brandName} — ${config.claim}`,
    template: `%s | ${config.brandName}`,
  },
  description:
    "1:1 Nachhilfe vor Ort in der ganzen Schweiz — mit Schwerpunkt ICT & Informatik. Für Lernende, Sekundarschüler:innen, Gymnasiast:innen und Studierende. Geprüfte Tutor:innen, faire Preise, transparente Abrechnung.",
  openGraph: {
    type: "website",
    locale: "de_CH",
    siteName: config.brandName,
  },
};

export const viewport: Viewport = {
  themeColor: "#f6f7fb",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de-CH">
      <body className="min-h-screen bg-base text-ink antialiased">{children}</body>
    </html>
  );
}
