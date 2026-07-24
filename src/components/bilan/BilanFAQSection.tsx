import { motion, useReducedMotion } from 'framer-motion';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: "Qu'est-ce qu'un bilan patrimonial ?",
    a: "Le bilan patrimonial est un diagnostic complet de votre situation patrimoniale : actifs, passifs, fiscalité, revenus, prévoyance, objectifs de vie. Il permet d'obtenir une vision globale et chiffrée de votre patrimoine, d'identifier les contradictions et les angles morts, et de définir une feuille de route priorisée. Ce n'est pas un produit financier : c'est un acte de conseil pur.",
  },
  {
    q: "Combien coûte un bilan patrimonial ?",
    a: "Les honoraires de conseil sont transparents et communiqués avant toute mission, sous forme de devis détaillé. Ils varient selon la complexité de votre situation (patrimoine détenu, structures juridiques en place, enjeux successoraux…). Le premier échange de 30 minutes est gratuit et sans engagement, pour évaluer ensemble si un bilan fait sens dans votre situation.",
  },
  {
    q: 'Quels documents faut-il préparer ?',
    a: "Pour un bilan complet, nous aurons besoin d'un ensemble de documents : avis d'imposition des 3 dernières années, relevés de comptes bancaires et d'épargne, contrats d'assurance-vie et relevés annuels, relevés PEA, PER et comptes-titres, tableaux d'amortissement des crédits en cours, contrats de prévoyance (décès, invalidité, dépendance), situation matrimoniale (contrat de mariage si applicable). Nous vous remettons une liste précise lors du cadrage.",
  },
  {
    q: 'Quelle est la durée d\'un bilan patrimonial ?',
    a: "La durée moyenne est de 3 semaines, de la signature de la lettre de mission à la séance de restitution. Cette durée dépend de la complexité de la situation et de la rapidité de transmission des documents. La séance de restitution dure en général 1h30. Le rapport écrit est remis en amont, pour que vous puissiez en prendre connaissance avant l'échange.",
  },
  {
    q: 'Êtes-vous indépendants ?',
    a: "Oui. KANTI est inscrit à l'ORIAS en qualité de courtier en assurances et de conseiller en investissements financiers (CIF). Nous ne distribuons aucun produit maison et n'avons aucun quota de placement à respecter. Notre rémunération est transparente : honoraires de conseil communiqués en amont. Notre seul critère de sélection est votre intérêt.",
  },
  {
    q: 'Le rapport est-il confidentiel ?',
    a: "Absolument. Un accord de confidentialité (NDA) est signé systématiquement au démarrage de toute mission. Vos informations ne sont jamais transmises à des tiers sans votre accord explicite. Le rapport vous appartient intégralement et vous pouvez le partager librement avec vos propres conseils (notaire, expert-comptable, avocat).",
  },
  {
    q: 'Que contient le rapport final ?',
    a: "Le rapport patrimonial est structuré en quatre parties : (1) Synthèse du patrimoine · cartographie complète et chiffrée, actifs, passifs, patrimoine net, indicateurs clés ; (2) Cartographie des risques · analyse de la prévoyance, points de vigilance ; (3) Scénarios étudiés · 2 à 3 options comparées, simulation chiffrée ; (4) Feuille de route · actions priorisées sur 12 à 24 mois avec calendrier de mise en œuvre.",
  },
  {
    q: 'Faut-il être client KANTI après le bilan ?',
    a: "Non. Le bilan patrimonial est une mission indépendante. À son terme, vous êtes libre de mettre en œuvre les recommandations avec qui vous souhaitez · vos conseillers habituels, votre banque, ou KANTI. Si vous souhaitez que nous coordonnions la mise en place, nous pouvons prendre en charge le suivi. Aucune obligation, aucune pression.",
  },
  {
    q: 'Un bilan patrimonial est-il déductible fiscalement ?',
    a: "Les honoraires de conseil patrimonial peuvent être déductibles dans certains cas · notamment pour les revenus fonciers ou dans le cadre d'une activité professionnelle. La déductibilité dépend de votre situation spécifique. Nous vous conseillons de vous rapprocher de votre expert-comptable ou de votre service des impôts pour valider l'éligibilité dans votre cas précis.",
  },
  {
    q: 'Dans quelles villes intervenez-vous ?',
    a: "Notre cabinet est basé à Bordeaux. Nous intervenons principalement à Bordeaux et dans l'agglomération bordelaise (Mérignac, Pessac, Mérignac, Talence, Bègles, Lormont, Cenon, Floirac, Gradignan…). Des déplacements sont possibles sur rendez-vous dans la région Nouvelle-Aquitaine. Les entretiens peuvent également se tenir en visioconférence.",
  },
];

export default function BilanFAQSection() {
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
            09 · Questions fréquentes
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground leading-tight tracking-tight">
            Ce que vous voulez savoir sur le bilan patrimonial
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
