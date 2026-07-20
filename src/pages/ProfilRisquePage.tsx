import { useMemo, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import jsPDF from "jspdf";
import { Send, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { createLead } from "@/lib/leadsService";
import {
  RISK_QUESTIONS,
  RISK_SECTIONS,
  computeSri,
  type SriProfile,
  type RiskSection,
} from "@/data/profilRisqueQuestions";
import {
  LOGO_KANTI_WHITE_B64,
  LOGO_KANTI_DARK_B64,
} from "@/assets/pdf-assets";

type Phase = "intro" | "quiz" | "result";

/** Réponse d'une question : numérique scorée OU saisie libre (string). */
type AnswerValue = number | string;

const KANTI_INFO = {
  name: "KANTI",
  baseline: "Cabinet de gestion de patrimoine",
  address: "12 rue Ferrere, 33000 Bordeaux",
  phone: "06 63 32 48 09",
  email: "kanti@adnfamily.com",
  legal:
    "KANTI, CIF inscrit auprès de l'AMF, adhérent de la CNCEF. Le présent document est un outil pédagogique d'auto-évaluation et ne constitue pas une recommandation personnalisée d'investissement au sens de l'article L.541-1 du Code monétaire et financier.",
};

export default function ProfilRisquePage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [selectedIndices, setSelectedIndices] = useState<Record<string, number>>({});
  const [showSendModal, setShowSendModal] = useState(false);

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

  const handleSelect = (qid: string, score: number, idx: number) => {
    setAnswers((p) => ({ ...p, [qid]: score }));
    setSelectedIndices((p) => ({ ...p, [qid]: idx }));
    setTimeout(goNext, 220);
  };

  const handleNumber = (qid: string, value: string) => {
    setAnswers((p) => ({ ...p, [qid]: value }));
  };

  const handleReset = () => {
    setAnswers({});
    setSelectedIndices({});
    setStep(0);
    setPhase("intro");
  };

  return (
    <>
      <Seo
        title="Définir son profil de risque, Questionnaire AMF | KANTI"
        description="Évaluez votre profil investisseur et obtenez votre indicateur synthétique de risque (SRI) sur une échelle de 1 à 7. Questionnaire conforme aux exigences AMF, export PDF instantané."
      />
      <Header />
      <main id="main">
        <ProfilRisqueHero total={total} onStart={() => setPhase("quiz")} />

        <section id="profil-risque-quiz" className="section-padding relative overflow-hidden">
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
                        const selected = selectedIndices[current.id] === i;
                        return (
                          <li key={`${current.id}-${i}`}>
                            <button
                              type="button"
                              onClick={() => handleSelect(current.id, opt.score, i)}
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
                  onSend={() => setShowSendModal(true)}
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

      <AnimatePresence>
        {showSendModal && (
          <SendModal
            profile={profile}
            onClose={() => setShowSendModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ───────────────── HERO ───────────────── */
const HERO_IMG = "/profil-risque-hero.png";

function ProfilRisqueHero({ total, onStart }: { total: number; onStart: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ height: "92vh", minHeight: 560 }}
    >
      {/* Parallax background */}
      <motion.div className="absolute inset-0 will-change-transform" style={{ y: imageY, scale: 1.18 }}>
        <img
          src={HERO_IMG}
          alt="Espace de travail — KANTI Profil de risque"
          className="w-full h-full object-cover object-center"
          fetchPriority="high"
          decoding="sync"
        />
      </motion.div>

      {/* Ivory gradient — left readability */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(100deg, hsl(210 100% 96% / 0.93) 0%, hsl(210 100% 96% / 0.78) 28%, hsl(210 100% 96% / 0.32) 52%, transparent 72%)",
        }}
      />

      {/* Bottom vignette */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-36 pointer-events-none"
        style={{ background: "linear-gradient(to top, hsl(220 30% 97% / 0.92) 0%, transparent 100%)" }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center h-full">
        <div className="max-w-6xl mx-auto px-8 md:px-14 w-full">
          <div className="max-w-xl">

            {/* Eyebrow */}
            <p
              className="text-[10px] tracking-[0.32em] uppercase font-medium mb-5 opacity-0"
              style={{ color: "hsl(224 40% 45%)", animation: "fade-in 0.8s ease 0.15s forwards" }}
            >
              Outil patrimonial · AMF
            </p>

            {/* Headline */}
            <h1
              className="font-heading font-light leading-[1.04] tracking-tight mb-6 opacity-0"
              style={{
                fontSize: "clamp(42px, 6vw, 68px)",
                color: "hsl(224 60% 12%)",
                animation: "fade-in-up 0.9s cubic-bezier(0.22,1,0.36,1) 0.25s forwards",
              }}
            >
              Votre profil
              <br />
              <span style={{ fontStyle: "italic", color: "hsl(224 55% 30%)" }}>
                d'investisseur.
              </span>
            </h1>

            {/* Description */}
            <p
              className="font-light leading-relaxed mb-8 opacity-0"
              style={{
                fontSize: "clamp(14px, 1.8vw, 16px)",
                color: "hsl(224 40% 28%)",
                maxWidth: 440,
                animation: "fade-in-up 0.9s cubic-bezier(0.22,1,0.36,1) 0.42s forwards",
              }}
            >
              Un questionnaire de {total} questions conforme aux exigences AMF pour
              évaluer votre tolérance au risque et obtenir votre indicateur SRI
              sur une échelle de 1 à 7.
            </p>

            {/* Stats row */}
            <div
              className="flex items-center gap-6 mb-10 opacity-0"
              style={{ animation: "fade-in 0.8s ease 0.55s forwards" }}
            >
              {[
                { value: `${total}`, label: "Questions" },
                { value: "1 → 7", label: "Échelle SRI" },
                { value: "PDF", label: "Export instantané" },
              ].map((s, i) => (
                <div key={s.label} className="flex items-center gap-6">
                  {i > 0 && <span style={{ width: 1, height: 28, background: "hsl(224 40% 22% / 0.18)", display: "block" }} />}
                  <div>
                    <div
                      className="font-heading font-light tabular-nums leading-none"
                      style={{ fontSize: 22, color: "hsl(224 60% 14%)" }}
                    >
                      {s.value}
                    </div>
                    <div
                      className="text-[10px] uppercase tracking-[0.2em] mt-1"
                      style={{ color: "hsl(224 25% 50%)" }}
                    >
                      {s.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div
              className="flex flex-wrap gap-3 opacity-0"
              style={{ animation: "fade-in-up 0.9s cubic-bezier(0.22,1,0.36,1) 0.68s forwards" }}
            >
              <button
                type="button"
                onClick={onStart}
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-medium tracking-wide transition-colors duration-300 shadow-lg"
                style={{ background: "hsl(224 60% 18%)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(224 60% 12%)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(224 60% 18%)"; }}
              >
                Commencer le questionnaire
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
              <a
                href="#profil-risque-quiz"
                className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium tracking-wide transition-colors duration-300"
                style={{ border: "1px solid hsl(224 60% 22% / 0.35)", color: "hsl(224 60% 20%)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "hsl(224 60% 22%)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "hsl(224 60% 22% / 0.35)"; }}
              >
                En savoir plus
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-35">
        <div className="w-[1px] h-8" style={{ background: "hsl(224 60% 20%)" }} />
      </div>
    </section>
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
      <h2 className="font-heading text-3xl lg:text-4xl font-light text-foreground mb-6 tracking-tight leading-snug text-balance">
        Comprendre <span className="italic text-foreground/70">qui vous êtes</span>,
        <br className="hidden sm:block" />
        avant de parler de <span className="italic text-foreground/70">quoi investir</span>.
      </h2>
      <p className="text-foreground/70 text-base lg:text-lg font-light leading-relaxed max-w-2xl mx-auto mb-6">
        Chez KANTI, chaque accompagnement commence par une écoute. Pas par un produit,
        ni par une promesse de rendement. Ce questionnaire de <strong className="font-medium text-foreground/85">{total} questions</strong> est notre
        première conversation : il met en lumière votre rapport au temps, à
        l'incertitude, et à votre projet de vie.
      </p>
      <p className="text-foreground/55 text-sm lg:text-base font-light leading-relaxed max-w-2xl mx-auto mb-10 italic">
        Il est conforme aux exigences de l'AMF (DDA / MIF II) et reprend l'échelle
        européenne PRIIPs, la même que celle utilisée par toutes les sociétés de gestion.
        À l'issue, vous obtenez un score précis sur 7, une lecture personnalisée et un
        rapport PDF que vous pourrez nous transmettre pour préparer votre rendez-vous.
      </p>

      <div className="grid sm:grid-cols-3 gap-4 mb-10 max-w-xl mx-auto">
        {[
          { v: "~ 5 min", l: "Durée moyenne" },
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
  onSend,
}: {
  profile: SriProfile;
  answers: Record<string, AnswerValue>;
  onReset: () => void;
  onSend: () => void;
}) {
  const [pdfError, setPdfError] = useState("");
  const [pdfGenerating, setPdfGenerating] = useState(false);

  const handleDownload = async () => {
    setPdfError("");
    setPdfGenerating(true);
    try {
      await generatePdf(profile, answers);
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : String(e);
      console.error("[PDF] generatePdf failed:", e);
      setPdfError(`Erreur PDF : ${errMsg.slice(0, 180)}`);
    } finally {
      setPdfGenerating(false);
    }
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
              <span className="text-foreground/40 text-3xl lg:text-4xl font-light tabular-nums">
                .{Math.round(((profile.sriPrecise ?? profile.sri) % 1) * 10)}
              </span>
              <span className="text-foreground/30 text-4xl lg:text-5xl"> / 7</span>
            </div>
            <h3 className="mt-4 font-heading text-2xl lg:text-3xl font-light text-foreground tracking-tight">
              {profile.label}
            </h3>
            <p className="mt-2 text-[11px] tracking-[0.18em] uppercase text-foreground/45">
              Score précis : {(profile.sriPrecise ?? profile.sri).toFixed(2)} / 7,00
            </p>
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
      {pdfError && (
        <p className="text-center text-red-500 text-sm mt-2">{pdfError}</p>
      )}
      <div className="flex flex-wrap gap-4 justify-center pt-2">
        <button
          type="button"
          onClick={handleDownload}
          disabled={pdfGenerating}
          data-magnetic
          className="group inline-flex items-center gap-3 pl-8 pr-2.5 py-2.5 rounded-full bg-[hsl(var(--navy-deep))] text-white text-sm font-medium tracking-wide reflection-sweep shadow-xl hover:-translate-y-0.5 transition-transform duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span>{pdfGenerating ? "Génération…" : "Télécharger ma fiche PDF"}</span>
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
          onClick={onSend}
          className="group inline-flex items-center gap-3 pl-8 pr-2.5 py-2.5 rounded-full border border-foreground/20 text-foreground text-sm font-medium tracking-wide hover:bg-foreground/5 transition"
        >
          <span>Envoyer à KANTI</span>
          <span className="w-9 h-9 rounded-full bg-[hsl(var(--electric))] text-white flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5">
            <Send className="w-3.5 h-3.5" />
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


/* ───────────────── SEND MODAL ───────────────── */
function SendModal({ profile, onClose }: { profile: SriProfile; onClose: () => void }) {
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prenom.trim() || !nom.trim() || !email.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const fullNom = `${prenom.trim()} ${nom.trim()}`;
      const sujet = `Profil de risque — SRI ${profile.sri}/7 (${profile.shortLabel})`;
      const message = `${profile.description}\n\nScore précis : ${(profile.sriPrecise ?? profile.sri).toFixed(2)}/7`;
      await createLead({ nom: fullNom, email: email.trim(), telephone: telephone.trim() || null, sujet, message });
      try {
        await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nom: fullNom,
            email: email.trim(),
            telephone: telephone.trim() || "",
            sujet,
            message,
          }),
        });
      } catch {}
      setSent(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[SendModal] createLead failed:", msg);
      setError(`Erreur : ${msg.slice(0, 120)}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "hsl(224 60% 6% / 0.72)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md glass-strong rounded-[2rem] p-8 lg:p-10"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full border border-foreground/15 flex items-center justify-center text-foreground/50 hover:text-foreground hover:border-foreground/30 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {sent ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-[hsl(var(--electric)/0.1)] flex items-center justify-center mx-auto mb-5">
              <Send className="w-6 h-6 text-[hsl(var(--electric))]" />
            </div>
            <h3 className="font-heading text-2xl font-light text-foreground mb-3">Envoyé !</h3>
            <p className="text-foreground/65 text-sm font-light leading-relaxed mb-6">
              Votre profil SRI {profile.sri}/7 a bien été transmis à l'équipe KANTI. Nous vous contacterons sous 24 h.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-7 py-3 rounded-full bg-[hsl(var(--navy-deep))] text-white text-sm font-medium tracking-wide hover:-translate-y-0.5 transition-transform"
            >
              Fermer
            </button>
          </div>
        ) : (
          <>
            <p className="text-[10px] tracking-[0.28em] uppercase text-foreground/50 mb-2 font-medium">Transmettre mon profil</p>
            <h3 className="font-heading text-2xl font-light text-foreground mb-1 tracking-tight">
              Envoyer à KANTI
            </h3>
            <p className="text-foreground/55 text-sm font-light mb-7">
              Profil SRI <strong className="font-medium text-foreground/80">{profile.sri}/7</strong> — {profile.shortLabel}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-medium">Prénom *</span>
                  <input
                    type="text"
                    required
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-foreground/12 bg-white/55 px-4 py-2.5 text-sm text-foreground outline-none focus:border-[hsl(var(--electric))] focus:bg-white/80 transition placeholder:text-foreground/30"
                    placeholder="Jean"
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-medium">Nom *</span>
                  <input
                    type="text"
                    required
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-foreground/12 bg-white/55 px-4 py-2.5 text-sm text-foreground outline-none focus:border-[hsl(var(--electric))] focus:bg-white/80 transition placeholder:text-foreground/30"
                    placeholder="Dupont"
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-medium">Email *</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-foreground/12 bg-white/55 px-4 py-2.5 text-sm text-foreground outline-none focus:border-[hsl(var(--electric))] focus:bg-white/80 transition placeholder:text-foreground/30"
                  placeholder="jean.dupont@exemple.com"
                />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-medium">Téléphone</span>
                <input
                  type="tel"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-foreground/12 bg-white/55 px-4 py-2.5 text-sm text-foreground outline-none focus:border-[hsl(var(--electric))] focus:bg-white/80 transition placeholder:text-foreground/30"
                  placeholder="06 00 00 00 00"
                />
              </label>

              {error && (
                <p className="text-red-500 text-xs">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-[hsl(var(--navy-deep))] text-white text-sm font-medium tracking-wide hover:-translate-y-0.5 transition-transform disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 mt-2"
              >
                {submitting ? "Envoi en cours…" : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Transmettre mon profil
                  </>
                )}
              </button>
            </form>

            <p className="text-[10px] text-foreground/40 text-center mt-4 leading-relaxed">
              Vos données sont traitées par KANTI conformément à notre politique de confidentialité. Aucun démarchage.
            </p>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ───────────────── PDF GENERATION ───────────────── */
async function generatePdf(
  profile: SriProfile,
  answers: Record<string, AnswerValue>,
) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 56;
  const CW = W - M * 2;

  // Built-in fonts only, robuste et sans dépendances externes
  const SANS = "helvetica";
  const SERIF = "times";

  // Palette
  type RGB = [number, number, number];
  const NAVY: RGB = [11, 22, 50];
  const NAVY_SOFT: RGB = [44, 58, 92];
  const ACCENT: RGB = [62, 110, 178];
  const ACCENT_DEEP: RGB = [38, 72, 130];
  const GOLD: RGB = [168, 138, 70];
  const INK: RGB = [38, 44, 58];
  const MUTED: RGB = [120, 128, 142];
  const HAIR: RGB = [218, 222, 230];
  const PAPER: RGB = [248, 249, 252];
  const PAPER_DEEP: RGB = [240, 243, 248];
  const WHITE: RGB = [255, 255, 255];

  const today = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const ref = `KANTI PR-${Date.now().toString().slice(-6)}`;

  const setFill = (c: RGB) => doc.setFillColor(c[0], c[1], c[2]);
  const setDraw = (c: RGB) => doc.setDrawColor(c[0], c[1], c[2]);
  const setText = (c: RGB) => doc.setTextColor(c[0], c[1], c[2]);

  const ensureSpace = (y: number, needed: number, onNewPage: () => number) => {
    if (y + needed > H - 110) return onNewPage();
    return y;
  };

  const sriPrecise = profile.sriPrecise ?? profile.sri;

  // ═══════════════════════════════════════════════════════════
  // PAGE 1 — COUVERTURE (géométrique, sans photo)
  // ═══════════════════════════════════════════════════════════
  const photoW = 210;
  const leftW = W - photoW;
  const leftInner = leftW - M * 2;
  const scoreStr = sriPrecise.toFixed(1);

  // Panneau gauche — papier
  setFill(PAPER);
  doc.rect(0, 0, leftW, H, "F");

  // Panneau droit — navy profond (uni)
  setFill(NAVY);
  doc.rect(leftW, 0, photoW, H, "F");

  // ── Contenu panneau gauche ──

  // Logo KANTI
  try {
    doc.addImage(LOGO_KANTI_DARK_B64, "PNG", M, 46, 78, 24);
  } catch {
    setText(NAVY);
    doc.setFont(SANS, "bold");
    doc.setFontSize(14);
    doc.text("KANTI", M, 64);
  }

  // Baseline
  setDraw(ACCENT);
  doc.setLineWidth(1);
  doc.line(M, 84, M + 28, 84);
  setText(MUTED);
  doc.setFont(SANS, "normal");
  doc.setFontSize(7.5);
  doc.text(KANTI_INFO.baseline.toUpperCase(), M, 98);

  // Eyebrow
  setText(ACCENT);
  doc.setFont(SANS, "bold");
  doc.setFontSize(7.5);
  doc.text("RAPPORT CONFIDENTIEL   ·   AUTO-ÉVALUATION AMF", M, 180);

  // Titre éditorial
  setText(NAVY);
  doc.setFont(SERIF, "normal");
  doc.setFontSize(46);
  doc.text("Profil", M, 240);
  doc.text("d'investisseur.", M, 290);

  // Sous-titre
  doc.setFont(SANS, "normal");
  doc.setFontSize(10);
  setText(NAVY_SOFT);
  const intro = doc.splitTextToSize(
    "Évaluation personnalisée de votre tolérance au risque, conforme aux exigences de l'Autorité des Marchés Financiers (DDA / MIF II).",
    leftInner,
  );
  doc.text(intro, M, 330);

  // Carte profil
  const cardY = 410;
  const cardH = 175;
  const cardW = leftInner;
  setFill(WHITE);
  doc.roundedRect(M, cardY, cardW, cardH, 10, 10, "F");
  setDraw(HAIR);
  doc.setLineWidth(0.5);
  doc.roundedRect(M, cardY, cardW, cardH, 10, 10, "S");
  setFill(ACCENT);
  doc.rect(M, cardY, 3, cardH, "F");

  setText(MUTED);
  doc.setFont(SANS, "bold");
  doc.setFontSize(8);
  doc.text("VOTRE PROFIL RETENU", M + 20, cardY + 26);

  // Score
  setText(NAVY);
  doc.setFont(SERIF, "bold");
  doc.setFontSize(54);
  doc.text(scoreStr, M + 20, cardY + 92);
  const scoreW = doc.getTextWidth(scoreStr);
  doc.setFont(SANS, "normal");
  doc.setFontSize(12);
  setText(MUTED);
  doc.text("/ 7", M + 20 + scoreW + 8, cardY + 92);

  // Label
  setText(NAVY);
  doc.setFont(SERIF, "bold");
  doc.setFontSize(17);
  const labelLines = doc.splitTextToSize(profile.label, cardW - 40);
  doc.text(labelLines[0], M + 20, cardY + 122);

  setText(ACCENT);
  doc.setFont(SANS, "bold");
  doc.setFontSize(8);
  doc.text(profile.shortLabel.toUpperCase(), M + 20, cardY + 142);

  setText(MUTED);
  doc.setFont(SANS, "normal");
  doc.setFontSize(8);
  doc.text(
    "Indicateur synthétique de risque (échelle PRIIPs 1 à 7)",
    M + 20,
    cardY + 158,
  );

  // Meta bas panneau gauche
  setDraw(HAIR);
  doc.setLineWidth(0.4);
  doc.line(M, H - 100, M + leftInner, H - 100);

  setText(NAVY);
  doc.setFont(SANS, "bold");
  doc.setFontSize(8);
  doc.text("ÉDITE LE", M, H - 80);
  doc.text("RÉFÉRENCE", M + 130, H - 80);
  setText(MUTED);
  doc.setFont(SANS, "normal");
  doc.setFontSize(9);
  doc.text(today, M, H - 64);
  doc.text(ref, M + 130, H - 64);

  setText(NAVY_SOFT);
  doc.setFont(SANS, "normal");
  doc.setFontSize(7.5);
  const contactLines = doc.splitTextToSize(
    `${KANTI_INFO.address}   ·   ${KANTI_INFO.email}   ·   ${KANTI_INFO.phone}`,
    leftInner,
  );
  doc.text(contactLines, M, H - 38);

  // ═══════════════════════════════════════════════════════════
  // Helpers pour pages suivantes
  // ═══════════════════════════════════════════════════════════
  function drawPageHeader(title: string, partNumber: string) {
    setFill(NAVY);
    doc.rect(0, 0, W, 34, "F");
    try {
      doc.addImage(LOGO_KANTI_WHITE_B64, "PNG", M, 9, 55, 17);
    } catch {
      setText(WHITE);
      doc.setFont(SANS, "bold");
      doc.setFontSize(10);
      doc.text("KANTI", M, 22);
    }
    setText([180, 195, 220]);
    doc.setFont(SANS, "normal");
    doc.setFontSize(7.5);
    doc.text("PROFIL DE RISQUE", W - M, 22, { align: "right" });

    setText(MUTED);
    doc.setFont(SANS, "bold");
    doc.setFontSize(8);
    doc.text(`PARTIE ${partNumber}`, M, 74);
    setText(MUTED);
    doc.setFont(SANS, "normal");
    doc.setFontSize(8);
    doc.text(today.toUpperCase(), W - M, 74, { align: "right" });

    setText(NAVY);
    doc.setFont(SERIF, "normal");
    doc.setFontSize(28);
    doc.text(title, M, 108);
    setDraw(ACCENT);
    doc.setLineWidth(1.5);
    doc.line(M, 120, M + 48, 120);
  }

  function sectionLabel(yy: number, label: string) {
    setText(ACCENT);
    doc.setFont(SANS, "bold");
    doc.setFontSize(8);
    doc.text(label.toUpperCase(), M, yy);
    setDraw(ACCENT);
    doc.setLineWidth(1);
    doc.line(M, yy + 5, M + 28, yy + 5);
    return yy + 24;
  }

  function drawTwoColCards(
    yStart: number,
    left: { title: string; items: string[]; accent: RGB },
    right: { title: string; items: string[]; accent: RGB },
    colW: number,
    colH: number,
  ) {
    const drawCol = (x: number, col: { title: string; items: string[]; accent: RGB }) => {
      setFill(WHITE);
      doc.roundedRect(x, yStart, colW, colH, 10, 10, "F");
      setDraw(HAIR);
      doc.setLineWidth(0.5);
      doc.roundedRect(x, yStart, colW, colH, 10, 10, "S");
      setFill(col.accent);
      doc.roundedRect(x, yStart, colW, 4, 2, 2, "F");

      setText(NAVY);
      doc.setFont(SERIF, "bold");
      doc.setFontSize(14);
      doc.text(col.title, x + 18, yStart + 30);

      setText(INK);
      doc.setFont(SANS, "normal");
      doc.setFontSize(9.5);
      let yy = yStart + 52;
      col.items.forEach((it) => {
        const lines = doc.splitTextToSize(it, colW - 44);
        setFill(col.accent);
        doc.circle(x + 20, yy - 3, 1.5, "F");
        setText(INK);
        doc.text(lines, x + 30, yy);
        yy += lines.length * 12 + 8;
      });
    };
    drawCol(M, left);
    drawCol(M + colW + 20, right);
  }

  // ═══════════════════════════════════════════════════════════
  // PAGE 2 — NOTRE DEMARCHE
  // ═══════════════════════════════════════════════════════════
  doc.addPage();
  drawPageHeader("Notre démarche", "00");
  let y = 158;

  setText(NAVY);
  doc.setFont(SERIF, "italic");
  doc.setFontSize(18);
  const opener = doc.splitTextToSize(
    "« Investir n'est pas un pari. C'est un alignement — entre votre histoire, vos objectifs et le temps dont vous disposez. »",
    CW - 20,
  );
  doc.text(opener, M, y);
  y += opener.length * 22 + 10;
  setDraw(ACCENT);
  doc.setLineWidth(1);
  doc.line(M, y, M + 40, y);
  y += 26;

  setText(INK);
  doc.setFont(SANS, "normal");
  doc.setFontSize(10.5);
  const story1 = doc.splitTextToSize(
    "Avant de parler de produits, de fiscalité ou de performance, KANTI prend le temps de vous écouter. Ce questionnaire est la première pierre d'un dialogue : il transforme une notion abstraite — votre tolérance au risque — en un repère clair, partagé et opposable. C'est aussi une exigence réglementaire, posée par l'Autorité des Marchés Financiers pour protéger l'épargnant.",
    CW,
  );
  doc.text(story1, M, y);
  y += story1.length * 14 + 24;

  y = sectionLabel(y, "Trois dimensions, une lecture cohérente");
  const pillars = [
    { n: "I", t: "Votre projet", d: "Horizon, objectif principal, capacité à immobiliser une partie de votre épargne sans compromettre votre quotidien." },
    { n: "II", t: "Vos repères", d: "Connaissance des classes d'actifs, expérience passée, compréhension des mécanismes de rendement et de perte." },
    { n: "III", t: "Votre tempérament", d: "Réaction émotionnelle face à une baisse, arbitrage instinctif entre sécurité et performance, seuil d'inconfort." },
  ];
  const pillarH = 90;
  pillars.forEach((p, i) => {
    const py = y + i * (pillarH + 12);
    setFill(WHITE);
    doc.roundedRect(M, py, CW, pillarH, 8, 8, "F");
    setDraw(HAIR);
    doc.setLineWidth(0.5);
    doc.roundedRect(M, py, CW, pillarH, 8, 8, "S");
    setFill(ACCENT);
    doc.rect(M, py, 3, pillarH, "F");
    setText(ACCENT);
    doc.setFont(SERIF, "bold");
    doc.setFontSize(24);
    doc.text(p.n, M + 22, py + 48);
    setText(NAVY);
    doc.setFont(SERIF, "bold");
    doc.setFontSize(15);
    doc.text(p.t, M + 66, py + 34);
    setText(INK);
    doc.setFont(SANS, "normal");
    doc.setFontSize(9.5);
    const dlines = doc.splitTextToSize(p.d, CW - 90);
    doc.text(dlines, M + 66, py + 54);
  });
  y += pillars.length * (pillarH + 12) + 20;

  setFill(PAPER_DEEP);
  doc.roundedRect(M, y, CW, 64, 8, 8, "F");
  setFill(GOLD);
  doc.rect(M, y, 3, 64, "F");
  setText(NAVY);
  doc.setFont(SANS, "bold");
  doc.setFontSize(8);
  doc.text("MÉTHODOLOGIE", M + 18, y + 22);
  setText(INK);
  doc.setFont(SANS, "normal");
  doc.setFontSize(9);
  const meth = doc.splitTextToSize(
    "Vos réponses sont pondérées sur l'échelle PRIIPs (1 à 7), reconnue à l'échelle européenne. Le score décimal reflète la nuance de votre profil, au-delà du simple palier entier.",
    CW - 40,
  );
  doc.text(meth, M + 18, y + 38);

  // ═══════════════════════════════════════════════════════════
  // PAGE 3 — SYNTHESE
  // ═══════════════════════════════════════════════════════════
  doc.addPage();
  drawPageHeader("Synthèse de votre profil", "01");
  y = 158;

  setText(MUTED);
  doc.setFont(SANS, "normal");
  doc.setFontSize(10);
  const lead = doc.splitTextToSize(
    "Votre indicateur synthétique de risque (SRI) résulte de l'analyse de vos réponses sur trois dimensions : projet d'investissement, connaissance et expérience, comportement et tolérance au risque.",
    CW,
  );
  doc.text(lead, M, y);
  y += lead.length * 13 + 24;

  // Panneau score
  const panelH = 158;
  setFill(NAVY);
  doc.roundedRect(M, y, CW, panelH, 12, 12, "F");
  setFill(ACCENT);
  doc.rect(M, y, 3, panelH, "F");

  setText(WHITE);
  doc.setFont(SERIF, "bold");
  doc.setFontSize(72);
  doc.text(scoreStr, M + 36, y + 100);
  const bigW = doc.getTextWidth(scoreStr);
  doc.setFont(SANS, "normal");
  doc.setFontSize(18);
  setText([170, 190, 220]);
  doc.text("/ 7", M + 36 + bigW + 10, y + 100);
  setText([150, 170, 200]);
  doc.setFont(SANS, "bold");
  doc.setFontSize(7.5);
  doc.text(`SRI ARRONDI  ${profile.sri}`, M + 36, y + 122);

  setText([170, 190, 220]);
  doc.setFont(SANS, "bold");
  doc.setFontSize(8);
  doc.text("PROFIL D'INVESTISSEUR", M + 210, y + 34);
  setText(WHITE);
  doc.setFont(SERIF, "bold");
  doc.setFontSize(20);
  const labelMaxW = CW - 210 - 36;
  const labelLines2 = doc.splitTextToSize(profile.label, labelMaxW);
  doc.text(labelLines2[0], M + 210, y + 58);
  setText([180, 200, 230]);
  doc.setFont(SANS, "normal");
  doc.setFontSize(9);
  doc.text(profile.shortLabel.toUpperCase(), M + 210, y + 76);

  // Jauge
  const gaugeY = y + 116;
  const gaugeX = M + 210;
  const gaugeW = CW - 210 - 36;
  const segW = gaugeW / 7;
  for (let i = 1; i <= 7; i++) {
    const isActive = i === profile.sri;
    const segX = gaugeX + (i - 1) * segW;
    setFill(isActive ? ACCENT : ([34, 50, 90] as RGB));
    doc.roundedRect(segX + 2, gaugeY, segW - 4, 14, 3, 3, "F");
    setText(isActive ? WHITE : ([120, 140, 175] as RGB));
    doc.setFont(SANS, isActive ? "bold" : "normal");
    doc.setFontSize(8);
    doc.text(`${i}`, segX + segW / 2, gaugeY + 10, { align: "center" });
  }
  setText([150, 170, 200]);
  doc.setFont(SANS, "normal");
  doc.setFontSize(7);
  doc.text("SÉCURITAIRE", gaugeX, gaugeY + 30);
  doc.text("OFFENSIF", gaugeX + gaugeW, gaugeY + 30, { align: "right" });

  y += panelH + 22;

  y = sectionLabel(y, "Lecture du profil");
  setText(INK);
  doc.setFont(SANS, "normal");
  doc.setFontSize(10);
  const desc = doc.splitTextToSize(profile.description, CW);
  doc.text(desc, M, y);
  y += desc.length * 13 + 16;

  const colW = (CW - 20) / 2;
  const colH = 175;
  drawTwoColCards(
    y,
    { title: "Recommandations", items: profile.recommendations, accent: ACCENT },
    { title: "Points de vigilance", items: profile.cautions, accent: GOLD },
    colW,
    colH,
  );

  // ═══════════════════════════════════════════════════════════
  // PAGE 4 — POSITIONNEMENT
  // ═══════════════════════════════════════════════════════════
  doc.addPage();
  drawPageHeader("Votre positionnement", "02");
  y = 158;

  setText(MUTED);
  doc.setFont(SANS, "normal");
  doc.setFontSize(10);
  const posLead = doc.splitTextToSize(
    "Comparez votre profil à la population française des épargnants à partir de données publiques (INSEE 2023, AMF Baromètre 2024, Banque de France, Enquête Patrimoine).",
    CW,
  );
  doc.text(posLead, M, y);
  y += posLead.length * 13 + 24;

  const distribution: { sri: number; pct: number }[] = [
    { sri: 1, pct: 18 }, { sri: 2, pct: 24 }, { sri: 3, pct: 22 },
    { sri: 4, pct: 17 }, { sri: 5, pct: 11 }, { sri: 6, pct: 6 }, { sri: 7, pct: 2 },
  ];

  y = sectionLabel(y, "Distribution des profils en France");
  setText(INK);
  doc.setFont(SANS, "normal");
  doc.setFontSize(9.5);
  doc.text("Part estimée des épargnants français par niveau de SRI. Votre profil est mis en évidence.", M, y);
  y += 20;

  const chartH = 140;
  const chartX = M + 30;
  const chartW = CW - 30;
  const chartY = y;
  const maxPct = Math.max(...distribution.map((d) => d.pct));
  const barW = chartW / 7;

  setDraw(HAIR);
  doc.setLineWidth(0.4);
  doc.line(chartX, chartY + chartH, chartX + chartW, chartY + chartH);

  setDraw([235, 238, 244]);
  doc.setLineWidth(0.3);
  for (let g = 1; g <= 4; g++) {
    const gy = chartY + chartH - (chartH * g) / 4;
    doc.line(chartX, gy, chartX + chartW, gy);
    setText(MUTED);
    doc.setFont(SANS, "normal");
    doc.setFontSize(7);
    doc.text(`${Math.round((maxPct * g) / 4)}%`, chartX - 6, gy + 3, { align: "right" });
  }

  distribution.forEach((d, i) => {
    const bx = chartX + i * barW;
    const bh = (d.pct / maxPct) * (chartH - 14);
    const by = chartY + chartH - bh;
    const isMine = d.sri === profile.sri;
    setFill(isMine ? ACCENT : ([210, 218, 232] as RGB));
    doc.roundedRect(bx + 8, by, barW - 16, bh, 3, 3, "F");
    setText(isMine ? ACCENT_DEEP : MUTED);
    doc.setFont(SANS, isMine ? "bold" : "normal");
    doc.setFontSize(8);
    doc.text(`${d.pct}%`, bx + barW / 2, by - 5, { align: "center" });
    setText(isMine ? NAVY : MUTED);
    doc.setFont(SANS, isMine ? "bold" : "normal");
    doc.setFontSize(8);
    doc.text(`SRI ${d.sri}`, bx + barW / 2, chartY + chartH + 14, { align: "center" });
    if (isMine) {
      setFill(GOLD);
      doc.roundedRect(bx + barW / 2 - 16, by - 24, 32, 13, 3, 3, "F");
      setText(WHITE);
      doc.setFont(SANS, "bold");
      doc.setFontSize(7);
      doc.text("VOUS", bx + barW / 2, by - 15, { align: "center" });
    }
  });

  y = chartY + chartH + 34;
  setText(MUTED);
  doc.setFont(SANS, "italic");
  doc.setFontSize(7);
  doc.text("Source : AMF, Baromètre Épargne et Investissement 2024 (estimation indicative).", M, y);
  y += 26;

  y = ensureSpace(y, 200, () => { doc.addPage(); drawPageHeader("Votre positionnement", "02"); return 158; });
  y = sectionLabel(y, "Le patrimoine des Français, chiffres clés");

  const kpis = [
    { value: "177 200 €", label: "Patrimoine brut médian", source: "INSEE, Enquête Patrimoine 2021" },
    { value: "39,5 %", label: "Ménages détenant un produit risqué", source: "AMF / Banque de France 2023" },
    { value: "5,8 %", label: "Rendement annuel moyen actions FR (40 ans)", source: "Banque de France" },
    { value: "2,9 %", label: "Inflation annuelle moyenne 2020-2024", source: "INSEE, IPC" },
  ];
  const kpiW = (CW - 20) / 2;
  const kpiH = 84;
  kpis.forEach((k, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const kx = M + col * (kpiW + 20);
    const ky = y + row * (kpiH + 14);
    setFill(WHITE);
    doc.roundedRect(kx, ky, kpiW, kpiH, 8, 8, "F");
    setDraw(HAIR);
    doc.setLineWidth(0.5);
    doc.roundedRect(kx, ky, kpiW, kpiH, 8, 8, "S");
    setFill(ACCENT);
    doc.rect(kx, ky, 3, kpiH, "F");
    setText(NAVY);
    doc.setFont(SERIF, "bold");
    doc.setFontSize(20);
    doc.text(k.value, kx + 16, ky + 32);
    setText(INK);
    doc.setFont(SANS, "normal");
    doc.setFontSize(9);
    const lab = doc.splitTextToSize(k.label, kpiW - 32);
    doc.text(lab, kx + 16, ky + 52);
    setText(MUTED);
    doc.setFont(SANS, "italic");
    doc.setFontSize(7);
    doc.text(k.source, kx + 16, ky + 74);
  });
  y += Math.ceil(kpis.length / 2) * (kpiH + 14) + 24;

  y = sectionLabel(y, "Ce que cela signifie pour vous");
  const cumThis = distribution.find((d) => d.sri === profile.sri)?.pct ?? 0;
  const cumLower = distribution.filter((d) => d.sri < profile.sri).reduce((s, d) => s + d.pct, 0);
  const positionText =
    `Avec un SRI de ${scoreStr} sur 7, vous appartenez aux ${cumThis} % d'épargnants français de profil « ${profile.shortLabel.toLowerCase()} ». ` +
    `Environ ${cumLower} % des épargnants ont un profil plus prudent que le vôtre, et ${100 - cumLower - cumThis} % un profil plus offensif.`;
  const posLinesTxt = doc.splitTextToSize(positionText, CW - 40);
  const posBoxH = Math.max(72, posLinesTxt.length * 13 + 34);
  y = ensureSpace(y, posBoxH + 24, () => { doc.addPage(); drawPageHeader("Votre positionnement", "02"); return 158; });
  setFill(PAPER_DEEP);
  doc.roundedRect(M, y, CW, posBoxH, 8, 8, "F");
  setFill(ACCENT);
  doc.rect(M, y, 3, posBoxH, "F");
  setText(INK);
  doc.setFont(SANS, "normal");
  doc.setFontSize(10);
  doc.text(posLinesTxt, M + 18, y + 22);

  // ═══════════════════════════════════════════════════════════
  // PAGES 5+ — DETAIL DES RÉPONSES
  // ═══════════════════════════════════════════════════════════
  doc.addPage();
  drawPageHeader("Détail de vos réponses", "03");
  y = 158;

  setText(MUTED);
  doc.setFont(SANS, "normal");
  doc.setFontSize(10);
  const recapLead = doc.splitTextToSize(
    "Récapitulatif structuré du questionnaire, conservé pour la traçabilité de l'évaluation et nos échanges futurs.",
    CW,
  );
  doc.text(recapLead, M, y);
  y += recapLead.length * 13 + 22;

  RISK_SECTIONS.forEach((section, sIdx) => {
    y = ensureSpace(y, 84, () => { doc.addPage(); drawPageHeader("Détail de vos réponses", "03"); return 158; });

    setText(ACCENT);
    doc.setFont(SANS, "bold");
    doc.setFontSize(9);
    doc.text(`PARTIE ${String(sIdx + 1).padStart(2, "0")}`, M, y);
    setText(NAVY);
    doc.setFont(SERIF, "bold");
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
        answerLabel = opt?.label ?? "-";
      }
      const isUnanswered = answerLabel === "Non renseigné";

      const PADX = 18;
      const PADTOP = 18;
      const META_H = 14;
      const Q_FS = 10;
      const Q_LH = 13;
      const A_FS = 10;
      const A_LH = 13;
      const RESP_LABEL_H = 15;
      const SEP_GAP = 10;
      const PADBOT = 18;

      doc.setFont(SANS, "normal");
      doc.setFontSize(Q_FS);
      const qText = doc.splitTextToSize(q.question, CW - PADX * 2);
      doc.setFont(SANS, "bold");
      doc.setFontSize(A_FS);
      const aText = doc.splitTextToSize(answerLabel, CW - PADX * 2);

      const blockH =
        PADTOP + META_H +
        qText.length * Q_LH +
        SEP_GAP +
        RESP_LABEL_H +
        aText.length * A_LH +
        PADBOT;

      y = ensureSpace(y, blockH, () => { doc.addPage(); drawPageHeader("Détail de vos réponses", "03"); return 158; });

      setFill(PAPER_DEEP);
      doc.roundedRect(M, y, CW, blockH, 8, 8, "F");

      setText(ACCENT);
      doc.setFont(SANS, "bold");
      doc.setFontSize(8);
      doc.text(
        `Q${String(idx + 1).padStart(2, "0")}   ${q.dimension.toUpperCase()}`,
        M + PADX,
        y + PADTOP,
      );

      const qY = y + PADTOP + META_H;
      setText(NAVY);
      doc.setFont(SANS, "normal");
      doc.setFontSize(Q_FS);
      qText.forEach((line: string, li: number) => {
        doc.text(line, M + PADX, qY + li * Q_LH);
      });

      const sepY = qY + qText.length * Q_LH + SEP_GAP / 2;
      setDraw(HAIR);
      doc.setLineWidth(0.4);
      doc.line(M + PADX, sepY, M + CW - PADX, sepY);

      const respLabelY = sepY + 12;
      setText(isUnanswered ? MUTED : ACCENT_DEEP);
      doc.setFont(SANS, "bold");
      doc.setFontSize(7.5);
      doc.text("RÉPONSE", M + PADX, respLabelY);

      const aY = respLabelY + RESP_LABEL_H;
      setText(isUnanswered ? MUTED : INK);
      doc.setFont(SANS, isUnanswered ? "italic" : "bold");
      doc.setFontSize(A_FS);
      aText.forEach((line: string, li: number) => {
        doc.text(line, M + PADX, aY + li * A_LH);
      });

      y += blockH + 12;
    });

    y += 14;
  });

  // ═══════════════════════════════════════════════════════════
  // FOOTER sur toutes les pages (sauf couverture)
  // ═══════════════════════════════════════════════════════════
  const pageCount = doc.getNumberOfPages();
  for (let p = 2; p <= pageCount; p++) {
    doc.setPage(p);
    setDraw(HAIR);
    doc.setLineWidth(0.4);
    doc.line(M, H - 78, W - M, H - 78);

    try {
      doc.addImage(LOGO_KANTI_DARK_B64, "PNG", M, H - 72, 42, 13);
    } catch {
      setText(NAVY);
      doc.setFont(SANS, "bold");
      doc.setFontSize(8);
      doc.text("KANTI", M, H - 62);
    }
    setText(MUTED);
    doc.setFont(SANS, "normal");
    doc.setFontSize(7.5);
    doc.text(KANTI_INFO.address, M + 56, H - 62);
    doc.text(`${KANTI_INFO.phone}   ·   ${KANTI_INFO.email}`, M, H - 42);

    setText(NAVY);
    doc.setFont(SANS, "bold");
    doc.setFontSize(9);
    doc.text(`${String(p).padStart(2, "0")}`, W - M, H - 62, { align: "right" });
    setText(MUTED);
    doc.setFont(SANS, "normal");
    doc.setFontSize(7);
    doc.text(`/ ${String(pageCount).padStart(2, "0")}`, W - M, H - 50, { align: "right" });
    doc.text(ref, W - M, H - 42, { align: "right" });

    setText([165, 170, 180]);
    doc.setFont(SANS, "normal");
    doc.setFontSize(6.5);
    const legal = doc.splitTextToSize(KANTI_INFO.legal, CW);
    doc.text(legal, M, H - 26);
  }

  await doc.save(`KANTI-Profil-Risque-SRI${profile.sri}.pdf`);
}
