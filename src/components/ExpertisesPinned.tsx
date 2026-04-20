import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useReducedMotion, MotionValue } from "framer-motion";

const expertises = [
  {
    tag: "Épargne & placements",
    title: "Gestion patrimoniale",
    description:
      "Allocation d'actifs, assurance-vie, PER, compte-titres, SCPI — une stratégie d'épargne construite pour durer.",
    benefit: "Faire travailler votre capital en cohérence avec vos projets de vie.",
    href: "/gestion-patrimoniale",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80",
  },
  {
    tag: "Fiscalité",
    title: "Fiscalité du patrimoine",
    description:
      "Audit fiscal, IFI, revenus fonciers, structuration — réduire votre pression fiscale sans prendre de risques inutiles.",
    benefit: "Identifier vos marges de manœuvre fiscales réelles.",
    href: "/fiscalite",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80",
  },
  {
    tag: "Dirigeants",
    title: "Patrimoine professionnel",
    description:
      "Rémunération du dirigeant, trésorerie d'entreprise, holding, prévoyance, cession et transmission d'activité.",
    benefit: "Articuler patrimoine privé et professionnel avec méthode.",
    href: "/patrimoine-professionnel",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
  },
  {
    tag: "Financement",
    title: "Financement & crédit",
    description:
      "Courtage indépendant, négociation des meilleures conditions, montages patrimoniaux adaptés à chaque projet.",
    benefit: "Obtenir les conditions de crédit les plus compétitives.",
    href: "/financement",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
  },
  {
    tag: "Succession",
    title: "Transmission & prévoyance",
    description:
      "Donation, démembrement, assurance-vie, pacte Dutreil — anticiper pour protéger ceux qui comptent.",
    benefit: "Préparer la transmission en maîtrisant la fiscalité.",
    href: "/transmission-patrimoine-famille",
    image:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1600&q=80",
  },
  {
    tag: "Immobilier",
    title: "Immobilier patrimonial",
    description:
      "Résidence principale, locatif, SCI, nue-propriété — chaque investissement pensé dans une logique globale.",
    benefit: "Structurer vos actifs immobiliers intelligemment.",
    href: "/patrimoine-immobilier-strategie",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
  },
];

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

/**
 * Build non-overlapping keyframes inside a [start, end] slot.
 * The card fades in/out *within* its own window so two adjacent cards
 * never reach opacity > 0 simultaneously.
 */
function buildKeyframes(start: number, end: number, fadeRatio = 0.25) {
  const span = end - start;
  const fade = span * Math.min(fadeRatio, 0.45); // cap so we keep a stable middle
  const a = clamp01(start);
  const b = clamp01(Math.max(a + 0.0001, start + fade));
  const c = clamp01(Math.max(b + 0.0001, end - fade));
  const d = clamp01(Math.max(c + 0.0001, end));
  return [a, b, c, d] as const;
}

