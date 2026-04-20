import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import TrustBand from "@/components/TrustBand";

const faqItems = [
  {
    q: "Le premier rendez-vous est-il vraiment gratuit ?",
    a: "Oui. Ce premier échange de 30 minutes est gratuit et sans engagement. Il sert à comprendre votre situation et à voir si un accompagnement est pertinent. Aucune recommandation produit n'est faite lors de ce rendez-vous.",
  },
  {
    q: "Combien coûte un accompagnement patrimonial ?",
    a: "Nos honoraires dépendent de la complexité de votre situation. Ils vous sont communiqués de façon transparente avant toute mission. Nous pouvons travailler en honoraires de conseil ou en commissions sur les produits souscrits — vous choisissez.",
  },
  {
    q: "Quels documents apporter au premier rendez-vous ?",
    a: "Pour un premier échange, rien d'obligatoire. Si vous souhaitez aller plus loin, nous vous demanderons vos avis d'imposition, relevés de comptes et contrats en cours. Nous vous fournirons une liste précise.",
  },
  {
    q: "Quelle est la différence avec ma banque ?",
    a: "Un conseiller bancaire distribue les produits de son établissement. Nous, nous n'avons aucun produit maison. Nous comparons l'ensemble du marché pour sélectionner ce qui correspond réellement à votre situation.",
  },
  {
    q: "Sous quel délai recevrai-je une réponse ?",
    a: "Nous revenons vers vous sous 24 heures ouvrées maximum, généralement le jour même. Le premier rendez-vous peut être fixé dans la semaine qui suit votre prise de contact.",
  },
];

