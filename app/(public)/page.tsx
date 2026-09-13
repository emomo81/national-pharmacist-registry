import Link from "next/link";
import { Faq } from "@/components/faq";
import { LiberiaFlag } from "@/components/liberia-flag";
import { DemoPreview } from "@/components/demo-preview";

const PURPOSE = [
  {
    title: "A single official register",
    text: "One authoritative record of every pharmacist licensed to practice in Liberia, maintained by the Board.",
  },
  {
    title: "Credential verification",
    text: "The Board checks every submitted qualification, license and identity document before a record is marked verified.",
  },
  {
    title: "Workforce planning",
    text: "County, sector and cadre data shows where pharmacists work and where they are needed, informing deployment and training decisions.",
  },
  {
    title: "Public protection",
    text: "An accurate register helps the Board act against unqualified practice and expired licenses.",
  },
];

const WHO = [
  {
    title: "Practicing pharmacists",
    text: "Every pharmacist currently practicing anywhere in Liberia, whether public or private, retail or hospital, full-time or part-time.",
  },
  {
    title: "Interns and provisional holders",
    text: "Pharmacy graduates serving their internship or holding a provisional (intern) license with the Board.",
  },
  {
    title: "Non-practicing pharmacists",
    text: "Trained pharmacists who are between roles, retired, or working outside the pharmacy sector.",
  },
  {
    title: "Diaspora pharmacists",
    text: "Liberian-trained pharmacists abroad, and foreign-trained pharmacists intending to practice in Liberia.",
  },
];

const STEPS = [
  {
    n: "1",
    title: "Create your account",
    text: "Sign up with your name and email, then complete your profile: personal details, contacts and LPB registration.",
  },
  {
    n: "2",
    title: "Add credentials and documents",
    text: "Record your qualifications, experience and CPD trainings, then upload certificates, license and national ID.",
  },
  {
    n: "3",
    title: "Submit for verification",
    text: "Review everything and submit. Track your status as the LPB reviews, verifies and approves your record.",
  },
];

const DOCS = [
  { name: "Recent passport-size photograph", detail: "JPG or PNG, clear background" },
  { name: "Pharmacy degree or diploma certificate", detail: "PDF or clear image of the original" },
  { name: "Current LPB license certificate", detail: "Provisional holders may submit their intern permit" },
  { name: "National ID card or passport", detail: "Valid government-issued identification" },
  { name: "Professional certificate (optional)", detail: "Post-graduate or specialist credentials" },
];

