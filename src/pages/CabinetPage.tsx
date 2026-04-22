import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PageCTA from "@/components/PageCTA";
import CinematicGallery from "@/components/CinematicGallery";
import CabinetMap3D from "@/components/CabinetMap3D";
import VirtualTourFAB from "@/components/VirtualTourFAB";
import bureau1 from "@/assets/cabinet-bureaux-1.jpg";
import bureau2 from "@/assets/cabinet-bureaux-2.jpg";
import bureau3 from "@/assets/cabinet-bureaux-3.jpg";
import bureau4 from "@/assets/cabinet-bureaux-4.jpg";

export default function CabinetPage() {
  useScrollReveal();

  return (
    <>
      <Header />
      <PageHero
        title="Le Cabinet"
        subtitle="KANTI est un cabinet indépendant de conseil en gestion de patrimoine, installé à Bordeaux. Nous intervenons auprès de particuliers, de familles et de dirigeants d'entreprise."
        breadcrumb="Le Cabinet"
      />

      <section className="section-padding bg-background texture-paper">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-14 items-start">
            <div className="lg:col-span-3 reveal">
              <p className="text-[13px] tracking-widest uppercase text-gold mb-4">Qui sommes-nous</p>
              <h2 className="text-2xl md:text-3xl font-heading font-semibold text-primary leading-tight mb-6">
                Un cabinet fondé sur une conviction simple : votre conseil doit travailler pour vous, pas pour une banque
              </h2>
              <p className="text-gray-text leading-relaxed mb-4">
                KANTI est né d'un constat partagé par ses trois associés, tous issus de la banque privée : les intérêts du client et ceux de l'établissement ne sont pas toujours alignés. Nous avons fait le choix de l'indépendance totale pour lever cette ambiguïté.
              </p>
              <p className="text-gray-text leading-relaxed mb-4">
                Depuis plus de quinze ans, nous accompagnons nos clients dans la durée. Pas de produit maison, pas de quota commercial, pas de pression de réseau. Chaque recommandation est le fruit d'une analyse objective de votre situation, en architecture ouverte.
              </p>
              <p className="text-gray-text leading-relaxed">
                Installés au cœur de Bordeaux, nous travaillons en étroite coordination avec les notaires, avocats fiscalistes et experts-comptables de nos clients. Cette approche pluridisciplinaire garantit une vision patrimoniale cohérente et complète.
              </p>
            </div>
            <div className="lg:col-span-2 reveal reveal-delay-2">
              <div className="border-l-2 border-gold/40 pl-8 space-y-8">
                <div>
                  <p className="text-2xl font-heading font-semibold text-primary">2009</p>
                  <p className="text-sm text-gray-text mt-1">Création du cabinet à Bordeaux</p>
                </div>
                <div>
                  <p className="text-2xl font-heading font-semibold text-primary">3 associés</p>
                  <p className="text-sm text-gray-text mt-1">Ingénierie patrimoniale, fiscalité, marchés</p>
                </div>
                <div>
                  <p className="text-2xl font-heading font-semibold text-primary">500+</p>
                  <p className="text-sm text-gray-text mt-1">Familles et dirigeants accompagnés</p>
                </div>
                <div>
                  <p className="text-2xl font-heading font-semibold text-primary">98 %</p>
                  <p className="text-sm text-gray-text mt-1">Taux de fidélisation annuel</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding section-ivory">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 reveal">
            <p className="text-[13px] tracking-widest uppercase text-gold mb-4">Ce qui nous guide</p>
            <h2 className="text-2xl md:text-3xl font-heading font-semibold text-primary">
              Quatre engagements, pas de promesse creuse
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 reveal">
            {[
              { title: "Indépendance", text: "Aucun lien capitalistique avec un groupe financier. Nous sélectionnons les meilleurs produits du marché, quel que soit l'émetteur." },
              { title: "Transparence", text: "Notre mode de rémunération est communiqué en amont. Honoraires ou commissions, vous savez exactement comment nous sommes payés." },
              { title: "Rigueur", text: "Chaque recommandation repose sur une analyse documentée. Nous rédigeons une lettre de mission et un rapport détaillé pour chaque client." },
              { title: "Continuité", text: "Un interlocuteur dédié, un rendez-vous de suivi annuel, une veille réglementaire permanente. Notre accompagnement ne s'arrête pas à la souscription." },
            ].map((v, i) => (
              <div key={v.title} className={`reveal-delay-${i + 1} border-t border-border pt-6`}>
                <h3 className="font-heading text-lg font-semibold text-primary mb-2">{v.title}</h3>
                <p className="text-gray-text text-sm leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cinematic immersion in our offices */}
      <CinematicGallery
        slides={[
          {
            image: bureau1,
            alt: "Espace de travail collaboratif KANTI sous charpente",
            eyebrow: "Espace collaboratif",
            title: "Sous les charpentes, là où les idées se croisent.",
            caption: "Plateau ouvert, lumière zénithale et phone-box pour les appels confidentiels.",
          },
          {
            image: bureau2,
            alt: "Hall d'entrée vitré du cabinet KANTI",
            eyebrow: "Accueil",
            title: "Une entrée discrète, un seuil qui invite à la confidence.",
            caption: "Verrières noires, bois clair et plantes : l'élégance discrète qui caractérise nos rendez-vous.",
          },
          {
            image: bureau3,
            alt: "Salle de réunion premium avec luminaires Vertigo",
            eyebrow: "Salle de réunion",
            title: "Pour les décisions qui pèsent, un cadre à la hauteur.",
            caption: "Salle de comité dédiée aux audits patrimoniaux, transmissions et réunions familiales.",
          },
          {
            image: bureau4,
            alt: "Bureau individuel avec station de travail double",
            eyebrow: "Bureau d'analyse",
            title: "Là où votre dossier est étudié — ligne par ligne.",
            caption: "Stations de travail dédiées à l'ingénierie patrimoniale et à l'analyse fiscale.",
          },
        ]}
      />

      {/* Breathing transition between gallery & map */}
      <section className="section-ivory py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center reveal">
          <p className="text-[13px] tracking-[0.3em] uppercase text-gold mb-6">
            — Du dedans au dehors —
          </p>
          <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl text-primary leading-tight mb-6">
            Un écrin discret, au cœur d'un quartier d'exception.
          </h2>
          <p className="text-base md:text-lg text-gray-text leading-relaxed">
            Derrière nos portes, l'atmosphère feutrée d'un cabinet de conseil.
            Devant nos fenêtres, l'élégance bordelaise du Triangle d'Or —
            ses façades classées, ses adresses choisies, son tempo paisible.
          </p>
          <div className="mt-10 mx-auto w-px h-16 bg-gradient-to-b from-gold/60 to-transparent" />
        </div>
      </section>

      <CabinetMap3D />

      <PageCTA
        title="Rencontrons-nous"
        subtitle="Un premier échange de 30 minutes pour parler de votre situation et voir comment nous pouvons vous aider."
        eyebrow="Le cabinet"
        index="02"
        secondaryText="En savoir plus sur notre méthode"
        secondaryHref="/notre-methode"
      />
      <Footer />

      {/* Floating 360° virtual tour CTA */}
      <VirtualTourFAB href="https://adnfamily.com/studio/mind/adn/bureaux.html" />
    </>
  );
}
