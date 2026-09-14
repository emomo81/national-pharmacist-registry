"use client";

import { useState } from "react";
import { Award, Plus, Trash2, Loader2 } from "lucide-react";
import { PortalShell } from "@/components/portal/shell";
import { useAccount } from "@/components/portal/use-account";
import { Field, TextInput, SelectInput } from "@/components/ui/field";
import { addCpd, removeCpd } from "@/lib/portal";

const YEARS = Array.from({ length: 15 }, (_, i) => String(2026 - i));

export default function CpdPage() {
  return (
    <PortalShell title="CPD Training">
      <CpdBody />
    </PortalShell>
  );
}

function CpdBody() {
  const { account, setAccount } = useAccount();
  const [form, setForm] = useState({ title: "", provider: "", year: "", hours: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);

  if (!account) return null;

  const totalHours = account.cpd.reduce((sum, entry) => sum + (Number(entry.hours) || 0), 0);

  async function save() {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = "Required";
    if (!form.provider.trim()) errs.provider = "Required";
    if (!form.year) errs.year = "Required";
    if (!form.hours || Number(form.hours) <= 0) errs.hours = "Required";
    setErrors(errs);
    if (Object.keys(errs).length || !account) return;
    setBusy(true);
    const updated = await addCpd(account.id, form);
    setBusy(false);
    if (updated) {
      setAccount(updated);
      setForm({ title: "", provider: "", year: "", hours: "" });
      setOpen(false);
    }
  }

  async function remove(id: string) {
    if (!account || !window.confirm("Remove this CPD entry?")) return;
    setBusy(true);
    const updated = await removeCpd(account.id, id);
    setBusy(false);
    if (updated) setAccount(updated);
  }

  return (
    <div className="grid items-start gap-5 xl:grid-cols-[380px_1fr]">
      <div className="space-y-4">
        <div className="card flex items-center gap-4 p-5">
          <span className="flex h-12 w-12 items-center justify-center rounded-sm bg-accent-100 text-accent-700">
            <Award className="h-6 w-6" />
          </span>
          <div>
            <p className="text-2xl font-extrabold tracking-tight text-brand-950">{totalHours} hrs</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              CPD hours since {account.cpd.length ? Math.min(...account.cpd.map((x) => Number(x.year) || 2026)) : "registration"}
            </p>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-brand-950">Add CPD Entry</h3>
            {!open && (
              <button type="button" onClick={() => setOpen(true)} className="btn-ghost px-2.5 py-1.5 text-xs">
                <Plus className="h-3.5 w-3.5" /> New
              </button>
            )}
          </div>
          {open ? (
            <div className="mt-4 space-y-4">
              <Field label="Training title" name="title" required error={errors.title}>
                <TextInput id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} invalid={!!errors.title} placeholder="e.g. Antimicrobial Stewardship" />
              </Field>
              <Field label="Provider / Organizer" name="provider" required error={errors.provider}>
                <TextInput id="provider" value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })} invalid={!!errors.provider} placeholder="e.g. LPB CPD Unit" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Year" name="year" required error={errors.year}>
                  <SelectInput id="year" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} invalid={!!errors.year} placeholder="Year">
                    {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                  </SelectInput>
                </Field>
                <Field label="CPD hours" name="hours" required error={errors.hours}>
                  <TextInput id="hours" inputMode="numeric" value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} invalid={!!errors.hours} placeholder="e.g. 12" />
                </Field>
              </div>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={save} disabled={busy} className="btn-primary flex-1">
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save
                </button>
                <button type="button" onClick={() => setOpen(false)} className="btn-outline">Cancel</button>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Continuing Professional Development keeps your license strong: log courses, webinars and
              conferences here.
            </p>
          )}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="font-bold text-brand-950">CPD Record</h3>
          <p className="text-xs text-slate-400">{account.cpd.length} trainings logged</p>
        </div>
        {account.cpd.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-slate-400">No CPD trainings yet. Log your first course.</p>
        ) : (
          <ul className="divide-y divide-slate-200">
            {account.cpd.map((entry) => (
              <li key={entry.id} className="flex items-center gap-4 px-5 py-4 transition hover:bg-paper-100/60">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-accent-50 text-accent-700">
                  <Award className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-800">{entry.title}</p>
                  <p className="truncate text-xs text-slate-500">{entry.provider}</p>
                </div>
                <div className="text-right text-xs">
                  <p className="font-bold text-brand-900">{entry.hours} hrs</p>
                  <p className="text-slate-400">{entry.year}</p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(entry.id)}
                  disabled={busy}
                  aria-label="Remove CPD entry"
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
