import { motion, useReducedMotion } from "framer-motion";

interface Pillar {
  title: string;
  text: string;
}

interface ExpertiseShowcaseProps {
  eyebrow?: string;
  title: string;
  intro: string;
  image: string;
  imageAlt: string;
  pillars: Pillar[];
}

export default function ExpertiseShowcase({
  eyebrow = "Notre approche",
  title,
  intro,
  image,
  imageAlt,
  pillars,
}: ExpertiseShowcaseProps) {
  const reduce = useReducedMotion();

  return (
    <section className="section-padding bg-background relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-8 md:gap-10 lg:gap-16 items-start">
          {/* Image column */}
          <div className="lg:col-span-5 reveal lg:sticky lg:top-32 lg:self-start mb-2 lg:mb-0">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] shadow-2xl">
              <img
                src={image}
                alt={imageAlt}
                loading="lazy"
                width={1280}
                height={896}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] hover:scale-105"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-navy-deep/30 via-transparent to-transparent"
              />
              {/* Caption badge */}
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                <div className="glass-dark rounded-full px-4 py-1.5 text-[10px] tracking-[0.25em] uppercase text-white/85">
                  {eyebrow}
                </div>
                <div className="w-10 h-10 rounded-full glass-dark flex items-center justify-center">
                  <span className="text-white/70 text-sm">↗</span>
                </div>
              </div>
            </div>
            {/* Soft accent */}
            <div
              aria-hidden
              className="pointer-events-none absolute -z-10 -top-10 -left-10 w-72 h-72 rounded-full bg-[hsl(var(--gold)/0.07)] blur-3xl"
            />
          </div>

          {/* Pillars column */}
          <div className="lg:col-span-7 reveal reveal-delay-1">
            <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/45 mb-5 font-medium">
              {eyebrow}
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[44px] font-heading font-light text-foreground leading-[1.12] tracking-tight mb-7">
              {title}
            </h2>
            <p className="text-foreground/65 leading-relaxed font-light text-[16px] mb-12 max-w-2xl">
              {intro}
            </p>

            <div className="space-y-px bg-border/40">
              {pillars.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={reduce ? false : { opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.09 }}
                  viewport={{ once: true, margin: "-60px" }}
                  className="bg-background group py-7 px-1 grid grid-cols-12 gap-5 hover:bg-foreground/[0.02] transition-colors"
                >
                  <div className="col-span-2 md:col-span-1">
                    <span className="font-heading text-sm font-light text-[hsl(var(--gold))] tracking-widest">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="col-span-10 md:col-span-11">
                    <h3 className="font-heading text-lg md:text-xl font-normal text-foreground mb-2 tracking-tight">
                      {p.title}
                    </h3>
                    <p className="text-foreground/65 text-[14.5px] leading-relaxed font-light">
                      {p.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
