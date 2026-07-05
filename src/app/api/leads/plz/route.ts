// GET /api/leads/plz?plz=8001 — Live-Ortsnamen-Lookup fuer das Lead-Formular.

import { NextRequest, NextResponse } from "next/server";
import { findByPlz } from "@/lib/plz";

export async function GET(req: NextRequest) {
  const plz = (req.nextUrl.searchParams.get("plz") ?? "").trim();
  if (!/^\d{4}$/.test(plz)) {
    return NextResponse.json({ error: "PLZ muss 4-stellig sein." }, { status: 400 });
  }
  const entry = findByPlz(plz);
  return NextResponse.json({
    plz,
    city: entry?.name ?? null,
    canton: entry?.canton ?? null,
  });
}
