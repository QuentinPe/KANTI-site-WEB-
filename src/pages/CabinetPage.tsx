import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageCTA from "@/components/PageCTA";
import VirtualTourFAB from "@/components/VirtualTourFAB";
import CabinetMasthead from "@/components/cabinet/CabinetMasthead";
import CabinetHeroSequence from "@/components/cabinet/CabinetHeroSequence";
import QuentinPerromat from "@/components/cabinet/QuentinPerromat";
import CarnetBordelais from "@/components/cabinet/CarnetBordelais";
import CabinetAdresse from "@/components/cabinet/CabinetAdresse";

const MANIFESTE = [
  "KANTI est né d'un constat simple : les intérêts du client et ceux des grands établissements ne sont pas toujours alignés. Nous avons fait le choix d'une approche libre, en architecture ouverte, pour lever cette ambiguïté — sans produit maison, sans quota, sans pression de réseau.",
  "Nous accompagnons familles, cadres et dirigeants dans la durée. Chaque recommandation repose sur une analyse objective de la situation, écrite noir sur blanc, discutée et signée. Installés au cœur de Bordeaux, nous travaillons en coordination étroite avec les notaires, avocats fiscalistes et experts-comptables de nos clients.",
];

const ENGAGEMENTS = [
  {
    num: "I",
    title: "Architecture ouverte.",
    text:
      "Sélection des meilleurs produits du marché, quel que soit l'émetteur. Aucun quota, aucun produit maison.",
  },
  {
    num: "II",
    title: "Transparence.",
    text:
      "Mode de rémunération communiqué en amont. Honoraires ou commissions, vous savez comment nous sommes payés.",
  },
  {
    num: "III",
    title: "Rigueur.",
    text:
      "Chaque recommandation repose sur une analyse documentée : lettre de mission et rapport détaillé pour chaque client.",
  },
  {
    num: "IV",
    title: "Continuité.",
    text:
      "Un interlocuteur dédié, un rendez-vous de suivi annuel, une veille réglementaire permanente.",
  },
];

const CHIFFRES = [
  { v: "2009", l: "Fondation" },
  { v: "15+", l: "Années d'expertise" },
  { v: "500+", l: "Familles" },
  { v: "98 %", l: "Fidélisation" },
];

export default function CabinetPage() {
  useScrollReveal();

  return (
    <>
      <Header />
      <CabinetMasthead />
      <CabinetHeroSequence />

      {/* Manifeste — grille magazine */}
      <section id="manifeste" className="paper-grain text-ink py-24 md:py-36">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16 md:mb-20 flex items-end justify-between border-b border-ink/25 pb-6">
            <div>
              <p className="font-editorial text-[10px] tracking-[0.35em] uppercase text-ink/60 mb-3">
                Éditorial
              </p>
              <h2 className="font-editorial text-3xl md:text-5xl font-normal leading-[1.05] tracking-tight">
                Qui sommes-nous.
              </h2>
            </div>
            <p className="hidden md:block font-editorial italic text-[12px] tracking-[0.25em] text-ink/55">
              — un manifeste bordelais —
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
            <div className="lg:col-span-8">
              <p className="font-editorial text-2xl md:text-4xl leading-[1.1] tracking-tight text-ink mb-10">
                Un cabinet fondé sur une conviction simple —{" "}
                <em className="italic text-ink/70">
                  votre conseil doit travailler pour vous.
                </em>
              </p>
              <div className="magazine-columns text-ink/80 text-[15.5px] leading-[1.75] font-light drop-cap">
                {MANIFESTE.join(" ")}
              </div>
            </div>

            {/* Marginalia — chiffres-clés */}
            <aside className="lg:col-span-4 lg:pl-8 lg:border-l lg:border-ink/15">
              <p className="font-editorial text-[10px] tracking-[0.35em] uppercase text-ink/55 mb-6">
                Encart &nbsp;·&nbsp; en chiffres
              </p>
              <ul className="space-y-5">
                {CHIFFRES.map((s) => (
                  <li key={s.l} className="flex items-baseline justify-between border-b border-ink/12 pb-4">
                    <span className="font-editorial text-3xl md:text-4xl text-ink tracking-tight">
                      {s.v}
                    </span>
                    <span className="font-editorial italic text-[12px] tracking-[0.2em] text-ink/55">
                      {s.l}
                    </span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      <QuentinPerromat />

      {/* Quatre engagements — colonnes de journal */}
      <section id="engagements" className="paper-grain text-ink py-24 md:py-36">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16 md:mb-20 flex items-end justify-between border-b border-ink/25 pb-6">
            <div>
              <p className="font-editorial text-[10px] tracking-[0.35em] uppercase text-ink/60 mb-3">
                Éditorial &nbsp;·&nbsp; la charte
              </p>
              <h2 className="font-editorial text-3xl md:text-5xl font-normal leading-[1.05] tracking-tight">
                Quatre engagements,
                <br />
                <span className="italic">pas de promesse creuse.</span>
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-4 md:divide-x divide-ink/15">
            {ENGAGEMENTS.map((e) => (
              <div key={e.num} className="p-6 md:p-8 first:pl-0 last:pr-0">
                <p className="font-editorial text-4xl md:text-5xl text-gold mb-6 leading-none">
                  {e.num}
                </p>
                <h3 className="font-editorial text-lg md:text-xl text-ink mb-4 leading-snug">
                  {e.title}
                </h3>
                <p className="text-ink/70 text-[14px] leading-relaxed font-light text-justify hyphens-auto">
                  {e.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CarnetBordelais />

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
