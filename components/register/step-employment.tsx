"use client";

import { Field, TextInput, SelectInput } from "@/components/ui/field";
import { EMPLOYMENT_STATUS, SECTORS, FACILITY_TYPES, LIBERIA_COUNTIES } from "@/lib/constants";
import type { EmploymentInfo, FieldErrors } from "@/lib/types";
import type { StepComponentProps } from "./step-personal";
import { Info } from "lucide-react";

export function StepEmployment({ values, errors, onChange }: StepComponentProps<EmploymentInfo> & { errors: FieldErrors }) {
  const err = (k: keyof EmploymentInfo) => errors[`employment.${k}`];
  const working = values.status === "Employed" || values.status === "Self-employed";
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="Current employment status" name="status" required error={err("status")}>
        <SelectInput
          id="status"
          value={values.status ?? ""}
          onChange={(e) => {
            const status = e.target.value;
            const stillWorking = status === "Employed" || status === "Self-employed";
            onChange({
              status,
              ...(stillWorking ? {} : { sector: "Not currently practicing", facilityName: "", facilityType: "", position: "", county: "", district: "" }),
            });
          }}
          invalid={!!err("status")}
          placeholder="Select status"
        >
          {EMPLOYMENT_STATUS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </SelectInput>
      </Field>
      <Field label="Total years of pharmacy experience" name="yearsOfExperience" required error={err("yearsOfExperience")}>
        <TextInput id="yearsOfExperience" inputMode="numeric" value={values.yearsOfExperience ?? ""} onChange={(e) => onChange({ yearsOfExperience: e.target.value })} invalid={!!err("yearsOfExperience")} placeholder="e.g. 8" />
      </Field>

      {!working && values.status && (
        <div className="sm:col-span-2 flex items-start gap-3 rounded-xl border border-sky-200 bg-sky-50 p-4">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
          <p className="text-sm text-sky-800">
            No problem — the census counts every pharmacist, practicing or not. Facility details are not required
            for your current status; you can continue to the next step.
          </p>
        </div>
      )}

      {working && (
        <>
          <Field label="Primary practice sector" name="sector" required className="sm:col-span-2" error={err("sector")}>
            <SelectInput id="sector" value={values.sector ?? ""} onChange={(e) => onChange({ sector: e.target.value })} invalid={!!err("sector")} placeholder="Select sector">
              {SECTORS.filter((s) => s !== "Not currently practicing").map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </SelectInput>
          </Field>
          <Field label="Facility / employer name" name="facilityName" required error={err("facilityName")}>
            <TextInput id="facilityName" value={values.facilityName ?? ""} onChange={(e) => onChange({ facilityName: e.target.value })} invalid={!!err("facilityName")} placeholder="e.g. JFK Medical Center" />
          </Field>
          <Field label="Facility type" name="facilityType" required error={err("facilityType")}>
            <SelectInput id="facilityType" value={values.facilityType ?? ""} onChange={(e) => onChange({ facilityType: e.target.value })} invalid={!!err("facilityType")} placeholder="Select facility type">
              {FACILITY_TYPES.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </SelectInput>
          </Field>
          <Field label="Position / job title" name="position" required error={err("position")}>
            <TextInput id="position" value={values.position ?? ""} onChange={(e) => onChange({ position: e.target.value })} invalid={!!err("position")} placeholder="e.g. Staff Pharmacist" />
          </Field>
          <Field label="County of practice" name="county" required error={err("county")}>
            <SelectInput id="county" value={values.county ?? ""} onChange={(e) => onChange({ county: e.target.value })} invalid={!!err("county")} placeholder="Select county">
              {LIBERIA_COUNTIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </SelectInput>
          </Field>
          <Field label="District of practice" name="district" hint="optional" error={err("district")}>
            <TextInput id="district" value={values.district ?? ""} onChange={(e) => onChange({ district: e.target.value })} placeholder="e.g. Paynesville" />
          </Field>
        </>
      )}
    </div>
  );
}
