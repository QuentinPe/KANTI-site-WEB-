import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Le Cabinet", href: "/cabinet" },
  {
    label: "Expertises",
    href: "#",
    children: [
      { label: "Gestion patrimoniale", href: "/gestion-patrimoniale" },
      { label: "Fiscalité du patrimoine", href: "/fiscalite" },
      { label: "Patrimoine professionnel", href: "/patrimoine-professionnel" },
      { label: "Financement & crédit", href: "/financement" },
    ],
  },
  { label: "Notre méthode", href: "/notre-methode" },
  { label: "Cas clients", href: "/cas-clients" },
  { label: "Actualités", href: "/actualites" },
  { label: "Ressources", href: "/ressources" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [navExpanded, setNavExpanded] = useState(false);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Nav unfurl animation: starts collapsed (just the KANTI bubble), expands
  // horizontally to the left from a small "seed" pill into the full menu.
  useEffect(() => {
    setNavExpanded(false);
    const t = window.setTimeout(() => setNavExpanded(true), 220);
    return () => window.clearTimeout(t);
  }, [location.pathname]);

  // On home, header is transparent over the dark hero until scroll
  // On internal pages, always use light glass nav
  const useDarkGlass = isHome && !scrolled;
  const textColor = useDarkGlass ? "text-white" : "text-foreground";
  const textMuted = useDarkGlass ? "text-white/75" : "text-foreground/70";

  const bubbleClass = useDarkGlass ? "glass-dark" : scrolled ? "glass-strong" : "glass";
  // Bubble (hover pill) — same visual family as the KANTI bubble
  const hoverPillClass = useDarkGlass
    ? "bg-white/12 backdrop-blur-md ring-1 ring-white/15"
    : "bg-white/70 backdrop-blur-md ring-1 ring-foreground/10 shadow-[0_4px_20px_-8px_hsl(var(--foreground)/0.15)]";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2.5" : "py-4"
      }`}
    >
      <div className="px-4 md:px-6 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between gap-3">
          {/* KANTI bubble — anchor on the left */}
          <Link
            to="/"
            aria-label="KANTI — Accueil"
            className={`relative z-[2] flex items-center rounded-full px-6 md:px-7 py-3 transition-all duration-500 ${bubbleClass} ${textColor} hover:opacity-95`}
          >
            <span className="font-heading text-xl md:text-2xl font-semibold tracking-[0.18em]">
              KANTI
            </span>
          </Link>

          {/* Desktop nav bubble — unfurls horizontally from the right toward KANTI */}
          <div
            className={`hidden xl:block flex-1 transition-[transform,opacity,filter] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] origin-right will-change-transform ${
              navExpanded
                ? "opacity-100 scale-x-100 blur-0"
                : "opacity-0 scale-x-0 blur-[2px]"
            }`}
            style={{ transformOrigin: "right center" }}
          >
            <nav
              onMouseLeave={() => {
                /* keep last hovered item — do not clear */
              }}
              className={`flex items-center justify-end gap-1 rounded-full pl-3 pr-2 py-2 transition-all duration-500 ${bubbleClass}`}
            >
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => {
                    setDropdownOpen(true);
                    setHoveredKey(link.label);
                  }}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button
                    aria-haspopup="menu"
                    aria-expanded={dropdownOpen}
                    className={`relative px-4 py-1.5 rounded-full text-[13px] font-medium tracking-wide ${textMuted} transition-colors duration-300 flex items-center gap-1.5`}
                  >
                    <AnimatePresence>
                      {hoveredKey === link.label && (
                        <motion.span
                          layoutId="nav-hover-bubble"
                          aria-hidden
                          className={`absolute inset-0 -z-10 rounded-full ${hoverPillClass}`}
                          transition={{ type: "spring", stiffness: 380, damping: 32, mass: 0.7 }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}
                    </AnimatePresence>
                    {link.label}
                    <svg
                      className={`w-3 h-3 transition-transform duration-300 ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div
                    className={`absolute top-full left-0 pt-4 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      dropdownOpen
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-3 pointer-events-none"
                    }`}
                  >
                    <div className="glass-strong rounded-2xl p-2 min-w-[300px] overflow-hidden ring-1 ring-foreground/5 shadow-[0_20px_60px_-20px_hsl(var(--foreground)/0.25)]">
                      <div className="px-4 pt-2 pb-3 mb-1 border-b border-foreground/[0.06]">
                        <p className="text-[10px] tracking-[0.28em] uppercase font-medium text-foreground/45">
                          Nos expertises
                        </p>
                      </div>
                      {link.children.map((child, idx) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          style={{ transitionDelay: dropdownOpen ? `${idx * 40}ms` : "0ms" }}
                          className={`group flex items-center justify-between gap-4 px-4 py-3 rounded-xl text-[13px] font-medium text-foreground/75 hover:text-foreground hover:bg-foreground/[0.04] transition-all duration-300 ${
                            dropdownOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <span className="w-1 h-1 rounded-full bg-foreground/25 group-hover:bg-foreground/70 group-hover:scale-150 transition-all duration-300" />
                            {child.label}
                          </span>
                          <svg
                            className="w-3.5 h-3.5 text-foreground/30 -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.6}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  onMouseEnter={() => setHoveredKey(link.href)}
                  className={`relative px-4 py-1.5 rounded-full text-[13px] font-medium tracking-wide ${textMuted} hover:opacity-100 transition-colors duration-300`}
                >
                  <AnimatePresence>
                    {hoveredKey === link.href && (
                      <motion.span
                        layoutId="nav-hover-bubble"
                        aria-hidden
                        className={`absolute inset-0 -z-10 rounded-full ${hoverPillClass}`}
                        transition={{ type: "spring", stiffness: 380, damping: 32, mass: 0.7 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </AnimatePresence>
                  {link.label}
                </Link>
              )
            )}
            <Link
              to="/contact"
              className={`ml-2 px-5 py-2 rounded-full text-[13px] font-medium tracking-wide ${
                useDarkGlass
                  ? "btn-glass text-white"
                  : "btn-primary-glass"
              }`}
            >
              Prendre rendez-vous
            </Link>
            </nav>
          </div>

          {/* Mobile burger bubble */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className={`xl:hidden flex flex-col gap-1.5 rounded-full p-3.5 relative z-[60] transition-all duration-500 ${bubbleClass} ${textColor}`}
            aria-label="Menu"
          >
            <span
              className={`block w-5 h-[1.5px] bg-current transition-all duration-300 ${
                menuOpen ? "rotate-45 translate-y-[7px]" : ""
              }`}
            />
            <span
              className={`block w-5 h-[1.5px] bg-current transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-5 h-[1.5px] bg-current transition-all duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-[7px]" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`xl:hidden fixed inset-0 transition-all duration-500 flex flex-col items-center justify-center gap-5 z-[55] ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{
          background: "linear-gradient(180deg, hsl(224 60% 7% / 0.95) 0%, hsl(222 50% 14% / 0.95) 100%)",
          backdropFilter: "blur(30px) saturate(180%)",
        }}
      >
        {navLinks.map((link) =>
          link.children ? (
            <div key={link.label} className="flex flex-col items-center gap-2">
              <span className="text-xs font-medium tracking-widest text-white/40 uppercase mb-1">
                {link.label}
              </span>
              {link.children.map((child) => (
                <Link
                  key={child.href}
                  to={child.href}
                  className="text-lg font-heading tracking-wide text-white/85 hover:text-white transition-colors"
                >
                  {child.label}
                </Link>
              ))}
            </div>
          ) : (
            <Link
              key={link.href}
              to={link.href}
              className="text-lg font-heading tracking-wide text-white/85 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          )
        )}
        <Link
          to="/contact"
          className="mt-4 px-8 py-3 btn-glass text-white text-sm tracking-wide"
        >
          Prendre rendez-vous
        </Link>
      </div>
    </header>
  );
}
