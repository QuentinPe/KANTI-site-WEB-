import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PageCTA from "@/components/PageCTA";
import TrustBand from "@/components/TrustBand";
import TransmissionSimulator from "@/components/simulators/TransmissionSimulator";

export default function TransmissionPage() {
  useScrollReveal();

  return (
    <>
      <Header />
      <PageHero
        title="Transmission"
        highlight="du patrimoine familial"
        subtitle="Anticiper pour protéger ceux qui comptent. Donation, succession, démembrement, assurance-vie : préparer la transmission, c'est un acte de responsabilité."
        breadcrumb="Transmission"
      />

      <section className="section-padding bg-background texture-paper">
        <div className="max-w-5xl mx-auto">
          <div className="reveal">
            <h2 className="text-2xl md:text-3xl font-heading font-semibold text-primary leading-tight mb-6">
              La transmission ne s'improvise pas. Elle se prépare, se structure et se documente.
            </h2>
            <p className="text-gray-text leading-relaxed mb-4">
              En l'absence de dispositions, c'est le Code civil qui organise la succession — et il n'est pas toujours conforme à vos souhaits. Le conjoint survivant peut se retrouver en indivision avec les enfants, les droits de mutation peuvent atteindre des montants considérables, et les actifs peuvent être liquidés dans l'urgence pour payer la fiscalité.
            </p>
            <p className="text-gray-text leading-relaxed mb-8">
              Préparer la transmission, c'est d'abord prendre le temps de réfléchir à ce que vous voulez transmettre, à qui, dans quelles conditions et à quel moment. Ensuite, nous mettons en place les outils juridiques et financiers adaptés, en coordination avec votre notaire.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 mb-16 reveal">
            {[
              { title: "Donation-partage", text: "Répartir les biens de votre vivant, figer les valeurs, utiliser les abattements renouvelables tous les 15 ans." },
              { title: "Démembrement de propriété", text: "Transmettre la nue-propriété en conservant l'usufruit : réduction de l'assiette taxable, maintien du cadre de vie ou des revenus." },
              { title: "Assurance-vie", text: "Clause bénéficiaire sur mesure, abattement de 152 500 € par bénéficiaire, transmission hors succession sous conditions." },
              { title: "Pacte Dutreil", text: "Exonération partielle des droits de donation pour la transmission d'une entreprise familiale, sous engagement de conservation." },
              { title: "Protection du conjoint", text: "Donation entre époux, changement de régime matrimonial, testament, mandat de protection future." },
              { title: "Calendrier de transmission", text: "Échelonner les donations dans le temps pour utiliser pleinement les abattements et réduire les droits progressifs." },
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
          <TransmissionSimulator />
          <p className="text-[11px] text-foreground/45 mt-6 text-center">
            Estimation indicative. Les droits réels dépendent de la composition du patrimoine et des dispositions déjà en place.
          </p>
        </div>
      </section>

      <TrustBand />
      <PageCTA
        title="Anticipez votre transmission"
        subtitle="Un premier échange pour évaluer votre situation successorale et identifier les actions à engager."
        secondaryText="Demander un bilan patrimonial"
        secondaryHref="/bilan-patrimonial-bordeaux"
      />
      <Footer />
    </>
  );
}
