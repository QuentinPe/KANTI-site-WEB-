import { Link } from "react-router-dom";
import { MapPin, Clock, Phone, ArrowRight } from "lucide-react";
import facade from "@/assets/facade-cabinet.jpg";

export default function CabinetAdresse() {
  return (
    <section id="adresse" className="section-padding texture-paper relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          {/* Photo façade */}
          <div className="lg:col-span-7 reveal">
            <div className="relative rounded-[22px] overflow-hidden ring-1 ring-foreground/10 shadow-[0_30px_80px_-25px_rgba(15,25,50,0.35)] aspect-[4/3] lg:aspect-auto lg:h-full">
              <img
                src={facade}
                alt="Façade du cabinet KANTI au cœur du Triangle d'Or à Bordeaux"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 55%, hsl(224 60% 7% / 0.35) 100%)",
                }}
                aria-hidden
              />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <p className="text-[10px] tracking-[0.3em] uppercase text-white/75 font-medium">
                  Le seuil du cabinet
                </p>
                <span className="text-[10px] tracking-[0.25em] uppercase text-white/55">
                  Triangle d'Or
                </span>
              </div>
            </div>
          </div>

          {/* Bloc adresse */}
          <div className="lg:col-span-5 reveal reveal-delay-2 flex flex-col justify-between">
            <div>
              <p className="text-[11px] tracking-[0.32em] uppercase text-gold mb-4 font-medium">
                Nous rencontrer
              </p>
              <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground leading-[1.1] tracking-tight mb-8">
                Au cœur du Triangle d'Or,
                <br />
                <span className="italic text-foreground/65">à Bordeaux.</span>
              </h2>

              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <span className="w-10 h-10 rounded-full ring-1 ring-gold/40 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-gold" strokeWidth={1.5} />
                  </span>
                  <div>
                    <p className="text-[10px] tracking-[0.28em] uppercase text-foreground/45 font-medium mb-1">
                      Adresse
                    </p>
                    <p className="text-foreground/85 text-[15.5px] leading-relaxed font-light">
                      Cabinet KANTI
                      <br />
                      Triangle d'Or — Bordeaux
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-10 h-10 rounded-full ring-1 ring-gold/40 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-gold" strokeWidth={1.5} />
                  </span>
                  <div>
                    <p className="text-[10px] tracking-[0.28em] uppercase text-foreground/45 font-medium mb-1">
                      Horaires
                    </p>
                    <p className="text-foreground/85 text-[15.5px] leading-relaxed font-light">
                      Lundi — Vendredi · 9h00 · 19h00
                      <br />
                      Sur rendez-vous uniquement.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-10 h-10 rounded-full ring-1 ring-gold/40 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-gold" strokeWidth={1.5} />
                  </span>
                  <div>
                    <p className="text-[10px] tracking-[0.28em] uppercase text-foreground/45 font-medium mb-1">
                      Contact
                    </p>
                    <p className="text-foreground/85 text-[15.5px] leading-relaxed font-light">
                      Nous vous rappelons dans la journée
                      <br />
                      pour convenir d'un premier échange.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="mt-10 pt-8 border-t border-foreground/10">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground text-sm font-medium tracking-wide rounded-full hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                Prendre rendez-vous
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
