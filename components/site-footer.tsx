import Link from "next/link";
import { MapPin, Mail, Phone, ArrowUpRight } from "lucide-react";
import { LpbLogo } from "./logo";
import { LiberiaFlag } from "./liberia-flag";

export function SiteFooter() {
  return (
    <footer className="no-print bg-brand-950 text-white">
      <div className="container-x flex flex-col items-start justify-between gap-8 py-12 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <LpbLogo size={64} badge />
          <div>
            <p className="text-lg font-extrabold tracking-wide">LIBERIA PHARMACY BOARD</p>
            <p className="mt-0.5 max-w-xs text-sm text-white/60">
              Safe Medicines. Healthy Communities. A Stronger Liberia.
            </p>
          </div>
        </div>

        <ul className="space-y-3 text-sm text-white/80">
          <li className="flex items-center gap-2.5">
            <MapPin className="h-4 w-4 shrink-0 text-accent-300" /> Monrovia, Liberia
          </li>
          <li className="flex items-center gap-2.5">
            <Mail className="h-4 w-4 shrink-0 text-accent-300" /> info@lpb.gov.lr
          </li>
          <li className="flex items-center gap-2.5">
            <Phone className="h-4 w-4 shrink-0 text-accent-300" /> +231 (0) 777 123 456
          </li>
        </ul>

        <div className="space-y-3">
          <Link href="/signup" className="btn-accent px-6">
            Start Registration <ArrowUpRight className="h-4 w-4" />
          </Link>
          <p className="flex items-center gap-2 text-xs text-white/50">
            <LiberiaFlag className="h-3 w-4 rounded-[2px]" /> An official service of the Republic of Liberia
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-4 text-xs text-white/45 sm:flex-row">
          <p>© 2026 Liberia Pharmacy Board. All rights reserved.</p>
          <p>
            <Link href="/official" className="font-semibold text-white/60 transition hover:text-white">
              LPB Official Portal
            </Link>
            <span className="mx-2">·</span> National Pharmacist Registry — Census 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
