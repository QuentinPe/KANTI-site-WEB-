import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, CheckCircle2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import logoWhite from "@/assets/logo-kanti-white.png.asset.json";
import logoDark from "@/assets/logo-kanti-dark.png.asset.json";
import "./LoginPage.css";

const loginSchema = z.object({
  email: z.string().min(1, "Email requis").email("Adresse email invalide"),
  password: z.string().min(6, "Minimum 6 caractères"),
});
type LoginData = z.infer<typeof loginSchema>;

const GRAIN = "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const C_BLUE_SOLID = "hsl(215 42% 65%)";
const C_BLUE_GLOW  = "hsl(215 52% 62% / 0.55)";

// ── Constellation data ─────────────────────────────────────────────────────────

const NODES = [
  { cx: 14,  cy: 20, r: 2.2 }, // 0 — top-left
  { cx: 52,  cy:  7, r: 1.8 }, // 1 — top-center-left
  { cx: 90,  cy:  4, r: 2.0 }, // 2 — top-center
  { cx: 132, cy: 10, r: 1.8 }, // 3 — top-right
  { cx: 166, cy: 36, r: 1.5 }, // 4 — right       (email nodes 0-4)
  { cx: 152, cy: 68, r: 2.0 }, // 5 — bottom-right (password nodes 5-8)
  { cx: 90,  cy: 84, r: 1.8 }, // 6 — bottom-center
  { cx: 38,  cy: 74, r: 1.5 }, // 7 — bottom-left
  { cx: 16,  cy: 48, r: 2.2 }, // 8 — left
];

function getActiveSet(email: string, pass: string): Set<number> {
  const s = new Set<number>();
  if (email.length >= 1) s.add(0);
  if (email.length >= 3) s.add(1);
  if (email.length >= 6) s.add(2);
  if (email.includes("@")) s.add(3);
  if (/\.[a-z]{2,}/i.test(email)) s.add(4);
  if (pass.length >= 1) s.add(5);
  if (pass.length >= 3) s.add(6);
  if (pass.length >= 6) s.add(7);
  if (pass.length >= 8) s.add(8);
  return s;
}

