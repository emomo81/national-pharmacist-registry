import type {
  PharmacistAccount,
  PortalSession,
  Qualification,
  ExperienceEntry,
  CpdEntry,
  ActivityIcon,
  PortalPersonal,
  PortalContact,
  PortalLicensure,
} from "./portal-types";
import {
  PERSONAL_REQUIRED,
  CONTACT_REQUIRED,
  LICENSURE_REQUIRED,
  DOCUMENT_SLOTS,
} from "./portal-types";
import type { RegistryDocuments, Registration, UploadedDoc } from "./types";
import { seedPharmacistAccounts } from "./portal-data";
import { readAll, writeAll, nextReference } from "./store";
import { uid } from "./utils";

/**
 * PHARMACIST PORTAL API (Phase 1 — browser storage).
 * Phase 2 maps these to REST endpoints backed by PostgreSQL:
 *   signup/login        → POST /api/auth/register | /api/auth/login
 *   getAccount          → GET  /api/me
 *   updateSection/setDocument/add* → PATCH/POST /api/me/*
 *   submitApplication   → POST /api/me/application (creates admin-side record)
 */

const ACCT_KEY = "lpb_pharmacist_accounts_v1";
const SESS_KEY = "lpb_pharmacist_session_v1";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function loadAccounts(): PharmacistAccount[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(ACCT_KEY);
    if (raw) return JSON.parse(raw) as PharmacistAccount[];
  } catch {
    /* reseed */
  }
  const seeds = seedPharmacistAccounts();
  localStorage.setItem(ACCT_KEY, JSON.stringify(seeds));
  return seeds;
}

function saveAccounts(accounts: PharmacistAccount[]) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(ACCT_KEY, JSON.stringify(accounts));
}

/* ------------------------------- auth ------------------------------- */

export async function portalSignup(input: {
  firstName: string;
  surname: string;
  email: string;
  password: string;
}): Promise<{ session?: PortalSession; error?: string }> {
  await wait(600);
  const accounts = loadAccounts();
  const email = input.email.trim().toLowerCase();
  if (accounts.some((a) => a.email.toLowerCase() === email)) {
    return { error: "An account with this email already exists — please log in instead." };
  }
  const account: PharmacistAccount = {
    id: uid(),
    email,
    password: input.password,
    createdAt: new Date().toISOString(),
    personal: { title: "Mr.", surname: input.surname.trim(), firstName: input.firstName.trim(), countryOfBirth: "Liberia", nationality: "Liberian" },
    contact: { email },
    licensure: { registeredElsewhere: false, inGoodStanding: false },
    qualifications: [],
    experiences: [],
    cpd: [],
    documents: {},
    applicationStatus: "not_started",
    activity: [{ at: new Date().toISOString(), text: "Account created", icon: "profile" }],
  };
  accounts.unshift(account);
  saveAccounts(accounts);
  const session = startSession(account);
  return { session };
}

export async function portalLogin(email: string, password: string): Promise<{ session?: PortalSession; error?: string }> {
  await wait(600);
  const accounts = loadAccounts();
  const account = accounts.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
  if (!account || account.password !== password) {
    return { error: "Invalid email or password." };
  }
  return { session: startSession(account) };
}

function startSession(account: PharmacistAccount): PortalSession {
  const session: PortalSession = {
    accountId: account.id,
    email: account.email,
    name: [account.personal.firstName, account.personal.middleName, account.personal.surname]
      .filter(Boolean)
      .join(" "),
    at: new Date().toISOString(),
  };
  if (typeof localStorage !== "undefined") localStorage.setItem(SESS_KEY, JSON.stringify(session));
  return session;
}

export function portalSession(): PortalSession | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESS_KEY);
    return raw ? (JSON.parse(raw) as PortalSession) : null;
  } catch {
    return null;
  }
}

export function portalLogout() {
  if (typeof localStorage !== "undefined") localStorage.removeItem(SESS_KEY);
}

/* ------------------------------ account ------------------------------ */

const STATUS_BY_ADMIN: Record<string, PharmacistAccount["applicationStatus"]> = {
  submitted: "submitted",
  under_review: "under_review",
  verified: "verified",
  flagged: "flagged",
};

/** Returns the account; if it has a registry record, its status mirrors the admin portal. */
export async function getAccount(id: string): Promise<PharmacistAccount | null> {
  await wait(120);
  const account = loadAccounts().find((a) => a.id === id) ?? null;
  if (!account) return null;
  if (account.registryRef) {
    const record = readAll().find((r) => r.reference === account.registryRef);
    if (record) account.applicationStatus = STATUS_BY_ADMIN[record.status] ?? account.applicationStatus;
  }
  return account;
}

