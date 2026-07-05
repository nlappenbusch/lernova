// Entfernt die von scripts/e2e-api.ts erzeugten Testdaten wieder.
import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();

async function main() {
  const pensen = await p.pensum.findMany({
    where: { customerEmail: "e2e.testkunde@example.ch" },
    select: { id: true },
  });
  for (const { id } of pensen) {
    await p.application.deleteMany({ where: { pensumId: id } });
    await p.pensum.delete({ where: { id } });
  }
  const mails = await p.emailLog.deleteMany({ where: { to: "e2e.testkunde@example.ch" } });
  console.log(`Bereinigt: ${pensen.length} Test-Pensen, ${mails.count} Test-Mails.`);
}

main().finally(() => p.$disconnect());
