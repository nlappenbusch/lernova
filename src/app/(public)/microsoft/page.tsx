import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  BrainCircuit,
  BriefcaseBusiness,
  CloudCog,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ButtonLink, Card } from "@/components/ui";
import { MICROSOFT_OFFERS } from "@/lib/microsoft-offers";

export const metadata: Metadata = {
  title: "Microsoft Schulungen & Zertifizierungen | Lernova",
  description:
    "Microsoft 365, Endpoint Administrator, Security und moderne IT-Weiterbildung für Unternehmen, Teams und Mitarbeitende.",
  alternates: { canonical: "/microsoft" },
};

const CERT_TRACKS = MICROSOFT_OFFERS.filter((offer) => offer.category === "cert");
const SPECIAL_TOPICS = MICROSOFT_OFFERS.filter((offer) => offer.category === "modern");
const AUDIT_OFFERS = MICROSOFT_OFFERS.filter((offer) => offer.category === "security");

const ICON_BY_CATEGORY = {
  cert: BriefcaseBusiness,
  modern: CloudCog,
  security: ShieldCheck,
};

export default function MicrosoftPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Microsoft &amp; IT-Transformation</p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">
          Microsoft-Schulungen für reale Betriebsanforderungen.
        </h1>
        <p className="mt-5 text-base leading-relaxed text-mute sm:text-lg">
          Wir gliedern unser Angebot in drei klare Bereiche: Microsoft-Schulungen, moderne IT-Themen
          und Security-/Audit-Services. So bleibt schnell erkennbar, was zu Zertifizierung, was zu
          Infrastruktur und was zu Governance, Risiken und Sicherheit gehört.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="rounded-full border border-accent/20 bg-accent-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">
            1. Microsoft-Schulungen
          </span>
          <span className="rounded-full border border-edge bg-card px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-faint">
            2. Moderne IT &amp; AI
          </span>
          <span className="rounded-full border border-edge bg-card px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-faint">
            3. Security &amp; Audit
          </span>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/anfrage" size="lg">
            Microsoft-Angebot anfragen
            <ArrowRight className="h-4 w-4" aria-hidden />
          </ButtonLink>
          <ButtonLink href="/weiterbildung" variant="outline" size="lg">
            Zur Weiterbildung
          </ButtonLink>
        </div>
      </div>

      <section className="mt-12">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">Bereich 1</p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">
              Microsoft-Schulungen &amp; Zertifizierungen
            </h2>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {CERT_TRACKS.map(({ slug, title, summary, badge }) => {
            const Icon = ICON_BY_CATEGORY.cert;

            return (
              <Link key={slug} href={`/microsoft/${slug}`} className="group block h-full">
                <Card className="h-full p-6 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-accent/30 group-hover:shadow-card-lg">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft">
                      <Icon className="h-5 w-5 text-accent" aria-hidden />
                    </div>
                    <span className="rounded-full border border-accent/20 bg-accent-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">
                      {badge}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-bold tracking-tight text-ink">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-mute">{summary}</p>
                  <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                    Mehr erfahren
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-16">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">Bereich 2</p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">
            Moderne IT-Themen &amp; Infrastruktur
          </h2>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {SPECIAL_TOPICS.map(({ slug, title, summary }) => {
            const Icon = ICON_BY_CATEGORY.modern;

            return (
              <Link key={slug} href={`/microsoft/${slug}`} className="group block h-full">
                <Card className="h-full p-6 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-accent/30 group-hover:shadow-card-lg">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft">
                    <Icon className="h-5 w-5 text-accent" aria-hidden />
                  </div>
                  <h3 className="mt-4 text-xl font-bold tracking-tight text-ink">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-mute">{summary}</p>
                  <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                    Mehr erfahren
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-edge-soft bg-card p-6 shadow-card sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft">
            <ShieldCheck className="h-5 w-5 text-accent" aria-hidden />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">Bereich 3</p>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink">
              Security, Audit &amp; Handlungsklärung
            </h2>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {AUDIT_OFFERS.map(({ slug, title, summary }) => {
            const Icon = ICON_BY_CATEGORY.security;

            return (
              <Link key={slug} href={`/microsoft/${slug}`} className="group block h-full">
                <Card className="h-full p-5 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-accent/30 group-hover:shadow-card-lg">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft">
                    <Icon className="h-4 w-4 text-accent" aria-hidden />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-ink">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mute">{summary}</p>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                    Mehr erfahren
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 rounded-xl border border-edge-soft bg-surface p-5">
          <h3 className="text-lg font-bold text-ink">Unser Vorgehen</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-faint">1. Analyse</p>
              <p className="mt-2 text-sm leading-relaxed text-mute">
                Bestandsaufnahme der aktuellen IT-Umgebung, Rechte, Workflows und Risiko-Exposure.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-faint">2. Workshop</p>
              <p className="mt-2 text-sm leading-relaxed text-mute">
                Sensibilisierung der Verantwortlichen, Diskussion realer Gefährdungen und Priorisierung.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-faint">3. Umsetzung</p>
              <p className="mt-2 text-sm leading-relaxed text-mute">
                Konkreter Maßnahmenplan mit Rollen, Verantwortlichkeiten und klaren nächsten Schritten.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-14 text-center">
        <Link
          href="/anfrage"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-card-lg"
        >
          Microsoft-Programm anfragen
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
