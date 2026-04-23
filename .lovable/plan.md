

# Plan — Effet "Plâtre vivant" révélé au curseur

Inspiré de l'image : une texture sculpturale (plâtre/argile en très bas contraste) qui se révèle uniquement **autour du curseur** dans les espaces vides entre les sections de la page d'accueil. Discret, premium, organique — dans la même veine "Immersive Garden" que le reste du site.

## Concept visuel

Une couche **fixed full-page** placée **derrière** le contenu (z-index négatif ou très bas), totalement invisible par défaut, qui ne se révèle que dans un **rayon de 240–300px autour du curseur** via un masque radial. Le contenu (cartes, sections glass) reste opaque et masque naturellement la texture — l'effet n'apparaît donc que dans les "respirations" entre les sections.

```text
┌─────────────────────────────┐
│  [Section opaque — cache]   │
│                             │
│   ░░ texture plâtre ░░      │  ← visible uniquement
│   ░░  (autour curseur) ░░   │     dans les zones vides
│                             │
│  [Section opaque — cache]   │
└─────────────────────────────┘
```

## Composant à créer

**`src/components/motion/PlasterReveal.tsx`**
- `<div fixed inset-0>` avec image de texture en background (l'upload de l'utilisateur).
- Suit la position du curseur via `mousemove` + spring (lerp doux, ~0.08) pour un déplacement organique.
- Masque appliqué via `mask-image: radial-gradient(circle 280px at X Y, black 0%, transparent 70%)`.
- Opacité globale max **~0.35** pour rester très discret (texture déjà claire dans l'image).
- Désactivé sous `prefers-reduced-motion`, sur touch (`hover: none`), et < 768px (fallback : caché).
- z-index : `-1` (derrière le contenu) ou `0` selon la stratégie d'empilement.

## Intégration

1. **Asset** : copier l'image fournie vers `src/assets/plaster-texture.jpg` (ou `.webp` si on optimise) — désaturée, légèrement assombrie pour éviter trop de blanc qui "explose" sur fond clair.
2. **Index.tsx** : monter `<PlasterReveal />` une seule fois, juste après `<Header />`, en `fixed inset-0 pointer-events-none -z-0`.
3. **Sections** : s'assurer que les sections principales gardent un `bg-background` ou `section-glass` opaque (déjà le cas) — c'est ce qui fait que la texture n'apparaît QUE dans les marges/respirations.
4. **Variantes possibles** :
   - **Mode A (retenu)** : texture plâtre directe (image fournie).
   - **Mode B (alternatif)** : SVG turbulence + displacement pour un rendu encore plus discret, sans dépendance image. Garder en réserve si l'image rend trop "marqué".

## Réglages fins (à ajuster après preview)

| Paramètre | Valeur initiale |
|---|---|
| Rayon révélation | 280px |
| Falloff (transparent à) | 70% |
| Opacité globale | 0.32 |
| Spring damping | 18 |
| Spring stiffness | 90 |
| Mix-blend-mode | `multiply` ou `soft-light` (test) |

## Détails techniques

- **Performance** : `transform: translate3d` sur le masque, pas de re-render React (manipulation directe du style via ref).
- **Accessibilité** : `aria-hidden`, désactivé en reduced-motion.
- **Responsive** : caché sous 768px (un curseur tactile n'a pas de sens ici).
- **z-index strategy** : la couche est en `-z-10` par rapport au `<main>`, mais le `<main>` doit avoir un `bg-background` global déjà en place. Si le body est transparent, on passe la couche en `z-0` derrière les sections opaques (à confirmer sur preview).

## Hors scope (pour plus tard si tu valides l'effet)

- Variantes par section (texture différente entre Hero et CasClients).
- Parallaxe lente de la texture au scroll (drift vertical de 5%).
- Couplage avec `PremiumCursor` pour un curseur qui "creuse" la matière.

