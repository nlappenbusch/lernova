// PATCH /api/admin/pensen/[id] — Raten editieren (nur OPEN) und/oder stornieren.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireApiUser } from "@/lib/auth";

const patchSchema = z.object({
  rateCustomer: z.number().int().min(1).max(1_000_000).optional(),
  rateTutor: z.number().int().min(1).max(1_000_000).optional(),
  status: z.literal("CANCELLED").optional(),
});

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const user = await requireApiUser("ADMIN");
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Ungültige Eingabe" }, { status: 400 });
  }
  const data = parsed.data;
  if (data.rateCustomer === undefined && data.rateTutor === undefined && data.status === undefined) {
    return NextResponse.json({ error: "Keine Änderungen übermittelt" }, { status: 400 });
  }

  const pensum = await prisma.pensum.findUnique({ where: { id } });
  if (!pensum) return NextResponse.json({ error: "Pensum nicht gefunden" }, { status: 404 });

  if ((data.rateCustomer !== undefined || data.rateTutor !== undefined) && pensum.status !== "OPEN") {
    return NextResponse.json(
      { error: "Raten sind nur bei offenen Pensen editierbar" },
      { status: 409 }
    );
  }
  if (data.status === "CANCELLED" && pensum.status !== "OPEN") {
    return NextResponse.json(
      { error: "Nur offene Pensen können storniert werden" },
      { status: 409 }
    );
  }

  const updated = await prisma.pensum.update({
    where: { id },
    data: {
      rateCustomer: data.rateCustomer,
      rateTutor: data.rateTutor,
      status: data.status,
    },
  });

  return NextResponse.json({ ok: true, pensum: { id: updated.id, status: updated.status } });
}
