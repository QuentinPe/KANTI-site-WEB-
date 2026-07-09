import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Building2, Video, Phone as PhoneIcon, CheckCircle2, MapPin, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo, { breadcrumbJsonLd, localBusinessJsonLd } from "@/components/Seo";
// Photo placeholder — remplacez src="/contact-bg.jpg" par votre propre image dans public/
// en attendant on utilise contact-bordeaux.jpg de src/assets
import contactBg from "@/assets/contact-bordeaux.jpg";

/* ─── Validation ─────────────────────────────────────────────────────────── */
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

/* ─── Données statiques ───────────────────────────────────────────────────── */
const ADVISORS = [
  {
    id: "quentin",
    name: "Quentin Perromat",
    role: "Associé Fondateur",
    tags: ["Stratégie", "Fiscalité", "Transmission"],
    img: "/quentin-perromat.png",
  },
  {
    id: "thomas",
    name: "Thomas Robert",
    role: "Courtier & Assistant",
    tags: ["Financement", "Suivi client"],
    img: "/thomas-robert.png",
  },
  {
    id: "any",
    name: "Peu importe",
    role: "Le plus disponible",
    tags: ["Disponibilité prioritaire"],
    img: null,
  },
];

const FORMATS = [
  { id: "cabinet", icon: Building2, label: "En cabinet", sub: "12 rue Ferrere · Bordeaux" },
  { id: "visio", icon: Video, label: "Visioconférence", sub: "Lien envoyé par email" },
  { id: "telephone", icon: PhoneIcon, label: "Par téléphone", sub: "Nous vous rappelons" },
];

const TIMING = [
  { id: "asap", label: "Dès que possible" },
  { id: "week", label: "Cette semaine" },
  { id: "two_weeks", label: "Dans 2 semaines" },
  { id: "month", label: "Dans le mois" },
];

const SUBJECTS = [
  "Bilan patrimonial",
  "Optimisation fiscale",
  "Placements & épargne",
  "Immobilier",
  "Transmission",
  "Financement",
  "Patrimoine pro",
  "Autre sujet",
];

/* ─── Composants internes ─────────────────────────────────────────────────── */
function SectionLabel({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <span
        className="text-[10px] font-semibold tracking-[0.28em] tabular-nums"
        style={{ color: "hsl(224 60% 40%)" }}
      >
        {n}
      </span>
      <span className="flex-1 h-px" style={{ background: "hsl(224 60% 12% / 0.10)" }} />
      <span className="text-[11px] font-medium tracking-[0.2em] uppercase" style={{ color: "hsl(224 40% 35%)" }}>
        {children}
      </span>
    </div>
  );
}

