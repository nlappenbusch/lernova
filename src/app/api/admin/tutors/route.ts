// POST /api/admin/tutors — neue:n Tutor:in anlegen (role TUTOR, PLZ-Geokodierung).

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword, requireApiUser } from "@/lib/auth";
import { findByPlz, geocodePlz } from "@/lib/plz";

const createSchema = z.object({
  name: z.string().trim().min(2, "Name zu kurz").max(120),
  email: z.email("Ungültige E-Mail-Adresse").max(200),
  plz: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "PLZ muss 4-stellig sein"),
  city: z.string().trim().max(120).optional(),
  password: z.string().min(8, "Passwort: mindestens 8 Zeichen").max(100),
});

export async function POST(req: NextRequest) {
  const user = await requireApiUser("ADMIN");
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message ?? "Ungültige Eingabe" },
      { status: 400 }
    );
  }

  const email = parsed.data.email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Diese E-Mail-Adresse ist bereits vergeben" }, { status: 409 });
  }

  const geo = geocodePlz(parsed.data.plz);
  const city =
    parsed.data.city && parsed.data.city !== ""
      ? parsed.data.city
      : findByPlz(parsed.data.plz)?.name ?? "";

  const created = await prisma.user.create({
    data: {
      email,
      name: parsed.data.name,
      passwordHash: await hashPassword(parsed.data.password),
      role: "TUTOR",
      plz: parsed.data.plz,
      city,
      lat: geo?.lat ?? null,
      lng: geo?.lng ?? null,
      subjects: "[]",
    },
  });

  return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
}
