/**
 * Centralised catalogue of patrimonial products.
 * Feeds both the in-page ProductGrid (FlipCards) and the dedicated
 * sub-pages at /<expertise-slug>/<product-slug>.
 */

export interface Product {
  slug: string;
  tag: string;
  title: string;
  pitch: string;            // recto, 1 line
  forWhom: string;          // verso, pour qui
  benefits: string[];       // verso, bullets
  fiscality: string;        // verso, fiscalité résumée
  horizon?: string;         // verso, horizon recommandé
}

export interface ExpertiseCategory {
  slug: string;             // matches the existing expertise route
  label: string;            // breadcrumb label
  parentTitle: string;      // human title of the parent expertise
  parentEyebrow: string;
  products: Product[];
}

export const expertiseCatalog: ExpertiseCategory[] = [
  {
    slug: "gestion-patrimoniale",
    label: "Gestion patrimoniale",
    parentTitle: "Gestion patrimoniale & placements",
    parentEyebrow: "Allocation & placements",
    products: [
      {
        slug: "assurance-vie",
        tag: "Épargne",
        title: "Assurance-vie haut de gamme",
        pitch: "Le couteau suisse patrimonial : épargne, transmission, fiscalité.",
        forWhom: "Tout patrimoine constitué, de l'épargne de précaution à la stratégie successorale long terme.",
        benefits: [
          "Architecture ouverte multi-supports",
          "Fonds en euros + UC actives & indicielles",
          "Avance possible sans déblocage du contrat",
          "Fiscalité allégée après 8 ans",
        ],
        fiscality: "Abattement 4 600 € / 9 200 € après 8 ans. Hors succession à hauteur de 152 500 € par bénéficiaire (article 990 I).",
        horizon: "8 ans et +",
      },
      {
        slug: "per-individuel",
        tag: "Retraite",
        title: "PER individuel",
        pitch: "Préparer sa retraite tout en réduisant son impôt aujourd'hui.",
        forWhom: "Actifs imposés à partir de la TMI 30 %, particulièrement pertinents en phase haute de carrière.",
        benefits: [
          "Versements déductibles du revenu imposable",
          "Sortie en capital, en rente ou mixte",
          "Cas de déblocage anticipé (résidence principale)",
          "Transmission hors succession sous conditions",
        ],
        fiscality: "Déduction plafonnée (10 % des revenus pro). Imposition à la sortie selon le régime choisi.",
        horizon: "Jusqu'à la retraite",
      },
      {
        slug: "compte-titres-pea",
        tag: "Marchés",
        title: "Compte-titres & PEA",
        pitch: "Accéder directement aux marchés financiers, sans intermédiation.",
        forWhom: "Investisseurs avertis souhaitant gérer en direct ou en mandat une poche dynamique.",
        benefits: [
          "Titres vifs, ETF, fonds thématiques",
          "PEA : exonération après 5 ans",
          "Mandats de gestion sur mesure",
          "Liquidité totale",
        ],
        fiscality: "PEA : exonération d'IR après 5 ans (PS dus). CTO : flat tax 30 % ou barème.",
        horizon: "5 ans et +",
      },
      {
        slug: "scpi",
        tag: "Immobilier papier",
        title: "SCPI & immobilier papier",
        pitch: "L'immobilier sans la gestion, mutualisé sur des centaines d'actifs.",
        forWhom: "Recherche de revenus complémentaires réguliers et de diversification immobilière.",
        benefits: [
          "Ticket d'entrée modéré",
          "Diversification géographique & sectorielle",
          "Mutualisation du risque locatif",
          "Possible en assurance-vie ou démembrement",
        ],
        fiscality: "Revenus fonciers (TMI + PS) ou fiscalité de l'enveloppe (AV, PER, démembrement).",
        horizon: "10 ans et +",
      },
      {
        slug: "private-equity",
        tag: "Non coté",
        title: "Private equity & dette privée",
        pitch: "S'exposer aux entreprises non cotées, moteur de surperformance long terme.",
        forWhom: "Profils éligibles (investisseurs avertis), poche satellite d'un patrimoine déjà diversifié.",
        benefits: [
          "Décorrélation des marchés cotés",
          "Espérance de rendement supérieure",
          "Accès aux fonds institutionnels",
          "Lock-up assumé (illiquidité contrôlée)",
        ],
        fiscality: "Fiscalité variable selon le véhicule (FPCI, FCPR, holding). Avantages possibles à l'entrée et à la sortie.",
        horizon: "8 à 12 ans",
      },
    ],
  },
  {
    slug: "fiscalite",
    label: "Fiscalité",
    parentTitle: "Fiscalité du patrimoine",
    parentEyebrow: "Stratégie fiscale",
    products: [
      {
        slug: "audit-ir",
        tag: "Impôt sur le revenu",
        title: "Audit IR & restructuration",
        pitch: "Identifier les leviers réels avant de souscrire un produit.",
        forWhom: "Foyers à TMI 30 %, 41 % ou 45 % cherchant à structurer durablement.",
        benefits: [
          "Analyse complète du foyer fiscal",
          "Cartographie des leviers actifs",
          "Restructuration des revenus",
          "Projection à 3-5 ans",
        ],
        fiscality: "Optimisation conforme dans le respect du plafonnement global des niches (10 000 €).",
      },
      {
        slug: "ifi",
        tag: "IFI",
        title: "Stratégie IFI",
        pitch: "Réduire l'assiette taxable sans appauvrir votre patrimoine.",
        forWhom: "Patrimoine immobilier net taxable supérieur à 1,3 M€.",
        benefits: [
          "Audit complet de l'assiette",
          "Démembrement temporaire ou viager",
          "Contrats de capitalisation luxembourgeois",
          "Restructuration en holding",
        ],
        fiscality: "Barème progressif IFI de 0,5 % à 1,5 %. Plafonnement IR + IFI à 75 % des revenus.",
      },
      {
        slug: "revenus-fonciers",
        tag: "Foncier",
        title: "Revenus fonciers",
        pitch: "Choisir le bon régime, c'est déjà optimiser.",
        forWhom: "Bailleurs nus ou meublés, en nom propre ou en société.",
        benefits: [
          "Arbitrage location nue / meublée",
          "Micro vs réel, calculs comparatifs",
          "Stratégie de déficit foncier",
          "Bascule SCI à l'IS si pertinent",
        ],
        fiscality: "Nu : revenus fonciers (TMI + PS). Meublé : BIC, possible amortissement (LMNP).",
      },
      {
        slug: "plus-values",
        tag: "Cession",
        title: "Plus-values mobilières & immobilières",
        pitch: "Anticiper la cession pour réduire la facture fiscale.",
        forWhom: "Cédants d'actifs immobiliers, de titres ou d'entreprise.",
        benefits: [
          "Calendrier optimisé",
          "Apport-cession (150-0 B ter)",
          "Report et sursis d'imposition",
          "Purge successorale",
        ],
        fiscality: "Mobilier : flat tax 30 % ou barème. Immobilier : abattements pour durée de détention.",
      },
      {
        slug: "holding-patrimoniale",
        tag: "Structuration",
        title: "Holding patrimoniale",
        pitch: "Une structure pour gérer, optimiser et transmettre.",
        forWhom: "Patrimoine professionnel ou immobilier diversifié, projet de transmission.",
        benefits: [
          "Régime mère-fille (95 %)",
          "Intégration fiscale possible",
          "Optimisation des remontées de dividendes",
          "Préparation Pacte Dutreil",
        ],
        fiscality: "IS au niveau de la holding. Remontée de dividendes quasi exonérée sous régime mère-fille.",
      },
    ],
  },
  {
    slug: "patrimoine-professionnel",
    label: "Patrimoine pro",
    parentTitle: "Patrimoine professionnel",
    parentEyebrow: "Dirigeants & associés",
    products: [
      {
        slug: "remuneration-dirigeant",
        tag: "Rémunération",
        title: "Arbitrage salaire / dividendes",
        pitch: "Le bon équilibre entre net immédiat, retraite et fiscalité.",
        forWhom: "Dirigeants TNS ou assimilés salariés, gérants de SARL, présidents de SAS.",
        benefits: [
          "Modélisation comparée",
          "Impact retraite & prévoyance",
          "Optimisation cotisations sociales",
          "Anticipation IR",
        ],
        fiscality: "Salaires : IR + cotisations. Dividendes : flat tax 30 % (+ cotisations TNS si SARL majoritaire).",
      },
      {
        slug: "tresorerie-entreprise",
        tag: "Trésorerie",
        title: "Placement de trésorerie",
        pitch: "Faire travailler l'excédent de trésorerie sans bloquer l'activité.",
        forWhom: "Sociétés disposant d'une trésorerie excédentaire stable.",
        benefits: [
          "Contrats de capitalisation",
          "Comptes à terme",
          "OPCVM monétaires & obligataires",
          "Liquidité paramétrable",
        ],
        fiscality: "Imposition à l'IS au taux normal. Régime spécifique pour les contrats de capi société.",
      },
      {
        slug: "holding-structuration",
        tag: "Structuration",
        title: "Holding & structuration juridique",
        pitch: "Reprendre la main sur la détention de vos actifs.",
        forWhom: "Dirigeants détenant directement plusieurs sociétés ou actifs significatifs.",
        benefits: [
          "Centralisation des participations",
          "Régime mère-fille",
          "Préparation transmission Dutreil",
          "Effet de levier financement",
        ],
        fiscality: "Régime mère-fille (95 % d'exonération sur dividendes). Intégration fiscale optionnelle.",
      },
      {
        slug: "prevoyance-dirigeant",
        tag: "Prévoyance",
        title: "Prévoyance & homme-clé",
        pitch: "Protéger le dirigeant, ses associés et son entreprise.",
        forWhom: "Dirigeants, associés clés, professions libérales.",
        benefits: [
          "Garantie homme-clé",
          "Garantie croisée entre associés",
          "Prévoyance décès / invalidité",
          "Contrat Madelin",
        ],
        fiscality: "Cotisations Madelin déductibles dans la limite des plafonds réglementaires.",
      },
      {
        slug: "cession-entreprise",
        tag: "Cession",
        title: "Cession d'entreprise",
        pitch: "Préparer la cession 2 à 5 ans avant change tout.",
        forWhom: "Dirigeants envisageant une cession à moyen terme.",
        benefits: [
          "Valorisation préalable",
          "Apport-cession (150-0 B ter)",
          "Pacte Dutreil cession",
          "Réinvestissement structuré",
        ],
        fiscality: "Plus-value : flat tax 30 % ou barème + abattements pour durée de détention (titres pré-2018).",
      },
    ],
  },
  {
    slug: "financement",
    label: "Financement",
    parentTitle: "Financement & crédit",
    parentEyebrow: "Courtage indépendant",
    products: [
      {
        slug: "credit-residence-principale",
        tag: "Résidentiel",
        title: "Crédit résidence principale",
        pitch: "Acquérir, renégocier ou racheter au meilleur coût total.",
        forWhom: "Primo-accédants, secundo-accédants, projets de renégociation.",
        benefits: [
          "Étude de capacité d'emprunt",
          "Mise en concurrence bancaire",
          "Délégation d'assurance",
          "Modulation & remboursement anticipé",
        ],
        fiscality: "Intérêts non déductibles. Exonération de plus-value sur la résidence principale.",
      },
      {
        slug: "credit-locatif",
        tag: "Investissement",
        title: "Financement locatif",
        pitch: "L'effet de levier au service de votre patrimoine.",
        forWhom: "Investisseurs immobiliers en nom propre ou en SCI.",
        benefits: [
          "Maximisation de l'effet de levier",
          "Intérêts déductibles des loyers",
          "Montages SCI / LMNP",
          "Lissage de trésorerie",
        ],
        fiscality: "Intérêts d'emprunt déductibles des revenus fonciers (régime réel).",
      },
      {
        slug: "credit-lombard",
        tag: "Patrimonial",
        title: "Crédit lombard",
        pitch: "Emprunter sans liquider vos placements.",
        forWhom: "Patrimoine financier conséquent, besoin de liquidité ponctuel.",
        benefits: [
          "Pas de cession d'actifs",
          "Mise en place rapide",
          "Taux compétitifs",
          "Souplesse de remboursement",
        ],
        fiscality: "Intérêts potentiellement déductibles selon l'usage des fonds.",
      },
      {
        slug: "credit-professionnel",
        tag: "Pro",
        title: "Crédit professionnel",
        pitch: "Financer la croissance, l'acquisition ou la restructuration.",
        forWhom: "Dirigeants, repreneurs, sociétés en développement.",
        benefits: [
          "Crédit-bail, prêt amortissable, MLT",
          "LBO & refinancement holding",
          "Garanties optimisées",
          "Coordination expert-comptable",
        ],
        fiscality: "Intérêts déductibles du résultat fiscal de la société.",
      },
      {
        slug: "assurance-emprunteur",
        tag: "Assurance",
        title: "Délégation d'assurance",
        pitch: "Réduire significativement le coût total de votre crédit.",
        forWhom: "Tout emprunteur avec contrat groupe bancaire en cours ou à venir.",
        benefits: [
          "Loi Lemoine : changement à tout moment",
          "Comparaison des garanties",
          "Économies substantielles",
          "Couverture sur mesure",
        ],
        fiscality: "Cotisations généralement non déductibles (sauf locatif réel).",
      },
    ],
  },
  {
    slug: "transmission-patrimoine-famille",
    label: "Transmission",
    parentTitle: "Transmission du patrimoine",
    parentEyebrow: "Héritage & famille",
    products: [
      {
        slug: "donation-partage",
        tag: "Donation",
        title: "Donation-partage",
        pitch: "Répartir de son vivant pour figer les valeurs et éviter les conflits.",
        forWhom: "Familles avec plusieurs enfants, patrimoine déjà constitué.",
        benefits: [
          "Abattement 100 000 € / enfant / 15 ans",
          "Valeurs figées au jour de la donation",
          "Évite les rapports successoraux",
          "Acte authentique sécurisé",
        ],
        fiscality: "Abattements renouvelables tous les 15 ans. Barème progressif des droits de donation.",
      },
      {
        slug: "demembrement",
        tag: "Démembrement",
        title: "Démembrement de propriété",
        pitch: "Donner la nue-propriété, garder l'usufruit et les revenus.",
        forWhom: "Parents souhaitant transmettre tout en conservant la jouissance.",
        benefits: [
          "Réduction de l'assiette taxable",
          "Maintien des revenus pour l'usufruitier",
          "Réunion automatique au décès",
          "Hors IFI sous conditions",
        ],
        fiscality: "Droits calculés sur la valeur de la nue-propriété (barème art. 669 CGI).",
      },
      {
        slug: "assurance-vie-transmission",
        tag: "Hors succession",
        title: "Assurance-vie & clause bénéficiaire",
        pitch: "Transmettre hors succession, à qui vous voulez, en maîtrisant la fiscalité.",
        forWhom: "Toute personne souhaitant gratifier un proche, conjoint, partenaire ou tiers.",
        benefits: [
          "152 500 € par bénéficiaire (avant 70 ans)",
          "Clause bénéficiaire sur mesure",
          "Hors masse successorale",
          "Démembrement de la clause possible",
        ],
        fiscality: "Art. 990 I : 20 % puis 31,25 %. Art. 757 B : abattement 30 500 € après 70 ans.",
      },
      {
        slug: "pacte-dutreil",
        tag: "Entreprise",
        title: "Pacte Dutreil",
        pitch: "Transmettre l'entreprise familiale en réduisant les droits de 75 %.",
        forWhom: "Dirigeants envisageant la transmission familiale de leur société.",
        benefits: [
          "Exonération 75 % de l'assiette",
          "Cumul avec donation en pleine ou nue-propriété",
          "Réduction supplémentaire de 50 %",
          "Engagement collectif puis individuel",
        ],
        fiscality: "Engagement collectif 2 ans + individuel 4 ans + fonctions de direction.",
      },
      {
        slug: "protection-conjoint",
        tag: "Conjoint",
        title: "Protection du conjoint survivant",
        pitch: "Sécuriser le conjoint sans léser les enfants.",
        forWhom: "Couples mariés, pacsés, familles recomposées.",
        benefits: [
          "Donation entre époux",
          "Changement de régime matrimonial",
          "Testament & legs",
          "Mandat de protection future",
        ],
        fiscality: "Conjoint et partenaire pacsé : exonération totale des droits de succession.",
      },
    ],
  },
  {
    slug: "patrimoine-immobilier-strategie",
    label: "Immobilier",
    parentTitle: "Patrimoine immobilier & stratégie",
    parentEyebrow: "Pierre & stratégie",
    products: [
      {
        slug: "residence-principale",
        tag: "Résidentiel",
        title: "Résidence principale",
        pitch: "Le 1er actif des Français, à raisonner comme un actif patrimonial.",
        forWhom: "Acquéreurs ou propriétaires en arbitrage, accession ou changement de résidence.",
        benefits: [
          "Arbitrage achat / location",
          "Capacité d'emprunt optimale",
          "Exonération de plus-value",
          "Hors IFI",
        ],
        fiscality: "Exonération totale de la plus-value à la cession. Hors assiette IFI.",
      },
      {
        slug: "investissement-locatif",
        tag: "Locatif",
        title: "Investissement locatif",
        pitch: "Constituer un patrimoine en s'appuyant sur l'effet de levier.",
        forWhom: "Investisseurs cherchant à se constituer un patrimoine à crédit.",
        benefits: [
          "Choix nu / meublé / LMNP",
          "Effet de levier crédit",
          "Revenus complémentaires",
          "Capitalisation long terme",
        ],
        fiscality: "Nu : revenus fonciers. Meublé : BIC + amortissement. LMNP : optimisation forte.",
      },
      {
        slug: "sci-patrimoniale",
        tag: "Sociétaire",
        title: "SCI patrimoniale",
        pitch: "Détenir, gérer et transmettre l'immobilier en société.",
        forWhom: "Familles, indivision à fluidifier, projet de transmission.",
        benefits: [
          "Souplesse de gestion",
          "Transmission en parts (démembrement)",
          "Choix IR / IS",
          "Évite l'indivision",
        ],
        fiscality: "SCI à l'IR : transparence. SCI à l'IS : amortissement mais plus-value pro à la cession.",
      },
      {
        slug: "nue-propriete",
        tag: "Démembrement",
        title: "Nue-propriété",
        pitch: "Acquérir avec une décote forte, sans fiscalité immédiate.",
        forWhom: "Investisseurs fiscalisés (TMI 30 %+) avec horizon long.",
        benefits: [
          "Décote 30 à 40 %",
          "Aucune fiscalité sur la période",
          "Hors IFI",
          "Pleine propriété au terme",
        ],
        fiscality: "Aucun revenu donc aucune imposition. Plus-value calculée sur le prix démembré à la cession.",
      },
      {
        slug: "scpi-immobilier",
        tag: "Pierre-papier",
        title: "SCPI",
        pitch: "L'immobilier sans la gestion, mutualisé et accessible.",
        forWhom: "Recherche de revenus passifs et de diversification.",
        benefits: [
          "Ticket d'entrée modéré",
          "Mutualisation des risques",
          "Possible en AV ou démembrement",
          "Diversification sectorielle",
        ],
        fiscality: "Revenus fonciers ou fiscalité de l'enveloppe selon le mode de détention.",
      },
    ],
  },
];

export function getCategory(slug: string) {
  return expertiseCatalog.find((c) => c.slug === slug);
}

export function getProduct(categorySlug: string, productSlug: string) {
  const cat = getCategory(categorySlug);
  if (!cat) return null;
  const product = cat.products.find((p) => p.slug === productSlug);
  if (!product) return null;
  return { category: cat, product };
}

export function getAllProductRoutes() {
  return expertiseCatalog.flatMap((cat) =>
    cat.products.map((p) => ({
      path: `/${cat.slug}/${p.slug}`,
      categorySlug: cat.slug,
      productSlug: p.slug,
    })),
  );
}