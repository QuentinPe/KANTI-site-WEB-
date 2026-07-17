import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FileText, Users, BookOpen, HelpCircle, Inbox, ArrowRight, Clock, Maximize2, X } from "lucide-react";
import { getArticles } from "@/lib/articlesService";
import { getLeads } from "@/lib/leadsService";
import type { Lead } from "@/lib/leadsService";
import { getCasClients } from "@/lib/casClientsService";
import { getRessources } from "@/lib/ressourcesService";
import { VolumeChart, StatusBars, bucketLeadsByDay, PERIODS } from "@/components/admin/LeadsVolumeChart";
import type { PeriodKey } from "@/components/admin/LeadsVolumeChart";
import { useAuth } from "@/contexts/AuthContext";

function StatCard({ label, value, sub, icon: Icon, to, color }: {
  label: string; value: string | number; sub?: string;
  icon: typeof FileText; to: string; color: string;
}) {
  return (
    <Link to={to} className="group flex flex-col gap-4 p-6 rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: "white", border: "1px solid hsl(224 20% 12% / 0.08)", boxShadow: "0 2px 8px -4px hsl(224 60% 12% / 0.06)" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px -8px hsl(224 60% 12% / 0.12)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px -4px hsl(224 60% 12% / 0.06)"; }}>
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color + "15" }}>
          <Icon className="w-5 h-5" style={{ color }} strokeWidth={1.5} />
        </div>
        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: "hsl(224 20% 45%)" }} />
      </div>
      <div>
        <p className="text-3xl font-heading font-light tabular-nums leading-none mb-1" style={{ color: "hsl(224 55% 12%)" }}>{value}</p>
        <p className="text-[12px] font-medium tracking-wide" style={{ color: "hsl(224 20% 45%)" }}>{label}</p>
        {sub && <p className="text-[11px] mt-1 font-light" style={{ color: "hsl(224 15% 60%)" }}>{sub}</p>}
      </div>
    </Link>
  );
}

function ActivityItem({ icon: Icon, text, time, color }: {
  icon: typeof FileText; text: string; time: string; color: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3" style={{ borderBottom: "1px solid hsl(224 20% 12% / 0.06)" }}>
      <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5" style={{ background: color + "12" }}>
        <Icon className="w-3.5 h-3.5" style={{ color }} strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-light leading-snug truncate" style={{ color: "hsl(224 30% 25%)" }}>{text}</p>
        <p className="text-[11px] mt-0.5" style={{ color: "hsl(224 15% 58%)" }}>{time}</p>
      </div>
    </div>
  );
}

