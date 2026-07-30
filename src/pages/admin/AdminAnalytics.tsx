import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp, TrendingDown, Minus, BarChart2,
  ArrowRight, Info, Settings, ExternalLink,
  CheckCircle2, AlertCircle, XCircle, ShieldCheck,
  FileText, Target, Zap, Activity, Eye, Inbox,
} from "lucide-react";
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { getLeads } from "@/lib/leadsService";
import { getArticles } from "@/lib/articlesService";
import { VolumeChart } from "@/components/admin/LeadsVolumeChart";
import {
  GLASS, INNER_BG, INNER_BORDER,
  T_PRIMARY, T_SECONDARY, T_MUTED, T_HEADING,
  C_BLUE, C_GOLD, C_SAGE, C_CORAL, C_TEAL, C_MAUVE, cA,
} from "@/lib/adminTheme";
import type { Lead } from "@/lib/leadsService";

// ── Period config ──────────────────────────────────────────────────────────────

const RANGE_OPTIONS = [
  { value: 7,    label: "7 j"  },
  { value: 30,   label: "30 j" },
  { value: 90,   label: "90 j" },
  { value: 9999, label: "Tout" },
] as const;

// ── Recharts dark-theme helpers ────────────────────────────────────────────────

const RC_CONTENT_STYLE = {
  background: "hsl(224 58% 9%)",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: 12,
  boxShadow: "0 8px 28px rgba(0,0,0,0.50)",
  fontSize: 12,
  color: "rgba(255,255,255,0.88)",
};
const RC_LABEL_STYLE  = { color: "rgba(255,255,255,0.40)", fontSize: 10, marginBottom: 2 };
const RC_ITEM_STYLE   = { color: "rgba(255,255,255,0.70)" };
const RC_CURSOR_STYLE = { stroke: "rgba(255,255,255,0.12)", strokeWidth: 1 };
const RC_TICK_STYLE   = { fill: "rgba(255,255,255,0.35)", fontSize: 10 };
const RC_GRID_STROKE  = "rgba(255,255,255,0.07)";

const SOURCE_COLORS: Record<string, string> = {
  "Diagnostic":          C_BLUE,
  "Formulaire contact":  C_GOLD,
  "Simulateur":          C_TEAL,
  "Bilan patrimonial":   C_SAGE,
  "Ressources":          C_MAUVE,
  "Appel direct":        C_CORAL,
};

// ── Pure utilities ─────────────────────────────────────────────────────────────

function filterByPeriod(leads: Lead[], rangeDays: number, offset = 0): Lead[] {
  if (rangeDays === 9999) return offset === 0 ? leads : [];
  const now   = Date.now();
  const end   = now - offset       * rangeDays * 86_400_000;
  const start = now - (offset + 1) * rangeDays * 86_400_000;
  return leads.filter((l) => {
    const t = new Date(l.created_at).getTime();
    return t >= start && t <= end;
  });
}

function calcDelta(current: number, previous: number): number | null {
  if (previous === 0) return current > 0 ? null : 0;
  return Math.round(((current - previous) / previous) * 100);
}

function fmtNum(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(n);
}

function fmtPct(n: number, decimals = 1): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n / 100);
}

function getLeadSource(lead: Lead): string {
  const s = (lead.sujet  ?? "").toLowerCase();
  const f = (lead.format ?? "").toLowerCase();
  if (s.includes("profil de risque") || s.includes("diagnostic")) return "Diagnostic";
  if (s.includes("simulateur") || s.includes("simulation") || f.includes("simulation")) return "Simulateur";
  if (s.includes("bilan patrimonial")) return "Bilan patrimonial";
  if (s.includes("ressource") || s.includes("guide") || s.includes("pdf") || s.includes("téléchargement")) return "Ressources";
  if (f.includes("téléphone") || f.includes("phone") || f.includes("appel")) return "Appel direct";
  return "Formulaire contact";
}

// ── MetricCard ─────────────────────────────────────────────────────────────────

