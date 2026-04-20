import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PageCTA from "@/components/PageCTA";
import TrustBand from "@/components/TrustBand";
import PatrimoineProSimulator from "@/components/simulators/PatrimoineProSimulator";

export default function PatrimoineProPage() {
  useScrollReveal();

  return (
    <>
      <Header />
      <PageHero
        title="Patrimoine professionnel"
        subtitle="Dirigeants, associés, professions libérales : votre entreprise est votre premier actif. Structurez-la, protégez-la, préparez sa transmission."
        breadcrumb="Patrimoine professionnel"
      />

      <section className="section-padding bg-background texture-paper">
        <div className="max-w-5xl mx-auto">
          <div className="reveal">
            <h2 className="text-2xl md:text-3xl font-heading font-semibold text-primary leading-tight mb-6">
              Patrimoine privé et professionnel sont indissociables. Nous les traitons ensemble.
            </h2>
            <p className="text-gray-text leading-relaxed mb-4">
              Quand un dirigeant arbitre entre salaire et dividendes, il impacte sa retraite, sa couverture sociale, sa fiscalité personnelle et la capacité d'investissement de son entreprise. Quand il prépare une cession, il doit anticiper la fiscalité de la plus-value, le réinvestissement du produit et la protection de son conjoint.
            </p>
            <p className="text-gray-text leading-relaxed mb-8">
              Notre approche croise systématiquement les enjeux personnels et professionnels. Nous intervenons en coordination avec votre expert-comptable et votre avocat pour garantir la cohérence des décisions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 reveal">
            {[
              { title: "Rémunération du dirigeant", text: "Arbitrage salaire / dividendes / avantages, impact sur les cotisations sociales, la retraite et l'IR." },
              { title: "Trésorerie d'entreprise", text: "Placement de l'excédent de trésorerie sur des supports adaptés au profil de risque de la société." },
              { title: "Holding & structuration", text: "Création ou restructuration de holding pour optimiser la détention d'actifs, la remontée de dividendes et la transmission." },
              { title: "Prévoyance du dirigeant", text: "Assurance homme-clé, garantie croisée entre associés, prévoyance décès et invalidité, contrat retraite Madelin." },
              { title: "Cession d'entreprise", text: "Préparation à la cession : valorisation, structuration du montage, optimisation fiscale de la plus-value, réinvestissement." },
              { title: "Transmission familiale", text: "Pacte Dutreil, donation avec réserve d'usufruit, engagement collectif de conservation, family buy-out." },
            ].map((e, i) => (
              <div key={e.title} className={`reveal-delay-${(i % 2) + 1} border-t border-border pt-6`}>
                <h3 className="font-heading text-lg font-semibold text-primary mb-2">{e.title}</h3>
                <p className="text-gray-text text-sm leading-relaxed">{e.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simulator */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto reveal">
          <PatrimoineProSimulator />
        </div>
      </section>

      <TrustBand />
      <PageCTA
        title="Dirigeants, parlons stratégie"
        subtitle="Un premier échange confidentiel pour analyser votre situation et identifier les arbitrages prioritaires."
        secondaryText="Cas clients dirigeants"
        secondaryHref="/cas-clients"
      />
      <Footer />
    </>
  );
}
