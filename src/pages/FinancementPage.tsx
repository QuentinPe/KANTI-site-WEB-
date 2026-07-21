import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PageCTA from "@/components/PageCTA";
import ExpertiseShowcase from "@/components/ExpertiseShowcase";
import ProductGrid from "@/components/ProductGrid";
import StickyImageBand from "@/components/StickyImageBand";
import ScrollRevealText from "@/components/ScrollRevealText";
import ProcessStepper from "@/components/ProcessStepper";
import StatsBand from "@/components/StatsBand";
import CreditCharts from "@/components/CreditCharts";
import { getCategory } from "@/data/productsCatalog";

import heroImg from "@/assets/expertise-financement.jpg";
import advisorsImg from "@/assets/contact-advisors.jpg";
import meetingImg from "@/assets/contact-meeting.jpg";
import bureaux1Img from "@/assets/cabinet-bureaux-1.jpg";
import bureaux2Img from "@/assets/cabinet-bureaux-2.jpg";
import marbleImg from "@/assets/marble-texture.jpg";

const PROCESS_STEPS = [
  {
    label: "Analyse de votre situation",
    description:
      "Bilan de votre capacité d'emprunt, de votre patrimoine existant et de vos objectifs à court et long terme. Nous définissons ensemble le bon levier.",
    image: bureaux1Img,
    imageAlt: "Analyse patrimoniale KANTI",
  },
  {
    label: "Montage du dossier",
    description:
      "Constitution d'un dossier solide et complet : pièces justificatives, simulation détaillée, étude d'assurance emprunteur et structuration juridique si nécessaire.",
    image: bureaux2Img,
    imageAlt: "Montage du dossier de financement",
  },
  {
    label: "Négociation bancaire",
    description:
      "Mise en concurrence de nos 20+ établissements partenaires. Nous négocions taux, garanties, modularité et conditions d'assurance · pas seulement le taux nominal.",
    image: advisorsImg,
    imageAlt: "Négociation avec les banques partenaires KANTI",
  },
  {
    label: "Suivi jusqu'à la signature",
    description:
      "Accompagnement complet jusqu'à l'acte notarié : relances banque, coordination avec l'étude, vérification de l'offre finale. Vous ne gérez rien.",
    image: meetingImg,
    imageAlt: "Suivi client KANTI jusqu'à la signature",
  },
];

export default function FinancementPage() {
  useScrollReveal();
  const category = getCategory("financement")!;

  return (
    <>
      <Header />

      {/* §1 · Hero cinématique */}
      <PageHero
        title="Financement & crédit"
        highlight="courtage patrimonial"
        subtitle="Obtenir les meilleures conditions de financement pour vos projets immobiliers et professionnels. Conseil intégré, négociation sur-mesure."
        breadcrumb="Financement"
        eyebrow="Courtage patrimonial"
        stats={[
          { value: "20+", label: "Banques partenaires" },
          { value: "0%", label: "Frais cachés" },
          { value: "48h", label: "Première étude" },
        ]}
      />

      {/* §2 · Manifeste éditorial */}
      <section className="section-padding bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="electric-line mb-8" />
          <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/40 mb-10 font-medium">
            Crédit patrimonial
          </p>
          <ScrollRevealText
            text="Le crédit n'est pas qu'une question de taux. C'est un outil patrimonial · structuré pour accélérer votre capital, optimiser votre fiscalité et préserver votre capacité d'investissement."
            className="font-heading font-light text-foreground leading-[1.2] tracking-tight"
          />
        </div>
      </section>

      {/* §3 · ExpertiseShowcase avec stagger latéral */}
      <ExpertiseShowcase
        eyebrow="Crédit patrimonial"
        title="Six leviers, une stratégie globale."
        intro="Un financement bien structuré accélère la constitution de votre patrimoine et préserve votre capacité d'investissement. En courtier patrimonial, nous accédons aux offres de nombreux établissements et négocions taux, assurance, garanties et modularité, en intégrant chaque crédit dans votre stratégie globale."
        image={advisorsImg}
        imageAlt="Conseillers KANTI · courtage patrimonial"
        pillars={[
          { title: "Résidence principale", text: "Acquisition, renégociation, rachat de crédit. Analyse de la capacité d'emprunt et de l'impact fiscal." },
          { title: "Investissement locatif", text: "Financement patrimonial, effet de levier, déductibilité des intérêts, montages en SCI." },
          { title: "Crédit professionnel", text: "Financement de l'acquisition, du développement ou de la restructuration de votre activité." },
          { title: "Crédit lombard", text: "Emprunt adossé à vos actifs financiers pour financer un projet sans liquider vos placements." },
          { title: "SCI & montages", text: "Financement via personnes morales, prêts intra-groupe, refinancement de holding." },
          { title: "Assurance emprunteur", text: "Délégation d'assurance, comparaison des garanties, optimisation du coût total du crédit." },
        ]}
      />

      {/* §4 · StickyImageBand (image différente du hero) */}
      <StickyImageBand
        image={meetingImg}
        imageAlt="Réunion client KANTI"
        eyebrow="Courtage patrimonial"
        caption="Chaque dossier est négocié individuellement. Pas de solution standard."
      />

      {/* §5 · Processus en 4 temps */}
      <ProcessStepper
        eyebrow="Notre méthode"
        title="De l'analyse à la signature, nous gérons chaque étape."
        steps={PROCESS_STEPS}
      />

      {/* §6 · Chiffres & Confiance */}
      <StatsBand
        eyebrow="En chiffres"
        headline="Accès à 20+ établissements financiers, négociés individuellement pour votre dossier."
        image={marbleImg}
        stats={[
          { value: 20, suffix: "+", label: "Banques partenaires" },
          { value: 0, suffix: "%", label: "Frais cachés" },
          { value: 48, suffix: "h", label: "Première étude" },
          { value: 100, suffix: "%", label: "Accompagnement" },
        ]}
      />

      {/* §7 · Graphiques marché */}
      <CreditCharts />

      {/* §8 · ProductGrid (6 cards = 3×2 équilibré avec la CTA card) */}
      <ProductGrid
        eyebrow="Solutions de financement"
        title="Les financements que nous structurons"
        intro="De la résidence principale au crédit lombard, chaque montage est négocié et adapté à votre stratégie patrimoniale."
        categorySlug={category.slug}
        products={category.products}
        hideLinks
        ctaCard={{
          title: "Votre projet ne rentre dans aucune case ?",
          description: "Chaque situation patrimoniale est unique. Nous étudions tout dossier sur-mesure, même les plus complexes.",
          href: "/contact",
          buttonText: "Prendre rendez-vous",
        }}
      />

      <PageCTA
        title="Parlons de votre projet de financement"
        subtitle="Nous étudions votre dossier et vous obtenons les meilleures conditions du marché."
        eyebrow="Courtage patrimonial"
        index="06"
        secondaryText="Patrimoine immobilier"
        secondaryHref="/immobilier"
      />

      <Footer />
    </>
  );
}
