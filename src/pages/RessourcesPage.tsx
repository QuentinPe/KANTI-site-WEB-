import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { z } from "zod";
import { toast } from "sonner";
import { Download, Mail, X, ArrowUpRight, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { getRessources, getDownloadUrl } from "@/lib/ressourcesService";
import heroBg from "@/assets/resources-dome.jpg";
import imgDefisc from "@/assets/resource-defiscalisation.jpg";
import imgTransmission from "@/assets/resource-transmission.jpg";
import imgCession from "@/assets/resource-cession.jpg";
import imgImmobilier from "@/assets/resource-immobilier.jpg";
import imgRetraite from "@/assets/resource-retraite.jpg";
import imgAssuranceVie from "@/assets/resource-assurance-vie.jpg";
import imgScpi from "@/assets/resource-scpi.jpg";
import imgExpat from "@/assets/resource-expatriation.jpg";
import imgIfi from "@/assets/resource-ifi.jpg";
import imgIsr from "@/assets/resource-isr.jpg";

type Category = "Tous" | "Fiscalité" | "Transmission" | "Dirigeants" | "Investir" | "International";

const CATEGORY_IMAGES: Record<string, string> = {
  "Fiscalité": imgDefisc,
  "Transmission": imgTransmission,
  "Dirigeants": imgCession,
  "Investir": imgRetraite,
  "International": imgExpat,
};

interface DisplayResource {
  id: string;
  category: string;
  eyebrow: string;
  title: string;
  description: string;
  storagePath: string;
  image: string;
}

const RESOURCES_FALLBACK: DisplayResource[] = [
  { id: "defiscalisation-2026", category: "Fiscalité", eyebrow: "Guide PDF · 24 pages", title: "10 leviers de défiscalisation 2026", description: "Panorama actualisé des dispositifs : PER, Girardin, Pinel+, FCPI/FIP, déficits fonciers, donation-cession, Dutreil. Avantages, limites, profils éligibles.", storagePath: "/resources/kanti-defiscalisation-2026.pdf", image: imgDefisc },
  { id: "transmission-checklist", category: "Transmission", eyebrow: "Checklist · 6 pages", title: "Préparer sa transmission patrimoniale", description: "Méthode pas-à-pas : inventaire, donation, démembrement, assurance-vie, holding familiale. Les questions à se poser avant 50, 60 et 70 ans.", storagePath: "/resources/kanti-transmission-checklist.pdf", image: imgTransmission },
  { id: "dirigeant-cession", category: "Dirigeants", eyebrow: "Mémo · 12 pages", title: "Le dirigeant face à la cession", description: "Apport-cession, Dutreil, OBO, holding patrimoniale. Comment structurer en amont pour préserver le fruit de toute une vie d'entreprise.", storagePath: "/resources/kanti-dirigeant-cession.pdf", image: imgCession },
  { id: "immobilier-arbitrage", category: "Investir", eyebrow: "Étude · 18 pages", title: "Immobilier patrimonial : arbitrer en 2026", description: "Faut-il vendre, conserver, démembrer ? Analyse comparative SCI, SCPI, nue-propriété, LMNP, et impact de la fiscalité 2026.", storagePath: "/resources/kanti-immobilier-arbitrage.pdf", image: imgImmobilier },
  { id: "retraite-cadres", category: "Investir", eyebrow: "Guide PDF · 20 pages", title: "Préparer sa retraite de cadre supérieur", description: "Reconstituer 70 % de ses revenus à la retraite : PER individuel, PER d'entreprise, Madelin, capitalisation, immobilier locatif. Stratégies par tranche d'âge.", storagePath: "/resources/kanti-retraite-cadres.pdf", image: imgRetraite },
  { id: "assurance-vie-2026", category: "Investir", eyebrow: "Mémo · 10 pages", title: "Assurance-vie : les arbitrages clés 2026", description: "Fonds euros, unités de compte, gestion pilotée, démembrement de clause bénéficiaire. Comment tirer le meilleur parti du contrat préféré des Français.", storagePath: "/resources/kanti-assurance-vie-2026.pdf", image: imgAssuranceVie },
  { id: "scpi-selection", category: "Investir", eyebrow: "Étude · 22 pages", title: "SCPI : sélectionner sans se tromper", description: "Notre grille d'analyse en 12 critères : TOF, RAN, capitalisation, géographie, secteurs. Les 8 SCPI que nous suivons en 2026 et celles à éviter.", storagePath: "/resources/kanti-scpi-selection.pdf", image: imgScpi },
  { id: "expatriation-fiscale", category: "International", eyebrow: "Guide PDF · 28 pages", title: "Expatriation : anticiper sa fiscalité", description: "Exit tax, conventions fiscales, comptes à l'étranger, IFI, retour en France. Le mode d'emploi pour les Français qui s'installent ou reviennent.", storagePath: "/resources/kanti-expatriation-fiscale.pdf", image: imgExpat },
  { id: "ifi-optimisation", category: "Fiscalité", eyebrow: "Mémo · 8 pages", title: "IFI 2026 : les leviers d'optimisation", description: "Démembrement, dette déductible, nue-propriété de SCPI, foncières non cotées. Réduire son IFI sans dégrader son patrimoine.", storagePath: "/resources/kanti-ifi-optimisation.pdf", image: imgIfi },
  { id: "investissement-responsable", category: "Investir", eyebrow: "Rapport · 16 pages", title: "Investissement responsable & ISR", description: "Labels ISR, Greenfin, Finansol : décrypter les promesses. Comment construire un portefeuille à impact sans sacrifier la performance.", storagePath: "/resources/kanti-investissement-responsable.pdf", image: imgIsr },
];

const categories: Category[] = ["Tous", "Fiscalité", "Transmission", "Dirigeants", "Investir", "International"];

const emailSchema = z.object({
  name: z.string().trim().min(2, "Indiquez votre prénom et nom").max(100),
  email: z.string().trim().email("Email invalide").max(255),
});

// Column stagger: col 0 = no offset, col 1 = down, col 2 = slight down
const COL_TOP = ["mt-0", "mt-0 lg:mt-10", "mt-0 lg:mt-5"];

const spring = { type: "spring" as const, stiffness: 360, damping: 32, mass: 0.9 };

export default function RessourcesPage() {
  useScrollReveal();
  const navigate = useNavigate();
  const [openId, setOpenId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>("Tous");

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);

  const { data: dbRessources } = useQuery({ queryKey: ["ressources"], queryFn: getRessources });

  const resources: DisplayResource[] = useMemo(() => {
    if (!dbRessources || dbRessources.length === 0) return RESOURCES_FALLBACK;
    return dbRessources.map((r) => ({
      id: r.id,
      category: r.category,
      eyebrow: r.pages ? `${r.category} · ${r.pages} pages` : r.category,
      title: r.title,
      description: r.description,
      storagePath: r.storage_path,
      image: CATEGORY_IMAGES[r.category] ?? imgDefisc,
    }));
  }, [dbRessources]);

  const activeResource = resources.find((r) => r.id === openId);

  const filtered = useMemo(
    () => activeCategory === "Tous" ? resources : resources.filter((r) => r.category === activeCategory),
    [activeCategory, resources]
  );

  // Escape key closes the expanded card
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && !loading) setOpenId(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [loading]);

  // Reset form when resource changes
  useEffect(() => { setForm({ name: "", email: "" }); }, [openId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    if (!activeResource) return;
    setLoading(true);
    try {
      const fileUrl = await getDownloadUrl(activeResource.storagePath);
      console.info("[KANTI] Lead magnet request:", { ...parsed.data, resource: activeResource.id, fileUrl });
    } catch { /* non-blocking */ }
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setOpenId(null);
    navigate("/merci", { state: { name: parsed.data.name.split(" ")[0], subject: "ressource", resourceTitle: activeResource?.title } });
  };

  return (
    <>
      <Seo
        title="Ressources patrimoniales, guides et études KANTI"
        description="Guides PDF gratuits : défiscalisation 2026, transmission, cession d'entreprise, immobilier patrimonial. Téléchargez les analyses du cabinet KANTI."
      />
      <Header />

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative overflow-hidden" style={{ minHeight: "68vh" }}>
        <motion.div className="absolute inset-0 will-change-transform" style={{ y: imageY, scale: 1.14 }}>
          <img src={heroBg} alt="" aria-hidden className="w-full h-full object-cover object-center" fetchPriority="high" />
        </motion.div>
        <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
          background: "linear-gradient(105deg, hsl(0 0% 100% / 0.98) 0%, hsl(0 0% 100% / 0.92) 28%, hsl(0 0% 100% / 0.60) 52%, hsl(0 0% 100% / 0.08) 70%, transparent 82%)"
        }} />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-36 pointer-events-none" style={{ background: "linear-gradient(to top, hsl(0 0% 100%) 0%, transparent 100%)" }} />
        <div className="relative z-10 flex items-center min-h-[68vh] py-28 lg:py-36">
          <div className="max-w-6xl mx-auto px-8 md:px-14 w-full">
            <div className="max-w-[520px]">
              <motion.div className="flex items-center gap-2 mb-7" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }}>
                <span className="w-5 h-[2px]" style={{ background: "hsl(224 60% 22%)" }} />
                <p className="text-[11px] tracking-[0.32em] uppercase font-medium" style={{ color: "hsl(224 60% 22%)" }}>Bibliothèque · Éclairages</p>
              </motion.div>
              <motion.h1 className="font-heading font-light leading-[1.04] tracking-tight mb-6"
                style={{ fontSize: "clamp(2.6rem, 5.5vw, 4rem)", color: "hsl(224 60% 12%)" }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
                Ressources<br /><span className="italic" style={{ color: "hsl(224 55% 30%)" }}>&amp; guides.</span>
              </motion.h1>
              <motion.p className="text-[15px] font-light leading-relaxed mb-8" style={{ color: "hsl(224 25% 32%)" }}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                Une bibliothèque éditoriale d'études, de mémos et de checklists pour comprendre les enjeux patrimoniaux d'aujourd'hui.
              </motion.p>
              <motion.p className="text-[12px] font-light tracking-wide" style={{ color: "hsl(224 18% 55%)" }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }}>
                {resources.length} publications · Téléchargement gratuit
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Vault — immersive resource library ── */}
      <section className="relative py-20 pb-36 overflow-hidden bg-white">

        {/* Subtle ambient radial — stays on white, no coloured band at the seam */}
        <div aria-hidden className="absolute inset-x-0 top-0 h-64 pointer-events-none" style={{
          background: "radial-gradient(ellipse 70% 100% at 50% 0%, hsl(224 40% 94% / 0.50) 0%, transparent 100%)"
        }} />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">

          {/* Section header */}
          <motion.div className="mb-14 reveal"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div>
                <p className="text-[10px] tracking-[0.35em] uppercase font-medium mb-3" style={{ color: "hsl(224 30% 50%)" }}>
                  Toutes les publications
                </p>
                <h2 className="font-heading text-3xl md:text-4xl font-light tracking-tight leading-[1.05]" style={{ color: "hsl(224 55% 12%)" }}>
                  Explorez par <span className="italic font-normal" style={{ color: "hsl(224 35% 38%)" }}>thématique</span>
                </h2>
              </div>

              {/* Category pills */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const active = activeCategory === cat;
                  return (
                    <motion.button key={cat} type="button"
                      onClick={() => setActiveCategory(cat)}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-full text-[11px] font-medium tracking-wide transition-all duration-200"
                      style={{
                        background: active ? "hsl(224 60% 18%)" : "hsl(0 0% 100% / 0.70)",
                        color: active ? "white" : "hsl(224 30% 38%)",
                        border: `1px solid ${active ? "transparent" : "hsl(224 30% 85%)"}`,
                        backdropFilter: "blur(12px)",
                        boxShadow: active ? "0 4px 16px -4px hsl(224 60% 18% / 0.30)" : "0 1px 4px hsl(224 30% 20% / 0.06)",
                      }}>
                      {cat}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Floating card grid */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7 items-start">
            <AnimatePresence mode="popLayout">
              {filtered.map((r, i) => {
                const isHovered = hoveredId === r.id;
                const isDimmed = hoveredId !== null && !isHovered;
                const isExpanded = openId === r.id;

                return (
                  <motion.article
                    key={r.id}
                    layout
                    layoutId={`vault-${r.id}`}
                    className={`${COL_TOP[i % 3]} cursor-pointer rounded-[22px] overflow-hidden select-none`}
                    style={{
                      background: "hsl(0 0% 100%)",
                      border: "1px solid hsl(224 25% 88%)",
                      boxShadow: "0 4px 20px -8px hsl(224 60% 20% / 0.08)",
                      visibility: isExpanded ? "hidden" : "visible",
                    }}
                    initial={{ opacity: 0, y: 32 }}
                    animate={{
                      opacity: isExpanded ? 0 : isDimmed ? 0.42 : 1,
                      scale: isDimmed ? 0.972 : 1,
                      y: isDimmed ? 6 : 0,
                    }}
                    exit={{ opacity: 0, scale: 0.95, y: 16 }}
                    whileHover={{
                      y: -12,
                      scale: 1.018,
                      boxShadow: "0 28px 64px -16px hsl(224 60% 20% / 0.18), 0 0 0 1px hsl(224 50% 70% / 0.18)",
                      transition: spring,
                    }}
                    transition={spring}
                    viewport={{ once: true, margin: "-60px" }}
                    onHoverStart={() => setHoveredId(r.id)}
                    onHoverEnd={() => setHoveredId(null)}
                    onClick={() => { setOpenId(r.id); setHoveredId(null); }}
                    aria-label={`Voir le détail : ${r.title}`}
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <motion.img
                        src={r.image} alt={r.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        whileHover={{ scale: 1.06 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      />
                      <div className="absolute inset-0 pointer-events-none" style={{
                        background: "linear-gradient(160deg, transparent 45%, hsl(224 60% 8% / 0.38) 100%)"
                      }} />
                      {/* Category tag */}
                      <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-[9px] tracking-[0.22em] uppercase font-semibold text-white"
                        style={{ background: "hsl(224 60% 14% / 0.78)", backdropFilter: "blur(10px)" }}>
                        {r.category}
                      </span>
                      {/* Open hint */}
                      <motion.div
                        className="absolute bottom-4 right-4 w-9 h-9 rounded-full flex items-center justify-center"
                        style={{ background: "hsl(0 0% 100% / 0.18)", backdropFilter: "blur(12px)", border: "1px solid hsl(0 0% 100% / 0.28)" }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
                        transition={{ duration: 0.2 }}>
                        <ArrowUpRight className="w-4 h-4 text-white" strokeWidth={1.5} />
                      </motion.div>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-7">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.5} style={{ color: "hsl(224 40% 52%)" }} />
                        <p className="text-[9.5px] tracking-[0.28em] uppercase font-medium" style={{ color: "hsl(224 22% 56%)" }}>
                          {r.eyebrow}
                        </p>
                      </div>
                      <h3 className="font-heading text-[1.1rem] font-light leading-snug tracking-tight mb-3" style={{ color: "hsl(224 55% 12%)" }}>
                        {r.title}
                      </h3>
                      <p className="text-[13px] leading-relaxed font-light line-clamp-2" style={{ color: "hsl(224 15% 48%)" }}>
                        {r.description}
                      </p>
                      <div className="mt-5 flex items-center gap-1.5 text-[12px] font-medium" style={{ color: "hsl(224 45% 36%)" }}>
                        <span>Télécharger</span>
                        <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <p className="text-center py-20 text-[14px] font-light" style={{ color: "hsl(224 12% 55%)" }}>
              Aucune ressource dans cette catégorie pour le moment.
            </p>
          )}
        </div>
      </section>

      {/* ── Expanded card overlay ── */}
      <AnimatePresence>
        {openId && activeResource && (
          <>
            {/* Backdrop */}
            <motion.div
              key="vault-backdrop"
              className="fixed inset-0 z-[80] cursor-pointer"
              style={{ background: "hsl(224 55% 6% / 0.70)", backdropFilter: "blur(16px) saturate(0.7)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              onClick={() => !loading && setOpenId(null)}
              aria-label="Fermer"
            />

            {/* Panel */}
            <div className="fixed inset-0 z-[85] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                key={`vault-panel-${openId}`}
                layoutId={`vault-${openId}`}
                className="relative w-full max-w-xl pointer-events-auto rounded-[28px] overflow-hidden"
                style={{
                  background: "hsl(0 0% 100%)",
                  boxShadow: "0 48px 120px -24px hsl(224 60% 8% / 0.50), 0 0 0 1px hsl(224 30% 80% / 0.25)",
                  maxHeight: "92vh",
                  display: "flex",
                  flexDirection: "column",
                }}
                transition={{ ...spring, damping: 28 }}
              >
                {/* Close button */}
                <button
                  type="button"
                  onClick={() => !loading && setOpenId(null)}
                  disabled={loading}
                  aria-label="Fermer"
                  className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-150"
                  style={{ background: "hsl(0 0% 100% / 0.82)", backdropFilter: "blur(10px)", border: "1px solid hsl(224 20% 12% / 0.12)" }}>
                  <X className="w-4 h-4" strokeWidth={1.5} style={{ color: "hsl(224 30% 30%)" }} />
                </button>

                {/* Image header */}
                <div className="relative aspect-[16/9] flex-shrink-0 overflow-hidden">
                  <img
                    src={activeResource.image}
                    alt={activeResource.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 pointer-events-none" style={{
                    background: "linear-gradient(to top, hsl(0 0% 100%) 0%, hsl(0 0% 100% / 0.0) 40%)"
                  }} />
                  {/* Category badge */}
                  <motion.span
                    className="absolute top-5 left-5 px-3.5 py-1.5 rounded-full text-[9px] tracking-[0.22em] uppercase font-semibold text-white"
                    style={{ background: "hsl(224 60% 14% / 0.82)", backdropFilter: "blur(10px)" }}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.4 }}>
                    {activeResource.category}
                  </motion.span>
                </div>

                {/* Scrollable content */}
                <div className="overflow-y-auto flex-1 overscroll-contain">
                  <div className="px-8 pt-7 pb-8">

                    {/* Eyebrow */}
                    <motion.div className="flex items-center gap-2 mb-4"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                      <FileText className="w-3.5 h-3.5" strokeWidth={1.5} style={{ color: "hsl(224 40% 52%)" }} />
                      <p className="text-[9.5px] tracking-[0.28em] uppercase font-medium" style={{ color: "hsl(224 22% 56%)" }}>
                        {activeResource.eyebrow}
                      </p>
                    </motion.div>

                    {/* Title */}
                    <motion.h2
                      className="font-heading text-2xl font-light leading-snug tracking-tight mb-4"
                      style={{ color: "hsl(224 55% 12%)" }}
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.28, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                      {activeResource.title}
                    </motion.h2>

                    {/* Description */}
                    <motion.p
                      className="text-[14px] leading-relaxed font-light mb-7"
                      style={{ color: "hsl(224 15% 42%)" }}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.36, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                      {activeResource.description}
                    </motion.p>

                    {/* Divider */}
                    <motion.div
                      className="h-px mb-7"
                      style={{ background: "hsl(224 20% 90%)", transformOrigin: "left" }}
                      initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
                      transition={{ delay: 0.42, duration: 0.5 }}
                    />

                    {/* Form */}
                    <motion.div
                      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.48, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>

                      <div className="flex items-center gap-2 mb-5">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "hsl(224 60% 12%)" }}>
                          <Mail className="w-2.5 h-2.5 text-white" strokeWidth={2} />
                        </div>
                        <p className="text-[11px] font-medium tracking-wide" style={{ color: "hsl(224 30% 30%)" }}>
                          Recevoir ce document gratuitement
                        </p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-3.5">
                        <div>
                          <label htmlFor="lm-name" className="block text-[10px] font-medium mb-1.5 tracking-[0.18em] uppercase" style={{ color: "hsl(224 20% 52%)" }}>
                            Nom complet
                          </label>
                          <input
                            id="lm-name" type="text" value={form.name}
                            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                            required maxLength={100} disabled={loading} placeholder="Votre nom"
                            className="w-full px-4 py-3 rounded-xl text-[13px] focus:outline-none transition-all duration-200 disabled:opacity-50"
                            style={{
                              background: "hsl(220 25% 97%)",
                              border: "1px solid hsl(224 20% 86%)",
                              color: "hsl(224 55% 12%)",
                            }}
                          />
                        </div>
                        <div>
                          <label htmlFor="lm-email" className="block text-[10px] font-medium mb-1.5 tracking-[0.18em] uppercase" style={{ color: "hsl(224 20% 52%)" }}>
                            Email
                          </label>
                          <input
                            id="lm-email" type="email" value={form.email}
                            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                            required maxLength={255} disabled={loading} placeholder="votre@email.fr"
                            className="w-full px-4 py-3 rounded-xl text-[13px] focus:outline-none transition-all duration-200 disabled:opacity-50"
                            style={{
                              background: "hsl(220 25% 97%)",
                              border: "1px solid hsl(224 20% 86%)",
                              color: "hsl(224 55% 12%)",
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between gap-3 pt-1">
                          <button type="button" onClick={() => setOpenId(null)} disabled={loading}
                            className="px-4 py-2.5 text-[11px] font-medium transition-colors duration-150 disabled:opacity-50"
                            style={{ color: "hsl(224 15% 55%)" }}>
                            Annuler
                          </button>
                          <motion.button
                            type="submit" disabled={loading}
                            whileTap={{ scale: 0.97 }}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[11px] font-medium tracking-wide text-white transition-opacity disabled:opacity-60"
                            style={{
                              background: "hsl(224 60% 18%)",
                              boxShadow: "0 4px 16px -4px hsl(224 60% 18% / 0.40)",
                            }}>
                            <Download className="w-3.5 h-3.5" strokeWidth={2} />
                            {loading ? "Envoi en cours…" : "Recevoir le PDF"}
                          </motion.button>
                        </div>

                        <p className="text-[10px] font-light leading-relaxed" style={{ color: "hsl(224 12% 60%)" }}>
                          En soumettant, vous acceptez de recevoir occasionnellement nos analyses. Désinscription en 1 clic.
                        </p>
                      </form>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