function pushActivity(account: PharmacistAccount, text: string, icon: ActivityIcon) {
  account.activity = [{ at: new Date().toISOString(), text, icon }, ...account.activity].slice(0, 24);
}

async function mutateAccount(id: string, fn: (a: PharmacistAccount) => void): Promise<PharmacistAccount | null> {
  await wait(200);
  const accounts = loadAccounts();
  const idx = accounts.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  fn(accounts[idx]);
  if (accounts[idx].applicationStatus === "not_started") accounts[idx].applicationStatus = "in_progress";
  saveAccounts(accounts);
  return getAccount(id);
}

export function updatePersonal(id: string, patch: Partial<PortalPersonal>) {
  return mutateAccount(id, (a) => {
    a.personal = { ...a.personal, ...patch };
    pushActivity(a, "Profile updated", "profile");
  });
}

export function updateContact(id: string, patch: Partial<PortalContact>) {
  return mutateAccount(id, (a) => {
    a.contact = { ...a.contact, ...patch };
    pushActivity(a, "Profile updated", "profile");
  });
}

export function updateLicensure(id: string, patch: Partial<PortalLicensure>) {
  return mutateAccount(id, (a) => {
    a.licensure = { ...a.licensure, ...patch };
    pushActivity(a, "Profile updated", "profile");
  });
}

export function addQualification(id: string, q: Omit<Qualification, "id" | "createdAt">) {
  return mutateAccount(id, (a) => {
    a.qualifications = [...a.qualifications, { ...q, id: uid(), createdAt: new Date().toISOString() }];
    pushActivity(a, "Qualification added", "qual");
  });
}

export function removeQualification(id: string, qid: string) {
  return mutateAccount(id, (a) => {
    a.qualifications = a.qualifications.filter((q) => q.id !== qid);
  });
}

export function addExperience(id: string, e: Omit<ExperienceEntry, "id">) {
  return mutateAccount(id, (a) => {
    a.experiences = [...a.experiences, { ...e, id: uid() }];
    pushActivity(a, "Experience added", "exp");
  });
}

export function removeExperience(id: string, eid: string) {
  return mutateAccount(id, (a) => {
    a.experiences = a.experiences.filter((e) => e.id !== eid);
  });
}

export function addCpd(id: string, entry: Omit<CpdEntry, "id" | "createdAt">) {
  return mutateAccount(id, (a) => {
    a.cpd = [...a.cpd, { ...entry, id: uid(), createdAt: new Date().toISOString() }];
    pushActivity(a, "CPD training added", "cpd");
  });
}

export function removeCpd(id: string, cid: string) {
  return mutateAccount(id, (a) => {
    a.cpd = a.cpd.filter((entry) => entry.id !== cid);
  });
}

export function setDocument(id: string, key: keyof RegistryDocuments, doc: UploadedDoc | undefined) {
  return mutateAccount(id, (a) => {
    a.documents = { ...a.documents, [key]: doc };
    if (doc) pushActivity(a, "Document uploaded", "doc");
  });
}

/* --------------------------- progress metrics --------------------------- */

const filled = (v: unknown) => Boolean(v && String(v).trim());

export interface ProgressMetrics {
  profilePct: number; // personal + contact + licensure (of 3)
  docsCount: number; // of 5 slots
  docsTotal: number;
  missingRequiredDocs: string[];
  progressPct: number; // of 5 checks
  checks: Array<{ key: string; label: string; done: boolean }>;
}

export function getProgress(account: PharmacistAccount): ProgressMetrics {
  const personalDone = PERSONAL_REQUIRED.every((k) => filled((account.personal as Record<string, unknown>)[k]));
  const contactDone = CONTACT_REQUIRED.every((k) => filled((account.contact as Record<string, unknown>)[k]));
  const licensureDone = LICENSURE_REQUIRED.every((k) => filled((account.licensure as Record<string, unknown>)[k]));

  const docEntries = DOCUMENT_SLOTS.map((s) => ({ slot: s, doc: account.documents[s.key] }));
  const docsCount = docEntries.filter((d) => d.doc).length;
  const requiredDocs = DOCUMENT_SLOTS.filter((s) => s.required);
  const missingRequiredDocs = requiredDocs.filter((s) => !account.documents[s.key]).map((s) => s.label);
  const docsDone = missingRequiredDocs.length === 0;

  const checks = [
    { key: "personal", label: "Personal information", done: personalDone },
    { key: "contact", label: "Contact details", done: contactDone },
    { key: "licensure", label: "LPB registration", done: licensureDone },
    { key: "qualifications", label: "At least one qualification", done: account.qualifications.length > 0 },
    { key: "documents", label: "Required documents uploaded", done: docsDone },
  ];
  const doneCount = checks.filter((c) => c.done).length;
  return {
    profilePct: Math.round(([personalDone, contactDone, licensureDone].filter(Boolean).length / 3) * 100),
    docsCount,
    docsTotal: DOCUMENT_SLOTS.length,
    missingRequiredDocs,
    checks,
    progressPct: Math.round((doneCount / checks.length) * 100),
  };
}

