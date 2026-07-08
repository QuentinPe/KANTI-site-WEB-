import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageCTA from "@/components/PageCTA";
import VirtualTourFAB from "@/components/VirtualTourFAB";
import CabinetHeroSequence from "@/components/cabinet/CabinetHeroSequence";
import QuentinPerromat from "@/components/cabinet/QuentinPerromat";
import CarnetBordelais from "@/components/cabinet/CarnetBordelais";
import CabinetAdresse from "@/components/cabinet/CabinetAdresse";

import { motion, useReducedMotion } from "framer-motion";

const MANIFESTE = [
  "KANTI est né d'un constat simple : les intérêts du client et ceux des grands établissements ne sont pas toujours alignés. Nous avons fait le choix d'une approche libre, en architecture ouverte, pour lever cette ambiguïté — sans produit maison, sans quota, sans pression de réseau.",
  "Nous accompagnons familles, cadres et dirigeants dans la durée. Chaque recommandation repose sur une analyse objective de la situation, écrite noir sur blanc, discutée et signée. Installés au cœur de Bordeaux, nous travaillons en coordination étroite avec les notaires, avocats fiscalistes et experts-comptables de nos clients.",
];

const CHIFFRES = [
  { v: "2009", l: "Fondation" },
  { v: "15+", l: "Années d'expertise" },
  { v: "500+", l: "Familles" },
  { v: "98 %", l: "Fidélisation" },
];

export default function CabinetPage() {
  useScrollReveal();
  const reduce = useReducedMotion();

  return (
    <>
      <Header />
      <CabinetHeroSequence />

      {/* Manifeste — glass sur navy */}
      <section id="manifeste" className="relative bg-navy text-ivory py-24 md:py-36 overflow-hidden">
        <div
          aria-hidden
          className="absolute top-[-10%] left-[10%] w-[520px] h-[520px] rounded-full pointer-events-none float-soft"
          style={{
            background: "radial-gradient(circle, hsl(var(--gold) / 0.10) 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="mb-16 md:mb-20 flex items-end justify-between border-b border-ivory/15 pb-6">
            <div>
              <p className="text-[10px] tracking-[0.35em] uppercase text-gold mb-3 font-medium">
                Prologue
              </p>
              <h2 className="font-heading text-3xl md:text-5xl font-light leading-[1.05] tracking-tight text-white">
                Qui sommes-nous.
              </h2>
            </div>
            <p className="hidden md:block font-heading italic text-[12px] tracking-[0.25em] text-ivory/55">
              — un manifeste bordelais —
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
            <div className="lg:col-span-8">
              <p className="font-heading text-2xl md:text-4xl leading-[1.1] tracking-tight text-white mb-10 font-light">
                Un cabinet fondé sur une conviction simple —{" "}
                <em className="italic text-ivory/70">
                  votre conseil doit travailler pour vous.
                </em>
              </p>
              <div className="rounded-2xl glass-dark p-6 md:p-8 space-y-5">
                {MANIFESTE.map((p, i) => (
                  <p key={i} className="text-ivory/75 text-[15.5px] leading-[1.75] font-light">
                    {p}
                  </p>
                ))}
              </div>
            </div>

            {/* Marginalia — chiffres-clés */}
            <aside className="lg:col-span-4">
              <p className="text-[10px] tracking-[0.35em] uppercase text-gold mb-6 font-medium">
                En chiffres
              </p>
              <ul className="space-y-3">
                {CHIFFRES.map((s, i) => (
                  <motion.li
                    key={s.l}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10% 0px" }}
                    transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-baseline justify-between rounded-2xl glass-dark px-5 py-4"
                  >
                    <span className="font-heading text-3xl md:text-4xl font-light text-white tracking-tight">
                      {s.v}
                    </span>
                    <span className="text-[10px] tracking-[0.24em] uppercase text-ivory/60 font-medium">
                      {s.l}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      <QuentinPerromat />

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
