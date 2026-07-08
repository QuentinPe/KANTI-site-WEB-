import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import facade from "@/assets/cabinet-seq-03-facade.jpg";

export default function CabinetAdresse() {
  return (
    <section id="adresse" className="paper-grain text-ink py-24 md:py-36 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Chapter header */}
        <div className="mb-16 md:mb-20 flex items-end justify-between border-b border-ink/25 pb-6">
          <div>
            <p className="font-editorial text-[10px] tracking-[0.35em] uppercase text-ink/60 mb-3">
              Chapitre III
            </p>
            <h2 className="font-editorial text-3xl md:text-5xl font-normal leading-[1.05] tracking-tight">
              L'adresse.
            </h2>
          </div>
          <p className="hidden md:block font-editorial italic text-[12px] tracking-[0.25em] text-ink/55">
            Sur rendez-vous, dans le Triangle d'Or.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Photo façade */}
          <figure className="lg:col-span-7">
            <div className="relative overflow-hidden ring-1 ring-ink/15 aspect-[4/3] lg:aspect-[5/4]">
              <img
                src={facade}
                alt="Porte cochère du cabinet KANTI, Triangle d'Or, Bordeaux"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
            <figcaption className="mt-3 font-editorial italic text-[11px] tracking-[0.22em] text-ink/55">
              Figure 04 &nbsp;·&nbsp; La porte, avant tout le reste.
            </figcaption>
          </figure>

          {/* Bloc adresse — editorial */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <dl className="space-y-6">
                <div className="border-b border-ink/15 pb-5">
                  <dt className="font-editorial text-[10px] tracking-[0.32em] uppercase text-ink/50 mb-2">
                    Adresse
                  </dt>
                  <dd className="font-editorial text-xl md:text-2xl text-ink leading-snug">
                    Cabinet KANTI
                    <br />
                    <span className="italic text-ink/75">Triangle d'Or — Bordeaux</span>
                  </dd>
                </div>
                <div className="border-b border-ink/15 pb-5">
                  <dt className="font-editorial text-[10px] tracking-[0.32em] uppercase text-ink/50 mb-2">
                    Horaires
                  </dt>
                  <dd className="text-ink/80 text-[15px] leading-relaxed font-light">
                    Lundi — Vendredi · 9h00 — 19h00
                    <br />
                    Sur rendez-vous uniquement.
                  </dd>
                </div>
                <div className="pb-2">
                  <dt className="font-editorial text-[10px] tracking-[0.32em] uppercase text-ink/50 mb-2">
                    Prise de contact
                  </dt>
                  <dd className="text-ink/80 text-[15px] leading-relaxed font-light">
                    Nous vous rappelons dans la journée
                    <br />
                    pour convenir d'un premier échange.
                  </dd>
                </div>
              </dl>

              {/* Cachet or éditorial */}
              <div
                className="mt-10 inline-flex flex-col items-center justify-center rounded-full border-2 border-gold/70 text-gold px-6 py-6 rotate-[-6deg]"
                aria-hidden
              >
                <p className="font-editorial italic text-[10px] tracking-[0.32em] uppercase leading-none">
                  Établi à
                </p>
                <p className="font-editorial text-lg tracking-[0.25em] leading-tight mt-1">
                  Bordeaux
                </p>
                <p className="font-editorial italic text-[10px] tracking-[0.32em] uppercase leading-none mt-1">
                  depuis 2009
                </p>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-ink/20">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-3 font-editorial text-[15px] tracking-[0.15em] uppercase text-ink border-b border-ink hover:text-gold hover:border-gold transition-colors duration-300 pb-1"
              >
                Prendre rendez-vous
                <ArrowRight
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={1.5}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
