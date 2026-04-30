import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PageCTA from "@/components/PageCTA";
import ExpertiseShowcase from "@/components/ExpertiseShowcase";
import ProductGrid from "@/components/ProductGrid";
import StickyImageBand from "@/components/StickyImageBand";
import { getCategory } from "@/data/productsCatalog";
import heroImg from "@/assets/expertise-patrimoinepro.jpg";

export default function PatrimoineProPage() {
  useScrollReveal();
  const category = getCategory("patrimoine-professionnel")!;

  return (
    <>
      <Header />
      <PageHero
        title="Patrimoine professionnel"
        subtitle="Dirigeants, associés, professions libérales : votre entreprise est votre premier actif. Structurez-la, protégez-la, préparez sa transmission."
        breadcrumb="Patrimoine professionnel"
        eyebrow="Dirigeants & associés"
        stats={[
          { value: "Privé+pro", label: "Vision croisée" },
          { value: "Dutreil", label: "Transmission optimisée" },
          { value: "Coord.", label: "Expert-comptable & avocat" },
        ]}
      />

      <ExpertiseShowcase
        eyebrow="Vision dirigeant"
        title="Patrimoine privé et professionnel sont indissociables. Nous les traitons ensemble."
        intro="Quand un dirigeant arbitre entre salaire et dividendes, il impacte sa retraite, sa couverture sociale, sa fiscalité personnelle et la capacité d'investissement de son entreprise. Notre approche croise systématiquement les enjeux personnels et professionnels, en coordination avec votre expert-comptable et votre avocat."
        image={heroImg}
        imageAlt="Patrimoine professionnel KANTI"
        pillars={[
          { title: "Rémunération du dirigeant", text: "Arbitrage salaire / dividendes / avantages, impact sur les cotisations sociales, la retraite et l'IR." },
          { title: "Trésorerie d'entreprise", text: "Placement de l'excédent sur des supports adaptés au profil de risque de la société." },
          { title: "Holding & structuration", text: "Création ou restructuration pour optimiser la détention d'actifs, la remontée de dividendes et la transmission." },
          { title: "Prévoyance du dirigeant", text: "Homme-clé, garantie croisée entre associés, prévoyance décès / invalidité, contrat Madelin." },
          { title: "Cession d'entreprise", text: "Valorisation, structuration du montage, optimisation fiscale de la plus-value, réinvestissement." },
          { title: "Transmission familiale", text: "Pacte Dutreil, donation avec réserve d'usufruit, engagement collectif, family buy-out." },
        ]}
      />

      <StickyImageBand
        image={heroImg}
        imageAlt="Patrimoine professionnel KANTI"
        eyebrow="Dirigeants & associés"
        caption="Patrimoine privé et professionnel sont indissociables. Nous les traitons ensemble."
      />

      <ProductGrid
        eyebrow="Solutions dirigeants"
        title="Les leviers que nous activons pour vous"
        intro="Rémunération, holding, prévoyance, cession : chaque décision impacte simultanément votre entreprise et votre patrimoine privé."
        categorySlug={category.slug}
        products={category.products}
        hideLinks
      />
      <PageCTA
        title="Dirigeants, parlons stratégie"
        subtitle="Un premier échange confidentiel pour analyser votre situation et identifier les arbitrages prioritaires."
        eyebrow="Dirigeants & associés"
        index="05"
        secondaryText="Cas clients dirigeants"
        secondaryHref="/cas-clients"
      />
      <Footer />
    </>
  );
}
