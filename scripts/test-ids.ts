// Hilfsscript fuer die E2E-Verifikation: sammelt IDs aus der Dev-DB.
import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();

async function main() {
  const dario = await p.user.findUnique({ where: { email: "tutor@lernova.ch" } });
  const sarah = await p.user.findUnique({ where: { email: "sarah.keller@lernova.ch" } });
  if (!dario || !sarah) throw new Error("Seed-User fehlen");
  const cDario = await p.contract.findFirst({ where: { tutorId: dario.id } });
  const cSarah = await p.contract.findFirst({ where: { tutorId: sarah.id } });
  const inv = await p.invoice.findFirst({ where: { status: "OPEN" } });
  const eSarah = await p.timeEntry.findFirst({ where: { tutorId: sarah.id } });
  console.log(
    JSON.stringify({
      cDario: cDario?.id,
      cSarah: cSarah?.id,
      inv: inv?.id,
      invNo: inv?.number,
      eSarah: eSarah?.id,
    })
  );
}

main().finally(() => p.$disconnect());
