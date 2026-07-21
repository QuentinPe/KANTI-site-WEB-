import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  FileText, Users, BookOpen, Inbox, ArrowRight, Clock, Maximize2, X,
  HelpCircle, Download, CheckCircle2, AlertCircle, Settings,
} from "lucide-react";
import { getArticles } from "@/lib/articlesService";
import { getLeads, exportLeadsCSV } from "@/lib/leadsService";
import type { Lead } from "@/lib/leadsService";
import { getCasClients } from "@/lib/casClientsService";
import { getRessources } from "@/lib/ressourcesService";
import {
  VolumeChart, StatusBars, bucketLeadsByDay, PERIODS,
} from "@/components/admin/LeadsVolumeChart";
import type { PeriodKey } from "@/components/admin/LeadsVolumeChart";
import { useAuth } from "@/contexts/AuthContext";

// ── Constants ─────────────────────────────────────────────────────────────────

const PAGE_BG = "hsl(220 25% 97%)";

const CARD_STYLE: React.CSSProperties = {
  background: "white",
  border: "1px solid hsl(224 20% 12% / 0.08)",
  boxShadow: "0 2px 8px -4px hsl(224 60% 12% / 0.06)",
};
const CARD_HOVER_SHADOW = "0 12px 32px -8px hsl(224 60% 12% / 0.14)";

const LEAD_SOURCES = [
  { label: "Bilan patrimonial", test: (s: string) => /bilan|patrimoni/i.test(s), color: "hsl(218 55% 42%)" },
  { label: "Gestion",           test: (s: string) => /gestion/i.test(s),          color: "hsl(258 55% 52%)" },
  { label: "Immobilier",        test: (s: string) => /immobilier|immo/i.test(s),   color: "hsl(38 75% 42%)"  },
  { label: "Transmission",      test: (s: string) => /transmission|succession|pr[eé]voyance/i.test(s), color: "hsl(162 50% 38%)" },
  { label: "Autre",             test: (_: string) => true,                         color: "hsl(224 20% 62%)" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtRelative(iso: string): string {
  try {
    const diff = Math.round((new Date(iso).getTime() - Date.now()) / 86400000);
    return new Intl.RelativeTimeFormat("fr", { numeric: "auto" }).format(diff, "day");
  } catch {
    return iso.slice(0, 10);
  }
}

function get7DayCounts(items: { created_at: string }[]): number[] {
  const now = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    const day = d.toISOString().slice(0, 10);
    return items.filter((x) => x.created_at.slice(0, 10) === day).length;
  });
}

function getWeekDelta(items: { created_at: string }[]): { pct: number | null } {
  const now = Date.now();
  const thisWeek = items.filter((x) => (now - new Date(x.created_at).getTime()) / 86400000 < 7).length;
  const lastWeek = items.filter((x) => {
    const d = (now - new Date(x.created_at).getTime()) / 86400000;
    return d >= 7 && d < 14;
  }).length;
  return { pct: lastWeek === 0 ? null : Math.round(((thisWeek - lastWeek) / lastWeek) * 100) };
}

// ── Micro-components ──────────────────────────────────────────────────────────

function RingProgress({ pct, color, size = 48 }: { pct: number; color: string; size?: number }) {
  const r = size / 2 - 5;
  const circ = 2 * Math.PI * r;
  const filled = (Math.min(Math.max(pct, 0), 100) / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }} aria-hidden>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="hsl(224 20% 12% / 0.09)" strokeWidth={4} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={4}
        strokeDasharray={`${filled.toFixed(1)} ${circ.toFixed(1)}`}
        strokeLinecap="round" />
    </svg>
  );
}

