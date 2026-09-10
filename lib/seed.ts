import type { Registration, UploadedDoc, HistoryEntry } from "./types";
import type { StatusKey } from "./constants";

/**
 * Demonstration dataset for the LPB admin portal — 26 realistic submissions
 * spread across counties, sectors and statuses so dashboards, filters and
 * exports can be exercised end-to-end. Removed automatically in the Postgres
 * phase (replaced by real census data).
 */

function doc(name: string, type: string, kb: number, at: string): UploadedDoc {
  return { name, type, size: kb * 1024, capturedAt: at };
}

function docs(at: string, withCv = false) {
  return {
    passportPhoto: doc("passport_photo.jpg", "image/jpeg", 318, at),
    degreeCertificate: doc("degree_certificate.pdf", "application/pdf", 612, at),
    lpbLicense: doc("lpb_license.pdf", "application/pdf", 404, at),
    nationalIdDoc: doc("national_id.pdf", "application/pdf", 289, at),
    ...(withCv ? { cv: doc("curriculum_vitae.pdf", "application/pdf", 188, at) } : {}),
  };
}

function hist(submittedAt: string, status: StatusKey): HistoryEntry[] {
  const h: HistoryEntry[] = [{ at: submittedAt, action: "Submission received", by: "Registry Portal" }];
  if (status !== "submitted") {
    const t = new Date(submittedAt);
    t.setDate(t.getDate() + 2);
    h.push({ at: t.toISOString(), action: "Moved to under review", by: "R. Gbowee (Data & Records)" });
  }
  if (status === "verified" || status === "flagged") {
    const t = new Date(submittedAt);
    t.setDate(t.getDate() + 5);
    h.push({
      at: t.toISOString(),
      action: status === "verified" ? "Record verified" : "Record flagged for follow-up",
      by: "O. Davis (Registrar & CEO)",
    });
  }
  return h;
}

interface SeedArgs {
  status: StatusKey;
  at: string; // submission timestamp
  title: string;
  first: string;
  mid?: string;
  last: string;
  dob: string;
  gender: string;
  origin: string;
  marital: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  resCounty: string;
  qual: string;
  school: string;
  country: string;
  grad: string;
  spec: string;
  lpb: string;
  cat: string;
  regYear: string;
  expiry: string;
  elsewhere?: string;
  emp: string;
  sector: string;
  facility: string;
  ftype: string;
  position: string;
  pCounty: string;
  pDistrict: string;
  years: string;
  withCv?: boolean;
  notes?: string;
}

function s(a: SeedArgs, idx: number): Registration {
  const ref = `LPB-2026-${String(idx + 1).padStart(4, "0")}`;
  const id = `seed-${String(idx + 1).padStart(3, "0")}`;
  const working = a.emp === "Employed" || a.emp === "Self-employed";
  return {
    id,
    reference: ref,
    status: a.status,
    submittedAt: a.at,
    updatedAt: hist(a.at, a.status).slice(-1)[0].at,
    personal: {
      title: a.title,
      surname: a.last,
      firstName: a.first,
      middleName: a.mid,
      dob: a.dob,
      gender: a.gender,
      nationality: "Liberian",
      countyOfOrigin: a.origin,
      nationalId: `LR-NID-${String(40000 + idx * 37)}`,
      maritalStatus: a.marital,
    },
    contact: {
      email: a.email,
      phone: a.phone,
      address: a.address,
      city: a.city,
      district: a.district,
      county: a.resCounty,
    },
    education: {
      highestQualification: a.qual,
      institution: a.school,
      countryOfTraining: a.country,
      graduationYear: a.grad,
      specialization: a.spec,
    },
    licensure: {
      lpbNumber: a.lpb,
      category: a.cat,
      initialRegistrationYear: a.regYear,
      licenseExpiry: a.expiry,
      registeredElsewhere: Boolean(a.elsewhere),
      otherCountries: a.elsewhere,
      inGoodStanding: a.status !== "flagged",
    },
    employment: {
      status: a.emp,
      sector: working ? a.sector : "Not currently practicing",
      facilityName: working ? a.facility : "",
      facilityType: working ? a.ftype : "",
      position: working ? a.position : "",
      county: working ? a.pCounty : "",
      district: working ? a.pDistrict : "",
      yearsOfExperience: a.years,
    },
    documents: docs(a.at, a.withCv),
    declaration: { accurate: true, consent: true },
    notes: a.notes,
    history: hist(a.at, a.status),
  };
}

