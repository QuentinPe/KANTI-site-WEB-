import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileHeader from "./MobileHeader";
import MobileStickyCTA from "./MobileStickyCTA";

/**
 * Globally mounts the mobile-first navigation + sticky CTA on every page
 * when the viewport is below the md breakpoint. The desktop <Header /> is
 * hidden on mobile via CSS (see index.css → header.hide-on-mobile rule),
 * so each page keeps its desktop tree intact while gaining a true
 * mobile-first chrome.
 *
 * - Skipped on the homepage because <HomeMobile /> already mounts its own
 *   MobileHeader + MobileStickyCTA (avoids double mount).
 * - Skipped on /merci to keep the confirmation page fully serene.
 */
export default function MobileChrome() {
  const isMobile = useIsMobile();
  const { pathname } = useLocation();

  if (!isMobile) return null;
  if (pathname === "/" || pathname === "/merci") return null;

  return (
    <>
      <MobileHeader />
      <MobileStickyCTA />
    </>
  );
}