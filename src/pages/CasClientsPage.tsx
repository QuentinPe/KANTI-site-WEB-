import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Building2,
  Globe2,
  Home,
  Stethoscope,
  Users,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Coins,
} from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PageCTA from "@/components/PageCTA";
import ParallaxImage from "@/components/ParallaxImage";
import Seo, { breadcrumbJsonLd } from "@/components/Seo";
import casCadre from "@/assets/cas-cadre.jpg";
import casCouple from "@/assets/cas-couple.jpg";
import casDirigeant from "@/assets/cas-dirigeant.jpg";
import casLiberal from "@/assets/cas-liberal.jpg";
import casImmobilier from "@/assets/cas-immobilier.jpg";
import casExpatrie from "@/assets/cas-expatrie.jpg";

/* ------------------------------------------------------------------ */
/*  Données — cas clients structurés                                  */
/* ------------------------------------------------------------------ */

type Category =
  | "particulier"
  | "dirigeant"
  | "liberal"
  | "investisseur"
  | "expatrie";

interface KPI {
  label: string;
  value: string;
  icon: typeof TrendingDown;
}

interface CasClient {
  category: Category;
  categoryLabel: string;
  expertise: string;
  profil: string;
  age: string;
  duration: string;
  image: string;
  contexte: string;
  diagnostic: string[];
  strategie: string[];
  resultat: string;
  kpis: KPI[];
  vigilance: string;
  verbatim?: { quote: string; author: string };
}

const categories: { id: Category | "tous"; label: string; icon: typeof Users }[] = [
  { id: "tous", label: "Tous les cas", icon: Briefcase },
  { id: "particulier", label: "Particulier & Famille", icon: Users },
  { id: "dirigeant", label: "Chef d'entreprise", icon: Building2 },
  { id: "liberal", label: "Profession libérale", icon: Stethoscope },
  { id: "investisseur", label: "Investisseur", icon: Home },
  { id: "expatrie", label: "Expatrié", icon: Globe2 },
];