export default function ContactPage() {
  useScrollReveal();
  const [form, setForm] = useState({ nom: "", email: "", telephone: "", profil: "", sujet: "", message: "" });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <Header />
      <PageHero
        title="Parlons de votre patrimoine"
        subtitle="Un premier échange de 30 minutes, gratuit et sans engagement, pour faire le point sur votre situation et clarifier vos priorités."
        breadcrumb="Contact"
      />

      {/* Parcours de contact */}
      <section className="section-padding bg-background texture-paper">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 reveal">
            <p className="text-[13px] tracking-widest uppercase text-gold mb-4">Comment nous contacter</p>
            <h2 className="text-2xl md:text-3xl font-heading font-semibold text-primary mb-4">
              Choisissez le format qui vous convient
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 reveal">
            <div className="border-t border-border pt-6">
              <p className="text-xs tracking-widest uppercase text-gold mb-3">Particulier</p>
              <h3 className="font-heading text-lg font-semibold text-primary mb-2">Vous êtes un particulier</h3>
              <p className="text-gray-text text-sm leading-relaxed mb-4">Patrimoine financier, immobilier, préparation de la retraite, transmission familiale, optimisation fiscale.</p>
              <a href="#formulaire" className="text-sm font-medium text-primary border-b border-primary/30 hover:border-primary pb-0.5 transition-colors">Prendre rendez-vous →</a>
            </div>
            <div className="border-t border-border pt-6">
              <p className="text-xs tracking-widest uppercase text-gold mb-3">Dirigeant</p>
              <h3 className="font-heading text-lg font-semibold text-primary mb-2">Vous êtes chef d'entreprise</h3>
              <p className="text-gray-text text-sm leading-relaxed mb-4">Rémunération, trésorerie, holding, prévoyance, cession, transmission d'entreprise, épargne salariale.</p>
              <a href="#formulaire" className="text-sm font-medium text-primary border-b border-primary/30 hover:border-primary pb-0.5 transition-colors">Prendre rendez-vous →</a>
            </div>
            <div className="border-t border-border pt-6">
              <p className="text-xs tracking-widest uppercase text-gold mb-3">Immobilier</p>
              <h3 className="font-heading text-lg font-semibold text-primary mb-2">Vous avez un projet immobilier</h3>
              <p className="text-gray-text text-sm leading-relaxed mb-4">Financement, investissement locatif, SCI, résidence principale, arbitrage entre achat et location.</p>
              <a href="#formulaire" className="text-sm font-medium text-primary border-b border-primary/30 hover:border-primary pb-0.5 transition-colors">Prendre rendez-vous →</a>
            </div>
          </div>
        </div>
      </section>

      {/* Formulaire + infos */}
      <section id="formulaire" className="section-padding section-ivory">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-14">
          <div className="lg:col-span-3 reveal">
            <h2 className="text-2xl md:text-3xl font-heading font-semibold text-primary mb-6">
              Demande de rendez-vous
            </h2>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="nom" className="block text-xs font-medium text-primary mb-1.5 tracking-wide">Nom complet *</label>
                  <input id="nom" name="nom" type="text" value={form.nom} onChange={handleChange} required className="w-full px-4 py-3 border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold transition-colors" placeholder="Votre nom" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-primary mb-1.5 tracking-wide">Email *</label>
                  <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required className="w-full px-4 py-3 border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold transition-colors" placeholder="votre@email.fr" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="telephone" className="block text-xs font-medium text-primary mb-1.5 tracking-wide">Téléphone</label>
                  <input id="telephone" name="telephone" type="tel" value={form.telephone} onChange={handleChange} className="w-full px-4 py-3 border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold transition-colors" placeholder="06 00 00 00 00" />
                </div>
                <div>
                  <label htmlFor="profil" className="block text-xs font-medium text-primary mb-1.5 tracking-wide">Votre profil</label>
                  <select id="profil" name="profil" value={form.profil} onChange={handleChange} className="w-full px-4 py-3 border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold transition-colors">
                    <option value="">Sélectionner</option>
                    <option value="particulier">Particulier / Famille</option>
                    <option value="dirigeant">Chef d'entreprise / Dirigeant</option>
                    <option value="liberal">Profession libérale</option>
                    <option value="investisseur">Investisseur immobilier</option>
                    <option value="expatrie">Expatrié / Retour en France</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="sujet" className="block text-xs font-medium text-primary mb-1.5 tracking-wide">Sujet principal</label>
                <select id="sujet" name="sujet" value={form.sujet} onChange={handleChange} className="w-full px-4 py-3 border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold transition-colors">
                  <option value="">Sélectionner un sujet</option>
                  <option value="bilan">Bilan patrimonial</option>
                  <option value="fiscalite">Optimisation fiscale</option>
                  <option value="placement">Placements & épargne</option>
                  <option value="immobilier">Immobilier & financement</option>
                  <option value="transmission">Transmission & succession</option>
                  <option value="entreprise">Patrimoine professionnel</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-xs font-medium text-primary mb-1.5 tracking-wide">Quelques mots sur votre situation</label>
                <textarea id="message" name="message" rows={4} value={form.message} onChange={handleChange} className="w-full px-4 py-3 border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold transition-colors resize-none" placeholder="Décrivez brièvement votre situation ou ce qui vous amène..." />
              </div>
              <button type="submit" className="px-8 py-3 bg-gold text-navy-deep text-sm font-medium tracking-wide hover:bg-gold-light transition-colors duration-300">
                Envoyer ma demande
              </button>
              <p className="text-xs text-gray-text/60">
                En soumettant ce formulaire, vous acceptez que vos données soient traitées conformément à notre politique de confidentialité. Réponse sous 24h ouvrées.
              </p>
            </form>
          </div>

          <div className="lg:col-span-2 reveal reveal-delay-2 space-y-8">
            <div className="border-l-2 border-gold/30 pl-6">
              <h3 className="font-heading text-lg font-semibold text-primary mb-3">Le premier rendez-vous</h3>
              <p className="text-gray-text text-sm leading-relaxed mb-2">
                Durée : 30 minutes. Gratuit. Sans engagement.
              </p>
              <p className="text-gray-text text-sm leading-relaxed">
                Il s'agit d'un échange libre pour comprendre votre situation, vos projets et vos préoccupations. Nous n'effectuons aucune recommandation produit lors de ce rendez-vous.
              </p>
            </div>

            <div className="border-l-2 border-gold/30 pl-6">
              <h3 className="font-heading text-lg font-semibold text-primary mb-3">Qui accompagnons-nous ?</h3>
              <ul className="space-y-1.5 text-sm text-gray-text">
                <li>• Particuliers avec un patrimoine à structurer ou optimiser</li>
                <li>• Cadres dirigeants et cadres supérieurs</li>
                <li>• Professions libérales (médecins, avocats, architectes…)</li>
                <li>• Chefs d'entreprise et associés</li>
                <li>• Familles en phase de transmission</li>
              </ul>
            </div>

            <div className="border-l-2 border-gold/30 pl-6">
              <h3 className="font-heading text-lg font-semibold text-primary mb-3">Documents utiles</h3>
              <p className="text-gray-text text-sm leading-relaxed">
                Pour le premier échange, aucun document n'est nécessaire. Si nous allons plus loin, nous vous demanderons : dernier avis d'imposition, relevés de patrimoine, contrats d'assurance-vie ou de prévoyance en cours.
              </p>
            </div>

            <div className="bg-navy p-6 text-primary-foreground">
              <h3 className="font-heading text-lg font-semibold mb-3 text-gold">Coordonnées</h3>
              <div className="space-y-2 text-sm text-primary-foreground/70">
                <p>12 Cours de l'Intendance, 33000 Bordeaux</p>
                <p>05 56 00 00 00</p>
                <p>contact@kanti.fr</p>
                <p className="text-primary-foreground/40 pt-2 text-xs">Lundi – Vendredi, 9h–18h — Sur rendez-vous</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ de conversion */}
      <section className="section-padding bg-background texture-paper">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 reveal">
            <p className="text-[13px] tracking-widest uppercase text-gold mb-4">Questions fréquentes</p>
            <h2 className="text-2xl md:text-3xl font-heading font-semibold text-primary">
              Avant de prendre rendez-vous
            </h2>
          </div>
          <div className="space-y-0 reveal">
            {faqItems.map((item, i) => (
              <div key={i} className="border-t border-border">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full py-5 flex items-start justify-between text-left group"
                >
                  <span className="font-heading text-lg font-semibold text-primary pr-8 group-hover:text-gold transition-colors">{item.q}</span>
                  <span className={`text-gold flex-shrink-0 mt-1 transition-transform duration-300 ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-40 pb-5" : "max-h-0"}`}>
                  <p className="text-gray-text text-sm leading-relaxed">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TrustBand />
      <Footer />
    </>
  );
}
