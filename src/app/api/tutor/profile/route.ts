// PATCH /api/tutor/profile — eigenes Tutor-Profil aktualisieren.
// PLZ-Änderung: serverseitiges Geocoding (lat/lng), Ort aus PLZ-Katalog wenn exakt.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireApiUser } from "@/lib/auth";
import { geocodePlz, findByPlz } from "@/lib/plz";
import { getSubject } from "@/lib/subjects";

const patchSchema = z.object({
  phone: z.string().trim().max(40, "Telefonnummer ist zu lang."),
  street: z.string().trim().max(120, "Strasse ist zu lang."),
  plz: z
    .string()
    .trim()
    .refine((v) => v === "" || /^\d{4}$/.test(v), "PLZ muss 4-stellig sein."),
  city: z.string().trim().max(80, "Ort ist zu lang."),
  radiusKm: z
    .number()
    .int("Radius muss ganzzahlig sein.")
    .min(5, "Radius mindestens 5 km.")
    .max(100, "Radius maximal 100 km."),
  subjects: z
    .array(z.string())
    .max(50)
    .refine((arr) => arr.every((s) => getSubject(s) !== undefined), "Ungültiges Fach."),
  bio: z.string().trim().max(2000, "Bio ist zu lang (max. 2000 Zeichen)."),
  iban: z
    .string()
    .trim()
    .transform((v) => v.replace(/\s+/g, "").toUpperCase())
    .refine(
      (v) => v === "" || /^CH\d{2}[A-Z0-9]{17}$/.test(v),
      "Bitte eine gültige Schweizer IBAN angeben (CH + 19 Stellen) oder das Feld leer lassen."
    ),
});

export async function PATCH(req: NextRequest) {
  const user = await requireApiUser("TUTOR");
  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe" },
      { status: 400 }
    );
  }
  const data = parsed.data;

  // Geocoding: PLZ -> Koordinaten; Ort aus dem Katalog, wenn die PLZ exakt bekannt ist.
  let lat: number | null = null;
  let lng: number | null = null;
  let city = data.city;
  if (data.plz !== "") {
    const geo = geocodePlz(data.plz);
    lat = geo?.lat ?? null;
    lng = geo?.lng ?? null;
    const exact = findByPlz(data.plz);
    if (exact) city = exact.name;
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      phone: data.phone || null,
      street: data.street || null,
      plz: data.plz || null,
      city: city || null,
      lat,
      lng,
      radiusKm: data.radiusKm,
      subjects: JSON.stringify(data.subjects),
      bio: data.bio || null,
      iban: data.iban || null,
    },
  });

  return NextResponse.json({
    ok: true,
    profile: {
      phone: updated.phone ?? "",
      street: updated.street ?? "",
      plz: updated.plz ?? "",
      city: updated.city ?? "",
      radiusKm: updated.radiusKm,
      subjects: data.subjects,
      bio: updated.bio ?? "",
      iban: updated.iban ?? "",
      hasLocation: updated.lat != null,
    },
  });
}
