import { Link } from "react-router-dom";
import logoWhite from "@/assets/logo-kanti-white.png.asset.json";

export default function Footer() {
  return (
    <footer className="relative pt-20 pb-10 px-6 section-dark">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-4 gap-10 mb-14">
          <div className="md:col-span-2">
            <img
              src={logoWhite.url}
              alt="KANTI"
              className="h-9 w-auto mb-5"
              width={180}
              height={52}
            />
            <p className="text-sm leading-relaxed max-w-md mb-5 text-white/55 font-light">
              Cabinet de conseil en gestion de patrimoine à Bordeaux. Nous accompagnons les particuliers et les dirigeants dans la structuration, l'optimisation fiscale et la transmission de leur patrimoine.
            </p>
            <div className="text-xs text-white/40 space-y-1 font-light">
              <p>12 rue Ferrere, 33000 Bordeaux</p>
              <p>kanti@adnfamily.com</p>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-medium text-white/40 tracking-[0.25em] uppercase mb-5">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-white/75 font-light">
              <li><Link to="/cabinet" className="hover:text-white transition-colors link-underline-light">Le Cabinet</Link></li>
              <li><Link to="/notre-methode" className="hover:text-white transition-colors link-underline-light">Notre méthode</Link></li>
              <li><Link to="/cas-clients" className="hover:text-white transition-colors link-underline-light">Cas clients</Link></li>
              <li><Link to="/actualites" className="hover:text-white transition-colors link-underline-light">Actualités</Link></li>
              <li><Link to="/ressources" className="hover:text-white transition-colors link-underline-light">Ressources</Link></li>
              <li><Link to="/faq-patrimoniale" className="hover:text-white transition-colors link-underline-light">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors link-underline-light">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-medium text-white/40 tracking-[0.25em] uppercase mb-5">
              Expertises
            </h4>
            <ul className="space-y-2.5 text-sm text-white/75 font-light">
              <li><Link to="/gestion-patrimoniale" className="hover:text-white transition-colors link-underline-light">Gestion patrimoniale</Link></li>
              <li><Link to="/fiscalite" className="hover:text-white transition-colors link-underline-light">Fiscalité</Link></li>
              <li><Link to="/patrimoine-professionnel" className="hover:text-white transition-colors link-underline-light">Patrimoine professionnel</Link></li>
              <li><Link to="/financement" className="hover:text-white transition-colors link-underline-light">Financement</Link></li>
              <li><Link to="/transmission-patrimoine-famille" className="hover:text-white transition-colors link-underline-light">Transmission</Link></li>
              <li><Link to="/patrimoine-immobilier-strategie" className="hover:text-white transition-colors link-underline-light">Immobilier</Link></li>
            </ul>
          </div>
        </div>

        <div className="separator-fine opacity-30 mb-8" style={{ background: "linear-gradient(90deg, transparent, hsl(0 0% 100% / 0.08), transparent)" }} />

        <div className="text-[11px] leading-relaxed mb-6 text-white/55 font-light">
          <p>
            KANTI, SAS immatriculée au RCS de Bayonne sous le n° 878 821 818, Code NAF 7022Z, TVA intracommunautaire FR34878821818, Siège social : 9 Rue de la Négresse, 64200 Biarritz.
            Immatriculé à l'ORIAS sous le n° 20 000 855 (www.orias.fr) en qualité de Conseiller en Investissements Financiers (CIF), Courtier d'assurance et Courtier en opérations de banque et services de paiement (IOBSP).
            Adhérent de La Compagnie CIF et de La Compagnie IOBSP (n° F002635) et de la CNCEF Assurance (n° 25/860422), associations agréées par l'AMF et l'ACPR. Activités d'IAS et d'IOBSP contrôlables par l'ACPR.
            Carte professionnelle « Transactions immobilières » n° CPI33012020000045313 délivrée par la CCI de Bordeaux-Gironde, ne peut recevoir aucun fonds, effet ou valeur.
            Assurance RC professionnelle : MMA IARD Assurances Mutuelles / MMA IARD, 160 rue Henri Champion, 72030 Le Mans Cedex 9, police n° 112 786 342, adhérent n° 231 972.
          </p>
        </div>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 text-xs text-white/55 font-light">
          <div className="flex flex-wrap gap-5">
            <Link to="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link>
            <Link to="/politique-de-confidentialite" className="hover:text-white transition-colors">Politique de confidentialité</Link>
            <Link to="/reclamations" className="hover:text-white transition-colors">Réclamations</Link>
            <Link to="/ressources" className="hover:text-white transition-colors">Ressources</Link>
          </div>
          <p>© 2026 KANTI, Tous droits réservés</p>
        </div>
      </div>
    </footer>
  );
}
