"use client";

import { Pencil, FileText, ImageIcon, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";
import type { RegistrationDraft, FieldErrors } from "@/lib/types";
import { STATUS_META } from "@/lib/constants";
import { formatDate, formatFileSize, cn } from "@/lib/utils";

interface StepReviewProps {
  draft: RegistrationDraft;
  errors: FieldErrors;
  onEdit: (stepIndex: number) => void;
  onDeclaration: (patch: Partial<RegistrationDraft["declaration"]>) => void;
}

function Row({ label, value }: { label: string; value?: string | boolean | null }) {
  const display =
    typeof value === "boolean" ? (value ? "Yes" : "No") : value && String(value).trim() ? String(value) : "—";
  return (
    <div className="grid grid-cols-[40%_60%] gap-2 px-5 py-2.5 sm:grid-cols-[32%_68%]">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400 pt-0.5">{label}</dt>
      <dd className="text-sm font-medium text-slate-800 break-words">{display}</dd>
    </div>
  );
}

function Section({
  title,
  stepIndex,
  onEdit,
  children,
}: {
  title: string;
  stepIndex: number;
  onEdit: (i: number) => void;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200">
      <header className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-5 py-3">
        <h3 className="text-sm font-bold text-brand-900">{title}</h3>
        <button type="button" onClick={() => onEdit(stepIndex)} className="btn-ghost px-2.5 py-1.5 text-xs no-print">
          <Pencil className="h-3.5 w-3.5" /> Edit
        </button>
      </header>
      <dl className="divide-y divide-slate-100">{children}</dl>
    </section>
  );
}

export function StepReview({ draft, errors, onEdit, onDeclaration }: StepReviewProps) {
  const { personal: p, contact: c, education: e, licensure: l, employment: em, documents: d, declaration: dec } = draft;

  const docs = [
    { key: "passportPhoto", label: "Passport photograph", doc: d.passportPhoto },
    { key: "degreeCertificate", label: "Degree / diploma certificate", doc: d.degreeCertificate },
    { key: "lpbLicense", label: "LPB license certificate", doc: d.lpbLicense },
    { key: "nationalIdDoc", label: "National ID / passport", doc: d.nationalIdDoc },
    { key: "cv", label: "Curriculum vitae", doc: d.cv },
  ];

  return (
    <div className="space-y-5">
      <Section title="1 · Personal information" stepIndex={0} onEdit={onEdit}>
        <Row label="Full name" value={[p.title, p.firstName, p.middleName, p.surname].filter(Boolean).join(" ")} />
        <Row label="Date of birth" value={formatDate(p.dob)} />
        <Row label="Gender" value={p.gender} />
        <Row label="Nationality" value={p.nationality} />
        <Row label="County of origin" value={p.countyOfOrigin} />
        <Row label="National ID / Passport" value={p.nationalId} />
        <Row label="Marital status" value={p.maritalStatus} />
      </Section>

      <Section title="2 · Contact details" stepIndex={1} onEdit={onEdit}>
        <Row label="Email" value={c.email} />
        <Row label="Phone" value={c.phone} />
        <Row label="Alt. phone" value={c.altPhone} />
        <Row label="Address" value={c.address} />
        <Row label="City / Town" value={c.city} />
        <Row label="District" value={c.district} />
        <Row label="County of residence" value={c.county} />
      </Section>

      <Section title="3 · Education & qualifications" stepIndex={2} onEdit={onEdit}>
        <Row label="Qualification" value={e.highestQualification} />
        <Row label="Institution" value={e.institution} />
        <Row label="Country of training" value={e.countryOfTraining} />
        <Row label="Graduation year" value={e.graduationYear} />
        <Row label="Specialization" value={e.specialization} />
        {e.otherQualifications ? <Row label="Other qualifications" value={e.otherQualifications} /> : null}
      </Section>

      <Section title="4 · Licensure & registration" stepIndex={3} onEdit={onEdit}>
        <Row label="LPB number" value={l.lpbNumber} />
        <Row label="Category" value={l.category} />
        <Row label="Initial registration" value={l.initialRegistrationYear} />
        <Row label="License expiry" value={formatDate(l.licenseExpiry)} />
        <Row label="Registered abroad" value={Boolean(l.registeredElsewhere)} />
        {l.registeredElsewhere ? <Row label="Countries" value={l.otherCountries} /> : null}
        <Row label="Good standing declared" value={Boolean(l.inGoodStanding)} />
      </Section>

      <Section title="5 · Practice & employment" stepIndex={4} onEdit={onEdit}>
        <Row label="Status" value={em.status} />
        <Row label="Sector" value={em.sector} />
        {em.facilityName ? <Row label="Facility" value={em.facilityName} /> : null}
        {em.facilityType ? <Row label="Facility type" value={em.facilityType} /> : null}
        {em.position ? <Row label="Position" value={em.position} /> : null}
        {em.county ? <Row label="County of practice" value={em.county} /> : null}
        <Row label="Years of experience" value={em.yearsOfExperience} />
      </Section>

      <Section title="6 · Credentials" stepIndex={5} onEdit={onEdit}>
        <div className="grid gap-3 px-5 py-4 sm:grid-cols-2">
          {docs.map((doc) =>
            doc.doc ? (
              <div key={doc.key} className="flex items-center gap-3 rounded-lg border border-slate-200 p-2.5">
                {doc.doc.dataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={doc.doc.dataUrl} alt="" className="h-11 w-11 rounded-md border border-slate-200 object-cover" />
                ) : (
                  <span className="flex h-11 w-11 items-center justify-center rounded-md bg-slate-100 text-slate-400">
                    {doc.doc.type.startsWith("image/") ? <ImageIcon className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-slate-700">{doc.label}</p>
                  <p className="truncate text-[11px] text-slate-500">
                    {doc.doc.name} · {formatFileSize(doc.doc.size)}
                  </p>
                </div>
              </div>
            ) : (
              <div key={doc.key} className="flex items-center gap-2 rounded-lg border border-dashed border-slate-200 p-2.5 text-xs text-slate-400">
                <AlertTriangle className="h-4 w-4 text-amber-400" /> {doc.label}: not attached
              </div>
            )
          )}
        </div>
      </Section>

      {/* Declaration */}
      <section className="overflow-hidden rounded-xl border-2 border-brand-800/10 bg-brand-50/40">
        <header className="border-b border-brand-100 px-5 py-3">
          <h3 className="text-sm font-bold text-brand-900">7 · Declaration &amp; consent</h3>
        </header>
        <div className="space-y-4 px-5 py-4">
          <label className={cn("flex cursor-pointer items-start gap-3 rounded-lg border bg-white p-4", errors["declaration.accurate"] ? "border-red-300" : "border-slate-200")}>
            <span className="pt-0.5">
              {dec.accurate ? <CheckCircle2 className="h-5 w-5 text-brand-600" /> : <span className="block h-5 w-5 rounded-full border-2 border-slate-300" />}
            </span>
            <input type="checkbox" className="sr-only" checked={dec.accurate === true} onChange={(e) => onDeclaration({ accurate: e.target.checked })} />
            <span className="text-sm text-slate-700">
              I hereby declare that the information provided in this registration is{" "}
              <strong>true, complete and accurate</strong> to the best of my knowledge, and that the attached
              credentials are genuine documents belonging to me.
            </span>
          </label>
          {errors["declaration.accurate"] && (
            <p className="field-error -mt-2 pl-1" role="alert"><AlertCircle className="h-3.5 w-3.5" /> {errors["declaration.accurate"]}</p>
          )}

          <label className={cn("flex cursor-pointer items-start gap-3 rounded-lg border bg-white p-4", errors["declaration.consent"] ? "border-red-300" : "border-slate-200")}>
            <span className="pt-0.5">
              {dec.consent ? <CheckCircle2 className="h-5 w-5 text-brand-600" /> : <span className="block h-5 w-5 rounded-full border-2 border-slate-300" />}
            </span>
            <input type="checkbox" className="sr-only" checked={dec.consent === true} onChange={(e) => onDeclaration({ consent: e.target.checked })} />
            <span className="text-sm text-slate-700">
              I consent to the <strong>Liberia Pharmacy Board</strong> storing and processing my data for the
              purposes of the 2026 National Pharmacist Census, license verification and health-workforce planning.
            </span>
          </label>
          {errors["declaration.consent"] && (
            <p className="field-error -mt-2 pl-1" role="alert"><AlertCircle className="h-3.5 w-3.5" /> {errors["declaration.consent"]}</p>
          )}

          <p className="flex items-center gap-2 text-xs text-slate-500">
            <span className={cn("chip", STATUS_META.submitted.chip)}>Submitted</span>
            On submission your record enters the LPB verification queue as <em>Submitted</em>.
          </p>
        </div>
      </section>
    </div>
  );
}
