import type { Registration } from "./types";
import { buildSeeds, SEED_COUNT } from "./seed";
import { makeReference } from "./utils";

/**
 * PHASE-1 STORAGE ADAPTER (browser localStorage).
 * ---------------------------------------------------------------
 * Everything in the app talks to lib/api.ts, never to this module directly.
 * In Phase 2 this implementation is replaced by the Node.js + PostgreSQL
 * backend (see README § "Phase 2 — database"), with zero UI changes.
 */

const KEY = "lpb_registry_records_v1";
const SEQ_KEY = "lpb_registry_sequence_v1";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function ensureSeeded(): Registration[] {
  const existing = safeParse<Registration[] | null>(localStorage.getItem(KEY), null);
  if (existing && Array.isArray(existing) && existing.length > 0) return existing;
  const seeds = buildSeeds();
  localStorage.setItem(KEY, JSON.stringify(seeds));
  localStorage.setItem(SEQ_KEY, String(SEED_COUNT));
  return seeds;
}

export function readAll(): Registration[] {
  if (typeof localStorage === "undefined") return [];
  return ensureSeeded();
}

export function writeAll(records: Registration[]): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(records));
}

export function nextReference(): string {
  if (typeof localStorage === "undefined") return makeReference(1);
  ensureSeeded();
  const seq = Number(localStorage.getItem(SEQ_KEY) ?? SEED_COUNT) || SEED_COUNT;
  const next = seq + 1;
  localStorage.setItem(SEQ_KEY, String(next));
  return makeReference(next);
}

/** Remove any stored record previews + reset to the demo dataset. */
export function resetToSeeds(): void {
  if (typeof localStorage === "undefined") return;
  const seeds = buildSeeds();
  localStorage.setItem(KEY, JSON.stringify(seeds));
  localStorage.setItem(SEQ_KEY, String(SEED_COUNT));
}
