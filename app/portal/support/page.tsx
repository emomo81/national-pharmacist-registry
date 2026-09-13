"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, LifeBuoy, ArrowRight } from "lucide-react";
import { PortalShell } from "@/components/portal/shell";

const CONTACTS = [
  { icon: Phone, label: "Call the Board", value: "+231 (0) 777 123 456", sub: "Mon – Fri, 9:00 – 16:00 GMT" },
  { icon: Mail, label: "Email support", value: "info@lpb.gov.lr", sub: "Replies within 2 working days" },
  { icon: MapPin, label: "Visit the office", value: "Monrovia, Liberia", sub: "County liaison officers can assist in person" },
];

export default function SupportPage() {
  return (
    <PortalShell title="Help & Support">
      <div className="mx-auto max-w-2xl space-y-5">
        <div className="card p-6">
          <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-brand-950">
            <LifeBuoy className="h-5 w-5 text-brand-600" /> We&apos;re here to help
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Stuck on a step of your registration, or is a document being rejected? Reach out through any channel
            below, or review the public FAQ, which covers the most common questions pharmacists ask.
          </p>
        </div>

        <div className="space-y-3">
          {CONTACTS.map((c) => (
            <div key={c.label} className="card flex items-center gap-4 p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-sm bg-brand-50 text-brand-600">
                <c.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{c.label}</p>
                <p className="text-sm font-bold text-brand-950">{c.value}</p>
                <p className="text-xs text-slate-500">{c.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="card flex items-center justify-between gap-4 p-5">
          <div>
            <p className="font-bold text-brand-950">Frequently asked questions</p>
            <p className="mt-0.5 text-sm text-slate-500">On the public site, no sign-in needed.</p>
          </div>
          <Link href="/#support" className="btn-outline whitespace-nowrap">
            Open FAQ <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </PortalShell>
  );
}
