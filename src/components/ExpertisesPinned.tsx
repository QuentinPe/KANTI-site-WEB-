import { useRef } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { usePinnedSectionProgress } from "@/hooks/usePinnedSectionProgress";
import SplitText from "./motion/SplitText";

const NAVY = "hsl(224 55% 12%)";
const NAVY_MID = "hsl(224 28% 42%)";
const NAVY_LIGHT = "hsl(224 18% 55%)";
const CARD_BORDER = "1px solid hsl(224 20% 12% / 0.08)";

const expertises = [
  {
    tag: "Gestion patrimoniale",
    shortTitle: "Gestion patrimoniale",
    title: "Piloter et faire croître votre patrimoine",
    description:
      "Une stratégie d'allocation sur mesure pour faire fructifier vos actifs tout en maîtrisant les risques, dans la durée.",
    bullets: [
      "Stratégie d'allocation personnalisée",
      "Gestion active et rigoureuse",
      "Suivi continu et reporting dédié",
    ],
    kpi: { value: "10,2 %", label: "Performance moyenne nette annualisée depuis 5 ans*" },
    href: "/gestion-patrimoniale",
    image:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=1400&auto=format&fit=crop",
    treatment: "blue" as const,
  },
  {
    tag: "Fiscalité du patrimoine",
    shortTitle: "Fiscalité du patrimoine",
    title: "Optimiser et sécuriser vos choix fiscaux",
    description:
      "Audit fiscal, IFI, revenus fonciers, structuration — réduire votre pression fiscale sans prendre de risques inutiles.",
    bullets: [
      "Audit fiscal personnalisé",
      "Optimisation IFI et revenus fonciers",
      "Structuration sur-mesure",
    ],
    kpi: { value: "−28 %", label: "De pression fiscale réduite en moyenne" },
    href: "/fiscalite",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1400&auto=format&fit=crop",
    treatment: "bw" as const,
  },
  {
    tag: "Patrimoine professionnel",
    shortTitle: "Patrimoine professionnel",
    title: "Structurer et développer votre entreprise",
    description:
      "Rémunération du dirigeant, trésorerie d'entreprise, holding, prévoyance — articuler patrimoine privé et professionnel.",
    bullets: [
      "Holding et optimisation de la rémunération",
      "Trésorerie d'entreprise valorisée",
      "Prévoyance dirigeant et cession",
    ],
    kpi: { value: "38 %", label: "De nos clients sont des dirigeants d'entreprise" },
    href: "/patrimoine-professionnel",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1400&auto=format&fit=crop",
    treatment: "blue" as const,
  },
  {
    tag: "Financement & crédit",
    shortTitle: "Financement & crédit",
    title: "Financer vos projets avec agilité",
    description:
      "Courtage patrimonial, négociation des meilleures conditions, montages patrimoniaux adaptés à chaque projet.",
    bullets: [
      "Accès aux meilleures conditions du marché",
      "Montages patrimoniaux sur-mesure",
      "Accompagnement complet de A à Z",
    ],
    kpi: { value: "−0,42 %", label: "Par rapport au taux marché en moyenne" },
    href: "/financement",
    image:
      "https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=1400&auto=format&fit=crop",
    treatment: "bw" as const,
  },
  {
    tag: "Transmission & prévoyance",
    shortTitle: "Transmission & prévoyance",
    title: "Préparer et transmettre en toute sérénité",
    description:
      "Donation, démembrement, assurance-vie, pacte Dutreil — anticiper pour protéger ceux qui comptent.",
    bullets: [
      "Donation et démembrement",
      "Assurance-vie et pacte Dutreil",
      "Anticipation successorale",
    ],
    kpi: { value: "−180 k€", label: "De droits de succession évités en moyenne" },
    href: "/transmission-patrimoine-famille",
    image:
      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1400&auto=format&fit=crop",
    treatment: "blue" as const,
  },
  {
    tag: "Immobilier patrimonial",
    shortTitle: "Immobilier patrimonial",
    title: "Structurer vos actifs immobiliers intelligemment",
    description:
      "Résidence principale, locatif, SCI, nue-propriété — chaque investissement pensé dans une logique globale.",
    bullets: [
      "SCI et nue-propriété",
      "Locatif et résidence principale optimisés",
      "Vision patrimoniale intégrée",
    ],
    kpi: { value: "+6,8 %", label: "De rendement locatif moyen accompagné" },
    href: "/patrimoine-immobilier-strategie",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1400&auto=format&fit=crop",
    treatment: "bw" as const,
  },
];

