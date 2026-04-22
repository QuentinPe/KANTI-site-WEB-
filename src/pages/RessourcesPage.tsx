import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import { toast } from "sonner";
import { FileText, Download, Mail, BookOpen } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Seo from "@/components/Seo";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import imgDefisc from "@/assets/resource-defiscalisation.jpg";
import imgTransmission from "@/assets/resource-transmission.jpg";
import imgCession from "@/assets/resource-cession.jpg";
import imgImmobilier from "@/assets/resource-immobilier.jpg";
import imgRetraite from "@/assets/resource-retraite.jpg";
import imgAssuranceVie from "@/assets/resource-assurance-vie.jpg";
import imgScpi from "@/assets/resource-scpi.jpg";
import imgExpat from "@/assets/resource-expatriation.jpg";
import imgIfi from "@/assets/resource-ifi.jpg";
import imgIsr from "@/assets/resource-isr.jpg";

type Category = "Tous" | "Fiscalité" | "Transmission" | "Dirigeants" | "Investir" | "International";

const resources = [
  {
    id: "defiscalisation-2026",
    category: "Fiscalité" as const,
    eyebrow: "Guide PDF · 24 pages",
    title: "10 leviers de défiscalisation 2026",
    description:
      "Panorama actualisé des dispositifs : PER, Girardin, Pinel+, FCPI/FIP, déficits fonciers, donation-cession, Dutreil. Avantages, limites, profils éligibles.",
    file: "/resources/kanti-defiscalisation-2026.pdf",
    image: imgDefisc,
  },
  {
    id: "transmission-checklist",
    category: "Transmission" as const,
    eyebrow: "Checklist · 6 pages",
    title: "Préparer sa transmission patrimoniale",
    description:
      "Méthode pas-à-pas : inventaire, donation, démembrement, assurance-vie, holding familiale. Les questions à se poser avant 50, 60 et 70 ans.",
    file: "/resources/kanti-transmission-checklist.pdf",
    image: imgTransmission,
  },
  {
    id: "dirigeant-cession",
    category: "Dirigeants" as const,
    eyebrow: "Mémo · 12 pages",
    title: "Le dirigeant face à la cession",
    description:
      "Apport-cession, Dutreil, OBO, holding patrimoniale. Comment structurer en amont pour préserver le fruit de toute une vie d'entreprise.",
    file: "/resources/kanti-dirigeant-cession.pdf",
    image: imgCession,
  },
  {
    id: "immobilier-arbitrage",
    category: "Investir" as const,
    eyebrow: "Étude · 18 pages",
    title: "Immobilier patrimonial : arbitrer en 2026",
    description:
      "Faut-il vendre, conserver, démembrer ? Analyse comparative SCI, SCPI, nue-propriété, LMNP, et impact de la fiscalité 2026.",
    file: "/resources/kanti-immobilier-arbitrage.pdf",
    image: imgImmobilier,
  },
  {
    id: "retraite-cadres",
    category: "Investir" as const,
    eyebrow: "Guide PDF · 20 pages",
    title: "Préparer sa retraite de cadre supérieur",
    description:
      "Reconstituer 70 % de ses revenus à la retraite : PER individuel, PER d'entreprise, Madelin, capitalisation, immobilier locatif. Stratégies par tranche d'âge.",
    file: "/resources/kanti-retraite-cadres.pdf",
    image: imgRetraite,
  },
  {
    id: "assurance-vie-2026",
    category: "Investir" as const,
    eyebrow: "Mémo · 10 pages",
    title: "Assurance-vie : les arbitrages clés 2026",
    description:
      "Fonds euros, unités de compte, gestion pilotée, démembrement de clause bénéficiaire. Comment tirer le meilleur parti du contrat préféré des Français.",
    file: "/resources/kanti-assurance-vie-2026.pdf",
    image: imgAssuranceVie,
  },
  {
    id: "scpi-selection",
    category: "Investir" as const,
    eyebrow: "Étude · 22 pages",
    title: "SCPI : sélectionner sans se tromper",
    description:
      "Notre grille d'analyse en 12 critères : TOF, RAN, capitalisation, géographie, secteurs. Les 8 SCPI que nous suivons en 2026 et celles à éviter.",
    file: "/resources/kanti-scpi-selection.pdf",
    image: imgScpi,
  },
  {
    id: "expatriation-fiscale",
    category: "International" as const,
    eyebrow: "Guide PDF · 28 pages",
    title: "Expatriation : anticiper sa fiscalité",
    description:
      "Exit tax, conventions fiscales, comptes à l'étranger, IFI, retour en France. Le mode d'emploi pour les Français qui s'installent ou reviennent.",
    file: "/resources/kanti-expatriation-fiscale.pdf",
    image: imgExpat,
  },
  {
    id: "ifi-optimisation",
    category: "Fiscalité" as const,
    eyebrow: "Mémo · 8 pages",
    title: "IFI 2026 : les leviers d'optimisation",
    description:
      "Démembrement, dette déductible, nue-propriété de SCPI, foncières non cotées. Réduire son IFI sans dégrader son patrimoine.",
    file: "/resources/kanti-ifi-optimisation.pdf",
    image: imgIfi,
  },
  {
    id: "investissement-responsable",
    category: "Investir" as const,
    eyebrow: "Rapport · 16 pages",
    title: "Investissement responsable & ISR",
    description:
      "Labels ISR, Greenfin, Finansol : décrypter les promesses. Comment construire un portefeuille à impact sans sacrifier la performance.",
    file: "/resources/kanti-investissement-responsable.pdf",
    image: imgIsr,
  },
];

