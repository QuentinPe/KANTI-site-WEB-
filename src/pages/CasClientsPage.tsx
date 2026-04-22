import { useScrollReveal } from "@/hooks/useScrollReveal";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PageCTA from "@/components/PageCTA";
import ParallaxImage from "@/components/ParallaxImage";
import casCadre from "@/assets/cas-cadre.jpg";
import casCouple from "@/assets/cas-couple.jpg";
import casDirigeant from "@/assets/cas-dirigeant.jpg";
import casLiberal from "@/assets/cas-liberal.jpg";
import casImmobilier from "@/assets/cas-immobilier.jpg";
import casExpatrie from "@/assets/cas-expatrie.jpg";

const images = [casCadre, casCouple, casDirigeant, casLiberal, casImmobilier, casExpatrie];

const casClients = [
  {
    profil: "Cadre dirigeant fortement fiscalisé",
    contexte: "Un directeur général de 48 ans, marié, deux enfants. Revenus annuels supérieurs à 250 000 €, tranche marginale à 45 %. Patrimoine financier important mais concentré sur un seul contrat d'assurance-vie bancaire. Aucune optimisation fiscale en place.",
    enjeux: [
      "Réduire l'impôt sur le revenu de façon significative et pérenne",
      "Diversifier le patrimoine financier et réduire les frais de gestion",
      "Préparer la transmission aux enfants dès maintenant",
    ],
    axes: [
      "Ouverture d'un PER individuel avec versements déductibles calibrés",
      "Transfert vers des contrats d'assurance-vie en architecture ouverte, avec allocation diversifiée",
      "Démembrement de la clause bénéficiaire pour optimiser la transmission",
      "Investissement en nue-propriété de SCPI pour réduire l'IFI",
    ],
    vigilance: "Le passage d'un contrat bancaire vers un contrat en architecture ouverte nécessite une analyse des éventuels droits acquis (taux garanti sur le fonds en euros).",
  },
  {
    profil: "Couple avec transmission à préparer",
    contexte: "Un couple de 60 ans, deux enfants adultes. Patrimoine immobilier (résidence principale + deux biens locatifs) et patrimoine financier (assurance-vie, comptes-titres). Aucune donation réalisée, aucune disposition testamentaire.",
    enjeux: [
      "Anticiper la succession pour protéger le conjoint survivant et les enfants",
      "Utiliser les abattements de donation avant qu'il ne soit trop tard",
      "Simplifier la gestion du patrimoine immobilier locatif",
    ],
    axes: [
      "Donation-partage de la nue-propriété des biens locatifs aux enfants",
      "Rédaction d'une clause bénéficiaire démembrée sur les contrats d'assurance-vie",
      "Mise en place d'une donation entre époux (donation au dernier vivant)",
      "Simulation successorale pour vérifier les droits en cas de décès de chaque conjoint",
    ],
    vigilance: "La donation de biens locatifs impose de bien évaluer l'impact fiscal pour les enfants (revenus fonciers, IFI) et de prévoir les modalités de gestion pendant la période de démembrement.",
  },
  {
    profil: "Chef d'entreprise avec trésorerie excédentaire",
    contexte: "Un dirigeant de 52 ans, gérant majoritaire d'une SARL de services, CA de 2 M€, trésorerie excédentaire de 800 000 € sur le compte courant de la société. Rémunération non optimisée (100 % en salaire), pas de holding.",
    enjeux: [
      "Placer la trésorerie excédentaire de façon pertinente",
      "Optimiser la rémunération globale (salaire + dividendes + avantages)",
      "Structurer le patrimoine en vue d'une cession à 5-7 ans",
    ],
    axes: [
      "Placement de la trésorerie sur des contrats de capitalisation personne morale",
      "Simulation d'un mix rémunération / dividendes avec impact fiscal et social",
      "Création d'une holding par apport de titres pour préparer la cession (article 150-0 B ter)",
      "Mise en place d'un contrat retraite et d'une assurance homme-clé",
    ],
    vigilance: "Le placement de trésorerie en société doit respecter les contraintes comptables (provision pour dépréciation) et la cohérence avec l'objet social de l'entreprise.",
  },
  {
    profil: "Profession libérale préparant sa retraite",
    contexte: "Un médecin spécialiste de 55 ans, exerçant en libéral, revenus BNC de 180 000 €. Cotisations CARMF, pas de PER, un contrat Madelin ancien peu performant. Patrimoine concentré sur la résidence principale et un livret.",
    enjeux: [
      "Combler un déficit de revenus à la retraite (taux de remplacement < 40 %)",
      "Constituer un patrimoine financier en 10 ans",
      "Optimiser la fiscalité des versements d'épargne retraite",
    ],
    axes: [
      "Ouverture d'un PER avec versements déductibles optimisés (plafond non utilisé sur 3 ans)",
      "Transfert du contrat Madelin vers un PER plus performant",
      "Constitution d'un portefeuille d'assurance-vie diversifié en complément",
      "Investissement locatif en LMNP pour générer des revenus complémentaires faiblement fiscalisés",
    ],
    vigilance: "Le médecin libéral doit anticiper la baisse de revenus liée au ralentissement d'activité et prévoir une liquidité suffisante pour les années de transition.",
  },
  {
    profil: "Investisseur immobilier en restructuration",
    contexte: "Un investisseur de 45 ans, propriétaire de 6 biens locatifs détenus en nom propre. Revenus fonciers importants, tranche marginale à 41 %, prélèvements sociaux significatifs. Gestion chronophage, peu de diversification.",
    enjeux: [
      "Réduire la fiscalité sur les revenus fonciers",
      "Simplifier la gestion et préparer la transmission du parc",
      "Diversifier vers d'autres classes d'actifs",
    ],
    axes: [
      "Apport des biens à une SCI à l'IS pour lisser la fiscalité et faciliter la transmission",
      "Arbitrage partiel vers des SCPI en assurance-vie (revenus capitalisés, fiscalité allégée)",
      "Donation de parts de SCI en nue-propriété aux enfants",
      "Constitution d'un portefeuille financier diversifié pour réduire la concentration immobilière",
    ],
    vigilance: "L'apport de biens à une SCI génère des droits d'enregistrement et une plus-value d'apport. L'analyse du bilan fiscal global est indispensable avant toute opération.",
  },
  {
    profil: "Expatrié en retour en France",
    contexte: "Un cadre de 50 ans, de retour en France après 12 ans à Singapour. Patrimoine constitué à l'étranger (comptes bancaires, assurance-vie luxembourgeoise, biens immobiliers en Asie). Revenus futurs en France, pas de résidence principale.",
    enjeux: [
      "Organiser le rapatriement des avoirs en conformité avec les obligations déclaratives",
      "Structurer la détention des actifs étrangers",
      "Reconstituer une stratégie patrimoniale adaptée au contexte fiscal français",
    ],
    axes: [
      "Audit des obligations déclaratives (comptes étrangers, assurance-vie, trusts)",
      "Analyse de l'éventuel régime des impatriés (article 155 B du CGI)",
      "Structuration de la détention des biens étrangers (SCI, holding)",
      "Rapatriement progressif des avoirs vers des contrats français ou luxembourgeois",
    ],
    vigilance: "Le retour en France impose des déclarations spécifiques (formulaire 3916, déclaration de patrimoine IFI). Le non-respect de ces obligations expose à des pénalités significatives.",
  },
];

