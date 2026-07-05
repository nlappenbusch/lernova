// POST /api/admin/month-close {year, month} — delegiert an die Billing-Engine.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { requireApiUser } from "@/lib/auth";
import { closeMonth } from "@/lib/billing";

const bodySchema = z.object({
  year: z.number().int().min(2000).max(2100),
  month: z.number().int().min(1).max(12),
});

export async function POST(req: NextRequest) {
  const user = await requireApiUser("ADMIN");
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Ungültige Eingabe (year/month)" }, { status: 400 });
  }

  try {
    const result = await closeMonth(parsed.data.year, parsed.data.month, user.id);
    return NextResponse.json({ ok: true, result });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Monatsabschluss fehlgeschlagen" },
      { status: 400 }
    );
  }
}
