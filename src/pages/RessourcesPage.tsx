import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import { toast } from "sonner";
import { FileText, Download, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Seo from "@/components/Seo";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const resources = [
  {
    id: "defiscalisation-2026",
    eyebrow: "Guide PDF · 24 pages",
    title: "10 leviers de défiscalisation 2026",
    description:
      "Panorama actualisé des dispositifs : PER, Girardin, Pinel+, FCPI/FIP, déficits fonciers, donation-cession, Dutreil. Avantages, limites, profils éligibles.",
    file: "/resources/kanti-defiscalisation-2026.pdf",
  },
  {
    id: "transmission-checklist",
    eyebrow: "Checklist · 6 pages",
    title: "Préparer sa transmission patrimoniale",
    description:
      "Méthode pas-à-pas : inventaire, donation, démembrement, assurance-vie, holding familiale. Les questions à se poser avant 50, 60 et 70 ans.",
    file: "/resources/kanti-transmission-checklist.pdf",
  },
  {
    id: "dirigeant-cession",
    eyebrow: "Mémo · 12 pages",
    title: "Le dirigeant face à la cession",
    description:
      "Apport-cession, Dutreil, OBO, holding patrimoniale. Comment structurer en amont pour préserver le fruit de toute une vie d'entreprise.",
    file: "/resources/kanti-dirigeant-cession.pdf",
  },
  {
    id: "immobilier-arbitrage",
    eyebrow: "Étude · 18 pages",
    title: "Immobilier patrimonial : arbitrer en 2026",
    description:
      "Faut-il vendre, conserver, démembrer ? Analyse comparative SCI, SCPI, nue-propriété, LMNP, et impact de la fiscalité 2026.",
    file: "/resources/kanti-immobilier-arbitrage.pdf",
  },
];

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

  const activeResource = resources.find((r) => r.id === openId);

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
          subtitle="Une bibliothèque éditoriale d'études, de mémos et de checklists pour comprendre les enjeux patrimoniaux d'aujourd'hui. Téléchargement gratuit."
          breadcrumb="Cabinet · Ressources"
        />

        <section className="section-padding texture-paper relative overflow-hidden">
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="grid md:grid-cols-2 gap-5">
              {resources.map((r, i) => (
                <motion.article
                  key={r.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: i * 0.06 }}
                  className="group glass-float p-8 md:p-10 flex flex-col"
                >
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