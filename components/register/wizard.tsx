"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { ArrowLeft, ArrowRight, Loader2, RotateCcw, Send, Save } from "lucide-react";
import { Stepper, WIZARD_STEPS } from "./stepper";
import { StepPersonal } from "./step-personal";
import { StepContact } from "./step-contact";
import { StepEducation } from "./step-education";
import { StepLicensure } from "./step-licensure";
import { StepEmployment } from "./step-employment";
import { StepCredentials } from "./step-credentials";
import { StepReview } from "./step-review";
import {
  personalSchema,
  contactSchema,
  educationSchema,
  licensureSchema,
  employmentSchema,
  declarationSchema,
} from "@/lib/schemas";
import { submitRegistration } from "@/lib/api";
import type { RegistrationDraft, FieldErrors, EmploymentInfo, LicensureInfo, PersonalInfo, ContactInfo, EducationInfo } from "@/lib/types";
import { cn } from "@/lib/utils";

const DRAFT_KEY = "lpb_registry_draft_v1";

const emptyDraft: RegistrationDraft = {
  personal: {},
  contact: {},
  education: {},
  licensure: { registeredElsewhere: undefined, inGoodStanding: false },
  employment: {},
  documents: {},
  declaration: { accurate: false, consent: false },
};

type SectionKey = "personal" | "contact" | "education" | "licensure" | "employment" | "documents" | "declaration";

