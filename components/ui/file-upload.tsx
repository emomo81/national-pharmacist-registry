"use client";

import { useRef, useState } from "react";
import { UploadCloud, FileText, X, AlertCircle, ImageIcon } from "lucide-react";
import type { UploadedDoc } from "@/lib/types";
import { formatFileSize, cn } from "@/lib/utils";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const PREVIEW_BYTES = 900 * 1024; // inline preview only for images < 0.9 MB

interface FileUploadProps {
  label: string;
  description: string;
  required?: boolean;
  doc?: UploadedDoc;
  onChange: (doc: UploadedDoc | undefined) => void;
  error?: string;
  imagesOnly?: boolean;
}

export function FileUpload({ label, description, required, doc, onChange, error, imagesOnly }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [localError, setLocalError] = useState<string>();

  const accept = imagesOnly ? ".jpg,.jpeg,.png,image/jpeg,image/png" : ".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf";

  function handleFile(file: File | undefined) {
    setLocalError(undefined);
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";
    if (!isImage && !isPdf) {
      setLocalError("Only JPG, PNG or PDF files are accepted.");
      return;
    }
    if (imagesOnly && !isImage) {
      setLocalError("A photo (JPG or PNG) is required for this document.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setLocalError(`File is too large (${formatFileSize(file.size)}). Maximum is 5 MB.`);
      return;
    }
    const capturedAt = new Date().toISOString();
    if (isImage && file.size <= PREVIEW_BYTES) {
      const reader = new FileReader();
      reader.onload = () =>
        onChange({
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl: typeof reader.result === "string" ? reader.result : undefined,
          capturedAt,
        });
      reader.readAsDataURL(file);
    } else {
      onChange({ name: file.name, type: file.type, size: file.size, capturedAt });
    }
  }

  const shownError = error ?? localError;

  if (doc) {
    return (
      <div>
        <label className="label">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
          <span className="label-hint"> · {description}</span>
        </label>
        <div className={cn("flex items-center gap-3 rounded-xl border bg-white p-3", shownError ? "border-red-300" : "border-brand-200 ring-1 ring-brand-100")}>
          {doc.dataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={doc.dataUrl} alt={doc.name} className="h-14 w-14 shrink-0 rounded-lg border border-slate-200 object-cover" />
          ) : (
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
              {doc.type.startsWith("image/") ? <ImageIcon className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-800">{doc.name}</p>
            <p className="text-xs text-slate-500">
              {doc.type === "application/pdf" ? "PDF document" : "Image"} · {formatFileSize(doc.size)}
              {!doc.dataUrl && doc.type.startsWith("image/") && " · preview unavailable (large file)"}
              {!doc.dataUrl && doc.type === "application/pdf" && " · attached"}
            </p>
            {!doc.dataUrl && (
              <p className="mt-0.5 text-[11px] text-amber-600">
                Stored as reference in this demo — re-attach on this device to enable preview.
              </p>
            )}
          </div>
          <div className="flex shrink-0 gap-1">
            <button type="button" className="btn-ghost px-2.5 py-1.5 text-xs" onClick={() => inputRef.current?.click()}>
              Replace
            </button>
            <button
              type="button"
              aria-label={`Remove ${label}`}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
              onClick={() => onChange(undefined)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        {shownError && (
          <p className="field-error" role="alert">
            <AlertCircle className="h-3.5 w-3.5" /> {shownError}
          </p>
        )}
        <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
      </div>
    );
  }

  return (
    <div>
      <label className="label">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
        <span className="label-hint"> · {description}</span>
      </label>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "flex w-full items-center gap-4 rounded-xl border-2 border-dashed px-4 py-5 text-left transition",
          shownError
            ? "border-red-300 bg-red-50/40"
            : dragOver
              ? "border-brand-500 bg-brand-50"
              : "border-slate-300 bg-white hover:border-brand-400 hover:bg-brand-50/40"
        )}
      >
        <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-full", shownError ? "bg-red-100 text-red-500" : "bg-brand-100 text-brand-700")}>
          <UploadCloud className="h-5 w-5" />
        </span>
        <span>
          <span className="block text-sm font-semibold text-slate-800">
            Click to upload <span className="font-normal text-slate-500">or drag &amp; drop</span>
          </span>
          <span className="mt-0.5 block text-xs text-slate-500">{imagesOnly ? "JPG or PNG" : "JPG, PNG or PDF"} · max 5 MB</span>
        </span>
      </button>
      {shownError && (
        <p className="field-error" role="alert">
          <AlertCircle className="h-3.5 w-3.5" /> {shownError}
        </p>
      )}
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
    </div>
  );
}
