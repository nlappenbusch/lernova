# Lernova — Die moderne Nachhilfe-Engine der Schweiz

Tutoring-Management-Plattform für lokale 1:1-Vor-Ort-Nachhilfe mit **ICT-Schwerpunkt**
(Lernende EFZ, Sekundarschule, Gymnasium, Studierende, Erwachsene).

**Kein LMS, kein Video-Portal** — Lernova bringt Anfragen (Pensen) und lokale Tutor:innen
zusammen und automatisiert die komplette Administration dahinter: Time-Tracking,
Monatsabschluss, **Schweizer QR-Rechnungen**, mehrstufiges Mahnwesen und Tutoren-Payouts.

## Module

| Modul | Beschreibung |
|---|---|
| **Public Site & Programmatic SEO** | Landingpage + generierte Seiten `/nachhilfe/[fach]/[stufe]/[ort]` (25 Fächer × 5 Stufen × 18 Städte), JSON-LD (Service/FAQ/Breadcrumb), Sitemap, mehrstufiges Lead-Formular `/anfrage` |
| **Matchmaking & Geo-Engine** | Offene Pensen im Tutor-Feed mit **Umkreissuche** (Haversine, Radius-Slider 5–100 km, PLZ-Geocoding), Bewerbungs-Workflow → Admin-Freigabe → Vertrag |
| **Tutor-Workspace** | Striktes Multi-Tenancy, Dashboard, Time-Tracking mit **Markdown-Notizen** (editierbar bis Monatsabschluss), Verträge, Abrechnungsübersicht, Profil |
| **Swiss FinOps** | Monatsabschluss erzeugt Rechnungen (PDF mit **Swiss-QR-Zahlteil**, QRR-Referenz mod10) + Payouts; automatisiertes **3-stufiges Mahnwesen** (Cron-Route); E-Mail via SMTP oder EmailLog |

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 (dark-first Design-System)
· Prisma 6 · SQLite (Dev) / Postgres-ready · pdfkit + swissqrbill · zod · lucide-react · framer-motion

## Quickstart

```bash
npm install
npx prisma migrate dev   # legt prisma/dev.db an + seedet Demo-Daten
npm run dev              # http://localhost:3210
```

**Demo-Logins**

| Rolle | E-Mail | Passwort |
|---|---|---|
| Admin | `admin@lernova.ch` | `admin123!` |
| Tutor | `tutor@lernova.ch` | `tutor123!` |

Weitere Seed-Tutor:innen: `sarah.keller@`, `luca.bernasconi@`, `elena.favre@`, `jonas.wyss@`, `mia.graf@lernova.ch` (Passwort `lernova123!`).

## Wichtige Konventionen

- **Geldbeträge in Rappen** (Integer), Raten = Rappen pro 60 Min. Positionsbetrag `round(min·rate/60)`, Totale auf 5 Rp. gerundet.
- **Status-Felder sind Strings** (SQLite kennt keine Enums) — gültige Werte in `src/lib/types.ts`.
- **Multi-Tenancy:** jede Tutor-Query filtert auf `tutorId`; offene Pensen werden im Feed ohne Kundenkontaktdaten und ohne Kundenrate ausgeliefert.
- Kontrakte & Architektur-Details: [docs/CONTRACTS.md](docs/CONTRACTS.md).

## Abrechnung & Mahnwesen

1. Tutor:innen erfassen Stunden (editierbar, solange der Monat offen ist).
2. Admin schliesst den Monat ab (`/admin/monatsabschluss`) → pro Vertrag eine Rechnung
   (QR-IBAN + QRR-Referenz aus `.env`/`src/lib/config.ts`) + pro Tutor:in ein Payout.
3. PDF-Download: `/api/admin/invoices/[id]/pdf`.
4. Mahnlauf: Button in `/admin/mahnwesen` **oder** Cron:
   `GET /api/cron/dunning?key=<CRON_SECRET>` (z. B. täglich via Scheduler).
   Stufen-Timing: `DUNNING_LEVEL_DAYS` (Default 7/14/21 Tage nach Fälligkeit).

Ohne SMTP-Konfiguration werden Mails nicht versendet, sondern nur in der Tabelle
`EmailLog` protokolliert (einsehbar unter `/admin/emails`).

## Deployment (Docker)

```bash
docker compose up -d --build   # baut Image, startet App auf Port 3210
```

Die SQLite-DB und generierte PDFs liegen in Volumes (`./prisma-data`, `./data`).
Beim Containerstart läuft `prisma migrate deploy` automatisch.

### Wechsel auf PostgreSQL

1. In `prisma/schema.prisma` den Datasource-Provider auf `postgresql` stellen.
2. `DATABASE_URL` auf die Postgres-Instanz zeigen lassen.
3. Migrationen neu erzeugen (`npx prisma migrate dev --name init-pg` gegen eine leere DB).
4. Seed erneut ausführen (`npm run db:seed`) oder Daten migrieren.

Das Schema ist bewusst Postgres-kompatibel gehalten (keine SQLite-Spezifika).

## Scripts

```bash
npm run dev          # Dev-Server (Port 3210)
npm run build        # Production-Build
npm run typecheck    # tsc --noEmit
npm run db:seed      # Demo-Daten neu einspielen (reset!)
npx tsx scripts/smoke-billing.ts   # Billing-Smoke-Test (PDF + Mahnlauf + Guards)
```
