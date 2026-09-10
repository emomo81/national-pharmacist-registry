import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardList,
  FileCheck2,
  UploadCloud,
  Users,
  MapPin,
  Landmark,
  Stethoscope,
  GraduationCap,
  Briefcase,
  LockKeyhole,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  BarChart3,
  CalendarDays,
} from "lucide-react";
import { Faq } from "@/components/faq";

const WHO = [
  {
    icon: Stethoscope,
    title: "Practicing pharmacists",
    text: "Every pharmacist currently practicing anywhere in Liberia — public or private, retail or hospital, full- or part-time.",
  },
  {
    icon: GraduationCap,
    title: "Interns & provisional holders",
    text: "Pharmacy graduates serving their internship or holding a provisional (intern) license with the Board.",
  },
  {
    icon: Briefcase,
    title: "Non-practicing pharmacists",
    text: "Trained pharmacists who are between roles, retired, or working outside the pharmacy sector.",
  },
  {
    icon: Landmark,
    title: "Diaspora pharmacists",
    text: "Liberian-trained pharmacists abroad, and foreign-trained pharmacists intending to practice in Liberia.",
  },
];

const STEPS = [
  {
    n: "01",
    icon: ClipboardList,
    title: "Complete the census form",
    text: "Fill in your personal, contact, education, licensure and practice details. The form saves your progress automatically.",
  },
  {
    n: "02",
    icon: UploadCloud,
    title: "Upload your credentials",
    text: "Attach clear scans or photos of your passport photo, pharmacy degree, current LPB license and national ID.",
  },
  {
    n: "03",
    icon: BadgeCheck,
    title: "Submit & get your reference",
    text: "Review everything, sign the declaration and submit. You instantly receive an official registry reference number.",
  },
];

const DOCS = [
  { name: "Recent passport-size photograph", detail: "JPG or PNG, clear background" },
  { name: "Pharmacy degree / diploma certificate", detail: "PDF or clear image of the original" },
  { name: "Current LPB license certificate", detail: "Provisional holders may submit their intern permit" },
  { name: "National ID card or passport", detail: "Valid government-issued identification" },
  { name: "Curriculum vitae (optional)", detail: "Recommended for senior and consulting cadres" },
];

const STATS = [
  { icon: Users, value: "All 15", label: "Counties covered" },
  { icon: FileCheck2, value: "7 steps", label: "Simple census form" },
  { icon: CalendarDays, value: "Jan – Dec", label: "2026 census window" },
  { icon: ShieldCheck, value: "Verified", label: "By the LPB Registrar" },
];

