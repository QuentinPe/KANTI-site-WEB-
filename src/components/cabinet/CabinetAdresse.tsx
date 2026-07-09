import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Phone, Mail } from "lucide-react";
import facade from "@/assets/cabinet-seq-03-facade.jpg";

export default function CabinetAdresse() {
  return (
    <section id="adresse" className="section-padding section-dark relative overflow-hidden">
      {/* Ambient glow — cohérent avec les autres sections dark */}
      <div
        aria-hidden
        className="absolute -top-40 -left-20 w-[500px] h-[500px] rounded-full pointer-events-none opacity-30"
        style={{
          background: "radial-gradient(circle, hsl(218 45% 38% / 0.35) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* En-tête standard — même pattern que les autres sections dark */}
        <div className="mb-14 reveal max-w-2xl">
          <div className="electric-line mb-5" />
          <p className="text-[11px] tracking-[0.3em] uppercase text-white/50 mb-4 font-medium">
            Nous trouver
          </p>
          <h2 className="text-4xl md:text-5xl font-heading font-light text-white mb-4 tracking-tight leading-[1.05]">
            L'adresse.
          </h2>
          <p className="text-white/60 text-lg font-light leading-relaxed">
            Sur rendez-vous, à Bordeaux.
          </p>
        </div>

        {/* Grid 12 colonnes */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">

          {/* Photo façade */}
          <figure className="lg:col-span-7 relative reveal">
            <div className="relative rounded-[22px] overflow-hidden ring-1 ring-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.65)] aspect-[4/3] lg:aspect-[5/4] lg:h-full">
              <img
                src={facade}
                alt="Entrée du cabinet KANTI, 12 rue Ferrere, Bordeaux"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(180deg, transparent 50%, hsl(224 60% 7% / 0.65) 100%)",
                }}
                aria-hidden
              />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <p className="text-[10px] tracking-[0.3em] uppercase text-white/75 font-medium">
                  Le cabinet
                </p>
                <span className="text-[10px] tracking-[0.25em] uppercase text-white/50">
                  12 rue Ferrere · Bordeaux
                </span>
              </div>
            </div>
          </figure>

          {/* Bloc infos */}
          <div className="lg:col-span-5 flex flex-col reveal reveal-delay-1">
            <div className="rounded-2xl glass-dark p-7 md:p-8 flex-1 flex flex-col">
              <dl className="space-y-0 divide-y divide-white/10">

                <div className="pb-5">
                  <dt className="text-[10px] tracking-[0.32em] uppercase text-white/40 mb-2 font-medium">
                    Adresse
                  </dt>
                  <dd className="font-heading text-xl md:text-2xl text-white leading-snug font-light">
                    Cabinet KANTI
                    <br />
                    <span className="italic text-white/70">12 Rue Ferrere — 33000 Bordeaux</span>
                  </dd>
                </div>

                <div className="py-4 flex flex-col gap-2">
                  <a
                    href="tel:+33663324809"
                    className="inline-flex items-center gap-2.5 text-white/75 hover:text-white transition-colors duration-300 text-[14px] font-light group"
                  >
                    <Phone className="w-3.5 h-3.5 text-white/40 group-hover:text-white/70 transition-colors" strokeWidth={1.5} />
                    06 63 32 48 09
                  </a>
                  <a
                    href="mailto:kanti@adnfamily.com"
                    className="inline-flex items-center gap-2.5 text-white/75 hover:text-white transition-colors duration-300 text-[14px] font-light group"
                  >
                    <Mail className="w-3.5 h-3.5 text-white/40 group-hover:text-white/70 transition-colors" strokeWidth={1.5} />
                    kanti@adnfamily.com
                  </a>
                </div>

                <div className="py-4">
                  <dt className="text-[10px] tracking-[0.32em] uppercase text-white/40 mb-2 font-medium">
                    Horaires
                  </dt>
                  <dd className="text-white/70 text-[14px] leading-relaxed font-light">
                    Lundi — Vendredi · 9h00 — 19h00
                    <br />
                    Sur rendez-vous uniquement.
                  </dd>
                </div>

                <div className="py-4">
                  <dt className="text-[10px] tracking-[0.32em] uppercase text-white/40 mb-1.5 font-medium">
                    Zone de conseil
                  </dt>
                  <dd className="text-white/70 text-[14px] leading-relaxed font-light">
                    Bordeaux et tout le territoire national.
                  </dd>
                </div>

                <div className="pt-4">
                  <dt className="text-[10px] tracking-[0.32em] uppercase text-white/30 mb-1 font-medium">
                    Siège social
                  </dt>
                  <dd className="text-white/40 text-[12px] font-light">
                    9 Rue de la Négresse — 64200 Biarritz
                  </dd>
                </div>

              </dl>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-white text-navy-deep text-sm font-medium tracking-wide rounded-full hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 reflection-sweep"
                >
                  Prendre rendez-vous
                  <ArrowRight
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    strokeWidth={1.5}
                  />
                </Link>
                <a
                  href="https://share.google/dAsdiZH2F1BB2RXpd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-6 py-3 btn-glass text-white text-sm font-medium tracking-wide"
                >
                  <MapPin className="w-4 h-4 text-white/70" strokeWidth={1.5} />
                  Venir au cabinet
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
