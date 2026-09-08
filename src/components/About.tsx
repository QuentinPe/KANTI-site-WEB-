import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import SplitText from "./motion/SplitText";
import derAsset from "@/assets/der-kanti-2026.pdf.asset.json";
import { getSiteSettings } from "@/lib/siteSettingsService";
import { getDownloadUrl } from "@/lib/ressourcesService";
import { createLead } from "@/lib/leadsService";

function useCountUp(target: number, suffix = "", duration = 2000, delay = 0) {
  const [value, setValue] = useState("0");
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startAt = performance.now() + delay;
          const animate = (now: number) => {
            if (now < startAt) {
              requestAnimationFrame(animate);
              return;
            }
            const progress = Math.min((now - startAt) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            setValue(current + suffix);
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, suffix, duration, delay]);

  return { ref, value };
}

export default function About() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const years = "Depuis 2019";
  const clients = useCountUp(100, "+", 2000, 350);
  const fidelity = useCountUp(98, " %", 1800, 700);

  const [derModalOpen, setDerModalOpen] = useState(false);
  const [derForm, setDerForm] = useState({ nom: "", email: "" });
  const [derSubmitting, setDerSubmitting] = useState(false);
  const [derDone, setDerDone] = useState(false);

  const { data: settings = [] } = useQuery({ queryKey: ["site-settings"], queryFn: getSiteSettings });
  const derPath = settings.find((s) => s.key === "der_url")?.value ?? derAsset.url;

  const triggerDownload = async () => {
    // derAsset.url is a Lovable CDN path that doesn't work on Vercel — skip it as fallback
    const isLovableCdn = (p: string) => p.startsWith("/__l5e/") || p.startsWith("/__lovable");
    try {
      const url = await getDownloadUrl(derPath);
      if (isLovableCdn(url)) throw new Error("lovable-cdn");
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      // DER not yet configured in admin settings
      alert("Le document n'est pas encore disponible. Veuillez contacter le cabinet ou réessayer plus tard.");
    }
  };

  const handleDerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!derForm.nom.trim() || !derForm.email.trim()) return;
    setDerSubmitting(true);
    try {
      await createLead({ nom: derForm.nom.trim(), email: derForm.email.trim(), sujet: "DER 2026" });
    } catch {
      // lead save failure shouldn't block the download
    }
    setDerDone(true);
    await triggerDownload();
    setTimeout(() => {
      setDerModalOpen(false);
      setDerDone(false);
      setDerForm({ nom: "", email: "" });
      setDerSubmitting(false);
    }, 1800);
  };

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const ghostY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-40, 40]);
  const ghostOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section ref={sectionRef} id="about" className="section-padding pt-48 lg:pt-64 texture-paper relative overflow-hidden">

      {/* Top blend · smooth transition from Promesse (navy-deep) to this light section */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "260px",
          background: "linear-gradient(to bottom, hsl(224 60% 7%) 0%, transparent 100%)",
          zIndex: 5,
        }}
      />

      {/* Parallax ghost word */}
      <motion.div
        aria-hidden
        className="absolute -right-8 top-1/2 -translate-y-1/2 pointer-events-none select-none"
        style={{ y: ghostY, opacity: ghostOpacity }}
      >
        <span
          className="font-heading font-light tracking-tighter leading-none block"
          style={{
            fontSize: "clamp(12rem, 25vw, 28rem)",
            color: "hsl(var(--foreground) / 0.028)",
            lineHeight: 1,
          }}
        >
          KANTI
        </span>
      </motion.div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-3 reveal">
            <h2 className="text-4xl md:text-5xl font-heading font-light text-foreground leading-[1.1] mb-8 tracking-tight">
              <SplitText text="Un regard global" by="word" stagger={0.07} />
              <br />
              <SplitText
                text="sur votre patrimoine"
                by="word"
                stagger={0.05}
                delay={0.25}
                itemClassName="italic text-foreground/70"
              />
            </h2>
            <p className="text-foreground/65 leading-relaxed mb-5 text-[17px] font-light">
              La plupart des conseils patrimoniaux partent d'un produit. Chez KANTI, nous partons de vous : votre situation familiale, vos revenus, votre fiscalité, vos projets, vos inquiétudes. Ensuite seulement, nous cherchons les bonnes réponses.
            </p>
            <p className="text-foreground/65 leading-relaxed mb-10 text-[17px] font-light">
              Cabinet inscrit à l'ORIAS et adhérent de la CNCEF, nous travaillons en architecture ouverte, sans lien capitalistique avec un réseau bancaire ou un groupe financier. Cette liberté nous permet de travailler exclusivement dans votre intérêt, et de vous le démontrer, année après année.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <Link
                to="/cabinet"
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground link-underline pb-1"
              >
                En savoir plus sur le cabinet
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <button
                type="button"
                onClick={() => setDerModalOpen(true)}
                data-magnetic
                className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-foreground transition-all duration-500 hover:-translate-y-0.5"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(var(--foreground) / 0.08) 0%, hsl(var(--foreground) / 0.03) 100%)",
                  backdropFilter: "blur(16px) saturate(140%)",
                  WebkitBackdropFilter: "blur(16px) saturate(140%)",
                  boxShadow:
                    "inset 0 1px 0 hsl(var(--foreground) / 0.12), inset 0 -1px 0 hsl(var(--foreground) / 0.04), 0 8px 24px -10px hsl(var(--foreground) / 0.2)",
                  border: "1px solid hsl(var(--foreground) / 0.12)",
                }}
              >
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(120deg, transparent 20%, hsl(var(--foreground) / 0.1) 50%, transparent 80%)",
                  }}
                />
                <svg
                  className="w-4 h-4 relative z-10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16"
                  />
                </svg>
                <span className="relative z-10">Télécharger notre DER</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 reveal reveal-delay-2 space-y-8">
            <div className="glass-float p-8 md:p-10 space-y-8 relative overflow-hidden">
              <div className="relative pl-5">
                <motion.span
                  aria-hidden
                  className="absolute left-0 top-1 bottom-1 w-px bg-foreground/25 origin-top"
                  initial={{ scaleY: reduce ? 1 : 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true, margin: "-20%" }}
                  transition={{ duration: 0.9, delay: 0, ease: [0.22, 1, 0.36, 1] }}
                />
                <p className="text-4xl font-heading font-light text-foreground tracking-tight">
                  {years}
                </p>
                <p className="text-sm text-foreground/55 mt-1 font-light">d'exercice à Bordeaux</p>
              </div>
              <div className="separator-fine opacity-30" />
              <Stat
                refEl={clients.ref}
                value={clients.value}
                label="familles et dirigeants accompagnés"
                delay={0.35}
                reduce={!!reduce}
              />
              <div className="separator-fine opacity-30" />
              <Stat
                refEl={fidelity.ref}
                value={fidelity.value}
                label="de clients fidèles chaque année"
                delay={0.7}
                reduce={!!reduce}
              />
            </div>
          </div>
        </div>
      </div>

      {/* DER download modal */}
      <AnimatePresence>
        {derModalOpen && (
          <motion.div
            key="der-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
            style={{ background: "hsl(224 60% 5% / 0.55)", backdropFilter: "blur(10px)" }}
            onClick={(e) => { if (e.target === e.currentTarget) setDerModalOpen(false); }}
          >
            <motion.div
              key="der-modal"
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-md rounded-2xl p-8 relative"
              style={{
                background: "linear-gradient(145deg, hsl(0 0% 100% / 0.96) 0%, hsl(0 0% 97% / 0.96) 100%)",
                boxShadow: "0 32px 80px -16px hsl(224 60% 8% / 0.4), 0 0 0 1px hsl(224 20% 20% / 0.08)",
              }}
            >
              <button
                type="button"
                onClick={() => setDerModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-colors"
                aria-label="Fermer"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {derDone ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4"
                >
                  <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="font-heading text-lg font-light text-foreground">Votre DER s'ouvre…</p>
                </motion.div>
              ) : (
                <>
                  <p className="text-[10px] tracking-[0.28em] uppercase font-medium text-foreground/40 mb-3">
                    Document réglementaire
                  </p>
                  <h3 className="font-heading text-2xl font-light text-foreground mb-1.5 leading-tight">
                    Télécharger notre DER 2026
                  </h3>
                  <p className="text-[13.5px] text-foreground/55 font-light mb-7 leading-relaxed">
                    Renseignez vos coordonnées pour accéder au Document d'Entrée en Relation du cabinet KANTI.
                  </p>

                  <form onSubmit={handleDerSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[11px] tracking-[0.18em] uppercase font-medium text-foreground/50 mb-1.5">
                        Nom complet
                      </label>
                      <input
                        type="text"
                        required
                        value={derForm.nom}
                        onChange={(e) => setDerForm((f) => ({ ...f, nom: e.target.value }))}
                        placeholder="Jean Dupont"
                        className="w-full rounded-xl px-4 py-3 text-sm font-light text-foreground placeholder:text-foreground/30 outline-none transition-all duration-200 focus:ring-2 focus:ring-foreground/15"
                        style={{
                          background: "hsl(0 0% 0% / 0.035)",
                          border: "1px solid hsl(0 0% 0% / 0.1)",
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] tracking-[0.18em] uppercase font-medium text-foreground/50 mb-1.5">
                        Adresse e-mail
                      </label>
                      <input
                        type="email"
                        required
                        value={derForm.email}
                        onChange={(e) => setDerForm((f) => ({ ...f, email: e.target.value }))}
                        placeholder="jean@exemple.com"
                        className="w-full rounded-xl px-4 py-3 text-sm font-light text-foreground placeholder:text-foreground/30 outline-none transition-all duration-200 focus:ring-2 focus:ring-foreground/15"
                        style={{
                          background: "hsl(0 0% 0% / 0.035)",
                          border: "1px solid hsl(0 0% 0% / 0.1)",
                        }}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={derSubmitting}
                      className="w-full mt-2 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-medium tracking-wide transition-all duration-300 disabled:opacity-60"
                      style={{
                        background: "linear-gradient(145deg, hsl(224 60% 18%) 0%, hsl(224 62% 10%) 100%)",
                        color: "white",
                        boxShadow: "0 8px 28px -8px hsl(224 60% 10% / 0.45)",
                      }}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
                      </svg>
                      {derSubmitting ? "Ouverture…" : "Accéder au document"}
                    </button>
                    <p className="text-center text-[11px] text-foreground/35 font-light">
                      Vos données restent confidentielles et ne sont jamais revendues.
                    </p>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Stat({
  refEl,
  value,
  label,
  delay,
  reduce,
}: {
  refEl: React.RefObject<HTMLDivElement>;
  value: string;
  label: string;
  delay: number;
  reduce: boolean;
}) {
  return (
    <div ref={refEl} className="relative pl-5">
      {/* Traced vertical line accent */}
      <motion.span
        aria-hidden
        className="absolute left-0 top-1 bottom-1 w-px bg-foreground/25 origin-top"
        initial={{ scaleY: reduce ? 1 : 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      />
      <p className="text-4xl font-heading font-light text-foreground tracking-tight">
        {value}
      </p>
      <p className="text-sm text-foreground/55 mt-1 font-light">{label}</p>
    </div>
  );
}
