import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";

let cachedStatuses: Record<string, boolean> | null = null;
let fetchPromise: Promise<Record<string, boolean>> | null = null;

async function fetchStatuses(): Promise<Record<string, boolean>> {
  if (cachedStatuses) return cachedStatuses;
  if (!fetchPromise) {
    fetchPromise = supabase
      .from("page_maintenance")
      .select("path, enabled")
      .then(({ data }) => {
        const map: Record<string, boolean> = {};
        (data ?? []).forEach((r: { path: string; enabled: boolean }) => {
          map[r.path] = r.enabled;
        });
        cachedStatuses = map;
        fetchPromise = null;
        return map;
      })
      .catch(() => {
        fetchPromise = null;
        return {};
      });
  }
  return fetchPromise;
}

export function usePageMaintenance(): boolean {
  const { pathname } = useLocation();
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchStatuses().then((statuses) => {
      if (cancelled) return;
      const enabled = statuses[pathname];
      // If path is not in the table it defaults to enabled (true)
      setDisabled(enabled === false);
    });
    return () => { cancelled = true; };
  }, [pathname]);

  return disabled;
}

// Invalidate cache when admin makes changes
export function invalidateMaintenanceCache() {
  cachedStatuses = null;
}