/* ------------------------- submit application ------------------------- */

function buildRegistration(account: PharmacistAccount, ref: string, existingId?: string): Registration {
  const now = new Date().toISOString();
  const p = account.personal;
  const c = account.contact;
  const l = account.licensure;
  const qual = account.qualifications[0];
  const currentExp = account.experiences.find((e) => e.current) ?? account.experiences[0];
  const totalYears = account.experiences.length
    ? String(Math.max(...account.experiences.map((e) => 2026 - (Number(e.from) || 2026)), 0))
    : "0";
  return {
    id: existingId ?? uid(),
    reference: ref,
    status: "submitted",
    submittedAt: now,
    updatedAt: now,
    personal: {
      title: p.title ?? "",
      surname: p.surname ?? "",
      firstName: p.firstName ?? "",
      middleName: p.middleName ?? "",
      dob: p.dob ?? "",
      gender: p.gender ?? "",
      nationality: p.nationality ?? "",
      countyOfOrigin: p.nationality === "Liberian" ? (c.county ?? "") : "Foreign",
      nationalId: p.nationalId ?? "",
      maritalStatus: p.maritalStatus ?? "",
    },
    contact: {
      email: c.email ?? account.email,
      phone: c.phone ?? "",
      altPhone: c.altPhone ?? "",
      address: c.address ?? "",
      city: c.city ?? "",
      district: c.district ?? "",
      county: c.county ?? "",
    },
    education: {
      highestQualification: qual?.degreeType ?? "",
      institution: qual?.institution ?? "",
      countryOfTraining: "",
      graduationYear: qual?.year ?? "",
      specialization: qual?.fieldOfStudy ?? "",
      otherQualifications: account.qualifications
        .slice(1)
        .map((q) => `${q.degreeType} (${q.year}) — ${q.institution}`)
        .join("; "),
    },
    licensure: {
      lpbNumber: l.lpbNumber ?? "",
      category: l.category ?? "",
      initialRegistrationYear: l.initialRegistrationYear ?? "",
      licenseExpiry: l.licenseExpiry ?? "",
      registeredElsewhere: Boolean(l.registeredElsewhere),
      otherCountries: l.otherCountries ?? "",
      inGoodStanding: Boolean(l.inGoodStanding),
    },
    employment: currentExp
      ? {
          status: "Employed",
          sector: currentExp.sector,
          facilityName: currentExp.facility,
          facilityType: "",
          position: currentExp.role,
          county: currentExp.county,
          district: "",
          yearsOfExperience: totalYears,
        }
      : { status: "Unemployed", sector: "Not currently practicing", facilityName: "", facilityType: "", position: "", county: "", district: "", yearsOfExperience: totalYears },
    documents: account.documents,
    declaration: { accurate: true, consent: true },
    history: [{ at: now, action: "Application submitted via pharmacist portal", by: "Registry Portal" }],
  };
}

export async function submitApplication(id: string): Promise<{ account?: PharmacistAccount; error?: string }> {
  await wait(700);
  const accounts = loadAccounts();
  const idx = accounts.findIndex((a) => a.id === id);
  if (idx === -1) return { error: "Account not found." };
  const account = accounts[idx];
  const metrics = getProgress(account);
  const incomplete = metrics.checks.filter((c) => !c.done);
  if (incomplete.length > 0) {
    return { error: `Complete these before submitting: ${incomplete.map((c) => c.label).join(", ")}.` };
  }

  const records = readAll();
  let ref = account.registryRef;
  if (ref) {
    // resubmission: update the existing admin record in place
    const rIdx = records.findIndex((r) => r.reference === ref);
    if (rIdx !== -1) {
      const updated = buildRegistration(account, ref, records[rIdx].id);
      updated.status = records[rIdx].status === "submitted" ? "submitted" : "under_review";
      records[rIdx] = updated;
      writeAll(records);
    }
  } else {
    ref = nextReference();
    writeAll([buildRegistration(account, ref), ...records]);
  }

  account.registryRef = ref;
  account.applicationStatus = "submitted";
  account.submittedAt = new Date().toISOString();
  pushActivity(account, "Application submitted", "submit");
  saveAccounts(accounts);
  return { account: (await getAccount(id)) ?? account };
}

export type { PortalPersonal, PortalContact, PortalLicensure };
