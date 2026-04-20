import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

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
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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

  // On home, header is transparent over the dark hero until scroll
  // On internal pages, always use light glass nav
  const useDarkGlass = isHome && !scrolled;
  const textColor = useDarkGlass ? "text-white" : "text-foreground";
  const textMuted = useDarkGlass ? "text-white/75" : "text-foreground/70";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2.5" : "py-4"
      }`}
    >
      <div className="px-4 md:px-6 max-w-[1400px] mx-auto">
        <div
          className={`flex items-center justify-between rounded-full px-5 md:px-7 py-3 transition-all duration-500 ${
            useDarkGlass
              ? "glass-dark"
              : scrolled
              ? "glass-strong"
              : "glass"
          }`}
        >
          <Link
            to="/"
            className={`font-heading text-xl md:text-2xl font-semibold tracking-[0.18em] ${textColor} hover:opacity-80 transition-opacity duration-300`}
          >
            KANTI
          </Link>

          {/* Desktop nav */}
          <nav className="hidden xl:flex items-center gap-6">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button
                    className={`text-[13px] font-medium tracking-wide ${textMuted} hover:${textColor.replace(
                      "text-",
                      "text-"
                    )} transition-colors duration-300 flex items-center gap-1.5`}
                  >
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
                    className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-400 ${
                      dropdownOpen
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-2 pointer-events-none"
                    }`}
                  >
                    <div className="glass-strong rounded-2xl py-2 min-w-[260px] overflow-hidden">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          className="block px-5 py-3 text-[13px] text-foreground/75 hover:text-foreground hover:bg-white/40 transition-colors duration-200"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-[13px] font-medium tracking-wide ${textMuted} hover:opacity-100 transition-opacity duration-300 link-underline`}
                >
                  {link.label}
                </Link>
              )
            )}
            <Link
              to="/contact"
              className={`ml-2 px-5 py-2 text-[13px] font-medium tracking-wide ${
                useDarkGlass
                  ? "btn-glass text-white"
                  : "btn-primary-glass"
              }`}
            >
              Prendre rendez-vous
            </Link>
          </nav>

          {/* Mobile burger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`xl:hidden flex flex-col gap-1.5 p-2 relative z-[60] ${textColor}`}
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
