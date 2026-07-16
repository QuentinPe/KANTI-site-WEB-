import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: { overlay: false },
    proxy: {
      "/__l5e/assets-v1": {
        target: "https://kanti-patrimoine-courtage.lovable.app",
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
    dedupe: [
      "react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime",
      "@tanstack/react-query", "@tanstack/query-core",
    ],
  },
  build: {
    target: "esnext",
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Stable vendor chunks → long-term browser caching
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          // Framer Motion — used by many pages, should be shared + cached
          if (id.includes("framer-motion")) return "vendor-motion";
          // Supabase client
          if (id.includes("@supabase")) return "vendor-supabase";
          // Tiptap rich editor — heavy, only admin pages
          if (id.includes("@tiptap") || id.includes("prosemirror")) return "vendor-tiptap";
          // PDF libs — heavy, only specific pages
          if (id.includes("pdfjs-dist") || id.includes("jspdf") || id.includes("mammoth")) return "vendor-pdf";
          // Radix UI — many components, benefits from shared chunk
          if (id.includes("@radix-ui")) return "vendor-radix";
          // TanStack Query
          if (id.includes("@tanstack")) return "vendor-query";
          // Recharts + D3 (chart simulator pages)
          if (id.includes("recharts") || id.includes("/d3-") || id.includes("d3/")) return "vendor-recharts";
          // Lucide icons — large set, shared across all pages
          if (id.includes("lucide-react")) return "vendor-lucide";
          // React ecosystem (react-router, react-hook-form, zod…)
          if (
            id.includes("/react/") || id.includes("/react-dom/") ||
            id.includes("react-router") || id.includes("react-hook-form") ||
            id.includes("/zod/") || id.includes("react-helmet")
          ) return "vendor-react";
        },
      },
    },
  },
}));
