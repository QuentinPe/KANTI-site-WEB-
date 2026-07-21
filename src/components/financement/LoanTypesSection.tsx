import { motion, useReducedMotion } from "framer-motion";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

interface LoanType {
  title: string;
  finalite: string;
  mode: string;
  horizon: string;
  vigilance: string;
}

interface LoanGroup {
  label: string;
  types: LoanType[];
}

const GROUPS: LoanGroup[] = [
  {
    label: "Immobilier résidentiel",
    types: [
      {
        title: "Résidence principale",
        finalite: "Acquisition du logement familial.",
        mode: "Prêt amortissable classique, souvent avec garantie caution.",
        horizon: "15 à 25 ans",
        vigilance:
          "Taux d'effort, reste à vivre, durée de détention envisagée.",
      },
      {
        title: "Résidence secondaire",
        finalite: "Acquisition d'un bien à usage personnel non locatif.",
        mode: "Financement sans prêt PTZ, conditions souvent plus strictes.",
        horizon: "10 à 20 ans",
        vigilance: "Analyse du reste à vivre global, charges supplémentaires.",
      },
      {
        title: "Investissement locatif",
        finalite: "Acquisition d'un bien destiné à la location.",
        mode:
          "Amortissable ou in fine selon optimisation fiscale. SCI possible.",
        horizon: "15 à 25 ans",
        vigilance:
          "Cash-flow net, vacance locative, fiscalité des revenus fonciers.",
      },
      {
        title: "Financement de travaux",
        finalite: "Rénovation, extension ou amélioration du bien.",
        mode:
          "Prêt travaux adossé au crédit principal ou prêt séparé selon le montant.",
        horizon: "5 à 15 ans",
        vigilance: "Maîtrise des coûts de chantier, délais de livraison.",
      },
      {
        title: "VEFA (achat sur plan)",
        finalite: "Acquisition d'un bien neuf en état futur d'achèvement.",
        mode:
          "Déblocage progressif selon l'avancement des travaux. Différé partiel fréquent.",
        horizon: "15 à 25 ans",
        vigilance:
          "Risque promoteur, délais de livraison, appels de fonds successifs.",
      },
    ],
  },
  {
    label: "Financement patrimonial",
    types: [
      {
        title: "Prêt amortissable",
        finalite: "Financement standard avec remboursement progressif du capital.",
        mode: "Mensualité constante incluant capital et intérêts.",
        horizon: "10 à 25 ans",
        vigilance: "Coût total vs mensualité · arbitrage durée.",
      },
      {
        title: "Prêt relais",
        finalite:
          "Acquisition d'un nouveau bien avant la vente de l'ancien.",
        mode:
          "Avance sur la valeur du bien à vendre, remboursé au moment de la vente.",
        horizon: "12 à 24 mois",
        vigilance:
          "Valorisation du bien vendu, timing de cession, risque de double charge.",
      },
      {
        title: "Prêt in fine",
        finalite:
          "Remboursement du capital en une seule fois à l'échéance.",
        mode:
          "Seuls les intérêts sont versés pendant la durée. Capital soldé en fin de prêt.",
        horizon: "10 à 20 ans",
        vigilance:
          "Nécessite une épargne parallèle (AV, PEA). Pertinent sur profil fiscal élevé.",
      },
      {
        title: "Refinancement / rachat de crédit",
        finalite:
          "Optimisation d'un crédit existant à des conditions plus favorables.",
        mode:
          "Remboursement de l'ancien crédit et souscription d'un nouveau, souvent avec IRA.",
        horizon: "Variable",
        vigilance:
          "Calcul du gain réel net de frais (IRA + frais de dossier + garantie).",
      },
      {
        title: "Montage SCI multi-lignes",
        finalite:
          "Structuration d'un ou plusieurs biens via une SCI avec plusieurs tranches de financement.",
        mode: "Coordination de plusieurs prêts sur un ou plusieurs biens.",
        horizon: "15 à 25 ans",
        vigilance:
          "Coordination avec l'expert-comptable, cautions personnelles, optimisation IS/IR.",
      },
    ],
  },
  {
    label: "Financement professionnel",
    types: [
      {
        title: "Locaux professionnels",
        finalite: "Acquisition des locaux d'activité.",
        mode:
          "Financement classique avec hypothèque sur le bien. SCI possible.",
        horizon: "10 à 20 ans",
        vigilance:
          "Analyse de l'activité professionnelle, dépendance à la clientèle.",
      },
      {
        title: "Murs professionnels",
        finalite: "Acquisition des murs d'un commerce ou cabinet.",
        mode:
          "Souvent via SCI dédiée louant au professionnel. Financement adapté.",
        horizon: "12 à 18 ans",
        vigilance:
          "Montage juridique et fiscal, loyer SCI, garanties hypothécaires.",
      },
      {
        title: "Financement de matériel",
        finalite: "Acquisition d'équipements professionnels.",
        mode: "Prêt professionnel ou crédit-bail selon traitement fiscal.",
        horizon: "3 à 7 ans",
        vigilance:
          "Amortissement fiscal, valeur résiduelle en crédit-bail.",
      },
      {
        title: "Reprise d'entreprise",
        finalite: "Financement d'une acquisition partielle ou totale.",
        mode:
          "Montage LBO, holding, crédit vendeur ou combinaison selon la structure.",
        horizon: "5 à 10 ans",
        vigilance:
          "Capacité de remontée de dividendes, valorisation, risque opérationnel.",
      },
      {
        title: "Crédit-bail immobilier",
        finalite: "Financement de locaux avec option d'achat en fin de contrat.",
        mode:
          "L'établissement acquiert et loue le bien. Levée d'option en fin de période.",
        horizon: "10 à 20 ans",
        vigilance:
          "Traitement comptable (hors bilan), coût global vs achat classique.",
      },
    ],
  },
];

