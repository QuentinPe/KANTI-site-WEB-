import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";

/**
 * Page de confirmation après envoi du formulaire de contact ou
 * inscription à un lead magnet. Ton éditorial, sans bruit.
 */
export default function MerciPage() {
  const { state } = useLocation() as {
    state?: { name?: string; subject?: "contact" | "ressource"; resourceTitle?: string };
  };
  const isResource = state?.subject === "ressource";

  return (
    <>
      <Seo
        title="Merci — votre demande est bien arrivée"
        description="Nous accusons réception de votre demande. Un conseiller KANTI vous recontacte sous 24 heures ouvrées."
        noindex
      />
      <Header />
      <main id="main">
        <section className="section-padding section-glass min-h-[80vh] flex items-center">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-foreground/[0.04] border border-foreground/10 mb-10"
            >
              <svg className="w-8 h-8 text-[hsl(var(--electric))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>

            <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/45 mb-5 font-medium">
              Confirmation
            </p>

            <h1 className="text-4xl md:text-6xl font-heading font-light tracking-tight leading-[1.05] text-foreground mb-7">
              {state?.name ? `Merci ${state.name},` : "Merci."}
              <br />
              <span className="italic text-foreground/65">
                {isResource ? "votre ressource arrive." : "votre demande est bien arrivée."}
              </span>
            </h1>

            <p className="text-base md:text-lg text-foreground/65 font-light leading-relaxed max-w-xl mx-auto mb-12">
              {isResource
                ? `Vous recevrez « ${state?.resourceTitle ?? "votre ressource"} » par email dans quelques minutes. En attendant, explorez nos analyses et nos cas clients.`
                : "Un conseiller KANTI prend connaissance de votre message et vous recontacte sous 24 heures ouvrées. Pour les demandes urgentes, vous pouvez nous joindre directement au 06 63 32 48 09."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="group inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full text-sm font-medium tracking-wide btn-primary-glass reflection-sweep"
              >
                Retour à l'accueil
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                to="/cas-clients"
                className="inline-flex items-center justify-center gap-2 px-2 py-3.5 text-sm font-light text-foreground/70 hover:text-foreground transition-colors"
              >
                <span className="link-underline-light">Découvrir nos cas clients</span>
              </Link>
            </div>

            <div className="mt-16 pt-10 border-t border-foreground/10 grid sm:grid-cols-3 gap-6 text-[11px] tracking-[0.18em] uppercase text-foreground/50">
              <span>Réponse &lt; 24h</span>
              <span>Confidentiel</span>
              <span>Sans engagement</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}