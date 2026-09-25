import { useEffect, useState } from "react";
import { Power, PowerOff, RefreshCw, AlertTriangle } from "lucide-react";
import {
  getPageStatuses,
  setPageEnabled,
  SITE_PAGES,
  type PageStatus,
} from "@/lib/pageMaintenanceService";
import { invalidateMaintenanceCache } from "@/hooks/usePageMaintenance";

export default function AdminPagesMaintenance() {
  const [statuses, setStatuses] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data: PageStatus[] = await getPageStatuses();
      const map: Record<string, boolean> = {};
      data.forEach((r) => { map[r.path] = r.enabled; });
      setStatuses(map);
    } catch {
      setError("Impossible de charger les statuts de pages. Vérifiez que la table page_maintenance existe dans Supabase.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const isEnabled = (path: string) => statuses[path] !== false;

  const toggle = async (path: string) => {
    const next = !isEnabled(path);
    setToggling(path);
    try {
      await setPageEnabled(path, next);
      invalidateMaintenanceCache();
      setStatuses((prev) => ({ ...prev, [path]: next }));
      setToast(next ? "Page activée" : "Page désactivée");
      setTimeout(() => setToast(null), 2500);
    } catch {
      setError("Erreur lors de la mise à jour. Réessayez.");
    } finally {
      setToggling(null);
    }
  };

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.28em] uppercase font-medium text-foreground/40 mb-1">Admin · Site</p>
        <h1 className="text-2xl font-heading font-light text-foreground tracking-tight mb-2">
          Maintenance des pages
        </h1>
        <p className="text-sm text-foreground/55 font-light leading-relaxed max-w-lg">
          Désactivez une page pour rediriger les visiteurs vers une page de maintenance.
          La page reste accessible dans l'admin.
        </p>
      </div>

      {/* Setup notice */}
      <div className="mb-6 p-4 rounded-xl border border-amber-200 bg-amber-50 flex gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-[12px] text-amber-800 leading-relaxed">
          <strong className="font-medium">Prérequis Supabase :</strong> Exécutez ce SQL dans votre Dashboard Supabase → SQL Editor avant d'utiliser cette fonctionnalité :
          <pre className="mt-2 p-2 bg-amber-100 rounded text-[11px] font-mono overflow-x-auto whitespace-pre-wrap">
{`CREATE TABLE IF NOT EXISTS page_maintenance (
  path TEXT PRIMARY KEY,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE page_maintenance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin can manage" ON page_maintenance
  FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Public read" ON page_maintenance
  FOR SELECT USING (TRUE);`}
          </pre>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-foreground/40 font-light">{SITE_PAGES.length} pages configurables</p>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs text-foreground/50 hover:text-foreground transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Actualiser
        </button>
      </div>

      <div className="space-y-2">
        {SITE_PAGES.map((page) => {
          const enabled = isEnabled(page.path);
          const isLoading = toggling === page.path;
          return (
            <div
              key={page.path}
              className="flex items-center justify-between px-5 py-3.5 rounded-xl border transition-colors"
              style={{
                background: enabled ? "hsl(0 0% 100%)" : "hsl(0 0% 97%)",
                borderColor: enabled ? "hsl(0 0% 0% / 0.08)" : "hsl(0 0% 0% / 0.06)",
              }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: enabled ? "hsl(142 70% 42%)" : "hsl(0 0% 65%)" }}
                />
                <div>
                  <p className="text-sm font-medium text-foreground">{page.label}</p>
                  <p className="text-[11px] text-foreground/40 font-mono">{page.path}</p>
                </div>
              </div>
              <button
                onClick={() => toggle(page.path)}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-medium transition-all"
                style={enabled
                  ? { background: "hsl(142 60% 94%)", color: "hsl(142 50% 28%)", border: "1px solid hsl(142 50% 80%)" }
                  : { background: "hsl(0 0% 92%)", color: "hsl(0 0% 38%)", border: "1px solid hsl(0 0% 80%)" }}
              >
                {isLoading
                  ? <RefreshCw className="w-3 h-3 animate-spin" />
                  : enabled
                    ? <><Power className="w-3 h-3" />Active</>
                    : <><PowerOff className="w-3 h-3" />Désactivée</>}
              </button>
            </div>
          );
        })}
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-medium shadow-xl z-50 animate-in fade-in slide-in-from-bottom-2">
          {toast}
        </div>
      )}
    </div>
  );
}
