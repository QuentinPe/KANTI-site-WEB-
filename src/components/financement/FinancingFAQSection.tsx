import { motion, useReducedMotion } from "framer-motion";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "Quel est le rôle d'un courtier patrimonial ?",
    a: "Un courtier patrimonial analyse non seulement les conditions de financement mais les replace dans la stratégie globale du client : fiscalité, structure de détention, trésorerie, prévoyance, horizon. Il ne se limite pas au taux mais coordonne l'ensemble des paramètres pour construire un montage cohérent avec le projet patrimonial.",
  },
  {
    q: "Quelle différence avec un courtier immobilier classique ?",
    a: "Le courtier immobilier classique se concentre sur le taux. Le courtier patrimonial intègre fiscalité, structure de détention, trésorerie, prévoyance, durée optimale et vision à long terme. Il travaille en coordination avec les autres professionnels (notaire, expert-comptable, avocat) pour que le financement s'inscrive dans la stratégie d'ensemble.",
  },
  {
    q: "Pourquoi ne pas comparer seulement les taux ?",
    a: "Le coût réel d'un financement intègre assurance, frais de dossier, garanties, IRA (indemnités de remboursement anticipé) et conditions contractuelles. Un taux plus bas peut masquer une assurance plus élevée ou des clauses de modularité restreintes. Le coût total effectif est souvent plus parlant que le taux nominal.",
  },
  {
    q: "Quels frais doivent être pris en compte ?",
    a: "Frais de dossier, garantie (caution ou hypothèque), assurance emprunteur, courtage, frais d'acte notarié, éventuels frais de mainlevée en cas de remboursement anticipé. Ces frais s'ajoutent au coût des intérêts et peuvent représenter plusieurs milliers d'euros selon le montant emprunté.",
  },
  {
    q: "Quelle durée choisir ?",
    a: "La durée optimale dépend de la mensualité supportable, du coût total accepté et de la liquidité souhaitée. Une durée plus longue réduit la mensualité mais augmente le coût total. La bonne durée est celle qui permet de maintenir un reste à vivre confortable tout en limitant le coût total selon vos objectifs.",
  },
  {
    q: "Quel apport conserver ?",
    a: "L'apport mobilisé réduit l'emprunt mais diminue la trésorerie disponible pour d'autres projets ou imprévus. L'apport idéal est celui qui permet d'obtenir les meilleures conditions tout en préservant une réserve de liquidité suffisante. En général, un apport de 10 à 20 % est recommandé, mais cela dépend du profil et du projet.",
  },
  {
    q: "Comment analyser l'assurance emprunteur ?",
    a: "L'assurance peut représenter 20 à 30 % du coût total. Pour comparer correctement, il faut analyser le TAEA (Taux Annuel Effectif d'Assurance) et non seulement la prime mensuelle. La délégation d'assurance permet de souscrire hors de la banque, souvent à des conditions plus avantageuses selon votre profil de santé.",
  },
  {
    q: "Peut-on financer via une SCI ?",
    a: "Oui, sous conditions. La SCI peut acquérir le bien et contracter l'emprunt. Les associés doivent souvent se porter caution personnelle. L'analyse bancaire porte alors sur les associés autant que sur la structure. La coordination avec l'expert-comptable est recommandée pour le choix du régime fiscal (IR ou IS).",
  },
  {
    q: "Comment sont étudiés les revenus d'un dirigeant ?",
    a: "En général, la moyenne des 3 dernières années de revenus (rémunération + dividendes) est retenue. Les établissements analysent également la solidité de l'entreprise, la répartition du capital et les cautions accordées. Un dossier bien documenté avec les bilans détaillés facilite significativement l'étude.",
  },
  {
    q: "Comment fonctionne un prêt relais ?",
    a: "Le prêt relais permet d'acquérir un nouveau bien avant la vente de l'ancien. La banque avance généralement entre 60 et 80 % de la valeur estimée du bien à vendre. Les intérêts courent pendant la durée du relais (souvent 12 à 24 mois). Il est remboursé au moment de la vente. Le principal risque est la surestimation du bien vendu ou un délai de vente trop long.",
  },
  {
    q: "Peut-on comparer amortissable et in fine ?",
    a: "Oui. L'in fine diffère le remboursement du capital en fin de période · seuls les intérêts sont versés chaque mois. Il permet de déduire l'intégralité des intérêts en cas d'investissement locatif et de conserver la trésorerie disponible. En contrepartie, il nécessite une épargne parallèle garantissant le remboursement du capital. Il est pertinent pour les profils fiscaux élevés avec une stratégie patrimoniale claire.",
  },
  {
    q: "Le simulateur vaut-il accord de prêt ?",
    a: "Non. Le simulateur est un outil pédagogique illustrant des hypothèses de démonstration. Il ne constitue ni une offre de prêt, ni un accord de principe, ni une recommandation personnalisée. Les conditions réelles dépendent de votre profil, de votre dossier et de la politique commerciale des établissements.",
  },
  {
    q: "Quels documents préparer ?",
    a: "Identité, revenus (bulletins de salaire ou bilans), relevés bancaires des 3 derniers mois, crédits en cours, compromis de vente. Pour les dirigeants : bilans des 3 dernières années, liasses fiscales, Kbis. Pour une SCI : statuts, bilans, baux. La liste varie selon le profil et l'établissement.",
  },
  {
    q: "À quel moment contacter KANTI ?",
    a: "Le plus tôt possible, idéalement dès la réflexion sur le projet · avant même la signature du compromis. Intervenir en amont permet d'analyser la faisabilité, d'optimiser la structure et de préparer un dossier solide. Agir dans l'urgence après un compromis signé réduit les marges de manœuvre.",
  },
];

export default function FinancingFAQSection() {
  const reduce = useReducedMotion();

  return (
    <section className="section-padding bg-background">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="mb-12 text-center"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-60px" }}
        >
          <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/45 mb-4 font-medium">
            13 · Questions fréquentes
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
              transition={{ duration: 0.4, delay: i * 0.04 }}
              viewport={{ once: true, margin: "-30px" }}
            >
              <Accordion.Item
                value={`faq-${i}`}
                className="border-b border-foreground/8 group"
              >
                <Accordion.Header>
                  <Accordion.Trigger className="w-full flex items-center justify-between gap-4 py-5 text-left text-foreground/80 hover:text-foreground transition-colors duration-200 group/trigger">
                    <span className="font-light text-[15px] leading-snug">
                      {item.q}
                    </span>
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
