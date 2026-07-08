import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { MapPin, Phone, Mail, Clock, Calendar, FileText, Users, ShieldCheck, Clock3, Sparkles, MessageSquare } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Seo, { breadcrumbJsonLd, faqJsonLd, localBusinessJsonLd } from "@/components/Seo";

const contactSchema = z.object({
  nom: z.string().trim().min(2, "Indiquez votre nom complet").max(100, "Nom trop long"),
  email: z.string().trim().email("Email invalide").max(255),
  telephone: z.string().trim().max(30, "Téléphone trop long").optional().or(z.literal("")),
  profil: z.string().max(60).optional().or(z.literal("")),
  sujet: z.string().max(60).optional().or(z.literal("")),
  message: z.string().trim().max(2000, "Message trop long").optional().or(z.literal("")),
  // Honeypot anti-spam
  website: z.string().max(0, "").optional().or(z.literal("")),
});

const faqItems = [
  {
    q: "Le premier rendez-vous est-il vraiment gratuit ?",
    a: "Oui. Ce premier échange de 30 minutes est gratuit et sans engagement. Il sert à comprendre votre situation et à voir si un accompagnement est pertinent. Aucune recommandation produit n'est faite lors de ce rendez-vous.",
  },
  {
    q: "Combien coûte un accompagnement patrimonial ?",
    a: "Nos honoraires dépendent de la complexité de votre situation. Ils vous sont communiqués de façon transparente avant toute mission. Nous pouvons travailler en honoraires de conseil ou en commissions sur les produits souscrits, vous choisissez.",
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

const reassurances = [
  { icon: Clock3, title: "30 minutes", text: "Un échange court, ciblé, qui respecte votre temps." },
  { icon: ShieldCheck, title: "Gratuit & confidentiel", text: "Sans engagement, aucune recommandation produit." },
  { icon: Calendar, title: "Sous 24h ouvrées", text: "Nous vous rappelons rapidement pour caler le créneau." },
  { icon: Sparkles, title: "Architecture ouverte", text: "Aucun produit maison, aucun quota commercial." },
];

const etapes = [
  { n: "01", title: "Vous prenez contact", text: "Quelques informations sur votre situation via le formulaire." },
  { n: "02", title: "Nous vous rappelons", text: "Un conseiller vous contacte sous 24h ouvrées pour fixer le rendez-vous." },
  { n: "03", title: "Premier échange", text: "30 minutes en cabinet ou en visio, sans engagement." },
];

export default function ContactPage() {
  useScrollReveal();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nom: "", email: "", telephone: "", profil: "", sujet: "", message: "", website: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    if (parsed.data.website) {
      // Honeypot rempli → on simule un succès silencieux
      navigate("/merci", { state: { name: parsed.data.nom.split(" ")[0], subject: "contact" } });
      return;
    }
    setStatus("loading");
    // Mock front-only, log pour brancher le back ultérieurement
    console.info("[KANTI mock] Contact submission:", parsed.data);
    await new Promise((r) => setTimeout(r, 1100));
    setStatus("idle");
    navigate("/merci", { state: { name: parsed.data.nom.split(" ")[0], subject: "contact" } });
  };

  return (
    <>
      <Seo
        title="Contact, Prendre rendez-vous avec un conseiller patrimonial à Bordeaux"
        description="Premier échange de 30 minutes gratuit et sans engagement avec un conseiller KANTI. Cabinet de gestion de patrimoine à Bordeaux, réponse sous 24h ouvrées."
        jsonLd={[
          localBusinessJsonLd,
          breadcrumbJsonLd([
            { name: "Accueil", url: "/" },
            { name: "Contact", url: "/contact" },
          ]),
          faqJsonLd(faqItems.map((f) => ({ q: f.q, a: f.a }))),
        ]}
      />
      <Header />
      <main id="main">
      <PageHero
        title="Parlons de votre patrimoine"
        subtitle="Un premier échange de 30 minutes, gratuit et sans engagement, pour faire le point sur votre situation et clarifier vos priorités."
        breadcrumb="Cabinet · Contact"
      />

      {/* Reassurance bar, pousse à la prise de rendez-vous */}
      <section className="section-padding texture-paper relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="mb-12 reveal max-w-2xl">
            <div className="electric-line mb-5" />
            <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-5 font-medium">
              Pourquoi prendre rendez-vous
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground leading-[1.15] tracking-tight">
              Un échange court, <span className="italic text-foreground/70">utile dès la première minute</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {reassurances.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="glass-float p-6"
              >
                <r.icon className="w-5 h-5 text-[hsl(var(--electric))] mb-4" />
                <p className="font-heading text-base font-light text-foreground mb-1.5">{r.title}</p>
                <p className="text-foreground/60 text-sm font-light leading-relaxed">{r.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Étapes */}
          <div className="mt-16 grid md:grid-cols-3 gap-5">
            {etapes.map((e, i) => (
              <motion.div
                key={e.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                className="glass-float p-7 relative"
              >
                <span className="font-heading text-xs text-[hsl(var(--electric))] tabular-nums tracking-[0.3em]">{e.n}</span>
                <p className="font-heading text-lg font-light text-foreground mt-3 mb-2">{e.title}</p>
                <p className="text-foreground/60 text-sm font-light leading-relaxed">{e.text}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA principal */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 reveal">
            <a
              href="#formulaire"
              className="group inline-flex items-center justify-center gap-2 py-3.5 px-8 btn-primary-glass text-sm font-medium tracking-wide reflection-sweep"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Réserver mon premier échange</span>
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
            <a
              href="tel:0556000000"
              className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-[hsl(var(--electric))] transition-colors"
            >
              <Phone className="w-4 h-4" />
              ou appelez-nous au 06 63 32 48 09
            </a>
          </div>
        </div>
      </section>

      {/* Formulaire + infos */}
      <section id="formulaire" className="section-padding texture-paper relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8 lg:gap-12 relative z-10 items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7"
          >
            <div className="electric-line mb-5" />
            <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-5 font-medium">
              Demande de rendez-vous
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground leading-[1.15] tracking-tight mb-10">
              Quelques informations,<br />
              <span className="italic text-foreground/70">et nous vous rappelons</span>
            </h2>

            <div className="glass-float p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Honeypot anti-spam (invisible) */}
                <div aria-hidden className="absolute -left-[9999px] w-px h-px overflow-hidden">
                  <label htmlFor="website">Site web (laisser vide)</label>
                  <input
                    id="website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="nom" className="block text-[11px] font-medium text-foreground/60 mb-2 tracking-[0.2em] uppercase">Nom complet *</label>
                    <input id="nom" name="nom" type="text" value={form.nom} onChange={handleChange} required maxLength={100} disabled={status === "loading"} className="w-full px-4 py-3 bg-background/40 border border-foreground/15 rounded-md text-foreground text-sm focus:outline-none focus:border-[hsl(var(--electric))]/60 transition-colors disabled:opacity-50" placeholder="Votre nom" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-[11px] font-medium text-foreground/60 mb-2 tracking-[0.2em] uppercase">Email *</label>
                    <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required maxLength={255} disabled={status === "loading"} className="w-full px-4 py-3 bg-background/40 border border-foreground/15 rounded-md text-foreground text-sm focus:outline-none focus:border-[hsl(var(--electric))]/60 transition-colors disabled:opacity-50" placeholder="votre@email.fr" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="telephone" className="block text-[11px] font-medium text-foreground/60 mb-2 tracking-[0.2em] uppercase">Téléphone</label>
                    <input id="telephone" name="telephone" type="tel" value={form.telephone} onChange={handleChange} maxLength={30} disabled={status === "loading"} className="w-full px-4 py-3 bg-background/40 border border-foreground/15 rounded-md text-foreground text-sm focus:outline-none focus:border-[hsl(var(--electric))]/60 transition-colors disabled:opacity-50" placeholder="06 00 00 00 00" />
                  </div>
                  <div>
                    <label htmlFor="profil" className="block text-[11px] font-medium text-foreground/60 mb-2 tracking-[0.2em] uppercase">Votre profil</label>
                    <select id="profil" name="profil" value={form.profil} onChange={handleChange} disabled={status === "loading"} className="w-full px-4 py-3 bg-background/40 border border-foreground/15 rounded-md text-foreground text-sm focus:outline-none focus:border-[hsl(var(--electric))]/60 transition-colors disabled:opacity-50">
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
                  <label htmlFor="sujet" className="block text-[11px] font-medium text-foreground/60 mb-2 tracking-[0.2em] uppercase">Sujet principal</label>
                  <select id="sujet" name="sujet" value={form.sujet} onChange={handleChange} disabled={status === "loading"} className="w-full px-4 py-3 bg-background/40 border border-foreground/15 rounded-md text-foreground text-sm focus:outline-none focus:border-[hsl(var(--electric))]/60 transition-colors disabled:opacity-50">
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
                  <label htmlFor="message" className="block text-[11px] font-medium text-foreground/60 mb-2 tracking-[0.2em] uppercase">Quelques mots sur votre situation</label>
                  <textarea id="message" name="message" rows={4} value={form.message} onChange={handleChange} maxLength={2000} disabled={status === "loading"} className="w-full px-4 py-3 bg-background/40 border border-foreground/15 rounded-md text-foreground text-sm focus:outline-none focus:border-[hsl(var(--electric))]/60 transition-colors resize-none disabled:opacity-50" placeholder="Décrivez brièvement votre situation ou ce qui vous amène..." />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="group inline-flex items-center justify-center gap-2 py-3.5 px-8 btn-primary-glass text-sm font-medium tracking-wide reflection-sweep disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <span>{status === "loading" ? "Envoi en cours…" : "Envoyer ma demande"}</span>
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                  <p className="text-[11px] text-foreground/40 font-light">Réponse sous 24h ouvrées · Confidentiel</p>
                </div>
              </form>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-5 space-y-5 lg:sticky lg:top-28"
          >
            <div className="glass-float p-7 divide-y divide-foreground/10">
              <div className="pb-5">
                <div className="flex items-center gap-3 mb-2.5">
                  <Calendar className="w-4 h-4 text-[hsl(var(--electric))]" />
                  <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/50 font-medium">Premier rendez-vous</p>
                </div>
                <p className="text-foreground/65 text-sm leading-relaxed font-light">
                  <span className="text-foreground/90">30 minutes, gratuit, sans engagement.</span> Un échange libre pour comprendre votre situation. Aucune recommandation produit n'est faite.
                </p>
              </div>

              <div className="py-5">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-4 h-4 text-[hsl(var(--electric))]" />
                  <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/50 font-medium">Qui accompagnons-nous</p>
                </div>
                <ul className="grid grid-cols-1 gap-1.5 text-sm text-foreground/65 font-light">
                  {[
                    "Particuliers avec un patrimoine à structurer",
                    "Cadres dirigeants et professions libérales",
                    "Chefs d'entreprise et associés",
                    "Familles en phase de transmission",
                  ].map((line) => (
                    <li key={line} className="flex items-start gap-2.5">
                      <span className="w-1 h-1 rounded-full bg-[hsl(var(--electric))] mt-2 flex-shrink-0" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-5">
                <div className="flex items-center gap-3 mb-2.5">
                  <FileText className="w-4 h-4 text-[hsl(var(--electric))]" />
                  <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/50 font-medium">Documents utiles</p>
                </div>
                <p className="text-foreground/60 text-sm leading-relaxed font-light">
                  Aucun document requis pour le premier échange. Pour aller plus loin : avis d'imposition, relevés de patrimoine, contrats en cours.
                </p>
              </div>
            </div>

            <div className="glass-float p-7 relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.04] bg-gradient-to-br from-[hsl(var(--electric))] to-transparent pointer-events-none" />
              <div className="relative">
                <p className="text-[10px] tracking-[0.3em] uppercase text-[hsl(var(--electric))] mb-4 font-medium">Coordonnées</p>
                <div className="space-y-2.5 text-sm text-foreground/70 font-light">
                  <p className="flex items-start gap-3">
                    <MapPin className="w-3.5 h-3.5 mt-1 text-foreground/40 flex-shrink-0" />
                    12 rue Ferrere, 33000 Bordeaux
                  </p>
                  <p className="flex items-center gap-3">
                    <Phone className="w-3.5 h-3.5 text-foreground/40 flex-shrink-0" />
                    06 63 32 48 09
                  </p>
                  <p className="flex items-center gap-3">
                    <Mail className="w-3.5 h-3.5 text-foreground/40 flex-shrink-0" />
                    kanti@adnfamily.com
                  </p>
                  <p className="flex items-center gap-3 text-xs text-foreground/40 pt-3 border-t border-foreground/10">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                    Lundi – Vendredi · 9h–18h · Sur rendez-vous
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ de conversion */}
      <section className="section-padding texture-paper relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="mb-12 reveal">
            <div className="electric-line mb-5" />
            <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-5 font-medium">
              Questions fréquentes
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground leading-[1.15] tracking-tight">
              Avant de prendre <span className="italic text-foreground/70">rendez-vous</span>
            </h2>
          </div>
          <div className="glass-float p-2 reveal">
            {faqItems.map((item, i) => (
              <div key={i} className={i === 0 ? "" : "border-t border-foreground/10"}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full py-5 px-6 flex items-start justify-between text-left group"
                >
                  <span className="font-heading text-base md:text-lg font-light text-foreground pr-8 group-hover:text-[hsl(var(--electric))] transition-colors">
                    {item.q}
                  </span>
                  <span className={`text-[hsl(var(--electric))] flex-shrink-0 mt-1 text-xl transition-transform duration-300 ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-60 pb-5 px-6" : "max-h-0"}`}>
                  <p className="text-foreground/65 text-sm leading-relaxed font-light">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      </main>
      <Footer />
    </>
  );
}
