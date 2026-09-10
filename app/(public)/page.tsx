import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardList,
  UploadCloud,
  Users,
  Landmark,
  GraduationCap,
  Briefcase,
  FileCheck2,
  ChevronRight,
  ShieldCheck,
  BarChart3,
  CalendarDays,
  Phone,
  Mail,
  MapPin,
  UserCog,
  Award,
  LineChart,
} from "lucide-react";
import { Faq } from "@/components/faq";
import { LiberiaFlag } from "@/components/liberia-flag";

const FEATURES = [
  {
    icon: UserCog,
    title: "Professional Registration",
    text: "Keep your information up to date",
    tint: "bg-brand-50 text-brand-600",
  },
  {
    icon: BadgeCheck,
    title: "Credential Verification",
    text: "Build trust and transparency",
    tint: "bg-accent-50 text-accent-600",
  },
  {
    icon: LineChart,
    title: "Workforce Planning",
    text: "Data for better decisions",
    tint: "bg-sky-50 text-sky-600",
  },
  {
    icon: Award,
    title: "Public Health Impact",
    text: "Better pharmacy services for all",
    tint: "bg-violet-50 text-violet-600",
  },
];

const WHO = [
  {
    icon: Users,
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
    n: "1",
    icon: ClipboardList,
    title: "Create your account",
    text: "Sign up with your name and email, then complete your profile — personal details, contacts and LPB registration.",
  },
  {
    n: "2",
    icon: UploadCloud,
    title: "Add credentials & documents",
    text: "Record your qualifications, experience and CPD trainings, and upload certificates, license and national ID.",
  },
  {
    n: "3",
    icon: BadgeCheck,
    title: "Submit for verification",
    text: "Review everything and submit. Track your status live as the LPB reviews, verifies and approves your record.",
  },
];

const DOCS = [
  { name: "Recent passport-size photograph", detail: "JPG or PNG, clear background" },
  { name: "Pharmacy degree / diploma certificate", detail: "PDF or clear image of the original" },
  { name: "Current LPB license certificate", detail: "Provisional holders may submit their intern permit" },
  { name: "National ID card or passport", detail: "Valid government-issued identification" },
  { name: "Professional certificate (optional)", detail: "Post-graduate or specialist credentials" },
];

