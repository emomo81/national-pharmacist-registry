"use client";

import { useEffect, useMemo, useState } from "react";
import { FileDown, BarChart3, SlidersHorizontal, CheckCircle2 } from "lucide-react";
import { listRegistrations } from "@/lib/api";
import { downloadCsv, CSV_COLUMNS } from "@/lib/csv";
import type { Registration } from "@/lib/types";
import { STATUS_META, type StatusKey } from "@/lib/constants";
import { DonutChart, TrendChart } from "@/components/admin/charts";
import { cn, percent } from "@/lib/utils";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const COUNTY_COLORS: Record<string, string> = {
  Montserrado: "#2563eb",
  Margibi: "#22a06b",
  Bong: "#f59e0b",
  Nimba: "#8b5cf6",
  Lofa: "#ec4899",
};
const FALLBACK_BAR = "#94a3b8";

export default function ReportsPage() {
  const [records, setRecords] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<StatusKey | "all">("all");
  const [exported, setExported] = useState<string>();

  useEffect(() => {
    listRegistrations().then((r) => {
      setRecords(r);
      setLoading(false);
    });
  }, []);

  const stats = useMemo(() => {
    const byStatus = { submitted: 0, under_review: 0, verified: 0, flagged: 0 } as Record<string, number>;
    const byCounty = new Map<string, number>();
    const byQual = new Map<string, number>();
    const byGender = new Map<string, number>();
    const byMonth = new Array(12).fill(0) as number[];
    for (const r of records) {
      byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;
      const pc = r.employment.county || r.contact.county || "Unknown";
      byCounty.set(pc, (byCounty.get(pc) ?? 0) + 1);
      const q = r.education.highestQualification || "Unspecified";
      byQual.set(q, (byQual.get(q) ?? 0) + 1);
      byGender.set(r.personal.gender || "Unspecified", (byGender.get(r.personal.gender) ?? 0) + 1);
      byMonth[new Date(r.submittedAt).getMonth()] += 1;
    }
    const counties = [...byCounty.entries()].sort((a, b) => b[1] - a[1]);
    return {
      byStatus,
      counties,
      quals: [...byQual.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([label, value]) => ({ label, value })),
      genders: [...byGender.entries()].map(([label, value]) => ({ label, value })),
      trend: byMonth.map((value, i) => ({ label: MONTHS[i], value })),
    };
  }, [records]);

  if (loading) return <div className="card h-96 animate-pulse" />;

  const total = records.length;
  const kpis = [
    { label: "Total Pharmacists", value: total, chip: "bg-brand-100 text-brand-700" },
    { label: "Verified Records", value: stats.byStatus.verified, chip: "bg-accent-100 text-accent-700" },
    { label: "Pending Verification", value: stats.byStatus.submitted + stats.byStatus.under_review, chip: "bg-amber-100 text-amber-700" },
    { label: "Flagged", value: stats.byStatus.flagged, chip: "bg-red-100 text-red-700" },
  ];

  function doExport(rows: Registration[], label: string, slug: string) {
    downloadCsv(rows, `lpb-census-2026-${slug}-${new Date().toISOString().slice(0, 10)}.csv`);
    setExported(label);
    setTimeout(() => setExported(undefined), 4000);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-brand-800 text-white">
            <BarChart3 className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-extrabold tracking-tight text-brand-950">Analytics &amp; Reports</h2>
            <p className="text-xs text-slate-500">Census period: January to December 2026 · live from {total} records</p>
          </div>
        </div>
        {exported && (
          <p className="inline-flex items-center gap-1.5 rounded-lg bg-accent-600 px-3 py-1.5 text-xs font-bold text-white">
            <CheckCircle2 className="h-3.5 w-3.5" /> {exported} downloaded
          </p>
        )}
      </div>

      {/* KPI mini cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="card p-4">
            <span className={cn("chip", k.chip)}>{k.label}</span>
            <p className="mt-2.5 text-2xl font-extrabold tracking-tight text-brand-950">{k.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-2">
        {/* Pharmacists by county, as in the approved analytics mock */}
        <div className="card p-5">
          <h3 className="font-bold text-brand-950">Pharmacists by County</h3>
          <p className="text-xs text-slate-400">Share of registered pharmacists (place of practice)</p>
          <div className="mt-5 space-y-3.5">
            {stats.counties.map(([label, value]) => {
              const pct = percent(value, total);
              return (
                <div key={label} className="flex items-center gap-3">
                  <span className="w-28 truncate text-[13px] font-medium text-slate-600">{label}</span>
                  <div className="h-3.5 flex-1 overflow-hidden rounded-full bg-paper-100">
                    <div
                      className="h-full rounded-full transition-colors duration-500"
                      style={{ width: `${Math.max(pct, 2)}%`, background: COUNTY_COLORS[label] ?? FALLBACK_BAR }}
                    />
                  </div>
                  <span className="w-12 text-right text-[13px] font-bold text-slate-700">{Math.round(pct)}%</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <h3 className="font-bold text-brand-950">Qualification Levels</h3>
            <p className="text-xs text-slate-400">Highest pharmacy qualification</p>
            <div className="mt-4">
              <DonutChart segments={stats.quals} centerLabel="records" size={150} />
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-bold text-brand-950">Gender split</h3>
            <div className="mt-4">
              <DonutChart segments={stats.genders} centerLabel="pharmacists" size={150} />
            </div>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-bold text-brand-950">Registrations per month, 2026</h3>
        <div className="mt-4">
          <TrendChart points={stats.trend} />
        </div>
      </div>

      {/* Export center */}
      <div className="card p-5">
        <h3 className="flex items-center gap-2 font-bold text-brand-950">
          <SlidersHorizontal className="h-4 w-4 text-brand-600" /> Generate report (CSV)
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          One row per pharmacist · {CSV_COLUMNS.length} columns · opens in Excel, SPSS, R or Stata, and maps 1:1 onto
          the Phase-2 PostgreSQL schema.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <select value={status} onChange={(e) => setStatus(e.target.value as StatusKey | "all")} className="input w-auto py-2 text-[13px]" aria-label="Status filter">
            <option value="all">All statuses</option>
            {(Object.keys(STATUS_META) as StatusKey[]).map((s) => (
              <option key={s} value={s}>{STATUS_META[s].label}</option>
            ))}
          </select>
          {[
            { label: "Full dataset", rows: records, slug: "full" },
            { label: "Verified only", rows: records.filter((r) => r.status === "verified"), slug: "verified" },
            { label: "Pending only", rows: records.filter((r) => r.status === "submitted" || r.status === "under_review"), slug: "pending" },
            {
              label: status === "all" ? "Filtered" : `${STATUS_META[status].label} only`,
              rows: records.filter((r) => status === "all" || r.status === status),
              slug: "filtered",
            },
          ].map((e) => (
            <button key={e.slug} type="button" onClick={() => doExport(e.rows, e.label, e.slug)} disabled={e.rows.length === 0} className="btn-dark px-3.5 py-2 text-xs">
              <FileDown className="h-3.5 w-3.5" /> {e.label} ({e.rows.length})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
