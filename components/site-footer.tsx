import Link from "next/link";
import { MapPin, Mail, Phone, LockKeyhole } from "lucide-react";
import { LiberiaFlag } from "./liberia-flag";

export function SiteFooter() {
  return (
    <footer className="no-print bg-brand-950 text-white">
      <div className="container-x grid gap-10 py-14 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/lpb-logo.svg" alt="" className="h-12 w-12" />
            <div className="leading-tight">
              <p className="font-bold">National Pharmacist Registry</p>
              <p className="text-xs uppercase tracking-[0.16em] text-white/60">Liberia Pharmacy Board</p>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">
            The official digital registry supporting the 2026 National Pharmacist Census — building a
            verified picture of Liberia&apos;s pharmacy workforce for regulation, planning and public
            health decision-making.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
            <LiberiaFlag className="h-4 w-6 rounded-[2px]" />
            <span className="text-xs font-medium text-white/70">Republic of Liberia</span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-gold-400">Quick links</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            <li><Link className="transition hover:text-white" href="/register">Register as a pharmacist</Link></li>
            <li><Link className="transition hover:text-white" href="/#requirements">Required documents</Link></li>
            <li><Link className="transition hover:text-white" href="/#faq">Frequently asked questions</Link></li>
            <li>
              <Link className="inline-flex items-center gap-1.5 transition hover:text-white" href="/official">
                <LockKeyhole className="h-3.5 w-3.5" /> LPB Official Portal
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-gold-400">Contact the Board</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/40" />
              <span>Liberia Pharmacy Board, Capitol Bye-Pass,<br />Monrovia, Montserrado, Liberia</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-white/40" />
              <span>registry@lpb.gov.lr</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-white/40" />
              <span>+231 77 600 2026</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-4 text-xs text-white/50 sm:flex-row">
          <p>© 2026 Liberia Pharmacy Board. All rights reserved.</p>
          <p>National Pharmacist Registry — Census 2026 · v1.0</p>
        </div>
      </div>
    </footer>
  );
}
