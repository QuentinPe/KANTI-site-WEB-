import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

interface LegalSection {
  id: string;
  title: string;
  content: ReactNode;
}

interface LegalLayoutProps {
  eyebrow: string;
  title: string;
  highlight?: string;
  subtitle: string;
  breadcrumb: string;
  updatedAt: string;
  sections: LegalSection[];
  relatedLinks?: { label: string; to: string }[];
}

export default function LegalLayout({
  eyebrow,
  title,
  highlight,
  subtitle,
  breadcrumb,
  updatedAt,
  sections,
  relatedLinks,
}: LegalLayoutProps) {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <PageHero
        eyebrow={eyebrow}
        title={title}
        highlight={highlight}
        subtitle={subtitle}
        breadcrumb={breadcrumb}
      />

      <section className="relative py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Sticky TOC */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="lg:sticky lg:top-32">
              <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/45 mb-5 font-medium">
                Sommaire
              </p>
              <nav className="border-l border-foreground/10 pl-5 space-y-3">
                {sections.map((s, i) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="group block text-sm font-light text-foreground/65 hover:text-foreground transition-colors"
                  >
                    <span className="text-[11px] tracking-[0.18em] text-foreground/35 mr-3">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s.title}
                  </a>
                ))}
              </nav>

              <div className="mt-10 pt-8 border-t border-foreground/10">
                <p className="text-[10px] tracking-[0.28em] uppercase text-foreground/40 mb-2">
                  Mise à jour
                </p>
                <p className="text-sm text-foreground/70 font-light">{updatedAt}</p>
              </div>

              {relatedLinks && relatedLinks.length > 0 && (
                <div className="mt-8 pt-8 border-t border-foreground/10">
                  <p className="text-[10px] tracking-[0.28em] uppercase text-foreground/40 mb-3">
                    À consulter aussi
                  </p>
                  <ul className="space-y-2">
                    {relatedLinks.map((l) => (
                      <li key={l.to}>
                        <Link
                          to={l.to}
                          className="text-sm text-foreground/70 hover:text-foreground font-light link-underline"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>

          {/* Body */}
          <article className="lg:col-span-8 xl:col-span-9 space-y-16">
            {sections.map((s, i) => (
              <motion.section
                key={s.id}
                id={s.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="scroll-mt-32"
              >
                <div className="flex items-baseline gap-5 mb-6">
                  <span className="font-heading text-sm font-light text-foreground/35 tracking-widest">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-heading text-2xl md:text-3xl font-light text-foreground tracking-tight">
                    {s.title}
                  </h2>
                </div>
                <div className="pl-0 md:pl-12 text-[15px] leading-[1.8] text-foreground/75 font-light space-y-4 [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_strong]:font-medium [&_strong]:text-foreground [&_ul]:list-none [&_ul]:space-y-2 [&_li]:relative [&_li]:pl-5 [&_li:before]:content-[''] [&_li:before]:absolute [&_li:before]:left-0 [&_li:before]:top-[0.7em] [&_li:before]:w-2 [&_li:before]:h-px [&_li:before]:bg-foreground/40">
                  {s.content}
                </div>
              </motion.section>
            ))}
          </article>
        </div>
      </section>

      <Footer />
    </main>
  );
}