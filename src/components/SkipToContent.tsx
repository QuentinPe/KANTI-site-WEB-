/**
 * Skip-to-content link for keyboard users.
 * Hidden until focused, then jumps to the #main landmark.
 */
export default function SkipToContent() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-5 focus:py-3 focus:rounded-full focus:bg-foreground focus:text-background focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-[hsl(var(--electric))]"
    >
      Aller au contenu
    </a>
  );
}