export default function ExpertisesPinned() {
  return (
    <>
      {/* Mobile fallback — stacked cards */}
      <section
        id="expertises"
        className="md:hidden section-glass texture-paper section-padding"
      >
        <div className="max-w-2xl mx-auto">
          <div className="electric-line mb-5" />
          <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-5 font-medium">
            Nos expertises
          </p>
          <h2 className="text-4xl font-heading font-light text-foreground mb-6 leading-[1.1] tracking-tight">
            Ce que nous faisons,<br />
            <span className="italic text-foreground/70">concrètement</span>
          </h2>
          <p className="text-foreground/60 text-base leading-relaxed font-light mb-12">
            Chaque domaine est traité en lien avec les autres.
          </p>
          <div className="space-y-5">
            {expertises.map((e, i) => (
              <article key={e.title} className="glass-card rounded-[1.5rem] overflow-hidden">
                <div
                  className="aspect-[16/10] bg-cover bg-center"
                  style={{ backgroundImage: `url(${e.image})` }}
                />
                <div className="p-6">
                  <p className="text-[10px] tracking-[0.25em] uppercase text-foreground/50 font-medium mb-3">
                    {e.tag} · {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="font-heading text-2xl font-light text-foreground tracking-tight mb-3">
                    {e.title}
                  </h3>
                  <p className="text-foreground/65 text-[15px] leading-relaxed font-light mb-4">
                    {e.description}
                  </p>
                  <Link
                    to={e.href}
                    className="inline-flex items-center gap-2 text-sm font-medium text-foreground link-underline pb-1"
                  >
                    Découvrir l'expertise
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Desktop — pinned scrollytelling */}
      <ExpertisesPinnedDesktop />
    </>
  );
}

function ExpertisesPinnedDesktop() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <section
      id="expertises-desktop"
      className="hidden md:block section-glass texture-paper relative"
    >
      <div ref={ref} className="relative" style={{ height: `${expertises.length * 95}vh` }}>
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full grid grid-cols-12 gap-10 items-center">
            {/* Left — sticky text + index list */}
            <div className="col-span-5">
              <div className="electric-line mb-5" />
              <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-5 font-medium">
                Nos expertises
              </p>
              <h2 className="text-4xl lg:text-5xl xl:text-6xl font-heading font-light text-foreground mb-6 leading-[1.05] tracking-tight">
                Ce que nous faisons,<br />
                <span className="italic text-foreground/70">concrètement</span>
              </h2>
              <p className="text-foreground/60 text-base lg:text-lg font-light max-w-md leading-relaxed mb-10">
                Chaque domaine est traité en lien avec les autres. C'est cette approche transversale qui fait la différence.
              </p>

              <ol className="space-y-2.5 border-l border-foreground/10 pl-6">
                {expertises.map((e, i) => {
                  const start = i / expertises.length;
                  const end = (i + 1) / expertises.length;
                  return (
                    <ExpertiseRow
                      key={e.title}
                      number={String(i + 1).padStart(2, "0")}
                      title={e.title}
                      progress={scrollYProgress}
                      start={start}
                      end={end}
                    />
                  );
                })}
              </ol>
            </div>

            {/* Right — active expertise card with image */}
            <div className="col-span-7 relative h-[560px]">
              {expertises.map((e, i) => {
                const start = i / expertises.length;
                const end = (i + 1) / expertises.length;
                return (
                  <ExpertiseCard
                    key={e.title}
                    item={e}
                    index={i}
                    progress={scrollYProgress}
                    start={start}
                    end={end}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ExpertiseRow({
  number,
  title,
  progress,
  start,
  end,
}: {
  number: string;
  title: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const reduce = useReducedMotion();
  const kf = buildKeyframes(start, end, 0.2);
  const opacity = useTransform(progress, [...kf], [0.3, 1, 1, 0.3]);
  const x = useTransform(progress, [...kf], reduce ? [0, 0, 0, 0] : [-4, 0, 0, -4]);
  const dotScale = useTransform(progress, [...kf], [0.7, 1.3, 1.3, 0.7]);

  return (
    <motion.li style={{ opacity, x }} className="relative flex items-baseline gap-4 py-1">
      <motion.span
        style={{ scale: dotScale }}
        className="absolute -left-[28px] top-[10px] w-2 h-2 rounded-full bg-[hsl(var(--accent))] origin-center"
      />
      <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-foreground/45 w-8">
        {number}
      </span>
      <span className="text-base lg:text-[1.05rem] font-light text-foreground tracking-tight">
        {title}
      </span>
    </motion.li>
  );
}

function ExpertiseCard({
  item,
  index,
  progress,
  start,
  end,
}: {
  item: (typeof expertises)[number];
  index: number;
  progress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const reduce = useReducedMotion();
  const kf = buildKeyframes(start, end, 0.22);
  const opacity = useTransform(progress, [...kf], [0, 1, 1, 0]);
  const y = useTransform(progress, [...kf], reduce ? [0, 0, 0, 0] : [50, 0, 0, -50]);
  const scale = useTransform(progress, [...kf], reduce ? [1, 1, 1, 1] : [0.96, 1, 1, 0.97]);
  // Subtle inner image parallax on the active card
  const imgScale = useTransform(progress, [...kf], reduce ? [1, 1, 1, 1] : [1.08, 1.0, 1.0, 1.08]);

  return (
    <motion.article
      style={{ opacity, y, scale, zIndex: index }}
      className="absolute inset-0 glass-card rounded-[2rem] overflow-hidden flex flex-col"
    >
      {/* Image — top 60% */}
      <div className="relative h-[58%] overflow-hidden">
        <motion.div
          style={{ backgroundImage: `url(${item.image})`, scale: imgScale }}
          className="absolute inset-0 bg-cover bg-center will-change-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
        <span
          aria-hidden
          className="absolute top-5 right-6 text-[10px] font-medium tracking-[0.3em] uppercase text-white/85 px-3 py-1 rounded-full bg-black/30 backdrop-blur-md"
        >
          {String(index + 1).padStart(2, "0")} / {String(expertises.length).padStart(2, "0")}
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 lg:p-10 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/50 font-medium mb-3">
            {item.tag}
          </p>
          <h3 className="font-heading text-2xl lg:text-[2rem] font-light text-foreground tracking-tight leading-[1.15] mb-3">
            {item.title}
          </h3>
          <p className="text-foreground/60 text-[15px] leading-relaxed font-light mb-2 max-w-lg">
            {item.description}
          </p>
          <p className="text-foreground/85 text-[15px] font-normal max-w-lg">{item.benefit}</p>
        </div>

        <div className="mt-6 flex justify-end">
          <Link
            to={item.href}
            data-magnetic
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background text-sm font-medium tracking-wide reflection-sweep hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5"
          >
            Découvrir l'expertise
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}