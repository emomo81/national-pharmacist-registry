"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail, KeyRound, Loader2, ArrowLeft, ShieldCheck, BarChart3, FileDown, Info } from "lucide-react";
import { login } from "@/lib/auth";

const PERKS = [
  { icon: BarChart3, text: "Live census analytics across all 15 counties" },
  { icon: ShieldCheck, text: "Verify, flag and annotate pharmacist records" },
  { icon: FileDown, text: "One-click CSV export for offline analysis" },
];

export default function OfficialLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const session = await login(email, password);
    setLoading(false);
    if (!session) {
      setError("Invalid credentials. Use one of the demo accounts shown below.");
      return;
    }
    router.push("/admin");
  }

  return (
    <div className="grid min-h-[calc(100vh-70px)] lg:grid-cols-[1fr_1.1fr]">
      {/* Brand panel */}
      <aside className="hero-fade relative hidden overflow-hidden text-white lg:block">
        <div className="bg-grid absolute inset-0 opacity-50" />
        <div className="relative flex h-full flex-col justify-between p-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/lpb-logo.svg" alt="" className="h-16 w-16" />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold-300">LPB Official Use Only</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight">
              Registry Command Center
            </h1>
            <p className="mt-4 max-w-md text-white/70">
              The secure workspace where LPB officials download, review, verify and analyze 2026 census
              submissions to support national decision-making.
            </p>
            <ul className="mt-8 space-y-4">
              {PERKS.map((p) => (
                <li key={p.text} className="flex items-center gap-3 text-sm text-white/85">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                    <p.icon className="h-4 w-4 text-gold-300" />
                  </span>
                  {p.text}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-white/40">Access is logged and restricted to authorized Board staff.</p>
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <Link href="/" className="btn-ghost -ml-2 mb-6 px-2.5 py-1.5 text-xs">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to public site
          </Link>

          <div className="card p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-700 text-white">
                <LockKeyhole className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-brand-950">Official sign-in</h2>
                <p className="text-xs text-slate-500">Liberia Pharmacy Board staff only</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div>
                <label htmlFor="email" className="label">Work email</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input pl-10"
                    placeholder="name@lpb.gov.lr"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="label">Password</label>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pl-10"
                    placeholder="••••••••••"
                  />
                </div>
              </div>

              {error && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700" role="alert">
                  {error}
                </p>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LockKeyhole className="h-4 w-4" />}
                {loading ? "Signing in…" : "Sign in to the portal"}
              </button>
            </form>

            <div className="mt-7 rounded-xl border border-sky-200 bg-sky-50/70 p-4">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-sky-700">
                <Info className="h-3.5 w-3.5" /> Demo environment — sign-in accounts
              </p>
              <div className="mt-3 space-y-2 text-xs text-sky-900">
                <button
                  type="button"
                  onClick={() => { setEmail("admin@lpb.gov.lr"); setPassword("Liberia2026!"); }}
                  className="block w-full rounded-lg bg-white/80 px-3 py-2 text-left ring-1 ring-sky-100 transition hover:ring-sky-300"
                >
                  <span className="font-bold">Registrar & CEO</span> — admin@lpb.gov.lr · Liberia2026!
                </button>
                <button
                  type="button"
                  onClick={() => { setEmail("data.officer@lpb.gov.lr"); setPassword("Data2026!"); }}
                  className="block w-full rounded-lg bg-white/80 px-3 py-2 text-left ring-1 ring-sky-100 transition hover:ring-sky-300"
                >
                  <span className="font-bold">Data & Records Officer</span> — data.officer@lpb.gov.lr · Data2026!
                </button>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-slate-400">
            Forgotten password? Contact the LPB ICT desk — credentials are issued by the Registrar.
          </p>
        </div>
      </main>
    </div>
  );
}
