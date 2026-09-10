"use client";

import { ShieldCheck } from "lucide-react";
import { PortalShell } from "@/components/portal/shell";
import { useAccount } from "@/components/portal/use-account";
import { FileUpload } from "@/components/ui/file-upload";
import { setDocument } from "@/lib/portal";
import { DOCUMENT_SLOTS } from "@/lib/portal-types";
import type { RegistryDocuments } from "@/lib/types";

export default function DocumentsPage() {
  return (
    <PortalShell title="Documents">
      <DocumentsBody />
    </PortalShell>
  );
}

function DocumentsBody() {
  const { account, setAccount } = useAccount();
  if (!account) return null;

  const count = DOCUMENT_SLOTS.filter((s) => account.documents[s.key]).length;

  async function update(key: keyof RegistryDocuments, doc: Parameters<typeof setDocument>[2]) {
    if (!account) return;
    const updated = await setDocument(account.id, key, doc);
    if (updated) setAccount(updated);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-200 bg-brand-50 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
          <p className="text-sm text-brand-900">
            Upload clear, legible scans or photos (JPG, PNG or PDF · max 5 MB). LPB verification officers compare
            these against your profile — blurred or mismatched documents will delay verification.
          </p>
        </div>
        <span className="chip bg-white font-bold text-brand-800 ring-1 ring-brand-200">{count} / {DOCUMENT_SLOTS.length} uploaded</span>
      </div>

      <div className="card grid gap-5 p-5 sm:grid-cols-2 sm:p-7">
        {DOCUMENT_SLOTS.map((slot) => (
          <FileUpload
            key={slot.key}
            label={slot.label}
            description={slot.hint}
            required={slot.required}
            imagesOnly={slot.imagesOnly}
            doc={account.documents[slot.key]}
            onChange={(doc) => update(slot.key, doc)}
          />
        ))}
      </div>
    </div>
  );
}