function MiniSparkline({ vals, color, gradId }: { vals: number[]; color: string; gradId: string }) {
  const max = Math.max(...vals, 1);
  const W = 68, H = 26, P = 2;
  const n = vals.length;
  const pts = vals.map((v, i) => ({
    x: P + (i / Math.max(n - 1, 1)) * (W - P * 2),
    y: H - P - (v / max) * (H - P * 2),
  }));
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = `${d} L${pts[n - 1].x.toFixed(1)},${H} L${pts[0].x.toFixed(1)},${H}Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: 68, height: 26 }} aria-hidden>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[n - 1].x} cy={pts[n - 1].y} r="2" fill={color} />
    </svg>
  );
}

function DeltaBadge({ pct }: { pct: number | null }) {
  if (pct === null) return null;
  const up = pct >= 0;
  return (
    <span
      className="inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full"
      style={{
        background: up ? "hsl(142 55% 38% / 0.10)" : "hsl(0 65% 48% / 0.10)",
        color: up ? "hsl(142 50% 30%)" : "hsl(0 60% 40%)",
      }}
    >
      {up ? "↑" : "↓"}{Math.abs(pct)}%
    </span>
  );
}

// ── KPI Card ──────────────────────────────────────────────────────────────────

function KpiCard({
  label, value, icon: Icon, color, to, pct, delta, sparkVals, gradId, goalLabel,
}: {
  label: string; value: number; icon: typeof FileText; color: string; to: string;
  pct: number; delta: { pct: number | null }; sparkVals: number[]; gradId: string; goalLabel: string;
}) {
  return (
    <Link
      to={to}
      className="group flex flex-col gap-3.5 rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1"
      style={{
        background: "white",
        border: "1px solid hsl(224 20% 12% / 0.08)",
        boxShadow: "0 4px 20px -6px hsl(224 60% 12% / 0.12)",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = CARD_HOVER_SHADOW; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px -6px hsl(224 60% 12% / 0.12)"; }}
    >
      {/* Accent top stripe */}
      <div style={{ height: 3, background: color, opacity: 0.75 }} />

      <div className="flex flex-col gap-3.5 px-5 pb-5">
        <div className="flex items-start justify-between">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: color + "16" }}>
            <Icon className="w-4 h-4" style={{ color }} strokeWidth={1.5} />
          </div>
          <div className="relative flex items-center justify-center" style={{ width: 46, height: 46 }}>
            <RingProgress pct={pct} color={color} size={46} />
            <span className="absolute text-[9px] font-bold tabular-nums leading-none"
              style={{ color }}>{Math.round(pct)}%</span>
          </div>
        </div>
        <div>
          <p className="text-[32px] font-heading font-light tabular-nums leading-none"
            style={{ color: "hsl(224 55% 12%)" }}>{value}</p>
          <p className="text-[11px] font-medium tracking-wide mt-0.5"
            style={{ color: "hsl(224 20% 52%)" }}>{label}</p>
        </div>
        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-1">
            <DeltaBadge pct={delta.pct} />
            <p className="text-[9px] font-light leading-none" style={{ color: "hsl(224 15% 62%)" }}>
              {goalLabel}
            </p>
          </div>
          <MiniSparkline vals={sparkVals} color={color} gradId={gradId} />
        </div>
      </div>
    </Link>
  );
}

// ── Donut chart ───────────────────────────────────────────────────────────────

function DonutChart({ segments }: { segments: { label: string; count: number; color: string }[] }) {
  const total = segments.reduce((s, seg) => s + seg.count, 0);
  const SIZE = 112, cx = SIZE / 2, cy = SIZE / 2, r = 38;
  const circ = 2 * Math.PI * r;
  const active = segments.filter((s) => s.count > 0);
  let cum = 0;
  const arcs = active.map((seg) => {
    const frac = seg.count / Math.max(total, 1);
    const arc = { ...seg, frac, startFrac: cum };
    cum += frac;
    return arc;
  });
  return (
    <div className="relative flex-shrink-0" style={{ width: SIZE, height: SIZE }}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ width: SIZE, height: SIZE }}>
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke="hsl(224 20% 12% / 0.07)" strokeWidth={15} />
        {total > 0 && arcs.map((arc, i) => {
          const filled = Math.max(arc.frac * circ - (active.length > 1 ? 2 : 0), 0);
          return (
            <circle key={i} cx={cx} cy={cy} r={r}
              fill="none" stroke={arc.color} strokeWidth={15}
              strokeDasharray={`${filled.toFixed(2)} ${circ.toFixed(2)}`}
              strokeDashoffset={(-(arc.startFrac * circ)).toFixed(2)}
              transform={`rotate(-90, ${cx}, ${cy})`}
              strokeLinecap="butt" />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <p className="text-[18px] font-heading font-light tabular-nums leading-none"
          style={{ color: "hsl(224 55% 12%)" }}>{total}</p>
        <p className="text-[9px] font-light" style={{ color: "hsl(224 15% 58%)" }}>leads</p>
      </div>
    </div>
  );
}

function LeadsChartModal({ leads, onClose }: { leads: Lead[]; onClose: () => void }) {
  const [period, setPeriod] = useState<PeriodKey>("30j");
  const days = PERIODS.find((p) => p.key === period)?.days ?? 30;
  const buckets = useMemo(() => bucketLeadsByDay(leads, days), [leads, days]);
  const totalInPeriod = buckets.reduce((s, b) => s + b.total, 0);
  const convertiInPeriod = buckets.reduce((s, b) => s + b.converti, 0);
  const maxBucket = Math.max(...buckets.map((b) => b.total), 1);
  const tauxConversion = totalInPeriod === 0 ? 0 : Math.round((convertiInPeriod / totalInPeriod) * 100);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "hsl(224 60% 6% / 0.55)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-3xl rounded-2xl overflow-hidden"
        style={{ background: "white", boxShadow: "0 32px 80px -20px hsl(224 60% 12% / 0.22)" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5"
          style={{ borderBottom: "1px solid hsl(224 20% 12% / 0.08)" }}>
          <div>
            <h2 className="text-lg font-heading font-light" style={{ color: "hsl(224 55% 12%)" }}>
              Historique des leads
            </h2>
            <p className="text-[12px] font-light mt-0.5" style={{ color: "hsl(224 15% 52%)" }}>
              {totalInPeriod} leads · {convertiInPeriod} convertis · {tauxConversion}% de conversion
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Period selector */}
            <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: "hsl(220 25% 97%)" }}>
              {PERIODS.map((p) => (
                <button key={p.key} onClick={() => setPeriod(p.key)}
                  className="px-2.5 py-1 rounded-md text-[11px] font-medium transition-all"
                  style={{
                    background: period === p.key ? "white" : "transparent",
                    color: period === p.key ? "hsl(218 48% 38%)" : "hsl(224 15% 52%)",
                    boxShadow: period === p.key ? "0 1px 3px -1px hsl(224 20% 12% / 0.12)" : "none",
                  }}>
                  {p.label}
                </button>
              ))}
            </div>
            <button onClick={onClose} className="p-2 rounded-lg transition-colors hover:bg-[hsl(224_20%_12%/0.06)]">
              <X className="w-4 h-4" style={{ color: "hsl(224 20% 45%)" }} />
            </button>
          </div>
        </div>

        <div className="p-7 space-y-8">
          {/* Volume chart */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-medium tracking-wide uppercase" style={{ color: "hsl(224 15% 52%)" }}>
                Volume de leads reçus
              </p>
              <div className="flex items-center gap-4 text-[10px]" style={{ color: "hsl(224 15% 55%)" }}>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-6 h-0.5 rounded" style={{ background: "hsl(218 45% 42%)" }} /> Total
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-6 rounded" style={{ height: 1, background: "hsl(142 50% 40%)", borderTop: "2px dashed hsl(142 50% 40%)" }} /> Convertis
                </span>
              </div>
            </div>
            <div className="relative" style={{ height: 160 }}>
              <VolumeChart leads={leads} days={days} height={140} showConverti />
              <div className="flex justify-between mt-1 px-1">
                {buckets
                  .filter((_, i) => i === 0 || i === Math.floor(buckets.length / 2) || i === buckets.length - 1)
                  .map((b, i) => (
                    <span key={i} className="text-[9px]" style={{ color: "hsl(224 15% 58%)" }}>{b.label}</span>
                  ))}
              </div>
            </div>
            {/* Mini-stats */}
            <div className="grid grid-cols-4 gap-3 mt-5">
              {[
                { label: "Total période",   value: totalInPeriod },
                { label: "Convertis",       value: convertiInPeriod },
                { label: "Taux conversion", value: `${tauxConversion}%` },
                { label: "Max / jour",      value: maxBucket },
              ].map((s) => (
                <div key={s.label} className="rounded-xl p-3 text-center"
                  style={{ background: "hsl(220 25% 97%)", border: "1px solid hsl(224 20% 12% / 0.07)" }}>
                  <p className="text-xl font-heading font-light tabular-nums" style={{ color: "hsl(224 55% 12%)" }}>{s.value}</p>
                  <p className="text-[10px] font-light mt-0.5" style={{ color: "hsl(224 15% 55%)" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Status breakdown */}
          <div>
            <p className="text-[11px] font-medium tracking-wide uppercase mb-4" style={{ color: "hsl(224 15% 52%)" }}>
              Répartition actuelle
            </p>
            <StatusBars leads={leads} />
          </div>
        </div>
      </div>
    </div>
  );
}


// ── Main Dashboard ────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [chartOpen, setChartOpen] = useState(false);
  const [chartPeriod, setChartPeriod] = useState<PeriodKey>("7j");
  const { user } = useAuth();

  const { data: articles = [] } = useQuery({ queryKey: ["articles"], queryFn: getArticles });
  const { data: leads = [] } = useQuery({ queryKey: ["leads"], queryFn: getLeads });
  const { data: casClients = [] } = useQuery({ queryKey: ["cas-clients-all"], queryFn: getCasClients });
  const { data: ressources = [] } = useQuery({ queryKey: ["ressources"], queryFn: getRessources });

  // KPI deltas + sparklines
  const leadsWeek      = getWeekDelta(leads);
  const articlesWeek   = getWeekDelta(articles);
  const casClientsWeek = getWeekDelta(casClients);
  const ressourcesWeek = getWeekDelta(ressources);
  const leadsSpark     = get7DayCounts(leads);
  const articlesSpark  = get7DayCounts(articles);
  const casClientsSpark = get7DayCounts(casClients);
  const ressourcesSpark = get7DayCounts(ressources);

  // Résumé rapide
  const newLeads = leads.filter((l) => l.status === "nouveau").length;
  const convertedLeads = leads.filter((l) => l.status === "converti").length;
  const conversionRate = leads.length === 0 ? 0 : Math.round((convertedLeads / leads.length) * 100);
  const staleLeads = leads.filter((l) => {
    if (l.status !== "appele") return false;
    return (Date.now() - new Date(l.created_at).getTime()) / 3600000 > 48;
  });

  // Articles this month
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const articlesThisMonth = articles.filter((a) => a.created_at >= monthStart).length;

  // Greeting
  const hour = now.getHours();
  const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";
  const dateStr = now.toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  // Lead sources donut
  const donutSegments = useMemo(() => {
    const counts = LEAD_SOURCES.map((s) => ({ label: s.label, count: 0, color: s.color }));
    leads.forEach((l) => {
      const sujet = l.sujet ?? "";
      const idx = LEAD_SOURCES.findIndex((s) => s.test(sujet));
      if (idx >= 0) counts[idx].count++;
    });
    return counts.filter((s) => s.count > 0);
  }, [leads]);

  // Activity feed (sorted by ISO date)
  const activity = useMemo(() => [
    ...leads.slice(0, 6).map((l) => ({
      icon: Inbox,
      text: `Lead · ${l.nom}`,
      sub: l.sujet ?? l.format ?? "contact",
      time: l.created_at,
      color: "hsl(38 75% 42%)",
      to: "/admin/leads",
    })),
    ...articles.slice(0, 5).map((a) => ({
      icon: FileText,
      text: a.title,
      sub: a.tag ?? "",
      time: a.created_at,
      color: "hsl(218 55% 42%)",
      to: `/admin/articles/${a.id}/edit`,
    })),
  ]
    .sort((a, b) => b.time.localeCompare(a.time))
    .slice(0, 7),
  [leads, articles]);

  // Dynamic task list
  const tasks = useMemo(() => {
    const t: { label: string; detail: string; color: string; to: string; done: boolean }[] = [];
    if (newLeads > 0)
      t.push({ label: `${newLeads} nouveau${newLeads > 1 ? "x" : ""} lead${newLeads > 1 ? "s" : ""}`, detail: "À appeler", color: "hsl(38 80% 48%)", to: "/admin/leads", done: false });
    if (staleLeads.length > 0)
      t.push({ label: `${staleLeads.length} lead${staleLeads.length > 1 ? "s" : ""} à relancer`, detail: "Pas de retour depuis +48 h", color: "hsl(0 60% 50%)", to: "/admin/leads", done: false });
    if (articlesThisMonth === 0)
      t.push({ label: "Publier un article", detail: "Aucun article ce mois-ci", color: "hsl(218 55% 42%)", to: "/admin/articles/new", done: false });
    if (t.length === 0)
      t.push({ label: "Tout est à jour", detail: "Aucune action urgente", color: "hsl(142 52% 36%)", to: "/admin", done: true });
    return t;
  }, [newLeads, staleLeads.length, articlesThisMonth]);

  // Chart data
  const chartDays = PERIODS.find((p) => p.key === chartPeriod)?.days ?? 7;
  const chartBuckets = useMemo(() => bucketLeadsByDay(leads, chartDays), [leads, chartDays]);
  const chartTotal   = chartBuckets.reduce((s, b) => s + b.total, 0);
  const chartConverti = chartBuckets.reduce((s, b) => s + b.converti, 0);

  const lastArticles = articles.slice(0, 4);

  return (
    <div className="min-h-screen" style={{ background: PAGE_BG }}>

      {/* ── Hero banner ── */}
      <div className="relative w-full overflow-hidden" style={{ height: 300 }}>
        <img
          src="/admin-hero.jpg"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.86) saturate(0.80)" }}
        />
        {/* Multi-layer gradient: soft left veil + rich dark bottom */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(to right, hsl(224 40% 8% / 0.28) 0%, transparent 38%),
              linear-gradient(to bottom, transparent 0%, transparent 20%, hsl(224 55% 8% / 0.68) 78%, hsl(224 55% 8% / 0.72) 100%)
            `,
          }}
          aria-hidden
        />

        {/* Bottom vignette → fades photo into page background */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: 80,
            background: `linear-gradient(to top, ${PAGE_BG} 0%, transparent 100%)`,
          }}
        />

        {/* Top-right: floating action buttons */}
        <div className="absolute top-5 right-8 flex items-center gap-2">
          {newLeads > 0 && (
            <Link
              to="/admin/leads"
              className="flex items-center gap-2 px-3.5 py-2 rounded-full text-[11px] font-medium transition-opacity hover:opacity-85"
              style={{
                background: "hsl(38 90% 50% / 0.92)",
                color: "white",
                backdropFilter: "blur(8px)",
                boxShadow: "0 4px 16px -4px hsl(38 80% 40% / 0.40)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {newLeads} nouveau{newLeads > 1 ? "x" : ""} lead{newLeads > 1 ? "s" : ""}
            </Link>
          )}
          <button
            type="button"
            onClick={() => exportLeadsCSV(leads)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-[11px] font-medium transition-opacity hover:opacity-85"
            style={{
              background: "hsl(0 0% 100% / 0.13)",
              color: "white",
              backdropFilter: "blur(8px)",
              border: "1px solid hsl(0 0% 100% / 0.20)",
            }}
          >
            <Download className="w-3.5 h-3.5" />
            Exporter CSV
          </button>
        </div>

        {/* Bottom: greeting + title + email — above the bottom vignette zone */}
        <div className="absolute bottom-0 left-0 right-0 px-8 pb-24 max-w-6xl mx-auto">
          <p
            className="text-[10px] tracking-[0.32em] uppercase font-semibold mb-2"
            style={{ color: "hsl(0 0% 100% / 0.55)" }}
          >
            {greeting} · {dateStr}
          </p>
          <h1
            className="text-[28px] font-heading font-light tracking-tight"
            style={{ color: "white", textShadow: "0 2px 20px hsl(224 60% 6% / 0.45)" }}
          >
            Tableau de bord
          </h1>
          {user?.email && (
            <p className="text-[12px] font-light mt-1" style={{ color: "hsl(0 0% 100% / 0.50)" }}>
              {user.email}
            </p>
          )}
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="px-8 pb-10 max-w-6xl mx-auto mt-0 space-y-5">

        {/* ── 4 KPI cards (floating over photo) ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Articles publiés" value={articles.length}
            icon={FileText} color="hsl(218 55% 42%)" to="/admin/articles"
            pct={Math.min((articles.length / 8) * 100, 100)} delta={articlesWeek}
            sparkVals={articlesSpark} gradId="sp-articles" goalLabel="Obj. mensuel : 8"
          />
          <KpiCard
            label="Leads totaux" value={leads.length}
            icon={Inbox} color="hsl(38 75% 42%)" to="/admin/leads"
            pct={Math.min((leads.length / 20) * 100, 100)} delta={leadsWeek}
            sparkVals={leadsSpark} gradId="sp-leads" goalLabel="Obj. mensuel : 20"
          />
          <KpiCard
            label="Cas clients" value={casClients.length}
            icon={Users} color="hsl(142 55% 38%)" to="/admin/cas-clients"
            pct={Math.min((casClients.length / 10) * 100, 100)} delta={casClientsWeek}
            sparkVals={casClientsSpark} gradId="sp-cas" goalLabel="Obj. mensuel : 10"
          />
          <KpiCard
            label="Ressources PDF" value={ressources.length}
            icon={BookOpen} color="hsl(258 55% 52%)" to="/admin/ressources"
            pct={Math.min((ressources.length / 10) * 100, 100)} delta={ressourcesWeek}
            sparkVals={ressourcesSpark} gradId="sp-res" goalLabel="Obj. mensuel : 10"
          />
        </div>

        {/* ── Lead chart + Résumé + Actions ── */}
        <div className="grid lg:grid-cols-3 gap-4">

          {/* Lead volume chart */}
          <div className="lg:col-span-2 rounded-2xl p-6" style={{ ...CARD_STYLE }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <div className="w-1 h-3.5 rounded-full" style={{ background: "hsl(218 55% 42%)" }} />
                  <p className="text-[12px] font-medium tracking-wide" style={{ color: "hsl(224 40% 28%)" }}>
                    Leads sur la période
                  </p>
                </div>
                <p className="text-[11px] font-light pl-3" style={{ color: "hsl(224 15% 55%)" }}>
                  {chartTotal} reçus · {chartConverti} convertis
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 p-1 rounded-lg" style={{ background: "hsl(220 25% 96%)" }}>
                  {PERIODS.slice(0, 4).map((p) => (
                    <button key={p.key} onClick={() => setChartPeriod(p.key)}
                      className="px-2.5 py-1 rounded-md text-[11px] font-medium transition-all duration-150"
                      style={{
                        background: chartPeriod === p.key ? "white" : "transparent",
                        color: chartPeriod === p.key ? "hsl(218 48% 38%)" : "hsl(224 15% 52%)",
                        boxShadow: chartPeriod === p.key ? "0 1px 3px -1px hsl(224 20% 12% / 0.10)" : "none",
                      }}>
                      {p.label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setChartOpen(true)}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: "hsl(224 20% 55%)" }}
                  title="Agrandir"
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(224 20% 12% / 0.06)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div style={{ height: 120 }}>
              <VolumeChart leads={leads} days={chartDays} height={108} showConverti />
            </div>
            <div className="flex justify-between mt-1.5 px-0.5">
              {chartBuckets
                .filter((_, i, arr) => i === 0 || i === Math.floor(arr.length / 2) || i === arr.length - 1)
                .map((b, i) => (
                  <span key={i} className="text-[9px] tabular-nums" style={{ color: "hsl(224 12% 62%)" }}>
                    {b.label}
                  </span>
                ))}
            </div>
            <div className="flex items-center gap-4 mt-3 pt-3"
              style={{ borderTop: "1px solid hsl(224 20% 12% / 0.06)" }}>
              <span className="flex items-center gap-1.5 text-[10px]" style={{ color: "hsl(224 15% 55%)" }}>
                <span className="inline-block w-5 rounded" style={{ height: 2, background: "hsl(218 45% 42%)" }} />
                Total
              </span>
              <span className="flex items-center gap-1.5 text-[10px]" style={{ color: "hsl(224 15% 55%)" }}>
                <span className="inline-block w-5 rounded" style={{ height: 1, border: "1px dashed hsl(142 50% 40%)" }} />
                Convertis
              </span>
            </div>
          </div>

          {/* Résumé + Actions */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl p-5" style={{ ...CARD_STYLE }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-3.5 rounded-full" style={{ background: "hsl(218 55% 42%)" }} />
                <p className="text-[12px] font-medium tracking-wide" style={{ color: "hsl(224 40% 28%)" }}>
                  Résumé rapide
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Nouveaux leads",  value: newLeads,             color: "hsl(38 80% 48%)"  },
                  { label: "À relancer",       value: staleLeads.length,    color: "hsl(0 60% 50%)"   },
                  { label: "Taux conversion",  value: `${conversionRate}%`, color: "hsl(142 52% 36%)" },
                  { label: "Convertis",        value: convertedLeads,       color: "hsl(218 55% 42%)" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl p-3 overflow-hidden"
                    style={{
                      background: "hsl(220 25% 97%)",
                      border: "1px solid hsl(224 20% 12% / 0.07)",
                      borderLeft: `3px solid ${s.color}`,
                    }}>
                    <p className="text-[22px] font-heading font-light tabular-nums leading-none"
                      style={{ color: s.color }}>{s.value}</p>
                    <p className="text-[10px] font-light leading-tight mt-0.5"
                      style={{ color: "hsl(224 15% 52%)" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-5" style={{ ...CARD_STYLE }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-3.5 rounded-full" style={{ background: "hsl(218 55% 42%)" }} />
                <p className="text-[12px] font-medium tracking-wide" style={{ color: "hsl(224 40% 28%)" }}>
                  Actions rapides
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                {[
                  { to: "/admin/articles/new",  label: "Nouvel article",   icon: FileText   },
                  { to: "/admin/leads",          label: "Voir les leads",   icon: Inbox      },
                  { to: "/admin/faq/new",        label: "Nouvelle FAQ",     icon: HelpCircle },
                  { to: "/admin/site-settings",  label: "Paramètres site",  icon: Settings   },
                ].map(({ to, label, icon: Icon }) => (
                  <Link key={to} to={to}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[12px] font-medium transition-all duration-150"
                    style={{ color: "hsl(224 40% 32%)", background: "hsl(220 20% 97%)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(224 60% 18% / 0.07)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(220 20% 97%)"; }}>
                    <span className="flex items-center gap-2.5">
                      <Icon className="w-3.5 h-3.5" strokeWidth={1.5} style={{ color: "hsl(224 40% 48%)" }} />
                      {label}
                    </span>
                    <ArrowRight className="w-3 h-3 opacity-30" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Activité | Pipeline | Derniers articles ── */}
        <div className="grid lg:grid-cols-3 gap-4">

          {/* Activité récente */}
          <div className="rounded-2xl p-6" style={{ ...CARD_STYLE }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-3.5 rounded-full" style={{ background: "hsl(38 75% 42%)" }} />
                <p className="text-[12px] font-medium tracking-wide" style={{ color: "hsl(224 40% 28%)" }}>
                  Activité récente
                </p>
              </div>
              <Clock className="w-3.5 h-3.5" style={{ color: "hsl(224 15% 62%)" }} />
            </div>
            {activity.length === 0 ? (
              <p className="text-[12px] font-light py-4 text-center" style={{ color: "hsl(224 12% 60%)" }}>
                Aucune activité
              </p>
            ) : (
              <div className="flex flex-col">
                {activity.map((item, i) => (
                  <Link key={i} to={item.to}
                    className="flex items-start gap-2.5 py-2.5 group transition-opacity hover:opacity-70"
                    style={{ borderBottom: i < activity.length - 1 ? "1px solid hsl(224 20% 12% / 0.05)" : "none" }}>
                    {/* Icon badge with initials for leads */}
                    <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5 text-[10px] font-semibold"
                      style={{ background: item.color + "18", color: item.color }}>
                      <item.icon className="w-3 h-3" style={{ color: item.color }} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium truncate leading-tight"
                        style={{ color: "hsl(224 30% 25%)" }}>{item.text}</p>
                      {item.sub && (
                        <p className="text-[10px] font-light truncate" style={{ color: "hsl(224 15% 55%)" }}>
                          {item.sub}
                        </p>
                      )}
                      <p className="text-[9px] mt-0.5" style={{ color: "hsl(224 12% 65%)" }}>
                        {fmtRelative(item.time)}
                      </p>
                    </div>
                    <ArrowRight className="w-3 h-3 flex-shrink-0 mt-1 opacity-0 group-hover:opacity-30 transition-opacity" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Pipeline des leads */}
          <div className="rounded-2xl p-6" style={{ ...CARD_STYLE }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-3.5 rounded-full" style={{ background: "hsl(218 55% 42%)" }} />
                <p className="text-[12px] font-medium tracking-wide" style={{ color: "hsl(224 40% 28%)" }}>
                  Pipeline des leads
                </p>
              </div>
              <Link to="/admin/leads" className="text-[10px] font-medium hover:opacity-75"
                style={{ color: "hsl(218 55% 42%)" }}>
                Voir tout →
              </Link>
            </div>
            {leads.length === 0 ? (
              <p className="text-[12px] font-light py-4 text-center" style={{ color: "hsl(224 12% 60%)" }}>
                Aucun lead
              </p>
            ) : (
              <StatusBars leads={leads} />
            )}
            {leads.length > 0 && (
              <div className="mt-4 pt-3 flex items-center gap-2"
                style={{ borderTop: "1px solid hsl(224 20% 12% / 0.06)" }}>
                <span className="text-[10px] font-medium tabular-nums" style={{ color: "hsl(224 20% 48%)" }}>
                  {leads.length} leads · {conversionRate}% convertis
                </span>
              </div>
            )}
          </div>

          {/* Derniers articles */}
          <div className="rounded-2xl p-6" style={{ ...CARD_STYLE }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-3.5 rounded-full" style={{ background: "hsl(218 55% 42%)" }} />
                <p className="text-[12px] font-medium tracking-wide" style={{ color: "hsl(224 40% 28%)" }}>
                  Derniers articles
                </p>
              </div>
              <Link to="/admin/articles" className="text-[10px] font-medium hover:opacity-75"
                style={{ color: "hsl(218 55% 42%)" }}>
                Voir tout →
              </Link>
            </div>
            {lastArticles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 gap-3">
                <p className="text-[12px] font-light" style={{ color: "hsl(224 12% 60%)" }}>
                  Aucun article publié
                </p>
                <Link to="/admin/articles/new"
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg"
                  style={{ background: "hsl(218 55% 42% / 0.10)", color: "hsl(218 48% 38%)" }}>
                  Créer le premier
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {lastArticles.map((a) => (
                  <Link key={a.id} to={`/admin/articles/${a.id}/edit`}
                    className="flex items-center gap-2.5 group" style={{ textDecoration: "none" }}>
                    {a.image ? (
                      <img src={a.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                    ) : (
                      <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center"
                        style={{ background: "hsl(218 55% 42% / 0.10)" }}>
                        <FileText className="w-4 h-4" style={{ color: "hsl(218 55% 42%)" }} strokeWidth={1.5} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium leading-snug line-clamp-2 group-hover:underline"
                        style={{ color: "hsl(224 30% 25%)" }}>{a.title}</p>
                      <p className="text-[9px] mt-0.5" style={{ color: "hsl(224 12% 62%)" }}>
                        {a.date ?? a.created_at.slice(0, 10)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Sources des leads + Tâches ── */}
        <div className="grid lg:grid-cols-2 gap-4">

          {/* Sources des leads */}
          <div className="rounded-2xl p-6" style={{ ...CARD_STYLE }}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-3.5 rounded-full" style={{ background: "hsl(258 55% 52%)" }} />
              <p className="text-[12px] font-medium tracking-wide" style={{ color: "hsl(224 40% 28%)" }}>
                Sources des leads
              </p>
            </div>
            <div className="flex items-center gap-6">
              <DonutChart
                segments={
                  donutSegments.length > 0
                    ? donutSegments
                    : LEAD_SOURCES.map((s) => ({ label: s.label, count: 0, color: s.color }))
                }
              />
              <div className="flex flex-col gap-2.5 flex-1">
                {(donutSegments.length > 0
                  ? donutSegments
                  : LEAD_SOURCES.map((s) => ({ label: s.label, count: 0, color: s.color }))
                ).map((seg, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: seg.color }} />
                      <span className="text-[11px] font-light" style={{ color: "hsl(224 20% 40%)" }}>
                        {seg.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium tabular-nums" style={{ color: "hsl(224 40% 28%)" }}>
                        {seg.count}
                      </span>
                      {leads.length > 0 && (
                        <span className="text-[10px] tabular-nums w-8 text-right"
                          style={{ color: "hsl(224 15% 58%)" }}>
                          {Math.round((seg.count / leads.length) * 100)}%
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tâches à traiter */}
          <div className="rounded-2xl p-6" style={{ ...CARD_STYLE }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-3.5 rounded-full" style={{ background: "hsl(38 80% 48%)" }} />
                <p className="text-[12px] font-medium tracking-wide" style={{ color: "hsl(224 40% 28%)" }}>
                  Tâches à traiter
                </p>
              </div>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{
                  background: tasks.every((t) => t.done)
                    ? "hsl(142 55% 38% / 0.10)"
                    : "hsl(38 90% 50% / 0.12)",
                  color: tasks.every((t) => t.done)
                    ? "hsl(142 50% 30%)"
                    : "hsl(38 70% 30%)",
                }}>
                {tasks.filter((t) => !t.done).length} en attente
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {tasks.map((task, i) => (
                <Link key={i} to={task.to}
                  className="flex items-start gap-3 px-4 py-3 rounded-xl transition-all duration-150"
                  style={{ background: "hsl(220 25% 97%)", border: `1px solid ${task.color}22` }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(220 20% 94%)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(220 25% 97%)"; }}
                >
                  {task.done ? (
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: task.color }} strokeWidth={1.5} />
                  ) : (
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: task.color }} strokeWidth={1.5} />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium leading-tight" style={{ color: "hsl(224 30% 25%)" }}>
                      {task.label}
                    </p>
                    <p className="text-[10px] font-light mt-0.5" style={{ color: "hsl(224 15% 55%)" }}>
                      {task.detail}
                    </p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 opacity-30" />
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>

      {chartOpen && <LeadsChartModal leads={leads} onClose={() => setChartOpen(false)} />}
    </div>
  );
}
