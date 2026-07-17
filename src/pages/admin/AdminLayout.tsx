import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FileText, LogOut, Plus, BookOpen, Users, HelpCircle, UserSquare2, Scale, LayoutDashboard, Inbox, Settings, Image, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getLeads } from "@/lib/leadsService";
import logoWhite from "@/assets/logo-kanti-white.png.asset.json";

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const { data: leads = [] } = useQuery({ queryKey: ["leads"], queryFn: getLeads });
  const newLeadsCount = leads.filter((l) => l.status === "nouveau" || l.status === "appele").length;

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen flex" style={{ background: "hsl(220 25% 97%)" }}>
      {/* Sidebar */}
      <aside
        className="w-64 flex flex-col flex-shrink-0"
        style={{
          background: "hsl(224 55% 10%)",
          borderRight: "1px solid hsl(0 0% 100% / 0.06)",
        }}
      >
        {/* Logo */}
        <div className="px-6 py-7 border-b" style={{ borderColor: "hsl(0 0% 100% / 0.08)" }}>
          <img src={logoWhite.url} alt="KANTI" className="h-6 w-auto" style={{ opacity: 0.85 }} />
          <p className="mt-1.5 text-[10px] tracking-[0.28em] uppercase font-medium" style={{ color: "hsl(0 0% 100% / 0.35)" }}>
            Administration
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          <NavItem
            to="/admin"
            icon={<LayoutDashboard className="w-4 h-4" />}
            label="Tableau de bord"
            active={location.pathname === "/admin"}
          />
          <NavItem
            to="/admin/leads"
            icon={<Inbox className="w-4 h-4" />}
            label="Leads"
            active={isActive("/admin/leads")}
            badge={newLeadsCount || undefined}
          />

          <p className="px-3 pb-2 pt-5 text-[9px] tracking-[0.3em] uppercase font-medium" style={{ color: "hsl(0 0% 100% / 0.22)" }}>
            Contenu
          </p>
          <NavItem
            to="/admin/articles"
            icon={<FileText className="w-4 h-4" />}
            label="Articles"
            active={isActive("/admin/articles")}
          />
          <NavItem
            to="/admin/ressources"
            icon={<BookOpen className="w-4 h-4" />}
            label="Ressources PDF"
            active={isActive("/admin/ressources")}
          />

          <p className="px-3 pb-2 pt-5 text-[9px] tracking-[0.3em] uppercase font-medium" style={{ color: "hsl(0 0% 100% / 0.22)" }}>
            Site
          </p>
          <NavItem
            to="/admin/cas-clients"
            icon={<Users className="w-4 h-4" />}
            label="Cas clients"
            active={isActive("/admin/cas-clients")}
          />
          <NavItem
            to="/admin/faq"
            icon={<HelpCircle className="w-4 h-4" />}
            label="FAQ"
            active={isActive("/admin/faq")}
          />
          <NavItem
            to="/admin/equipe"
            icon={<UserSquare2 className="w-4 h-4" />}
            label="Équipe"
            active={isActive("/admin/equipe")}
          />
          <NavItem
            to="/admin/legal"
            icon={<Scale className="w-4 h-4" />}
            label="Mentions légales"
            active={isActive("/admin/legal")}
          />

          <p className="px-3 pb-2 pt-5 text-[9px] tracking-[0.3em] uppercase font-medium" style={{ color: "hsl(0 0% 100% / 0.22)" }}>
            Réglages
          </p>
          <NavItem
            to="/admin/media"
            icon={<Image className="w-4 h-4" />}
            label="Médiathèque"
            active={isActive("/admin/media")}
          />
          <NavItem
            to="/admin/settings"
            icon={<Settings className="w-4 h-4" />}
            label="Paramètres & SEO"
            active={isActive("/admin/settings")}
          />
          <NavItem
            to="/admin/acces"
            icon={<ShieldCheck className="w-4 h-4" />}
            label="Accès"
            active={isActive("/admin/acces")}
          />
        </nav>

        {/* Quick actions */}
        <div className="px-3 pb-4 space-y-2">
          <Link
            to="/admin/articles/new"
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-[12px] font-medium transition-all duration-200"
            style={{ background: "hsl(0 0% 100% / 0.10)", color: "hsl(0 0% 100% / 0.80)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(0 0% 100% / 0.16)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(0 0% 100% / 0.10)"; }}
          >
            <Plus className="w-3.5 h-3.5" />
            Nouvel article
          </Link>
          <Link
            to="/admin/ressources/new"
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-[12px] font-medium transition-all duration-200"
            style={{ background: "hsl(0 0% 100% / 0.06)", color: "hsl(0 0% 100% / 0.55)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(0 0% 100% / 0.10)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(0 0% 100% / 0.06)"; }}
          >
            <Plus className="w-3.5 h-3.5" />
            Nouvelle ressource
          </Link>
        </div>

        {/* User + logout */}
        <div className="px-4 py-5 border-t" style={{ borderColor: "hsl(0 0% 100% / 0.08)" }}>
          <p className="text-[11px] font-light mb-3 truncate" style={{ color: "hsl(0 0% 100% / 0.40)" }}>
            {user?.email}
          </p>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-[12px] font-medium transition-opacity hover:opacity-70"
            style={{ color: "hsl(0 0% 100% / 0.50)" }}
          >
            <LogOut className="w-3.5 h-3.5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

function NavItem({
  to, icon, label, active, badge,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  badge?: number;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200"
      style={active
        ? { background: "hsl(0 0% 100% / 0.14)", color: "hsl(0 0% 100% / 0.90)" }
        : { color: "hsl(0 0% 100% / 0.50)" }}
      onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = "hsl(0 0% 100% / 0.75)"; }}
      onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = "hsl(0 0% 100% / 0.50)"; }}
    >
      {icon}
      {label}
      {badge != null && badge > 0 && (
        <span
          className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none tabular-nums"
          style={{ background: "hsl(38 75% 44%)", color: "white" }}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}
