import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PageCTA from "@/components/PageCTA";
import TrustBand from "@/components/TrustBand";

export default function OptimisationFiscalePage() {
  useScrollReveal();

  return (
    <>
      <Header />
      <PageHero
        title="Optimisation fiscale"
        highlight="à Bordeaux"
        subtitle="Réduire votre imposition de façon légale, mesurée et documentée. Un audit fiscal patrimonial pour identifier vos marges de manœuvre réelles."
        breadcrumb="Optimisation fiscale"
      />

      <section className="section-padding bg-background texture-paper">
        <div className="max-w-5xl mx-auto">
          <div className="reveal">
            <h2 className="text-2xl md:text-3xl font-heading font-semibold text-primary leading-tight mb-6">
              L'optimisation fiscale commence par un diagnostic, pas par un produit
            </h2>
            <p className="text-gray-text leading-relaxed mb-4">
              Trop souvent, la défiscalisation est vendue comme un produit : un Pinel ici, un Girardin là, sans analyse globale de la situation du contribuable. Le résultat ? Des investissements peu rentables, mal calibrés, qui créent plus de complexité qu'ils ne résolvent de problèmes.
            </p>
            <p className="text-gray-text leading-relaxed mb-4">
              Notre approche est inverse. Nous commençons par un audit complet de votre fiscalité : impôt sur le revenu, IFI, revenus fonciers, plus-values, prélèvements sociaux. Nous identifions ensuite les leviers réellement pertinents pour votre situation, en vérifiant systématiquement leur licéité et leur cohérence avec votre stratégie patrimoniale.
            </p>
            <p className="text-gray-text leading-relaxed mb-8">
              Chaque recommandation est chiffrée, documentée et expliquée. Nous ne promettons pas d'économie d'impôt sans avoir simulé l'impact réel sur votre situation personnelle.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 mb-16 reveal">
            {[
              { title: "Audit fiscal patrimonial", text: "Analyse détaillée de votre imposition sur trois ans, identification des anomalies, des leviers non exploités et des risques." },
              { title: "IFI — Impôt sur la fortune immobilière", text: "Évaluation de l'assiette, stratégies de réduction (démembrement, dette déductible, contrats de capitalisation), mise en conformité." },
              { title: "Revenus fonciers", text: "Arbitrage entre location nue et meublée, passage du micro au réel, déficit foncier, SCI à l'IS ou à l'IR." },
              { title: "Enveloppes fiscales", text: "PER, assurance-vie, PEA, contrat de capitalisation luxembourgeois. Chaque enveloppe a ses avantages et ses limites." },
              { title: "Structuration patrimoniale", text: "Holding, SCI, démembrement, donation : les outils juridiques au service de l'optimisation fiscale et de la transmission." },
              { title: "Conformité et vigilance", text: "Abus de droit, mini-abus de droit, obligation déclarative. Nous vérifions que chaque montage respecte les exigences de l'administration fiscale." },
            ].map((d, i) => (
              <div key={d.title} className={`reveal-delay-${(i % 2) + 1} border-t border-border pt-6`}>
                <h3 className="font-heading text-lg font-semibold text-primary mb-2">{d.title}</h3>
                <p className="text-gray-text text-sm leading-relaxed">{d.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TrustBand />
      <PageCTA
        title="Demandez un audit fiscal"
        subtitle="Un premier échange pour analyser votre imposition et identifier vos marges de manœuvre. Sans engagement."
        buttonText="Demander un audit fiscal"
      />
      <Footer />
    </>
  );
}
