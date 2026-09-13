"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
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
      <aside className="band-navy hidden text-white lg:block">
        <div className="relative flex h-full flex-col justify-between p-12">
          <LpbLogo size={72} badge />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-300">2026 National Pharmacist Census</p>
            <h1 className="mt-4 max-w-md text-4xl font-extrabold leading-tight tracking-tight">
              Pharmacist portal
            </h1>
            <p className="mt-4 max-w-md text-white/70">
              Sign in to complete your profile, upload credentials and track your application through LPB
              verification.
            </p>
            <ul className="mt-8 list-disc space-y-2 pl-5 text-sm text-white/85">
              <li>Your record is reviewed only by the Board.</li>
              <li>You receive an official registry reference on approval.</li>
              <li>Your data shapes national pharmacy planning.</li>
            </ul>
          </div>
          <p className="text-xs text-white/40">Safe Medicines. Healthy Communities. A Stronger Liberia.</p>
        </div>
      </aside>

      {/* Form */}
      <main className="flex items-center justify-center bg-paper-100 px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <Link href="/" className="btn-ghost -ml-2 mb-6 px-2.5 py-1.5 text-xs">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to home
          </Link>
          <div className="card p-8">
            <div className="flex items-center gap-3">
              <LpbLogo size={46} />
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-brand-950">Sign in to your account</h2>
                <p className="text-xs text-slate-500">National Pharmacist Registry, pharmacist portal</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div>
                <label htmlFor="email" className="label">Email address</label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="you@example.com"
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
                {loading ? "Signing in…" : "Sign in to the portal"}
              </button>
            </form>

            <div className="notice mt-7">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-600">
                Demonstration accounts
              </p>
              <div className="mt-3 space-y-2 text-xs text-slate-700">
                <button
                  type="button"
                  onClick={() => { setEmail("emmanuel.momo@example.lr"); setPassword("Pharmacist2026!"); }}
                  className="block w-full rounded-sm border border-slate-300 bg-white px-3 py-2 text-left hover:border-slate-500"
                >
                  <span className="font-bold">Pharmacist</span>: emmanuel.momo@example.lr / Pharmacist2026!
                </button>
                <p className="pt-1 text-slate-500">
                  New pharmacist? <Link href="/signup" className="font-bold text-brand-800 underline underline-offset-2">Create an account</Link>.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-slate-500">
            Forgotten password? Contact the LPB ICT desk; credentials are issued by the Registrar.
          </p>
        </div>
      </main>
    </div>
  );
}
