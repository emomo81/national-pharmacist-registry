import type { Metadata } from "next";
import { RegistrationWizard } from "@/components/register/wizard";
import { Clock3, ShieldCheck, FileCheck2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Register — 2026 Pharmacist Census",
  description:
    "Complete the Liberia Pharmacy Board's 2026 National Pharmacist Census: personal details, qualifications, licensure, practice and credential uploads.",
};

export default function RegisterPage() {
  return (
    <div className="bg-slate-50 py-10 sm:py-14">
      <div className="container-x max-w-5xl">
        <header className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
            2026 National Pharmacist Census
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-950 sm:text-4xl">
            Pharmacist Registration Form
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Part One of the National Pharmacist Registry. Complete all seven steps and submit — you will
            immediately receive an official registry reference number.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
            <span className="chip bg-white ring-1 ring-slate-200">
              <Clock3 className="h-3.5 w-3.5 text-brand-600" /> Takes about 15 minutes
            </span>
            <span className="chip bg-white ring-1 ring-slate-200">
              <FileCheck2 className="h-3.5 w-3.5 text-brand-600" /> Saves automatically as you type
            </span>
            <span className="chip bg-white ring-1 ring-slate-200">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-600" /> Seen only by authorized LPB officials
            </span>
          </div>
        </header>

        <RegistrationWizard />
      </div>
    </div>
  );
}
