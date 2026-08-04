// ── Pre-React crash reporter ─────────────────────────────────────────────────
// Catches any error that happens before React mounts and shows it in the DOM.
window.addEventListener("error", (e) => {
  const root = document.getElementById("root");
  if (root && !root.innerHTML) {
    root.innerHTML = `<div style="padding:32px;font-family:monospace;background:#0b1220;color:#f87171;min-height:100vh">
      <b style="font-size:16px">Erreur au démarrage</b><br/><br/>
      <pre style="white-space:pre-wrap;font-size:11px;background:#1e293b;padding:16px;border-radius:8px;color:#fca5a5">${e.message}\n\n${e.filename}:${e.lineno}\n\n${e.error?.stack ?? ""}</pre>
    </div>`;
  }
});

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./lib/posthog";
// Latin-only subsets · saves ~200 kB vs full subset (removes devanagari/latin-ext)
import "@fontsource/fraunces/latin-400.css";
import "@fontsource/fraunces/latin-500.css";
import "@fontsource/fraunces/latin-600.css";
import "@fontsource/fraunces/latin-400-italic.css";
import "@fontsource/fraunces/latin-600-italic.css";
import "@fontsource/poppins/latin-300.css";
import "@fontsource/poppins/latin-400.css";
import "@fontsource/poppins/latin-500.css";
import "@fontsource/poppins/latin-600.css";

createRoot(document.getElementById("root")!).render(<App />);
