import { useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Building2, Globe2, Home, Stethoscope, Users,
  ShieldCheck, TrendingDown, TrendingUp, Coins, X, ArrowRight,
  ChevronLeft, ChevronRight,
  LayoutGrid, BookOpen, BarChart2, Search, Shield, Zap, Lock, Heart,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo, { breadcrumbJsonLd } from "@/components/Seo";
import { getCasClients } from "@/lib/casClientsService";
import type { CasClient as DbCasClient } from "@/lib/casClientsService";
import heroBg from "@/assets/pdf-cover-building.jpg";
import casCadre from "@/assets/cas-cadre.jpg";
import casCouple from "@/assets/cas-couple.jpg";
import casDirigeant from "@/assets/cas-dirigeant.jpg";
import casLiberal from "@/assets/cas-liberal.jpg";
import casImmobilier from "@/assets/cas-immobilier.jpg";
import casExpatrie from "@/assets/cas-expatrie.jpg";

/* ─── Types ─────────────────────────────────────────────────────── */
type Category = "particulier" | "dirigeant" | "liberal" | "investisseur" | "expatrie";
type ViewMode = "cartes" | "parcours" | "comparer";
type ProfileFilter = "Tous" | "Particulier" | "Dirigeant" | "Profession libérale" | "Investisseur" | "Expatrié";
type ObjectifFilter = "Tous" | "Fiscalité" | "Transmission" | "Trésorerie" | "Retraite" | "International";

interface KPI { label: string; value: string; icon: typeof TrendingDown; }
interface CasClient {
  category: Category; categoryLabel: string; expertise: string; profil: string;
  age: string; duration: string; image: string; contexte: string;
  diagnostic: string[]; strategie: string[]; resultat: string;
  kpis: KPI[]; vigilance: string; verbatim?: { quote: string; author: string };
}

/* ─── Style constants ───────────────────────────────────────────── */
const NAVY      = "hsl(224 60% 18%)";
const NAVY_TEXT = "hsl(224 55% 12%)";
const NAVY_MID  = "hsl(224 25% 42%)";
const CARD_BORDER = "1px solid hsl(224 20% 12% / 0.08)";

/* ─── Mapping DB → affichage ────────────────────────────────────── */
const CATEGORY_IMAGES: Record<string, string> = {
  particulier: casCadre, dirigeant: casDirigeant,
  liberal: casLiberal, investisseur: casImmobilier, expatrie: casExpatrie,
};

function kpiIcon(value: string): typeof TrendingDown {
  if (value.startsWith("−") || value.startsWith("-")) return TrendingDown;
  if (value.startsWith("+")) return TrendingUp;
  if (value === "100 %") return ShieldCheck;
  if (value.includes("k€") || value.includes("M€")) return Coins;
  return TrendingUp;
}

const CATEGORY_ICONS: Record<Category, typeof Users> = {
  particulier: Users, dirigeant: Building2, liberal: Stethoscope,
  investisseur: Home, expatrie: Globe2,
};

const PROFILE_FILTERS: ProfileFilter[] = [
  "Tous", "Particulier", "Dirigeant", "Profession libérale", "Investisseur", "Expatrié",
];
const OBJECTIF_FILTERS: ObjectifFilter[] = [
  "Tous", "Fiscalité", "Transmission", "Trésorerie", "Retraite", "International",
];

function deriveObjectif(expertise: string): ObjectifFilter {
  const e = expertise.toLowerCase();
  if (e.includes("retraite")) return "Retraite";
  if (e.includes("trésor") || e.includes("cession")) return "Trésorerie";
  if (e.includes("impatri") || e.includes("retour en france")) return "International";
  if (e.includes("transmission") || e.includes("succession")) return "Transmission";
  return "Fiscalité";
}

function mapDbToDisplay(d: DbCasClient): CasClient {
  return {
    category: d.category as Category,
    categoryLabel: d.category_label,
    expertise: d.expertise,
    profil: d.profil,
    age: d.age != null ? `${d.age} ans` : "",
    duration: d.duration ?? "",
    image: d.image ?? CATEGORY_IMAGES[d.category] ?? casCadre,
    contexte: d.contexte ?? "",
    diagnostic: d.diagnostic ?? [],
    strategie: d.strategie ?? [],
    resultat: d.resultat ?? "",
    kpis: (d.kpis ?? []).map((k) => ({ ...k, icon: kpiIcon(k.value) })),
    vigilance: d.vigilance ?? "",
    verbatim: d.verbatim ? { quote: d.verbatim, author: d.verbatim_author ?? "" } : undefined,
  };
}

/* ─── Données ───────────────────────────────────────────────────── */
const CAS_CLIENTS_FALLBACK: CasClient[] = [
  {
    category: "particulier", categoryLabel: "Particulier",
    expertise: "Optimisation fiscale & transmission",
    profil: "Cadre dirigeant fortement fiscalisé",
    age: "48 ans · Marié · 2 enfants", duration: "Mission 18 mois", image: casCadre,
    contexte: "Directeur général d'un groupe industriel, revenus annuels supérieurs à 250 000 €, tranche marginale à 45 %. Patrimoine financier important mais concentré sur un seul contrat d'assurance-vie bancaire à frais élevés. Aucune optimisation fiscale en place.",
    diagnostic: ["Aucun PER ouvert malgré une déduction fiscale potentielle de 32 000 € par an", "Frais de gestion du contrat actuel : 1,1 % vs 0,55 % en architecture ouverte", "Clause bénéficiaire standard : transmission inefficace, fiscalité aux enfants surévaluée"],
    strategie: ["Ouverture d'un PER individuel avec versements déductibles calibrés", "Transfert vers des contrats d'assurance-vie en architecture ouverte, allocation diversifiée", "Démembrement de la clause bénéficiaire pour optimiser la transmission", "Investissement en nue-propriété de SCPI pour réduire l'IFI"],
    resultat: "Restructuration complète menée en 6 mois. Le client conserve sa liquidité tout en réduisant durablement sa pression fiscale et en organisant la transmission à ses enfants.",
    kpis: [
      { label: "Économie d'IR / an", value: "−14 400 €", icon: TrendingDown },
      { label: "Réduction des frais", value: "−50 %",    icon: TrendingDown },
      { label: "Capital transmis",    value: "+220 k€",  icon: TrendingUp   },
    ],
    vigilance: "Le passage d'un contrat bancaire vers un contrat en architecture ouverte nécessite une analyse des éventuels droits acquis (taux garanti sur le fonds en euros).",
    verbatim: { quote: "J'avais l'impression d'être bien suivi par ma banque. En réalité, je laissais filer chaque année l'équivalent du salaire net mensuel d'un cadre.", author: "Cadre dirigeant, 48 ans, secteur industriel" },
  },
  {
    category: "particulier", categoryLabel: "Particulier",
    expertise: "Transmission & succession",
    profil: "Couple avec transmission à préparer",
    age: "60 ans · Marié · 2 enfants adultes", duration: "Mission 12 mois", image: casCouple,
    contexte: "Couple de chefs d'entreprise retraités. Patrimoine immobilier (résidence principale + deux biens locatifs) et patrimoine financier (assurance-vie, comptes-titres). Aucune donation réalisée, aucune disposition testamentaire.",
    diagnostic: ["Droits de succession estimés à 380 000 € en l'état", "Aucune utilisation des abattements de donation (100 000 € par enfant tous les 15 ans)", "Conjoint survivant insuffisamment protégé sur le bien locatif principal"],
    strategie: ["Donation-partage de la nue-propriété des biens locatifs aux enfants", "Clause bénéficiaire démembrée sur les contrats d'assurance-vie", "Donation entre époux (donation au dernier vivant)", "Simulation successorale complète avec scenarii croisés"],
    resultat: "La transmission est cadrée juridiquement et fiscalement. Le couple conserve les revenus locatifs via l'usufruit, les enfants reçoivent la pleine propriété au second décès sans droits supplémentaires.",
    kpis: [
      { label: "Droits évités",       value: "−180 k€", icon: TrendingDown },
      { label: "Patrimoine sécurisé", value: "1,8 M€",  icon: ShieldCheck  },
      { label: "Délai succession",    value: "−40 %",   icon: TrendingDown },
    ],
    vigilance: "La donation de biens locatifs impose de bien évaluer l'impact fiscal pour les enfants (revenus fonciers, IFI) et de prévoir les modalités de gestion pendant la période de démembrement.",
  },
  {
    category: "dirigeant", categoryLabel: "Dirigeant",
    expertise: "Trésorerie d'entreprise & cession",
    profil: "Chef d'entreprise avec trésorerie excédentaire",
    age: "52 ans · Gérant majoritaire de SARL", duration: "Mission 24 mois", image: casDirigeant,
    contexte: "Dirigeant d'une SARL de services, CA de 2 M€, trésorerie excédentaire de 800 000 € dormante sur le compte courant. Rémunération non optimisée (100 % en salaire), absence de holding, projet de cession à 5-7 ans non préparé.",
    diagnostic: ["Trésorerie placée à 0 % alors que le rendement net potentiel atteint 3,5 %", "Coût social de la rémunération : 47 % vs 28 % via dividendes optimisés", "Cession future : risque fiscal majeur sans structure de holding"],
    strategie: ["Placement de la trésorerie sur des contrats de capitalisation personne morale", "Mix rémunération / dividendes optimisé fiscalement et socialement", "Création d'une holding par apport de titres (article 150-0 B ter)", "Mise en place d'un contrat retraite et d'une assurance homme-clé"],
    resultat: "Structure patrimoniale prête pour une cession optimisée. La trésorerie travaille, la rémunération est calibrée et la holding ouvre les portes du Pacte Dutreil et de l'apport-cession.",
    kpis: [
      { label: "Rendement trésorerie", value: "+3,2 %/an", icon: TrendingUp   },
      { label: "Charges sociales",     value: "−18 k€/an", icon: TrendingDown },
      { label: "Économie cession",     value: "−420 k€",   icon: Coins        },
    ],
    vigilance: "Le placement de trésorerie en société doit respecter les contraintes comptables (provision pour dépréciation) et la cohérence avec l'objet social de l'entreprise.",
    verbatim: { quote: "Je pensais m'occuper de mon patrimoine après la cession. KANTI m'a démontré que c'était trois ans avant qu'il fallait commencer.", author: "Dirigeant SARL, 52 ans, services B2B" },
  },
  {
    category: "liberal", categoryLabel: "Profession libérale",
    expertise: "Préparation retraite",
    profil: "Profession libérale préparant sa retraite",
    age: "55 ans · Médecin spécialiste BNC", duration: "Mission en cours · 3e année", image: casLiberal,
    contexte: "Médecin spécialiste libéral, revenus BNC de 180 000 €. Cotisations CARMF, pas de PER, un contrat Madelin ancien peu performant. Patrimoine concentré sur la résidence principale et un livret A.",
    diagnostic: ["Taux de remplacement retraite estimé à 38 % seulement", "Plafond PER non utilisé sur 3 ans : 78 000 € de déduction perdue", "Madelin ancien : performance nette annualisée de 1,1 %"],
    strategie: ["Ouverture d'un PER avec versements déductibles optimisés (3 ans rattrapage)", "Transfert du contrat Madelin vers un PER plus performant", "Portefeuille d'assurance-vie diversifié en complément", "Investissement locatif en LMNP pour générer des revenus faiblement fiscalisés"],
    resultat: "Trois ans après le démarrage, le client a constitué 240 k€ d'épargne retraite supplémentaire et sécurisé un revenu LMNP de 18 000 € annuels nets pour ses années de transition.",
    kpis: [
      { label: "Capital retraite", value: "+240 k€",    icon: TrendingUp   },
      { label: "Revenus LMNP",     value: "18 k€/an",  icon: Coins        },
      { label: "Économie d'IR",    value: "−26 k€/an", icon: TrendingDown },
    ],
    vigilance: "Le médecin libéral doit anticiper la baisse de revenus liée au ralentissement d'activité et prévoir une liquidité suffisante pour les années de transition.",
  },
  {
    category: "investisseur", categoryLabel: "Investisseur",
    expertise: "Restructuration immobilière",
    profil: "Investisseur immobilier en restructuration",
    age: "45 ans · 6 biens locatifs en nom propre", duration: "Mission 14 mois", image: casImmobilier,
    contexte: "Investisseur ayant constitué un parc de 6 biens locatifs en nom propre. Revenus fonciers importants, tranche marginale à 41 %, prélèvements sociaux significatifs. Gestion chronophage, peu de diversification.",
    diagnostic: ["Fiscalité totale sur revenus fonciers : 58,2 % (IR + PS)", "Concentration immobilière : 92 % du patrimoine global", "Aucune préparation de la transmission du parc aux enfants"],
    strategie: ["Apport des biens à une SCI à l'IS pour lisser la fiscalité", "Arbitrage partiel vers des SCPI en assurance-vie (revenus capitalisés)", "Donation de parts de SCI en nue-propriété aux enfants", "Constitution d'un portefeuille financier diversifié"],
    resultat: "Bascule progressive vers une structure plus simple à transmettre, fiscalement allégée, et un patrimoine financier représentant désormais 28 % du total.",
    kpis: [
      { label: "Pression fiscale",    value: "−22 pts", icon: TrendingDown },
      { label: "Diversification",     value: "+28 %",   icon: TrendingUp   },
      { label: "Droits transmission", value: "−95 k€",  icon: Coins        },
    ],
    vigilance: "L'apport de biens à une SCI génère des droits d'enregistrement et une plus-value d'apport. L'analyse du bilan fiscal global est indispensable avant toute opération.",
    verbatim: { quote: "Je gérais mon parc comme un deuxième métier. Aujourd'hui je décide, je ne gère plus. Et la fiscalité a fondu.", author: "Investisseur immobilier, 45 ans" },
  },
  {
    category: "expatrie", categoryLabel: "Expatrié",
    expertise: "Retour en France & impatriation",
    profil: "Expatrié en retour en France",
    age: "50 ans · 12 ans à Singapour", duration: "Mission 9 mois", image: casExpatrie,
    contexte: "Cadre de retour en France après 12 ans en Asie. Patrimoine constitué à l'étranger (comptes bancaires, assurance-vie luxembourgeoise, biens immobiliers en Asie). Revenus futurs en France, pas de résidence principale.",
    diagnostic: ["Obligations déclaratives 3916 et IFI non encore préparées", "Régime des impatriés (article 155 B CGI) éligible mais non activé", "Détention directe des actifs étrangers : risque fiscal et successoral majeur"],
    strategie: ["Audit complet des obligations déclaratives", "Activation du régime impatriés (exonération partielle 8 ans)", "Structuration de la détention via SCI / holding", "Rapatriement progressif des avoirs vers contrats français/luxembourgeois"],
    resultat: "Atterrissage fiscal sécurisé. Le client bénéficie pleinement du régime impatriés tout en conservant la flexibilité de ses placements luxembourgeois et asiatiques.",
    kpis: [
      { label: "Économie sur 8 ans", value: "−310 k€", icon: TrendingDown },
      { label: "Conformité",         value: "100 %",   icon: ShieldCheck  },
      { label: "Délai sécurisation", value: "9 mois",  icon: TrendingUp   },
    ],
    vigilance: "Le retour en France impose des déclarations spécifiques (formulaire 3916, déclaration de patrimoine IFI). Le non-respect expose à des pénalités significatives.",
  },
];

/* ─── CaseModal ─────────────────────────────────────────────────── */
function CaseModal({
  cas, index, total, onClose, onPrev, onNext,
}: {
  cas: CasClient; index: number; total: number;
  onClose: () => void; onPrev: () => void; onNext: () => void;
}) {
  /* Lock background scroll */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  /* Keyboard */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft")  onPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNext, onPrev]);

  const caseNumber = String(index + 1).padStart(2, "0");

  const stagger = {
    container: { hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } },
    item: { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.46, ease: [0.22, 1, 0.36, 1] } } },
  };

  return (
    <>
      {/* Backdrop · stops page scroll on click */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50"
        style={{ background: "hsl(224 30% 6% / 0.60)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
        onClick={onClose}
        aria-hidden
      />

      {/* Centering shell */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 lg:p-16">

        {/* Prev arrow · outside the window on the left */}
        <motion.button
          initial={{ opacity: 0, x: -12 }} animate={{ opacity: index > 0 ? 1 : 0, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          disabled={index === 0}
          className="absolute left-2 md:left-4 lg:left-8 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:pointer-events-none"
          style={{ background: "hsl(0 0% 100% / 0.18)", border: "1px solid hsl(0 0% 100% / 0.30)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
          aria-label="Cas précédent (←)"
        >
          <ChevronLeft className="w-5 h-5 text-white" strokeWidth={1.8} />
        </motion.button>

        {/* Modal window */}
        <motion.div
          key={cas.profil}
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 14 }}
          transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full overflow-hidden"
          style={{
            maxWidth: "1080px",
            maxHeight: "88vh",
            background: "linear-gradient(145deg, hsl(0 0% 100% / 0.94) 0%, hsl(218 22% 98% / 0.91) 100%)",
            backdropFilter: "blur(40px) saturate(200%)",
            WebkitBackdropFilter: "blur(40px) saturate(200%)",
            border: "none",
            boxShadow: "0 40px 120px -20px hsl(224 50% 10% / 0.35), 0 0 0 0.5px hsl(224 20% 15% / 0.08)",
            borderRadius: "32px",
          }}
          role="dialog"
          aria-modal
          aria-label={cas.profil}
        >
          {/* Close + counter · inside the image panel top-right */}
          <div className="absolute top-5 right-5 z-20 flex items-center gap-2">
            <span className="text-[10px] tracking-[0.22em] uppercase font-medium px-2.5 py-1 rounded-full"
              style={{ background: "hsl(224 20% 12% / 0.06)", color: "hsl(224 20% 50%)", border: "1px solid hsl(224 20% 12% / 0.08)" }}>
              {index + 1} / {total}
            </span>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{ background: "hsl(224 20% 12% / 0.06)", border: "1px solid hsl(224 20% 12% / 0.09)" }}
              aria-label="Fermer (Échap)"
            >
              <X className="w-3.5 h-3.5" style={{ color: "hsl(224 20% 42%)" }} strokeWidth={1.8} />
            </button>
          </div>

          {/* Two-column body */}
          <div className="grid lg:grid-cols-5" style={{ maxHeight: "88vh" }}>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.06 }}
              className="lg:col-span-2 relative"
              style={{ minHeight: "220px", borderRadius: "32px 0 0 32px", overflow: "hidden" }}
            >
              <img src={cas.image} alt="" aria-hidden
                className="w-full h-full object-cover object-center"
                style={{ minHeight: "220px", maxHeight: "88vh" }} />
              <div className="absolute inset-0" style={{
                background:
                  "linear-gradient(to right, hsl(224 40% 12% / 0.15) 0%, transparent 55%)," +
                  "linear-gradient(to top, hsl(224 40% 12% / 0.78) 0%, transparent 50%)",
              }} />
              <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
                <p className="text-[10px] tracking-[0.26em] uppercase font-medium text-white/60 mb-1.5">
                  Cas {caseNumber} · {cas.categoryLabel}
                </p>
                <p className="font-heading text-xl md:text-2xl font-light leading-snug tracking-tight">{cas.profil}</p>
                <p className="text-[11px] text-white/55 mt-1.5 font-light tracking-wide">{cas.age} · {cas.duration}</p>
              </div>
            </motion.div>

            {/* Scrollable content · scrollbar hidden */}
            <motion.div
              variants={stagger.container} initial="hidden" animate="visible"
              className="lg:col-span-3 hide-scrollbar flex flex-col"
              style={{
                overflowY: "auto",
                overscrollBehavior: "contain",
                maxHeight: "88vh",
                padding: "clamp(24px, 4vw, 42px)",
              }}
            >
              {/* KPIs */}
              <motion.div variants={stagger.item}
                className="grid grid-cols-3 gap-5 mb-8 pb-8"
                style={{ borderBottom: "1px solid hsl(224 20% 12% / 0.08)" }}>
                {cas.kpis.map((k) => {
                  const KIcon = k.icon;
                  return (
                    <div key={k.label}>
                      <div className="flex items-center gap-1.5 mb-1.5" style={{ color: "hsl(224 15% 58%)" }}>
                        <KIcon className="w-3 h-3" />
                        <span className="text-[9px] tracking-[0.18em] uppercase font-medium">{k.label}</span>
                      </div>
                      <p className="font-heading text-2xl md:text-3xl font-light tracking-tight tabular-nums leading-none" style={{ color: "hsl(224 55% 12%)" }}>
                        {k.value}
                      </p>
                    </div>
                  );
                })}
              </motion.div>

              <motion.p variants={stagger.item}
                className="text-[10px] tracking-[0.26em] uppercase font-medium mb-7"
                style={{ color: "hsl(224 38% 42%)" }}>
                {cas.expertise}
              </motion.p>

              {/* 01 Contexte */}
              <motion.div variants={stagger.item} className="mb-7">
                <p className="text-[9px] tracking-[0.22em] uppercase font-medium mb-2.5" style={{ color: "hsl(224 18% 56%)" }}>01 · Contexte</p>
                <p className="text-[13px] md:text-[14px] font-light leading-relaxed" style={{ color: "hsl(224 15% 35%)" }}>{cas.contexte}</p>
              </motion.div>

              {/* 02 Diagnostic */}
              <motion.div variants={stagger.item} className="mb-7">
                <p className="text-[9px] tracking-[0.22em] uppercase font-medium mb-2.5" style={{ color: "hsl(224 18% 56%)" }}>02 · Diagnostic</p>
                <ul className="space-y-2">
                  {cas.diagnostic.map((d) => (
                    <li key={d} className="flex items-start gap-2.5 text-[13px] font-light leading-relaxed" style={{ color: "hsl(224 15% 38%)" }}>
                      <span className="mt-[7px] w-1 h-1 rounded-full flex-shrink-0" style={{ background: "hsl(224 15% 62%)" }} />
                      {d}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* 03 Stratégie */}
              <motion.div variants={stagger.item} className="mb-7">
                <p className="text-[9px] tracking-[0.22em] uppercase font-medium mb-2.5" style={{ color: "hsl(224 38% 42%)" }}>03 · Stratégie</p>
                <ul className="space-y-2">
                  {cas.strategie.map((s) => (
                    <li key={s} className="flex items-start gap-2.5 text-[13px] font-light leading-relaxed" style={{ color: "hsl(224 15% 38%)" }}>
                      <span className="mt-[7px] w-1 h-1 rounded-full flex-shrink-0" style={{ background: "hsl(224 55% 38%)" }} />
                      {s}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* 04 Résultat */}
              <motion.div variants={stagger.item}
                className="rounded-2xl p-5 mb-7"
                style={{ background: "hsl(224 55% 18% / 0.04)", border: "1px solid hsl(224 28% 30% / 0.08)" }}>
                <p className="text-[9px] tracking-[0.22em] uppercase font-medium mb-2.5" style={{ color: "hsl(224 38% 42%)" }}>04 · Résultat</p>
                <p className="text-[13px] md:text-[14px] font-light leading-relaxed" style={{ color: "hsl(224 30% 26%)" }}>{cas.resultat}</p>
              </motion.div>

              {/* Vigilance */}
              <motion.div variants={stagger.item} className="flex items-start gap-2.5 mb-7">
                <span className="mt-[5px] w-1 h-1 rounded-full flex-shrink-0" style={{ background: "hsl(224 55% 35%)" }} />
                <div>
                  <p className="text-[9px] tracking-[0.22em] uppercase font-medium mb-1.5" style={{ color: "hsl(224 20% 52%)" }}>Point de vigilance</p>
                  <p className="text-[12px] leading-relaxed font-light italic" style={{ color: "hsl(224 15% 47%)" }}>{cas.vigilance}</p>
                </div>
              </motion.div>

              {/* Verbatim */}
              {cas.verbatim && (
                <motion.div variants={stagger.item}
                  className="mb-8 pt-6"
                  style={{ borderTop: "1px solid hsl(224 20% 12% / 0.08)" }}>
                  <span className="font-heading text-5xl leading-none select-none block mb-1" style={{ color: "hsl(224 20% 88%)" }}>"</span>
                  <p className="font-heading text-[17px] md:text-[19px] font-light leading-snug tracking-tight italic pl-8 mb-4" style={{ color: "hsl(224 30% 26%)" }}>
                    {cas.verbatim.quote}
                  </p>
                  <p className="text-[10px] tracking-[0.22em] uppercase font-medium pl-8" style={{ color: "hsl(224 18% 56%)" }}>
                    · {cas.verbatim.author}
                  </p>
                </motion.div>
              )}

              {/* CTA */}
              <motion.div variants={stagger.item} className="mt-auto pb-1">
                <a href="/contact"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-[13px] font-medium tracking-wide transition-all duration-300 hover:gap-4"
                  style={{ background: "hsl(224 60% 18%)", color: "white", boxShadow: "0 8px 24px -6px hsl(224 60% 18% / 0.32)" }}>
                  Prendre rendez-vous
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </a>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Next arrow · outside the window on the right */}
        <motion.button
          initial={{ opacity: 0, x: 12 }} animate={{ opacity: index < total - 1 ? 1 : 0, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          disabled={index >= total - 1}
          className="absolute right-2 md:right-4 lg:right-8 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:pointer-events-none"
          style={{ background: "hsl(0 0% 100% / 0.18)", border: "1px solid hsl(0 0% 100% / 0.30)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
          aria-label="Cas suivant (→)"
        >
          <ChevronRight className="w-5 h-5 text-white" strokeWidth={1.8} />
        </motion.button>

      </div>
    </>
  );
}

/* ─── CaseCard (new design) ─────────────────────────────────────── */
function CaseCard({
  cas, viewMode, isCompareSelected, onToggleCompare, onClick,
}: {
  cas: CasClient;
  viewMode: ViewMode;
  isCompareSelected: boolean;
  onToggleCompare: () => void;
  onClick: () => void;
}) {
  const mainKpi = cas.kpis[0];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-white rounded-2xl overflow-hidden flex flex-col"
      style={{
        border: CARD_BORDER,
        boxShadow: "0 4px 20px -6px hsl(224 40% 18% / 0.08)",
        cursor: viewMode === "comparer" ? "default" : "pointer",
      }}
      onClick={viewMode !== "comparer" ? onClick : undefined}
    >
      {/* Image area */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "3 / 2" }}>
        <img
          src={cas.image} alt="" aria-hidden
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, hsl(224 40% 8% / 0.52) 0%, transparent 55%)" }}
        />
        {/* Category chip — bottom-left */}
        <div className="absolute bottom-3 left-3">
          <span
            className="text-[9px] tracking-[0.24em] uppercase font-semibold px-2.5 py-1.5 rounded-full"
            style={{
              background: "hsl(0 0% 100% / 0.92)",
              color: NAVY,
              backdropFilter: "blur(8px)",
            }}
          >
            {cas.categoryLabel.toUpperCase()}
          </span>
        </div>
        {/* Compare checkbox (comparer mode) — top-right */}
        {viewMode === "comparer" && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onToggleCompare(); }}
            className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{
              background: isCompareSelected ? NAVY : "hsl(0 0% 100% / 0.92)",
              border: `2px solid ${isCompareSelected ? NAVY : "hsl(224 20% 12% / 0.22)"}`,
              backdropFilter: "blur(8px)",
            }}
            aria-label={isCompareSelected ? "Désélectionner" : "Sélectionner pour comparer"}
          >
            {isCompareSelected && (
              <span className="text-white text-[11px] font-bold leading-none">✓</span>
            )}
          </button>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <h3
          className="font-heading text-[17px] font-light leading-snug tracking-tight mb-1.5 transition-colors duration-300 group-hover:text-[hsl(224_60%_22%)]"
          style={{ color: NAVY_TEXT }}
        >
          {cas.profil}
        </h3>
        <p className="text-[12px] font-light leading-relaxed mb-4" style={{ color: NAVY_MID }}>
          {cas.expertise}
        </p>

        {/* Main KPI */}
        {mainKpi && (
          <div className="mb-4">
            <p className="text-[9px] tracking-[0.22em] uppercase font-medium mb-1" style={{ color: "hsl(224 15% 58%)" }}>
              {mainKpi.label}
            </p>
            <p className="font-heading text-2xl font-light tracking-tight tabular-nums leading-none" style={{ color: NAVY_TEXT }}>
              {mainKpi.value}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-4 flex items-center justify-between" style={{ borderTop: CARD_BORDER }}>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className="inline-flex items-center gap-1.5 text-[12px] font-medium tracking-wide transition-all duration-200 hover:gap-3"
            style={{ color: NAVY }}
          >
            Découvrir le cas
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200" strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */
export default function CasClientsPage() {
  useScrollReveal();

  /* ── State ── */
  const [viewMode, setViewMode]           = useState<ViewMode>("cartes");
  const [activeProfile, setActiveProfile] = useState<ProfileFilter>("Tous");
  const [activeObjectif, setActiveObjectif] = useState<ObjectifFilter>("Tous");
  const [searchQuery, setSearchQuery]     = useState("");
  const [compareIds, setCompareIds]       = useState<Set<string>>(new Set());
  const [selected, setSelected]           = useState<CasClient | null>(null);
  const [hoveredCard, setHoveredCard]     = useState<number | null>(null);

  /* ── Parallax ── */
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);

  /* ── Data ── */
  const { data: dbCas } = useQuery({ queryKey: ["cas-clients"], queryFn: getCasClients });

  const casClients = useMemo(
    () => (dbCas && dbCas.length > 0 ? dbCas.map(mapDbToDisplay) : CAS_CLIENTS_FALLBACK),
    [dbCas],
  );

  const filtered = useMemo(() => {
    let result = casClients;
    if (activeProfile !== "Tous") {
      result = result.filter((c) => c.categoryLabel === activeProfile);
    }
    if (activeObjectif !== "Tous") {
      result = result.filter((c) => deriveObjectif(c.expertise) === activeObjectif);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.profil.toLowerCase().includes(q) ||
          c.expertise.toLowerCase().includes(q) ||
          c.contexte.toLowerCase().includes(q),
      );
    }
    return result;
  }, [casClients, activeProfile, activeObjectif, searchQuery]);

  /* ── Modal navigation ── */
  const selectedIndex = selected ? filtered.indexOf(selected) : -1;
  const onPrev = () => { if (selectedIndex > 0) setSelected(filtered[selectedIndex - 1]); };
  const onNext = () => { if (selectedIndex < filtered.length - 1) setSelected(filtered[selectedIndex + 1]); };

  /* ── Compare toggle ── */
  function toggleCompare(profil: string) {
    setCompareIds((prev) => {
      const next = new Set(prev);
      if (next.has(profil)) {
        next.delete(profil);
      } else if (next.size < 2) {
        next.add(profil);
      }
      return next;
    });
  }

  const featuredCase = casClients[1]; // Couple avec transmission — −180 k€ · 1,8 M€
  const compareArr   = Array.from(compareIds);
  const compareCases = compareArr
    .map((id) => casClients.find((c) => c.profil === id))
    .filter(Boolean) as CasClient[];

  /* ── Steps for progress bar ── */
  const STEPS = ["Contexte", "Diagnostic", "Stratégie", "Résultats"];

  /* ── Trust badges ── */
  const TRUST_BADGES = [
    { icon: Shield, label: "Cabinet indépendant" },
    { icon: Zap,    label: "Réponse sous 24h" },
    { icon: Lock,   label: "Données confidentielles" },
    { icon: Heart,  label: "100 % dédié à vos intérêts" },
  ];

  return (
    <>
      <Seo
        title="Cas clients, études patrimoniales anonymisées | KANTI"
        description="Six études de cas patrimoniales : cadre dirigeant, couple, chef d'entreprise, profession libérale, investisseur immobilier, expatrié."
        jsonLd={breadcrumbJsonLd([{ name: "Accueil", url: "/" }, { name: "Cas clients", url: "/cas-clients" }])}
      />
      <Header />

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden"
        style={{ minHeight: "100vh", background: "hsl(222 58% 10%)" }}
      >
        {/* Parallax background */}
        <motion.div className="absolute inset-0 will-change-transform" style={{ y: imageY, scale: 1.14 }}>
          <img src={heroBg} alt="" aria-hidden className="w-full h-full object-cover object-center" fetchPriority="high" />
        </motion.div>
        {/* Navy duotone overlay */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "hsl(222 58% 10% / 0.78)", mixBlendMode: "multiply" }}
        />
        {/* Gradient — left stronger, right lighter to let image breathe */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(115deg, hsl(222 60% 8% / 0.95) 0%, hsl(222 56% 12% / 0.80) 36%, hsl(222 50% 16% / 0.45) 62%, transparent 90%)",
          }}
        />
        {/* Bottom fade to page bg */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
          style={{ background: "linear-gradient(to top, hsl(220 25% 97%) 0%, transparent 100%)" }}
        />

        {/* Content */}
        <div className="relative z-10 flex items-center min-h-screen py-28 lg:py-36">
          <div className="max-w-6xl mx-auto px-8 md:px-14 w-full">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">

              {/* Left col */}
              <div className="lg:col-span-5">
                {/* Eyebrow */}
                <motion.p
                  className="text-[10px] tracking-[0.30em] uppercase font-semibold mb-6"
                  style={{ color: "hsl(214 55% 72%)" }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  ÉTUDES DE CAS · STRATÉGIES RÉELLES
                </motion.p>

                {/* H1 */}
                <motion.h1
                  className="font-heading font-light leading-[1.05] tracking-tight mb-6"
                  style={{ fontSize: "clamp(2.4rem, 5vw, 3.6rem)", color: "white" }}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  Explorez des trajectoires patrimoniales{" "}
                  <span className="italic" style={{ color: "hsl(214 80% 72%)" }}>réelles</span>
                </motion.h1>

                {/* Description */}
                <motion.p
                  className="text-[15px] font-light leading-relaxed mb-10"
                  style={{ color: "hsl(0 0% 100% / 0.68)" }}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  Chaque cas présente le contexte, le diagnostic, la stratégie mise en œuvre et les résultats chiffrés obtenus pour nos clients.
                </motion.p>

                {/* View mode toggle */}
                <motion.div
                  className="flex flex-wrap gap-2"
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  {(
                    [
                      { id: "cartes"   as const, label: "Cartes",   Icon: LayoutGrid },
                      { id: "parcours" as const, label: "Parcours", Icon: BookOpen   },
                      { id: "comparer" as const, label: "Comparer", Icon: BarChart2  },
                    ] as { id: ViewMode; label: string; Icon: typeof LayoutGrid }[]
                  ).map(({ id, label, Icon }) => {
                    const isActive = viewMode === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setViewMode(id)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-medium tracking-wide transition-all duration-300"
                        style={{
                          background: isActive ? "white" : "hsl(0 0% 100% / 0.12)",
                          color: isActive ? NAVY : "hsl(0 0% 100% / 0.82)",
                          border: `1px solid ${isActive ? "transparent" : "hsl(0 0% 100% / 0.22)"}`,
                          backdropFilter: "blur(12px)",
                          boxShadow: isActive ? "0 4px 16px -4px hsl(224 60% 8% / 0.35)" : "none",
                        }}
                      >
                        <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
                        {label}
                      </button>
                    );
                  })}
                </motion.div>
              </div>

              {/* Right col — stacked preview cards */}
              <div className="lg:col-span-7 hidden lg:block">
                <div className="relative" style={{ height: 480 }}>

                  {/* Ambient glow behind card stack */}
                  <div aria-hidden className="absolute pointer-events-none" style={{
                    top: "10%", left: "10%", right: "10%", bottom: "0%",
                    background: "radial-gradient(ellipse 80% 60% at 50% 55%, hsl(214 70% 55% / 0.18) 0%, transparent 72%)",
                    filter: "blur(28px)",
                  }} />

                  {/* Card 1 — back-left, NAVY DARK (Chef d'entreprise) */}
                  <motion.div
                    onHoverStart={() => setHoveredCard(0)}
                    onHoverEnd={() => setHoveredCard(null)}
                    whileHover={{ y: -20, scale: 1.02, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } }}
                    onClick={() => setSelected(casClients[2])}
                    className="absolute cursor-pointer"
                    style={{
                      top: 80, left: 0, width: "62%",
                      rotate: "-8deg",
                      zIndex: hoveredCard === 0 ? 20 : 1,
                      borderRadius: 22,
                      background: "linear-gradient(140deg, hsl(222 52% 24%) 0%, hsl(224 60% 14%) 100%)",
                      border: "1px solid hsl(214 45% 36% / 0.55)",
                      boxShadow: "0 20px 60px -10px hsl(224 65% 8% / 0.55), inset 0 1px 0 hsl(214 60% 55% / 0.18), inset 0 -1px 0 hsl(224 60% 8% / 0.30)",
                      padding: "22px 26px",
                    }}
                  >
                    <p className="text-[9px] tracking-[0.28em] uppercase font-semibold mb-4" style={{ color: "hsl(214 55% 62%)" }}>
                      DIRIGEANT · TRÉSORERIE
                    </p>
                    <p className="font-heading text-[2rem] font-light tracking-tight tabular-nums leading-none mb-1" style={{ color: "white" }}>
                      +3,2 %/an
                    </p>
                    <p className="text-[10px] tracking-[0.22em] uppercase font-medium mb-5" style={{ color: "hsl(0 0% 100% / 0.42)" }}>
                      Rendement trésorerie
                    </p>
                    <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid hsl(0 0% 100% / 0.10)" }}>
                      <span className="text-[11px] font-light" style={{ color: "hsl(0 0% 100% / 0.55)" }}>Chef d'entreprise</span>
                      <span className="text-[11px] font-medium flex items-center gap-1.5" style={{ color: "hsl(214 80% 72%)" }}>
                        Voir le cas <ArrowRight className="w-3 h-3" strokeWidth={2} />
                      </span>
                    </div>
                  </motion.div>

                  {/* Card 2 — center, WHITE (CAS DU MOIS — Couple Transmission) */}
                  <motion.div
                    onHoverStart={() => setHoveredCard(1)}
                    onHoverEnd={() => setHoveredCard(null)}
                    whileHover={{ y: -20, scale: 1.025, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } }}
                    onClick={() => setSelected(casClients[1])}
                    className="absolute cursor-pointer"
                    style={{
                      top: 8, left: "16%", width: "80%",
                      rotate: "-1.5deg",
                      zIndex: hoveredCard === 1 ? 20 : 3,
                      borderRadius: 28,
                      background: "linear-gradient(150deg, hsl(0 0% 100%) 0%, hsl(218 30% 98%) 100%)",
                      border: "1px solid hsl(0 0% 100% / 0.92)",
                      boxShadow: "0 40px 100px -16px hsl(224 60% 8% / 0.55), 0 0 0 1px hsl(224 20% 80% / 0.25), inset 0 1px 0 white",
                      padding: "28px 32px",
                    }}
                  >
                    <div className="flex items-center justify-between mb-5">
                      <span
                        className="text-[9px] tracking-[0.28em] uppercase font-semibold px-3 py-1.5 rounded-full"
                        style={{ background: `${NAVY}14`, color: NAVY }}
                      >
                        CAS DU MOIS
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: "hsl(214 55% 62%)" }} />
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: "hsl(224 30% 82%)" }} />
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: "hsl(224 30% 88%)" }} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5 mb-5">
                      <div>
                        <p className="font-heading text-[2.2rem] font-light tracking-tight tabular-nums leading-none mb-1.5" style={{ color: NAVY_TEXT }}>
                          −180 k€
                        </p>
                        <p className="text-[9px] tracking-[0.22em] uppercase font-medium" style={{ color: "hsl(224 15% 58%)" }}>
                          Droits évités
                        </p>
                      </div>
                      <div>
                        <p className="font-heading text-[2.2rem] font-light tracking-tight tabular-nums leading-none mb-1.5" style={{ color: NAVY_TEXT }}>
                          1,8 M€
                        </p>
                        <p className="text-[9px] tracking-[0.22em] uppercase font-medium" style={{ color: "hsl(224 15% 58%)" }}>
                          Patrimoine sécurisé
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-5" style={{ borderTop: CARD_BORDER }}>
                      <span className="text-[11px] font-medium" style={{ color: NAVY_MID }}>Couple · Transmission</span>
                      <span className="text-[11px] font-medium flex items-center gap-1.5" style={{ color: NAVY }}>
                        Voir le cas <ArrowRight className="w-3 h-3" strokeWidth={2} />
                      </span>
                    </div>
                  </motion.div>

                  {/* Card 3 — front-right, NAVY DARK (Expatrié) */}
                  <motion.div
                    onHoverStart={() => setHoveredCard(2)}
                    onHoverEnd={() => setHoveredCard(null)}
                    whileHover={{ y: -20, scale: 1.02, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } }}
                    onClick={() => setSelected(casClients[5])}
                    className="absolute cursor-pointer"
                    style={{
                      top: 96, right: 0, width: "62%",
                      rotate: "7deg",
                      zIndex: hoveredCard === 2 ? 20 : 2,
                      borderRadius: 22,
                      background: "linear-gradient(140deg, hsl(222 50% 22%) 0%, hsl(224 58% 13%) 100%)",
                      border: "1px solid hsl(214 42% 34% / 0.50)",
                      boxShadow: "0 16px 55px -10px hsl(224 65% 8% / 0.50), inset 0 1px 0 hsl(214 60% 50% / 0.14)",
                      padding: "22px 26px",
                    }}
                  >
                    <p className="text-[9px] tracking-[0.28em] uppercase font-semibold mb-4" style={{ color: "hsl(214 55% 62%)" }}>
                      EXPATRIÉ · INTERNATIONAL
                    </p>
                    <p className="font-heading text-[2rem] font-light tracking-tight tabular-nums leading-none mb-1" style={{ color: "white" }}>
                      −310 k€
                    </p>
                    <p className="text-[10px] tracking-[0.22em] uppercase font-medium mb-5" style={{ color: "hsl(0 0% 100% / 0.42)" }}>
                      Économie sur 8 ans
                    </p>
                    <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid hsl(0 0% 100% / 0.10)" }}>
                      <span className="text-[11px] font-light" style={{ color: "hsl(0 0% 100% / 0.55)" }}>Expatrié · Retour France</span>
                      <span className="text-[11px] font-medium flex items-center gap-1.5" style={{ color: "hsl(214 80% 72%)" }}>
                        Voir le cas <ArrowRight className="w-3 h-3" strokeWidth={2} />
                      </span>
                    </div>
                  </motion.div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── STICKY FILTER BAR ─────────────────────────────────────── */}
      <div className="sticky z-40 py-3" style={{ top: 72, background: "hsl(220 25% 97%)" }}>
        <div className="max-w-6xl mx-auto px-8 md:px-14">
          <div
            className="rounded-2xl px-5 py-4"
            style={{
              background: "hsl(0 0% 100% / 0.96)",
              backdropFilter: "blur(14px)",
              border: "1px solid hsl(224 20% 12% / 0.08)",
              boxShadow: "0 2px 16px -4px hsl(224 60% 12% / 0.07)",
            }}
          >
            <div className="grid lg:grid-cols-[1fr_auto] gap-4 items-start">
              {/* Filter rows */}
              <div className="space-y-3">
                {/* Row 1: Profil */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className="text-[9px] tracking-[0.28em] uppercase font-semibold flex-shrink-0"
                    style={{ color: NAVY_MID }}
                  >
                    PROFIL
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PROFILE_FILTERS.map((p) => {
                      const isActive = activeProfile === p;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setActiveProfile(p)}
                          className="px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wide transition-all duration-200"
                          style={{
                            background: isActive ? NAVY : "transparent",
                            color: isActive ? "white" : NAVY_MID,
                            border: `1px solid ${isActive ? "transparent" : "hsl(224 20% 86%)"}`,
                          }}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Row 2: Objectif */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className="text-[9px] tracking-[0.28em] uppercase font-semibold flex-shrink-0"
                    style={{ color: NAVY_MID }}
                  >
                    OBJECTIF
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {OBJECTIF_FILTERS.map((o) => {
                      const isActive = activeObjectif === o;
                      return (
                        <button
                          key={o}
                          type="button"
                          onClick={() => setActiveObjectif(o)}
                          className="px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wide transition-all duration-200"
                          style={{
                            background: isActive ? NAVY : "transparent",
                            color: isActive ? "white" : NAVY_MID,
                            border: `1px solid ${isActive ? "transparent" : "hsl(224 20% 86%)"}`,
                          }}
                        >
                          {o}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Search + sort — right side */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 flex-shrink-0">
                {/* Search */}
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
                    style={{ color: "hsl(224 20% 60%)" }}
                    strokeWidth={1.75}
                  />
                  <input
                    type="text"
                    placeholder="Rechercher un cas…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-1.5 rounded-full text-[12px] focus:outline-none transition-all duration-150"
                    style={{
                      background: "hsl(220 25% 97%)",
                      border: "1px solid hsl(224 20% 86%)",
                      color: NAVY_TEXT,
                      width: 190,
                    }}
                  />
                </div>
                {/* Sort */}
                <select
                  className="pl-3 pr-8 py-1.5 rounded-full text-[12px] focus:outline-none appearance-none"
                  style={{
                    background: "hsl(220 25% 97%)",
                    border: "1px solid hsl(224 20% 86%)",
                    color: NAVY_MID,
                    width: 190,
                  }}
                  defaultValue="pertinence"
                >
                  <option value="pertinence">Trier par pertinence</option>
                  <option value="economie">Économie la plus élevée</option>
                  <option value="profil">Par profil</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────────────── */}
      <main
        className="pb-24 md:pb-32"
        style={{ background: "hsl(220 25% 97%)" }}
      >
        <div className="max-w-6xl mx-auto px-8 md:px-14">

          {/* ── CARTES MODE ── */}
          {viewMode === "cartes" && (
            <>
              {/* Featured case section */}
              {featuredCase && (
                <section className="pt-12 pb-10 reveal">
                  <div
                    className="rounded-3xl overflow-hidden grid lg:grid-cols-12"
                    style={{
                      background: "white",
                      border: CARD_BORDER,
                      boxShadow: "0 8px 40px -12px hsl(224 60% 12% / 0.10)",
                    }}
                  >
                    {/* Left: image */}
                    <div className="lg:col-span-5 relative min-h-[280px]">
                      <img
                        src={casCouple}
                        alt=""
                        aria-hidden
                        className="w-full h-full object-cover object-center"
                        style={{ minHeight: 280 }}
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(to right, hsl(224 40% 8% / 0.08) 0%, transparent 60%)," +
                            "linear-gradient(to top, hsl(224 40% 8% / 0.72) 0%, transparent 52%)",
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-7">
                        <span
                          className="inline-flex text-[9px] tracking-[0.28em] uppercase font-semibold px-3 py-1.5 rounded-full"
                          style={{ background: "hsl(214 60% 55% / 0.22)", color: "hsl(214 80% 82%)" }}
                        >
                          CAS DU MOIS
                        </span>
                      </div>
                    </div>

                    {/* Right: editorial content */}
                    <div className="lg:col-span-7 p-8 lg:p-10 flex flex-col gap-6">
                      {/* Badges */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="text-[9px] tracking-[0.28em] uppercase font-semibold px-3 py-1.5 rounded-full"
                          style={{ background: `${NAVY}14`, color: NAVY }}
                        >
                          CAS DU MOIS
                        </span>
                        <span
                          className="text-[9px] tracking-[0.22em] uppercase font-semibold px-3 py-1.5 rounded-full"
                          style={{ background: `${NAVY}12`, color: NAVY }}
                        >
                          {featuredCase.categoryLabel.toUpperCase()}
                        </span>
                      </div>

                      {/* Title + subtitle */}
                      <div>
                        <h2
                          className="font-heading text-2xl lg:text-3xl font-light leading-tight tracking-tight mb-2"
                          style={{ color: NAVY_TEXT }}
                        >
                          {featuredCase.profil}
                        </h2>
                        <p className="text-[14px] font-light italic" style={{ color: NAVY_MID }}>
                          {featuredCase.contexte.split(". ")[0]}.
                        </p>
                      </div>

                      {/* Objective */}
                      <p className="text-[13px] font-light" style={{ color: "hsl(224 25% 42%)" }}>
                        <span className="font-medium" style={{ color: NAVY_TEXT }}>Objectif :</span>{" "}
                        préparer la transmission et protéger le conjoint.
                      </p>

                      {/* 4-step progress bar */}
                      <div className="relative flex justify-between">
                        {/* Connecting line */}
                        <div
                          className="absolute h-px"
                          style={{
                            top: 16,
                            left: "12.5%",
                            right: "12.5%",
                            background: "hsl(224 20% 12% / 0.12)",
                          }}
                        />
                        {STEPS.map((label, i) => (
                          <div key={label} className="flex flex-col items-center gap-2 relative z-10">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-semibold tracking-wide"
                              style={{
                                background: i === 0 ? NAVY : "hsl(224 20% 92%)",
                                color: i === 0 ? "white" : "hsl(224 20% 55%)",
                              }}
                            >
                              {String(i + 1).padStart(2, "0")}
                            </div>
                            <span
                              className="text-[10px] font-medium"
                              style={{ color: i === 0 ? NAVY_TEXT : "hsl(224 20% 60%)" }}
                            >
                              {label}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* KPI blocks */}
                      <div className="grid grid-cols-3 gap-0">
                        {featuredCase.kpis.map((kpi, i) => (
                          <div
                            key={kpi.label}
                            className={i > 0 ? "pl-5 lg:pl-7" : ""}
                            style={{ borderLeft: i > 0 ? "1px solid hsl(224 20% 12% / 0.10)" : "none" }}
                          >
                            <p
                              className="font-heading text-2xl lg:text-3xl font-light tracking-tight tabular-nums leading-none mb-1.5"
                              style={{ color: NAVY_TEXT }}
                            >
                              {kpi.value}
                            </p>
                            <p
                              className="text-[9px] tracking-[0.22em] uppercase font-medium"
                              style={{ color: "hsl(224 15% 58%)" }}
                            >
                              {kpi.label}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      <div>
                        <button
                          type="button"
                          onClick={() => setSelected(featuredCase)}
                          className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-[13px] font-medium tracking-wide transition-all duration-300 hover:gap-4"
                          style={{
                            background: NAVY,
                            color: "white",
                            boxShadow: `0 8px 24px -6px ${NAVY}52`,
                          }}
                        >
                          Découvrir ce cas en détail
                          <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Cards grid */}
              <section className="pt-4">
                {filtered.length === 0 ? (
                  <p className="text-center font-light py-20" style={{ color: "hsl(224 12% 55%)" }}>
                    Aucun cas ne correspond à ces filtres pour le moment.
                  </p>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                      {filtered.map((cas) => (
                        <CaseCard
                          key={cas.profil}
                          cas={cas}
                          viewMode={viewMode}
                          isCompareSelected={compareIds.has(cas.profil)}
                          onToggleCompare={() => toggleCompare(cas.profil)}
                          onClick={() => setSelected(cas)}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
                <p className="text-center mt-8 text-[11px] font-light tracking-wide" style={{ color: "hsl(224 22% 52%)" }}>
                  Cliquez sur une carte · Navigation clavier dans le détail : ← → Échap
                </p>
              </section>
            </>
          )}

          {/* ── PARCOURS MODE ── */}
          {viewMode === "parcours" && (
            <section className="pt-12">
              <div className="space-y-5">
                {filtered.length === 0 ? (
                  <p className="text-center font-light py-20" style={{ color: "hsl(224 12% 55%)" }}>
                    Aucun cas ne correspond à ces filtres.
                  </p>
                ) : (
                  filtered.map((cas, i) => {
                    const CatIcon = CATEGORY_ICONS[cas.category];
                    return (
                      <motion.div
                        key={cas.profil}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                        className="group rounded-2xl bg-white overflow-hidden cursor-pointer"
                        style={{
                          border: CARD_BORDER,
                          boxShadow: "0 4px 20px -6px hsl(224 40% 18% / 0.07)",
                        }}
                        onClick={() => setSelected(cas)}
                      >
                        <div className="grid sm:grid-cols-[200px_1fr] gap-0">
                          {/* Image */}
                          <div className="relative overflow-hidden" style={{ minHeight: 160 }}>
                            <img
                              src={cas.image}
                              alt=""
                              aria-hidden
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              style={{ minHeight: 160 }}
                            />
                            <div
                              className="absolute inset-0"
                              style={{ background: "linear-gradient(to right, transparent 60%, hsl(0 0% 100% / 0.15) 100%)" }}
                            />
                          </div>
                          {/* Content */}
                          <div className="p-6 flex flex-col justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <CatIcon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: NAVY_MID }} strokeWidth={1.75} />
                                <span className="text-[10px] tracking-[0.24em] uppercase font-semibold" style={{ color: NAVY_MID }}>
                                  {cas.categoryLabel}
                                </span>
                              </div>
                              <h3 className="font-heading text-xl font-light leading-snug tracking-tight mb-1" style={{ color: NAVY_TEXT }}>
                                {cas.profil}
                              </h3>
                              <p className="text-[12px] font-light" style={{ color: NAVY_MID }}>{cas.expertise}</p>
                            </div>
                            <div className="flex items-center gap-6 flex-wrap">
                              {cas.kpis.map((kpi) => (
                                <div key={kpi.label}>
                                  <p className="font-heading text-lg font-light tracking-tight tabular-nums" style={{ color: NAVY_TEXT }}>
                                    {kpi.value}
                                  </p>
                                  <p className="text-[9px] tracking-[0.20em] uppercase font-medium" style={{ color: "hsl(224 15% 60%)" }}>
                                    {kpi.label}
                                  </p>
                                </div>
                              ))}
                              <div className="ml-auto">
                                <span
                                  className="inline-flex items-center gap-1.5 text-[12px] font-medium"
                                  style={{ color: NAVY }}
                                >
                                  Découvrir <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.8} />
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </section>
          )}

          {/* ── COMPARER MODE ── */}
          {viewMode === "comparer" && (
            <section className="pt-12">
              <div className="mb-8">
                <h2 className="font-heading text-2xl font-light tracking-tight mb-2" style={{ color: NAVY_TEXT }}>
                  Comparer ou explorer d'autres cas similaires
                </h2>
                <p className="text-[13px] font-light" style={{ color: NAVY_MID }}>
                  Sélectionnez deux cas (✓) pour les comparer côte à côte.
                </p>
              </div>

              {/* Selection grid */}
              {filtered.length === 0 ? (
                <p className="text-center font-light py-20" style={{ color: "hsl(224 12% 55%)" }}>
                  Aucun cas ne correspond à ces filtres.
                </p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
                  <AnimatePresence mode="popLayout">
                    {filtered.map((cas) => (
                      <CaseCard
                        key={cas.profil}
                        cas={cas}
                        viewMode={viewMode}
                        isCompareSelected={compareIds.has(cas.profil)}
                        onToggleCompare={() => toggleCompare(cas.profil)}
                        onClick={() => setSelected(cas)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Comparison table — when 2 selected */}
              <AnimatePresence>
                {compareCases.length === 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="rounded-3xl overflow-hidden"
                    style={{
                      background: "white",
                      border: CARD_BORDER,
                      boxShadow: "0 8px 40px -12px hsl(224 60% 12% / 0.10)",
                    }}
                  >
                    {/* Header row */}
                    <div
                      className="grid grid-cols-3 gap-0 px-8 py-5"
                      style={{ background: NAVY, color: "white" }}
                    >
                      <div className="text-[10px] tracking-[0.26em] uppercase font-semibold opacity-60">Critère</div>
                      {compareCases.map((cas) => {
                        const CIcon = CATEGORY_ICONS[cas.category];
                        return (
                          <div key={cas.profil} className="pl-6" style={{ borderLeft: "1px solid hsl(0 0% 100% / 0.12)" }}>
                            <div className="flex items-center gap-2 mb-0.5">
                              <CIcon className="w-3.5 h-3.5 opacity-70" strokeWidth={1.75} />
                              <span className="text-[10px] tracking-[0.20em] uppercase font-semibold opacity-70">{cas.categoryLabel}</span>
                            </div>
                            <p className="font-heading text-[15px] font-light leading-snug">{cas.profil}</p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Rows */}
                    {[
                      {
                        label: "Expertise",
                        render: (cas: CasClient) => (
                          <span className="text-[13px] font-light" style={{ color: NAVY_MID }}>{cas.expertise}</span>
                        ),
                      },
                      ...Array.from({ length: 3 }, (_, ki) => ({
                        label: `KPI ${ki + 1}`,
                        render: (cas: CasClient) => {
                          const kpi = cas.kpis[ki];
                          if (!kpi) return <span className="text-[13px] font-light" style={{ color: "hsl(224 15% 70%)" }}>—</span>;
                          return (
                            <div>
                              <p className="font-heading text-xl font-light tracking-tight tabular-nums" style={{ color: NAVY_TEXT }}>{kpi.value}</p>
                              <p className="text-[10px] tracking-[0.20em] uppercase font-medium mt-0.5" style={{ color: "hsl(224 15% 60%)" }}>{kpi.label}</p>
                            </div>
                          );
                        },
                      })),
                      {
                        label: "Contexte",
                        render: (cas: CasClient) => (
                          <p className="text-[12px] font-light leading-relaxed" style={{ color: NAVY_MID }}>
                            {cas.contexte.length > 140 ? cas.contexte.slice(0, 137) + "…" : cas.contexte}
                          </p>
                        ),
                      },
                    ].map((row, ri) => (
                      <div
                        key={row.label}
                        className="grid grid-cols-3 gap-0 px-8 py-5"
                        style={{ borderTop: "1px solid hsl(224 20% 12% / 0.07)", background: ri % 2 === 0 ? "hsl(220 25% 98%)" : "white" }}
                      >
                        <div
                          className="text-[9px] tracking-[0.24em] uppercase font-semibold self-start pt-1"
                          style={{ color: "hsl(224 20% 60%)" }}
                        >
                          {row.label}
                        </div>
                        {compareCases.map((cas) => (
                          <div key={cas.profil} className="pl-6" style={{ borderLeft: "1px solid hsl(224 20% 12% / 0.07)" }}>
                            {row.render(cas)}
                          </div>
                        ))}
                      </div>
                    ))}

                    {/* CTA row */}
                    <div
                      className="grid grid-cols-3 gap-0 px-8 py-5"
                      style={{ borderTop: "1px solid hsl(224 20% 12% / 0.07)" }}
                    >
                      <div />
                      {compareCases.map((cas) => (
                        <div key={cas.profil} className="pl-6" style={{ borderLeft: "1px solid hsl(224 20% 12% / 0.07)" }}>
                          <button
                            type="button"
                            onClick={() => setSelected(cas)}
                            className="inline-flex items-center gap-1.5 text-[12px] font-medium tracking-wide"
                            style={{ color: NAVY }}
                          >
                            Voir le détail <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.8} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          )}

        </div>
      </main>

      {/* ── MODAL ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <CaseModal
            key={selected.profil}
            cas={selected}
            index={selectedIndex >= 0 ? selectedIndex : 0}
            total={filtered.length}
            onClose={() => setSelected(null)}
            onPrev={onPrev}
            onNext={onNext}
          />
        )}
      </AnimatePresence>

      {/* ── COMPARE FLOATING BAR (cartes mode, 2 selected) ────────── */}
      <AnimatePresence>
        {viewMode === "cartes" && compareIds.size === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed z-40 flex items-center gap-4 px-6 py-4 rounded-2xl"
            style={{
              bottom: 24,
              left: "50%",
              transform: "translateX(-50%)",
              background: "hsl(0 0% 100% / 0.96)",
              backdropFilter: "blur(20px)",
              border: CARD_BORDER,
              boxShadow: "0 16px 50px -8px hsl(224 60% 12% / 0.18)",
            }}
          >
            <div className="flex items-center gap-2">
              {compareArr.map((id) => (
                <span
                  key={id}
                  className="text-[11px] font-medium px-3 py-1 rounded-full"
                  style={{ background: `${NAVY}12`, color: NAVY }}
                >
                  {id.split(" ").slice(0, 3).join(" ")}
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setViewMode("comparer")}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[12px] font-medium tracking-wide transition-all duration-200 hover:gap-3"
              style={{ background: NAVY, color: "white", boxShadow: `0 6px 20px -4px ${NAVY}52` }}
            >
              Comparer 2 cas
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.8} />
            </button>
            <button
              type="button"
              onClick={() => setCompareIds(new Set())}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{ background: "hsl(224 20% 12% / 0.06)", border: "1px solid hsl(224 20% 12% / 0.10)" }}
              aria-label="Effacer la sélection"
            >
              <X className="w-3.5 h-3.5" style={{ color: NAVY_MID }} strokeWidth={1.8} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CTA SECTION ───────────────────────────────────────────── */}
      <section
        className="py-24 lg:py-32"
        style={{ background: "hsl(var(--navy-deep))", position: "relative", overflow: "hidden" }}
      >
        <div className="max-w-6xl mx-auto px-8 md:px-14 reveal">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-16">
            {/* Left: heading */}
            <div className="lg:col-span-5">
              <p className="text-[9px] tracking-[0.30em] uppercase font-semibold mb-5" style={{ color: "hsl(0 0% 100% / 0.35)" }}>
                Kanti · Études de cas
              </p>
              <h2
                className="font-heading font-light leading-[1.05] tracking-tight"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "white" }}
              >
                Votre situation mérite{" "}
                <span className="italic" style={{ color: "hsl(214 60% 72%)" }}>une stratégie sur mesure</span>
              </h2>
            </div>

            {/* Center/right: description + buttons */}
            <div className="lg:col-span-7 flex flex-col gap-6" style={{ borderLeft: "1px solid hsl(0 0% 100% / 0.10)", paddingLeft: "2.5rem" }}>
              <p className="text-[15px] font-light leading-relaxed" style={{ color: "hsl(0 0% 100% / 0.58)" }}>
                Chacun des cas présentés ici s'inspire d'une situation réelle. Votre patrimoine a ses propres spécificités — parlons-en lors d'un premier échange de 30 minutes, sans engagement.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-[13px] font-medium tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-8px_hsl(0_0%_100%_/_0.15)] group"
                  style={{ background: "white", color: "hsl(224 55% 12%)" }}
                >
                  Prendre rendez-vous
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
                </Link>
                <Link
                  to="/ressources"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-[13px] font-medium tracking-wide transition-all duration-300 hover:border-white/40 hover:text-white group"
                  style={{ border: "1px solid hsl(0 0% 100% / 0.20)", color: "hsl(0 0% 100% / 0.72)" }}
                >
                  Recevoir une synthèse PDF
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
                </Link>
              </div>

              {/* Trust dots */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
                {["Premier échange gratuit", "Sans engagement", "Confidentiel"].map((t) => (
                  <span key={t} className="inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase font-medium" style={{ color: "hsl(0 0% 100% / 0.28)" }}>
                    <span className="w-1 h-1 rounded-full" style={{ background: "hsl(0 0% 100% / 0.28)" }} />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden" style={{ background: "hsl(0 0% 100% / 0.06)", border: "1px solid hsl(0 0% 100% / 0.08)" }}>
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <div key={label} className="px-6 py-5 flex items-center gap-3" style={{ background: "hsl(224 60% 7%)" }}>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "hsl(0 0% 100% / 0.08)" }}
                >
                  <Icon className="w-4 h-4" style={{ color: "hsl(0 0% 100% / 0.55)" }} strokeWidth={1.6} />
                </div>
                <p className="text-[12px] font-light leading-snug" style={{ color: "hsl(0 0% 100% / 0.55)" }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
