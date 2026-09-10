import { z } from "zod";
import { CENSUS_YEAR } from "./constants";

const req = (label: string) => z.string({ required_error: `${label} is required` }).trim().min(1, `${label} is required`);

const phoneRegex = /^[+0-9][0-9 ()-]{6,20}$/;
const lpbNumberRegex = /^[A-Za-z]{1,5}-?\d{2,6}$/; // e.g. RPh-0143

export const personalSchema = z.object({
  title: req("Title"),
  surname: req("Surname"),
  firstName: req("First name"),
  middleName: z.string().trim().optional().or(z.literal("")),
  dob: req("Date of birth").refine((v) => {
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return false;
    const age = CENSUS_YEAR - d.getFullYear();
    return age >= 18 && age <= 100;
  }, "Enter a valid date of birth (registrant must be 18+)"),
  gender: req("Gender"),
  nationality: req("Nationality"),
  countyOfOrigin: req("County of origin"),
  nationalId: req("National ID / passport number"),
  maritalStatus: req("Marital status"),
});

export const contactSchema = z.object({
  email: req("Email address").email("Enter a valid email address"),
  phone: req("Phone number").regex(phoneRegex, "Enter a valid phone number, e.g. +231 77 123 4567"),
  altPhone: z
    .string()
    .trim()
    .regex(phoneRegex, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  address: req("Residential address"),
  city: req("City / town"),
  district: req("District"),
  county: req("County of residence"),
});

export const educationSchema = z.object({
  highestQualification: req("Highest qualification"),
  institution: req("Institution"),
  countryOfTraining: req("Country of training"),
  graduationYear: req("Year of graduation").refine((v) => {
    const y = Number(v);
    return Number.isInteger(y) && y >= 1965 && y <= CENSUS_YEAR;
  }, `Enter a year between 1965 and ${CENSUS_YEAR}`),
  specialization: req("Area of specialization"),
  otherQualifications: z.string().trim().optional().or(z.literal("")),
});

export const licensureSchema = z
  .object({
    lpbNumber: req("LPB registration number").regex(lpbNumberRegex, "Expected format e.g. RPh-0143"),
    category: req("License category"),
    initialRegistrationYear: req("Year of initial registration").refine((v) => {
      const y = Number(v);
      return Number.isInteger(y) && y >= 1965 && y <= CENSUS_YEAR;
    }, `Enter a year between 1965 and ${CENSUS_YEAR}`),
    licenseExpiry: req("License expiry date"),
    registeredElsewhere: z.boolean(),
    otherCountries: z.string().trim().optional().or(z.literal("")),
    inGoodStanding: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.registeredElsewhere && !data.otherCountries?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["otherCountries"],
        message: "List the other countries where you are registered",
      });
    }
  });

export const employmentSchema = z
  .object({
    status: req("Employment status"),
    sector: z.string().trim().optional().or(z.literal("")),
    facilityName: z.string().trim().optional().or(z.literal("")),
    facilityType: z.string().trim().optional().or(z.literal("")),
    position: z.string().trim().optional().or(z.literal("")),
    county: z.string().trim().optional().or(z.literal("")),
    district: z.string().trim().optional().or(z.literal("")),
    yearsOfExperience: req("Years of experience").refine((v) => {
      const y = Number(v);
      return Number.isInteger(y) && y >= 0 && y <= 60;
    }, "Enter years of experience (0–60)"),
  })
  .superRefine((data, ctx) => {
    const working = data.status === "Employed" || data.status === "Self-employed";
    if (!working) return;
    const fields: Array<keyof typeof data> = ["sector", "facilityName", "facilityType", "position", "county"];
    fields.forEach((f) => {
      if (!data[f]?.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: [f], message: "Required for practicing pharmacists" });
      }
    });
  });

export const declarationSchema = z
  .object({
    accurate: z.boolean(),
    consent: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (!data.accurate) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["accurate"], message: "You must confirm this declaration" });
    }
    if (!data.consent) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["consent"], message: "Consent is required to submit" });
    }
  });

export type PersonalValues = z.infer<typeof personalSchema>;
export type ContactValues = z.infer<typeof contactSchema>;
export type EducationValues = z.infer<typeof educationSchema>;
export type LicensureValues = z.infer<typeof licensureSchema>;
export type EmploymentValues = z.infer<typeof employmentSchema>;
