"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, KeyRound, Loader2, ArrowLeft, BadgeCheck, BarChart3, ShieldCheck, Info, ArrowRight } from "lucide-react";
import { portalLogin } from "@/lib/portal";
import { LpbLogo } from "@/components/logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { session, error } = await portalLogin(email, password);
    setLoading(false);
    if (error || !session) {
      setError(error ?? "Login failed.");
      return;
    }
    router.push("/portal");
  }

  return (
    <div className="grid min-h-[calc(100vh-78px)] lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <aside className="hero-fade relative hidden overflow-hidden text-white lg:block">
        <div className="bg-grid absolute inset-0 opacity-50" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <LpbLogo size={72} badge />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-300">2026 National Pharmacist Census</p>
            <h1 className="mt-4 max-w-md text-4xl font-extrabold leading-tight tracking-tight">
              Welcome back, Pharmacist.
            </h1>
            <p className="mt-4 max-w-md text-white/70">
              Pick up exactly where you left off — complete your profile, upload credentials and track your
              application through LPB verification.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                { icon: ShieldCheck, text: "Your record is reviewed only by the Board" },
                { icon: BadgeCheck, text: "Official registry reference on approval" },
                { icon: BarChart3, text: "Your data shapes national pharmacy planning" },
              ].map((p) => (
                <li key={p.text} className="flex items-center gap-3 text-sm text-white/85">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                    <p.icon className="h-4 w-4 text-accent-300" />
                  </span>
                  {p.text}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-white/40">Safe Medicines. Healthy Communities. A Stronger Liberia.</p>
        </div>
      </aside>

      {/* Form */}
      <main className="flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <Link href="/" className="btn-ghost -ml-2 mb-6 px-2.5 py-1.5 text-xs">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to home
          </Link>
          <div className="card p-8">
            <div className="flex items-center gap-3">
              <LpbLogo size={46} />
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-brand-950">Sign in to your account</h2>
                <p className="text-xs text-slate-500">National Pharmacist Registry — pharmacist portal</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div>
                <label htmlFor="email" className="label">Email address</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input id="email" type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className="input pl-10" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="label">Password</label>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input id="password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="input pl-10" placeholder="••••••••••" />
                </div>
              </div>

              {error && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700" role="alert">
                  {error}
                </p>
              )}

              <button type="submit" disabled={loading} className="btn-accent w-full py-3">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-500">
              New to the registry?{" "}
              <Link href="/signup" className="font-bold text-brand-800 hover:underline">
                Create an account
              </Link>
            </p>

            <div className="mt-6 rounded-xl border border-sky-200 bg-sky-50/70 p-4">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-sky-700">
                <Info className="h-3.5 w-3.5" /> Demo account
              </p>
              <button
                type="button"
                onClick={() => { setEmail("emmanuel.momo@example.lr"); setPassword("Pharmacist2026!"); }}
                className="mt-2 block w-full rounded-lg bg-white/80 px-3 py-2 text-left text-xs text-sky-900 ring-1 ring-sky-100 transition hover:ring-sky-300"
              >
                <span className="font-bold">Emmanuel Momo (Pharmacist)</span> — click to autofill
                <span className="mt-0.5 block font-mono">emmanuel.momo@example.lr · Pharmacist2026!</span>
              </button>
            </div>
          </div>

          <Link href="/official" className="btn-ghost mx-auto mt-5 flex w-fit text-xs">
            LPB staff? Official portal <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </main>
    </div>
  );
}
