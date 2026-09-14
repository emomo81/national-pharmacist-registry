"use client";

import { useState } from "react";
import { Briefcase, Plus, Trash2, Loader2, MapPin } from "lucide-react";
import { PortalShell } from "@/components/portal/shell";
import { useAccount } from "@/components/portal/use-account";
import { Field, TextInput, SelectInput } from "@/components/ui/field";
import { addExperience, removeExperience } from "@/lib/portal";
import { SECTORS, LIBERIA_COUNTIES } from "@/lib/constants";

const YEARS = Array.from({ length: 2026 - 1964 }, (_, i) => String(2026 - i));

export default function ExperiencePage() {
  return (
    <PortalShell title="Professional Experience">
      <ExperienceBody />
    </PortalShell>
  );
}

function ExperienceBody() {
  const { account, setAccount } = useAccount();
  const [form, setForm] = useState({ role: "", facility: "", sector: "", county: "", from: "", to: "", current: true });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);

  if (!account) return null;

  async function save() {
    const errs: Record<string, string> = {};
    if (!form.role.trim()) errs.role = "Required";
    if (!form.facility.trim()) errs.facility = "Required";
    if (!form.sector) errs.sector = "Required";
    if (!form.county) errs.county = "Required";
    if (!form.from) errs.from = "Required";
    setErrors(errs);
    if (Object.keys(errs).length || !account) return;
    setBusy(true);
    const updated = await addExperience(account.id, { ...form, to: form.current ? undefined : form.to || undefined });
    setBusy(false);
    if (updated) {
      setAccount(updated);
      setForm({ role: "", facility: "", sector: "", county: "", from: "", to: "", current: true });
      setOpen(false);
    }
  }

  async function remove(id: string) {
    if (!account || !window.confirm("Remove this experience entry?")) return;
    setBusy(true);
    const updated = await removeExperience(account.id, id);
    setBusy(false);
    if (updated) setAccount(updated);
  }

  return (
    <div className="grid items-start gap-5 xl:grid-cols-[380px_1fr]">
      <div className="card p-5">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-bold text-brand-950">
            <Briefcase className="h-4 w-4 text-brand-600" /> Add Experience
          </h3>
          {!open && (
            <button type="button" onClick={() => setOpen(true)} className="btn-ghost px-2.5 py-1.5 text-xs">
              <Plus className="h-3.5 w-3.5" /> New
            </button>
          )}
        </div>
        {open ? (
          <div className="mt-4 space-y-4">
            <Field label="Position / Role" name="role" required error={errors.role}>
              <TextInput id="role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} invalid={!!errors.role} placeholder="e.g. Pharmacist-in-Charge" />
            </Field>
            <Field label="Facility / Employer" name="facility" required error={errors.facility}>
              <TextInput id="facility" value={form.facility} onChange={(e) => setForm({ ...form, facility: e.target.value })} invalid={!!errors.facility} placeholder="e.g. CareWell Pharmacy" />
            </Field>
            <Field label="Sector" name="sector" required error={errors.sector}>
              <SelectInput id="sector" value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })} invalid={!!errors.sector} placeholder="Select sector">
                {SECTORS.filter((s) => s !== "Not currently practicing").map((s) => <option key={s} value={s}>{s}</option>)}
              </SelectInput>
            </Field>
            <Field label="County" name="county" required error={errors.county}>
              <SelectInput id="county" value={form.county} onChange={(e) => setForm({ ...form, county: e.target.value })} invalid={!!errors.county} placeholder="Select county">
                {LIBERIA_COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </SelectInput>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="From (year)" name="from" required error={errors.from}>
                <SelectInput id="from" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} invalid={!!errors.from} placeholder="Year">
                  {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </SelectInput>
              </Field>
              <Field label="To (year)" name="to" hint="blank if current" error={errors.to}>
                <SelectInput id="to" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} disabled={form.current} placeholder="Year">
                  {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </SelectInput>
              </Field>
            </div>
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-700">
              <input type="checkbox" checked={form.current} onChange={(e) => setForm({ ...form, current: e.target.checked })} className="h-4 w-4 rounded border-slate-300 text-brand-700 focus:ring-brand-500" />
              I currently work here
            </label>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={save} disabled={busy} className="btn-primary flex-1">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save
              </button>
              <button type="button" onClick={() => setOpen(false)} className="btn-outline">Cancel</button>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            List your pharmacy employment history, starting with your current role. This feeds the census
            workforce distribution analysis.
          </p>
        )}
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="font-bold text-brand-950">Employment History</h3>
          <p className="text-xs text-slate-400">{account.experiences.length} on record</p>
        </div>
        {account.experiences.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-slate-400">
            No experience entries yet. Add your current or most recent role.
          </p>
        ) : (
          <ol className="relative divide-y divide-slate-200">
            {account.experiences.map((e) => (
              <li key={e.id} className="flex items-start gap-4 px-5 py-4 transition hover:bg-paper-100/60">
                <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-brand-50 text-brand-600">
                  <Briefcase className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-slate-800">{e.role}</p>
                    {e.current && <span className="chip bg-accent-100 text-accent-800">Current</span>}
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">{e.facility} · {e.sector}</p>
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                    <MapPin className="h-3 w-3" /> {e.county} · {e.from} to {e.current ? "present" : e.to ?? "unknown"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(e.id)}
                  disabled={busy}
                  aria-label="Remove experience"
                  className="rounded-lg p-2 text-slate-300 transition hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
