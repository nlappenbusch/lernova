// E2E-API-Verifikation gegen den laufenden Dev-Server (Port 3210).
// Prueft: Public/SEO, Lead-Funnel, Auth, Multi-Tenancy, Radius-Feed,
// Bewerbungs-Flow, Time-Tracking inkl. Monatssperre, Billing-Guards,
// QR-PDF, Mahnlauf, Cron-Auth, CSV-Export.
//
// Aufruf: npx tsx scripts/e2e-api.ts

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

type Session = { cookie: string };

async function login(email: string, password: string): Promise<Session> {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(`Login ${email} fehlgeschlagen: ${res.status}`);
  const setCookie = res.headers.get("set-cookie") ?? "";
  const match = setCookie.match(/lernova_session=[^;]+/);
  if (!match) throw new Error(`Kein Session-Cookie fuer ${email}`);
  return { cookie: match[0] };
}

function jfetch(path: string, init: RequestInit = {}, session?: Session) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };
  if (session) headers["Cookie"] = session.cookie;
  return fetch(`${BASE}${path}`, { ...init, headers });
}

async function main() {
  const now = new Date();
  const curY = now.getFullYear();
  const curM = now.getMonth() + 1;
  const prev = curM === 1 ? { y: curY - 1, m: 12 } : { y: curY, m: curM - 1 };
  const pad = (n: number) => String(n).padStart(2, "0");

  const ids = JSON.parse(process.env.TEST_IDS ?? "{}") as {
    cDario: string;
    cSarah: string;
    inv: string;
    eSarah: string;
  };

  console.log("— Public & SEO —");
  {
    const res = await fetch(`${BASE}/`);
    const html = await res.text();
    check("Landingpage 200 + Brand", res.status === 200 && html.includes("Lernova"));
    check("Landingpage FAQ-JSON-LD", html.includes("FAQPage"));

    const seo = await fetch(`${BASE}/nachhilfe/programmieren-python/lernende/zuerich`);
    const seoHtml = await seo.text();
    check(
      "SEO-Seite Python/Lernende/Zuerich 200",
      seo.status === 200 && seoHtml.includes("Python") && seoHtml.includes("Zürich")
    );
    check("SEO-Seite JSON-LD Service+Breadcrumb", seoHtml.includes("BreadcrumbList"));

    const bad = await fetch(`${BASE}/nachhilfe/quantenheilung/lernende/zuerich`);
    check("Unbekanntes Fach -> 404", bad.status === 404);

    const sitemap = await fetch(`${BASE}/sitemap.xml`);
    const sitemapXml = await sitemap.text();
    check(
      "Sitemap enthaelt Ort-Seiten",
      sitemap.status === 200 && sitemapXml.includes("/nachhilfe/netzwerktechnik/lernende/")
    );

    const robots = await fetch(`${BASE}/robots.txt`);
    const robotsTxt = await robots.text();
    check("robots.txt sperrt /admin & /tutor", robotsTxt.includes("/admin") && robotsTxt.includes("/tutor"));
  }

  console.log("— Lead-Funnel —");
  {
    const res = await jfetch("/api/leads", {
      method: "POST",
      body: JSON.stringify({
        subject: "netzwerktechnik",
        level: "lernende",
        plz: "8400",
        city: "Winterthur",
        lessonsPerWeek: "1",
        description: "E2E-Test: Subnetting und Routing fuer Modulpruefung 145 festigen.",
        name: "E2E Testkunde",
        email: "e2e.testkunde@example.ch",
        privacy: true,
      }),
    });
    const body = await res.json();
    check("Lead anlegen -> ok", res.status === 200 && body.ok === true, JSON.stringify(body));

    const invalid = await jfetch("/api/leads", {
      method: "POST",
      body: JSON.stringify({
        subject: "netzwerktechnik",
        level: "lernende",
        plz: "8400",
        city: "Winterthur",
        description: "zu kurz?",
        name: "X",
        email: "keine-mail",
        privacy: false,
      }),
    });
    check("Lead-Validierung -> 400", invalid.status === 400);
  }

  console.log("— Auth & Tenancy-Grundschutz —");
  {
    const noAuth = await fetch(`${BASE}/api/tutor/pensen?radius=50`);
    check("Feed ohne Login -> 401", noAuth.status === 401);

    const badLogin = await jfetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "tutor@lernova.ch", password: "falsch" }),
    });
    check("Falsches Passwort -> 401", badLogin.status === 401);
  }

  const tutor = await login("tutor@lernova.ch", "tutor123!");
  const admin = await login("admin@lernova.ch", "admin123!");
  console.log("— Tutor: Umkreissuche & Bewerbung —");
  let leadPensumId = "";
  {
    const res = await jfetch("/api/tutor/pensen?radius=50", {}, tutor);
    const body = await res.json();
    const items: any[] = body.items ?? body.pensen ?? [];
    check("Radius-Feed 200 + Ergebnisse", res.status === 200 && items.length > 0, `count=${items.length}`);

    const withDistance = items.filter((i) => typeof i.distanceKm === "number");
    check("Feed enthaelt Distanzen (Haversine)", withDistance.length > 0);

    const leak = items.some(
      (i) =>
        "customerName" in i || "customerEmail" in i || "customerPhone" in i || "rateCustomer" in i
    );
    check("KEINE Kundendaten/Kundenrate im Feed (Security)", !leak);

    const testLead = items.find((i) => i.subject === "netzwerktechnik" && i.plz === "8400");
    check("Neuer Lead erscheint im Feed (Winterthur, ~20km)", Boolean(testLead));
    leadPensumId = testLead?.id ?? "";

    if (leadPensumId) {
      const apply = await jfetch(
        "/api/tutor/applications",
        {
          method: "POST",
          body: JSON.stringify({
            pensumId: leadPensumId,
            message: "E2E-Test: Ich unterrichte Netzwerktechnik seit 4 Jahren und kenne Modul 145 im Detail.",
          }),
        },
        tutor
      );
      check("Bewerbung anlegen -> 201", apply.status === 201);

      const again = await jfetch(
        "/api/tutor/applications",
        {
          method: "POST",
          body: JSON.stringify({ pensumId: leadPensumId, message: "Doppelte Bewerbung sollte scheitern." }),
        },
        tutor
      );
      check("Doppelbewerbung -> 409", again.status === 409);
    }
  }

  console.log("— Tutor: Time-Tracking & Monatssperre —");
  let createdEntryId = "";
  {
    const res = await jfetch(
      "/api/tutor/time-entries",
      {
        method: "POST",
        body: JSON.stringify({
          contractId: ids.cDario,
          date: `${curY}-${pad(curM)}-01`,
          minutes: 60,
          notes: "- E2E-Test-Eintrag\n- **Markdown** funktioniert",
        }),
      },
      tutor
    );
    const body = await res.json().catch(() => ({}));
    createdEntryId = body.id ?? body.entry?.id ?? "";
    check("Eintrag im offenen Monat -> ok", res.status === 200 || res.status === 201, JSON.stringify(body).slice(0, 200));

    const locked = await jfetch(
      "/api/tutor/time-entries",
      {
        method: "POST",
        body: JSON.stringify({
          contractId: ids.cDario,
          date: `${prev.y}-${pad(prev.m)}-15`,
          minutes: 60,
          notes: "Darf nicht klappen — Monat ist abgeschlossen.",
        }),
      },
      tutor
    );
    check("Eintrag im geschlossenen Monat -> abgelehnt", locked.status === 409 || locked.status === 400, `status=${locked.status}`);

    const foreignContract = await jfetch(
      "/api/tutor/time-entries",
      {
        method: "POST",
        body: JSON.stringify({
          contractId: ids.cSarah,
          date: `${curY}-${pad(curM)}-01`,
          minutes: 60,
          notes: "Fremder Vertrag — muss scheitern.",
        }),
      },
      tutor
    );
    check("Eintrag auf fremden Vertrag -> 404 (Tenancy)", foreignContract.status === 404, `status=${foreignContract.status}`);

    const foreignPatch = await jfetch(
      `/api/tutor/time-entries/${ids.eSarah}`,
      { method: "PATCH", body: JSON.stringify({ minutes: 90 }) },
      tutor
    );
    check("PATCH auf fremden Eintrag -> 404 (Tenancy)", foreignPatch.status === 404, `status=${foreignPatch.status}`);

    if (createdEntryId) {
      const patch = await jfetch(
        `/api/tutor/time-entries/${createdEntryId}`,
        { method: "PATCH", body: JSON.stringify({ minutes: 90 }) },
        tutor
      );
      check("Eigenen Eintrag editieren -> ok", patch.status === 200);

      const del = await jfetch(`/api/tutor/time-entries/${createdEntryId}`, { method: "DELETE" }, tutor);
      check("Eigenen Eintrag loeschen -> ok", del.status === 200, `status=${del.status}`);
    }
  }

  console.log("— Rollen-Trennung —");
  {
    const asTutor = await jfetch(`/api/admin/invoices/${ids.inv}/pdf`, {}, tutor);
    check("Tutor auf Admin-PDF -> 401 (Security)", asTutor.status === 401, `status=${asTutor.status}`);

    const csvAsTutor = await jfetch(`/api/admin/payouts/export?year=${prev.y}&month=${prev.m}`, {}, tutor);
    check("Tutor auf Payout-CSV -> 401 (Security)", csvAsTutor.status === 401, `status=${csvAsTutor.status}`);

    const monthCloseAsTutor = await jfetch(
      "/api/admin/month-close",
      { method: "POST", body: JSON.stringify({ year: prev.y, month: prev.m }) },
      tutor
    );
    check("Tutor auf Monatsabschluss -> 401 (Security)", monthCloseAsTutor.status === 401);
  }

  console.log("— Admin: Billing, PDF, Mahnlauf, Export —");
  {
    const closeCurrent = await jfetch(
      "/api/admin/month-close",
      { method: "POST", body: JSON.stringify({ year: curY, month: curM }) },
      admin
    );
    const closeBody = await closeCurrent.json().catch(() => ({}));
    check(
      "Laufenden Monat abschliessen -> Guard-Fehler",
      closeCurrent.status >= 400 && typeof closeBody.error === "string",
      JSON.stringify(closeBody).slice(0, 120)
    );

    const closeAgain = await jfetch(
      "/api/admin/month-close",
      { method: "POST", body: JSON.stringify({ year: prev.y, month: prev.m }) },
      admin
    );
    check("Bereits geschlossenen Monat -> Guard-Fehler", closeAgain.status >= 400);

    const pdf = await jfetch(`/api/admin/invoices/${ids.inv}/pdf`, {}, admin);
    const pdfBytes = Buffer.from(await pdf.arrayBuffer());
    check(
      "Rechnungs-PDF (Swiss QR) -> %PDF, >10kb",
      pdf.status === 200 && pdfBytes.subarray(0, 4).toString() === "%PDF" && pdfBytes.length > 10000,
      `status=${pdf.status} size=${pdfBytes.length}`
    );

    const dunning = await jfetch("/api/admin/dunning/run", { method: "POST" }, admin);
    const dunningBody = await dunning.json().catch(() => ({}));
    check(
      "Mahnlauf laeuft (idempotent)",
      dunning.status === 200 && typeof (dunningBody.checkedInvoices ?? dunningBody.result?.checkedInvoices) === "number",
      JSON.stringify(dunningBody).slice(0, 160)
    );

    const csv = await jfetch(`/api/admin/payouts/export?year=${prev.y}&month=${prev.m}`, {}, admin);
    const csvText = await csv.text();
    check(
      "Payout-CSV-Export",
      csv.status === 200 && csvText.includes(";") && csvText.toLowerCase().includes("iban"),
      csvText.split("\n")[0]
    );
  }

  console.log("— Cron-Mahnlauf —");
  {
    const wrongKey = await fetch(`${BASE}/api/cron/dunning?key=falscher-key`);
    check("Cron mit falschem Key -> 401", wrongKey.status === 401);

    const rightKey = await fetch(`${BASE}/api/cron/dunning?key=lernova-cron-dev`);
    check("Cron mit richtigem Key -> 200", rightKey.status === 200);
  }

  console.log(`\nErgebnis: ${passed} OK, ${failed} FAIL`);
  if (failures.length) {
    console.log("Fehlgeschlagen:");
    for (const f of failures) console.log(`  - ${f}`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("E2E-Suite abgebrochen:", e);
  process.exit(1);
});
