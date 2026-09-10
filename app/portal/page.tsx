"use client";

import Link from "next/link";
import {
  UserCog,
  FolderOpen,
  Award,
  Send,
  User,
  GraduationCap,
  UploadCloud,
  FileText,
  ArrowRight,
  CheckCircle2,
  Circle,
  Briefcase,
} from "lucide-react";
import { PortalShell } from "@/components/portal/shell";
import { useAccount } from "@/components/portal/use-account";
import { getProgress } from "@/lib/portal";
import { APPLICATION_STATUS_META, type ActivityIcon } from "@/lib/portal-types";
import { cn, formatDate } from "@/lib/utils";

const ACTIVITY_ICONS: Record<ActivityIcon, React.ElementType> = {
  profile: UserCog,
  doc: UploadCloud,
  cpd: Award,
  submit: Send,
  status: CheckCircle2,
  qual: GraduationCap,
  exp: Briefcase,
};

const QUICK_ACTIONS = [
  { href: "/portal/profile", label: "Update Profile", icon: User },
  { href: "/portal/education", label: "Add Qualification", icon: GraduationCap },
  { href: "/portal/documents", label: "Upload Documents", icon: UploadCloud },
  { href: "/portal/submit", label: "View Summary", icon: FileText },
];

export default function PortalDashboard() {
  return (
    <PortalShell title="Dashboard">
      <DashboardBody />
    </PortalShell>
  );
}

function DashboardBody() {
  const { account } = useAccount();
  if (!account) return null;
  const metrics = getProgress(account);
  const statusMeta = APPLICATION_STATUS_META[account.applicationStatus];

  const statCards = [
    { icon: UserCog, tint: "bg-accent-100 text-accent-600", label: "Profile Completed", value: `${metrics.profilePct}%`, href: "/portal/profile" },
    { icon: FolderOpen, tint: "bg-brand-100 text-brand-600", label: "Credentials Uploaded", value: `${metrics.docsCount} / ${metrics.docsTotal}`, href: "/portal/documents" },
    { icon: Award, tint: "bg-violet-100 text-violet-600", label: "CPD Trainings", value: String(account.cpd.length), href: "/portal/cpd" },
    { icon: FileText, tint: "bg-amber-100 text-amber-600", label: "Application Status", value: statusMeta.label, href: "/portal/submit" },
  ];

  return (
    <div className="space-y-5">
      {/* Greeting */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-brand-950">
            Welcome back, {[account.personal.firstName, account.personal.surname].filter(Boolean).join(" ") || "Pharmacist"}
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            {account.registryRef ? (
              <>Registry reference: <span className="font-mono font-bold text-brand-800">{account.registryRef}</span></>
            ) : (
              "Complete your profile and documents to submit your census application."
            )}
          </p>
        </div>
        <span className={cn("chip", statusMeta.chip)}>
          <span className={cn("h-1.5 w-1.5 rounded-full", statusMeta.dot)} />
          {statusMeta.label}
        </span>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((c) => (
          <Link key={c.label} href={c.href} className="card group flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
            <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", c.tint)}>
              <c.icon className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold uppercase tracking-wide text-slate-400">{c.label}</p>
              <p className="mt-0.5 text-lg font-extrabold tracking-tight text-brand-950">{c.value}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[1fr_330px]">
        <div className="space-y-5">
          {/* Registration progress */}
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-brand-950">Registration Progress</h3>
              <span className="text-sm font-extrabold text-accent-600">{metrics.progressPct}%</span>
            </div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent-400 to-accent-600 transition-all duration-700"
                style={{ width: `${metrics.progressPct}%` }}
              />
            </div>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {metrics.checks.map((c) => (
                <li key={c.key} className="flex items-center gap-2 text-sm">
                  {c.done ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-accent-500" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 text-slate-300" />
                  )}
                  <span className={c.done ? "font-medium text-slate-700" : "text-slate-500"}>{c.label}</span>
                </li>
              ))}
            </ul>
            {metrics.progressPct < 100 && (
              <Link href="/portal/profile" className="btn-primary mt-4 px-3.5 py-2 text-xs">
                Continue registration <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>

          {/* Quick actions */}
          <div className="card p-5">
            <h3 className="font-bold text-brand-950">Quick Actions</h3>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {QUICK_ACTIONS.map((a) => (
                <Link
                  key={a.label}
                  href={a.href}
                  className="group flex flex-col items-center gap-2.5 rounded-xl border border-slate-200 px-3 py-5 text-center transition hover:border-brand-300 hover:bg-brand-50/40"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-brand-100 transition group-hover:bg-brand-700 group-hover:text-white">
                    <a.icon className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-bold text-slate-700">{a.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-brand-950">Recent Activity</h3>
            <span className="text-xs font-semibold text-brand-600">{account.activity.length} events</span>
          </div>
          <ol className="mt-4 space-y-4">
            {account.activity.slice(0, 6).map((a, i) => {
              const Icon = ACTIVITY_ICONS[a.icon] ?? FileText;
              return (
                <li key={`${a.at}-${i}`} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{a.text}</p>
                    <p className="text-xs text-slate-400">{formatDate(a.at)}</p>
                  </div>
                </li>
              );
            })}
            {account.activity.length === 0 && (
              <li className="text-sm text-slate-400">Nothing yet — start with your profile.</li>
            )}
          </ol>
        </div>
      </div>
    </div>
  );
}
