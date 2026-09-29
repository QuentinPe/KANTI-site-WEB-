import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard, Inbox, BarChart2,
  FileText, Tags, BookOpen, Users, HelpCircle, UserSquare2, Scale,
  Image, Settings, ShieldCheck, ToggleLeft,
  LogOut, ExternalLink, Sun, Moon, Bell, Search, Menu, X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AdminThemeProvider, useAdminTheme } from "@/contexts/AdminThemeContext";
import { getLeads } from "@/lib/leadsService";
import { T_MUTED, T_PRIMARY, T_SECONDARY, INNER_BG, INNER_BORDER, C_BLUE, cA } from "@/lib/adminTheme";
import logoWhite from "@/assets/logo-kanti-white.png.asset.json";

// ── Sidebar nav groups ────────────────────────────────────────────────────────

const NAV_MAIN = [
  { to: "/admin",           icon: LayoutDashboard, label: "Vue d'ensemble", exact: true },
  { to: "/admin/leads",     icon: Inbox,           label: "Leads",          badge: true },
  { to: "/admin/analytics", icon: BarChart2,        label: "Rapports" },
];

const NAV_SITE = [
  { to: "/admin/articles",   icon: FileText,    label: "Articles" },
  { to: "/admin/categories", icon: Tags,         label: "Catégories" },
  { to: "/admin/ressources", icon: BookOpen,     label: "Ressources PDF" },
  { to: "/admin/cas-clients",icon: Users,        label: "Cas clients" },
  { to: "/admin/faq",        icon: HelpCircle,   label: "FAQ" },
  { to: "/admin/equipe",     icon: UserSquare2,  label: "Équipe" },
  { to: "/admin/legal",      icon: Scale,        label: "Mentions légales" },
];

const NAV_SETTINGS = [
  { to: "/admin/media",       icon: Image,        label: "Médiathèque" },
  { to: "/admin/settings",    icon: Settings,     label: "Paramètres & SEO" },
  { to: "/admin/acces",       icon: ShieldCheck,  label: "Accès" },
  { to: "/admin/maintenance", icon: ToggleLeft,   label: "Maintenance" },
];

// ── Sidebar nav item ──────────────────────────────────────────────────────────

