"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Files,
  FileDown,
  LogOut,
  Globe,
  Menu,
  X,
  Loader2,
  FlaskConical,
} from "lucide-react";
import { getSession, logout } from "@/lib/auth";
import type { SessionUser } from "@/lib/types";
import { cn } from "@/lib/utils";
import { LiberiaFlag } from "@/components/liberia-flag";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/submissions", label: "Submissions", icon: Files },
  { href: "/admin/export", label: "Data Export", icon: FileDown },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<(SessionUser & { at: string }) | null>(null);
  const [checking, setChecking] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.replace("/official");
      return;
    }
    setSession(s);
    setChecking(false);
  }, [router]);

  if (checking || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-950">
        <div className="flex items-center gap-3 text-white/70">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm font-medium">Opening secure workspace…</span>
        </div>
      </div>
    );
  }

  const pageTitle =
    pathname === "/admin"
      ? "Census Dashboard"
      : pathname.startsWith("/admin/submissions/")
        ? "Submission Record"
        : pathname.startsWith("/admin/submissions")
          ? "Submissions"
          : pathname.startsWith("/admin/export")
            ? "Data Export"
            : "Portal";

  const nav = (mobile = false) => (
    <nav className={cn("flex-1 space-y-1", mobile ? "px-3" : "px-3")}>
      {NAV.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMenuOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-semibold transition",
              active ? "bg-white/10 text-white ring-1 ring-white/10" : "text-white/60 hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon className={cn("h-4 w-4", active ? "text-gold-300" : "text-white/40")} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  const userBlock = (
    <div className="px-3">
      <div className="rounded-xl bg-white/5 p-3.5 ring-1 ring-white/10">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500 text-sm font-extrabold text-brand-950">
            {session.initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">{session.name}</p>
            <p className="truncate text-[11px] text-white/50">{session.role}</p>
          </div>
        </div>
        <div className="mt-3 flex gap-1.5">
          <Link
            href="/"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/5 px-2 py-2 text-[11px] font-semibold text-white/70 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
          >
            <Globe className="h-3.5 w-3.5" /> Public site
          </Link>
          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/official");
            }}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/5 px-2 py-2 text-[11px] font-semibold text-white/70 ring-1 ring-white/10 transition hover:bg-red-500/20 hover:text-red-200"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </div>
      <p className="flex items-center justify-center gap-1.5 px-2 py-3 text-[10px] font-semibold uppercase tracking-wider text-white/30">
        <FlaskConical className="h-3 w-3" /> Demo build · sample data
      </p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar (desktop) */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-4 bg-brand-950 py-5 lg:flex">
        <Link href="/admin" className="flex items-center gap-3 px-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/lpb-logo.svg" alt="" className="h-10 w-10" />
          <div className="leading-tight">
            <p className="text-sm font-extrabold text-white">LPB Registry Portal</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">2026 Census</p>
          </div>
        </Link>
        <div className="mx-4 mt-1 flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10">
          <LiberiaFlag className="h-3 w-4 rounded-[2px]" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-white/50">Republic of Liberia</span>
        </div>
        {nav()}
        {userBlock}
      </aside>

      {/* Mobile top bar + drawer */}
      <div className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-brand-950 lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/admin" className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/lpb-logo.svg" alt="" className="h-8 w-8" />
            <span className="text-sm font-extrabold text-white">LPB Registry Portal</span>
          </Link>
          <button
            type="button"
            aria-label="Toggle admin menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-lg p-2 text-white/80 hover:bg-white/10"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {menuOpen && (
          <div className="flex max-h-[calc(100vh-56px)] flex-col gap-3 overflow-y-auto border-t border-white/10 py-4">
            {nav(true)}
            {userBlock}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 pt-14 lg:pt-0">
        <header className="sticky top-14 z-30 border-b border-slate-200 bg-white/90 backdrop-blur lg:top-0">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <h1 className="truncate text-lg font-extrabold tracking-tight text-brand-950">{pageTitle}</h1>
            <div className="flex items-center gap-3">
              <span className="chip hidden bg-gold-300/15 text-gold-600 ring-1 ring-gold-300/40 sm:inline-flex">
                <FlaskConical className="h-3.5 w-3.5" /> Demo data
              </span>
              <span className="hidden text-xs text-slate-400 md:block">Signed in as {session.email}</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-700 text-xs font-bold text-white md:hidden">
                {session.initials}
              </span>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
