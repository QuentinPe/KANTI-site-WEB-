import { Link, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";

export default function MaintenancePage() {
  const { pathname } = useLocation();

  return (
    <>
      <Seo
        title="Page en maintenance, KANTI"
        description="Cette page est temporairement indisponible. Retrouvez l'ensemble des expertises et services du cabinet KANTI."
        noindex
      />
      <Header />
      <main id="main">
        <section className="section-padding section-glass min-h-[85vh] flex items-center">
          <div className="max-w-5xl mx-auto w-full">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-end border-t border-foreground/12 pt-12 md:pt-16">

              <div className="lg:col-span-5">
                <div className="flex items-center gap-4 mb-8">
                  <span className="font-heading font-extralight text-7xl md:text-8xl tabular-nums leading-none text-foreground/12">
                    503
                  </span>
                  <span className="text-[10px] tracking-[0.32em] uppercase font-medium text-foreground/55">
                    Maintenance
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-heading font-light tracking-tight leading-[1.05] text-foreground">
                  Cette page est{" "}
                  <span className="italic text-foreground/60">momentanément indisponible</span>.
                </h1>
              </div>

              <div className="lg:col-span-7 lg:pl-10 lg:border-l border-foreground/12">
                <p className="text-base md:text-lg leading-relaxed mb-10 font-light max-w-xl text-foreground/70">
                  La page{" "}
                  <code className="text-xs px-2 py-0.5 bg-foreground/5 rounded">
                    {pathname}
                  </code>{" "}
                  est en cours de mise à jour. Elle sera de nouveau accessible très prochainement.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-12">
                  <Link
                    to="/"
                    className="group inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full text-sm font-medium tracking-wide btn-primary-glass reflection-sweep"
                  >
                    Retour à l'accueil
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.25}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-2 py-3.5 text-sm font-light text-foreground/70 hover:text-foreground transition-colors"
                  >
                    <span className="link-underline-light">Nous contacter</span>
                    <span aria-hidden>→</span>
                  </Link>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { label: "Notre méthode", href: "/notre-methode" },
                    { label: "Le cabinet",    href: "/cabinet" },
                    { label: "Gestion patrimoniale", href: "/gestion-patrimoniale" },
                    { label: "Contact",       href: "/contact" },
                  ].map((l) => (
                    <Link
                      key={l.href}
                      to={l.href}
                      className="group flex items-center justify-between px-5 py-3.5 rounded-xl border border-foreground/10 hover:border-foreground/25 transition-colors"
                    >
                      <span className="text-sm text-foreground/75 font-light group-hover:text-foreground transition-colors">
                        {l.label}
                      </span>
                      <span aria-hidden className="text-foreground/30 group-hover:text-foreground transition-all group-hover:translate-x-0.5">→</span>
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
