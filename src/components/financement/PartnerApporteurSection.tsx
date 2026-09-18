import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Building2, Briefcase, User, Mail, Phone, MessageSquare, CheckCircle2 } from "lucide-react";
import { createLead } from "@/lib/leadsService";
import { toast } from "sonner";

const STEPS = [
  { label: "Vous nous présentez un client", detail: "Un acquéreur, un investisseur ou un porteur de projet que vous accompagnez." },
  { label: "Nous prenons contact sous 24h", detail: "Un conseiller KANTI analyse la situation et prend en charge la relation." },
  { label: "Nous gérons intégralement le dossier", detail: "Montage, négociation, mise en place — vous restez informé à chaque étape." },
  { label: "La transaction aboutit", detail: "Votre client bénéficie d'un accompagnement patrimonial complet." },
  { label: "La collaboration est formalisée", detail: "Les modalités de partenariat sont définies dans un cadre écrit et confidentiel." },
];

const BENEFITS = [
  "Un interlocuteur dédié et joignable directement",
  "Aucun conflit d'intérêt avec vos propres prestations",
  "Reporting régulier sur l'avancement des dossiers",
  "Accès à l'ensemble de nos expertises : gestion, fiscalité, financement, transmission",
  "Collaboration encadrée par une convention formalisée",
  "Confidentialité totale des informations client",
];

