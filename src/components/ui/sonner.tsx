import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      containerAriaLabel="Notifications"
      style={{ zIndex: 999999 }}
      toastOptions={{
        style: {
          background: "hsl(224 55% 10% / 0.92)",
          backdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid hsl(0 0% 100% / 0.10)",
          color: "hsl(0 0% 100% / 0.88)",
          boxShadow: "0 20px 60px -10px hsl(0 0% 0% / 0.40), inset 0 1px 0 hsl(0 0% 100% / 0.12)",
          borderRadius: "14px",
          fontSize: "13px",
        },
        classNames: {
          toast: "group toast",
          description: "group-[.toast]:opacity-60",
          actionButton: "group-[.toast]:bg-white group-[.toast]:text-[hsl(224_60%_12%)]",
          cancelButton: "group-[.toast]:opacity-50",
          success: "group-[.toast]:text-white",
          error: "group-[.toast]:text-white",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
