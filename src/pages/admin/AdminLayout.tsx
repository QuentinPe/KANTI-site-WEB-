import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { FileText, LogOut, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import logoWhite from "@/assets/logo-kanti-white.png.asset.json";

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + "/");

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
            icon={<FileText className="w-4 h-4" />}
            label="Articles"
            active={isActive("/admin")}
          />
        </nav>

        {/* Quick action */}
        <div className="px-3 pb-4">
          <Link
            to="/admin/articles/new"
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200"
            style={{ background: "hsl(0 0% 100% / 0.10)", color: "hsl(0 0% 100% / 0.80)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(0 0% 100% / 0.16)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(0 0% 100% / 0.10)"; }}
          >
            <Plus className="w-4 h-4" />
            Nouvel article
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

function NavItem({ to, icon, label, active }: { to: string; icon: React.ReactNode; label: string; active: boolean }) {
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
    </Link>
  );
}