export default function PartnerApporteurSection() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <>
      <section className="section-padding section-ivory">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              viewport={{ once: true, margin: "-60px" }}
            >
              <p className="text-[10px] tracking-[0.32em] uppercase font-medium mb-5" style={{ color: "hsl(224 25% 50%)" }}>
                Apporteurs d'affaires
              </p>
              <h2 className="font-heading text-3xl md:text-4xl lg:text-[42px] font-light leading-[1.1] tracking-tight mb-6" style={{ color: "hsl(224 60% 10%)" }}>
                Vous accompagnez des acquéreurs ?<br />
                <span className="italic" style={{ color: "hsl(224 45% 35%)" }}>Travaillons ensemble.</span>
              </h2>
              <p className="text-base font-light leading-relaxed mb-6" style={{ color: "hsl(224 15% 40%)" }}>
                Agents immobiliers, notaires, experts-comptables, avocats, courtiers en assurance : si vous côtoyez des clients avec des besoins patrimoniaux ou des projets de financement, nous pouvons construire une collaboration structurée.
              </p>
              <p className="text-[13px] italic font-light leading-relaxed mb-8" style={{ color: "hsl(224 15% 52%)" }}>
                Les modalités de collaboration sont définies au cas par cas dans un cadre formalisé.
              </p>

              <div className="space-y-4 mb-10">
                {STEPS.map((s, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 text-[10px] font-semibold" style={{ background: "hsl(224 30% 12% / 0.06)", color: "hsl(224 45% 35%)" }}>
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-0.5" style={{ color: "hsl(224 55% 12%)" }}>{s.label}</p>
                      <p className="text-[13px] font-light" style={{ color: "hsl(224 15% 48%)" }}>{s.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                style={{ background: "hsl(224 60% 12%)", color: "white" }}
              >
                Devenir partenaire
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </motion.div>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.12 }}
              viewport={{ once: true, margin: "-60px" }}
              className="lg:pt-16"
            >
              <div className="rounded-2xl p-6 md:p-8 bg-white" style={{ border: "1px solid hsl(224 20% 12% / 0.08)", boxShadow: "0 4px 24px -12px hsl(224 60% 12% / 0.08)" }}>
                <p className="text-[11px] tracking-[0.28em] uppercase font-medium mb-5" style={{ color: "hsl(224 25% 55%)" }}>
                  Ce que vous y gagnez
                </p>
                <ul className="space-y-3">
                  {BENEFITS.map((b, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm font-light leading-relaxed" style={{ color: "hsl(224 15% 38%)" }}>
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" strokeWidth={1.5} style={{ color: "hsl(224 40% 42%)" }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <AnimatePresence>
        {open && <PartnerModal onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

export function PartnerModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ nom: "", societe: "", metier: "", telephone: "", email: "", message: "", consent: false });
  const [loading, setLoading] = useState(false);
  const reduce = useReducedMotion();

  const set = (k: keyof typeof form, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent) { toast.error("Merci d'accepter la politique de confidentialité."); return; }
    setLoading(true);
    try {
      await createLead({
        nom: form.nom,
        email: form.email,
        telephone: form.telephone || null,
        sujet: "Partenaire apporteur",
        message: `Société : ${form.societe} — Métier : ${form.metier}${form.message ? "\n\n" + form.message : ""}`,
        conseiller: null,
        format: null,
        timing: null,
      });
      toast.success("Demande envoyée. Un conseiller vous contacte sous 24h.");
      onClose();
    } catch {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl"
        initial={reduce ? false : { y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: "hsl(224 20% 12% / 0.08)" }}>
          <h3 className="font-heading text-xl font-light tracking-tight" style={{ color: "hsl(224 55% 12%)" }}>
            Devenir partenaire
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-full transition-colors" style={{ color: "hsl(224 15% 52%)" }}>
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-2 gap-3">
            <Field icon={<User className="w-4 h-4" />} label="Prénom et nom" required value={form.nom} onChange={v => set("nom", v)} placeholder="Jean Dupont" />
            <Field icon={<Building2 className="w-4 h-4" />} label="Société" required value={form.societe} onChange={v => set("societe", v)} placeholder="Dupont Immobilier" />
          </div>
          <Field icon={<Briefcase className="w-4 h-4" />} label="Métier / activité" required value={form.metier} onChange={v => set("metier", v)} placeholder="Agent immobilier" />
          <div className="grid grid-cols-2 gap-3">
            <Field icon={<Phone className="w-4 h-4" />} label="Téléphone" value={form.telephone} onChange={v => set("telephone", v)} placeholder="06 00 00 00 00" />
            <Field icon={<Mail className="w-4 h-4" />} label="Email" required type="email" value={form.email} onChange={v => set("email", v)} placeholder="jean@exemple.fr" />
          </div>
          <div>
            <label className="block text-[11px] font-medium tracking-wide mb-1.5" style={{ color: "hsl(224 25% 50%)" }}>
              <MessageSquare className="w-4 h-4 inline mr-1.5 -mt-0.5" />
              Message (facultatif)
            </label>
            <textarea
              value={form.message}
              onChange={e => set("message", e.target.value)}
              rows={3}
              className="w-full rounded-xl px-3.5 py-2.5 text-sm font-light outline-none resize-none focus:ring-1"
              style={{ border: "1px solid hsl(224 20% 12% / 0.12)", color: "hsl(224 30% 18%)", background: "hsl(224 15% 98%)", focusRingColor: "hsl(224 40% 42%)" }}
              placeholder="Précisez si vous souhaitez..."
            />
          </div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={form.consent} onChange={e => set("consent", e.target.checked)} className="mt-0.5 flex-shrink-0" />
            <span className="text-[12px] font-light leading-relaxed" style={{ color: "hsl(224 15% 48%)" }}>
              J'accepte que mes données soient utilisées pour traiter ma demande de partenariat, conformément à la politique de confidentialité de KANTI.
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-medium tracking-wide transition-all duration-300 disabled:opacity-60"
            style={{ background: "hsl(224 60% 12%)", color: "white" }}
          >
            {loading ? "Envoi en cours…" : "Envoyer ma demande"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

function Field({
  icon, label, required, value, onChange, placeholder, type = "text",
}: {
  icon: React.ReactNode;
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] font-medium tracking-wide mb-1.5" style={{ color: "hsl(224 25% 50%)" }}>
        <span className="inline-flex items-center gap-1">
          {icon}
          {label}
          {required && <span className="text-[hsl(0_60%_55%)]">*</span>}
        </span>
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl px-3.5 py-2.5 text-sm font-light outline-none focus:ring-1"
        style={{ border: "1px solid hsl(224 20% 12% / 0.12)", color: "hsl(224 30% 18%)", background: "hsl(224 15% 98%)" }}
      />
    </div>
  );
}
