// GET /api/tutor/pensen — sanitisierter Feed offener Pensen im Umkreis.
// SECURITY: keine Kundendaten (Name/E-Mail/Telefon/Strasse) und kein rateCustomer!

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireApiUser } from "@/lib/auth";
import { withinRadius } from "@/lib/geo";
import { geocodePlz, findByPlz } from "@/lib/plz";
import { getSubject, getLevel } from "@/lib/subjects";

function parseSubjectSlugs(raw: string): string[] {
  try {
    const arr = JSON.parse(raw) as unknown;
    return Array.isArray(arr) ? arr.filter((s): s is string => typeof s === "string") : [];
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  const user = await requireApiUser("TUTOR");
  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const radiusRaw = parseInt(searchParams.get("radius") ?? "", 10);
  const radius = Number.isFinite(radiusRaw)
    ? Math.min(100, Math.max(5, radiusRaw))
    : user.radiusKm;
  const onlyMine =
    searchParams.get("onlyMine") === "1" || searchParams.get("onlyMine") === "true";
  const level = (searchParams.get("level") ?? "").trim();

  // Zentrum: Profil-Koordinaten, sonst Geocode der Profil-PLZ.
  const center =
    user.lat != null && user.lng != null
      ? { lat: user.lat, lng: user.lng }
      : user.plz
        ? geocodePlz(user.plz)
        : null;

  if (!center) {
    return NextResponse.json({ items: [], missingLocation: true, radius });
  }

  const [pensen, applications] = await Promise.all([
    prisma.pensum.findMany({ where: { status: "OPEN" } }),
    prisma.application.findMany({
      where: { tutorId: user.id },
      select: { pensumId: true },
    }),
  ]);

  const appliedSet = new Set(applications.map((a) => a.pensumId));
  const mySubjects = new Set(parseSubjectSlugs(user.subjects));

  let result = withinRadius(pensen, center, radius);
  if (onlyMine) result = result.filter((p) => mySubjects.has(p.subject));
  if (level) result = result.filter((p) => p.level === level);

  const items = result.map((p) => ({
    id: p.id,
    subject: p.subject,
    subjectName: getSubject(p.subject)?.name ?? p.subject,
    level: p.level,
    levelName: getLevel(p.level)?.name ?? p.level,
    plz: p.plz,
    city: p.city,
    canton: findByPlz(p.plz)?.canton ?? null,
    distanceKm: p.distanceKm,
    description: p.description,
    lessonsPerWeek: p.lessonsPerWeek,
    preferredTimes: p.preferredTimes,
    rateTutor: p.rateTutor,
    createdAt: p.createdAt.toISOString(),
    alreadyApplied: appliedSet.has(p.id),
  }));

  return NextResponse.json({ items, missingLocation: false, radius });
}
