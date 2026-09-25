import { lazy, Suspense } from "react";
import { usePageMaintenance } from "@/hooks/usePageMaintenance";

const MaintenancePage = lazy(() => import("@/pages/MaintenancePage"));

export default function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  const isDisabled = usePageMaintenance();
  if (isDisabled) return <Suspense fallback={null}><MaintenancePage /></Suspense>;
  return <>{children}</>;
}
