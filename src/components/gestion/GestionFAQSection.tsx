import { motion, useReducedMotion } from 'framer-motion';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: "Qu'est-ce qu'une allocation patrimoniale ?",
    a: "Une allocation patrimoniale est la répartition de votre épargne entre différentes classes d'actifs (obligations, actions, immobilier, fonds en euros, private equity…) en fonction de vos objectifs, de votre horizon de placement, de votre fiscalité et de votre tolérance au risque. Elle est le cœur de votre stratégie d'investissement.",
  },
  {
    q: "Qu'est-ce que l'architecture ouverte ?",
    a: "L'architecture ouverte désigne une approche dans laquelle le conseiller sélectionne les meilleurs supports disponibles sur l'ensemble du marché, sans être lié à une gamme propriétaire. KANTI ne dispose d'aucun produit maison et n'a aucun quota de placement à respecter, ce qui garantit l'indépendance de notre conseil.",
  },
  {
    q: "Comment est défini mon profil de risque ?",
    a: "Votre profil de risque est établi lors du bilan patrimonial, à partir d'un questionnaire réglementaire et d'un échange approfondi sur vos objectifs, votre horizon, vos revenus futurs et votre capacité psychologique à accepter une baisse temporaire de votre portefeuille. Il est réévalué lors de chaque révision annuelle.",
  },
  {
    q: "Quelle est la différence entre l'assurance-vie et le PEA ?",
    a: "L'assurance-vie est une enveloppe polyvalente, accessible à tout âge, permettant d'investir sur une large gamme de supports (fonds en euros, UC, SCPI…). Elle offre une fiscalité avantageuse après 8 ans et des avantages en matière de transmission. Le PEA est dédié aux actions européennes, plafonné à 150 000 € de versements, et exonère les plus-values d'impôt après 5 ans (hors prélèvements sociaux). Ces deux enveloppes sont souvent complémentaires.",
  },
  {
    q: "Qu'est-ce que la simulation Monte Carlo ?",
    a: "La méthode Monte Carlo consiste à simuler un très grand nombre de scénarios possibles (plusieurs centaines) en utilisant des générateurs de nombres aléatoires, pour modéliser l'incertitude des marchés financiers. Elle produit une distribution de résultats (de pessimiste à optimiste) plutôt qu'une prévision unique. C'est un outil pédagogique : les hypothèses utilisées sont illustratives et ne constituent pas une prévision.",
  },
  {
    q: "Que signifie le drawdown maximum ?",
    a: "Le drawdown maximum représente la perte maximale observée depuis un plus-haut, exprimée en pourcentage. Par exemple, un drawdown de -20 % signifie que le portefeuille a chuté de 20 % depuis son pic avant de remonter. C'est un indicateur clé de risque que les investisseurs doivent être prêts à absorber psychologiquement.",
  },
  {
    q: "Combien de temps faut-il investir en actions ?",
    a: "L'horizon recommandé pour une exposition significative aux marchés actions est généralement de 5 à 10 ans minimum. Sur ces durées, les études historiques montrent que la probabilité de perte diminue fortement, même si rien ne le garantit. Pour des objectifs à court terme (< 3 ans), des supports plus défensifs sont préférables.",
  },
  {
    q: "Comment fonctionnent les SCPI ?",
    a: "Les SCPI (Sociétés Civiles de Placement Immobilier) permettent d'investir indirectement dans l'immobilier professionnel via l'achat de parts. Elles collectent les loyers et les redistribuent sous forme de revenus réguliers. Elles offrent une diversification immobilière accessible à partir de quelques milliers d'euros, mais comportent des risques de liquidité et de valorisation. En assurance-vie, elles bénéficient d'une fiscalité allégée.",
  },
  {
    q: "Qu'est-ce que le private equity ?",
    a: "Le private equity (capital-investissement) désigne l'investissement dans des entreprises non cotées en Bourse. Il peut prendre différentes formes : capital-risque (startup), capital-développement, LBO (rachat à effet de levier). Les rendements potentiels sont plus élevés mais s'accompagnent d'une liquidité très faible (horizon de 8 à 12 ans), d'une accessibilité limitée et d'une volatilité plus difficile à mesurer. Il est réservé aux profils éligibles.",
  },
  {
    q: "Comment sont rémunérés vos conseils ?",
    a: "Notre rémunération est transparente et communiquée avant toute mission. Elle peut prendre la forme d'honoraires de conseil (facturation horaire ou forfaitaire) et/ou de rétrocessions de commissions versées par les distributeurs de produits (compagnies d'assurance, sociétés de gestion). Ces commissions sont plafonnées et systématiquement communiquées dans la documentation précontractuelle.",
  },
];

export default function GestionFAQSection() {
  const reduce = useReducedMotion();

  return (
    <section className="section-padding bg-background">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="mb-12 text-center"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: '-60px' }}
        >
          <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/45 mb-4 font-medium">
            Questions fréquentes
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground leading-tight tracking-tight">
            Ce que vous voulez savoir
          </h2>
        </motion.div>

        <Accordion.Root type="multiple" className="space-y-px">
          {FAQ_ITEMS.map((item, i) => (
            <motion.div
              key={i}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              viewport={{ once: true, margin: '-30px' }}
            >
              <Accordion.Item
                value={`faq-${i}`}
                className="border-b border-foreground/8 group"
              >
                <Accordion.Header>
                  <Accordion.Trigger
                    className="w-full flex items-center justify-between gap-4 py-5 text-left text-foreground/80 hover:text-foreground transition-colors duration-200 group/trigger"
                  >
                    <span className="font-light text-[15px] leading-snug">{item.q}</span>
                    <ChevronDown
                      className="w-4 h-4 flex-shrink-0 text-foreground/35 transition-transform duration-300 group-data-[state=open]/trigger:rotate-180"
                      aria-hidden
                    />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                  <p className="pb-5 text-sm text-foreground/60 leading-relaxed font-light">
                    {item.a}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
            </motion.div>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
