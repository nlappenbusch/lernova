// POST /api/admin/applications/[id]/reject — ausstehende Bewerbung ablehnen.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireApiUser } from "@/lib/auth";

export async function POST(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const user = await requireApiUser("ADMIN");
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const { id } = await ctx.params;
  const application = await prisma.application.findUnique({ where: { id } });
  if (!application) {
    return NextResponse.json({ error: "Bewerbung nicht gefunden" }, { status: 404 });
  }
  if (application.status !== "PENDING") {
    return NextResponse.json({ error: "Bewerbung ist nicht mehr ausstehend" }, { status: 409 });
  }

  await prisma.application.update({ where: { id }, data: { status: "REJECTED" } });
  return NextResponse.json({ ok: true });
}
