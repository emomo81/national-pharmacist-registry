"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ArrowLeft, ArrowRight, Loader2, RotateCcw, Pencil } from "lucide-react";
import { PortalShell } from "@/components/portal/shell";
import { useAccount } from "@/components/portal/use-account";
import { Field, TextInput, SelectInput } from "@/components/ui/field";
import {
  TITLES,
  GENDERS,
  MARITAL_STATUS,
  NATIONALITIES,
  LIBERIA_COUNTIES,
  LICENSE_CATEGORIES,
  COUNTRIES_COMMON,
} from "@/lib/constants";
import { updatePersonal, updateContact, updateLicensure, getProgress } from "@/lib/portal";
import type { PortalPersonal, PortalContact, PortalLicensure } from "@/lib/portal-types";
import { cn, formatDate } from "@/lib/utils";

const TABS = [
  { id: 0, label: "Personal Info", short: "Personal" },
  { id: 1, label: "Contact Info", short: "Contact" },
  { id: 2, label: "Registration", short: "Registration" },
  { id: 3, label: "Review & Submit", short: "Review" },
];

interface FormState {
  personal: Partial<PortalPersonal>;
  contact: Partial<PortalContact>;
  licensure: Partial<PortalLicensure>;
}

export default function ProfilePage() {
  return (
    <PortalShell title="My Profile">
      <ProfileBody />
    </PortalShell>
  );
}

