import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import facade from "@/assets/cabinet-seq-03-facade.jpg";

export default function CabinetAdresse() {
  return (
    <section id="adresse" className="relative bg-navy-deep text-ivory py-24 md:py-36 overflow-hidden">
      <div
        aria-hidden
        className="absolute top-[10%] left-[-8%] w-[520px] h-[520px] rounded-full pointer-events-none float-slow"
        style={{
          background: "radial-gradient(circle, hsl(var(--gold) / 0.12) 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="mb-16 md:mb-20 flex items-end justify-between border-b border-ivory/15 pb-6">
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-gold mb-3 font-medium">
              Nous trouver
            </p>
            <h2 className="font-heading text-3xl md:text-5xl font-light leading-[1.05] tracking-tight text-white">
              L'adresse.
            </h2>
          </div>
          <p className="hidden md:block font-heading italic text-[12px] tracking-[0.25em] text-ivory/55">
            Sur rendez-vous, à Biarritz.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          {/* Photo façade */}
          <figure className="lg:col-span-7 relative">
            <div
              aria-hidden
              className="absolute -inset-6 rounded-[32px] opacity-70 pointer-events-none"
              style={{
                background: "radial-gradient(circle at 30% 30%, hsl(var(--gold) / 0.25), transparent 65%)",
                filter: "blur(28px)",
              }}
            />
            <div className="relative rounded-[22px] overflow-hidden ring-1 ring-white/12 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.65)] aspect-[4/3] lg:aspect-[5/4] lg:h-full">
              <img
                src={facade}
                alt="Porte cochère du cabinet KANTI, Triangle d'Or, Bordeaux"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(180deg, transparent 55%, hsl(224 60% 7% / 0.55) 100%)",
                }}
                aria-hidden
              />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <p className="text-[10px] tracking-[0.3em] uppercase text-white/75 font-medium">
                  Le seuil du cabinet
                </p>
                <span className="text-[10px] tracking-[0.25em] uppercase text-white/55">
                  Triangle d'Or
                </span>
              </div>
            </div>
          </figure>

          {/* Bloc adresse — glass premium */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="rounded-2xl glass-dark p-7 md:p-8 flex-1 flex flex-col">
              <dl className="space-y-5">
                <div className="pb-5 border-b border-white/10">
                  <dt className="text-[10px] tracking-[0.32em] uppercase text-gold/85 mb-2 font-medium">
                    Adresse
                  </dt>
                  <dd className="font-heading text-xl md:text-2xl text-white leading-snug font-light">
                    Cabinet KANTI
                    <br />
                    <span className="italic text-ivory/75">9 Rue de la Négresse — 64200 Biarritz</span>
                  </dd>
                </div>
                <div className="pb-5 border-b border-white/10">
                  <dt className="text-[10px] tracking-[0.32em] uppercase text-gold/85 mb-2 font-medium">
                    Horaires
                  </dt>
                  <dd className="text-ivory/80 text-[15px] leading-relaxed font-light">
                    Lundi — Vendredi · 9h00 — 19h00
                    <br />
                    Sur rendez-vous uniquement.
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] tracking-[0.32em] uppercase text-gold/85 mb-2 font-medium">
                    Premier contact
                  </dt>
                  <dd className="text-ivory/80 text-[15px] leading-relaxed font-light">
                    Nous vous rappelons dans la journée pour convenir d'un premier échange, sans engagement.
                  </dd>
                </div>
              </dl>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground text-sm font-medium tracking-wide rounded-full hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
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
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-full glass-dark ring-1 ring-gold/40 text-ivory text-sm font-medium tracking-wide hover:ring-gold/80 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <MapPin className="w-4 h-4 text-gold" strokeWidth={1.5} />
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
