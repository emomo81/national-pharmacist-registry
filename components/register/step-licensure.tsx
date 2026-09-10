"use client";

import { Field, TextInput, SelectInput } from "@/components/ui/field";
import { LICENSE_CATEGORIES } from "@/lib/constants";
import type { LicensureInfo, FieldErrors } from "@/lib/types";
import type { StepComponentProps } from "./step-personal";
import { cn } from "@/lib/utils";

export function StepLicensure({ values, errors, onChange }: StepComponentProps<LicensureInfo> & { errors: FieldErrors }) {
  const err = (k: keyof LicensureInfo) => errors[`licensure.${k}`];
  const elsewhere = values.registeredElsewhere === true;
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="LPB registration / license number" name="lpbNumber" required hint="as printed on your license" error={err("lpbNumber")}>
        <TextInput id="lpbNumber" value={values.lpbNumber ?? ""} onChange={(e) => onChange({ lpbNumber: e.target.value })} invalid={!!err("lpbNumber")} placeholder="e.g. RPh-0143" />
      </Field>
      <Field label="License category" name="category" required error={err("category")}>
        <SelectInput id="category" value={values.category ?? ""} onChange={(e) => onChange({ category: e.target.value })} invalid={!!err("category")} placeholder="Select category">
          {LICENSE_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </SelectInput>
      </Field>
      <Field label="Year of initial LPB registration" name="initialRegistrationYear" required error={err("initialRegistrationYear")}>
        <TextInput id="initialRegistrationYear" inputMode="numeric" value={values.initialRegistrationYear ?? ""} onChange={(e) => onChange({ initialRegistrationYear: e.target.value })} invalid={!!err("initialRegistrationYear")} placeholder="e.g. 2009" />
      </Field>
      <Field label="Current license expiry date" name="licenseExpiry" required error={err("licenseExpiry")}>
        <TextInput id="licenseExpiry" type="date" value={values.licenseExpiry ?? ""} onChange={(e) => onChange({ licenseExpiry: e.target.value })} invalid={!!err("licenseExpiry")} />
      </Field>

      <div className="sm:col-span-2">
        <p className="label">Are you registered as a pharmacist in any other country?<span className="ml-0.5 text-red-500">*</span></p>
        <div className="flex gap-3">
          {[
            { v: true, label: "Yes" },
            { v: false, label: "No" },
          ].map((opt) => (
            <button
              key={String(opt.v)}
              type="button"
              onClick={() => onChange({ registeredElsewhere: opt.v, ...(opt.v ? {} : { otherCountries: "" }) })}
              className={cn(
                "rounded-lg border px-5 py-2.5 text-sm font-semibold transition",
                values.registeredElsewhere === opt.v
                  ? "border-brand-600 bg-brand-700 text-white"
                  : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {elsewhere && (
        <Field label="Which countries?" name="otherCountries" required className="sm:col-span-2" error={err("otherCountries")}>
          <TextInput id="otherCountries" value={values.otherCountries ?? ""} onChange={(e) => onChange({ otherCountries: e.target.value })} invalid={!!err("otherCountries")} placeholder="e.g. Ghana, United States" />
        </Field>
      )}

      <div className="sm:col-span-2 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={values.inGoodStanding === true}
            onChange={(e) => onChange({ inGoodStanding: e.target.checked })}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-700 focus:ring-brand-500"
          />
          <span className="text-sm text-slate-700">
            <span className="font-semibold text-slate-900">Declaration of standing.</span> I declare that my license
            has never been suspended or revoked and that I am not currently the subject of any disciplinary
            proceeding before the Liberia Pharmacy Board or any other pharmacy regulator.
          </span>
        </label>
      </div>
    </div>
  );
}
