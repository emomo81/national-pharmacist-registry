import { CheckCircle2, Circle } from "lucide-react";
import { buildSeeds } from "@/lib/seed";
import { seedPharmacistAccounts } from "@/lib/portal-data";
import { getProgress } from "@/lib/portal";
import { APPLICATION_STATUS_META } from "@/lib/portal-types";
import { STATUS_META } from "@/lib/constants";
import { cn, fullName } from "@/lib/utils";

const PORTAL_NAV = [
  "Dashboard",
  "My Profile",
  "Educational Credentials",
  "Professional Experience",
  "CPD Training",
  "Documents",
  "Submit Application",
];

/**
 * Live renderings of the two portals, built with the same components and seed
 * data as the real screens. Shown on the public landing page so visitors can
 * see the actual service before signing up.
 */
export function DemoPreview() {
  const account = seedPharmacistAccounts()[0];
  const metrics = getProgress(account);
  const statusMeta = APPLICATION_STATUS_META[account.applicationStatus];
  const rows = buildSeeds().slice(0, 5);
  const name = [account.personal.firstName, account.personal.surname].filter(Boolean).join(" ");

  const statCards = [
    { label: "Profile Completed", value: `${metrics.profilePct}%` },
    { label: "Credentials Uploaded", value: `${metrics.docsCount} / ${metrics.docsTotal}` },
    { label: "CPD Trainings", value: String(account.cpd.length) },
    { label: "Application Status", value: statusMeta.label },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Pharmacist portal */}
      <figure>
        <div className="card overflow-hidden">
          <div className="flex">
            <div className="hidden w-[190px] shrink-0 flex-col gap-4 bg-brand-950 p-4 sm:flex">
              <p className="text-[11px] font-extrabold tracking-wide text-white">LIBERIA PHARMACY BOARD</p>
              <nav className="space-y-1">
                {PORTAL_NAV.map((label, i) => (
                  <p
                    key={label}
                    className={cn(
                      "rounded-sm px-3 py-1.5 text-[12px] font-semibold",
                      i === 0 ? "bg-brand-600 text-white" : "text-white/60"
                    )}
                  >
                    {label}
                  </p>
                ))}
              </nav>
            </div>
            <div className="min-w-0 flex-1 bg-paper-100">
              <div className="flex h-11 items-center justify-between border-b border-slate-300 bg-white px-4">
                <p className="text-sm font-extrabold text-brand-950">Dashboard</p>
                <span className={cn("chip", statusMeta.chip)}>
                  <span className={cn("h-1.5 w-1.5 rounded-full", statusMeta.dot)} />
                  {statusMeta.label}
                </span>
              </div>
              <div className="space-y-4 p-4">
                <div>
                  <p className="text-base font-extrabold text-brand-950">Welcome back, {name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Registry reference: <span className="font-mono font-bold text-brand-800">{account.registryRef}</span>
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {statCards.map((c) => (
                    <div key={c.label} className="card flex items-center gap-3 p-3">
                      <div className="min-w-0">
                        <p className="truncate text-[10px] font-bold uppercase tracking-wide text-slate-400">{c.label}</p>
                        <p className="mt-0.5 text-sm font-extrabold text-brand-950">{c.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="card p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-brand-950">Registration Progress</p>
                    <p className="text-sm font-extrabold text-accent-700">{metrics.progressPct}%</p>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-accent-600" style={{ width: `${metrics.progressPct}%` }} />
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {metrics.checks.map((c) => (
                      <li key={c.key} className="flex items-center gap-2 text-xs">
                        {c.done ? (
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-accent-600" />
                        ) : (
                          <Circle className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                        )}
                        <span className={c.done ? "font-medium text-slate-700" : "text-slate-500"}>{c.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <figcaption className="mt-3 text-sm text-slate-600">
          <span className="font-bold text-brand-950">Pharmacist portal.</span> Registration progress,
          credentials, documents and live verification status, rendered with the same components and demo data
          as the real screen.
        </figcaption>
      </figure>

      {/* LPB official portal */}
      <figure>
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-slate-300 bg-white px-4 py-3">
            <p className="text-sm font-extrabold text-brand-950">Pharmacist Registry</p>
            <span className="btn-dark px-3 py-1.5 text-xs">Export CSV (27)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px]">
              <thead>
                <tr>
                  <th className="table-th">Reference</th>
                  <th className="table-th">Pharmacist</th>
                  <th className="table-th">License</th>
                  <th className="table-th">County</th>
                  <th className="table-th">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-paper-50">
                    <td className="table-td font-mono text-xs font-bold text-brand-800">{r.reference}</td>
                    <td className="table-td">
                      <span className="font-semibold text-slate-800">{fullName(r)}</span>
                      <p className="text-xs text-slate-400">{r.personal.gender} · {r.contact.city}</p>
                    </td>
                    <td className="table-td font-mono text-xs">{r.licensure.lpbNumber}</td>
                    <td className="table-td">{r.employment.county || r.contact.county}</td>
                    <td className="table-td">
                      <span className={cn("chip", STATUS_META[r.status].chip)}>
                        <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_META[r.status].dot)} />
                        {STATUS_META[r.status].label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-200 px-4 py-2.5 text-xs text-slate-500">
            Showing 1 to 5 of 27 records · Page 1 of 3
          </div>
        </div>
        <figcaption className="mt-3 text-sm text-slate-600">
          <span className="font-bold text-brand-950">LPB official portal.</span> The registry table with search,
          filters, verification actions and CSV export, rendered with the same components and demo data as the
          real screen.
        </figcaption>
      </figure>
    </div>
  );
}
