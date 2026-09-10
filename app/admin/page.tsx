"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Users,
  BadgeCheck,
  Hourglass,
  Flag,
  ArrowRight,
  MapPin,
  TrendingUp,
  CalendarRange,
} from "lucide-react";
import { listRegistrations } from "@/lib/api";
import type { Registration } from "@/lib/types";
import { STATUS_META, LIBERIA_COUNTIES } from "@/lib/constants";
import { DonutChart, BarList, TrendChart } from "@/components/admin/charts";
import { cn, formatDate, fullName, percent } from "@/lib/utils";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  sub?: string;
  accent: string;
}) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", accent)}>
        <Icon className="h-6 w-6" />
      </span>
      <div className="min-w-0">
        <p className="text-2xl font-extrabold tracking-tight text-brand-950">{value}</p>
        <p className="truncate text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        {sub && <p className="mt-0.5 text-[11px] text-slate-400">{sub}</p>}
      </div>
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
    const byGender = new Map<string, number>();
    const byCounty = new Map<string, number>();
    const bySector = new Map<string, number>();
    const byQual = new Map<string, number>();
    const byCategory = new Map<string, number>();
    const byMonth = new Array(12).fill(0) as number[];

    for (const r of records) {
      byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;
      byGender.set(r.personal.gender, (byGender.get(r.personal.gender) ?? 0) + 1);
      const pc = r.employment.county || `${r.contact.county} (residence)`;
      byCounty.set(pc, (byCounty.get(pc) ?? 0) + 1);
      bySector.set(r.employment.sector || "Unspecified", (bySector.get(r.employment.sector) ?? 0) + 1);
      byQual.set(r.education.highestQualification, (byQual.get(r.education.highestQualification) ?? 0) + 1);
      byCategory.set(r.licensure.category, (byCategory.get(r.licensure.category) ?? 0) + 1);
      const m = new Date(r.submittedAt).getMonth();
      byMonth[m] += 1;
    }

    const top = (map: Map<string, number>, n: number) =>
      [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([label, value]) => ({ label, value }));

    const countiesCovered = new Set(records.map((r) => r.employment.county || r.contact.county)).size;

    return {
      total: records.length,
      byStatus,
      countiesCovered,
      gender: [...byGender.entries()].map(([label, value]) => ({ label, value })),
      counties: top(byCounty, 10),
      sectors: top(bySector, 6),
      qualifications: top(byQual, 6),
      categories: [...byCategory.entries()].map(([label, value]) => ({ label, value })),
      trend: byMonth.map((value, i) => ({ label: MONTHS[i], value })),
    };
  }, [records]);

  if (!stats) {
    return (
      <div className="grid animate-pulse gap-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card h-[92px] bg-white/70" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="card h-72 lg:col-span-2" />
          <div className="card h-72" />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="card h-72" />
          <div className="card h-72" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Total submissions" value={stats.total} sub="2026 census to date" accent="bg-brand-100 text-brand-700" />
        <StatCard icon={BadgeCheck} label="Verified records" value={stats.byStatus.verified} sub={`${percent(stats.byStatus.verified, stats.total)}% of all submissions`} accent="bg-emerald-100 text-emerald-700" />
        <StatCard icon={Hourglass} label="Pending review" value={stats.byStatus.submitted + stats.byStatus.under_review} sub={`${stats.byStatus.submitted} new · ${stats.byStatus.under_review} in review`} accent="bg-amber-100 text-amber-700" />
        <StatCard icon={Flag} label="Flagged" value={stats.byStatus.flagged} sub="Need follow-up with registrant" accent="bg-red-100 text-red-600" />
      </div>

      {/* Coverage strip */}
      <div className="card flex flex-wrap items-center gap-x-8 gap-y-3 p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-700 text-white"><MapPin className="h-5 w-5" /></span>
          <div>
            <p className="text-lg font-extrabold text-brand-950">{stats.countiesCovered} <span className="text-sm font-semibold text-slate-400">/ {LIBERIA_COUNTIES.length} counties</span></p>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Geographic coverage</p>
          </div>
        </div>
        <div className="min-w-[200px] flex-1">
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-gold-400 transition-all duration-700" style={{ width: `${(stats.countiesCovered / LIBERIA_COUNTIES.length) * 100}%` }} />
          </div>
        </div>
        <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <TrendingUp className="h-4 w-4 text-brand-600" /> Outreach needed in {LIBERIA_COUNTIES.length - stats.countiesCovered} uncovered counties
        </p>
      </div>

      {/* Trend + gender */}
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="card p-5 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-2 font-bold text-brand-950"><CalendarRange className="h-4 w-4 text-brand-600" /> Registration trend — 2026</h2>
              <p className="text-xs text-slate-400">Submissions received per month</p>
            </div>
            <span className="chip bg-brand-50 text-brand-700 ring-1 ring-brand-100">{stats.total} total</span>
          </div>
          <TrendChart points={stats.trend} />
        </div>
        <div className="card p-5">
          <h2 className="font-bold text-brand-950">Gender distribution</h2>
          <p className="text-xs text-slate-400">All submissions</p>
          <div className="mt-4">
            <DonutChart segments={stats.gender} centerLabel="pharmacists" size={150} />
          </div>
        </div>
      </div>

      {/* Counties + sector */}
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-brand-950">Registrations by county</h2>
              <p className="text-xs text-slate-400">Place of practice (top 10)</p>
            </div>
          </div>
          <BarList items={stats.counties} />
        </div>
        <div className="card p-5">
          <h2 className="font-bold text-brand-950">Practice sector</h2>
          <p className="text-xs text-slate-400">Primary employment sector</p>
          <div className="mt-4">
            <DonutChart segments={stats.sectors} centerLabel="sectors" size={150} />
          </div>
        </div>
      </div>

      {/* Qualifications + category */}
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="card p-5">
          <h2 className="font-bold text-brand-950">Highest qualification</h2>
          <p className="text-xs text-slate-400">Academic credentials</p>
          <div className="mt-4">
            <BarList items={stats.qualifications} accent="#c9a227" />
          </div>
        </div>
        <div className="card p-5">
          <h2 className="font-bold text-brand-950">License category</h2>
          <p className="text-xs text-slate-400">LPB licensing cadre</p>
          <div className="mt-4">
            <DonutChart segments={stats.categories} centerLabel="cadres" size={150} />
          </div>
        </div>
      </div>

      {/* Recent submissions */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="font-bold text-brand-950">Latest submissions</h2>
            <p className="text-xs text-slate-400">Most recent records awaiting or completing verification</p>
          </div>
          <Link href="/admin/submissions" className="btn-primary px-3.5 py-2 text-xs">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead className="bg-slate-50/70">
              <tr>
                <th className="table-th">Reference</th>
                <th className="table-th">Pharmacist</th>
                <th className="table-th">County (practice)</th>
                <th className="table-th">Sector</th>
                <th className="table-th">Status</th>
                <th className="table-th">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records!.slice(0, 6).map((r) => (
                <tr key={r.id} className="transition hover:bg-brand-50/40">
                  <td className="table-td font-mono text-xs font-bold text-brand-800">
                    <Link href={`/admin/submissions/${r.id}`} className="hover:underline">{r.reference}</Link>
                  </td>
                  <td className="table-td font-semibold text-slate-800">{fullName(r)}</td>
                  <td className="table-td">{r.employment.county || "—"}</td>
                  <td className="table-td max-w-[220px] truncate">{r.employment.sector || "—"}</td>
                  <td className="table-td">
                    <span className={cn("chip", STATUS_META[r.status].chip)}>
                      <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_META[r.status].dot)} />
                      {STATUS_META[r.status].label}
                    </span>
                  </td>
                  <td className="table-td text-slate-500">{formatDate(r.submittedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
