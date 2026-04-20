import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PageCTA from "@/components/PageCTA";
import TrustBand from "@/components/TrustBand";
import FiscaliteSimulator from "@/components/simulators/FiscaliteSimulator";

export default function FiscalitePage() {
  useScrollReveal();

  return (
    <>
      <Header />
      <PageHero
        title="Fiscalité du patrimoine"
        subtitle="Réduire votre pression fiscale de façon légale, mesurée et pérenne. Sans excès, sans risque inutile, sans promesse irréaliste."
        breadcrumb="Fiscalité"
      />

      <section className="section-padding bg-background texture-paper">
        <div className="max-w-5xl mx-auto">
          <div className="reveal">
            <h2 className="text-2xl md:text-3xl font-heading font-semibold text-primary leading-tight mb-6">
              L'optimisation fiscale n'est pas un produit. C'est une méthode.
            </h2>
            <p className="text-gray-text leading-relaxed mb-4">
              Beaucoup de contribuables à forte imposition pensent qu'il suffit de souscrire un dispositif fiscal pour résoudre le problème. En réalité, une optimisation fiscale durable repose sur une analyse globale : revenus, patrimoine, régime matrimonial, projection de charges, anticipation des évolutions législatives.
            </p>
            <p className="text-gray-text leading-relaxed mb-8">
              Notre rôle est d'identifier les leviers réellement adaptés à votre situation, de les articuler entre eux et de vérifier chaque année qu'ils restent pertinents. Nous ne vendons pas de la défiscalisation — nous construisons une stratégie fiscale cohérente.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 reveal">
            {[
              { title: "Impôt sur le revenu", text: "Analyse de votre tranche marginale, identification des revenus à restructurer, versements PER, déficit foncier." },
              { title: "IFI", text: "Évaluation de l'assiette, démembrement, contrats de capitalisation luxembourgeois, restructuration des actifs immobiliers." },
              { title: "Revenus fonciers", text: "Arbitrage entre location nue et meublée, régime micro ou réel, déficit foncier, SCI à l'IS." },
              { title: "Plus-values", text: "Anticipation des cessions, report et sursis d'imposition, apport-cession (150-0 B ter), purge successorale." },
              { title: "Holding patrimoniale", text: "Structuration juridique pour regrouper, gérer et transmettre vos actifs de façon optimale sur le plan fiscal." },
              { title: "Conformité", text: "Vérification systématique de la licéité des montages, traçabilité des opérations, documentation conforme aux exigences AMF et fiscales." },
            ].map((d, i) => (
              <div key={d.title} className={`reveal-delay-${(i % 2) + 1} border-t border-border pt-6`}>
                <h3 className="font-heading text-lg font-semibold text-primary mb-2">{d.title}</h3>
                <p className="text-gray-text text-sm leading-relaxed">{d.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simulator */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto reveal">
          <FiscaliteSimulator />
        </div>
      </section>

      <TrustBand />
      <PageCTA
        title="Faisons le point sur votre fiscalité"
        subtitle="Un audit fiscal patrimonial pour identifier vos marges de manœuvre et construire une stratégie adaptée à votre situation."
        buttonText="Demander un audit fiscal"
        secondaryText="Voir la page optimisation fiscale"
        secondaryHref="/optimisation-fiscale-bordeaux"
      />
      <Footer />
    </>
  );
}