function spawnParticle(card: HTMLElement, isPass: boolean) {
  const el = document.createElement("div");
  el.className = `kanti-login-signal${isPass ? " kanti-login-signal--password" : ""}`;

  const w  = card.clientWidth;
  const h  = card.clientHeight;
  const sx = 24 + Math.random() * (w - 48);
  const sy = isPass ? h * 0.62 : h * 0.50;

  el.style.left = `${sx}px`;
  el.style.top  = `${sy}px`;
  card.appendChild(el);

  const dx = (w / 2 - sx) * 0.55 + (Math.random() - 0.5) * 38;
  const dy = -(sy - h * 0.14) * (0.62 + Math.random() * 0.46);

  el.animate(
    [
      { transform: "translate(0,0)",                                        opacity: 1 },
      { transform: `translate(${dx * 0.4}px,${dy * 0.38}px)`,             opacity: 0.9, offset: 0.38 },
      { transform: `translate(${dx}px,${dy}px)`,                           opacity: 0 },
    ],
    { duration: 460 + Math.random() * 210, easing: "cubic-bezier(0.2,0.8,0.2,1)", fill: "forwards" }
  ).addEventListener("finish", () => el.remove());
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const { signIn, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw]           = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [resetMode, setResetMode]     = useState(false);
  const [resetEmail, setResetEmail]   = useState("");
  const [resetSent, setResetSent]     = useState(false);
  const [focused, setFocused]         = useState<"email" | "password" | null>(null);

  // Constellation state
  const cardRef        = useRef<HTMLDivElement>(null);
  const prevActiveRef  = useRef<Set<number>>(new Set());
  const [activeNodes,  setActiveNodes]  = useState<Set<number>>(new Set());
  const [pulsingNodes, setPulsingNodes] = useState<Set<number>>(new Set());

  const { register: regLogin, handleSubmit: handleLogin, formState: { errors: loginErrors, isSubmitting: loginPending }, control } = useForm<LoginData>({ resolver: zodResolver(loginSchema) });

  const emailVal    = useWatch({ control, name: "email",    defaultValue: "" });
  const passwordVal = useWatch({ control, name: "password", defaultValue: "" });

  const isComplete = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal) && passwordVal.length >= 6;

  // Track which nodes just became active and fire pulse animation
  useEffect(() => {
    const next = getActiveSet(emailVal, passwordVal);
    const prev = prevActiveRef.current;

    const newlyActive: number[] = [];
    next.forEach((n) => { if (!prev.has(n)) newlyActive.push(n); });
    setActiveNodes(new Set(next));

    if (newlyActive.length > 0) {
      setPulsingNodes((p) => { const s = new Set(p); newlyActive.forEach((n) => s.add(n)); return s; });
      const t = setTimeout(() => {
        setPulsingNodes((p) => { const s = new Set(p); newlyActive.forEach((n) => s.delete(n)); return s; });
      }, 760);
      prevActiveRef.current = next;
      return () => clearTimeout(t);
    }
    prevActiveRef.current = next;
  }, [emailVal, passwordVal]);

  const spawnEmail = () => { if (cardRef.current) spawnParticle(cardRef.current, false); };
  const spawnPass  = () => { if (cardRef.current) spawnParticle(cardRef.current, true);  };

  const cardClass = [
    "kanti-login-card w-full max-w-[420px] rounded-[28px] relative z-20 overflow-hidden",
    isComplete   ? "is-complete"   : "",
    loginPending ? "is-submitting" : "",
    globalError  ? "has-error"     : "",
  ].filter(Boolean).join(" ");

  const onLogin = async (data: LoginData) => {
    setGlobalError("");
    const { error } = await signIn(data.email, data.password);
    if (error) {
      const msg = error.message ?? "";
      setGlobalError(
        msg.includes("Invalid login") || msg.includes("invalid_credentials")
          ? "Email ou mot de passe incorrect."
          : msg.includes("Email not confirmed")
          ? "Vérifiez votre email avant de vous connecter."
          : msg.includes("security purposes") || msg.includes("rate limit")
          ? "Trop de tentatives. Attendez quelques secondes."
          : msg || "Une erreur est survenue. Réessayez."
      );
      return;
    }
    toast.success("Connexion réussie", {
      description: "Bienvenue sur le panel d'administration KANTI",
      duration: 3500,
      style: {
        background: "hsl(224 55% 10% / 0.95)",
        backdropFilter: "blur(20px)",
        border: "1px solid hsl(0 0% 100% / 0.12)",
        color: "hsl(0 0% 100% / 0.90)",
        boxShadow: "0 20px 60px -10px hsl(0 0% 0% / 0.50), inset 0 1px 0 hsl(0 0% 100% / 0.14)",
      },
    });
    navigate("/admin");
  };

  const onReset = async () => {
    if (!resetEmail) return;
    const { error } = await resetPassword(resetEmail);
    if (error) { setGlobalError("Erreur lors de l'envoi. Réessayez."); return; }
    setResetSent(true);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: "url(/admin-hero.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(160deg, rgba(8,11,24,0.84) 0%, rgba(6,9,20,0.90) 100%)" }} />

      {/* Ambient orbs */}
      <Orb size={520} color="hsl(215 55% 50% / 0.10)" initial={{ x: -180, y: -120 }} animate={{ x: [-180, -120, -180], y: [-120, -80, -120] }} duration={14} />
      <Orb size={380} color="hsl(270 35% 55% / 0.08)" initial={{ x: 200, y: 160 }}   animate={{ x: [200, 160, 200], y: [160, 200, 160] }}     duration={18} />
      <Orb size={300} color="hsl(158 40% 45% / 0.07)" initial={{ x: 80, y: -200 }}   animate={{ x: [80, 110, 80], y: [-200, -170, -200] }}     duration={22} />

      {/* Grain */}
      <div aria-hidden className="fixed inset-0 opacity-[0.022] pointer-events-none z-10"
        style={{ backgroundImage: GRAIN, backgroundSize: "200px" }} />

      {/* Loading overlay */}
      <AnimatePresence>
        {loginPending && (
          <motion.div key="login-loading"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
            style={{ background: "white" }}
          >
            <img src={logoDark.url} alt="KANTI" style={{ height: 36, width: "auto", marginBottom: 40, opacity: 0.92 }} />
            <div style={{ width: 220, height: 2, borderRadius: 99, background: "hsl(224 20% 90%)", overflow: "hidden" }}>
              <motion.div
                animate={{ x: ["0%", "240%"] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                style={{ width: "40%", height: "100%", borderRadius: 99, background: "hsl(224 55% 16%)", originX: 0 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back link */}
      <motion.div className="fixed top-6 left-6 z-20"
        initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <Link to="/"
          className="inline-flex items-center gap-2 text-[12px] font-medium tracking-wide transition-all duration-200 hover:gap-3"
          style={{ color: "hsl(0 0% 100% / 0.42)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "hsl(0 0% 100% / 0.70)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "hsl(0 0% 100% / 0.42)"; }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Retour au site
        </Link>
      </motion.div>

      {/* Card */}
      <motion.div
        ref={cardRef}
        className={cardClass}
        style={{
          background: "rgba(255,255,255,0.09)",
          backdropFilter: "blur(56px) saturate(200%)",
          WebkitBackdropFilter: "blur(56px) saturate(200%)",
          border: "1px solid rgba(255,255,255,0.14)",
          boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.12), 0 40px 100px rgba(0,0,0,0.50)",
        }}
        initial={{ opacity: 0, scale: 0.94, y: 28 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Top focus glow bar */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-px"
          animate={{
            background: focused
              ? `linear-gradient(90deg, transparent 0%, ${C_BLUE_GLOW} 40%, ${C_BLUE_GLOW} 60%, transparent 100%)`
              : "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 40%, rgba(255,255,255,0.18) 60%, transparent 100%)",
          }}
          transition={{ duration: 0.5 }}
        />

        <div className="relative">
          {/* Grain on card */}
          <div aria-hidden className="absolute inset-0 opacity-[0.03] pointer-events-none rounded-[28px]"
            style={{ backgroundImage: GRAIN, backgroundSize: "200px" }} />

          <div className="px-8 py-8">
            {/* Logo + constellation */}
            <motion.div
              className="kanti-login-header mb-2"
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.4 }}
            >
              <div className="kanti-logo-anchor">
                <img src={logoWhite.url} alt="KANTI" className="kanti-login-logo" style={{ opacity: 0.88 }} />
                <svg
                  className="kanti-constellation"
                  viewBox="0 0 180 90"
                  aria-hidden="true"
                >
                  {/* Orbit lines — only visible when is-complete */}
                  <ellipse className="kanti-constellation__orbit" cx="90" cy="45" rx="78" ry="38" />
                  <ellipse className="kanti-constellation__orbit" cx="90" cy="45" rx="56" ry="26"
                    transform="rotate(14,90,45)" />

                  {/* Nodes — activated by typing */}
                  {NODES.map((n, i) => (
                    <circle
                      key={i}
                      className={[
                        "kanti-constellation__node",
                        activeNodes.has(i)  ? "is-active"  : "",
                        pulsingNodes.has(i) ? "is-pulsing" : "",
                      ].filter(Boolean).join(" ")}
                      cx={n.cx} cy={n.cy} r={n.r}
                    />
                  ))}
                </svg>
              </div>
            </motion.div>

            <motion.div
              className="mb-6"
              style={{ height: 1, background: "rgba(255,255,255,0.09)" }}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ delay: 0.30, duration: 0.5, ease: "easeOut" }}
            />

            <AnimatePresence mode="wait">
              {resetMode ? (
                <motion.div key="reset"
                  initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.24 }}
                >
                  <h2 className="text-[17px] font-medium mb-1.5 tracking-tight" style={{ color: "rgba(255,255,255,0.90)" }}>
                    Réinitialisation
                  </h2>
                  <p className="text-[13px] font-light mb-5" style={{ color: "rgba(255,255,255,0.45)" }}>
                    Entrez votre email pour recevoir un lien.
                  </p>
                  {resetSent ? (
                    <motion.div className="flex flex-col items-center py-4 gap-4"
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.35 }}>
                      <CheckCircle2 className="w-10 h-10" style={{ color: "hsl(142 60% 55%)" }} strokeWidth={1.5} />
                      <p className="text-[13px] text-center font-light" style={{ color: "rgba(255,255,255,0.60)" }}>
                        Email envoyé à <span style={{ color: "rgba(255,255,255,0.85)" }}>{resetEmail}</span>
                      </p>
                    </motion.div>
                  ) : (
                    <>
                      <InputField
                        icon={Mail} type="email" placeholder="votre@email.com"
                        value={resetEmail} onChange={(v) => setResetEmail(v)}
                        focused={focused === "email"} hasValue={!!resetEmail}
                        onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                      />
                      {globalError && <p className="text-[12px] mb-3 mt-2" style={{ color: "hsl(0 80% 72%)" }}>{globalError}</p>}
                      <button onClick={onReset}
                        className="w-full py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 hover:opacity-90 active:scale-[0.98] mt-3"
                        style={{ background: "white", color: "hsl(224 60% 12%)" }}>
                        Envoyer le lien
                      </button>
                    </>
                  )}
                  <button onClick={() => { setResetMode(false); setGlobalError(""); setResetSent(false); }}
                    className="mt-4 w-full text-center text-[12px] transition-opacity hover:opacity-70"
                    style={{ color: "rgba(255,255,255,0.38)" }}>
                    ← Retour à la connexion
                  </button>
                </motion.div>
              ) : (
                <motion.form key="login-form"
                  onSubmit={handleLogin(onLogin)}
                  className="flex flex-col gap-5"
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.24 }}
                >
                  <div>
                    <h2 className="text-[18px] font-medium tracking-tight" style={{ color: "rgba(255,255,255,0.90)" }}>
                      Espace conseillers
                    </h2>
                    <p className="text-[12px] font-light mt-0.5" style={{ color: "rgba(255,255,255,0.38)" }}>
                      Accès réservé à l'équipe KANTI
                    </p>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <motion.label
                      className="text-[11px] font-medium tracking-[0.08em] uppercase flex items-center gap-1.5"
                      animate={{ color: focused === "email" ? C_BLUE_SOLID : "rgba(255,255,255,0.48)" }}
                      transition={{ duration: 0.25 }}
                    >
                      <motion.span
                        className="inline-block w-1 h-1 rounded-full"
                        animate={{
                          background: (focused === "email" || !!emailVal) ? C_BLUE_SOLID : "rgba(255,255,255,0.28)",
                          scale: (focused === "email" || !!emailVal) ? 1.4 : 1,
                        }}
                        transition={{ duration: 0.25 }}
                      />
                      Email
                    </motion.label>
                    <AnimatedInput
                      type="email" icon={Mail} placeholder="votre@email.com"
                      isFocused={focused === "email"} hasValue={!!emailVal}
                      registration={regLogin("email")}
                      onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                      onKeyDown={spawnEmail}
                    />
                    <AnimatePresence>
                      {loginErrors.email && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="text-[11px]" style={{ color: "hsl(0 80% 72%)" }}>
                          {loginErrors.email.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-1.5">
                    <motion.label
                      className="text-[11px] font-medium tracking-[0.08em] uppercase flex items-center gap-1.5"
                      animate={{ color: focused === "password" ? C_BLUE_SOLID : "rgba(255,255,255,0.48)" }}
                      transition={{ duration: 0.25 }}
                    >
                      <motion.span
                        className="inline-block w-1 h-1 rounded-full"
                        animate={{
                          background: (focused === "password" || !!passwordVal) ? C_BLUE_SOLID : "rgba(255,255,255,0.28)",
                          scale: (focused === "password" || !!passwordVal) ? 1.4 : 1,
                        }}
                        transition={{ duration: 0.25 }}
                      />
                      Mot de passe
                    </motion.label>
                    <AnimatedInput
                      type={showPw ? "text" : "password"} icon={Lock} placeholder="••••••••"
                      isFocused={focused === "password"} hasValue={!!passwordVal}
                      registration={regLogin("password")}
                      onFocus={() => setFocused("password")} onBlur={() => setFocused(null)}
                      onKeyDown={spawnPass}
                      rightSlot={
                        <button type="button" onClick={() => setShowPw((v) => !v)}
                          aria-label={showPw ? "Masquer" : "Afficher"}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-80"
                          style={{ color: "rgba(255,255,255,0.38)" }}>
                          {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      }
                    />

                    {/* Password strength bars */}
                    <AnimatePresence>
                      {focused === "password" && !!passwordVal && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                          className="flex items-center gap-1.5 px-1"
                        >
                          {[6, 8, 12].map((len, i) => (
                            <motion.div key={i}
                              className="flex-1 h-0.5 rounded-full"
                              animate={{
                                background: passwordVal.length >= len
                                  ? i === 0 ? "hsl(0 65% 62%)" : i === 1 ? "hsl(38 70% 58%)" : "hsl(142 55% 50%)"
                                  : "rgba(255,255,255,0.12)",
                              }}
                              transition={{ duration: 0.3, delay: i * 0.05 }}
                            />
                          ))}
                          <span className="text-[10px] font-light ml-1" style={{ color: "rgba(255,255,255,0.32)" }}>
                            {passwordVal.length < 6 ? "Faible" : passwordVal.length < 8 ? "Moyen" : "Fort"}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {loginErrors.password && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="text-[11px]" style={{ color: "hsl(0 80% 72%)" }}>
                          {loginErrors.password.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <AnimatePresence>
                    {globalError && (
                      <motion.p
                        className="text-[12px] py-2.5 px-3.5 rounded-xl"
                        style={{ background: "hsl(0 60% 18% / 0.60)", color: "hsl(0 80% 72%)", border: "1px solid hsl(0 60% 35% / 0.30)" }}
                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      >
                        {globalError}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={loginPending}
                    className="kanti-login-submit relative w-full py-3 rounded-xl text-[14px] font-medium overflow-hidden disabled:opacity-60"
                    style={{ background: "white", color: "hsl(224 60% 12%)" }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                  >
                    {/* Shimmer sweep */}
                    <motion.span
                      aria-hidden
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.28) 50%, transparent 60%)", backgroundSize: "200% 100%" }}
                      initial={{ backgroundPositionX: "200%" }}
                      whileHover={{ backgroundPositionX: "-200%" }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                    {loginPending ? (
                      <span className="flex items-center justify-center gap-2 relative z-10">
                        <span className="w-4 h-4 rounded-full border-2 animate-spin"
                          style={{ borderColor: "hsl(224 40% 25% / 0.20)", borderTopColor: "hsl(224 60% 14%)" }} />
                        Connexion…
                      </span>
                    ) : (
                      <span className="relative z-10">Se connecter</span>
                    )}
                  </motion.button>

                  <button type="button" onClick={() => { setResetMode(true); setGlobalError(""); }}
                    className="text-center text-[11px] transition-opacity hover:opacity-70"
                    style={{ color: "rgba(255,255,255,0.34)" }}>
                    Mot de passe oublié ?
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            <motion.p
              className="mt-6 text-center text-[11px] font-light"
              style={{ color: "rgba(255,255,255,0.26)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            >
              Problème ?{" "}
              <a href="mailto:kanti@adnfamily.com"
                className="transition-opacity hover:opacity-80"
                style={{ color: "rgba(255,255,255,0.44)", textDecoration: "underline", textDecorationStyle: "dotted", textUnderlineOffset: "3px" }}>
                kanti@adnfamily.com
              </a>
            </motion.p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function Orb({ size, color, initial, animate: anim, duration }: {
  size: number; color: string;
  initial: { x: number; y: number };
  animate: { x: number[]; y: number[] };
  duration: number;
}) {
  return (
    <motion.div
      aria-hidden
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size, height: size,
        background: color,
        filter: `blur(${size * 0.28}px)`,
        left: "50%", top: "50%",
        translateX: "-50%", translateY: "-50%",
      }}
      initial={initial}
      animate={anim}
      transition={{ duration, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
    />
  );
}

function AnimatedInput({
  type, icon: Icon, placeholder, isFocused, hasValue,
  registration, onFocus, onBlur, onKeyDown, rightSlot,
}: {
  type: string;
  icon: React.ElementType;
  placeholder: string;
  isFocused: boolean;
  hasValue: boolean;
  registration: ReturnType<import("react-hook-form").UseFormRegister<LoginData>>;
  onFocus: () => void;
  onBlur: () => void;
  onKeyDown?: () => void;
  rightSlot?: React.ReactNode;
}) {
  return (
    <motion.div
      className="relative"
      animate={{
        boxShadow: isFocused
          ? `0 0 0 2px ${C_BLUE_GLOW}, inset 0 0 0 1px rgba(255,255,255,0.24)`
          : "0 0 0 0px transparent, inset 0 0 0 1px rgba(255,255,255,0.12)",
      }}
      transition={{ duration: 0.25 }}
      style={{ borderRadius: "0.75rem" }}
    >
      <motion.span
        className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
        animate={{ color: isFocused || hasValue ? C_BLUE_SOLID : "rgba(255,255,255,0.32)" }}
        transition={{ duration: 0.25 }}
      >
        <Icon className="w-4 h-4" />
      </motion.span>

      <input
        type={type}
        placeholder={placeholder}
        className="w-full pl-10 py-2.5 rounded-xl text-[14px] outline-none transition-colors duration-200 placeholder:text-white/25 text-white/90"
        style={{
          background: isFocused ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.07)",
          border: "none",
          paddingRight: rightSlot ? "2.75rem" : "1rem",
        }}
        {...registration}
        onFocus={() => onFocus()}
        onBlur={(e) => { registration.onBlur(e); onBlur(); }}
        onKeyDown={() => onKeyDown?.()}
      />
      {rightSlot}
    </motion.div>
  );
}

function InputField({
  icon: Icon, type, placeholder, value, onChange, focused, hasValue, onFocus, onBlur,
}: {
  icon: React.ElementType; type: string; placeholder: string;
  value: string; onChange: (v: string) => void;
  focused: boolean; hasValue: boolean; onFocus: () => void; onBlur: () => void;
}) {
  return (
    <motion.div
      className="relative"
      animate={{
        boxShadow: focused
          ? `0 0 0 2px ${C_BLUE_GLOW}, inset 0 0 0 1px rgba(255,255,255,0.24)`
          : "0 0 0 0px transparent, inset 0 0 0 1px rgba(255,255,255,0.12)",
      }}
      transition={{ duration: 0.25 }}
      style={{ borderRadius: "0.75rem" }}
    >
      <motion.span
        className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
        animate={{ color: focused || hasValue ? C_BLUE_SOLID : "rgba(255,255,255,0.32)" }}
        transition={{ duration: 0.25 }}
      >
        <Icon className="w-4 h-4" />
      </motion.span>
      <input
        type={type} placeholder={placeholder} value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus} onBlur={onBlur}
        className="w-full pl-10 pr-4 py-2.5 rounded-xl text-[14px] outline-none transition-colors duration-200 placeholder:text-white/25 text-white/90"
        style={{ background: focused ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.07)", border: "none" }}
      />
    </motion.div>
  );
}
