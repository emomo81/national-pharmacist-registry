"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, FileDown, ChevronLeft, ChevronRight, ArrowUpDown, FilterX } from "lucide-react";
import { listRegistrations, type ListParams } from "@/lib/api";
import { downloadCsv } from "@/lib/csv";
import type { Registration } from "@/lib/types";
import { STATUS_META, LIBERIA_COUNTIES, SECTORS, type StatusKey } from "@/lib/constants";
import { cn, formatDate, fullName } from "@/lib/utils";

const PAGE_SIZE = 10;

export default function SubmissionsPage() {
  const [items, setItems] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<StatusKey | "all">("all");
  const [county, setCounty] = useState<string>("all");
  const [sector, setSector] = useState<string>("all");
  const [sort, setSort] = useState<NonNullable<ListParams["sort"]>>("newest");
  const [page, setPage] = useState(1);

  // Prefill search from the top-bar global search (?q=…)
  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("q");
    if (initial) setQ(initial);
  }, []);

  useEffect(() => {
    setLoading(true);
    const handle = setTimeout(() => {
      listRegistrations({ q, status, county, sector, sort }).then((rows) => {
        setItems(rows);
        setLoading(false);
      });
    }, 180);
    return () => clearTimeout(handle);
  }, [q, status, county, sector, sort]);

  useEffect(() => setPage(1), [q, status, county, sector, sort]);

  const pages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const pageItems = useMemo(() => items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [items, page]);

  const hasFilters = q || status !== "all" || county !== "all" || sector !== "all";

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="card space-y-3 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, reference, license no., email, facility…"
              className="input pl-10"
              aria-label="Search submissions"
            />
          </div>
          <button
            type="button"
            onClick={() => downloadCsv(items, `lpb-census-2026-${new Date().toISOString().slice(0, 10)}.csv`)}
            className="btn-dark"
            disabled={items.length === 0}
          >
            <FileDown className="h-4 w-4" />
            Export {hasFilters ? "filtered" : "all"} CSV ({items.length})
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select value={status} onChange={(e) => setStatus(e.target.value as StatusKey | "all")} className="input w-auto py-2 text-[13px]" aria-label="Filter by status">
            <option value="all">All statuses</option>
            {(Object.keys(STATUS_META) as StatusKey[]).map((s) => (
              <option key={s} value={s}>{STATUS_META[s].label}</option>
            ))}
          </select>
          <select value={county} onChange={(e) => setCounty(e.target.value)} className="input w-auto py-2 text-[13px]" aria-label="Filter by county">
            <option value="all">All counties</option>
            {LIBERIA_COUNTIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select value={sector} onChange={(e) => setSector(e.target.value)} className="input w-auto max-w-[220px] py-2 text-[13px]" aria-label="Filter by sector">
            <option value="all">All sectors</option>
            {SECTORS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setSort((s) => (s === "newest" ? "oldest" : s === "oldest" ? "name" : "newest"))}
            className="btn-ghost px-3 py-2 text-xs"
            title="Cycle sort order"
          >
            <ArrowUpDown className="h-4 w-4" />
            {sort === "newest" ? "Newest first" : sort === "oldest" ? "Oldest first" : "By name"}
          </button>
          {hasFilters && (
            <button
              type="button"
              onClick={() => { setQ(""); setStatus("all"); setCounty("all"); setSector("all"); }}
              className="btn-ghost px-3 py-2 text-xs text-red-600 hover:bg-red-50"
            >
              <FilterX className="h-4 w-4" /> Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead className="border-b border-slate-200 bg-paper-100/70">
              <tr>
                <th className="table-th">Reference</th>
                <th className="table-th">Pharmacist</th>
                <th className="table-th">LPB No.</th>
                <th className="table-th">Qualification</th>
                <th className="table-th">County</th>
                <th className="table-th">Status</th>
                <th className="table-th">Submitted</th>
                <th className="table-th sr-only">Open</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {[...Array(8)].map((_, j) => (
                      <td key={j} className="table-td">
                        <div className="h-4 rounded bg-paper-100" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : pageItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-14 text-center">
                    <p className="font-semibold text-slate-500">No submissions match your filters.</p>
                    <p className="mt-1 text-sm text-slate-400">Try widening the search or clearing the filters.</p>
                  </td>
                </tr>
              ) : (
                pageItems.map((r) => (
                  <tr key={r.id} className="group transition hover:bg-brand-50/40">
                    <td className="table-td font-mono text-xs font-bold text-brand-800">
                      <Link href={`/admin/registry/${r.id}`} className="hover:underline">{r.reference}</Link>
                    </td>
                    <td className="table-td">
                      <Link href={`/admin/registry/${r.id}`} className="font-semibold text-slate-800 group-hover:text-brand-900">
                        {fullName(r)}
                      </Link>
                      <p className="text-xs text-slate-400">{r.personal.gender} · {r.contact.city}</p>
                    </td>
                    <td className="table-td font-mono text-xs">{r.licensure.lpbNumber}</td>
                    <td className="table-td max-w-[200px] truncate">{r.education.highestQualification}</td>
                    <td className="table-td">{r.employment.county || r.contact.county}</td>
                    <td className="table-td">
                      <span className={cn("chip", STATUS_META[r.status].chip)}>
                        <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_META[r.status].dot)} />
                        {STATUS_META[r.status].label}
                      </span>
                    </td>
                    <td className="table-td text-slate-500">{formatDate(r.submittedAt)}</td>
                    <td className="table-td text-right">
                      <Link href={`/admin/registry/${r.id}`} className="btn-ghost px-2.5 py-1.5 text-xs">
                        Open <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
          <p>
            Showing <strong className="text-slate-700">{items.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, items.length)}</strong> of{" "}
            <strong className="text-slate-700">{items.length}</strong> records
          </p>
          <div className="flex items-center gap-1">
            <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="btn-outline px-2.5 py-1.5 text-xs" aria-label="Previous page">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 font-semibold text-slate-600">Page {page} of {pages}</span>
            <button type="button" disabled={page >= pages} onClick={() => setPage((p) => p + 1)} className="btn-outline px-2.5 py-1.5 text-xs" aria-label="Next page">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
