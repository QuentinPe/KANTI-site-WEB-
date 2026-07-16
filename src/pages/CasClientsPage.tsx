import { useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Briefcase, Building2, Globe2, Home, Stethoscope, Users,
  ShieldCheck, TrendingDown, TrendingUp, Coins, X, ArrowRight,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageCTA from "@/components/PageCTA";
import Seo, { breadcrumbJsonLd } from "@/components/Seo";
import { getCasClients } from "@/lib/casClientsService";
import type { CasClient as DbCasClient } from "@/lib/casClientsService";
import heroBg from "@/assets/contact-advisors.jpg";
import casCadre from "@/assets/cas-cadre.jpg";
import casCouple from "@/assets/cas-couple.jpg";
import casDirigeant from "@/assets/cas-dirigeant.jpg";
import casLiberal from "@/assets/cas-liberal.jpg";
import casImmobilier from "@/assets/cas-immobilier.jpg";
import casExpatrie from "@/assets/cas-expatrie.jpg";

/* ─── Types ─────────────────────────────────────────────────────── */
type Category = "particulier" | "dirigeant" | "liberal" | "investisseur" | "expatrie";
interface KPI { label: string; value: string; icon: typeof TrendingDown; }
interface CasClient {
  category: Category; categoryLabel: string; expertise: string; profil: string;
  age: string; duration: string; image: string; contexte: string;
  diagnostic: string[]; strategie: string[]; resultat: string;
  kpis: KPI[]; vigilance: string; verbatim?: { quote: string; author: string };
}

/* ─── Mapping DB → affichage ────────────────────────────────────── */
const CATEGORY_IMAGES: Record<string, string> = {
  particulier: casCadre, dirigeant: casDirigeant,
  liberal: casLiberal, investisseur: casImmobilier, expatrie: casExpatrie,
};

function kpiIcon(value: string): typeof TrendingDown {
  if (value.startsWith("−") || value.startsWith("-")) return TrendingDown;
  if (value.startsWith("+")) return TrendingUp;
  if (value === "100 %") return ShieldCheck;
  if (value.includes("k€") || value.includes("M€") || value.includes("k€")) return Coins;
  return TrendingUp;
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

/* ─── 3D config par position de carte ───────────────────────────── */
const CARD_3D = [
  { ry: -10, rx:  6, z: -12 }, // 0 – haut gauche  (incliné arrière-gauche)
  { ry:   0, rx:  4, z:  26 }, // 1 – haut centre   (avant)
  { ry:  10, rx:  6, z: -12 }, // 2 – haut droite   (incliné arrière-droite)
  { ry:  -8, rx: -6, z:  -6 }, // 3 – bas gauche
  { ry:   0, rx: -4, z:  32 }, // 4 – bas centre    (avant, le plus proche)
  { ry:   8, rx: -6, z:  -6 }, // 5 – bas droite
];

/* ─── Données ───────────────────────────────────────────────────── */
const CATEGORY_ICONS: Record<Category, typeof Users> = {
  particulier: Users, dirigeant: Building2, liberal: Stethoscope,
  investisseur: Home, expatrie: Globe2,
};

const categories = [
  { id: "tous" as const,         label: "Tous",         icon: Briefcase   },
  { id: "particulier" as const,  label: "Particulier",  icon: Users       },
  { id: "dirigeant" as const,    label: "Dirigeant",    icon: Building2   },
  { id: "liberal" as const,      label: "Libéral",      icon: Stethoscope },
  { id: "investisseur" as const, label: "Investisseur", icon: Home        },
  { id: "expatrie" as const,     label: "Expatrié",     icon: Globe2      },
];

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

/* ─── FloatingCard — style "ecosystem 3D" ──────────────────────── */
function FloatingCard({ cas, index, onClick }: { cas: CasClient; index: number; onClick: () => void }) {
  const Icon    = CATEGORY_ICONS[cas.category];
  const mainKpi = cas.kpis[0];
  const cfg     = CARD_3D[index % CARD_3D.length];

  const floatY        = 6 + (index % 3) * 3;
  const floatDuration = 8.5 + index * 0.9;
  const floatDelay    = index * 1.2;

  /* Shadow varies with Z depth */
  const shadowDepth = (cfg.z + 15) / 50; // 0→1
  const shadowSize  = 18 + shadowDepth * 28;
  const shadowAlpha = (0.10 + shadowDepth * 0.12).toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: index * 0.09 }}
    >
      <motion.button
        type="button"
        onClick={onClick}
        /* 3D base position + continuous float */
        animate={{
          y: [0, -floatY, 0],
          rotateY: cfg.ry,
          rotateX: cfg.rx,
          z: cfg.z,
        }}
        transition={{
          y:       { duration: floatDuration, repeat: Infinity, delay: floatDelay, ease: "easeInOut" },
          rotateY: { duration: 0.01 },
          rotateX: { duration: 0.01 },
          z:       { duration: 0.01 },
        }}
        /* Hover: flatten + surge forward */
        whileHover={{
          y: -22, rotateY: 0, rotateX: 0, z: 60, scale: 1.04,
          transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
        }}
        whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
        className="group w-full text-left flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(224_55%_32%)]"
        style={{
          transformPerspective: 900,
          padding: "28px",
          minHeight: "236px",
          borderRadius: "28px",
          background: "linear-gradient(145deg, hsl(0 0% 100% / 0.86) 0%, hsl(218 28% 97% / 0.76) 100%)",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          border: "none",
          boxShadow:
            `0 ${shadowSize * 0.55}px ${shadowSize}px -8px hsl(224 40% 18% / ${shadowAlpha}),` +
            "inset 0 1px 0 hsl(0 0% 100% / 0.94)," +
            "inset 0 -1px 0 hsl(224 30% 60% / 0.06)",
        }}
      >
        {/* Category badge + icon */}
        <div className="flex items-start justify-between mb-5">
          <span className="text-[10px] tracking-[0.26em] uppercase font-medium px-2.5 py-1.5 rounded-full"
            style={{ background: "hsl(224 55% 18% / 0.07)", color: "hsl(224 50% 32%)" }}>
            {cas.categoryLabel}
          </span>
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors duration-300 group-hover:bg-[hsl(224_55%_18%/0.10)]"
            style={{ background: "hsl(224 55% 18% / 0.06)", border: "1px solid hsl(224 28% 30% / 0.10)" }}>
            <Icon className="w-[18px] h-[18px]" style={{ color: "hsl(224 55% 32%)" }} strokeWidth={1.5} />
          </div>
        </div>

        {/* Title + expertise */}
        <h3 className="font-heading text-[17px] md:text-[19px] font-light leading-snug tracking-tight mb-2 transition-colors duration-300 group-hover:text-[hsl(224_55%_22%)]"
          style={{ color: "hsl(224 60% 10%)" }}>
          {cas.profil}
        </h3>
        <p className="text-[12px] font-light leading-relaxed mb-6" style={{ color: "hsl(224 20% 50%)" }}>
          {cas.expertise}
        </p>

        {/* Bottom: main KPI + link */}
        <div className="mt-auto w-full pt-5 flex items-end justify-between"
          style={{ borderTop: "1px solid hsl(224 20% 12% / 0.07)" }}>
          <div>
            <p className="text-[9px] tracking-[0.22em] uppercase font-medium mb-1" style={{ color: "hsl(224 15% 58%)" }}>
              {mainKpi.label}
            </p>
            <p className="font-heading text-2xl font-light tracking-tight tabular-nums leading-none" style={{ color: "hsl(224 55% 12%)" }}>
              {mainKpi.value}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide opacity-40 transition-opacity duration-300 group-hover:opacity-100"
            style={{ color: "hsl(224 50% 30%)" }}>
            <span>Voir le cas</span>
            <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2} />
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
}

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
      {/* Backdrop — stops page scroll on click */}
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

        {/* Prev arrow — outside the window on the left */}
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
          {/* Close + counter — inside the image panel top-right */}
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

            {/* Scrollable content — scrollbar hidden */}
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
                    — {cas.verbatim.author}
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

        {/* Next arrow — outside the window on the right */}
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

