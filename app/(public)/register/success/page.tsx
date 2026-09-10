"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Printer, Home, UserPlus, ClipboardCopy } from "lucide-react";
import { useState } from "react";

function SuccessInner() {
  const params = useSearchParams();
  const ref = params.get("ref") ?? "LPB-2026-0000";
  const name = params.get("name") ?? "";
  const email = params.get("email") ?? "";
  const [copied, setCopied] = useState(false);

  const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <div className="bg-slate-50 py-12 sm:py-16">
      <div className="container-x max-w-3xl">
        <div className="card overflow-hidden">
          <div className="hero-fade px-8 py-10 text-center text-white">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/15 ring-4 ring-white/10">
              <CheckCircle2 className="h-9 w-9 text-gold-300" />
            </span>
            <h1 className="mt-5 text-2xl font-extrabold tracking-tight sm:text-3xl">Registration submitted</h1>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/75">
              {name ? <><strong className="text-white">{name}</strong>, your </> : "Your "}
              record has been received by the Liberia Pharmacy Board and is queued for verification.
            </p>
          </div>

          <div className="px-8 py-8">
            <div className="rounded-2xl border-2 border-dashed border-brand-300 bg-brand-50/50 px-6 py-6 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Your registry reference number</p>
              <p className="mt-2 font-mono text-3xl font-extrabold tracking-wide text-brand-900 sm:text-4xl">{ref}</p>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(ref).catch(() => {});
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1800);
                }}
                className="btn-outline mt-4 no-print px-3.5 py-2 text-xs"
              >
                <ClipboardCopy className="h-3.5 w-3.5" />
                {copied ? "Copied!" : "Copy reference"}
              </button>
            </div>

            <div className="mt-8">
              <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">What happens next</h2>
              <ol className="mt-4 space-y-4">
                {[
                  { t: "Verification begins", d: "An LPB data officer reviews your entries and credentials (usually within 5 working days)." },
                  { t: "Status updates", d: email ? `Updates will be sent to ${email}. Your record moves from Submitted → Under Review → Verified.` : "Your record moves from Submitted → Under Review → Verified." },
                  { t: "Keep your reference number", d: "Quote it at license renewal and in any correspondence with the Board about the census." },
                ].map((s, i) => (
                  <li key={s.t} className="flex gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-800">{i + 1}</span>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{s.t}</p>
                      <p className="mt-0.5 text-sm text-slate-600">{s.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <p className="mt-8 border-t border-slate-100 pt-4 text-xs text-slate-400">
              Submitted on {today} · Liberia Pharmacy Board — National Pharmacist Registry, 2026 Census
            </p>
          </div>
        </div>

        <div className="no-print mt-6 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => window.print()} className="btn-outline">
            <Printer className="h-4 w-4" /> Print confirmation
          </button>
          <Link href="/register" className="btn-outline">
            <UserPlus className="h-4 w-4" /> Register another pharmacist
          </Link>
          <Link href="/" className="btn-primary">
            <Home className="h-4 w-4" /> Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="container-x flex h-72 items-center justify-center py-16">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
        </div>
      }
    >
      <SuccessInner />
    </Suspense>
  );
}
