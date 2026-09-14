"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Users,
  BadgeCheck,
  CircleSlash,
  FileClock,
  TrendingUp,
  UserPlus,
  ShieldCheck,
  FileBarChart2,
  Database,
  Server,
  Clock3,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { listRegistrations, getStorageSizeBytes } from "@/lib/api";
import type { Registration } from "@/lib/types";
import { STATUS_META } from "@/lib/constants";
import { DonutChart } from "@/components/admin/charts";
import { cn, formatDate, formatDateTime, formatFileSize, fullName, initials, percent } from "@/lib/utils";

const AVATAR_TINTS = ["bg-brand-700"];

function KpiCard({
  icon: Icon,
  tint,
  label,
  value,
  trend,
}: {
  icon: React.ElementType;
  tint: string;
  label: string;
  value: number;
  trend: string;
}) {
  return (
    <div className="card p-5">
      <span className={cn("flex h-12 w-12 items-center justify-center rounded-sm", tint)}>
        <Icon className="h-6 w-6" />
      </span>
      <p className="mt-4 truncate text-[13px] font-semibold text-slate-500">{label}</p>
      <div className="mt-1 flex items-end justify-between gap-2">
        <p className="text-3xl font-extrabold tracking-tight text-brand-950">{value.toLocaleString()}</p>
        <p className="mb-1 flex items-center gap-1 text-xs font-bold text-accent-600">
          <TrendingUp className="h-3.5 w-3.5" /> {trend}
        </p>
      </div>
      <p className="text-[11px] text-slate-400">vs. last year</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [records, setRecords] = useState<Registration[] | null>(null);

  useEffect(() => {
    listRegistrations().then(setRecords);
  }, []);

  const stats = useMemo(() => {
    if (!records) return null;
    const byStatus = { submitted: 0, under_review: 0, verified: 0, flagged: 0 } as Record<string, number>;
    for (const r of records) byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;
    const lastUpdated = records.map((r) => r.updatedAt).sort().slice(-1)[0];
    return {
      total: records.length,
      byStatus,
      lastUpdated,
      donut: [
        { label: "Verified", value: byStatus.verified, color: "#339c5c" },
        { label: "Submitted", value: byStatus.submitted, color: "#f59e0b" },
        { label: "Under review", value: byStatus.under_review, color: "#8b5cf6" },
        { label: "Flagged", value: byStatus.flagged, color: "#64748b" },
      ],
    };
  }, [records]);

  if (!stats || !records) {
    return (
      <div className="grid animate-pulse gap-4">
        <div className="card h-40" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => <div key={i} className="card h-36" />)}
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="card h-80 lg:col-span-2" />
          <div className="card h-80" />
        </div>
      </div>
    );
  }

  const recent = records.slice(0, 5);

  return (
    <div className="space-y-5">
      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-sm bg-brand-950 text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/admin-banner.jpg"
          alt=""
          className="absolute inset-y-0 right-0 hidden h-full w-[46%] object-cover object-top sm:block"
        />
        <div className="absolute inset-0 bg-brand-950/85" />
        <div className="relative px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-accent-300">Liberia Pharmacy Board</p>
          <h2 className="mt-3 max-w-lg text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
            National Pharmacist Registry and Credential Database
          </h2>
          <p className="mt-3 text-sm font-semibold tracking-wide text-white/70">
            The official record of Liberia&rsquo;s pharmacy workforce
          </p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard icon={Users} tint="bg-paper-200 text-brand-700" label="Total Registered Pharmacists" value={stats.total} trend="+12%" />
        <KpiCard icon={BadgeCheck} tint="bg-paper-200 text-brand-700" label="Active Licenses" value={stats.byStatus.verified} trend="+10%" />
        <KpiCard icon={CircleSlash} tint="bg-paper-200 text-brand-700" label="Inactive / Suspended" value={stats.byStatus.submitted + stats.byStatus.flagged} trend="+5%" />
        <KpiCard icon={FileClock} tint="bg-paper-200 text-brand-700" label="Pending Verification" value={stats.byStatus.submitted + stats.byStatus.under_review} trend="+8%" />
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[1fr_300px]">
        <div className="space-y-5">
          {/* Recent registrations */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4">
              <h3 className="font-bold text-brand-950">Recent Registrations</h3>
              <Link href="/admin/registry" className="text-xs font-bold text-brand-600 transition hover:text-brand-800">
                View All
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px]">
                <thead className="bg-paper-100/70">
                  <tr>
                    <th className="table-th">Name</th>
                    <th className="table-th">License Number</th>
                    <th className="table-th">Registration Date</th>
                    <th className="table-th">Status</th>
                    <th className="table-th sr-only">Open</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {recent.map((r, i) => (
                    <tr key={r.id} className="group transition hover:bg-brand-50/40">
                      <td className="table-td">
                        <Link href={`/admin/registry/${r.id}`} className="flex items-center gap-3">
                          <span
                            className={cn(
                              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white",
                              AVATAR_TINTS[i % AVATAR_TINTS.length]
                            )}
                          >
                            {initials(`${r.personal.firstName} ${r.personal.surname}`)}
                          </span>
                          <span>
                            <span className="block text-sm font-bold text-slate-800 group-hover:text-brand-900">
                              {r.personal.firstName} {r.personal.middleName ? `${r.personal.middleName} ` : ""}{r.personal.surname}
                            </span>
                            <span className="block text-xs text-slate-400">Pharmacist</span>
                          </span>
                        </Link>
                      </td>
                      <td className="table-td font-mono text-xs font-semibold text-slate-600">{r.reference}</td>
                      <td className="table-td text-slate-500">{formatDate(r.submittedAt)}</td>
                      <td className="table-td">
                        <span className={cn("chip", STATUS_META[r.status].chip)}>
                          <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_META[r.status].dot)} />
                          {STATUS_META[r.status].label}
                        </span>
                      </td>
                      <td className="table-td text-right">
                        <Link href={`/admin/registry/${r.id}`} aria-label={`Open ${fullName(r)}`} className="inline-flex rounded-lg p-1.5 text-slate-300 transition hover:bg-paper-100 hover:text-brand-700">
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Registration status (matches the approved dashboard) */}
          <div className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-brand-950">Registration Status</h3>
                <p className="text-xs text-slate-400">Current census pipeline</p>
              </div>
              <Link href="/admin/verify" className="btn-primary px-3.5 py-2 text-xs">
                Review queue <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="mt-4">
              <DonutChart segments={stats.donut} centerLabel="Total" size={150} />
            </div>
          </div>
        </div>

        {/* Right rail */}
        <div className="space-y-5">
          <div className="card p-5">
            <h3 className="font-bold text-brand-950">Quick Actions</h3>
            <div className="mt-4 space-y-2">
              <Link href="/admin/add" className="btn-primary w-full">
                <UserPlus className="h-4 w-4" /> Register New Pharmacist
              </Link>
              <Link href="/admin/verify" className="btn w-full border border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:text-brand-800 focus-visible:ring-brand-100">
                <ShieldCheck className="h-4 w-4 text-brand-600" /> Verify Credentials
              </Link>
              <Link href="/admin/reports" className="btn w-full border border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:text-brand-800 focus-visible:ring-brand-100">
                <FileBarChart2 className="h-4 w-4 text-brand-600" /> Generate Report
              </Link>
              <Link href="/admin/registry" className="btn w-full border border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:text-brand-800 focus-visible:ring-brand-100">
                <Database className="h-4 w-4 text-brand-600" /> Manage Records
              </Link>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-bold text-brand-950">System Overview</h3>
            <ul className="mt-4 space-y-4">
              <li className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2.5 text-sm text-slate-500">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600"><Database className="h-4 w-4" /></span>
                  Total Records
                </span>
                <span className="text-sm font-extrabold text-brand-950">{stats.total.toLocaleString()}</span>
              </li>
              <li className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2.5 text-sm text-slate-500">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600"><Clock3 className="h-4 w-4" /></span>
                  Last Updated
                </span>
                <span className="text-right text-xs font-bold text-brand-950">{formatDateTime(stats.lastUpdated)}</span>
              </li>
              <li className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2.5 text-sm text-slate-500">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600"><FileBarChart2 className="h-4 w-4" /></span>
                  Dataset Size
                </span>
                <span className="text-sm font-extrabold text-brand-950">{formatFileSize(getStorageSizeBytes())}</span>
              </li>
              <li className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2.5 text-sm text-slate-500">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600"><Server className="h-4 w-4" /></span>
                  Server Status
                </span>
                <span className="flex items-center gap-1.5 text-sm font-extrabold text-accent-600">
                  <span className="inline-flex h-2 w-2 rounded-full bg-accent-500" />
                  Online
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div className="band-navy rounded-sm border border-brand-900 p-6 text-white sm:p-7">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="font-extrabold tracking-tight">
              Registry integrity
              <span className="ml-3 chip border border-accent-400/60 text-accent-300">{percent(stats.byStatus.verified, stats.total)}% verified</span>
            </p>
            <p className="mt-1 max-w-2xl text-sm text-white/65">
              The Liberia Pharmacy Board&apos;s digital registry ensures accurate records, credential
              verification, and better workforce planning for a healthier nation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
