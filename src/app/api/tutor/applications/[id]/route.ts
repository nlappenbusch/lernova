// PATCH /api/tutor/applications/[id] — eigene PENDING-Bewerbung zurückziehen.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireApiUser } from "@/lib/auth";

const patchSchema = z.object({
  action: z.literal("withdraw"),
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
    return NextResponse.json({ error: "Ungültige Aktion" }, { status: 400 });
  }

  // Multi-Tenancy: nur eigene Bewerbungen.
  const application = await prisma.application.findFirst({
    where: { id, tutorId: user.id },
  });
  if (!application) {
    return NextResponse.json({ error: "Bewerbung nicht gefunden" }, { status: 404 });
  }
  if (application.status !== "PENDING") {
    return NextResponse.json(
      { error: "Nur ausstehende Bewerbungen können zurückgezogen werden." },
      { status: 409 }
    );
  }

  await prisma.application.update({
    where: { id: application.id },
    data: { status: "WITHDRAWN" },
  });

  return NextResponse.json({ ok: true });
}
