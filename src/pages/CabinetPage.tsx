import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageCTA from "@/components/PageCTA";
import CinematicGallery from "@/components/CinematicGallery";
import VirtualTourFAB from "@/components/VirtualTourFAB";
import CabinetHero from "@/components/CabinetHero";
import QuentinPerromat from "@/components/cabinet/QuentinPerromat";
import CabinetAdresse from "@/components/cabinet/CabinetAdresse";
import bureau1 from "@/assets/cabinet-bureaux-1.jpg";
import bureau2 from "@/assets/cabinet-bureaux-2.jpg";
import bureau3 from "@/assets/cabinet-bureaux-3.jpg";
import bureau4 from "@/assets/cabinet-bureaux-4.jpg";

export default function CabinetPage() {
  useScrollReveal();

  return (
    <>
      <Header />
      <CabinetHero />

      <section className="section-padding bg-background texture-paper">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl reveal mb-16">
            <p className="text-[11px] tracking-[0.32em] uppercase text-gold mb-4 font-medium">Qui sommes-nous</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-light text-foreground leading-[1.1] tracking-tight mb-8">
              Un cabinet fondé sur une conviction simple&nbsp;:
              <br />
              <span className="italic text-foreground/65">
                votre conseil doit travailler pour vous.
              </span>
            </h2>
            <p className="text-foreground/70 leading-relaxed mb-5 font-light text-[16.5px]">
              KANTI est né d'un constat : les intérêts du client et ceux des grands
              établissements ne sont pas toujours alignés. Nous avons fait le choix
              d'une approche libre, en architecture ouverte, pour lever cette
              ambiguïté.
            </p>
            <p className="text-foreground/70 leading-relaxed mb-5 font-light text-[16.5px]">
              Nous accompagnons nos clients dans la durée. Pas de produit maison,
              pas de quota commercial, pas de pression de réseau. Chaque
              recommandation repose sur une analyse objective de votre situation.
            </p>
            <p className="text-foreground/70 leading-relaxed font-light text-[16.5px]">
              Installés au cœur de Bordeaux, nous travaillons en étroite
              coordination avec les notaires, avocats fiscalistes et
              experts-comptables de nos clients. Une vision patrimoniale
              cohérente, complète, pluridisciplinaire.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 border-t border-foreground/10 pt-10 reveal">
            {[
              { v: "2009", l: "Année de fondation" },
              { v: "15+ ans", l: "d'expertise cumulée" },
              { v: "500+", l: "Familles accompagnées" },
              { v: "98 %", l: "Taux de fidélisation" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-heading text-2xl md:text-4xl font-light text-foreground tracking-tight">
                  {s.v}
                </div>
                <div className="text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-foreground/50 mt-2 leading-snug">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <QuentinPerromat />

      <section className="section-padding section-ivory">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14 reveal max-w-2xl">
            <p className="text-[11px] tracking-[0.32em] uppercase text-gold mb-4 font-medium">Ce qui nous guide</p>
            <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground leading-[1.1] tracking-tight">
              Quatre engagements,
              <br />
              <span className="italic text-foreground/65">pas de promesse creuse.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 reveal">
            {[
              { title: "Architecture ouverte", text: "Sélection des meilleurs produits du marché, quel que soit l'émetteur. Aucun quota, aucun produit maison." },
              { title: "Transparence", text: "Mode de rémunération communiqué en amont. Honoraires ou commissions, vous savez comment nous sommes payés." },
              { title: "Rigueur", text: "Chaque recommandation repose sur une analyse documentée : lettre de mission et rapport détaillé pour chaque client." },
              { title: "Continuité", text: "Un interlocuteur dédié, un rendez-vous de suivi annuel, une veille réglementaire permanente." },
            ].map((v, i) => (
              <div
                key={v.title}
                className="group rounded-2xl bg-white/70 ring-1 ring-foreground/[0.07] p-6 md:p-7 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
              >
                <p className="font-heading text-sm text-gold/80 tracking-[0.22em] mb-4">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="font-heading text-lg md:text-xl font-normal text-foreground mb-3 tracking-tight">
                  {v.title}
                </h3>
                <p className="text-foreground/60 text-[14px] leading-relaxed font-light">
                  {v.text}
                </p>
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
            title: "Là où votre dossier est étudié, ligne par ligne.",
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
            Devant nos fenêtres, l'élégance bordelaise du Triangle d'Or -
            ses façades classées, ses adresses choisies, son tempo paisible.
          </p>
          <div className="mt-10 mx-auto w-px h-16 bg-gradient-to-b from-gold/60 to-transparent" />
        </div>
      </section>

      <CabinetAdresse />

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
