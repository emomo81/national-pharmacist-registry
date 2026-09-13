"use client";

import { useState } from "react";
import { GraduationCap, Plus, Trash2, FileText, Loader2 } from "lucide-react";
import { PortalShell } from "@/components/portal/shell";
import { useAccount } from "@/components/portal/use-account";
import { Field, TextInput, SelectInput } from "@/components/ui/field";
import { addQualification, removeQualification } from "@/lib/portal";
import { QUALIFICATIONS } from "@/lib/constants";

const YEARS = Array.from({ length: 2026 - 1964 }, (_, i) => String(2026 - i));

export default function EducationPage() {
  return (
    <PortalShell title="Educational Credentials">
      <EducationBody />
    </PortalShell>
  );
}

function EducationBody() {
  const { account, setAccount } = useAccount();
  const [form, setForm] = useState({ degreeType: "", fieldOfStudy: "", institution: "", year: "", certificateName: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);

  if (!account) return null;

  async function save() {
    const errs: Record<string, string> = {};
    if (!form.degreeType) errs.degreeType = "Required";
    if (!form.fieldOfStudy.trim()) errs.fieldOfStudy = "Required";
    if (!form.institution.trim()) errs.institution = "Required";
    if (!form.year) errs.year = "Required";
    setErrors(errs);
    if (Object.keys(errs).length || !account) return;
    setBusy(true);
    const updated = await addQualification(account.id, form);
    setBusy(false);
    if (updated) {
      setAccount(updated);
      setForm({ degreeType: "", fieldOfStudy: "", institution: "", year: "", certificateName: "" });
      setOpen(false);
    }
  }

  async function remove(id: string) {
    if (!account || !window.confirm("Remove this qualification?")) return;
    setBusy(true);
    const updated = await removeQualification(account.id, id);
    setBusy(false);
    if (updated) setAccount(updated);
  }

  return (
    <div className="grid items-start gap-5 xl:grid-cols-[380px_1fr]">
      {/* Add qualification */}
      <div className="card p-5">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-bold text-brand-950">
            <GraduationCap className="h-4 w-4 text-brand-600" /> Add Qualification
          </h3>
          {!open && (
            <button type="button" onClick={() => setOpen(true)} className="btn-ghost px-2.5 py-1.5 text-xs">
              <Plus className="h-3.5 w-3.5" /> New
            </button>
          )}
        </div>
        {open ? (
          <div className="mt-4 space-y-4 animate-fade-up">
            <Field label="Degree Type" name="degreeType" required error={errors.degreeType}>
              <SelectInput id="degreeType" value={form.degreeType} onChange={(e) => setForm({ ...form, degreeType: e.target.value })} invalid={!!errors.degreeType} placeholder="Select degree type">
                {QUALIFICATIONS.map((q) => <option key={q} value={q}>{q}</option>)}
              </SelectInput>
            </Field>
            <Field label="Field of Study" name="fieldOfStudy" required error={errors.fieldOfStudy}>
              <TextInput id="fieldOfStudy" value={form.fieldOfStudy} onChange={(e) => setForm({ ...form, fieldOfStudy: e.target.value })} invalid={!!errors.fieldOfStudy} placeholder="e.g. Pharmacy" />
            </Field>
            <Field label="Institution" name="institution" required error={errors.institution}>
              <TextInput id="institution" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} invalid={!!errors.institution} placeholder="Enter institution name" />
            </Field>
            <Field label="Year" name="year" required error={errors.year}>
              <SelectInput id="year" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} invalid={!!errors.year} placeholder="Select year">
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </SelectInput>
            </Field>
            <Field label="Certificate file name" name="certificateName" hint="optional — e.g. bpharm.pdf">
              <TextInput id="certificateName" value={form.certificateName} onChange={(e) => setForm({ ...form, certificateName: e.target.value })} placeholder="certificate.pdf" />
            </Field>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={save} disabled={busy} className="btn-primary flex-1">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save
              </button>
              <button type="button" onClick={() => setOpen(false)} className="btn-outline">Cancel</button>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            Record each pharmacy-related qualification. Attach the matching certificate on the{" "}
            <strong className="text-slate-700">Documents</strong> page — LPB verification compares the two.
          </p>
        )}
      </div>

      {/* List */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h3 className="font-bold text-brand-950">My Qualifications</h3>
            <p className="text-xs text-slate-400">{account.qualifications.length} on record</p>
          </div>
        </div>
        {account.qualifications.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-slate-400">
            No qualifications yet — add your pharmacy degree to continue.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {account.qualifications.map((q) => (
              <li key={q.id} className="flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50/60">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-800">{q.degreeType}</p>
                  <p className="truncate text-xs text-slate-500">
                    {q.fieldOfStudy} · {q.institution} · {q.year}
                  </p>
                  {q.certificateName && (
                    <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-brand-600">
                      <FileText className="h-3 w-3" /> {q.certificateName}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => remove(q.id)}
                  disabled={busy}
                  aria-label="Remove qualification"
                  className="rounded-lg p-2 text-slate-300 transition hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