export default function LoanTypesSection() {
  const reduce = useReducedMotion();

  return (
    <section
      className="section-padding"
      style={{ background: "hsl(220 30% 97%)" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-60px" }}
        >
          <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/45 mb-4 font-medium">
            05 · Typologies de financement
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground leading-[1.1] tracking-tight max-w-2xl mb-4">
            Trois univers, quinze configurations.
          </h2>
          <p className="text-foreground/55 font-light text-sm max-w-xl">
            Chaque projet appelle une structure de financement adaptée. Cliquez
            sur une catégorie pour explorer les typologies disponibles.
          </p>
        </motion.div>

        {/* Accordions */}
        <Accordion.Root type="multiple" className="space-y-4">
          {GROUPS.map((group, gi) => (
            <motion.div
              key={group.label}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: gi * 0.08 }}
              viewport={{ once: true, margin: "-40px" }}
            >
              <Accordion.Item
                value={group.label}
                className="rounded-2xl border border-foreground/8 bg-white shadow-sm overflow-hidden"
              >
                <Accordion.Header>
                  <Accordion.Trigger className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-foreground/[0.015] transition-colors group/trigger">
                    <span className="font-heading text-lg font-light text-foreground">
                      {group.label}
                    </span>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-[10px] text-foreground/35 tracking-wide">
                        {group.types.length} types
                      </span>
                      <ChevronDown
                        className="w-4 h-4 text-foreground/30 transition-transform duration-300 group-data-[state=open]/trigger:rotate-180"
                        aria-hidden
                      />
                    </div>
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                  <div className="px-6 pb-6 space-y-4 border-t border-foreground/6 pt-4">
                    {group.types.map((type) => (
                      <div
                        key={type.title}
                        className="rounded-xl border border-foreground/8 bg-background/50 p-4"
                      >
                        <h4 className="font-medium text-sm text-foreground mb-3">
                          {type.title}
                        </h4>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          {[
                            { label: "Finalité", text: type.finalite },
                            { label: "Mode", text: type.mode },
                            { label: "Horizon", text: type.horizon },
                            { label: "Vigilance", text: type.vigilance },
                          ].map((d) => (
                            <div key={d.label}>
                              <p className="text-[10px] uppercase tracking-wide text-foreground/35 mb-1">
                                {d.label}
                              </p>
                              <p className="text-xs text-foreground/60 leading-relaxed">
                                {d.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </motion.div>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
