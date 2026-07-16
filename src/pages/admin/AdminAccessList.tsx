import { ShieldCheck, ExternalLink, Info } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const ADMIN_EMAILS = ["quentin@adnfamily.com", "m.delorme@adnfamily.com"];

export default function AdminAccessList() {
  const { user } = useAuth();

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-light tracking-tight" style={{ color: "hsl(224 55% 12%)" }}>
          Gestion des accès
        </h1>
        <p className="text-[13px] font-light mt-1" style={{ color: "hsl(224 15% 52%)" }}>
          Administrateurs autorisés à accéder à ce panneau
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 px-4 py-4 rounded-xl mb-8"
        style={{ background: "hsl(218 55% 42% / 0.07)", border: "1px solid hsl(218 55% 42% / 0.15)" }}>
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "hsl(218 50% 42%)" }} />
        <div>
          <p className="text-[13px] font-light leading-relaxed" style={{ color: "hsl(218 35% 32%)" }}>
            Les accès sont contrôlés par des <strong className="font-medium">policies RLS Supabase</strong>.
            Pour ajouter ou retirer un accès, modifiez les policies dans l'éditeur SQL Supabase.
            L'email de la session active est utilisé comme identifiant.
          </p>
          <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-1.5 mt-2 text-[12px] font-medium hover:underline"
            style={{ color: "hsl(218 50% 40%)" }}>
            Ouvrir Supabase Dashboard
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Liste des admins */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1px solid hsl(224 20% 12% / 0.08)" }}>
        <div className="px-6 py-4" style={{ borderBottom: "1px solid hsl(224 20% 12% / 0.07)", background: "hsl(220 25% 98%)" }}>
          <h2 className="text-[14px] font-medium" style={{ color: "hsl(224 40% 28%)" }}>
            Administrateurs actifs — {ADMIN_EMAILS.length}
          </h2>
        </div>
        <div>
          {ADMIN_EMAILS.map((email, i) => (
            <div key={email} className="flex items-center gap-4 px-6 py-4"
              style={{ borderBottom: i < ADMIN_EMAILS.length - 1 ? "1px solid hsl(224 20% 12% / 0.06)" : "none" }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: email === user?.email ? "hsl(142 55% 38% / 0.12)" : "hsl(224 20% 92%)" }}>
                <ShieldCheck className="w-4 h-4" style={{ color: email === user?.email ? "hsl(142 50% 35%)" : "hsl(224 20% 52%)" }} strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-light" style={{ color: "hsl(224 35% 22%)" }}>{email}</p>
                {email === user?.email && (
                  <span className="text-[10px] font-medium tracking-wide" style={{ color: "hsl(142 50% 38%)" }}>
                    Session active
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-[0.2em] uppercase font-medium px-2.5 py-1 rounded-full"
                style={{ background: "hsl(224 55% 18% / 0.08)", color: "hsl(224 35% 40%)" }}>
                Admin
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions SQL */}
      <div className="mt-6 rounded-2xl overflow-hidden" style={{ background: "hsl(224 55% 8%)" }}>
        <div className="px-5 py-3" style={{ borderBottom: "1px solid hsl(0 0% 100% / 0.08)" }}>
          <p className="text-[11px] tracking-[0.2em] uppercase font-medium" style={{ color: "hsl(0 0% 100% / 0.35)" }}>
            Ajouter un accès — SQL Supabase
          </p>
        </div>
        <pre className="px-5 py-4 text-[12px] leading-relaxed overflow-x-auto" style={{ color: "hsl(142 60% 70%)", fontFamily: "monospace" }}>
{`-- Remplacez les emails dans chaque policy
-- Tables concernées : articles, ressources,
-- cas_clients, faq, team_members, legal_content,
-- leads, site_settings

-- Exemple pour leads :
DROP POLICY "admin read" ON leads;
CREATE POLICY "admin read" ON leads FOR SELECT
  USING (auth.jwt()->>'email' IN (
    'quentin@adnfamily.com',
    'm.delorme@adnfamily.com',
    'nouvel.admin@email.com'  -- ajouter ici
  ));`}
        </pre>
      </div>
    </div>
  );
}
