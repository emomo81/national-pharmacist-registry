"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  GraduationCap,
  Briefcase,
  Award,
  FolderOpen,
  Send,
  LifeBuoy,
  LogOut,
  Menu,
  X,
  Bell,
} from "lucide-react";
import { portalLogout } from "@/lib/portal";
import { APPLICATION_STATUS_META } from "@/lib/portal-types";
import { LpbLogo } from "@/components/logo";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, initials } from "@/lib/utils";
import { useAccount } from "./use-account";

const NAV = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/profile", label: "My Profile", icon: User },
  { href: "/portal/education", label: "Educational Credentials", icon: GraduationCap },
  { href: "/portal/experience", label: "Professional Experience", icon: Briefcase },
  { href: "/portal/cpd", label: "CPD Training", icon: Award },
  { href: "/portal/documents", label: "Documents", icon: FolderOpen },
  { href: "/portal/submit", label: "Submit Application", icon: Send },
];

/** Layout skeleton shown while the account is read from storage. */
function ShellSkeleton() {
  return (
    <div className="flex min-h-screen bg-paper-100">
      <aside className="sticky top-0 hidden h-screen w-[268px] shrink-0 flex-col gap-5 bg-brand-950 py-5 lg:flex">
        <div className="flex items-center gap-3 px-5">
          <Skeleton className="h-10 w-10 rounded-full bg-white/15" />
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-28 bg-white/15" />
            <Skeleton className="h-3 w-20 bg-white/15" />
          </div>
        </div>
        <nav className="flex-1 space-y-2 px-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full bg-white/10" />
          ))}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 flex h-16 items-center justify-between border-b border-slate-300 bg-white px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-5 w-44" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </header>
        <main className="space-y-4 p-4 sm:p-6 lg:p-8">
          <Skeleton className="h-24 w-full" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-36 w-full" />
            <Skeleton className="h-36 w-full" />
            <Skeleton className="h-36 w-full" />
          </div>
          <Skeleton className="h-40 w-full" />
        </main>
      </div>
    </div>
  );
}

export function PortalShell({ children, title }: { children: React.ReactNode; title: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { session, account, ready } = useAccount();

  if (!ready || !session || !account) {
    return <ShellSkeleton />;
  }

  const statusMeta = APPLICATION_STATUS_META[account.applicationStatus];
  const name = session.name || account.email;

  const navItems = (
    <nav className="flex-1 space-y-1 px-3">
      {NAV.map((item) => {
        const active = item.href === "/portal" ? pathname === "/portal" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMenuOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-sm px-3.5 py-2.5 text-sm font-semibold transition-colors",
              active ? "bg-brand-600 text-white" : "text-white/65 hover:bg-white/10 hover:text-white"
            )}
          >
            <item.icon className={cn("h-4 w-4", active ? "text-white" : "text-white/40")} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  const bottomItems = (
    <div className="space-y-1 px-3 pb-2">
      <Link
        href="/portal/support"
        onClick={() => setMenuOpen(false)}
        className="flex items-center gap-3 rounded-sm px-3.5 py-2.5 text-sm font-semibold text-white/65 transition-colors hover:bg-white/10 hover:text-white"
      >
        <LifeBuoy className="h-4 w-4 text-white/40" /> Help &amp; Support
      </Link>
      <button
        type="button"
        onClick={() => {
          portalLogout();
          router.push("/login");
        }}
        className="flex w-full items-center gap-3 rounded-sm px-3.5 py-2.5 text-sm font-semibold text-white/65 transition-colors hover:bg-red-500/15 hover:text-red-200"
      >
        <LogOut className="h-4 w-4 text-white/40" /> Logout
      </button>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-paper-100">
      {/* Sidebar, desktop */}
      <aside className="sticky top-0 hidden h-screen w-[268px] shrink-0 flex-col gap-5 bg-brand-950 py-5 lg:flex">
        <Link href="/portal" className="flex items-center gap-3 px-5">
          <LpbLogo size={42} badge />
          <div className="leading-tight">
            <p className="text-[13px] font-extrabold tracking-wide text-white">LIBERIA PHARMACY</p>
            <p className="text-[13px] font-extrabold tracking-wide text-white">BOARD</p>
          </div>
        </Link>
        {navItems}
        {bottomItems}
      </aside>

      {/* Mobile top bar + drawer */}
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
          <Link href="/portal" className="flex items-center gap-2.5">
            <LpbLogo size={30} badge />
            <span className="text-xs font-extrabold tracking-wide text-white">LIBERIA PHARMACY BOARD</span>
          </Link>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
            {initials(name)}
          </span>
        </div>
        {menuOpen && (
          <div className="flex max-h-[calc(100vh-56px)] flex-col gap-4 overflow-y-auto border-t border-white/10 py-4">
            {navItems}
            {bottomItems}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 pt-14 lg:pt-0">
        <header className="sticky top-14 z-30 border-b border-slate-300 bg-white lg:top-0">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <h1 className="truncate text-lg font-extrabold tracking-tight text-brand-950">{title}</h1>
            <div className="flex items-center gap-3">
              <span className={cn("chip hidden sm:inline-flex", APPLICATION_STATUS_META[account.applicationStatus].chip)}>
                <span className={cn("h-1.5 w-1.5 rounded-full", statusMeta.dot)} />
                {account.applicationStatus === "verified" ? "Active Registration" : APPLICATION_STATUS_META[account.applicationStatus].label}
              </span>
              <button type="button" className="relative rounded-sm p-2 text-slate-500 hover:bg-paper-200" aria-label="Notifications">
                <Bell className="h-5 w-5" />
                {account.activity.length > 0 && (
                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
                )}
              </button>
              <div className="hidden items-center gap-2.5 md:flex">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 text-xs font-extrabold text-white">
                  {initials(name)}
                </span>
                <div className="leading-tight">
                  <p className="max-w-[160px] truncate text-sm font-bold text-brand-950">{name}</p>
                  <p className="text-[11px] text-slate-400">Pharmacist</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
