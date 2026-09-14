import { cn } from "@/lib/utils";

/**
 * Loading placeholder used while registry data is read from storage.
 * Pass a className (for example "bg-white/10" on navy panels) to adapt the tone.
 */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("animate-pulse bg-slate-200", className)} />;
}
