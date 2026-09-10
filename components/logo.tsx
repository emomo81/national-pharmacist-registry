import { cn } from "@/lib/utils";

/**
 * Single source for the LPB seal.
 * Swap-in path for the official asset: overwrite public/lpb-logo.svg (or point
 * `src` below at your PNG) — every screen updates automatically.
 */
interface LogoProps {
  size?: number;
  /** circular white backing — required on dark/navy backgrounds */
  badge?: boolean;
  className?: string;
}

export function LpbLogo({ size = 44, badge = false, className }: LogoProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        badge && "bg-white p-[3px] ring-2 ring-white/25 shadow-sm",
        className
      )}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/lpb-logo.svg"
        alt="Liberia Pharmacy Board seal"
        style={{ width: size - (badge ? 8 : 2), height: size - (badge ? 8 : 2) }}
        className="rounded-full object-cover"
      />
    </span>
  );
}
