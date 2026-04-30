import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PageCTA from "@/components/PageCTA";
import ExpertiseShowcase from "@/components/ExpertiseShowcase";
import ProductGrid from "@/components/ProductGrid";
import StickyImageBand from "@/components/StickyImageBand";
import { getCategory } from "@/data/productsCatalog";
import heroImg from "@/assets/expertise-financement.jpg";

export default function FinancementPage() {
  useScrollReveal();
  const category = getCategory("financement")!;

  return (
    <>
      <Header />
      <PageHero
        title="Financement & crédit"
        subtitle="Obtenir les meilleures conditions de financement pour vos projets immobiliers et professionnels. Courtage indépendant, conseil intégré."
        breadcrumb="Financement"
        eyebrow="Courtage indépendant"
        stats={[
          { value: "20+", label: "Banques partenaires" },
          { value: "0%", label: "Frais cachés" },
          { value: "48h", label: "Première étude" },
        ]}
      />

      <ExpertiseShowcase
        eyebrow="Crédit patrimonial"
        title="Le crédit n'est pas qu'une question de taux. C'est un outil patrimonial."
        intro="Un financement bien structuré accélère la constitution de votre patrimoine, optimise votre fiscalité et préserve votre capacité d'investissement. En courtier indépendant, nous accédons aux offres de nombreux établissements et négocions taux, assurance, garanties et modularité — en intégrant chaque crédit dans votre stratégie globale."
        image={heroImg}
        imageAlt="Courtage et financement KANTI"
        pillars={[
          { title: "Résidence principale", text: "Acquisition, renégociation, rachat de crédit. Analyse de la capacité d'emprunt et de l'impact fiscal." },
          { title: "Investissement locatif", text: "Financement patrimonial, effet de levier, déductibilité des intérêts, montages en SCI." },
          { title: "Crédit professionnel", text: "Financement de l'acquisition, du développement ou de la restructuration de votre activité." },
          { title: "Crédit lombard", text: "Emprunt adossé à vos actifs financiers pour financer un projet sans liquider vos placements." },
          { title: "SCI & montages", text: "Financement via personnes morales, prêts intra-groupe, refinancement de holding." },
          { title: "Assurance emprunteur", text: "Délégation d'assurance, comparaison des garanties, optimisation du coût total du crédit." },
        ]}
      />

      <StickyImageBand
        image={heroImg}
        imageAlt="Courtage et financement KANTI"
        eyebrow="Courtage indépendant"
        caption="Le crédit n'est pas qu'une question de taux. C'est un outil patrimonial."
      />

      <ProductGrid
        eyebrow="Solutions de financement"
        title="Les financements que nous structurons"
        intro="De la résidence principale au crédit lombard, chaque montage est négocié et adapté à votre stratégie patrimoniale."
        categorySlug={category.slug}
        products={category.products}
        hideLinks
      />
      <PageCTA
        title="Parlons de votre projet de financement"
        subtitle="Nous étudions votre dossier et vous obtenons les meilleures conditions du marché."
        eyebrow="Courtage indépendant"
        index="06"
        secondaryText="Patrimoine immobilier"
        secondaryHref="/immobilier"
      />
      <Footer />
    </>
  );
}