export default function LandingPage() {
  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="hero-fade relative overflow-hidden text-white">
        <div className="bg-grid absolute inset-0 opacity-60" />
        <div className="container-x relative grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-gold-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-400" />
              </span>
              2026 NATIONAL PHARMACIST CENSUS — NOW OPEN
            </div>
            <h1 className="mt-6 max-w-xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              One verified registry for every pharmacist in Liberia.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
              The Liberia Pharmacy Board is conducting the 2026 National Pharmacist Census.
              Register yourself and upload your credentials online — your record powers
              workforce planning, licensing and national health policy.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/register" className="btn-gold px-6 py-3 text-base">
                Start your registration
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/official"
                className="btn border border-white/25 bg-white/5 text-white backdrop-blur transition hover:bg-white/15 focus-visible:ring-white/30"
              >
                <LockKeyhole className="h-4 w-4" />
                LPB Official Portal
              </Link>
            </div>
            <dl className="mt-10 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur">
                  <s.icon className="h-4 w-4 text-gold-300" />
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="mt-2 text-sm font-bold">{s.value}</dd>
                  <dd className="text-[11px] leading-snug text-white/60">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Hero card */}
          <div className="card relative border-0 bg-white p-0 text-slate-800 shadow-2xl lg:justify-self-end">
            <div className="rounded-t-2xl border-b border-slate-100 bg-slate-50/60 px-6 py-4">
              <p className="flex items-center gap-2 text-sm font-bold text-brand-900">
                <FileCheck2 className="h-4 w-4 text-brand-600" />
                What you&apos;ll need ready
              </p>
              <p className="mt-0.5 text-xs text-slate-500">Have these on hand before you start — it takes ±15 minutes.</p>
            </div>
            <ul className="space-y-0.5 px-3 py-3">
              {DOCS.map((d) => (
                <li key={d.name} className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition hover:bg-slate-50">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100">
                    <FileCheck2 className="h-3.5 w-3.5 text-brand-700" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{d.name}</p>
                    <p className="text-xs text-slate-500">{d.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="rounded-b-2xl border-t border-slate-100 bg-brand-50/60 px-6 py-4">
              <Link href="/register" className="btn-primary w-full">
                Open the census form
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- WHO MUST REGISTER ---------- */}
      <section id="who" className="scroll-mt-28 py-16 sm:py-20">
        <div className="container-x">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">Part One · Enumerator instructions</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-950 sm:text-4xl">Who must register</h2>
            <p className="mt-3 text-slate-600">
              Registration is <strong>mandatory</strong> for every pharmacist captured by the census categories
              below, whether or not you currently hold a valid license.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WHO.map((w) => (
              <div key={w.title} className="card group p-6 transition hover:-translate-y-1 hover:shadow-lg">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100 transition group-hover:bg-brand-600 group-hover:text-white">
                  <w.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-bold text-brand-950">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <section id="steps" className="scroll-mt-28 border-y border-slate-200 bg-white py-16 sm:py-20">
        <div className="container-x">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">Three simple steps</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-950 sm:text-4xl">How registration works</h2>
          </div>
          <ol className="mt-10 grid gap-4 lg:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n} className="card relative overflow-hidden p-6">
                <span className="absolute -right-3 -top-5 select-none text-[86px] font-black leading-none text-brand-50">
                  {s.n}
                </span>
                <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white">
                  <s.icon className="h-5 w-5" />
                </span>
                <h3 className="relative mt-4 font-bold text-brand-950">{s.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-slate-600">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-col items-start gap-3 rounded-2xl border border-gold-300/60 bg-gold-300/10 p-5 sm:flex-row sm:items-center">
            <CalendarDays className="h-5 w-5 shrink-0 text-gold-600" />
            <p className="text-sm text-slate-700">
              <strong className="text-brand-950">Census deadline:</strong> all registrations must be submitted by{" "}
              <strong>31 December 2026</strong>. Pharmacists who miss the deadline may face delays at license renewal.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- REQUIREMENTS + OFFICIAL USE ---------- */}
      <section id="requirements" className="scroll-mt-28 py-16 sm:py-20">
        <div className="container-x grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="card overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-xl font-extrabold tracking-tight text-brand-950">Required credentials</h2>
              <p className="mt-1 text-sm text-slate-500">Accepted formats: JPG, PNG or PDF · max 5 MB per file</p>
            </div>
            <ul className="divide-y divide-slate-100">
              {DOCS.map((d, i) => (
                <li key={d.name} className="flex items-center gap-4 px-6 py-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700 ring-1 ring-brand-100">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{d.name}</p>
                    <p className="text-xs text-slate-500">{d.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-slate-100 bg-slate-50/60 px-6 py-4">
              <Link href="/register" className="btn-primary">
                I&apos;m ready — start now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="card overflow-hidden border-brand-800 bg-brand-950 text-white">
            <div className="border-b border-white/10 px-6 py-5">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-gold-400">
                <LockKeyhole className="h-3.5 w-3.5" /> For LPB official use
              </p>
              <h2 className="mt-2 text-xl font-extrabold tracking-tight">Data that drives decisions</h2>
            </div>
            <div className="space-y-4 px-6 py-6 text-sm leading-relaxed text-white/75">
              <p>
                Every submission lands in the LPB official portal, where authorized officers{" "}
                <strong className="text-white">review, verify and flag</strong> records in real time.
              </p>
              <ul className="space-y-3">
                {[
                  { icon: BarChart3, text: "Live workforce analytics — distribution by county, sector, cadre and gender." },
                  { icon: FileCheck2, text: "One-click export to CSV for storage, offline analysis and reporting to Senior Management." },
                  { icon: ShieldCheck, text: "Credential trail: each record carries uploads, status history and reviewer notes." },
                ].map((f) => (
                  <li key={f.text} className="flex gap-3">
                    <f.icon className="mt-0.5 h-5 w-5 shrink-0 text-gold-300" />
                    <span>{f.text}</span>
                  </li>
                ))}
              </ul>
              <Link href="/official" className="btn-gold mt-2">
                Access the official portal <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section id="faq" className="scroll-mt-28 border-t border-slate-200 bg-white py-16 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
              <HelpCircle className="h-4 w-4" /> Good to know
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-950 sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-3 max-w-md text-slate-600">
              Still unsure about anything? Contact the Board at{" "}
              <span className="font-semibold text-brand-800">registry@lpb.gov.lr</span> or call{" "}
              <span className="font-semibold text-brand-800">+231 77 600 2026</span>.
            </p>
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <MapPin className="h-5 w-5 shrink-0 text-brand-600" />
              <p className="text-sm text-slate-600">
                Prefer in-person help? County pharmacists and LPB liaison officers can assist with your online submission.
              </p>
            </div>
          </div>
          <Faq />
        </div>
      </section>

      {/* ---------- FINAL CTA ---------- */}
      <section className="hero-fade no-print relative overflow-hidden py-16 text-white">
        <div className="bg-grid absolute inset-0 opacity-50" />
        <div className="container-x relative flex flex-col items-center text-center">
          <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
            Your registration strengthens pharmacy in Liberia.
          </h2>
          <p className="mt-3 max-w-xl text-white/70">
            Fifteen minutes of your time gives the Board the verified data it needs to plan,
            regulate and protect the public.
          </p>
          <Link href="/register" className="btn-gold mt-7 px-7 py-3 text-base">
            Register now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
