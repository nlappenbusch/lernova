// POST /api/leads — nimmt eine Nachhilfe-Anfrage entgegen, legt ein Pensum an
// (status OPEN) und versendet optional eine Bestaetigungsmail (Stub-tolerant).

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSubject, getLevel } from "@/lib/subjects";
import { geocodePlz } from "@/lib/plz";
import { config } from "@/lib/config";
import { chf } from "@/lib/format";
import { sendMail } from "@/lib/mailer";
import type { PensumStatus } from "@/lib/types";

const leadSchema = z.object({
  subject: z
    .string()
    .max(80)
    .refine((s) => Boolean(getSubject(s)), "Unbekanntes Fach."),
  level: z
    .string()
    .max(80)
    .refine((s) => Boolean(getLevel(s)), "Unbekannte Stufe."),
  plz: z.string().regex(/^\d{4}$/, "Bitte eine gültige 4-stellige PLZ angeben."),
  city: z
    .string()
    .min(2, "Bitte den Ort angeben.")
    .max(80, "Ortsname zu lang."),
  lessonsPerWeek: z.enum(["1", "2", "flexibel"]).default("1"),
  preferredTimes: z.string().max(300, "Wunschzeiten zu lang.").optional(),
  description: z
    .string()
    .min(10, "Bitte den Bedarf kurz beschreiben (mind. 10 Zeichen).")
    .max(2000, "Beschreibung zu lang (max. 2000 Zeichen)."),
  name: z.string().min(2, "Bitte den Namen angeben.").max(120, "Name zu lang."),
  email: z.email("Bitte eine gültige E-Mail-Adresse angeben.").max(200),
  phone: z.string().max(40, "Telefonnummer zu lang.").optional(),
  street: z.string().max(160, "Strasse zu lang.").optional(),
  privacy: z.boolean().refine((v) => v === true, "Bitte die Datenschutzerklärung bestätigen."),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Ungültige Eingaben.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const data = parsed.data;
  const subject = getSubject(data.subject)!;
  const level = getLevel(data.level)!;
  const geo = geocodePlz(data.plz);

  const lessonsPerWeek = data.lessonsPerWeek === "2" ? 2 : 1;
  const preferredTimes =
    [
      data.preferredTimes?.trim() || "",
      data.lessonsPerWeek === "flexibel" ? "Anzahl Lektionen flexibel" : "",
    ]
      .filter(Boolean)
      .join(" — ") || null;

  await prisma.pensum.create({
    data: {
      subject: subject.slug,
      level: level.slug,
      description: data.description.trim(),
      customerName: data.name.trim(),
      customerEmail: data.email.trim().toLowerCase(),
      customerPhone: data.phone?.trim() || null,
      street: data.street?.trim() || null,
      plz: data.plz,
      city: data.city.trim(),
      lat: geo?.lat ?? null,
      lng: geo?.lng ?? null,
      lessonsPerWeek,
      preferredTimes,
      rateCustomer: config.billing.defaultRateCustomer,
      rateTutor: config.billing.defaultRateTutor,
      status: "OPEN" satisfies PensumStatus,
      source: "web",
    },
  });

  // Bestaetigungsmail ist "best effort" — der Lead ist bereits gespeichert.
  try {
    await sendMail({
      to: data.email.trim().toLowerCase(),
      subject: `Ihre Nachhilfe-Anfrage bei ${config.brandName} ist eingegangen`,
      body: [
        `Guten Tag ${data.name.trim()}`,
        "",
        `Vielen Dank für Ihre Anfrage für ${subject.name}-Nachhilfe (${level.name}) in ${data.city.trim()}.`,
        "",
        "So geht es weiter:",
        "1. Wir suchen geprüfte Tutor:innen in Ihrem Umkreis.",
        "2. Innert 24 Stunden erhalten Sie von uns einen konkreten Vorschlag.",
        "3. Passt alles, vereinbaren Sie direkt die erste Lektion.",
        "",
        `Zur Orientierung: Eine Lektion à 60 Minuten kostet ${chf(config.billing.defaultRateCustomer)} — ohne Abo und ohne Mindestlaufzeit.`,
        "",
        "Freundliche Grüsse",
        `${config.company.name}`,
        `${config.company.email} · ${config.company.phone}`,
      ].join("\n"),
      kind: "lead-confirm",
    });
  } catch {
    // Mail-Versand darf fehlschlagen (Stub / SMTP nicht konfiguriert).
  }

  return NextResponse.json({ ok: true });
}
