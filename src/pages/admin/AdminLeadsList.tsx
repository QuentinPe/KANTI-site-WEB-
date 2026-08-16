import { useState, useMemo, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Search, Download, BarChart3, X, Phone, Mail,
  Trash2, Clock, TrendingUp, Users, CheckCircle2, ExternalLink, Archive,
} from "lucide-react";
import {
  getLeads, updateLeadStatus, updateLeadNotes, deleteLead, exportLeadsCSV, createLead,
} from "@/lib/leadsService";
import type { Lead, LeadStatus, LeadInput } from "@/lib/leadsService";
import { ADVISOR_LABELS, ADVISOR_INITIALS, FORMAT_LABELS, TIMING_LABELS } from "@/lib/leadsConfig";
import {
  StatusBars, PipelineHealth, bucketLeadsByDay, PERIODS, STATUS_CONFIG, STATUS_ORDER,
} from "@/components/admin/LeadsVolumeChart";
import type { PeriodKey } from "@/components/admin/LeadsVolumeChart";
import {
  GLASS, GLASS_HOVER_SHADOW, INNER_BG, INNER_BORDER,
  T_PRIMARY, T_SECONDARY, T_MUTED, T_HEADING, T_LABEL,
  C_BLUE, C_GOLD, C_SAGE, C_MAUVE, C_CORAL, C_TEAL,
  INPUT_STYLE, statusChipStyle, cA,
} from "@/lib/adminTheme";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

/* ─── Helpers ─── */
function fmtDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
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
/* ─── Email templates ─── */
const EMAIL_TEMPLATES = [
  {
    id: "prise_contact",
    label: "Prise de contact",
    subject: "Suite à votre demande – Cabinet KANTI",
    body: (nom: string) =>
      `Bonjour ${nom},\n\nNous avons bien reçu votre demande et vous en remercions.\n\n` +
      `En tant que cabinet de gestion patrimoniale à Bordeaux, KANTI accompagne ses clients dans leurs projets d'épargne, d'investissement immobilier et d'optimisation fiscale.\n\n` +
      `Nous serions ravis d'échanger avec vous lors d'un entretien personnalisé. Pourriez-vous nous indiquer vos disponibilités ?\n\nCordialement,\nL'équipe KANTI`,
  },
  {
    id: "relance",
    label: "Relance",
    subject: "Relance – Votre projet patrimonial",
    body: (nom: string) =>
      `Bonjour ${nom},\n\nNous nous permettons de vous recontacter suite à votre demande auprès du cabinet KANTI.\n\n` +
      `Votre projet nous tient à cœur et nous souhaitons nous assurer que vous avez bien reçu nos précédents messages.\n\n` +
      `N'hésitez pas à nous répondre directement ou à nous appeler. Nous restons à votre disposition.\n\nCordialement,\nL'équipe KANTI`,
  },
  {
    id: "confirmation_rdv",
    label: "Confirmation RDV",
    subject: "Confirmation de votre rendez-vous – KANTI",
    body: (nom: string) =>
      `Bonjour ${nom},\n\nNous confirmons votre rendez-vous avec notre équipe.\n\n` +
      `Date : [DATE]\nHeure : [HEURE]\nLieu : [LIEU / Visioconférence]\n\n` +
      `Merci de nous prévenir en cas d'empêchement. Nous vous attendons avec plaisir.\n\nCordialement,\nL'équipe KANTI`,
  },
  {
    id: "envoi_docs",
    label: "Envoi de documents",
    subject: "Documents – Votre dossier KANTI",
    body: (nom: string) =>
      `Bonjour ${nom},\n\nVeuillez trouver ci-joint les documents relatifs à votre dossier.\n\n` +
      `N'hésitez pas à nous contacter si vous avez des questions ou souhaitez les commenter lors d'un entretien.\n\nCordialement,\nL'équipe KANTI`,
  },
];

