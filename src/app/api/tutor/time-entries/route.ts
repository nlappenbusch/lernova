// GET  /api/tutor/time-entries?year=&month= — eigene Einträge eines Monats
// POST /api/tutor/time-entries — neuen Eintrag erfassen (mit allen Checks)

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireApiUser } from "@/lib/auth";
import { isDateLocked, isMonthClosed } from "@/lib/months";
import { monthRange } from "@/lib/format";
import { getSubject } from "@/lib/subjects";
import { parseDateOnly, dateWindowError, MONTH_LOCKED_ERROR } from "./shared";

export async function GET(req: NextRequest) {
  const user = await requireApiUser("TUTOR");
  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const year = parseInt(searchParams.get("year") ?? "", 10);
  const month = parseInt(searchParams.get("month") ?? "", 10);
  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) {
    return NextResponse.json({ error: "Ungültiger Monat" }, { status: 400 });
  }

  const { start, end } = monthRange(year, month);
  const [entries, closed] = await Promise.all([
    prisma.timeEntry.findMany({
      where: { tutorId: user.id, date: { gte: start, lt: end } },
      include: {
        contract: {
          select: {
            rateTutor: true,
            pensum: { select: { subject: true, customerName: true } },
          },
        },
      },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    }),
    isMonthClosed(year, month),
  ]);

  return NextResponse.json({
    year,
    month,
    closed,
    items: entries.map((e) => ({
      id: e.id,
      contractId: e.contractId,
      contractLabel: `${getSubject(e.contract.pensum.subject)?.name ?? e.contract.pensum.subject} — ${e.contract.pensum.customerName}`,
      date: e.date.toISOString(),
      minutes: e.minutes,
      notes: e.notes,
      rateTutor: e.contract.rateTutor,
    })),
  });
}

const createSchema = z.object({
  contractId: z.string().min(1, "Bitte einen Vertrag wählen."),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Ungültiges Datum."),
  minutes: z
    .number()
    .int("Minuten müssen ganzzahlig sein.")
    .min(15, "Mindestens 15 Minuten.")
    .max(480, "Maximal 480 Minuten (8 Stunden)."),
  notes: z.string().max(5000, "Notizen sind zu lang (max. 5000 Zeichen).").optional().default(""),
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
  const { contractId, minutes, notes } = parsed.data;

  // Multi-Tenancy: Vertrag muss dem Tutor gehören.
  const contract = await prisma.contract.findFirst({
    where: { id: contractId, tutorId: user.id },
  });
  if (!contract) {
    return NextResponse.json({ error: "Vertrag nicht gefunden" }, { status: 404 });
  }
  if (contract.status !== "ACTIVE") {
    return NextResponse.json(
      { error: "Für beendete Verträge können keine Stunden erfasst werden." },
      { status: 409 }
    );
  }

  const date = parseDateOnly(parsed.data.date);
  if (!date) {
    return NextResponse.json({ error: "Ungültiges Datum." }, { status: 400 });
  }
  const windowError = dateWindowError(date, contract.startDate);
  if (windowError) {
    return NextResponse.json({ error: windowError }, { status: 400 });
  }
  if (await isDateLocked(date)) {
    return NextResponse.json({ error: MONTH_LOCKED_ERROR }, { status: 409 });
  }

  const entry = await prisma.timeEntry.create({
    data: { contractId: contract.id, tutorId: user.id, date, minutes, notes },
  });

  return NextResponse.json({ ok: true, id: entry.id }, { status: 201 });
}
