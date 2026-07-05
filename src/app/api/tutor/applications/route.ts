// GET  /api/tutor/applications — eigene Bewerbungen (sanitisiert)
// POST /api/tutor/applications — Bewerbung auf ein offenes Pensum

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireApiUser } from "@/lib/auth";
import { getSubject, getLevel } from "@/lib/subjects";

export async function GET() {
  const user = await requireApiUser("TUTOR");
  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  const applications = await prisma.application.findMany({
    where: { tutorId: user.id },
    include: {
      pensum: {
        select: { subject: true, level: true, plz: true, city: true, status: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const items = applications.map((a) => ({
    id: a.id,
    status: a.status,
    message: a.message,
    createdAt: a.createdAt.toISOString(),
    pensum: {
      subject: a.pensum.subject,
      subjectName: getSubject(a.pensum.subject)?.name ?? a.pensum.subject,
      level: a.pensum.level,
      levelName: getLevel(a.pensum.level)?.name ?? a.pensum.level,
      plz: a.pensum.plz,
      city: a.pensum.city,
      status: a.pensum.status,
    },
  }));

  return NextResponse.json({ items });
}

const createSchema = z.object({
  pensumId: z.string().min(1, "Pensum fehlt"),
  message: z
    .string()
    .trim()
    .min(10, "Bitte schreibe eine kurze Motivation (mindestens 10 Zeichen).")
    .max(2000, "Nachricht ist zu lang (max. 2000 Zeichen)."),
});

export async function POST(req: NextRequest) {
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

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe" },
      { status: 400 }
    );
  }
  const { pensumId, message } = parsed.data;

  const pensum = await prisma.pensum.findUnique({ where: { id: pensumId } });
  if (!pensum) {
    return NextResponse.json({ error: "Pensum nicht gefunden" }, { status: 404 });
  }
  if (pensum.status !== "OPEN") {
    return NextResponse.json({ error: "Dieses Pensum ist nicht mehr offen." }, { status: 409 });
  }

  const existing = await prisma.application.findUnique({
    where: { pensumId_tutorId: { pensumId, tutorId: user.id } },
    select: { id: true },
  });
  if (existing) {
    return NextResponse.json({ error: "Bereits beworben" }, { status: 409 });
  }

  try {
    const application = await prisma.application.create({
      data: { pensumId, tutorId: user.id, message },
    });
    return NextResponse.json(
      { ok: true, id: application.id, status: application.status },
      { status: 201 }
    );
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json({ error: "Bereits beworben" }, { status: 409 });
    }
    throw e;
  }
}
