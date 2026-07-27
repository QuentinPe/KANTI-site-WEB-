import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { z } from "zod";
import { toast } from "sonner";
import {
  Download, X, FileText, CheckCircle2, Shield,
  Mail, Lock, ChevronDown, Phone,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { getRessources, getDownloadUrl } from "@/lib/ressourcesService";
import { getSiteSettingsMap } from "@/lib/siteSettingsService";
import { supabase } from "@/lib/supabase";
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

// ── Types & constants ─────────────────────────────────────────────────────────

type Category = "Tous" | "Fiscalité" | "Transmission" | "Dirigeants" | "Investir" | "Retraite" | "Immobilier" | "International";

const CATEGORIES: Category[] = ["Tous", "Fiscalité", "Transmission", "Dirigeants", "Investir", "Retraite", "Immobilier", "International"];

const CAT_COLOR: Record<string, string> = {
  "Fiscalité":     "hsl(218 58% 18%)",
  "Transmission":  "hsl(222 55% 14%)",
  "Dirigeants":    "hsl(252 42% 28%)",
  "Investir":      "hsl(162 44% 20%)",
  "Retraite":      "hsl(28 52% 26%)",
  "Immobilier":    "hsl(192 46% 20%)",
  "International": "hsl(36 50% 24%)",
};

const CATEGORY_IMAGES: Record<string, string> = {
  "Fiscalité":     imgDefisc,
  "Transmission":  imgTransmission,
  "Dirigeants":    imgCession,
  "Investir":      imgScpi,
  "Retraite":      imgRetraite,
  "Immobilier":    imgImmobilier,
  "International": imgExpat,
};

const STATUTS = [
  "Particulier",
  "Chef d'entreprise / Dirigeant",
  "Profession libérale",
  "Salarié cadre supérieur",
  "Retraité",
  "Expatrié",
  "Investisseur immobilier",
];

const TRUST_BADGES = [
  { label: "Guides mis à jour", sub: "Régulièrement" },
  { label: "Cabinet indépendant", sub: "Conseil objectif" },
  { label: "Réponse sous 24h", sub: "Par nos experts" },
  { label: "+12 000 téléchargements", sub: "Déjà réalisés" },
];

const HOW_IT_WORKS = [
  { n: "1", title: "Choisissez votre ressource", desc: "Parcourez nos guides experts et sélectionnez celui qui vous intéresse." },
  { n: "2", title: "Renseignez vos coordonnées", desc: "Complétez le formulaire sécurisé pour accéder au guide PDF." },
  { n: "3", title: "Recevez votre PDF immédiatement", desc: "Le lien de téléchargement vous est envoyé par email sans délai." },
  { n: "4", title: "Échangez avec nos experts", desc: "Besoin d'un conseil personnalisé ? Nos experts sont à votre écoute sous 24h." },
];

const FEATURED_ID = "transmission-checklist";
const FEATURED_BULLETS = [
  "Comprendre les règles clés de la transmission",
  "Optimiser la fiscalité et réduire les droits",
  "Protéger vos proches et sécuriser l'avenir",
  "Anticiper les changements législatifs",
];
const FEATURED_CHECKLIST = [
  "28 pages d'expertise",
  "Exemples concrets",
  "Checklists & schémas",
  "À jour des dernières lois",
];

interface DisplayResource {
  id: string;
  category: string;
  eyebrow: string;
  title: string;
  description: string;
  pages: number | null;
  storagePath: string;
  image: string;
}

const RESOURCES_FALLBACK: DisplayResource[] = [
  { id: "defiscalisation-2026",   category: "Fiscalité",     eyebrow: "Fiscalité · 24 pages",     pages: 24, title: "10 leviers de défiscalisation 2026",       description: "Panorama actualisé des dispositifs : PER, Girardin, Denormandie, FCPI/FIP, déficits fonciers, donation-cession, Dutreil. Avantages, limites, profils éligibles.",                                         storagePath: "/resources/kanti-defiscalisation-2026.pdf",    image: imgDefisc },
  { id: "transmission-checklist", category: "Transmission",  eyebrow: "Transmission · 28 pages",   pages: 28, title: "Transmettre son patrimoine en 2026",         description: "Méthode pas-à-pas : inventaire, donation, démembrement, assurance-vie, holding familiale. Les questions à se poser avant 50, 60 et 70 ans.",                                                           storagePath: "/resources/kanti-transmission-checklist.pdf",  image: imgTransmission },
  { id: "investir-intelligence",  category: "Investir",      eyebrow: "Investir · 32 pages",       pages: 32, title: "Investir avec intelligence",                 description: "Allocation d'actifs, SCPI, ETF, assurance-vie, compte-titres. Construire un portefeuille équilibré adapté à vos objectifs.",                                                                                storagePath: "/resources/kanti-investir-intelligence.pdf",   image: imgScpi },
  { id: "retraite-cadres",        category: "Retraite",      eyebrow: "Retraite · 20 pages",       pages: 20, title: "Préparer sa retraite sereine",              description: "Reconstituer 70 % de ses revenus à la retraite : PER individuel, PER d'entreprise, Madelin, capitalisation, immobilier locatif. Stratégies par tranche d'âge.",                                            storagePath: "/resources/kanti-retraite-cadres.pdf",         image: imgRetraite },
  { id: "dirigeant-cession",      category: "Dirigeants",    eyebrow: "Dirigeants · 26 pages",     pages: 26, title: "Optimiser son patrimoine de dirigeant",      description: "Apport-cession, Dutreil, OBO, holding patrimoniale. Comment structurer en amont pour préserver le fruit de toute une vie d'entreprise.",                                                                      storagePath: "/resources/kanti-dirigeant-cession.pdf",       image: imgCession },
  { id: "immobilier-arbitrage",   category: "Immobilier",    eyebrow: "Immobilier · 18 pages",     pages: 18, title: "Immobilier patrimonial : arbitrer en 2026",  description: "Faut-il vendre, conserver, démembrer ? Analyse comparative SCI, SCPI, nue-propriété, LMNP, et impact de la fiscalité 2026.",                                                                               storagePath: "/resources/kanti-immobilier-arbitrage.pdf",    image: imgImmobilier },
  { id: "assurance-vie-2026",     category: "Investir",      eyebrow: "Investir · 10 pages",       pages: 10, title: "Assurance-vie : les arbitrages clés 2026",   description: "Fonds euros, unités de compte, gestion pilotée, démembrement de clause bénéficiaire. Comment tirer le meilleur parti du contrat préféré des Français.",                                                 storagePath: "/resources/kanti-assurance-vie-2026.pdf",      image: imgAssuranceVie },
  { id: "scpi-selection",         category: "Investir",      eyebrow: "Investir · 22 pages",       pages: 22, title: "SCPI : sélectionner sans se tromper",        description: "Notre grille d'analyse en 12 critères : TOF, RAN, capitalisation, géographie, secteurs. Les 8 SCPI que nous suivons en 2026 et celles à éviter.",                                                          storagePath: "/resources/kanti-scpi-selection.pdf",          image: imgScpi },
  { id: "expatriation-fiscale",   category: "International", eyebrow: "International · 28 pages",  pages: 28, title: "Expatriation : anticiper sa fiscalité",      description: "Exit tax, conventions fiscales, comptes à l'étranger, IFI, retour en France. Le mode d'emploi pour les Français qui s'installent ou reviennent.",                                                             storagePath: "/resources/kanti-expatriation-fiscale.pdf",    image: imgExpat },
  { id: "ifi-optimisation",       category: "Fiscalité",     eyebrow: "Fiscalité · 8 pages",       pages:  8, title: "IFI 2026 : les leviers d'optimisation",       description: "Démembrement, dette déductible, nue-propriété de SCPI, foncières non cotées. Réduire son IFI sans dégrader son patrimoine.",                                                                               storagePath: "/resources/kanti-ifi-optimisation.pdf",        image: imgIfi },
  { id: "investissement-isr",     category: "Investir",      eyebrow: "Investir · 16 pages",       pages: 16, title: "Investissement responsable & ISR",           description: "Labels ISR, Greenfin, Finansol : décrypter les promesses. Comment construire un portefeuille à impact sans sacrifier la performance.",                                                                       storagePath: "/resources/kanti-investissement-responsable.pdf", image: imgIsr },
];

// ── Form schemas ──────────────────────────────────────────────────────────────

const heroSchema = z.object({
  prenom:    z.string().trim().min(1, "Prénom requis"),
  nom:       z.string().trim().min(1, "Nom requis"),
  email:     z.string().email("Email invalide"),
  telephone: z.string().trim().min(8, "Téléphone invalide"),
  statut:    z.string().min(1, "Sélectionnez votre statut"),
});

const downloadSchema = z.object({
  contact: z.string().trim().min(2, "Indiquez votre téléphone ou adresse postale").max(200),
});

// ── Style constants ───────────────────────────────────────────────────────────

const CARD_BG = "hsl(0 0% 100%)";
const CARD_BORDER = "1px solid hsl(224 20% 12% / 0.08)";

const spring = { type: "spring" as const, stiffness: 360, damping: 32, mass: 0.9 };

const INPUT_CLASS = "w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-colors duration-150";
const INPUT_STYLE: React.CSSProperties = {
  background: "hsl(220 25% 97%)",
  border: "1px solid hsl(224 20% 84%)",
  color: "hsl(224 55% 12%)",
};

// ── Sub-components ────────────────────────────────────────────────────────────

function BookCover({
  title, category, pages, className = "", style = {},
}: {
  title: string; category: string; pages?: number | null;
  className?: string; style?: React.CSSProperties;
}) {
  const color = CAT_COLOR[category] ?? "hsl(224 60% 15%)";
  return (
    <div
      className={`relative flex flex-col justify-between overflow-hidden select-none ${className}`}
      style={{
        background: `linear-gradient(145deg, ${color} 0%, hsl(224 60% 7%) 100%)`,
        borderRadius: 6,
        padding: "14px 12px 12px",
        boxShadow: "4px 4px 0 rgba(0,0,0,0.22), 8px 8px 0 rgba(0,0,0,0.09)",
        ...style,
      }}
    >
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(135deg, transparent 55%, hsl(38 80% 55% / 0.16) 55%, hsl(38 80% 55% / 0.07) 75%, transparent 75%)",
      }} />
      <div>
        <p style={{ color: "hsl(0 0% 100% / 0.42)", fontSize: 7, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 600, marginBottom: 7 }}>
          {category}
        </p>
        <p style={{ color: "white", fontSize: 11, fontWeight: 300, lineHeight: 1.35 }}>{title}</p>
      </div>
      <div className="flex items-end justify-between mt-3">
        <img src="/logo-white.png" alt="KANTI" style={{ height: 10, opacity: 0.70, objectFit: "contain", objectPosition: "left" }} />
        {pages != null && pages > 0 && (
          <p style={{ color: "hsl(0 0% 100% / 0.32)", fontSize: 7 }}>{pages}p</p>
        )}
      </div>
    </div>
  );
}

function FormLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[10px] font-medium mb-1.5 tracking-wide" style={{ color: "hsl(224 25% 46%)" }}>
      {children}
    </label>
  );
}

function ResourceCard({
  resource, heroSubmitted, onOpen, index,
}: {
  resource: DisplayResource; heroSubmitted: boolean;
  onOpen: () => void; index: number;
}) {
  const catColor = CAT_COLOR[resource.category] ?? "hsl(224 60% 15%)";
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ ...spring, delay: (index % 8) * 0.04 }}
      className="cursor-pointer rounded-2xl overflow-hidden flex flex-col"
      style={{ background: CARD_BG, border: CARD_BORDER, boxShadow: "0 2px 12px -4px hsl(224 60% 12% / 0.07)" }}
      onClick={onOpen}
      whileHover={{ y: -5, boxShadow: "0 20px 48px -12px hsl(224 60% 12% / 0.18)", transition: { duration: 0.22 } }}
      aria-label={`Télécharger : ${resource.title}`}
    >
      {/* Book cover image */}
      <BookCover
        title={resource.title}
        category={resource.category}
        pages={resource.pages}
        style={{ borderRadius: 0, width: "100%", aspectRatio: "16/9" }}
      />

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <span
          className="inline-block self-start px-2.5 py-0.5 rounded-full text-[9px] font-semibold tracking-[0.2em] uppercase mb-3"
          style={{ background: catColor + "1a", color: catColor }}
        >
          {resource.category}
        </span>
        <h3 className="font-heading text-[14px] font-light leading-snug tracking-tight mb-2" style={{ color: "hsl(224 55% 12%)" }}>
          {resource.title}
        </h3>
        <p className="text-[12px] font-light leading-relaxed line-clamp-2 flex-1 mb-4" style={{ color: "hsl(224 15% 50%)" }}>
          {resource.description}
        </p>
        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "hsl(224 20% 12% / 0.07)" }}>
          <p className="flex items-center gap-1.5 text-[10px] font-light" style={{ color: "hsl(224 15% 60%)" }}>
            {resource.pages != null && resource.pages > 0 && <><FileText className="w-3 h-3" strokeWidth={1.5} />{resource.pages} pages · </>}
            <Lock className="w-2.5 h-2.5" strokeWidth={2} style={{ color: heroSubmitted ? "hsl(142 52% 42%)" : undefined }} />
            {heroSubmitted ? "Accès libre" : "Accès après formulaire"}
          </p>
          <span className="flex items-center gap-1 text-[11px] font-medium" style={{ color: "hsl(224 45% 36%)" }}>
            Télécharger <Download className="w-3 h-3" strokeWidth={1.5} />
          </span>
        </div>
      </div>
    </motion.article>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function RessourcesPage() {
  useScrollReveal();

  // Hero form state
  const [heroForm, setHeroForm] = useState({ prenom: "", nom: "", email: "", telephone: "", statut: "" });
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [heroLoading, setHeroLoading] = useState(false);
  const [heroSubmitted, setHeroSubmitted] = useState(false);

  // Card modal state
  const [openId, setOpenId] = useState<string | null>(null);
  const [form, setForm] = useState({ contact: "" });
  const [loading, setLoading] = useState(false);

  // Filters
  const [activeCategory, setActiveCategory] = useState<Category>("Tous");
  const [searchQuery, setSearchQuery] = useState("");

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  const { data: dbRessources } = useQuery({ queryKey: ["ressources"], queryFn: getRessources });
  const { data: settingsMap = {} } = useQuery({
    queryKey: ["site-settings-map"],
    queryFn: getSiteSettingsMap,
    staleTime: 60_000,
  });

  const resources: DisplayResource[] = useMemo(() => {
    if (!dbRessources || dbRessources.length === 0) return RESOURCES_FALLBACK;
    return dbRessources.map((r) => ({
      id: r.id,
      category: r.category,
      eyebrow: r.category,
      pages: r.pages,
      title: r.title,
      description: r.description,
      storagePath: r.storage_path,
      image: CATEGORY_IMAGES[r.category] ?? imgDefisc,
    }));
  }, [dbRessources]);

  const featuredResource = resources.find((r) => r.id === (settingsMap["featured_resource_id"] ?? FEATURED_ID)) ?? resources[0];

  const featuredBullets: string[] = (() => {
    try { return settingsMap["featured_bullets"] ? JSON.parse(settingsMap["featured_bullets"]) : FEATURED_BULLETS; } catch { return FEATURED_BULLETS; }
  })();
  const featuredChecklist: string[] = (() => {
    try { return settingsMap["featured_checklist"] ? JSON.parse(settingsMap["featured_checklist"]) : FEATURED_CHECKLIST; } catch { return FEATURED_CHECKLIST; }
  })();

  const filtered = useMemo(() => {
    let list = activeCategory === "Tous" ? resources : resources.filter((r) => r.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((r) => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q));
    }
    return list;
  }, [activeCategory, resources, searchQuery]);

  const activeResource = resources.find((r) => r.id === openId);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && !loading) setOpenId(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [loading]);

  useEffect(() => { setForm({ contact: "" }); }, [openId]);

  // Utility: trigger file download
  const triggerDownload = async (resource: DisplayResource) => {
    const url = await getDownloadUrl(resource.storagePath);
    const a = document.createElement("a");
    a.href = url; a.download = resource.id + ".pdf"; a.target = "_blank"; a.rel = "noopener noreferrer";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  // Hero form submit
  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacyAccepted) { toast.error("Acceptez la politique de confidentialité pour continuer."); return; }
    const parsed = heroSchema.safeParse(heroForm);
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setHeroLoading(true);
    try {
      // Capture lead: insert to Supabase + notify Telegram via contact API
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: `${parsed.data.prenom} ${parsed.data.nom}`,
          email: parsed.data.email,
          telephone: parsed.data.telephone || "",
          sujet: `Ressource · ${parsed.data.statut}`,
        }),
      }).catch(() => {});
      await triggerDownload(featuredResource);
      setHeroSubmitted(true);
      toast.success("Guide en cours de téléchargement ! Vous avez maintenant accès à toutes les ressources.");
    } catch {
      toast.error("Erreur lors de l'envoi. Veuillez réessayer.");
    }
    setHeroLoading(false);
  };

  // Card modal submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = downloadSchema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    if (!activeResource) return;
    setLoading(true);
    try {
      await triggerDownload(activeResource);
      toast.success("Téléchargement en cours…");
      setOpenId(null);
    } catch {
      toast.error("Impossible de télécharger. Veuillez réessayer.");
    }
    setLoading(false);
  };

  // Card click handler
  const handleCardOpen = (resource: DisplayResource) => {
    if (heroSubmitted) {
      triggerDownload(resource).catch(() => toast.error("Erreur de téléchargement"));
    } else {
      setOpenId(resource.id);
    }
  };

  return (
    <>
      <Seo
        title="Ressources patrimoniales, guides et études KANTI"
        description="Guides PDF gratuits : défiscalisation 2026, transmission, cession d'entreprise, immobilier patrimonial. Téléchargez les analyses du cabinet KANTI."
      />
      <Header />

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative overflow-hidden" style={{ minHeight: "100vh" }}>
        {/* Parallax background */}
        <motion.div className="absolute inset-0 will-change-transform" style={{ y: imageY, scale: 1.12 }}>
          <img src={heroBg} alt="" aria-hidden className="w-full h-full object-cover object-top" fetchPriority="high" />
        </motion.div>
        {/* Gradient — left text readable, right fades to image */}
        <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
          background: "linear-gradient(105deg, hsl(0 0% 100% / 0.97) 0%, hsl(0 0% 100% / 0.93) 28%, hsl(0 0% 100% / 0.70) 50%, hsl(0 0% 100% / 0.20) 70%, transparent 86%)"
        }} />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-24 pointer-events-none" style={{ background: "linear-gradient(to top, white 0%, transparent 100%)" }} />

        {/* Grid content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full min-h-screen flex items-center py-28 lg:py-32">
          <div className="w-full grid lg:grid-cols-12 gap-10 items-center">

            {/* Left: editorial */}
            <div className="lg:col-span-5">
              <motion.p
                className="text-[10px] tracking-[0.36em] uppercase font-semibold mb-6"
                style={{ color: "hsl(224 55% 30%)" }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }}>
                Des guides experts pour éclairer vos décisions
              </motion.p>
              <motion.h1
                className="font-heading font-light leading-[1.04] tracking-tight mb-5"
                style={{ fontSize: "clamp(2.2rem, 4.2vw, 3.4rem)", color: "hsl(224 60% 10%)" }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
                Ressources patrimoniales<br />
                <span className="italic" style={{ color: "hsl(224 45% 32%)" }}>à forte valeur ajoutée</span>
              </motion.h1>
              <motion.p
                className="text-[15px] font-light leading-relaxed mb-9"
                style={{ color: "hsl(224 25% 35%)" }}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}>
                Accédez à nos guides PDF rédigés par nos experts.<br />
                Offerts en échange de vos coordonnées.
              </motion.p>
              {/* Trust badges */}
              <motion.div
                className="grid grid-cols-2 gap-x-6 gap-y-4"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.48, ease: [0.22, 1, 0.36, 1] }}>
                {TRUST_BADGES.map((b) => (
                  <div key={b.label} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "hsl(218 55% 42%)" }} strokeWidth={1.5} />
                    <div>
                      <p className="text-[12px] font-medium" style={{ color: "hsl(224 50% 18%)" }}>{b.label}</p>
                      <p className="text-[11px] font-light" style={{ color: "hsl(224 15% 52%)" }}>{b.sub}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Center: book stack (desktop only) */}
            <div className="hidden lg:flex lg:col-span-3 items-center justify-center">
              <div className="relative" style={{ width: 200, height: 288 }}>
                <motion.div
                  style={{ position: "absolute", left: 6, top: 30, width: 88, height: 125, rotate: -9, x: -6, zIndex: 1 }}
                  whileHover={{ rotate: -14, x: -18, y: -8, zIndex: 10, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } }}
                >
                  <BookCover title="Fiscalité & Optimisation" category="Fiscalité" pages={24} style={{ width: "100%", height: "100%" }} />
                </motion.div>
                <motion.div
                  style={{ position: "absolute", left: "50%", top: 0, width: 108, height: 154, x: "-50%", rotate: -1.5, zIndex: 3 }}
                  whileHover={{ rotate: 0, y: -12, zIndex: 10, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } }}
                >
                  <BookCover title="Transmission Patrimoniale" category="Transmission" pages={28} style={{ width: "100%", height: "100%" }} />
                </motion.div>
                <motion.div
                  style={{ position: "absolute", right: 6, top: 24, width: 86, height: 122, rotate: 8, x: 8, zIndex: 2 }}
                  whileHover={{ rotate: 14, x: 18, y: -8, zIndex: 10, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } }}
                >
                  <BookCover title="Patrimoine du Dirigeant" category="Dirigeants" pages={26} style={{ width: "100%", height: "100%" }} />
                </motion.div>
              </div>
            </div>

            {/* Right: lead form */}
            <motion.div
              className="lg:col-span-4"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}>
              <div className="rounded-3xl p-7" style={{
                background: "white",
                border: "1px solid hsl(224 20% 12% / 0.09)",
                boxShadow: "0 24px 64px -16px hsl(224 60% 12% / 0.14), 0 0 0 1px hsl(224 20% 86% / 0.35)",
              }}>
                {heroSubmitted ? (
                  <div className="py-6 flex flex-col items-center text-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "hsl(142 52% 96%)" }}>
                      <CheckCircle2 className="w-6 h-6" style={{ color: "hsl(142 52% 36%)" }} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[15px] font-medium mb-2" style={{ color: "hsl(224 55% 12%)" }}>Accès débloqué !</p>
                      <p className="text-[13px] font-light leading-relaxed" style={{ color: "hsl(224 15% 50%)" }}>
                        Votre guide est en cours de téléchargement. Cliquez sur n'importe quelle ressource ci-dessous pour accéder directement.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "hsl(224 60% 12%)" }}>
                        <FileText className="w-4 h-4 text-white" strokeWidth={1.5} />
                      </div>
                      <p className="text-[14px] font-medium" style={{ color: "hsl(224 55% 12%)" }}>Débloquez toutes les ressources</p>
                    </div>

                    <form onSubmit={handleHeroSubmit} className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <FormLabel>Prénom*</FormLabel>
                          <input
                            type="text" value={heroForm.prenom} required disabled={heroLoading}
                            onChange={(e) => setHeroForm((p) => ({ ...p, prenom: e.target.value }))}
                            placeholder="Jean" className={INPUT_CLASS} style={INPUT_STYLE}
                          />
                        </div>
                        <div>
                          <FormLabel>Nom*</FormLabel>
                          <input
                            type="text" value={heroForm.nom} required disabled={heroLoading}
                            onChange={(e) => setHeroForm((p) => ({ ...p, nom: e.target.value }))}
                            placeholder="Dupont" className={INPUT_CLASS} style={INPUT_STYLE}
                          />
                        </div>
                      </div>

                      <div>
                        <FormLabel>Email professionnel*</FormLabel>
                        <input
                          type="email" value={heroForm.email} required disabled={heroLoading}
                          onChange={(e) => setHeroForm((p) => ({ ...p, email: e.target.value }))}
                          placeholder="jean.dupont@entreprise.fr" className={INPUT_CLASS} style={INPUT_STYLE}
                        />
                      </div>

                      <div>
                        <FormLabel>Téléphone*</FormLabel>
                        <input
                          type="tel" value={heroForm.telephone} required disabled={heroLoading}
                          onChange={(e) => setHeroForm((p) => ({ ...p, telephone: e.target.value }))}
                          placeholder="06 12 34 56 78" className={INPUT_CLASS} style={INPUT_STYLE}
                        />
                      </div>

                      <div>
                        <FormLabel>Votre statut / projet*</FormLabel>
                        <div className="relative">
                          <select
                            value={heroForm.statut} required disabled={heroLoading}
                            onChange={(e) => setHeroForm((p) => ({ ...p, statut: e.target.value }))}
                            className={INPUT_CLASS}
                            style={{ ...INPUT_STYLE, appearance: "none", paddingRight: 36, cursor: "pointer" }}
                          >
                            <option value="">Votre statut / projet</option>
                            {STATUTS.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "hsl(224 20% 55%)" }} strokeWidth={1.5} />
                        </div>
                      </div>

                      <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                        <input
                          type="checkbox" checked={privacyAccepted}
                          onChange={(e) => setPrivacyAccepted(e.target.checked)}
                          className="mt-0.5 flex-shrink-0"
                          style={{ accentColor: "hsl(224 60% 18%)" }}
                        />
                        <p className="text-[11px] font-light leading-relaxed" style={{ color: "hsl(224 15% 50%)" }}>
                          J'accepte la{" "}
                          <Link to="/politique-de-confidentialite" className="underline" style={{ color: "hsl(218 55% 42%)" }}>
                            politique de confidentialité
                          </Link>
                          *
                        </p>
                      </label>

                      <button
                        type="submit" disabled={heroLoading || !privacyAccepted}
                        className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-[13px] font-medium transition-all duration-200 disabled:opacity-50"
                        style={{ background: "hsl(224 60% 18%)", color: "white", boxShadow: "0 8px 24px -8px hsl(224 60% 18% / 0.42)" }}>
                        <Download className="w-4 h-4" strokeWidth={1.5} />
                        {heroLoading ? "Envoi en cours…" : "Recevoir le guide PDF"}
                      </button>

                      <p className="text-center text-[11px] font-light" style={{ color: "hsl(224 15% 60%)" }}>
                        <Mail className="w-3 h-3 inline mr-1" strokeWidth={1.5} />
                        Envoi immédiat par email
                      </p>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FILTER BAR (sticky) ────────────────────────────────────────────────── */}
      <div
        className="sticky z-40 backdrop-blur-2xl relative"
        style={{
          top: 72,
          background: "hsl(0 0% 100% / 0.52)",
          borderBottom: "1px solid hsl(0 0% 100% / 0.55)",
          boxShadow: "0 8px 32px -8px hsl(224 30% 18% / 0.10), inset 0 -1px 0 hsl(224 20% 12% / 0.05)",
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
        } as React.CSSProperties}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-3 flex items-center gap-2 flex-wrap">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat;
            return (
              <motion.button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                whileHover={active ? {} : { y: -1, scale: 1.02, backgroundColor: "hsl(218 75% 95%)", color: "hsl(218 65% 46%)", boxShadow: "0 0 0 1px hsl(218 50% 75%)" }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="px-3.5 py-1.5 rounded-full text-[11px] font-medium tracking-wide"
                style={{
                  background: active ? "hsl(224 55% 18%)" : "transparent",
                  color: active ? "white" : "hsl(224 18% 44%)",
                  border: `1px solid ${active ? "hsl(224 55% 22%)" : "hsl(224 20% 12% / 0.12)"}`,
                  boxShadow: active ? "0 2px 8px -2px hsl(224 60% 20% / 0.28)" : undefined,
                  transition: "background 0.18s, color 0.18s, border-color 0.18s, box-shadow 0.18s",
                }}
              >
                {cat}
              </motion.button>
            );
          })}
          {/* Search */}
          <div className="ml-auto relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} style={{ color: "hsl(224 20% 60%)" }}>
              <circle cx={11} cy={11} r={8} /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text" placeholder="Rechercher un guide…" value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 rounded-full text-[12px] focus:outline-none transition-all duration-150"
              style={{ background: "hsl(220 25% 96%)", border: "1px solid hsl(224 20% 12% / 0.10)", color: "hsl(224 50% 18%)", width: 190 }}
            />
          </div>
        </div>
        <div
          aria-hidden
          className="absolute top-full left-0 right-0 pointer-events-none"
          style={{
            height: "28px",
            background: "linear-gradient(to bottom, hsl(0 0% 100% / 0.28) 0%, transparent 100%)",
            backdropFilter: "blur(14px) saturate(140%)",
            WebkitBackdropFilter: "blur(14px) saturate(140%)",
            maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
          } as React.CSSProperties}
        />
      </div>

      {/* ── FEATURED RESOURCE ─────────────────────────────────────────────────── */}
      {featuredResource && (
        <section className="py-16 border-t border-b" style={{ background: "hsl(220 25% 97%)", borderColor: "hsl(224 20% 12% / 0.07)" }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div
              className="rounded-3xl overflow-hidden grid lg:grid-cols-12 gap-0"
              style={{
                background: "white",
                border: "1px solid hsl(224 20% 12% / 0.08)",
                boxShadow: "0 8px 40px -12px hsl(224 60% 12% / 0.10)",
              }}
            >
              {/* Left: book cover on navy panel */}
              <div
                className="lg:col-span-4 flex items-center justify-center p-12"
                style={{ background: "hsl(222 55% 12%)" }}
              >
                <div className="relative">
                  <BookCover
                    title={featuredResource.title}
                    category={featuredResource.category}
                    pages={featuredResource.pages}
                    style={{ width: 160, height: 224 }}
                  />
                  {/* Glow */}
                  <div aria-hidden className="absolute -inset-6 pointer-events-none" style={{
                    background: "radial-gradient(ellipse 80% 60% at 50% 50%, hsl(38 80% 50% / 0.20) 0%, transparent 70%)",
                  }} />
                </div>
              </div>

              {/* Right: editorial content */}
              <div className="lg:col-span-8 p-10 lg:p-12 flex flex-col justify-between gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <span
                      className="px-3 py-1 rounded-full text-[9px] font-semibold tracking-[0.28em] uppercase"
                      style={{ background: "hsl(38 80% 50% / 0.12)", color: "hsl(38 70% 36%)" }}>
                      Ressource mise en avant
                    </span>
                    <span
                      className="px-3 py-1 rounded-full text-[9px] font-semibold tracking-[0.22em] uppercase"
                      style={{ background: `${CAT_COLOR[featuredResource.category] ?? "hsl(224 60% 15%)"}15`, color: CAT_COLOR[featuredResource.category] ?? "hsl(224 60% 15%)" }}>
                      {featuredResource.category}
                    </span>
                  </div>
                  <h2 className="font-heading text-2xl lg:text-3xl font-light leading-tight tracking-tight mb-2" style={{ color: "hsl(224 55% 12%)" }}>
                    {featuredResource.title}
                  </h2>
                  <p className="text-[14px] font-light italic mb-7" style={{ color: "hsl(224 15% 52%)" }}>
                    {featuredResource.description.split(".")[0]}.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <ul className="space-y-2.5">
                      {featuredBullets.map((b) => (
                        <li key={b} className="flex items-start gap-2.5 text-[13px] font-light" style={{ color: "hsl(224 35% 28%)" }}>
                          <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: "hsl(218 55% 42%)" }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          {b}
                        </li>
                      ))}
                    </ul>
                    <ul className="space-y-2">
                      {featuredChecklist.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-[12px]" style={{ color: "hsl(224 20% 48%)" }}>
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.5} style={{ color: "hsl(142 52% 42%)" }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-wrap pt-2 border-t" style={{ borderColor: "hsl(224 20% 12% / 0.07)" }}>
                  <button
                    type="button"
                    onClick={() => handleCardOpen(featuredResource)}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-[13px] font-medium transition-all duration-200"
                    style={{ background: "hsl(224 60% 18%)", color: "white", boxShadow: "0 8px 24px -8px hsl(224 60% 18% / 0.38)" }}>
                    <Download className="w-4 h-4" strokeWidth={1.5} />
                    Recevoir le guide PDF
                  </button>
                  <p className="text-[12px] font-light flex items-center gap-1.5" style={{ color: "hsl(224 15% 55%)" }}>
                    <Mail className="w-3.5 h-3.5" strokeWidth={1.5} />
                    Téléchargement immédiat
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── RESOURCE GRID ─────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {filtered.length === 0 ? (
            <p className="text-center py-20 text-[14px] font-light" style={{ color: "hsl(224 12% 55%)" }}>
              Aucune ressource dans cette catégorie pour le moment.
            </p>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence mode="popLayout">
                {filtered.map((r, i) => (
                  <ResourceCard
                    key={r.id}
                    resource={r}
                    heroSubmitted={heroSubmitted}
                    onOpen={() => handleCardOpen(r)}
                    index={i}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────────── */}
      <section className="py-16 border-t" style={{ background: "hsl(220 25% 97%)", borderColor: "hsl(224 20% 12% / 0.07)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <p className="text-center text-[9.5px] tracking-[0.42em] uppercase font-semibold mb-14" style={{ color: "hsl(224 30% 50%)" }}>
            Comment ça fonctionne ?
          </p>
          <div className="relative">
            {/* Connecting line */}
            <div aria-hidden className="absolute top-5 left-[12.5%] right-[12.5%] h-px hidden lg:block" style={{ background: "hsl(224 20% 84%)" }} />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {HOW_IT_WORKS.map((step) => (
                <div key={step.n} className="flex flex-col items-center text-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-medium mb-4"
                    style={{ background: "hsl(224 60% 18%)", color: "white", boxShadow: "0 0 0 6px hsl(224 60% 18% / 0.10)" }}>
                    {step.n}
                  </div>
                  <p className="text-[13px] font-medium mb-1.5" style={{ color: "hsl(224 50% 18%)" }}>{step.title}</p>
                  <p className="text-[12px] font-light leading-relaxed" style={{ color: "hsl(224 15% 52%)" }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white border-t" style={{ borderColor: "hsl(224 20% 12% / 0.06)" }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-heading text-3xl lg:text-4xl font-light tracking-tight mb-3" style={{ color: "hsl(224 55% 12%)" }}>
            Un projet patrimonial ?{" "}
            <span className="italic" style={{ color: "hsl(224 40% 38%)" }}>Parlons-en.</span>
          </h2>
          <p className="text-[14px] font-light mb-8" style={{ color: "hsl(224 15% 50%)" }}>
            Nos experts vous accompagnent pour construire une stratégie sur mesure.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap mb-10">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-[13px] font-medium transition-all duration-200"
              style={{ background: "hsl(224 60% 18%)", color: "white", boxShadow: "0 8px 24px -8px hsl(224 60% 18% / 0.38)" }}>
              Prendre rendez-vous
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-[13px] font-medium transition-all duration-200"
              style={{ background: "white", color: "hsl(224 45% 28%)", border: "1px solid hsl(224 20% 84%)" }}>
              Nous contacter
            </Link>
          </div>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {[
              { icon: Shield,        text: "Données sécurisées & confidentielles" },
              { icon: CheckCircle2,  text: "Conformité RGPD" },
              { icon: Mail,          text: "Aucun spam, désinscription en 1 clic" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 text-[11px] font-light" style={{ color: "hsl(224 15% 55%)" }}>
                <Icon className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.5} />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CARD MODAL ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {openId && activeResource && !heroSubmitted && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-[80] cursor-pointer"
              style={{ background: "hsl(224 55% 6% / 0.72)", backdropFilter: "blur(16px) saturate(0.7)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={() => !loading && setOpenId(null)}
            />
            <div className="fixed inset-0 z-[85] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                key={`panel-${openId}`}
                className="relative w-full max-w-lg pointer-events-auto rounded-[28px] overflow-hidden flex flex-col"
                style={{
                  background: "white",
                  boxShadow: "0 48px 120px -24px hsl(224 60% 8% / 0.48), 0 0 0 1px hsl(224 30% 80% / 0.20)",
                  maxHeight: "90vh",
                }}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>

                {/* Close */}
                <button type="button" onClick={() => !loading && setOpenId(null)} disabled={loading} aria-label="Fermer"
                  className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: "hsl(0 0% 100% / 0.85)", backdropFilter: "blur(10px)", border: "1px solid hsl(224 20% 12% / 0.11)" }}>
                  <X className="w-4 h-4" strokeWidth={1.5} style={{ color: "hsl(224 30% 30%)" }} />
                </button>

                {/* Book cover header */}
                <div className="relative flex-shrink-0 overflow-hidden" style={{ aspectRatio: "16/7" }}>
                  <BookCover
                    title={activeResource.title}
                    category={activeResource.category}
                    pages={activeResource.pages}
                    style={{ width: "100%", height: "100%", borderRadius: 0 }}
                  />
                </div>

                {/* Scrollable content */}
                <div className="overflow-y-auto flex-1 overscroll-contain" data-lenis-prevent
                  onWheel={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()}>
                  <div className="px-8 pt-7 pb-8">
                    <p className="text-[9.5px] tracking-[0.28em] uppercase font-medium mb-2" style={{ color: "hsl(224 22% 56%)" }}>
                      {activeResource.eyebrow}{activeResource.pages != null && activeResource.pages > 0 ? ` · ${activeResource.pages} pages` : ""}
                    </p>
                    <h2 className="font-heading text-2xl font-light leading-snug tracking-tight mb-3" style={{ color: "hsl(224 55% 12%)" }}>
                      {activeResource.title}
                    </h2>
                    <p className="text-[14px] leading-relaxed font-light mb-6" style={{ color: "hsl(224 15% 42%)" }}>
                      {activeResource.description}
                    </p>

                    <div className="h-px mb-6" style={{ background: "hsl(224 20% 90%)" }} />

                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "hsl(224 60% 12%)" }}>
                        <Download className="w-2.5 h-2.5 text-white" strokeWidth={2} />
                      </div>
                      <p className="text-[11px] font-medium tracking-wide" style={{ color: "hsl(224 30% 30%)" }}>
                        Téléchargement gratuit et immédiat
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3.5">
                      <div>
                        <label htmlFor="modal-contact" className="block text-[10px] font-medium mb-1.5 tracking-[0.18em] uppercase" style={{ color: "hsl(224 20% 52%)" }}>
                          Téléphone ou adresse postale
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" strokeWidth={1.5} style={{ color: "hsl(224 30% 55%)" }} />
                          <input
                            id="modal-contact" type="text" value={form.contact}
                            onChange={(e) => setForm((p) => ({ ...p, contact: e.target.value }))}
                            required maxLength={200} disabled={loading}
                            placeholder="06 12 34 56 78 ou 12 rue de la Paix, Bordeaux"
                            className="w-full pl-9 pr-4 py-3 rounded-xl text-[13px] focus:outline-none transition-all duration-200 disabled:opacity-50"
                            style={{ background: "hsl(220 25% 97%)", border: "1px solid hsl(224 20% 86%)", color: "hsl(224 55% 12%)" }}
                          />
                        </div>
                        <p className="mt-1.5 text-[10px] font-light" style={{ color: "hsl(224 15% 58%)" }}>
                          Pour que nos conseillers puissent vous contacter si besoin.
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-3 pt-1">
                        <button type="button" onClick={() => setOpenId(null)} disabled={loading}
                          className="px-4 py-2.5 text-[11px] font-medium disabled:opacity-50" style={{ color: "hsl(224 15% 55%)" }}>
                          Annuler
                        </button>
                        <button type="submit" disabled={loading}
                          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[11px] font-medium text-white transition-opacity disabled:opacity-60"
                          style={{ background: "hsl(224 60% 18%)", boxShadow: "0 4px 16px -4px hsl(224 60% 18% / 0.38)" }}>
                          <Download className="w-3.5 h-3.5" strokeWidth={2} />
                          {loading ? "Préparation…" : "Télécharger le PDF"}
                        </button>
                      </div>
                    </form>
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
