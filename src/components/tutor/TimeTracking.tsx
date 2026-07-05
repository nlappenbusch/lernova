"use client";

// Time-Tracking: Monats-Navigation, Eintrags-Formular (mit Markdown-Preview),
// Eintrags-Liste mit Edit/Delete (nur bei offenem Monat), Summenzeile.

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  Loader2,
  Pencil,
  Trash2,
  Plus,
  AlertCircle,
  Eye,
} from "lucide-react";
import { chf, monthLabel, minutesLabel, previousMonth } from "@/lib/format";
import { roundTo5Rappen } from "@/lib/swiss";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Select,
  Input,
  Textarea,
  Field,
  Table,
  THead,
  TH,
  TBody,
  TR,
  TD,
  EmptyState,
  cn,
} from "@/components/ui";
import { Markdown } from "@/components/Markdown";

type ContractOption = { id: string; label: string; rateTutor: number };

type EntryDto = {
  id: string;
  contractId: string;
  contractLabel: string;
  date: string; // YYYY-MM-DD
  minutes: number;
  notes: string;
  rateTutor: number;
};

const DURATION_PRESETS = ["45", "60", "90", "120"] as const;

function formatDateCH(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

export function TimeTracking({
  year,
  month,
  closed,
  canNext,
  todayIso,
  defaultDate,
  contracts,
  entries,
}: {
  year: number;
  month: number;
  closed: boolean;
  canNext: boolean;
  todayIso: string;
  defaultDate: string;
  contracts: ContractOption[];
  entries: EntryDto[];
}) {
  const router = useRouter();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [contractId, setContractId] = useState(contracts[0]?.id ?? "");
  const [date, setDate] = useState(defaultDate);
  const [durationSel, setDurationSel] = useState<string>("60");
  const [customMinutes, setCustomMinutes] = useState("75");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const prev = previousMonth(year, month);
  const next = month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 };

  const totalMinutes = entries.reduce((sum, e) => sum + e.minutes, 0);
  const totalHonorar = roundTo5Rappen(
    entries.reduce((sum, e) => sum + Math.round((e.minutes * e.rateTutor) / 60), 0)
  );

  const minutes =
    durationSel === "custom" ? parseInt(customMinutes, 10) : parseInt(durationSel, 10);
  const minutesValid = Number.isFinite(minutes) && minutes >= 15 && minutes <= 480;

  function resetForm() {
    setEditingId(null);
    setContractId(contracts[0]?.id ?? "");
    setDate(defaultDate);
    setDurationSel("60");
    setCustomMinutes("75");
    setNotes("");
    setFormError(null);
  }

  function startEdit(entry: EntryDto) {
    setEditingId(entry.id);
    setContractId(entry.contractId);
    setDate(entry.date);
    if ((DURATION_PRESETS as readonly string[]).includes(String(entry.minutes))) {
      setDurationSel(String(entry.minutes));
    } else {
      setDurationSel("custom");
      setCustomMinutes(String(entry.minutes));
    }
    setNotes(entry.notes);
    setFormError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save() {
    if (!contractId) {
      setFormError("Bitte einen Vertrag wählen.");
      return;
    }
    if (!minutesValid) {
      setFormError("Dauer muss zwischen 15 und 480 Minuten liegen.");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      const url = editingId ? `/api/tutor/time-entries/${editingId}` : "/api/tutor/time-entries";
      const res = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractId, date, minutes, notes }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Speichern fehlgeschlagen.");
      }
      resetForm();
      router.refresh();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Unbekannter Fehler");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Eintrag wirklich löschen?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/tutor/time-entries/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Löschen fehlgeschlagen.");
      }
      if (editingId === id) resetForm();
      router.refresh();
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Unbekannter Fehler");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Monats-Navigation */}
      <Card>
        <CardBody className="flex items-center justify-between py-3">
          <Link
            href={`/tutor/stunden?year=${prev.year}&month=${prev.month}`}
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-mute transition-colors hover:bg-surface hover:text-ink"
          >
            <ChevronLeft size={16} />
            Zurück
          </Link>
          <span className="font-display text-sm font-semibold text-ink">{monthLabel(year, month)}</span>
          {canNext ? (
            <Link
              href={`/tutor/stunden?year=${next.year}&month=${next.month}`}
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-mute transition-colors hover:bg-surface hover:text-ink"
            >
              Weiter
              <ChevronRight size={16} />
            </Link>
          ) : (
            <span className="flex items-center gap-1 px-3 py-1.5 text-sm text-faint opacity-50">
              Weiter
              <ChevronRight size={16} />
            </span>
          )}
        </CardBody>
      </Card>

      {/* Monat geschlossen */}
      {closed ? (
        <Card className="border-warn/30 bg-warn/5">
          <CardBody className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-warn/10">
              <Lock size={15} className="text-warn" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">Monat abgeschlossen — Einträge gesperrt</p>
              <p className="mt-0.5 text-xs text-mute">Dieser Monat wurde bereits abgerechnet.</p>
            </div>
          </CardBody>
        </Card>
      ) : contracts.length === 0 ? (
        <Card>
          <CardBody className="text-sm text-mute">
            Du hast aktuell keinen aktiven Vertrag — sobald ein Vertrag aktiv ist, kannst du hier
            Stunden erfassen.
          </CardBody>
        </Card>
      ) : (
        /* Formular */
        <Card>
          <CardHeader
            title={editingId ? "Eintrag bearbeiten" : "Neuer Eintrag"}
            subtitle={
              editingId
                ? "Änderungen speichern oder abbrechen"
                : "Lektion erfassen — Notizen unterstützen Markdown"
            }
          />
          <CardBody className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Vertrag">
                <Select value={contractId} onChange={(e) => setContractId(e.target.value)}>
                  {contracts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Datum">
                <Input
                  type="date"
                  value={date}
                  max={todayIso}
                  onChange={(e) => setDate(e.target.value)}
                />
              </Field>
              <Field label="Dauer">
                <div className="flex gap-2">
                  <Select
                    value={durationSel}
                    onChange={(e) => setDurationSel(e.target.value)}
                    className={durationSel === "custom" ? "w-1/2" : undefined}
                  >
                    {DURATION_PRESETS.map((d) => (
                      <option key={d} value={d}>
                        {d} min
                      </option>
                    ))}
                    <option value="custom">Andere…</option>
                  </Select>
                  {durationSel === "custom" ? (
                    <Input
                      type="number"
                      min={15}
                      max={480}
                      step={5}
                      value={customMinutes}
                      onChange={(e) => setCustomMinutes(e.target.value)}
                      className="w-1/2"
                      placeholder="min"
                    />
                  ) : null}
                </div>
              </Field>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Field
                label="Notizen"
                hint="Markdown: **fett**, - Listen, `code`"
              >
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={5000}
                  placeholder="Was wurde behandelt? Fortschritte, Hausaufgaben, nächste Schritte …"
                  className="min-h-[140px]"
                />
              </Field>
              <div>
                <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-mute">
                  <Eye size={12} />
                  Vorschau
                </p>
                <div className="min-h-[140px] rounded-lg border border-edge-soft bg-surface px-3 py-2">
                  {notes.trim() ? (
                    <Markdown>{notes}</Markdown>
                  ) : (
                    <p className="text-xs text-faint">Die Vorschau erscheint hier …</p>
                  )}
                </div>
              </div>
            </div>

            {formError ? (
              <p className="flex items-center gap-1.5 text-xs text-danger">
                <AlertCircle size={13} />
                {formError}
              </p>
            ) : null}

            <div className="flex items-center gap-2">
              <Button onClick={() => void save()} disabled={saving}>
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                {editingId ? "Änderungen speichern" : "Eintrag erfassen"}
              </Button>
              {editingId ? (
                <Button variant="ghost" onClick={resetForm} disabled={saving}>
                  Abbrechen
                </Button>
              ) : null}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Eintrags-Liste */}
      {entries.length === 0 ? (
        <EmptyState
          title={`Keine Einträge im ${monthLabel(year, month)}`}
          description={
            closed
              ? "In diesem Monat wurden keine Lektionen erfasst."
              : "Erfasse deine erste Lektion über das Formular oben."
          }
        />
      ) : (
        <Table>
          <THead>
            <tr>
              <TH>Datum</TH>
              <TH>Vertrag</TH>
              <TH className="text-right">Dauer</TH>
              <TH>Notizen</TH>
              {!closed ? <TH className="text-right">Aktionen</TH> : null}
            </tr>
          </THead>
          <TBody>
            {entries.map((e) => (
              <TR key={e.id} className={cn(editingId === e.id && "bg-accent-soft/30")}>
                <TD className="whitespace-nowrap align-top">{formatDateCH(e.date)}</TD>
                <TD className="align-top text-ink">{e.contractLabel}</TD>
                <TD className="whitespace-nowrap text-right align-top tabular-nums">
                  {minutesLabel(e.minutes)}
                </TD>
                <TD className="align-top">
                  {e.notes.trim() ? (
                    <div className="max-w-md">
                      <Markdown>{e.notes}</Markdown>
                    </div>
                  ) : (
                    <span className="text-faint">—</span>
                  )}
                </TD>
                {!closed ? (
                  <TD className="text-right align-top">
                    <div className="inline-flex gap-1">
                      <button
                        type="button"
                        onClick={() => startEdit(e)}
                        title="Bearbeiten"
                        className="rounded-md p-1.5 text-mute transition-colors hover:bg-surface hover:text-ink"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => void remove(e.id)}
                        disabled={deletingId === e.id}
                        title="Löschen"
                        className="rounded-md p-1.5 text-mute transition-colors hover:bg-danger/10 hover:text-danger disabled:opacity-50"
                      >
                        {deletingId === e.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </div>
                  </TD>
                ) : null}
              </TR>
            ))}
          </TBody>
        </Table>
      )}

      {/* Summenzeile */}
      {entries.length > 0 ? (
        <Card>
          <CardBody className="flex flex-wrap items-center justify-between gap-4 py-3">
            <span className="text-xs font-medium uppercase tracking-wider text-faint">
              Summe {monthLabel(year, month)}
            </span>
            <div className="flex items-center gap-6 text-sm">
              <span className="tabular-nums text-mute">
                {minutesLabel(totalMinutes)}
                <span className="ml-1 text-xs text-faint">
                  ({entries.length} {entries.length === 1 ? "Eintrag" : "Einträge"})
                </span>
              </span>
              <span className="font-semibold tabular-nums text-ok">
                {chf(totalHonorar)}
                <span className="ml-1 text-xs font-normal text-faint">voraussichtlich</span>
              </span>
            </div>
          </CardBody>
        </Card>
      ) : null}
    </div>
  );
}
