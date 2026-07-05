// Seiten-Smoke: rendert alle wichtigen Seiten serverseitig (SSR) mit echten
// Sessions und prueft Kern-Inhalte + Seiten-Guards (Redirects).
// Aufruf: npx tsx scripts/e2e-pages.ts

const BASE = "http://localhost:3210";

let passed = 0;
let failed = 0;
const failures: string[] = [];

function check(name: string, ok: boolean, detail?: string) {
  if (ok) {
    passed += 1;
    console.log(`  OK   ${name}`);
  } else {
    failed += 1;
    failures.push(`${name}${detail ? ` — ${detail}` : ""}`);
    console.log(`  FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

async function login(email: string, password: string): Promise<string> {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const setCookie = res.headers.get("set-cookie") ?? "";
  const match = setCookie.match(/lernova_session=[^;]+/);
  if (!match) throw new Error(`Login fehlgeschlagen: ${email}`);
  return match[0];
}

async function page(path: string, cookie?: string) {
  const res = await fetch(`${BASE}${path}`, {
    headers: cookie ? { Cookie: cookie } : {},
    redirect: "follow",
  });
  const html = await res.text();
  return { status: res.status, url: res.url, html };
}

async function main() {
  const tutor = await login("tutor@lernova.ch", "tutor123!");
  const admin = await login("admin@lernova.ch", "admin123!");

  console.log("— Public-Seiten —");
  for (const [path, marker] of [
    ["/", "Nachhilfe"],
    ["/nachhilfe", "Fächer"],
    ["/anfrage", "Anfrage"],
    ["/fuer-tutoren", "Tutor"],
    ["/impressum", "Impressum"],
    ["/datenschutz", "Datenschutz"],
    ["/login", "Anmelden"],
  ] as const) {
    const r = await page(path);
    check(`${path} rendert`, r.status === 200 && r.html.includes(marker), `status=${r.status}`);
  }

  console.log("— Seiten-Guards —");
  {
    const anon = await page("/tutor/pensen");
    check("Anonym auf /tutor -> Login-Redirect", anon.url.includes("/login"), anon.url);

    const anonAdmin = await page("/admin/rechnungen");
    check("Anonym auf /admin -> Login-Redirect", anonAdmin.url.includes("/login"), anonAdmin.url);

    const tutorOnAdmin = await page("/admin", tutor);
    check(
      "Tutor auf /admin -> Redirect ins Tutor-Portal",
      tutorOnAdmin.url.includes("/tutor"),
      tutorOnAdmin.url
    );

    const adminOnTutor = await page("/tutor", admin);
    check(
      "Admin auf /tutor -> Redirect ins Admin-Portal",
      adminOnTutor.url.includes("/admin"),
      adminOnTutor.url
    );
  }

  console.log("— Tutor-Portal (SSR mit Session) —");
  for (const [path, marker] of [
    ["/tutor", "Dashboard"],
    ["/tutor/pensen", "Pensen"],
    ["/tutor/bewerbungen", "Bewerbung"],
    ["/tutor/vertraege", "Vertr"],
    ["/tutor/stunden", "Stunden"],
    ["/tutor/abrechnung", "Abrechnung"],
    ["/tutor/profil", "Profil"],
  ] as const) {
    const r = await page(path, tutor);
    check(`${path} rendert`, r.status === 200 && r.html.includes(marker), `status=${r.status}`);
  }
  {
    const dash = await page("/tutor", tutor);
    check(
      "Tutor-Dashboard zeigt KEINE fremden Tutoren",
      !dash.html.includes("Sarah Keller") && !dash.html.includes("Mia Graf")
    );
  }

  console.log("— Admin-Portal (SSR mit Session) —");
  for (const [path, marker] of [
    ["/admin", "Dashboard"],
    ["/admin/pensen", "Pensen"],
    ["/admin/bewerbungen", "Bewerbung"],
    ["/admin/vertraege", "Vertr"],
    ["/admin/stunden", "Stunden"],
    ["/admin/monatsabschluss", "Monatsabschluss"],
    ["/admin/rechnungen", "Rechnung"],
    ["/admin/mahnwesen", "Mahn"],
    ["/admin/auszahlungen", "Auszahlung"],
    ["/admin/tutoren", "Tutor"],
    ["/admin/emails", "Mail"],
  ] as const) {
    const r = await page(path, admin);
    check(`${path} rendert`, r.status === 200 && r.html.includes(marker), `status=${r.status}`);
  }

  console.log(`\nErgebnis: ${passed} OK, ${failed} FAIL`);
  if (failures.length) {
    for (const f of failures) console.log(`  - ${f}`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("Seiten-Smoke abgebrochen:", e);
  process.exit(1);
});
