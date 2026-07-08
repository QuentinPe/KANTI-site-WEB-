import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PageCTA from "@/components/PageCTA";
import heroImg from "@/assets/expertise-gestion.jpg";

const phases = [
  {
    num: "01",
    duration: "30 min · gratuit",
    title: "Premier échange",
    text: "Un appel ou un rendez-vous court pour comprendre votre contexte et vérifier la pertinence d'un bilan patrimonial. Aucun engagement, aucune recommandation à ce stade.",
  },
  {
    num: "02",
    duration: "1 à 2 semaines",
    title: "Collecte & analyse",
    text: "Vous nous transmettez vos documents (avis d'imposition, contrats, relevés). Nous reconstituons votre patrimoine global, votre fiscalité sur trois ans et votre couverture prévoyance.",
  },
  {
    num: "03",
    duration: "Restitution 1h30",
    title: "Lettre de recommandations",
    text: "Nous vous présentons un rapport structuré : diagnostic chiffré, enjeux identifiés, scénarios alternatifs simulés et plan d'action priorisé sur 12 à 24 mois.",
  },
  {
    num: "04",
    duration: "À votre rythme",
    title: "Mise en œuvre & suivi",
    text: "Si vous le souhaitez, nous coordonnons la mise en place avec votre notaire, votre expert-comptable et les établissements partenaires. Suivi annuel inclus la première année.",
  },
];

const analyses = [
  { label: "Immobilier", text: "Résidence principale, locatif, SCI, démembrement, SCPI." },
  { label: "Financier", text: "Assurance-vie, PEA, compte-titres, PER, contrats Madelin, livrets." },
  { label: "Passif", text: "Crédits en cours, cautions, engagements personnels et professionnels." },
  { label: "Fiscalité", text: "IR, IFI, revenus fonciers, plus-values, prélèvements sociaux." },
  { label: "Prévoyance", text: "Décès, invalidité, dépendance, perte d'emploi, homme-clé." },
  { label: "Famille", text: "Régime matrimonial, donations, testament, clauses bénéficiaires." },
];

const livrables = [
  "Cartographie complète et chiffrée de votre patrimoine",
  "Analyse fiscale sur trois ans avec marges d'optimisation identifiées",
  "Diagnostic de votre couverture prévoyance et points de vigilance",
  "Simulation successorale chiffrée selon vos dispositions actuelles",
  "Lettre de recommandations argumentée et neutre",
  "Plan d'action priorisé avec calendrier et ordre de grandeur des effets",
];

const profils = [
  { num: "01", titre: "Particuliers", text: "Vous avez constitué un patrimoine et souhaitez le structurer, l'optimiser ou préparer sa transmission de façon ordonnée." },
  { num: "02", titre: "Cadres dirigeants", text: "Revenus élevés, fiscalité lourde, arbitrages complexes entre épargne, immobilier, retraite et capitalisation." },
  { num: "03", titre: "Chefs d'entreprise", text: "Coordination patrimoine personnel et professionnel, préparation d'une cession, optimisation de la rémunération." },
];

