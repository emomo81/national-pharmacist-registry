"use client";

import { Field, TextInput, SelectInput } from "@/components/ui/field";
import { LIBERIA_COUNTIES } from "@/lib/constants";
import type { ContactInfo, FieldErrors } from "@/lib/types";
import type { StepComponentProps } from "./step-personal";

export function StepContact({ values, errors, onChange }: StepComponentProps<ContactInfo> & { errors: FieldErrors }) {
  const err = (k: keyof ContactInfo) => errors[`contact.${k}`];
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="Email address" name="email" required hint="used for all census correspondence" error={err("email")}>
        <TextInput id="email" type="email" value={values.email ?? ""} onChange={(e) => onChange({ email: e.target.value })} invalid={!!err("email")} placeholder="you@example.com" autoComplete="email" />
      </Field>
      <Field label="Phone number" name="phone" required hint="include country code" error={err("phone")}>
        <TextInput id="phone" type="tel" value={values.phone ?? ""} onChange={(e) => onChange({ phone: e.target.value })} invalid={!!err("phone")} placeholder="+231 77 123 4567" autoComplete="tel" />
      </Field>
      <Field label="Alternative phone" name="altPhone" hint="optional" error={err("altPhone")}>
        <TextInput id="altPhone" type="tel" value={values.altPhone ?? ""} onChange={(e) => onChange({ altPhone: e.target.value })} invalid={!!err("altPhone")} placeholder="+231 88 123 4567" />
      </Field>
      <Field label="Residential address" name="address" required error={err("address")}>
        <TextInput id="address" value={values.address ?? ""} onChange={(e) => onChange({ address: e.target.value })} invalid={!!err("address")} placeholder="e.g. 12th Street, Sinkor" autoComplete="street-address" />
      </Field>
      <Field label="City / Town" name="city" required error={err("city")}>
        <TextInput id="city" value={values.city ?? ""} onChange={(e) => onChange({ city: e.target.value })} invalid={!!err("city")} placeholder="e.g. Monrovia" />
      </Field>
      <Field label="District" name="district" required error={err("district")}>
        <TextInput id="district" value={values.district ?? ""} onChange={(e) => onChange({ district: e.target.value })} invalid={!!err("district")} placeholder="e.g. Greater Monrovia" />
      </Field>
      <Field label="County of residence" name="county" required error={err("county")}>
        <SelectInput id="county" value={values.county ?? ""} onChange={(e) => onChange({ county: e.target.value })} invalid={!!err("county")} placeholder="Select county">
          {LIBERIA_COUNTIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </SelectInput>
      </Field>
    </div>
  );
}
