"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Loader2, Info } from "lucide-react";
import { Field, TextInput, SelectInput } from "@/components/ui/field";
import { createManualRegistration } from "@/lib/api";
import { getSession } from "@/lib/auth";
import {
  TITLES,
  GENDERS,
  QUALIFICATIONS,
  LICENSE_CATEGORIES,
  SECTORS,
  LIBERIA_COUNTIES,
  STATUS_META,
  type StatusKey,
} from "@/lib/constants";

interface FormState {
  title: string;
  firstName: string;
  surname: string;
  gender: string;
  email: string;
  phone: string;
  lpbNumber: string;
  category: string;
  highestQualification: string;
  initialRegistrationYear: string;
  licenseExpiry: string;
  sector: string;
  facilityName: string;
  position: string;
  county: string;
  status: StatusKey;
}

const EMPTY: FormState = {
  title: "",
  firstName: "",
  surname: "",
  gender: "",
  email: "",
  phone: "",
  lpbNumber: "",
  category: "",
  highestQualification: "",
  initialRegistrationYear: "",
  licenseExpiry: "",
  sector: "",
  facilityName: "",
  position: "",
  county: "",
  status: "verified",
};

const REQUIRED: Array<keyof FormState> = [
  "title", "firstName", "surname", "gender", "lpbNumber", "category", "highestQualification", "county",
];

