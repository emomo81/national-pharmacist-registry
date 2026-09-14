import type { SessionUser } from "./types";

/**
 * PHASE-1 AUTH: demo credentials for the LPB Official Portal.
 * Phase 2 replaces this with server-side auth (hashed passwords, sessions/JWT,
 * role-based access) against the PostgreSQL `staff_users` table.
 */

const SESSION_KEY = "lpb_portal_session_v1";

const STAFF: Array<SessionUser & { password: string }> = [
  {
    email: "admin@lpb.gov.lr",
    password: "Liberia2026!",
    name: "Mrs. Oretha B. Davis",
    role: "Registrar & CEO",
    initials: "OD",
  },
  {
    email: "data.officer@lpb.gov.lr",
    password: "Data2026!",
    name: "Mr. Roland T. Gbowee",
    role: "Data & Records Officer",
    initials: "RG",
  },
];

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function login(email: string, password: string): Promise<SessionUser | null> {
  await wait(500);
  const match = STAFF.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
  );
  if (!match) return null;
  const session: SessionUser = {
    email: match.email,
    name: match.name,
    role: match.role,
    initials: match.initials,
  };
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ ...session, at: new Date().toISOString() }));
  }
  return session;
}

export function getSession(): (SessionUser & { at: string }) | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as SessionUser & { at: string }) : null;
  } catch {
    return null;
  }
}

export function logout(): void {
  if (typeof localStorage !== "undefined") localStorage.removeItem(SESSION_KEY);
}
