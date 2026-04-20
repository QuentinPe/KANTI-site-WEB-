import { Link } from "react-router-dom";

export default function Contact() {
  return (
    <section id="contact" className="section-padding texture-paper relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="reveal">
            <div className="electric-line mb-5" />
            <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-5 font-medium">
              Contact
            </p>
            <h2 className="text-4xl md:text-5xl font-heading font-light text-foreground leading-[1.1] mb-8 tracking-tight">
              Un premier échange,<br />
              <span className="italic text-foreground/70">sans engagement</span>
            </h2>
            <p className="text-foreground/65 leading-relaxed mb-5 text-[17px] font-light">
              Vous avez un projet, une question, ou simplement besoin d'un regard extérieur sur votre situation patrimoniale ? Nous vous proposons un premier rendez-vous de 30 minutes, gratuit, pour faire le point ensemble.
            </p>
            <p className="text-foreground/55 leading-relaxed mb-10 text-sm font-light">
              Ce rendez-vous n'est pas un entretien commercial. C'est un échange entre vous et un conseiller expérimenté, pour clarifier vos priorités et voir si un accompagnement a du sens.
            </p>
            <div className="space-y-3 text-sm text-foreground/65 font-light">
              <p className="flex items-center gap-3">
                <span className="w-1 h-1 rounded-full bg-[hsl(var(--electric))]" />
                12 Cours de l'Intendance, 33000 Bordeaux
              </p>
              <p className="flex items-center gap-3">
                <span className="w-1 h-1 rounded-full bg-[hsl(var(--electric))]" />
                05 56 00 00 00
              </p>
              <p className="flex items-center gap-3">
                <span className="w-1 h-1 rounded-full bg-[hsl(var(--electric))]" />
                contact@kanti.fr
              </p>
              <p className="text-foreground/40 pt-3 text-xs">
                Du lundi au vendredi, 9h–18h — Sur rendez-vous
              </p>
            </div>
          </div>

          <div className="reveal reveal-delay-2">
            <div className="glass-float p-8 md:p-10">
              <p className="text-xs tracking-[0.25em] uppercase text-foreground/50 mb-6 font-medium">
                Choisissez votre canal
              </p>
              <div className="space-y-3">
                <Link
                  to="/contact"
                  className="group flex items-center justify-between w-full py-4 px-6 btn-primary-glass text-sm font-medium tracking-wide reflection-sweep"
                >
                  <span>Prendre rendez-vous</span>
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link
                  to="/bilan-patrimonial-bordeaux"
                  className="group flex items-center justify-between w-full py-4 px-6 glass border border-foreground/10 text-foreground rounded-full text-sm font-medium tracking-wide hover:border-foreground/20 transition-all duration-300"
                >
                  <span>Demander un bilan patrimonial</span>
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link
                  to="/contact"
                  className="group flex items-center justify-between w-full py-4 px-6 glass border border-foreground/10 text-foreground rounded-full text-sm font-medium tracking-wide hover:border-foreground/20 transition-all duration-300"
                >
                  <span>Être rappelé</span>
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
              <p className="text-xs text-foreground/40 mt-6 text-center font-light">
                Réponse sous 24 heures ouvrées · Confidentiel
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
