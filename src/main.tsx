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
