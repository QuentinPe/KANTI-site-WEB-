import { Link } from "react-router-dom";
import { usePageMaintenance } from "@/hooks/usePageMaintenance";

function MaintenancePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center"
      style={{ background: "hsl(220 30% 97%)" }}>
      <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 font-medium mb-4">
        KANTI · Maintenance
      </p>
      <h1 className="font-heading text-4xl font-light text-foreground mb-4 tracking-tight">
        Page temporairement indisponible
      </h1>
      <p className="text-foreground/55 font-light max-w-md leading-relaxed mb-8">
        Cette page est momentanément en cours de mise à jour. Revenez dans quelques instants.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background text-sm font-medium tracking-wide hover:opacity-85 transition-opacity"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}

export default function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  const isDisabled = usePageMaintenance();
  if (isDisabled) return <MaintenancePage />;
  return <>{children}</>;
}
