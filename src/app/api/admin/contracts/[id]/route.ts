// PATCH /api/admin/contracts/[id] — Vertrag beenden (ENDED + endDate=jetzt).

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireApiUser } from "@/lib/auth";

const patchSchema = z.object({ action: z.literal("end") });

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const user = await requireApiUser("ADMIN");
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Ungültige Eingabe" }, { status: 400 });
  }

  const contract = await prisma.contract.findUnique({ where: { id } });
  if (!contract) return NextResponse.json({ error: "Vertrag nicht gefunden" }, { status: 404 });
  if (contract.status !== "ACTIVE") {
    return NextResponse.json({ error: "Vertrag ist bereits beendet" }, { status: 409 });
  }

  await prisma.contract.update({
    where: { id },
    data: { status: "ENDED", endDate: new Date() },
  });

  return NextResponse.json({ ok: true });
}
