# National Pharmacist Registry | Liberia 2026 Census

A digital registry for the Liberia Pharmacy Board (LPB) to conduct the **2026 National Pharmacist Census**, built to the approved UI/UX kit (deep navy chrome, LPB seal green accents, official tagline). The visual language is institutional and flat: 1px borders instead of shadows, square corners, a restrained navy/green palette, and no decorative motion.

- **Public site**: census information, required credentials, FAQ ( `/` )
- **Pharmacist portal**: every pharmacist creates an account, builds a profile (personal, contact, LPB registration), records educational credentials, professional experience and CPD training, uploads documents, and **submits their application** ( `/…` below )
- **LPB Official portal**: Board officials review, verify, flag, analyze and export the registry for decision-making ( `/admin` )

> **Phase 1 scope (this build):** fully functional, clickable **Next.js frontend** with a mock data layer (seeded browser storage). Node.js + PostgreSQL backend follows in Phase 2 (see below).

## Tech stack

| Layer      | Choice |
| ---------- | ------ |
| Framework  | Next.js 14 (App Router) + TypeScript |
| Styling    | Tailwind CSS 3, design tokens from the approved UI kit (`brand` = navy, `accent` = seal green) |
| Icons      | lucide-react (functional icons only: menus, chevrons, search, upload) |
| Fonts      | Public Sans (self-hosted via @fontsource, the typeface designed for government services) |
| Data (P1)  | localStorage adapters shaped like the future REST API (`lib/api.ts`, `lib/portal.ts`) |
| Data (P2)  | Node.js API + PostgreSQL (planned) |

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start   # production check
```

## Demo accounts (click-to-autofill on the login screens)

| Portal | Role | Email | Password |
| ------ | ---- | ----- | -------- |
| Pharmacist (`/login`) | Pharmacist (Emmanuel Momo) | `emmanuel.momo@example.lr` | `Pharmacist2026!` |
| LPB Official (`/official`) | Registrar & CEO | `admin@lpb.gov.lr` | `Liberia2026!` |
| LPB Official (`/official`) | Data & Records Officer | `data.officer@lpb.gov.lr` | `Data2026!` |

New pharmacist accounts can also be created on **/signup**.

## Route map

```
/                      Landing page (hero, registry purpose, who must register, FAQ,
                       live demo previews of both portals)
/login  /signup        Pharmacist authentication (signup links to terms & privacy)
/privacy  /terms       Privacy policy and terms of use
/portal                Pharmacist dashboard (progress, stats, quick actions, activity)
/portal/profile        4-step tabs: Personal Info → Contact Info → Registration → Review
/portal/education      Educational credentials (add/remove qualifications)
/portal/experience     Professional experience history
/portal/cpd            CPD training log
/portal/documents      5 document slots (passport photo, degree, license, ID, cert/CV)
/portal/submit         Checklist → declaration → submit → receipt + next steps
/portal/support        Help & support
/official              LPB staff login
/admin                 Dashboard (banner, KPIs, recent registrations, status donut,
                       quick actions, system overview)
/admin/registry        Full registry table (search, filter, sort, paginate, CSV)
/admin/registry/[id]   Record detail (verify / flag / notes / history)
/admin/add             Add New Pharmacist (manual entry by registrar)
/admin/verify          Verification queue (verify/flag inline)
/admin/reports         Analytics (county share, qualification/gender donuts, trend,
                       CSV export presets + filters)
/admin/settings        Roles, data dictionary (47 fields), demo reset, Phase-2 notes
```

The admin dataset is seeded with 27 realistic submissions (incl. Emmanuel Momo's portal
application, `LPB-2026-0027`) spread across counties, sectors, cadres and statuses.
Reset via **Settings: Reset demo data**. Status changes made in the admin portal are
reflected on the pharmacist's own dashboard (both read the same records).

## Project structure

```
app/(public)/          Landing, login, signup, official login, privacy, terms
app/portal/            Pharmacist portal pages (account-based flow)
app/admin/             LPB official portal pages
components/
  portal/              Pharmacist sidebar shell + useAccount hook
  admin/               Official sidebar shell + SVG charts (donut, trend)
  ui/                  Form primitives, file upload (drag & drop, preview), skeleton loader
demo-preview.tsx       Live in-page renderings of both portals for the landing page
lib/
  api.ts               Admin/registry data facade (the ONLY entry-point used by admin UI)
  portal.ts            Pharmacist account facade (auth, sections, submit → registry record)
  store.ts / seed.ts   localStorage adapter + 27-record demo dataset
  csv.ts               CSV flattening + download
  constants.ts         Reference data: counties, sectors, cadres, statuses
public/lpb-logo.svg    LPB seal (vector recreation, swap 1:1 with the official asset)
public/assets/         Hero/banner photography
```

## Phase 2: Node.js + PostgreSQL (planned)

The UI never touches storage directly; each facade maps 1:1 onto REST endpoints:

| Facade call | Endpoint |
| ----------- | -------- |
| `portalSignup/portalLogin` | `POST /api/auth/register`, `/api/auth/login` |
| `getAccount / update*/add*/setDocument` | `GET/PATCH /api/me/…` |
| `submitApplication` | `POST /api/me/application` |
| `listRegistrations` | `GET /api/registrations?q=&status=&county=&sector=` |
| `updateRegistrationStatus` | `PATCH /api/registrations/:id/status` |
| CSV exports | `GET /api/reports/registry.csv` |

**First migration:** `pharmacists` (form sections), `qualifications`, `experiences`,
`cpd_entries`, `documents` (to object storage), `status_history`, `staff_users`
(hashed passwords, roles: registrar, data_officer, viewer).

## Brand assets

- Seal: `public/lpb-logo.svg` (all screens reference the single `LpbLogo` component).
- Colors/typography: `tailwind.config.ts` (`brand` navy scale, `accent` LPB green).
- Reference lists (counties, sectors, qualification types): `lib/constants.ts`, one
  place to update; forms, filters, charts and CSV headers all follow.

## Notes for the Senior Management demo

Suggested walkthrough: **/** (see the demo previews) → **/signup** or demo login → **/portal**
progress at 33% → complete profile tabs → add qualification and documents → **Submit
Application** → receipt → **/official** login → dashboard KPIs → **Verify Credentials**
(verify the new record and watch the pharmacist dashboard flip to Verified) → **Reports &
Analytics** → CSV export download.