export default function CasClientsPage() {
  useScrollReveal();

  return (
    <>
      <Header />
      <PageHero
        title="Cas clients"
        subtitle="Six situations patrimoniales réelles, anonymisées. Pour chacune : le contexte, les enjeux, les axes de travail et les points de vigilance."
        breadcrumb="Cas clients"
      />

      <section className="section-padding bg-background texture-paper">
        <div className="max-w-3xl mx-auto mb-20 reveal">
          <p className="text-foreground/65 leading-relaxed text-base font-light">
            Ces cas sont inspirés de missions réelles, intégralement anonymisées. Ils illustrent la diversité des situations que nous traitons et la rigueur de notre approche.
          </p>
        </div>

        <div className="space-y-28 md:space-y-36">
          {casClients.map((cas, i) => {
            const flip = i % 2 === 1;
            return (
              <article key={cas.profil} className="relative">
                {/* Parallax background band */}
                <div className="absolute inset-y-[-8%] left-0 right-0 -z-0 overflow-hidden">
                  <ParallaxImage
                    src={images[i]}
                    alt=""
                    className="absolute inset-0 w-full h-full"
                    rounded="rounded-none"
                    intensity={180}
                    overlayClassName="bg-gradient-to-b from-background/85 via-background/55 to-background/90"
                  />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto px-6">
                  <div className={`grid lg:grid-cols-12 gap-8 items-center ${flip ? "" : ""}`}>
                    {/* Floating numeric label */}
                    <motion.div
                      initial={{ opacity: 0, x: flip ? 30 : -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.7 }}
                      className={`lg:col-span-3 ${flip ? "lg:order-2 lg:text-right" : ""}`}
                    >
                      <div className="electric-line mb-6" />
                      <p className="text-[10px] tracking-[0.3em] uppercase text-[hsl(var(--electric))] mb-3 font-medium">
                        Cas {String(i + 1).padStart(2, "0")}
                      </p>
                      <p className="font-heading text-5xl md:text-6xl font-light text-foreground/15 leading-none italic">
                        0{i + 1}
                      </p>
                    </motion.div>

                    {/* Liquid glass card */}
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className={`lg:col-span-9 glass-float p-8 md:p-10 lg:p-12 reflection-sweep ${flip ? "lg:order-1" : ""}`}
                    >
                      <h3 className="font-heading text-2xl md:text-3xl font-light text-foreground mb-2 tracking-tight leading-[1.15]">
                        {cas.profil}
                      </h3>
                      <div className="separator-fine my-6" />

                      <div className="grid md:grid-cols-2 gap-x-10 gap-y-8">
                        <div>
                          <p className="text-[10px] tracking-[0.25em] uppercase text-foreground/45 mb-3 font-medium">
                            Contexte
                          </p>
                          <p className="text-foreground/70 text-sm leading-relaxed font-light mb-6">
                            {cas.contexte}
                          </p>
                          <p className="text-[10px] tracking-[0.25em] uppercase text-foreground/45 mb-3 font-medium">
                            Enjeux
                          </p>
                          <ul className="space-y-2">
                            {cas.enjeux.map((e) => (
                              <li key={e} className="text-sm text-foreground/70 font-light flex items-start gap-3 leading-relaxed">
                                <span className="mt-2 w-1 h-1 rounded-full bg-[hsl(var(--electric))] flex-shrink-0" />
                                <span>{e}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-[10px] tracking-[0.25em] uppercase text-[hsl(var(--electric))] mb-3 font-medium">
                            Axes de travail
                          </p>
                          <ul className="space-y-2 mb-6">
                            {cas.axes.map((a) => (
                              <li key={a} className="text-sm text-foreground/85 font-light flex items-start gap-3 leading-relaxed">
                                <span className="mt-1.5 text-[hsl(var(--gold))] flex-shrink-0">✦</span>
                                <span>{a}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="glass p-4 rounded-md">
                            <p className="text-[10px] tracking-[0.25em] uppercase text-foreground/45 mb-2 font-medium">
                              Point de vigilance
                            </p>
                            <p className="text-foreground/65 text-xs leading-relaxed font-light italic">
                              {cas.vigilance}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <PageCTA
        title="Votre situation ressemble à l'un de ces cas ?"
        subtitle="Chaque patrimoine est unique. Parlons du vôtre lors d'un premier échange de 30 minutes, sans engagement."
        eyebrow="Cas clients"
        index="10"
      />
      <Footer />
    </>
  );
}
