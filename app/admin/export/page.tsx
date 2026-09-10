"use client";

import { useEffect, useMemo, useState } from "react";
import { FileDown, Database, Table2, SlidersHorizontal, RotateCcw, CheckCircle2, Loader2 } from "lucide-react";
import { listRegistrations, resetDemoData } from "@/lib/api";
import { downloadCsv, CSV_COLUMNS } from "@/lib/csv";
import type { Registration } from "@/lib/types";
import { STATUS_META, LIBERIA_COUNTIES, SECTORS, type StatusKey } from "@/lib/constants";

const today = new Date().toISOString().slice(0, 10);

export default function ExportPage() {
  const [records, setRecords] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<StatusKey | "all">("all");
  const [county, setCounty] = useState<string>("all");
  const [sector, setSector] = useState<string>("all");
  const [exported, setExported] = useState<string>();
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    listRegistrations().then((r) => {
      setRecords(r);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(
    () =>
      records.filter(
        (r) =>
          (status === "all" || r.status === status) &&
          (county === "all" || r.employment.county === county) &&
          (sector === "all" || r.employment.sector === sector)
      ),
    [records, status, county, sector]
  );

  function exportRows(rows: Registration[], label: string, slug: string) {
    downloadCsv(rows, `lpb-census-2026-${slug}-${today}.csv`);
    setExported(label);
    setTimeout(() => setExported(undefined), 4000);
  }

  const presets = [
    { label: "Full census dataset", desc: "Every submission, all fields", rows: records, slug: "full", chip: "bg-brand-100 text-brand-700" },
    { label: "Verified records", desc: "Approved and signed-off", rows: records.filter((r) => r.status === "verified"), slug: "verified", chip: "bg-emerald-100 text-emerald-700" },
    { label: "Pending verification", desc: "Submitted + under review", rows: records.filter((r) => r.status === "submitted" || r.status === "under_review"), slug: "pending", chip: "bg-amber-100 text-amber-700" },
    { label: "Flagged records", desc: "Need follow-up action", rows: records.filter((r) => r.status === "flagged"), slug: "flagged", chip: "bg-red-100 text-red-700" },
  ];

  async function handleReset() {
    if (!window.confirm("Reset the portal to the original demonstration dataset? Any records added during testing will be removed.")) return;
    setResetting(true);
    await resetDemoData();
    const rows = await listRegistrations();
    setRecords(rows);
    setResetting(false);
  }

  if (loading) {
    return <div className="card h-96 animate-pulse" />;
  }

  return (
    <div className="space-y-5">
      <div className="card border-brand-100 bg-gradient-to-br from-brand-50/60 to-white p-6">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-white">
            <Database className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-brand-950">Download, store, analyze</h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
              Exports are analysis-ready: one row per pharmacist, {CSV_COLUMNS.length} columns, UTF-8 CSV with a header
              row — opens directly in Excel, SPSS, R or Stata, and maps 1:1 onto the PostgreSQL schema planned for
              Phase 2.
            </p>
            {exported && (
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-bold text-white">
                <CheckCircle2 className="h-3.5 w-3.5" /> {exported} downloaded
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Preset exports */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {presets.map((p) => (
          <div key={p.slug} className="card flex flex-col p-5">
            <span className={`chip w-fit ${p.chip}`}>{p.rows.length} records</span>
            <h3 className="mt-3 font-bold text-brand-950">{p.label}</h3>
            <p className="mt-1 text-xs text-slate-500">{p.desc}</p>
            <button
              type="button"
              onClick={() => exportRows(p.rows, p.label, p.slug)}
              disabled={p.rows.length === 0}
              className="btn-dark mt-4 w-full"
            >
              <FileDown className="h-4 w-4" /> Download CSV
            </button>
          </div>
        ))}
      </div>

      {/* Custom export */}
      <div className="card p-5">
        <h3 className="flex items-center gap-2 font-bold text-brand-950">
          <SlidersHorizontal className="h-4 w-4 text-brand-600" /> Custom export
        </h3>
        <p className="mt-1 text-xs text-slate-500">Build a slice of the dataset with the filters below.</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <select value={status} onChange={(e) => setStatus(e.target.value as StatusKey | "all")} className="input w-auto py-2 text-[13px]" aria-label="Status">
            <option value="all">All statuses</option>
            {(Object.keys(STATUS_META) as StatusKey[]).map((s) => (
              <option key={s} value={s}>{STATUS_META[s].label}</option>
            ))}
          </select>
          <select value={county} onChange={(e) => setCounty(e.target.value)} className="input w-auto py-2 text-[13px]" aria-label="County">
            <option value="all">All counties</option>
            {LIBERIA_COUNTIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select value={sector} onChange={(e) => setSector(e.target.value)} className="input w-auto max-w-[240px] py-2 text-[13px]" aria-label="Sector">
            <option value="all">All sectors</option>
            {SECTORS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <span className="ml-auto text-sm text-slate-500"><strong className="text-brand-900">{filtered.length}</strong> matching records</span>
          <button type="button" onClick={() => exportRows(filtered, "Custom export", "custom")} disabled={filtered.length === 0} className="btn-primary">
            <FileDown className="h-4 w-4" /> Export selection
          </button>
        </div>
      </div>

      {/* Data dictionary */}
      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <h3 className="flex items-center gap-2 font-bold text-brand-950">
              <Table2 className="h-4 w-4 text-brand-600" /> Data dictionary
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">{CSV_COLUMNS.length} fields captured per pharmacist — future PostgreSQL column names</p>
          </div>
          <button type="button" onClick={handleReset} disabled={resetting} className="btn-outline px-3.5 py-2 text-xs text-slate-500">
            {resetting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />}
            Reset demo data
          </button>
        </div>
        <div className="max-h-[380px] overflow-y-auto">
          <table className="w-full min-w-[560px]">
            <thead className="sticky top-0 bg-slate-50">
              <tr>
                <th className="table-th">#</th>
                <th className="table-th">Column</th>
                <th className="table-th">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {CSV_COLUMNS.map((col, i) => (
                <tr key={col.key}>
                  <td className="table-td text-xs text-slate-400">{i + 1}</td>
                  <td className="table-td font-mono text-xs font-semibold text-brand-800">{col.key}</td>
                  <td className="table-td text-slate-600">{col.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
