import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PageCTA from "@/components/PageCTA";
import TrustBand from "@/components/TrustBand";

export default function ChefEntreprisePage() {
  useScrollReveal();

  return (
    <>
      <Header />
      <PageHero
        title="Gestion de patrimoine"
        highlight="pour chefs d'entreprise"
        subtitle="Rémunération, trésorerie, holding, prévoyance, retraite, transmission : un accompagnement dédié aux dirigeants et aux professions libérales."
        breadcrumb="Chef d'entreprise"
      />

      <section className="section-padding bg-background texture-paper">
        <div className="max-w-5xl mx-auto">
          <div className="reveal">
            <h2 className="text-2xl md:text-3xl font-heading font-semibold text-primary leading-tight mb-6">
              Votre entreprise est votre premier actif. Traitez-la comme tel.
            </h2>
            <p className="text-gray-text leading-relaxed mb-4">
              Un chef d'entreprise qui optimise sa rémunération sans penser à sa retraite fait une erreur. Un dirigeant qui prépare sa cession sans anticiper la fiscalité de la plus-value prend un risque majeur. Un associé qui n'a pas de garantie croisée met en péril l'entreprise et sa famille.
            </p>
            <p className="text-gray-text leading-relaxed mb-8">
              Notre approche est transversale : nous analysons simultanément les dimensions personnelles et professionnelles de votre patrimoine. Chaque décision est évaluée sous l'angle fiscal, social, juridique et financier — en coordination avec votre expert-comptable et votre avocat.
            </p>
          </div>

          <div className="space-y-0 reveal">
            {[
              { title: "Arbitrage rémunération / dividendes", text: "Simulation comparative de l'impact fiscal et social de différents schémas de rémunération. Prise en compte des cotisations TNS ou assimilé salarié, de la retraite future et de l'IR du foyer." },
              { title: "Trésorerie excédentaire", text: "Votre entreprise génère du cash inutilisé ? Nous identifions les supports de placement adaptés au profil de risque de la société, avec prise en compte des contraintes comptables et fiscales." },
              { title: "Création ou restructuration de holding", text: "Holding animatrice ou passive, constitution par apport ou par cession, remontée de dividendes, mise en réserve. Nous structurons le montage avec votre conseil juridique." },
              { title: "Prévoyance et retraite du dirigeant", text: "Assurance homme-clé, contrat Madelin, garantie croisée entre associés, PER obligatoire. Nous vérifions que votre couverture est à la hauteur de vos responsabilités." },
              { title: "Préparation de la cession", text: "Valorisation de l'entreprise, choix du moment, structuration du montage (cession de titres ou de fonds), anticipation de la fiscalité de la plus-value, réinvestissement post-cession." },
              { title: "Transmission familiale de l'entreprise", text: "Pacte Dutreil, engagement collectif de conservation, donation avec réserve d'usufruit, family buy-out. Anticiper pour réduire les droits de mutation." },
            ].map((item, i) => (
              <div key={item.title} className={`reveal-delay-${Math.min(i + 1, 3)} py-6 ${i > 0 ? "border-t border-border" : ""}`}>
                <h3 className="font-heading text-lg font-semibold text-primary mb-2">{item.title}</h3>
                <p className="text-gray-text text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TrustBand />
      <PageCTA
        title="Dirigeants, faisons le point"
        subtitle="Un échange confidentiel de 30 minutes pour analyser votre situation de dirigeant et identifier les premiers axes de travail."
        secondaryText="Voir les cas clients"
        secondaryHref="/cas-clients"
      />
      <Footer />
    </>
  );
}
