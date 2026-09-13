"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import { login } from "@/lib/auth";

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
      setError("Invalid credentials. Use one of the demonstration accounts shown below.");
      return;
    }
    router.push("/admin");
  }

  return (
    <div className="grid min-h-[calc(100vh-70px)] lg:grid-cols-[1fr_1.1fr]">
      {/* Brand panel */}
      <aside className="band-navy hidden text-white lg:block">
        <div className="relative flex h-full flex-col justify-between p-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/lpb-logo.svg" alt="" className="h-16 w-16" />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold-300">LPB Official Use Only</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight">
              Official registry workspace
            </h1>
            <p className="mt-4 max-w-md text-white/70">
              The secure workspace where LPB officials review, verify and analyze 2026 census submissions to
              support national decision-making.
            </p>
            <ul className="mt-8 list-disc space-y-2 pl-5 text-sm text-white/85">
              <li>Live census analytics across all 15 counties.</li>
              <li>Verify, flag and annotate pharmacist records.</li>
              <li>One-click CSV export for offline analysis.</li>
            </ul>
          </div>
          <p className="text-xs text-white/40">Access is logged and restricted to authorized Board staff.</p>
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center bg-paper-100 px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <Link href="/" className="btn-ghost -ml-2 mb-6 px-2.5 py-1.5 text-xs">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to public site
          </Link>

          <div className="card p-8">
            <h2 className="text-xl font-extrabold tracking-tight text-brand-950">Official sign-in</h2>
            <p className="mt-1 text-xs text-slate-500">Liberia Pharmacy Board staff only</p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div>
                <label htmlFor="email" className="label">Work email</label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="name@lpb.gov.lr"
                />
              </div>
              <div>
                <label htmlFor="password" className="label">Password</label>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  placeholder="Enter your password"
                />
              </div>

              {error && (
                <p className="rounded-sm border border-red-300 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700" role="alert">
                  {error}
                </p>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>

            <div className="notice mt-7">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-600">
                Demonstration accounts
              </p>
              <div className="mt-3 space-y-2 text-xs text-slate-700">
                <button
                  type="button"
                  onClick={() => { setEmail("admin@lpb.gov.lr"); setPassword("Liberia2026!"); }}
                  className="block w-full rounded-sm border border-slate-300 bg-white px-3 py-2 text-left hover:border-slate-500"
                >
                  <span className="font-bold">Registrar &amp; CEO</span>: admin@lpb.gov.lr / Liberia2026!
                </button>
                <button
                  type="button"
                  onClick={() => { setEmail("data.officer@lpb.gov.lr"); setPassword("Data2026!"); }}
                  className="block w-full rounded-sm border border-slate-300 bg-white px-3 py-2 text-left hover:border-slate-500"
                >
                  <span className="font-bold">Data &amp; Records Officer</span>: data.officer@lpb.gov.lr / Data2026!
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
