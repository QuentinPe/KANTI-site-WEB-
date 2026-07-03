import { Link } from "react-router-dom";

// Reuse the SAME visual as the desktop hero (poster of the office video sequence)
// → ensures perfect brand consistency between desktop and mobile.
const HERO_IMAGE = "/video/hero-office-poster.jpg";

const trust = [
  { k: "ORIAS", v: "Inscrit & vérifié" },
  { k: "CNCGP", v: "Membre certifié" },
  { k: "15 ans", v: "à Biarritz" },
  { k: "500+", v: "familles" },
];

export default function HeroMobile() {
  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex flex-col text-white overflow-hidden"
    >
      <img
        src={HERO_IMAGE}
        alt=""
        aria-hidden
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, hsl(224 60% 7% / 0.55) 0%, hsl(224 60% 7% / 0.35) 35%, hsl(224 60% 7% / 0.85) 100%)",
        }}
      />

      <div
        className="relative z-10 flex-1 flex flex-col justify-end px-6"
        style={{
          paddingTop: "calc(max(env(safe-area-inset-top), 12px) + 96px)",
          paddingBottom: "calc(max(env(safe-area-inset-bottom), 12px) + 32px)",
        }}
      >
        <span className="inline-flex w-fit items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md ring-1 ring-white/15 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--electric-soft))]" />
          <span className="text-[10px] tracking-[0.28em] uppercase text-white/85 font-medium">
            Cabinet · Biarritz
          </span>
        </span>

        <h1 className="font-heading font-light text-white leading-[1.05] tracking-tight text-[40px] mb-5">
          Votre patrimoine
          <br />
          mérite{" "}
          <span className="italic font-normal text-white/85">
            un conseil juste
          </span>
          .
        </h1>

        <p className="text-white/70 text-[16px] leading-[1.55] font-light mb-8 max-w-[34ch]">
          Conseil indépendant en gestion de patrimoine. À Biarritz, depuis plus de 15 ans.
        </p>

        <div className="flex flex-col gap-3">
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
            className="inline-flex items-center justify-center h-14 rounded-full ring-1 ring-white/25 text-white text-[15px] font-light tracking-wide bg-white/5 backdrop-blur-sm"
          >
            Demander un bilan patrimonial
          </Link>
        </div>

        {/* Trust signals — horizontal scroll */}
        <div className="mt-10 -mx-6 px-6 overflow-x-auto no-scrollbar snap-x snap-mandatory">
          <ul className="flex gap-3 w-max">
            {trust.map((t) => (
              <li
                key={t.k}
                className="snap-start shrink-0 inline-flex items-center gap-2 px-4 h-10 rounded-full bg-white/8 backdrop-blur-sm ring-1 ring-white/12"
              >
                <span className="text-[11px] font-semibold text-white tracking-wider">
                  {t.k}
                </span>
                <span className="text-[11px] text-white/55 font-light">
                  {t.v}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}