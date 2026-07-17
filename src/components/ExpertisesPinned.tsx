import { useRef } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePinnedSectionProgress } from "@/hooks/usePinnedSectionProgress";
import SplitText from "./motion/SplitText";
const expertises = [
  {
    tag: "Épargne & placements",
    title: "Gestion patrimoniale",
    description:
      "Allocation d'actifs, assurance-vie, PER, compte-titres, SCPI, une stratégie d'épargne construite pour durer.",
    benefit: "Faire travailler votre capital en cohérence avec vos projets de vie.",
    href: "/gestion-patrimoniale",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1170&auto=format&fit=crop",
  },
  {
    tag: "Fiscalité",
    title: "Fiscalité du patrimoine",
    description:
      "Audit fiscal, IFI, revenus fonciers, structuration, réduire votre pression fiscale sans prendre de risques inutiles.",
    benefit: "Identifier vos marges de manœuvre fiscales réelles.",
    href: "/fiscalite",
    image: "https://images.unsplash.com/photo-1554224155-a1487473ffd9?q=80&w=1170&auto=format&fit=crop",
  },
  {
    tag: "Dirigeants",
    title: "Patrimoine professionnel",
    description:
      "Rémunération du dirigeant, trésorerie d'entreprise, holding, prévoyance, cession et transmission d'activité.",
    benefit: "Articuler patrimoine privé et professionnel avec méthode.",
    href: "/patrimoine-professionnel",
    image: "https://images.unsplash.com/photo-1506787497326-c2736dde1bef?w=600&auto=format&fit=crop&q=60",
  },
  {
    tag: "Financement",
    title: "Financement & crédit",
    description:
      "Courtage patrimonial, négociation des meilleures conditions, montages patrimoniaux adaptés à chaque projet.",
    benefit: "Obtenir les conditions de crédit les plus compétitives.",
    href: "/financement",
    image: "https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?w=600&auto=format&fit=crop&q=60",
  },
  {
    tag: "Succession",
    title: "Transmission & prévoyance",
    description:
      "Donation, démembrement, assurance-vie, pacte Dutreil, anticiper pour protéger ceux qui comptent.",
    benefit: "Préparer la transmission en maîtrisant la fiscalité.",
    href: "/transmission-patrimoine-famille",
    image: "https://images.unsplash.com/photo-1463760959829-d829ea46e191?w=600&auto=format&fit=crop&q=60",
  },
  {
    tag: "Immobilier",
    title: "Immobilier patrimonial",
    description:
      "Résidence principale, locatif, SCI, nue-propriété, chaque investissement pensé dans une logique globale.",
    benefit: "Structurer vos actifs immobiliers intelligemment.",
    href: "/patrimoine-immobilier-strategie",
    image: "https://images.unsplash.com/photo-1598228723793-52759bba239c?w=600&auto=format&fit=crop&q=60",
  },
];

export default function ExpertisesPinned() {
  return (
    <>
      {/* Mobile fallback, stacked cards */}
      <section
        id="expertises-mobile"
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
              <article key={e.title} className="glass-card glass-card-plain rounded-[1.5rem] overflow-hidden">
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

      {/* Desktop, pinned scrollytelling */}
      <ExpertisesPinnedDesktop />
    </>
  );
}

function ExpertisesPinnedDesktop() {
  const ref = useRef<HTMLDivElement>(null);
  const { activeIndex } = usePinnedSectionProgress(ref, expertises.length);
  const activeItem = expertises[activeIndex];

  return (
    <section
      id="expertises"
      className="hidden md:block section-glass texture-paper relative"
    >
      <div ref={ref} className="relative" style={{ height: `${100 + expertises.length * 45}vh` }}>
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full grid grid-cols-12 gap-10 items-center">
            {/* Left, sticky text + index list */}
            <div className="col-span-5">
              <div className="electric-line mb-5" />
              <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-5 font-medium">
                Nos expertises
              </p>
              <h2 className="text-4xl lg:text-5xl xl:text-6xl font-heading font-light text-foreground mb-6 leading-[1.05] tracking-tight">
                <SplitText text="Ce que nous faisons," by="word" stagger={0.06} />
                <br />
                <SplitText
                  text="concrètement"
                  by="word"
                  delay={0.3}
                  itemClassName="italic text-foreground/70"
                />
              </h2>
              <p className="text-foreground/60 text-base lg:text-lg font-light max-w-md leading-relaxed mb-10">
                Chaque domaine est traité en lien avec les autres. C'est cette approche transversale qui fait la différence.
              </p>

              <ol className="space-y-2.5 border-l border-foreground/10 pl-6">
                {expertises.map((e, i) => {
                  return (
                    <ExpertiseRow
                      key={e.title}
                      number={String(i + 1).padStart(2, "0")}
                      title={e.title}
                      active={i === activeIndex}
                    />
                  );
                })}
              </ol>
            </div>

            {/* Right, active expertise card with image */}
            <div className="col-span-7 relative h-[560px]">
              <AnimatePresence mode="wait">
                <ExpertiseCard key={activeItem.title} item={activeItem} index={activeIndex} />
              </AnimatePresence>
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
  active,
}: {
  number: string;
  title: string;
  active: boolean;
}) {
  return (
    <motion.li
      animate={{ opacity: active ? 1 : 0.42, x: active ? 0 : -4 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex items-baseline gap-4 py-1"
    >
      <motion.span
        animate={{
          scale: active ? 1.25 : 0.78,
          opacity: active ? 1 : 0.45,
          boxShadow: active
            ? "0 0 0 6px hsl(0 0% 100% / 0.12), 0 0 18px 2px hsl(0 0% 100% / 0.35)"
            : "0 0 0 0 hsl(0 0% 100% / 0)",
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -left-[28px] top-[10px] w-2 h-2 rounded-full bg-foreground/70 origin-center"
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
}: {
  item: (typeof expertises)[number];
  index: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      initial={
        reduce
          ? { opacity: 0, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }
          : { opacity: 0, clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" }
      }
      animate={{ opacity: 1, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
      exit={
        reduce
          ? { opacity: 0 }
          : { opacity: 0, clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)" }
      }
      transition={{ duration: 0.7, ease: [0.77, 0, 0.18, 1] }}
      style={{ zIndex: index }}
      className="absolute inset-0 glass-card glass-card-plain rounded-[2rem] overflow-hidden flex flex-col"
    >
      {/* Image, top 60% */}
      <div className="relative h-[58%] overflow-hidden">
        <motion.div
          initial={reduce ? { scale: 1 } : { scale: 1.12 }}
          animate={{ scale: 1 }}
          exit={reduce ? { scale: 1 } : { scale: 1.04 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ backgroundImage: `url(${item.image})` }}
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
        {/* Tachymeter ghost number */}
        <motion.span
          key={`ghost-${item.title}`}
          aria-hidden
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute -bottom-6 -right-2 font-heading font-light leading-none select-none text-[8rem] lg:text-[10rem] text-foreground/[0.045] tracking-tighter"
        >
          {String(index + 1).padStart(2, "0")}
        </motion.span>
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

        <div className="mt-6 flex justify-end relative">
          <Link
            to={item.href}
            data-magnetic
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background text-sm font-medium tracking-wide reflection-sweep hover:shadow-[0_20px_50px_-10px_hsl(222_50%_11%/0.25)] transition-all duration-300 hover:-translate-y-0.5"
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