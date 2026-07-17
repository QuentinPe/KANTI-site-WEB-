import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Search, Download, BarChart3, X, Phone, Mail, ChevronDown,
  Trash2, Filter, Clock, TrendingUp, Users, CheckCircle2, MoreHorizontal,
} from "lucide-react";
import {
  getLeads, updateLeadStatus, updateLeadNotes, deleteLead, exportLeadsCSV,
} from "@/lib/leadsService";
import type { Lead, LeadStatus } from "@/lib/leadsService";
import {
  StatusBars, PipelineHealth, bucketLeadsByDay, PERIODS, STATUS_CONFIG, STATUS_ORDER,
} from "@/components/admin/LeadsVolumeChart";
import type { PeriodKey } from "@/components/admin/LeadsVolumeChart";

/* ─── Config ─── */
const ADVISOR_LABELS: Record<string, string> = {
  quentin: "Quentin Perromat", thomas: "Thomas Robert", any: "Peu importe",
};
const ADVISOR_INITIALS: Record<string, string> = {
  quentin: "QP", thomas: "TR", any: "—",
};
const FORMAT_LABELS: Record<string, string> = {
  cabinet: "En cabinet", visio: "Visioconférence", telephone: "Téléphone",
};
const TIMING_LABELS: Record<string, string> = {
  asap: "Dès que possible", week: "Cette semaine", two_weeks: "Dans 2 semaines", month: "Dans le mois",
};

/* ─── Helpers ─── */
function fmtDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}
function fmtShort(iso: string) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function getInitials(nom: string) {
  return nom.split(" ").map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}
function avatarHue(nom: string) {
  let h = 0;
  for (const c of nom) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
}
function getSource(lead: Lead): string {
  const s = (lead.sujet ?? "").toLowerCase();
  if (s.includes("profil") || s.includes("risque")) return "Profil de risque";
  if (s.includes("retraite")) return "Retraite";
  if (s.includes("assurance")) return "Assurance vie";
  if (s.includes("immo")) return "Immobilier";
  if (s.includes("fiscal") || s.includes("impôt")) return "Fiscalité";
  if (s.includes("dirigeant") || s.includes("société")) return "Dirigeants";
  return "Formulaire contact";
}
function computeScore(lead: Lead): { score: number; level: "Élevé" | "Moyen" | "Faible" } {
  let s = 0;
  if (lead.timing === "asap") s += 50;
  else if (lead.timing === "week") s += 35;
  else if (lead.timing === "two_weeks") s += 20;
  else s += 10;
  if (lead.telephone) s += 20;
  if ((lead.message ?? "").length > 80) s += 15;
  if (lead.format === "cabinet") s += 15;
  const score = Math.min(s, 100);
  return { score, level: score >= 70 ? "Élevé" : score >= 40 ? "Moyen" : "Faible" };
}

