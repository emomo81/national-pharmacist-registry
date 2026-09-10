import type { Registration } from "./types";
import type { StatusKey } from "./constants";
import { readAll, writeAll, nextReference, resetToSeeds } from "./store";
import { uid } from "./utils";

/**
 * REGISTRY API — the single data entry-point for the whole application.
 * ---------------------------------------------------------------
 * Phase 1 (current): fulfilled from the browser (seeded localStorage demo).
 * Phase 2: each function below maps 1:1 onto a Node.js REST endpoint backed
 * by PostgreSQL — e.g.:
 *      submitRegistration      → POST   /api/registrations
 *      listRegistrations       → GET    /api/registrations?status=&county=&q=
 *      getRegistration         → GET    /api/registrations/:id
 *      updateRegistrationStatus→ PATCH  /api/registrations/:id/status
 *      exportRegistrationsCsv  → GET    /api/registrations/export.csv
 * The UI components will not change when the swap happens.
 */

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface ListParams {
  q?: string;
  status?: StatusKey | "all";
  county?: string | "all";
  sector?: string | "all";
  sort?: "newest" | "oldest" | "name";
}

export async function submitRegistration(
  draft: Required<Pick<Registration, "personal" | "contact" | "education" | "licensure" | "employment">> &
    Pick<Registration, "documents">
): Promise<Registration> {
  await wait(700);
  const records = readAll();
  const now = new Date().toISOString();
  const registration: Registration = {
    id: uid(),
    reference: nextReference(),
    status: "submitted",
    submittedAt: now,
    updatedAt: now,
    personal: draft.personal,
    contact: draft.contact,
    education: draft.education,
    licensure: draft.licensure,
    employment: draft.employment,
    documents: draft.documents,
    declaration: { accurate: true, consent: true },
    history: [{ at: now, action: "Submission received", by: "Registry Portal" }],
  };
  writeAll([registration, ...records]);
  return registration;
}

export async function listRegistrations(params: ListParams = {}): Promise<Registration[]> {
  await wait(250);
  let records = readAll();
  const { q, status = "all", county = "all", sector = "all", sort = "newest" } = params;

  if (status !== "all") records = records.filter((r) => r.status === status);
  if (county !== "all") records = records.filter((r) => r.employment.county === county);
  if (sector !== "all") records = records.filter((r) => r.employment.sector === sector);
  if (q && q.trim()) {
    const needle = q.trim().toLowerCase();
    records = records.filter((r) =>
      [
        r.reference,
        r.personal.firstName,
        r.personal.surname,
        r.personal.middleName ?? "",
        r.contact.email,
        r.contact.phone,
        r.licensure.lpbNumber,
        r.employment.facilityName,
      ]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  }

  records = [...records].sort((a, b) => {
    if (sort === "name") {
      return `${a.personal.surname} ${a.personal.firstName}`.localeCompare(
        `${b.personal.surname} ${b.personal.firstName}`
      );
    }
    const da = new Date(a.submittedAt).getTime();
    const db = new Date(b.submittedAt).getTime();
    return sort === "oldest" ? da - db : db - da;
  });
  return records;
}

export async function getRegistration(id: string): Promise<Registration | null> {
  await wait(150);
  return readAll().find((r) => r.id === id) ?? null;
}

export async function updateRegistrationStatus(
  id: string,
  status: StatusKey,
  by: string,
  note?: string
): Promise<Registration | null> {
  await wait(400);
  const records = readAll();
  const idx = records.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  const now = new Date().toISOString();
  const action =
    status === "verified"
      ? "Record verified"
      : status === "flagged"
        ? "Record flagged for follow-up"
        : status === "under_review"
          ? "Moved to under review"
          : "Status set to submitted";
  const updated: Registration = {
    ...records[idx],
    status,
    updatedAt: now,
    notes: note !== undefined ? note : records[idx].notes,
    history: [...records[idx].history, { at: now, action, by }],
  };
  records[idx] = updated;
  writeAll(records);
  return updated;
}

export async function saveRegistrationNote(id: string, note: string): Promise<Registration | null> {
  await wait(300);
  const records = readAll();
  const idx = records.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  const now = new Date().toISOString();
  const updated: Registration = {
    ...records[idx],
    notes: note,
    updatedAt: now,
    history: [...records[idx].history, { at: now, action: "Internal note updated", by: "LPB Official" }],
  };
  records[idx] = updated;
  writeAll(records);
  return updated;
}

/** Reset the portal to the original 27-record demonstration dataset. */
export async function resetDemoData(): Promise<void> {
  await wait(300);
  resetToSeeds();
}

/** Quick-add used by "Add New Pharmacist" in the admin portal. */
export interface ManualRegistrationInput {
  title: string;
  firstName: string;
  surname: string;
  gender: string;
  email: string;
  phone: string;
  lpbNumber: string;
  category: string;
  highestQualification: string;
  initialRegistrationYear: string;
  licenseExpiry: string;
  sector: string;
  facilityName: string;
  position: string;
  county: string;
  status: StatusKey;
  by: string;
}

export async function createManualRegistration(input: ManualRegistrationInput): Promise<Registration> {
  await wait(500);
  const records = readAll();
  const now = new Date().toISOString();
  const registration: Registration = {
    id: uid(),
    reference: nextReference(),
    status: input.status,
    submittedAt: now,
    updatedAt: now,
    personal: {
      title: input.title,
      surname: input.surname,
      firstName: input.firstName,
      dob: "",
      gender: input.gender,
      nationality: "Liberian",
      countyOfOrigin: input.county,
      nationalId: "",
      maritalStatus: "",
    },
    contact: {
      email: input.email,
      phone: input.phone,
      address: "",
      city: "",
      district: "",
      county: input.county,
    },
    education: {
      highestQualification: input.highestQualification,
      institution: "",
      countryOfTraining: "",
      graduationYear: "",
      specialization: "",
    },
    licensure: {
      lpbNumber: input.lpbNumber,
      category: input.category,
      initialRegistrationYear: input.initialRegistrationYear,
      licenseExpiry: input.licenseExpiry,
      registeredElsewhere: false,
      inGoodStanding: input.status !== "flagged",
    },
    employment: {
      status: "Employed",
      sector: input.sector,
      facilityName: input.facilityName,
      facilityType: "",
      position: input.position,
      county: input.county,
      district: "",
      yearsOfExperience: "",
    },
    documents: {},
    declaration: { accurate: true, consent: true },
    history: [{ at: now, action: "Record created manually by registrar", by: input.by }],
  };
  writeAll([registration, ...records]);
  return registration;
}

/** Approximate size of the browser-side dataset (shown in System Overview). */
export function getStorageSizeBytes(): number {
  if (typeof localStorage === "undefined") return 0;
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i) ?? "";
    total += k.length + (localStorage.getItem(k)?.length ?? 0);
  }
  return total * 2; // UTF-16
}
