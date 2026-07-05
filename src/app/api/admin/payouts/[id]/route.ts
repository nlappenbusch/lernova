// PATCH /api/admin/payouts/[id] — Payout als ausbezahlt markieren.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireApiUser } from "@/lib/auth";

const patchSchema = z.object({ action: z.literal("markPaid") });

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const user = await requireApiUser("ADMIN");
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Ungültige Eingabe" }, { status: 400 });
  }

  const payout = await prisma.payout.findUnique({ where: { id } });
  if (!payout) return NextResponse.json({ error: "Auszahlung nicht gefunden" }, { status: 404 });
  if (payout.status !== "PENDING") {
    return NextResponse.json({ error: "Auszahlung ist bereits erledigt" }, { status: 409 });
  }

  await prisma.payout.update({
    where: { id },
    data: { status: "PAID", paidAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
