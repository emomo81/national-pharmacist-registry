import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How the Liberia Pharmacy Board collects, uses and protects the personal data submitted to the 2026 National Pharmacist Census.",
};

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: "Who we are",
    body: (
      <>
        <p>
          The National Pharmacist Registry is operated by the Liberia Pharmacy Board (LPB), the statutory body
          responsible for the registration and licensing of pharmacists in Liberia. The Board is the controller
          of the personal data described in this policy.
        </p>
      </>
    ),
  },
  {
    title: "What data we collect",
    body: (
      <>
        <p>When you register with the census, we collect:</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-6">
          <li>Account data: your name, email address and a password stored in hashed form.</li>
          <li>
            Personal data: date of birth, gender, marital status, nationality, photograph, and your contact
            details including telephone, email, county of residence and address.
          </li>
          <li>
            Professional data: your LPB license number, license category and validity, educational
            qualifications, employment status, sector, facility and county of practice, areas of
            specialization, and continuing professional development (CPD) records.
          </li>
          <li>
            Documents you upload: your pharmacy degree or diploma certificate, current LPB license
            certificate, and a copy of your national ID card or passport.
          </li>
          <li>Technical data: records of when you created and updated your submission.</li>
        </ul>
      </>
    ),
  },
  {
    title: "Why we use your data",
    body: (
      <>
        <p>Your data is used only for the purposes of the 2026 National Pharmacist Census, specifically:</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-6">
          <li>Creating and maintaining your entry in the national register of pharmacists.</li>
          <li>Verifying your qualifications, license and identity documents.</li>
          <li>Planning and regulating the pharmacy workforce, including licensing decisions at renewal.</li>
          <li>Contacting you about your registration, verification outcome or license renewal.</li>
          <li>
            Producing aggregate statistics for workforce planning and reporting. Published statistics are
            aggregated and do not identify individual pharmacists.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Who can see your data",
    body: (
      <>
        <p>
          Your record is visible only to authorized officers of the Liberia Pharmacy Board who need it to
          carry out verification and registry duties. We do not sell, rent or trade your personal data. We do
          not share it with third parties except where aggregation prevents identification of individuals, or
          where the law requires disclosure.
        </p>
      </>
    ),
  },
  {
    title: "How your data is protected",
    body: (
      <>
        <p>
          Data is transmitted over an encrypted connection. Access to registry records requires an individual
          official account, and every verification action is recorded against the officer who took it. Paper
          and electronic records held by the Board are handled in line with its confidentiality policy.
        </p>
      </>
    ),
  },
  {
    title: "How long we keep it",
    body: (
      <>
        <p>
          Registry records are retained for as long as you remain on the national register, and thereafter for
          the period required by the Board&apos;s records policy. You may ask about the retention period that
          applies to your record using the contact details below.
        </p>
      </>
    ),
  },
  {
    title: "Your rights",
    body: (
      <>
        <p>You may ask the Board to:</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-6">
          <li>tell you what data it holds about you;</li>
          <li>correct data that is wrong or out of date;</li>
          <li>explain how your data has been used; and</li>
          <li>withdraw consent for optional fields such as specialist certificates.</li>
        </ul>
        <p className="mt-3">
          To exercise any of these rights, contact the Registrar using the details below. Statutory
          registration data cannot be deleted while you remain on the register.
        </p>
      </>
    ),
  },
  {
    title: "About this demonstration build",
    body: (
      <>
        <p>
          This build of the registry is a front-end demonstration. All data you enter, including uploaded
          documents, is stored only in your own browser and is never transmitted to the Board. The full
          service with a central database is planned for the next phase.
        </p>
      </>
    ),
  },
  {
    title: "Contact",
    body: (
      <>
        <p>
          Liberia Pharmacy Board, Monrovia, Liberia. Email: info@lpb.gov.lr. Telephone: +231 (0) 777 123 456.
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-white">
      <div className="container-x max-w-3xl py-12 sm:py-16">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-700">Liberia Pharmacy Board</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-950 sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-slate-500">National Pharmacist Registry, 2026 census. Last reviewed: September 2026.</p>

        <p className="mt-6 text-slate-700">
          This policy explains what personal data the Liberia Pharmacy Board collects through the National
          Pharmacist Registry, how it is used, and the choices you have.
        </p>

        <div className="mt-10 space-y-10">
          {SECTIONS.map((s, i) => (
            <section key={s.title}>
              <h2 className="border-b border-slate-300 pb-2 text-lg font-bold text-brand-950">
                {i + 1}. {s.title}
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-700">{s.body}</div>
            </section>
          ))}
        </div>

        <p className="mt-10 border-t border-slate-300 pt-6 text-sm text-slate-500">
          If you have questions about this policy, write to info@lpb.gov.lr or call +231 (0) 777 123 456.
        </p>
      </div>
    </div>
  );
}
