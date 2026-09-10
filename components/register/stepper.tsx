"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepDef {
  id: string;
  label: string;
  short: string;
}

export const WIZARD_STEPS: StepDef[] = [
  { id: "personal", label: "Personal Information", short: "Personal" },
  { id: "contact", label: "Contact Details", short: "Contact" },
  { id: "education", label: "Education & Qualifications", short: "Education" },
  { id: "licensure", label: "Licensure & Registration", short: "Licensure" },
  { id: "employment", label: "Practice & Employment", short: "Practice" },
  { id: "credentials", label: "Credential Uploads", short: "Documents" },
  { id: "review", label: "Review & Submit", short: "Review" },
];

export function Stepper({ current, onJump }: { current: number; onJump: (index: number) => void }) {
  return (
    <nav aria-label="Registration progress" className="no-print">
      {/* Desktop */}
      <ol className="hidden gap-1 lg:flex">
        {WIZARD_STEPS.map((step, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={step.id} className="flex-1">
              <button
                type="button"
                onClick={() => onJump(i)}
                className={cn(
                  "group w-full rounded-xl border px-3 py-2.5 text-left transition",
                  active
                    ? "border-brand-600 bg-brand-700 text-white shadow-card"
                    : done
                      ? "border-brand-200 bg-brand-50 text-brand-800 hover:bg-brand-100"
                      : "border-slate-200 bg-white text-slate-400"
                )}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                      active
                        ? "bg-white/20 text-white"
                        : done
                          ? "bg-brand-600 text-white"
                          : "bg-slate-100 text-slate-400"
                    )}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </span>
                  <span
                    className={cn(
                      "truncate text-xs font-semibold",
                      active ? "text-white" : done ? "text-brand-800" : "text-slate-500"
                    )}
                  >
                    {step.short}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* Mobile: compact progress */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-brand-900">
            Step {current + 1} of {WIZARD_STEPS.length}:{" "}
            <span className="font-semibold text-slate-600">{WIZARD_STEPS[current].label}</span>
          </p>
        </div>
        <div className="mt-2.5 flex gap-1">
          {WIZARD_STEPS.map((step, i) => (
            <span
              key={step.id}
              className={cn(
                "h-1.5 flex-1 rounded-full",
                i < current ? "bg-brand-500" : i === current ? "bg-brand-800" : "bg-slate-200"
              )}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}