const casClients: CasClient[] = [
  {
    category: "particulier",
    categoryLabel: "Particulier",
    expertise: "Optimisation fiscale & transmission",
    profil: "Cadre dirigeant fortement fiscalisé",
    age: "48 ans · Marié · 2 enfants",
    duration: "Mission 18 mois",
    image: casCadre,
    contexte:
      "Directeur général d'un groupe industriel, revenus annuels supérieurs à 250 000 €, tranche marginale à 45 %. Patrimoine financier important mais concentré sur un seul contrat d'assurance-vie bancaire à frais élevés. Aucune optimisation fiscale en place.",
    diagnostic: [
      "Aucun PER ouvert malgré une déduction fiscale potentielle de 32 000 € par an",
      "Frais de gestion du contrat actuel : 1,1 % vs 0,55 % en architecture ouverte",
      "Clause bénéficiaire standard : transmission inefficace, fiscalité aux enfants surévaluée",
    ],
    strategie: [
      "Ouverture d'un PER individuel avec versements déductibles calibrés",
      "Transfert vers des contrats d'assurance-vie en architecture ouverte, allocation diversifiée",
      "Démembrement de la clause bénéficiaire pour optimiser la transmission",
      "Investissement en nue-propriété de SCPI pour réduire l'IFI",
    ],
    resultat:
      "Restructuration complète menée en 6 mois. Le client conserve sa liquidité tout en réduisant durablement sa pression fiscale et en organisant la transmission à ses enfants.",
    kpis: [
      { label: "Économie d'IR / an", value: "−14 400 €", icon: TrendingDown },
      { label: "Réduction des frais", value: "−50 %", icon: TrendingDown },
      { label: "Capital transmis", value: "+220 k€", icon: TrendingUp },
    ],
    vigilance:
      "Le passage d'un contrat bancaire vers un contrat en architecture ouverte nécessite une analyse des éventuels droits acquis (taux garanti sur le fonds en euros).",
    verbatim: {
      quote:
        "J'avais l'impression d'être bien suivi par ma banque. En réalité, je laissais filer chaque année l'équivalent du salaire net mensuel d'un cadre.",
      author: "Cadre dirigeant, 48 ans — secteur industriel",
    },
  },
  {
    category: "particulier",
    categoryLabel: "Particulier",
    expertise: "Transmission & succession",
    profil: "Couple avec transmission à préparer",
    age: "60 ans · Marié · 2 enfants adultes",
    duration: "Mission 12 mois",
    image: casCouple,
    contexte:
      "Couple de chefs d'entreprise retraités. Patrimoine immobilier (résidence principale + deux biens locatifs) et patrimoine financier (assurance-vie, comptes-titres). Aucune donation réalisée, aucune disposition testamentaire.",
    diagnostic: [
      "Droits de succession estimés à 380 000 € en l'état",
      "Aucune utilisation des abattements de donation (100 000 € par enfant tous les 15 ans)",
      "Conjoint survivant insuffisamment protégé sur le bien locatif principal",
    ],
    strategie: [
      "Donation-partage de la nue-propriété des biens locatifs aux enfants",
      "Clause bénéficiaire démembrée sur les contrats d'assurance-vie",
      "Donation entre époux (donation au dernier vivant)",
      "Simulation successorale complète avec scenarii croisés",
    ],
    resultat:
      "La transmission est cadrée juridiquement et fiscalement. Le couple conserve les revenus locatifs via l'usufruit, les enfants reçoivent la pleine propriété au second décès sans droits supplémentaires.",
    kpis: [
      { label: "Droits évités", value: "−180 k€", icon: TrendingDown },
      { label: "Patrimoine sécurisé", value: "1,8 M€", icon: ShieldCheck },
      { label: "Délai succession", value: "−40 %", icon: TrendingDown },
    ],
    vigilance:
      "La donation de biens locatifs impose de bien évaluer l'impact fiscal pour les enfants (revenus fonciers, IFI) et de prévoir les modalités de gestion pendant la période de démembrement.",
  },
  {
    category: "dirigeant",
    categoryLabel: "Dirigeant",
    expertise: "Trésorerie d'entreprise & cession",
    profil: "Chef d'entreprise avec trésorerie excédentaire",
    age: "52 ans · Gérant majoritaire de SARL",
    duration: "Mission 24 mois",
    image: casDirigeant,
    contexte:
      "Dirigeant d'une SARL de services, CA de 2 M€, trésorerie excédentaire de 800 000 € dormante sur le compte courant. Rémunération non optimisée (100 % en salaire), absence de holding, projet de cession à 5-7 ans non préparé.",
    diagnostic: [
      "Trésorerie placée à 0 % alors que le rendement net potentiel atteint 3,5 %",
      "Coût social de la rémunération : 47 % vs 28 % via dividendes optimisés",
      "Cession future : risque fiscal majeur sans structure de holding",
    ],
    strategie: [
      "Placement de la trésorerie sur des contrats de capitalisation personne morale",
      "Mix rémunération / dividendes optimisé fiscalement et socialement",
      "Création d'une holding par apport de titres (article 150-0 B ter)",
      "Mise en place d'un contrat retraite et d'une assurance homme-clé",
    ],
    resultat:
      "Structure patrimoniale prête pour une cession optimisée. La trésorerie travaille, la rémunération est calibrée et la holding ouvre les portes du Pacte Dutreil et de l'apport-cession.",
    kpis: [
      { label: "Rendement trésorerie", value: "+3,2 %/an", icon: TrendingUp },
      { label: "Charges sociales", value: "−18 k€/an", icon: TrendingDown },
      { label: "Économie cession", value: "−420 k€", icon: Coins },
    ],
    vigilance:
      "Le placement de trésorerie en société doit respecter les contraintes comptables (provision pour dépréciation) et la cohérence avec l'objet social de l'entreprise.",
    verbatim: {
      quote:
        "Je pensais m'occuper de mon patrimoine après la cession. KANTI m'a démontré que c'était trois ans avant qu'il fallait commencer.",
      author: "Dirigeant SARL, 52 ans — services B2B",
    },
  },
  {
    category: "liberal",
    categoryLabel: "Profession libérale",
    expertise: "Préparation retraite",
    profil: "Profession libérale préparant sa retraite",
    age: "55 ans · Médecin spécialiste BNC",
    duration: "Mission en cours · 3e année",
    image: casLiberal,
    contexte:
      "Médecin spécialiste libéral, revenus BNC de 180 000 €. Cotisations CARMF, pas de PER, un contrat Madelin ancien peu performant. Patrimoine concentré sur la résidence principale et un livret A.",
    diagnostic: [
      "Taux de remplacement retraite estimé à 38 % seulement",
      "Plafond PER non utilisé sur 3 ans : 78 000 € de déduction perdue",
      "Madelin ancien : performance nette annualisée de 1,1 %",
    ],
    strategie: [
      "Ouverture d'un PER avec versements déductibles optimisés (3 ans rattrapage)",
      "Transfert du contrat Madelin vers un PER plus performant",
      "Portefeuille d'assurance-vie diversifié en complément",
      "Investissement locatif en LMNP pour générer des revenus faiblement fiscalisés",
    ],
    resultat:
      "Trois ans après le démarrage, le client a constitué 240 k€ d'épargne retraite supplémentaire et sécurisé un revenu LMNP de 18 000 € annuels nets pour ses années de transition.",
    kpis: [
      { label: "Capital retraite", value: "+240 k€", icon: TrendingUp },
      { label: "Revenus LMNP", value: "18 k€/an", icon: Coins },
      { label: "Économie d'IR", value: "−26 k€/an", icon: TrendingDown },
    ],
    vigilance:
      "Le médecin libéral doit anticiper la baisse de revenus liée au ralentissement d'activité et prévoir une liquidité suffisante pour les années de transition.",
  },
  {
    category: "investisseur",
    categoryLabel: "Investisseur",
    expertise: "Restructuration immobilière",
    profil: "Investisseur immobilier en restructuration",
    age: "45 ans · 6 biens locatifs en nom propre",
    duration: "Mission 14 mois",
    image: casImmobilier,
    contexte:
      "Investisseur ayant constitué un parc de 6 biens locatifs en nom propre. Revenus fonciers importants, tranche marginale à 41 %, prélèvements sociaux significatifs. Gestion chronophage, peu de diversification.",
    diagnostic: [
      "Fiscalité totale sur revenus fonciers : 58,2 % (IR + PS)",
      "Concentration immobilière : 92 % du patrimoine global",
      "Aucune préparation de la transmission du parc aux enfants",
    ],
    strategie: [
      "Apport des biens à une SCI à l'IS pour lisser la fiscalité",
      "Arbitrage partiel vers des SCPI en assurance-vie (revenus capitalisés)",
      "Donation de parts de SCI en nue-propriété aux enfants",
      "Constitution d'un portefeuille financier diversifié",
    ],
    resultat:
      "Bascule progressive vers une structure plus simple à transmettre, fiscalement allégée, et un patrimoine financier représentant désormais 28 % du total — concentration ramenée sous le seuil critique.",
    kpis: [
      { label: "Pression fiscale", value: "−22 pts", icon: TrendingDown },
      { label: "Diversification", value: "+28 %", icon: TrendingUp },
      { label: "Droits transmission", value: "−95 k€", icon: Coins },
    ],
    vigilance:
      "L'apport de biens à une SCI génère des droits d'enregistrement et une plus-value d'apport. L'analyse du bilan fiscal global est indispensable avant toute opération.",
    verbatim: {
      quote:
        "Je gérais mon parc comme un deuxième métier. Aujourd'hui je décide, je ne gère plus. Et la fiscalité a fondu.",
      author: "Investisseur immobilier, 45 ans",
    },
  },
  {
    category: "expatrie",
    categoryLabel: "Expatrié",
    expertise: "Retour en France & impatriation",
    profil: "Expatrié en retour en France",
    age: "50 ans · 12 ans à Singapour",
    duration: "Mission 9 mois",
    image: casExpatrie,
    contexte:
      "Cadre de retour en France après 12 ans en Asie. Patrimoine constitué à l'étranger (comptes bancaires, assurance-vie luxembourgeoise, biens immobiliers en Asie). Revenus futurs en France, pas de résidence principale.",
    diagnostic: [
      "Obligations déclaratives 3916 et IFI non encore préparées",
      "Régime des impatriés (article 155 B CGI) éligible mais non activé",
      "Détention directe des actifs étrangers : risque fiscal et successoral majeur",
    ],
    strategie: [
      "Audit complet des obligations déclaratives",
      "Activation du régime impatriés (exonération partielle 8 ans)",
      "Structuration de la détention via SCI / holding",
      "Rapatriement progressif des avoirs vers contrats français/luxembourgeois",
    ],
    resultat:
      "Atterrissage fiscal sécurisé. Le client bénéficie pleinement du régime impatriés tout en conservant la flexibilité de ses placements luxembourgeois et asiatiques.",
    kpis: [
      { label: "Économie sur 8 ans", value: "−310 k€", icon: TrendingDown },
      { label: "Conformité", value: "100 %", icon: ShieldCheck },
      { label: "Délai sécurisation", value: "9 mois", icon: TrendingUp },
    ],
    vigilance:
      "Le retour en France impose des déclarations spécifiques (formulaire 3916, déclaration de patrimoine IFI). Le non-respect de ces obligations expose à des pénalités significatives.",
  },
];

