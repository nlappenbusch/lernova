"use client";

// Formular "Neue:r Tutor:in": POST /api/admin/tutors (Name, E-Mail, PLZ/Ort, Start-Passwort).

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { Button, Field, Input } from "@/components/ui";

export function TutorCreateForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [plz, setPlz] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/admin/tutors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          plz: plz.trim(),
          city: city.trim() === "" ? undefined : city.trim(),
          password,
        }),
      });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) {
        setError(data?.error || "Anlegen fehlgeschlagen");
        return;
      }
      setSuccess(`${name.trim()} wurde angelegt.`);
      setName("");
      setEmail("");
      setPlz("");
      setCity("");
      setPassword("");
      router.refresh();
    } catch {
      setError("Netzwerkfehler — bitte erneut versuchen");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Vorname Nachname"
            required
            minLength={2}
          />
        </Field>
        <Field label="E-Mail">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@beispiel.ch"
            required
          />
        </Field>
        <Field label="PLZ" hint="4-stellige Schweizer PLZ — wird für die Umkreissuche geokodiert.">
          <Input
            value={plz}
            onChange={(e) => setPlz(e.target.value)}
            placeholder="8001"
            required
            pattern="\d{4}"
            inputMode="numeric"
          />
        </Field>
        <Field label="Ort" hint="Leer lassen = automatisch aus der PLZ.">
          <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Zürich" />
        </Field>
        <Field label="Start-Passwort" hint="Mindestens 8 Zeichen — Tutor:in kann es später ändern." className="sm:col-span-2">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
        </Field>
      </div>

      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {success ? <p className="text-sm text-ok">{success}</p> : null}

      <Button type="submit" disabled={loading}>
        <UserPlus size={14} />
        {loading ? "Wird angelegt…" : "Tutor:in anlegen"}
      </Button>
    </form>
  );
}
