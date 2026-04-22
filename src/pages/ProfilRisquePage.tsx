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
import {
  CORMORANT_REG_B64,
  CORMORANT_BOLD_B64,
  COVER_BUILDING_B64,
} from "@/assets/pdf-assets";

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
  const CW = W - M * 2; // content width

  // ── Palette éditoriale (raffinée) ─────────────────────
  type RGB = [number, number, number];
  const NAVY: RGB = [11, 22, 50];        // texte principal / fonds sombres
  const NAVY_SOFT: RGB = [44, 58, 92];   // texte secondaire sombre
  const ACCENT: RGB = [62, 110, 178];    // bleu électrique
  const ACCENT_DEEP: RGB = [38, 72, 130];
  const GOLD: RGB = [168, 138, 70];      // doré sobre (vigilance)
  const INK: RGB = [38, 44, 58];         // corps texte
  const MUTED: RGB = [120, 128, 142];    // labels / méta
  const HAIR: RGB = [218, 222, 230];     // filets
  const PAPER: RGB = [248, 249, 252];    // fond beige-papier très doux
  const PAPER_DEEP: RGB = [240, 243, 248];
  const WHITE: RGB = [255, 255, 255];

  const today = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const ref = `KANTI · PR-${Date.now().toString().slice(-6)}`;

  // ──────────────────────────────────────────────────────
  // Helpers
  // ──────────────────────────────────────────────────────
  const setFill = (c: RGB) => doc.setFillColor(c[0], c[1], c[2]);
  const setDraw = (c: RGB) => doc.setDrawColor(c[0], c[1], c[2]);
  const setText = (c: RGB) => doc.setTextColor(c[0], c[1], c[2]);

  const ensureSpace = (y: number, needed: number, onNewPage: () => number) => {
    if (y + needed > H - 110) return onNewPage();
    return y;
  };

  // ══════════════════════════════════════════════════════
  // PAGE 1 — COUVERTURE (épurée, éditoriale)
  // ══════════════════════════════════════════════════════

  // Fond papier très doux
  setFill(PAPER);
  doc.rect(0, 0, W, H, "F");

  // Bande supérieure navy fine (en-tête de marque)
  setFill(NAVY);
  doc.rect(0, 0, W, 38, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  setText(WHITE);
  doc.text("K  A  N  T  I", M, 24);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  setText([190, 200, 220]);
  doc.text(KANTI_INFO.baseline.toUpperCase(), W - M, 24, { align: "right" });

  // Bloc latéral navy (1/3 droit) — discret mais affirmé
  setFill(NAVY);
  doc.rect(W - 180, 38, 180, H - 38, "F");
  // Filet doré vertical
  setDraw(ACCENT);
  doc.setLineWidth(1.5);
  doc.line(W - 180, 38, W - 180, H);

  // Cercle décoratif léger sur le bloc navy
  setDraw([28, 44, 86]);
  doc.setLineWidth(0.6);
  doc.circle(W - 90, H - 220, 130, "S");
  doc.circle(W - 90, H - 220, 90, "S");
  doc.circle(W - 90, H - 220, 50, "S");

  // SRI géant dans le bloc latéral
  setText(WHITE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(110);
  doc.text(`${profile.sri}`, W - 90, 240, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  setText([170, 190, 220]);
  doc.text("/ 7", W - 90, 268, { align: "center" });
  doc.setFontSize(8);
  doc.text("SRI · ÉCHELLE 1–7", W - 90, 290, { align: "center" });

  // Petite jauge verticale décorative
  for (let i = 1; i <= 7; i++) {
    const yBar = 330 + (7 - i) * 16;
    const isActive = i === profile.sri;
    setFill(isActive ? ACCENT : ([34, 50, 90] as RGB));
    doc.roundedRect(W - 130, yBar, 80, 8, 2, 2, "F");
    setText(isActive ? WHITE : [120, 140, 175]);
    doc.setFont("helvetica", isActive ? "bold" : "normal");
    doc.setFontSize(7.5);
    doc.text(`${i}`, W - 38, yBar + 6, { align: "right" });
  }

  // Bloc texte gauche : titre, baseline, contexte
  setText(MUTED);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("RAPPORT CONFIDENTIEL  ·  AUTO-ÉVALUATION AMF", M, 100);

  // Filet
  setDraw(ACCENT);
  doc.setLineWidth(1.4);
  doc.line(M, 116, M + 56, 116);

  // Titre éditorial
  setText(NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(44);
  doc.text("Profil", M, 180);
  doc.text("d'investisseur", M, 224);

  // Sous-titre
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  setText(NAVY_SOFT);
  const intro = doc.splitTextToSize(
    "Évaluation personnalisée de votre tolérance au risque, conforme aux exigences de l'Autorité des Marchés Financiers.",
    W - 180 - M - 24,
  );
  doc.text(intro, M, 268);

  // Carte « Profil retenu » blanche, posée sur le fond papier
  const cardY = 340;
  const cardW = W - 180 - M - 24;
  setFill(WHITE);
  doc.roundedRect(M, cardY, cardW, 150, 10, 10, "F");
  setDraw(HAIR);
  doc.setLineWidth(0.6);
  doc.roundedRect(M, cardY, cardW, 150, 10, 10, "S");
  // Filet accent gauche
  setFill(ACCENT);
  doc.rect(M, cardY, 3, 150, "F");

  setText(MUTED);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("PROFIL RETENU", M + 22, cardY + 28);

  setText(NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(profile.label, M + 22, cardY + 58);

  setText(ACCENT);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(profile.shortLabel.toUpperCase(), M + 22, cardY + 76);

  // Mini description
  setText(INK);
  doc.setFontSize(9.5);
  const miniDesc = doc.splitTextToSize(
    profile.description,
    cardW - 44,
  ).slice(0, 3);
  doc.text(miniDesc, M + 22, cardY + 100);

  // Méta édition
  setText(MUTED);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Édité le ${today}`, M, H - 120);
  doc.text(ref, M, H - 106);

  // Pied de page couverture
  setDraw(HAIR);
  doc.setLineWidth(0.4);
  doc.line(M, H - 70, W - 200, H - 70);
  setText(NAVY_SOFT);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(KANTI_INFO.name, M, H - 54);
  doc.setFont("helvetica", "normal");
  setText(MUTED);
  doc.setFontSize(7.5);
  doc.text(KANTI_INFO.address, M, H - 42);
  doc.text(`${KANTI_INFO.phone}  ·  ${KANTI_INFO.email}`, M, H - 30);

  // Mention en bas du bloc latéral
  setText([170, 185, 215]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text("Document pédagogique", W - 90, H - 54, { align: "center" });
  doc.text("ne constituant pas un conseil", W - 90, H - 44, { align: "center" });
  doc.text("personnalisé au sens AMF.", W - 90, H - 34, { align: "center" });

  // ══════════════════════════════════════════════════════
  // PAGE 2 — SYNTHÈSE
  // ══════════════════════════════════════════════════════
  doc.addPage();
  drawPageHeader("Synthèse de votre profil", "01");
  let y = 150;

  // Intro
  setText(MUTED);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const lead = doc.splitTextToSize(
    "Votre indicateur synthétique de risque (SRI) résulte de l'analyse de vos réponses sur trois dimensions : projet d'investissement, connaissance & expérience, comportement & tolérance au risque.",
    CW,
  );
  doc.text(lead, M, y);
  y += lead.length * 13 + 22;

  // ── Encart score (large, propre) ─────────────────────
  const panelH = 180;
  setFill(NAVY);
  doc.roundedRect(M, y, CW, panelH, 12, 12, "F");
  // Filet doré accent
  setFill(ACCENT);
  doc.rect(M, y, 3, panelH, "F");

  // Big score (gauche)
  setText(WHITE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(78);
  doc.text(`${profile.sri}`, M + 36, y + 110);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(18);
  setText([170, 190, 220]);
  doc.text("/ 7", M + 110, y + 110);

  // Label profil
  setText(WHITE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  setText([170, 190, 220]);
  doc.text("PROFIL D'INVESTISSEUR", M + 200, y + 38);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  setText(WHITE);
  doc.text(profile.label, M + 200, y + 62);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  setText([180, 200, 230]);
  doc.text(profile.shortLabel.toUpperCase(), M + 200, y + 80);

  // Jauge horizontale 1→7 dans l'encart
  const gaugeY = y + 130;
  const gaugeX = M + 200;
  const gaugeW = CW - 200 - 36;
  const segW = gaugeW / 7;
  for (let i = 1; i <= 7; i++) {
    const isActive = i === profile.sri;
    const segX = gaugeX + (i - 1) * segW;
    setFill(isActive ? ACCENT : ([34, 50, 90] as RGB));
    doc.roundedRect(segX + 2, gaugeY, segW - 4, 14, 3, 3, "F");
    setText(isActive ? WHITE : ([120, 140, 175] as RGB));
    doc.setFont("helvetica", isActive ? "bold" : "normal");
    doc.setFontSize(8);
    doc.text(`${i}`, segX + segW / 2, gaugeY + 9.5, { align: "center" });
  }
  setText([150, 170, 200]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text("SÉCURITAIRE", gaugeX, gaugeY + 30);
  doc.text("OFFENSIF", gaugeX + gaugeW, gaugeY + 30, { align: "right" });

  y += panelH + 28;

  // ── Lecture du profil ────────────────────────────────
  y = sectionLabel(y, "Lecture du profil");
  setText(INK);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  const desc = doc.splitTextToSize(profile.description, CW);
  doc.text(desc, M, y);
  y += desc.length * 14 + 26;

  // ── Reco + Vigilance en deux colonnes ────────────────
  y = ensureSpace(y, 240, () => { doc.addPage(); drawPageHeader("Synthèse de votre profil", "01"); return 150; });
  const colW = (CW - 20) / 2;

  drawTwoColCards(
    y,
    {
      title: "Recommandations",
      items: profile.recommendations,
      accent: ACCENT,
    },
    {
      title: "Points de vigilance",
      items: profile.cautions,
      accent: GOLD,
    },
    colW,
  );

  // ══════════════════════════════════════════════════════
  // PAGES SUIVANTES — DÉTAIL DES RÉPONSES
  // ══════════════════════════════════════════════════════
  doc.addPage();
  drawPageHeader("Détail de vos réponses", "02");
  y = 150;

  setText(MUTED);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const recapLead = doc.splitTextToSize(
    "Récapitulatif structuré du questionnaire — conservé pour la traçabilité de l'évaluation et nos échanges futurs.",
    CW,
  );
  doc.text(recapLead, M, y);
  y += recapLead.length * 13 + 24;

  RISK_SECTIONS.forEach((section, sIdx) => {
    y = ensureSpace(y, 80, () => { doc.addPage(); drawPageHeader("Détail de vos réponses", "02"); return 150; });

    // En-tête de section : numéro romain + titre
    setText(ACCENT);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(`PARTIE ${String(sIdx + 1).padStart(2, "0")}`, M, y);
    setText(NAVY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(section, M, y + 22);
    setDraw(NAVY);
    doc.setLineWidth(0.8);
    doc.line(M, y + 30, M + 40, y + 30);
    y += 50;

    const sectionQuestions = RISK_QUESTIONS.filter((q) => q.section === section);
    sectionQuestions.forEach((q, idx) => {
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
      const isUnanswered = answerLabel === "Non renseigné";

      // Mesure préalable
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const qText = doc.splitTextToSize(q.question, CW - 40);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      const aText = doc.splitTextToSize(answerLabel, CW - 40);
      const blockH = 18 + qText.length * 13 + 10 + aText.length * 13 + 18;

      y = ensureSpace(y, blockH, () => { doc.addPage(); drawPageHeader("Détail de vos réponses", "02"); return 150; });

      // Carte question (papier doux)
      setFill(PAPER_DEEP);
      doc.roundedRect(M, y, CW, blockH, 8, 8, "F");
      // Numéro
      setText(ACCENT);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text(`Q${String(idx + 1).padStart(2, "0")}  ·  ${q.dimension.toUpperCase()}`, M + 16, y + 16);

      // Question
      setText(NAVY);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      doc.text(qText, M + 16, y + 34);

      // Filet séparateur
      setDraw(HAIR);
      doc.setLineWidth(0.4);
      const sepY = y + 34 + qText.length * 13 + 6;
      doc.line(M + 16, sepY, M + CW - 16, sepY);

      // Réponse
      setText(isUnanswered ? MUTED : ACCENT_DEEP);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.text("RÉPONSE", M + 16, sepY + 14);
      setText(isUnanswered ? MUTED : INK);
      doc.setFont("helvetica", isUnanswered ? "italic" : "bold");
      doc.setFontSize(10);
      doc.text(aText, M + 16, sepY + 28);

      y += blockH + 12;
    });

    y += 14;
  });

  // ══════════════════════════════════════════════════════
  // FOOTER sur toutes les pages (sauf couverture)
  // ══════════════════════════════════════════════════════
  const pageCount = doc.getNumberOfPages();
  for (let p = 2; p <= pageCount; p++) {
    doc.setPage(p);
    setDraw(HAIR);
    doc.setLineWidth(0.4);
    doc.line(M, H - 78, W - M, H - 78);

    setText(NAVY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("KANTI", M, H - 62);
    setText(MUTED);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text(KANTI_INFO.address, M, H - 50);
    doc.text(`${KANTI_INFO.phone}  ·  ${KANTI_INFO.email}`, M, H - 38);

    // Pagination élégante
    setText(NAVY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(`${String(p).padStart(2, "0")}`, W - M, H - 62, { align: "right" });
    setText(MUTED);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(`/ ${String(pageCount).padStart(2, "0")}`, W - M, H - 50, { align: "right" });
    doc.text(ref, W - M, H - 38, { align: "right" });

    // Mention légale très fine
    setText([165, 170, 180]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    const legal = doc.splitTextToSize(KANTI_INFO.legal, CW);
    doc.text(legal, M, H - 22);
  }

  doc.save(`KANTI-Profil-Risque-SRI${profile.sri}.pdf`);

  // ──────────────────────────────────────────────────────
  // Helpers (closures sur doc/W/H/M/CW)
  // ──────────────────────────────────────────────────────
  function drawPageHeader(title: string, partNumber: string) {
    // Bandeau supérieur très fin
    setFill(NAVY);
    doc.rect(0, 0, W, 32, "F");
    setText(WHITE);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("K  A  N  T  I", M, 21);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    setText([180, 195, 220]);
    doc.text("PROFIL DE RISQUE  ·  RAPPORT CONFIDENTIEL", W - M, 21, { align: "right" });

    // Méta partie / date
    setText(MUTED);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(`PARTIE ${partNumber}`, M, 70);
    setText(MUTED);
    doc.setFont("helvetica", "normal");
    doc.text(today, W - M, 70, { align: "right" });

    // Titre
    setText(NAVY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text(title, M, 105);
    setDraw(ACCENT);
    doc.setLineWidth(1.5);
    doc.line(M, 118, M + 50, 118);
  }

  function sectionLabel(yy: number, label: string) {
    setText(ACCENT);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(label.toUpperCase(), M, yy);
    setDraw(ACCENT);
    doc.setLineWidth(1);
    doc.line(M, yy + 4, M + 28, yy + 4);
    return yy + 22;
  }

  function drawTwoColCards(
    yStart: number,
    left: { title: string; items: string[]; accent: RGB },
    right: { title: string; items: string[]; accent: RGB },
    colW: number,
  ) {
    const drawCol = (x: number, col: { title: string; items: string[]; accent: RGB }) => {
      // Carte
      setFill(WHITE);
      doc.roundedRect(x, yStart, colW, 220, 10, 10, "F");
      setDraw(HAIR);
      doc.setLineWidth(0.5);
      doc.roundedRect(x, yStart, colW, 220, 10, 10, "S");
      // Filet accent en haut
      setFill(col.accent);
      doc.roundedRect(x, yStart, colW, 4, 2, 2, "F");

      // Titre
      setText(NAVY);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(col.title, x + 18, yStart + 28);

      // Items
      setText(INK);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      let yy = yStart + 50;
      col.items.forEach((it) => {
        const lines = doc.splitTextToSize(it, colW - 44);
        // puce
        setFill(col.accent);
        doc.circle(x + 18, yy - 3, 1.5, "F");
        setText(INK);
        doc.text(lines, x + 28, yy);
        yy += lines.length * 12 + 8;
      });
    };
    drawCol(M, left);
    drawCol(M + colW + 20, right);
  }
}