const SEEDS: SeedArgs[] = [
  { status: "verified", at: "2026-01-19T09:14:00Z", title: "Mrs.", first: "Musu", mid: "T.", last: "Kollie", dob: "1978-03-12", gender: "Female", origin: "Lofa", marital: "Married", email: "musu.kollie@example.lr", phone: "+231 77 612 3400", address: "12th Street, Sinkor", city: "Monrovia", district: "Greater Monrovia", resCounty: "Montserrado", qual: "Master of Public Health (MPH)", school: "University of Liberia", country: "Liberia", grad: "2004", spec: "Public Health", lpb: "RPh-0112", cat: "Senior Pharmacist", regYear: "2004", expiry: "2027-06-30", emp: "Employed", sector: "Government / Public Hospital", facility: "John F. Kennedy Medical Center", ftype: "Teaching / Referral Hospital", position: "Chief Pharmacist", pCounty: "Montserrado", pDistrict: "Greater Monrovia", years: "21", withCv: true },
  { status: "verified", at: "2026-01-27T13:40:00Z", title: "Mr.", first: "Emmanuel", mid: "S.", last: "Bility", dob: "1985-11-02", gender: "Male", origin: "Nimba", marital: "Married", email: "emmanuel.bility@example.lr", phone: "+231 88 220 4581", address: "Airfield Shortcut, Paynesville", city: "Paynesville", district: "Paynesville", resCounty: "Montserrado", qual: "Bachelor of Pharmacy (BPharm)", school: "University of Liberia", country: "Liberia", grad: "2010", spec: "Community Pharmacy", lpb: "RPh-0215", cat: "Registered Pharmacist", regYear: "2010", expiry: "2026-12-31", emp: "Self-employed", sector: "Private Community (Retail) Pharmacy", facility: "Bility & Sons Pharmacy, Red Light", ftype: "Community Pharmacy", position: "Superintendent Pharmacist", pCounty: "Montserrado", pDistrict: "Paynesville", years: "15" },
  { status: "verified", at: "2026-02-09T10:02:00Z", title: "Dr.", first: "Famatta", mid: "G.", last: "Sirleaf", dob: "1980-06-25", gender: "Female", origin: "Grand Cape Mount", marital: "Married", email: "famatta.sirleaf@example.lr", phone: "+231 77 555 2190", address: "Capitol Bye-Pass", city: "Monrovia", district: "Greater Monrovia", resCounty: "Montserrado", qual: "Doctor of Pharmacy (PharmD)", school: "Kwame Nkrumah University of Science & Technology", country: "Ghana", grad: "2007", spec: "Hospital / Clinical Pharmacy", lpb: "RPh-0164", cat: "Consultant Pharmacist", regYear: "2008", expiry: "2027-03-31", elsewhere: "Ghana", emp: "Employed", sector: "Regulatory / Government Agency", facility: "Liberia Pharmacy Board", ftype: "Government Agency or Program", position: "Director, Pharmacy Practice", pCounty: "Montserrado", pDistrict: "Greater Monrovia", years: "18", withCv: true },
  { status: "verified", at: "2026-02-20T15:55:00Z", title: "Mr.", first: "Varney", mid: "D.", last: "Kiazolu", dob: "1990-01-17", gender: "Male", origin: "Grand Gedeh", marital: "Single", email: "varney.kiazolu@example.lr", phone: "+231 77 804 6633", address: "Gbarnga City", city: "Gbarnga", district: "Gbarnga", resCounty: "Bong", qual: "Bachelor of Pharmacy (BPharm)", school: "University of Liberia", country: "Liberia", grad: "2015", spec: "Hospital / Clinical Pharmacy", lpb: "RPh-0298", cat: "Registered Pharmacist", regYear: "2015", expiry: "2026-09-30", emp: "Employed", sector: "Government / Public Hospital", facility: "Phebe Hospital & School of Nursing", ftype: "Regional / County Hospital", position: "Clinical Pharmacist", pCounty: "Bong", pDistrict: "Suakoko", years: "10" },
  { status: "under_review", at: "2026-03-04T08:30:00Z", title: "Ms.", first: "Deddeh", mid: "M.", last: "Toe", dob: "1992-09-08", gender: "Female", origin: "River Gee", marital: "Single", email: "deddeh.toe@example.lr", phone: "+231 88 617 3002", address: "Buchanan City", city: "Buchanan", district: "Buchanan", resCounty: "Grand Bassa", qual: "Bachelor of Pharmacy (BPharm)", school: "University of Liberia", country: "Liberia", grad: "2018", spec: "Community Pharmacy", lpb: "RPh-0341", cat: "Registered Pharmacist", regYear: "2018", expiry: "2026-12-31", emp: "Employed", sector: "Private Community (Retail) Pharmacy", facility: "New Life Pharmacy, Buchanan", ftype: "Community Pharmacy", position: "Pharmacist-in-Charge", pCounty: "Grand Bassa", pDistrict: "Buchanan", years: "7" },
  { status: "verified", at: "2026-03-12T11:20:00Z", title: "Mr.", first: "Saah", mid: "K.", last: "Gbessay", dob: "1975-12-01", gender: "Male", origin: "Grand Kru", marital: "Married", email: "saah.gbessay@example.lr", phone: "+231 77 331 8810", address: "Harper City", city: "Harper", district: "Harper", resCounty: "Maryland", qual: "Master of Science (MSc Pharmacy)", school: "University of Nigeria, Nsukka", country: "Nigeria", grad: "2002", spec: "Industrial Pharmacy", lpb: "RPh-0091", cat: "Senior Pharmacist", regYear: "2002", expiry: "2027-01-31", emp: "Employed", sector: "Wholesale & Distribution", facility: "Atlantic Pharmaceutical Distributors", ftype: "Wholesale Pharmacy / Distributor", position: "Quality Assurance Manager", pCounty: "Maryland", pDistrict: "Harper", years: "23", withCv: true },
  { status: "verified", at: "2026-03-21T14:11:00Z", title: "Mrs.", first: "Massa", mid: "J.", last: "Konneh", dob: "1983-04-30", gender: "Female", origin: "Lofa", marital: "Widowed", email: "massa.konneh@example.lr", phone: "+231 86 940 1123", address: "Voinjama City", city: "Voinjama", district: "Voinjama", resCounty: "Lofa", qual: "Bachelor of Pharmacy (BPharm)", school: "University of Liberia", country: "Liberia", grad: "2009", spec: "Public Health", lpb: "RPh-0199", cat: "Registered Pharmacist", regYear: "2009", expiry: "2026-11-30", emp: "Employed", sector: "NGO / Faith-Based Organization", facility: "Last Mile Health — Lofa Program", ftype: "NGO Office / Program Site", position: "Pharmacy Program Officer", pCounty: "Lofa", pDistrict: "Voinjama", years: "16" },
  { status: "under_review", at: "2026-04-02T09:47:00Z", title: "Ms.", first: "Jartu", mid: "B.", last: "Flomo", dob: "1995-02-14", gender: "Female", origin: "Nimba", marital: "Single", email: "jartu.flomo@example.lr", phone: "+231 77 206 7745", address: "Ganta Main Street", city: "Ganta", district: "Ganta", resCounty: "Nimba", qual: "Bachelor of Pharmacy (BPharm)", school: "University of Liberia", country: "Liberia", grad: "2021", spec: "Community Pharmacy", lpb: "RPh-0412", cat: "Registered Pharmacist", regYear: "2022", expiry: "2026-12-31", emp: "Employed", sector: "NGO / Faith-Based Organization", facility: "Ganta United Methodist Hospital", ftype: "Regional / County Hospital", position: "Staff Pharmacist", pCounty: "Nimba", pDistrict: "Ganta", years: "4" },
  { status: "verified", at: "2026-04-11T16:03:00Z", title: "Mr.", first: "Nyamah", mid: "P.", last: "Dunbar", dob: "1971-07-09", gender: "Male", origin: "Sinoe", marital: "Married", email: "nyamah.dunbar@example.lr", phone: "+231 88 445 9021", address: "Congo Town", city: "Monrovia", district: "Greater Monrovia", resCounty: "Montserrado", qual: "MBA / Health Management", school: "Cuttington University", country: "Liberia", grad: "1999", spec: "Supply Chain & Logistics", lpb: "RPh-0044", cat: "Consultant Pharmacist", regYear: "1997", expiry: "2027-06-30", elsewhere: "United States", emp: "Employed", sector: "Government / Public Hospital", facility: "National Drug Supply Agency (NDSA)", ftype: "Government Agency or Program", position: "Director, Pharmaceutical Supply Chain", pCounty: "Montserrado", pDistrict: "Greater Monrovia", years: "28", withCv: true },
  { status: "under_review", at: "2026-04-24T10:39:00Z", title: "Ms.", first: "Korto", mid: "W.", last: "Nyema", dob: "1993-10-21", gender: "Female", origin: "Bong", marital: "Single", email: "korto.nyema@example.lr", phone: "+231 77 118 5060", address: "ELWA Junction", city: "Paynesville", district: "Paynesville", resCounty: "Montserrado", qual: "Master of Public Health (MPH)", school: "University of Liberia", country: "Liberia", grad: "2019", spec: "Pharmacovigilance", lpb: "RPh-0367", cat: "Registered Pharmacist", regYear: "2019", expiry: "2027-02-28", emp: "Employed", sector: "International Organization", facility: "WHO Liberia Country Office", ftype: "NGO Office / Program Site", position: "Pharmacovigilance Officer", pCounty: "Montserrado", pDistrict: "Greater Monrovia", years: "7" },
  { status: "verified", at: "2026-05-05T09:05:00Z", title: "Mrs.", first: "Geraldine", mid: "Z.", last: "Mensah", dob: "1979-05-27", gender: "Female", origin: "Grand Bassa", marital: "Married", email: "geraldine.mensah@example.lr", phone: "+231 86 770 3345", address: "Old Road, Sinkor", city: "Monrovia", district: "Greater Monrovia", resCounty: "Montserrado", qual: "Doctor of Pharmacy (PharmD)", school: "University of Ghana", country: "Ghana", grad: "2005", spec: "Hospital / Clinical Pharmacy", lpb: "RPh-0130", cat: "Senior Pharmacist", regYear: "2006", expiry: "2026-10-31", emp: "Employed", sector: "Private Hospital or Clinic", facility: "ELWA Hospital (SIM)", ftype: "Regional / County Hospital", position: "Head of Pharmacy", pCounty: "Montserrado", pDistrict: "Paynesville", years: "20", withCv: true },
  { status: "under_review", at: "2026-05-14T13:26:00Z", title: "Mr.", first: "Roland", mid: "T.", last: "Gbowee", dob: "1988-08-19", gender: "Male", origin: "Grand Gedeh", marital: "Married", email: "roland.gbowee@example.lr", phone: "+231 77 664 2178", address: "Duport Road", city: "Paynesville", district: "Paynesville", resCounty: "Montserrado", qual: "Bachelor of Pharmacy (BPharm)", school: "University of Liberia", country: "Liberia", grad: "2013", spec: "Regulatory Affairs", lpb: "RPh-0260", cat: "Registered Pharmacist", regYear: "2013", expiry: "2026-12-31", emp: "Employed", sector: "Regulatory / Government Agency", facility: "Liberia Pharmacy Board", ftype: "Government Agency or Program", position: "Data & Records Officer", pCounty: "Montserrado", pDistrict: "Greater Monrovia", years: "12" },
  { status: "verified", at: "2026-05-23T11:48:00Z", title: "Ms.", first: "Cecelia", mid: "H.", last: "Nyanti", dob: "1990-03-03", gender: "Female", origin: "River Cess", marital: "Single", email: "cecelia.nyanti@example.lr", phone: "+231 88 901 5544", address: "Kakata City", city: "Kakata", district: "Kakata", resCounty: "Margibi", qual: "Bachelor of Pharmacy (BPharm)", school: "University of Liberia", country: "Liberia", grad: "2014", spec: "Community Pharmacy", lpb: "RPh-0279", cat: "Registered Pharmacist", regYear: "2014", expiry: "2027-01-31", emp: "Self-employed", sector: "Private Community (Retail) Pharmacy", facility: "Faith Clinic Pharmacy, Kakata", ftype: "Community Pharmacy", position: "Owner / Superintendent", pCounty: "Margibi", pDistrict: "Kakata", years: "11" },
  { status: "flagged", at: "2026-05-30T15:12:00Z", title: "Mr.", first: "Abraham", mid: "K.", last: "Dopoe", dob: "1986-06-11", gender: "Male", origin: "Maryland", marital: "Married", email: "abraham.dopoe@example.lr", phone: "+231 77 552 8890", address: "Gbarnga City", city: "Gbarnga", district: "Gbarnga", resCounty: "Bong", qual: "Bachelor of Pharmacy (BPharm)", school: "University of Liberia", country: "Liberia", grad: "2011", spec: "Community Pharmacy", lpb: "RPh-0228", cat: "Registered Pharmacist", regYear: "2011", expiry: "2025-12-31", emp: "Employed", sector: "Private Community (Retail) Pharmacy", facility: "HealthPlus Pharmacy, Gbarnga", ftype: "Community Pharmacy", position: "Pharmacist-in-Charge", pCounty: "Bong", pDistrict: "Gbarnga", years: "14", notes: "License expired Dec 2025 — renewal required before verification can proceed." },
  { status: "under_review", at: "2026-06-08T08:59:00Z", title: "Mrs.", first: "Patience", mid: "L.", last: "Karmue", dob: "1982-01-26", gender: "Female", origin: "Bomi", marital: "Married", email: "patience.karmue@example.lr", phone: "+231 86 313 7025", address: "Tubmanburg City", city: "Tubmanburg", district: "Tubmanburg", resCounty: "Bomi", qual: "Bachelor of Pharmacy (BPharm)", school: "University of Liberia", country: "Liberia", grad: "2008", spec: "Public Health", lpb: "RPh-0187", cat: "Senior Pharmacist", regYear: "2008", expiry: "2026-09-30", emp: "Employed", sector: "Government / Public Hospital", facility: "Bomi County Health Team", ftype: "Government Agency or Program", position: "County Pharmacist", pCounty: "Bomi", pDistrict: "Tubmanburg", years: "17" },
  { status: "under_review", at: "2026-06-16T14:37:00Z", title: "Mr.", first: "Sampson", mid: "W.", last: "Teah", dob: "1994-12-05", gender: "Male", origin: "Sinoe", marital: "Single", email: "sampson.teah@example.lr", phone: "+231 77 299 4168", address: "Greenville City", city: "Greenville", district: "Greenville", resCounty: "Sinoe", qual: "Bachelor of Pharmacy (BPharm)", school: "University of Liberia", country: "Liberia", grad: "2020", spec: "Community Pharmacy", lpb: "RPh-0395", cat: "Registered Pharmacist", regYear: "2021", expiry: "2026-12-31", emp: "Employed", sector: "Private Hospital or Clinic", facility: "Francis J. Grant Memorial Hospital", ftype: "Regional / County Hospital", position: "Staff Pharmacist", pCounty: "Sinoe", pDistrict: "Greenville", years: "5" },
  { status: "verified", at: "2026-06-25T10:51:00Z", title: "Dr.", first: "Lorpu", mid: "K.", last: "Gaye", dob: "1977-09-16", gender: "Female", origin: "Nimba", marital: "Married", email: "lorpu.gaye@example.lr", phone: "+231 88 730 6655", address: "Fifth Street, Sinkor", city: "Monrovia", district: "Greater Monrovia", resCounty: "Montserrado", qual: "Doctor of Philosophy (PhD)", school: "University of Ibadan", country: "Nigeria", grad: "2003", spec: "Academia / Research", lpb: "RPh-0105", cat: "Consultant Pharmacist", regYear: "2003", expiry: "2027-03-31", elsewhere: "Nigeria", emp: "Employed", sector: "Academia / Research", facility: "UL School of Pharmacy, A.M. Dogliotti College", ftype: "University / Training Institution", position: "Associate Professor of Pharmacy", pCounty: "Montserrado", pDistrict: "Greater Monrovia", years: "22", withCv: true },
  { status: "submitted", at: "2026-07-03T09:22:00Z", title: "Mr.", first: "Wilfred", mid: "N.", last: "Sumo", dob: "1996-04-23", gender: "Male", origin: "Gbarpolu", marital: "Single", email: "wilfred.sumo@example.lr", phone: "+231 77 481 0392", address: "Bopulu City", city: "Bopulu", district: "Belleh", resCounty: "Gbarpolu", qual: "Bachelor of Pharmacy (BPharm)", school: "University of Liberia", country: "Liberia", grad: "2023", spec: "None yet", lpb: "RPh-0458", cat: "Provisional (Intern) Pharmacist", regYear: "2024", expiry: "2026-12-31", emp: "Student / Intern", sector: "Government / Public Hospital", facility: "JFK Medical Center (Internship)", ftype: "Teaching / Referral Hospital", position: "Intern Pharmacist", pCounty: "Gbarpolu", pDistrict: "Bopulu", years: "1" },
  { status: "under_review", at: "2026-07-10T13:04:00Z", title: "Ms.", first: "Angeline", mid: "R.", last: "Tokpah", dob: "1991-11-30", gender: "Female", origin: "Lofa", marital: "Married", email: "angeline.tokpah@example.lr", phone: "+231 88 542 7719", address: "Zwedru City", city: "Zwedru", district: "Tchien", resCounty: "Grand Gedeh", qual: "Bachelor of Pharmacy (BPharm)", school: "University of Liberia", country: "Liberia", grad: "2016", spec: "Public Health", lpb: "RPh-0312", cat: "Registered Pharmacist", regYear: "2016", expiry: "2027-04-30", emp: "Employed", sector: "NGO / Faith-Based Organization", facility: "Partners In Health — Zwedru Site", ftype: "NGO Office / Program Site", position: "Pharmacy Coordinator", pCounty: "Grand Gedeh", pDistrict: "Tchien", years: "9" },
  { status: "verified", at: "2026-07-18T08:41:00Z", title: "Mr.", first: "Moses", mid: "Y.", last: "Quaye", dob: "1974-02-07", gender: "Male", origin: "Montserrado", marital: "Married", email: "moses.quaye@example.lr", phone: "+231 77 608 1147", address: "Barnersville Road", city: "Monrovia", district: "Greater Monrovia", resCounty: "Montserrado", qual: "Master of Science (MSc Pharmacy)", school: "Kwame Nkrumah University of Science & Technology", country: "Ghana", grad: "2000", spec: "Industrial Pharmacy", lpb: "RPh-0068", cat: "Senior Pharmacist", regYear: "2000", expiry: "2026-11-30", emp: "Employed", sector: "Pharmaceutical Industry / Manufacturing", facility: "WestAfrica Pharma Manufacturing Ltd.", ftype: "Manufacturing Plant", position: "Production Pharmacist", pCounty: "Montserrado", pDistrict: "Greater Monrovia", years: "25" },
  { status: "submitted", at: "2026-07-29T16:18:00Z", title: "Mrs.", first: "Oretha", mid: "B.", last: "Davis", dob: "1981-05-19", gender: "Female", origin: "Grand Cape Mount", marital: "Married", email: "oretha.davis@example.lr", phone: "+231 86 915 4430", address: "Mamba Point", city: "Monrovia", district: "Greater Monrovia", resCounty: "Montserrado", qual: "Master of Public Health (MPH)", school: "University of Liberia", country: "Liberia", grad: "2006", spec: "Regulatory Affairs", lpb: "RPh-0151", cat: "Consultant Pharmacist", regYear: "2006", expiry: "2027-05-31", emp: "Employed", sector: "Regulatory / Government Agency", facility: "Liberia Pharmacy Board", ftype: "Government Agency or Program", position: "Registrar & CEO", pCounty: "Montserrado", pDistrict: "Greater Monrovia", years: "19", withCv: true },
  { status: "submitted", at: "2026-08-06T11:33:00Z", title: "Mr.", first: "Kpana", mid: "G.", last: "Solo", dob: "1989-07-13", gender: "Male", origin: "Grand Kru", marital: "Single", email: "kpana.solo@example.lr", phone: "+231 77 376 2804", address: "Saclepea Town", city: "Saclepea", district: "Saclepea", resCounty: "Nimba", qual: "Bachelor of Pharmacy (BPharm)", school: "University of Liberia", country: "Liberia", grad: "2017", spec: "Community Pharmacy", lpb: "RPh-0330", cat: "Registered Pharmacist", regYear: "2017", expiry: "2026-10-31", emp: "Self-employed", sector: "Private Community (Retail) Pharmacy", facility: "Solo Care Pharmacy, Saclepea", ftype: "Community Pharmacy", position: "Owner / Superintendent", pCounty: "Nimba", pDistrict: "Saclepea", years: "8" },
  { status: "submitted", at: "2026-08-14T09:58:00Z", title: "Ms.", first: "Rebecca", mid: "V.", last: "Johnson", dob: "1997-08-02", gender: "Female", origin: "Margibi", marital: "Single", email: "rebecca.johnson@example.lr", phone: "+231 88 123 9907", address: "Harbel, Farmington", city: "Harbel", district: "Harbel", resCounty: "Margibi", qual: "Bachelor of Pharmacy (BPharm)", school: "University of Liberia", country: "Liberia", grad: "2024", spec: "None yet", lpb: "RPh-0470", cat: "Provisional (Intern) Pharmacist", regYear: "2025", expiry: "2026-12-31", emp: "Student / Intern", sector: "Government / Public Hospital", facility: "C. H. Rennie Hospital (Internship)", ftype: "Regional / County Hospital", position: "Intern Pharmacist", pCounty: "Margibi", pDistrict: "Kakata", years: "1" },
  { status: "under_review", at: "2026-08-21T14:46:00Z", title: "Mr.", first: "Titus", mid: "Z.", last: "Paye", dob: "1984-10-09", gender: "Male", origin: "River Cess", marital: "Married", email: "titus.paye@example.lr", phone: "+231 86 557 2261", address: "Ganta Main Street", city: "Ganta", district: "Ganta", resCounty: "Nimba", qual: "Bachelor of Pharmacy (BPharm)", school: "University of Liberia", country: "Liberia", grad: "2012", spec: "Supply Chain & Logistics", lpb: "RPh-0244", cat: "Registered Pharmacist", regYear: "2012", expiry: "2027-01-31", emp: "Employed", sector: "Wholesale & Distribution", facility: "MedSource Wholesale Ltd., Ganta", ftype: "Wholesale Pharmacy / Distributor", position: "Responsible Pharmacist", pCounty: "Nimba", pDistrict: "Ganta", years: "13" },
  { status: "flagged", at: "2026-08-28T10:10:00Z", title: "Ms.", first: "Comfort", mid: "A.", last: "Wesseh", dob: "1990-12-24", gender: "Female", origin: "Sinoe", marital: "Single", email: "comfort.wesseh@example.lr", phone: "+231 77 864 5518", address: "Buchanan City", city: "Buchanan", district: "Buchanan", resCounty: "Grand Bassa", qual: "Diploma in Pharmacy", school: "Monrovia Health College", country: "Liberia", grad: "2013", spec: "Community Pharmacy", lpb: "RPh-0522", cat: "Provisional (Intern) Pharmacist", regYear: "2014", expiry: "2025-06-30", emp: "Unemployed", sector: "Private Community (Retail) Pharmacy", facility: "", ftype: "", position: "", pCounty: "Grand Bassa", pDistrict: "Buchanan", years: "6", notes: "Qualification requires verification — diploma certificate unclear; registrant contacted to resubmit scan." },
  { status: "submitted", at: "2026-09-04T15:29:00Z", title: "Mrs.", first: "Josephine", mid: "F.", last: "Freeman", dob: "1987-03-28", gender: "Female", origin: "Grand Bassa", marital: "Married", email: "josephine.freeman@example.lr", phone: "+231 88 432 7788", address: "SKD Boulevard", city: "Paynesville", district: "Paynesville", resCounty: "Montserrado", qual: "Doctor of Pharmacy (PharmD)", school: "University of Ghana", country: "Ghana", grad: "2013", spec: "Hospital / Clinical Pharmacy", lpb: "RPh-0257", cat: "Senior Pharmacist", regYear: "2014", expiry: "2027-06-30", emp: "Employed", sector: "Government / Public Hospital", facility: "Redemption Hospital", ftype: "Teaching / Referral Hospital", position: "Clinical Pharmacist", pCounty: "Montserrado", pDistrict: "Greater Monrovia", years: "12" },
];

export function buildSeeds(): Registration[] {
  return SEEDS.map((a, i) => s(a, i));
}

export const SEED_COUNT = SEEDS.length;
