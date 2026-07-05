"use client";

// Umkreissuche für offene Pensen: Radius-Slider, Fach-/Stufen-Filter,
// Bewerbungs-Panel inline. Daten via GET /api/tutor/pensen (sanitisiert).

import { useCallback, useEffect, useRef, useState } from "react";
import {
  MapPin,
  Clock3,
  CalendarClock,
  Send,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { LEVELS } from "@/lib/subjects";
import { chf } from "@/lib/format";
import {
  Card,
  CardBody,
  Badge,
  Button,
  ButtonLink,
  Select,
  Textarea,
  EmptyState,
  cn,
} from "@/components/ui";

type FeedItem = {
  id: string;
  subject: string;
  subjectName: string;
  level: string;
  levelName: string;
  plz: string;
  city: string;
  canton: string | null;
  distanceKm: number | null;
  description: string;
  lessonsPerWeek: number;
  preferredTimes: string | null;
  rateTutor: number;
  createdAt: string;
  alreadyApplied: boolean;
};

type FeedResponse = {
  items: FeedItem[];
  missingLocation: boolean;
  radius: number;
};

const NEW_THRESHOLD_MS = 72 * 60 * 60 * 1000;

export function PensenFeed({ defaultRadius }: { defaultRadius: number }) {
  const [radius, setRadius] = useState(Math.min(100, Math.max(5, defaultRadius)));
  const [onlyMine, setOnlyMine] = useState(false);
  const [level, setLevel] = useState("");
  const [items, setItems] = useState<FeedItem[]>([]);
  const [missingLocation, setMissingLocation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Bewerbungs-Panel
  const [applyId, setApplyId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);

  const requestSeq = useRef(0);

  const load = useCallback(async () => {
    const seq = ++requestSeq.current;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        radius: String(radius),
        onlyMine: onlyMine ? "1" : "0",
        level,
      });
      const res = await fetch(`/api/tutor/pensen?${params.toString()}`);
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Pensen konnten nicht geladen werden.");
      }
      const data = (await res.json()) as FeedResponse;
      if (seq !== requestSeq.current) return; // veraltete Antwort verwerfen
      setItems(data.items);
      setMissingLocation(data.missingLocation);
    } catch (e) {
      if (seq !== requestSeq.current) return;
      setError(e instanceof Error ? e.message : "Unbekannter Fehler");
    } finally {
      if (seq === requestSeq.current) setLoading(false);
    }
  }, [radius, onlyMine, level]);

  useEffect(() => {
    const t = setTimeout(() => {
      void load();
    }, 250);
    return () => clearTimeout(t);
  }, [load]);

  function openApplyPanel(id: string) {
    setApplyId((current) => (current === id ? null : id));
    setMessage("");
    setApplyError(null);
  }

  async function submitApplication(pensumId: string) {
    setSubmitting(true);
    setApplyError(null);
    try {
      const res = await fetch("/api/tutor/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pensumId, message }),
      });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) {
        if (res.status === 409) {
          // Bereits beworben / nicht mehr offen — Zustand aktualisieren.
          setItems((prev) =>
            prev.map((p) => (p.id === pensumId ? { ...p, alreadyApplied: true } : p))
          );
          setApplyId(null);
        }
        throw new Error(data?.error ?? "Bewerbung fehlgeschlagen.");
      }
      setItems((prev) =>
        prev.map((p) => (p.id === pensumId ? { ...p, alreadyApplied: true } : p))
      );
      setApplyId(null);
      setMessage("");
    } catch (e) {
      setApplyError(e instanceof Error ? e.message : "Unbekannter Fehler");
    } finally {
      setSubmitting(false);
    }
  }

  const now = Date.now();

  return (
    <div>
      {/* Filterleiste */}
      <Card className="mb-6">
        <CardBody className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs font-medium text-mute">Umkreis</span>
              <span className="rounded-md bg-accent-soft px-2 py-0.5 text-xs font-semibold tabular-nums text-accent">
                {radius} km
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={100}
              step={1}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full accent-accent"
              aria-label="Suchradius in Kilometern"
            />
            <div className="mt-0.5 flex justify-between text-[10px] text-faint">
              <span>5 km</span>
              <span>100 km</span>
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-edge bg-surface px-3 py-2 text-sm text-mute transition-colors hover:border-accent/40 hover:text-ink">
            <input
              type="checkbox"
              checked={onlyMine}
              onChange={(e) => setOnlyMine(e.target.checked)}
              className="accent-accent"
            />
            Nur meine Fächer
          </label>

          <div className="w-full lg:w-56">
            <span className="mb-1.5 block text-xs font-medium text-mute">Stufe</span>
            <Select value={level} onChange={(e) => setLevel(e.target.value)} aria-label="Stufe">
              <option value="">Alle Stufen</option>
              {LEVELS.map((l) => (
                <option key={l.slug} value={l.slug}>
                  {l.name}
                </option>
              ))}
            </Select>
          </div>

          <Badge tone="accent" className="self-start whitespace-nowrap lg:self-center lg:mb-2">
            {loading ? "…" : `${items.length} ${items.length === 1 ? "Ergebnis" : "Ergebnisse"}`}
          </Badge>
        </CardBody>
      </Card>

      {/* Zustände */}
      {error ? (
        <Card className="border-danger/30">
          <CardBody className="flex items-center gap-3 text-sm text-danger">
            <AlertCircle size={16} />
            {error}
          </CardBody>
        </Card>
      ) : missingLocation ? (
        <EmptyState
          title="Kein Standort hinterlegt"
          description="Hinterlege deine PLZ im Profil, damit wir Pensen in deinem Umkreis finden können."
          action={<ButtonLink href="/tutor/profil">Profil vervollständigen</ButtonLink>}
        />
      ) : loading && items.length === 0 ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-mute">
          <Loader2 size={16} className="animate-spin text-accent" />
          Pensen werden geladen…
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="Keine offenen Pensen gefunden"
          description="Tipp: Erhöhe den Radius oder entferne Filter, um mehr Anfragen zu sehen."
          action={
            radius < 100 ? (
              <Button variant="secondary" size="sm" onClick={() => setRadius(Math.min(100, radius + 20))}>
                Radius auf {Math.min(100, radius + 20)} km erhöhen
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className={cn("grid gap-4 md:grid-cols-2", loading && "opacity-60")}>
          {items.map((item) => {
            const isNew = now - new Date(item.createdAt).getTime() < NEW_THRESHOLD_MS;
            const panelOpen = applyId === item.id;
            return (
              <Card key={item.id} className="flex flex-col transition-colors hover:bg-card-hover">
                <CardBody className="flex flex-1 flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="accent">{item.subjectName}</Badge>
                    <Badge tone="teal">{item.levelName}</Badge>
                    {isNew ? (
                      <Badge tone="ok">
                        <Sparkles size={11} />
                        Neu
                      </Badge>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-mute">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={13} className="text-faint" />
                      {item.plz} {item.city}
                      {item.canton ? ` (${item.canton})` : ""}
                    </span>
                    {item.distanceKm != null ? (
                      <span className="font-medium text-accent2">
                        {item.distanceKm.toLocaleString("de-CH", {
                          minimumFractionDigits: 1,
                          maximumFractionDigits: 1,
                        })}{" "}
                        km
                      </span>
                    ) : (
                      <span className="text-faint">Distanz unbekannt</span>
                    )}
                  </div>

                  <p className="line-clamp-3 text-sm leading-relaxed text-mute">
                    {item.description}
                  </p>

                  <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-edge-soft pt-3 text-xs text-mute">
                    <span className="text-sm font-semibold text-ink">
                      {chf(item.rateTutor)}
                      <span className="text-xs font-normal text-faint">/h</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock3 size={13} className="text-faint" />
                      {item.lessonsPerWeek}×/Woche
                    </span>
                    {item.preferredTimes ? (
                      <span className="inline-flex items-center gap-1">
                        <CalendarClock size={13} className="text-faint" />
                        {item.preferredTimes}
                      </span>
                    ) : null}
                  </div>

                  <div>
                    {item.alreadyApplied ? (
                      <Badge tone="ok">
                        <CheckCircle2 size={12} />
                        Beworben
                      </Badge>
                    ) : (
                      <Button
                        variant={panelOpen ? "secondary" : "primary"}
                        size="sm"
                        onClick={() => openApplyPanel(item.id)}
                      >
                        <Send size={14} />
                        {panelOpen ? "Abbrechen" : "Bewerben"}
                      </Button>
                    )}
                  </div>

                  {panelOpen && !item.alreadyApplied ? (
                    <div className="rounded-lg border border-edge bg-surface p-3">
                      <p className="mb-2 text-xs font-medium text-mute">
                        Motivations-Nachricht an Lernova
                      </p>
                      <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Warum passt du zu diesem Pensum? (Erfahrung, Verfügbarkeit, Bezug zum Fach …)"
                        maxLength={2000}
                        disabled={submitting}
                      />
                      {applyError ? (
                        <p className="mt-2 flex items-center gap-1.5 text-xs text-danger">
                          <AlertCircle size={13} />
                          {applyError}
                        </p>
                      ) : null}
                      <div className="mt-3 flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setApplyId(null)}
                          disabled={submitting}
                        >
                          Abbrechen
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => void submitApplication(item.id)}
                          disabled={submitting || message.trim().length < 10}
                        >
                          {submitting ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Send size={14} />
                          )}
                          Bewerbung senden
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
