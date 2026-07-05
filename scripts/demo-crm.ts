// Setzt CRM-Demo-Werte auf den bestehenden Seed-Pensen (Pipeline, Follow-ups,
// ICT-Modul-Bezug), ohne die DB neu zu seeden.
import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();

function daysFromNow(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(9, 0, 0, 0);
  return d;
}

async function main() {
  // Vermittelte Pensen -> Pipeline MATCHED
  const matched = await p.pensum.updateMany({
    where: { status: "MATCHED" },
    data: { pipeline: "MATCHED" },
  });

  // Offene Pensen -> Default PUBLISHED
  await p.pensum.updateMany({ where: { status: "OPEN" }, data: { pipeline: "PUBLISHED" } });

  // ICT-Modul-Bezug + Pipeline-Vielfalt fuer die Demo
  const bySubject = async (subject: string) =>
    p.pensum.findFirst({ where: { subject, status: "OPEN" } });

  const java = await bySubject("programmieren-java");
  if (java) {
    await p.pensum.update({
      where: { id: java.id },
      data: {
        moduleCode: "320",
        profession: "informatiker-efz-applikationsentwicklung",
        pipeline: "QUALIFIED",
        followUpAt: daysFromNow(2),
      },
    });
  }

  const netz = await bySubject("netzwerktechnik");
  if (netz) {
    await p.pensum.update({
      where: { id: netz.id },
      data: {
        moduleCode: "145",
        profession: "informatiker-efz-plattformentwicklung",
        pipeline: "CONTACTED",
        followUpAt: daysFromNow(-1), // ueberfaelliges Follow-up (Dashboard-Demo)
      },
    });
  }

  const sql = await bySubject("datenbanken-sql");
  if (sql) {
    await p.pensum.update({
      where: { id: sql.id },
      data: {
        moduleCode: "164",
        profession: "informatiker-efz-applikationsentwicklung",
        pipeline: "NEW",
      },
    });
  }

  const sys = await bySubject("systemtechnik-efz");
  if (sys) {
    await p.pensum.update({
      where: { id: sys.id },
      data: {
        moduleCode: "143",
        profession: "informatiker-efz-plattformentwicklung",
        pipeline: "NEW",
      },
    });
  }

  const counts = await p.pensum.groupBy({ by: ["pipeline"], _count: true });
  console.log("Pipeline-Verteilung:", counts.map((c) => `${c.pipeline}=${c._count}`).join(", "));
  console.log(`MATCHED gesetzt: ${matched.count}`);
}

main().finally(() => p.$disconnect());
