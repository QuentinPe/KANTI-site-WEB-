import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2, ChevronDown, ChevronUp, Mail, Phone, Calendar, Filter, Search, Download } from "lucide-react";
import { getLeads, updateLeadStatus, updateLeadNotes, deleteLead, exportLeadsCSV } from "@/lib/leadsService";
import type { Lead, LeadStatus } from "@/lib/leadsService";

const STATUS_CONFIG: Record<LeadStatus, { label: string; bg: string; color: string }> = {
  nouveau:  { label: "Nouveau",  bg: "hsl(38 90% 50% / 0.12)",  color: "hsl(38 70% 34%)"  },
  traite:   { label: "Traité",   bg: "hsl(218 55% 42% / 0.10)", color: "hsl(218 48% 38%)" },
  converti: { label: "Converti", bg: "hsl(142 55% 38% / 0.10)", color: "hsl(142 50% 30%)" },
  archive:  { label: "Archivé",  bg: "hsl(224 12% 55% / 0.10)", color: "hsl(224 12% 45%)" },
};

const ADVISOR_LABELS: Record<string, string> = {
  quentin: "Quentin Perromat", thomas: "Thomas Robert", any: "Peu importe",
};
const FORMAT_LABELS: Record<string, string> = {
  cabinet: "En cabinet", visio: "Visioconférence", telephone: "Téléphone",
};
const TIMING_LABELS: Record<string, string> = {
  asap: "Dès que possible", week: "Cette semaine", two_weeks: "Dans 2 semaines", month: "Dans le mois",
};

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

