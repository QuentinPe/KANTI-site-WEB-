import { useState, useMemo, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Search, Download, BarChart3, X, Phone, Mail, Plus,
  Trash2, Archive, MoreHorizontal, Users, TrendingUp, CheckCircle2, Clock,
} from "lucide-react";
import {
  getLeads, updateLeadStatus, updateLeadNotes, deleteLead, exportLeadsCSV, createLead,
} from "@/lib/leadsService";
import type { Lead, LeadStatus, LeadInput } from "@/lib/leadsService";
import { ADVISOR_LABELS, ADVISOR_INITIALS, FORMAT_LABELS, TIMING_LABELS } from "@/lib/leadsConfig";
import {
  StatusBars, PipelineHealth, bucketLeadsByDay, PERIODS,
} from "@/components/admin/LeadsVolumeChart";
import type { PeriodKey } from "@/components/admin/LeadsVolumeChart";
import {
  GLASS, INNER_BG, INNER_BORDER,
  T_PRIMARY, T_SECONDARY, T_MUTED, T_HEADING, T_LABEL,
  C_BLUE, C_GOLD, C_SAGE, C_MAUVE, C_CORAL, C_TEAL,
  INPUT_STYLE, cA,
} from "@/lib/adminTheme";

/* ─── Status config (light-theme) ─── */
const PS: Record<LeadStatus, { label: string; bg: string; color: string; dot: string }> = {
  nouveau:  { label: "Nouveau",  bg: "hsl(214 80% 55% / 0.12)", color: "hsl(214 65% 38%)", dot: "hsl(214 65% 42%)" },
  appele:   { label: "Appelé",   bg: "hsl(200 55% 50% / 0.12)", color: "hsl(200 55% 36%)", dot: "hsl(200 55% 42%)" },
  traite:   { label: "Traité",   bg: "hsl(38 85% 55% / 0.12)",  color: "hsl(38 70% 34%)",  dot: "hsl(38 70% 40%)"  },
  converti: { label: "Converti", bg: "hsl(142 50% 42% / 0.12)", color: "hsl(142 50% 28%)", dot: "hsl(142 50% 34%)" },
  archive:  { label: "Archivé",  bg: "hsl(220 12% 55% / 0.10)", color: "hsl(220 12% 44%)", dot: "hsl(220 12% 50%)" },
};
const STATUS_ORDER: LeadStatus[] = ["nouveau", "appele", "traite", "converti", "archive"];

/* ─── Helpers ─── */
function fmtShort(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (diff === 0) return "Aujourd'hui";
  if (diff === 1) return "Hier";
  if (diff < 7) return `Il y a ${diff}j`;
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}
function fmtFull(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
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
function getActionLabel(lead: Lead): string {
  if (lead.timing === "asap") return "Dès que possible";
  if (lead.timing === "week") return "Cette semaine";
  if (lead.timing === "two_weeks") return "Dans 2 sem.";
  if (lead.timing === "month") return "Ce mois";
  return "—";
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
      `Bonjour ${nom},\n\nNous confirmons votre rendez-vous avec notre équipe.\n\nDate : [DATE]\nHeure : [HEURE]\nLieu : [LIEU / Visioconférence]\n\n` +
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
        background: "hsl(0 0% 100%)",
        border: `1px solid ${INNER_BORDER}`,
        boxShadow: "0 4px 20px hsl(220 60% 8% / 0.12)",
      }}
    >
      <p className="px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-wide" style={{ color: T_MUTED }}>
        Modèle d'email
      </p>
      {EMAIL_TEMPLATES.map((t) => (
        <a key={t.id} href={buildMailto(t)} target="_blank" rel="noreferrer"
          onClick={() => setOpen(false)}
          className="flex items-center px-2.5 py-2 rounded-lg text-[12px] transition-colors"
          style={{ color: T_HEADING }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = INNER_BG; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
        >
          {t.label}
        </a>
      ))}
      <div className="my-1" style={{ borderTop: `1px solid ${INNER_BORDER}` }} />
      <a href={`mailto:${lead.email}`} onClick={() => setOpen(false)}
        className="flex items-center px-2.5 py-2 rounded-lg text-[12px] transition-colors"
        style={{ color: T_MUTED }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = INNER_BG; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
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
          <Mail className="w-4 h-4" /> Envoyer un e-mail
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

/* ─── Multi-line chart (for ChartsModal) ─── */
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
            stroke="hsl(216 18% 92%)" strokeWidth="0.8" />
        ))}
        {totalLine.area && <path d={totalLine.area} fill="url(#mlg-total)" />}
        {traiteLine.area && <path d={traiteLine.area} fill="url(#mlg-traite)" />}
        {totalLine.path && <path d={totalLine.path} fill="none" stroke={C_BLUE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />}
        {traiteLine.path && <path d={traiteLine.path} fill="none" stroke={C_TEAL} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />}
        {convertiLine.path && <path d={convertiLine.path} fill="none" stroke={C_SAGE} strokeWidth="1.4" strokeDasharray="4 2" strokeLinecap="round" />}
        {totalLine.pts.length > 0 && (
          <circle cx={totalLine.pts[totalLine.pts.length - 1].x} cy={totalLine.pts[totalLine.pts.length - 1].y}
            r="3" fill="hsl(0 0% 100%)" stroke={C_BLUE} strokeWidth="1.8" />
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
                    background: period === p.key ? "hsl(0 0% 100%)" : "transparent",
                    color: period === p.key ? C_BLUE : T_SECONDARY,
                    boxShadow: period === p.key ? "0 1px 3px hsl(220 60% 8% / 0.08)" : "none",
                  }}>{p.label}</button>
              ))}
            </div>
            <button onClick={onClose} className="p-2 rounded-lg"
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = INNER_BG; }}
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

