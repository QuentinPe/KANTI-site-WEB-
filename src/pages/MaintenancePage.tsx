import { useRef, useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

/* ─── palette ─────────────────────────────────────────────────── */
const GOLD      = "#A88A46";
const GOLD_LITE = "#D4AE6B";
const GOLD_DEEP = "#7a5d1e";
const NAVY      = "#090f1c";
const NAVY_MID  = "#0d1629";

/* ─── game constants ──────────────────────────────────────────── */
const R          = 18;   // coin radius
const PAD_W      = 96;
const PAD_H      = 10;
const PAD_BOTTOM = 48;
const SPAWN_MS   = 1100;
const BASE_SPEED = 2.2;
const ACCEL      = 0.12;

interface Coin { id: number; x: number; y: number; speed: number }
interface Burst { id: number; x: number; y: number; t: number }

/* ─── canvas game ─────────────────────────────────────────────── */
function CoinGame({ onScore }: { onScore: (n: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const st = useRef({
    coins: [] as Coin[],
    bursts: [] as Burst[],
    paddleX: 0,
    mouseX: -1,
    score: 0,
    nextId: 0,
    lastSpawn: 0,
    rafId: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      st.current.paddleX = canvas.width / 2 - PAD_W / 2;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMouseMove = (e: MouseEvent) => {
      st.current.mouseX = e.clientX - canvas.getBoundingClientRect().left;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      st.current.mouseX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
    };
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });

    const draw = (ts: number) => {
      const s  = st.current;
      const W  = canvas.width;
      const H  = canvas.height;
      const py = H - PAD_BOTTOM;

      /* paddle lerp */
      if (s.mouseX >= 0) {
        const tx = Math.max(0, Math.min(W - PAD_W, s.mouseX - PAD_W / 2));
        s.paddleX += (tx - s.paddleX) * 0.18;
      }

      /* spawn */
      if (ts - s.lastSpawn > SPAWN_MS) {
        s.coins.push({
          id: s.nextId++,
          x:  R + Math.random() * (W - R * 2),
          y:  -R,
          speed: BASE_SPEED + s.score * ACCEL,
        });
        s.lastSpawn = ts;
      }

      /* clear */
      ctx.clearRect(0, 0, W, H);

      /* background */
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, NAVY);
      bg.addColorStop(1, NAVY_MID);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      /* grid */
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.025)";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 48) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 48) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }
      ctx.restore();

      /* coins */
      s.coins = s.coins.filter((coin) => {
        coin.y += coin.speed;

        const caught =
          coin.y + R >= py &&
          coin.y - R <= py + PAD_H &&
          coin.x >= s.paddleX - R * 0.5 &&
          coin.x <= s.paddleX + PAD_W + R * 0.5;

        if (caught) {
          s.score += 1;
          s.bursts.push({ id: s.nextId++, x: coin.x, y: py, t: ts });
          onScore(s.score);
          return false;
        }
        if (coin.y > H + R) return false;

        /* draw coin */
        const g = ctx.createRadialGradient(coin.x - 5, coin.y - 5, 2, coin.x, coin.y, R);
        g.addColorStop(0, GOLD_LITE);
        g.addColorStop(0.65, GOLD);
        g.addColorStop(1, GOLD_DEEP);
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, R, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
        ctx.strokeStyle = "rgba(255,220,130,0.35)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,0.90)";
        ctx.font = `bold 14px 'Georgia',serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("€", coin.x, coin.y + 0.5);
        return true;
      });

      /* burst particles */
      s.bursts = s.bursts.filter(({ id, x, y, t }) => {
        const age = ts - t;
        if (age > 600) return false;
        const alpha = 1 - age / 600;
        const count = 6;
        for (let i = 0; i < count; i++) {
          const angle = (Math.PI * 2 * i) / count;
          const dist  = (age / 600) * 32;
          ctx.beginPath();
          ctx.arc(
            x + Math.cos(angle) * dist,
            y + Math.sin(angle) * dist,
            3 * alpha,
            0,
            Math.PI * 2,
          );
          ctx.fillStyle = `rgba(168,138,70,${alpha})`;
          ctx.fill();
        }
        return true;
      });

      /* paddle */
      ctx.save();
      ctx.shadowColor = GOLD;
      ctx.shadowBlur  = 14;
      const pg = ctx.createLinearGradient(0, py, 0, py + PAD_H);
      pg.addColorStop(0, GOLD_LITE);
      pg.addColorStop(1, GOLD);
      ctx.beginPath();
      (ctx as CanvasRenderingContext2D & { roundRect?: (...a: unknown[]) => void })
        .roundRect?.(s.paddleX, py, PAD_W, PAD_H, 5) ??
        ctx.rect(s.paddleX, py, PAD_W, PAD_H);
      ctx.fillStyle = pg;
      ctx.fill();
      ctx.restore();

      s.rafId = requestAnimationFrame(draw);
    };

    st.current.rafId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(st.current.rafId);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("touchmove", onTouchMove);
      ro.disconnect();
    };
  }, [onScore]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full rounded-2xl"
      style={{ height: 260, touchAction: "none", cursor: "none" }}
    />
  );
}

/* ─── page ────────────────────────────────────────────────────── */
const LINKS = [
  { to: "/", label: "Accueil", desc: "Retour à l'accueil" },
  { to: "/contact", label: "Contact", desc: "Prendre rendez-vous" },
  { to: "/notre-methode", label: "Notre méthode", desc: "Notre approche" },
  { to: "/cabinet", label: "Le Cabinet", desc: "Qui sommes-nous ?" },
  { to: "/gestion-patrimoniale", label: "Expertise", desc: "Gestion patrimoniale" },
  { to: "/mentions-legales", label: "Mentions légales", desc: "Documents légaux" },
];

const MILESTONES = [
  { score: 5,  msg: "Bon œil. Les opportunités se saisissent vite." },
  { score: 10, msg: "Vous commencez à maîtriser le timing." },
  { score: 20, msg: "Profil investisseur confirmé." },
  { score: 35, msg: "Vous méritez un rendez-vous KANTI." },
  { score: 50, msg: "Score exceptionnel. Nos experts vous attendent." },
];

export default function MaintenancePage() {
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    try { return Number(localStorage.getItem("kanti-ms-hs") ?? 0); } catch { return 0; }
  });
  const [milestone, setMilestone] = useState<string | null>(null);
  const [prevMilestoneScore, setPrevMilestoneScore] = useState(0);
  const milestoneTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleScore = useCallback((n: number) => {
    setScore(n);
    setBestScore((prev) => {
      const next = Math.max(prev, n);
      try { localStorage.setItem("kanti-ms-hs", String(next)); } catch {}
      return next;
    });
    const hit = [...MILESTONES].reverse().find((m) => n >= m.score && n > prevMilestoneScore);
    if (hit) {
      setPrevMilestoneScore(n);
      setMilestone(hit.msg);
      if (milestoneTimer.current) clearTimeout(milestoneTimer.current);
      milestoneTimer.current = setTimeout(() => setMilestone(null), 3500);
    }
  }, [prevMilestoneScore]);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: NAVY, color: "white", fontFamily: "inherit" }}
    >
      {/* ── header ── */}
      <header className="flex items-center justify-between px-6 md:px-12 py-6">
        <Link to="/" className="flex items-center gap-3 group">
          <span
            className="font-heading font-light tracking-[0.25em] text-base uppercase"
            style={{ color: "hsl(0 0% 100% / 0.85)" }}
          >
            KANTI
          </span>
          <span
            className="h-px w-5 transition-all duration-300 group-hover:w-10"
            style={{ background: GOLD }}
          />
        </Link>
        <span
          className="text-[10px] tracking-[0.3em] uppercase font-medium px-3 py-1.5 rounded-full"
          style={{ background: "hsl(0 0% 100% / 0.06)", color: "hsl(0 0% 100% / 0.40)", border: "1px solid hsl(0 0% 100% / 0.08)" }}
        >
          Maintenance
        </span>
      </header>

      {/* ── hero ── */}
      <section className="flex-1 flex flex-col items-center px-6 pt-8 pb-6 max-w-3xl mx-auto w-full">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] tracking-[0.2em] uppercase font-medium mb-6"
            style={{ background: `${GOLD}1a`, color: GOLD_LITE, border: `1px solid ${GOLD}40` }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: GOLD }} />
            Page en cours de mise à jour
          </div>
          <h1
            className="font-heading font-light text-4xl md:text-5xl tracking-tight leading-[1.05] mb-5"
            style={{ textShadow: "0 2px 40px rgba(168,138,70,0.25)" }}
          >
            Revenez dans<br />
            <span className="italic" style={{ color: GOLD_LITE }}>quelques instants.</span>
          </h1>
          <p
            className="text-base font-light leading-relaxed max-w-md mx-auto"
            style={{ color: "hsl(0 0% 100% / 0.50)" }}
          >
            En attendant, défiez-vous avec notre mini-jeu. Déplacez votre souris pour attraper les opportunités.
          </p>
        </motion.div>

        {/* ── game ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="w-full relative mb-4"
        >
          {/* score bar */}
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-[9px] tracking-[0.25em] uppercase font-medium mb-0.5" style={{ color: "hsl(0 0% 100% / 0.30)" }}>Score</p>
                <p className="font-heading text-2xl font-light tabular-nums" style={{ color: GOLD_LITE }}>{score}</p>
              </div>
              <div>
                <p className="text-[9px] tracking-[0.25em] uppercase font-medium mb-0.5" style={{ color: "hsl(0 0% 100% / 0.30)" }}>Meilleur</p>
                <p className="font-heading text-2xl font-light tabular-nums" style={{ color: "hsl(0 0% 100% / 0.55)" }}>{bestScore}</p>
              </div>
            </div>
            <p className="text-[11px] font-light hidden sm:block" style={{ color: "hsl(0 0% 100% / 0.30)" }}>
              Déplacez votre souris · Tactile supporté
            </p>
          </div>

          {/* canvas */}
          <div
            className="w-full rounded-2xl overflow-hidden"
            style={{ border: "1px solid hsl(0 0% 100% / 0.08)", boxShadow: `0 0 60px -10px ${GOLD}30` }}
          >
            <CoinGame onScore={handleScore} />
          </div>

          {/* milestone toast */}
          <AnimatePresence>
            {milestone && (
              <motion.div
                key={milestone}
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap"
                style={{
                  background: `linear-gradient(90deg, ${GOLD_DEEP}, ${GOLD})`,
                  color: "white",
                  boxShadow: `0 8px 32px -6px ${GOLD}80`,
                  zIndex: 10,
                }}
              >
                {milestone}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── redirections ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          <p
            className="text-[10px] tracking-[0.28em] uppercase font-medium text-center mb-4"
            style={{ color: "hsl(0 0% 100% / 0.25)" }}
          >
            Explorer d'autres pages
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {LINKS.map((link, i) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  to={link.to}
                  className="group flex flex-col px-4 py-3.5 rounded-xl transition-all duration-300"
                  style={{
                    background: "hsl(0 0% 100% / 0.04)",
                    border: "1px solid hsl(0 0% 100% / 0.07)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "hsl(0 0% 100% / 0.08)";
                    (e.currentTarget as HTMLElement).style.borderColor = `${GOLD}50`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "hsl(0 0% 100% / 0.04)";
                    (e.currentTarget as HTMLElement).style.borderColor = "hsl(0 0% 100% / 0.07)";
                  }}
                >
                  <span
                    className="text-[10px] tracking-[0.22em] uppercase font-medium mb-0.5 transition-colors duration-300"
                    style={{ color: GOLD }}
                  >
                    {link.label}
                  </span>
                  <span
                    className="text-[13px] font-light transition-colors duration-300"
                    style={{ color: "hsl(0 0% 100% / 0.60)" }}
                  >
                    {link.desc}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── footer ── */}
      <footer className="px-6 md:px-12 py-5 flex items-center justify-between">
        <p className="text-[11px] font-light" style={{ color: "hsl(0 0% 100% / 0.22)" }}>
          12 rue Ferrere · 33000 Bordeaux
        </p>
        <a
          href="mailto:kanti@adnfamily.com"
          className="text-[11px] font-light transition-colors duration-300 hover:opacity-70"
          style={{ color: "hsl(0 0% 100% / 0.35)" }}
        >
          kanti@adnfamily.com
        </a>
      </footer>
    </div>
  );
}
