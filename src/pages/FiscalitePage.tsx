import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PageCTA from "@/components/PageCTA";
import TrustBand from "@/components/TrustBand";
import FiscaliteSimulator from "@/components/simulators/FiscaliteSimulator";
import ExpertiseShowcase from "@/components/ExpertiseShowcase";
import ProductGrid from "@/components/ProductGrid";
import { getCategory } from "@/data/productsCatalog";
import heroImg from "@/assets/expertise-fiscalite.jpg";

export default function FiscalitePage() {
  useScrollReveal();
  const category = getCategory("fiscalite")!;

  return (
    <>
      <Header />
      <PageHero
        title="Fiscalité du patrimoine"
        subtitle="Réduire votre pression fiscale de façon légale, mesurée et pérenne. Sans excès, sans risque inutile, sans promesse irréaliste."
        breadcrumb="Fiscalité"
        eyebrow="Stratégie fiscale"
        image={heroImg}
        imageAlt="Optimisation fiscale patrimoniale"
        stats={[
          { value: "6", label: "Leviers analysés" },
          { value: "100%", label: "Conformité AMF" },
          { value: "Annuel", label: "Suivi & révision" },
        ]}
      />

      <ExpertiseShowcase
        eyebrow="Notre méthode fiscale"
        title="L'optimisation fiscale n'est pas un produit. C'est une méthode."
        intro="Une optimisation fiscale durable repose sur une analyse globale : revenus, patrimoine, régime matrimonial, projection de charges, anticipation des évolutions législatives. Nous identifions les leviers réellement adaptés à votre situation, les articulons entre eux et vérifions chaque année qu'ils restent pertinents."
        image={heroImg}
        imageAlt="Stratégie fiscale KANTI"
        pillars={[
          { title: "Impôt sur le revenu", text: "Analyse de votre tranche marginale, restructuration des revenus, versements PER, déficit foncier." },
          { title: "IFI", text: "Évaluation de l'assiette, démembrement, contrats de capitalisation luxembourgeois, restructuration des actifs immobiliers." },
          { title: "Revenus fonciers", text: "Arbitrage location nue / meublée, régime micro ou réel, déficit foncier, SCI à l'IS." },
          { title: "Plus-values", text: "Anticipation des cessions, report et sursis d'imposition, apport-cession (150-0 B ter), purge successorale." },
          { title: "Holding patrimoniale", text: "Structuration juridique pour regrouper, gérer et transmettre vos actifs de façon optimale." },
          { title: "Conformité & traçabilité", text: "Vérification systématique de la licéité des montages, documentation conforme aux exigences AMF et fiscales." },
        ]}
      />

      {/* Simulator */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto reveal">
          <FiscaliteSimulator />
        </div>
      </section>

      <TrustBand />
      <ProductGrid
        eyebrow="Leviers fiscaux"
        title="Les leviers que nous activons"
        intro="Chaque levier est étudié à la lumière de votre TMI, votre patrimoine et vos projets. Survolez pour découvrir le détail."
        categorySlug={category.slug}
        products={category.products}
      />
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
