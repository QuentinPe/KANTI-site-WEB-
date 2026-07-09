import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import logoWhite from "@/assets/logo-kanti-white.png.asset.json";

const ADMIN_EMAILS = ["quentin@adnfamily.com", "m.delorme@adnfamily.com"];

const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(6, "Minimum 6 caractères"),
});

const signupSchema = loginSchema.extend({
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirm"],
});

type LoginData = z.infer<typeof loginSchema>;
type SignupData = z.infer<typeof signupSchema>;

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

function FieldWrapper({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-medium tracking-wide" style={{ color: "hsl(0 0% 100% / 0.55)" }}>
        {label}
      </label>
      {children}
      {error && <p className="text-[11px]" style={{ color: "hsl(0 80% 72%)" }}>{error}</p>}
    </div>
  );
}

function InputField({ icon, type = "text", showToggle, onToggle, ...props }: {
  icon: React.ReactNode;
  type?: string;
  showToggle?: boolean;
  onToggle?: () => void;
  [k: string]: unknown;
}) {
  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "hsl(0 0% 100% / 0.35)" }}>
        {icon}
      </span>
      <input
        type={type}
        className="w-full pl-10 pr-10 py-2.5 rounded-xl text-[14px] outline-none transition-all duration-200"
        style={{
          background: "hsl(0 0% 100% / 0.06)",
          border: "1px solid hsl(0 0% 100% / 0.12)",
          color: "hsl(0 0% 100% / 0.90)",
        }}
        onFocus={(e) => {
          (e.target as HTMLElement).style.borderColor = "hsl(0 0% 100% / 0.30)";
          (e.target as HTMLElement).style.background = "hsl(0 0% 100% / 0.09)";
        }}
        onBlur={(e) => {
          (e.target as HTMLElement).style.borderColor = "hsl(0 0% 100% / 0.12)";
          (e.target as HTMLElement).style.background = "hsl(0 0% 100% / 0.06)";
        }}
        {...props}
      />
      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-80"
          style={{ color: "hsl(0 0% 100% / 0.35)" }}
        >
          {type === "password" ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}

