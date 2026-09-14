"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { LpbLogo } from "./logo";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "Who must register" },
  { href: "/#support", label: "Help & Support" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="no-print sticky top-0 z-40 border-b border-slate-300 bg-white">
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
              className="border-b-2 border-transparent px-3.5 py-2 text-sm font-semibold text-slate-600 hover:border-accent-600 hover:text-brand-800"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/login" className="btn-primary ml-3 px-5">
            Sign in
          </Link>
        </nav>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="rounded-sm p-2 text-slate-700 hover:bg-paper-200 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="container-x flex flex-col gap-1 py-3">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-paper-100"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/login" className="btn-primary mt-2" onClick={() => setOpen(false)}>
              Sign in
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
