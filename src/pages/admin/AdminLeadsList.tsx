import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Trash2, ChevronDown, ChevronUp, Mail, Phone, Calendar,
  Filter, Search, Download, Maximize2, X, Star, Clock,
  TrendingUp, Users, CheckCircle2, BarChart3, ArrowUpDown,
} from "lucide-react";
import {
  getLeads, updateLeadStatus, updateLeadNotes, deleteLead, exportLeadsCSV,
} from "@/lib/leadsService";
import type { Lead, LeadStatus } from "@/lib/leadsService";
import {
  VolumeChart, StatusBars, PipelineHealth,
  bucketLeadsByDay, PERIODS, STATUS_CONFIG, STATUS_ORDER,
} from "@/components/admin/LeadsVolumeChart";
import type { PeriodKey } from "@/components/admin/LeadsVolumeChart";

/* ─── Config ─── */
const ADVISOR_LABELS: Record<string, string> = {
  quentin: "Quentin Perromat", thomas: "Thomas Robert", any: "Peu importe",
};
const FORMAT_LABELS: Record<string, string> = {
  cabinet: "En cabinet", visio: "Visioconférence", telephone: "Téléphone",
};
const TIMING_LABELS: Record<string, string> = {
  asap: "Dès que possible", week: "Cette semaine", two_weeks: "Dans 2 semaines", month: "Dans le mois",
};

/* ─── Helpers ─── */
function fmtDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

function fmtRelative(iso: string): { label: string; urgent: boolean; hours: number } {
  const hours = (Date.now() - new Date(iso).getTime()) / 3_600_000;
  if (hours < 1) return { label: "< 1 h", urgent: false, hours };
  if (hours < 24) return { label: `${Math.floor(hours)} h`, urgent: hours > 12, hours };
  const days = Math.floor(hours / 24);
  return { label: `${days} j`, urgent: days > 2, hours };
}

/* ─── SVG Charts — imported from shared component ─── */

