"use client";

import { useEffect, useState } from "react";
import { Settings, Users2, Table2, RotateCcw, Loader2, Database, ShieldCheck } from "lucide-react";
import { listRegistrations, resetDemoData } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { CSV_COLUMNS } from "@/lib/csv";
import type { SessionUser } from "@/lib/types";

const ROLES = [
  { name: "Registrar & CEO", email: "admin@lpb.gov.lr", scope: "Full access: verify, flag, create & export records" },
  { name: "Data & Records Officer", email: "data.officer@lpb.gov.lr", scope: "Review queue, annotate and export records" },
  { name: "Viewer (readonly)", email: "Planned for Phase 2", scope: "Dashboards and reports only" },
];

export default function SettingsPage() {
  const [session, setSession] = useState<(SessionUser & { at: string }) | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    setSession(getSession());
    listRegistrations().then((r) => setTotal(r.length));
  }, []);

  async function handleReset() {
    if (!window.confirm("Reset the registry to the original demonstration dataset? Records added or changed during testing will be replaced.")) return;
    setResetting(true);
    await resetDemoData();
    const rows = await listRegistrations();
    setTotal(rows.length);
    setResetting(false);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      {/* Account */}
      <div className="card p-6">
        <h2 className="flex items-center gap-2 font-extrabold tracking-tight text-brand-950">
          <Settings className="h-4 w-4 text-brand-600" /> Signed-in official
        </h2>
        {session && (
          <div className="mt-4 flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-700 text-sm font-extrabold text-white">
              {session.initials}
            </span>
            <div>
              <p className="font-bold text-brand-950">{session.name}</p>
              <p className="text-sm text-slate-500">{session.email} · {session.role}</p>
            </div>
          </div>
        )}
      </div>

      {/* Staff roles */}
      <div className="card p-6">
        <h2 className="flex items-center gap-2 font-extrabold tracking-tight text-brand-950">
          <Users2 className="h-4 w-4 text-brand-600" /> Portal roles
        </h2>
        <p className="mt-1 text-sm text-slate-500">Demo accounts for this build; Phase 2 enforces these roles server-side.</p>
        <ul className="mt-4 divide-y divide-slate-200">
          {ROLES.map((r) => (
            <li key={r.name} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <div>
                <p className="text-sm font-bold text-slate-800">{r.name}</p>
                <p className="font-mono text-xs text-slate-400">{r.email}</p>
              </div>
              <p className="max-w-xs text-right text-xs text-slate-500">{r.scope}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Data dictionary */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="flex items-center gap-2 font-extrabold tracking-tight text-brand-950">
              <Table2 className="h-4 w-4 text-brand-600" /> Data dictionary
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">{CSV_COLUMNS.length} fields captured per pharmacist; future PostgreSQL columns</p>
          </div>
        </div>
        <div className="max-h-[340px] overflow-y-auto">
          <table className="w-full min-w-[480px]">
            <thead className="sticky top-0 bg-paper-100">
              <tr>
                <th className="table-th">#</th>
                <th className="table-th">Column</th>
                <th className="table-th">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
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

      {/* Demo data */}
      <div className="card p-6">
        <h2 className="flex items-center gap-2 font-extrabold tracking-tight text-brand-950">
          <Database className="h-4 w-4 text-brand-600" /> Demonstration data
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-slate-500">
          This build runs on a seeded browser dataset ({total} registry records + demo pharmacist account). Reset to
          restore the original state before a presentation.
        </p>
        <button type="button" onClick={handleReset} disabled={resetting} className="btn-outline mt-4">
          {resetting ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
          Reset demo data
        </button>
      </div>

      {/* Phase 2 */}
      <div className="card bg-paper-100 p-6">
        <h2 className="flex items-center gap-2 font-extrabold tracking-tight text-brand-950">
          <ShieldCheck className="h-4 w-4 text-brand-600" /> Phase 2 ready
        </h2>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
          All data access in this portal flows through <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs text-brand-800 ring-1 ring-brand-100">lib/api.ts</code>.
          The production build wires the same functions to a Node.js + PostgreSQL backend (hashed passwords,
          server-side sessions, file storage for credentials) with no UI changes.
        </p>
      </div>
    </div>
  );
}
