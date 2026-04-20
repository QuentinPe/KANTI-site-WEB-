import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PageCTA from "@/components/PageCTA";
import TrustBand from "@/components/TrustBand";

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
        <div className="max-w-5xl mx-auto">
          <div className="reveal mb-10">
            <p className="text-gray-text leading-relaxed">
              Ces cas sont inspirés de missions réalisées par le cabinet. Tous les détails ont été modifiés pour garantir l'anonymat de nos clients. Ils illustrent la diversité des situations que nous traitons et la rigueur de notre approche.
            </p>
          </div>

          <div className="space-y-16">
            {casClients.map((cas, i) => (
              <div key={cas.profil} className={`reveal reveal-delay-${Math.min(i + 1, 3)}`}>
                <div className="border-t-2 border-gold/30 pt-8">
                  <p className="text-xs tracking-widest uppercase text-gold mb-3">Cas {String(i + 1).padStart(2, "0")}</p>
                  <h3 className="font-heading text-2xl font-semibold text-primary mb-4">{cas.profil}</h3>
                  
                  <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                    <div>
                      <h4 className="text-xs tracking-widest uppercase text-gray-text/60 mb-2">Contexte</h4>
                      <p className="text-gray-text text-sm leading-relaxed mb-4">{cas.contexte}</p>
                      
                      <h4 className="text-xs tracking-widest uppercase text-gray-text/60 mb-2">Enjeux</h4>
                      <ul className="space-y-1.5">
                        {cas.enjeux.map((e) => (
                          <li key={e} className="text-sm text-gray-text flex items-start gap-2">
                            <span className="mt-2 w-1 h-1 rounded-full bg-gold flex-shrink-0" />
                            {e}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs tracking-widest uppercase text-gray-text/60 mb-2">Axes de travail</h4>
                      <ul className="space-y-1.5 mb-4">
                        {cas.axes.map((a) => (
                          <li key={a} className="text-sm text-primary flex items-start gap-2">
                            <span className="mt-2 w-1 h-1 rounded-full bg-gold flex-shrink-0" />
                            {a}
                          </li>
                        ))}
                      </ul>
                      
                      <h4 className="text-xs tracking-widest uppercase text-gray-text/60 mb-2">Point de vigilance</h4>
                      <p className="text-gray-text text-sm leading-relaxed italic">{cas.vigilance}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TrustBand />
      <PageCTA
        title="Votre situation ressemble à l'un de ces cas ?"
        subtitle="Chaque patrimoine est unique. Parlons du vôtre lors d'un premier échange de 30 minutes, sans engagement."
      />
      <Footer />
    </>
  );
}