function MailTemplatePicker({ lead, variant = "icon" }: { lead: Lead; variant?: "icon" | "button" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);

  const buildMailto = (t: typeof EMAIL_TEMPLATES[0]) =>
    `mailto:${lead.email}?subject=${encodeURIComponent(t.subject)}&body=${encodeURIComponent(t.body(lead.nom))}`;

  const dropdown = open && (
    <div
      className="absolute z-[300] rounded-xl p-1.5"
      style={{
        bottom: "calc(100% + 6px)",
        left: 0,
        minWidth: 200,
        background: "hsl(224 58% 8% / 0.97)",
        backdropFilter: "blur(24px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.13)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.55)",
      }}
    >
      <p className="px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-wide" style={{ color: T_MUTED }}>
        Modèle d'email
      </p>
      {EMAIL_TEMPLATES.map((t) => (
        <a key={t.id} href={buildMailto(t)} target="_blank" rel="noreferrer"
          onClick={() => setOpen(false)}
          className="flex items-center px-2.5 py-2 rounded-lg text-[12px] transition-colors hover:bg-white/10"
          style={{ color: "rgba(255,255,255,0.80)" }}
        >
          {t.label}
        </a>
      ))}
      <div className="my-1" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />
      <a href={`mailto:${lead.email}`} onClick={() => setOpen(false)}
        className="flex items-center px-2.5 py-2 rounded-lg text-[12px] transition-colors hover:bg-white/10"
        style={{ color: "rgba(255,255,255,0.38)" }}
      >
        Email vierge
      </a>
    </div>
  );

  if (variant === "button") {
    return (
      <div ref={ref} className="flex-1 relative" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-medium"
          style={{ background: INNER_BG, color: T_SECONDARY, border: `1px solid ${INNER_BORDER}` }}
        >
          <Mail className="w-4 h-4" />Email
        </button>
        {dropdown}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-1.5 rounded-lg transition-colors"
        style={{ color: C_BLUE }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(215 42% 65% / 0.12)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
        title="Envoyer un email"
      >
        <Mail className="w-3.5 h-3.5" />
      </button>
      {dropdown}
    </div>
  );
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
function scoreMeta(level: "Élevé" | "Moyen" | "Faible") {
  if (level === "Élevé") return { color: C_SAGE, bg: "hsl(158 32% 56% / 0.15)" };
  if (level === "Moyen") return { color: C_GOLD, bg: "hsl(40 50% 62% / 0.15)" };
  return { color: T_MUTED, bg: "rgba(255,255,255,0.06)" };
}

/* ─── Multi-line chart ─── */
function MultiLineChart({ leads, days }: { leads: Lead[]; days: number }) {
  const useWeeks = days > 60;
  const count = useWeeks ? Math.ceil(days / 7) : days;

  const buckets = useMemo(() => {
    const now = Date.now();
    return Array.from({ length: count }, (_, i) => {
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
  }, [leads, days, count, useWeeks]);

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
            <stop offset="0%" stopColor="hsl(215 42% 65%)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="hsl(215 42% 65%)" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="mlg-traite" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(180 32% 54%)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="hsl(180 32% 54%)" stopOpacity="0.01" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <line key={f} x1={0} y1={H - padY - f * (H - padY * 2)} x2={W} y2={H - padY - f * (H - padY * 2)}
            stroke="rgba(255,255,255,0.07)" strokeWidth="0.8" />
        ))}
        {totalLine.area && <path d={totalLine.area} fill="url(#mlg-total)" />}
        {traiteLine.area && <path d={traiteLine.area} fill="url(#mlg-traite)" />}
        {totalLine.path && <path d={totalLine.path} fill="none" stroke={C_BLUE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />}
        {traiteLine.path && <path d={traiteLine.path} fill="none" stroke={C_TEAL} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />}
        {convertiLine.path && <path d={convertiLine.path} fill="none" stroke={C_SAGE} strokeWidth="1.4" strokeDasharray="4 2" strokeLinecap="round" />}
        {totalLine.pts.length > 0 && (
          <circle cx={totalLine.pts[totalLine.pts.length - 1].x} cy={totalLine.pts[totalLine.pts.length - 1].y}
            r="3" fill="rgba(255,255,255,0.9)" stroke={C_BLUE} strokeWidth="1.8" />
        )}
      </svg>
      <div className="relative" style={{ height: 18 }}>
        {xLabels.map(({ label, i }) => (
          <span key={i} className="absolute text-[9px] -translate-x-1/2 tabular-nums"
            style={{ left: `${(i / Math.max(count - 1, 1)) * 100}%`, color: T_MUTED }}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Donut chart ─── */
function DonutChart({ leads }: { leads: Lead[] }) {
  const COLORS = [C_BLUE, C_GOLD, C_SAGE, C_MAUVE, C_CORAL];
  const groups = useMemo(() => {
    const map = new Map<string, number>();
    leads.forEach((l) => { const src = getSource(l); map.set(src, (map.get(src) ?? 0) + 1); });
    return [...map.entries()].sort((a, b) => b[1] - a[1]).map(([label, count], i) => ({
      label, count, color: COLORS[i % COLORS.length],
    }));
  }, [leads]);

  const total = leads.length;
  if (total === 0) return <p className="text-[11px] text-center py-4" style={{ color: T_MUTED }}>Aucune donnée</p>;

  const cx = 50, cy = 50, R = 42, r = 26;
  let angle = -Math.PI / 2;
  const arcs = groups.map((g) => {
    const sweep = (g.count / total) * 2 * Math.PI;
    const end = angle + sweep;
    const path = sweep >= 2 * Math.PI - 0.001
      ? `M ${cx + R},${cy} A ${R},${R},0,1,1,${cx + R - 0.001},${cy} Z M ${cx + r},${cy} A ${r},${r},0,1,0,${cx + r - 0.001},${cy} Z`
      : [`M ${cx + R * Math.cos(angle)},${cy + R * Math.sin(angle)}`,
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
        <text x={cx} y={cy - 5} textAnchor="middle" fontSize="13" fontWeight="600" fill={T_PRIMARY}>{total}</text>
        <text x={cx} y={cy + 9} textAnchor="middle" fontSize="7" fill={T_MUTED}>Total</text>
      </svg>
      <div className="space-y-2 flex-1 min-w-0">
        {arcs.map((a) => (
          <div key={a.label} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: a.color }} />
            <span className="text-[11px] font-light truncate flex-1" style={{ color: T_SECONDARY }}>{a.label}</span>
            <span className="text-[11px] font-medium tabular-nums flex-shrink-0" style={{ color: T_PRIMARY }}>{a.count}</span>
            <span className="text-[10px] flex-shrink-0" style={{ color: T_MUTED }}>({Math.round(a.count / total * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Charts modal ─── */
function ChartsModal({ leads, onClose }: { leads: Lead[]; onClose: () => void }) {
  const [period, setPeriod] = useState<PeriodKey>("30j");
  const days = PERIODS.find((p) => p.key === period)?.days ?? 30;
  const buckets = useMemo(() => bucketLeadsByDay(leads, days), [leads, days]);
  const totalInPeriod = buckets.reduce((s, b) => s + b.total, 0);
  const convertiInPeriod = buckets.reduce((s, b) => s + b.converti, 0);
  const maxBucket = Math.max(...buckets.map((b) => b.total), 1);
  const taux = totalInPeriod === 0 ? 0 : Math.round((convertiInPeriod / totalInPeriod) * 100);

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 300, background: "hsl(224 60% 6% / 0.55)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-3xl rounded-2xl overflow-hidden"
        style={{ ...GLASS, boxShadow: "0 32px 80px -20px rgba(0,0,0,0.5)" }}>
        <div className="flex items-center justify-between px-7 py-5" style={{ borderBottom: `1px solid ${INNER_BORDER}` }}>
          <div>
            <h2 className="text-lg font-heading font-light" style={{ color: T_PRIMARY }}>Analyse des leads</h2>
            <p className="text-[12px] font-light mt-0.5" style={{ color: T_SECONDARY }}>
              {totalInPeriod} leads · {convertiInPeriod} convertis · {taux}% de conversion
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: INNER_BG }}>
              {PERIODS.map((p) => (
                <button key={p.key} onClick={() => setPeriod(p.key)}
                  className="px-2.5 py-1 rounded-md text-[11px] font-medium transition-all"
                  style={{
                    background: period === p.key ? "rgba(255,255,255,0.12)" : "transparent",
                    color: period === p.key ? C_BLUE : T_SECONDARY,
                    boxShadow: "none",
                  }}>{p.label}</button>
              ))}
            </div>
            <button onClick={onClose} className="p-2 rounded-lg"
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
              <X className="w-4 h-4" style={{ color: T_SECONDARY }} />
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
                style={{ background: INNER_BG, border: `1px solid ${INNER_BORDER}` }}>
                <p className="text-xl font-heading font-light tabular-nums" style={{ color: T_PRIMARY }}>{s.value}</p>
                <p className="text-[10px] uppercase tracking-wide mt-0.5" style={{ color: T_MUTED }}>{s.label}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6 pt-2" style={{ borderTop: `1px solid ${INNER_BORDER}` }}>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide mb-4" style={{ color: T_SECONDARY }}>Répartition</p>
              <StatusBars leads={leads} />
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide mb-4" style={{ color: T_SECONDARY }}>Délai de traitement</p>
              <PipelineHealth leads={leads} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── New Lead Modal ─── */
function NewLeadModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState<Partial<LeadInput>>({ conseiller: "any", format: "visio", timing: "asap" });
  const [saving, setSaving] = useState(false);

  const set = (k: keyof LeadInput, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.nom?.trim() || !form.email?.trim()) { toast.error("Nom et email obligatoires"); return; }
    setSaving(true);
    try {
      await createLead({ nom: form.nom, email: form.email, telephone: form.telephone || null, conseiller: form.conseiller || "any", format: form.format || "visio", timing: form.timing || "asap", sujet: form.sujet || null, message: form.message || null });
      await qc.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead créé");
      onClose();
    } catch { toast.error("Erreur lors de la création"); }
    finally { setSaving(false); }
  };

  const inputCls = "w-full px-3 py-2 rounded-lg text-[13px] outline-none";

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 300, background: "hsl(224 60% 6% / 0.50)", backdropFilter: "blur(5px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden"
        style={{ ...GLASS, boxShadow: "0 24px 60px -16px rgba(0,0,0,0.5)" }}>
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${INNER_BORDER}` }}>
          <h2 className="text-[16px] font-medium" style={{ color: T_PRIMARY }}>Nouveau lead</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg"
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
            <X className="w-4 h-4" style={{ color: T_SECONDARY }} />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium mb-1.5" style={{ color: T_LABEL }}>Nom *</label>
              <input className={inputCls} style={{ ...INPUT_STYLE }} placeholder="Jean Dupont"
                value={form.nom ?? ""} onChange={(e) => set("nom", e.target.value)} />
            </div>
            <div>
              <label className="block text-[11px] font-medium mb-1.5" style={{ color: T_LABEL }}>Email *</label>
              <input type="email" className={inputCls} style={{ ...INPUT_STYLE }} placeholder="jean@example.com"
                value={form.email ?? ""} onChange={(e) => set("email", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium mb-1.5" style={{ color: T_LABEL }}>Téléphone</label>
              <input className={inputCls} style={{ ...INPUT_STYLE }} placeholder="06 XX XX XX XX"
                value={form.telephone ?? ""} onChange={(e) => set("telephone", e.target.value)} />
            </div>
            <div>
              <label className="block text-[11px] font-medium mb-1.5" style={{ color: T_LABEL }}>Sujet</label>
              <input className={inputCls} style={{ ...INPUT_STYLE }} placeholder="Retraite, immobilier…"
                value={form.sujet ?? ""} onChange={(e) => set("sujet", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium mb-1.5" style={{ color: T_LABEL }}>Conseiller</label>
              <select className={inputCls} style={{ ...INPUT_STYLE }} value={form.conseiller ?? "any"} onChange={(e) => set("conseiller", e.target.value)}>
                {Object.entries(ADVISOR_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium mb-1.5" style={{ color: T_LABEL }}>Format</label>
              <select className={inputCls} style={{ ...INPUT_STYLE }} value={form.format ?? "visio"} onChange={(e) => set("format", e.target.value)}>
                {Object.entries(FORMAT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium mb-1.5" style={{ color: T_LABEL }}>Disponibilité</label>
              <select className={inputCls} style={{ ...INPUT_STYLE }} value={form.timing ?? "asap"} onChange={(e) => set("timing", e.target.value)}>
                {Object.entries(TIMING_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-medium mb-1.5" style={{ color: T_LABEL }}>Message</label>
            <textarea className={inputCls} style={{ ...INPUT_STYLE, resize: "vertical", minHeight: 72 }} rows={3}
              placeholder="Contexte ou besoin du prospect…"
              value={form.message ?? ""} onChange={(e) => set("message", e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4" style={{ borderTop: `1px solid ${INNER_BORDER}` }}>
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-[13px]"
            style={{ background: INNER_BG, color: T_SECONDARY, border: `1px solid ${INNER_BORDER}` }}>
            Annuler
          </button>
          <button onClick={handleSave} disabled={saving}
            className="px-5 py-2 rounded-xl text-[13px] font-medium disabled:opacity-50"
            style={{ background: "hsl(215 42% 65% / 0.18)", color: C_BLUE, border: `1px solid hsl(215 42% 65% / 0.30)` }}>
            {saving ? "Création…" : "Créer le lead"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Lead detail panel ─── */
function LeadDetailPanel({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const qc = useQueryClient();
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [notesDirty, setNotesDirty] = useState(false);

  useEffect(() => { setNotes(lead.notes ?? ""); setNotesDirty(false); }, [lead.id, lead.notes]);

  const statusMut = useMutation({
    mutationFn: (s: LeadStatus) => updateLeadStatus(lead.id, s),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["leads"] }); toast.success("Statut mis à jour"); },
    onError: () => toast.error("Impossible de mettre à jour le statut"),
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
  const { color: levelColor } = scoreMeta(level);
  const cfg = STATUS_CONFIG[lead.status];
  const hue = avatarHue(lead.nom);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0" style={{ zIndex: 200, background: "hsl(224 60% 6% / 0.30)" }} onClick={onClose} />
      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md flex flex-col"
        style={{ zIndex: 201, ...GLASS, borderLeft: `1px solid ${INNER_BORDER}`, boxShadow: "-24px 0 60px -20px rgba(0,0,0,0.4)", borderRadius: 0 }}>
        <div className="flex items-start justify-between px-6 py-5" style={{ borderBottom: `1px solid ${INNER_BORDER}` }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-semibold flex-shrink-0"
              style={{ background: `hsl(${hue} 55% 88%)`, color: `hsl(${hue} 55% 28%)` }}>
              {getInitials(lead.nom)}
            </div>
            <div>
              <p className="text-[15px] font-medium" style={{ color: T_PRIMARY }}>{lead.nom}</p>
              <a href={`mailto:${lead.email}`} className="text-[12px] font-light hover:underline" style={{ color: C_BLUE }}>
                {lead.email}
              </a>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg"
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
            <X className="w-4 h-4" style={{ color: T_SECONDARY }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
              style={{ background: cfg.bg, color: cfg.color }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />{cfg.label}
            </span>
            <span className="text-[12px] font-medium" style={{ color: levelColor }}>
              Score {score} · <span style={{ fontWeight: 400 }}>{level}</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Source",       value: getSource(lead) },
              { label: "Téléphone",    value: lead.telephone ?? "—" },
              { label: "Format",       value: lead.format ? (FORMAT_LABELS[lead.format] ?? lead.format) : "—" },
              { label: "Disponibilité",value: lead.timing ? (TIMING_LABELS[lead.timing] ?? lead.timing) : "—" },
              { label: "Conseiller",   value: lead.conseiller ? (ADVISOR_LABELS[lead.conseiller] ?? lead.conseiller) : "—" },
              { label: "Reçu le",      value: fmtDate(lead.created_at) },
            ].map((f) => (
              <div key={f.label}>
                <p className="text-[10px] uppercase tracking-[0.18em] font-medium mb-0.5" style={{ color: T_MUTED }}>{f.label}</p>
                {f.label === "Téléphone" && lead.telephone ? (
                  <a href={`tel:${lead.telephone}`} className="text-[13px] font-light hover:underline" style={{ color: C_BLUE }}>
                    {lead.telephone}
                  </a>
                ) : (
                  <p className="text-[13px] font-light" style={{ color: T_SECONDARY }}>{f.value}</p>
                )}
              </div>
            ))}
          </div>

          {lead.message && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] font-medium mb-2" style={{ color: T_MUTED }}>Message</p>
              <p className="text-[13px] font-light leading-relaxed" style={{ color: T_SECONDARY }}>{lead.message}</p>
            </div>
          )}

          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] font-medium mb-2" style={{ color: T_MUTED }}>Changer le statut</p>
            <div className="flex flex-wrap gap-1.5">
              {STATUS_ORDER.filter((s) => s !== lead.status).map((s) => {
                const c = STATUS_CONFIG[s];
                return (
                  <button key={s} onClick={() => statusMut.mutate(s)} disabled={statusMut.isPending}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all disabled:opacity-50"
                    style={{ background: c.bg, color: c.color, border: `1px solid ${c.dot}33` }}>
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] font-medium mb-2" style={{ color: T_MUTED }}>Notes internes</p>
            <textarea value={notes} rows={3}
              onChange={(e) => { setNotes(e.target.value); setNotesDirty(e.target.value !== (lead.notes ?? "")); }}
              placeholder="Suivi, rappels, observations…"
              className="w-full resize-none rounded-xl px-3.5 py-2.5 text-[13px] font-light outline-none transition-all"
              style={{
                ...INPUT_STYLE,
                border: `1px solid ${notesDirty ? cA(C_BLUE, 0.66) : INNER_BORDER}`,
              }} />
            {notesDirty && (
              <button onClick={() => notesMut.mutate(notes)} disabled={notesMut.isPending}
                className="mt-2 text-[11px] font-medium px-3 py-1.5 rounded-lg disabled:opacity-60"
                style={{ background: "hsl(215 42% 65% / 0.18)", color: C_BLUE, border: `1px solid hsl(215 42% 65% / 0.30)` }}>
                {notesMut.isPending ? "Enregistrement…" : "Enregistrer"}
              </button>
            )}
          </div>
        </div>

        <div className="px-6 py-4 flex items-center gap-3" style={{ borderTop: `1px solid ${INNER_BORDER}` }}>
          {lead.telephone && (
            <a href={`tel:${lead.telephone}`}
              onClick={() => { if (lead.status !== "appele") statusMut.mutate("appele"); }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-medium"
              style={{ background: "hsl(215 42% 65% / 0.12)", color: C_BLUE, border: `1px solid hsl(215 42% 65% / 0.25)` }}>
              <Phone className="w-4 h-4" />Appeler
            </a>
          )}
          <MailTemplatePicker lead={lead} variant="button" />
          {lead.status !== "archive" && (
            <button onClick={() => { statusMut.mutate("archive"); onClose(); }}
              title="Archiver ce lead"
              className="p-2.5 rounded-xl transition-colors"
              style={{ color: C_GOLD, border: `1px solid hsl(40 50% 62% / 0.25)` }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(40 50% 62% / 0.12)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
              <Archive className="w-4 h-4" />
            </button>
          )}
          <button onClick={() => { if (confirm(`Supprimer le lead de ${lead.nom} ?`)) deleteMut.mutate(); }}
            title="Supprimer définitivement"
            className="p-2.5 rounded-xl transition-colors"
            style={{ color: C_CORAL, border: `1px solid hsl(5 45% 56% / 0.25)` }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(5 45% 56% / 0.12)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── Table row ─── */
function LeadTableRow({ lead, onClick, selected, onSelect, seen }: {
  lead: Lead; onClick: () => void; selected: boolean; onSelect: (v: boolean) => void; seen: boolean;
}) {
  const qc = useQueryClient();
  const { score, level } = computeScore(lead);
  const cfg = STATUS_CONFIG[lead.status];
  const hue = avatarHue(lead.nom);
  const { color: levelColor, bg: levelBg } = scoreMeta(level);
  const isUnseen = lead.status === "nouveau" && !seen;

  const statusMut = useMutation({
    mutationFn: (s: LeadStatus) => updateLeadStatus(lead.id, s),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["leads"] }); toast.success("Statut mis à jour"); },
    onError: () => toast.error("Impossible de mettre à jour le statut"),
  });

  return (
    <tr className="group transition-colors cursor-pointer"
      style={{
        borderBottom: `1px solid ${INNER_BORDER}`,
        background: selected ? "hsl(215 42% 65% / 0.08)" : isUnseen ? "hsl(40 50% 62% / 0.08)" : "transparent",
        borderLeft: isUnseen ? `3px solid ${C_GOLD}` : "3px solid transparent",
      }}
      onMouseEnter={(e) => { if (!selected) (e.currentTarget as HTMLElement).style.background = isUnseen ? "hsl(40 50% 62% / 0.12)" : INNER_BG; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = selected ? "hsl(215 42% 65% / 0.08)" : isUnseen ? "hsl(40 50% 62% / 0.08)" : "transparent"; }}
      onClick={onClick}>

      {/* Checkbox */}
      <td className="pl-5 pr-2 py-3.5 w-8" onClick={(e) => e.stopPropagation()}>
        <input type="checkbox" checked={selected} onChange={(e) => onSelect(e.target.checked)}
          className="w-3.5 h-3.5 rounded" style={{ accentColor: C_BLUE }} />
      </td>

      {/* Lead */}
      <td className="py-3.5 pr-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0"
            style={{ background: `hsl(${hue} 50% 88%)`, color: `hsl(${hue} 55% 28%)` }}>
            {getInitials(lead.nom)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-[13px] font-medium truncate" style={{ color: T_PRIMARY }}>{lead.nom}</p>
              {isUnseen && (
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C_GOLD }} />
              )}
            </div>
            <p className="text-[11px] font-light truncate" style={{ color: T_SECONDARY }}>{lead.email}</p>
          </div>
        </div>
      </td>

      {/* Source */}
      <td className="py-3.5 pr-4">
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium"
          style={{ background: "hsl(215 42% 65% / 0.12)", color: C_BLUE }}>
          {getSource(lead)}
        </span>
      </td>

      {/* Statut · Radix Select styled as badge */}
      <td className="py-3.5 pr-4" onClick={(e) => e.stopPropagation()}>
        <Select
          value={lead.status}
          onValueChange={(v) => statusMut.mutate(v as LeadStatus)}
          disabled={statusMut.isPending}
        >
          <SelectTrigger
            className="h-auto ring-0 focus:ring-0 focus:ring-offset-0 shadow-none text-[11px] font-medium rounded-full px-2.5 py-1 gap-1 [&>svg]:w-3 [&>svg]:h-3 [&>svg]:opacity-50 disabled:opacity-50"
            style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.dot}55`, minWidth: 90 }}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            className="min-w-[148px] rounded-xl border-0 p-1"
            style={{
              background: "hsl(224 58% 8% / 0.97)",
              backdropFilter: "blur(24px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.13)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.55)",
              zIndex: 999,
            }}
          >
            {STATUS_ORDER.map((s) => {
              const sc = STATUS_CONFIG[s];
              return (
                <SelectItem key={s} value={s} textValue={sc.label}
                  className="text-[12px] rounded-lg cursor-pointer data-[highlighted]:bg-white/10 data-[highlighted]:text-white"
                  style={{ color: "rgba(255,255,255,0.78)" }}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: sc.dot }} />
                    {sc.label}
                  </span>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </td>

      {/* Score */}
      <td className="py-3.5 pr-4">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium tabular-nums" style={{ color: T_PRIMARY }}>{score}</span>
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ background: levelBg, color: levelColor }}>
            {level}
          </span>
        </div>
      </td>

      {/* Assigné */}
      <td className="py-3.5 pr-4">
        {lead.conseiller && lead.conseiller !== "any" ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
              style={{ background: "hsl(215 42% 65% / 0.15)", color: C_BLUE }}>
              {ADVISOR_INITIALS[lead.conseiller] ?? "?"}
            </div>
            <span className="text-[12px] font-light truncate" style={{ color: T_LABEL }}>
              {ADVISOR_LABELS[lead.conseiller] ?? lead.conseiller}
            </span>
          </div>
        ) : (
          <span className="text-[12px]" style={{ color: T_MUTED }}>—</span>
        )}
      </td>

      {/* Date */}
      <td className="py-3.5 pr-4">
        <p className="text-[12px] font-light tabular-nums" style={{ color: T_SECONDARY }}>
          {fmtDate(lead.created_at)}
        </p>
      </td>

      {/* Actions */}
      <td className="py-3.5 pr-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {lead.telephone && (
            <a href={`tel:${lead.telephone}`}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: C_TEAL }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(180 32% 54% / 0.12)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
              <Phone className="w-3.5 h-3.5" />
            </a>
          )}
          <MailTemplatePicker lead={lead} variant="icon" />
        </div>
      </td>
    </tr>
  );
}

/* ─── Main page ─── */
type SortKey = "date_desc" | "date_asc" | "urgent" | "score_desc";

/* ─── Convertis Panel ─── */
function ConvertisHeader({ leads }: { leads: Lead[] }) {
  const converted = leads.filter((l) => l.status === "converti");
  const total = leads.length;
  const rate = total === 0 ? 0 : Math.round((converted.length / total) * 100);

  const sourceMap = new Map<string, number>();
  converted.forEach((l) => {
    const s = getSource(l);
    sourceMap.set(s, (sourceMap.get(s) ?? 0) + 1);
  });
  const topSource = [...sourceMap.entries()].sort((a, b) => b[1] - a[1])[0];

  const consMap = new Map<string, number>();
  converted.forEach((l) => {
    if (l.conseiller && l.conseiller !== "any") {
      const label = ADVISOR_LABELS[l.conseiller] ?? l.conseiller;
      consMap.set(label, (consMap.get(label) ?? 0) + 1);
    }
  });
  const topCons = [...consMap.entries()].sort((a, b) => b[1] - a[1])[0];

  const avgDays = converted.length === 0 ? null : Math.round(
    converted.reduce((s, l) => s + (Date.now() - new Date(l.created_at).getTime()) / 86_400_000, 0) / converted.length,
  );

  if (converted.length === 0) return null;

  const cards = [
    {
      label: "Total convertis",
      value: String(converted.length),
      sub: `sur ${total} lead${total !== 1 ? "s" : ""} au pipeline`,
      big: true,
    },
    {
      label: "Taux de conversion",
      value: `${rate}%`,
      sub: "du pipeline total",
      big: true,
    },
    {
      label: "Source principale",
      value: topSource ? topSource[0] : "—",
      sub: topSource ? `${topSource[1]} converti${topSource[1] !== 1 ? "s" : ""}` : "Aucune donnée",
      big: false,
    },
    {
      label: "Conseiller top",
      value: topCons ? topCons[0] : "Non assigné",
      sub: topCons ? `${topCons[1]} converti${topCons[1] !== 1 ? "s" : ""}` : `Ancienneté moy. ${avgDays ?? "—"}j`,
      big: false,
    },
  ];

  return (
    <div className="px-5 pt-5">
      <div className="grid grid-cols-4 gap-3 mb-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl p-4"
            style={{ background: "hsl(142 55% 38% / 0.08)", border: "1px solid hsl(142 55% 38% / 0.20)" }}>
            <p className="text-[10px] font-medium uppercase tracking-wide mb-1.5" style={{ color: T_MUTED }}>
              {card.label}
            </p>
            {card.big ? (
              <p className="text-[26px] font-light tabular-nums leading-none" style={{ color: C_SAGE }}>
                {card.value}
              </p>
            ) : (
              <p className="text-[15px] font-medium leading-snug" style={{ color: T_PRIMARY }}>
                {card.value}
              </p>
            )}
            <p className="text-[10px] mt-1.5 leading-snug" style={{ color: T_MUTED }}>{card.sub}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 pb-3" style={{ borderBottom: `1px solid ${INNER_BORDER}` }}>
        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: C_SAGE }} />
        <p className="text-[12px] font-medium" style={{ color: C_SAGE }}>
          {converted.length} lead{converted.length !== 1 ? "s" : ""} converti{converted.length !== 1 ? "s" : ""}
        </p>
        <span className="text-[11px]" style={{ color: T_MUTED }}>
          · ancienneté moyenne {avgDays ?? "—"} jour{avgDays !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}

export default function AdminLeadsList() {
  const qc = useQueryClient();
  const [tabFilter, setTabFilter] = useState<"tous" | LeadStatus>("tous");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("date_desc");
  const [showCharts, setShowCharts] = useState(false);
  const [showNewLead, setShowNewLead] = useState(false);
  const [chartPeriod, setChartPeriod] = useState<PeriodKey>("30j");
  const [dateRange, setDateRange] = useState<"tous" | "aujourd" | "7j" | "30j">("tous");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [seenIds, setSeenIds] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("seen-lead-ids") || "[]")); }
    catch { return new Set(); }
  });

  const markAsSeen = (id: string) => {
    setSeenIds(prev => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      // Cap at 1000 IDs to prevent unbounded localStorage growth
      const arr = [...next];
      const capped = arr.length > 1000 ? arr.slice(arr.length - 1000) : arr;
      localStorage.setItem("seen-lead-ids", JSON.stringify(capped));
      return new Set(capped);
    });
  };
  const PER_PAGE = 20;

  const { data: leads = [], isLoading } = useQuery({ queryKey: ["leads"], queryFn: getLeads });

  const handleBulkArchive = async () => {
    const ids = [...selectedRows];
    try {
      await Promise.all(ids.map((id) => updateLeadStatus(id, "archive")));
      await qc.invalidateQueries({ queryKey: ["leads"] });
      setSelectedRows(new Set());
      toast.success(`${ids.length} lead${ids.length > 1 ? "s" : ""} archivé${ids.length > 1 ? "s" : ""}`);
    } catch { toast.error("Erreur lors de l'archivage"); }
  };

  const handleBulkDelete = async () => {
    const ids = [...selectedRows];
    if (!confirm(`Supprimer définitivement ${ids.length} lead${ids.length > 1 ? "s" : ""} ?`)) return;
    try {
      await Promise.all(ids.map((id) => deleteLead(id)));
      await qc.invalidateQueries({ queryKey: ["leads"] });
      setSelectedRows(new Set());
      toast.success(`${ids.length} lead${ids.length > 1 ? "s" : ""} supprimé${ids.length > 1 ? "s" : ""}`);
    } catch { toast.error("Erreur lors de la suppression"); }
  };
  const chartDays = PERIODS.find((p) => p.key === chartPeriod)?.days ?? 30;

  /* Trend vs previous period */
  const { leadsInPeriod, leadsInPrev } = useMemo(() => {
    const now = Date.now();
    const periodMs = chartDays * 86_400_000;
    return {
      leadsInPeriod: leads.filter((l) => now - new Date(l.created_at).getTime() <= periodMs),
      leadsInPrev:   leads.filter((l) => { const age = now - new Date(l.created_at).getTime(); return age > periodMs && age <= 2 * periodMs; }),
    };
  }, [leads, chartDays]);

  function trend(curr: number, prev: number) {
    if (prev === 0) return null;
    return Math.round(((curr - prev) / prev) * 100);
  }

  const counts = useMemo(() => ({
    tous:     leads.length,
    nouveau:  leads.filter((l) => l.status === "nouveau").length,
    appele:   leads.filter((l) => l.status === "appele").length,
    traite:   leads.filter((l) => l.status === "traite").length,
    converti: leads.filter((l) => l.status === "converti").length,
    archive:  leads.filter((l) => l.status === "archive").length,
  }), [leads]);

  const conversionRate = leads.length === 0 ? 0 : Math.round((counts.converti / leads.length) * 100);

  const filtered = useMemo(() => {
    const now = Date.now();
    const rangeCutoff: Record<string, number> = {
      aujourd: 86_400_000, "7j": 7 * 86_400_000, "30j": 30 * 86_400_000,
    };
    return leads
      .filter((l) => tabFilter === "tous" || l.status === tabFilter)
      .filter((l) => dateRange === "tous" || now - new Date(l.created_at).getTime() <= rangeCutoff[dateRange])
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
  }, [leads, tabFilter, search, sort, dateRange]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const selectedLead = selectedId ? leads.find((l) => l.id === selectedId) ?? null : null;

  /* Reset page + selection on filter change */
  useEffect(() => {
    setPage(1);
    setSelectedRows(new Set());
  }, [tabFilter, search, sort, dateRange]);

  const allPageSelected = paginated.length > 0 && paginated.every((l) => selectedRows.has(l.id));

  const TABS: { key: "tous" | LeadStatus; label: string }[] = [
    { key: "tous",     label: `Tous (${counts.tous})` },
    { key: "nouveau",  label: `Nouveaux (${counts.nouveau})` },
    { key: "appele",   label: `Assignés (${counts.appele})` },
    { key: "traite",   label: `Traités (${counts.traite})` },
    { key: "converti", label: `Convertis (${counts.converti})` },
    { key: "archive",  label: `Archivés (${counts.archive})` },
  ];

  const statCards = [
    { label: "Total leads",       value: counts.tous,       t: trend(leadsInPeriod.length, leadsInPrev.length),                                                                                          icon: Users,         color: C_BLUE,  iconBg: "hsl(215 42% 65% / 0.12)" },
    { label: "Nouveaux leads",    value: counts.nouveau,    t: trend(leadsInPeriod.filter((l) => l.status === "nouveau").length,  leadsInPrev.filter((l) => l.status === "nouveau").length),             icon: TrendingUp,    color: C_TEAL,  iconBg: "hsl(180 32% 54% / 0.12)" },
    { label: "Convertis",         value: counts.converti,   t: trend(leadsInPeriod.filter((l) => l.status === "converti").length, leadsInPrev.filter((l) => l.status === "converti").length),            icon: CheckCircle2,  color: C_SAGE,  iconBg: "hsl(158 32% 56% / 0.12)" },
    { label: "Taux de conversion",value: `${conversionRate}%`, t: null,                                                                                                                                   icon: Clock,         color: C_GOLD,  iconBg: "hsl(40 50% 62% / 0.12)" },
  ];

  return (
    <div className="min-h-screen">
      <div className="p-7 space-y-5">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-heading font-light tracking-tight" style={{ color: T_PRIMARY }}>Leads</h1>
            <p className="text-[13px] font-light mt-0.5" style={{ color: T_SECONDARY }}>
              Gérez et analysez vos leads générés depuis votre site web.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <a href="/" target="_blank" rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium transition-all"
              style={{ background: INNER_BG, border: `1px solid ${INNER_BORDER}`, color: T_SECONDARY }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.10)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = INNER_BG; }}>
              <ExternalLink className="w-3.5 h-3.5" />Voir le site
            </a>
            <button onClick={() => setShowCharts(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium transition-all"
              style={{ background: INNER_BG, border: `1px solid ${INNER_BORDER}`, color: T_SECONDARY }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.10)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = INNER_BG; }}>
              <BarChart3 className="w-4 h-4" />Analyse
            </button>
            <button onClick={() => exportLeadsCSV(leads)} disabled={leads.length === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium transition-all disabled:opacity-40"
              style={{ background: INNER_BG, border: `1px solid ${INNER_BORDER}`, color: T_SECONDARY }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.10)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = INNER_BG; }}>
              <Download className="w-4 h-4" />Exporter
            </button>
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <div key={s.label} className="rounded-2xl p-5" style={{ ...GLASS }}>
              <div className="flex items-start justify-between mb-3">
                <p className="text-[12px] font-medium" style={{ color: T_SECONDARY }}>{s.label}</p>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: s.iconBg }}>
                  <s.icon className="w-4 h-4" style={{ color: s.color }} strokeWidth={1.5} />
                </div>
              </div>
              <p className="text-3xl font-heading font-light tabular-nums" style={{ color: T_PRIMARY }}>{s.value}</p>
              {s.t !== null ? (
                <p className="text-[11px] font-light mt-1.5" style={{ color: s.t >= 0 ? C_SAGE : C_CORAL }}>
                  {s.t >= 0 ? "↑" : "↓"} {Math.abs(s.t)}% vs période précédente
                </p>
              ) : (
                <p className="text-[11px] font-light mt-1.5" style={{ color: T_MUTED }}>Période : {chartPeriod}</p>
              )}
            </div>
          ))}
        </div>

        {/* ── Chart section ── */}
        <div className="rounded-2xl" style={{ ...GLASS }}>
          <div className="px-6 py-4 flex items-center justify-between flex-wrap gap-3" style={{ borderBottom: `1px solid ${INNER_BORDER}` }}>
            <div className="flex items-center gap-4 flex-wrap">
              <p className="text-[14px] font-medium" style={{ color: T_HEADING }}>Évolution des leads</p>
              <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: INNER_BG }}>
                {PERIODS.map((p) => (
                  <button key={p.key} onClick={() => setChartPeriod(p.key)}
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium transition-all"
                    style={{
                      background: chartPeriod === p.key ? "rgba(255,255,255,0.12)" : "transparent",
                      color: chartPeriod === p.key ? C_BLUE : T_SECONDARY,
                      boxShadow: "none",
                    }}>{p.label}</button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4 text-[11px]" style={{ color: T_SECONDARY }}>
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-0.5 rounded inline-block" style={{ background: C_BLUE }} />Nouveaux
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-0.5 rounded inline-block" style={{ background: C_TEAL }} />Traités
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-5 inline-block" style={{ height: 1, borderTop: `2px dashed ${C_SAGE}` }} />Convertis
              </span>
            </div>
          </div>
          <div className="grid lg:grid-cols-[1fr_300px]">
            <div className="p-6" style={{ borderRight: `1px solid ${INNER_BORDER}` }}>
              <MultiLineChart leads={leads} days={chartDays} />
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                {[
                  { label: "Nouveaux / Assignés", count: counts.nouveau + counts.appele,
                    t: trend(leadsInPeriod.filter((l) => l.status === "nouveau" || l.status === "appele").length, leadsInPrev.filter((l) => l.status === "nouveau" || l.status === "appele").length),
                    color: C_BLUE },
                  { label: "Traités", count: counts.traite,
                    t: trend(leadsInPeriod.filter((l) => l.status === "traite").length, leadsInPrev.filter((l) => l.status === "traite").length),
                    color: C_TEAL },
                  { label: "Convertis", count: counts.converti,
                    t: trend(leadsInPeriod.filter((l) => l.status === "converti").length, leadsInPrev.filter((l) => l.status === "converti").length),
                    color: C_SAGE },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                      <span className="text-[12px] font-light" style={{ color: T_SECONDARY }}>{item.label}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-[14px] font-medium tabular-nums" style={{ color: T_PRIMARY }}>{item.count}</p>
                      {item.t !== null && (
                        <p className="text-[10px]" style={{ color: item.t >= 0 ? C_SAGE : C_CORAL }}>
                          {item.t >= 0 ? "↑" : "↓"} {Math.abs(item.t)}%
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: `1px solid ${INNER_BORDER}`, paddingTop: "1.25rem" }}>
                <p className="text-[11px] font-medium uppercase tracking-wide mb-3" style={{ color: T_SECONDARY }}>Sources des leads</p>
                <DonutChart leads={leads} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Table section ── */}
        <div className="rounded-2xl overflow-hidden" style={{ ...GLASS }}>
          {/* Toolbar */}
          <div className="px-5 py-4 flex items-center justify-between gap-3 flex-wrap"
            style={{ borderBottom: `1px solid ${INNER_BORDER}` }}>
            <div className="flex items-center gap-2 flex-wrap flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: T_MUTED }} />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher un lead…"
                  className="pl-9 pr-4 py-2 rounded-lg text-[13px] outline-none w-52"
                  style={{ ...INPUT_STYLE }} />
              </div>
              <Select value={dateRange} onValueChange={(v) => setDateRange(v as typeof dateRange)}>
                <SelectTrigger
                  className="h-auto w-auto text-[12px] rounded-lg border-0 shadow-none ring-0 focus:ring-0 focus:ring-offset-0 min-w-[140px]"
                  style={{ ...INPUT_STYLE, padding: "0.5rem 0.75rem" }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  className="min-w-[160px] rounded-xl border-0 p-1"
                  style={{
                    background: "hsl(224 58% 9% / 0.97)",
                    backdropFilter: "blur(24px) saturate(180%)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.50)",
                  }}
                >
                  {(["tous", "aujourd", "7j", "30j"] as const).map((v, i) => (
                    <SelectItem key={v} value={v}
                      className="text-[12px] rounded-lg cursor-pointer data-[highlighted]:bg-white/10 data-[highlighted]:text-white"
                      style={{ color: "rgba(255,255,255,0.78)" }}
                    >
                      {["Toute période", "Aujourd'hui", "7 derniers jours", "30 derniers jours"][i]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                <SelectTrigger
                  className="h-auto w-auto text-[12px] rounded-lg border-0 shadow-none ring-0 focus:ring-0 focus:ring-offset-0 min-w-[160px]"
                  style={{ ...INPUT_STYLE, padding: "0.5rem 0.75rem" }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  className="min-w-[180px] rounded-xl border-0 p-1"
                  style={{
                    background: "hsl(224 58% 9% / 0.97)",
                    backdropFilter: "blur(24px) saturate(180%)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.50)",
                  }}
                >
                  {(["date_desc", "date_asc", "urgent", "score_desc"] as const).map((v, i) => (
                    <SelectItem key={v} value={v}
                      className="text-[12px] rounded-lg cursor-pointer data-[highlighted]:bg-white/10 data-[highlighted]:text-white"
                      style={{ color: "rgba(255,255,255,0.78)" }}
                    >
                      {["Récents d'abord", "Anciens d'abord", "Urgents d'abord", "Score décroissant"][i]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <button onClick={() => setShowNewLead(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium flex-shrink-0"
              style={{ background: "hsl(215 42% 65% / 0.18)", color: C_BLUE, border: `1px solid hsl(215 42% 65% / 0.30)` }}>
              + Nouveau lead
            </button>
          </div>

          {/* Bulk actions bar */}
          {selectedRows.size > 0 && (
            <div className="px-5 py-2.5 flex items-center gap-3 flex-wrap"
              style={{ background: "hsl(215 42% 65% / 0.08)", borderBottom: `1px solid hsl(215 42% 65% / 0.15)` }}>
              <span className="text-[12px] font-medium" style={{ color: C_BLUE }}>
                {selectedRows.size} sélectionné{selectedRows.size > 1 ? "s" : ""}
              </span>
              <button onClick={handleBulkArchive}
                className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-lg font-medium transition-colors"
                style={{ background: "hsl(40 50% 62% / 0.12)", color: C_GOLD, border: `1px solid hsl(40 50% 62% / 0.25)` }}>
                <Archive className="w-3.5 h-3.5" />Archiver
              </button>
              <button onClick={handleBulkDelete}
                className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-lg font-medium transition-colors"
                style={{ background: "hsl(5 45% 56% / 0.10)", color: C_CORAL, border: `1px solid hsl(5 45% 56% / 0.25)` }}>
                <Trash2 className="w-3.5 h-3.5" />Supprimer
              </button>
              <button onClick={() => setSelectedRows(new Set())}
                className="ml-auto text-[11px] font-light transition-opacity hover:opacity-70"
                style={{ color: T_MUTED }}>
                Désélectionner tout
              </button>
            </div>
          )}

          {/* Tabs */}
          <div className="flex items-center gap-0 px-5 overflow-x-auto" style={{ borderBottom: `1px solid ${INNER_BORDER}` }}>
            {TABS.map((tab) => (
              <button key={tab.key} onClick={() => setTabFilter(tab.key)}
                className="px-4 py-3 text-[13px] font-medium whitespace-nowrap transition-all"
                style={{
                  color: tabFilter === tab.key ? C_BLUE : T_SECONDARY,
                  borderBottom: tabFilter === tab.key ? `2px solid ${C_BLUE}` : "2px solid transparent",
                  background: "transparent",
                }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Convertis stats panel */}
          {tabFilter === "converti" && <ConvertisHeader leads={leads} />}

          {/* Table */}
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-6 h-6 rounded-full border-2 animate-spin"
                style={{ borderColor: INNER_BORDER, borderTopColor: T_SECONDARY }} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[14px] font-light" style={{ color: T_SECONDARY }}>
                {search ? "Aucun résultat pour cette recherche" : "Aucun lead dans cette catégorie"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${INNER_BORDER}`, background: INNER_BG }}>
                    <th className="pl-5 pr-2 py-3 w-8">
                      <input type="checkbox" checked={allPageSelected}
                        onChange={(e) => setSelectedRows(e.target.checked ? new Set(paginated.map((l) => l.id)) : new Set())}
                        className="w-3.5 h-3.5 rounded" style={{ accentColor: C_BLUE }} />
                    </th>
                    {["Lead", "Source", "Statut", "Score", "Assigné à", "Date", "Actions"].map((h) => (
                      <th key={h} className="py-3 pr-4 text-left text-[11px] font-medium uppercase tracking-wide"
                        style={{ color: T_MUTED }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody style={{ background: "transparent" }}>
                  {paginated.map((lead) => (
                    <LeadTableRow key={lead.id} lead={lead}
                      selected={selectedRows.has(lead.id)}
                      seen={seenIds.has(lead.id)}
                      onSelect={(v) => setSelectedRows((prev) => {
                        const next = new Set(prev);
                        v ? next.add(lead.id) : next.delete(lead.id);
                        return next;
                      })}
                      onClick={() => {
                        markAsSeen(lead.id);
                        setSelectedId((id) => id === lead.id ? null : lead.id);
                      }}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {filtered.length > PER_PAGE && (
            <div className="flex items-center justify-between px-5 py-3.5"
              style={{ borderTop: `1px solid ${INNER_BORDER}` }}>
              <p className="text-[12px] font-light" style={{ color: T_SECONDARY }}>
                {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} sur {filtered.length} leads
              </p>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                  className="w-7 h-7 rounded flex items-center justify-center text-[12px] disabled:opacity-30"
                  style={{ border: `1px solid ${INNER_BORDER}`, color: T_SECONDARY }}>‹</button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      className="w-7 h-7 rounded text-[12px] font-medium"
                      style={{
                        background: page === p ? "hsl(215 42% 65% / 0.22)" : "transparent",
                        color: page === p ? C_BLUE : T_SECONDARY,
                        border: page === p ? "none" : `1px solid ${INNER_BORDER}`,
                      }}>{p}</button>
                  );
                })}
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="w-7 h-7 rounded flex items-center justify-center text-[12px] disabled:opacity-30"
                  style={{ border: `1px solid ${INNER_BORDER}`, color: T_SECONDARY }}>›</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedLead && <LeadDetailPanel lead={selectedLead} onClose={() => setSelectedId(null)} />}
      {showCharts && <ChartsModal leads={leads} onClose={() => setShowCharts(false)} />}
      {showNewLead && <NewLeadModal onClose={() => setShowNewLead(false)} />}
    </div>
  );
}