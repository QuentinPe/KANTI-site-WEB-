## Problème

Sur la hero animée (`HeroSticky.tsx`), le titre et le sous-titre en blanc se retrouvent par moments devant les rideaux clairs et la fenêtre de la vidéo bureau → contraste insuffisant, lecture pénible (visible sur la capture).

Les voiles actuels sont trop timides :
- Gradient vertical : `0.55 → transparent → 0.65` (le milieu, où vit le texte, est à 0 %).
- Voile latéral gauche : `0.45 → transparent` sur 50 % de large, s'arrête trop tôt.

Résultat : la zone du texte (centre-gauche, mi-hauteur) n'a quasiment aucune protection.

## Solution proposée

Renforcer la lisibilité **sans assombrir toute la vidéo** (on garde le côté cinématique). 4 leviers combinés, tous dans `HeroSticky.tsx` :

### 1. Voile de lecture ciblé derrière le texte
Remplacer le voile latéral gauche linéaire par un **radial gradient scrim** centré sur la colonne de texte :
- Rayon ellipse ~55 % × 70 %, ancré en bas-gauche.
- Densité : `hsl(224 60% 5% / 0.70)` au centre → `0.35` à mi-course → transparent aux bords.
- Couvre exactement la zone titre + sous-titre + CTA, laisse la partie droite (fenêtre, tableau bleu) intacte.

### 2. Gradient vertical global légèrement remonté
- Passer de `0.55 → 0 → 0 → 0.65` à `0.65 → 0.15 → 0.15 → 0.75`.
- Ajoute une base sombre continue de 15 % qui rattrape les frames les plus claires (rideaux) sans écraser les frames sombres.

### 3. Text-shadow subtil sur le H1 et le paragraphe
- H1 : `text-shadow: 0 2px 24px hsl(224 60% 5% / 0.55), 0 1px 2px hsl(224 60% 5% / 0.4)`.
- Paragraphe : `text-shadow: 0 1px 12px hsl(224 60% 5% / 0.6)`.
- Invisible sur fond sombre, sauveur sur fond clair. Standard éditorial premium (NYT, Apple).

### 4. Renforcer le pill "KANTI · Cabinet · Bordeaux" et les trust signals
- Pill : passer de `glass-dark` à un `bg-black/40 backdrop-blur-md` pour tenir sur rideaux clairs.
- Trust signals (ORIAS, CNCGP…) : ajouter le même `text-shadow` léger.

## Ce qui ne change PAS

- Aucune modification de la vidéo/frames.
- Aucun changement de layout, typographie, ni animations d'entrée.
- Version mobile (`HeroMobile.tsx`) : déjà correcte (gradient `0.55 → 0.85`), on n'y touche pas.
- Reduced-motion (fallback `Hero.tsx`) : intact.

## Fichier modifié

- `src/components/HeroSticky.tsx` — uniquement les couches d'overlay + text-shadow inline sur h1/p/pill/trust.

## Rendu attendu

Le titre reste lisible sur **toutes** les frames de la séquence (bureau sombre → panoramique fenêtre claire → plan large rideaux), tout en préservant la richesse chromatique de la vidéo côté droit.