function TogglePill({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2 rounded-full text-[12px] font-medium tracking-wide transition-all duration-200"
      style={{
        background: selected ? "hsl(224 60% 18%)" : "hsl(0 0% 100% / 0.60)",
        color: selected ? "white" : "hsl(224 40% 30%)",
        border: `1px solid ${selected ? "hsl(224 60% 18%)" : "hsl(224 20% 12% / 0.14)"}`,
        boxShadow: selected ? "0 4px 12px -4px hsl(224 60% 18% / 0.35)" : "none",
      }}
    >
      {children}
    </button>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function ContactPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    conseiller: "",
    format: "",
    timing: "",
    sujet: "",
    nom: "",
    email: "",
    telephone: "",
    message: "",
    website: "",
  });
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  const set = (key: string, val: string) =>
    setForm((prev) => ({ ...prev, [key]: prev[key as keyof typeof prev] === val ? "" : val }));

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    if (parsed.data.website) {
      navigate("/merci", { state: { name: parsed.data.nom.split(" ")[0], subject: "contact" } });
      return;
    }
    setStatus("loading");
    console.info("[KANTI] Contact submission:", parsed.data);
    await new Promise((r) => setTimeout(r, 1100));
    setStatus("idle");
    navigate("/merci", { state: { name: parsed.data.nom.split(" ")[0], subject: "contact" } });
  };

  return (
    <>
      <Seo
        title="Prendre rendez-vous — Cabinet KANTI, Bordeaux"
        description="Premier échange de 30 minutes gratuit et sans engagement avec un conseiller KANTI. Cabinet de gestion de patrimoine à Bordeaux, réponse sous 24h ouvrées."
        jsonLd={[
          localBusinessJsonLd,
          breadcrumbJsonLd([
            { name: "Accueil", url: "/" },
            { name: "Contact", url: "/contact" },
          ]),
        ]}
      />
      <Header />

      <main id="main">
        <section className="relative overflow-hidden" style={{ minHeight: "100vh" }}>

          {/* ── Background image ── */}
          <div className="absolute inset-0">
            <img
              src={contactBg}
              alt=""
              aria-hidden
              className="w-full h-full object-cover object-center"
              fetchPriority="high"
            />
          </div>

          {/* ── Left white gradient ── */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(105deg, hsl(0 0% 100% / 0.98) 0%, hsl(0 0% 100% / 0.94) 30%, hsl(0 0% 100% / 0.62) 52%, hsl(0 0% 100% / 0.10) 70%, transparent 82%)",
            }}
          />
          {/* Top / bottom vignette for seamless blending */}
          <div aria-hidden className="absolute inset-x-0 top-0 h-24 pointer-events-none" style={{ background: "linear-gradient(to bottom, hsl(220 30% 97% / 0.85) 0%, transparent 100%)" }} />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-24 pointer-events-none" style={{ background: "linear-gradient(to top, hsl(220 30% 97% / 0.85) 0%, transparent 100%)" }} />

          {/* ── Content grid ── */}
          <div className="relative z-10 max-w-6xl mx-auto px-8 md:px-14 py-28 lg:py-32 grid lg:grid-cols-[1fr_500px] gap-12 xl:gap-20 items-center min-h-screen">

            {/* ── Left: Brand statement ── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="lg:self-center"
            >
              <div className="flex items-center gap-2 mb-7">
                <span className="w-5 h-[2px]" style={{ background: "hsl(224 60% 22%)" }} />
                <p className="text-[11px] tracking-[0.32em] uppercase font-medium" style={{ color: "hsl(224 60% 22%)" }}>
                  Cabinet KANTI · Bordeaux
                </p>
              </div>

              <h1
                className="font-heading font-light leading-[1.04] tracking-tight mb-8"
                style={{ fontSize: "clamp(2.4rem, 5vw, 3.6rem)", color: "hsl(224 60% 12%)" }}
              >
                Prenons
                <br />
                rendez-vous.
              </h1>

              <div className="space-y-3 mb-10">
                {[
                  "30 minutes, gratuit et sans engagement",
                  "Réponse sous 24 heures ouvrées",
                  "Échange confidentiel, aucun engagement commercial",
                ].map((line) => (
                  <div key={line} className="flex items-start gap-2.5">
                    <CheckCircle2
                      className="w-4 h-4 mt-0.5 flex-shrink-0"
                      style={{ color: "hsl(224 55% 38%)" }}
                      strokeWidth={1.5}
                    />
                    <p className="text-[14px] font-light" style={{ color: "hsl(224 30% 28%)" }}>
                      {line}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-8 border-t" style={{ borderColor: "hsl(224 20% 12% / 0.12)" }}>
                <a
                  href="tel:+33663324809"
                  className="flex items-center gap-2.5 text-[13px] font-light transition-colors duration-300"
                  style={{ color: "hsl(224 30% 40%)" }}
                >
                  <PhoneIcon className="w-3.5 h-3.5" strokeWidth={1.5} style={{ color: "hsl(224 40% 50%)" }} />
                  06 63 32 48 09
                </a>
                <a
                  href="mailto:kanti@adnfamily.com"
                  className="flex items-center gap-2.5 text-[13px] font-light"
                  style={{ color: "hsl(224 30% 40%)" }}
                >
                  <Mail className="w-3.5 h-3.5" strokeWidth={1.5} style={{ color: "hsl(224 40% 50%)" }} />
                  kanti@adnfamily.com
                </a>
                <div className="flex items-start gap-2.5 text-[13px] font-light" style={{ color: "hsl(224 20% 55%)" }}>
                  <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                  12 Rue Ferrere · 33000 Bordeaux
                </div>
              </div>
            </motion.div>

            {/* ── Right: Glass form card ── */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="w-full p-7 md:p-8"
                style={{
                  background: "hsl(0 0% 100% / 0.78)",
                  backdropFilter: "blur(36px) saturate(160%)",
                  WebkitBackdropFilter: "blur(36px) saturate(160%)",
                  border: "1px solid hsl(0 0% 100% / 0.65)",
                  borderTopColor: "hsl(0 0% 100% / 0.95)",
                  boxShadow:
                    "inset 0 1.5px 0 0 hsl(0 0% 100% / 0.90), 0 40px 80px -20px hsl(224 60% 12% / 0.14), 0 8px 24px -8px hsl(224 60% 12% / 0.08)",
                  borderRadius: "24px",
                }}
              >
                <form onSubmit={handleSubmit} noValidate className="space-y-7">

                  {/* Honeypot */}
                  <div aria-hidden className="absolute -left-[9999px] w-px h-px overflow-hidden">
                    <input name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={handleInput} />
                  </div>

                  {/* ── 01 Conseiller ── */}
                  <div>
                    <SectionLabel n="01">Avec qui souhaitez-vous échanger ?</SectionLabel>
                    <div className="grid grid-cols-3 gap-2.5">
                      {ADVISORS.map((a) => {
                        const selected = form.conseiller === a.id;
                        return (
                          <button
                            key={a.id}
                            type="button"
                            onClick={() => set("conseiller", a.id)}
                            className="relative flex flex-col items-center gap-2 p-3 rounded-[14px] text-center transition-all duration-200"
                            style={{
                              background: selected
                                ? "hsl(224 60% 18% / 0.08)"
                                : "hsl(0 0% 100% / 0.55)",
                              border: `1px solid ${selected ? "hsl(224 60% 35%)" : "hsl(224 20% 12% / 0.12)"}`,
                              boxShadow: selected
                                ? "0 0 0 2px hsl(224 60% 35% / 0.25), inset 0 1px 0 hsl(0 0% 100% / 0.80)"
                                : "inset 0 1px 0 hsl(0 0% 100% / 0.70)",
                            }}
                          >
                            {a.img ? (
                              <div
                                className="w-10 h-10 rounded-full overflow-hidden border-2"
                                style={{ borderColor: selected ? "hsl(224 60% 35%)" : "hsl(0 0% 0% / 0.08)" }}
                              >
                                <img src={a.img} alt={a.name} className="w-full h-full object-cover grayscale-[0.3]" />
                              </div>
                            ) : (
                              <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-base"
                                style={{
                                  background: "hsl(224 20% 92%)",
                                  border: `2px solid ${selected ? "hsl(224 60% 35%)" : "hsl(0 0% 0% / 0.08)"}`,
                                }}
                              >
                                ✦
                              </div>
                            )}
                            <div>
                              <p className="text-[11px] font-semibold leading-tight" style={{ color: "hsl(224 60% 14%)" }}>
                                {a.name.split(" ")[0]}
                              </p>
                              <p className="text-[10px] font-light" style={{ color: "hsl(224 30% 45%)" }}>
                                {a.role}
                              </p>
                            </div>
                            {selected && (
                              <span
                                className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                                style={{ background: "hsl(224 60% 30%)" }}
                              >
                                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
                                  <path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                </svg>
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ── 02 Format ── */}
                  <div>
                    <SectionLabel n="02">Comment souhaitez-vous nous rencontrer ?</SectionLabel>
                    <div className="grid grid-cols-3 gap-2.5">
                      {FORMATS.map(({ id, icon: Icon, label, sub }) => {
                        const selected = form.format === id;
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => set("format", id)}
                            className="flex flex-col items-center gap-1.5 py-4 px-2 rounded-[14px] text-center transition-all duration-200"
                            style={{
                              background: selected
                                ? "hsl(224 60% 18% / 0.09)"
                                : "hsl(0 0% 100% / 0.55)",
                              border: `1px solid ${selected ? "hsl(224 60% 35%)" : "hsl(224 20% 12% / 0.12)"}`,
                              boxShadow: selected
                                ? "0 0 0 2px hsl(224 60% 35% / 0.20), inset 0 1px 0 hsl(0 0% 100% / 0.80)"
                                : "inset 0 1px 0 hsl(0 0% 100% / 0.70)",
                            }}
                          >
                            <Icon
                              className="w-5 h-5"
                              strokeWidth={1.5}
                              style={{ color: selected ? "hsl(224 60% 30%)" : "hsl(224 30% 55%)" }}
                            />
                            <p className="text-[11px] font-semibold leading-tight" style={{ color: "hsl(224 50% 18%)" }}>
                              {label}
                            </p>
                            <p className="text-[10px] leading-snug" style={{ color: "hsl(224 20% 55%)" }}>
                              {sub}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ── 03 Timing ── */}
                  <div>
                    <SectionLabel n="03">Quand souhaitez-vous échanger ?</SectionLabel>
                    <div className="flex flex-wrap gap-2">
                      {TIMING.map(({ id, label }) => (
                        <TogglePill key={id} selected={form.timing === id} onClick={() => set("timing", id)}>
                          {label}
                        </TogglePill>
                      ))}
                    </div>
                  </div>

                  {/* ── 04 Vos infos ── */}
                  <div>
                    <SectionLabel n="04">Vos coordonnées</SectionLabel>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="nom" className="block text-[10px] font-medium tracking-[0.2em] uppercase mb-1.5" style={{ color: "hsl(224 30% 45%)" }}>
                            Nom complet *
                          </label>
                          <input
                            id="nom"
                            name="nom"
                            type="text"
                            required
                            maxLength={100}
                            value={form.nom}
                            onChange={handleInput}
                            disabled={status === "loading"}
                            placeholder="Votre nom"
                            className="w-full px-4 py-2.5 text-[13px] rounded-xl transition-all duration-200 disabled:opacity-50"
                            style={{
                              background: "hsl(0 0% 100% / 0.60)",
                              border: "1px solid hsl(224 20% 12% / 0.13)",
                              color: "hsl(224 50% 14%)",
                              outline: "none",
                            }}
                            onFocus={(e) => { e.target.style.borderColor = "hsl(224 60% 40% / 0.50)"; e.target.style.boxShadow = "0 0 0 3px hsl(224 60% 40% / 0.10)"; }}
                            onBlur={(e) => { e.target.style.borderColor = "hsl(224 20% 12% / 0.13)"; e.target.style.boxShadow = "none"; }}
                          />
                        </div>
                        <div>
                          <label htmlFor="telephone" className="block text-[10px] font-medium tracking-[0.2em] uppercase mb-1.5" style={{ color: "hsl(224 30% 45%)" }}>
                            Téléphone
                          </label>
                          <input
                            id="telephone"
                            name="telephone"
                            type="tel"
                            maxLength={30}
                            value={form.telephone}
                            onChange={handleInput}
                            disabled={status === "loading"}
                            placeholder="06 00 00 00 00"
                            className="w-full px-4 py-2.5 text-[13px] rounded-xl transition-all duration-200 disabled:opacity-50"
                            style={{
                              background: "hsl(0 0% 100% / 0.60)",
                              border: "1px solid hsl(224 20% 12% / 0.13)",
                              color: "hsl(224 50% 14%)",
                              outline: "none",
                            }}
                            onFocus={(e) => { e.target.style.borderColor = "hsl(224 60% 40% / 0.50)"; e.target.style.boxShadow = "0 0 0 3px hsl(224 60% 40% / 0.10)"; }}
                            onBlur={(e) => { e.target.style.borderColor = "hsl(224 20% 12% / 0.13)"; e.target.style.boxShadow = "none"; }}
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-[10px] font-medium tracking-[0.2em] uppercase mb-1.5" style={{ color: "hsl(224 30% 45%)" }}>
                          Email *
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          maxLength={255}
                          value={form.email}
                          onChange={handleInput}
                          disabled={status === "loading"}
                          placeholder="votre@email.fr"
                          className="w-full px-4 py-2.5 text-[13px] rounded-xl transition-all duration-200 disabled:opacity-50"
                          style={{
                            background: "hsl(0 0% 100% / 0.60)",
                            border: "1px solid hsl(224 20% 12% / 0.13)",
                            color: "hsl(224 50% 14%)",
                            outline: "none",
                          }}
                          onFocus={(e) => { e.target.style.borderColor = "hsl(224 60% 40% / 0.50)"; e.target.style.boxShadow = "0 0 0 3px hsl(224 60% 40% / 0.10)"; }}
                          onBlur={(e) => { e.target.style.borderColor = "hsl(224 20% 12% / 0.13)"; e.target.style.boxShadow = "none"; }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* ── 05 Sujet ── */}
                  <div>
                    <SectionLabel n="05">Sujet principal</SectionLabel>
                    <div className="flex flex-wrap gap-2">
                      {SUBJECTS.map((s) => (
                        <TogglePill key={s} selected={form.sujet === s} onClick={() => set("sujet", s)}>
                          {s}
                        </TogglePill>
                      ))}
                    </div>
                  </div>

                  {/* ── Message ── */}
                  <div>
                    <label htmlFor="message" className="block text-[10px] font-medium tracking-[0.2em] uppercase mb-1.5" style={{ color: "hsl(224 30% 45%)" }}>
                      Quelques mots sur votre situation <span className="normal-case tracking-normal opacity-60">(optionnel)</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      maxLength={2000}
                      value={form.message}
                      onChange={handleInput}
                      disabled={status === "loading"}
                      placeholder="Décrivez brièvement votre situation ou ce qui vous amène…"
                      className="w-full px-4 py-2.5 text-[13px] rounded-xl resize-none transition-all duration-200 disabled:opacity-50"
                      style={{
                        background: "hsl(0 0% 100% / 0.60)",
                        border: "1px solid hsl(224 20% 12% / 0.13)",
                        color: "hsl(224 50% 14%)",
                        outline: "none",
                      }}
                      onFocus={(e) => { e.target.style.borderColor = "hsl(224 60% 40% / 0.50)"; e.target.style.boxShadow = "0 0 0 3px hsl(224 60% 40% / 0.10)"; }}
                      onBlur={(e) => { e.target.style.borderColor = "hsl(224 20% 12% / 0.13)"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>

                  {/* ── Submit ── */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-1">
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5"
                      style={{
                        background: "hsl(224 60% 18%)",
                        color: "white",
                        boxShadow: "0 8px 24px -8px hsl(224 60% 18% / 0.45)",
                      }}
                    >
                      <AnimatePresence mode="wait">
                        {status === "loading" ? (
                          <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            Envoi en cours…
                          </motion.span>
                        ) : (
                          <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                            Envoyer ma demande
                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                    <p className="text-[11px] font-light" style={{ color: "hsl(224 20% 55%)" }}>
                      Réponse sous 24h ouvrées · Confidentiel
                    </p>
                  </div>

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
