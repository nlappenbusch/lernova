// Seed: Demo-Daten fuer Entwicklung & Abnahme.
// Login Admin:  admin@lernova.ch  / admin123!
// Login Tutor:  tutor@lernova.ch  / tutor123!

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { qrReference } from "../src/lib/swiss";
import { findBySlug } from "../src/lib/plz";

const prisma = new PrismaClient();

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(17, 0, 0, 0);
  return d;
}

function daysFromNow(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

function monthShift(shift: number): { year: number; month: number } {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() + shift);
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

/** Datum am `day`. Tag innerhalb des Monats (year, month 1-12). */
function dateIn(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day, 17, 0, 0, 0);
}

function itemAmount(minutes: number, rate: number): number {
  return Math.round((minutes * rate) / 60);
}

function roundTo5(rappen: number): number {
  return Math.round(rappen / 5) * 5;
}

async function main() {
  console.log("Seeding …");

  // --- Clean (Dev-Reset) ---
  await prisma.dunning.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.payout.deleteMany();
  await prisma.timeEntry.deleteMany();
  await prisma.monthClose.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.application.deleteMany();
  await prisma.pensum.deleteMany();
  await prisma.emailLog.deleteMany();
  await prisma.user.deleteMany();

  const pw = (s: string) => bcrypt.hashSync(s, 10);
  const loc = (slug: string) => {
    const e = findBySlug(slug);
    if (!e) throw new Error(`PLZ-Slug nicht gefunden: ${slug}`);
    return e;
  };

  // --- Users ---
  const zh = loc("zuerich");
  const admin = await prisma.user.create({
    data: {
      email: "admin@lernova.ch",
      passwordHash: pw("admin123!"),
      role: "ADMIN",
      name: "Nils Lappenbusch",
      city: zh.name,
      plz: zh.plz,
    },
  });

  const tutorDefs = [
    {
      email: "tutor@lernova.ch",
      name: "Dario Meier",
      locSlug: "zuerich",
      radiusKm: 25,
      subjects: ["programmieren-python", "programmieren-java", "web-entwicklung", "mathematik"],
      bio: "Informatik-Student ETH (MSc), 4 Jahre Erfahrung als Tutor. Schwerpunkt Python, Java und Webprojekte für Lernende und Gymis.",
    },
    {
      email: "sarah.keller@lernova.ch",
      name: "Sarah Keller",
      locSlug: "winterthur",
      radiusKm: 30,
      subjects: ["mathematik", "physik", "statistik"],
      bio: "MSc Mathematik UZH. Spezialisiert auf Matura-Vorbereitung und Statistik im Studium (R, SPSS).",
    },
    {
      email: "luca.bernasconi@lernova.ch",
      name: "Luca Bernasconi",
      locSlug: "bern",
      radiusKm: 25,
      subjects: ["applikationsentwicklung-efz", "javascript-typescript", "datenbanken-sql"],
      bio: "Applikationsentwickler EFZ mit BMS, heute Full-Stack-Dev. Begleitet Lernende durch Module und IPA.",
    },
    {
      email: "elena.favre@lernova.ch",
      name: "Elena Favre",
      locSlug: "basel",
      radiusKm: 20,
      subjects: ["franzoesisch", "deutsch", "englisch"],
      bio: "Zweisprachig (DE/FR) aufgewachsen, Lehrdiplom Sek I. DELF- und Cambridge-Vorbereitung.",
    },
    {
      email: "jonas.wyss@lernova.ch",
      name: "Jonas Wyss",
      locSlug: "zug",
      radiusKm: 35,
      subjects: ["netzwerktechnik", "systemtechnik-efz", "linux-systemadministration"],
      bio: "Systemtechniker EFZ, CCNA, heute System Engineer. Netzwerk- und Linux-Module verständlich erklärt.",
    },
    {
      email: "mia.graf@lernova.ch",
      name: "Mia Graf",
      locSlug: "luzern",
      radiusKm: 25,
      subjects: ["rechnungswesen", "wirtschaft-und-recht", "mathematik"],
      bio: "Betriebsökonomin FH, ehemals KV-Lernende. Rechnungswesen bis zur QV-Sicherheit.",
    },
  ];

  const tutors: Record<string, { id: string }> = {};
  for (const t of tutorDefs) {
    const e = loc(t.locSlug);
    tutors[t.email] = await prisma.user.create({
      data: {
        email: t.email,
        passwordHash: pw(t.email === "tutor@lernova.ch" ? "tutor123!" : "lernova123!"),
        role: "TUTOR",
        name: t.name,
        city: e.name,
        plz: e.plz,
        lat: e.lat,
        lng: e.lng,
        radiusKm: t.radiusKm,
        subjects: JSON.stringify(t.subjects),
        bio: t.bio,
        iban: "CH9300762011623852957",
      },
    });
  }
  const tutorDario = tutors["tutor@lernova.ch"];
  const tutorSarah = tutors["sarah.keller@lernova.ch"];
  const tutorLuca = tutors["luca.bernasconi@lernova.ch"];

  // --- Offene Pensen (Leads) ---
  const openPensen: Array<{
    subject: string;
    level: string;
    locSlug: string;
    customerName: string;
    description: string;
    lessonsPerWeek?: number;
    rateCustomer?: number;
    rateTutor?: number;
  }> = [
    {
      subject: "programmieren-java",
      level: "lernende",
      locSlug: "zuerich",
      customerName: "Familie Steiner",
      description:
        "Sohn (2. Lehrjahr Applikationsentwicklung EFZ) braucht Unterstützung in Java/OOP für Modul 320. Ziel: Kompetenznachweis Ende Semester.",
    },
    {
      subject: "netzwerktechnik",
      level: "lernende",
      locSlug: "winterthur",
      customerName: "M. Odermatt",
      description:
        "Systemtechnik-Lernender, 3. Lehrjahr. Subnetting und Routing sitzen nicht — Vorbereitung auf Modulprüfung 145 nötig.",
    },
    {
      subject: "mathematik",
      level: "gymnasium",
      locSlug: "uster",
      customerName: "Familie Huber",
      description: "Tochter im 4. Gymi (Kurzzeit), Analysis und Vektorgeometrie. 1× pro Woche, langfristig bis Matura.",
      lessonsPerWeek: 1,
    },
    {
      subject: "programmieren-python",
      level: "studierende",
      locSlug: "zuerich",
      customerName: "L. Meyer",
      description:
        "Wirtschaftsstudentin UZH, Modul 'Programming for Business'. Python-Grundlagen + Pandas. Eher intensiv vor Prüfungsphase.",
      lessonsPerWeek: 2,
    },
    {
      subject: "datenbanken-sql",
      level: "lernende",
      locSlug: "zug",
      customerName: "Familie Iten",
      description: "Informatik-Lernender (1. Lehrjahr), Modul 164/165. SQL-Joins und Normalisierung festigen.",
    },
    {
      subject: "rechnungswesen",
      level: "lernende",
      locSlug: "luzern",
      customerName: "Familie Arnold",
      description: "KV-Lernende, 2. Lehrjahr. W&G/Rechnungswesen — Abschlussbuchungen und Mehrwertsteuer. QV in einem Jahr.",
    },
    {
      subject: "javascript-typescript",
      level: "studierende",
      locSlug: "bern",
      customerName: "T. Zbinden",
      description: "Student BFH Informatik. Web-Programmierung-Modul: JavaScript async/await, Fetch, DOM. Semesterprojekt steht an.",
    },
    {
      subject: "franzoesisch",
      level: "sekundarschule",
      locSlug: "basel",
      customerName: "Familie Rossi",
      description: "Sohn Sek A, 8. Klasse. Französisch-Grammatik und Wortschatz, Ziel Notenschnitt 4.5 fürs Gymi.",
    },
    {
      subject: "systemtechnik-efz",
      level: "lernende",
      locSlug: "baden",
      customerName: "Familie Keller",
      description:
        "Lernender Plattformentwicklung, 2. Lehrjahr. Virtualisierung (Modul 143) und Linux-Server. Betrieb unterstützt Nachhilfe.",
    },
    {
      subject: "statistik",
      level: "studierende",
      locSlug: "st-gallen",
      customerName: "N. Brunner",
      description: "HSG-Studentin, Statistik-Assessment. Hypothesentests und Regressionen — Prüfung in 10 Wochen.",
      lessonsPerWeek: 2,
    },
    {
      subject: "informatik-grundlagen",
      level: "gymnasium",
      locSlug: "thalwil",
      customerName: "Familie Weber",
      description: "Sohn im Gymnasium (Schwerpunkt MINT). Informatik-Grundlagen: Algorithmen, Python-Einstieg. Neugierig, aber Stoff geht zu schnell.",
    },
    {
      subject: "web-entwicklung",
      level: "erwachsene",
      locSlug: "aarau",
      customerName: "C. Schmid",
      description: "Quereinsteigerin in Weiterbildung (CAS Frontend). HTML/CSS/JS-Basics festigen, Portfolio-Projekt begleiten.",
    },
  ];

  const openPensumIds: string[] = [];
  for (const p of openPensen) {
    const e = loc(p.locSlug);
    const created = await prisma.pensum.create({
      data: {
        subject: p.subject,
        level: p.level,
        description: p.description,
        customerName: p.customerName,
        customerEmail: `${p.customerName.toLowerCase().replace(/[^a-z]+/g, ".")}@example.ch`,
        customerPhone: "+41 79 000 00 00",
        plz: e.plz,
        city: e.name,
        lat: e.lat,
        lng: e.lng,
        lessonsPerWeek: p.lessonsPerWeek ?? 1,
        rateCustomer: p.rateCustomer ?? 7500,
        rateTutor: p.rateTutor ?? 4500,
        status: "OPEN",
        pipeline: "PUBLISHED",
        createdAt: daysAgo(Math.floor(Math.random() * 14) + 1),
      },
    });
    openPensumIds.push(created.id);
  }

  // Eine offene Bewerbung von Luca auf das Java-Pensum (Demo fuer Admin-Freigabe)
  await prisma.application.create({
    data: {
      pensumId: openPensumIds[0],
      tutorId: tutorLuca.id,
      message:
        "Hoi! Ich habe die Lehre als Applikationsentwickler selbst gemacht und Modul 320 unterrichte ich regelmässig. Java/OOP ist mein Kerngebiet — ich könnte Di/Do ab 17:30.",
      status: "PENDING",
    },
  });

  // --- Vertraege (vermittelte Pensen) ---
  const { year: curY, month: curM } = monthShift(0);
  const prev = monthShift(-1);
  const prevPrev = monthShift(-2);

  async function createContract(opts: {
    tutorId: string;
    subject: string;
    level: string;
    locSlug: string;
    customerName: string;
    customerEmail: string;
    description: string;
    startDaysAgo: number;
  }) {
    const e = loc(opts.locSlug);
    const pensum = await prisma.pensum.create({
      data: {
        subject: opts.subject,
        level: opts.level,
        description: opts.description,
        customerName: opts.customerName,
        customerEmail: opts.customerEmail,
        customerPhone: "+41 79 111 22 33",
        street: "Musterweg 5",
        plz: e.plz,
        city: e.name,
        lat: e.lat,
        lng: e.lng,
        rateCustomer: 7500,
        rateTutor: 4500,
        status: "MATCHED",
        pipeline: "MATCHED",
        createdAt: daysAgo(opts.startDaysAgo + 7),
      },
    });
    await prisma.application.create({
      data: {
        pensumId: pensum.id,
        tutorId: opts.tutorId,
        message: "Bewerbung (Seed)",
        status: "ACCEPTED",
      },
    });
    return prisma.contract.create({
      data: {
        pensumId: pensum.id,
        tutorId: opts.tutorId,
        rateCustomer: 7500,
        rateTutor: 4500,
        startDate: daysAgo(opts.startDaysAgo),
        status: "ACTIVE",
      },
    });
  }

  const c1 = await createContract({
    tutorId: tutorDario.id,
    subject: "programmieren-python",
    level: "lernende",
    locSlug: "zuerich",
    customerName: "Familie Brunner",
    customerEmail: "familie.brunner@example.ch",
    description: "Informatik-Lernender (2. Lehrjahr), Python-Module und üK-Vorbereitung.",
    startDaysAgo: 80,
  });
  const c2 = await createContract({
    tutorId: tutorDario.id,
    subject: "mathematik",
    level: "gymnasium",
    locSlug: "kuesnacht",
    customerName: "Familie Widmer",
    customerEmail: "familie.widmer@example.ch",
    description: "Tochter im 5. Gymi, Analysis & Stochastik bis zur Matura.",
    startDaysAgo: 50,
  });
  const c3 = await createContract({
    tutorId: tutorSarah.id,
    subject: "statistik",
    level: "studierende",
    locSlug: "winterthur",
    customerName: "J. Kunz",
    customerEmail: "j.kunz@example.ch",
    description: "ZHAW-Student, Statistik 2. Semester.",
    startDaysAgo: 45,
  });

  // --- TimeEntries ---
  async function entry(
    contractId: string,
    tutorId: string,
    y: number,
    m: number,
    day: number,
    minutes: number,
    notes: string
  ) {
    return prisma.timeEntry.create({
      data: { contractId, tutorId, date: dateIn(y, m, day), minutes, notes },
    });
  }

  // Vor-Vormonat (c1) — bereits abgeschlossen & fakturiert, Rechnung ueberfaellig
  const c1PP = [
    await entry(c1.id, tutorDario.id, prevPrev.year, prevPrev.month, 4, 90, "- Wiederholung Grundlagen: Variablen, Schleifen\n- Übungsserie Modul 319 gestartet"),
    await entry(c1.id, tutorDario.id, prevPrev.year, prevPrev.month, 11, 90, "- Funktionen & Parameter\n- **Hausaufgabe**: Übungsblatt 3"),
    await entry(c1.id, tutorDario.id, prevPrev.year, prevPrev.month, 18, 120, "- Listen & Dictionaries\n- Mini-Projekt: Notenrechner in `python`"),
    await entry(c1.id, tutorDario.id, prevPrev.year, prevPrev.month, 25, 90, "- Vorbereitung Kompetenznachweis\n- Probeprüfung durchgespielt: 4.8 ✅"),
  ];

  // Vormonat — abgeschlossen & fakturiert
  const c1P = [
    await entry(c1.id, tutorDario.id, prev.year, prev.month, 2, 90, "- OOP-Einstieg: Klassen & Objekte\n- Beispiel `BankAccount` implementiert"),
    await entry(c1.id, tutorDario.id, prev.year, prev.month, 9, 90, "- Vererbung & Polymorphismus\n- Übungen aus üK-Unterlagen"),
    await entry(c1.id, tutorDario.id, prev.year, prev.month, 16, 120, "- Projektarbeit: To-Do-App (CLI)\n- Git-Grundlagen nebenbei erklärt"),
    await entry(c1.id, tutorDario.id, prev.year, prev.month, 23, 90, "- Exceptions & File-IO\n- Wiederholung für Modultest"),
  ];
  const c2P = [
    await entry(c2.id, tutorDario.id, prev.year, prev.month, 5, 90, "- Ableitungsregeln (Produkt-/Kettenregel)\n- Kurvendiskussion Schritt für Schritt"),
    await entry(c2.id, tutorDario.id, prev.year, prev.month, 12, 90, "- Extremwertaufgaben\n- Prüfungsaufgaben Gymi Küsnacht 2024"),
    await entry(c2.id, tutorDario.id, prev.year, prev.month, 19, 90, "- Integralrechnung Einstieg\n- Stammfunktionen-Training"),
  ];
  const c3P = [
    await entry(c3.id, tutorSarah.id, prev.year, prev.month, 6, 120, "- Deskriptive Statistik Wiederholung\n- Erste Schritte in **R**"),
    await entry(c3.id, tutorSarah.id, prev.year, prev.month, 20, 120, "- Hypothesentests: t-Test, Chi-Quadrat\n- Übungsserie 4 gelöst"),
  ];

  // Aktueller Monat — offen, editierbar
  await entry(c1.id, tutorDario.id, curY, curM, 2, 90, "- Modul 320: UML-Klassendiagramme\n- Umsetzung in Java begonnen");
  await entry(c2.id, tutorDario.id, curY, curM, 3, 90, "- Stochastik: Binomialverteilung\n- Aufgabenserie 7");

  // --- Monatsabschluesse ---
  await prisma.monthClose.create({
    data: { year: prevPrev.year, month: prevPrev.month, closedById: admin.id, closedAt: dateIn(prev.year, prev.month, 1) },
  });
  await prisma.monthClose.create({
    data: { year: prev.year, month: prev.month, closedById: admin.id, closedAt: dateIn(curY, curM, 1) },
  });

  // --- Rechnungen ---
  let invoiceSeq = 0;
  async function createInvoice(opts: {
    contractId: string;
    y: number;
    m: number;
    entries: Array<{ id: string; date: Date; minutes: number; notes: string }>;
    rate: number;
    issueDate: Date;
    dueDate: Date;
    status: "OPEN" | "PAID";
    paidAt?: Date;
    subjectLabel: string;
  }) {
    invoiceSeq += 1;
    const number = `${opts.y}-${String(invoiceSeq).padStart(4, "0")}`;
    const refBase = `${opts.y}${String(opts.m).padStart(2, "0")}${String(invoiceSeq).padStart(6, "0")}`;
    const items = opts.entries.map((e) => ({
      timeEntryId: e.id,
      date: e.date,
      description: `Nachhilfe ${opts.subjectLabel} — ${e.minutes} Min.`,
      minutes: e.minutes,
      rate: opts.rate,
      amount: itemAmount(e.minutes, opts.rate),
    }));
    const amount = roundTo5(items.reduce((s, i) => s + i.amount, 0));
    return prisma.invoice.create({
      data: {
        number,
        contractId: opts.contractId,
        year: opts.y,
        month: opts.m,
        amount,
        reference: qrReference(refBase),
        issueDate: opts.issueDate,
        dueDate: opts.dueDate,
        status: opts.status,
        paidAt: opts.paidAt,
        items: { create: items },
      },
    });
  }

  // Ueberfaellige Rechnung (Vor-Vormonat, c1) → Mahnwesen-Demo
  const overdueInvoice = await createInvoice({
    contractId: c1.id,
    y: prevPrev.year,
    m: prevPrev.month,
    entries: c1PP,
    rate: 7500,
    issueDate: daysAgo(45),
    dueDate: daysAgo(15),
    status: "OPEN",
    subjectLabel: "Python",
  });
  await prisma.dunning.create({
    data: { invoiceId: overdueInvoice.id, level: 1, sentAt: daysAgo(7) },
  });
  await prisma.emailLog.create({
    data: {
      to: "familie.brunner@example.ch",
      subject: `Zahlungserinnerung: Rechnung ${overdueInvoice.number}`,
      body: "Freundliche Erinnerung an die offene Rechnung. (Seed)",
      kind: "dunning-1",
    },
  });

  // Vormonat: c1 offen (noch nicht faellig), c2 bezahlt, c3 offen
  await createInvoice({
    contractId: c1.id,
    y: prev.year,
    m: prev.month,
    entries: c1P,
    rate: 7500,
    issueDate: dateIn(curY, curM, 1),
    dueDate: daysFromNow(25),
    status: "OPEN",
    subjectLabel: "Python",
  });
  await createInvoice({
    contractId: c2.id,
    y: prev.year,
    m: prev.month,
    entries: c2P,
    rate: 7500,
    issueDate: dateIn(curY, curM, 1),
    dueDate: daysFromNow(25),
    status: "PAID",
    paidAt: daysAgo(1),
    subjectLabel: "Mathematik",
  });
  await createInvoice({
    contractId: c3.id,
    y: prev.year,
    m: prev.month,
    entries: c3P,
    rate: 7500,
    issueDate: dateIn(curY, curM, 1),
    dueDate: daysFromNow(25),
    status: "OPEN",
    subjectLabel: "Statistik",
  });

  // --- Payouts ---
  const payoutFor = async (tutorId: string, y: number, m: number, entries: Array<{ minutes: number }>, status: "PENDING" | "PAID") => {
    const minutes = entries.reduce((s, e) => s + e.minutes, 0);
    const amount = roundTo5(itemAmount(minutes, 4500));
    await prisma.payout.create({
      data: { tutorId, year: y, month: m, minutes, amount, status, paidAt: status === "PAID" ? daysAgo(20) : null },
    });
  };
  await payoutFor(tutorDario.id, prevPrev.year, prevPrev.month, c1PP, "PAID");
  await payoutFor(tutorDario.id, prev.year, prev.month, [...c1P, ...c2P], "PENDING");
  await payoutFor(tutorSarah.id, prev.year, prev.month, c3P, "PENDING");

  const counts = {
    users: await prisma.user.count(),
    pensen: await prisma.pensum.count(),
    contracts: await prisma.contract.count(),
    timeEntries: await prisma.timeEntry.count(),
    invoices: await prisma.invoice.count(),
    payouts: await prisma.payout.count(),
  };
  console.log("Seed fertig:", counts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
