// PATCH /api/admin/invoices/[id] — {action: "markPaid" | "cancel"} (nur OPEN).

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireApiUser } from "@/lib/auth";

const patchSchema = z.object({ action: z.enum(["markPaid", "cancel"]) });

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const user = await requireApiUser("ADMIN");
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Ungültige Eingabe" }, { status: 400 });
  }

  const invoice = await prisma.invoice.findUnique({ where: { id } });
  if (!invoice) return NextResponse.json({ error: "Rechnung nicht gefunden" }, { status: 404 });
  if (invoice.status !== "OPEN") {
    return NextResponse.json(
      { error: "Nur offene Rechnungen können bearbeitet werden" },
      { status: 409 }
    );
  }

  if (parsed.data.action === "markPaid") {
    await prisma.invoice.update({
      where: { id },
      data: { status: "PAID", paidAt: new Date() },
    });
  } else {
    await prisma.invoice.update({
      where: { id },
      data: { status: "CANCELLED" },
    });
  }

  return NextResponse.json({ ok: true });
}
