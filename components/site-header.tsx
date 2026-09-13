"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, LogIn } from "lucide-react";
import { LpbLogo } from "./logo";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#support", label: "Help & Support" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur no-print">
      <div className="container-x flex h-[78px] items-center justify-between gap-4">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <LpbLogo size={52} />
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[15px] font-extrabold tracking-wide text-brand-900 sm:text-base">
              LIBERIA PHARMACY BOARD
            </span>
            <span className="block truncate text-[11px] font-medium text-slate-500 sm:text-xs">
              Safe Medicines. Healthy Communities. A Stronger Liberia.
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-lg px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-brand-800"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/login" className="btn-primary ml-3 px-5">
            <LogIn className="h-4 w-4" />
            Login
          </Link>
        </nav>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-white md:hidden">
          <div className="container-x flex flex-col gap-1 py-3">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/login" className="btn-primary mt-2" onClick={() => setOpen(false)}>
              <LogIn className="h-4 w-4" /> Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
