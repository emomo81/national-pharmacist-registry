"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Hourglass,
  Flag,
  RotateCcw,
  FileText,
  ImageIcon,
  Save,
  FileDown,
  History,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { getRegistration, updateRegistrationStatus, saveRegistrationNote } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { downloadCsv } from "@/lib/csv";
import type { Registration } from "@/lib/types";
import { STATUS_META, type StatusKey } from "@/lib/constants";
import { cn, formatDate, formatDateTime, formatFileSize, fullName } from "@/lib/utils";

function DataRow({ label, value }: { label: string; value?: string | boolean | null }) {
  const display =
    typeof value === "boolean" ? (value ? "Yes" : "No") : value && String(value).trim() ? String(value) : "—";
  return (
    <div className="grid grid-cols-[38%_62%] gap-2 px-5 py-2.5">
      <dt className="pt-0.5 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="break-words text-sm font-medium text-slate-800">{display}</dd>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card overflow-hidden">
      <header className="border-b border-slate-100 bg-slate-50/60 px-5 py-3">
        <h3 className="text-sm font-bold text-brand-900">{title}</h3>
      </header>
      <dl className="divide-y divide-slate-100">{children}</dl>
    </section>
  );
}

export default function SubmissionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [record, setRecord] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [noteDirty, setNoteDirty] = useState(false);
  const [busy, setBusy] = useState(false);

  const session = typeof window !== "undefined" ? getSession() : null;
  const actor = session ? `${session.name} — ${session.role}` : "LPB Official";

  useEffect(() => {
    getRegistration(id).then((r) => {
      setRecord(r);
      setNote(r?.notes ?? "");
      setLoading(false);
    });
  }, [id]);

  async function setStatus(status: StatusKey) {
    if (!record) return;
    const verb =
      status === "verified" ? "verify" : status === "flagged" ? "flag" : status === "under_review" ? "move to under review" : "reset";
    if (!window.confirm(`Are you sure you want to ${verb} ${record.reference}?`)) return;
    setBusy(true);
    const updated = await updateRegistrationStatus(record.id, status, actor);
    setBusy(false);
    if (updated) setRecord(updated);
  }

  async function saveNote() {
    if (!record) return;
    setBusy(true);
    const updated = await saveRegistrationNote(record.id, note);
    setBusy(false);
    if (updated) {
      setRecord(updated);
      setNoteDirty(false);
    }
  }

  if (loading) {
    return (
      <div className="grid animate-pulse gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => <div key={i} className="card h-44" />)}
        </div>
        <div className="card h-96" />
      </div>
    );
  }

  if (!record) {
    return (
      <div className="card mx-auto max-w-lg p-10 text-center">
        <AlertTriangle className="mx-auto h-8 w-8 text-amber-500" />
        <h2 className="mt-3 text-lg font-bold text-brand-950">Record not found</h2>
        <p className="mt-1 text-sm text-slate-500">This submission may have been removed or the link is incorrect.</p>
        <Link href="/admin/registry" className="btn-primary mt-5">
          <ArrowLeft className="h-4 w-4" /> Back to submissions
        </Link>
      </div>
    );
  }

  const { personal: p, contact: c, education: e, licensure: l, employment: em, documents: d } = record;
  const docs = [
    { label: "Passport photograph", doc: d.passportPhoto },
    { label: "Degree / diploma certificate", doc: d.degreeCertificate },
    { label: "LPB license certificate", doc: d.lpbLicense },
    { label: "National ID / passport", doc: d.nationalIdDoc },
    { label: "Curriculum vitae", doc: d.cv },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="card flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-4">
          <Link href="/admin/registry" className="btn-outline px-2.5 py-2" aria-label="Back to submissions">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl font-extrabold tracking-tight text-brand-950">{fullName(record)}</h2>
              <span className={cn("chip", STATUS_META[record.status].chip)}>
                <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_META[record.status].dot)} />
                {STATUS_META[record.status].label}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-slate-500">
              <span className="font-mono font-bold text-brand-800">{record.reference}</span>
              <span className="mx-2 text-slate-300">·</span>
              Submitted {formatDateTime(record.submittedAt)}
            </p>
          </div>
        </div>
        <button type="button" onClick={() => downloadCsv([record], `${record.reference}-record.csv`)} className="btn-outline">
          <FileDown className="h-4 w-4" /> Download record (CSV)
        </button>
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[1fr_330px]">
        {/* Main column */}
        <div className="space-y-5">
          <Section title="Personal information">
            <DataRow label="Full name" value={fullName(record)} />
            <DataRow label="Date of birth" value={formatDate(p.dob)} />
            <DataRow label="Gender" value={p.gender} />
            <DataRow label="Nationality" value={p.nationality} />
            <DataRow label="County of origin" value={p.countyOfOrigin} />
            <DataRow label="National ID / Passport" value={p.nationalId} />
            <DataRow label="Marital status" value={p.maritalStatus} />
          </Section>

          <Section title="Contact details">
            <DataRow label="Email" value={c.email} />
            <DataRow label="Phone" value={c.phone} />
            <DataRow label="Alt. phone" value={c.altPhone} />
            <DataRow label="Address" value={`${c.address}, ${c.city}`} />
            <DataRow label="District / County" value={`${c.district} · ${c.county}`} />
          </Section>

          <Section title="Education & qualifications">
            <DataRow label="Qualification" value={e.highestQualification} />
            <DataRow label="Institution" value={e.institution} />
            <DataRow label="Country of training" value={e.countryOfTraining} />
            <DataRow label="Graduation year" value={e.graduationYear} />
            <DataRow label="Specialization" value={e.specialization} />
            {e.otherQualifications ? <DataRow label="Other" value={e.otherQualifications} /> : null}
          </Section>

          <Section title="Licensure & registration">
            <DataRow label="LPB number" value={l.lpbNumber} />
            <DataRow label="Category" value={l.category} />
            <DataRow label="Initial registration" value={l.initialRegistrationYear} />
            <DataRow label="License expiry" value={formatDate(l.licenseExpiry)} />
            <DataRow label="Registered abroad" value={l.registeredElsewhere ? `Yes — ${l.otherCountries ?? ""}` : "No"} />
            <DataRow label="Good standing declared" value={l.inGoodStanding} />
          </Section>

          <Section title="Practice & employment">
            <DataRow label="Status" value={em.status} />
            <DataRow label="Sector" value={em.sector} />
            {em.facilityName ? <DataRow label="Facility" value={em.facilityName} /> : null}
            {em.facilityType ? <DataRow label="Facility type" value={em.facilityType} /> : null}
            {em.position ? <DataRow label="Position" value={em.position} /> : null}
            {em.county ? <DataRow label="County / District" value={`${em.county}${em.district ? ` · ${em.district}` : ""}`} /> : null}
            <DataRow label="Experience" value={`${em.yearsOfExperience} years`} />
          </Section>

          <Section title="Uploaded credentials">
            <div className="grid gap-3 px-5 py-4 sm:grid-cols-2">
              {docs.map((item) =>
                item.doc ? (
                  <div key={item.label} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                    {item.doc.dataUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.doc.dataUrl} alt={item.label} className="h-12 w-12 rounded-md border border-slate-200 object-cover" />
                    ) : (
                      <span className="flex h-12 w-12 items-center justify-center rounded-md bg-slate-100 text-slate-400">
                        {item.doc.type.startsWith("image/") ? <ImageIcon className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-700">{item.label}</p>
                      <p className="truncate text-[11px] text-slate-500">
                        {item.doc.name} · {formatFileSize(item.doc.size)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div key={item.label} className="flex items-center gap-2 rounded-lg border border-dashed border-slate-200 p-3 text-xs text-slate-400">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" /> {item.label}: not attached
                  </div>
                )
              )}
            </div>
          </Section>

          <Section title="Status history">
            <ol className="space-y-4 px-5 py-4">
              {[...record.history].reverse().map((h, i) => (
                <li key={i} className="flex gap-3">
                  <span className={cn("mt-1 h-2.5 w-2.5 shrink-0 rounded-full", i === 0 ? "bg-brand-500 ring-4 ring-brand-100" : "bg-slate-300")} />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{h.action}</p>
                    <p className="text-xs text-slate-400">{formatDateTime(h.at)} · {h.by}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Section>
        </div>

        {/* Sidebar */}
        <div className="space-y-5 xl:sticky xl:top-24">
          <div className="card p-5">
            <h3 className="flex items-center gap-2 text-sm font-bold text-brand-950">
              <BadgeCheck className="h-4 w-4 text-brand-600" /> Review actions
            </h3>
            <div className="mt-4 space-y-2">
              <button type="button" disabled={busy || record.status === "under_review"} onClick={() => setStatus("under_review")} className="btn w-full border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 focus-visible:ring-amber-200">
                <Hourglass className="h-4 w-4" /> Move to under review
              </button>
              <button type="button" disabled={busy || record.status === "verified"} onClick={() => setStatus("verified")} className="btn w-full bg-brand-700 text-white hover:bg-brand-800 focus-visible:ring-brand-200">
                <BadgeCheck className="h-4 w-4" /> Verify record
              </button>
              <button type="button" disabled={busy || record.status === "flagged"} onClick={() => setStatus("flagged")} className="btn w-full border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 focus-visible:ring-red-200">
                <Flag className="h-4 w-4" /> Flag for follow-up
              </button>
              <button type="button" disabled={busy || record.status === "submitted"} onClick={() => setStatus("submitted")} className="btn-ghost w-full text-xs text-slate-400">
                <RotateCcw className="h-3.5 w-3.5" /> Reset to submitted
              </button>
              {busy && <p className="flex items-center justify-center gap-2 pt-1 text-xs text-slate-400"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…</p>}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="flex items-center gap-2 text-sm font-bold text-brand-950">
              <FileText className="h-4 w-4 text-brand-600" /> Internal notes
            </h3>
            <p className="mt-1 text-xs text-slate-400">Visible to LPB staff only — never to the registrant.</p>
            <textarea
              value={note}
              onChange={(e) => { setNote(e.target.value); setNoteDirty(true); }}
              rows={5}
              className="input mt-3 resize-y"
              placeholder="e.g. License expired — registrant contacted to renew before verification."
            />
            <button type="button" onClick={saveNote} disabled={!noteDirty || busy} className="btn-dark mt-3 w-full">
              <Save className="h-4 w-4" /> Save note
            </button>
          </div>

          <div className="card p-5 text-sm">
            <h3 className="flex items-center gap-2 text-sm font-bold text-brand-950">
              <History className="h-4 w-4 text-brand-600" /> Record meta
            </h3>
            <dl className="mt-3 space-y-2 text-xs text-slate-500">
              <div className="flex justify-between gap-2"><dt>Record ID</dt><dd className="font-mono text-[10px] text-slate-400">{record.id.slice(0, 13)}…</dd></div>
              <div className="flex justify-between gap-2"><dt>Submitted</dt><dd className="font-medium text-slate-700">{formatDateTime(record.submittedAt)}</dd></div>
              <div className="flex justify-between gap-2"><dt>Last updated</dt><dd className="font-medium text-slate-700">{formatDateTime(record.updatedAt)}</dd></div>
              <div className="flex justify-between gap-2"><dt>Documents</dt><dd className="font-medium text-slate-700">{docs.filter((x) => x.doc).length} attached</dd></div>
              <div className="flex justify-between gap-2"><dt>Declaration</dt><dd className="font-medium text-brand-700">Signed ✓</dd></div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