/* ─── Multi-line chart with real dates ─── */
function MultiLineChart({ leads, days }: { leads: Lead[]; days: number }) {
  const now = Date.now();
  const useWeeks = days > 60;
  const count = useWeeks ? Math.ceil(days / 7) : days;

  const buckets = useMemo(() => {
    const arr = Array.from({ length: count }, (_, i) => {
      const bucketStart = now - (count - i) * (useWeeks ? 7 : 1) * 86_400_000;
      const bucketEnd = bucketStart + (useWeeks ? 7 : 1) * 86_400_000;
      const d = new Date(bucketEnd - 86_400_000);
      const inBucket = leads.filter((l) => {
        const t = new Date(l.created_at).getTime();
        return t >= bucketStart && t < bucketEnd;
      });
      return {
        label: useWeeks
          ? `S${i + 1}`
          : `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`,
        total: inBucket.length,
        traite: inBucket.filter((l) => l.status === "traite" || l.status === "appele").length,
        converti: inBucket.filter((l) => l.status === "converti").length,
      };
    });
    return arr;
  }, [leads, days, count, useWeeks, now]);

  const maxY = Math.max(...buckets.map((b) => b.total), 1);
  const W = 500, H = 120, padX = 2, padY = 8;

  const line = (key: "total" | "traite" | "converti") => {
    const pts = buckets.map((b, i) => ({
      x: buckets.length === 1 ? W / 2 : padX + (i / (buckets.length - 1)) * (W - padX * 2),
      y: H - padY - (b[key] / maxY) * (H - padY * 2),
    }));
    return {
      path: pts.length < 2 ? "" : `M ${pts[0].x},${pts[0].y} ` + pts.slice(1).map((p) => `L ${p.x},${p.y}`).join(" "),
      area: pts.length < 2 ? "" :
        `M ${pts[0].x},${H} ` + pts.map((p) => `L ${p.x},${p.y}`).join(" ") + ` L ${pts[pts.length - 1].x},${H} Z`,
      pts,
    };
  };

  const totalLine = line("total");
  const traiteLine = line("traite");
  const convertiLine = line("converti");

  const xLabels = buckets.length <= 12
    ? buckets.map((b, i) => ({ label: b.label, i }))
    : [0, Math.floor(count / 4), Math.floor(count / 2), Math.floor(count * 3 / 4), count - 1]
        .map((i) => ({ label: buckets[i]?.label ?? "", i }));

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full" style={{ height: 140 }}>
        <defs>
          <linearGradient id="mlg-total" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(218 55% 50%)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="hsl(218 55% 50%)" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="mlg-traite" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(200 65% 52%)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="hsl(200 65% 52%)" stopOpacity="0.01" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <line key={f} x1={0} y1={H - padY - f * (H - padY * 2)} x2={W} y2={H - padY - f * (H - padY * 2)}
            stroke="hsl(224 20% 12% / 0.05)" strokeWidth="0.8" />
        ))}
        {/* Areas */}
        {totalLine.area && <path d={totalLine.area} fill="url(#mlg-total)" />}
        {traiteLine.area && <path d={traiteLine.area} fill="url(#mlg-traite)" />}
        {/* Lines */}
        {totalLine.path && <path d={totalLine.path} fill="none" stroke="hsl(218 55% 48%)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />}
        {traiteLine.path && <path d={traiteLine.path} fill="none" stroke="hsl(200 65% 52%)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />}
        {convertiLine.path && <path d={convertiLine.path} fill="none" stroke="hsl(142 52% 42%)" strokeWidth="1.4" strokeDasharray="4 2" strokeLinecap="round" />}
        {/* Dots on last point */}
        {totalLine.pts.length > 0 && (
          <circle cx={totalLine.pts[totalLine.pts.length - 1].x} cy={totalLine.pts[totalLine.pts.length - 1].y}
            r="3" fill="white" stroke="hsl(218 55% 48%)" strokeWidth="1.8" />
        )}
      </svg>
      {/* X-axis labels */}
      <div className="relative" style={{ height: 18 }}>
        {xLabels.map(({ label, i }) => (
          <span key={i} className="absolute text-[9px] -translate-x-1/2 tabular-nums"
            style={{ left: `${(i / Math.max(count - 1, 1)) * 100}%`, color: "hsl(224 12% 60%)" }}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Donut chart ─── */
function DonutChart({ leads }: { leads: Lead[] }) {
  const COLORS = ["hsl(218 55% 52%)", "hsl(38 75% 48%)", "hsl(142 50% 42%)", "hsl(280 50% 52%)", "hsl(0 55% 52%)"];
  const groups = useMemo(() => {
    const map = new Map<string, number>();
    leads.forEach((l) => {
      const src = getSource(l);
      map.set(src, (map.get(src) ?? 0) + 1);
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1]).map(([label, count], i) => ({
      label, count, color: COLORS[i % COLORS.length],
    }));
  }, [leads]);

  const total = leads.length;
  if (total === 0) return <p className="text-[11px] text-center py-4" style={{ color: "hsl(224 15% 60%)" }}>Aucune donnée</p>;

  const cx = 50, cy = 50, R = 42, r = 26;
  let angle = -Math.PI / 2;
  const arcs = groups.map((g) => {
    const sweep = (g.count / total) * 2 * Math.PI;
    const end = angle + sweep;
    const path = sweep >= 2 * Math.PI - 0.001
      ? `M ${cx + R},${cy} A ${R},${R},0,1,1,${cx + R - 0.001},${cy} Z M ${cx + r},${cy} A ${r},${r},0,1,0,${cx + r - 0.001},${cy} Z`
      : [
          `M ${cx + R * Math.cos(angle)},${cy + R * Math.sin(angle)}`,
          `A ${R},${R},0,${sweep > Math.PI ? 1 : 0},1,${cx + R * Math.cos(end)},${cy + R * Math.sin(end)}`,
          `L ${cx + r * Math.cos(end)},${cy + r * Math.sin(end)}`,
          `A ${r},${r},0,${sweep > Math.PI ? 1 : 0},0,${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)} Z`,
        ].join(" ");
    const result = { ...g, path };
    angle = end;
    return result;
  });

  return (
    <div className="flex items-center gap-5">
      <svg viewBox="0 0 100 100" className="flex-shrink-0" style={{ width: 88, height: 88 }}>
        {arcs.map((a, i) => <path key={i} d={a.path} fill={a.color} />)}
        <text x={cx} y={cy - 5} textAnchor="middle" fontSize="13" fontWeight="600" fill="hsl(224 55% 12%)">{total}</text>
        <text x={cx} y={cy + 9} textAnchor="middle" fontSize="7" fill="hsl(224 15% 55%)">Total</text>
      </svg>
      <div className="space-y-2 flex-1 min-w-0">
        {arcs.map((a) => (
          <div key={a.label} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: a.color }} />
            <span className="text-[11px] font-light truncate flex-1" style={{ color: "hsl(224 20% 38%)" }}>{a.label}</span>
            <span className="text-[11px] font-medium tabular-nums flex-shrink-0" style={{ color: "hsl(224 40% 25%)" }}>{a.count}</span>
            <span className="text-[10px] flex-shrink-0" style={{ color: "hsl(224 15% 58%)" }}>({Math.round(a.count / total * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Charts Modal (analyse) ─── */
function ChartsModal({ leads, onClose }: { leads: Lead[]; onClose: () => void }) {
  const [period, setPeriod] = useState<PeriodKey>("30j");
  const days = PERIODS.find((p) => p.key === period)?.days ?? 30;
  const buckets = useMemo(() => bucketLeadsByDay(leads, days), [leads, days]);
  const totalInPeriod = buckets.reduce((s, b) => s + b.total, 0);
  const convertiInPeriod = buckets.reduce((s, b) => s + b.converti, 0);
  const maxBucket = Math.max(...buckets.map((b) => b.total), 1);
  const taux = totalInPeriod === 0 ? 0 : Math.round((convertiInPeriod / totalInPeriod) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "hsl(224 60% 6% / 0.55)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-3xl rounded-2xl overflow-hidden"
        style={{ background: "white", boxShadow: "0 32px 80px -20px hsl(224 60% 12% / 0.22)" }}>
        <div className="flex items-center justify-between px-7 py-5" style={{ borderBottom: "1px solid hsl(224 20% 12% / 0.08)" }}>
          <div>
            <h2 className="text-lg font-heading font-light" style={{ color: "hsl(224 55% 12%)" }}>Analyse des leads</h2>
            <p className="text-[12px] font-light mt-0.5" style={{ color: "hsl(224 15% 52%)" }}>
              {totalInPeriod} leads · {convertiInPeriod} convertis · {taux}% de conversion
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: "hsl(220 25% 97%)" }}>
              {PERIODS.map((p) => (
                <button key={p.key} onClick={() => setPeriod(p.key)}
                  className="px-2.5 py-1 rounded-md text-[11px] font-medium transition-all"
                  style={{
                    background: period === p.key ? "white" : "transparent",
                    color: period === p.key ? "hsl(218 48% 38%)" : "hsl(224 15% 52%)",
                    boxShadow: period === p.key ? "0 1px 3px -1px hsl(224 20% 12% / 0.12)" : "none",
                  }}>{p.label}</button>
              ))}
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-[hsl(224_20%_12%/0.06)]">
              <X className="w-4 h-4" style={{ color: "hsl(224 20% 45%)" }} />
            </button>
          </div>
        </div>
        <div className="p-7 space-y-6">
          <MultiLineChart leads={leads} days={days} />
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Total période", value: totalInPeriod },
              { label: "Convertis", value: convertiInPeriod },
              { label: "Taux", value: `${taux}%` },
              { label: "Max / j", value: maxBucket },
            ].map((s) => (
              <div key={s.label} className="rounded-xl p-3 text-center"
                style={{ background: "hsl(220 25% 97%)", border: "1px solid hsl(224 20% 12% / 0.07)" }}>
                <p className="text-xl font-heading font-light tabular-nums" style={{ color: "hsl(224 55% 12%)" }}>{s.value}</p>
                <p className="text-[10px] uppercase tracking-wide mt-0.5" style={{ color: "hsl(224 15% 55%)" }}>{s.label}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6 pt-2" style={{ borderTop: "1px solid hsl(224 20% 12% / 0.07)" }}>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide mb-4" style={{ color: "hsl(224 15% 52%)" }}>Répartition</p>
              <StatusBars leads={leads} />
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide mb-4" style={{ color: "hsl(224 15% 52%)" }}>Délai de traitement</p>
              <PipelineHealth leads={leads} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Lead Detail Panel ─── */
function LeadDetailPanel({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const qc = useQueryClient();
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [notesDirty, setNotesDirty] = useState(false);

  useEffect(() => { setNotes(lead.notes ?? ""); setNotesDirty(false); }, [lead.notes]);

  const statusMut = useMutation({
    mutationFn: (s: LeadStatus) => updateLeadStatus(lead.id, s),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["leads"] }); toast.success("Statut mis à jour"); },
  });
  const notesMut = useMutation({
    mutationFn: (n: string) => updateLeadNotes(lead.id, n),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["leads"] }); setNotesDirty(false); toast.success("Notes enregistrées"); },
  });
  const deleteMut = useMutation({
    mutationFn: () => deleteLead(lead.id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["leads"] }); onClose(); },
  });

  const { score, level } = computeScore(lead);
  const levelColor = level === "Élevé" ? "hsl(142 50% 35%)" : level === "Moyen" ? "hsl(38 65% 36%)" : "hsl(224 15% 50%)";
  const cfg = STATUS_CONFIG[lead.status];
  const hue = avatarHue(lead.nom);

  return (
    <div className="fixed inset-0 z-40 flex justify-end" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="fixed inset-0" style={{ background: "hsl(224 60% 6% / 0.30)" }} onClick={onClose} />
      <div className="relative w-full max-w-md h-full flex flex-col"
        style={{ background: "white", borderLeft: "1px solid hsl(224 20% 12% / 0.10)", boxShadow: "-24px 0 60px -20px hsl(224 60% 12% / 0.14)" }}>

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5" style={{ borderBottom: "1px solid hsl(224 20% 12% / 0.08)" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-semibold flex-shrink-0"
              style={{ background: `hsl(${hue} 55% 88%)`, color: `hsl(${hue} 55% 28%)` }}>
              {getInitials(lead.nom)}
            </div>
            <div>
              <p className="text-[15px] font-medium" style={{ color: "hsl(224 55% 12%)" }}>{lead.nom}</p>
              <a href={`mailto:${lead.email}`} className="text-[12px] font-light hover:underline" style={{ color: "hsl(218 45% 40%)" }}>
                {lead.email}
              </a>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[hsl(224_20%_12%/0.06)]">
            <X className="w-4 h-4" style={{ color: "hsl(224 20% 45%)" }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Score + statut */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
              style={{ background: cfg.bg, color: cfg.color }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
              {cfg.label}
            </span>
            <span className="text-[12px] font-medium" style={{ color: levelColor }}>
              Score {score} · <span style={{ fontWeight: 400 }}>{level}</span>
            </span>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Source", value: getSource(lead) },
              { label: "Téléphone", value: lead.telephone ?? "—" },
              { label: "Format", value: lead.format ? (FORMAT_LABELS[lead.format] ?? lead.format) : "—" },
              { label: "Disponibilité", value: lead.timing ? (TIMING_LABELS[lead.timing] ?? lead.timing) : "—" },
              { label: "Conseiller", value: lead.conseiller ? (ADVISOR_LABELS[lead.conseiller] ?? lead.conseiller) : "—" },
              { label: "Reçu le", value: fmtDate(lead.created_at) },
            ].map((f) => (
              <div key={f.label}>
                <p className="text-[10px] uppercase tracking-[0.18em] font-medium mb-0.5" style={{ color: "hsl(224 15% 58%)" }}>{f.label}</p>
                {f.label === "Téléphone" && lead.telephone ? (
                  <a href={`tel:${lead.telephone}`} className="text-[13px] font-light hover:underline" style={{ color: "hsl(218 45% 38%)" }}>
                    {lead.telephone}
                  </a>
                ) : (
                  <p className="text-[13px] font-light" style={{ color: "hsl(224 25% 30%)" }}>{f.value}</p>
                )}
              </div>
            ))}
          </div>

          {/* Message */}
          {lead.message && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] font-medium mb-2" style={{ color: "hsl(224 15% 58%)" }}>Message</p>
              <p className="text-[13px] font-light leading-relaxed" style={{ color: "hsl(224 20% 32%)" }}>{lead.message}</p>
            </div>
          )}

          {/* Change status */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] font-medium mb-2" style={{ color: "hsl(224 15% 58%)" }}>Changer le statut</p>
            <div className="flex flex-wrap gap-1.5">
              {STATUS_ORDER.filter((s) => s !== lead.status).map((s) => {
                const c = STATUS_CONFIG[s];
                return (
                  <button key={s} onClick={() => statusMut.mutate(s)}
                    disabled={statusMut.isPending}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all disabled:opacity-50"
                    style={{ background: c.bg, color: c.color, border: `1px solid ${c.dot}33` }}>
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] font-medium mb-2" style={{ color: "hsl(224 15% 58%)" }}>Notes internes</p>
            <textarea
              value={notes}
              onChange={(e) => { setNotes(e.target.value); setNotesDirty(e.target.value !== (lead.notes ?? "")); }}
              placeholder="Suivi, rappels, observations…"
              rows={3}
              className="w-full resize-none rounded-xl px-3.5 py-2.5 text-[13px] font-light outline-none transition-all"
              style={{
                background: "hsl(220 25% 97%)",
                border: `1px solid ${notesDirty ? "hsl(218 45% 42% / 0.4)" : "hsl(224 20% 12% / 0.10)"}`,
                color: "hsl(224 30% 25%)",
              }} />
            {notesDirty && (
              <button onClick={() => notesMut.mutate(notes)} disabled={notesMut.isPending}
                className="mt-2 text-[11px] font-medium px-3 py-1.5 rounded-lg transition-opacity disabled:opacity-60"
                style={{ background: "hsl(218 45% 42%)", color: "white" }}>
                {notesMut.isPending ? "Enregistrement…" : "Enregistrer"}
              </button>
            )}
          </div>
        </div>

        {/* Actions footer */}
        <div className="px-6 py-4 flex items-center gap-3" style={{ borderTop: "1px solid hsl(224 20% 12% / 0.08)" }}>
          {lead.telephone && (
            <a href={`tel:${lead.telephone}`}
              onClick={() => { if (lead.status !== "appele") statusMut.mutate("appele"); }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-medium"
              style={{ background: "hsl(218 55% 42% / 0.08)", color: "hsl(218 50% 36%)", border: "1px solid hsl(218 55% 42% / 0.18)" }}>
              <Phone className="w-4 h-4" />Appeler
            </a>
          )}
          <a href={`mailto:${lead.email}`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-medium"
            style={{ background: "hsl(220 25% 97%)", color: "hsl(224 30% 38%)", border: "1px solid hsl(224 20% 12% / 0.10)" }}>
            <Mail className="w-4 h-4" />Email
          </a>
          <button onClick={() => { if (confirm(`Supprimer le lead de ${lead.nom} ?`)) deleteMut.mutate(); }}
            className="p-2.5 rounded-xl transition-colors"
            style={{ color: "hsl(0 55% 48%)", border: "1px solid hsl(0 55% 52% / 0.18)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(0 55% 96%)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Table Row ─── */
function LeadTableRow({ lead, onClick, selected, onSelect }: {
  lead: Lead; onClick: () => void;
  selected: boolean; onSelect: (v: boolean) => void;
}) {
  const qc = useQueryClient();
  const { score, level } = computeScore(lead);
  const cfg = STATUS_CONFIG[lead.status];
  const hue = avatarHue(lead.nom);
  const levelColor = level === "Élevé" ? "hsl(142 50% 35%)" : level === "Moyen" ? "hsl(38 65% 36%)" : "hsl(224 15% 50%)";
  const levelBg   = level === "Élevé" ? "hsl(142 50% 35% / 0.10)" : level === "Moyen" ? "hsl(38 65% 36% / 0.10)" : "hsl(224 15% 90%)";

  const statusMut = useMutation({
    mutationFn: (s: LeadStatus) => updateLeadStatus(lead.id, s),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["leads"] }); toast.success("Statut mis à jour"); },
  });

  return (
    <tr
      className="group transition-colors cursor-pointer"
      style={{ borderBottom: "1px solid hsl(224 20% 12% / 0.06)" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(220 30% 99%)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = selected ? "hsl(218 55% 42% / 0.04)" : "white"; }}
      onClick={onClick}
    >
      {/* Checkbox */}
      <td className="pl-5 pr-2 py-3.5 w-8" onClick={(e) => e.stopPropagation()}>
        <input type="checkbox" checked={selected} onChange={(e) => onSelect(e.target.checked)}
          className="w-3.5 h-3.5 rounded" style={{ accentColor: "hsl(218 55% 42%)" }} />
      </td>

      {/* Lead */}
      <td className="py-3.5 pr-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0"
            style={{ background: `hsl(${hue} 50% 88%)`, color: `hsl(${hue} 55% 28%)` }}>
            {getInitials(lead.nom)}
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-medium truncate" style={{ color: "hsl(224 50% 15%)" }}>{lead.nom}</p>
            <p className="text-[11px] font-light truncate" style={{ color: "hsl(224 15% 55%)" }}>{lead.email}</p>
          </div>
        </div>
      </td>

      {/* Source */}
      <td className="py-3.5 pr-4">
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium"
          style={{ background: "hsl(218 55% 42% / 0.08)", color: "hsl(218 48% 38%)" }}>
          {getSource(lead)}
        </span>
      </td>

      {/* Statut */}
      <td className="py-3.5 pr-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
            style={{ background: cfg.bg, color: cfg.color }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
            {cfg.label}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); }}
            className="p-0.5 rounded transition-colors"
            style={{ color: "hsl(224 15% 58%)" }}
          >
            <select
              value={lead.status}
              onChange={(e) => { e.stopPropagation(); statusMut.mutate(e.target.value as LeadStatus); }}
              className="appearance-none bg-transparent outline-none text-[11px] cursor-pointer w-3 opacity-0 absolute"
            />
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </td>

      {/* Score */}
      <td className="py-3.5 pr-4">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium tabular-nums" style={{ color: "hsl(224 50% 18%)" }}>{score}</span>
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded"
            style={{ background: levelBg, color: levelColor }}>
            {level}
          </span>
        </div>
      </td>

      {/* Assigné */}
      <td className="py-3.5 pr-4">
        {lead.conseiller && lead.conseiller !== "any" ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
              style={{ background: "hsl(218 55% 42% / 0.14)", color: "hsl(218 50% 36%)" }}>
              {ADVISOR_INITIALS[lead.conseiller] ?? "?"}
            </div>
            <span className="text-[12px] font-light truncate" style={{ color: "hsl(224 25% 38%)" }}>
              {ADVISOR_LABELS[lead.conseiller] ?? lead.conseiller}
            </span>
          </div>
        ) : (
          <span className="text-[12px]" style={{ color: "hsl(224 15% 60%)" }}>—</span>
        )}
      </td>

      {/* Date */}
      <td className="py-3.5 pr-4">
        <p className="text-[12px] font-light tabular-nums" style={{ color: "hsl(224 15% 48%)" }}>
          {fmtDate(lead.created_at)}
        </p>
      </td>

      {/* Actions */}
      <td className="py-3.5 pr-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {lead.telephone && (
            <a href={`tel:${lead.telephone}`}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: "hsl(200 65% 38%)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(200 65% 38% / 0.10)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
              <Phone className="w-3.5 h-3.5" />
            </a>
          )}
          <a href={`mailto:${lead.email}`}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "hsl(218 50% 42%)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(218 50% 42% / 0.10)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
            <Mail className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => { }}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "hsl(224 15% 55%)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(224 20% 12% / 0.06)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

/* ─── Main page ─── */
type SortKey = "date_desc" | "date_asc" | "urgent" | "score_desc";

export default function AdminLeadsList() {
  const [tabFilter, setTabFilter] = useState<"tous" | LeadStatus>("tous");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("date_desc");
  const [showCharts, setShowCharts] = useState(false);
  const [chartPeriod, setChartPeriod] = useState<PeriodKey>("30j");
  const [dateRange, setDateRange] = useState<"tous" | "aujourd" | "7j" | "30j">("tous");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const PER_PAGE = 20;

  const { data: leads = [], isLoading } = useQuery({ queryKey: ["leads"], queryFn: getLeads });

  const chartDays = PERIODS.find((p) => p.key === chartPeriod)?.days ?? 30;

  /* Trend vs previous period */
  const now = Date.now();
  const periodMs = chartDays * 86_400_000;
  const leadsInPeriod = leads.filter((l) => now - new Date(l.created_at).getTime() <= periodMs);
  const leadsInPrev = leads.filter((l) => {
    const age = now - new Date(l.created_at).getTime();
    return age > periodMs && age <= 2 * periodMs;
  });
  function trend(curr: number, prev: number) {
    if (prev === 0) return null;
    return Math.round(((curr - prev) / prev) * 100);
  }

  const counts = useMemo(() => ({
    tous: leads.length,
    nouveau: leads.filter((l) => l.status === "nouveau").length,
    appele: leads.filter((l) => l.status === "appele").length,
    traite: leads.filter((l) => l.status === "traite").length,
    converti: leads.filter((l) => l.status === "converti").length,
    archive: leads.filter((l) => l.status === "archive").length,
  }), [leads]);

  const conversionRate = leads.length === 0 ? 0 : Math.round((counts.converti / leads.length) * 100);

  const filtered = useMemo(() => {
    const rangeCutoff: Record<string, number> = {
      aujourd: 86_400_000, "7j": 7 * 86_400_000, "30j": 30 * 86_400_000,
    };
    return leads
      .filter((l) => tabFilter === "tous" || l.status === tabFilter)
      .filter((l) => {
        if (dateRange === "tous") return true;
        return now - new Date(l.created_at).getTime() <= rangeCutoff[dateRange];
      })
      .filter((l) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return [l.nom, l.email, l.sujet, l.message, l.telephone, l.notes].some((v) => v?.toLowerCase().includes(q));
      })
      .sort((a, b) => {
        if (sort === "date_asc") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        if (sort === "urgent") return (a.timing === "asap" ? 0 : 1) - (b.timing === "asap" ? 0 : 1);
        if (sort === "score_desc") return computeScore(b).score - computeScore(a).score;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [leads, tabFilter, search, sort, dateRange, now]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const selectedLead = selectedId ? leads.find((l) => l.id === selectedId) : null;

  useEffect(() => { setPage(1); }, [tabFilter, search, sort, dateRange]);

  const TABS: { key: "tous" | LeadStatus; label: string }[] = [
    { key: "tous",     label: `Tous (${counts.tous})` },
    { key: "nouveau",  label: `Nouveaux (${counts.nouveau})` },
    { key: "appele",   label: `Assignés (${counts.appele})` },
    { key: "traite",   label: `Traités (${counts.traite})` },
    { key: "converti", label: `Convertis (${counts.converti})` },
    { key: "archive",  label: `Archivés (${counts.archive})` },
  ];

  const statCards = [
    {
      label: "Total leads", value: counts.tous,
      t: trend(leadsInPeriod.length, leadsInPrev.length),
      icon: Users, color: "hsl(218 55% 48%)",
    },
    {
      label: "Nouveaux leads", value: counts.nouveau,
      t: trend(leadsInPeriod.filter((l) => l.status === "nouveau").length, leadsInPrev.filter((l) => l.status === "nouveau").length),
      icon: TrendingUp, color: "hsl(200 65% 42%)",
    },
    {
      label: "Convertis", value: counts.converti,
      t: trend(leadsInPeriod.filter((l) => l.status === "converti").length, leadsInPrev.filter((l) => l.status === "converti").length),
      icon: CheckCircle2, color: "hsl(142 50% 38%)",
    },
    {
      label: "Taux de conversion", value: `${conversionRate}%`,
      t: null,
      icon: Clock, color: "hsl(38 70% 42%)",
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: "hsl(220 25% 97%)" }}>
      <div className="p-7 space-y-5">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-heading font-light tracking-tight" style={{ color: "hsl(224 55% 12%)" }}>Leads</h1>
            <p className="text-[13px] font-light mt-0.5" style={{ color: "hsl(224 15% 52%)" }}>
              Gérez et analysez vos leads générés depuis votre site web.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={() => setShowCharts(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium transition-all"
              style={{ background: "white", border: "1px solid hsl(224 20% 12% / 0.12)", color: "hsl(224 30% 38%)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(220 25% 95%)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "white"; }}>
              <BarChart3 className="w-4 h-4" />Analyse
            </button>
            <button onClick={() => exportLeadsCSV(leads)} disabled={leads.length === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium transition-all disabled:opacity-40"
              style={{ background: "white", border: "1px solid hsl(224 20% 12% / 0.12)", color: "hsl(224 30% 38%)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(220 25% 95%)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "white"; }}>
              <Download className="w-4 h-4" />Exporter
            </button>
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <div key={s.label} className="rounded-2xl p-5" style={{ background: "white", border: "1px solid hsl(224 20% 12% / 0.07)" }}>
              <div className="flex items-start justify-between mb-3">
                <p className="text-[12px] font-medium" style={{ color: "hsl(224 15% 52%)" }}>{s.label}</p>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: s.color + "15" }}>
                  <s.icon className="w-4 h-4" style={{ color: s.color }} strokeWidth={1.5} />
                </div>
              </div>
              <p className="text-3xl font-heading font-light tabular-nums" style={{ color: "hsl(224 55% 12%)" }}>{s.value}</p>
              {s.t !== null ? (
                <p className="text-[11px] font-light mt-1.5" style={{ color: s.t >= 0 ? "hsl(142 50% 38%)" : "hsl(0 55% 45%)" }}>
                  {s.t >= 0 ? "↑" : "↓"} {Math.abs(s.t)}% vs période précédente
                </p>
              ) : (
                <p className="text-[11px] font-light mt-1.5" style={{ color: "hsl(224 12% 62%)" }}>—% vs période précédente</p>
              )}
            </div>
          ))}
        </div>

        {/* ── Chart section ── */}
        <div className="rounded-2xl" style={{ background: "white", border: "1px solid hsl(224 20% 12% / 0.07)" }}>
          <div className="px-6 py-4 flex items-center justify-between flex-wrap gap-3" style={{ borderBottom: "1px solid hsl(224 20% 12% / 0.07)" }}>
            <div className="flex items-center gap-4 flex-wrap">
              <p className="text-[14px] font-medium" style={{ color: "hsl(224 40% 22%)" }}>
                Évolution des leads sur la période
              </p>
              <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: "hsl(220 25% 97%)" }}>
                {PERIODS.map((p) => (
                  <button key={p.key} onClick={() => setChartPeriod(p.key)}
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium transition-all"
                    style={{
                      background: chartPeriod === p.key ? "white" : "transparent",
                      color: chartPeriod === p.key ? "hsl(218 48% 38%)" : "hsl(224 15% 52%)",
                      boxShadow: chartPeriod === p.key ? "0 1px 3px -1px hsl(224 20% 12% / 0.12)" : "none",
                    }}>{p.label}</button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4 text-[11px]" style={{ color: "hsl(224 15% 55%)" }}>
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-0.5 rounded inline-block" style={{ background: "hsl(218 55% 48%)" }} />
                Nouveaux leads
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-0.5 rounded inline-block" style={{ background: "hsl(200 65% 52%)" }} />
                Leads traités
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-5 inline-block" style={{ height: 1, borderTop: "2px dashed hsl(142 52% 42%)" }} />
                Leads convertis
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_300px]">
            {/* Multi-line chart */}
            <div className="p-6" style={{ borderRight: "1px solid hsl(224 20% 12% / 0.06)" }}>
              <MultiLineChart leads={leads} days={chartDays} />
            </div>
            {/* Right panel */}
            <div className="p-6 space-y-6">
              {/* Legend counts */}
              <div className="space-y-4">
                {[
                  { label: "Nouveaux leads", count: counts.nouveau + counts.appele, t: trend(leadsInPeriod.filter((l) => l.status === "nouveau" || l.status === "appele").length, leadsInPrev.filter((l) => l.status === "nouveau" || l.status === "appele").length), color: "hsl(218 55% 48%)" },
                  { label: "Leads traités", count: counts.traite, t: trend(leadsInPeriod.filter((l) => l.status === "traite").length, leadsInPrev.filter((l) => l.status === "traite").length), color: "hsl(200 65% 52%)" },
                  { label: "Leads convertis", count: counts.converti, t: trend(leadsInPeriod.filter((l) => l.status === "converti").length, leadsInPrev.filter((l) => l.status === "converti").length), color: "hsl(142 52% 42%)" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                      <span className="text-[12px] font-light" style={{ color: "hsl(224 15% 45%)" }}>{item.label}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-[14px] font-medium tabular-nums" style={{ color: "hsl(224 50% 15%)" }}>{item.count}</p>
                      {item.t !== null && (
                        <p className="text-[10px]" style={{ color: item.t >= 0 ? "hsl(142 50% 38%)" : "hsl(0 55% 45%)" }}>
                          {item.t >= 0 ? "↑" : "↓"} {Math.abs(item.t)}%
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {/* Donut */}
              <div style={{ borderTop: "1px solid hsl(224 20% 12% / 0.07)", paddingTop: "1.25rem" }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: "hsl(224 15% 52%)" }}>
                    Sources des leads
                  </p>
                </div>
                <DonutChart leads={leads} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Table section ── */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1px solid hsl(224 20% 12% / 0.07)" }}>
          {/* Toolbar */}
          <div className="px-5 py-4 flex items-center justify-between gap-3 flex-wrap"
            style={{ borderBottom: "1px solid hsl(224 20% 12% / 0.07)" }}>
            <div className="flex items-center gap-2 flex-wrap flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: "hsl(224 15% 58%)" }} />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher un lead…"
                  className="pl-9 pr-4 py-2 rounded-lg text-[13px] outline-none w-52"
                  style={{ background: "hsl(220 25% 97%)", border: "1px solid hsl(224 20% 12% / 0.10)", color: "hsl(224 30% 25%)" }} />
              </div>
              <select value={dateRange} onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
                className="text-[12px] px-3 py-2 rounded-lg outline-none cursor-pointer"
                style={{ background: "hsl(220 25% 97%)", border: "1px solid hsl(224 20% 12% / 0.10)", color: "hsl(224 30% 38%)" }}>
                <option value="tous">Toute période</option>
                <option value="aujourd">Aujourd'hui</option>
                <option value="7j">7 derniers jours</option>
                <option value="30j">30 derniers jours</option>
              </select>
              <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}
                className="text-[12px] px-3 py-2 rounded-lg outline-none cursor-pointer"
                style={{ background: "hsl(220 25% 97%)", border: "1px solid hsl(224 20% 12% / 0.10)", color: "hsl(224 30% 38%)" }}>
                <option value="date_desc">Récents d'abord</option>
                <option value="date_asc">Anciens d'abord</option>
                <option value="urgent">Urgents d'abord</option>
                <option value="score_desc">Score décroissant</option>
              </select>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium transition-all"
                style={{ background: "hsl(220 25% 97%)", border: "1px solid hsl(224 20% 12% / 0.10)", color: "hsl(224 30% 42%)" }}>
                <Filter className="w-3.5 h-3.5" />
                Filtres avancés
              </button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium flex-shrink-0"
              style={{ background: "hsl(224 60% 18%)", color: "white" }}>
              + Nouveau lead
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-0 px-5 overflow-x-auto" style={{ borderBottom: "1px solid hsl(224 20% 12% / 0.07)" }}>
            {TABS.map((tab) => (
              <button key={tab.key} onClick={() => setTabFilter(tab.key)}
                className="px-4 py-3 text-[13px] font-medium whitespace-nowrap transition-all relative"
                style={{
                  color: tabFilter === tab.key ? "hsl(218 55% 40%)" : "hsl(224 15% 52%)",
                  borderBottom: tabFilter === tab.key ? "2px solid hsl(218 55% 42%)" : "2px solid transparent",
                  background: "transparent",
                }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-6 h-6 rounded-full border-2 border-foreground/15 border-t-foreground/60 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[14px] font-light" style={{ color: "hsl(224 12% 55%)" }}>
                {search ? "Aucun résultat pour cette recherche" : "Aucun lead dans cette catégorie"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid hsl(224 20% 12% / 0.07)", background: "hsl(220 25% 98%)" }}>
                    <th className="pl-5 pr-2 py-3 w-8">
                      <input type="checkbox"
                        checked={selectedRows.size === paginated.length && paginated.length > 0}
                        onChange={(e) => setSelectedRows(e.target.checked ? new Set(paginated.map((l) => l.id)) : new Set())}
                        className="w-3.5 h-3.5 rounded" style={{ accentColor: "hsl(218 55% 42%)" }} />
                    </th>
                    {["Lead", "Source", "Statut", "Score", "Assigné à", "Date", "Actions"].map((h) => (
                      <th key={h} className="py-3 pr-4 text-left text-[11px] font-medium uppercase tracking-wide" style={{ color: "hsl(224 15% 50%)" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody style={{ background: "white" }}>
                  {paginated.map((lead) => (
                    <LeadTableRow
                      key={lead.id}
                      lead={lead}
                      selected={selectedRows.has(lead.id)}
                      onSelect={(v) => setSelectedRows((prev) => {
                        const next = new Set(prev);
                        v ? next.add(lead.id) : next.delete(lead.id);
                        return next;
                      })}
                      onClick={() => setSelectedId((id) => id === lead.id ? null : lead.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {filtered.length > PER_PAGE && (
            <div className="flex items-center justify-between px-5 py-3.5" style={{ borderTop: "1px solid hsl(224 20% 12% / 0.07)" }}>
              <p className="text-[12px] font-light" style={{ color: "hsl(224 15% 52%)" }}>
                Affichage de {(page - 1) * PER_PAGE + 1} à {Math.min(page * PER_PAGE, filtered.length)} sur {filtered.length} leads
              </p>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                  className="w-7 h-7 rounded flex items-center justify-center text-[12px] disabled:opacity-30"
                  style={{ border: "1px solid hsl(224 20% 12% / 0.12)", color: "hsl(224 25% 42%)" }}>‹</button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      className="w-7 h-7 rounded text-[12px] font-medium"
                      style={{
                        background: page === p ? "hsl(218 55% 42%)" : "transparent",
                        color: page === p ? "white" : "hsl(224 25% 42%)",
                        border: page === p ? "none" : "1px solid hsl(224 20% 12% / 0.12)",
                      }}>{p}</button>
                  );
                })}
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="w-7 h-7 rounded flex items-center justify-center text-[12px] disabled:opacity-30"
                  style={{ border: "1px solid hsl(224 20% 12% / 0.12)", color: "hsl(224 25% 42%)" }}>›</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail panel */}
      {selectedLead && (
        <LeadDetailPanel lead={selectedLead} onClose={() => setSelectedId(null)} />
      )}

      {/* Charts modal */}
      {showCharts && <ChartsModal leads={leads} onClose={() => setShowCharts(false)} />}
    </div>
  );
}