const categories: Category[] = ["Tous", "Fiscalité", "Transmission", "Dirigeants", "Investir", "International"];

const emailSchema = z.object({
  name: z.string().trim().min(2, "Indiquez votre prénom et nom").max(100),
  email: z.string().trim().email("Email invalide").max(255),
});

export default function RessourcesPage() {
  useScrollReveal();
  const navigate = useNavigate();
  const [openId, setOpenId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>("Tous");

  const activeResource = resources.find((r) => r.id === openId);

  const filtered = useMemo(
    () =>
      activeCategory === "Tous"
        ? resources
        : resources.filter((r) => r.category === activeCategory),
    [activeCategory]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    // Mock — front-only. Le back sera branché plus tard.
    console.info("[KANTI mock] Lead magnet request:", {
      ...parsed.data,
      resource: activeResource?.id,
    });
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setOpenId(null);
    navigate("/merci", {
      state: {
        name: parsed.data.name.split(" ")[0],
        subject: "ressource",
        resourceTitle: activeResource?.title,
      },
    });
  };

  return (
    <>
      <Seo
        title="Ressources patrimoniales — guides et études KANTI"
        description="Guides PDF gratuits : défiscalisation 2026, transmission, cession d'entreprise, immobilier patrimonial. Téléchargez les analyses du cabinet KANTI."
      />
      <Header />
      <main id="main">
        <PageHero
          title="Ressources & guides"
          subtitle="Une bibliothèque éditoriale d'études, de mémos et de checklists pour comprendre les enjeux patrimoniaux d'aujourd'hui. 10 publications · Téléchargement gratuit."
          breadcrumb="Cabinet · Ressources"
        />

        <section className="section-padding texture-paper relative overflow-hidden">
          <div className="max-w-6xl mx-auto relative z-10">
            {/* Category filter */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
              <BookOpen className="w-4 h-4 text-[hsl(var(--electric))] mr-2" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-[11px] tracking-[0.2em] uppercase font-medium rounded-full border transition-all ${
                    activeCategory === cat
                      ? "bg-foreground text-background border-foreground"
                      : "bg-transparent text-foreground/60 border-foreground/15 hover:border-foreground/40 hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {filtered.map((r, i) => (
                <motion.article
                  key={r.id}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: i * 0.06 }}
                  className="group glass-float overflow-hidden flex flex-col"
                >
                  {/* Cover image */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={r.image}
                      alt={r.title}
                      width={1024}
                      height={768}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />
                    <span className="absolute top-4 left-4 px-3 py-1 text-[10px] tracking-[0.25em] uppercase font-medium text-background bg-foreground/70 backdrop-blur-sm rounded-full">
                      {r.category}
                    </span>
                  </div>

                  <div className="p-8 md:p-10 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-5">
                      <FileText className="w-4 h-4 text-[hsl(var(--electric))]" />
                      <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/50 font-medium">
                        {r.eyebrow}
                      </p>
                    </div>
                    <h2 className="font-heading text-2xl md:text-3xl font-light text-foreground mb-4 leading-snug tracking-tight">
                      {r.title}
                    </h2>
                    <p className="text-foreground/65 text-sm md:text-base leading-relaxed font-light mb-8 flex-1">
                      {r.description}
                    </p>
                    <button
                      type="button"
                      onClick={() => setOpenId(r.id)}
                      className="self-start inline-flex items-center gap-2.5 text-sm font-medium tracking-wide text-foreground hover:text-[hsl(var(--electric))] transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Télécharger gratuitement
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Modale email — fictive */}
      {activeResource && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Télécharger ${activeResource.title}`}
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => !loading && setOpenId(null)}
        >
          <div
            className="glass-strong rounded-2xl p-7 md:p-9 w-full max-w-md shadow-2xl border border-foreground/10 animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-5">
              <Mail className="w-4 h-4 text-[hsl(var(--electric))]" />
              <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/50 font-medium">
                Recevoir le PDF
              </p>
            </div>
            <h3 className="font-heading text-xl font-light text-foreground mb-2 leading-snug">
              {activeResource.title}
            </h3>
            <p className="text-foreground/60 text-sm font-light leading-relaxed mb-6">
              Indiquez vos coordonnées : nous vous envoyons le document immédiatement.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="lm-name" className="block text-[11px] font-medium text-foreground/60 mb-2 tracking-[0.2em] uppercase">
                  Nom complet
                </label>
                <input
                  id="lm-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  required
                  maxLength={100}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-background/40 border border-foreground/15 rounded-md text-foreground text-sm focus:outline-none focus:border-[hsl(var(--electric))]/60 transition-colors disabled:opacity-50"
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label htmlFor="lm-email" className="block text-[11px] font-medium text-foreground/60 mb-2 tracking-[0.2em] uppercase">
                  Email
                </label>
                <input
                  id="lm-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  required
                  maxLength={255}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-background/40 border border-foreground/15 rounded-md text-foreground text-sm focus:outline-none focus:border-[hsl(var(--electric))]/60 transition-colors disabled:opacity-50"
                  placeholder="votre@email.fr"
                />
              </div>
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpenId(null)}
                  disabled={loading}
                  className="px-4 py-2.5 text-xs font-medium text-foreground/60 hover:text-foreground transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 btn-primary-glass text-xs font-medium tracking-wide reflection-sweep disabled:opacity-60"
                >
                  {loading ? "Envoi…" : "Recevoir le PDF"}
                </button>
              </div>
              <p className="text-[10px] text-foreground/40 font-light leading-relaxed pt-1">
                En soumettant, vous acceptez de recevoir occasionnellement nos analyses. Désinscription en 1 clic.
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}