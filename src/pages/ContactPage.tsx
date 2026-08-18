import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createLead } from "@/lib/leadsService";
import { posthog } from "@/lib/posthog";
import { z } from "zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Building2, Video, Phone as PhoneIcon, MapPin, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo, { breadcrumbJsonLd, localBusinessJsonLd } from "@/components/Seo";
// Photo de fond · public/contact-bg.png
const contactBg = "/contact-bg.png";

/* ─── Validation ─── */
const contactSchema = z.object({
  conseiller: z.string().optional(),
  format: z.string().optional(),
  timing: z.string().optional(),
  sujet: z.string().optional(),
  nom: z.string().trim().min(2, "Indiquez votre nom complet").max(100),
  email: z.string().trim().email("Email invalide").max(255),
  telephone: z.string().trim().max(30).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  website: z.string().max(0, "").optional().or(z.literal("")),
});

/* ─── Données ─── */
const ADVISORS = [
  { id: "quentin", name: "Quentin Perromat", role: "Associé Fondateur", tags: ["Stratégie", "Fiscalité", "Transmission"], img: "/quentin-perromat.png" },
  { id: "thomas",  name: "Thomas Robert",    role: "Courtier & Assistant", tags: ["Financement", "Suivi client"],         img: "/thomas-robert.png" },
  { id: "any",     name: "Peu importe",        role: "Le plus disponible",  tags: ["Disponibilité"],                       img: null },
];

const FORMATS = [
  { id: "cabinet",   icon: Building2,  label: "En cabinet",       sub: "12 rue Ferrere · Bordeaux" },
  { id: "visio",     icon: Video,       label: "Visioconférence",  sub: "Lien envoyé par email" },
  { id: "telephone", icon: PhoneIcon,   label: "Par téléphone",    sub: "Nous vous rappelons" },
];

const TIMING = [
  { id: "asap",      label: "Dès que possible" },
  { id: "week",      label: "Cette semaine" },
  { id: "two_weeks", label: "Dans 2 semaines" },
  { id: "month",     label: "Dans le mois" },
];

const SUBJECTS = [
  "Bilan patrimonial", "Optimisation fiscale", "Placements & épargne",
  "Immobilier", "Transmission", "Financement", "Patrimoine pro", "Autre sujet",
];

/* ─── Petits composants ─── */

function StepDone({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center justify-between px-3.5 py-2.5 rounded-xl"
      style={{
        background: "hsl(224 50% 16% / 0.05)",
        border: "1px solid hsl(224 30% 12% / 0.09)",
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "hsl(224 55% 30%)" }}
        >
          <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
            <path d="M1.5 5L4 7.5 8.5 2.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="text-[11px]" style={{ color: "hsl(224 20% 55%)" }}>{label}</span>
        <span className="text-[11px] font-medium" style={{ color: "hsl(224 55% 18%)" }}>· {value}</span>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="text-[10px] tracking-[0.15em] uppercase hover:underline"
        style={{ color: "hsl(224 40% 58%)" }}
      >
        Modifier
      </button>
    </motion.div>
  );
}

function StepHeader({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span
        className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
        style={{ background: "hsl(224 55% 22%)", color: "white" }}
      >
        {n}
      </span>
      <p className="text-[12px] font-medium" style={{ color: "hsl(224 40% 22%)" }}>{children}</p>
    </div>
  );
}

function FieldInput({ label, id, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[10px] font-medium tracking-[0.18em] uppercase mb-1.5" style={{ color: "hsl(224 25% 48%)" }}>
        {label}
      </label>
      <input
        id={id}
        className="w-full px-3.5 py-2.5 rounded-xl text-[13px] transition-all duration-200"
        style={{
          background: "hsl(0 0% 100% / 0.65)",
          border: "1px solid hsl(224 20% 12% / 0.12)",
          color: "hsl(224 50% 12%)",
          outline: "none",
        }}
        onFocus={(e) => { e.target.style.borderColor = "hsl(224 55% 40% / 0.55)"; e.target.style.boxShadow = "0 0 0 3px hsl(224 55% 40% / 0.10)"; }}
        onBlur={(e)  => { e.target.style.borderColor = "hsl(224 20% 12% / 0.12)"; e.target.style.boxShadow = "none"; }}
        {...rest}
      />
    </div>
  );
}