export default function LandingPage() {
  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="band-navy text-white">
        <div className="container-x grid gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:items-center">
          <div className="max-w-xl">
            <p className="inline-block border border-white/30 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/85">
              2026 National Pharmacist Census
            </p>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl">
              National Pharmacist Registry &amp; Credential Database for Liberia
            </h1>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-accent-300">
              An official service of the Liberia Pharmacy Board
            </p>
            <p className="mt-5 text-base leading-relaxed text-white/80">
              The Liberia Pharmacy Board is committed to maintaining an accurate, up-to-date registry of all
              licensed pharmacists in Liberia. This platform lets you register, verify your credentials, and
              support a stronger pharmacy workforce for a healthier nation.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className="btn-accent px-6 py-3 text-base">
                Start registration
              </Link>
              <Link href="/login" className="btn-on-dark px-6 py-3 text-base">
                Sign in
              </Link>
            </div>
            <p className="mt-5 text-sm text-white/60">
              New to the census? Read{" "}
              <Link href="#about" className="font-semibold text-white underline underline-offset-4 hover:text-accent-200">
                who must register
              </Link>{" "}
              and the{" "}
              <Link href="#faq" className="font-semibold text-white underline underline-offset-4 hover:text-accent-200">
                frequently asked questions
              </Link>
              .
            </p>
          </div>

          <div>
            <div className="border border-white/25">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/hero-pharmacist.jpg"
                alt="A Liberian pharmacist in a modern community pharmacy"
                className="h-[320px] w-full object-cover sm:h-[420px]"
              />
            </div>
            <p className="mt-2 text-xs text-white/50">
              Registration is open to pharmacists in all 15 counties until 31 December 2026.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- PURPOSE ---------- */}
      <section className="border-b border-slate-300 bg-white py-14 sm:py-16">
        <div className="container-x grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-700">About the registry</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-950 sm:text-4xl">
              What the registry is for
            </h2>
            <p className="mt-4 text-slate-700">
              The register is the Board&apos;s official record of the pharmacy workforce. It is used to verify
              credentials at license renewal, and to plan services, training and deployment across the
              country.
            </p>
          </div>
          <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {PURPOSE.map((p) => (
              <div key={p.title}>
                <dt className="font-bold text-brand-950">{p.title}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-slate-600">{p.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- WHO MUST REGISTER ---------- */}
      <section id="about" className="scroll-mt-28 bg-paper-100 py-14 sm:py-16">
        <div className="container-x">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-700">About the census</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-950 sm:text-4xl">Who must register</h2>
            <p className="mt-3 text-slate-700">
              Registration is <strong>mandatory</strong> for every pharmacist captured by the census categories
              below, whether or not you currently hold a valid license.
            </p>
          </div>

          <div className="mt-8 grid gap-px border border-slate-300 bg-slate-300 sm:grid-cols-2">
            {WHO.map((w) => (
              <div key={w.title} className="bg-white p-6">
                <h3 className="font-bold text-brand-950">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{w.text}</p>
              </div>
            ))}
          </div>

          {/* How to register */}
          <h3 className="mt-14 text-2xl font-extrabold tracking-tight text-brand-950">How to register</h3>
          <ol className="mt-6 grid gap-px border border-slate-300 bg-slate-300 sm:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n} className="bg-white p-6">
                <p className="text-sm font-extrabold text-accent-700">Step {s.n}</p>
                <h4 className="mt-2 font-bold text-brand-950">{s.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.text}</p>
              </li>
            ))}
          </ol>

          <div className="notice mt-8 border-amber-500 bg-amber-50">
            <strong className="text-brand-950">Census deadline:</strong> all registrations must be submitted by{" "}
            <strong>31 December 2026</strong>. Pharmacists who miss the deadline may face delays at license renewal.
          </div>
        </div>
      </section>

      {/* ---------- REQUIREMENTS ---------- */}
      <section className="border-y border-slate-300 bg-white py-14 sm:py-16">
        <div className="container-x grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="card">
            <div className="border-b border-slate-300 px-6 py-5">
              <h2 className="text-xl font-extrabold tracking-tight text-brand-950">Required credentials</h2>
              <p className="mt-1 text-sm text-slate-600">Accepted formats: JPG, PNG or PDF. Maximum 5 MB per file.</p>
            </div>
            <ul className="divide-y divide-slate-200">
              {DOCS.map((d, i) => (
                <li key={d.name} className="flex items-start gap-4 px-6 py-4">
                  <span className="pt-0.5 text-sm font-extrabold text-brand-500">{i + 1}.</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{d.name}</p>
                    <p className="text-xs text-slate-500">{d.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-slate-300 bg-paper-100 px-6 py-4">
              <Link href="/signup" className="btn-accent">
                Start now
              </Link>
            </div>
          </div>

          <div className="band-navy rounded-sm text-white">
            <div className="border-b border-white/20 px-6 py-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-300">For LPB official use</p>
              <h2 className="mt-2 text-xl font-extrabold tracking-tight">Data for decision-making</h2>
            </div>
            <div className="space-y-4 px-6 py-6 text-sm leading-relaxed text-white/80">
              <p>
                Every submission lands in the LPB official portal, where authorized officers review, verify and
                flag records as work proceeds.
              </p>
              <ul className="space-y-2">
                <li className="flex gap-2.5">
                  <span aria-hidden className="text-accent-300">-</span>
                  <span>Workforce analytics: distribution by county, sector, cadre and gender.</span>
                </li>
                <li className="flex gap-2.5">
                  <span aria-hidden className="text-accent-300">-</span>
                  <span>One-click export to CSV for offline analysis and reporting to Senior Management.</span>
                </li>
                <li className="flex gap-2.5">
                  <span aria-hidden className="text-accent-300">-</span>
                  <span>Audit trail: each record carries uploads, status history and reviewer notes.</span>
                </li>
              </ul>
              <Link href="/official" className="btn-accent mt-2">
                Access the official portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- THE SERVICE IN PRACTICE ---------- */}
      <section className="bg-paper-100 py-14 sm:py-16">
        <div className="container-x">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-700">The service in practice</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-950 sm:text-4xl">
              Screenshots from the working service
            </h2>
            <p className="mt-3 text-slate-700">
              Both portals are fully functional in this demonstration build. Pharmacists build and submit their
              own record; Board officials review and verify it.
            </p>
          </div>

          <DemoPreview />
        </div>
      </section>

      {/* ---------- FLAG CTA BAND ---------- */}
      <section className="band-navy no-print py-14 text-white">
        <div className="container-x flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <LiberiaFlag className="h-10 w-16 border border-white/30" />
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                A Professional Pharmacy Workforce
              </h2>
              <p className="mt-1 text-lg font-semibold text-accent-300">for a Healthier Liberia</p>
            </div>
          </div>
          <Link href="/signup" className="btn-accent px-7 py-3 text-base">
            Register now
          </Link>
        </div>
      </section>

      {/* ---------- HELP & SUPPORT ---------- */}
      <section id="support" className="scroll-mt-28 border-t border-slate-300 bg-white py-14 sm:py-16">
        <div className="container-x grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-700">Help &amp; support</p>
            <h2 id="faq" className="mt-2 scroll-mt-28 text-3xl font-extrabold tracking-tight text-brand-950 sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-3 max-w-md text-slate-700">
              Still unsure about anything? Reach the Board directly:
            </p>
            <dl className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
              <div className="flex flex-col gap-0.5 py-4 sm:flex-row sm:gap-6">
                <dt className="w-28 shrink-0 text-xs font-bold uppercase tracking-wide text-slate-500">Telephone</dt>
                <dd className="text-sm font-bold text-brand-950">+231 (0) 777 123 456</dd>
              </div>
              <div className="flex flex-col gap-0.5 py-4 sm:flex-row sm:gap-6">
                <dt className="w-28 shrink-0 text-xs font-bold uppercase tracking-wide text-slate-500">Email</dt>
                <dd className="text-sm font-bold text-brand-950">info@lpb.gov.lr</dd>
              </div>
              <div className="flex flex-col gap-0.5 py-4 sm:flex-row sm:gap-6">
                <dt className="w-28 shrink-0 text-xs font-bold uppercase tracking-wide text-slate-500">Office</dt>
                <dd className="text-sm font-bold text-brand-950">Liberia Pharmacy Board, Monrovia, Liberia</dd>
              </div>
            </dl>
          </div>
          <Faq />
        </div>
      </section>
    </>
  );
}
