import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import logoWhite from "@/assets/logo-kanti-white.png.asset.json";
import logoDark from "@/assets/logo-kanti-dark.png.asset.json";

const loginSchema = z.object({
  email: z.string().min(1, "Email requis").email("Adresse email invalide"),
  password: z.string().min(6, "Minimum 6 caractères"),
});

type LoginData = z.infer<typeof loginSchema>;

const GRAIN = "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const CARD_STYLE = {
  background: "hsl(224 55% 10% / 0.82)",
  backdropFilter: "blur(56px) saturate(200%)",
  boxShadow: [
    "inset 0 1.5px 0 hsl(0 0% 100% / 0.20)",
    "inset 1px 0 0 hsl(0 0% 100% / 0.06)",
    "inset -1px 0 0 hsl(0 0% 100% / 0.06)",
    "inset 0 -1px 0 hsl(0 0% 100% / 0.04)",
    "0 40px 100px -20px hsl(0 0% 0% / 0.60)",
    "0 0 0 0.5px hsl(0 0% 100% / 0.10)",
  ].join(", "),
};

const inputBase =
  "w-full pl-10 pr-4 py-2.5 rounded-xl text-[14px] outline-none transition-all duration-200 bg-white/[0.06] border border-white/[0.12] text-white/90 placeholder:text-white/30 focus:bg-white/[0.09] focus:border-white/30";

