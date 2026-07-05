// POST /api/admin/applications/[id]/accept — Bewerbung annehmen:
// Application -> ACCEPTED, übrige PENDING des Pensums -> REJECTED,
// Pensum -> MATCHED, Contract erstellen (Raten vom Pensum). Alles transaktional.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireApiUser } from "@/lib/auth";
import { sendMail } from "@/lib/mailer";
import { getSubject } from "@/lib/subjects";
import { config } from "@/lib/config";

export async function POST(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const user = await requireApiUser("ADMIN");
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const { id } = await ctx.params;
  const application = await prisma.application.findUnique({
    where: { id },
    include: { pensum: true, tutor: { select: { name: true, email: true } } },
  });
  if (!application) {
    return NextResponse.json({ error: "Bewerbung nicht gefunden" }, { status: 404 });
  }
  if (application.status !== "PENDING") {
    return NextResponse.json({ error: "Bewerbung ist nicht mehr ausstehend" }, { status: 409 });
  }
  if (application.pensum.status !== "OPEN") {
    return NextResponse.json({ error: "Pensum ist nicht mehr offen" }, { status: 409 });
  }

  const contract = await prisma.$transaction(async (tx) => {
    await tx.application.update({ where: { id }, data: { status: "ACCEPTED" } });
    await tx.application.updateMany({
      where: { pensumId: application.pensumId, status: "PENDING", NOT: { id } },
      data: { status: "REJECTED" },
    });
    await tx.pensum.update({
      where: { id: application.pensumId },
      data: { status: "MATCHED" },
    });
    return tx.contract.create({
      data: {
        pensumId: application.pensumId,
        tutorId: application.tutorId,
        rateCustomer: application.pensum.rateCustomer,
        rateTutor: application.pensum.rateTutor,
        startDate: new Date(),
        status: "ACTIVE",
      },
    });
  });

  // Benachrichtigung an die Tutor:in — Fehler dürfen die Vermittlung nicht kippen.
  const subjectName = getSubject(application.pensum.subject)?.name ?? application.pensum.subject;
  try {
    await sendMail({
      to: application.tutor.email,
      subject: `Zusage: ${subjectName} in ${application.pensum.city}`,
      body:
        `Hallo ${application.tutor.name}\n\n` +
        `Gute Nachrichten: Deine Bewerbung für das Pensum «${subjectName}» in ` +
        `${application.pensum.plz} ${application.pensum.city} wurde angenommen.\n\n` +
        `Der Vertrag ist ab sofort aktiv — die Kundendaten findest du in deinem ${config.brandName}-Portal.\n\n` +
        `Freundliche Grüsse\nDein ${config.brandName}-Team`,
      kind: "application-accepted",
    });
  } catch {
    // Mail-Versand ist best effort (Stub/SMTP kann fehlen).
  }

  return NextResponse.json({ ok: true, contractId: contract.id });
}