function ProfileBody() {
  const router = useRouter();
  const { account, setAccount } = useAccount();
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState<FormState>({ personal: {}, contact: {}, licensure: {} });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (account) {
      setForm({ personal: account.personal, contact: account.contact, licensure: account.licensure });
    }
  }, [account?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!account) return null;

  const patch = <K extends keyof FormState>(section: K, p: Partial<FormState[K]>) => {
    setForm((f) => ({ ...f, [section]: { ...f[section], ...p } }));
    setErrors((errs) => {
      const next = { ...errs };
      Object.keys(next).forEach((k) => {
        if (k.startsWith(`${section}.`) && Object.prototype.hasOwnProperty.call(p, k.split(".")[1])) delete next[k];
      });
      return next;
    });
  };

  const require = (section: keyof FormState, keys: string[]): boolean => {
    const next: Record<string, string> = {};
    const src = form[section] as Record<string, unknown>;
    keys.forEach((k) => {
      if (!src[k] || !String(src[k]).trim()) next[`${section}.${k}`] = "Required";
    });
    setErrors((errs) => {
      const cleared = { ...errs };
      Object.keys(cleared).forEach((k) => {
        if (k.startsWith(`${section}.`)) delete cleared[k];
      });
      return { ...cleared, ...next };
    });
    return Object.keys(next).length === 0;
  };

  const validateTab = (t: number): boolean => {
    if (t === 0)
      return require("personal", ["title", "surname", "firstName", "dob", "gender", "countryOfBirth", "cityOfBirth", "nationality", "nationalId", "maritalStatus"]);
    if (t === 1) return require("contact", ["email", "phone", "address", "city", "district", "county"]);
    if (t === 2) return require("licensure", ["lpbNumber", "category", "initialRegistrationYear", "licenseExpiry"]);
    return true;
  };

  async function saveAndGo(target: number) {
    if (!account) return;
    if (!validateTab(tab)) return;
    setSaving(true);
    let updated = account;
    if (tab === 0) updated = (await updatePersonal(account.id, form.personal)) ?? updated;
    if (tab === 1) updated = (await updateContact(account.id, form.contact)) ?? updated;
    if (tab === 2) updated = (await updateLicensure(account.id, form.licensure)) ?? updated;
    setAccount(updated);
    setSaving(false);
    setTab(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const err = (key: string) => errors[key];
  const p = form.personal;
  const c = form.contact;
  const l = form.licensure;

  return (
    <div className="space-y-6">
      {/* Tab pills */}
      <ol className="flex flex-wrap gap-2">
        {TABS.map((t, i) => (
          <li key={t.id}>
            <button
              type="button"
              onClick={() => (i <= tab ? setTab(i) : saveAndGo(i))}
              className={cn(
                "flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition",
                i === tab
                  ? "border-brand-700 bg-brand-800 text-white shadow"
                  : i < tab
                    ? "border-accent-200 bg-accent-50 text-accent-800"
                    : "border-slate-200 bg-white text-slate-400"
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-[10px]",
                  i === tab ? "bg-white/20 text-white" : i < tab ? "bg-accent-500 text-white" : "bg-slate-100 text-slate-400"
                )}
              >
                {i < tab ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              {t.label}
            </button>
          </li>
        ))}
      </ol>

      <div className="card p-5 sm:p-7">
        {tab === 0 && (
          <div className="animate-fade-up space-y-8">
            <section>
              <h3 className="border-b border-slate-100 pb-3 text-sm font-extrabold uppercase tracking-wider text-brand-800">
                A · Full legal name
              </h3>
              <div className="mt-5 grid gap-5 sm:grid-cols-3">
                <Field label="Title" name="title" required error={err("personal.title")}>
                  <SelectInput id="title" value={p.title ?? ""} onChange={(e) => patch("personal", { title: e.target.value })} invalid={!!err("personal.title")} placeholder="Select">
                    {TITLES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </SelectInput>
                </Field>
                <Field label="Surname / Family Name" name="surname" required error={err("personal.surname")}>
                  <TextInput id="surname" value={p.surname ?? ""} onChange={(e) => patch("personal", { surname: e.target.value })} invalid={!!err("personal.surname")} placeholder="Enter surname" />
                </Field>
                <Field label="First Name" name="firstName" required error={err("personal.firstName")}>
                  <TextInput id="firstName" value={p.firstName ?? ""} onChange={(e) => patch("personal", { firstName: e.target.value })} invalid={!!err("personal.firstName")} placeholder="Enter first name" />
                </Field>
                <Field label="Middle Name" name="middleName" error={err("personal.middleName")}>
                  <TextInput id="middleName" value={p.middleName ?? ""} onChange={(e) => patch("personal", { middleName: e.target.value })} placeholder="Enter middle name" />
                </Field>
                <Field label="Previous / Maiden Name" name="maidenName" hint="if applicable" error={err("personal.maidenName")}>
                  <TextInput id="maidenName" value={p.maidenName ?? ""} onChange={(e) => patch("personal", { maidenName: e.target.value })} placeholder="Enter previous name" />
                </Field>
                <Field label="Preferred Name" name="preferredName" error={err("personal.preferredName")}>
                  <TextInput id="preferredName" value={p.preferredName ?? ""} onChange={(e) => patch("personal", { preferredName: e.target.value })} placeholder="Enter preferred name" />
                </Field>
              </div>
            </section>

            <section>
              <h3 className="border-b border-slate-100 pb-3 text-sm font-extrabold uppercase tracking-wider text-brand-800">
                B · Date and place of birth
              </h3>
              <div className="mt-5 grid gap-5 sm:grid-cols-3">
                <Field label="Date of Birth" name="dob" required error={err("personal.dob")}>
                  <TextInput id="dob" type="date" value={p.dob ?? ""} onChange={(e) => patch("personal", { dob: e.target.value })} invalid={!!err("personal.dob")} min="1926-01-01" max="2008-12-31" />
                </Field>
                <Field label="Country of Birth" name="countryOfBirth" required error={err("personal.countryOfBirth")}>
                  <SelectInput id="countryOfBirth" value={p.countryOfBirth ?? ""} onChange={(e) => patch("personal", { countryOfBirth: e.target.value })} invalid={!!err("personal.countryOfBirth")} placeholder="Select country">
                    {COUNTRIES_COMMON.map((ct) => <option key={ct} value={ct}>{ct}</option>)}
                  </SelectInput>
                </Field>
                <Field label="City / Town of Birth" name="cityOfBirth" required error={err("personal.cityOfBirth")}>
                  <TextInput id="cityOfBirth" value={p.cityOfBirth ?? ""} onChange={(e) => patch("personal", { cityOfBirth: e.target.value })} invalid={!!err("personal.cityOfBirth")} placeholder="Enter city/town" />
                </Field>
              </div>
            </section>

            <section>
              <h3 className="border-b border-slate-100 pb-3 text-sm font-extrabold uppercase tracking-wider text-brand-800">
                C · Identity &amp; status
              </h3>
              <div className="mt-5 grid gap-5 sm:grid-cols-3">
                <Field label="Gender" name="gender" required error={err("personal.gender")}>
                  <SelectInput id="gender" value={p.gender ?? ""} onChange={(e) => patch("personal", { gender: e.target.value })} invalid={!!err("personal.gender")} placeholder="Select">
                    {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                  </SelectInput>
                </Field>
                <Field label="Nationality" name="nationality" required error={err("personal.nationality")}>
                  <SelectInput id="nationality" value={p.nationality ?? ""} onChange={(e) => patch("personal", { nationality: e.target.value })} invalid={!!err("personal.nationality")} placeholder="Select">
                    {NATIONALITIES.map((n) => <option key={n} value={n}>{n}</option>)}
                  </SelectInput>
                </Field>
                <Field label="Marital Status" name="maritalStatus" required error={err("personal.maritalStatus")}>
                  <SelectInput id="maritalStatus" value={p.maritalStatus ?? ""} onChange={(e) => patch("personal", { maritalStatus: e.target.value })} invalid={!!err("personal.maritalStatus")} placeholder="Select">
                    {MARITAL_STATUS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </SelectInput>
                </Field>
                <Field label="National ID or Passport No." name="nationalId" required className="sm:col-span-2" error={err("personal.nationalId")}>
                  <TextInput id="nationalId" value={p.nationalId ?? ""} onChange={(e) => patch("personal", { nationalId: e.target.value })} invalid={!!err("personal.nationalId")} placeholder="e.g. LR-NID-44081" />
                </Field>
              </div>
            </section>
          </div>
        )}

        {tab === 1 && (
          <div className="animate-fade-up grid gap-5 sm:grid-cols-2">
            <Field label="Email Address" name="email" required error={err("contact.email")}>
              <TextInput id="email" type="email" value={c.email ?? ""} onChange={(e) => patch("contact", { email: e.target.value })} invalid={!!err("contact.email")} placeholder="you@example.com" />
            </Field>
            <Field label="Phone Number" name="phone" required error={err("contact.phone")}>
              <TextInput id="phone" type="tel" value={c.phone ?? ""} onChange={(e) => patch("contact", { phone: e.target.value })} invalid={!!err("contact.phone")} placeholder="+231 77 123 4567" />
            </Field>
            <Field label="Alternative Phone" name="altPhone" hint="optional" error={err("contact.altPhone")}>
              <TextInput id="altPhone" type="tel" value={c.altPhone ?? ""} onChange={(e) => patch("contact", { altPhone: e.target.value })} placeholder="+231 88 123 4567" />
            </Field>
            <Field label="Residential Address" name="address" required error={err("contact.address")}>
              <TextInput id="address" value={c.address ?? ""} onChange={(e) => patch("contact", { address: e.target.value })} invalid={!!err("contact.address")} placeholder="Street / community address" />
            </Field>
            <Field label="City / Town" name="city" required error={err("contact.city")}>
              <TextInput id="city" value={c.city ?? ""} onChange={(e) => patch("contact", { city: e.target.value })} invalid={!!err("contact.city")} placeholder="e.g. Paynesville" />
            </Field>
            <Field label="District" name="district" required error={err("contact.district")}>
              <TextInput id="district" value={c.district ?? ""} onChange={(e) => patch("contact", { district: e.target.value })} invalid={!!err("contact.district")} placeholder="e.g. Greater Monrovia" />
            </Field>
            <Field label="County of Residence" name="county" required error={err("contact.county")}>
              <SelectInput id="county" value={c.county ?? ""} onChange={(e) => patch("contact", { county: e.target.value })} invalid={!!err("contact.county")} placeholder="Select county">
                {LIBERIA_COUNTIES.map((ct) => <option key={ct} value={ct}>{ct}</option>)}
              </SelectInput>
            </Field>
          </div>
        )}

        {tab === 2 && (
          <div className="animate-fade-up">
            <p className="mb-6 rounded-xl border border-brand-100 bg-brand-50/60 px-4 py-3 text-sm text-brand-900">
              Enter your registration details exactly as they appear on your LPB license certificate.
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="LPB Registration / License Number" name="lpbNumber" required error={err("licensure.lpbNumber")}>
                <TextInput id="lpbNumber" value={l.lpbNumber ?? ""} onChange={(e) => patch("licensure", { lpbNumber: e.target.value })} invalid={!!err("licensure.lpbNumber")} placeholder="e.g. RPh-0338" />
              </Field>
              <Field label="License Category" name="category" required error={err("licensure.category")}>
                <SelectInput id="category" value={l.category ?? ""} onChange={(e) => patch("licensure", { category: e.target.value })} invalid={!!err("licensure.category")} placeholder="Select category">
                  {LICENSE_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </SelectInput>
              </Field>
              <Field label="Year of Initial LPB Registration" name="initialRegistrationYear" required error={err("licensure.initialRegistrationYear")}>
                <TextInput id="initialRegistrationYear" inputMode="numeric" value={l.initialRegistrationYear ?? ""} onChange={(e) => patch("licensure", { initialRegistrationYear: e.target.value })} invalid={!!err("licensure.initialRegistrationYear")} placeholder="e.g. 2017" />
              </Field>
              <Field label="Current License Expiry Date" name="licenseExpiry" required error={err("licensure.licenseExpiry")}>
                <TextInput id="licenseExpiry" type="date" value={l.licenseExpiry ?? ""} onChange={(e) => patch("licensure", { licenseExpiry: e.target.value })} invalid={!!err("licensure.licenseExpiry")} />
              </Field>
              <div className="sm:col-span-2 flex flex-wrap gap-3">
                <p className="w-full text-[13px] font-semibold text-slate-700">
                  Are you registered as a pharmacist in any other country? <span className="text-red-500">*</span>
                </p>
                {[{ v: true, label: "Yes" }, { v: false, label: "No" }].map((opt) => (
                  <button
                    key={String(opt.v)}
                    type="button"
                    onClick={() => patch("licensure", { registeredElsewhere: opt.v, ...(opt.v ? {} : { otherCountries: "" }) })}
                    className={cn(
                      "rounded-lg border px-5 py-2.5 text-sm font-semibold transition",
                      (l.registeredElsewhere ?? false) === opt.v
                        ? "border-brand-700 bg-brand-800 text-white"
                        : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {l.registeredElsewhere && (
                <Field label="Which countries?" name="otherCountries" required error={err("licensure.otherCountries")}>
                  <TextInput id="otherCountries" value={l.otherCountries ?? ""} onChange={(e) => patch("licensure", { otherCountries: e.target.value })} placeholder="e.g. Ghana, United States" />
                </Field>
              )}
              <div className="sm:col-span-2 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={l.inGoodStanding === true}
                    onChange={(e) => patch("licensure", { inGoodStanding: e.target.checked })}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-700 focus:ring-brand-500"
                  />
                  <span className="text-sm text-slate-700">
                    <span className="font-semibold text-slate-900">Declaration of standing.</span> My license has
                    never been suspended or revoked and I am not the subject of any disciplinary proceeding before
                    the Liberia Pharmacy Board or another regulator.
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {tab === 3 && (
          <div className="animate-fade-up">
            <ReviewTab form={form} onEdit={setTab} progress={getProgress(account)} onContinue={() => router.push("/portal/submit")} />
          </div>
        )}

        {tab < 3 && (
          <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={() => setTab(Math.max(tab - 1, 0))}
              disabled={tab === 0 || saving}
              className={cn("btn-outline", tab === 0 && "invisible")}
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={() => {
                  if (account) setForm({ personal: account.personal, contact: account.contact, licensure: account.licensure });
                }}
                className="btn-ghost text-xs text-slate-400"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Discard changes
              </button>
              <button type="button" disabled={saving} onClick={() => saveAndGo(Math.min(tab + 1, 3))} className="btn-primary px-6">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {saving ? "Saving…" : tab === 2 ? "Save & Review" : "Next"}
                {!saving && <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}

function ReviewTab({
  form,
  onEdit,
  progress,
  onContinue,
}: {
  form: FormState;
  onEdit: (tab: number) => void;
  progress: ReturnType<typeof getProgress>;
  onContinue: () => void;
}) {
  const p = form.personal;
  const c = form.contact;
  const l = form.licensure;
  const section = (title: string, tab: number, rows: Array<[string, string | undefined | boolean]>) => (
    <section className="overflow-hidden rounded-xl border border-slate-200">
      <header className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-5 py-3">
        <h3 className="text-sm font-bold text-brand-900">{title}</h3>
        <button type="button" onClick={() => onEdit(tab)} className="btn-ghost px-2.5 py-1.5 text-xs">
          <Pencil className="h-3.5 w-3.5" /> Edit
        </button>
      </header>
      <dl className="divide-y divide-slate-100">
        {rows.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[40%_60%] gap-2 px-5 py-2.5">
            <dt className="pt-0.5 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
            <dd className="break-words text-sm font-medium text-slate-800">
              {typeof value === "boolean" ? (value ? "Yes" : "No") : value && value.trim() ? value : "—"}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );

  return (
    <div className="space-y-5">
      {section("Personal information", 0, [
        ["Full name", [p.title, p.firstName, p.middleName, p.surname].filter(Boolean).join(" ")],
        ["Preferred name", p.preferredName],
        ["Previous / maiden", p.maidenName],
        ["Date of birth", formatDate(p.dob)],
        ["Born", [p.cityOfBirth, p.countryOfBirth].filter(Boolean).join(", ")],
        ["Gender", p.gender],
        ["Nationality", p.nationality],
        ["Marital status", p.maritalStatus],
        ["National ID / Passport", p.nationalId],
      ])}
      {section("Contact details", 1, [
        ["Email", c.email],
        ["Phone", c.phone],
        ["Alt. phone", c.altPhone],
        ["Address", c.address],
        ["City / District / County", [c.city, c.district, c.county].filter(Boolean).join(" · ")],
      ])}
      {section("LPB registration", 2, [
        ["LPB number", l.lpbNumber],
        ["Category", l.category],
        ["Initial registration", l.initialRegistrationYear],
        ["License expiry", formatDate(l.licenseExpiry)],
        ["Registered abroad", l.registeredElsewhere ? `Yes — ${l.otherCountries ?? ""}` : "No"],
        ["Good standing", Boolean(l.inGoodStanding)],
      ])}

      <div className="rounded-xl border border-brand-100 bg-brand-50/50 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-brand-950">
              Registration progress: <span className="text-accent-600">{progress.progressPct}%</span>
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              {progress.progressPct < 100
                ? "Add qualifications and required documents to reach 100% and submit."
                : "Everything is in place — you may submit your application."}
            </p>
          </div>
          <button type="button" onClick={onContinue} className="btn-accent">
            Continue to submission <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
