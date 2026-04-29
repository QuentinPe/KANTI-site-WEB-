
# Mobile-first premium redesign

The current site adapts the desktop layout to small screens. This plan rebuilds the mobile experience as a first-class design — not a shrunken desktop. Each section gets a dedicated mobile composition, with editorial spacing, generous tap targets, lighter motion, and a frictionless conversion path.

The desktop experience is preserved untouched; mobile renders a separate component tree below the `md` breakpoint (≤767 px).

---

## Design principles applied to every section

- Single column, 24 px gutters, 12 px baseline rhythm
- Body 16–17 px, line-height 1.55 ; titles in `font-heading` light, 32–40 px max
- Tap targets ≥ 48 px, minimum 12 px between any two
- Max 1 image per fold, lazy + `decoding="async"`, no scroll-driven canvas on mobile
- Reveals limited to a single fade+rise (12 px, 500 ms) — no plaster, no split-text-by-char on mobile
- Shorter copy: a hero sub-line capped at ~110 chars, body paragraphs ≤ 3 lines
- Trust signals condensed to a horizontal scroll-snap row (ORIAS · CNCGP · 15 ans · 500 familles)

---

## New / rewritten components

### 1. `MobileHeader` (new, replaces `Header` below md)
- Slim top bar: KANTI wordmark left, single icon button right opening a full-screen sheet
- Sheet: large 22 px links, expertises as an accordion, primary CTA pinned at the bottom safe-area
- No nav-unfurl animation, no hover-bubble layoutId logic on touch

### 2. `MobileStickyCTA` (new)
- Appears after hero exits viewport, hides on scroll-down, reveals on scroll-up
- Bottom safe-area pill: "Prendre rendez-vous" (primary) + phone icon (tel:)
- Discreet: 56 px tall, soft glass, dismissible per session

### 3. `HeroMobile` (new, replaces `HeroSticky`/`Hero` below md)
- Static optimised JPEG (no 121-frame canvas)
- Eyebrow chip · H1 (4 lines max) · 2-line lede · single full-width primary CTA · ghost secondary
- Trust row scroll-snaps horizontally
- Removes cursor-tracked orb, ambient blobs, animated gradient text on mobile

### 4. `IdentificationMobile` (new)
- Replaces the rotating wheel (heavy, hard on touch)
- Vertical 01 → 06 timeline with sticky number, 1 card per step, swipe optional via scroll-snap

### 5. `ExpertisesMobile` (new, replaces `ExpertisesPinned`)
- Removes pinned horizontal scroll
- Native vertical stack of 4 large cards (image top, title, 2-line summary, "Découvrir" link)
- One card per fold, scroll-snap-y for an editorial pacing

### 6. `MethodeMobile` (new, replaces `MethodePinned`)
- 4-step vertical journey, large step number, short title, 2-line description
- Sticky CTA at the end of the section

### 7. `ActualitesMobile` (new)
- Featured article full-width, then horizontal scroll-snap carousel of side articles
- Removes the scroll-driven spotlight glow on mobile

### 8. `CTAFinalMobile` (new, replaces canvas version)
- Static dark JPEG poster, no 121-frame scrubbing
- Title · short copy · primary CTA · contact card collapsed into a clean list
- Section height = auto (drops the `320vh` pin)

### 9. Lighter passes on existing sections
- `Promesse`, `About`, `HomeCasClients`, `HomeProfilRisque`, `Equipe`, `Confiance`, `HomeFAQ`: tighten mobile padding, enlarge tap targets, reduce font sizes, single column, remove decorative blobs

### 10. Section reordering on mobile (conversion-focused)
```text
Hero
Identification (problem)
Promesse (answer)
Expertises (what we do)
Methode (how)
Confiance (proof: ORIAS/CNCGP/chiffres)
HomeCasClients (social proof)
Equipe (human)
Actualites
HomeFAQ
CTAFinal
```
About moves into Equipe on mobile to reduce length.

---

## Routing logic

`Index.tsx` uses `useIsMobile()` to render either the desktop tree (unchanged) or the new `<HomeMobile />` tree. Each new mobile component lives in `src/components/mobile/`. No desktop component is modified except for minor tailwind class additions where shared.

---

## Performance

- No frame sequences on mobile (`HeroSticky` and `CTAFinal` already gate on `useIsMobile`, but the mobile fallback still ships heavy `Hero`. The new `HeroMobile` ships ~1 image)
- `PremiumCursor`, `ScrollProgressRail`, `PlasterReveal`, `AmbientParticles` disabled on mobile
- Lenis smooth scroll kept but with `lerp` softened on touch

---

## Out of scope

- Desktop layout changes
- Copywriting beyond shortening — French tone preserved
- New pages (only `/` is rebuilt; inner pages get a follow-up pass if approved)

---

## Deliverable order

1. Mobile header + sticky CTA + routing switch in `Index.tsx`
2. `HeroMobile`
3. Identification, Expertises, Methode mobile rewrites
4. Actualites + CTAFinal mobile rewrites
5. Polish pass on remaining sections (Promesse, About, Confiance, FAQ, Equipe, CasClients)

After approval I'll implement steps 1–5 in one build pass.