/* ─── CategoryFilter ────────────────────────────────────────────── */
function CategoryFilter({ active, onChange, counts }: {
  active: Category | "tous"; onChange: (id: Category | "tous") => void; counts: Record<string, number>; total: number;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => {
        const Icon     = cat.icon;
        const isActive = active === cat.id;
        const count    = cat.id === "tous" ? total : (counts[cat.id] ?? 0);
        return (
          <button key={cat.id} type="button" onClick={() => onChange(cat.id)} aria-pressed={isActive}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-medium tracking-wide transition-all duration-300"
            style={{
              background: isActive ? "hsl(224 60% 18%)" : "hsl(0 0% 100% / 0.68)",
              color: isActive ? "white" : "hsl(224 25% 40%)",
              border: `1px solid ${isActive ? "hsl(224 60% 18%)" : "hsl(0 0% 100% / 0.55)"}`,
              backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
              boxShadow: isActive ? "0 4px 14px -4px hsl(224 60% 18% / 0.30)" : "0 2px 8px -4px hsl(224 20% 20% / 0.07)",
            }}>
            <Icon className="w-3.5 h-3.5" />
            <span>{cat.label}</span>
            <span className="text-[10px] tabular-nums px-1.5 py-0.5 rounded-full"
              style={{ background: isActive ? "hsl(0 0% 100% / 0.18)" : "hsl(224 20% 12% / 0.07)", color: isActive ? "hsl(0 0% 100% / 0.85)" : "hsl(224 20% 55%)" }}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */
export default function CasClientsPage() {
  useScrollReveal();
  const [active, setActive]     = useState<Category | "tous">("tous");
  const [selected, setSelected] = useState<CasClient | null>(null);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);

  const { data: dbCas } = useQuery({ queryKey: ["cas-clients"], queryFn: getCasClients });

  const casClients = useMemo(
    () => dbCas && dbCas.length > 0 ? dbCas.map(mapDbToDisplay) : CAS_CLIENTS_FALLBACK,
    [dbCas]
  );

  const counts   = useMemo(() => casClients.reduce<Record<string, number>>((acc, c) => { acc[c.category] = (acc[c.category] ?? 0) + 1; return acc; }, {}), [casClients]);
  const filtered = useMemo(() => active === "tous" ? casClients : casClients.filter((c) => c.category === active), [active, casClients]);

  const selectedIndex = selected ? filtered.indexOf(selected) : -1;
  const onPrev = () => { if (selectedIndex > 0) setSelected(filtered[selectedIndex - 1]); };
  const onNext = () => { if (selectedIndex < filtered.length - 1) setSelected(filtered[selectedIndex + 1]); };

  const stats = [
    { value: "180+",   label: "Familles accompagnées"       },
    { value: "12 ans", label: "D'expérience moyenne"        },
    { value: "97 %",   label: "Taux de fidélisation"        },
    { value: "30+",    label: "Partenaires institutionnels" },
  ];

  return (
    <>
      <Seo
        title="Cas clients, études patrimoniales anonymisées | KANTI"
        description="Six études de cas patrimoniales : cadre dirigeant, couple, chef d'entreprise, profession libérale, investisseur immobilier, expatrié."
        jsonLd={breadcrumbJsonLd([{ name: "Accueil", url: "/" }, { name: "Cas clients", url: "/cas-clients" }])}
      />
      <Header />

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative overflow-hidden" style={{ minHeight: "68vh" }}>
        <motion.div className="absolute inset-0 will-change-transform" style={{ y: imageY, scale: 1.14 }}>
          <img src={heroBg} alt="" aria-hidden className="w-full h-full object-cover object-center" fetchPriority="high" />
        </motion.div>
        <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(105deg, hsl(0 0% 100% / 0.98) 0%, hsl(0 0% 100% / 0.92) 28%, hsl(0 0% 100% / 0.60) 52%, hsl(0 0% 100% / 0.08) 70%, transparent 82%)" }} />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-36 pointer-events-none" style={{ background: "linear-gradient(to top, hsl(0 0% 100%) 0%, transparent 100%)" }} />
        <div className="relative z-10 flex items-center min-h-[68vh] py-28 lg:py-36">
          <div className="max-w-6xl mx-auto px-8 md:px-14 w-full">
            <div className="max-w-[520px]">
              <motion.div className="flex items-center gap-2 mb-7" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }}>
                <span className="w-5 h-[2px]" style={{ background: "hsl(224 60% 22%)" }} />
                <p className="text-[11px] tracking-[0.32em] uppercase font-medium" style={{ color: "hsl(224 60% 22%)" }}>Études de cas · Transparence</p>
              </motion.div>
              <motion.h1 className="font-heading font-light leading-[1.04] tracking-tight mb-6"
                style={{ fontSize: "clamp(2.6rem, 5.5vw, 4rem)", color: "hsl(224 60% 12%)" }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
                Six situations<br />
                <span className="italic" style={{ color: "hsl(224 55% 30%)" }}>réelles.</span>
              </motion.h1>
              <motion.p className="text-[15px] font-light leading-relaxed mb-8" style={{ color: "hsl(224 25% 32%)" }}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                Contexte, diagnostic, stratégie et résultats chiffrés. Pour comprendre comment KANTI construit une solution patrimoniale sur mesure.
              </motion.p>
              <motion.p className="text-[12px] font-light tracking-wide" style={{ color: "hsl(224 18% 55%)" }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }}>
                6 cas · Anonymisés · Chiffrés
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Intro + stats ── */}
      <section className="bg-white section-padding">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-end mb-16 reveal">
            <div className="lg:col-span-6">
              <div className="electric-line mb-6" />
              <p className="text-[11px] tracking-[0.3em] uppercase font-medium mb-5" style={{ color: "hsl(224 25% 52%)" }}>Méthodologie éditoriale</p>
              <h2 className="text-3xl md:text-5xl font-heading font-light leading-[1.05] tracking-tight" style={{ color: "hsl(224 55% 12%)" }}>
                Des situations réelles,<br />
                <span className="italic" style={{ color: "hsl(224 25% 40%)" }}>rigoureusement anonymisées</span>.
              </h2>
            </div>
            <div className="lg:col-span-6 lg:pl-10 lg:border-l" style={{ borderColor: "hsl(224 20% 12% / 0.10)" }}>
              <p className="text-base md:text-lg leading-relaxed font-light" style={{ color: "hsl(224 15% 40%)" }}>
                Chaque cas présenté ici s'inspire d'un dossier réel suivi par le cabinet. Les noms, montants et secteurs ont été modifiés pour préserver la confidentialité absolue de nos clients, sans altérer la logique patrimoniale ni les résultats obtenus.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden reveal"
            style={{ background: "hsl(224 20% 12% / 0.07)", border: "1px solid hsl(224 20% 12% / 0.07)" }}>
            {stats.map((s) => (
              <div key={s.label} className="bg-white p-7 md:p-9">
                <p className="font-heading text-3xl md:text-5xl font-light tracking-tight tabular-nums leading-none mb-3" style={{ color: "hsl(224 55% 12%)" }}>{s.value}</p>
                <p className="text-[10px] md:text-[11px] tracking-[0.22em] uppercase font-medium" style={{ color: "hsl(224 20% 52%)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ecosystem 3D floating cards ── */}
      <section
        className="relative overflow-hidden pb-24 md:pb-32"
        style={{ background: "linear-gradient(155deg, hsl(214 55% 94%) 0%, hsl(220 38% 96.5%) 50%, hsl(210 50% 93.5%) 100%)" }}
      >
        {/* Depth orbs */}
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute top-24 left-1/4 w-96 h-96 rounded-full opacity-35"
            style={{ background: "radial-gradient(circle, hsl(214 75% 84%) 0%, transparent 70%)", filter: "blur(70px)" }} />
          <div className="absolute top-64 right-[20%] w-80 h-80 rounded-full opacity-28"
            style={{ background: "radial-gradient(circle, hsl(220 65% 80%) 0%, transparent 70%)", filter: "blur(55px)" }} />
          <div className="absolute bottom-24 left-[30%] w-72 h-72 rounded-full opacity-22"
            style={{ background: "radial-gradient(circle, hsl(210 72% 86%) 0%, transparent 70%)", filter: "blur(48px)" }} />
          <div className="absolute top-40 right-[35%] w-60 h-60 rounded-full opacity-18"
            style={{ background: "radial-gradient(circle, hsl(200 60% 88%) 0%, transparent 70%)", filter: "blur(44px)" }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-8 md:px-14 pt-16 md:pt-20">
          {/* Filters */}
          <div className="mb-14 reveal">
            <p className="text-[11px] tracking-[0.3em] uppercase font-medium mb-4" style={{ color: "hsl(224 28% 45%)" }}>
              Filtrer par profil
            </p>
            <CategoryFilter active={active} onChange={(id) => { setActive(id); setSelected(null); }} counts={counts} total={casClients.length} />
          </div>

          {/* 3D perspective container */}
          <div style={{ perspective: "1400px", perspectiveOrigin: "50% 30%" }}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
              <AnimatePresence mode="popLayout">
                {filtered.map((cas, i) => (
                  <FloatingCard key={cas.profil} cas={cas} index={i} onClick={() => setSelected(cas)} />
                ))}
              </AnimatePresence>
            </div>
          </div>

          {filtered.length === 0 && (
            <p className="text-center font-light py-20" style={{ color: "hsl(224 12% 55%)" }}>
              Aucun cas ne correspond à ce filtre pour le moment.
            </p>
          )}

          <p className="text-center mt-10 text-[11px] font-light tracking-wide" style={{ color: "hsl(224 22% 52%)" }}>
            Cliquez sur une carte · Navigation clavier&nbsp;: ← → Échap
          </p>
        </div>
      </section>

      {/* ── Modal ── */}
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

      <PageCTA
        title="Votre situation ressemble à l'un de ces cas ?"
        subtitle="Chaque patrimoine est unique. Parlons du vôtre lors d'un premier échange de 30 minutes, sans engagement."
        eyebrow="Études de cas"
        index="10"
      />
      <Footer />
    </>
  );
}