/* ─── Page principale ─── */
export default function ContactPage() {
  const navigate = useNavigate();

  const [step, setStep]   = useState(0);
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [form, setForm]   = useState({
    conseiller: "", format: "", timing: "", sujet: "",
    nom: "", email: "", telephone: "", message: "", website: "",
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  /* Sélectionner une valeur et avancer à l'étape suivante */
  const pick = (key: string, val: string, next: number) => {
    setForm(p => ({ ...p, [key]: val }));
    setTimeout(() => setStep(next), 140);
  };

  const advanceCoords = async () => {
    if (!form.nom.trim() || form.nom.trim().length < 2) { toast.error("Indiquez votre nom complet"); return; }
    // Niveau 1 — format email strict
    if (!form.email.trim() || !/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(form.email)) {
      toast.error("Email invalide"); return;
    }
    // Niveau 2 — MX check
    try {
      const check = await fetch("/api/verify-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email.trim() }),
      }).then((r) => r.json()).catch(() => ({ email: { valid: true } }));
      if (check?.email?.valid === false) {
        toast.error(check.email.reason === "no_mx"
          ? "Ce domaine email n'existe pas."
          : "Email invalide.");
        return;
      }
    } catch { /* fail open */ }
    setStep(4);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }

    // Niveau 1 — téléphone français (si renseigné)
    if (parsed.data.telephone) {
      const FR_PHONE = /^(?:(?:\+|00)33[\s.\-]?|0)[1-9](?:[\s.\-]?\d{2}){4}$/;
      if (!FR_PHONE.test(parsed.data.telephone.trim())) {
        toast.error("Numéro de téléphone invalide (format français attendu).");
        return;
      }
    }

    // Honeypot · redirection silencieuse sans appel API
    if (parsed.data.website) {
      navigate("/merci", { state: { name: parsed.data.nom.split(" ")[0], subject: "contact" } });
      return;
    }

    setStatus("loading");
    // Save lead to Supabase (fire-and-forget, non-blocking)
    createLead({
      nom: parsed.data.nom,
      email: parsed.data.email,
      telephone: parsed.data.telephone || undefined,
      conseiller: parsed.data.conseiller || undefined,
      format: parsed.data.format || undefined,
      timing: parsed.data.timing || undefined,
      sujet: parsed.data.sujet || undefined,
      message: parsed.data.message || undefined,
    }).catch(() => null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error("server_error");
      posthog.capture("contact_form_submitted", {
        conseiller: parsed.data.conseiller || undefined,
        format: parsed.data.format || undefined,
        timing: parsed.data.timing || undefined,
        sujet: parsed.data.sujet || undefined,
      });
      navigate("/merci", { state: { name: parsed.data.nom.split(" ")[0], subject: "contact" } });
    } catch {
      toast.error("Une erreur est survenue. Veuillez réessayer ou nous appeler directement.");
      setStatus("idle");
    }
  };

  /* Labels pour les résumés */
  const advisorLabel = ADVISORS.find(a => a.id === form.conseiller)?.name ?? "";
  const formatLabel  = FORMATS.find(f => f.id === form.format)?.label ?? "";
  const timingLabel  = TIMING.find(t => t.id === form.timing)?.label ?? "";

  /* Style partagé des cards de sélection */
  const cardStyle = (selected: boolean): React.CSSProperties => ({
    background: selected ? "hsl(224 60% 18% / 0.09)" : "hsl(0 0% 100% / 0.60)",
    border: `1px solid ${selected ? "hsl(224 55% 36%)" : "hsl(224 20% 12% / 0.12)"}`,
    boxShadow: selected
      ? "0 0 0 2.5px hsl(224 55% 36% / 0.20), inset 0 1px 0 hsl(0 0% 100% / 0.80)"
      : "inset 0 1px 0 hsl(0 0% 100% / 0.70)",
    borderRadius: 14,
    cursor: "pointer",
    transition: "all 0.18s ease",
  });

  return (
    <>
      <Seo
        title="Prendre rendez-vous · Cabinet KANTI, Bordeaux"
        description="Premier échange de 30 minutes gratuit et sans engagement avec un conseiller KANTI. Réponse sous 24h ouvrées."
        jsonLd={[
          localBusinessJsonLd,
          breadcrumbJsonLd([{ name: "Accueil", url: "/" }, { name: "Contact", url: "/contact" }]),
        ]}
      />
      <Header />

      <main id="main">
        <section className="relative overflow-hidden" style={{ minHeight: "100vh" }}>

          {/* Fond photo */}
          <div className="absolute inset-0">
            <img src={contactBg} alt="" aria-hidden className="w-full h-full object-cover object-center" fetchPriority="high" />
          </div>

          {/* Dégradé blanc gauche */}
          <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
            background: "linear-gradient(105deg, hsl(0 0% 100% / 0.98) 0%, hsl(0 0% 100% / 0.93) 30%, hsl(0 0% 100% / 0.60) 52%, hsl(0 0% 100% / 0.08) 70%, transparent 82%)",
          }} />
          <div aria-hidden className="absolute inset-x-0 top-0 h-24 pointer-events-none" style={{ background: "linear-gradient(to bottom, hsl(220 30% 97% / 0.85), transparent)" }} />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-24 pointer-events-none" style={{ background: "linear-gradient(to top, hsl(220 30% 97% / 0.85), transparent)" }} />

          {/* Grille contenu */}
          <div className="relative z-10 max-w-6xl mx-auto px-8 md:px-14 py-28 lg:py-32 grid lg:grid-cols-[1fr_460px] gap-12 xl:gap-20 items-center min-h-screen">

            {/* Colonne gauche */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="lg:self-center"
            >
              <h1
                className="font-heading font-light leading-[1.04] tracking-tight mb-8"
                style={{ fontSize: "clamp(2.4rem, 5vw, 3.6rem)", color: "hsl(224 60% 12%)" }}
              >
                Prenons<br />rendez-vous.
              </h1>
              <div className="space-y-3 mb-10">
                {[
                  "30 minutes, gratuit et sans engagement",
                  "Réponse sous 24 heures ouvrées",
                  "Échange confidentiel, aucun engagement commercial",
                ].map(l => (
                  <div key={l} className="flex items-start gap-2.5">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7" stroke="hsl(224 55% 38%)" strokeWidth="1.2" />
                      <path d="M5 8l2 2 4-4" stroke="hsl(224 55% 38%)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-[14px] font-light" style={{ color: "hsl(224 30% 28%)" }}>{l}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2 pt-7 border-t" style={{ borderColor: "hsl(224 20% 12% / 0.12)" }}>
                <a href="mailto:kanti@adnfamily.com" className="flex items-center gap-2.5 text-[13px] font-light" style={{ color: "hsl(224 30% 40%)" }}>
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.5} style={{ color: "hsl(224 40% 52%)" }} />
                  kanti@adnfamily.com
                </a>
                <div className="flex items-start gap-2.5 text-[13px] font-light" style={{ color: "hsl(224 20% 55%)" }}>
                  <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                  12 Rue Ferrere · 33000 Bordeaux
                </div>
              </div>
            </motion.div>

            {/* Carte formulaire liquid glass */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="w-full p-6 md:p-7"
                style={{
                  background: "hsl(0 0% 100% / 0.80)",
                  backdropFilter: "blur(36px) saturate(160%)",
                  WebkitBackdropFilter: "blur(36px) saturate(160%)",
                  border: "1px solid hsl(0 0% 100% / 0.70)",
                  borderTopColor: "hsl(0 0% 100% / 0.96)",
                  boxShadow: "inset 0 1.5px 0 0 hsl(0 0% 100% / 0.92), 0 40px 80px -20px hsl(224 60% 12% / 0.14), 0 8px 24px -8px hsl(224 60% 12% / 0.07)",
                  borderRadius: 22,
                }}
              >
                <form onSubmit={handleSubmit} noValidate>

                  {/* Honeypot */}
                  <div aria-hidden className="absolute -left-[9999px] w-px h-px overflow-hidden">
                    <input name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={handleInput} />
                  </div>

                  {/* ── Résumés des étapes complétées ── */}
                  <div className="space-y-2 mb-5">
                    {step > 0 && advisorLabel && (
                      <StepDone label="Conseiller" value={advisorLabel} onEdit={() => setStep(0)} />
                    )}
                    {step > 1 && formatLabel && (
                      <StepDone label="Format" value={formatLabel} onEdit={() => setStep(1)} />
                    )}
                    {step > 2 && timingLabel && (
                      <StepDone label="Disponibilité" value={timingLabel} onEdit={() => setStep(2)} />
                    )}
                    {step > 3 && form.nom && (
                      <StepDone label="Vos infos" value={form.nom} onEdit={() => setStep(3)} />
                    )}
                  </div>

                  {/* ── Étape active ── */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    >

                      {/* ── STEP 0 : Conseiller ── */}
                      {step === 0 && (
                        <div>
                          <StepHeader n="1">Avec qui souhaitez-vous échanger ?</StepHeader>
                          <div className="grid grid-cols-3 gap-2.5">
                            {ADVISORS.map(a => {
                              const sel = form.conseiller === a.id;
                              return (
                                <button
                                  key={a.id}
                                  type="button"
                                  onClick={() => pick("conseiller", a.id, 1)}
                                  className="flex flex-col items-center gap-2 p-3 text-center relative"
                                  style={cardStyle(sel)}
                                >
                                  {a.img ? (
                                    <div className="w-11 h-11 rounded-full overflow-hidden" style={{ border: `2px solid ${sel ? "hsl(224 55% 36%)" : "hsl(0 0% 0% / 0.08)"}` }}>
                                      <img src={a.img} alt={a.name} className="w-full h-full object-cover grayscale-[0.25]" />
                                    </div>
                                  ) : (
                                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-base" style={{ background: "hsl(224 20% 90%)", border: `2px solid ${sel ? "hsl(224 55% 36%)" : "hsl(0 0% 0% / 0.08)"}` }}>
                                      ✦
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-[11px] font-semibold leading-tight" style={{ color: "hsl(224 60% 14%)" }}>
                                      {a.id === "any" ? a.name : a.name.split(" ")[0]}
                                    </p>
                                    <p className="text-[10px] font-light leading-snug" style={{ color: "hsl(224 25% 48%)" }}>
                                      {a.role}
                                    </p>
                                  </div>
                                  {sel && (
                                    <span className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "hsl(224 55% 28%)" }}>
                                      <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                                        <path d="M1.5 5L4 7.5 8.5 2.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* ── STEP 1 : Format ── */}
                      {step === 1 && (
                        <div>
                          <StepHeader n="2">Comment souhaitez-vous nous rencontrer ?</StepHeader>
                          <div className="grid grid-cols-3 gap-2.5">
                            {FORMATS.map(({ id, icon: Icon, label, sub }) => {
                              const sel = form.format === id;
                              return (
                                <button
                                  key={id}
                                  type="button"
                                  onClick={() => pick("format", id, 2)}
                                  className="flex flex-col items-center gap-1.5 py-4 px-2 text-center"
                                  style={cardStyle(sel)}
                                >
                                  <Icon className="w-5 h-5" strokeWidth={1.5} style={{ color: sel ? "hsl(224 60% 28%)" : "hsl(224 30% 55%)" }} />
                                  <p className="text-[11px] font-semibold" style={{ color: "hsl(224 50% 16%)" }}>{label}</p>
                                  <p className="text-[10px] leading-snug" style={{ color: "hsl(224 18% 55%)" }}>{sub}</p>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* ── STEP 2 : Timing ── */}
                      {step === 2 && (
                        <div>
                          <StepHeader n="3">Quand souhaitez-vous échanger ?</StepHeader>
                          <div className="grid grid-cols-2 gap-2.5">
                            {TIMING.map(({ id, label }) => {
                              const sel = form.timing === id;
                              return (
                                <button
                                  key={id}
                                  type="button"
                                  onClick={() => pick("timing", id, 3)}
                                  className="py-3 px-4 text-[12px] font-medium text-center"
                                  style={cardStyle(sel)}
                                >
                                  <span style={{ color: sel ? "hsl(224 60% 18%)" : "hsl(224 30% 35%)" }}>{label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* ── STEP 3 : Coordonnées ── */}
                      {step === 3 && (
                        <div>
                          <StepHeader n="4">Vos coordonnées</StepHeader>
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <FieldInput label="Nom complet *" id="nom" name="nom" type="text" required maxLength={100} value={form.nom} onChange={handleInput} placeholder="Votre nom" disabled={status === "loading"} />
                              <FieldInput label="Téléphone" id="telephone" name="telephone" type="tel" maxLength={30} value={form.telephone} onChange={handleInput} placeholder="06 00 00 00 00" disabled={status === "loading"} />
                            </div>
                            <FieldInput label="Email *" id="email" name="email" type="email" required maxLength={255} value={form.email} onChange={handleInput} placeholder="votre@email.fr" disabled={status === "loading"} />
                            <button
                              type="button"
                              onClick={advanceCoords}
                              className="w-full py-3 rounded-xl text-[13px] font-medium tracking-wide transition-all duration-200 hover:-translate-y-0.5 mt-1"
                              style={{
                                background: "hsl(224 60% 18%)",
                                color: "white",
                                boxShadow: "0 6px 20px -6px hsl(224 60% 18% / 0.40)",
                              }}
                            >
                              Continuer →
                            </button>
                          </div>
                        </div>
                      )}

                      {/* ── STEP 4 : Sujet + envoi ── */}
                      {step === 4 && (
                        <div className="space-y-4">
                          <div>
                            <StepHeader n="5">Sujet principal</StepHeader>
                            <div className="flex flex-wrap gap-2">
                              {SUBJECTS.map(s => {
                                const sel = form.sujet === s;
                                return (
                                  <button
                                    key={s}
                                    type="button"
                                    onClick={() => setForm(p => ({ ...p, sujet: p.sujet === s ? "" : s }))}
                                    className="px-3.5 py-1.5 rounded-full text-[11px] font-medium tracking-wide transition-all duration-180"
                                    style={{
                                      background: sel ? "hsl(224 60% 18%)" : "hsl(0 0% 100% / 0.65)",
                                      color: sel ? "white" : "hsl(224 35% 32%)",
                                      border: `1px solid ${sel ? "hsl(224 60% 18%)" : "hsl(224 20% 12% / 0.13)"}`,
                                      boxShadow: sel ? "0 4px 12px -4px hsl(224 60% 18% / 0.32)" : "none",
                                    }}
                                  >
                                    {s}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div>
                            <label htmlFor="message" className="block text-[10px] font-medium tracking-[0.18em] uppercase mb-1.5" style={{ color: "hsl(224 25% 48%)" }}>
                              Quelques mots <span className="normal-case tracking-normal opacity-60">(optionnel)</span>
                            </label>
                            <textarea
                              id="message"
                              name="message"
                              rows={3}
                              maxLength={2000}
                              value={form.message}
                              onChange={handleInput}
                              disabled={status === "loading"}
                              placeholder="Décrivez brièvement votre situation…"
                              className="w-full px-3.5 py-2.5 rounded-xl text-[13px] resize-none transition-all duration-200 disabled:opacity-50"
                              style={{
                                background: "hsl(0 0% 100% / 0.65)",
                                border: "1px solid hsl(224 20% 12% / 0.12)",
                                color: "hsl(224 50% 12%)",
                                outline: "none",
                              }}
                              onFocus={e => { e.target.style.borderColor = "hsl(224 55% 40% / 0.50)"; e.target.style.boxShadow = "0 0 0 3px hsl(224 55% 40% / 0.10)"; }}
                              onBlur={e  => { e.target.style.borderColor = "hsl(224 20% 12% / 0.12)"; e.target.style.boxShadow = "none"; }}
                            />
                          </div>

                          <div className="flex items-center justify-between gap-4 pt-1">
                            <button
                              type="submit"
                              disabled={status === "loading"}
                              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full text-[13px] font-medium tracking-wide transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5"
                              style={{
                                background: "hsl(224 60% 18%)",
                                color: "white",
                                boxShadow: "0 8px 24px -8px hsl(224 60% 18% / 0.42)",
                              }}
                            >
                              <AnimatePresence mode="wait">
                                {status === "loading" ? (
                                  <motion.span key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    Envoi…
                                  </motion.span>
                                ) : (
                                  <motion.span key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                                    Envoyer ma demande
                                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
                                  </motion.span>
                                )}
                              </AnimatePresence>
                            </button>
                            <p className="text-[11px] font-light text-right" style={{ color: "hsl(224 15% 58%)" }}>
                              Réponse sous 24h<br />Confidentiel
                            </p>
                          </div>
                        </div>
                      )}

                    </motion.div>
                  </AnimatePresence>
                </form>
              </div>
            </motion.div>

          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
