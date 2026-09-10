import type { RegistryDocuments } from "./types";

/** ---------- Pharmacist portal domain model (account-based flow) ---------- */

export interface PortalPersonal {
  title: string;
  surname: string;
  firstName: string;
  middleName?: string;
  maidenName?: string;
  preferredName?: string;
  dob: string;
  gender: string;
  countryOfBirth: string;
  cityOfBirth: string;
  nationality: string;
  nationalId: string;
  maritalStatus: string;
}

export interface PortalContact {
  email: string;
  phone: string;
  altPhone?: string;
  address: string;
  city: string;
  district: string;
  county: string;
}

export interface PortalLicensure {
  lpbNumber: string;
  category: string;
  initialRegistrationYear: string;
  licenseExpiry: string;
  registeredElsewhere: boolean;
  otherCountries?: string;
  inGoodStanding: boolean;
}

export interface Qualification {
  id: string;
  degreeType: string;
  fieldOfStudy: string;
  institution: string;
  year: string;
  certificateName?: string;
  createdAt: string;
}

export interface ExperienceEntry {
  id: string;
  role: string;
  facility: string;
  sector: string;
  county: string;
  from: string; // year
  to?: string; // year or undefined when current
  current: boolean;
}

export interface CpdEntry {
  id: string;
  title: string;
  provider: string;
  year: string;
  hours: string;
  createdAt: string;
}

export type ActivityIcon = "profile" | "doc" | "cpd" | "submit" | "status" | "qual" | "exp";

export interface ActivityEntry {
  at: string;
  text: string;
  icon: ActivityIcon;
}

export type ApplicationStatus =
  | "not_started"
  | "in_progress"
  | "submitted"
  | "under_review"
  | "verified"
  | "flagged";

export const APPLICATION_STATUS_META: Record<
  ApplicationStatus,
  { label: string; chip: string; dot: string }
> = {
  not_started: { label: "Not started", chip: "bg-slate-100 text-slate-600 ring-1 ring-slate-200", dot: "bg-slate-400" },
  in_progress: { label: "In progress", chip: "bg-sky-100 text-sky-800 ring-1 ring-sky-200", dot: "bg-sky-500" },
  submitted: { label: "Submitted", chip: "bg-amber-100 text-amber-800 ring-1 ring-amber-200", dot: "bg-amber-500" },
  under_review: { label: "Under review", chip: "bg-violet-100 text-violet-800 ring-1 ring-violet-200", dot: "bg-violet-500" },
  verified: { label: "Verified", chip: "bg-accent-100 text-accent-800 ring-1 ring-accent-200", dot: "bg-accent-600" },
  flagged: { label: "Action needed", chip: "bg-red-100 text-red-800 ring-1 ring-red-200", dot: "bg-red-500" },
};

export interface PharmacistAccount {
  id: string;
  email: string;
  password: string; // DEMO ONLY — hashed server-side in Phase 2
  createdAt: string;
  personal: Partial<PortalPersonal>;
  contact: Partial<PortalContact>;
  licensure: Partial<PortalLicensure>;
  qualifications: Qualification[];
  experiences: ExperienceEntry[];
  cpd: CpdEntry[];
  documents: RegistryDocuments;
  applicationStatus: ApplicationStatus;
  registryRef?: string;
  submittedAt?: string;
  activity: ActivityEntry[];
}

export interface PortalSession {
  accountId: string;
  email: string;
  name: string;
  at: string;
}

/** ---- validation schemas expressed as plain field requirements ---- */
export const PERSONAL_REQUIRED: Array<keyof PortalPersonal> = [
  "title", "surname", "firstName", "dob", "gender", "countryOfBirth", "cityOfBirth", "nationality", "nationalId", "maritalStatus",
];

export const CONTACT_REQUIRED: Array<keyof PortalContact> = ["email", "phone", "address", "city", "district", "county"];

export const LICENSURE_REQUIRED: Array<keyof PortalLicensure> = [
  "lpbNumber", "category", "initialRegistrationYear", "licenseExpiry",
];

/** The five document slots shown in the Documents manager */
export const DOCUMENT_SLOTS = [
  { key: "passportPhoto" as const, label: "Passport-size photograph", hint: "JPG or PNG, plain background", imagesOnly: true, required: true },
  { key: "degreeCertificate" as const, label: "Pharmacy degree / diploma", hint: "PDF or image", imagesOnly: false, required: true },
  { key: "lpbLicense" as const, label: "Current LPB license", hint: "PDF or image", imagesOnly: false, required: true },
  { key: "nationalIdDoc" as const, label: "National ID / passport", hint: "PDF or image", imagesOnly: false, required: true },
  { key: "cv" as const, label: "Professional certificate / CV", hint: "optional but recommended", imagesOnly: false, required: false },
];
