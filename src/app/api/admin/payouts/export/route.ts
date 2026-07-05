// GET /api/admin/payouts/export?year=&month= — CSV der Payouts eines Monats.
// Spalten: Tutor;IBAN;Monat;Stunden;Betrag_CHF

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireApiUser } from "@/lib/auth";
import { chfPlain } from "@/lib/format";

function csvField(v: string): string {
  return /[";\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

export async function GET(req: NextRequest) {
  const user = await requireApiUser("ADMIN");
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const year = parseInt(req.nextUrl.searchParams.get("year") ?? "", 10);
  const month = parseInt(req.nextUrl.searchParams.get("month") ?? "", 10);
  if (!Number.isFinite(year) || year < 2000 || year > 2100 || !Number.isFinite(month) || month < 1 || month > 12) {
    return NextResponse.json({ error: "Ungültiger Monat (year/month)" }, { status: 400 });
  }

  const payouts = await prisma.payout.findMany({
    where: { year, month },
    include: { tutor: { select: { name: true, iban: true } } },
  });
  payouts.sort((a, b) => a.tutor.name.localeCompare(b.tutor.name, "de-CH"));

  const monthStr = `${year}-${String(month).padStart(2, "0")}`;
  const lines = ["Tutor;IBAN;Monat;Stunden;Betrag_CHF"];
  for (const p of payouts) {
    lines.push(
      [
        csvField(p.tutor.name),
        csvField(p.tutor.iban ?? ""),
        monthStr,
        (p.minutes / 60).toFixed(2),
        chfPlain(p.amount),
      ].join(";")
    );
  }
  const csv = lines.join("\r\n") + "\r\n";

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="auszahlungen-${monthStr}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