function StatusBadge({ status }: { status: LeadStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
      style={{ background: cfg.bg, color: cfg.color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
      {cfg.label}
    </span>
  );
}

function LeadRow({ lead }: { lead: Lead }) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [notesDirty, setNotesDirty] = useState(false);
  const qc = useQueryClient();

  useEffect(() => {
    setNotes(lead.notes ?? "");
    setNotesDirty(false);
  }, [lead.notes]);

  const statusMutation = useMutation({
    mutationFn: (status: LeadStatus) => updateLeadStatus(lead.id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["leads"] }),
  });

  const notesMutation = useMutation({
    mutationFn: (n: string) => updateLeadNotes(lead.id, n),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      setNotesDirty(false);
      toast.success("Notes enregistrées");
    },
    onError: () => {
      toast.error("Erreur — colonne notes manquante ? ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes text;");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteLead(lead.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["leads"] }),
  });

  const handleNotesChange = (v: string) => {
    setNotes(v);
    setNotesDirty(v !== (lead.notes ?? ""));
  };

  return (
    <div className="rounded-xl overflow-hidden"
      style={{ background: "white", border: "1px solid hsl(224 20% 12% / 0.08)", boxShadow: "0 1px 4px -2px hsl(224 60% 12% / 0.05)" }}>
      <div className="flex items-center gap-3 px-5 py-4">
        <div className="flex-1 min-w-0 grid grid-cols-[1fr_1fr_auto] gap-4 items-center">
          <div className="min-w-0">
            <p className="text-[14px] font-medium truncate" style={{ color: "hsl(224 55% 12%)" }}>{lead.nom}</p>
            <a href={`mailto:${lead.email}`}
              className="flex items-center gap-1 text-[12px] font-light hover:underline truncate"
              style={{ color: "hsl(224 40% 45%)" }}>
              <Mail className="w-3 h-3 flex-shrink-0" />
              {lead.email}
            </a>
          </div>
          <div className="min-w-0">
            {lead.sujet && <p className="text-[12px] font-medium truncate" style={{ color: "hsl(224 25% 35%)" }}>{lead.sujet}</p>}
            <p className="flex items-center gap-1 text-[11px] font-light" style={{ color: "hsl(224 15% 55%)" }}>
              <Calendar className="w-3 h-3" />
              {fmtDate(lead.created_at)}
            </p>
          </div>
          <StatusBadge status={lead.status} />
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <select
            value={lead.status}
            onChange={(e) => statusMutation.mutate(e.target.value as LeadStatus)}
            className="text-[12px] px-2.5 py-1.5 rounded-lg outline-none cursor-pointer"
            style={{ background: "hsl(220 25% 97%)", border: "1px solid hsl(224 20% 12% / 0.10)", color: "hsl(224 30% 38%)" }}
          >
            <option value="nouveau">Nouveau</option>
            <option value="traite">Traité</option>
            <option value="converti">Converti</option>
            <option value="archive">Archivé</option>
          </select>

          <button onClick={() => setExpanded((v) => !v)}
            className="p-2 rounded-lg transition-colors"
            style={{ color: "hsl(224 20% 55%)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(224 20% 12% / 0.06)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <button onClick={() => { if (confirm("Supprimer ce lead ?")) deleteMutation.mutate(); }}
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
                <Phone className="w-3.5 h-3.5" />
                {lead.telephone}
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
          {/* Notes internes */}
          <div className="w-full">
            <p className="text-[10px] tracking-[0.2em] uppercase font-medium mb-1.5" style={{ color: "hsl(224 15% 58%)" }}>
              Notes internes
            </p>
            <textarea
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Suivi, rappels, observations…"
              rows={2}
              className="w-full resize-none rounded-lg px-3 py-2 text-[13px] font-light outline-none transition-all"
              style={{
                background: "white",
                border: `1px solid ${notesDirty ? "hsl(218 45% 42% / 0.4)" : "hsl(224 20% 12% / 0.10)"}`,
                color: "hsl(224 30% 25%)",
                boxShadow: notesDirty ? "0 0 0 3px hsl(218 45% 42% / 0.08)" : "none",
              }}
            />
            {notesDirty && (
              <button
                onClick={() => notesMutation.mutate(notes)}
                disabled={notesMutation.isPending}
                className="mt-2 text-[11px] font-medium px-3 py-1.5 rounded-lg transition-opacity disabled:opacity-60"
                style={{ background: "hsl(218 45% 42%)", color: "white" }}
              >
                {notesMutation.isPending ? "Enregistrement…" : "Enregistrer"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminLeadsList() {
  const [filter, setFilter] = useState<"tous" | LeadStatus>("tous");
  const [search, setSearch] = useState("");
  const { data: leads = [], isLoading } = useQuery({ queryKey: ["leads"], queryFn: getLeads });

  const filtered = leads
    .filter((l) => filter === "tous" || l.status === filter)
    .filter((l) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return [l.nom, l.email, l.sujet, l.message, l.telephone, l.notes]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q));
    });

  const counts = {
    tous: leads.length,
    nouveau: leads.filter((l) => l.status === "nouveau").length,
    traite: leads.filter((l) => l.status === "traite").length,
    converti: leads.filter((l) => l.status === "converti").length,
    archive: leads.filter((l) => l.status === "archive").length,
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-heading font-light tracking-tight" style={{ color: "hsl(224 55% 12%)" }}>
            Leads & demandes
          </h1>
          <p className="text-[13px] font-light mt-1" style={{ color: "hsl(224 15% 52%)" }}>
            Messages reçus via le formulaire de contact
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {counts.nouveau > 0 && (
            <span className="px-3 py-1.5 rounded-full text-[12px] font-medium"
              style={{ background: "hsl(38 90% 50% / 0.12)", color: "hsl(38 70% 34%)" }}>
              {counts.nouveau} non traité{counts.nouveau > 1 ? "s" : ""}
            </span>
          )}
          <button
            onClick={() => exportLeadsCSV(leads)}
            disabled={leads.length === 0}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-[12px] font-medium transition-colors disabled:opacity-40"
            style={{ background: "white", border: "1px solid hsl(224 20% 12% / 0.12)", color: "hsl(224 30% 42%)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(220 25% 96%)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "white"; }}
          >
            <Download className="w-3.5 h-3.5" />
            Exporter CSV
          </button>
        </div>
      </div>

      {/* Search + filtres */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: "hsl(224 20% 58%)" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher…"
            className="w-full pl-9 pr-3 py-2 text-[13px] rounded-lg outline-none"
            style={{ background: "white", border: "1px solid hsl(224 20% 12% / 0.10)", color: "hsl(224 30% 25%)" }}
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "hsl(224 20% 52%)" }} />
          {(["tous", "nouveau", "traite", "converti", "archive"] as const).map((s) => (
            <button key={s} type="button" onClick={() => setFilter(s)}
              className="px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all duration-150 whitespace-nowrap"
              style={{
                background: filter === s ? "hsl(224 60% 18%)" : "white",
                color: filter === s ? "white" : "hsl(224 25% 40%)",
                border: `1px solid ${filter === s ? "hsl(224 60% 18%)" : "hsl(224 20% 12% / 0.12)"}`,
              }}>
              {s === "tous" ? "Tous" : STATUS_CONFIG[s as LeadStatus].label} ({counts[s]})
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 rounded-full border-2 border-foreground/15 border-t-foreground/60 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: "white", border: "1px solid hsl(224 20% 12% / 0.07)" }}>
          <p className="text-[14px] font-light" style={{ color: "hsl(224 12% 55%)" }}>
            {search ? "Aucun résultat pour cette recherche" : filter === "tous" ? "Aucun lead pour le moment" : "Aucun lead dans cette catégorie"}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((lead) => <LeadRow key={lead.id} lead={lead} />)}
        </div>
      )}
    </div>
  );
}