export default function BilanPatrimonialPage() {
  useScrollReveal();

  return (
    <>
      <Header />
      <PageHero
        title="Bilan patrimonial"
        highlight="à Bordeaux"
        subtitle="Un diagnostic complet de votre situation patrimoniale : actifs, passifs, fiscalité, prévoyance, régimes matrimoniaux. Pour y voir clair avant de décider."
        breadcrumb="Bilan patrimonial"
        eyebrow="Diagnostic global"
        image={heroImg}
        imageAlt="Bilan patrimonial à Bordeaux, KANTI"
        stats={[
          { value: "360°", label: "Vision patrimoniale" },
          { value: "3 sem.", label: "Durée moyenne" },
          { value: "Écrit", label: "Lettre de recommandations" },
        ]}
      />

      {/* ── 01 · Manifeste éditorial ──────────────────────────── */}
      <section className="section-padding texture-paper">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 reveal">
            <div className="lg:col-span-4 flex lg:flex-col items-baseline lg:items-start gap-4 lg:gap-3">
              <span className="font-heading text-5xl md:text-6xl font-extralight text-foreground/15 tabular-nums leading-none">
                01
              </span>
              <div className="hidden lg:block h-px w-12 bg-foreground/20" />
              <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/55 font-medium">
                Le bilan patrimonial
              </p>
            </div>
            <div className="lg:col-span-8">
              <h2 className="font-heading text-3xl md:text-5xl lg:text-[3.25rem] font-extralight text-foreground tracking-[-0.02em] leading-[1.05] text-balance mb-8">
                Un diagnostic global avant toute décision. Sans produit, sans biais, sans pression.
              </h2>
              <div className="grid md:grid-cols-2 gap-8 lg:gap-12 text-foreground/65 leading-relaxed font-light">
                <p>
                  Le bilan patrimonial n'est pas un produit financier. C'est un exercice d'analyse global qui permet de poser un diagnostic objectif sur l'ensemble de votre situation : ce que vous possédez, ce que vous devez, ce que vous payez en impôts, ce que vous risquez, et ce que vous transmettrez.
                </p>
                <p>
                  Beaucoup viennent nous voir parce que leur patrimoine manque de cohérence : placements ouverts à différentes époques, contrats mal coordonnés, fiscalité subie, succession non préparée. Le bilan est la première étape pour remettre de l'ordre.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 02 · Méthode en 4 phases ──────────────────────────── */}
      <section className="section-padding section-glass">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mb-14 reveal">
            <div className="lg:col-span-4 flex lg:flex-col items-baseline lg:items-start gap-4 lg:gap-3">
              <span className="font-heading text-5xl md:text-6xl font-extralight text-foreground/15 tabular-nums leading-none">
                02
              </span>
              <div className="hidden lg:block h-px w-12 bg-foreground/20" />
              <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/55 font-medium">
                Méthode
              </p>
            </div>
            <div className="lg:col-span-8">
              <h2 className="font-heading text-3xl md:text-5xl font-extralight text-foreground tracking-[-0.02em] leading-[1.05]">
                Quatre phases. Trois semaines en moyenne.
              </h2>
            </div>
          </div>

          <div className="border-t border-foreground/10">
            {phases.map((p, i) => (
              <div
                key={p.num}
                className={`reveal reveal-delay-${Math.min(i + 1, 5)} grid lg:grid-cols-12 gap-6 lg:gap-16 py-10 md:py-12 border-b border-foreground/10`}
              >
                <div className="lg:col-span-2 flex lg:block items-baseline gap-4">
                  <span className="font-heading text-3xl md:text-4xl font-extralight text-foreground tabular-nums leading-none">
                    {p.num}
                  </span>
                </div>
                <div className="lg:col-span-3">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-foreground/45 mb-2">Durée</p>
                  <p className="text-sm text-foreground/75 font-light">{p.duration}</p>
                </div>
                <div className="lg:col-span-7">
                  <h3 className="font-heading text-xl md:text-2xl font-light text-foreground tracking-tight mb-3">{p.title}</h3>
                  <p className="text-foreground/60 leading-relaxed font-light text-[15px]">{p.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 03 · Périmètre + Livrables ─────────────────────────── */}
      <section className="section-padding texture-paper">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Périmètre */}
            <div className="reveal">
              <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/55 font-medium mb-5">
                03 · Périmètre d'analyse
              </p>
              <h3 className="font-heading text-2xl md:text-3xl font-extralight text-foreground tracking-[-0.02em] leading-[1.1] mb-8 text-balance">
                Six dimensions, étudiées en parallèle.
              </h3>
              <div className="border-t border-foreground/10">
                {analyses.map((a, i) => (
                  <div key={a.label} className="grid grid-cols-12 gap-4 py-5 border-b border-foreground/10 items-baseline">
                    <span className="col-span-1 text-[10px] tabular-nums text-foreground/35">0{i + 1}</span>
                    <p className="col-span-3 text-[10px] uppercase tracking-[0.28em] text-foreground/55 font-medium">{a.label}</p>
                    <p className="col-span-8 text-sm text-foreground/65 font-light leading-relaxed">{a.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Livrables */}
            <div className="reveal reveal-delay-2">
              <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/55 font-medium mb-5">
                04 · Ce que vous repartez avec
              </p>
              <h3 className="font-heading text-2xl md:text-3xl font-extralight text-foreground tracking-[-0.02em] leading-[1.1] mb-8 text-balance">
                Un livrable écrit, structuré, qui vous appartient.
              </h3>
              <div className="border-t border-foreground/10">
                {livrables.map((l, i) => (
                  <div key={l} className="flex gap-6 py-5 border-b border-foreground/10 items-baseline">
                    <span className="text-[10px] tabular-nums text-foreground/35 shrink-0 w-6">0{i + 1}</span>
                    <p className="text-sm text-foreground/70 font-light leading-relaxed flex-1">{l}</p>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-foreground/50 mt-6 leading-relaxed font-light">
                Le rapport est neutre et argumenté. Vous pouvez le partager librement avec votre notaire, votre avocat ou votre expert-comptable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 05 · Pour qui ──────────────────────────────────────── */}
      <section className="section-padding section-glass">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mb-14 reveal">
            <div className="lg:col-span-4 flex lg:flex-col items-baseline lg:items-start gap-4 lg:gap-3">
              <span className="font-heading text-5xl md:text-6xl font-extralight text-foreground/15 tabular-nums leading-none">
                05
              </span>
              <div className="hidden lg:block h-px w-12 bg-foreground/20" />
              <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/55 font-medium">
                Pour qui
              </p>
            </div>
            <div className="lg:col-span-8">
              <h2 className="font-heading text-3xl md:text-5xl font-extralight text-foreground tracking-[-0.02em] leading-[1.05] text-balance">
                Trois profils, une même exigence : voir clair.
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-foreground/10 border-y border-foreground/10">
            {profils.map((p, i) => (
              <div
                key={p.titre}
                className={`reveal reveal-delay-${i + 1} bg-background/60 backdrop-blur-sm p-8 md:p-10 group hover:bg-background/90 transition-colors duration-500`}
              >
                <div className="flex items-baseline justify-between mb-8">
                  <span className="font-heading text-4xl md:text-5xl font-extralight text-foreground/20 tabular-nums leading-none">
                    {p.num}
                  </span>
                  <div className="h-px w-10 bg-foreground/20 group-hover:w-16 transition-all duration-500" />
                </div>
                <h3 className="font-heading text-xl md:text-2xl font-light text-foreground tracking-tight mb-3">
                  {p.titre}
                </h3>
                <p className="text-foreground/60 leading-relaxed font-light text-[15px]">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 06 · Engagement / pull quote ──────────────────────── */}
      <section className="section-padding texture-paper">
        <div className="max-w-5xl mx-auto reveal text-center">
          <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/55 font-medium mb-8">
            Notre engagement
          </p>
          <blockquote className="font-heading text-3xl md:text-4xl lg:text-[2.75rem] font-extralight text-foreground tracking-[-0.02em] leading-[1.2] text-balance">
            <span className="text-foreground/30 mr-2">«</span>
            Aucune recommandation lors du premier rendez-vous. Aucun produit maison. Aucune commission cachée. Notre seule rémunération vient de votre décision <em className="italic text-foreground/80">éclairée</em>.
            <span className="text-foreground/30 ml-2">»</span>
          </blockquote>
          <div className="mt-10 inline-flex items-center gap-4">
            <div className="h-px w-10 bg-foreground/30" />
            <p className="text-[11px] uppercase tracking-[0.28em] text-foreground/55 font-medium">
              Cabinet KANTI · Bordeaux
            </p>
            <div className="h-px w-10 bg-foreground/30" />
          </div>
        </div>
      </section>

      <PageCTA
        title="Demandez votre bilan patrimonial"
        subtitle="Un premier échange de 30 minutes pour évaluer ensemble la pertinence d'un bilan patrimonial dans votre situation."
        eyebrow="Bilan patrimonial"
        index="07"
        secondaryText="Découvrir notre méthode"
        secondaryHref="/notre-methode"
      />
      <Footer />
    </>
  );
}
