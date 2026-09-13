"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
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
    <div className="flex min-h-[calc(100vh-78px)] items-center justify-center bg-paper-100 px-4 py-12 sm:px-8">
      <div className="w-full max-w-lg">
        <Link href="/" className="btn-ghost -ml-2 mb-6 px-2.5 py-1.5 text-xs">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to home
        </Link>
        <div className="card overflow-hidden">
          <div className="band-navy px-8 py-7 text-white">
            <div className="flex items-center gap-4">
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
                <label htmlFor="firstName" className="label">First name <span className="text-red-600">*</span></label>
                <input id="firstName" required value={form.firstName} onChange={set("firstName")} className="input" placeholder="e.g. Emmanuel" autoComplete="given-name" />
              </div>
              <div>
                <label htmlFor="surname" className="label">Surname <span className="text-red-600">*</span></label>
                <input id="surname" required value={form.surname} onChange={set("surname")} className="input" placeholder="e.g. Momo" autoComplete="family-name" />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="label">Email address <span className="text-red-600">*</span></label>
              <input id="email" type="email" required value={form.email} onChange={set("email")} className="input" placeholder="you@example.com" autoComplete="email" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="password" className="label">Password <span className="text-red-600">*</span></label>
                <input id="password" type="password" required value={form.password} onChange={set("password")} className="input" placeholder="min. 8 characters" autoComplete="new-password" />
              </div>
              <div>
                <label htmlFor="confirm" className="label">Confirm password <span className="text-red-600">*</span></label>
                <input id="confirm" type="password" required value={form.confirm} onChange={set("confirm")} className="input" placeholder="repeat password" autoComplete="new-password" />
              </div>
            </div>

            {error && (
              <p className="rounded-sm border border-red-300 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700" role="alert">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} className="btn-accent w-full py-3">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? "Creating account…" : "Create account and start registration"}
            </button>

            <p className="text-xs leading-relaxed text-slate-600">
              By creating an account you agree to the{" "}
              <Link href="/terms" className="font-semibold text-brand-800 underline underline-offset-2">Terms of Use</Link>{" "}
              and the{" "}
              <Link href="/privacy" className="font-semibold text-brand-800 underline underline-offset-2">Privacy Policy</Link>,{" "}
              and you confirm that the Liberia Pharmacy Board may store and process your data for the purposes
              of the 2026 National Pharmacist Census.
            </p>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-brand-800 underline underline-offset-2">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
