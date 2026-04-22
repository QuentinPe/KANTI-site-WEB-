import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Seo from "@/components/Seo";
import {
  RISK_QUESTIONS,
  RISK_SECTIONS,
  computeSri,
  type SriProfile,
  type RiskSection,
} from "@/data/profilRisqueQuestions";

type Phase = "intro" | "quiz" | "result";

/** Réponse d'une question : numérique scorée OU saisie libre (string). */
type AnswerValue = number | string;

const KANTI_INFO = {
  name: "KANTI",
  baseline: "Cabinet de gestion de patrimoine indépendant",
  address: "12 Cours de l'Intendance — 33000 Bordeaux",
  phone: "05 56 00 00 00",
  email: "contact@kanti.fr",
  legal:
    "KANTI — CIF inscrit auprès de l'AMF, membre de la CNCGP. Le présent document est un outil pédagogique d'auto-évaluation et ne constitue pas une recommandation personnalisée d'investissement au sens de l'article L.541-1 du Code monétaire et financier.",
};

export default function ProfilRisquePage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});

  const total = RISK_QUESTIONS.length;
  const current = RISK_QUESTIONS[step];
  const progress = useMemo(
    () => Math.round((Object.keys(answers).length / total) * 100),
    [answers, total],
  );
  // Pour le SRI on ne garde que les valeurs numériques scorées.
  const profile = useMemo(() => {
    const numeric: Record<string, number> = {};
    Object.entries(answers).forEach(([k, v]) => {
      if (typeof v === "number") numeric[k] = v;
    });
    return computeSri(numeric);
  }, [answers]);

  const goNext = () => {
    if (step < total - 1) setStep((s) => s + 1);
    else setPhase("result");
  };

  const handleSelect = (qid: string, score: number) => {
    setAnswers((p) => ({ ...p, [qid]: score }));
    setTimeout(goNext, 220);
  };

  const handleNumber = (qid: string, value: string) => {
    setAnswers((p) => ({ ...p, [qid]: value }));
  };

  const handleReset = () => {
    setAnswers({});
    setStep(0);
    setPhase("intro");
  };

  return (
    <>
      <Seo
        title="Définir son profil de risque — Questionnaire AMF | KANTI"
        description="Évaluez votre profil investisseur et obtenez votre indicateur synthétique de risque (SRI) sur une échelle de 1 à 7. Questionnaire conforme aux exigences AMF, export PDF instantané."
      />
      <Header />
      <main id="main">
        <PageHero
          breadcrumb="Profil de risque"
          eyebrow="Outil patrimonial"
          title="Définir votre"
          highlight="profil de risque."
          subtitle="Un questionnaire conforme aux exigences AMF pour évaluer votre tolérance au risque et obtenir votre indicateur SRI sur 7."
          stats={[
            { value: `${total}`, label: "Questions" },
            { value: "1 → 7", label: "Échelle SRI" },
            { value: "PDF", label: "Export instantané" },
          ]}
        />

        <section className="section-padding relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-20 right-[5%] w-[420px] h-[420px] rounded-full pointer-events-none opacity-50"
            style={{
              background:
                "radial-gradient(circle, hsl(210 100% 60% / 0.14) 0%, transparent 70%)",
              filter: "blur(70px)",
            }}
          />

          <div className="max-w-4xl mx-auto relative z-10">
            <AnimatePresence mode="wait">
              {phase === "intro" && (
                <Intro key="intro" onStart={() => setPhase("quiz")} total={total} />
              )}

              {phase === "quiz" && current && (
                <motion.div
                  key={`q-${current.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-[2rem] glass-strong p-8 lg:p-12"
                >
                  {/* Progress */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] tracking-[0.32em] uppercase text-[hsl(var(--electric))] font-semibold">
                      {current.section}
                    </span>
                    <span className="text-[11px] text-foreground/50 tabular-nums">
                      {step + 1} / {total} · {progress}%
                    </span>
                  </div>
                  <p className="text-[11px] tracking-[0.2em] uppercase text-foreground/45 mb-6">
                    {current.dimension}
                  </p>
                  <div className="h-[2px] w-full bg-foreground/10 rounded-full mb-10 overflow-hidden">
                    <motion.div
                      className="h-full"
                      style={{
                        background:
                          "linear-gradient(90deg, hsl(var(--electric)), hsl(var(--gold)))",
                      }}
                      initial={false}
                      animate={{ width: `${((step + 1) / total) * 100}%` }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>

                  <h2 className="font-heading text-2xl lg:text-3xl font-light text-foreground tracking-tight leading-snug mb-3 text-balance">
                    {current.question}
                  </h2>
                  {current.helper && (
                    <p className="text-foreground/55 text-sm font-light mb-8">
                      {current.helper}
                    </p>
                  )}

                  {current.type === "number" ? (
                    <div className="mt-8">
                      <div className="flex items-center gap-3 p-2 pl-5 rounded-[1.25rem] border border-foreground/10 bg-white/55 focus-within:border-[hsl(var(--electric))] focus-within:bg-white/80 transition">
                        <input
                          type="number"
                          inputMode="numeric"
                          min={current.numberConfig?.min}
                          max={current.numberConfig?.max}
                          step={current.numberConfig?.step}
                          placeholder={current.numberConfig?.placeholder}
                          value={(answers[current.id] as string | undefined) ?? ""}
                          onChange={(e) => handleNumber(current.id, e.target.value)}
                          className="flex-1 bg-transparent outline-none text-foreground text-2xl font-light tabular-nums placeholder:text-foreground/30 py-3"
                        />
                        {current.numberConfig?.suffix && (
                          <span className="px-4 text-foreground/55 text-sm tracking-wide">
                            {current.numberConfig.suffix}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={goNext}
                          className="px-5 py-2.5 rounded-full bg-[hsl(var(--navy-deep))] text-white text-sm tracking-wide hover:-translate-y-0.5 transition-transform"
                        >
                          Continuer →
                        </button>
                      </div>
                      <p className="mt-3 text-[11px] text-foreground/45">
                        Cette donnée est reportée dans votre fiche PDF mais n'influence pas le calcul du SRI.
                      </p>
                    </div>
                  ) : (
                    <ul className="space-y-3 mt-8">
                      {current.options?.map((opt, i) => {
                        const selected = answers[current.id] === opt.score;
                        return (
                          <li key={`${current.id}-${i}`}>
                            <button
                              type="button"
                              onClick={() => handleSelect(current.id, opt.score)}
                              className={`group w-full text-left flex items-center gap-4 p-5 rounded-[1.25rem] border transition-all duration-300 ${
                                selected
                                  ? "border-[hsl(var(--electric))] bg-[hsl(var(--electric)/0.06)] shadow-[0_8px_24px_-8px_hsl(var(--electric)/0.25)]"
                                  : "border-foreground/[0.08] bg-white/45 hover:border-foreground/20 hover:bg-white/65"
                              }`}
                            >
                              <span
                                className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center transition ${
                                  selected
                                    ? "border-[hsl(var(--electric))] bg-[hsl(var(--electric))]"
                                    : "border-foreground/30 group-hover:border-foreground/60"
                                }`}
                              >
                                {selected && (
                                  <span className="w-2 h-2 rounded-full bg-white" />
                                )}
                              </span>
                              <span className="text-foreground/85 text-[15px] font-light leading-snug">
                                {opt.label}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  <div className="flex items-center justify-between mt-10 pt-6 border-t border-foreground/10">
                    <button
                      type="button"
                      disabled={step === 0}
                      onClick={() => setStep((s) => Math.max(0, s - 1))}
                      className="text-sm text-foreground/55 hover:text-foreground transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      ← Précédent
                    </button>
                    <span className="text-[11px] text-foreground/40 tracking-wide">
                      Choisissez la réponse qui vous correspond le mieux
                    </span>
                  </div>
                </motion.div>
              )}

              {phase === "result" && (
                <ResultView
                  key="result"
                  profile={profile}
                  answers={answers}
                  onReset={handleReset}
                />
              )}
            </AnimatePresence>

            {/* Legal footer */}
            <p className="mt-10 text-[11px] text-foreground/45 leading-relaxed font-light text-center max-w-2xl mx-auto">
              {KANTI_INFO.legal}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

/* ───────────────── INTRO ───────────────── */
function Intro({ onStart, total }: { onStart: () => void; total: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="rounded-[2rem] glass-strong p-8 lg:p-12 text-center"
    >
      <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-5 font-medium">
        Avant de commencer
      </p>
      <h2 className="font-heading text-3xl lg:text-4xl font-light text-foreground mb-6 tracking-tight leading-snug">
        Un questionnaire <span className="italic text-foreground/70">en {total} étapes</span>
      </h2>
      <p className="text-foreground/65 text-base lg:text-lg font-light leading-relaxed max-w-xl mx-auto mb-10">
        Ce test couvre vos connaissances financières, votre expérience, votre
        situation, vos objectifs et votre tolérance au risque. Il ne remplace
        pas un entretien de conseil mais constitue une première base d'échange
        rigoureuse.
      </p>

      <div className="grid sm:grid-cols-3 gap-4 mb-10 max-w-xl mx-auto">
        {[
          { v: "~ 4 min", l: "Durée" },
          { v: "Conforme", l: "Cadre AMF" },
          { v: "Anonyme", l: "Sans inscription" },
        ].map((t) => (
          <div
            key={t.l}
            className="rounded-[1.25rem] border border-foreground/10 bg-white/55 p-5"
          >
            <div className="font-heading text-xl font-light text-foreground">
              {t.v}
            </div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-foreground/50 mt-1.5">
              {t.l}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onStart}
        data-magnetic
        className="group inline-flex items-center gap-3 pl-8 pr-2.5 py-2.5 rounded-full bg-[hsl(var(--navy-deep))] text-white text-sm font-medium tracking-wide reflection-sweep shadow-xl hover:-translate-y-0.5 transition-transform duration-300"
      >
        <span>Commencer le questionnaire</span>
        <span className="w-9 h-9 rounded-full bg-white text-[hsl(var(--navy-deep))] flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </span>
      </button>
    </motion.div>
  );
}

/* ───────────────── RESULT ───────────────── */
function ResultView({
  profile,
  answers,
  onReset,
}: {
  profile: SriProfile;
  answers: Record<string, AnswerValue>;
  onReset: () => void;
}) {
  const handleDownload = () => generatePdf(profile, answers);
  const handleSend = () => {
    // Future intégration : envoi vers une edge function / mailer KANTI.
    // Pour l'instant on confirme le téléchargement et on ouvre un mailto.
    generatePdf(profile, answers);
    const subject = encodeURIComponent(
      `Profil de risque — SRI ${profile.sri}/7 (${profile.shortLabel})`,
    );
    const body = encodeURIComponent(
      "Bonjour,\n\nVeuillez trouver ci-joint ma fiche profil de risque générée sur le site KANTI.\n\nCordialement.",
    );
    window.location.href = `mailto:${KANTI_INFO.email}?subject=${subject}&body=${body}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Score panel */}
      <div className="rounded-[2rem] glass-strong p-8 lg:p-12">
        <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-4 font-medium">
          Votre indicateur synthétique de risque
        </p>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div>
            <div className="font-heading text-7xl lg:text-8xl font-light text-foreground tracking-tight leading-none">
              {profile.sri}
              <span className="text-foreground/30 text-4xl lg:text-5xl"> / 7</span>
            </div>
            <h3 className="mt-4 font-heading text-2xl lg:text-3xl font-light text-foreground tracking-tight">
              {profile.label}
            </h3>
          </div>
          <span className="self-start lg:self-auto inline-flex items-center px-4 py-1.5 rounded-full bg-[hsl(var(--electric)/0.1)] text-[hsl(var(--electric))] text-[11px] tracking-[0.2em] uppercase font-medium">
            {profile.shortLabel}
          </span>
        </div>

        {/* SRI scale visual */}
        <div className="flex items-end gap-1.5 mb-3">
          {[1, 2, 3, 4, 5, 6, 7].map((n) => {
            const isActive = n === profile.sri;
            return (
              <div key={n} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-md transition-all"
                  style={{
                    height: `${24 + n * 10}px`,
                    background: isActive
                      ? "linear-gradient(180deg, hsl(var(--electric)), hsl(var(--navy-deep)))"
                      : `hsl(218 25% ${78 - n * 4}% / 0.5)`,
                    boxShadow: isActive
                      ? "0 0 0 1px hsl(var(--electric) / 0.5), 0 12px 30px -10px hsl(var(--electric) / 0.4)"
                      : "inset 0 1px 0 hsl(0 0% 100% / 0.25)",
                  }}
                />
                <span
                  className={`text-[10px] tabular-nums ${
                    isActive
                      ? "text-foreground font-semibold"
                      : "text-foreground/45"
                  }`}
                >
                  {n}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-8">
          <span>Très faible</span>
          <span>Très élevé</span>
        </div>

        <div className="separator-fine mb-8" />

        <p className="text-foreground/75 text-base lg:text-lg font-light leading-relaxed max-w-2xl">
          {profile.description}
        </p>
      </div>

      {/* Recommendations */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="rounded-[2rem] border border-foreground/10 bg-white/65 backdrop-blur p-7 lg:p-8">
          <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-5 font-medium">
            Recommandations générales
          </p>
          <ul className="space-y-3.5">
            {profile.recommendations.map((r, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-foreground/80 text-[15px] font-light leading-snug"
              >
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[hsl(var(--electric))] flex-shrink-0" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[2rem] border border-foreground/10 bg-white/65 backdrop-blur p-7 lg:p-8">
          <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-5 font-medium">
            Points de vigilance
          </p>
          <ul className="space-y-3.5">
            {profile.cautions.map((r, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-foreground/80 text-[15px] font-light leading-snug"
              >
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[hsl(var(--gold))] flex-shrink-0" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 justify-center pt-2">
        <button
          type="button"
          onClick={handleDownload}
          data-magnetic
          className="group inline-flex items-center gap-3 pl-8 pr-2.5 py-2.5 rounded-full bg-[hsl(var(--navy-deep))] text-white text-sm font-medium tracking-wide reflection-sweep shadow-xl hover:-translate-y-0.5 transition-transform duration-300"
        >
          <span>Télécharger ma fiche PDF</span>
          <span className="w-9 h-9 rounded-full bg-white text-[hsl(var(--navy-deep))] flex items-center justify-center transition-transform duration-300 group-hover:translate-y-0.5">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"
              />
            </svg>
          </span>
        </button>
        <button
          type="button"
          onClick={handleSend}
          className="group inline-flex items-center gap-3 pl-8 pr-2.5 py-2.5 rounded-full border border-foreground/20 text-foreground text-sm font-medium tracking-wide hover:bg-foreground/5 transition"
        >
          <span>Envoyer à KANTI</span>
          <span className="w-9 h-9 rounded-full bg-[hsl(var(--electric))] text-white flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25l7.5 7.5 7.5-7.5M3.75 18.75l7.5-7.5 7.5 7.5" />
            </svg>
          </span>
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-7 py-3 text-sm text-foreground/60 hover:text-foreground transition"
        >
          Refaire le test
        </button>
      </div>
    </motion.div>
  );
}

/* ───────────────── PDF GENERATION ───────────────── */
function generatePdf(
  profile: SriProfile,
  answers: Record<string, AnswerValue>,
) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 56;

  // Brand colors (approximations RGB of HSL navy/electric tokens)
  const NAVY: [number, number, number] = [12, 22, 50];
  const NAVY_LIGHT: [number, number, number] = [60, 75, 110];
  const ELECTRIC: [number, number, number] = [54, 96, 162];
  const GOLD: [number, number, number] = [120, 140, 175];
  const GREY: [number, number, number] = [120, 125, 135];
  const INK: [number, number, number] = [40, 45, 60];
  const STONE: [number, number, number] = [232, 234, 240];
  const STONE_LIGHT: [number, number, number] = [245, 246, 250];

  const today = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  /* ════════════════════════════════════════════
     PAGE 1 — COUVERTURE PLEINE PAGE
     ════════════════════════════════════════════ */

  // Fond navy plein
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, W, H, "F");

  // Motif décoratif : grandes courbes dorées/électriques (cercles concentriques en bas-droite)
  for (let i = 0; i < 6; i++) {
    doc.setDrawColor(54 + i * 6, 96 + i * 4, 162);
    doc.setLineWidth(0.4);
    doc.circle(W - 40, H - 60, 110 + i * 38, "S");
  }
  // Cercle doux en haut-gauche
  doc.setFillColor(28, 44, 86);
  doc.circle(-20, -20, 220, "F");

  // Filet doré horizontal
  doc.setDrawColor(...ELECTRIC);
  doc.setLineWidth(1.2);
  doc.line(M, 130, M + 70, 130);

  // Logo KANTI (texte large, lettrage espacé)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(34);
  doc.setTextColor(255);
  doc.text("K A N T I", M, 110);

  // Baseline
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(180, 195, 225);
  doc.text(KANTI_INFO.baseline.toUpperCase(), M, 152);

  // Bloc titre principal (centré verticalement)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(150, 175, 220);
  doc.text("RAPPORT CONFIDENTIEL", M, H / 2 - 80);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(40);
  doc.setTextColor(255);
  doc.text("Profil", M, H / 2 - 30);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(220, 230, 250);
  doc.text("d'investisseur", M, H / 2 + 14);

  // Filet de séparation
  doc.setDrawColor(...ELECTRIC);
  doc.setLineWidth(0.8);
  doc.line(M, H / 2 + 40, M + 240, H / 2 + 40);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(200, 215, 240);
  const introLines = doc.splitTextToSize(
    "Évaluation personnalisée de votre tolérance au risque, conforme aux exigences de l'Autorité des Marchés Financiers. Indicateur synthétique de risque (SRI) sur une échelle de 1 à 7.",
    W - M * 2 - 60,
  );
  doc.text(introLines, M, H / 2 + 64);

  // Encart résumé bas de page : SRI + profil
  const cardY = H - 230;
  doc.setFillColor(255);
  doc.roundedRect(M, cardY, W - M * 2, 130, 8, 8, "F");
  // Bord doré électrique
  doc.setDrawColor(...ELECTRIC);
  doc.setLineWidth(2.5);
  doc.line(M, cardY, M + 60, cardY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...GREY);
  doc.text("VOTRE INDICATEUR SRI", M + 24, cardY + 28);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(64);
  doc.setTextColor(...NAVY);
  doc.text(`${profile.sri}`, M + 24, cardY + 92);
  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...NAVY_LIGHT);
  doc.text("/ 7", M + 84, cardY + 92);

  // Profil label dans la carte
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(...NAVY);
  doc.text(profile.label, M + 160, cardY + 60);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...ELECTRIC);
  doc.text(profile.shortLabel.toUpperCase(), M + 160, cardY + 78);

  // Mini date / référence dans la carte
  doc.setFontSize(8);
  doc.setTextColor(...GREY);
  doc.text(`Édité le ${today}`, W - M - 24, cardY + 28, { align: "right" });
  doc.text(
    `Réf. KANTI-PR-${Date.now().toString().slice(-6)}`,
    W - M - 24,
    cardY + 42,
    { align: "right" },
  );

  // Footer cover
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(160, 175, 205);
  doc.text(KANTI_INFO.address, M, H - 50);
  doc.text(`${KANTI_INFO.phone}  ·  ${KANTI_INFO.email}`, M, H - 36);
  doc.text("Document pédagogique — cadre AMF", W - M, H - 36, { align: "right" });

  /* ════════════════════════════════════════════
     PAGE 2 — SYNTHÈSE DU PROFIL
     ════════════════════════════════════════════ */
  doc.addPage();
  drawPageHeader(doc, W, M, NAVY, GREY, ELECTRIC, "Synthèse du profil", today);

  let y = 150;
  doc.setTextColor(...NAVY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...GREY);
  doc.text("QUESTIONNAIRE PROFIL DE RISQUE", M, y);
  y += 26;
  doc.setFontSize(30);
  doc.setTextColor(...NAVY);
  doc.text("Votre profil investisseur", M, y);
  y += 20;
  doc.setFontSize(11);
  doc.setTextColor(...GREY);
  doc.text(
    "Indicateur synthétique de risque (SRI) calculé sur la base de vos réponses.",
    M,
    y,
  );

  // Score panel — encart aéré
  y += 30;
  doc.setFillColor(...STONE_LIGHT);
  doc.roundedRect(M, y, W - M * 2, 170, 10, 10, "F");

  // Big score
  doc.setTextColor(...NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(72);
  doc.text(`${profile.sri}`, M + 28, y + 90);
  doc.setFontSize(20);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...NAVY_LIGHT);
  doc.text("/ 7", M + 110, y + 90);

  // Profil label
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...NAVY);
  doc.text(profile.label, M + 180, y + 50);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...ELECTRIC);
  doc.text(profile.shortLabel.toUpperCase(), M + 180, y + 68);

  // SRI scale bars within the panel
  const barsY = y + 110;
  const barsW = W - M * 2 - 56;
  const barW = barsW / 7 - 5;
  for (let i = 1; i <= 7; i++) {
    const x = M + 28 + (i - 1) * (barW + 5);
    const h = 10 + i * 4;
    if (i === profile.sri) {
      doc.setFillColor(...ELECTRIC);
    } else {
      doc.setFillColor(218 - i * 4, 222 - i * 3, 232 - i * 3);
    }
    doc.roundedRect(x, barsY + (40 - h), barW, h, 2, 2, "F");
    doc.setFontSize(8);
    doc.setTextColor(...(i === profile.sri ? NAVY : GREY));
    doc.text(`${i}`, x + barW / 2, barsY + 52, { align: "center" });
  }
  doc.setFontSize(7);
  doc.setTextColor(...GREY);
  doc.text("SÉCURITAIRE", M + 28, barsY + 64);
  doc.text("OFFENSIF", W - M - 28, barsY + 64, { align: "right" });

  // Lecture du profil
  y += 200;
  y = drawSectionTitle(doc, y, "LECTURE DU PROFIL", M, NAVY, ELECTRIC);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(...INK);
  const desc = doc.splitTextToSize(profile.description, W - M * 2);
  doc.text(desc, M, y);
  y += desc.length * 14 + 24;

  // Recommandations + Vigilance (page 2 si nécessaire)
  y = ensureSpace(doc, y, 200, M, H);
  y = drawBulletSection(doc, y, "RECOMMANDATIONS GÉNÉRALES", profile.recommendations, ELECTRIC, M, W, H, NAVY, INK);
  y = ensureSpace(doc, y + 18, 160, M, H);
  y = drawBulletSection(doc, y, "POINTS DE VIGILANCE", profile.cautions, GOLD, M, W, H, NAVY, INK);

  /* ════════════════════════════════════════════
     PAGES SUIVANTES — DÉTAIL DES RÉPONSES PAR SECTION
     ════════════════════════════════════════════ */
  doc.addPage();
  y = 90;
  doc.setTextColor(...NAVY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...GREY);
  doc.text("DÉTAIL DU QUESTIONNAIRE", M, y);
  y += 26;
  doc.setFontSize(24);
  doc.setTextColor(...NAVY);
  doc.text("Vos réponses", M, y);
  y += 14;
  doc.setFontSize(10);
  doc.setTextColor(...GREY);
  doc.text(
    "Récapitulatif structuré, conservé pour traçabilité de l'évaluation.",
    M,
    y,
  );
  y += 28;

  RISK_SECTIONS.forEach((section) => {
    y = ensureSpace(doc, y, 70, M, H);
    // Section header
    doc.setFillColor(...NAVY);
    doc.rect(M, y, 4, 14, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...NAVY);
    doc.text(section.toUpperCase(), M + 12, y + 11);
    y += 22;
    doc.setDrawColor(...STONE);
    doc.setLineWidth(0.5);
    doc.line(M, y, W - M, y);
    y += 18;

    const sectionQuestions = RISK_QUESTIONS.filter((q) => q.section === section);
    sectionQuestions.forEach((q, idx) => {
      y = ensureSpace(doc, y, 60, M, H);

      // dimension chip
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(...ELECTRIC);
      doc.text(q.dimension.toUpperCase(), M, y);
      y += 10;

      // question
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...NAVY);
      const qText = doc.splitTextToSize(`${idx + 1}. ${q.question}`, W - M * 2);
      doc.text(qText, M, y);
      y += qText.length * 12 + 4;

      // answer
      const raw = answers[q.id];
      let answerLabel = "Non renseigné";
      if (q.type === "number") {
        if (typeof raw === "string" && raw.trim() !== "") {
          answerLabel = `${raw}${q.numberConfig?.suffix ? " " + q.numberConfig.suffix : ""}`;
        }
      } else if (typeof raw === "number") {
        const opt = q.options?.find((o) => o.score === raw);
        answerLabel = opt?.label ?? "—";
      }

      // bandeau réponse
      const aLines = doc.splitTextToSize("→  " + answerLabel, W - M * 2 - 20);
      const aH = aLines.length * 12 + 10;
      doc.setFillColor(...STONE_LIGHT);
      doc.roundedRect(M, y - 2, W - M * 2, aH, 4, 4, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(...INK);
      doc.text(aLines, M + 10, y + 9);
      y += aH + 14;
    });

    y += 6;
  });

  /* ════════════════════════════════════════════
     FOOTER sur toutes les pages
     ════════════════════════════════════════════ */
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setDrawColor(...STONE);
    doc.setLineWidth(0.5);
    doc.line(M, H - 70, W - M, H - 70);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...NAVY);
    doc.text(KANTI_INFO.name, M, H - 55);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...GREY);
    doc.text(KANTI_INFO.address, M, H - 43);
    doc.text(`${KANTI_INFO.phone}  ·  ${KANTI_INFO.email}`, M, H - 31);
    doc.text(`Page ${p} / ${pageCount}`, W - M, H - 31, { align: "right" });
    doc.setFontSize(7);
    doc.setTextColor(150, 155, 165);
    const legal = doc.splitTextToSize(KANTI_INFO.legal, W - M * 2);
    doc.text(legal, M, H - 17);
  }

  doc.save(`KANTI-Profil-Risque-SRI${profile.sri}.pdf`);
}

function ensureSpace(doc: jsPDF, y: number, needed: number, M: number, H: number): number {
  if (y + needed > H - 90) {
    doc.addPage();
    return 90;
  }
  return y;
}

function drawSectionTitle(
  doc: jsPDF,
  y: number,
  title: string,
  M: number,
  NAVY: [number, number, number],
  ACCENT: [number, number, number],
): number {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...NAVY);
  doc.text(title, M, y);
  doc.setDrawColor(...ACCENT);
  doc.setLineWidth(1.4);
  doc.line(M, y + 6, M + 40, y + 6);
  return y + 22;
}

function drawBulletSection(
  doc: jsPDF,
  startY: number,
  title: string,
  items: string[],
  accent: [number, number, number],
  M: number,
  W: number,
  H: number,
  NAVY: [number, number, number],
  INK: [number, number, number],
): number {
  let y = drawSectionTitle(doc, startY, title, M, NAVY, accent);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...INK);
  items.forEach((it) => {
    y = ensureSpace(doc, y, 30, M, H);
    doc.setFillColor(...accent);
    doc.circle(M + 3, y - 3, 1.6, "F");
    const lines = doc.splitTextToSize(it, W - M * 2 - 16);
    doc.text(lines, M + 14, y);
    y += lines.length * 13 + 6;
  });
  return y;
}