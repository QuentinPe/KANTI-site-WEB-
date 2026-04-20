import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PageCTA from "@/components/PageCTA";
import TrustBand from "@/components/TrustBand";

export default function BilanPatrimonialPage() {
  useScrollReveal();

  return (
    <>
      <Header />
      <PageHero
        title="Bilan patrimonial"
        highlight="à Bordeaux"
        subtitle="Un diagnostic complet de votre situation patrimoniale : actifs, passifs, fiscalité, prévoyance, régimes matrimoniaux. Pour y voir clair avant de décider."
        breadcrumb="Bilan patrimonial"
      />

      <section className="section-padding bg-background texture-paper">
        <div className="max-w-5xl mx-auto">
          <div className="reveal">
            <h2 className="text-2xl md:text-3xl font-heading font-semibold text-primary leading-tight mb-6">
              Pourquoi faire un bilan patrimonial ?
            </h2>
            <p className="text-gray-text leading-relaxed mb-4">
              Un bilan patrimonial n'est pas un produit financier. C'est un exercice d'analyse global qui permet de poser un diagnostic objectif sur l'ensemble de votre situation : ce que vous possédez, ce que vous devez, ce que vous gagnez, ce que vous payez en impôts, ce que vous risquez, et ce que vous transmettrez.
            </p>
            <p className="text-gray-text leading-relaxed mb-8">
              Beaucoup de nos clients viennent nous voir parce qu'ils ont le sentiment que leur patrimoine manque de cohérence : des placements ouverts à différentes époques, des contrats mal coordonnés, une fiscalité subie plutôt que pilotée, une succession non préparée. Le bilan patrimonial est la première étape pour remettre de l'ordre et construire une stratégie claire.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 mb-16 reveal">
            <div className="border-t border-border pt-6">
              <h3 className="font-heading text-lg font-semibold text-primary mb-2">Ce que nous analysons</h3>
              <ul className="space-y-2 text-sm text-gray-text">
                <li>• Patrimoine immobilier : résidence principale, locatif, SCI</li>
                <li>• Patrimoine financier : assurance-vie, PEA, compte-titres, PER</li>
                <li>• Passif : crédits en cours, engagements</li>
                <li>• Fiscalité : IR, IFI, revenus fonciers, plus-values</li>
                <li>• Prévoyance : couverture décès, invalidité, dépendance</li>
                <li>• Régime matrimonial et dispositions successorales</li>
              </ul>
            </div>
            <div className="border-t border-border pt-6">
              <h3 className="font-heading text-lg font-semibold text-primary mb-2">Ce que vous obtenez</h3>
              <ul className="space-y-2 text-sm text-gray-text">
                <li>• Une cartographie complète de votre patrimoine</li>
                <li>• Une analyse de votre fiscalité avec marges d'optimisation</li>
                <li>• Un diagnostic de votre couverture prévoyance</li>
                <li>• Une simulation successorale chiffrée</li>
                <li>• Une lettre de recommandations structurée et argumentée</li>
                <li>• Un plan d'action priorisé, avec calendrier</li>
              </ul>
            </div>
          </div>

          <div className="reveal">
            <h2 className="text-2xl md:text-3xl font-heading font-semibold text-primary leading-tight mb-6">
              Pour qui ?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { profil: "Particuliers", desc: "Vous avez constitué un patrimoine et souhaitez le structurer, l'optimiser ou préparer sa transmission." },
                { profil: "Cadres dirigeants", desc: "Vous avez des revenus élevés, une fiscalité lourde et des arbitrages complexes entre épargne, immobilier et fiscalité." },
                { profil: "Chefs d'entreprise", desc: "Vous devez coordonner patrimoine personnel et professionnel, préparer une cession ou restructurer votre rémunération." },
              ].map((p) => (
                <div key={p.profil} className="border-t border-border pt-6">
                  <p className="text-xs tracking-widest uppercase text-gold mb-2">{p.profil}</p>
                  <p className="text-gray-text text-sm leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TrustBand />
      <PageCTA
        title="Demandez votre bilan patrimonial"
        subtitle="Un premier échange de 30 minutes pour évaluer ensemble la pertinence d'un bilan patrimonial dans votre situation."
        buttonText="Demander un bilan"
      />
      <Footer />
    </>
  );
}
