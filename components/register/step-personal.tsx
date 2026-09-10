"use client";

import { Field, TextInput, SelectInput } from "@/components/ui/field";
import { TITLES, GENDERS, MARITAL_STATUS, NATIONALITIES, LIBERIA_COUNTIES } from "@/lib/constants";
import type { PersonalInfo } from "@/lib/types";
import type { FieldErrors } from "@/lib/types";

export type StepComponentProps<T> = {
  values: Partial<T>;
  errors: FieldErrors;
  onChange: (patch: Partial<T>) => void;
};

export function StepPersonal({ values, errors, onChange }: StepComponentProps<PersonalInfo>) {
  const err = (k: keyof PersonalInfo) => errors[`personal.${k}`];
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="Title" name="title" required error={err("title")}>
        <SelectInput id="title" value={values.title ?? ""} onChange={(e) => onChange({ title: e.target.value })} invalid={!!err("title")} placeholder="Select title">
          {TITLES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </SelectInput>
      </Field>
      <Field label="Surname / Family name" name="surname" required error={err("surname")}>
        <TextInput id="surname" value={values.surname ?? ""} onChange={(e) => onChange({ surname: e.target.value })} invalid={!!err("surname")} placeholder="e.g. Kollie" autoComplete="family-name" />
      </Field>
      <Field label="First name" name="firstName" required error={err("firstName")}>
        <TextInput id="firstName" value={values.firstName ?? ""} onChange={(e) => onChange({ firstName: e.target.value })} invalid={!!err("firstName")} placeholder="e.g. Musu" autoComplete="given-name" />
      </Field>
      <Field label="Middle name" name="middleName" hint="optional" error={err("middleName")}>
        <TextInput id="middleName" value={values.middleName ?? ""} onChange={(e) => onChange({ middleName: e.target.value })} placeholder="e.g. T." autoComplete="additional-name" />
      </Field>
      <Field label="Date of birth" name="dob" required error={err("dob")}>
        <TextInput id="dob" type="date" value={values.dob ?? ""} onChange={(e) => onChange({ dob: e.target.value })} invalid={!!err("dob")} max="2008-01-01" min="1926-01-01" />
      </Field>
      <Field label="Gender" name="gender" required error={err("gender")}>
        <SelectInput id="gender" value={values.gender ?? ""} onChange={(e) => onChange({ gender: e.target.value })} invalid={!!err("gender")} placeholder="Select gender">
          {GENDERS.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </SelectInput>
      </Field>
      <Field label="Nationality" name="nationality" required error={err("nationality")}>
        <SelectInput id="nationality" value={values.nationality ?? ""} onChange={(e) => onChange({ nationality: e.target.value })} invalid={!!err("nationality")} placeholder="Select nationality">
          {NATIONALITIES.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </SelectInput>
      </Field>
      <Field label="County of origin" name="countyOfOrigin" required hint="Liberian county, or “Foreign” if born abroad" error={err("countyOfOrigin")}>
        <SelectInput id="countyOfOrigin" value={values.countyOfOrigin ?? ""} onChange={(e) => onChange({ countyOfOrigin: e.target.value })} invalid={!!err("countyOfOrigin")} placeholder="Select county of origin">
          {LIBERIA_COUNTIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
          <option value="Foreign">Foreign / outside Liberia</option>
        </SelectInput>
      </Field>
      <Field label="National ID or passport number" name="nationalId" required error={err("nationalId")}>
        <TextInput id="nationalId" value={values.nationalId ?? ""} onChange={(e) => onChange({ nationalId: e.target.value })} invalid={!!err("nationalId")} placeholder="e.g. LR-NID-40213" />
      </Field>
      <Field label="Marital status" name="maritalStatus" required error={err("maritalStatus")}>
        <SelectInput id="maritalStatus" value={values.maritalStatus ?? ""} onChange={(e) => onChange({ maritalStatus: e.target.value })} invalid={!!err("maritalStatus")} placeholder="Select status">
          {MARITAL_STATUS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </SelectInput>
      </Field>
    </div>
  );
}
