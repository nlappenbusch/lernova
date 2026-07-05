// POST /api/admin/dunning/run — Mahnlauf manuell starten (Billing-Engine).

import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/auth";
import { runDunning } from "@/lib/dunning";

export async function POST() {
  const user = await requireApiUser("ADMIN");
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  try {
    const result = await runDunning();
    return NextResponse.json({ ok: true, result });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Mahnlauf fehlgeschlagen" },
      { status: 400 }
    );
  }
}
