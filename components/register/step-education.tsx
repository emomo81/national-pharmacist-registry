"use client";

import { Field, TextInput, SelectInput, TextareaInput } from "@/components/ui/field";
import { QUALIFICATIONS, SPECIALIZATIONS, COUNTRIES_COMMON } from "@/lib/constants";
import type { EducationInfo, FieldErrors } from "@/lib/types";
import type { StepComponentProps } from "./step-personal";

export function StepEducation({ values, errors, onChange }: StepComponentProps<EducationInfo> & { errors: FieldErrors }) {
  const err = (k: keyof EducationInfo) => errors[`education.${k}`];
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="Highest pharmacy qualification" name="highestQualification" required error={err("highestQualification")}>
        <SelectInput id="highestQualification" value={values.highestQualification ?? ""} onChange={(e) => onChange({ highestQualification: e.target.value })} invalid={!!err("highestQualification")} placeholder="Select qualification">
          {QUALIFICATIONS.map((q) => (
            <option key={q} value={q}>{q}</option>
          ))}
        </SelectInput>
      </Field>
      <Field label="Training institution" name="institution" required error={err("institution")}>
        <TextInput id="institution" value={values.institution ?? ""} onChange={(e) => onChange({ institution: e.target.value })} invalid={!!err("institution")} placeholder="e.g. University of Liberia, School of Pharmacy" />
      </Field>
      <Field label="Country of training" name="countryOfTraining" required error={err("countryOfTraining")}>
        <SelectInput id="countryOfTraining" value={values.countryOfTraining ?? ""} onChange={(e) => onChange({ countryOfTraining: e.target.value })} invalid={!!err("countryOfTraining")} placeholder="Select country">
          {COUNTRIES_COMMON.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </SelectInput>
      </Field>
      <Field label="Year of graduation" name="graduationYear" required error={err("graduationYear")}>
        <TextInput id="graduationYear" inputMode="numeric" value={values.graduationYear ?? ""} onChange={(e) => onChange({ graduationYear: e.target.value })} invalid={!!err("graduationYear")} placeholder="e.g. 2014" />
      </Field>
      <Field label="Area of specialization" name="specialization" required error={err("specialization")}>
        <SelectInput id="specialization" value={values.specialization ?? ""} onChange={(e) => onChange({ specialization: e.target.value })} invalid={!!err("specialization")} placeholder="Select specialization">
          {SPECIALIZATIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </SelectInput>
      </Field>
      <Field label="Other qualifications" name="otherQualifications" hint="optional" className="sm:col-span-2" error={err("otherQualifications")}>
        <TextareaInput id="otherQualifications" value={values.otherQualifications ?? ""} onChange={(e) => onChange({ otherQualifications: e.target.value })} placeholder="List any additional diplomas, fellowships or certifications (with year)…" />
      </Field>
    </div>
  );
}
