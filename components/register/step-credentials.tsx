"use client";

import { FileUpload } from "./file-upload";
import type { RegistryDocuments, FieldErrors } from "@/lib/types";
import { ShieldCheck } from "lucide-react";

interface StepCredentialsProps {
  values: RegistryDocuments;
  licenseCategory?: string;
  errors: FieldErrors;
  onChange: (patch: Partial<RegistryDocuments>) => void;
}

export function StepCredentials({ values, licenseCategory, errors, onChange }: StepCredentialsProps) {
  const err = (k: keyof RegistryDocuments) => errors[`documents.${k}`];
  const isIntern = licenseCategory === "Provisional (Intern) Pharmacist";
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-xl border border-brand-200 bg-brand-50 p-4">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
        <p className="text-sm text-brand-900">
          Upload clear, legible scans or photos. LPB verification officers compare these against your form
          entries — blurred or mismatched documents will delay verification.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <FileUpload
          label="Passport-size photograph"
          description="recent, plain background"
          required
          imagesOnly
          doc={values.passportPhoto}
          onChange={(d) => onChange({ passportPhoto: d })}
          error={err("passportPhoto")}
        />
        <FileUpload
          label="Pharmacy degree / diploma certificate"
          description="highest qualification"
          required
          doc={values.degreeCertificate}
          onChange={(d) => onChange({ degreeCertificate: d })}
          error={err("degreeCertificate")}
        />
        <FileUpload
          label="Current LPB license certificate"
          description={isIntern ? "intern permit accepted" : "must match the number entered"}
          required={!isIntern}
          doc={values.lpbLicense}
          onChange={(d) => onChange({ lpbLicense: d })}
          error={err("lpbLicense")}
        />
        <FileUpload
          label="National ID or passport bio page"
          description="government-issued ID"
          required
          doc={values.nationalIdDoc}
          onChange={(d) => onChange({ nationalIdDoc: d })}
          error={err("nationalIdDoc")}
        />
        <div className="sm:col-span-2">
          <FileUpload
            label="Curriculum vitae"
            description="optional — recommended for senior cadres"
            doc={values.cv}
            onChange={(d) => onChange({ cv: d })}
            error={err("cv")}
          />
        </div>
      </div>
    </div>
  );
}