/* ─── Default export ─────────────────────────────────────────────────────── */
export default function ExpertisesPinned() {
  return (
    <>
      {/* ── Mobile fallback ──────────────────────────────────────────────── */}
      <section
        id="expertises-mobile"
        className="md:hidden section-glass texture-paper section-padding"
      >
        <div className="max-w-2xl mx-auto">
          <p className="text-[10px] tracking-[0.28em] uppercase font-semibold mb-5" style={{ color: NAVY_MID }}>
            Nos expertises
          </p>
          <h2
            className="font-heading font-light leading-[1.05] tracking-tight mb-4"
            style={{ fontSize: "clamp(2rem,7vw,3rem)", color: NAVY }}
          >
            Nos expertises,
            <br />
            <em className="not-italic" style={{ color: NAVY_MID }}>en mouvement</em>
          </h2>
          <p className="text-[15px] font-light leading-relaxed mb-10" style={{ color: NAVY_LIGHT }}>
            Le patrimoine évolue. Nos expertises travaillent ensemble pour le faire grandir, le protéger et le transmettre.
          </p>
          <div className="space-y-5">
            {expertises.map((e, i) => (
              <article
                key={e.shortTitle}
                className="glass-card glass-card-plain rounded-[1.5rem] overflow-hidden"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${e.image})`,
                      filter:
                        e.treatment === "bw"
                          ? "grayscale(1) brightness(0.88) contrast(1.12)"
                          : "grayscale(1)",
                    }}
                  />
                  {e.treatment === "blue" && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: "hsl(218 65% 28% / 0.45)", mixBlendMode: "multiply" }}
                    />
                  )}
                  <span
                    className="absolute top-4 left-4 text-[9px] font-medium tracking-[0.28em] uppercase text-white/85 px-2.5 py-1 rounded-full"
                    style={{ background: "hsl(0 0% 0% / 0.28)", backdropFilter: "blur(8px)" }}
                  >
                    {String(i + 1).padStart(2, "0")} / {String(expertises.length).padStart(2, "0")}
                  </span>
                </div>
                <div className="p-6">
                  <p className="text-[9px] tracking-[0.28em] uppercase font-semibold mb-2" style={{ color: NAVY_MID }}>
                    {e.tag}
                  </p>
                  <h3
                    className="font-heading text-[1.35rem] font-light tracking-tight mb-2.5 leading-[1.15]"
                    style={{ color: NAVY }}
                  >
                    {e.title}
                  </h3>
                  <p className="text-[14px] leading-relaxed font-light mb-4" style={{ color: NAVY_LIGHT }}>
                    {e.description}
                  </p>
                  <ul className="space-y-1.5 mb-5">
                    {e.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-2 text-[13px] font-light"
                        style={{ color: NAVY_MID }}
                      >
                        <CheckCircle2
                          className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                          strokeWidth={1.5}
                          style={{ color: "hsl(214 55% 42%)" }}
                        />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-baseline gap-2 mb-4 pb-4" style={{ borderBottom: CARD_BORDER }}>
                    <span className="font-heading text-xl font-light tabular-nums" style={{ color: NAVY }}>
                      {e.kpi.value}
                    </span>
                    <span className="text-[11px] font-light" style={{ color: NAVY_LIGHT }}>
                      {e.kpi.label}
                    </span>
                  </div>
                  <Link
                    to={e.href}
                    className="inline-flex items-center gap-1.5 text-[13px] font-medium group"
                    style={{ color: NAVY }}
                  >
                    Découvrir l'expertise
                    <svg
                      className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Desktop, pinned scrollytelling ──────────────────────────────── */}
      <ExpertisesPinnedDesktop />
    </>
  );
}

/* ─── Desktop pinned component ───────────────────────────────────────────── */
function ExpertisesPinnedDesktop() {
  const ref = useRef<HTMLDivElement>(null);
  const { activeIndex } = usePinnedSectionProgress(ref, expertises.length);
  const activeItem = expertises[activeIndex];
  const others = expertises
    .map((e, i) => ({ e, i }))
    .filter(({ i }) => i !== activeIndex)
    .slice(0, 5);

  return (
    <section
      id="expertises"
      className="hidden md:block section-glass texture-paper relative"
    >
      <div ref={ref} className="relative" style={{ height: `${100 + expertises.length * 45}vh` }}>
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full grid grid-cols-12 gap-10 items-center">

            {/* ── Left column: editorial + timeline ──────────────────── */}
            <div className="col-span-4">
              <p className="text-[9px] tracking-[0.32em] uppercase font-semibold mb-6" style={{ color: NAVY_MID }}>
                Nos expertises
              </p>

              <h2 className="font-heading font-light leading-[1.05] tracking-tight mb-5" style={{ color: NAVY }}>
                <SplitText
                  text="Nos expertises,"
                  by="word"
                  stagger={0.06}
                  className="text-4xl lg:text-5xl xl:text-[3.25rem]"
                />
                <br />
                <SplitText
                  text="en mouvement"
                  by="word"
                  delay={0.25}
                  className="text-4xl lg:text-5xl xl:text-[3.25rem] italic"
                  itemClassName="text-foreground/55"
                />
              </h2>

              <p
                className="text-[14px] lg:text-[15px] font-light leading-relaxed mb-8 max-w-[340px]"
                style={{ color: NAVY_LIGHT }}
              >
                Le patrimoine évolue. Nos expertises travaillent ensemble pour le faire grandir, le protéger et le transmettre.
              </p>

              {/* Timeline */}
              <ol className="relative space-y-0">
                {/* Vertical rail */}
                <div
                  aria-hidden
                  className="absolute left-[11px] top-3 bottom-3 w-px"
                  style={{ background: "hsl(224 20% 12% / 0.12)" }}
                />
                {/* Progress fill */}
                <motion.div
                  aria-hidden
                  className="absolute left-[11px] top-3 w-px origin-top"
                  style={{ background: NAVY, top: 3 }}
                  animate={{ height: `${((activeIndex + 0.5) / expertises.length) * 100}%` }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                />

                {expertises.map((e, i) => (
                  <TimelineRow
                    key={e.shortTitle}
                    number={String(i + 1).padStart(2, "0")}
                    title={e.shortTitle}
                    active={i === activeIndex}
                    done={i < activeIndex}
                  />
                ))}
              </ol>

              {/* Scroll hint */}
              <div className="mt-8 flex items-center gap-2">
                <motion.div
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
                  style={{ border: "1.5px solid hsl(224 20% 12% / 0.20)" }}
                >
                  <div className="w-1 h-1.5 rounded-full" style={{ background: NAVY_MID }} />
                </motion.div>
                <p className="text-[10px] tracking-[0.22em] uppercase font-medium" style={{ color: NAVY_LIGHT }}>
                  Scroll pour explorer
                </p>
              </div>
            </div>

            {/* ── Right column: featured card + mini-cards ───────────── */}
            <div
              className="col-span-8 flex flex-col"
              style={{ height: "clamp(500px, 72vh, 680px)", gap: "10px" }}
            >
              {/* Featured card */}
              <div className="relative flex-1 min-h-0">
                <AnimatePresence mode="wait">
                  <FeaturedCard
                    key={activeItem.shortTitle}
                    item={activeItem}
                    index={activeIndex}
                  />
                </AnimatePresence>
              </div>

              {/* Mini-cards row */}
              {others.length > 0 && (
                <div
                  className="grid flex-shrink-0"
                  style={{
                    gridTemplateColumns: `repeat(${others.length}, 1fr)`,
                    gap: "8px",
                    height: "72px",
                  }}
                >
                  {others.map(({ e, i }) => (
                    <MiniCard key={e.shortTitle} item={e} index={i} total={expertises.length} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Timeline row ──────────────────────────────────────────────────────── */
function TimelineRow({
  number,
  title,
  active,
  done,
}: {
  number: string;
  title: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <motion.li
      animate={{ opacity: active ? 1 : done ? 0.60 : 0.38 }}
      transition={{ duration: 0.30, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex items-center gap-4 py-2.5 pl-7"
    >
      {/* Circle dot on the rail */}
      <motion.span
        animate={{
          scale: active ? 1 : 0.72,
          background: active ? NAVY : done ? "hsl(224 28% 42%)" : "hsl(224 20% 86%)",
          boxShadow: active
            ? `0 0 0 4px hsl(224 55% 12% / 0.12), 0 0 14px 2px hsl(224 55% 12% / 0.18)`
            : "none",
        }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-0 w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0"
        style={{ top: "50%", transform: "translateY(-50%)", zIndex: 1 }}
      >
        <motion.span
          animate={{ opacity: active ? 1 : 0 }}
          transition={{ duration: 0.22 }}
          className="text-[8px] font-semibold tracking-tight"
          style={{ color: "white" }}
        >
          {number}
        </motion.span>
        <motion.span
          animate={{ opacity: active ? 0 : 1 }}
          transition={{ duration: 0.22 }}
          className="absolute text-[7px] font-medium"
          style={{ color: done ? "white" : NAVY_LIGHT }}
        >
          {number}
        </motion.span>
      </motion.span>

      <span
        className="text-[13px] lg:text-[13.5px] font-light tracking-tight leading-snug"
        style={{ color: NAVY }}
      >
        {title}
      </span>
    </motion.li>
  );
}

/* ─── Featured horizontal card ───────────────────────────────────────────── */
function FeaturedCard({
  item,
  index,
}: {
  item: (typeof expertises)[number];
  index: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 glass-card glass-card-plain rounded-[1.75rem] overflow-hidden flex"
    >
      {/* Image — left 42% */}
      <div className="relative flex-shrink-0 overflow-hidden" style={{ width: "42%" }}>
        <motion.div
          initial={reduce ? { scale: 1 } : { scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            backgroundImage: `url(${item.image})`,
            filter:
              item.treatment === "bw"
                ? "grayscale(1) brightness(0.88) contrast(1.12)"
                : "grayscale(1)",
          }}
          className="absolute inset-0 bg-cover bg-center will-change-transform"
        />
        {item.treatment === "blue" && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "hsl(218 65% 28% / 0.42)", mixBlendMode: "multiply" }}
          />
        )}
        {/* Gradient to blend with content */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 55%, hsl(0 0% 100% / 0.06) 100%)",
          }}
        />
        {/* Counter badge */}
        <span
          aria-hidden
          className="absolute top-5 left-5 text-[9px] font-medium tracking-[0.28em] uppercase text-white/88 px-3 py-1.5 rounded-full"
          style={{ background: "hsl(0 0% 0% / 0.28)", backdropFilter: "blur(10px)" }}
        >
          {String(index + 1).padStart(2, "0")} / {String(expertises.length).padStart(2, "0")}
        </span>
      </div>

      {/* Content — right */}
      <div className="flex-1 flex flex-col justify-between p-8 lg:p-10 min-w-0">
        <div>
          <p
            className="text-[8.5px] tracking-[0.32em] uppercase font-semibold mb-4"
            style={{ color: NAVY_MID }}
          >
            {item.tag}
          </p>
          <h3
            className="font-heading font-light tracking-tight leading-[1.12] mb-3"
            style={{ color: NAVY, fontSize: "clamp(1.35rem, 2vw, 1.75rem)" }}
          >
            {item.title}
          </h3>
          <p
            className="text-[13.5px] leading-relaxed font-light mb-5 max-w-sm"
            style={{ color: NAVY_LIGHT }}
          >
            {item.description}
          </p>

          {/* Bullets */}
          <ul className="space-y-2 mb-6">
            {item.bullets.map((b) => (
              <li
                key={b}
                className="flex items-center gap-2.5 text-[12.5px] font-light"
                style={{ color: NAVY_MID }}
              >
                <CheckCircle2
                  className="w-3.5 h-3.5 flex-shrink-0"
                  strokeWidth={1.5}
                  style={{ color: "hsl(214 55% 42%)" }}
                />
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* KPI + link */}
        <div>
          <div
            className="flex items-baseline gap-2.5 mb-5 pb-5"
            style={{ borderBottom: CARD_BORDER }}
          >
            <span
              className="font-heading font-light tabular-nums"
              style={{ color: NAVY, fontSize: "clamp(1.4rem, 2.5vw, 1.75rem)" }}
            >
              {item.kpi.value}
            </span>
            <span className="text-[11px] font-light leading-snug max-w-[240px]" style={{ color: NAVY_LIGHT }}>
              {item.kpi.label}
            </span>
          </div>

          <Link
            to={item.href}
            className="inline-flex items-center gap-2 text-[13px] font-medium group transition-all duration-200"
            style={{ color: NAVY }}
          >
            Découvrir l'expertise
            <svg
              className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

/* ─── Mini thumbnail card ────────────────────────────────────────────────── */
function MiniCard({
  item,
  index,
  total,
}: {
  item: (typeof expertises)[number];
  index: number;
  total: number;
}) {
  return (
    <Link
      to={item.href}
      className="group glass-card glass-card-plain rounded-xl overflow-hidden flex items-center gap-0 transition-all duration-200 hover:-translate-y-0.5"
      style={{ boxShadow: "0 2px 8px -3px hsl(224 40% 18% / 0.10)" }}
    >
      {/* Small image */}
      <div className="relative w-14 h-full flex-shrink-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
          style={{
            backgroundImage: `url(${item.image})`,
            filter:
              item.treatment === "bw"
                ? "grayscale(1) brightness(0.88) contrast(1.12)"
                : "grayscale(1)",
          }}
        />
        {item.treatment === "blue" && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "hsl(218 65% 28% / 0.38)", mixBlendMode: "multiply" }}
          />
        )}
      </div>

      {/* Text */}
      <div className="flex-1 px-3 py-2 min-w-0">
        <p className="text-[8px] tracking-[0.22em] uppercase font-medium mb-0.5" style={{ color: NAVY_LIGHT }}>
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
        <p
          className="text-[11px] font-light leading-snug truncate"
          style={{ color: NAVY }}
        >
          {item.shortTitle}
        </p>
      </div>

      {/* Arrow */}
      <div className="pr-3 flex-shrink-0">
        <svg
          className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          style={{ color: NAVY_LIGHT }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </div>
    </Link>
  );
}