export default function LoginPage() {
  const { signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [resetMode, setResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const loginForm = useForm<LoginData>({ resolver: zodResolver(loginSchema) });
  const signupForm = useForm<SignupData>({ resolver: zodResolver(signupSchema) });

  const onLogin = async (data: LoginData) => {
    setGlobalError("");
    const { error } = await signIn(data.email, data.password);
    if (error) {
      setGlobalError(
        error.message.includes("Invalid login") || error.message.includes("invalid_credentials")
          ? "Email ou mot de passe incorrect."
          : error.message.includes("Email not confirmed")
          ? "Vérifiez votre email avant de vous connecter."
          : "Une erreur est survenue. Réessayez."
      );
      return;
    }
    navigate(ADMIN_EMAILS.includes(data.email) ? "/admin" : "/");
  };

  const onSignup = async (data: SignupData) => {
    setGlobalError("");
    const { error } = await signUp(data.email, data.password);
    if (error) {
      setGlobalError(
        error.message.includes("already registered")
          ? "Un compte existe déjà avec cet email."
          : "Une erreur est survenue. Réessayez."
      );
      return;
    }
    setSuccessMsg("Compte créé ! Vérifiez votre boîte email pour confirmer votre adresse.");
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
      style={{
        background: "linear-gradient(145deg, hsl(224 60% 7%) 0%, hsl(222 50% 12%) 100%)",
      }}
    >
      {/* Grain overlay */}
      <div
        aria-hidden
        className="fixed inset-0 opacity-[0.030] pointer-events-none"
        style={{ backgroundImage: GRAIN, backgroundSize: "200px" }}
      />

      {/* Back to site */}
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
        {/* Grain inside card */}
        <div aria-hidden className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: GRAIN, backgroundSize: "200px" }} />

        <div className="p-7">
          {/* Header */}
          <div className="flex items-center gap-3 mb-7">
            <img src={logoWhite.url} alt="KANTI" className="h-6 w-auto" style={{ opacity: 0.88 }} />
          </div>
          <div className="mb-6" style={{ height: 1, background: "hsl(0 0% 100% / 0.08)" }} />

          <AnimatePresence mode="wait">
            {resetMode ? (
              <motion.div key="reset"
                initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-[18px] font-medium mb-1 tracking-tight" style={{ color: "hsl(0 0% 100% / 0.90)" }}>
                  Réinitialisation
                </h2>
                <p className="text-[13px] font-light mb-6" style={{ color: "hsl(0 0% 100% / 0.45)" }}>
                  Entrez votre email pour recevoir un lien de réinitialisation.
                </p>
                {resetSent ? (
                  <p className="text-[13px] py-3 px-4 rounded-xl" style={{ background: "hsl(142 60% 18% / 0.50)", color: "hsl(142 60% 75%)" }}>
                    Email envoyé ! Vérifiez votre boîte de réception.
                  </p>
                ) : (
                  <>
                    <FieldWrapper label="Email">
                      <InputField
                        icon={<Mail className="w-4 h-4" />}
                        type="email"
                        placeholder="votre@email.com"
                        value={resetEmail}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setResetEmail(e.target.value)}
                      />
                    </FieldWrapper>
                    {globalError && (
                      <p className="text-[12px] mt-3" style={{ color: "hsl(0 80% 72%)" }}>{globalError}</p>
                    )}
                    <button
                      onClick={onReset}
                      className="mt-5 w-full py-2.5 rounded-xl text-[14px] font-medium transition-opacity hover:opacity-80"
                      style={{ background: "hsl(0 0% 100%)", color: "hsl(224 60% 12%)" }}
                    >
                      Envoyer le lien
                    </button>
                  </>
                )}
                <button
                  onClick={() => { setResetMode(false); setGlobalError(""); setResetSent(false); }}
                  className="mt-4 w-full text-center text-[12px] transition-opacity hover:opacity-70"
                  style={{ color: "hsl(0 0% 100% / 0.40)" }}
                >
                  ← Retour à la connexion
                </button>
              </motion.div>
            ) : (
              <motion.div key="auth"
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.25 }}
              >
                {/* Tabs */}
                <div className="flex rounded-xl p-1 mb-6" style={{ background: "hsl(0 0% 100% / 0.06)" }}>
                  {(["login", "signup"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => { setTab(t); setGlobalError(""); setSuccessMsg(""); }}
                      className="flex-1 py-2 rounded-[10px] text-[13px] font-medium transition-all duration-200"
                      style={tab === t
                        ? { background: "hsl(0 0% 100% / 0.14)", color: "hsl(0 0% 100% / 0.92)" }
                        : { color: "hsl(0 0% 100% / 0.42)" }}
                    >
                      {t === "login" ? "Se connecter" : "Créer un compte"}
                    </button>
                  ))}
                </div>

                {successMsg ? (
                  <div className="py-4 px-5 rounded-xl text-[13px] font-light leading-relaxed"
                    style={{ background: "hsl(142 60% 18% / 0.50)", color: "hsl(142 60% 75%)" }}>
                    {successMsg}
                    <button
                      onClick={() => { setTab("login"); setSuccessMsg(""); }}
                      className="block mt-3 text-[12px] underline underline-offset-2 opacity-80 hover:opacity-100"
                    >
                      Se connecter maintenant
                    </button>
                  </div>
                ) : tab === "login" ? (
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="flex flex-col gap-4">
                    <FieldWrapper label="Email" error={loginForm.formState.errors.email?.message}>
                      <InputField
                        icon={<Mail className="w-4 h-4" />}
                        type="email"
                        placeholder="votre@email.com"
                        {...loginForm.register("email")}
                      />
                    </FieldWrapper>
                    <FieldWrapper label="Mot de passe" error={loginForm.formState.errors.password?.message}>
                      <InputField
                        icon={<Lock className="w-4 h-4" />}
                        type={showPw ? "text" : "password"}
                        placeholder="••••••••"
                        showToggle
                        onToggle={() => setShowPw((v) => !v)}
                        {...loginForm.register("password")}
                      />
                    </FieldWrapper>

                    {globalError && (
                      <p className="text-[12px] py-2 px-3 rounded-lg" style={{ background: "hsl(0 60% 20% / 0.50)", color: "hsl(0 80% 72%)" }}>
                        {globalError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={loginForm.formState.isSubmitting}
                      className="mt-1 w-full py-2.5 rounded-xl text-[14px] font-medium transition-opacity disabled:opacity-60"
                      style={{ background: "hsl(0 0% 100%)", color: "hsl(224 60% 12%)" }}
                    >
                      {loginForm.formState.isSubmitting ? "Connexion…" : "Se connecter"}
                    </button>

                    <button
                      type="button"
                      onClick={() => { setResetMode(true); setGlobalError(""); }}
                      className="text-center text-[11px] transition-opacity hover:opacity-70"
                      style={{ color: "hsl(0 0% 100% / 0.36)" }}
                    >
                      Mot de passe oublié ?
                    </button>
                  </form>
                ) : (
                  <form onSubmit={signupForm.handleSubmit(onSignup)} className="flex flex-col gap-4">
                    <FieldWrapper label="Email" error={signupForm.formState.errors.email?.message}>
                      <InputField
                        icon={<Mail className="w-4 h-4" />}
                        type="email"
                        placeholder="votre@email.com"
                        {...signupForm.register("email")}
                      />
                    </FieldWrapper>
                    <FieldWrapper label="Mot de passe" error={signupForm.formState.errors.password?.message}>
                      <InputField
                        icon={<Lock className="w-4 h-4" />}
                        type={showPw ? "text" : "password"}
                        placeholder="••••••••"
                        showToggle
                        onToggle={() => setShowPw((v) => !v)}
                        {...signupForm.register("password")}
                      />
                    </FieldWrapper>
                    <FieldWrapper label="Confirmer le mot de passe" error={signupForm.formState.errors.confirm?.message}>
                      <InputField
                        icon={<Lock className="w-4 h-4" />}
                        type={showConfirm ? "text" : "password"}
                        placeholder="••••••••"
                        showToggle
                        onToggle={() => setShowConfirm((v) => !v)}
                        {...signupForm.register("confirm")}
                      />
                    </FieldWrapper>

                    {globalError && (
                      <p className="text-[12px] py-2 px-3 rounded-lg" style={{ background: "hsl(0 60% 20% / 0.50)", color: "hsl(0 80% 72%)" }}>
                        {globalError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={signupForm.formState.isSubmitting}
                      className="mt-1 w-full py-2.5 rounded-xl text-[14px] font-medium transition-opacity disabled:opacity-60"
                      style={{ background: "hsl(0 0% 100%)", color: "hsl(224 60% 12%)" }}
                    >
                      {signupForm.formState.isSubmitting ? "Création…" : "Créer mon compte"}
                    </button>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
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
