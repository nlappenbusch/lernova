import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, BriefcaseBusiness, CircleCheck, ShieldCheck, Sparkles } from "lucide-react";
import { ButtonLink, Card } from "@/components/ui";
import { MICROSOFT_OFFERS, MICROSOFT_OFFER_MAP } from "@/lib/microsoft-offers";

export function generateStaticParams() {
  return MICROSOFT_OFFERS.map((offer) => ({ slug: offer.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Metadata {
  return {
    title: `Microsoft Angebot | Lernova`,
    description: "Weiterführende Inhalte und Angebotserklärung für Microsoft-Schulungen, Security und moderne IT-Workshops.",
  };
}

export default async function MicrosoftOfferPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const offer = MICROSOFT_OFFER_MAP.get(slug);

  if (!offer) notFound();

  const relatedOffers = MICROSOFT_OFFERS.filter((item) => item.category === offer.category && item.slug !== offer.slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-faint">
        <Link href="/microsoft" className="transition-colors hover:text-mute">
          Microsoft
        </Link>
        <ArrowRight className="h-3 w-3" aria-hidden />
        <span className="text-mute">{offer.title}</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">{offer.badge ?? "Microsoft Angebot"}</p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">{offer.title}</h1>
        <p className="mt-5 text-base leading-relaxed text-mute sm:text-lg">{offer.summary}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          <span className="rounded-full border border-accent/20 bg-accent-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">
            {offer.category === "cert" ? "Microsoft-Schulung" : offer.category === "modern" ? "Moderne IT" : "Security & Audit"}
          </span>
          <span className="rounded-full border border-edge bg-card px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-faint">
            {offer.audience}
          </span>
          <span className="rounded-full border border-edge bg-card px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-faint">
            {offer.format}
          </span>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/anfrage" size="lg">
            Angebot anfragen
            <ArrowRight className="h-4 w-4" aria-hidden />
          </ButtonLink>
          <ButtonLink href="/microsoft" variant="outline" size="lg">
            Zurück zur Übersicht
          </ButtonLink>
        </div>
      </div>

      <section className="mt-12 grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft">
            <BookOpen className="h-4 w-4 text-accent" aria-hidden />
          </div>
          <h2 className="mt-4 text-lg font-bold text-ink">Was du lernst</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-mute">
            {offer.learningGoals.map((item) => (
              <li key={item} className="flex gap-2">
                <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-ok" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft">
            <BriefcaseBusiness className="h-4 w-4 text-accent" aria-hidden />
          </div>
          <h2 className="mt-4 text-lg font-bold text-ink">Ergebnis</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-mute">
            {offer.outcomes.map((item) => (
              <li key={item} className="flex gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft">
            <ShieldCheck className="h-4 w-4 text-accent" aria-hidden />
          </div>
          <h2 className="mt-4 text-lg font-bold text-ink">Warum genau dieses Format?</h2>
          <p className="mt-3 text-sm leading-relaxed text-mute">{offer.nextStep}</p>
        </Card>
      </section>

      <section className="mt-14 rounded-2xl border border-edge-soft bg-card p-6 shadow-card sm:p-8">
        <h2 className="font-display text-2xl font-bold tracking-tight text-ink">So arbeiten wir in der Praxis</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-faint">1. Analyse</p>
            <p className="mt-2 text-sm leading-relaxed text-mute">
              Wir schauen auf die reale Umgebung, Prozesse, Verantwortlichkeiten und den konkreten Kontext der Organisation.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-faint">2. Coaching</p>
            <p className="mt-2 text-sm leading-relaxed text-mute">
              Inhalte werden mit Beispielen, echten Workflows und klaren Aufgaben auf den operativen Alltag heruntergebrochen.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-faint">3. Umsetzung</p>
            <p className="mt-2 text-sm leading-relaxed text-mute">
              Anschließend entsteht ein klarer Fahrplan mit Handlungsempfehlungen, Prioritäten und nächsten Schritten.
            </p>
          </div>
        </div>
      </section>

      {relatedOffers.length > 0 ? (
        <section className="mt-14">
          <h2 className="font-display text-xl font-bold tracking-tight text-ink">Weitere Angebote in diesem Bereich</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {relatedOffers.map((item) => (
              <Link key={item.slug} href={`/microsoft/${item.slug}`} className="group block h-full">
                <Card className="h-full p-5 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-accent/30 group-hover:shadow-card-lg">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full border border-accent/20 bg-accent-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">
                      {item.badge ?? "Angebot"}
                    </span>
                    <ArrowRight className="h-4 w-4 text-faint transition group-hover:text-accent" aria-hidden />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mute">{item.summary}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-14 text-center">
        <ButtonLink href="/anfrage" size="lg">
          Jetzt anfragen
          <ArrowRight className="h-4 w-4" aria-hidden />
        </ButtonLink>
      </div>
    </div>
  );
}
