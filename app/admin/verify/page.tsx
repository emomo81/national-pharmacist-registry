"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { BadgeCheck, Flag, ChevronRight, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { listRegistrations, updateRegistrationStatus } from "@/lib/api";
import { getSession } from "@/lib/auth";
import type { Registration } from "@/lib/types";
import { STATUS_META } from "@/lib/constants";
import { cn, formatDate, fullName, initials } from "@/lib/utils";

const AVATAR_TINTS = ["bg-brand-700"];

export default function VerifyCredentialsPage() {
  const [records, setRecords] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string>();
  const [done, setDone] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    const rows = await listRegistrations();
    setRecords(rows.filter((r) => r.status === "submitted" || r.status === "under_review"));
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function act(record: Registration, status: "verified" | "flagged") {
    const session = getSession();
    const actor = session ? `${session.name} (${session.role})` : "LPB Official";
    if (!window.confirm(`${status === "verified" ? "Verify" : "Flag"} ${record.reference} (${fullName(record)})?`)) return;
    setBusyId(record.id);
    await updateRegistrationStatus(record.id, status, actor);
    setDone((d) => ({ ...d, [record.id]: status }));
    setRecords((rows) => rows.filter((r) => r.id !== record.id));
    setBusyId(undefined);
  }

  const docCount = (r: Registration) => Object.values(r.documents).filter(Boolean).length;

  return (
    <div className="space-y-5">
      <div className="card flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <h2 className="font-extrabold tracking-tight text-brand-950">Verification queue</h2>
          <p className="text-sm text-slate-500">
            Records awaiting LPB verification, newest first. Open a record to inspect credentials before deciding.
          </p>
        </div>
        <span className="chip bg-amber-100 text-amber-800 ring-1 ring-amber-200">
          <FileText className="h-3.5 w-3.5" /> {records.length} pending
        </span>
      </div>

      {Object.keys(done).length > 0 && (
        <p className="flex items-center gap-2 rounded-sm border border-accent-200 bg-accent-50 px-4 py-3 text-sm font-semibold text-accent-800">
          <CheckCircle2 className="h-4 w-4" /> {Object.keys(done).length} record{Object.keys(done).length > 1 ? "s" : ""} processed this session.
        </p>
      )}

      <div className="card overflow-hidden">
        {loading ? (
          <div className="divide-y divide-slate-200">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex animate-pulse items-center gap-4 px-5 py-4">
                <div className="h-10 w-10 rounded-full bg-paper-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 rounded bg-paper-100" />
                  <div className="h-3 w-1/2 rounded bg-paper-100" />
                </div>
              </div>
            ))}
          </div>
        ) : records.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-accent-500" />
            <p className="mt-3 font-bold text-brand-950">All caught up</p>
            <p className="mt-1 text-sm text-slate-500">There are no submissions waiting for verification right now.</p>
            <Link href="/admin/registry" className="btn-primary mt-5">
              Browse full registry <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-slate-200">
            {records.map((r, i) => (
              <li key={r.id} className="flex flex-wrap items-center gap-4 px-5 py-4 transition hover:bg-brand-50/30">
                <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-white", AVATAR_TINTS[i % AVATAR_TINTS.length])}>
                  {initials(`${r.personal.firstName} ${r.personal.surname}`)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/admin/registry/${r.id}`} className="text-sm font-bold text-slate-800 hover:text-brand-800 hover:underline">
                      {fullName(r)}
                    </Link>
                    <span className={cn("chip", STATUS_META[r.status].chip)}>
                      <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_META[r.status].dot)} />
                      {STATUS_META[r.status].label}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    <span className="font-mono font-bold text-brand-800">{r.reference}</span>
                    <span className="mx-1.5 text-slate-300">·</span>
                    {r.licensure.lpbNumber}
                    <span className="mx-1.5 text-slate-300">·</span>
                    {r.employment.county || r.contact.county}
                    <span className="mx-1.5 text-slate-300">·</span>
                    submitted {formatDate(r.submittedAt)}
                    <span className="mx-1.5 text-slate-300">·</span>
                    {docCount(r)} credential{docCount(r) === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/registry/${r.id}`} className="btn-outline px-3 py-2 text-xs">
                    Open <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    type="button"
                    disabled={busyId === r.id}
                    onClick={() => act(r, "verified")}
                    className="btn bg-accent-500 text-white hover:bg-accent-600 focus-visible:ring-accent-200 px-3 py-2 text-xs"
                  >
                    {busyId === r.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <BadgeCheck className="h-3.5 w-3.5" />}
                    Verify
                  </button>
                  <button
                    type="button"
                    disabled={busyId === r.id}
                    onClick={() => act(r, "flagged")}
                    className="btn border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 focus-visible:ring-red-200 px-3 py-2 text-xs"
                  >
                    <Flag className="h-3.5 w-3.5" /> Flag
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
