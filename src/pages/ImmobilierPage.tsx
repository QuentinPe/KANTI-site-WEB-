import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PageCTA from "@/components/PageCTA";
import ImmobilierSimulator from "@/components/simulators/ImmobilierSimulator";
import ExpertiseShowcase from "@/components/ExpertiseShowcase";
import ProductGrid from "@/components/ProductGrid";
import StickyImageBand from "@/components/StickyImageBand";
import { getCategory } from "@/data/productsCatalog";
import heroImg from "@/assets/expertise-immobilier.jpg";

export default function ImmobilierPage() {
  useScrollReveal();
  const category = getCategory("patrimoine-immobilier-strategie")!;

  return (
    <>
      <Header />
      <PageHero
        title="Patrimoine immobilier"
        highlight="& stratégie"
        subtitle="Résidence principale, investissement locatif, SCI, nue-propriété : chaque décision immobilière s'inscrit dans une logique patrimoniale globale."
        breadcrumb="Immobilier"
        eyebrow="Pierre & stratégie"
        stats={[
          { value: "6", label: "Modes de détention" },
          { value: "20+", label: "Ans d'horizon" },
          { value: "Net", label: "Approche rendement" },
        ]}
      />

      <ExpertiseShowcase
        eyebrow="Stratégie immobilière"
        title="L'immobilier est rarement une décision isolée. Nous l'intégrons dans votre stratégie."
        intro="Un investissement locatif n'a pas le même sens selon que vous êtes à 30 % ou 45 % de TMI. Un achat en SCI peut être pertinent pour la transmission mais coûteux en gestion. Notre rôle : vous aider à prendre la bonne décision en tenant compte de la fiscalité, du financement, du mode de détention, du rendement net, de la liquidité et de l'horizon."
        image={heroImg}
        imageAlt="Immobilier patrimonial KANTI"
        pillars={[
          { title: "Résidence principale", text: "Arbitrage achat / location, capacité d'emprunt, impact patrimonial et fiscal, exonération de plus-value." },
          { title: "Investissement locatif", text: "Localisation, rendement brut et net, régime fiscal nu / meublé / LMNP, montage en nom propre ou en société." },
          { title: "SCI patrimoniale", text: "Constitution, statuts, choix IR / IS, gestion locative, cession de parts, démembrement des parts." },
          { title: "Nue-propriété", text: "Acquisition à prix réduit, absence de fiscalité sur les revenus, récupération au terme, hors assiette IFI." },
          { title: "SCPI & immobilier papier", text: "Diversification géographique et sectorielle, mutualisation, revenus réguliers, intégration en assurance-vie." },
          { title: "Financement structuré", text: "Négociation des conditions, effet de levier, déductibilité des intérêts, structuration du passif." },
        ]}
      />

      <StickyImageBand
        image={heroImg}
        imageAlt="Immobilier patrimonial à Bordeaux"
        eyebrow="Pierre & stratégie"
        caption="L'immobilier est rarement une décision isolée. Nous l'intégrons dans votre stratégie."
      />

      {/* Simulator */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto reveal">
          <div className="mb-10 md:mb-14 flex items-center gap-4">
            <span className="text-[10px] tracking-[0.32em] uppercase text-foreground/55 font-medium">Simulez</span>
            <div className="h-px flex-1 bg-foreground/10" />
          </div>
          <ImmobilierSimulator />
        </div>
      </section>

      <ProductGrid
        eyebrow="Modes de détention"
        title="Les véhicules immobiliers à votre disposition"
        intro="Du nu au démembrement, de la SCI à la SCPI : chaque mode de détention répond à un objectif précis."
        categorySlug={category.slug}
        products={category.products}
      />
      <PageCTA
        title="Parlons de votre projet immobilier"
        subtitle="Un premier échange pour analyser votre projet et identifier le montage le plus adapté."
        eyebrow="Pierre & stratégie"
        index="03"
        secondaryText="Financement & crédit"
        secondaryHref="/financement"
      />
      <Footer />
    </>
  );
}
