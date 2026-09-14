"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "Is registration compulsory?",
    a: "Yes. The 2026 census is a statutory enumeration by the Liberia Pharmacy Board. Every pharmacist, whether practicing, non-practicing, intern or retired, must register so the Board can verify the national workforce and plan licensing, training and deployment.",
  },
  {
    q: "I am licensed but not currently practicing. Should I register?",
    a: "Yes. Select your current status (for example Unemployed or Retired) in the Practice & Employment step. Your record still counts toward the national register, and the facility fields will adjust automatically.",
  },
  {
    q: "How secure are my documents?",
    a: "Documents are transmitted over an encrypted connection and are visible only to authorized LPB officials for verification. The Board uses the data strictly for regulatory and planning purposes, in line with its confidentiality policy. This demonstration build stores data only in your own browser.",
  },
  {
    q: "Can I save and finish later?",
    a: "Yes. The form automatically saves your progress on this device. You can close the page and continue later from exactly where you stopped. Nothing is submitted until you sign the declaration and press Submit.",
  },
  {
    q: "What happens after I submit?",
    a: "You immediately receive an official registry reference number (for example LPB-2026-0007). LPB officials then verify your credentials, and your record moves from Submitted to Under Review to Verified. Keep your reference number safe; you will be asked for it at license renewal.",
  },
  {
    q: "My LPB license has expired. Can I still register?",
    a: "Yes. Register anyway and enter your license details truthfully. Records with expired licenses are flagged by the system and the Board will contact you about renewal. Registration itself is not a licensing decision.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number>(0);
  return (
    <div className="card divide-y divide-slate-200">
      {FAQS.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left hover:bg-paper-50"
              aria-expanded={isOpen}
            >
              <span className={cn("text-sm font-semibold", isOpen ? "text-brand-800" : "text-slate-800")}>{f.q}</span>
              <ChevronDown className={cn("h-4 w-4 shrink-0 text-slate-500", isOpen && "text-brand-700")} />
            </button>
            {isOpen && <p className="px-6 pb-5 text-sm leading-relaxed text-slate-600">{f.a}</p>}
          </div>
        );
      })}
    </div>
  );
}
