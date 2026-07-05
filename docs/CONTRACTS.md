# Lernova — Entwickler-Kontrakte (Pflichtlektüre für alle Agenten)

**Projekt:** Lernova — „Die moderne Nachhilfe-Engine der Schweiz". Vermittlungs- und
Verwaltungsplattform für lokale 1:1-Vor-Ort-Nachhilfe mit ICT-Schwerpunkt
(Lernende EFZ, Sek, Gymnasium, Studierende). KEIN Video-Portal.

**Sprache der UI: Deutsch (de-CH).** Kein „ß" verwenden (Schweiz: „ss"). Beträge in CHF.

## Stack & Versionen (fix — package.json NICHT ändern)
- Next.js 16 (App Router), React 19, TypeScript (strict)
- Tailwind CSS v4 (Tokens via `@theme` in `src/app/globals.css`)
- Prisma 6 + SQLite (Dev). **Keine Prisma-Enums** (SQLite) — Status sind Strings, Werte in `src/lib/types.ts`
- zod v4, lucide-react, framer-motion (nur in `"use client"`-Dateien), react-markdown
- pdfkit + swissqrbill (nur Billing-Engine)

### Next-16-Gotchas
- `params`/`searchParams` in Pages/Routes sind **Promises**: `{ params }: { params: Promise<{ fach: string }> }` → `const { fach } = await params;`
- `cookies()` ist async (bereits in `lib/auth.ts` gekapselt)
- Route Handler: `export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> })`
- Server Components per Default; `"use client"` nur wo nötig (Forms, Filter, framer-motion)

## Datenmodell
Siehe `prisma/schema.prisma` (LESEN!). Kurzfassung:
- `User` (role ADMIN|TUTOR; Tutor: lat/lng/radiusKm/subjects=JSON-Array von Slugs)
- `Pensum` = Kundenanfrage/Lead (status OPEN|MATCHED|CLOSED|CANCELLED, lat/lng, rateCustomer/rateTutor in **Rappen pro 60 Min**)
- `Application` (Tutor bewirbt sich auf Pensum; PENDING|ACCEPTED|REJECTED|WITHDRAWN; unique [pensumId, tutorId])
- `Contract` (aus akzeptierter Bewerbung; 1:1 zu Pensum; ACTIVE|ENDED)
- `TimeEntry` (minutes, notes=Markdown; editierbar bis Monat geschlossen)
- `MonthClose` (unique [year, month]) — sperrt TimeEntries des Monats
- `Invoice` (number unique `YYYY-NNNN`, reference=27-stellige QR-Referenz, amount Rappen, OPEN|PAID|CANCELLED, unique [contractId, year, month]) + `InvoiceItem`
- `Dunning` (level 1-3, unique [invoiceId, level])
- `Payout` (pro Tutor/Monat, PENDING|PAID)
- `EmailLog`

## Geld-Regeln (überall identisch!)
- Alle Beträge in **Rappen** (Integer). Raten = Rappen pro 60 Minuten.
- Positionsbetrag: `Math.round(minutes * rate / 60)`
- Rechnungs-/Payout-Total: `roundTo5Rappen(summe)` aus `@/lib/swiss`
- Anzeige: `chf(rappen)` aus `@/lib/format` → „CHF 75.00"

## Core-Libs (vorhanden — NUTZEN, nicht neu erfinden)
```ts
// @/lib/db          export const prisma: PrismaClient
// @/lib/auth        (nur serverseitig!)
requirePageUser(role?: "ADMIN"|"TUTOR")  // Layout/Page-Guard, redirected sonst; gibt DB-User
requireApiUser(role?)                     // API-Guard, gibt User | null
getSessionUser(); verifyLogin(email, pw); hashPassword(pw)
// @/lib/geo         haversineKm(a, b); withinRadius(items, center, radiusKm) → sortiert, mit distanceKm
// @/lib/plz         PLZ_DATA; findByPlz(plz); findBySlug(slug); geocodePlz(plz) → {lat,lng,approx}|null
// @/lib/subjects    SUBJECTS, LEVELS, SEO_CITY_SLUGS, getSubject(slug), getLevel(slug), ICT_SUBJECTS, SCHOOL_SUBJECTS
// @/lib/swiss       qrReference(base); formatQrReference(ref); formatIban(iban); roundTo5Rappen(r); rappenToFrancs(r)
// @/lib/format      chf(r); chfPlain(r); formatDate(d); formatDateLong(d); monthLabel(y,m); minutesLabel(min); currentMonth(); previousMonth(y,m); monthRange(y,m); MONTH_NAMES
// @/lib/config      config.{brandName, claim, baseUrl, company{name,street,zip,city,qrIban,email,phone}, billing{dueDays,dunningLevelDays,defaultRateCustomer,defaultRateTutor}, smtp{...}, sessionSecret, cronSecret}
// @/lib/months      isMonthClosed(y,m); listClosedMonths(); isDateLocked(date)
// @/lib/types       ROLES, PENSUM_STATUS, ... (String-Konstanten)
// @/components/Markdown   <Markdown>{notes}</Markdown> (XSS-sicher, .prose-notes-Styles)
```

