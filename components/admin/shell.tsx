"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  BadgeCheck,
  BarChart3,
  Settings,
  LogOut,
  Globe,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
} from "lucide-react";
import { getSession, logout } from "@/lib/auth";
import type { SessionUser } from "@/lib/types";
import { cn } from "@/lib/utils";
import { LpbLogo } from "@/components/logo";
import { LiberiaFlag } from "@/components/liberia-flag";
import { Skeleton } from "@/components/ui/skeleton";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/registry", label: "Pharmacist Registry", icon: Users },
  { href: "/admin/add", label: "Add New Pharmacist", icon: UserPlus },
  { href: "/admin/verify", label: "Verify Credentials", icon: BadgeCheck },
  { href: "/admin/reports", label: "Reports & Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<(SessionUser & { at: string }) | null>(null);
  const [checking, setChecking] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [search, setSearch] = useState("");
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.replace("/official");
      return;
    }
    setSession(s);
    setChecking(false);
  }, [router]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenu(false);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  if (checking || !session) {
    return (
      <div className="flex min-h-screen bg-paper-100">
        <aside className="sticky top-0 hidden h-screen w-[268px] shrink-0 flex-col gap-5 bg-brand-950 py-5 lg:flex">
          <div className="flex items-center gap-3 px-5">
            <Skeleton className="h-11 w-11 rounded-full bg-white/15" />
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-32 bg-white/15" />
              <Skeleton className="h-2.5 w-24 bg-white/15" />
            </div>
          </div>
          <nav className="flex-1 space-y-2 px-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full bg-white/10" />
            ))}
          </nav>
        </aside>
        <div className="min-w-0 flex-1">
          <header className="flex h-[72px] items-center justify-between border-b border-slate-300 bg-white px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-9 w-full max-w-md" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
          </header>
          <main className="space-y-4 p-4 sm:p-6 lg:p-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
            <Skeleton className="h-64 w-full" />
          </main>
        </div>
      </div>
    );
  }

  const pageTitle =
    pathname === "/admin"
      ? "Dashboard"
      : pathname.startsWith("/admin/registry/")
        ? "Pharmacist Record"
        : (NAV.find((n) => n.href !== "/admin" && pathname.startsWith(n.href))?.label ?? "Portal");

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(search.trim() ? `/admin/registry?q=${encodeURIComponent(search.trim())}` : "/admin/registry");
  }

  const sidebarContent = (
    <>
      <Link href="/admin" className="flex items-center gap-3 px-5">
        <LpbLogo size={44} badge />
        <div className="leading-tight">
          <p className="text-[13px] font-extrabold tracking-wide text-white">LIBERIA PHARMACY BOARD</p>
          <p className="mt-0.5 text-[10px] font-medium text-white/50">Safe Medicines | Healthy Communities</p>
        </div>
      </Link>

      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-sm px-3.5 py-2.5 text-sm font-semibold transition-colors",
                active ? "bg-brand-600 text-white" : "text-white/65 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn("h-4 w-4", active ? "text-white" : "text-white/40")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 pb-1">
        <p className="text-xs italic leading-relaxed text-white/45">
          &ldquo;Professional Pharmacists<br />for a Healthier Liberia&rdquo;
        </p>
        <LiberiaFlag className="mt-2 h-4 w-7 rounded-[2px]" />
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-paper-100">
      {/* Sidebar, desktop */}
      <aside className="sticky top-0 hidden h-screen w-[268px] shrink-0 flex-col gap-5 bg-brand-950 py-5 lg:flex">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      <div className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-brand-950 lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-sm p-2 text-white/80 hover:bg-white/10"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link href="/admin" className="flex items-center gap-2.5">
            <LpbLogo size={30} badge />
            <span className="text-xs font-extrabold tracking-wide text-white">LIBERIA PHARMACY BOARD</span>
          </Link>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
            {session.initials}
          </span>
        </div>
        {menuOpen && (
          <div className="flex max-h-[calc(100vh-56px)] flex-col gap-4 overflow-y-auto border-t border-white/10 py-4">
            {sidebarContent}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 pt-14 lg:pt-0">
        <header className="sticky top-14 z-30 border-b border-slate-300 bg-white lg:top-0">
          <div className="flex h-[72px] items-center gap-4 px-4 sm:px-6 lg:px-8">
            <div className="hidden min-w-0 lg:block">
              <h1 className="truncate text-lg font-extrabold tracking-tight text-brand-950">{pageTitle}</h1>
            </div>

            <form onSubmit={submitSearch} className="relative mx-auto w-full max-w-md flex-1 lg:flex-none">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, license number, or ID…"
                className="w-full rounded-sm border border-slate-400 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                aria-label="Search registry"
              />
            </form>

            <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
              <span className="chip hidden border border-gold-500/60 text-gold-400 xl:inline-flex">Demo data</span>

              {/* Notifications */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotifOpen((v) => !v)}
                  className="relative rounded-sm p-2.5 text-slate-500 transition-colors hover:bg-paper-200"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-extrabold text-white">
                    3
                  </span>
                </button>
                {notifOpen && (
                  <div className="absolute right-0 top-12 w-80 overflow-hidden rounded-sm border border-slate-300 bg-white">
                    <p className="border-b border-slate-200 px-4 py-3 text-sm font-bold text-brand-950">Notifications</p>
                    {[
                      { t: "New pharmacist application", s: "A census application is awaiting review.", time: "2h ago" },
                      { t: "Record flagged", s: "One record needs follow-up with the registrant.", time: "1d ago" },
                      { t: "Weekly report ready", s: "Registry summary was generated and can be exported.", time: "3d ago" },
                    ].map((n) => (
                      <div key={n.t} className="border-b border-slate-50 px-4 py-3 last:border-0">
                        <p className="text-sm font-semibold text-slate-800">{n.t}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{n.s}</p>
                        <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-300">{n.time}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* User menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenu((v) => !v)}
                  className="flex items-center gap-2.5 rounded-sm px-1.5 py-1.5 transition-colors hover:bg-paper-200"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 text-xs font-extrabold text-white">
                    {session.initials}
                  </span>
                  <span className="hidden text-left leading-tight sm:block">
                    <span className="block text-sm font-bold text-brand-950">Admin</span>
                    <span className="block text-[11px] text-slate-400">LPB Official</span>
                  </span>
                  <ChevronDown className={cn("hidden h-4 w-4 text-slate-400 transition sm:block", userMenu && "rotate-180")} />
                </button>
                {userMenu && (
                  <div className="absolute right-0 top-14 w-56 overflow-hidden rounded-sm border border-slate-300 bg-white">
                    <div className="border-b border-slate-200 px-4 py-3">
                      <p className="truncate text-sm font-bold text-brand-950">{session.name}</p>
                      <p className="truncate text-xs text-slate-400">{session.email}</p>
                    </div>
                    <div className="p-1.5">
                      <Link href="/admin/settings" onClick={() => setUserMenu(false)} className="flex items-center gap-2.5 rounded-sm px-3 py-2 text-sm font-medium text-slate-600 hover:bg-paper-100">
                        <Settings className="h-4 w-4" /> Settings
                      </Link>
                      <Link href="/" onClick={() => setUserMenu(false)} className="flex items-center gap-2.5 rounded-sm px-3 py-2 text-sm font-medium text-slate-600 hover:bg-paper-100">
                        <Globe className="h-4 w-4" /> Public site
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          router.push("/official");
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" /> Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