export default function LoginPage() {
  const { signIn, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [resetMode, setResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const {
    register: regLogin,
    handleSubmit: handleLogin,
    formState: { errors: loginErrors, isSubmitting: loginPending },
  } = useForm<LoginData>({ resolver: zodResolver(loginSchema) });

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
          ? "Trop de tentatives. Attendez quelques secondes puis réessayez."
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
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(145deg, hsl(224 60% 7%) 0%, hsl(222 50% 12%) 100%)" }}
    >
      {/* ── Loading overlay ─────────────────────────────────────────── */}
      <AnimatePresence>
        {loginPending && (
          <motion.div
            key="login-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
            style={{ background: "white" }}
          >
            <img
              src={logoDark.url}
              alt="KANTI"
              style={{ height: 36, width: "auto", marginBottom: 40, opacity: 0.92 }}
            />
            {/* Progress bar track */}
            <div
              style={{
                width: 220,
                height: 2,
                borderRadius: 99,
                background: "hsl(224 20% 90%)",
                overflow: "hidden",
              }}
            >
              <motion.div
                animate={{ x: ["0%", "240%"] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  width: "40%",
                  height: "100%",
                  borderRadius: 99,
                  background: "hsl(224 55% 16%)",
                  originX: 0,
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div aria-hidden className="fixed inset-0 opacity-[0.030] pointer-events-none"
        style={{ backgroundImage: GRAIN, backgroundSize: "200px" }} />

      <Link
        to="/"
        className="fixed top-6 left-6 inline-flex items-center gap-2 text-[12px] font-medium tracking-wide transition-opacity hover:opacity-70"
        style={{ color: "hsl(0 0% 100% / 0.45)" }}
      >
        ← Retour au site
      </Link>

      <motion.div
        className="w-full max-w-[420px] rounded-[24px] relative overflow-hidden"
        style={CARD_STYLE}
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div aria-hidden className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: GRAIN, backgroundSize: "200px" }} />

        <div className="p-7">
          {/* Logo */}
          <div className="flex justify-center mb-7">
            <img src={logoWhite.url} alt="KANTI" className="h-7 w-auto" style={{ opacity: 0.88 }} />
          </div>
          <div className="mb-6" style={{ height: 1, background: "hsl(0 0% 100% / 0.08)" }} />

          <AnimatePresence mode="wait">
            {resetMode ? (
              <motion.div key="reset"
                initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.22 }}
              >
                <h2 className="text-[17px] font-medium mb-1.5 tracking-tight" style={{ color: "hsl(0 0% 100% / 0.90)" }}>
                  Réinitialisation
                </h2>
                <p className="text-[13px] font-light mb-5" style={{ color: "hsl(0 0% 100% / 0.45)" }}>
                  Entrez votre email pour recevoir un lien.
                </p>
                {resetSent ? (
                  <motion.div
                    className="flex flex-col items-center py-4 gap-4"
                    initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35 }}
                  >
                    <CheckCircle2 className="w-10 h-10" style={{ color: "hsl(142 60% 55%)" }} strokeWidth={1.5} />
                    <p className="text-[13px] text-center font-light" style={{ color: "hsl(0 0% 100% / 0.60)" }}>
                      Email envoyé à <span style={{ color: "hsl(0 0% 100% / 0.85)" }}>{resetEmail}</span>
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <div className="relative mb-4">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "hsl(0 0% 100% / 0.35)" }} />
                      <input type="email" placeholder="votre@email.com" value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)} className={inputBase} />
                    </div>
                    {globalError && <p className="text-[12px] mb-3" style={{ color: "hsl(0 80% 72%)" }}>{globalError}</p>}
                    <button onClick={onReset}
                      className="w-full py-2.5 rounded-xl text-[14px] font-medium transition-opacity hover:opacity-80"
                      style={{ background: "white", color: "hsl(224 60% 12%)" }}>
                      Envoyer le lien
                    </button>
                  </>
                )}
                <button onClick={() => { setResetMode(false); setGlobalError(""); setResetSent(false); }}
                  className="mt-4 w-full text-center text-[12px] transition-opacity hover:opacity-70"
                  style={{ color: "hsl(0 0% 100% / 0.40)" }}>
                  ← Retour à la connexion
                </button>
              </motion.div>
            ) : (
              <motion.form key="login-form"
                onSubmit={handleLogin(onLogin)}
                className="flex flex-col gap-4"
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.22 }}
              >
                <h2 className="text-[17px] font-medium mb-1 tracking-tight" style={{ color: "hsl(0 0% 100% / 0.90)" }}>
                  Espace conseillers
                </h2>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-medium tracking-wide" style={{ color: "hsl(0 0% 100% / 0.55)" }}>Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "hsl(0 0% 100% / 0.35)" }} />
                    <input type="email" placeholder="votre@email.com" className={inputBase} {...regLogin("email")} />
                  </div>
                  {loginErrors.email && <p className="text-[11px]" style={{ color: "hsl(0 80% 72%)" }}>{loginErrors.email.message}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-medium tracking-wide" style={{ color: "hsl(0 0% 100% / 0.55)" }}>Mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "hsl(0 0% 100% / 0.35)" }} />
                    <input type={showPw ? "text" : "password"} placeholder="••••••••" className={`${inputBase} pr-10`} {...regLogin("password")} />
                    <button type="button" onClick={() => setShowPw((v) => !v)}
                      aria-label={showPw ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-80"
                      style={{ color: "hsl(0 0% 100% / 0.35)" }}>
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {loginErrors.password && <p className="text-[11px]" style={{ color: "hsl(0 80% 72%)" }}>{loginErrors.password.message}</p>}
                </div>

                {globalError && (
                  <motion.p
                    className="text-[12px] py-2.5 px-3.5 rounded-xl"
                    style={{ background: "hsl(0 60% 18% / 0.60)", color: "hsl(0 80% 72%)", border: "1px solid hsl(0 60% 35% / 0.30)" }}
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  >
                    {globalError}
                  </motion.p>
                )}

                <button type="submit" disabled={loginPending}
                  className="mt-1 w-full py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 disabled:opacity-60 relative overflow-hidden"
                  style={{ background: "white", color: "hsl(224 60% 12%)" }}>
                  {loginPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-navy/20 border-t-navy/70 animate-spin" style={{ borderTopColor: "hsl(224 60% 14%)" }} />
                      Connexion…
                    </span>
                  ) : "Se connecter"}
                </button>

                <button type="button" onClick={() => { setResetMode(true); setGlobalError(""); }}
                  className="text-center text-[11px] transition-opacity hover:opacity-70"
                  style={{ color: "hsl(0 0% 100% / 0.36)" }}>
                  Mot de passe oublié ?
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="mt-6 text-center text-[11px] font-light" style={{ color: "hsl(0 0% 100% / 0.28)" }}>
            Problème ?{" "}
            <a href="mailto:kanti@adnfamily.com"
              className="transition-opacity hover:opacity-80"
              style={{ color: "hsl(0 0% 100% / 0.45)", textDecoration: "underline", textDecorationStyle: "dotted", textUnderlineOffset: "3px" }}>
              kanti@adnfamily.com
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