export default function AddPharmacistPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const set = (k: keyof FormState, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => {
      if (!e[k]) return e;
      const next = { ...e };
      delete next[k];
      return next;
    });
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    REQUIRED.forEach((k) => {
      if (!form[k]) errs[k] = "Required";
    });
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Invalid email";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setBusy(true);
    const session = getSession();
    const actor = session ? `${session.name} (${session.role})` : "LPB Registrar";
    const record = await createManualRegistration({ ...form, by: actor });
    setBusy(false);
    router.push(`/admin/registry/${record.id}`);
  }

  const err = (k: keyof FormState) => errors[k];

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="card overflow-hidden">
        <div className="flex items-center gap-4 border-b border-slate-200 bg-brand-50/50 px-6 py-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-sm bg-brand-800 text-white">
            <UserPlus className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-brand-950">Register New Pharmacist</h2>
            <p className="text-xs text-slate-500">
              Manual entry by an LPB official, for paper forms captured at county outreach or the Board office.
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-7 px-6 py-6">
          <section>
            <h3 className="border-b border-slate-200 pb-2.5 text-sm font-extrabold uppercase tracking-wider text-brand-800">Identity</h3>
            <div className="mt-4 grid gap-5 sm:grid-cols-3">
              <Field label="Title" name="title" required error={err("title")}>
                <SelectInput id="title" value={form.title} onChange={(e) => set("title", e.target.value)} invalid={!!err("title")} placeholder="Select">
                  {TITLES.map((t) => <option key={t} value={t}>{t}</option>)}
                </SelectInput>
              </Field>
              <Field label="First name" name="firstName" required error={err("firstName")}>
                <TextInput id="firstName" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} invalid={!!err("firstName")} />
              </Field>
              <Field label="Surname" name="surname" required error={err("surname")}>
                <TextInput id="surname" value={form.surname} onChange={(e) => set("surname", e.target.value)} invalid={!!err("surname")} />
              </Field>
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-3">
              <Field label="Gender" name="gender" required error={err("gender")}>
                <SelectInput id="gender" value={form.gender} onChange={(e) => set("gender", e.target.value)} invalid={!!err("gender")} placeholder="Select">
                  {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                </SelectInput>
              </Field>
              <Field label="Email" name="email" hint="optional" error={err("email")}>
                <TextInput id="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} invalid={!!err("email")} />
              </Field>
              <Field label="Phone" name="phone" hint="optional" error={err("phone")}>
                <TextInput id="phone" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+231 77 …" />
              </Field>
            </div>
          </section>

          <section>
            <h3 className="border-b border-slate-200 pb-2.5 text-sm font-extrabold uppercase tracking-wider text-brand-800">Licensure &amp; qualification</h3>
            <div className="mt-4 grid gap-5 sm:grid-cols-3">
              <Field label="LPB number" name="lpbNumber" required error={err("lpbNumber")}>
                <TextInput id="lpbNumber" value={form.lpbNumber} onChange={(e) => set("lpbNumber", e.target.value)} invalid={!!err("lpbNumber")} placeholder="RPh-0000" />
              </Field>
              <Field label="Category" name="category" required error={err("category")}>
                <SelectInput id="category" value={form.category} onChange={(e) => set("category", e.target.value)} invalid={!!err("category")} placeholder="Select">
                  {LICENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </SelectInput>
              </Field>
              <Field label="Highest qualification" name="highestQualification" required error={err("highestQualification")}>
                <SelectInput id="highestQualification" value={form.highestQualification} onChange={(e) => set("highestQualification", e.target.value)} invalid={!!err("highestQualification")} placeholder="Select">
                  {QUALIFICATIONS.map((q) => <option key={q} value={q}>{q}</option>)}
                </SelectInput>
              </Field>
              <Field label="Initial registration year" name="initialRegistrationYear" hint="optional" error={err("initialRegistrationYear")}>
                <TextInput id="initialRegistrationYear" inputMode="numeric" value={form.initialRegistrationYear} onChange={(e) => set("initialRegistrationYear", e.target.value)} placeholder="e.g. 2015" />
              </Field>
              <Field label="License expiry" name="licenseExpiry" hint="optional" error={err("licenseExpiry")}>
                <TextInput id="licenseExpiry" type="date" value={form.licenseExpiry} onChange={(e) => set("licenseExpiry", e.target.value)} />
              </Field>
            </div>
          </section>

          <section>
            <h3 className="border-b border-slate-200 pb-2.5 text-sm font-extrabold uppercase tracking-wider text-brand-800">Practice</h3>
            <div className="mt-4 grid gap-5 sm:grid-cols-3">
              <Field label="County of practice" name="county" required error={err("county")}>
                <SelectInput id="county" value={form.county} onChange={(e) => set("county", e.target.value)} invalid={!!err("county")} placeholder="Select">
                  {LIBERIA_COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </SelectInput>
              </Field>
              <Field label="Sector" name="sector" hint="optional" error={err("sector")}>
                <SelectInput id="sector" value={form.sector} onChange={(e) => set("sector", e.target.value)} placeholder="Select">
                  {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
                </SelectInput>
              </Field>
              <Field label="Facility" name="facilityName" hint="optional" error={err("facilityName")}>
                <TextInput id="facilityName" value={form.facilityName} onChange={(e) => set("facilityName", e.target.value)} />
              </Field>
              <Field label="Position" name="position" hint="optional" error={err("position")}>
                <TextInput id="position" value={form.position} onChange={(e) => set("position", e.target.value)} />
              </Field>
              <Field label="Initial status" name="status" required error={err("status")}>
                <SelectInput id="status" value={form.status} onChange={(e) => set("status", e.target.value as StatusKey)}>
                  {(Object.keys(STATUS_META) as StatusKey[]).map((s) => (
                    <option key={s} value={s}>{STATUS_META[s].label}</option>
                  ))}
                </SelectInput>
              </Field>
            </div>
          </section>

          <p className="flex items-start gap-2 rounded-sm border border-slate-400 bg-paper-100 px-4 py-3 text-xs text-slate-700">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Records created here appear immediately in the Pharmacist Registry and all analytics. Attach scanned
            credentials later from the record page if needed.
          </p>

          <div className="flex justify-end gap-2 border-t border-slate-200 pt-5">
            <button type="button" onClick={() => setForm(EMPTY)} className="btn-outline">Clear form</button>
            <button type="submit" disabled={busy} className="btn-primary px-6">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
              {busy ? "Creating…" : "Create record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
