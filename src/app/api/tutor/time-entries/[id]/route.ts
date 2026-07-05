// PATCH/DELETE /api/tutor/time-entries/[id] — eigene Einträge bearbeiten/löschen.
// Lock-Check IMMER auch für das ALTE Datum (Monat könnte inzwischen zu sein).

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireApiUser } from "@/lib/auth";
import { isDateLocked } from "@/lib/months";
import { parseDateOnly, dateWindowError, MONTH_LOCKED_ERROR } from "../shared";

const patchSchema = z.object({
  contractId: z.string().min(1).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Ungültiges Datum.").optional(),
  minutes: z
    .number()
    .int("Minuten müssen ganzzahlig sein.")
    .min(15, "Mindestens 15 Minuten.")
    .max(480, "Maximal 480 Minuten (8 Stunden).")
    .optional(),
  notes: z.string().max(5000, "Notizen sind zu lang (max. 5000 Zeichen).").optional(),
});

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const user = await requireApiUser("TUTOR");
  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }
  const { id } = await ctx.params;

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

  // Multi-Tenancy: nur eigene Einträge.
  const existing = await prisma.timeEntry.findFirst({
    where: { id, tutorId: user.id },
    include: { contract: { select: { id: true, startDate: true } } },
  });
  if (!existing) {
    return NextResponse.json({ error: "Eintrag nicht gefunden" }, { status: 404 });
  }

  // Sperre für das ALTE Datum prüfen.
  if (await isDateLocked(existing.date)) {
    return NextResponse.json({ error: MONTH_LOCKED_ERROR }, { status: 409 });
  }

  // Ziel-Vertrag bestimmen (bei Wechsel: Ownership + ACTIVE prüfen).
  let targetContract: { id: string; startDate: Date } = existing.contract;
  if (parsed.data.contractId && parsed.data.contractId !== existing.contractId) {
    const contract = await prisma.contract.findFirst({
      where: { id: parsed.data.contractId, tutorId: user.id },
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
    targetContract = { id: contract.id, startDate: contract.startDate };
  }

  // Ziel-Datum bestimmen und validieren (Zukunft, Vertragsfenster, Sperre).
  let targetDate = existing.date;
  if (parsed.data.date) {
    const date = parseDateOnly(parsed.data.date);
    if (!date) {
      return NextResponse.json({ error: "Ungültiges Datum." }, { status: 400 });
    }
    targetDate = date;
  }
  const windowError = dateWindowError(targetDate, targetContract.startDate);
  if (windowError) {
    return NextResponse.json({ error: windowError }, { status: 400 });
  }
  if (await isDateLocked(targetDate)) {
    return NextResponse.json({ error: MONTH_LOCKED_ERROR }, { status: 409 });
  }

  await prisma.timeEntry.update({
    where: { id: existing.id },
    data: {
      contractId: targetContract.id,
      date: targetDate,
      minutes: parsed.data.minutes ?? existing.minutes,
      notes: parsed.data.notes ?? existing.notes,
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const user = await requireApiUser("TUTOR");
  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }
  const { id } = await ctx.params;

  const existing = await prisma.timeEntry.findFirst({
    where: { id, tutorId: user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Eintrag nicht gefunden" }, { status: 404 });
  }
  if (await isDateLocked(existing.date)) {
    return NextResponse.json({ error: MONTH_LOCKED_ERROR }, { status: 409 });
  }

  await prisma.timeEntry.delete({ where: { id: existing.id } });
  return NextResponse.json({ ok: true });
}