/* ─── Charts Modal ─── */
function ChartsModal({ leads, onClose }: { leads: Lead[]; onClose: () => void }) {
  const [period, setPeriod] = useState<PeriodKey>("30j");
  const days = PERIODS.find(p => p.key === period)?.days ?? 30;
  const buckets = useMemo(() => bucketLeadsByDay(leads, days), [leads, days]);
  const maxBucket = Math.max(...buckets.map(b => b.total), 1);
  const totalInPeriod = buckets.reduce((s, b) => s + b.total, 0);
  const convertiInPeriod = buckets.reduce((s, b) => s + b.converti, 0);
  const tauxConversion = totalInPeriod === 0 ? 0 : Math.round((convertiInPeriod / totalInPeriod) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "hsl(224 60% 6% / 0.55)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="relative w-full max-w-3xl rounded-2xl overflow-hidden"
        style={{ background: "white", boxShadow: "0 32px 80px -20px hsl(224 60% 12% / 0.22)" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5"
          style={{ borderBottom: "1px solid hsl(224 20% 12% / 0.08)" }}>
          <div>
            <h2 className="text-lg font-heading font-light" style={{ color: "hsl(224 55% 12%)" }}>
              Analyse des leads
            </h2>
            <p className="text-[12px] font-light mt-0.5" style={{ color: "hsl(224 15% 52%)" }}>
              {totalInPeriod} leads · {convertiInPeriod} convertis · {tauxConversion}% de conversion
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Period selector */}
            <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: "hsl(220 25% 97%)" }}>
              {PERIODS.map(p => (
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
          {/* Volume chart — large */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-medium tracking-wide uppercase" style={{ color: "hsl(224 15% 52%)" }}>
                Volume de leads reçus
              </p>
              <div className="flex items-center gap-4 text-[10px]" style={{ color: "hsl(224 15% 55%)" }}>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-6 h-0.5 rounded" style={{ background: "hsl(218 45% 42%)" }} />
                  Total
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-6 rounded" style={{ height: 1, background: "hsl(142 50% 40%)", borderTop: "2px dashed hsl(142 50% 40%)" }} />
                  Convertis
                </span>
              </div>
            </div>

            {/* Chart with axes */}
            <div className="relative" style={{ height: 160 }}>
              <VolumeChart leads={leads} days={days} height={140} showConverti />
              {/* X labels */}
              <div className="flex justify-between mt-1 px-1">
                {buckets.filter((_, i) => i === 0 || i === Math.floor(buckets.length / 2) || i === buckets.length - 1).map((b, i) => (
                  <span key={i} className="text-[9px]" style={{ color: "hsl(224 15% 58%)" }}>{b.label}</span>
                ))}
              </div>
            </div>

            {/* Bar breakdown by bucket */}
            <div className="grid grid-cols-4 gap-2 mt-4">
              {[
                { label: "Max / période", value: String(maxBucket), sub: "leads" },
                { label: "Total période", value: String(totalInPeriod), sub: "reçus" },
                { label: "Convertis", value: String(convertiInPeriod), sub: "leads" },
                { label: "Taux conversion", value: `${tauxConversion}%`, sub: "du total" },
              ].map(s => (
                <div key={s.label} className="rounded-xl p-3 text-center"
                  style={{ background: "hsl(220 25% 97%)", border: "1px solid hsl(224 20% 12% / 0.07)" }}>
                  <p className="text-xl font-heading font-light tabular-nums" style={{ color: "hsl(224 55% 12%)" }}>{s.value}</p>
                  <p className="text-[9px] uppercase tracking-wide mt-0.5" style={{ color: "hsl(224 15% 55%)" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom row: status + pipeline */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-[11px] font-medium tracking-wide uppercase mb-4" style={{ color: "hsl(224 15% 52%)" }}>
                Répartition actuelle
              </p>
              <StatusBars leads={leads} />
            </div>
            <div>
              <p className="text-[11px] font-medium tracking-wide uppercase mb-4" style={{ color: "hsl(224 15% 52%)" }}>
                Délai de traitement (en attente)
              </p>
              <PipelineHealth leads={leads} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Status Badge ─── */
function StatusBadge({ status }: { status: LeadStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
      style={{ background: cfg.bg, color: cfg.color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
      {cfg.label}
    </span>
  );
}

/* ─── Lead Row ─── */
function LeadRow({ lead }: { lead: Lead }) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [notesDirty, setNotesDirty] = useState(false);
  const qc = useQueryClient();

  useEffect(() => {
    setNotes(lead.notes ?? "");
    setNotesDirty(false);
  }, [lead.notes]);

  const statusMut = useMutation({
    mutationFn: (status: LeadStatus) => updateLeadStatus(lead.id, status),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["leads"] }); toast.success("Statut mis à jour"); },
  });

  const notesMut = useMutation({
    mutationFn: (n: string) => updateLeadNotes(lead.id, n),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["leads"] }); setNotesDirty(false); toast.success("Notes enregistrées"); },
    onError: () => toast.error("Erreur — ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes text;"),
  });

  const deleteMut = useMutation({
    mutationFn: () => deleteLead(lead.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["leads"] }),
  });

  const wait = fmtRelative(lead.created_at);
  const isActive = lead.status === "nouveau" || lead.status === "appele";
  const isAsap = lead.timing === "asap";

  const markCalled = () => {
    if (lead.status !== "appele") statusMut.mutate("appele");
  };

  return (
    <div className="rounded-xl overflow-hidden transition-shadow"
      style={{
        background: "white",
        border: `1px solid ${lead.status === "nouveau" && wait.urgent ? "hsl(38 80% 48% / 0.3)" : "hsl(224 20% 12% / 0.08)"}`,
        boxShadow: "0 1px 4px -2px hsl(224 60% 12% / 0.05)",
      }}>

      <div className="flex items-center gap-3 px-4 py-3.5">
        {/* Urgency dot */}
        <div className="flex-shrink-0 w-1.5">
          {isAsap && isActive && (
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "hsl(38 80% 48%)" }} title="Urgent — dès que possible" />
          )}
        </div>

        <div className="flex-1 min-w-0 grid grid-cols-[1fr_1fr_auto] gap-4 items-center">
          <div className="min-w-0">
            <p className="text-[13px] font-medium truncate" style={{ color: "hsl(224 55% 12%)" }}>{lead.nom}</p>
            <a href={`mailto:${lead.email}`} className="flex items-center gap-1 text-[11px] font-light hover:underline truncate" style={{ color: "hsl(224 40% 45%)" }}>
              <Mail className="w-3 h-3 flex-shrink-0" />{lead.email}
            </a>
          </div>
          <div className="min-w-0">
            {lead.sujet && <p className="text-[12px] font-medium truncate" style={{ color: "hsl(224 25% 35%)" }}>{lead.sujet}</p>}
            <div className="flex items-center gap-2">
              <p className="flex items-center gap-1 text-[11px] font-light" style={{ color: "hsl(224 15% 55%)" }}>
                <Calendar className="w-3 h-3" />{fmtDate(lead.created_at)}
              </p>
              {isActive && (
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{
                  background: wait.urgent ? "hsl(0 60% 52% / 0.10)" : wait.hours > 4 ? "hsl(38 80% 48% / 0.10)" : "hsl(142 52% 36% / 0.10)",
                  color: wait.urgent ? "hsl(0 55% 40%)" : wait.hours > 4 ? "hsl(38 60% 36%)" : "hsl(142 45% 30%)",
                }}>
                  <Clock className="w-2.5 h-2.5 inline mr-0.5" />
                  {wait.label}
                </span>
              )}
            </div>
          </div>
          <StatusBadge status={lead.status} />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Phone CTA */}
          {lead.telephone ? (
            <a href={`tel:${lead.telephone}`}
              onClick={markCalled}
              title={`Appeler ${lead.nom}`}
              className="p-2 rounded-lg transition-colors"
              style={{ color: "hsl(200 65% 38%)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(200 70% 45% / 0.10)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
              <Phone className="w-4 h-4" />
            </a>
          ) : (
            <button
              onClick={markCalled}
              disabled={lead.status === "appele"}
              title="Marquer comme appelé"
              className="p-2 rounded-lg transition-colors disabled:opacity-30"
              style={{ color: lead.status === "appele" ? "hsl(200 65% 38%)" : "hsl(224 20% 55%)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(200 70% 45% / 0.10)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
              <Phone className="w-4 h-4" />
            </button>
          )}

          {/* Status select */}
          <select value={lead.status}
            onChange={(e) => statusMut.mutate(e.target.value as LeadStatus)}
            className="text-[11px] px-2 py-1.5 rounded-lg outline-none cursor-pointer"
            style={{ background: "hsl(220 25% 97%)", border: "1px solid hsl(224 20% 12% / 0.10)", color: "hsl(224 30% 38%)" }}>
            <option value="nouveau">Nouveau</option>
            <option value="appele">Appelé</option>
            <option value="traite">Traité</option>
            <option value="converti">Converti</option>
            <option value="archive">Archivé</option>
          </select>

          <button onClick={() => setExpanded(v => !v)} className="p-2 rounded-lg transition-colors"
            style={{ color: "hsl(224 20% 55%)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(224 20% 12% / 0.06)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <button onClick={() => { if (confirm("Supprimer ce lead ?")) deleteMut.mutate(); }}
            className="p-2 rounded-lg transition-colors"
            style={{ color: "hsl(0 55% 52%)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(0 55% 52% / 0.08)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-5 pb-5 pt-3 flex flex-wrap gap-5"
          style={{ borderTop: "1px solid hsl(224 20% 12% / 0.06)", background: "hsl(220 25% 98%)" }}>
          {lead.telephone && (
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase font-medium mb-1" style={{ color: "hsl(224 15% 58%)" }}>Téléphone</p>
              <a href={`tel:${lead.telephone}`} className="flex items-center gap-1.5 text-[13px] font-light hover:underline" style={{ color: "hsl(224 40% 32%)" }}>
                <Phone className="w-3.5 h-3.5" />{lead.telephone}
              </a>
            </div>
          )}
          {lead.conseiller && (
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase font-medium mb-1" style={{ color: "hsl(224 15% 58%)" }}>Conseiller souhaité</p>
              <p className="text-[13px] font-light" style={{ color: "hsl(224 30% 32%)" }}>{ADVISOR_LABELS[lead.conseiller] ?? lead.conseiller}</p>
            </div>
          )}
          {lead.format && (
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase font-medium mb-1" style={{ color: "hsl(224 15% 58%)" }}>Format</p>
              <p className="text-[13px] font-light" style={{ color: "hsl(224 30% 32%)" }}>{FORMAT_LABELS[lead.format] ?? lead.format}</p>
            </div>
          )}
          {lead.timing && (
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase font-medium mb-1" style={{ color: "hsl(224 15% 58%)" }}>Disponibilité</p>
              <p className="text-[13px] font-light" style={{ color: "hsl(224 30% 32%)" }}>{TIMING_LABELS[lead.timing] ?? lead.timing}</p>
            </div>
          )}
          {lead.message && (
            <div className="w-full">
              <p className="text-[10px] tracking-[0.2em] uppercase font-medium mb-1" style={{ color: "hsl(224 15% 58%)" }}>Message</p>
              <p className="text-[13px] font-light leading-relaxed" style={{ color: "hsl(224 20% 35%)" }}>{lead.message}</p>
            </div>
          )}
          {/* Prochaines actions rapides */}
          <div className="w-full">
            <p className="text-[10px] tracking-[0.2em] uppercase font-medium mb-2" style={{ color: "hsl(224 15% 58%)" }}>Actions rapides</p>
            <div className="flex flex-wrap gap-2">
              {([
                { s: "appele" as LeadStatus, label: "Marqué comme appelé", icon: "📞" },
                { s: "traite" as LeadStatus, label: "Dossier en cours", icon: "📋" },
                { s: "converti" as LeadStatus, label: "Client converti", icon: "✅" },
                { s: "archive" as LeadStatus, label: "Archiver", icon: "📁" },
              ] as { s: LeadStatus; label: string; icon: string }[]).filter(a => a.s !== lead.status).map(a => (
                <button key={a.s} onClick={() => statusMut.mutate(a.s)}
                  disabled={statusMut.isPending}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors disabled:opacity-50"
                  style={{ background: STATUS_CONFIG[a.s].bg, color: STATUS_CONFIG[a.s].color, border: `1px solid ${STATUS_CONFIG[a.s].dot}30` }}>
                  {a.icon} {a.label}
                </button>
              ))}
            </div>
          </div>
          {/* Notes */}
          <div className="w-full">
            <p className="text-[10px] tracking-[0.2em] uppercase font-medium mb-1.5" style={{ color: "hsl(224 15% 58%)" }}>Notes internes</p>
            <textarea value={notes} onChange={(e) => { setNotes(e.target.value); setNotesDirty(e.target.value !== (lead.notes ?? "")); }}
              placeholder="Suivi, rappels, observations…"
              rows={2}
              className="w-full resize-none rounded-lg px-3 py-2 text-[13px] font-light outline-none transition-all"
              style={{
                background: "white",
                border: `1px solid ${notesDirty ? "hsl(218 45% 42% / 0.4)" : "hsl(224 20% 12% / 0.10)"}`,
                color: "hsl(224 30% 25%)",
                boxShadow: notesDirty ? "0 0 0 3px hsl(218 45% 42% / 0.08)" : "none",
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
      )}
    </div>
  );
}

/* ─── Main page ─── */
type SortKey = "date_desc" | "date_asc" | "urgent";

export default function AdminLeadsList() {
  const [filter, setFilter] = useState<"tous" | LeadStatus>("tous");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("date_desc");
  const [showCharts, setShowCharts] = useState(false);
  const [dateRange, setDateRange] = useState<"tous" | "aujourd" | "7j" | "30j">("tous");

  const { data: leads = [], isLoading } = useQuery({ queryKey: ["leads"], queryFn: getLeads });

  const counts = useMemo(() => ({
    tous: leads.length,
    nouveau: leads.filter(l => l.status === "nouveau").length,
    appele: leads.filter(l => l.status === "appele").length,
    traite: leads.filter(l => l.status === "traite").length,
    converti: leads.filter(l => l.status === "converti").length,
    archive: leads.filter(l => l.status === "archive").length,
  }), [leads]);

  const conversionRate = leads.length === 0 ? 0 : Math.round((counts.converti / leads.length) * 100);

  const activeLeads = leads.filter(l => l.status === "nouveau" || l.status === "appele");
  const urgent = activeLeads.filter(l => l.timing === "asap").length;
  const overdue = activeLeads.filter(l => (Date.now() - new Date(l.created_at).getTime()) > 86_400_000 * 2).length;

  const filtered = useMemo(() => {
    const now = Date.now();
    const rangeCutoff: Record<string, number> = {
      aujourd: 86_400_000, "7j": 7 * 86_400_000, "30j": 30 * 86_400_000,
    };
    return leads
      .filter(l => filter === "tous" || l.status === filter)
      .filter(l => {
        if (dateRange === "tous") return true;
        return now - new Date(l.created_at).getTime() <= rangeCutoff[dateRange];
      })
      .filter(l => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return [l.nom, l.email, l.sujet, l.message, l.telephone, l.notes].filter(Boolean).some(v => v!.toLowerCase().includes(q));
      })
      .sort((a, b) => {
        if (sort === "date_asc") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        if (sort === "urgent") {
          const urgency = (l: Lead) => (l.timing === "asap" ? 0 : 1) + (l.status === "nouveau" ? 0 : 2);
          return urgency(a) - urgency(b);
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [leads, filter, search, sort, dateRange]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-heading font-light tracking-tight" style={{ color: "hsl(224 55% 12%)" }}>
            Leads & demandes
          </h1>
          <p className="text-[13px] font-light mt-1" style={{ color: "hsl(224 15% 52%)" }}>
            {leads.length} leads au total · {conversionRate}% de conversion
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {urgent > 0 && (
            <span className="px-3 py-1.5 rounded-full text-[11px] font-medium animate-pulse"
              style={{ background: "hsl(38 90% 50% / 0.15)", color: "hsl(38 65% 32%)" }}>
              ⚡ {urgent} urgent{urgent > 1 ? "s" : ""}
            </span>
          )}
          {overdue > 0 && (
            <span className="px-3 py-1.5 rounded-full text-[11px] font-medium"
              style={{ background: "hsl(0 60% 52% / 0.10)", color: "hsl(0 55% 38%)" }}>
              ⏰ {overdue} en retard
            </span>
          )}
          <button onClick={() => setShowCharts(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-[12px] font-medium transition-colors"
            style={{ background: "white", border: "1px solid hsl(224 20% 12% / 0.12)", color: "hsl(224 30% 42%)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(220 25% 96%)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "white"; }}>
            <BarChart3 className="w-3.5 h-3.5" />
            Analyse
          </button>
          <button onClick={() => exportLeadsCSV(leads)} disabled={leads.length === 0}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-[12px] font-medium transition-colors disabled:opacity-40"
            style={{ background: "white", border: "1px solid hsl(224 20% 12% / 0.12)", color: "hsl(224 30% 42%)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(220 25% 96%)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "white"; }}>
            <Download className="w-3.5 h-3.5" />
            CSV
          </button>
        </div>
      </div>

      {/* Stat cards + mini charts */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total leads", value: leads.length, icon: Users, color: "hsl(218 45% 42%)" },
          { label: "Non traités", value: counts.nouveau + counts.appele, icon: Clock, color: "hsl(38 70% 40%)" },
          { label: "Convertis", value: counts.converti, icon: CheckCircle2, color: "hsl(142 50% 35%)" },
          { label: "Taux conversion", value: `${conversionRate}%`, icon: TrendingUp, color: "hsl(224 55% 35%)" },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4"
            style={{ background: "white", border: "1px solid hsl(224 20% 12% / 0.08)" }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-medium tracking-wide uppercase" style={{ color: "hsl(224 15% 52%)" }}>{s.label}</p>
              <s.icon className="w-3.5 h-3.5" style={{ color: s.color }} />
            </div>
            <p className="text-2xl font-heading font-light tabular-nums" style={{ color: "hsl(224 55% 12%)" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Mini chart inline */}
      <div className="rounded-xl p-4" style={{ background: "white", border: "1px solid hsl(224 20% 12% / 0.08)" }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-medium tracking-wide uppercase" style={{ color: "hsl(224 15% 52%)" }}>
            Leads — 30 derniers jours
          </p>
          <button onClick={() => setShowCharts(true)}
            className="flex items-center gap-1.5 text-[11px] font-medium transition-colors"
            style={{ color: "hsl(218 48% 40%)" }}>
            <Maximize2 className="w-3.5 h-3.5" />
            Développer
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4 items-center">
          <div className="col-span-2">
            <VolumeChart leads={leads} days={30} height={64} />
          </div>
          <div>
            <StatusBars leads={leads} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: "hsl(224 20% 58%)" }} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher…"
            className="w-full pl-9 pr-3 py-2 text-[13px] rounded-lg outline-none"
            style={{ background: "white", border: "1px solid hsl(224 20% 12% / 0.10)", color: "hsl(224 30% 25%)" }} />
        </div>

        {/* Period filter */}
        <select value={dateRange} onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
          className="text-[12px] px-3 py-2 rounded-lg outline-none cursor-pointer"
          style={{ background: "white", border: "1px solid hsl(224 20% 12% / 0.10)", color: "hsl(224 30% 38%)" }}>
          <option value="tous">Toute période</option>
          <option value="aujourd">Aujourd'hui</option>
          <option value="7j">7 derniers jours</option>
          <option value="30j">30 derniers jours</option>
        </select>

        {/* Sort */}
        <button onClick={() => setSort(s => s === "date_desc" ? "date_asc" : s === "date_asc" ? "urgent" : "date_desc")}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium transition-colors"
          style={{ background: "white", border: "1px solid hsl(224 20% 12% / 0.10)", color: "hsl(224 30% 38%)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(220 25% 96%)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "white"; }}>
          <ArrowUpDown className="w-3.5 h-3.5" />
          {sort === "date_desc" ? "Récents d'abord" : sort === "date_asc" ? "Anciens d'abord" : "Urgents d'abord"}
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "hsl(224 20% 52%)" }} />
          {(["tous", ...STATUS_ORDER] as ("tous" | LeadStatus)[]).map((s) => (
            <button key={s} type="button" onClick={() => setFilter(s)}
              className="px-3 py-1.5 rounded-full text-[11px] font-medium transition-all whitespace-nowrap"
              style={{
                background: filter === s ? "hsl(224 60% 18%)" : "white",
                color: filter === s ? "white" : "hsl(224 25% 40%)",
                border: `1px solid ${filter === s ? "hsl(224 60% 18%)" : "hsl(224 20% 12% / 0.12)"}`,
              }}>
              {s === "tous" ? "Tous" : STATUS_CONFIG[s as LeadStatus].label} ({s === "tous" ? counts.tous : counts[s as LeadStatus] ?? 0})
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 rounded-full border-2 border-foreground/15 border-t-foreground/60 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: "white", border: "1px solid hsl(224 20% 12% / 0.07)" }}>
          <p className="text-[14px] font-light" style={{ color: "hsl(224 12% 55%)" }}>
            {search ? "Aucun résultat" : filter === "tous" ? "Aucun lead pour le moment" : `Aucun lead « ${STATUS_CONFIG[filter as LeadStatus]?.label ?? filter} »`}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filtered.map(lead => <LeadRow key={lead.id} lead={lead} />)}
        </div>
      )}

      {showCharts && <ChartsModal leads={leads} onClose={() => setShowCharts(false)} />}
    </div>
  );
}
