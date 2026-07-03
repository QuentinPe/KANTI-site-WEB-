import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const primaryLinks = [
  { label: "Le Cabinet", href: "/cabinet" },
  { label: "Notre méthode", href: "/notre-methode" },
  { label: "Cas clients", href: "/cas-clients" },
  { label: "Actualités", href: "/actualites" },
  { label: "Ressources", href: "/ressources" },
  { label: "Contact", href: "/contact" },
];

const expertises = [
  { label: "Gestion patrimoniale", href: "/gestion-patrimoniale" },
  { label: "Fiscalité du patrimoine", href: "/fiscalite" },
  { label: "Patrimoine professionnel", href: "/patrimoine-professionnel" },
  { label: "Financement & crédit", href: "/financement" },
];

export default function MobileHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [expExpanded, setExpExpanded] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setExpExpanded(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const dark = isHome && !scrolled && !open;
  const textColor = dark ? "text-white" : "text-foreground";
  const bubble = dark
    ? "bg-[hsl(224_60%_7%/0.45)] backdrop-blur-xl ring-1 ring-white/10"
    : "bg-white/80 backdrop-blur-xl ring-1 ring-foreground/10 shadow-[0_4px_18px_-10px_hsl(var(--foreground)/0.18)]";

  return (
    <>
      <header
        className="md:hidden fixed top-0 inset-x-0 z-[60] px-4"
        style={{ paddingTop: "max(env(safe-area-inset-top), 12px)" }}
      >
        <div className="flex items-center justify-between">
          <Link
            to="/"
            aria-label="KANTI — Accueil"
            className={`inline-flex items-center rounded-full px-5 h-11 transition-colors duration-300 ${bubble} ${textColor}`}
          >
            <span className="font-heading text-[17px] font-semibold tracking-[0.18em]">
              KANTI
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-sheet"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            className={`inline-flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-300 ${bubble} ${textColor}`}
          >
            <span className="relative w-5 h-5">
              <span
                className={`absolute left-0 top-1/2 w-5 h-[1.5px] bg-current transition-transform duration-300 ${
                  open ? "rotate-45" : "-translate-y-[5px]"
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 w-5 h-[1.5px] bg-current transition-transform duration-300 ${
                  open ? "-rotate-45" : "translate-y-[5px]"
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-sheet"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden fixed inset-0 z-50 flex flex-col"
            style={{
              background:
                "linear-gradient(180deg, hsl(224 60% 8%) 0%, hsl(222 50% 12%) 100%)",
            }}
          >
            <div
              className="flex-1 overflow-y-auto px-6 pb-8"
              style={{
                paddingTop: "calc(max(env(safe-area-inset-top), 12px) + 80px)",
              }}
            >
              <p className="text-[10px] tracking-[0.32em] uppercase text-white/40 mb-6 font-medium">
                Navigation
              </p>
              <nav>
                <ul className="divide-y divide-white/10">
                  {primaryLinks.map((link, i) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.05 + i * 0.04,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Link
                        to={link.href}
                        className="flex items-center justify-between py-4 text-[22px] font-heading font-light text-white/95 tracking-tight"
                      >
                        {link.label}
                        <span className="text-white/30 text-base">→</span>
                      </Link>
                    </motion.li>
                  ))}
                  <motion.li
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.05 + primaryLinks.length * 0.04,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setExpExpanded((v) => !v)}
                      className="w-full flex items-center justify-between py-4 text-[22px] font-heading font-light text-white/95 tracking-tight"
                      aria-expanded={expExpanded}
                    >
                      Expertises
                      <span
                        className={`text-white/40 text-sm transition-transform duration-300 ${
                          expExpanded ? "rotate-180" : ""
                        }`}
                      >
                        ▾
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {expExpanded && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden pl-1 pb-3"
                        >
                          {expertises.map((c) => (
                            <li key={c.href}>
                              <Link
                                to={c.href}
                                className="flex items-center gap-3 py-3 text-[15px] text-white/70 hover:text-white"
                              >
                                <span className="w-1 h-1 rounded-full bg-[hsl(var(--electric-soft))]" />
                                {c.label}
                              </Link>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </motion.li>
                </ul>
              </nav>

              <div className="mt-10 pt-8 border-t border-white/10">
                <p className="text-[10px] tracking-[0.32em] uppercase text-white/40 mb-3 font-medium">
                  Cabinet
                </p>
                <p className="text-white/65 text-[14px] font-light leading-relaxed">
                  9 Rue de la Négresse · 64200 Biarritz
                </p>
                <a
                  href="tel:+33663324809"
                  className="block mt-2 text-white/85 text-[14px] font-light"
                >
                  06 63 32 48 09
                </a>
                <a
                  href="mailto:kanti@adnfamily.com"
                  className="block mt-1 text-white/85 text-[14px] font-light"
                >
                  kanti@adnfamily.com
                </a>
              </div>
            </div>

            <div
              className="px-6 pt-3 border-t border-white/10 bg-[hsl(224_60%_7%)]"
              style={{
                paddingBottom: "max(env(safe-area-inset-bottom), 16px)",
              }}
            >
              <Link
                to="/contact"
                className="flex items-center justify-center gap-2 h-14 rounded-full bg-white text-[hsl(var(--navy-deep))] text-[15px] font-medium tracking-wide"
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}