function flatten(prefix: SectionKey, error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = `${prefix}.${issue.path.join(".")}`;
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export function RegistrationWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [maxVisited, setMaxVisited] = useState(0);
  const [draft, setDraft] = useState<RegistrationDraft>(emptyDraft);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [submitError, setSubmitError] = useState<string>();

  // Hydrate saved draft (client only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { draft: RegistrationDraft; step: number };
        setDraft({ ...emptyDraft, ...parsed.draft });
        setStep(Math.min(parsed.step ?? 0, WIZARD_STEPS.length - 1));
        setMaxVisited(Math.min(parsed.step ?? 0, WIZARD_STEPS.length - 1));
      }
    } catch {
      /* corrupted draft → start fresh */
    }
    setHydrated(true);
  }, []);

  // Persist draft on change (image previews are session-only, strip before saving)
  useEffect(() => {
    if (!hydrated) return;
    const docs = Object.fromEntries(
      Object.entries(draft.documents).map(([k, v]) => [k, v ? { ...v, dataUrl: undefined } : v])
    );
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ draft: { ...draft, documents: docs }, step }));
  }, [draft, step, hydrated]);

  function update<K extends SectionKey>(section: K, patch: Partial<RegistrationDraft[K]>) {
    setDraft((d) => ({ ...d, [section]: { ...d[section], ...patch } }));
    // drop errors for the section being edited
    setErrors((errs) => {
      if (!Object.keys(errs).some((k) => k.startsWith(`${section}.`))) return errs;
      const next = { ...errs };
      Object.keys(next).forEach((k) => {
        if (k.startsWith(`${section}.`)) delete next[k];
      });
      return next;
    });
  }

  const validateStep = (index: number, d: RegistrationDraft = draft): FieldErrors => {
    switch (index) {
      case 0: {
        const r = personalSchema.safeParse(d.personal);
        return r.success ? {} : flatten("personal", r.error);
      }
      case 1: {
        const r = contactSchema.safeParse(d.contact);
        return r.success ? {} : flatten("contact", r.error);
      }
      case 2: {
        const r = educationSchema.safeParse(d.education);
        return r.success ? {} : flatten("education", r.error);
      }
      case 3: {
        const r = licensureSchema.safeParse({
          registeredElsewhere: false,
          inGoodStanding: false,
          ...d.licensure,
        });
        return r.success ? {} : flatten("licensure", r.error);
      }
      case 4: {
        const r = employmentSchema.safeParse(d.employment);
        return r.success ? {} : flatten("employment", r.error);
      }
      case 5: {
        const docErrs: FieldErrors = {};
        const isIntern = d.licensure?.category === "Provisional (Intern) Pharmacist";
        if (!d.documents.passportPhoto) docErrs["documents.passportPhoto"] = "Passport photograph is required";
        if (!d.documents.degreeCertificate) docErrs["documents.degreeCertificate"] = "Degree / diploma certificate is required";
        if (!d.documents.nationalIdDoc) docErrs["documents.nationalIdDoc"] = "National ID or passport is required";
        if (!isIntern && !d.documents.lpbLicense) docErrs["documents.lpbLicense"] = "LPB license certificate is required";
        return docErrs;
      }
      case 6: {
        // Review step: re-check everything, then the declaration
        const aggregate = [0, 1, 2, 3, 4, 5].reduce<FieldErrors>((acc, i) => ({ ...acc, ...validateStep(i, d) }), {});
        const r = declarationSchema.safeParse({ accurate: false, consent: false, ...d.declaration });
        return r.success ? aggregate : { ...aggregate, ...flatten("declaration", r.error) };
      }
      default:
        return {};
    }
  };

  function goTo(index: number) {
    setStep(index);
    setMaxVisited((m) => Math.max(m, index));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function next() {
    const errs = validateStep(step);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    goTo(Math.min(step + 1, WIZARD_STEPS.length - 1));
  }

  function back() {
    setErrors({});
    setSubmitError(undefined);
    goTo(Math.max(step - 1, 0));
  }

  function jump(index: number) {
    if (index === step) return;
    if (index < step || index <= maxVisited) {
      setErrors({});
      goTo(index);
      return;
    }
    // moving forward — validate the current step first
    next();
  }

  function resetAll() {
    if (!window.confirm("Clear everything you have entered and start over?")) return;
    setDraft(emptyDraft);
    setErrors({});
    setStep(0);
    setMaxVisited(0);
    localStorage.removeItem(DRAFT_KEY);
  }

  async function submit() {
    const errs = validateStep(6);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      // jump user to the first section containing an error
      const firstKey = Object.keys(errs)[0];
      const section = firstKey.split(".")[0];
      const sectionToStep: Record<string, number> = {
        personal: 0, contact: 1, education: 2, licensure: 3, employment: 4, documents: 5, declaration: 6,
      };
      const target = sectionToStep[section] ?? 6;
      if (target !== 6) goTo(target);
      return;
    }
    setSubmitting(true);
    setSubmitError(undefined);
    try {
      const registration = await submitRegistration({
        personal: draft.personal as PersonalInfo,
        contact: draft.contact as ContactInfo,
        education: draft.education as EducationInfo,
        licensure: { registeredElsewhere: false, ...draft.licensure } as LicensureInfo,
        employment: draft.employment as EmploymentInfo,
        documents: draft.documents,
      });
      localStorage.removeItem(DRAFT_KEY);
      const params = new URLSearchParams({
        ref: registration.reference,
        name: `${draft.personal.firstName} ${draft.personal.surname}`,
        email: draft.contact.email ?? "",
      });
      router.push(`/register/success?${params.toString()}`);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      setSubmitting(false);
      setSubmitError("Something went wrong while submitting. Please try again.");
    }
  }

  const stepMeta = useMemo(() => WIZARD_STEPS[step], [step]);

  if (!hydrated) {
    return (
      <div className="card flex h-72 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Stepper current={step} onJump={jump} />

      <div className="card animate-fade-up p-5 sm:p-7">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-brand-950 sm:text-xl">
              Step {step + 1} — {stepMeta.label}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {step === 0 && "Tell us who you are, exactly as your name appears on your credentials."}
              {step === 1 && "Where the Board can reach you about your registration."}
              {step === 2 && "Your pharmacy training and academic qualifications."}
              {step === 3 && "Your standing with the Liberia Pharmacy Board."}
              {step === 4 && "Where and how you currently practice (if practicing)."}
              {step === 5 && "Attach the required credentials as scans or clear photos."}
              {step === 6 && "Verify every detail before it goes to the LPB Registrar."}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Save className="h-3.5 w-3.5" />
            Progress saved automatically
            <button type="button" onClick={resetAll} className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-semibold text-slate-400 transition hover:bg-red-50 hover:text-red-600">
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          </div>
        </header>

        {step === 0 && <StepPersonal values={draft.personal} errors={errors} onChange={(p) => update("personal", p)} />}
        {step === 1 && <StepContact values={draft.contact} errors={errors} onChange={(p) => update("contact", p)} />}
        {step === 2 && <StepEducation values={draft.education} errors={errors} onChange={(p) => update("education", p)} />}
        {step === 3 && <StepLicensure values={draft.licensure} errors={errors} onChange={(p) => update("licensure", p)} />}
        {step === 4 && <StepEmployment values={draft.employment} errors={errors} onChange={(p) => update("employment", p)} />}
        {step === 5 && (
          <StepCredentials
            values={draft.documents}
            licenseCategory={draft.licensure.category}
            errors={errors}
            onChange={(p) => update("documents", p)}
          />
        )}
        {step === 6 && (
          <StepReview draft={draft} errors={errors} onEdit={goTo} onDeclaration={(p) => update("declaration", p)} />
        )}

        {Object.keys(errors).length > 0 && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            Please correct the {Object.keys(errors).length} highlighted field{Object.keys(errors).length > 1 ? "s" : ""} before continuing.
          </div>
        )}
        {submitError && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {submitError}
          </div>
        )}

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-6">
          <button type="button" onClick={back} disabled={step === 0 || submitting} className={cn("btn-outline", step === 0 && "invisible")}>
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          {step < WIZARD_STEPS.length - 1 ? (
            <button type="button" onClick={next} className="btn-primary px-6">
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button type="button" onClick={submit} disabled={submitting} className="btn-gold px-7 py-3">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {submitting ? "Submitting to LPB…" : "Submit registration"}
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
