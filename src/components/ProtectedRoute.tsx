import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { getAdminUsers } from "@/lib/adminUsersService";

const FALLBACK_EMAILS = [
  "quentin@adnfamily.com",
  "m.delorme@adnfamily.com",
  "t.robert@adnfamily.com",
];

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  const { data: adminUsers, isLoading: adminsLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: getAdminUsers,
    enabled: Boolean(user),
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });

  // Only block on Supabase Auth loading — never on the admin list fetch
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: "hsl(224 60% 6%)" }}>
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white/80 animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  // Use dynamic list once loaded; fall back to hardcoded list while loading or on error
  const allowedEmails =
    !adminsLoading && adminUsers && adminUsers.length > 0
      ? adminUsers.filter((a) => a.active).map((a) => a.email)
      : FALLBACK_EMAILS;

  if (!allowedEmails.includes(user.email ?? "")) return <Navigate to="/" replace />;

  return <>{children}</>;
}
