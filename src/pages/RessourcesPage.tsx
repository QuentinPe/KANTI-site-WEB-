import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { z } from "zod";
import { toast } from "sonner";
import { FileText, Download, Mail, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { getRessources, getDownloadUrl } from "@/lib/ressourcesService";
import heroBg from "@/assets/contact-meeting.jpg";
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

const CATEGORY_IMAGES: Record<string, string> = {
  "Fiscalité": imgDefisc,
  "Transmission": imgTransmission,
  "Dirigeants": imgCession,
  "Investir": imgRetraite,
  "International": imgExpat,
};

interface DisplayResource {
  id: string;
  category: string;
  eyebrow: string;
  title: string;
  description: string;
  storagePath: string;
  image: string;
}

const RESOURCES_FALLBACK: DisplayResource[] = [
  { id: "defiscalisation-2026", category: "Fiscalité", eyebrow: "Guide PDF · 24 pages", title: "10 leviers de défiscalisation 2026", description: "Panorama actualisé des dispositifs : PER, Girardin, Pinel+, FCPI/FIP, déficits fonciers, donation-cession, Dutreil. Avantages, limites, profils éligibles.", storagePath: "/resources/kanti-defiscalisation-2026.pdf", image: imgDefisc },
  { id: "transmission-checklist", category: "Transmission", eyebrow: "Checklist · 6 pages", title: "Préparer sa transmission patrimoniale", description: "Méthode pas-à-pas : inventaire, donation, démembrement, assurance-vie, holding familiale. Les questions à se poser avant 50, 60 et 70 ans.", storagePath: "/resources/kanti-transmission-checklist.pdf", image: imgTransmission },
  { id: "dirigeant-cession", category: "Dirigeants", eyebrow: "Mémo · 12 pages", title: "Le dirigeant face à la cession", description: "Apport-cession, Dutreil, OBO, holding patrimoniale. Comment structurer en amont pour préserver le fruit de toute une vie d'entreprise.", storagePath: "/resources/kanti-dirigeant-cession.pdf", image: imgCession },
  { id: "immobilier-arbitrage", category: "Investir", eyebrow: "Étude · 18 pages", title: "Immobilier patrimonial : arbitrer en 2026", description: "Faut-il vendre, conserver, démembrer ? Analyse comparative SCI, SCPI, nue-propriété, LMNP, et impact de la fiscalité 2026.", storagePath: "/resources/kanti-immobilier-arbitrage.pdf", image: imgImmobilier },
  { id: "retraite-cadres", category: "Investir", eyebrow: "Guide PDF · 20 pages", title: "Préparer sa retraite de cadre supérieur", description: "Reconstituer 70 % de ses revenus à la retraite : PER individuel, PER d'entreprise, Madelin, capitalisation, immobilier locatif. Stratégies par tranche d'âge.", storagePath: "/resources/kanti-retraite-cadres.pdf", image: imgRetraite },
  { id: "assurance-vie-2026", category: "Investir", eyebrow: "Mémo · 10 pages", title: "Assurance-vie : les arbitrages clés 2026", description: "Fonds euros, unités de compte, gestion pilotée, démembrement de clause bénéficiaire. Comment tirer le meilleur parti du contrat préféré des Français.", storagePath: "/resources/kanti-assurance-vie-2026.pdf", image: imgAssuranceVie },
  { id: "scpi-selection", category: "Investir", eyebrow: "Étude · 22 pages", title: "SCPI : sélectionner sans se tromper", description: "Notre grille d'analyse en 12 critères : TOF, RAN, capitalisation, géographie, secteurs. Les 8 SCPI que nous suivons en 2026 et celles à éviter.", storagePath: "/resources/kanti-scpi-selection.pdf", image: imgScpi },
  { id: "expatriation-fiscale", category: "International", eyebrow: "Guide PDF · 28 pages", title: "Expatriation : anticiper sa fiscalité", description: "Exit tax, conventions fiscales, comptes à l'étranger, IFI, retour en France. Le mode d'emploi pour les Français qui s'installent ou reviennent.", storagePath: "/resources/kanti-expatriation-fiscale.pdf", image: imgExpat },
  { id: "ifi-optimisation", category: "Fiscalité", eyebrow: "Mémo · 8 pages", title: "IFI 2026 : les leviers d'optimisation", description: "Démembrement, dette déductible, nue-propriété de SCPI, foncières non cotées. Réduire son IFI sans dégrader son patrimoine.", storagePath: "/resources/kanti-ifi-optimisation.pdf", image: imgIfi },
  { id: "investissement-responsable", category: "Investir", eyebrow: "Rapport · 16 pages", title: "Investissement responsable & ISR", description: "Labels ISR, Greenfin, Finansol : décrypter les promesses. Comment construire un portefeuille à impact sans sacrifier la performance.", storagePath: "/resources/kanti-investissement-responsable.pdf", image: imgIsr },
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

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);

  const { data: dbRessources } = useQuery({ queryKey: ["ressources"], queryFn: getRessources });

  const resources: DisplayResource[] = useMemo(() => {
    if (!dbRessources || dbRessources.length === 0) return RESOURCES_FALLBACK;
    return dbRessources.map((r) => ({
      id: r.id,
      category: r.category,
      eyebrow: r.pages ? `${r.category} · ${r.pages} pages` : r.category,
      title: r.title,
      description: r.description,
      storagePath: r.storage_path,
      image: CATEGORY_IMAGES[r.category] ?? imgDefisc,
    }));
  }, [dbRessources]);

  const activeResource = resources.find((r) => r.id === openId);

  const filtered = useMemo(
    () => activeCategory === "Tous" ? resources : resources.filter((r) => r.category === activeCategory),
    [activeCategory, resources]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    if (!activeResource) return;
    setLoading(true);
    try {
      const fileUrl = await getDownloadUrl(activeResource.storagePath);
      console.info("[KANTI] Lead magnet request:", { ...parsed.data, resource: activeResource.id, fileUrl });
    } catch {
      /* non-blocking */
    }
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setOpenId(null);
    navigate("/merci", { state: { name: parsed.data.name.split(" ")[0], subject: "ressource", resourceTitle: activeResource?.title } });
  };

  return (
    <>
      <Seo
        title="Ressources patrimoniales, guides et études KANTI"
        description="Guides PDF gratuits : défiscalisation 2026, transmission, cession d'entreprise, immobilier patrimonial. Téléchargez les analyses du cabinet KANTI."
      />
      <Header />

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative overflow-hidden" style={{ minHeight: "68vh" }}>
        <motion.div className="absolute inset-0 will-change-transform" style={{ y: imageY, scale: 1.14 }}>
          <img src={heroBg} alt="" aria-hidden className="w-full h-full object-cover object-center" fetchPriority="high" />
        </motion.div>

        <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
          background: "linear-gradient(105deg, hsl(0 0% 100% / 0.98) 0%, hsl(0 0% 100% / 0.92) 28%, hsl(0 0% 100% / 0.60) 52%, hsl(0 0% 100% / 0.08) 70%, transparent 82%)"
        }} />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-36 pointer-events-none" style={{ background: "linear-gradient(to top, hsl(0 0% 100%) 0%, transparent 100%)" }} />

        <div className="relative z-10 flex items-center min-h-[68vh] py-28 lg:py-36">
          <div className="max-w-6xl mx-auto px-8 md:px-14 w-full">
            <div className="max-w-[520px]">

              <motion.div className="flex items-center gap-2 mb-7" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }}>
                <span className="w-5 h-[2px]" style={{ background: "hsl(224 60% 22%)" }} />
                <p className="text-[11px] tracking-[0.32em] uppercase font-medium" style={{ color: "hsl(224 60% 22%)" }}>
                  Bibliothèque · Éclairages
                </p>
              </motion.div>

              <motion.h1 className="font-heading font-light leading-[1.04] tracking-tight mb-6"
                style={{ fontSize: "clamp(2.6rem, 5.5vw, 4rem)", color: "hsl(224 60% 12%)" }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
                Ressources<br />
                <span className="italic" style={{ color: "hsl(224 55% 30%)" }}>& guides.</span>
              </motion.h1>

              <motion.p className="text-[15px] font-light leading-relaxed mb-8"
                style={{ color: "hsl(224 25% 32%)" }}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                Une bibliothèque éditoriale d'études, de mémos et de checklists pour comprendre les enjeux patrimoniaux d'aujourd'hui.
              </motion.p>

              <motion.p className="text-[12px] font-light tracking-wide"
                style={{ color: "hsl(224 18% 55%)" }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }}>
                {resources.length} publications · Téléchargement gratuit
              </motion.p>

            </div>
          </div>
        </div>
      </section>

      {/* ── Grille ressources ── */}
      <section className="bg-white py-16 md:py-20 pb-24 md:pb-32">
        <div className="max-w-6xl mx-auto px-8 md:px-14">

          {/* En-tête + pills */}
          <div className="mb-10 reveal">
            <div className="electric-line mb-5" />
            <p className="text-[11px] tracking-[0.3em] uppercase font-medium mb-3" style={{ color: "hsl(224 25% 50%)" }}>
              Toutes les publications
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-light tracking-tight leading-[1.05] mb-8" style={{ color: "hsl(224 55% 12%)" }}>
              Explorer par <span className="italic" style={{ color: "hsl(224 25% 40%)" }}>thématique</span>
            </h2>

            {/* Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <BookOpen className="w-4 h-4 mr-1" style={{ color: "hsl(224 40% 40%)" }} />
              {categories.map((cat) => {
                const active = activeCategory === cat;
                return (
                  <button key={cat} type="button" onClick={() => setActiveCategory(cat)}
                    className="px-4 py-2 rounded-full text-[12px] font-medium tracking-wide transition-all duration-200"
                    style={{
                      background: active ? "hsl(224 60% 18%)" : "transparent",
                      color: active ? "white" : "hsl(224 25% 40%)",
                      border: `1px solid ${active ? "hsl(224 60% 18%)" : "hsl(224 20% 12% / 0.18)"}`,
                      boxShadow: active ? "0 4px 12px -4px hsl(224 60% 18% / 0.30)" : "none",
                    }}>
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grille */}
          <div className="grid md:grid-cols-2 gap-5 lg:gap-6">
            {filtered.map((r, i) => (
              <motion.article key={r.id} layout
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="group flex flex-col rounded-[18px] overflow-hidden transition-all duration-400 hover:-translate-y-1"
                style={{ background: "white", border: "1px solid hsl(224 20% 12% / 0.07)", boxShadow: "0 2px 12px -4px hsl(224 60% 12% / 0.06)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 48px -12px hsl(224 60% 12% / 0.13)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px -4px hsl(224 60% 12% / 0.06)"; }}>
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={r.image} alt={r.title} width={1024} height={640} loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, hsl(224 60% 8% / 0.30) 0%, transparent 60%)" }} />
                  <span className="absolute top-4 left-4 px-3 py-1 text-[10px] tracking-[0.25em] uppercase font-medium text-white rounded-full"
                    style={{ background: "hsl(224 60% 16% / 0.82)", backdropFilter: "blur(10px)" }}>
                    {r.category}
                  </span>
                </div>

                {/* Contenu */}
                <div className="p-7 md:p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-4 h-4" strokeWidth={1.5} style={{ color: "hsl(224 40% 45%)" }} />
                    <p className="text-[10px] tracking-[0.3em] uppercase font-medium" style={{ color: "hsl(224 20% 55%)" }}>{r.eyebrow}</p>
                  </div>
                  <h2 className="font-heading text-xl md:text-2xl font-light mb-4 leading-snug tracking-tight" style={{ color: "hsl(224 55% 12%)" }}>
                    {r.title}
                  </h2>
                  <p className="text-sm md:text-[15px] leading-relaxed font-light mb-8 flex-1" style={{ color: "hsl(224 12% 44%)" }}>
                    {r.description}
                  </p>
                  <button type="button" onClick={() => setOpenId(r.id)}
                    className="self-start inline-flex items-center gap-2.5 text-sm font-medium tracking-wide transition-colors duration-300"
                    style={{ color: "hsl(224 50% 28%)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "hsl(224 60% 18%)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "hsl(224 50% 28%)"; }}>
                    <Download className="w-4 h-4" strokeWidth={1.5} />
                    Télécharger gratuitement
                  </button>
                </div>
              </motion.article>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center py-16 text-[14px] font-light" style={{ color: "hsl(224 12% 55%)" }}>
              Aucune ressource dans cette catégorie pour le moment.
            </p>
          )}

        </div>
      </section>

      <Footer />

      {/* ── Modale email ── */}
      {activeResource && (
        <div role="dialog" aria-modal="true" aria-label={`Télécharger ${activeResource.title}`}
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 animate-in fade-in duration-300"
          style={{ background: "hsl(224 40% 8% / 0.45)", backdropFilter: "blur(8px)" }}
          onClick={() => !loading && setOpenId(null)}>
          <div className="rounded-[22px] p-7 md:p-9 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300"
            style={{ background: "hsl(0 0% 100% / 0.94)", backdropFilter: "blur(36px) saturate(160%)", border: "1px solid hsl(224 20% 12% / 0.10)", boxShadow: "0 32px 80px -20px hsl(224 60% 12% / 0.25)" }}
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-5">
              <Mail className="w-4 h-4" strokeWidth={1.5} style={{ color: "hsl(224 45% 35%)" }} />
              <p className="text-[10px] tracking-[0.3em] uppercase font-medium" style={{ color: "hsl(224 25% 50%)" }}>Recevoir le PDF</p>
            </div>
            <h3 className="font-heading text-xl font-light mb-2 leading-snug" style={{ color: "hsl(224 55% 12%)" }}>{activeResource.title}</h3>
            <p className="text-sm font-light leading-relaxed mb-6" style={{ color: "hsl(224 15% 45%)" }}>
              Indiquez vos coordonnées : nous vous envoyons le document immédiatement.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="lm-name" className="block text-[11px] font-medium mb-2 tracking-[0.2em] uppercase" style={{ color: "hsl(224 20% 50%)" }}>Nom complet</label>
                <input id="lm-name" type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  required maxLength={100} disabled={loading} placeholder="Votre nom"
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors disabled:opacity-50"
                  style={{ background: "hsl(224 20% 97%)", border: "1px solid hsl(224 20% 12% / 0.14)", color: "hsl(224 55% 12%)" }} />
              </div>
              <div>
                <label htmlFor="lm-email" className="block text-[11px] font-medium mb-2 tracking-[0.2em] uppercase" style={{ color: "hsl(224 20% 50%)" }}>Email</label>
                <input id="lm-email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  required maxLength={255} disabled={loading} placeholder="votre@email.fr"
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors disabled:opacity-50"
                  style={{ background: "hsl(224 20% 97%)", border: "1px solid hsl(224 20% 12% / 0.14)", color: "hsl(224 55% 12%)" }} />
              </div>
              <div className="flex items-center justify-between gap-3 pt-2">
                <button type="button" onClick={() => setOpenId(null)} disabled={loading}
                  className="px-4 py-2.5 text-xs font-medium transition-colors"
                  style={{ color: "hsl(224 15% 55%)" }}>
                  Annuler
                </button>
                <button type="submit" disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium tracking-wide text-white transition-all disabled:opacity-60"
                  style={{ background: "hsl(224 60% 18%)", boxShadow: "0 4px 12px -4px hsl(224 60% 18% / 0.35)" }}>
                  {loading ? "Envoi…" : "Recevoir le PDF"}
                </button>
              </div>
              <p className="text-[10px] font-light leading-relaxed pt-1" style={{ color: "hsl(224 12% 60%)" }}>
                En soumettant, vous acceptez de recevoir occasionnellement nos analyses. Désinscription en 1 clic.
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