/* ------------------------------------------------------------------ */
/*  Composants                                                         */
/* ------------------------------------------------------------------ */

function CategoryFilter({
  active,
  onChange,
  counts,
}: {
  active: Category | "tous";
  onChange: (id: Category | "tous") => void;
  counts: Record<string, number>;
}) {
  return (
    <div className="flex flex-wrap gap-2 md:gap-2.5">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isActive = active === cat.id;
        const count = cat.id === "tous" ? casClients.length : counts[cat.id] ?? 0;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onChange(cat.id)}
            aria-pressed={isActive}
            className={`group inline-flex items-center gap-2.5 px-4 md:px-5 py-2.5 rounded-full text-[12px] md:text-[13px] font-medium tracking-wide transition-all duration-300 ${
              isActive
                ? "bg-foreground text-background shadow-lg"
                : "border border-foreground/15 text-foreground/65 hover:text-foreground hover:border-foreground/35"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{cat.label}</span>
            <span
              className={`text-[10px] tabular-nums px-1.5 py-0.5 rounded-full ${
                isActive ? "bg-background/20 text-background/80" : "bg-foreground/5 text-foreground/45"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function CaseCard({ cas, index }: { cas: CasClient; index: number }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-[1.5rem] border border-foreground/10 bg-white/55 backdrop-blur-md shadow-[0_30px_80px_-40px_hsl(var(--foreground)/0.18)]"
    >
      <div className="grid lg:grid-cols-12 gap-0">
        {/* Visual column */}
        <div className="lg:col-span-4 relative min-h-[260px] lg:min-h-full">
          <ParallaxImage
            src={cas.image}
            alt=""
            className="absolute inset-0 w-full h-full"
            rounded="rounded-none"
            intensity={120}
            overlayClassName="bg-gradient-to-br from-foreground/30 via-foreground/10 to-transparent"
          />
          <div className="absolute inset-0 p-7 md:p-8 flex flex-col justify-between text-background z-10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-[0.32em] uppercase font-medium text-background/85">
                Cas {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-[10px] tracking-[0.18em] uppercase font-medium px-2.5 py-1 rounded-full bg-background/15 backdrop-blur-md text-background/95">
                {cas.categoryLabel}
              </span>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-background/70 mb-2 font-medium">
                {cas.expertise}
              </p>
              <h3 className="font-heading text-xl md:text-2xl font-light leading-snug tracking-tight mb-2">
                {cas.profil}
              </h3>
              <p className="text-[11px] text-background/75 font-light tracking-wide">
                {cas.age} · {cas.duration}
              </p>
            </div>
          </div>
        </div>

        {/* Content column */}
        <div className="lg:col-span-8 p-7 md:p-10">
          {/* KPI row */}
          <div className="grid grid-cols-3 gap-4 md:gap-6 mb-8 pb-8 border-b border-foreground/10">
            {cas.kpis.map((k) => {
              const Icon = k.icon;
              return (
                <div key={k.label}>
                  <div className="flex items-center gap-1.5 text-foreground/45 mb-1.5">
                    <Icon className="w-3 h-3" />
                    <span className="text-[9px] md:text-[10px] tracking-[0.2em] uppercase font-medium">
                      {k.label}
                    </span>
                  </div>
                  <p className="font-heading text-xl md:text-3xl font-light text-foreground tracking-tight tabular-nums leading-none">
                    {k.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* 4 chapters */}
          <div className="grid md:grid-cols-2 gap-x-10 gap-y-7">
            <Chapter num="01" title="Contexte" body={cas.contexte} />
            <Chapter num="02" title="Diagnostic" items={cas.diagnostic} variant="diagnostic" />
            <Chapter num="03" title="Stratégie" items={cas.strategie} variant="strategie" />
            <Chapter num="04" title="Résultat" body={cas.resultat} highlight />
          </div>

          {/* Vigilance */}
          <div className="mt-8 pt-6 border-t border-foreground/10">
            <div className="flex items-start gap-3">
              <div className="mt-1 w-1 h-1 rounded-full bg-[hsl(var(--electric))] flex-shrink-0" />
              <div>
                <p className="text-[10px] tracking-[0.25em] uppercase text-foreground/45 mb-1.5 font-medium">
                  Point de vigilance
                </p>
                <p className="text-foreground/65 text-xs md:text-[13px] leading-relaxed font-light italic">
                  {cas.vigilance}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function Chapter({
  num,
  title,
  body,
  items,
  variant,
  highlight,
}: {
  num: string;
  title: string;
  body?: string;
  items?: string[];
  variant?: "diagnostic" | "strategie";
  highlight?: boolean;
}) {
  return (
    <div>
      <div className="flex items-baseline gap-3 mb-3">
        <span className="text-[10px] tabular-nums text-foreground/35 font-medium tracking-[0.2em]">
          {num}
        </span>
        <p
          className={`text-[10px] tracking-[0.28em] uppercase font-medium ${
            highlight ? "text-[hsl(var(--electric))]" : "text-foreground/55"
          }`}
        >
          {title}
        </p>
      </div>
      {body && (
        <p
          className={`text-sm leading-relaxed font-light ${
            highlight ? "text-foreground/85" : "text-foreground/70"
          }`}
        >
          {body}
        </p>
      )}
      {items && (
        <ul className="space-y-2">
          {items.map((it) => (
            <li
              key={it}
              className="text-sm text-foreground/70 font-light flex items-start gap-3 leading-relaxed"
            >
              <span
                aria-hidden
                className={`mt-2 w-1 h-1 rounded-full flex-shrink-0 ${
                  variant === "strategie" ? "bg-[hsl(var(--electric))]" : "bg-foreground/30"
                }`}
              />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function VerbatimBlock({
  verbatim,
}: {
  verbatim: { quote: string; author: string };
}) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7 }}
      className="relative max-w-3xl mx-auto py-10"
    >
      <span
        aria-hidden
        className="absolute -top-2 left-0 font-heading text-7xl md:text-8xl text-foreground/10 leading-none select-none"
      >
        “
      </span>
      <blockquote className="pl-12 md:pl-16">
        <p className="font-heading text-xl md:text-2xl lg:text-3xl font-light text-foreground/85 leading-snug tracking-tight italic">
          {verbatim.quote}
        </p>
        <figcaption className="mt-5 text-[11px] tracking-[0.25em] uppercase text-foreground/45 font-medium">
          — {verbatim.author}
        </figcaption>
      </blockquote>
    </motion.figure>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function CasClientsPage() {
  useScrollReveal();
  const [active, setActive] = useState<Category | "tous">("tous");

  const counts = useMemo(() => {
    return casClients.reduce<Record<string, number>>((acc, c) => {
      acc[c.category] = (acc[c.category] ?? 0) + 1;
      return acc;
    }, {});
  }, []);

  const filtered = useMemo(
    () => (active === "tous" ? casClients : casClients.filter((c) => c.category === active)),
    [active],
  );

  // Stats globales (intro éditoriale)
  const stats = [
    { value: "180+", label: "Familles accompagnées" },
    { value: "12 ans", label: "D'expérience moyenne" },
    { value: "97 %", label: "Taux de fidélisation" },
    { value: "30+", label: "Partenaires institutionnels" },
  ];

  return (
    <>
      <Seo
        title="Cas clients — études patrimoniales anonymisées | KANTI"
        description="Six études de cas patrimoniales : cadre dirigeant, couple, chef d'entreprise, profession libérale, investisseur immobilier, expatrié. Contexte, diagnostic, stratégie et résultats chiffrés."
        jsonLd={breadcrumbJsonLd([
          { name: "Accueil", url: "/" },
          { name: "Cas clients", url: "/cas-clients" },
        ])}
      />
      <Header />
      <main id="main">
        <PageHero
          title="Études de cas"
          subtitle="Six situations patrimoniales réelles, anonymisées. Pour chacune : le contexte, le diagnostic du cabinet, la stratégie déployée et les résultats chiffrés."
          breadcrumb="Cabinet · Études de cas"
        />

        {/* Intro éditoriale + stats */}
        <section className="section-padding section-glass relative overflow-hidden">
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-end mb-16 reveal">
              <div className="lg:col-span-6">
                <div className="electric-line mb-6" />
                <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-5 font-medium">
                  Méthodologie éditoriale
                </p>
                <h2 className="text-3xl md:text-5xl font-heading font-light text-foreground leading-[1.05] tracking-tight">
                  Des situations réelles,<br />
                  <span className="italic text-foreground/65">rigoureusement anonymisées</span>.
                </h2>
              </div>
              <div className="lg:col-span-6 lg:pl-10 lg:border-l border-foreground/10">
                <p className="text-foreground/70 text-base md:text-lg leading-relaxed font-light">
                  Chaque cas présenté ici s'inspire d'un dossier réel suivi par
                  le cabinet. Les noms, montants et secteurs ont été modifiés
                  pour préserver la confidentialité absolue de nos clients,
                  sans altérer la logique patrimoniale ni les résultats
                  obtenus.
                </p>
              </div>
            </div>

            {/* Stats band */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-foreground/10 rounded-2xl overflow-hidden border border-foreground/10 reveal">
              {stats.map((s) => (
                <div key={s.label} className="bg-background/70 backdrop-blur-md p-7 md:p-9">
                  <p className="font-heading text-3xl md:text-5xl font-light text-foreground tracking-tight tabular-nums leading-none mb-3">
                    {s.value}
                  </p>
                  <p className="text-[10px] md:text-[11px] tracking-[0.22em] uppercase text-foreground/55 font-medium">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filtres + cas */}
        <section className="section-padding texture-paper relative overflow-hidden">
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="mb-10 reveal">
              <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-4 font-medium">
                Filtrer par profil
              </p>
              <CategoryFilter active={active} onChange={setActive} counts={counts} />
            </div>

            <div className="space-y-20 md:space-y-28 lg:space-y-32">
              <AnimatePresence mode="popLayout">
                {filtered.map((cas, i) => (
                  <div key={cas.profil} className="space-y-20 md:space-y-28">
                    <CaseCard cas={cas} index={casClients.indexOf(cas)} />
                    {/* Verbatim intercalé toutes les 2 cartes */}
                    {cas.verbatim && (i + 1) % 2 === 0 && (
                      <VerbatimBlock verbatim={cas.verbatim} />
                    )}
                  </div>
                ))}
              </AnimatePresence>
            </div>

            {filtered.length === 0 && (
              <p className="text-center text-foreground/50 font-light py-20">
                Aucun cas ne correspond à ce filtre pour le moment.
              </p>
            )}
          </div>
        </section>

        {/* Disclaimer professionnel */}
        <section className="px-6 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-6 md:p-8">
              <div className="flex items-start gap-4">
                <ShieldCheck className="w-4 h-4 text-foreground/40 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-[10px] tracking-[0.28em] uppercase text-foreground/50 mb-2 font-medium">
                    Mention de transparence
                  </p>
                  <p className="text-[12px] md:text-[13px] text-foreground/55 font-light leading-relaxed">
                    Les cas présentés sont des illustrations à valeur
                    pédagogique, inspirés de missions réelles et intégralement
                    anonymisés (identités, montants, secteurs, dates). Les
                    résultats chiffrés correspondent à des situations
                    spécifiques et ne préjugent pas de performances futures.
                    Toute recommandation patrimoniale donne lieu à une lettre
                    de mission préalable et à une analyse personnalisée. Les
                    performances passées ne sont pas un indicateur fiable des
                    performances futures. Données conformes aux exigences
                    AMF et CNCEF.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

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