"use client";

// Tutor-Profil: Kontakt, Standort (PLZ -> serverseitiges Geocoding),
// Suchradius, Fächer (gruppiert), Bio, IBAN.

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle, Loader2, Save } from "lucide-react";
import { SUBJECTS, type SubjectCategory } from "@/lib/subjects";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Textarea,
  Field,
  Button,
  Badge,
  cn,
} from "@/components/ui";

type ProfileValues = {
  phone: string;
  street: string;
  plz: string;
  city: string;
  radiusKm: number;
  subjects: string[];
  bio: string;
  iban: string;
};

const CATEGORY_LABELS: Array<{ key: SubjectCategory; label: string }> = [
  { key: "ict", label: "ICT & Informatik" },
  { key: "school", label: "Schule" },
  { key: "business", label: "KV & Wirtschaft" },
];

export function ProfileForm({
  initial,
  name,
  email,
}: {
  initial: ProfileValues;
  name: string;
  email: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<ProfileValues>(initial);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const grouped = useMemo(
    () =>
      CATEGORY_LABELS.map((cat) => ({
        ...cat,
        subjects: SUBJECTS.filter((s) => s.category === cat.key),
      })),
    []
  );

  function set<K extends keyof ProfileValues>(key: K, value: ProfileValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setSuccess(null);
  }

  function toggleSubject(slug: string) {
    setValues((v) => ({
      ...v,
      subjects: v.subjects.includes(slug)
        ? v.subjects.filter((s) => s !== slug)
        : [...v.subjects, slug],
    }));
    setSuccess(null);
  }

  async function save() {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/tutor/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json().catch(() => null)) as
        | { error?: string; profile?: ProfileValues }
        | null;
      if (!res.ok) {
        throw new Error(data?.error ?? "Speichern fehlgeschlagen.");
      }
      if (data?.profile) {
        setValues(data.profile);
      }
      setSuccess("Profil gespeichert.");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unbekannter Fehler");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader title="Konto" subtitle="Name und E-Mail werden von Lernova verwaltet" />
        <CardBody className="grid gap-4 sm:grid-cols-2">
          <Field label="Name">
            <Input value={name} disabled />
          </Field>
          <Field label="E-Mail">
            <Input value={email} disabled />
          </Field>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Kontakt & Standort"
          subtitle="Die PLZ bestimmt das Zentrum deiner Umkreissuche"
        />
        <CardBody className="grid gap-4 sm:grid-cols-2">
          <Field label="Telefon">
            <Input
              value={values.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+41 79 000 00 00"
            />
          </Field>
          <Field label="Strasse & Nr.">
            <Input
              value={values.street}
              onChange={(e) => set("street", e.target.value)}
              placeholder="Musterstrasse 12"
            />
          </Field>
          <Field label="PLZ" hint="4-stellige Schweizer PLZ — wird für die Umkreissuche geokodiert">
            <Input
              value={values.plz}
              onChange={(e) => set("plz", e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="8001"
              inputMode="numeric"
            />
          </Field>
          <Field label="Ort" hint="Wird bei bekannter PLZ automatisch gesetzt">
            <Input
              value={values.city}
              onChange={(e) => set("city", e.target.value)}
              placeholder="Zürich"
            />
          </Field>
          <div className="sm:col-span-2">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs font-medium text-mute">Standard-Radius für die Umkreissuche</span>
              <span className="rounded-md bg-accent-soft px-2 py-0.5 text-xs font-semibold tabular-nums text-accent">
                {values.radiusKm} km
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={100}
              step={1}
              value={values.radiusKm}
              onChange={(e) => set("radiusKm", Number(e.target.value))}
              className="w-full accent-accent"
              aria-label="Standard-Radius in Kilometern"
            />
            <div className="mt-0.5 flex justify-between text-[10px] text-faint">
              <span>5 km</span>
              <span>100 km</span>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Fächer"
          subtitle="Wähle die Fächer, die du unterrichtest — sie steuern den Filter «Nur meine Fächer»"
          action={<Badge tone="accent">{values.subjects.length} gewählt</Badge>}
        />
        <CardBody className="space-y-5">
          {grouped.map((cat) => (
            <div key={cat.key}>
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-faint">
                {cat.label}
              </p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {cat.subjects.map((s) => {
                  const checked = values.subjects.includes(s.slug);
                  return (
                    <label
                      key={s.slug}
                      className={cn(
                        "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                        checked
                          ? "border-accent/50 bg-accent-soft/50 text-ink"
                          : "border-edge bg-surface text-mute hover:border-accent/30 hover:text-ink"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleSubject(s.slug)}
                        className="accent-accent"
                      />
                      {s.name}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Über dich & Auszahlung" />
        <CardBody className="space-y-4">
          <Field
            label="Bio"
            hint="Kurzvorstellung für das Lernova-Team (Erfahrung, Ausbildung, Stil)"
          >
            <Textarea
              value={values.bio}
              onChange={(e) => set("bio", e.target.value)}
              maxLength={2000}
              className="min-h-[120px]"
              placeholder="Erzähl kurz, wer du bist und was dich als Tutor:in auszeichnet …"
            />
          </Field>
          <Field label="IBAN (Auszahlungskonto)" hint="Schweizer IBAN, z. B. CH93 0076 2011 6238 5295 7">
            <Input
              value={values.iban}
              onChange={(e) => set("iban", e.target.value)}
              placeholder="CH.."
            />
          </Field>
        </CardBody>
      </Card>

      <div className="flex items-center gap-3">
        <Button onClick={() => void save()} disabled={saving}>
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Profil speichern
        </Button>
        {success ? (
          <span className="flex items-center gap-1.5 text-sm text-ok">
            <CheckCircle2 size={15} />
            {success}
          </span>
        ) : null}
        {error ? (
          <span className="flex items-center gap-1.5 text-sm text-danger">
            <AlertCircle size={15} />
            {error}
          </span>
        ) : null}
      </div>
    </div>
  );
}
