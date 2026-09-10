import type { Registration } from "./types";
import { STATUS_META } from "./constants";

/** Flatten a registration into a single CSV row (analysis-ready). */
export const CSV_COLUMNS: Array<{ key: string; label: string; value: (r: Registration) => string }> = [
  { key: "reference", label: "Registry Reference", value: (r) => r.reference },
  { key: "status", label: "Status", value: (r) => STATUS_META[r.status].label },
  { key: "submitted_at", label: "Submitted At", value: (r) => r.submittedAt },
  { key: "updated_at", label: "Last Updated", value: (r) => r.updatedAt },
  { key: "title", label: "Title", value: (r) => r.personal.title },
  { key: "surname", label: "Surname", value: (r) => r.personal.surname },
  { key: "first_name", label: "First Name", value: (r) => r.personal.firstName },
  { key: "middle_name", label: "Middle Name", value: (r) => r.personal.middleName ?? "" },
  { key: "date_of_birth", label: "Date of Birth", value: (r) => r.personal.dob },
  { key: "gender", label: "Gender", value: (r) => r.personal.gender },
  { key: "nationality", label: "Nationality", value: (r) => r.personal.nationality },
  { key: "county_of_origin", label: "County of Origin", value: (r) => r.personal.countyOfOrigin },
  { key: "national_id", label: "National ID / Passport", value: (r) => r.personal.nationalId },
  { key: "marital_status", label: "Marital Status", value: (r) => r.personal.maritalStatus },
  { key: "email", label: "Email", value: (r) => r.contact.email },
  { key: "phone", label: "Phone", value: (r) => r.contact.phone },
  { key: "alt_phone", label: "Alt Phone", value: (r) => r.contact.altPhone ?? "" },
  { key: "res_address", label: "Residential Address", value: (r) => r.contact.address },
  { key: "res_city", label: "City / Town", value: (r) => r.contact.city },
  { key: "res_district", label: "District (Residence)", value: (r) => r.contact.district },
  { key: "res_county", label: "County (Residence)", value: (r) => r.contact.county },
  { key: "highest_qualification", label: "Highest Qualification", value: (r) => r.education.highestQualification },
  { key: "institution", label: "Training Institution", value: (r) => r.education.institution },
  { key: "country_of_training", label: "Country of Training", value: (r) => r.education.countryOfTraining },
  { key: "graduation_year", label: "Graduation Year", value: (r) => r.education.graduationYear },
  { key: "specialization", label: "Specialization", value: (r) => r.education.specialization },
  { key: "other_qualifications", label: "Other Qualifications", value: (r) => r.education.otherQualifications ?? "" },
  { key: "lpb_number", label: "LPB Registration No.", value: (r) => r.licensure.lpbNumber },
  { key: "license_category", label: "License Category", value: (r) => r.licensure.category },
  { key: "initial_reg_year", label: "Initial Registration Year", value: (r) => r.licensure.initialRegistrationYear },
  { key: "license_expiry", label: "License Expiry", value: (r) => r.licensure.licenseExpiry },
  { key: "registered_elsewhere", label: "Registered Outside Liberia", value: (r) => (r.licensure.registeredElsewhere ? "Yes" : "No") },
  { key: "other_countries", label: "Other Countries Registered", value: (r) => r.licensure.otherCountries ?? "" },
  { key: "in_good_standing", label: "Declared Good Standing", value: (r) => (r.licensure.inGoodStanding ? "Yes" : "No") },
  { key: "employment_status", label: "Employment Status", value: (r) => r.employment.status },
  { key: "sector", label: "Practice Sector", value: (r) => r.employment.sector },
  { key: "facility_name", label: "Facility", value: (r) => r.employment.facilityName },
  { key: "facility_type", label: "Facility Type", value: (r) => r.employment.facilityType },
  { key: "position", label: "Position", value: (r) => r.employment.position },
  { key: "practice_county", label: "County (Practice)", value: (r) => r.employment.county },
  { key: "practice_district", label: "District (Practice)", value: (r) => r.employment.district },
  { key: "years_experience", label: "Years of Experience", value: (r) => r.employment.yearsOfExperience },
  { key: "doc_passport_photo", label: "Doc: Passport Photo", value: (r) => docSummary(r.documents.passportPhoto) },
  { key: "doc_degree", label: "Doc: Degree Certificate", value: (r) => docSummary(r.documents.degreeCertificate) },
  { key: "doc_license", label: "Doc: LPB License", value: (r) => docSummary(r.documents.lpbLicense) },
  { key: "doc_national_id", label: "Doc: National ID", value: (r) => docSummary(r.documents.nationalIdDoc) },
  { key: "doc_cv", label: "Doc: CV", value: (r) => docSummary(r.documents.cv) },
];

function docSummary(d?: { name: string; size: number }): string {
  return d ? `${d.name}` : "";
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function toCsv(records: Registration[]): string {
  const header = CSV_COLUMNS.map((c) => csvEscape(c.label)).join(",");
  const rows = records.map((r) => CSV_COLUMNS.map((c) => csvEscape(c.value(r) ?? "")).join(","));
  return [header, ...rows].join("\n");
}

export function downloadCsv(records: Registration[], filename: string): void {
  const csv = toCsv(records);
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
