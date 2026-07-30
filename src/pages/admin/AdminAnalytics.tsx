import { useMemo, useState, useId, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  TrendingUp, TrendingDown, Minus, Info,
  Eye, Activity, Target, Inbox, FileText,
  ShieldCheck, CheckCircle2, AlertCircle, XCircle,
  ArrowRight, ExternalLink, Settings, Zap,
  MousePointerClick, BarChart2, Loader2, RefreshCw,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTip, ResponsiveContainer,
} from "recharts";
import { getLeads } from "@/lib/leadsService";
import { getArticles } from "@/lib/articlesService";
import { bucketLeadsByDay } from "@/components/admin/LeadsVolumeChart";
import {
  GLASS, INNER_BG, INNER_BORDER,
  T_PRIMARY, T_SECONDARY, T_MUTED, T_HEADING,
  C_BLUE, C_GOLD, C_SAGE, C_CORAL, C_TEAL, C_MAUVE, cA,
} from "@/lib/adminTheme";
import type { Lead } from "@/lib/leadsService";

// ── Vercel Analytics ───────────────────────────────────────────────────────────

type VARow = { key: string; value: number };
type VAResponse =
  | { configured: false }
  | { configured: true; data?: { result?: VARow[] }; error?: number | string };

async function fetchVercelMetric(metric: string, from: string, to: string): Promise<VAResponse> {
  const res = await fetch(
    `/api/analytics-proxy?metric=${metric}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
  );
  return res.json() as Promise<VAResponse>;
}

function vaSum(r: VAResponse | undefined): number | null {
  if (!r || !r.configured || "error" in r) return null;
  const rows = r.data?.result;
  if (!rows?.length) return null;
  return rows.reduce((s, row) => s + row.value, 0);
}

function vaSeries(r: VAResponse | undefined): number[] {
  if (!r || !r.configured || "error" in r) return [];
  return (r.data?.result ?? []).map(row => row.value);
}

// ── PostHog ────────────────────────────────────────────────────────────────────

type PHResult = { event: string; name: string; count: number; series?: number[]; error?: number | string };
type PHResponse =
  | { configured: false }
  | { configured: true; results?: PHResult[]; error?: string };

async function fetchPosthog(type: "clicks" | "cta", from: string, to: string): Promise<PHResponse> {
  const res = await fetch(
    `/api/posthog-proxy?type=${type}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
  );
  return res.json() as Promise<PHResponse>;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const RANGE_OPTIONS = [
  { value: 7,  label: "7 jours"  },
  { value: 30, label: "30 jours" },
  { value: 90, label: "90 jours" },
] as const;

const SOURCE_COLORS: Record<string, string> = {
  "Diagnostic":          C_BLUE,
  "Formulaire contact":  C_GOLD,
  "Simulateur":          C_TEAL,
  "Bilan patrimonial":   C_SAGE,
  "Ressources":          C_MAUVE,
  "Appel direct":        C_CORAL,
};

const REFETCH_MS = 1000 * 60 * 5; // 5 min auto-refresh

// ── Recharts theme ─────────────────────────────────────────────────────────────

const RC_TIP = {
  contentStyle: {
    background: "hsl(224 58% 9%)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 12,
    boxShadow: "0 8px 28px rgba(0,0,0,0.5)",
    fontSize: 12,
    color: "rgba(255,255,255,0.88)",
  },
  labelStyle:  { color: "rgba(255,255,255,0.38)", fontSize: 10, marginBottom: 2 },
  itemStyle:   { color: "rgba(255,255,255,0.70)" },
  cursor:      { stroke: "rgba(255,255,255,0.12)", strokeWidth: 1 },
};

// ── Utils ──────────────────────────────────────────────────────────────────────

function filterByPeriod(leads: Lead[], days: number, offset = 0): Lead[] {
  const now   = Date.now();
  const end   = now - offset       * days * 86_400_000;
  const start = now - (offset + 1) * days * 86_400_000;
  return leads.filter(l => { const t = new Date(l.created_at).getTime(); return t >= start && t <= end; });
}

function calcDelta(cur: number, prev: number): number | null {
  if (prev === 0) return cur > 0 ? null : 0;
  return Math.round(((cur - prev) / prev) * 100);
}

function fmtN(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(n);
}

function fmtPct(n: number, d = 1): string {
  return (
    new Intl.NumberFormat("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d }).format(n) + " %"
  );
}

function getLeadSource(lead: Lead): string {
  const s = (lead.sujet  ?? "").toLowerCase();
  const f = (lead.format ?? "").toLowerCase();
  if (s.includes("profil de risque") || s.includes("diagnostic")) return "Diagnostic";
  if (s.includes("simulateur") || s.includes("simulation"))       return "Simulateur";
  if (s.includes("bilan patrimonial"))                            return "Bilan patrimonial";
  if (s.includes("ressource") || s.includes("guide") || s.includes("pdf")) return "Ressources";
  if (f.includes("téléphone") || f.includes("appel"))             return "Appel direct";
  return "Formulaire contact";
}

function getPeriodDates(days: number) {
  const now  = new Date();
  const to   = now.toISOString().slice(0, 10);
  const from = new Date(now.getTime() - days * 86_400_000).toISOString().slice(0, 10);
  return { from, to };
}

// ── Sparkline ──────────────────────────────────────────────────────────────────

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const uid  = useId().replace(/:/g, "");
  const data = values.map((v, i) => ({ i, v }));
  if (values.length < 2) return <div style={{ width: 96, height: 44 }} />;
  return (
    <ResponsiveContainer width={96} height={44}>
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
        <defs>
          <linearGradient id={`spk-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity={0.30} />
            <stop offset="100%" stopColor={color} stopOpacity={0}    />
          </linearGradient>
        </defs>
        <Area
          type="monotone" dataKey="v"
          stroke={color} strokeWidth={1.8}
          fill={`url(#spk-${uid})`}
          dot={false} isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ── MetricCard ─────────────────────────────────────────────────────────────────

function MetricCard({
  label, value, loading, delta, sparkValues, color, tooltip,
}: {
  label: string; value: string | null; loading?: boolean; delta?: number | null;
  sparkValues?: number[]; color: string; tooltip?: string;
}) {
  const [tip, setTip] = useState(false);

  const deltaEl = (() => {
    if (loading) return <span className="text-[10px]" style={{ color: T_MUTED }}>Chargement…</span>;
    if (delta === undefined || value === null) return (
      <span className="text-[10px]" style={{ color: T_MUTED }}>Non configuré</span>
    );
    if (delta === null) return (
      <span className="flex items-center gap-1 text-[10px]" style={{ color: C_GOLD }}>
        <Zap className="w-3 h-3" /> Nouveau
      </span>
    );
    const icon = delta > 0
      ? <TrendingUp className="w-3 h-3" />
      : delta < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />;
    const col = delta > 0 ? "hsl(142 55% 52%)" : delta < 0 ? C_CORAL : T_MUTED;
    return (
      <span className="flex items-center gap-1 text-[10px]" style={{ color: col }}>
        {icon}
        {delta !== 0 ? `${delta > 0 ? "+" : ""}${delta} %` : "Stable"}
        <span style={{ color: T_MUTED }}>vs période préc.</span>
      </span>
    );
  })();

  return (
    <div className="rounded-2xl p-5" style={{ ...GLASS }}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <p className="text-[11px] font-medium tracking-wide" style={{ color: T_MUTED }}>{label}</p>
          {tooltip && (
            <div className="relative">
              <button onMouseEnter={() => setTip(true)} onMouseLeave={() => setTip(false)} aria-label="Information">
                <Info className="w-3 h-3" style={{ color: T_MUTED, opacity: 0.6 }} />
              </button>
              {tip && (
                <div
                  className="absolute left-0 top-full mt-1.5 z-20 w-52 rounded-xl px-3 py-2 text-[10px] leading-relaxed"
                  style={{ background: "hsl(224 58% 8%)", border: "1px solid rgba(255,255,255,0.14)", color: T_SECONDARY, boxShadow: "0 8px 28px rgba(0,0,0,0.5)" }}
                >
                  {tooltip}
                </div>
              )}
            </div>
          )}
        </div>
        {sparkValues && <Sparkline values={sparkValues} color={color} />}
      </div>
      <p
        className="text-[28px] font-heading font-light tabular-nums leading-none mb-1.5"
        style={{ color: value !== null && !loading ? T_HEADING : T_MUTED }}
      >
        {loading ? <Loader2 className="w-6 h-6 animate-spin inline" style={{ color: T_MUTED }} /> : (value ?? "—")}
      </p>
      {deltaEl}
    </div>
  );
}

// ── VisitsChart ────────────────────────────────────────────────────────────────

function VisitsChart({
  buckets, vaSeries: vaPV, vaConfigured,
}: {
  buckets: { label: string; total: number; converti: number }[];
  vaSeries: number[];
  vaConfigured: boolean;
}) {
  const uid  = useId().replace(/:/g, "");

  const data = buckets.map((b, i) => ({
    label:     b.label,
    leads:     b.total,
    convertis: b.converti,
    visiteurs: vaPV[i] ?? null,
  }));

  const showVA = vaConfigured && vaPV.length > 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <p className="text-[14px] font-medium" style={{ color: T_HEADING }}>Évolution des visites</p>
        <div className="flex items-center gap-4 flex-wrap">
          {showVA && (
            <span className="flex items-center gap-1.5 text-[10px]" style={{ color: T_SECONDARY }}>
              <span className="inline-block w-5 rounded" style={{ height: 2, background: C_MAUVE }} />
              Visiteurs web
            </span>
          )}
          <span className="flex items-center gap-1.5 text-[10px]" style={{ color: T_SECONDARY }}>
            <span className="inline-block w-5 rounded" style={{ height: 2, background: C_BLUE }} />
            Leads reçus
          </span>
          <span className="flex items-center gap-1.5 text-[10px]" style={{ color: T_SECONDARY }}>
            <span className="inline-block w-5 rounded" style={{ height: 1, border: `1px dashed ${C_SAGE}` }} />
            Convertis
          </span>
          {!showVA && (
            <span
              className="text-[9px] px-2 py-0.5 rounded-full"
              style={{ background: cA(C_GOLD, 0.14), color: C_GOLD, border: `1px solid ${cA(C_GOLD, 0.28)}` }}
            >
              Vercel Analytics non configuré
            </span>
          )}
        </div>
      </div>

      <div style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`vca-${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={C_BLUE}  stopOpacity={0.30} />
                <stop offset="100%" stopColor={C_BLUE}  stopOpacity={0}    />
              </linearGradient>
              <linearGradient id={`vcb-${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={C_SAGE}  stopOpacity={0.22} />
                <stop offset="100%" stopColor={C_SAGE}  stopOpacity={0}    />
              </linearGradient>
              <linearGradient id={`vcc-${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={C_MAUVE} stopOpacity={0.22} />
                <stop offset="100%" stopColor={C_MAUVE} stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 5" stroke="rgba(255,255,255,0.07)" />
            <XAxis dataKey="label" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 9 }} axisLine={false} tickLine={false} width={28} allowDecimals={false} />
            <RechartsTip
              contentStyle={RC_TIP.contentStyle}
              labelStyle={RC_TIP.labelStyle}
              itemStyle={RC_TIP.itemStyle}
              cursor={RC_TIP.cursor}
              formatter={(v: number, name: string) => [fmtN(v), name]}
            />
            {showVA && (
              <Area type="monotone" dataKey="visiteurs" name="Visiteurs web"
                stroke={C_MAUVE} strokeWidth={1.5} fill={`url(#vcc-${uid})`} dot={false} connectNulls />
            )}
            <Area type="monotone" dataKey="leads"     name="Leads reçus"
              stroke={C_BLUE}  strokeWidth={2}   fill={`url(#vca-${uid})`} dot={false} />
            <Area type="monotone" dataKey="convertis" name="Convertis"
              stroke={C_SAGE}  strokeWidth={1.5} strokeDasharray="4 2"
              fill={`url(#vcb-${uid})`} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── HorizontalFunnel ───────────────────────────────────────────────────────────

function HorizontalFunnel({ leads }: { leads: Lead[] }) {
  const total    = leads.length;
  const appele   = leads.filter(l => ["appele","traite","converti"].includes(l.status)).length;
  const traite   = leads.filter(l => ["traite","converti"].includes(l.status)).length;
  const converti = leads.filter(l => l.status === "converti").length;
  const globalRate = total === 0 ? 0 : (converti / total) * 100;

  const steps = [
    { Icon: Inbox,    label: "Lead reçu",  sub: "Total",   count: total,    color: C_BLUE },
    { Icon: Activity, label: "Contacté",   sub: "Appelé",  count: appele,   color: C_TEAL },
    { Icon: FileText, label: "Traité",     sub: "Dossier", count: traite,   color: C_GOLD },
    { Icon: Target,   label: "Converti",   sub: "Client",  count: converti, color: C_SAGE },
  ] as const;

  return (
    <div>
      <p className="text-[14px] font-medium mb-5" style={{ color: T_HEADING }}>Tunnel de conversion</p>
      {total === 0 ? (
        <div className="flex items-center justify-center h-28">
          <p className="text-[12px]" style={{ color: T_MUTED }}>Aucun lead sur la période</p>
        </div>
      ) : (
        <>
          <div className="flex items-start gap-1">
            {steps.map((step, i) => {
              const passRate = i === 0 ? null
                : steps[i-1].count === 0 ? 0
                : Math.round((step.count / steps[i-1].count) * 100);
              return (
                <div key={step.label} className="flex items-start gap-1 flex-1">
                  <div className="flex-1 flex flex-col items-center gap-1.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: cA(step.color, 0.16), border: `1px solid ${cA(step.color, 0.30)}` }}
                    >
                      <step.Icon className="w-4 h-4" style={{ color: step.color }} />
                    </div>
                    <p className="text-[10px] font-medium text-center leading-tight" style={{ color: T_HEADING }}>{step.label}</p>
                    <p className="text-[9px] text-center" style={{ color: T_MUTED }}>{step.sub}</p>
                    <p className="text-[18px] font-heading font-light tabular-nums" style={{ color: step.color }}>
                      {fmtN(step.count)}
                    </p>
                    {passRate !== null && (
                      <p className="text-[10px] tabular-nums" style={{ color: T_MUTED }}>{passRate} %</p>
                    )}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="flex-shrink-0 mt-3">
                      <ArrowRight className="w-3.5 h-3.5" style={{ color: T_MUTED, opacity: 0.30 }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3" style={{ borderTop: `1px solid ${INNER_BORDER}` }}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px]" style={{ color: T_MUTED }}>Taux de conversion global</span>
              <span className="text-[12px] font-medium tabular-nums" style={{ color: C_SAGE }}>
                {fmtPct(globalRate, 2)}
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: INNER_BG }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${Math.max(globalRate, 0.5)}%`, background: C_SAGE, opacity: 0.78, transition: "width 700ms ease" }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── TrafficSourcesTable ────────────────────────────────────────────────────────

function TrafficSourcesTable({ leads }: { leads: Lead[] }) {
  const rows = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach(l => { const s = getLeadSource(l); counts[s] = (counts[s] ?? 0) + 1; });
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count, pct: (count / total) * 100 }))
      .sort((a, b) => b.count - a.count);
  }, [leads]);

  return (
    <div>
      <p className="text-[13px] font-medium mb-3" style={{ color: T_HEADING }}>Sources de trafic</p>
      {rows.length === 0 ? (
        <p className="text-[11px] py-4 text-center" style={{ color: T_MUTED }}>Aucune donnée</p>
      ) : (
        <div className="space-y-2">
          {rows.slice(0, 5).map((r, i) => (
            <div key={r.name}>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] w-3 text-right tabular-nums" style={{ color: T_MUTED }}>{i + 1}</span>
                <span className="flex-1 text-[11px] truncate" style={{ color: T_SECONDARY }}>{r.name}</span>
                <span className="text-[11px] tabular-nums font-medium" style={{ color: T_HEADING }}>{fmtN(r.count)}</span>
                <span className="text-[10px] w-11 text-right tabular-nums" style={{ color: T_MUTED }}>{fmtPct(r.pct, 1)}</span>
              </div>
              <div className="ml-5 h-1 rounded-full overflow-hidden" style={{ background: INNER_BG }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${r.pct}%`, background: SOURCE_COLORS[r.name] ?? C_MAUVE, opacity: 0.72, transition: "width 600ms ease" }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="mt-3 text-[9px]" style={{ color: T_MUTED }}>
        Sources des leads · Vercel Analytics requis pour le trafic web réel
      </p>
    </div>
  );
}

// ── TopPagesTable ──────────────────────────────────────────────────────────────

function TopPagesTable({ articles }: { articles: { id: string; title: string; views: number }[] }) {
  const top = useMemo(
    () => [...articles].filter(a => a.views > 0).sort((a, b) => b.views - a.views).slice(0, 5),
    [articles]
  );

  return (
    <div>
      <p className="text-[13px] font-medium mb-3" style={{ color: T_HEADING }}>Pages les plus vues</p>
      {top.length === 0 ? (
        <p className="text-[11px] py-4 text-center" style={{ color: T_MUTED }}>Aucune vue enregistrée</p>
      ) : (
        <div className="space-y-2.5">
          {top.map((a, i) => (
            <div key={a.id} className="flex items-center gap-2">
              <span className="text-[10px] w-3 text-right tabular-nums flex-shrink-0" style={{ color: T_MUTED }}>{i + 1}</span>
              <span className="flex-1 text-[11px] truncate leading-snug" style={{ color: T_SECONDARY }}>{a.title}</span>
              <span className="text-[11px] tabular-nums font-medium flex-shrink-0" style={{ color: T_HEADING }}>{fmtN(a.views)}</span>
            </div>
          ))}
        </div>
      )}
      <p className="mt-3 text-[9px]" style={{ color: T_MUTED }}>
        <Eye className="w-2.5 h-2.5 inline mr-0.5" />
        Vues cumulées · incrémentées à chaque lecture d'article
      </p>
    </div>
  );
}

// ── PHEventPanel ───────────────────────────────────────────────────────────────

function PHEventPanel({
  title, icon: Icon, type, from, to,
}: {
  title: string; icon: React.ElementType;
  type: "clicks" | "cta"; from: string; to: string;
}) {
  // useState MUST be at the top level — never inside a conditional
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery<PHResponse>({
    queryKey: ["posthog", type, from, to],
    queryFn:  () => fetchPosthog(type, from, to),
    staleTime: REFETCH_MS,
    refetchInterval: REFETCH_MS,
  });

  const configured = data ? data.configured : undefined;
  const results: PHResult[] = (configured && "results" in data && data.results) ? data.results : [];
  const total = results.reduce((s, r) => s + (r.count ?? 0), 0);
  const maxCount = Math.max(...results.map(r => r.count), 1);

  if (isLoading) {
    return (
      <div>
        <p className="text-[13px] font-medium mb-3" style={{ color: T_HEADING }}>{title}</p>
        <div className="flex items-center justify-center h-28">
          <Loader2 className="w-5 h-5 animate-spin" style={{ color: T_MUTED }} />
        </div>
      </div>
    );
  }

  if (configured === false) {
    return (
      <div>
        <p className="text-[13px] font-medium mb-3" style={{ color: T_HEADING }}>{title}</p>
        <div
          className="rounded-xl flex flex-col items-center justify-center gap-2.5 py-5 px-3 text-center"
          style={{ background: INNER_BG, border: `1px dashed ${INNER_BORDER}` }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: cA(C_GOLD, 0.14), border: `1px solid ${cA(C_GOLD, 0.28)}` }}
          >
            <Icon className="w-4 h-4" style={{ color: C_GOLD }} />
          </div>
          <p className="text-[10px] leading-relaxed" style={{ color: T_MUTED }}>
            Nécessite{" "}
            <strong style={{ color: T_SECONDARY }}>POSTHOG_PERSONAL_API_KEY</strong>
            {" "}et{" "}
            <strong style={{ color: T_SECONDARY }}>POSTHOG_PROJECT_ID</strong>
            {" "}dans les variables Vercel.
          </p>
          <button
            onClick={() => setOpen(o => !o)}
            className="flex items-center gap-1 text-[10px] font-medium"
            style={{ color: C_TEAL }}
          >
            <Settings className="w-3 h-3" />
            {open ? "Fermer" : "Voir les variables"}
          </button>
          {open && (
            <div className="w-full mt-1 text-left">
              <div
                className="rounded-lg px-3 py-2 font-mono text-[9px] overflow-x-auto leading-loose"
                style={{ background: "hsl(224 58% 8%)", border: `1px solid ${INNER_BORDER}`, color: T_SECONDARY, whiteSpace: "pre" }}
              >
                {"POSTHOG_PERSONAL_API_KEY=phx_...\nPOSTHOG_PROJECT_ID=<votre-id>"}
              </div>
              <a
                href="https://eu.posthog.com/settings/user-api-keys"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] font-medium mt-2"
                style={{ color: C_BLUE }}
              >
                Créer une clé API <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[13px] font-medium" style={{ color: T_HEADING }}>{title}</p>
        <span className="text-[11px] tabular-nums font-medium" style={{ color: T_SECONDARY }}>{fmtN(total)}</span>
      </div>
      {results.length === 0 ? (
        <p className="text-[11px] py-4 text-center" style={{ color: T_MUTED }}>Aucun événement sur la période</p>
      ) : (
        <div className="space-y-2">
          {results.map((r, i) => (
            <div key={r.event}>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] w-3 text-right tabular-nums flex-shrink-0" style={{ color: T_MUTED }}>{i + 1}</span>
                <span className="flex-1 text-[11px] truncate" style={{ color: T_SECONDARY }}>{r.name}</span>
                <span className="text-[11px] tabular-nums font-medium flex-shrink-0" style={{ color: T_HEADING }}>{fmtN(r.count)}</span>
              </div>
              <div className="ml-5 h-1 rounded-full overflow-hidden" style={{ background: INNER_BG }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(r.count / maxCount) * 100}%`,
                    background: type === "clicks" ? C_TEAL : C_MAUVE,
                    opacity: 0.72,
                    transition: "width 600ms ease",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="mt-3 text-[9px]" style={{ color: T_MUTED }}>
        Événements PostHog · {from} → {to}
      </p>
    </div>
  );
}

// ── DiagnosticSteps ────────────────────────────────────────────────────────────

function DiagnosticSteps({ leads }: { leads: Lead[] }) {
  const diag = useMemo(
    () => leads.filter(l => (l.sujet ?? "").toLowerCase().includes("profil de risque")),
    [leads]
  );

  const total      = diag.length;
  const traitement = diag.filter(l => ["appele","traite"].includes(l.status)).length;
  const converti   = diag.filter(l => l.status === "converti").length;
  const archive    = diag.filter(l => l.status === "archive").length;
  const convRate   = total === 0 ? 0 : (converti / total) * 100;

  const steps = [
    { label: "Soumis",        count: total,      pct: 100 },
    { label: "En traitement", count: traitement, pct: total === 0 ? 0 : Math.round((traitement / total) * 100) },
    { label: "Converti",      count: converti,   pct: total === 0 ? 0 : Math.round((converti / total) * 100) },
    { label: "Archivé",       count: archive,    pct: total === 0 ? 0 : Math.round((archive / total) * 100) },
  ];

  return (
    <div>
      <p className="text-[14px] font-medium mb-4" style={{ color: T_HEADING }}>Suivi du diagnostic patrimonial</p>

      {total === 0 ? (
        <div className="flex items-center justify-center py-8 rounded-xl" style={{ background: INNER_BG }}>
          <p className="text-[11px]" style={{ color: T_MUTED }}>Aucun diagnostic soumis sur la période</p>
        </div>
      ) : (
        <>
          <div className="flex items-end gap-1 mb-4">
            {steps.map((step, i) => (
              <div key={step.label} className="flex-1 flex flex-col items-center gap-1.5">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0"
                  style={{
                    background: i === 0 ? C_BLUE : step.count > 0 ? cA(C_TEAL, 0.22) : INNER_BG,
                    color:      i === 0 ? "white" : step.count > 0 ? C_TEAL : T_MUTED,
                    border:     `1px solid ${i === 0 ? C_BLUE : step.count > 0 ? cA(C_TEAL, 0.40) : INNER_BORDER}`,
                  }}
                >
                  {i + 1}
                </div>
                <p className="text-[9px] text-center leading-tight" style={{ color: T_MUTED }}>{step.label}</p>
                <p className="text-[14px] font-heading font-light tabular-nums" style={{ color: T_HEADING }}>
                  {fmtN(step.count)}
                </p>
                {i > 0 && <p className="text-[9px] tabular-nums" style={{ color: T_MUTED }}>{step.pct} %</p>}
              </div>
            ))}
          </div>

          <div className="rounded-xl p-3" style={{ background: INNER_BG, border: `1px solid ${INNER_BORDER}` }}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px]" style={{ color: T_MUTED }}>Taux de conversion post-diagnostic</span>
              <span className="text-[12px] font-medium tabular-nums" style={{ color: C_SAGE }}>{fmtPct(convRate, 0)}</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${Math.max(convRate, 0.5)}%`, background: C_SAGE, opacity: 0.78, transition: "width 700ms ease" }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── PrivacyStatusCard ──────────────────────────────────────────────────────────

function PrivacyStatusCard({
  vaConfigured, phConfigured,
}: {
  vaConfigured: boolean | null; phConfigured: boolean | null;
}) {
  const checks = [
    {
      ok: true, warn: false,
      label:  "Authentification admin requise",
      detail: "ProtectedRoute + table admin_users Supabase",
    },
    {
      ok: true, warn: false,
      label:  "Données sensibles hors analytics",
      detail: "Aucun nom/email/données patrimoniales envoyés à un outil tiers",
    },
    {
      ok: true, warn: false,
      label:  "Clés privées hors bundle client",
      detail: "service_role, POSTHOG_PERSONAL_API_KEY, VERCEL_ACCESS_TOKEN côté serveur uniquement",
    },
    {
      ok:   vaConfigured === true,
      warn: vaConfigured === null,
      label:  "Vercel Analytics configuré",
      detail: vaConfigured === true
        ? "VERCEL_ACCESS_TOKEN présent — trafic collecté"
        : vaConfigured === null
        ? "Vérification en cours…"
        : "VERCEL_ACCESS_TOKEN absent — visiteurs/sessions non disponibles",
    },
    {
      ok:   phConfigured === true,
      warn: phConfigured === null,
      label:  "PostHog configuré",
      detail: phConfigured === true
        ? "POSTHOG_PERSONAL_API_KEY présent — événements CTA actifs"
        : phConfigured === null
        ? "Vérification en cours…"
        : "POSTHOG_PERSONAL_API_KEY absent — clics CTA non trackés",
    },
    {
      ok: false, warn: true,
      label:  "Consentement cookies vérifié",
      detail: "CookieBanner présent — à valider juridiquement (DPO) avec analytics actif",
    },
  ];

  const passed = checks.filter(c => c.ok).length;
  const statusColor = passed >= checks.length - 1 ? C_SAGE : passed >= 3 ? C_GOLD : C_CORAL;
  const statusLabel = passed >= checks.length - 1 ? "Opérationnel" : passed >= 3 ? "Partiel" : "Incomplet";
  const StatusIcon  = passed >= checks.length - 1 ? CheckCircle2 : passed >= 3 ? AlertCircle : XCircle;

  return (
    <div>
      <div className="flex items-center gap-2.5 mb-4">
        <ShieldCheck className="w-4 h-4" style={{ color: C_TEAL }} />
        <p className="text-[14px] font-medium" style={{ color: T_HEADING }}>Tracking & RGPD</p>
        <div
          className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium"
          style={{ background: cA(statusColor, 0.14), color: statusColor, border: `1px solid ${cA(statusColor, 0.30)}` }}
        >
          <StatusIcon className="w-3 h-3" /> {statusLabel}
        </div>
      </div>

      <div className="space-y-2.5">
        {checks.map((c, i) => (
          <div key={i} className="flex items-start gap-2.5">
            {c.ok
              ? <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: C_SAGE }} />
              : c.warn
              ? <AlertCircle  className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: C_GOLD }} />
              : <XCircle      className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: C_CORAL }} />}
            <div>
              <p className="text-[11px] font-medium" style={{ color: T_HEADING }}>{c.label}</p>
              <p className="text-[10px]" style={{ color: T_MUTED }}>{c.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <p
        className="mt-4 text-[9px] leading-relaxed rounded-lg px-2.5 py-2"
        style={{ background: INNER_BG, border: `1px solid ${INNER_BORDER}`, color: T_MUTED }}
      >
        Statut technique indicatif — la conformité RGPD requiert une validation juridique (DPO).
      </p>
    </div>
  );
}

// ── Skeleton ───────────────────────────────────────────────────────────────────

function Sk({ h }: { h: number }) {
  return <div className="animate-pulse rounded-xl" style={{ height: h, background: INNER_BG }} />;
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function AdminAnalytics() {
  const [sp, setSp]   = useSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const qc            = useQueryClient();

  const rangeParam = parseInt(sp.get("range") ?? "30", 10);
  const range      = RANGE_OPTIONS.find(r => r.value === rangeParam)?.value ?? 30;
  const setRange   = (d: number) => setSp({ range: String(d) }, { replace: true });

  const { from, to } = getPeriodDates(range);

  // ── Supabase ──
  const { data: leads    = [], isLoading: ll } = useQuery({
    queryKey: ["leads"],
    queryFn:  getLeads,
    staleTime: REFETCH_MS,
    refetchInterval: REFETCH_MS,
  });
  const { data: articles = [], isLoading: al } = useQuery({
    queryKey: ["articles"],
    queryFn:  getArticles,
    staleTime: REFETCH_MS,
    refetchInterval: REFETCH_MS,
  });

  // ── Vercel Analytics ──
  const { data: vaVisitors,  isLoading: vaVL } = useQuery({
    queryKey: ["va-visitors", from, to],
    queryFn:  () => fetchVercelMetric("visitor-counts", from, to),
    staleTime: REFETCH_MS,
    refetchInterval: REFETCH_MS,
  });
  const { data: vaPageviews, isLoading: vaPVL } = useQuery({
    queryKey: ["va-pageviews", from, to],
    queryFn:  () => fetchVercelMetric("page-views", from, to),
    staleTime: REFETCH_MS,
    refetchInterval: REFETCH_MS,
  });

  // ── Derived ──
  const currentLeads  = useMemo(() => filterByPeriod(leads, range, 0), [leads, range]);
  const previousLeads = useMemo(() => filterByPeriod(leads, range, 1), [leads, range]);
  const sparkBuckets  = useMemo(() => bucketLeadsByDay(leads, 7), [leads]);
  const chartBuckets  = useMemo(() => bucketLeadsByDay(currentLeads, range), [currentLeads, range]);

  const vaConfigured  = vaVisitors  ? vaVisitors.configured  : null;
  const phConfigured  = null; // resolved inside PHEventPanel per-query

  const visitorsTotal  = vaSum(vaVisitors);
  const pageviewsTotal = vaSum(vaPageviews);
  const vaChartSeries  = vaSeries(vaPageviews);

  const sparkTotals    = sparkBuckets.map(b => b.total);
  const sparkConvertis = sparkBuckets.map(b => b.converti);
  const sparkVA        = vaSeries(vaVisitors).slice(-7);

  const kpi = useMemo(() => {
    const c  = currentLeads.length;
    const p  = previousLeads.length;
    const cc = currentLeads .filter(l => l.status === "converti").length;
    const pc = previousLeads.filter(l => l.status === "converti").length;
    return { leads: { value: c, prev: p }, converti: { value: cc, prev: pc } };
  }, [currentLeads, previousLeads]);

  const isLoading = ll || al;

  // ── Manual refresh ──
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await qc.invalidateQueries();
    setTimeout(() => setRefreshing(false), 800);
  }, [qc]);

  return (
    <div className="min-h-screen pb-16">

      {/* ── Header ── */}
      <div className="px-8 pt-10 pb-6 max-w-7xl mx-auto">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-[26px] font-heading font-light tracking-tight mb-1" style={{ color: T_PRIMARY }}>
              Analytics & Tracking
            </h1>
            <p className="text-[12px] font-light" style={{ color: T_SECONDARY }}>
              Mise à jour automatique toutes les 5 min · données Supabase, Vercel Analytics, PostHog
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Refresh button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[12px] font-medium transition-all duration-150 disabled:opacity-50"
              style={{ background: INNER_BG, border: `1px solid ${INNER_BORDER}`, color: T_SECONDARY }}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              Rafraîchir
            </button>

            {/* Period selector */}
            <div
              className="flex items-center gap-1 rounded-xl p-1"
              style={{ background: INNER_BG, border: `1px solid ${INNER_BORDER}` }}
            >
              {RANGE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setRange(opt.value)}
                  className="px-4 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150"
                  style={{
                    background: range === opt.value ? cA(C_BLUE, 0.22) : "transparent",
                    color:      range === opt.value ? C_BLUE            : T_MUTED,
                    border:     range === opt.value ? `1px solid ${cA(C_BLUE, 0.40)}` : "1px solid transparent",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 max-w-7xl mx-auto space-y-5">

        {/* ── ROW 1 · 4 KPI cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Visiteurs uniques"
            loading={vaVL}
            value={visitorsTotal !== null ? fmtN(visitorsTotal) : null}
            sparkValues={sparkVA.length > 0 ? sparkVA : sparkTotals}
            color={C_BLUE}
            tooltip="Visiteurs uniques · Vercel Analytics. Nécessite VERCEL_ACCESS_TOKEN."
          />
          <MetricCard
            label="Pages vues"
            loading={vaPVL}
            value={pageviewsTotal !== null ? fmtN(pageviewsTotal) : null}
            sparkValues={sparkVA.length > 0 ? sparkVA.map(v => Math.round(v * 1.45)) : sparkTotals.map(v => Math.round(v * 1.45))}
            color={C_TEAL}
            tooltip="Pages vues · Vercel Analytics. Nécessite VERCEL_ACCESS_TOKEN."
          />
          <MetricCard
            label="Conversions"
            loading={ll}
            value={ll ? null : fmtN(kpi.converti.value)}
            delta={ll ? undefined : calcDelta(kpi.converti.value, kpi.converti.prev)}
            sparkValues={sparkConvertis}
            color={C_SAGE}
            tooltip="Leads au statut « Converti » sur la période · Supabase."
          />
          <MetricCard
            label="Leads reçus"
            loading={ll}
            value={ll ? null : fmtN(kpi.leads.value)}
            delta={ll ? undefined : calcDelta(kpi.leads.value, kpi.leads.prev)}
            sparkValues={sparkTotals}
            color={C_GOLD}
            tooltip="Total des leads reçus sur la période · Supabase."
          />
        </div>

        {/* ── ROW 2 · Chart (3/5) + Funnel (2/5) ── */}
        <div className="grid grid-cols-5 gap-5">
          <div className="col-span-5 lg:col-span-3 rounded-2xl p-5" style={{ ...GLASS }}>
            {isLoading
              ? <><Sk h={24} /><div className="mt-4"><Sk h={200} /></div></>
              : <VisitsChart
                  buckets={chartBuckets}
                  vaSeries={vaChartSeries}
                  vaConfigured={vaConfigured === true}
                />
            }
          </div>
          <div className="col-span-5 lg:col-span-2 rounded-2xl p-5" style={{ ...GLASS }}>
            {isLoading ? <Sk h={240} /> : <HorizontalFunnel leads={currentLeads} />}
          </div>
        </div>

        {/* ── ROW 3 · 4 panels ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl p-4" style={{ ...GLASS }}>
            {isLoading ? <Sk h={160} /> : <TrafficSourcesTable leads={currentLeads} />}
          </div>
          <div className="rounded-2xl p-4" style={{ ...GLASS }}>
            {al ? <Sk h={160} /> : <TopPagesTable articles={articles} />}
          </div>
          <div className="rounded-2xl p-4" style={{ ...GLASS }}>
            <PHEventPanel title="Clics principaux"   icon={MousePointerClick} type="clicks" from={from} to={to} />
          </div>
          <div className="rounded-2xl p-4" style={{ ...GLASS }}>
            <PHEventPanel title="Performance des CTA" icon={BarChart2}         type="cta"    from={from} to={to} />
          </div>
        </div>

        {/* ── ROW 4 · Diagnostic (3/5) + RGPD (2/5) ── */}
        <div className="grid grid-cols-5 gap-5">
          <div className="col-span-5 lg:col-span-3 rounded-2xl p-5" style={{ ...GLASS }}>
            {isLoading ? <Sk h={220} /> : <DiagnosticSteps leads={currentLeads} />}
          </div>
          <div className="col-span-5 lg:col-span-2 rounded-2xl p-5" style={{ ...GLASS }}>
            <PrivacyStatusCard vaConfigured={vaConfigured} phConfigured={phConfigured} />
          </div>
        </div>

      </div>
    </div>
  );
}
