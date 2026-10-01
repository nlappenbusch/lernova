import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  CircleCheck,
  Lightbulb,
  NotebookPen,
  Target,
} from "lucide-react";
import { ButtonLink, Card } from "@/components/ui";
import { SUBJECTS, buildModuleNarrative, getModuleBySlug, getSubject, moduleSlug } from "@/lib/subjects";
import { SubjectIcon } from "@/components/public/SubjectIcon";

type Params = { params: Promise<{ fach: string; modul: string }> };

export function generateStaticParams() {
  return SUBJECTS.flatMap((subject) =>
    (subject.modules ?? []).map((module) => ({
      fach: subject.slug,
      modul: moduleSlug(module.title),
    }))
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { fach, modul } = await params;
  const subject = getSubject(fach);
  if (!subject) return {};
  const module = getModuleBySlug(subject, modul);
  if (!module) return {};

  return {
    title: `${module.title} | ${subject.name} | Lernova`,
    description: `${module.title}: ${module.focus} Praxisnah, modulgenau und verständlich erklärt für Lernende, Prüfungen und berufliche Weiterbildung.`,
    alternates: { canonical: `/nachhilfe/${subject.slug}/module/${modul}` },
  };
}

export default async function ModuleDetailPage({ params }: Params) {
  const { fach, modul } = await params;
  const subject = getSubject(fach);
  if (!subject) notFound();

  const module = getModuleBySlug(subject, modul);
  if (!module) notFound();

  const { baseSummary, learningGoals, practicalExamples, prerequisites, bestWayToLearn, support } =
    buildModuleNarrative(module);
  const otherModules = (subject.modules ?? []).filter((entry) => entry.code !== module.code);

  return (
    <>
      <section className="hero-glow border-b border-edge-soft">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-faint">
            <Link href="/nachhilfe" className="transition-colors hover:text-mute">
              Nachhilfe
            </Link>
            <ChevronRight className="h-3 w-3" aria-hidden />
            <Link href={`/nachhilfe/${subject.slug}`} className="transition-colors hover:text-mute">
              {subject.name}
            </Link>
            <ChevronRight className="h-3 w-3" aria-hidden />
            <span className="text-mute">{module.title}</span>
          </nav>

          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent-soft">
              <SubjectIcon slug={subject.slug} className="h-7 w-7 text-accent" />
            </div>

            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
                  {module.code}
                </span>
                <span className="rounded-full border border-edge bg-card px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-faint">
                  {module.year}
                </span>
              </div>
              <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                {module.title}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-mute">{baseSummary}</p>
              <p className="mt-3 text-base leading-relaxed text-mute">{module.focus}</p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={`/anfrage?fach=${subject.slug}&modul=${module.code}`} size="lg">
                  Zu diesem Modul anfragen
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </ButtonLink>
                <Link
                  href={`/nachhilfe/${subject.slug}`}
                  className="inline-flex items-center justify-center rounded-full border border-edge bg-card px-5 py-3 text-sm font-medium text-ink shadow-card transition hover:-translate-y-0.5 hover:border-accent/30 hover:text-accent"
                >
                  Zur Fachseite
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
        <section className="mt-12 grid gap-4 md:grid-cols-3">
          <Card className="p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft">
              <BookOpen className="h-4 w-4 text-accent" aria-hidden />
            </div>
            <h2 className="mt-4 text-lg font-bold text-ink">Worum geht es?</h2>
            <p className="mt-2 text-sm leading-relaxed text-mute">{baseSummary}</p>
          </Card>

          <Card className="p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft">
              <Target className="h-4 w-4 text-accent" aria-hidden />
            </div>
            <h2 className="mt-4 text-lg font-bold text-ink">Zielsetzung</h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-mute">
              {learningGoals.map((goal) => (
                <li key={goal} className="flex gap-2">
                  <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-ok" aria-hidden />
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft">
              <Lightbulb className="h-4 w-4 text-accent" aria-hidden />
            </div>
            <h2 className="mt-4 text-lg font-bold text-ink">Praxisbezug</h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-mute">
              {practicalExamples.map((example) => (
                <li key={example} className="flex gap-2">
                  <NotebookPen className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                  <span>{example}</span>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        <section className="mt-12 grid gap-4 md:grid-cols-3">
          <Card className="p-5">
            <h2 className="text-lg font-bold text-ink">Was du können solltest</h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-mute">
              {prerequisites.map((item) => (
                <li key={item} className="flex gap-2">
                  <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-ok" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5">
            <h2 className="text-lg font-bold text-ink">Wie du es am besten lernst</h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-mute">
              {bestWayToLearn.map((item) => (
                <li key={item} className="flex gap-2">
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5">
            <h2 className="text-lg font-bold text-ink">Wie wir dich dabei unterstützen</h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-mute">
              {support.map((item) => (
                <li key={item} className="flex gap-2">
                  <NotebookPen className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        <section className="mt-14 rounded-2xl border border-edge-soft bg-card p-6 shadow-card sm:p-8">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">Warum dieses Modul wichtig ist</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-mute">
            {module.focus} In der Praxis ist das genau der Punkt, an dem Lernende oft Schwierigkeiten haben: Die Theorie ist klar, aber die Umsetzung braucht Struktur, Wiederholung und gezielten Übungsdruck. Genau an diesem Punkt unterstützen wir mit modulgenauer Begleitung, klaren Beispielen und Prüfungsvorbereitung.
          </p>
        </section>

        {otherModules.length > 0 ? (
          <section className="mt-14">
            <h2 className="font-display text-xl font-bold tracking-tight text-ink">Weitere Module im Lernpfad</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {otherModules.map((entry) => (
                <Link
                  key={entry.code}
                  href={`/nachhilfe/${subject.slug}/module/${moduleSlug(entry.title)}`}
                  className="group block h-full"
                >
                  <Card className="h-full p-5 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-accent/30 group-hover:shadow-card-lg">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
                        {entry.code}
                      </span>
                      <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-faint">
                        {entry.year}
                      </span>
                    </div>
                    <h3 className="mt-3 text-base font-semibold text-ink">{entry.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-mute">{entry.focus}</p>
                    <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                      Mehr erfahren
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <div className="mt-14 text-center">
          <ButtonLink href={`/anfrage?fach=${subject.slug}&modul=${module.code}`} size="lg">
            Angebot für dieses Modul anfragen
            <ArrowRight className="h-4 w-4" aria-hidden />
          </ButtonLink>
        </div>
      </div>
    </>
  );
}