function MetricCard({
  label, value, delta, icon: Icon, color, suffix = "", tooltip,
}: {
  label: string; value: string; delta?: number | null;
  icon: React.ElementType; color: string; suffix?: string; tooltip?: string;
}) {
  const [showTip, setShowTip] = useState(false);

  const deltaEl = (() => {
    if (delta === undefined) return null;
    if (delta === null) return (
      <span className="flex items-center gap-1 text-[10px]" style={{ color: C_GOLD }}>
        <Zap className="w-3 h-3" /> Nouveau
      </span>
    );
    if (delta > 0) return (
      <span className="flex items-center gap-1 text-[10px]" style={{ color: "hsl(142 55% 52%)" }}>
        <TrendingUp className="w-3 h-3" /> +{delta} %
      </span>
    );
    if (delta < 0) return (
      <span className="flex items-center gap-1 text-[10px]" style={{ color: C_CORAL }}>
        <TrendingDown className="w-3 h-3" /> {delta} %
      </span>
    );
    return (
      <span className="flex items-center gap-1 text-[10px]" style={{ color: T_MUTED }}>
        <Minus className="w-3 h-3" /> Stable
      </span>
    );
  })();

  return (
    <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ ...GLASS }}>
      <div className="flex items-start justify-between">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: cA(color, 0.16), border: `1px solid ${cA(color, 0.28)}` }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <div className="flex items-center gap-1.5">
          {deltaEl}
          {tooltip && (
            <div className="relative">
              <button
                onMouseEnter={() => setShowTip(true)}
                onMouseLeave={() => setShowTip(false)}
                className="w-5 h-5 flex items-center justify-center"
                aria-label="Information"
              >
                <Info className="w-3 h-3" style={{ color: T_MUTED }} />
              </button>
              {showTip && (
                <div
                  className="absolute right-0 top-full mt-1.5 z-20 w-56 rounded-xl px-3 py-2 text-[10px] leading-relaxed"
                  style={{ background: "hsl(224 58% 8%)", border: "1px solid rgba(255,255,255,0.14)", color: T_SECONDARY, boxShadow: "0 8px 28px rgba(0,0,0,0.50)" }}
                >
                  {tooltip}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-medium tracking-widest uppercase" style={{ color: T_MUTED }}>{label}</p>
        <p className="text-[26px] font-heading font-light tabular-nums leading-none mt-1" style={{ color: T_HEADING }}>
          {value}
          {suffix && <span className="text-[14px] ml-1" style={{ color: T_MUTED }}>{suffix}</span>}
        </p>
      </div>
    </div>
  );
}

// ── Skeleton ───────────────────────────────────────────────────────────────────

function Skeleton({ height }: { height: number }) {
  return (
    <div
      className="rounded-xl animate-pulse"
      style={{ height, background: INNER_BG }}
    />
  );
}

// ── ExternalAnalyticsNotice ────────────────────────────────────────────────────

function ExternalAnalyticsNotice() {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl p-6" style={{ ...GLASS }}>
      <div className="flex items-start gap-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: cA(C_GOLD, 0.14), border: `1px solid ${cA(C_GOLD, 0.28)}` }}
        >
          <BarChart2 className="w-5 h-5" style={{ color: C_GOLD }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-[14px] font-medium" style={{ color: T_HEADING }}>
              Analytics de trafic non configurés
            </p>
            <button
              onClick={() => setOpen(!open)}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors"
              style={{ background: cA(C_GOLD, 0.14), color: C_GOLD, border: `1px solid ${cA(C_GOLD, 0.28)}` }}
            >
              <Settings className="w-3 h-3" />
              {open ? "Masquer" : "Comment configurer"}
            </button>
          </div>
          <p className="text-[12px] font-light mt-1 leading-relaxed" style={{ color: T_SECONDARY }}>
            Les métriques de visiteurs uniques, sessions, pages vues et performances CTA nécessitent un fournisseur analytics externe. Les données affichées ci-dessus sont issues des leads Supabase uniquement.
          </p>

          {open && (
            <div className="mt-5 space-y-4">
              <p className="text-[11px] font-medium" style={{ color: T_HEADING }}>
                Recommandé — Plausible Analytics (open-source, RGPD-natif, 9 €/mois)
              </p>
              <div
                className="rounded-xl px-4 py-3 font-mono text-[10px] leading-loose overflow-x-auto"
                style={{ background: INNER_BG, border: `1px solid ${INNER_BORDER}`, color: T_SECONDARY, whiteSpace: "pre" }}
              >
                {`# .env.local — jamais commité, jamais dans le bundle client\nVITE_ANALYTICS_PROVIDER=plausible\nVITE_PLAUSIBLE_DOMAIN=kanti.fr\nVITE_ANALYTICS_API_URL=https://plausible.io\nANALYTICS_API_KEY=<clé_api>   # Vercel env uniquement`}
              </div>

              <p className="text-[11px] font-medium" style={{ color: T_HEADING }}>
                Alternative — PostHog (événements granulaires, self-hostable)
              </p>
              <div
                className="rounded-xl px-4 py-3 font-mono text-[10px] leading-loose overflow-x-auto"
                style={{ background: INNER_BG, border: `1px solid ${INNER_BORDER}`, color: T_SECONDARY, whiteSpace: "pre" }}
              >
                {`VITE_ANALYTICS_PROVIDER=posthog\nVITE_POSTHOG_KEY=phc_...      # safe côté client\nVITE_POSTHOG_HOST=https://eu.posthog.com`}
              </div>

              <div className="flex items-center gap-4">
                <a
                  href="https://plausible.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium"
                  style={{ color: C_BLUE }}
                >
                  Plausible.io <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://posthog.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium"
                  style={{ color: C_TEAL }}
                >
                  PostHog.com <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── ConversionFunnel ───────────────────────────────────────────────────────────

function ConversionFunnel({ leads }: { leads: Lead[] }) {
  const total    = leads.length;
  const appele   = leads.filter(l => l.status === "appele" || l.status === "traite" || l.status === "converti").length;
  const traite   = leads.filter(l => l.status === "traite" || l.status === "converti").length;
  const converti = leads.filter(l => l.status === "converti").length;

  const steps = [
    { label: "Lead reçu",  count: total,    color: C_BLUE, Icon: Inbox     },
    { label: "Contacté",   count: appele,   color: C_TEAL, Icon: Activity  },
    { label: "Traité",     count: traite,   color: C_GOLD, Icon: FileText  },
    { label: "Converti",   count: converti, color: C_SAGE, Icon: Target    },
  ];

  if (total === 0) return (
    <div className="flex items-center justify-center h-36">
      <p className="text-[12px]" style={{ color: T_MUTED }}>Aucun lead sur la période</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-1">
      {steps.map((step, i) => {
        const pct = Math.round((step.count / total) * 100);
        const passRate = i === 0 ? null
          : steps[i - 1].count === 0 ? 0
          : Math.round((step.count / steps[i - 1].count) * 100);

        return (
          <div key={step.label}>
            {i > 0 && (
              <div className="flex items-center gap-1.5 pl-5 my-0.5">
                <ArrowRight className="w-3 h-3" style={{ color: T_MUTED, opacity: 0.35 }} />
                {passRate !== null && (
                  <span className="text-[9px]" style={{ color: T_MUTED }}>{passRate} % de passage</span>
                )}
              </div>
            )}
            <div className="flex items-center gap-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: cA(step.color, 0.16), border: `1px solid ${cA(step.color, 0.28)}` }}
              >
                <step.Icon className="w-3.5 h-3.5" style={{ color: step.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-medium" style={{ color: T_HEADING }}>{step.label}</span>
                  <span className="text-[11px] tabular-nums font-medium" style={{ color: step.color }}>
                    {fmtNum(step.count)}
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: INNER_BG }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: step.color, opacity: 0.78, transition: "width 700ms ease" }}
                  />
                </div>
              </div>
              <span className="text-[10px] w-9 text-right tabular-nums" style={{ color: T_MUTED }}>{pct} %</span>
            </div>
          </div>
        );
      })}

      <div className="mt-3 pt-3 flex items-center gap-2" style={{ borderTop: `1px solid ${INNER_BORDER}` }}>
        <span className="text-[10px]" style={{ color: T_MUTED }}>Taux de conversion global</span>
        <span className="ml-auto text-[13px] font-medium tabular-nums" style={{ color: C_SAGE }}>
          {total === 0 ? "—" : fmtPct((converti / total) * 100, 1)}
        </span>
      </div>
    </div>
  );
}

// ── LeadSourcesChart ───────────────────────────────────────────────────────────

function LeadSourcesChart({ leads }: { leads: Lead[] }) {
  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach(l => {
      const src = getLeadSource(l);
      counts[src] = (counts[src] ?? 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [leads]);

  if (data.length === 0) return (
    <div className="flex items-center justify-center h-40">
      <p className="text-[12px]" style={{ color: T_MUTED }}>Aucune donnée</p>
    </div>
  );

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="flex gap-5 items-center">
      <div className="flex-shrink-0" style={{ width: 148, height: 148 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={44}
              outerRadius={68}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={SOURCE_COLORS[entry.name] ?? C_MAUVE}
                  fillOpacity={0.85}
                />
              ))}
            </Pie>
            <RechartsTooltip
              contentStyle={RC_CONTENT_STYLE}
              labelStyle={RC_LABEL_STYLE}
              itemStyle={RC_ITEM_STYLE}
              formatter={(v: number) => [`${v} lead${v > 1 ? "s" : ""}`, ""]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex-1 space-y-2.5">
        {data.map(d => (
          <div key={d.name} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: SOURCE_COLORS[d.name] ?? C_MAUVE }}
            />
            <span className="text-[11px] flex-1 truncate" style={{ color: T_SECONDARY }}>{d.name}</span>
            <span className="text-[11px] tabular-nums font-medium" style={{ color: T_HEADING }}>{d.value}</span>
            <span className="text-[10px] w-9 text-right tabular-nums" style={{ color: T_MUTED }}>
              {fmtPct((d.value / total) * 100, 0)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── ArticlePerformance ─────────────────────────────────────────────────────────

function ArticlePerformance({
  articles,
}: {
  articles: { id: string; title: string; views: number; likes: number }[];
}) {
  const top = useMemo(
    () => [...articles]
      .filter(a => a.views > 0)
      .sort((a, b) => b.views - a.views)
      .slice(0, 7)
      .map(a => ({
        name:  a.title.length > 24 ? `${a.title.slice(0, 24)}…` : a.title,
        vues:  a.views,
        likes: a.likes,
      })),
    [articles]
  );

  if (top.length === 0) return (
    <div className="flex items-center justify-center h-36">
      <p className="text-[12px]" style={{ color: T_MUTED }}>Aucune vue enregistrée</p>
    </div>
  );

  return (
    <div style={{ height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={top}
          layout="vertical"
          margin={{ top: 0, right: 24, bottom: 0, left: 0 }}
          barCategoryGap="28%"
        >
          <CartesianGrid strokeDasharray="3 5" horizontal={false} stroke={RC_GRID_STROKE} />
          <XAxis
            type="number"
            tick={RC_TICK_STYLE}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ ...RC_TICK_STYLE, width: 130 }}
            width={138}
            axisLine={false}
            tickLine={false}
          />
          <RechartsTooltip
            contentStyle={RC_CONTENT_STYLE}
            labelStyle={RC_LABEL_STYLE}
            itemStyle={RC_ITEM_STYLE}
            cursor={RC_CURSOR_STYLE}
            formatter={(v: number, name: string) => [fmtNum(v), name]}
          />
          <Bar dataKey="vues"  name="Vues"  fill={C_BLUE} fillOpacity={0.78} radius={[0, 5, 5, 0]} barSize={9}  />
          <Bar dataKey="likes" name="Likes" fill={C_GOLD} fillOpacity={0.72} radius={[0, 5, 5, 0]} barSize={5}  />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── DiagnosticPanel ────────────────────────────────────────────────────────────

function DiagnosticPanel({ leads }: { leads: Lead[] }) {
  const diagLeads = useMemo(
    () => leads.filter(l => (l.sujet ?? "").toLowerCase().includes("profil de risque")),
    [leads]
  );

  const counts = useMemo(() => ({
    total:     diagLeads.length,
    traitement:diagLeads.filter(l => l.status === "appele" || l.status === "traite").length,
    converti:  diagLeads.filter(l => l.status === "converti").length,
    archive:   diagLeads.filter(l => l.status === "archive").length,
  }), [diagLeads]);

  const convRate = counts.total === 0 ? 0 : (counts.converti / counts.total) * 100;

  if (counts.total === 0) return (
    <div className="flex items-center justify-center h-28">
      <p className="text-[12px]" style={{ color: T_MUTED }}>Aucun diagnostic soumis sur la période</p>
    </div>
  );

  const statuses = [
    { label: "Soumis",        count: counts.total,     color: C_BLUE },
    { label: "En traitement", count: counts.traitement, color: C_GOLD },
    { label: "Convertis",     count: counts.converti,   color: C_SAGE },
    { label: "Archivés",      count: counts.archive,    color: T_MUTED },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2.5">
        {statuses.map(s => (
          <div
            key={s.label}
            className="rounded-xl px-3 py-2.5"
            style={{ background: INNER_BG, border: `1px solid ${INNER_BORDER}` }}
          >
            <p className="text-[10px]" style={{ color: T_MUTED }}>{s.label}</p>
            <p className="text-[20px] font-heading font-light tabular-nums mt-0.5" style={{ color: s.color }}>
              {fmtNum(s.count)}
            </p>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px]" style={{ color: T_MUTED }}>Taux de conversion post-diagnostic</span>
          <span className="text-[12px] font-medium tabular-nums" style={{ color: C_SAGE }}>
            {fmtPct(convRate, 0)}
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: INNER_BG }}>
          <div
            className="h-full rounded-full"
            style={{ width: `${convRate}%`, background: C_SAGE, opacity: 0.78, transition: "width 700ms ease" }}
          />
        </div>
      </div>

      <p className="text-[10px] leading-relaxed rounded-lg px-2.5 py-2"
        style={{ background: INNER_BG, border: `1px solid ${INNER_BORDER}`, color: T_MUTED }}>
        Données basées sur les leads soumis après le diagnostic patrimonial. Le suivi par étape nécessite un outil de tracking d'événements.
      </p>
    </div>
  );
}

// ── PrivacyStatusCard ──────────────────────────────────────────────────────────

function PrivacyStatusCard() {
  const checks = [
    {
      ok:     true,
      label:  "Authentification requise — routes admin",
      detail: "ProtectedRoute vérifie la session Supabase + table admin_users côté serveur",
    },
    {
      ok:     true,
      label:  "Données sensibles hors analytics",
      detail: "Aucun nom, email ou donnée patrimoniale envoyé à un outil tiers",
    },
    {
      ok:     true,
      label:  "Clés privées hors bundle client",
      detail: "service_role uniquement dans les Edge Functions Vercel (non exposé au navigateur)",
    },
    {
      ok:     false,
      label:  "Fournisseur analytics configuré",
      detail: "Aucun VITE_ANALYTICS_PROVIDER détecté — données de trafic non collectées",
      warn:   false,
    },
    {
      ok:     false,
      label:  "Gestionnaire de consentement vérifié",
      detail: "CookieBanner présent mais non testé avec analytics actif — à valider après intégration",
      warn:   true,
    },
  ];

  const passed = checks.filter(c => c.ok).length;
  const total  = checks.length;
  const allOk  = passed === total;
  const someOk = passed > 0;

  const statusColor = allOk ? C_SAGE : someOk ? C_GOLD : C_CORAL;
  const statusLabel = allOk ? "Configuré" : someOk ? "Partiel" : "Incomplet";
  const StatusIcon  = allOk ? CheckCircle2 : someOk ? AlertCircle : XCircle;

  return (
    <div className="rounded-2xl p-5" style={{ ...GLASS }}>
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: cA(C_TEAL, 0.16), border: `1px solid ${cA(C_TEAL, 0.28)}` }}
        >
          <ShieldCheck className="w-4 h-4" style={{ color: C_TEAL }} />
        </div>
        <p className="text-[14px] font-medium" style={{ color: T_HEADING }}>Tracking & RGPD</p>
        <div
          className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium"
          style={{ background: cA(statusColor, 0.14), color: statusColor, border: `1px solid ${cA(statusColor, 0.30)}` }}
        >
          <StatusIcon className="w-3 h-3" />
          {statusLabel}
        </div>
      </div>

      <div className="space-y-2.5">
        {checks.map((c, i) => (
          <div key={i} className="flex items-start gap-2.5">
            {c.ok
              ? <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: C_SAGE }} />
              : c.warn
                ? <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: C_GOLD }} />
                : <XCircle     className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: C_CORAL }} />
            }
            <div>
              <p className="text-[11px] font-medium" style={{ color: T_HEADING }}>{c.label}</p>
              <p className="text-[10px] font-light" style={{ color: T_MUTED }}>{c.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <p
        className="mt-4 text-[10px] leading-relaxed rounded-lg px-3 py-2"
        style={{ background: INNER_BG, border: `1px solid ${INNER_BORDER}`, color: T_MUTED }}
      >
        Statut technique indicatif — la conformité juridique RGPD requiert une validation par un délégué à la protection des données (DPO).
      </p>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function AdminAnalytics() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rangeParam = parseInt(searchParams.get("range") ?? "30", 10);
  const range = RANGE_OPTIONS.find(r => r.value === rangeParam)?.value ?? 30;
  const setRange = (d: number) => setSearchParams({ range: String(d) }, { replace: true });

  const { data: leads    = [], isLoading: leadsLoading    } = useQuery({ queryKey: ["leads"],    queryFn: getLeads    });
  const { data: articles = [], isLoading: articlesLoading } = useQuery({ queryKey: ["articles"], queryFn: getArticles });
  const isLoading = leadsLoading || articlesLoading;

  const currentLeads  = useMemo(() => filterByPeriod(leads, range, 0), [leads, range]);
  const previousLeads = useMemo(() => filterByPeriod(leads, range, 1), [leads, range]);

  const kpis = useMemo(() => {
    const c  = currentLeads.length;
    const p  = previousLeads.length;
    const cc = currentLeads .filter(l => l.status === "converti").length;
    const pc = previousLeads.filter(l => l.status === "converti").length;
    const ac = currentLeads .filter(l => l.status === "nouveau" || l.status === "appele").length;
    const ap = previousLeads.filter(l => l.status === "nouveau" || l.status === "appele").length;
    const tc = c === 0 ? 0 : Math.round((cc / c) * 100);
    const tp = p === 0 ? 0 : Math.round((pc / p) * 100);
    return {
      total:   { value: c,  delta: calcDelta(c,  p)  },
      converti:{ value: cc, delta: calcDelta(cc, pc)  },
      taux:    { value: tc, delta: calcDelta(tc, tp)  },
      actifs:  { value: ac, delta: calcDelta(ac, ap)  },
    };
  }, [currentLeads, previousLeads]);

  const rangeLabel = RANGE_OPTIONS.find(r => r.value === range)?.label ?? "30 j";

  return (
    <div className="min-h-screen pb-16">

      {/* Header */}
      <div className="px-8 pt-10 pb-6 max-w-6xl mx-auto">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-[26px] font-heading font-light tracking-tight mb-1" style={{ color: T_PRIMARY }}>
              Analytics & Tracking
            </h1>
            <p className="text-[12px] font-light" style={{ color: T_SECONDARY }}>
              Suivez la performance de votre site et l'expérience client
            </p>
          </div>

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
                  border:     range === opt.value
                    ? `1px solid ${cA(C_BLUE, 0.40)}`
                    : "1px solid transparent",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-8 max-w-6xl mx-auto space-y-5">

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Leads reçus"
            value={isLoading ? "—" : fmtNum(kpis.total.value)}
            delta={isLoading ? undefined : kpis.total.delta}
            icon={Inbox}
            color={C_BLUE}
            tooltip={`Total des leads soumis sur les derniers ${rangeLabel}. Comparé à la période précédente de même durée.`}
          />
          <MetricCard
            label="Convertis"
            value={isLoading ? "—" : fmtNum(kpis.converti.value)}
            delta={isLoading ? undefined : kpis.converti.delta}
            icon={Target}
            color={C_SAGE}
            tooltip="Leads ayant atteint le statut « Converti » sur la période sélectionnée."
          />
          <MetricCard
            label="Taux de conversion"
            value={isLoading ? "—" : fmtNum(kpis.taux.value)}
            delta={isLoading ? undefined : kpis.taux.delta}
            icon={TrendingUp}
            color={C_TEAL}
            suffix="%"
            tooltip="Leads convertis / leads totaux reçus sur la période."
          />
          <MetricCard
            label="Leads actifs"
            value={isLoading ? "—" : fmtNum(kpis.actifs.value)}
            delta={isLoading ? undefined : kpis.actifs.delta}
            icon={Activity}
            color={C_GOLD}
            tooltip="Leads au statut « Nouveau » ou « Appelé » — en attente de traitement."
          />
        </div>

        {/* Volume chart */}
        <div className="rounded-2xl p-5" style={{ ...GLASS }}>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <p className="text-[14px] font-medium" style={{ color: T_HEADING }}>Évolution des leads</p>
            <div className="flex items-center gap-5">
              <span className="flex items-center gap-1.5 text-[10px]" style={{ color: T_SECONDARY }}>
                <span className="inline-block w-5 rounded" style={{ height: 2, background: "hsl(218 45% 58%)" }} />
                Total
              </span>
              <span className="flex items-center gap-1.5 text-[10px]" style={{ color: T_SECONDARY }}>
                <span className="inline-block w-5 rounded" style={{ height: 1, border: "1px dashed hsl(142 50% 48%)" }} />
                Convertis
              </span>
            </div>
          </div>
          {isLoading
            ? <Skeleton height={148} />
            : <VolumeChart leads={currentLeads} days={range} height={148} showConverti />
          }
        </div>

        {/* Row: Funnel + Sources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-2xl p-5" style={{ ...GLASS }}>
            <p className="text-[14px] font-medium mb-4" style={{ color: T_HEADING }}>Tunnel de conversion</p>
            {isLoading ? <Skeleton height={180} /> : <ConversionFunnel leads={currentLeads} />}
          </div>
          <div className="rounded-2xl p-5" style={{ ...GLASS }}>
            <p className="text-[14px] font-medium mb-4" style={{ color: T_HEADING }}>Sources de leads</p>
            {isLoading ? <Skeleton height={148} /> : <LeadSourcesChart leads={currentLeads} />}
          </div>
        </div>

        {/* Row: Articles + Diagnostic */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-2xl p-5" style={{ ...GLASS }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[14px] font-medium" style={{ color: T_HEADING }}>Articles les plus lus</p>
              <span className="flex items-center gap-1 text-[10px]" style={{ color: T_MUTED }}>
                <Eye className="w-3 h-3" /> Vues cumulées
              </span>
            </div>
            {articlesLoading ? <Skeleton height={200} /> : <ArticlePerformance articles={articles} />}
          </div>
          <div className="rounded-2xl p-5" style={{ ...GLASS }}>
            <p className="text-[14px] font-medium mb-4" style={{ color: T_HEADING }}>Suivi du diagnostic patrimonial</p>
            {isLoading ? <Skeleton height={180} /> : <DiagnosticPanel leads={currentLeads} />}
          </div>
        </div>

        {/* External analytics notice */}
        <ExternalAnalyticsNotice />

        {/* RGPD */}
        <PrivacyStatusCard />

      </div>
    </div>
  );
}