/* ─── New lead modal ─── */
function NewLeadModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState<Partial<LeadInput>>({ conseiller: "any", format: "visio", timing: "asap" });
  const [saving, setSaving] = useState(false);

  const set = (k: keyof LeadInput, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.nom?.trim() || !form.email?.trim()) { toast.error("Nom et email obligatoires"); return; }
    setSaving(true);
    try {
      await createLead({
        nom: form.nom, email: form.email,
        telephone: form.telephone || null,
        conseiller: form.conseiller || "any",
        format: form.format || "visio",
        timing: form.timing || "asap",
        sujet: form.sujet || null,
        message: form.message || null,
      });
      await qc.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Prospect créé");
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
          <h2 className="text-[16px] font-medium" style={{ color: T_PRIMARY }}>Nouveau prospect</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg"
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = INNER_BG; }}
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
            style={{ background: C_BLUE, color: "hsl(0 0% 100%)" }}>
            {saving ? "Création…" : "Créer le prospect"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Lead side panel ─── */
function LeadSidePanel({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const qc = useQueryClient();
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [notesDirty, setNotesDirty] = useState(false);

  useEffect(() => {
    setNotes(lead.notes ?? "");
    setNotesDirty(false);
  }, [lead.id, lead.notes]);

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
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["leads"] }); onClose(); toast.success("Prospect supprimé"); },
    onError: () => toast.error("Impossible de supprimer ce prospect"),
  });

  const cfg = PS[lead.status];
  const hue = avatarHue(lead.nom);
  const initials = getInitials(lead.nom);
  const advLabel = lead.conseiller && lead.conseiller !== "any"
    ? (ADVISOR_LABELS[lead.conseiller] ?? lead.conseiller)
    : null;

  return (
    <div
      className="flex-shrink-0 flex flex-col overflow-hidden"
      style={{
        width: 360,
        background: "hsl(0 0% 100%)",
        borderLeft: `1px solid ${INNER_BORDER}`,
      }}
    >
      {/* Header */}
      <div className="px-5 py-4 flex-shrink-0" style={{ borderBottom: `1px solid ${INNER_BORDER}` }}>
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
            style={{ background: cfg.bg, color: cfg.color }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
            {cfg.label}
          </span>
          <button onClick={onClose} className="p-1.5 rounded-full transition-colors"
            style={{ color: T_MUTED }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = INNER_BG; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-[15px] font-semibold flex-shrink-0"
            style={{ background: `hsl(${hue} 45% 86%)`, color: `hsl(${hue} 55% 28%)` }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[16px] font-medium leading-tight" style={{ color: T_PRIMARY }}>{lead.nom}</p>
            <p className="text-[12px] font-light mt-0.5 truncate" style={{ color: T_MUTED }}>{lead.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {lead.telephone ? (
            <a href={`tel:${lead.telephone}`}
              onClick={() => { if (lead.status !== "appele" && lead.status !== "traite") statusMut.mutate("appele"); }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12.5px] font-medium"
              style={{ background: C_BLUE, color: "hsl(0 0% 100%)" }}>
              <Phone className="w-3.5 h-3.5" /> Appeler
            </a>
          ) : (
            <button disabled className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12.5px] font-medium opacity-40"
              style={{ background: INNER_BG, color: T_SECONDARY, border: `1px solid ${INNER_BORDER}` }}>
              <Phone className="w-3.5 h-3.5" /> Appeler
            </button>
          )}
          <MailTemplatePicker lead={lead} variant="button" />
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        {/* Contact info */}
        <div className="px-5 py-4" style={{ borderBottom: `1px solid ${INNER_BORDER}` }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: T_LABEL }}>
            Informations de contact
          </p>
          <div className="space-y-2.5">
            <div className="flex items-center gap-3">
              <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{ color: T_MUTED }} />
              <a href={`mailto:${lead.email}`} className="text-[12.5px] hover:underline truncate" style={{ color: C_BLUE }}>
                {lead.email}
              </a>
            </div>
            {lead.telephone && (
              <div className="flex items-center gap-3">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" style={{ color: T_MUTED }} />
                <a href={`tel:${lead.telephone}`} className="text-[12.5px] hover:underline" style={{ color: C_BLUE }}>
                  {lead.telephone}
                </a>
              </div>
            )}
            <Row label="Source" value={getSource(lead)} />
            {advLabel && <Row label="Conseiller" value={advLabel} />}
            <Row label="Ajouté le" value={fmtFull(lead.created_at)} />
          </div>
        </div>

        {/* Demande */}
        <div className="px-5 py-4" style={{ borderBottom: `1px solid ${INNER_BORDER}` }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: T_LABEL }}>
            Demande
          </p>
          <div className="space-y-2.5">
            {lead.sujet && <Row label="Sujet" value={lead.sujet} />}
            {lead.format && <Row label="Format" value={FORMAT_LABELS[lead.format] ?? lead.format} />}
            {lead.timing && <Row label="Horizon" value={TIMING_LABELS[lead.timing] ?? lead.timing} isUrgent={lead.timing === "asap"} />}
            {lead.message && (
              <div className="pt-1">
                <p className="text-[11px] font-medium mb-1.5" style={{ color: T_MUTED }}>Message</p>
                <p className="text-[12.5px] font-light leading-relaxed italic" style={{ color: T_SECONDARY }}>
                  « {lead.message} »
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Changer statut */}
        <div className="px-5 py-4" style={{ borderBottom: `1px solid ${INNER_BORDER}` }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: T_LABEL }}>
            Changer le statut
          </p>
          <div className="flex flex-wrap gap-1.5">
            {STATUS_ORDER.filter((s) => s !== lead.status).map((s) => {
              const c = PS[s];
              return (
                <button key={s} onClick={() => statusMut.mutate(s)} disabled={statusMut.isPending}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all disabled:opacity-50"
                  style={{ background: c.bg, color: c.color, border: `1px solid ${c.dot}55` }}>
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notes */}
        <div className="px-5 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: T_LABEL }}>
            Notes internes
          </p>
          <textarea
            value={notes}
            rows={4}
            onChange={(e) => { setNotes(e.target.value); setNotesDirty(e.target.value !== (lead.notes ?? "")); }}
            placeholder="Suivi, rappels, observations…"
            className="w-full resize-none rounded-xl text-[12.5px] font-light outline-none transition-all"
            style={{
              ...INPUT_STYLE,
              border: `1px solid ${notesDirty ? cA(C_BLUE, 0.55) : INNER_BORDER}`,
            }}
          />
          {notesDirty && (
            <button onClick={() => notesMut.mutate(notes)} disabled={notesMut.isPending}
              className="mt-2 text-[11px] font-medium px-3 py-1.5 rounded-lg disabled:opacity-60"
              style={{ background: cA(C_BLUE, 0.10), color: C_BLUE, border: `1px solid ${cA(C_BLUE, 0.25)}` }}>
              {notesMut.isPending ? "Enregistrement…" : "Enregistrer"}
            </button>
          )}
        </div>
      </div>

      {/* Footer actions */}
      <div className="px-5 py-3 flex items-center gap-1 flex-shrink-0" style={{ borderTop: `1px solid ${INNER_BORDER}` }}>
        {lead.status !== "archive" && (
          <button
            onClick={() => { statusMut.mutate("archive"); onClose(); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium transition-colors"
            style={{ color: C_GOLD }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = cA(C_GOLD, 0.10); }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
            <Archive className="w-3.5 h-3.5" /> Archiver
          </button>
        )}
        <div className="flex-1" />
        <button
          onClick={() => { if (confirm(`Supprimer ${lead.nom} définitivement ?`)) deleteMut.mutate(); }}
          disabled={deleteMut.isPending}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium transition-colors disabled:opacity-50"
          style={{ color: C_CORAL }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = cA(C_CORAL, 0.10); }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
          <Trash2 className="w-3.5 h-3.5" /> Supprimer
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, isUrgent }: { label: string; value: string; isUrgent?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-[11px] font-medium w-20 flex-shrink-0 mt-[1px]" style={{ color: T_MUTED }}>{label}</span>
      <span className="text-[12.5px] leading-snug" style={{ color: isUrgent ? C_CORAL : T_SECONDARY }}>{value}</span>
    </div>
  );
}

/* ─── Table row ─── */
function LeadRow({
  lead, isSelected, isActive, isUnseen, onSelect, onClick, isLast,
}: {
  lead: Lead; isSelected: boolean; isActive: boolean; isUnseen: boolean;
  onSelect: (v: boolean) => void; onClick: () => void; isLast: boolean;
}) {
  const qc = useQueryClient();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const cfg = PS[lead.status];

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const statusMut = useMutation({
    mutationFn: (s: LeadStatus) => updateLeadStatus(lead.id, s),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["leads"] }); toast.success("Statut mis à jour"); },
  });
  const deleteMut = useMutation({
    mutationFn: () => deleteLead(lead.id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["leads"] }); toast.success("Prospect supprimé"); },
  });

  const hue = avatarHue(lead.nom);
  const initials = getInitials(lead.nom);
  const advInitials = lead.conseiller && lead.conseiller !== "any"
    ? (ADVISOR_INITIALS[lead.conseiller] ?? null)
    : null;

  return (
    <tr
      className="group cursor-pointer"
      style={{
        borderBottom: isLast ? "none" : `1px solid ${INNER_BORDER}`,
        background: isActive ? cA(C_BLUE, 0.06) : "transparent",
        transition: "background 0.1s",
      }}
      onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = INNER_BG; }}
      onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
      onClick={onClick}
    >
      {/* Checkbox */}
      <td className="px-4 py-3 w-8" onClick={(e) => e.stopPropagation()}>
        <div
          className="w-4 h-4 rounded-[4px] flex items-center justify-center border cursor-pointer transition-all"
          style={{
            borderColor: isSelected ? C_BLUE : INNER_BORDER,
            background: isSelected ? C_BLUE : "transparent",
          }}
          onClick={() => onSelect(!isSelected)}
        >
          {isSelected && <span style={{ color: "white", fontSize: 7, fontWeight: 900, lineHeight: 1 }}>✓</span>}
        </div>
      </td>

      {/* Prospect */}
      <td className="px-3 py-3">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0"
            style={{ background: `hsl(${hue} 45% 86%)`, color: `hsl(${hue} 55% 28%)` }}>
            {initials}
            {isUnseen && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                style={{ background: C_BLUE, border: "1.5px solid white" }} />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-medium truncate" style={{ color: T_PRIMARY, maxWidth: 140 }}>{lead.nom}</p>
            <p className="text-[11px] truncate font-light" style={{ color: T_MUTED, maxWidth: 140 }}>{lead.email}</p>
          </div>
        </div>
      </td>

      {/* Demande */}
      <td className="px-3 py-3">
        <p className="text-[12.5px] truncate font-light" style={{ color: T_SECONDARY, maxWidth: 120 }}>
          {lead.sujet ?? "—"}
        </p>
      </td>

      {/* Source */}
      <td className="px-3 py-3">
        <p className="text-[12.5px] truncate font-light" style={{ color: T_SECONDARY, maxWidth: 120 }}>
          {getSource(lead)}
        </p>
      </td>

      {/* Statut */}
      <td className="px-3 py-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap"
          style={{ background: cfg.bg, color: cfg.color }}>
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
          {cfg.label}
        </span>
      </td>

      {/* Responsable */}
      <td className="px-3 py-3">
        {advInitials ? (
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
            style={{ background: cA(C_BLUE, 0.10), color: C_BLUE }}>
            {advInitials}
          </div>
        ) : (
          <span className="text-[12px] font-light" style={{ color: T_MUTED }}>—</span>
        )}
      </td>

      {/* Reçu le */}
      <td className="px-3 py-3">
        <p className="text-[12px] whitespace-nowrap font-light" style={{ color: T_SECONDARY }}>
          {fmtShort(lead.created_at)}
        </p>
      </td>

      {/* Disponibilité */}
      <td className="px-3 py-3">
        <p className="text-[12px] truncate font-light"
          style={{ color: lead.timing === "asap" ? C_CORAL : T_SECONDARY, maxWidth: 120 }}>
          {getActionLabel(lead)}
        </p>
      </td>

      {/* Actions ⋮ */}
      <td className="px-3 py-3 w-10" onClick={(e) => e.stopPropagation()}>
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color: T_MUTED }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = INNER_BG;
              (e.currentTarget as HTMLElement).style.opacity = "1";
            }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 z-[200] rounded-xl p-1.5"
              style={{
                minWidth: 170,
                background: "hsl(0 0% 100%)",
                border: `1px solid ${INNER_BORDER}`,
                boxShadow: "0 4px 20px hsl(220 60% 8% / 0.12)",
              }}>
              {lead.telephone && (
                <a href={`tel:${lead.telephone}`} onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] transition-colors"
                  style={{ color: T_HEADING }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = INNER_BG; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                  <Phone className="w-3.5 h-3.5" style={{ color: T_MUTED }} /> Appeler
                </a>
              )}
              <a href={`mailto:${lead.email}`} onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] transition-colors"
                style={{ color: T_HEADING }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = INNER_BG; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                <Mail className="w-3.5 h-3.5" style={{ color: T_MUTED }} /> Envoyer un email
              </a>
              <div style={{ borderTop: `1px solid ${INNER_BORDER}`, margin: "4px 0" }} />
              {lead.status !== "archive" && (
                <button onClick={() => { statusMut.mutate("archive"); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] transition-colors"
                  style={{ color: C_GOLD }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = cA(C_GOLD, 0.08); }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                  <Archive className="w-3.5 h-3.5" /> Archiver
                </button>
              )}
              <button
                onClick={() => {
                  if (confirm(`Supprimer ${lead.nom} définitivement ?`)) {
                    deleteMut.mutate();
                    setMenuOpen(false);
                  }
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] transition-colors"
                style={{ color: C_CORAL }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = cA(C_CORAL, 0.08); }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                <Trash2 className="w-3.5 h-3.5" /> Supprimer
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

/* ─── Main export ─── */
type TabKey = "tous" | "nouveau" | "en_cours" | "converti" | "archive";

export default function AdminLeadsList() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<TabKey>("tous");
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("tous");
  const [conseillerFilter, setConseillerFilter] = useState("tous");
  const [dateRange, setDateRange] = useState<"tous" | "aujourd" | "7j" | "30j">("tous");
  const [sort, setSort] = useState<"date_desc" | "date_asc" | "urgent">("date_desc");
  const [showCharts, setShowCharts] = useState(false);
  const [showNewLead, setShowNewLead] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [seenIds, setSeenIds] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("seen-lead-ids") || "[]")); }
    catch { return new Set(); }
  });

  const PER_PAGE = 25;

  const { data: leads = [], isLoading } = useQuery({ queryKey: ["leads"], queryFn: getLeads });

  const markAsSeen = (id: string) => {
    setSeenIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      const arr = [...next];
      const capped = arr.length > 1000 ? arr.slice(-1000) : arr;
      try { localStorage.setItem("seen-lead-ids", JSON.stringify(capped)); } catch {}
      return new Set(capped);
    });
  };

  const counts = useMemo(() => ({
    tous:     leads.length,
    nouveau:  leads.filter((l) => l.status === "nouveau").length,
    en_cours: leads.filter((l) => l.status === "appele" || l.status === "traite").length,
    converti: leads.filter((l) => l.status === "converti").length,
    archive:  leads.filter((l) => l.status === "archive").length,
  }), [leads]);

  const allSources = useMemo(() => {
    const s = new Set(leads.map((l) => getSource(l)));
    return [...s];
  }, [leads]);

  const filtered = useMemo(() => {
    const rangeCutoff: Record<string, number> = {
      aujourd: 86_400_000, "7j": 7 * 86_400_000, "30j": 30 * 86_400_000,
    };
    const now = Date.now();
    return leads
      .filter((l) => {
        if (tab === "nouveau") return l.status === "nouveau";
        if (tab === "en_cours") return l.status === "appele" || l.status === "traite";
        if (tab === "converti") return l.status === "converti";
        if (tab === "archive") return l.status === "archive";
        return true;
      })
      .filter((l) => dateRange === "tous" || now - new Date(l.created_at).getTime() <= rangeCutoff[dateRange])
      .filter((l) => sourceFilter === "tous" || getSource(l) === sourceFilter)
      .filter((l) => conseillerFilter === "tous" || l.conseiller === conseillerFilter)
      .filter((l) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return [l.nom, l.email, l.sujet, l.message, l.telephone, l.notes].some((v) => v?.toLowerCase().includes(q));
      })
      .sort((a, b) => {
        if (sort === "date_asc") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        if (sort === "urgent") return (a.timing === "asap" ? 0 : 1) - (b.timing === "asap" ? 0 : 1);
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [leads, tab, dateRange, sourceFilter, conseillerFilter, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const selectedLead = selectedId ? leads.find((l) => l.id === selectedId) ?? null : null;
  const allPageSelected = paginated.length > 0 && paginated.every((l) => selectedRows.has(l.id));

  useEffect(() => {
    setPage(1);
    setSelectedRows(new Set());
  }, [tab, search, sort, dateRange, sourceFilter, conseillerFilter]);

  const handleBulkArchive = async () => {
    const ids = [...selectedRows];
    try {
      await Promise.all(ids.map((id) => updateLeadStatus(id, "archive")));
      await qc.invalidateQueries({ queryKey: ["leads"] });
      setSelectedRows(new Set());
      toast.success(`${ids.length} prospect${ids.length > 1 ? "s" : ""} archivé${ids.length > 1 ? "s" : ""}`);
    } catch { toast.error("Erreur lors de l'archivage"); }
  };

  const handleBulkDelete = async () => {
    const ids = [...selectedRows];
    if (!confirm(`Supprimer définitivement ${ids.length} prospect${ids.length > 1 ? "s" : ""} ?`)) return;
    try {
      await Promise.all(ids.map((id) => deleteLead(id)));
      await qc.invalidateQueries({ queryKey: ["leads"] });
      setSelectedRows(new Set());
      toast.success(`${ids.length} prospect${ids.length > 1 ? "s" : ""} supprimé${ids.length > 1 ? "s" : ""}`);
    } catch { toast.error("Erreur lors de la suppression"); }
  };

  const toTreat = useMemo(() =>
    leads.filter((l) => l.timing === "asap" && l.status !== "converti" && l.status !== "archive"),
  [leads]);

  const sourceStats = useMemo(() => {
    const map = new Map<string, number>();
    leads.filter((l) => l.status !== "archive").forEach((l) => {
      const s = getSource(l);
      map.set(s, (map.get(s) ?? 0) + 1);
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [leads]);
  const sourceTotal = sourceStats.reduce((s, [, c]) => s + c, 0);

  const TABS: { key: TabKey; label: string; count: number }[] = [
    { key: "tous",     label: "Tous",      count: counts.tous },
    { key: "nouveau",  label: "Nouveaux",  count: counts.nouveau },
    { key: "en_cours", label: "En cours",  count: counts.en_cours },
    { key: "converti", label: "Convertis", count: counts.converti },
    { key: "archive",  label: "Archivés",  count: counts.archive },
  ];

  const KPI = [
    { label: "Prospects",   value: counts.tous,     icon: Users,         color: C_BLUE },
    { label: "Nouveaux",    value: counts.nouveau,  icon: TrendingUp,    color: C_BLUE },
    { label: "En cours",    value: counts.en_cours, icon: Clock,         color: C_TEAL },
    { label: "Convertis",   value: counts.converti, icon: CheckCircle2,  color: C_SAGE },
  ];

  const SOURCE_COLORS = [C_BLUE, C_TEAL, C_SAGE, C_MAUVE, C_GOLD];

  const selectStyle = {
    ...INPUT_STYLE,
    padding: "0.4rem 0.75rem",
    fontSize: "0.78rem",
    width: "auto",
    cursor: "pointer",
  };

  return (
    <div className="h-full flex flex-col">

      {/* ── Fixed top area ─────────────────────────────────────────────── */}
      <div className="flex-shrink-0 px-6 pt-5 pb-0">

        {/* Page header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-[22px] font-heading font-semibold tracking-tight" style={{ color: T_PRIMARY }}>
              Prospects
            </h1>
            <p className="text-[13px] font-light mt-0.5" style={{ color: T_SECONDARY }}>
              Suivez les demandes et les prochaines actions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCharts(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12.5px] font-medium transition-all"
              style={{ background: INNER_BG, border: `1px solid ${INNER_BORDER}`, color: T_SECONDARY }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--at-inner-bg-hover, hsl(220 18% 93%))"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = INNER_BG; }}
            >
              <BarChart3 className="w-3.5 h-3.5" /> Analyse
            </button>
            <button
              onClick={() => exportLeadsCSV(leads)}
              disabled={leads.length === 0}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12.5px] font-medium transition-all disabled:opacity-40"
              style={{ background: INNER_BG, border: `1px solid ${INNER_BORDER}`, color: T_SECONDARY }}
            >
              <Download className="w-3.5 h-3.5" /> Exporter
            </button>
            <button
              onClick={() => setShowNewLead(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium"
              style={{ background: C_BLUE, color: "hsl(0 0% 100%)" }}
            >
              <Plus className="w-4 h-4" /> Nouveau prospect
            </button>
          </div>
        </div>

        {/* KPI tiles */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {KPI.map((tile) => (
            <div key={tile.label}
              className="rounded-xl p-4 flex items-center gap-3"
              style={{
                background: "hsl(0 0% 100%)",
                border: `1px solid ${INNER_BORDER}`,
                boxShadow: "0 1px 3px hsl(220 60% 8% / 0.04)",
              }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: cA(C_BLUE, 0.08) }}>
                <tile.icon className="w-4 h-4" style={{ color: tile.color }} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[24px] font-heading font-light tabular-nums leading-none" style={{ color: T_PRIMARY }}>
                  {tile.value}
                </p>
                <p className="text-[11px] font-light mt-0.5" style={{ color: T_MUTED }}>{tile.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: T_MUTED }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un prospect…"
              className="pl-9 pr-4 outline-none"
              style={{ ...INPUT_STYLE, padding: "0.4rem 0.875rem 0.4rem 2rem", fontSize: "0.78rem" }}
            />
          </div>
          <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} style={selectStyle} className="outline-none">
            <option value="tous">Source · Toutes</option>
            {allSources.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={conseillerFilter} onChange={(e) => setConseillerFilter(e.target.value)} style={selectStyle} className="outline-none">
            <option value="tous">Responsable · Tous</option>
            {Object.entries(ADVISOR_LABELS).filter(([k]) => k !== "any").map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value as typeof dateRange)} style={selectStyle} className="outline-none">
            <option value="tous">Période · Toute</option>
            <option value="aujourd">Aujourd'hui</option>
            <option value="7j">7 derniers jours</option>
            <option value="30j">30 derniers jours</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} style={selectStyle} className="outline-none">
            <option value="date_desc">Trier · Récents</option>
            <option value="date_asc">Trier · Anciens</option>
            <option value="urgent">Trier · Urgents</option>
          </select>
        </div>

        {/* Tabs + bulk bar */}
        <div className="flex items-center justify-between pb-0">
          <div className="flex items-center gap-0.5">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className="px-3.5 py-2 rounded-lg text-[12.5px] font-medium transition-all"
                style={{
                  background: tab === t.key ? C_BLUE : "transparent",
                  color: tab === t.key ? "hsl(0 0% 100%)" : T_SECONDARY,
                }}
              >
                {t.label}
                <span
                  className="ml-1.5 text-[10.5px] tabular-nums"
                  style={{ opacity: tab === t.key ? 0.75 : 0.55 }}
                >
                  {t.count}
                </span>
              </button>
            ))}
          </div>
          {selectedRows.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[12px]" style={{ color: T_MUTED }}>
                {selectedRows.size} sélectionné{selectedRows.size > 1 ? "s" : ""}
              </span>
              <button
                onClick={handleBulkArchive}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium"
                style={{ color: C_GOLD, background: cA(C_GOLD, 0.10), border: `1px solid ${cA(C_GOLD, 0.22)}` }}
              >
                <Archive className="w-3.5 h-3.5" /> Archiver
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium"
                style={{ color: C_CORAL, background: cA(C_CORAL, 0.08), border: `1px solid ${cA(C_CORAL, 0.22)}` }}
              >
                <Trash2 className="w-3.5 h-3.5" /> Supprimer
              </button>
              <button onClick={() => setSelectedRows(new Set())} className="p-1.5 rounded-lg" style={{ color: T_MUTED }}>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Content area ───────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 flex" style={{ borderTop: `1px solid ${INNER_BORDER}` }}>

        {/* Table + bottom widgets */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-6 h-6 rounded-full border-2 animate-spin"
                style={{ borderColor: "hsl(220 20% 88%)", borderTopColor: C_BLUE }} />
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ background: INNER_BG, borderBottom: `1px solid ${INNER_BORDER}` }}>
                  <th className="px-4 py-3 w-8">
                    <div
                      className="w-4 h-4 rounded-[4px] flex items-center justify-center border cursor-pointer transition-all"
                      style={{
                        borderColor: allPageSelected ? C_BLUE : INNER_BORDER,
                        background: allPageSelected ? C_BLUE : "transparent",
                      }}
                      onClick={() => setSelectedRows(
                        allPageSelected ? new Set() : new Set(paginated.map((l) => l.id))
                      )}
                    >
                      {allPageSelected && <span style={{ color: "white", fontSize: 7, fontWeight: 900, lineHeight: 1 }}>✓</span>}
                    </div>
                  </th>
                  {["Prospect", "Demande", "Source", "Statut", "Responsable", "Reçu le", "Disponibilité", ""].map((h) => (
                    <th key={h} className="px-3 py-3 text-left text-[10.5px] font-semibold uppercase tracking-wide"
                      style={{ color: T_LABEL, whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-16 text-center">
                      <p className="text-[14px] font-light" style={{ color: T_MUTED }}>Aucun prospect trouvé</p>
                    </td>
                  </tr>
                ) : (
                  paginated.map((lead, i) => (
                    <LeadRow
                      key={lead.id}
                      lead={lead}
                      isSelected={selectedRows.has(lead.id)}
                      isActive={selectedId === lead.id}
                      isUnseen={lead.status === "nouveau" && !seenIds.has(lead.id)}
                      onSelect={(v) => setSelectedRows((prev) => {
                        const next = new Set(prev);
                        if (v) next.add(lead.id); else next.delete(lead.id);
                        return next;
                      })}
                      onClick={() => {
                        if (selectedId === lead.id) { setSelectedId(null); return; }
                        setSelectedId(lead.id);
                        markAsSeen(lead.id);
                      }}
                      isLast={i === paginated.length - 1}
                    />
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: `1px solid ${INNER_BORDER}` }}>
              <p className="text-[12px]" style={{ color: T_MUTED }}>
                {filtered.length} prospect{filtered.length !== 1 ? "s" : ""} · Page {page}/{totalPages}
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg text-[12px] disabled:opacity-40"
                  style={{ background: INNER_BG, border: `1px solid ${INNER_BORDER}`, color: T_SECONDARY }}
                >
                  Précédent
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-lg text-[12px] disabled:opacity-40"
                  style={{ background: INNER_BG, border: `1px solid ${INNER_BORDER}`, color: T_SECONDARY }}
                >
                  Suivant
                </button>
              </div>
            </div>
          )}

          {/* Bottom widgets */}
          <div className="grid grid-cols-2 gap-5 px-5 py-5" style={{ borderTop: `1px solid ${INNER_BORDER}` }}>

            {/* À traiter aujourd'hui */}
            <div className="rounded-xl overflow-hidden" style={{ background: "hsl(0 0% 100%)", border: `1px solid ${INNER_BORDER}` }}>
              <div className="px-4 py-3 flex items-center gap-2"
                style={{ borderBottom: `1px solid ${INNER_BORDER}`, background: INNER_BG }}>
                <Clock className="w-3.5 h-3.5" style={{ color: C_CORAL }} />
                <p className="text-[12px] font-medium" style={{ color: T_HEADING }}>
                  À traiter aujourd'hui
                </p>
                <span className="ml-auto text-[11px] tabular-nums px-2 py-0.5 rounded-full"
                  style={{ background: cA(C_CORAL, 0.10), color: C_CORAL }}>
                  {toTreat.length}
                </span>
              </div>
              {toTreat.length === 0 ? (
                <div className="px-4 py-6 text-center">
                  <CheckCircle2 className="w-7 h-7 mx-auto mb-2" style={{ color: C_SAGE }} />
                  <p className="text-[12px]" style={{ color: T_MUTED }}>Aucun prospect urgent</p>
                </div>
              ) : (
                <div>
                  {toTreat.slice(0, 5).map((l, i) => (
                    <div
                      key={l.id}
                      className="px-4 py-3 flex items-center justify-between gap-3 cursor-pointer"
                      style={{ borderTop: i === 0 ? "none" : `1px solid ${INNER_BORDER}` }}
                      onClick={() => { setSelectedId(l.id); markAsSeen(l.id); }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = INNER_BG; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium truncate" style={{ color: T_PRIMARY }}>{l.nom}</p>
                        <p className="text-[11px] font-light truncate" style={{ color: T_MUTED }}>{l.sujet ?? getSource(l)}</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {l.telephone && (
                          <a href={`tel:${l.telephone}`} onClick={(e) => e.stopPropagation()}
                            className="p-1 rounded-md transition-colors"
                            style={{ color: C_BLUE }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = cA(C_BLUE, 0.10); }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <a href={`mailto:${l.email}`} onClick={(e) => e.stopPropagation()}
                          className="p-1 rounded-md transition-colors"
                          style={{ color: C_BLUE }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = cA(C_BLUE, 0.10); }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                  {toTreat.length > 5 && (
                    <p className="px-4 py-2 text-[11px]" style={{ color: T_MUTED, borderTop: `1px solid ${INNER_BORDER}` }}>
                      +{toTreat.length - 5} autres urgents
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Sources des demandes */}
            <div className="rounded-xl overflow-hidden" style={{ background: "hsl(0 0% 100%)", border: `1px solid ${INNER_BORDER}` }}>
              <div className="px-4 py-3 flex items-center justify-between"
                style={{ borderBottom: `1px solid ${INNER_BORDER}`, background: INNER_BG }}>
                <p className="text-[12px] font-medium" style={{ color: T_HEADING }}>Sources des demandes</p>
                <span className="text-[11px]" style={{ color: T_MUTED }}>actifs</span>
              </div>
              <div className="px-4 py-4 space-y-3">
                {sourceStats.length === 0 ? (
                  <p className="text-[12px] text-center py-4" style={{ color: T_MUTED }}>Aucune donnée</p>
                ) : (
                  sourceStats.map(([label, count], i) => {
                    const pct = sourceTotal === 0 ? 0 : Math.round((count / sourceTotal) * 100);
                    return (
                      <div key={label}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ background: SOURCE_COLORS[i % SOURCE_COLORS.length] }} />
                            <span className="text-[12px]" style={{ color: T_SECONDARY }}>{label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[12px] font-medium tabular-nums" style={{ color: T_PRIMARY }}>{count}</span>
                            <span className="text-[11px] w-9 text-right" style={{ color: T_MUTED }}>{pct}%</span>
                          </div>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: INNER_BG }}>
                          <div className="h-full rounded-full transition-all"
                            style={{ width: `${pct}%`, background: SOURCE_COLORS[i % SOURCE_COLORS.length] }} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Side panel */}
        {selectedLead && (
          <LeadSidePanel
            lead={selectedLead}
            onClose={() => setSelectedId(null)}
          />
        )}
      </div>

      {showCharts && <ChartsModal leads={leads} onClose={() => setShowCharts(false)} />}
      {showNewLead && <NewLeadModal onClose={() => setShowNewLead(false)} />}
    </div>
  );
}
