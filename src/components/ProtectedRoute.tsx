import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { getAdminUsers } from "@/lib/adminUsersService";

// Bootstrap list · used only when the admin_users table doesn't exist yet.
const BOOTSTRAP_EMAILS = [import.meta.env.VITE_BOOTSTRAP_ADMIN_EMAIL].filter(Boolean) as string[];

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  const { data: adminUsers, isLoading: adminsLoading, isError } = useQuery({
    queryKey: ["admin-users"],
    queryFn: getAdminUsers,
    enabled: Boolean(user),
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });

  // Block while Supabase Auth is resolving OR while the admin list is being fetched
  if (loading || (user && adminsLoading)) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: "hsl(224 60% 6%)" }}>
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white/80 animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  // If the admin_users table doesn't exist yet (isError), fall back to the bootstrap list.
  // Once the table exists and contains rows, the real list takes over automatically.
  const allowedEmails = adminUsers
    ? adminUsers.filter((a) => a.active).map((a) => a.email)
    : isError
      ? BOOTSTRAP_EMAILS
      : [];

  if (!allowedEmails.includes(user.email ?? "")) return <Navigate to="/" replace />;

  return <>{children}</>;
}