## Billing-Kontrakte (Stubs vorhanden, Billing-Agent implementiert; Signaturen FIX)
```ts
// @/lib/billing
closeMonth(year, month, adminId) → Promise<CloseMonthResult>
generateInvoicePdf(invoiceId) → Promise<Buffer>
// @/lib/dunning
runDunning() → Promise<DunningRunResult>
// @/lib/mailer
sendMail({to, subject, body, kind}) → Promise<boolean>
```
Admin-UI darf diese Funktionen importieren und aufrufen (z. B. Monatsabschluss-Button
→ eigene API-Route → `closeMonth(...)`). PDF-Download-Route `/api/admin/invoices/[id]/pdf`
gehört der Billing-Engine.

## Auth / Login (fertig — nicht anfassen)
- `POST /api/auth/login {email, password}` → setzt Cookie, antwortet `{ok, redirect}`
- `POST /api/auth/logout`
- Login-Seite: `/login` (existiert). Middleware schützt `/tutor/*` & `/admin/*` (Cookie-Präsenz);
  **echte** Prüfung IMMER via `requirePageUser`/`requireApiUser` in Layout + jeder API-Route.

## Multi-Tenancy (SECURITY, nicht verhandelbar)
Jede Tutor-Query MUSS auf `tutorId: user.id` gefiltert sein (`where`-Klausel), auch bei
Detail-Routen (`findFirst({ where: { id, tutorId: user.id } })` statt `findUnique`).
Tutoren sehen NIE: andere Tutoren, deren Verträge/Raten/Stunden, Kunden-E-Mails fremder
Pensen, Admin-Daten. Bei offenen Pensen im Feed: Kundenname/E-Mail/Telefon/Strasse NICHT
ausliefern — nur Fach, Stufe, PLZ/Ort, Distanz, Beschreibung, Pensum-Rate (rateTutor!),
lessonsPerWeek, preferredTimes. rateCustomer ist für Tutoren tabu.

## API-Konventionen
- Route Handler unter `src/app/api/...`, Antworten `NextResponse.json(...)`
- Fehler: `{ error: "deutsche Meldung" }` mit Status 400/401/403/404/409
- Input-Validierung mit zod (v4): `z.object({...}).safeParse(body)`
- Mutationen von Client-Komponenten via `fetch` + `router.refresh()`

## Design-System (dark-first, Niveau Vercel/Linear)
- Tokens (Tailwind-Klassen): `bg-base` (Seite), `bg-surface` (Inputs/Thead), `bg-card` /
  `bg-card-hover`, `border-edge` / `border-edge-soft`, `text-ink` (primär), `text-mute`,
  `text-faint`, Akzente: `accent` (#6d7cff), `accent2` (teal), `accent-soft`, `ok`, `warn`, `danger`
- Utility-CSS: `.hero-glow` (Radial-Glow), `.text-gradient`, `.grid-pattern`, `.prose-notes`
- UI-Kit `@/components/ui`: `cn, Button, ButtonLink, Card, CardHeader, CardBody, Input,
  Textarea, Select, Label, Field, Badge, StatusBadge, Table, THead, TH, TBody, TR, TD,
  PageHeader, StatCard, EmptyState, Divider` — IMMER verwenden, keine Parallel-Kits bauen.
- Icons: lucide-react. Abstände grosszügig, `rounded-xl`, Micro-Interactions dezent
  (Hover-Transitions; framer-motion nur auf der Public-Landingpage).
- Öffentliche Seiten: hochwertig, konversionsstark, Schweizer Tonalität („Sie" für
  Eltern-Zielgruppe auf Public-Seiten; im Tutor-/Admin-Portal „du" locker-professionell).

## Demo-Logins (Seed)
- Admin: `admin@lernova.ch` / `admin123!`
- Tutor: `tutor@lernova.ch` / `tutor123!` (Dario, Zürich, hat 2 Verträge + Einträge)

## Datei-Ownership (STRIKT — nichts ausserhalb des eigenen Bereichs anfassen)
- **public-site**: `src/app/(public)/**` (inkl. Root-`page.tsx` in der Gruppe), `src/app/anfrage/**` falls nicht in Gruppe, `src/app/api/leads/**`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/components/public/**`
- **tutor-portal**: `src/app/tutor/**`, `src/app/api/tutor/**`, `src/components/tutor/**`
- **admin-portal**: `src/app/admin/**`, `src/app/api/admin/**` (AUSSER `invoices/[id]/pdf`), `src/components/admin/**`
- **billing-engine**: `src/lib/{billing,dunning,mailer,qrbill}.ts`, `src/app/api/cron/**`, `src/app/api/admin/invoices/[id]/pdf/route.ts`, `scripts/**`
- Gemeinsame Dateien (`package.json`, `prisma/*`, `src/lib/*` sonst, `src/components/ui.tsx`, `globals.css`, Root-Layout, Login) sind TABU. Fehlt etwas: im eigenen Namespace ergänzen.
- Selbst-Check: `npx tsc --noEmit --incremental false` (Fehler in FREMDEN Bereichen ignorieren).
