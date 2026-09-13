"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccount, portalSession } from "@/lib/portal";
import type { PharmacistAccount, PortalSession } from "@/lib/portal-types";

/** Loads the signed-in pharmacist account (redirects to /login when signed out). */
export function useAccount() {
  const router = useRouter();
  const [session, setSession] = useState<PortalSession | null>(null);
  const [account, setAccount] = useState<PharmacistAccount | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    const s = portalSession();
    if (!s) {
      router.replace("/login");
      return;
    }
    setSession(s);
    const a = await getAccount(s.accountId);
    setAccount(a);
    setReady(true);
  }, [router]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { session, account, setAccount, refresh, ready };
}
