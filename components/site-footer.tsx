import Link from "next/link";
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

        <div className="space-y-3 text-sm">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/40">Contact the Board</p>
          <ul className="space-y-2 text-white/80">
            <li>Liberia Pharmacy Board, Monrovia, Liberia</li>
            <li>info@lpb.gov.lr</li>
            <li>+231 (0) 777 123 456</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link href="/signup" className="btn-accent px-6">
            Start Registration
          </Link>
          <p className="flex items-center gap-2 text-xs text-white/50">
            <LiberiaFlag className="h-3 w-4 border border-white/20" /> An official service of the Republic of Liberia
          </p>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="container-x flex flex-col items-start justify-between gap-2 py-4 text-xs text-white/45 sm:flex-row sm:items-center">
          <p>© 2026 Liberia Pharmacy Board. All rights reserved.</p>
          <ul className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <li>
              <Link href="/privacy" className="underline underline-offset-2 hover:text-white">
                Privacy policy
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/terms" className="underline underline-offset-2 hover:text-white">
                Terms of use
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/official" className="underline underline-offset-2 hover:text-white">
                LPB Official Portal
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
