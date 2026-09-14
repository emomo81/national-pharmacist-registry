/**
 * Reference data for the 2026 National Pharmacist Registry.
 * These lists mirror the official LPB enumeration areas; update here and the
 * forms, filters and CSV export all follow automatically.
 */

export const LIBERIA_COUNTIES = [
  "Bomi",
  "Bong",
  "Gbarpolu",
  "Grand Bassa",
  "Grand Cape Mount",
  "Grand Gedeh",
  "Grand Kru",
  "Lofa",
  "Margibi",
  "Maryland",
  "Montserrado",
  "Nimba",
  "River Cess",
  "River Gee",
  "Sinoe",
] as const;

export const TITLES = ["Mr.", "Mrs.", "Ms.", "Dr.", "Prof."] as const;

export const GENDERS = ["Male", "Female"] as const;

export const MARITAL_STATUS = ["Single", "Married", "Divorced", "Widowed", "Prefer not to say"] as const;

export const NATIONALITIES = ["Liberian", "Dual citizen (Liberian)", "ECOWAS national", "Other"] as const;

export const QUALIFICATIONS = [
  "Diploma in Pharmacy",
  "Bachelor of Pharmacy (BPharm)",
  "Doctor of Pharmacy (PharmD)",
  "Master of Science (MSc Pharmacy)",
  "Master of Public Health (MPH)",
  "MBA / Health Management",
  "Doctor of Philosophy (PhD)",
  "Other",
] as const;

export const SPECIALIZATIONS = [
  "Community Pharmacy",
  "Hospital / Clinical Pharmacy",
  "Industrial Pharmacy",
  "Regulatory Affairs",
  "Public Health",
  "Pharmacovigilance",
  "Academia / Research",
  "Supply Chain & Logistics",
  "None yet",
  "Other",
] as const;

export const LICENSE_CATEGORIES = [
  "Provisional (Intern) Pharmacist",
  "Registered Pharmacist",
  "Senior Pharmacist",
  "Consultant Pharmacist",
] as const;

export const EMPLOYMENT_STATUS = ["Employed", "Self-employed", "Unemployed", "Retired", "Student / Intern"] as const;

export const SECTORS = [
  "Government / Public Hospital",
  "Private Community (Retail) Pharmacy",
  "Private Hospital or Clinic",
  "Wholesale & Distribution",
  "Pharmaceutical Industry / Manufacturing",
  "NGO / Faith-Based Organization",
  "Academia / Research",
  "Regulatory / Government Agency",
  "International Organization",
  "Not currently practicing",
] as const;

export const FACILITY_TYPES = [
  "Teaching / Referral Hospital",
  "Regional / County Hospital",
  "Health Center or Clinic",
  "Community Pharmacy",
  "Wholesale Pharmacy / Distributor",
  "Manufacturing Plant",
  "University / Training Institution",
  "Government Agency or Program",
  "NGO Office / Program Site",
  "Other",
] as const;

export const COUNTRIES_COMMON = [
  "Liberia",
  "Nigeria",
  "Ghana",
  "Sierra Leone",
  "Guinea",
  "Côte d'Ivoire",
  "United States",
  "United Kingdom",
  "India",
  "China",
  "Other",
] as const;

export const CENSUS_YEAR = 2026;

/** Registration status metadata: single source for labels & badge styling. */
export const STATUS_META = {
  submitted: { label: "Submitted", chip: "bg-brand-50 text-brand-900 border border-brand-300", dot: "bg-brand-500" },
  under_review: { label: "Under review", chip: "bg-amber-50 text-amber-900 border border-amber-400", dot: "bg-amber-500" },
  verified: { label: "Verified", chip: "bg-accent-50 text-accent-900 border border-accent-400", dot: "bg-accent-600" },
  flagged: { label: "Flagged", chip: "bg-red-50 text-red-900 border border-red-400", dot: "bg-red-600" },
} as const;

export type StatusKey = keyof typeof STATUS_META;
