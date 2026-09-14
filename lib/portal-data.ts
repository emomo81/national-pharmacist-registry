import type { PharmacistAccount } from "./portal-types";

/**
 * Seeded demo pharmacist account, the one featured in the approved UI/UX kit
 * (Emmanuel Momo). Additional accounts created via the public Sign-up page are
 * stored alongside it in the browser until Phase 2 (PostgreSQL).
 */
export function seedPharmacistAccounts(): PharmacistAccount[] {
  return [
    {
      id: "acct-emmanuel-momo",
      email: "emmanuel.momo@example.lr",
      password: "Pharmacist2026!",
      createdAt: "2026-06-20T09:00:00Z",
      personal: {
        title: "Mr.",
        surname: "Momo",
        firstName: "Emmanuel",
        middleName: "K.",
        maidenName: "",
        preferredName: "Emma",
        dob: "1989-06-14",
        gender: "Male",
        countryOfBirth: "Liberia",
        cityOfBirth: "Monrovia",
        nationality: "Liberian",
        nationalId: "LR-NID-44081",
        maritalStatus: "Married",
      },
      contact: {
        email: "emmanuel.momo@example.lr",
        phone: "+231 77 555 0143",
        altPhone: "+231 88 555 0143",
        address: "Duport Road, near Rehab Junction",
        city: "Paynesville",
        district: "Paynesville",
        county: "Montserrado",
      },
      licensure: {
        lpbNumber: "RPh-0338",
        category: "Registered Pharmacist",
        initialRegistrationYear: "2017",
        licenseExpiry: "2027-06-30",
        registeredElsewhere: true,
        otherCountries: "Ghana",
        inGoodStanding: true,
      },
      qualifications: [
        {
          id: "qual-1",
          degreeType: "Bachelor of Pharmacy (BPharm)",
          fieldOfStudy: "Pharmacy",
          institution: "University of Liberia, School of Pharmacy",
          year: "2014",
          certificateName: "bachelor_of_pharmacy.pdf",
          createdAt: "2026-06-20T10:12:00Z",
        },
        {
          id: "qual-2",
          degreeType: "Master of Public Health (MPH)",
          fieldOfStudy: "Public Health",
          institution: "University of Liberia",
          year: "2019",
          certificateName: "mph_certificate.pdf",
          createdAt: "2026-06-21T15:40:00Z",
        },
      ],
      experiences: [
        {
          id: "exp-1",
          role: "Pharmacist-in-Charge",
          facility: "CareWell Pharmacy, Duport Road",
          sector: "Private Community (Retail) Pharmacy",
          county: "Montserrado",
          from: "2019",
          current: true,
        },
        {
          id: "exp-2",
          role: "Staff Pharmacist",
          facility: "Redemption Hospital",
          sector: "Government / Public Hospital",
          county: "Montserrado",
          from: "2015",
          to: "2019",
          current: false,
        },
      ],
      cpd: [
        {
          id: "cpd-1",
          title: "Medicines Safety & Pharmacovigilance",
          provider: "LPB / University of Liberia CPD Unit",
          year: "2025",
          hours: "12",
          createdAt: "2026-07-18T11:03:00Z",
        },
        {
          id: "cpd-2",
          title: "Antimicrobial Stewardship in Community Pharmacy",
          provider: "WAHO Regional Webinar Series",
          year: "2024",
          hours: "8",
          createdAt: "2026-06-22T09:15:00Z",
        },
      ],
      documents: {
        degreeCertificate: { name: "bachelor_of_pharmacy.pdf", type: "application/pdf", size: 2457600, capturedAt: "2026-07-18T12:00:00Z" },
        nationalIdDoc: { name: "national_id.pdf", type: "application/pdf", size: 1258291, capturedAt: "2026-07-19T14:12:00Z" },
        cv: { name: "professional_certificate.pdf", type: "application/pdf", size: 1887437, capturedAt: "2026-07-19T14:14:00Z" },
      },
      applicationStatus: "submitted",
      registryRef: "LPB-2026-0027",
      submittedAt: "2026-07-17T09:45:00Z",
      activity: [
        { at: "2026-07-20T10:24:00Z", text: "Profile updated", icon: "profile" },
        { at: "2026-07-19T16:12:00Z", text: "Document uploaded", icon: "doc" },
        { at: "2026-07-18T11:03:00Z", text: "CPD training added", icon: "cpd" },
        { at: "2026-07-17T09:45:00Z", text: "Application submitted", icon: "submit" },
      ],
    },
  ];
}
