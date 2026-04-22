import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PageCTA from "@/components/PageCTA";
import TransmissionSimulator from "@/components/simulators/TransmissionSimulator";
import ExpertiseShowcase from "@/components/ExpertiseShowcase";
import ProductGrid from "@/components/ProductGrid";
import StickyImageBand from "@/components/StickyImageBand";
import { getCategory } from "@/data/productsCatalog";
import heroImg from "@/assets/expertise-transmission.jpg";

export default function TransmissionPage() {
  useScrollReveal();
  const category = getCategory("transmission-patrimoine-famille")!;

  return (
    <>
      <Header />
      <PageHero
        title="Transmission"
        highlight="du patrimoine familial"
        subtitle="Anticiper pour protéger ceux qui comptent. Donation, succession, démembrement, assurance-vie : préparer la transmission, c'est un acte de responsabilité."
        breadcrumb="Transmission"
        eyebrow="Héritage & famille"
        stats={[
          { value: "152 500€", label: "Abattement assurance-vie" },
          { value: "15 ans", label: "Cycle des donations" },
          { value: "Notaire", label: "Coordination intégrée" },
        ]}
      />

      <ExpertiseShowcase
        eyebrow="Préparer & protéger"
        title="La transmission ne s'improvise pas. Elle se prépare, se structure et se documente."
        intro="En l'absence de dispositions, c'est le Code civil qui organise la succession — pas toujours conformément à vos souhaits. Préparer la transmission, c'est réfléchir à ce que vous voulez transmettre, à qui, comment et quand. Nous mettons ensuite en place les outils juridiques et financiers adaptés, en coordination avec votre notaire."
        image={heroImg}
        imageAlt="Transmission familiale KANTI"
        pillars={[
          { title: "Donation-partage", text: "Répartir les biens de votre vivant, figer les valeurs, utiliser les abattements renouvelables tous les 15 ans." },
          { title: "Démembrement de propriété", text: "Transmettre la nue-propriété en conservant l'usufruit : réduction de l'assiette taxable, maintien des revenus." },
          { title: "Assurance-vie", text: "Clause bénéficiaire sur mesure, abattement de 152 500 € par bénéficiaire, hors succession sous conditions." },
          { title: "Pacte Dutreil", text: "Exonération partielle des droits de donation pour la transmission d'une entreprise familiale." },
          { title: "Protection du conjoint", text: "Donation entre époux, changement de régime matrimonial, testament, mandat de protection future." },
          { title: "Calendrier de transmission", text: "Échelonner les donations pour utiliser pleinement les abattements et réduire les droits progressifs." },
        ]}
      />

      <StickyImageBand
        image={heroImg}
        imageAlt="Transmission patrimoniale familiale"
        eyebrow="Héritage & famille"
        caption="La transmission ne s'improvise pas. Elle se prépare, se structure et se documente."
      />

      {/* Simulator */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto reveal">
          <div className="mb-10 md:mb-14 flex items-center gap-4">
            <span className="text-[10px] tracking-[0.32em] uppercase text-foreground/55 font-medium">Simulez</span>
            <div className="h-px flex-1 bg-foreground/10" />
          </div>
          <TransmissionSimulator />
        </div>
      </section>

      <ProductGrid
        eyebrow="Outils de transmission"
        title="Les outils juridiques & financiers"
        intro="Donation, démembrement, assurance-vie, Dutreil : autant d'outils combinables pour transmettre dans les meilleures conditions."
        categorySlug={category.slug}
        products={category.products}
      />
      <PageCTA
        title="Anticipez votre transmission"
        subtitle="Un premier échange pour évaluer votre situation successorale et identifier les actions à engager."
        eyebrow="Héritage & famille"
        index="04"
        secondaryText="Demander un bilan patrimonial"
        secondaryHref="/bilan-patrimonial-bordeaux"
      />
      <Footer />
    </>
  );
}
