import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative pt-20 pb-10 px-6 section-dark">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-4 gap-10 mb-14">
          <div className="md:col-span-2">
            <p className="font-heading text-2xl font-light text-white tracking-[0.18em] mb-5">
              KANTI
            </p>
            <p className="text-sm leading-relaxed max-w-md mb-5 text-white/55 font-light">
              Cabinet indépendant de conseil en gestion de patrimoine à Bordeaux. Nous accompagnons les particuliers et les dirigeants dans la structuration, l'optimisation fiscale et la transmission de leur patrimoine.
            </p>
            <div className="text-xs text-white/40 space-y-1 font-light">
              <p>12 Cours de l'Intendance — 33000 Bordeaux</p>
              <p>05 56 00 00 00 — contact@kanti.fr</p>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-medium text-white/40 tracking-[0.25em] uppercase mb-5">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-white/65 font-light">
              <li><Link to="/cabinet" className="hover:text-white transition-colors link-underline-light">Le Cabinet</Link></li>
              <li><Link to="/notre-methode" className="hover:text-white transition-colors link-underline-light">Notre méthode</Link></li>
              <li><Link to="/cas-clients" className="hover:text-white transition-colors link-underline-light">Cas clients</Link></li>
              <li><Link to="/actualites" className="hover:text-white transition-colors link-underline-light">Actualités</Link></li>
              <li><Link to="/faq-patrimoniale" className="hover:text-white transition-colors link-underline-light">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors link-underline-light">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-medium text-white/40 tracking-[0.25em] uppercase mb-5">
              Expertises
            </h4>
            <ul className="space-y-2.5 text-sm text-white/65 font-light">
              <li><Link to="/gestion-patrimoniale" className="hover:text-white transition-colors link-underline-light">Gestion patrimoniale</Link></li>
              <li><Link to="/fiscalite" className="hover:text-white transition-colors link-underline-light">Fiscalité</Link></li>
              <li><Link to="/patrimoine-professionnel" className="hover:text-white transition-colors link-underline-light">Patrimoine professionnel</Link></li>
              <li><Link to="/financement" className="hover:text-white transition-colors link-underline-light">Financement</Link></li>
              <li><Link to="/transmission-patrimoine-famille" className="hover:text-white transition-colors link-underline-light">Transmission</Link></li>
              <li><Link to="/patrimoine-immobilier-strategie" className="hover:text-white transition-colors link-underline-light">Immobilier</Link></li>
            </ul>
          </div>
        </div>

        <div className="separator-fine mb-8" style={{ background: "linear-gradient(90deg, transparent, hsl(0 0% 100% / 0.12), transparent)" }} />

        <div className="text-[11px] leading-relaxed mb-6 text-white/35 font-light">
          <p>
            KANTI — SAS au capital de 10 000 € — RCS Bordeaux 000 000 000 — Siège social : 12 Cours de l'Intendance, 33000 Bordeaux.
            Conseiller en Investissements Financiers (CIF) enregistré à l'ORIAS sous le n° 00 000 000. Membre de la Chambre Nationale des Conseils en Gestion de Patrimoine (CNCGP), association agréée par l'Autorité des Marchés Financiers (AMF).
            Courtier en assurances (COA) — Courtier en opérations de banque et services de paiement (COBSP). Activité de transaction immobilière — Carte professionnelle n° CPI 0000 0000 000 000 000 délivrée par la CCI de Bordeaux.
            Responsabilité civile professionnelle et garantie financière conformes aux articles L.541-3 et L.512-6 du Code monétaire et financier.
          </p>
        </div>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 text-xs text-white/35 font-light">
          <div className="flex flex-wrap gap-5">
            <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a>
            <a href="#" className="hover:text-white transition-colors">Réclamations</a>
          </div>
          <p>© 2026 KANTI — Tous droits réservés</p>
        </div>
      </div>
    </footer>
  );
}
