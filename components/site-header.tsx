"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, LockKeyhole, ChevronRight } from "lucide-react";
import { LiberiaFlag } from "./liberia-flag";

const NAV = [
  { href: "/#who", label: "Who must register" },
  { href: "/#steps", label: "How it works" },
  { href: "/#requirements", label: "Requirements" },
  { href: "/#faq", label: "FAQ" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 no-print">
      {/* Government strip */}
      <div className="bg-brand-950 text-white">
        <div className="container-x flex h-9 items-center justify-between gap-3 text-[11px] sm:text-xs">
          <div className="flex min-w-0 items-center gap-2">
            <span className="overflow-hidden rounded-[3px] ring-1 ring-white/25">
              <LiberiaFlag className="h-3 w-4 sm:h-3.5 sm:w-[22px]" />
            </span>
            <span className="truncate font-medium tracking-wide text-white/90">
              Republic of Liberia <span className="mx-1 text-white/40">·</span> Liberia Pharmacy Board
            </span>
          </div>
          <span className="hidden items-center gap-1.5 text-white/60 sm:flex">
            <LockKeyhole className="h-3 w-3" />
            Official government digital service
          </span>
        </div>
      </div>

      {/* Main header */}
      <div className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="container-x flex h-[70px] items-center justify-between gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/lpb-logo.svg" alt="Liberia Pharmacy Board" className="h-11 w-11 shrink-0" />
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-[15px] font-extrabold tracking-tight text-brand-900 sm:text-base">
                National Pharmacist Registry
              </span>
              <span className="block truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 sm:text-xs">
                2026 Pharmacist Census
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-brand-800"
              >
                {item.label}
              </Link>
            ))}
            <span className="mx-2 h-6 w-px bg-slate-200" />
            <Link href="/official" className="btn-ghost text-sm">
              <LockKeyhole className="h-4 w-4" />
              Official Login
            </Link>
            <Link href="/register" className="btn-primary ml-1">
              Register Now
              <ChevronRight className="h-4 w-4" />
            </Link>
          </nav>

          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="border-t border-slate-100 bg-white lg:hidden">
            <div className="container-x flex flex-col gap-1 py-3">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 flex gap-2">
                <Link href="/official" className="btn-outline flex-1" onClick={() => setOpen(false)}>
                  <LockKeyhole className="h-4 w-4" /> Official Login
                </Link>
                <Link href="/register" className="btn-primary flex-1" onClick={() => setOpen(false)}>
                  Register Now
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
