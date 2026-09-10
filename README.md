# National Pharmacist Registry — Liberia 2026 Census

A digital tool for the Liberia Pharmacy Board (LPB) to conduct the **2026 National Pharmacist Census**.

- **Part One (public):** pharmacists across all 15 counties complete a guided 7-step form, upload their credentials and submit — receiving an official registry reference number (e.g. `LPB-2026-0007`).
- **LPB Official Use (staff portal):** authorized Board officials download, review, verify, flag and analyze submissions for decision-making (dashboards, filters, one-click CSV export).

> **Phase 1 scope (this build):** fully functional, clickable **Next.js frontend** with a mock data layer (seeded browser storage). No real backend yet — see *Phase 2* below for the Node.js + PostgreSQL step.

## Tech stack

| Layer     | Choice |
| --------- | ------ |
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling   | Tailwind CSS 3 (custom LPB design tokens) |
| Validation| Zod (per-step schemas) |
| Icons     | lucide-react |
| Data (P1) | localStorage adapter shaped like the future REST API (`lib/api.ts`) |
| Data (P2) | Node.js API + PostgreSQL (planned) |

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
# production check
npm run build && npm start
```

### Walkthroughs

**Public registration (Part One)** — open `/register` and complete the wizard. Progress autosaves on the device; submit to receive a reference number.

**LPB Official Portal** — open `/official` (demo accounts, click to autofill):

| Role | Email | Password |
| ---- | ----- | -------- |
| Registrar & CEO | `admin@lpb.gov.lr` | `Liberia2026!` |
| Data & Records Officer | `data.officer@lpb.gov.lr` | `Data2026!` |

The portal includes: **Dashboard** (KPIs, trends, county/sector/gender/qualification analytics), **Submissions** (search, filter, sort, paginate, open records), **Record detail** (verify / flag / annotate, status history), **Data Export** (preset + custom CSV, data dictionary, demo reset).

The admin dataset is seeded with 26 realistic sample submissions. Use *Export → Reset demo data* to restore them.

## Project structure

```
app/
  (public)/            # public site (header/footer chrome)
    page.tsx           #   landing page
    register/          #   7-step census wizard + success page
    official/          #   LPB staff login
  admin/               # official portal (own sidebar shell + guard)
    page.tsx           #   dashboard & analytics
    submissions/       #   table + record detail ([id])
    export/            #   CSV export center + data dictionary
components/
  register/            # wizard, stepper, 7 step forms, file upload
  admin/               # shell, SVG charts (donut/bars/trend)
  ui/                  # form primitives
lib/
  api.ts               # ← the ONLY data entry-point used by the UI
  store.ts             # Phase-1 localStorage adapter (swappable)
  seed.ts              # 26-record demonstration dataset
  schemas.ts           # Zod validation per wizard step
  csv.ts               # CSV flattening + download (47 columns)
  constants.ts         # counties, sectors, cadres, statuses…
```

## Phase 2 — Node.js + PostgreSQL

`lib/api.ts` already exposes the exact contract; the plan is to re-implement each function against REST endpoints — **no UI changes required**:

| Frontend call | Endpoint |
| ------------- | -------- |
| `submitRegistration` | `POST /api/registrations` (+ `multipart/form-data` uploads) |
| `listRegistrations` | `GET /api/registrations?q=&status=&county=&sector=&sort=` |
| `getRegistration` | `GET /api/registrations/:id` |
| `updateRegistrationStatus` | `PATCH /api/registrations/:id/status` |
| CSV exports | `GET /api/registrations/export.csv` (server-generated) |

**Proposed schema (first migration):** `pharmacists` (all form sections, JSONB or normalized), `documents` (file metadata → object storage), `status_history`, `staff_users` (roles: registrar, data_officer, viewer). Auth moves to hashed passwords + secure sessions; CSV export moves server-side so full censuses (thousands of rows) stream efficiently.

## Swapping in the official brand assets

- **Logo:** replace the single file `public/lpb-logo.svg` (header, footer, login and portal all reference it).
- **Colors:** edit the `brand` / `gold` scales in `tailwind.config.ts`.
- **Field list:** `lib/constants.ts` drives every dropdown, filter, chart and the CSV header.

## Notes

- Phase 3 candidate features already stubbed by design: email notifications, SMS reminders, verifier assignment queues, and a public self-service *status check* by reference number.
- Demo data lives only in the browser; nothing leaves the device in this phase.
