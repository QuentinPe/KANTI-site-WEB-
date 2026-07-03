import { Link } from "react-router-dom";

const POSTER = "/video/cta-mountain-poster.jpg";

export default function CTAFinalMobile() {
  return (
    <section
      id="contact"
      className="md:hidden relative overflow-hidden text-white"
    >
      <div className="absolute inset-0">
        <img
          src={POSTER}
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, hsl(224 60% 7% / 0.55) 0%, hsl(224 60% 7% / 0.7) 60%, hsl(224 60% 7% / 0.95) 100%)",
          }}
        />
      </div>

      <div
        className="relative z-10 px-6 pt-24 pb-32"
      >
        <div className="max-w-md mx-auto">
          <p className="text-[10px] tracking-[0.32em] uppercase text-white/55 mb-5 font-medium">
            Premier rendez-vous · Bordeaux
          </p>
          <h2 className="font-heading text-[36px] font-light leading-[1.05] tracking-tight mb-5">
            Parlons de votre
            <br />
            <span className="italic text-white/85">patrimoine.</span>
          </h2>
          <p className="text-white/70 text-[15.5px] leading-relaxed font-light mb-8 max-w-[34ch]">
            30 minutes en visio ou dans nos bureaux du Rue de la Négresse.
            Gratuit, confidentiel, sans engagement.
          </p>

          <div className="flex flex-col gap-3 mb-10">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 h-14 rounded-full bg-white text-[hsl(var(--navy-deep))] text-[15px] font-medium tracking-wide"
            >
              Prendre rendez-vous
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.6}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
            <Link
              to="/bilan-patrimonial-bordeaux"
              className="inline-flex items-center justify-center h-14 rounded-full ring-1 ring-white/25 text-white text-[15px] font-light tracking-wide bg-white/5"
            >
              Demander un bilan patrimonial
            </Link>
          </div>

          <div className="rounded-3xl bg-white/[0.06] backdrop-blur-xl ring-1 ring-white/10 p-5">
            <p className="text-[10px] tracking-[0.28em] uppercase text-white/55 mb-4 font-medium">
              Coordonnées
            </p>
            <ul className="space-y-3 text-white/85 text-[14.5px] font-light">
              <li>
                9 Rue de la Négresse
                <br />
                <span className="text-white/55 text-[13px]">64200 Biarritz</span>
              </li>
              <li>
                <a
                  href="tel:+33663324809"
                  className="inline-flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--electric-soft))]" />
                  06 63 32 48 09
                </a>
              </li>
              <li>
                <a
                  href="mailto:kanti@adnfamily.com"
                  className="inline-flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--electric-soft))]" />
                  kanti@adnfamily.com
                </a>
              </li>
            </ul>
            <p className="mt-5 pt-4 border-t border-white/10 text-white/55 text-[12px] font-light leading-relaxed">
              Lundi → vendredi · 9h–18h
              <br />
              Réponse sous 24 h ouvrées
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}