export default function LandingPage() {
  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="hero-fade relative overflow-hidden text-white">
        <div className="bg-grid absolute inset-0 opacity-60" />
        <div className="container-x relative grid gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:items-center lg:py-24">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-accent-200">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-300 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-300" />
              </span>
              2026 NATIONAL PHARMACIST CENSUS — NOW OPEN
            </div>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
              National Pharmacist Registry &amp; Credential Database for Liberia
            </h1>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-accent-300">
              Register · Verify · Plan · Build a Healthier Liberia
            </p>
            <p className="mt-5 text-base leading-relaxed text-white/75">
              The Liberia Pharmacy Board is committed to maintaining an accurate, up-to-date registry of all
              licensed pharmacists in Liberia. This platform helps you register, verify your credentials, and
              support a stronger pharmacy workforce for a healthier nation.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className="btn-accent px-6 py-3 text-base">
                Start Registration
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#about" className="btn-glass px-6 py-3 text-base">
                Learn More
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/hero-pharmacist.jpg"
                alt="A Liberian pharmacist in a modern community pharmacy"
                className="h-[320px] w-full object-cover sm:h-[420px]"
              />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-l from-transparent via-transparent to-brand-950/40" />
            </div>
            <div className="absolute -bottom-5 left-5 right-5 flex items-center gap-3 rounded-2xl bg-white/95 p-4 shadow-xl backdrop-blur sm:left-8 sm:right-auto">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-brand-950">Official LPB verification</p>
                <p className="text-xs text-slate-500">Your credentials, reviewed by the Board itself</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FEATURES ---------- */}
      <section className="relative z-10 -mt-1 bg-transparent pb-2 pt-6">
        <div className="container-x grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="card group p-5 transition hover:-translate-y-1 hover:shadow-lg">
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${f.tint}`}>
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-bold text-brand-950">{f.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- ABOUT / WHO ---------- */}
      <section id="about" className="scroll-mt-28 py-16 sm:py-20">
        <div className="container-x">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-600">About the census</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-950 sm:text-4xl">Who must register</h2>
            <p className="mt-3 text-slate-600">
              Registration is <strong>mandatory</strong> for every pharmacist captured by the census categories
              below, whether or not you currently hold a valid license.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WHO.map((w) => (
              <div key={w.title} className="card group p-6 transition hover:-translate-y-1 hover:shadow-lg">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100 transition group-hover:bg-brand-800 group-hover:text-white">
                  <w.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-bold text-brand-950">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{w.text}</p>
              </div>
            ))}
          </div>

          {/* How it works */}
          <ol className="mt-12 grid gap-4 lg:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n} className="card relative overflow-hidden p-6">
                <span className="absolute -right-2 -top-6 select-none text-[92px] font-black leading-none text-brand-50">
                  {s.n}
                </span>
                <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-accent-500 text-white">
                  <s.icon className="h-5 w-5" />
                </span>
                <h3 className="relative mt-4 font-bold text-brand-950">{s.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-slate-600">{s.text}</p>
              </li>
            ))}
          </ol>

          <div className="mt-8 flex flex-col items-start gap-3 rounded-2xl border border-amber-300/70 bg-amber-50 p-5 sm:flex-row sm:items-center">
            <CalendarDays className="h-5 w-5 shrink-0 text-amber-600" />
            <p className="text-sm text-slate-700">
              <strong className="text-brand-950">Census deadline:</strong> all registrations must be submitted by{" "}
              <strong>31 December 2026</strong>. Pharmacists who miss the deadline may face delays at license renewal.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- REQUIREMENTS ---------- */}
      <section className="border-t border-slate-200 bg-white py-16 sm:py-20">
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
              <Link href="/signup" className="btn-accent">
                I&apos;m ready — start now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <div className="card overflow-hidden border-brand-800 bg-brand-950 text-white">
              <div className="border-b border-white/10 px-6 py-5">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-accent-300">
                  <ShieldCheck className="h-3.5 w-3.5" /> For LPB official use
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
                      <f.icon className="mt-0.5 h-5 w-5 shrink-0 text-accent-300" />
                      <span>{f.text}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/official" className="btn-accent mt-2">
                  Access the official portal <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="card flex items-center gap-4 p-5">
              <div className="flex -space-x-2">
                {["MW", "DJ", "GC"].map((i, k) => (
                  <span
                    key={i}
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white ring-2 ring-white ${["bg-brand-600", "bg-accent-500", "bg-violet-500"][k]}`}
                  >
                    {i}
                  </span>
                ))}
              </div>
              <p className="text-sm text-slate-600">
                Hundreds of pharmacists are already counted in the 2026 census —{" "}
                <Link href="/signup" className="font-bold text-brand-800 hover:underline">
                  join them
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FLAG CTA BAND ---------- */}
      <section className="hero-fade no-print relative overflow-hidden py-14 text-white">
        <div className="bg-grid absolute inset-0 opacity-40" />
        <div className="container-x relative flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-4">
            <LiberiaFlag className="h-10 w-16 rounded shadow-lg ring-1 ring-white/30" />
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                A Professional Pharmacy Workforce
              </h2>
              <p className="mt-1 text-lg font-semibold text-accent-300">for a Healthier Liberia</p>
            </div>
          </div>
          <Link href="/signup" className="btn-accent px-7 py-3 text-base">
            Register now <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ---------- HELP & SUPPORT ---------- */}
      <section id="support" className="scroll-mt-28 bg-slate-50 py-16 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-600">Help &amp; support</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-950 sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-3 max-w-md text-slate-600">
              Still unsure about anything? Reach the Board directly:
            </p>
            <ul className="mt-6 space-y-4">
              <li className="card flex items-center gap-3 p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-600"><Phone className="h-4 w-4" /></span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Call us</p>
                  <p className="text-sm font-bold text-brand-950">+231 (0) 777 123 456</p>
                </div>
              </li>
              <li className="card flex items-center gap-3 p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-600"><Mail className="h-4 w-4" /></span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Email</p>
                  <p className="text-sm font-bold text-brand-950">info@lpb.gov.lr</p>
                </div>
              </li>
              <li className="card flex items-center gap-3 p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-600"><MapPin className="h-4 w-4" /></span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Visit</p>
                  <p className="text-sm font-bold text-brand-950">Monrovia, Liberia</p>
                </div>
              </li>
            </ul>
          </div>
          <Faq />
        </div>
      </section>
    </>
  );
}
