"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, User, Mail, KeyRound, ShieldCheck } from "lucide-react";
import { portalSignup } from "@/lib/portal";
import { LpbLogo } from "@/components/logo";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", surname: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    const { session, error } = await portalSignup(form);
    setLoading(false);
    if (error || !session) {
      setError(error ?? "Could not create account.");
      return;
    }
    router.push("/portal");
  }

  return (
    <div className="flex min-h-[calc(100vh-78px)] items-center justify-center bg-slate-50 px-4 py-12 sm:px-8">
      <div className="w-full max-w-lg">
        <Link href="/" className="btn-ghost -ml-2 mb-6 px-2.5 py-1.5 text-xs">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to home
        </Link>
        <div className="card overflow-hidden">
          <div className="hero-fade relative px-8 py-7 text-white">
            <div className="bg-grid absolute inset-0 opacity-50" />
            <div className="relative flex items-center gap-4">
              <LpbLogo size={56} badge />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent-300">2026 Pharmacist Census</p>
                <h1 className="mt-1 text-2xl font-extrabold tracking-tight">Create your registry account</h1>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 px-8 py-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="label">First name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input id="firstName" required value={form.firstName} onChange={set("firstName")} className="input pl-10" placeholder="e.g. Emmanuel" autoComplete="given-name" />
                </div>
              </div>
              <div>
                <label htmlFor="surname" className="label">Surname <span className="text-red-500">*</span></label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input id="surname" required value={form.surname} onChange={set("surname")} className="input pl-10" placeholder="e.g. Momo" autoComplete="family-name" />
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="email" className="label">Email address <span className="text-red-500">*</span></label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input id="email" type="email" required value={form.email} onChange={set("email")} className="input pl-10" placeholder="you@example.com" autoComplete="email" />
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="password" className="label">Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input id="password" type="password" required value={form.password} onChange={set("password")} className="input pl-10" placeholder="min. 8 characters" autoComplete="new-password" />
                </div>
              </div>
              <div>
                <label htmlFor="confirm" className="label">Confirm password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input id="confirm" type="password" required value={form.confirm} onChange={set("confirm")} className="input pl-10" placeholder="repeat password" autoComplete="new-password" />
                </div>
              </div>
            </div>

            {error && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700" role="alert">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} className="btn-accent w-full py-3">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? "Creating account…" : "Create account & start registration"}
            </button>

            <p className="flex items-start gap-2 text-xs leading-relaxed text-slate-500">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-500" />
              By creating an account you agree that the Liberia Pharmacy Board may store and process your data
              for the purposes of the 2026 National Pharmacist Census.
            </p>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-brand-800 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
