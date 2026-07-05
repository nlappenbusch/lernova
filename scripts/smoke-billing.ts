// Smoke-Test Billing-Engine: PDF-Rendering, QR-Referenz, Mahnlauf, closeMonth-Guards.
// Ausfuehren: npx tsx scripts/smoke-billing.ts
// Hinweis: relative Imports (tsx loest den "@/"-Alias nicht auf).

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { prisma } from "../src/lib/db";
import { closeMonth, generateInvoicePdf } from "../src/lib/billing";
import { runDunning } from "../src/lib/dunning";
import { isValidQrReference } from "../src/lib/swiss";
import { currentMonth, monthLabel } from "../src/lib/format";

let failures = 0;

function check(label: string, ok: boolean, detail = ""): void {
  console.log(`${ok ? "OK  " : "FAIL"}  ${label}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures += 1;
}

async function main(): Promise<void> {
  console.log("=== Smoke-Test Billing-Engine ===\n");

  // --- 1) PDF-Generierung (erste Invoice der DB) ---
  const invoice = await prisma.invoice.findFirst({ orderBy: { createdAt: "asc" } });
  if (!invoice) {
    check("Invoice in der DB vorhanden (zuerst `npm run db:seed`)", false);
    process.exitCode = 1;
    return;
  }
  console.log(`Rechnung: ${invoice.number} (${invoice.year}-${invoice.month}), Status ${invoice.status}`);

  const pdf = await generateInvoicePdf(invoice.id);
  const dir = join(process.cwd(), "data", "invoices");
  mkdirSync(dir, { recursive: true });
  const file = join(dir, `smoke-${invoice.number}.pdf`);
  writeFileSync(file, pdf);
  console.log(`PDF geschrieben: ${file} (${pdf.length} Bytes)`);

  check("QR-Referenz gueltig (isValidQrReference)", isValidQrReference(invoice.reference), invoice.reference);
  check("PDF groesser als 10 KB", pdf.length > 10 * 1024, `${pdf.length} Bytes`);
  check('PDF-Magic "%PDF"', pdf.subarray(0, 4).toString("ascii") === "%PDF");

  // --- 2) Mahnlauf (Seed: ueberfaellige Rechnung mit Mahnstufe 1 von vor 7 Tagen) ---
  console.log("\n--- Mahnlauf ---");
  const dunningResult = await runDunning();
  console.log(JSON.stringify(dunningResult, null, 2));
  check("Mahnlauf: mindestens 1 ueberfaellige Rechnung geprueft", dunningResult.checkedInvoices >= 1);

  const level2Sent = dunningResult.dunningsSent.find((d) => d.level === 2);
  if (level2Sent) {
    check("Mahnstufe 2 verschickt", true, `${level2Sent.invoiceNumber} -> ${level2Sent.to}`);
  } else {
    // Idempotenz: bei erneutem Lauf existiert Stufe 2 bereits aus einem frueheren Lauf.
    const existingLevel2 = await prisma.dunning.count({ where: { level: 2 } });
    check(
      "Mahnstufe 2 verschickt (oder bereits in fruehem Lauf erzeugt)",
      existingLevel2 > 0,
      existingLevel2 > 0 ? "bereits vorhanden (frueherer Smoke-Lauf)" : "keine Stufe-2-Mahnung"
    );
  }

  // --- 3) closeMonth-Guards ---
  console.log("\n--- closeMonth-Guards ---");
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  const adminId = admin?.id ?? "unbekannt";

  const cur = currentMonth();
  try {
    await closeMonth(cur.year, cur.month, adminId);
    check(`Guard: laufender Monat (${monthLabel(cur.year, cur.month)}) wirft`, false, "hat NICHT geworfen");
  } catch (e) {
    check(
      `Guard: laufender Monat (${monthLabel(cur.year, cur.month)}) wirft`,
      true,
      e instanceof Error ? e.message : String(e)
    );
  }

  const closed = await prisma.monthClose.findFirst({ orderBy: [{ year: "desc" }, { month: "desc" }] });
  if (!closed) {
    check("Guard: bereits geschlossener Monat wirft", false, "kein MonthClose in der DB");
  } else {
    try {
      await closeMonth(closed.year, closed.month, adminId);
      check(
        `Guard: bereits geschlossener Monat (${monthLabel(closed.year, closed.month)}) wirft`,
        false,
        "hat NICHT geworfen"
      );
    } catch (e) {
      check(
        `Guard: bereits geschlossener Monat (${monthLabel(closed.year, closed.month)}) wirft`,
        true,
        e instanceof Error ? e.message : String(e)
      );
    }
  }

  // --- Fazit ---
  if (dunningResult.dunningsSent.length > 0) {
    console.log(
      `\nHinweis: Der Mahnlauf hat ${dunningResult.dunningsSent.length} Dunning-Eintrag/-Eintraege + EmailLog(s) in der DB angelegt (gewollt, kein Reset noetig).`
    );
  }
  console.log(failures === 0 ? "\nAlle Checks gruen." : `\n${failures} Check(s) fehlgeschlagen.`);
  process.exitCode = failures === 0 ? 0 : 1;
}

main()
  .catch((e) => {
    console.error("Smoke-Test abgebrochen:", e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
