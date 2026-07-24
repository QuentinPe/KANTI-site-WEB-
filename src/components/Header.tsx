import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { UserRound, KeyRound, ChevronDown, ArrowRight, X } from "lucide-react";
import logoDark from "@/assets/logo-kanti-dark.png.asset.json";
import logoWhite from "@/assets/logo-kanti-white.png.asset.json";

const NAV = [
  { label: "Le Cabinet",    href: "/cabinet" },
  { label: "Notre méthode", href: "/notre-methode" },
  { label: "Cas clients",   href: "/cas-clients" },
  { label: "Actualités",    href: "/actualites" },
  {
    label: "Expertises",
    href: "#",
    children: [
      { label: "Gestion patrimoniale",       href: "/gestion-patrimoniale" },
      { label: "Fiscalité du patrimoine",    href: "/fiscalite" },
      { label: "Patrimoine professionnel",   href: "/patrimoine-professionnel" },
      { label: "Financement & crédit",       href: "/courtage-patrimonial" },
      { label: "Transmission & prévoyance",  href: "/transmission-patrimoine-famille" },
      { label: "Immobilier patrimonial",     href: "/patrimoine-immobilier-strategie" },
    ],
  },
  { label: "Ressources", href: "/ressources" },
];

export default function Header() {
  const [scrolled,       setScrolled]       = useState(false);
  const [menuOpen,       setMenuOpen]       = useState(false);
  const [expertisesOpen, setExpertisesOpen] = useState(false);
  const [clientOpen,     setClientOpen]     = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setExpertisesOpen(false);
    setClientOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Home dark-hero = transparent mode; everything else = white bar
  const glass = isHome && !scrolled;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 h-[72px] flex items-center transition-all duration-500 ${
          glass ? "" : "bg-white border-b border-[hsl(224_20%_12%/0.07)] shadow-[0_1px_0_0_hsl(224_20%_12%/0.04)]"
        }`}
      >
        <div className="max-w-[1380px] mx-auto px-6 lg:px-10 w-full flex items-center gap-6">

          {/* ── Logo ── */}
          <Link to="/" className="flex-shrink-0" aria-label="KANTI – accueil">
            <img
              src={glass ? logoWhite.url : logoDark.url}
              alt="KANTI"
              className="h-[26px] w-auto"
              width={140}
              height={36}
            />
          </Link>

          {/* ── Desktop navigation ── */}
          <nav className="hidden xl:flex items-center flex-1 justify-center">
            {NAV.map((item) => {
              /* ── Dropdown: Expertises ── */
              if (item.children) {
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setExpertisesOpen(true)}
                    onMouseLeave={() => setExpertisesOpen(false)}
                  >
                    <button
                      aria-haspopup="menu"
                      aria-expanded={expertisesOpen}
                      className={`group relative flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium tracking-wide transition-colors duration-200 ${
                        glass
                          ? expertisesOpen ? "text-white" : "text-white/72 hover:text-white"
                          : expertisesOpen ? "text-[hsl(224_60%_12%)]" : "text-[hsl(224_40%_38%)] hover:text-[hsl(224_60%_12%)]"
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        className={`w-3 h-3 flex-shrink-0 transition-transform duration-300 ${expertisesOpen ? "rotate-180" : ""}`}
                        strokeWidth={2}
                      />
                      {/* Underline — slides from left on hover */}
                      <span
                        className={`absolute bottom-1 left-4 right-4 h-px transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] origin-left ${
                          glass ? "bg-white/80" : "bg-[hsl(224_60%_12%)]"
                        } scale-x-0 group-hover:scale-x-100`}
                      />
                    </button>

                    {/* Dropdown panel */}
                    <div
                      className={`absolute top-full left-1/2 -translate-x-1/2 pt-5 w-[340px] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        expertisesOpen
                          ? "opacity-100 translate-y-0 pointer-events-auto"
                          : "opacity-0 -translate-y-2 pointer-events-none"
                      }`}
                    >
                      <div className="bg-white rounded-2xl ring-1 ring-[hsl(224_20%_12%/0.08)] shadow-[0_24px_64px_-12px_hsl(224_60%_12%/0.18)] overflow-hidden">
                        <div className="px-5 pt-4 pb-3 border-b border-[hsl(224_20%_12%/0.06)]">
                          <p className="text-[10px] tracking-[0.3em] uppercase font-semibold text-[hsl(224_35%_48%)]">
                            Nos expertises
                          </p>
                        </div>
                        <div className="p-2">
                          {item.children.map((child, i) => (
                            <Link
                              key={child.href}
                              to={child.href}
                              className="group flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium text-[hsl(224_50%_22%)] hover:bg-[hsl(220_30%_97%)] transition-colors duration-150"
                              style={{ transitionDelay: expertisesOpen ? `${i * 22}ms` : "0ms" }}
                            >
                              <span className="flex items-center gap-2.5">
                                <span className="w-1 h-1 rounded-full bg-[hsl(224_30%_68%)] group-hover:bg-[hsl(224_55%_30%)] group-hover:scale-[1.7] transition-all duration-200" />
                                {child.label}
                              </span>
                              <ArrowRight
                                className="w-3.5 h-3.5 text-[hsl(224_35%_55%)] opacity-0 -translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                                strokeWidth={1.5}
                              />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              /* ── Regular link ── */
              const active = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`group relative px-4 py-2.5 text-[13px] font-medium tracking-wide transition-colors duration-200 ${
                    glass
                      ? active ? "text-white" : "text-white/72 hover:text-white"
                      : active ? "text-[hsl(224_60%_12%)]" : "text-[hsl(224_40%_38%)] hover:text-[hsl(224_60%_12%)]"
                  }`}
                >
                  {item.label}
                  {/* Underline — permanent on active, animated on hover */}
                  <span
                    className={`absolute bottom-1 left-4 right-4 h-px transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] origin-left ${
                      glass ? "bg-white/80" : "bg-[hsl(224_60%_12%)]"
                    } ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* ── Right actions ── */}
          <div className="hidden xl:flex items-center gap-2.5 ml-auto flex-shrink-0">
            {/* Prendre rendez-vous */}
            <Link
              to="/contact"
              className={`px-5 py-2 rounded-full text-[13px] font-medium tracking-wide transition-all duration-200 hover:-translate-y-px active:translate-y-0 ${
                glass
                  ? "text-white ring-1 ring-white/25 hover:ring-white/40 hover:bg-white/10"
                  : "bg-[hsl(224_60%_12%)] text-white hover:bg-[hsl(224_60%_8%)] shadow-sm hover:shadow-md"
              }`}
            >
              Prendre rendez-vous
            </Link>

            {/* Espace client dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setClientOpen(true)}
              onMouseLeave={() => setClientOpen(false)}
            >
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium tracking-wide transition-all duration-200 ${
                  glass
                    ? "text-white/80 ring-1 ring-white/20 hover:text-white hover:ring-white/38"
                    : "text-[hsl(224_40%_35%)] ring-1 ring-[hsl(224_60%_12%/0.17)] hover:text-[hsl(224_60%_12%)] hover:ring-[hsl(224_60%_12%/0.35)]"
                }`}
              >
                <UserRound className="w-3.5 h-3.5" strokeWidth={1.75} />
                Espace client
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-300 ${clientOpen ? "rotate-180" : ""}`}
                  strokeWidth={2}
                />
              </button>

              <div
                className={`absolute top-full right-0 pt-4 z-50 transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  clientOpen
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-1.5 pointer-events-none"
                }`}
              >
                <div className="bg-white rounded-xl ring-1 ring-[hsl(224_20%_12%/0.08)] shadow-[0_16px_40px_-8px_hsl(224_60%_12%/0.16)] w-52 py-1.5">
                  <div className="px-4 pt-2.5 pb-2 mb-1 border-b border-[hsl(224_20%_12%/0.06)]">
                    <p className="text-[10px] tracking-[0.28em] uppercase font-semibold text-[hsl(224_35%_52%)]">
                      Accès sécurisé
                    </p>
                  </div>
                  <a
                    href="https://app.wealthcome.fr/login"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-[hsl(224_50%_22%)] hover:bg-[hsl(220_30%_97%)] transition-colors duration-150"
                  >
                    <UserRound className="w-3.5 h-3.5 text-[hsl(224_30%_58%)]" strokeWidth={1.5} />
                    Espace client
                  </a>
                  <Link
                    to="/admin"
                    className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-[hsl(224_50%_22%)] hover:bg-[hsl(220_30%_97%)] transition-colors duration-150"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-[hsl(224_30%_58%)]" strokeWidth={1.5} />
                    Espace conseiller
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ── Mobile burger ── */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            className={`xl:hidden ml-auto flex flex-col gap-[5px] p-2 transition-colors duration-200 ${
              glass ? "text-white" : "text-[hsl(224_60%_12%)]"
            }`}
          >
            <span className={`block h-[1.5px] bg-current transition-all duration-300 ${menuOpen ? "w-5 rotate-45 translate-y-[6.5px]" : "w-5"}`} />
            <span className={`block h-[1.5px] bg-current transition-all duration-300 ${menuOpen ? "w-4 opacity-0" : "w-4"}`} />
            <span className={`block h-[1.5px] bg-current transition-all duration-300 ${menuOpen ? "w-5 -rotate-45 -translate-y-[6.5px]" : "w-5"}`} />
          </button>

        </div>
      </header>

      {/* ── Mobile fullscreen menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 flex flex-col"
            style={{ background: "hsl(224 60% 7%)" }}
          >
            {/* Top bar in menu */}
            <div className="flex items-center justify-between px-6 h-[72px] flex-shrink-0 border-b border-white/[0.06]">
              <Link to="/" onClick={() => setMenuOpen(false)}>
                <img src={logoWhite.url} alt="KANTI" className="h-[26px] w-auto" />
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-white/50 hover:text-white transition-colors p-1"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col">
              {NAV.map((item, i) => {
                if (item.children) {
                  return (
                    <div key={item.label} className="mt-8 mb-1">
                      <p className="text-[10px] tracking-[0.3em] uppercase font-semibold text-white/28 mb-3">
                        Expertises
                      </p>
                      {item.children.map((child, j) => (
                        <motion.div
                          key={child.href}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: (j + NAV.length - 1) * 0.04 + 0.14, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <Link
                            to={child.href}
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center justify-between py-3 text-[17px] font-heading font-light text-white/65 hover:text-white transition-colors border-b border-white/[0.06]"
                          >
                            {child.label}
                            <ArrowRight className="w-4 h-4 text-white/22" strokeWidth={1.5} />
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  );
                }
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 + 0.08, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      to={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between py-4 text-[21px] font-heading font-light text-white/85 hover:text-white transition-colors border-b border-white/[0.06]"
                    >
                      {item.label}
                      <ArrowRight className="w-4 h-4 text-white/22" strokeWidth={1.5} />
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom CTA */}
            <div className="px-6 py-8 flex flex-col gap-3 flex-shrink-0 border-t border-white/[0.06]">
              <Link
                to="/contact"
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center justify-center py-3.5 rounded-full text-[14px] font-medium bg-white text-[hsl(224_60%_12%)] hover:bg-white/90 transition-colors"
              >
                Prendre rendez-vous
              </Link>
              <a
                href="https://app.wealthcome.fr/login"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-[14px] font-medium text-white/72 ring-1 ring-white/18 hover:text-white hover:ring-white/35 transition-all"
              >
                <UserRound className="w-4 h-4" strokeWidth={1.5} />
                Espace client
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
