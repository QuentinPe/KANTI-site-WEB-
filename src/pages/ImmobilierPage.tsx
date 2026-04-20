import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PageCTA from "@/components/PageCTA";
import TrustBand from "@/components/TrustBand";
import ImmobilierSimulator from "@/components/simulators/ImmobilierSimulator";

export default function ImmobilierPage() {
  useScrollReveal();

  return (
    <>
      <Header />
      <PageHero
        title="Patrimoine immobilier"
        highlight="& stratégie"
        subtitle="Résidence principale, investissement locatif, SCI, nue-propriété : chaque décision immobilière s'inscrit dans une logique patrimoniale globale."
        breadcrumb="Immobilier"
      />

      <section className="section-padding bg-background texture-paper">
        <div className="max-w-5xl mx-auto">
          <div className="reveal">
            <h2 className="text-2xl md:text-3xl font-heading font-semibold text-primary leading-tight mb-6">
              L'immobilier est rarement une décision isolée. Nous l'intégrons dans votre stratégie.
            </h2>
            <p className="text-gray-text leading-relaxed mb-4">
              Un investissement locatif n'a pas le même sens selon que vous êtes à 30 % ou 45 % de tranche marginale. Un achat en SCI peut être pertinent pour la transmission, mais coûteux en gestion. Un crédit à taux fixe peut être préférable à un apport total, même si vous avez la trésorerie.
            </p>
            <p className="text-gray-text leading-relaxed mb-8">
              Notre rôle est de vous aider à prendre la bonne décision immobilière en tenant compte de l'ensemble des paramètres : fiscalité, financement, mode de détention, rendement net, liquidité et horizon de placement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 reveal">
            {[
              { title: "Résidence principale", text: "Arbitrage achat/location, capacité d'emprunt, impact patrimonial et fiscal, exonération de plus-value." },
              { title: "Investissement locatif", text: "Localisation, rendement brut et net, régime fiscal (nu/meublé/LMNP), montage en nom propre ou en société." },
              { title: "SCI patrimoniale", text: "Constitution, rédaction des statuts, choix IR/IS, gestion locative, cession de parts, démembrement des parts." },
              { title: "Nue-propriété", text: "Acquisition à prix réduit, absence de fiscalité sur les revenus, récupération au terme, hors assiette IFI." },
              { title: "SCPI & immobilier papier", text: "Diversification géographique et sectorielle, mutualisation du risque, revenus réguliers, souscription en assurance-vie." },
              { title: "Financement", text: "Négociation des conditions de crédit, effet de levier, déductibilité des intérêts, structuration du passif." },
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
          <ImmobilierSimulator />
          <p className="text-[11px] text-foreground/45 mt-6 text-center">
            Simulation indicative avec revalorisation de 2 % / an et 25 % de charges. Ne constitue pas un conseil en investissement.
          </p>
        </div>
      </section>

      <TrustBand />
      <PageCTA
        title="Parlons de votre projet immobilier"
        subtitle="Un premier échange pour analyser votre projet et identifier le montage le plus adapté."
        secondaryText="Financement & crédit"
        secondaryHref="/financement"
      />
      <Footer />
    </>
  );
}
