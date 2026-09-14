import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The rules for using the Liberia Pharmacy Board National Pharmacist Registry service.",
};

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: "About this service",
    body: (
      <>
        <p>
          The National Pharmacist Registry is the official online platform of the Liberia Pharmacy Board (LPB)
          for the 2026 National Pharmacist Census. It allows pharmacists to register with the Board, submit
          their credentials for verification, and track the status of their record.
        </p>
      </>
    ),
  },
  {
    title: "Who may use it",
    body: (
      <>
        <p>
          Any pharmacist who falls within the 2026 census categories may create a pharmacist account. This
          includes practicing pharmacists, interns and provisional license holders, non-practicing
          pharmacists, and Liberian-trained pharmacists living abroad. Access to the LPB official portal is
          restricted to authorized Board staff; accounts are issued by the Registrar.
        </p>
      </>
    ),
  },
  {
    title: "Your account",
    body: (
      <>
        <p>
          You are responsible for keeping your password confidential and for all activity carried out through
          your account. Tell the Board immediately if you believe your account has been accessed without your
          permission. Do not create an account on behalf of another pharmacist; each pharmacist must register
          personally.
        </p>
      </>
    ),
  },
  {
    title: "True and complete information",
    body: (
      <>
        <p>
          Registration is a declaration to a statutory body. You must ensure that every detail you submit,
          including license numbers, qualifications and employment information, is true, complete and current.
          The documents you upload must be genuine and must belong to you.
        </p>
        <p>
          Providing false or misleading information, or uploading documents that do not belong to you, may
          result in your record being flagged or rejected, may affect your registration and licensing, and
          may be referred for further action under Board rules.
        </p>
      </>
    ),
  },
  {
    title: "Acceptable use",
    body: (
      <>
        <p>You must not:</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-6">
          <li>attempt to access another person&apos;s record or account;</li>
          <li>use the service to harass or impersonate Board staff or other pharmacists;</li>
          <li>attempt to disrupt, overload or interfere with the service or its data; or</li>
          <li>use automated tools to extract data from the service without written permission from the Board.</li>
        </ul>
      </>
    ),
  },
  {
    title: "Availability and changes",
    body: (
      <>
        <p>
          The Board aims to keep the service available throughout the census period but does not guarantee
          uninterrupted access. The service may be taken offline for maintenance, and the Board may add,
          change or withdraw features. Material changes to these terms will be announced on this page.
        </p>
      </>
    ),
  },
  {
    title: "Content and copyright",
    body: (
      <>
        <p>
          The LPB name, seal and other official marks belong to the Liberia Pharmacy Board. Text and design of
          this service may be reused for non-commercial purposes with attribution. You keep the rights to the
          documents you upload; by submitting them you authorize the Board to store and examine them for
          verification purposes.
        </p>
      </>
    ),
  },
  {
    title: "Governing law",
    body: (
      <>
        <p>These terms are governed by the laws of the Republic of Liberia.</p>
      </>
    ),
  },
  {
    title: "About this demonstration build",
    body: (
      <>
        <p>
          This build of the registry is a front-end demonstration. All data you enter, including uploaded
          documents, is stored only in your own browser and is never transmitted to the Board. Do not use this
          demonstration build as your official registration.
        </p>
      </>
    ),
  },
  {
    title: "Contact",
    body: (
      <>
        <p>
          Questions about these terms may be sent to info@lpb.gov.lr or by telephone to +231 (0) 777 123 456.
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <div className="bg-white">
      <div className="container-x max-w-3xl py-12 sm:py-16">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-700">Liberia Pharmacy Board</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-950 sm:text-4xl">Terms of Use</h1>
        <p className="mt-2 text-sm text-slate-500">National Pharmacist Registry, 2026 census. Last reviewed: September 2026.</p>

        <p className="mt-6 text-slate-700">
          By creating an account or using the National Pharmacist Registry, you agree to these terms.
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
          If you have questions about these terms, write to info@lpb.gov.lr or call +231 (0) 777 123 456.
        </p>
      </div>
    </div>
  );
}
