"use client";

// Mehrstufiges Lead-Formular (/anfrage): 3 Schritte mit Fortschrittsanzeige,
// framer-motion-Slides, PLZ-Live-Lookup und Erfolgs-Screen.

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Check,
  CircleCheck,
  Handshake,
  LoaderCircle,
  Search,
  Send,
} from "lucide-react";
import { Button, ButtonLink, Field, Input, Select, Textarea, cn } from "@/components/ui";
import { ICT_SUBJECTS, LEVELS, SUBJECTS } from "@/lib/subjects";

type LeadFormProps = {
  initialSubject?: string;
  initialLevel?: string;
  initialPlz?: string;
  initialCity?: string;
};

type FormData = {
  subject: string;
  level: string;
  plz: string;
  city: string;
  lessonsPerWeek: "1" | "2" | "flexibel";
  preferredTimes: string;
  description: string;
  name: string;
  email: string;
  phone: string;
  street: string;
  privacy: boolean;
};

const STEPS = ["Fach & Stufe", "Bedarf & Ort", "Kontakt"] as const;

const SCHOOL_AND_BUSINESS = SUBJECTS.filter((s) => s.category !== "ict");

export function LeadForm({
  initialSubject = "",
  initialLevel = "",
  initialPlz = "",
  initialCity = "",
}: LeadFormProps) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<FormData>({
    subject: initialSubject,
    level: initialLevel,
    plz: initialPlz,
    city: initialCity,
    lessonsPerWeek: "1",
    preferredTimes: "",
    description: "",
    name: "",
    email: "",
    phone: "",
    street: "",
    privacy: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setData((d) => ({ ...d, [key]: value }));
    setError(null);
  }

  async function onPlzChange(value: string) {
    const plz = value.replace(/\D/g, "").slice(0, 4);
    set("plz", plz);
    if (plz.length === 4) {
      try {
        const res = await fetch(`/api/leads/plz?plz=${plz}`);
        if (res.ok) {
          const json: { city?: string | null } = await res.json();
          if (json.city) {
            setData((d) => ({ ...d, city: json.city as string }));
          }
        }
      } catch {
        // Lookup ist Komfort — Ort bleibt manuell editierbar.
      }
    }
  }

  function validateStep(current: number): string | null {
    if (current === 0) {
      if (!data.subject) return "Bitte wählen Sie ein Fach aus.";
      if (!data.level) return "Bitte wählen Sie eine Stufe aus.";
    }
    if (current === 1) {
      if (!/^\d{4}$/.test(data.plz)) return "Bitte geben Sie eine gültige 4-stellige PLZ ein.";
      if (data.city.trim().length < 2) return "Bitte geben Sie den Ort an.";
      if (data.description.trim().length < 10)
        return "Bitte beschreiben Sie kurz, wobei Unterstützung gebraucht wird (mind. 10 Zeichen).";
    }
    if (current === 2) {
      if (data.name.trim().length < 2) return "Bitte geben Sie Ihren Namen an.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim()))
        return "Bitte geben Sie eine gültige E-Mail-Adresse an.";
      if (!data.privacy) return "Bitte bestätigen Sie die Datenschutzerklärung.";
    }
    return null;
  }

  function next() {
    const problem = validateStep(step);
    if (problem) {
      setError(problem);
      return;
    }
    setDirection(1);
    setStep((s) => Math.min(s + 1, 2));
  }

  function back() {
    setError(null);
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function submit() {
    const problem = validateStep(2);
    if (problem) {
      setError(problem);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: data.subject,
          level: data.level,
          plz: data.plz,
          city: data.city.trim(),
          lessonsPerWeek: data.lessonsPerWeek,
          preferredTimes: data.preferredTimes.trim() || undefined,
          description: data.description.trim(),
          name: data.name.trim(),
          email: data.email.trim(),
          phone: data.phone.trim() || undefined,
          street: data.street.trim() || undefined,
          privacy: data.privacy,
        }),
      });
      const json: { ok?: boolean; error?: string } = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.");
        return;
      }
      setDone(true);
    } catch {
      setError("Verbindungsfehler — bitte versuchen Sie es in einem Moment erneut.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-xl border border-edge-soft bg-card p-8 text-center shadow-card-lg sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ok/10 ring-8 ring-ok/5">
          <CircleCheck className="h-8 w-8 text-ok" aria-hidden />
        </div>
        <h2 className="mt-6 font-display text-2xl font-bold tracking-tight text-ink">
          Anfrage eingegangen — vielen Dank!
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-mute">
          Wir melden uns innert 24 Stunden bei Ihnen. Eine Bestätigung ist unterwegs an{" "}
          <span className="font-medium text-ink">{data.email.trim()}</span>.
        </p>
        <div className="mx-auto mt-8 max-w-md space-y-3 text-left">
          {[
            {
              icon: Search,
              text: "Wir suchen geprüfte Tutor:innen in Ihrem Umkreis, die fachlich genau passen.",
            },
            {
              icon: Handshake,
              text: "Sie erhalten von uns einen konkreten Vorschlag — unverbindlich und kostenlos.",
            },
            {
              icon: CalendarClock,
              text: "Passt es für beide Seiten, vereinbaren Sie direkt die erste Lektion.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg border border-edge-soft bg-surface px-4 py-3"
            >
              <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
              <p className="text-sm text-mute">{item.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <ButtonLink href="/" variant="secondary">
            Zurück zur Startseite
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[28px] border border-edge-soft bg-white/80 p-3 shadow-card-lg backdrop-blur-sm">
      <div className="rounded-[22px] border border-edge-soft bg-card">
        <div className="border-b border-edge-soft px-5 pb-5 pt-5 sm:px-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-faint">
                Anfrageformular
              </p>
              <p className="mt-1 text-sm text-mute">Einfach, schnell und unverbindlich.</p>
            </div>
            <div className="rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[11px] font-medium text-violet-700">
              Schritt {step + 1}/{STEPS.length}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            {STEPS.map((label, i) => (
              <div key={label} className="flex flex-1 items-center gap-2">
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                    i < step
                      ? "bg-accent text-white"
                      : i === step
                        ? "bg-accent-soft text-accent-deep ring-1 ring-accent/40"
                        : "bg-surface text-faint"
                  )}
                >
                  {i < step ? <Check className="h-3.5 w-3.5" aria-hidden /> : i + 1}
                </span>
                <span
                  className={cn(
                    "hidden text-xs font-medium sm:block",
                    i === step ? "text-ink" : "text-faint"
                  )}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 h-1 overflow-hidden rounded-full bg-surface">
            <div
              className="h-full rounded-full bg-accent transition-all duration-300"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="overflow-hidden px-5 py-6 sm:px-6">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={step}
              initial={{ opacity: 0, x: direction * 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -32 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {step === 0 ? (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-semibold text-ink">Worum geht es?</h2>
                    <p className="mt-1 text-sm text-mute">
                      Wählen Sie das Fach und die passende Stufe — den Rest klären wir danach.
                    </p>
                  </div>
                  <Field label="Fach">
                    <Select
                      value={data.subject}
                      onChange={(e) => set("subject", e.target.value)}
                      aria-label="Fach"
                    >
                      <option value="">Bitte wählen …</option>
                      <optgroup label="Informatik & ICT">
                        {ICT_SUBJECTS.map((s) => (
                          <option key={s.slug} value={s.slug}>
                            {s.name}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Schule, KV & Wirtschaft">
                        {SCHOOL_AND_BUSINESS.map((s) => (
                          <option key={s.slug} value={s.slug}>
                            {s.name}
                          </option>
                        ))}
                      </optgroup>
                    </Select>
                  </Field>
                  <div>
                    <p className="mb-1.5 block text-xs font-medium text-mute">Stufe</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {LEVELS.map((l) => (
                        <button
                          key={l.slug}
                          type="button"
                          onClick={() => set("level", l.slug)}
                          className={cn(
                            "rounded-lg border px-4 py-3 text-left text-sm transition-all",
                            data.level === l.slug
                              ? "border-accent bg-accent-soft/60 text-ink"
                              : "border-edge bg-surface text-mute hover:border-accent/40 hover:text-ink"
                          )}
                        >
                          {l.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : step === 1 ? (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-semibold text-ink">Wo und wie oft?</h2>
                    <p className="mt-1 text-sm text-mute">
                      Der Unterricht findet bei Ihnen vor Ort statt — wir matchen im Umkreis.
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="PLZ" hint="4-stellige Schweizer Postleitzahl">
                      <Input
                        inputMode="numeric"
                        placeholder="8001"
                        value={data.plz}
                        onChange={(e) => void onPlzChange(e.target.value)}
                        maxLength={4}
                      />
                    </Field>
                    <Field label="Ort">
                      <Input
                        placeholder="Zürich"
                        value={data.city}
                        onChange={(e) => set("city", e.target.value)}
                        maxLength={80}
                      />
                    </Field>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Lektionen pro Woche">
                      <Select
                        value={data.lessonsPerWeek}
                        onChange={(e) =>
                          set("lessonsPerWeek", e.target.value as FormData["lessonsPerWeek"])
                        }
                      >
                        <option value="1">1 Lektion</option>
                        <option value="2">2 Lektionen</option>
                        <option value="flexibel">Flexibel / nach Bedarf</option>
                      </Select>
                    </Field>
                    <Field label="Wunschzeiten" hint="Optional — z. B. «Mi/Fr ab 17 Uhr, Sa vormittags»">
                      <Input
                        placeholder="z. B. Mittwoch ab 17 Uhr"
                        value={data.preferredTimes}
                        onChange={(e) => set("preferredTimes", e.target.value)}
                        maxLength={300}
                      />
                    </Field>
                  </div>
                  <Field
                    label="Was wird gebraucht?"
                    hint="Je konkreter, desto besser das Match — z. B. Klasse, Modul, Prüfungstermin, aktuelle Themen."
                  >
                    <Textarea
                      placeholder="z. B. Unsere Tochter (2. Lehrjahr Informatik EFZ) braucht Unterstützung im Modul 320 (OOP mit Java). Kompetenznachweis Ende Semester."
                      value={data.description}
                      onChange={(e) => set("description", e.target.value)}
                      maxLength={2000}
                      rows={5}
                    />
                  </Field>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-semibold text-ink">Wie erreichen wir Sie?</h2>
                    <p className="mt-1 text-sm text-mute">
                      Wir melden uns innert 24 Stunden mit einem konkreten Vorschlag.
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Name">
                      <Input
                        placeholder="Vor- und Nachname"
                        value={data.name}
                        onChange={(e) => set("name", e.target.value)}
                        maxLength={120}
                        autoComplete="name"
                      />
                    </Field>
                    <Field label="E-Mail">
                      <Input
                        type="email"
                        placeholder="name@beispiel.ch"
                        value={data.email}
                        onChange={(e) => set("email", e.target.value)}
                        maxLength={200}
                        autoComplete="email"
                      />
                    </Field>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Telefon (optional)">
                      <Input
                        type="tel"
                        placeholder="+41 79 000 00 00"
                        value={data.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        maxLength={40}
                        autoComplete="tel"
                      />
                    </Field>
                    <Field label="Strasse (optional)">
                      <Input
                        placeholder="Musterstrasse 1"
                        value={data.street}
                        onChange={(e) => set("street", e.target.value)}
                        maxLength={160}
                        autoComplete="street-address"
                      />
                    </Field>
                  </div>
                  <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-edge bg-surface px-4 py-3">
                    <input
                      type="checkbox"
                      checked={data.privacy}
                      onChange={(e) => set("privacy", e.target.checked)}
                      className="mt-0.5 h-4 w-4 accent-accent"
                    />
                    <span className="text-xs leading-relaxed text-mute">
                      Ich habe die{" "}
                      <Link href="/datenschutz" className="text-accent underline" target="_blank">
                        Datenschutzerklärung
                      </Link>{" "}
                      gelesen und bin einverstanden, dass Lernova meine Angaben zur Vermittlung
                      einer Nachhilfe-Lehrperson verwendet.
                    </span>
                  </label>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {error ? (
            <p className="mt-4 rounded-lg border border-danger/30 bg-danger/10 px-4 py-2.5 text-sm text-danger">
              {error}
            </p>
          ) : null}

          <div className="mt-6 flex items-center justify-between gap-3 border-t border-edge-soft pt-5">
            {step > 0 ? (
              <Button variant="ghost" type="button" onClick={back} disabled={submitting}>
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Zurück
              </Button>
            ) : (
              <span />
            )}
            {step < 2 ? (
              <Button type="button" onClick={next}>
                Weiter
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            ) : (
              <Button type="button" onClick={() => void submit()} disabled={submitting}>
                {submitting ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <Send className="h-4 w-4" aria-hidden />
                )}
                {submitting ? "Wird gesendet …" : "Anfrage absenden"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