function NavItem({
  to, icon: Icon, label, active, badge,
}: {
  to: string; icon: React.ElementType; label: string; active: boolean; badge?: number;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12.5px] font-medium transition-all duration-150"
      style={
        active
          ? { background: "hsl(214 55% 50% / 0.18)", color: "hsl(214 55% 75%)", }
          : { color: "hsl(0 0% 100% / 0.48)" }
      }
      onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = "hsl(0 0% 100% / 0.80)"; }}
      onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = "hsl(0 0% 100% / 0.48)"; }}
    >
      <Icon className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.75} />
      <span className="flex-1 truncate">{label}</span>
      {badge != null && badge > 0 && (
        <span
          className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none tabular-nums"
          style={{ background: "hsl(214 55% 50%)", color: "white" }}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}

function NavSection({ label }: { label: string }) {
  return (
    <p className="px-3 pt-5 pb-1.5 text-[9px] tracking-[0.28em] uppercase font-semibold"
      style={{ color: "hsl(0 0% 100% / 0.22)" }}>
      {label}
    </p>
  );
}

// ── Top bar ───────────────────────────────────────────────────────────────────

function TopBar({ newLeads, userEmail, onMenuToggle }: {
  newLeads: number; userEmail: string | undefined; onMenuToggle: () => void;
}) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <header
      className="h-14 flex items-center gap-4 px-6 flex-shrink-0"
      style={{ background: "hsl(0 0% 100%)", borderBottom: "1px solid var(--at-inner-border)", zIndex: 20 }}
    >
      {/* Mobile hamburger */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-1.5 rounded-lg transition-colors"
        style={{ color: T_SECONDARY }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = INNER_BG; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
        aria-label="Menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Date */}
      <p className="hidden md:block text-[12px] font-light capitalize" style={{ color: T_MUTED }}>
        {dateStr}
      </p>

      <div className="flex-1" />

      {/* Search — non-fonctionnel, aucun résultat simulé */}
      <div className="relative hidden sm:block">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: T_MUTED }} />
        <input
          type="search"
          placeholder="Rechercher…"
          className="pl-9 pr-4 py-2 rounded-lg text-[12.5px] outline-none transition-all"
          style={{
            background: INNER_BG,
            border: "1px solid var(--at-inner-border)",
            color: T_PRIMARY,
            width: 220,
          }}
          onFocus={(e) => {
            (e.target as HTMLInputElement).style.borderColor = "hsl(214 55% 50%)";
            (e.target as HTMLInputElement).style.boxShadow = "0 0 0 3px hsl(214 55% 50% / 0.12)";
          }}
          onBlur={(e) => {
            (e.target as HTMLInputElement).style.borderColor = "var(--at-inner-border)";
            (e.target as HTMLInputElement).style.boxShadow = "none";
          }}
        />
      </div>

      {/* Notification bell */}
      <div className="relative">
        <Link
          to="/admin/leads"
          className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
          style={{ color: T_SECONDARY }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = INNER_BG; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
        </Link>
        {newLeads > 0 && (
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full pointer-events-none"
            style={{ background: "hsl(5 58% 50%)" }}
          />
        )}
      </div>

      {/* User avatar */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-semibold flex-shrink-0"
          style={{ background: "#0B1830" }}
          aria-hidden
        >
          {userEmail?.charAt(0).toUpperCase() ?? "?"}
        </div>
        <p className="hidden lg:block text-[12px] font-medium truncate max-w-[140px]" style={{ color: T_PRIMARY }}>
          {userEmail}
        </p>
      </div>
    </header>
  );
}

// ── Layout inner ──────────────────────────────────────────────────────────────

function AdminLayoutInner() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useAdminTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: leads = [] } = useQuery({ queryKey: ["leads"], queryFn: getLeads });
  const newLeadsCount = leads.filter((l) => l.status === "nouveau").length;

  if (!user) return <Navigate to="/login" replace />;

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const isActive = (path: string, exact = false) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const sidebar = (
    <aside
      className="w-56 flex flex-col flex-shrink-0 h-full overflow-y-auto"
      style={{
        background: "#0B1830",
        borderRight: "1px solid hsl(0 0% 100% / 0.06)",
      }}
    >
      {/* Logo */}
      <div className="px-5 py-6 flex-shrink-0" style={{ borderBottom: "1px solid hsl(0 0% 100% / 0.07)" }}>
        <img src={logoWhite.url} alt="KANTI" className="h-5 w-auto" style={{ opacity: 0.9 }} />
        <p className="mt-1.5 text-[9px] tracking-[0.30em] uppercase font-semibold" style={{ color: "hsl(0 0% 100% / 0.28)" }}>
          Conseillers
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2.5 py-3">
        {NAV_MAIN.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            active={isActive(item.to, item.exact)}
            badge={item.badge ? newLeadsCount : undefined}
          />
        ))}

        <NavSection label="Gestion du site" />
        {NAV_SITE.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            active={isActive(item.to)}
          />
        ))}

        <NavSection label="Paramètres" />
        {NAV_SETTINGS.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            active={isActive(item.to)}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-2.5 py-3 flex-shrink-0" style={{ borderTop: "1px solid hsl(0 0% 100% / 0.07)" }}>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-medium transition-colors mb-1"
          style={{ color: "hsl(0 0% 100% / 0.38)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "hsl(0 0% 100% / 0.65)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "hsl(0 0% 100% / 0.38)"; }}
        >
          <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.75} />
          Voir le site
        </a>

        <button
          onClick={toggleTheme}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-medium transition-colors w-full mb-1"
          style={{ color: "hsl(0 0% 100% / 0.38)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "hsl(0 0% 100% / 0.65)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "hsl(0 0% 100% / 0.38)"; }}
        >
          {theme === "light"
            ? <><Moon className="w-3.5 h-3.5" strokeWidth={1.75} />Mode sombre</>
            : <><Sun className="w-3.5 h-3.5" strokeWidth={1.75} />Mode clair</>}
        </button>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-medium transition-colors w-full"
          style={{ color: "hsl(0 0% 100% / 0.38)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "hsl(5 58% 60%)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "hsl(0 0% 100% / 0.38)"; }}
        >
          <LogOut className="w-3.5 h-3.5" strokeWidth={1.75} />
          Déconnexion
        </button>
      </div>
    </aside>
  );

  return (
    <div data-admin="true" className="h-screen flex overflow-hidden" style={{ background: "var(--at-main-bg)" }}>
      {/* Sidebar desktop */}
      <div className="hidden lg:flex flex-col" style={{ width: 224 }}>
        {sidebar}
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0"
            style={{ background: "hsl(220 60% 8% / 0.50)" }}
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex flex-col" style={{ width: 224 }}>
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg z-10"
              style={{ color: "hsl(0 0% 100% / 0.50)" }}
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
            {sidebar}
          </div>
        </div>
      )}

      {/* Content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          newLeads={newLeadsCount}
          userEmail={user.email ?? undefined}
          onMenuToggle={() => setMobileOpen(true)}
        />
        <main
          className="flex-1 overflow-auto"
          style={{ background: "var(--at-main-bg)" }}
          aria-busy="false"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────

export default function AdminLayout() {
  return (
    <AdminThemeProvider>
      <AdminLayoutInner />
    </AdminThemeProvider>
  );
}
