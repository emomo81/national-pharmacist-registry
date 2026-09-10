import type { StatusKey } from "./constants";

/** A credential file captured during registration. */
export interface UploadedDoc {
  name: string;
  /** MIME type, e.g. application/pdf */
  type: string;
  /** Size in bytes */
  size: number;
  /** Inline preview for small images captured in this browser session */
  dataUrl?: string;
  capturedAt: string;
}

export interface PersonalInfo {
  title: string;
  surname: string;
  firstName: string;
  middleName?: string;
  dob: string; // ISO date
  gender: string;
  nationality: string;
  countyOfOrigin: string; // Liberian county of origin or "Foreign"
  nationalId: string; // National ID / passport number
  maritalStatus: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  altPhone?: string;
  address: string;
  city: string;
  district: string;
  county: string;
}

export interface EducationInfo {
  highestQualification: string;
  institution: string;
  countryOfTraining: string;
  graduationYear: string;
  specialization: string;
  otherQualifications?: string;
}

export interface LicensureInfo {
  /** Existing LPB registration/license number, e.g. RPh-0143 */
  lpbNumber: string;
  category: string;
  initialRegistrationYear: string;
  licenseExpiry: string; // ISO date
  registeredElsewhere: boolean;
  otherCountries?: string;
  inGoodStanding: boolean;
}

export interface EmploymentInfo {
  status: string;
  sector: string;
  facilityName: string;
  facilityType: string;
  position: string;
  county: string;
  district: string;
  yearsOfExperience: string;
}

export interface RegistryDocuments {
  passportPhoto?: UploadedDoc;
  degreeCertificate?: UploadedDoc;
  lpbLicense?: UploadedDoc;
  nationalIdDoc?: UploadedDoc;
  cv?: UploadedDoc;
}

export interface Declaration {
  accurate: boolean;
  consent: boolean;
}

export interface HistoryEntry {
  at: string;
  action: string;
  by: string;
}

/** A complete registry submission (one pharmacist = one record). */
export interface Registration {
  id: string;
  reference: string;
  status: StatusKey;
  submittedAt: string;
  updatedAt: string;
  personal: PersonalInfo;
  contact: ContactInfo;
  education: EducationInfo;
  licensure: LicensureInfo;
  employment: EmploymentInfo;
  documents: RegistryDocuments;
  declaration: Declaration;
  /** Internal LPB review notes (never shown publicly) */
  notes?: string;
  history: HistoryEntry[];
}

/** Shape of the working draft while the wizard is in progress. */
export interface RegistrationDraft {
  personal: Partial<PersonalInfo>;
  contact: Partial<ContactInfo>;
  education: Partial<EducationInfo>;
  licensure: Partial<LicensureInfo>;
  employment: Partial<EmploymentInfo>;
  documents: RegistryDocuments;
  declaration: Partial<Declaration>;
}

export interface SessionUser {
  email: string;
  name: string;
  role: string;
  initials: string;
}

export type FieldErrors = Record<string, string>;