function fmtDate(iso: string) {
  try {
    return new Intl.RelativeTimeFormat("fr", { numeric: "auto" }).format(
      Math.round((new Date(iso).getTime() - Date.now()) / 86400000), "day"
    );
  } catch {
    return iso.slice(0, 10);
  }
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

function LeadsSparkline({ leads, onExpand }: { leads: Lead[]; onExpand: () => void }) {
  const now = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });

  const counts = days.map((day) => ({
    day,
    count: leads.filter((l) => l.created_at.slice(0, 10) === day).length,
    label: new Date(day + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "short" }).replace(".", ""),
  }));

  const max = Math.max(...counts.map((c) => c.count), 1);
  const W = 200, H = 52, PAD = 4;
  const pts = counts.map((c, i) => ({
    x: PAD + (i / 6) * (W - PAD * 2),
    y: H - PAD - (c.count / max) * (H - PAD * 2 - 6),
  }));
  const polyline = pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = `M${pts[0].x.toFixed(1)},${H} ${pts.map((p) => `L${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")} L${pts[pts.length - 1].x.toFixed(1)},${H} Z`;

  const thisWeek = counts.reduce((s, c) => s + c.count, 0);
  const prevWeek = leads.filter((l) => {
    const diff = (now.getTime() - new Date(l.created_at).getTime()) / 86400000;
    return diff >= 7 && diff < 14;
  }).length;
  const trend = prevWeek === 0 ? null : ((thisWeek - prevWeek) / prevWeek) * 100;

  return (
    <div className="rounded-2xl p-6" style={{ background: "white", border: "1px solid hsl(224 20% 12% / 0.08)" }}>
      <div className="flex items-start justify-between mb-1">
        <div>
          <p className="text-[10px] tracking-[0.22em] uppercase font-medium mb-2" style={{ color: "hsl(224 15% 58%)" }}>
            Leads — 7 derniers jours
          </p>
          <p className="text-2xl font-heading font-light tabular-nums" style={{ color: "hsl(224 55% 12%)" }}>
            {thisWeek}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-1">
          {trend !== null && (
            <span className="text-[11px] font-medium px-2.5 py-1 rounded-full"
              style={{
                background: trend >= 0 ? "hsl(142 55% 38% / 0.10)" : "hsl(0 65% 48% / 0.10)",
                color: trend >= 0 ? "hsl(142 50% 30%)" : "hsl(0 60% 40%)",
              }}>
              {trend >= 0 ? "↑" : "↓"} {Math.abs(Math.round(trend))}% vs sem. préc.
            </span>
          )}
          <button
            onClick={onExpand}
            className="p-1.5 rounded-lg transition-all duration-150"
            style={{ color: "hsl(224 20% 55%)", background: "transparent" }}
            title="Voir l'historique complet"
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(224 20% 12% / 0.07)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full mt-3" style={{ height: 52 }} aria-hidden>
        <defs>
          <linearGradient id="leads-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(218 45% 42%)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="hsl(218 45% 42%)" stopOpacity="0.01" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#leads-grad)" />
        <polyline points={polyline} fill="none" stroke="hsl(218 45% 42%)" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={pts[6].x} cy={pts[6].y} r="2.5" fill="white" stroke="hsl(218 45% 42%)" strokeWidth="1.5" />
      </svg>

      <div className="flex justify-between mt-1.5">
        {counts.map((c, i) => (
          <span key={i} className="text-[9px] capitalize tabular-nums" style={{ color: "hsl(224 12% 65%)" }}>
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* Page background color — must match AdminLayout's main background */
const PAGE_BG = "hsl(220 25% 97%)";

export default function AdminDashboard() {
  const [chartOpen, setChartOpen] = useState(false);
  const { user } = useAuth();
  const { data: articles = [] } = useQuery({ queryKey: ["articles"], queryFn: getArticles });
  const { data: leads = [] } = useQuery({ queryKey: ["leads"], queryFn: getLeads });
  const { data: casClients = [] } = useQuery({ queryKey: ["cas-clients-all"], queryFn: getCasClients });
  const { data: ressources = [] } = useQuery({ queryKey: ["ressources"], queryFn: getRessources });

  const newLeads = leads.filter((l) => l.status === "nouveau").length;
  const convertedLeads = leads.filter((l) => l.status === "converti").length;
  const todayLeads = leads.filter((l) => l.created_at.slice(0, 10) === new Date().toISOString().slice(0, 10)).length;
  const lastArticle = articles[0];

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";
  const dateStr = now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const activity = [
    ...leads.slice(0, 4).map((l) => ({
      icon: Inbox,
      text: `Lead — ${l.nom} (${l.sujet ?? l.format ?? "contact"})`,
      time: fmtDate(l.created_at),
      color: "hsl(38 75% 42%)",
    })),
    ...articles.slice(0, 3).map((a) => ({
      icon: FileText,
      text: `Article — ${a.title}`,
      time: fmtDate(a.created_at),
      color: "hsl(218 55% 42%)",
    })),
  ].slice(0, 7);

  return (
    <div className="min-h-screen" style={{ background: PAGE_BG }}>

      {/* ── Hero banner ── */}
      <div className="relative w-full overflow-hidden" style={{ height: 300 }}>
        {/* Photo */}
        <img
          src="/admin-hero.jpg"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.97) saturate(0.88)" }}
        />

        {/* Soft warm veil — left edge bleeds into sidebar */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to right, hsl(220 30% 96% / 0.35) 0%, transparent 40%)",
          }}
          aria-hidden
        />

        {/* White gradient — bottom fade to page background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, transparent 0%, transparent 28%, ${PAGE_BG} 88%, ${PAGE_BG} 100%)`,
          }}
          aria-hidden
        />

        {/* Title — sits in the gradient transition zone */}
        <div className="absolute bottom-0 left-0 right-0 px-8 pb-7 max-w-5xl mx-auto">
          <p
            className="text-[10px] tracking-[0.32em] uppercase font-semibold mb-2"
            style={{ color: "hsl(224 30% 50%)" }}
          >
            {greeting} · {dateStr}
          </p>
          <h1
            className="text-3xl font-heading font-light tracking-tight"
            style={{ color: "hsl(224 55% 10%)" }}
          >
            Tableau de bord
          </h1>
          {user?.email && (
            <p className="text-[13px] font-light mt-1" style={{ color: "hsl(224 20% 48%)" }}>
              Connecté en tant que <span style={{ color: "hsl(224 40% 30%)" }}>{user.email}</span>
            </p>
          )}
        </div>

        {/* New leads badge — top right of banner */}
        {newLeads > 0 && (
          <Link
            to="/admin/leads"
            className="absolute top-5 right-8 flex items-center gap-2 px-3.5 py-2 rounded-full text-[12px] font-medium transition-opacity hover:opacity-85"
            style={{
              background: "hsl(38 90% 50% / 0.92)",
              color: "white",
              backdropFilter: "blur(8px)",
              boxShadow: "0 4px 16px -4px hsl(38 80% 40% / 0.35)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            {newLeads} nouveau{newLeads > 1 ? "x" : ""} lead{newLeads > 1 ? "s" : ""}
          </Link>
        )}
      </div>

      {/* ── Content ── */}
      <div className="px-8 pb-10 max-w-5xl mx-auto -mt-2 space-y-6">

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Articles publiés" value={articles.length} icon={FileText} to="/admin/articles" color="hsl(218 55% 42%)" />
          <StatCard
            label="Leads totaux"
            value={leads.length}
            sub={`${convertedLeads > 0 ? `${convertedLeads} converti${convertedLeads > 1 ? "s" : ""} · ` : ""}${todayLeads} aujourd'hui`}
            icon={Inbox}
            to="/admin/leads"
            color="hsl(38 75% 42%)"
          />
          <StatCard label="Cas clients" value={casClients.length} icon={Users} to="/admin/cas-clients" color="hsl(142 55% 38%)" />
          <StatCard label="Ressources PDF" value={ressources.length} icon={BookOpen} to="/admin/ressources" color="hsl(218 35% 52%)" />
        </div>

        {/* Sparkline leads */}
        <LeadsSparkline leads={leads} onExpand={() => setChartOpen(true)} />

        {chartOpen && <LeadsChartModal leads={leads} onClose={() => setChartOpen(false)} />}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Activité récente */}
          <div className="lg:col-span-2 rounded-2xl p-6"
            style={{ background: "white", border: "1px solid hsl(224 20% 12% / 0.08)" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[14px] font-medium tracking-wide" style={{ color: "hsl(224 40% 28%)" }}>
                Activité récente
              </h2>
              <Clock className="w-4 h-4" style={{ color: "hsl(224 15% 58%)" }} />
            </div>
            {activity.length === 0 ? (
              <p className="text-[13px] font-light py-6 text-center" style={{ color: "hsl(224 12% 60%)" }}>
                Aucune activité récente
              </p>
            ) : (
              <div>{activity.map((item, i) => <ActivityItem key={i} {...item} />)}</div>
            )}
          </div>

          {/* Raccourcis + dernier article */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl p-6" style={{ background: "white", border: "1px solid hsl(224 20% 12% / 0.08)" }}>
              <h2 className="text-[14px] font-medium tracking-wide mb-4" style={{ color: "hsl(224 40% 28%)" }}>
                Raccourcis
              </h2>
              <div className="flex flex-col gap-2">
                {[
                  { to: "/admin/articles/new", label: "Nouvel article",   icon: FileText   },
                  { to: "/admin/leads",        label: "Voir les leads",   icon: Inbox      },
                  { to: "/admin/faq/new",      label: "Nouvelle FAQ",     icon: HelpCircle },
                ].map(({ to, label, icon: Icon }) => (
                  <Link key={to} to={to}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150"
                    style={{ color: "hsl(224 40% 32%)", background: "hsl(220 20% 97%)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(224 60% 18% / 0.08)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(220 20% 97%)"; }}>
                    <Icon className="w-4 h-4" strokeWidth={1.5} style={{ color: "hsl(224 40% 45%)" }} />
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {lastArticle && (
              <div className="rounded-2xl p-5" style={{ background: "hsl(218 55% 42% / 0.06)", border: "1px solid hsl(218 55% 42% / 0.12)" }}>
                <p className="text-[10px] tracking-[0.22em] uppercase font-medium mb-2" style={{ color: "hsl(218 45% 45%)" }}>
                  Dernier article
                </p>
                <p className="text-[13px] font-light leading-snug mb-3" style={{ color: "hsl(224 40% 22%)" }}>
                  {lastArticle.title}
                </p>
                <div className="flex gap-2">
                  <Link to={`/admin/articles/${lastArticle.id}/edit`}
                    className="text-[11px] font-medium px-3 py-1.5 rounded-lg"
                    style={{ background: "hsl(218 55% 42% / 0.12)", color: "hsl(218 45% 38%)" }}>
                    Modifier
                  </Link>
                  <a href={`/actualites/${lastArticle.slug ?? lastArticle.id}`} target="_blank" rel="noreferrer"
                    className="text-[11px] font-medium px-3 py-1.5 rounded-lg"
                    style={{ background: "hsl(224 20% 12% / 0.06)", color: "hsl(224 20% 45%)" }}>
                    Voir
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
