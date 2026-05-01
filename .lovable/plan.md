## Objectif

Transformer `MethodePinned` en une expérience **immersive cinématographique** qui tranche radicalement avec la section "Vos enjeux" qui la précède (grille éditoriale claire, statique, sur fond papier). Le contraste visuel et sensoriel doit être immédiat dès l'entrée dans la section.

## Contraste à créer avec la section précédente

| Section précédente (Vos enjeux) | Nouvelle Méthode |
|---|---|
| Fond clair (texture papier) | Fond noir profond, immersif |
| Cartes statiques en grille | Plein écran, narration cinématique |
| Lecture libre, scan rapide | Voyage guidé, étape par étape |
| Pas de média | Image plein-cadre + parallax |
| Typo discrète | Typo monumentale, numéros XXL |

## Concept : "Le studio" — narration plein-écran

Refonte complète de `src/components/MethodePinned.tsx` (desktop uniquement, le mobile `MethodeMobile.tsx` reste inchangé).

### 1. Transition d'entrée immersive
- Une bande noire qui **se déploie depuis le haut** quand la section entre dans le viewport (clip-path mask reveal), créant une rupture nette avec le fond clair de la section précédente.
- Ambiance : grain léger animé, halo bleu électrique pulsant en arrière-plan, particules subtiles.

### 2. Layout pinned plein-écran (au lieu du split 5/7 actuel)
```text
┌─────────────────────────────────────────────┐
│  [chiffre géant 01]      ÉTAPE 01 / 06     │
│                                             │
│   IMAGE PLEIN CADRE EN ARRIÈRE-PLAN        │
│   (parallax, ken-burns lent, vignette)     │
│                                             │
│              Découverte                     │
│   Un premier rendez-vous de 30 minutes...   │
│                                             │
│  ●─●─○─○─○─○   ← timeline horizontale     │
└─────────────────────────────────────────────┘
```
- L'image occupe 100vw × 100vh en arrière-plan, avec un fort gradient sombre par-dessus pour la lisibilité.
- Effet **ken-burns** lent (zoom + pan) sur l'image active.
- À chaque changement d'étape : **crossfade cinéma** entre les deux images (1.2s, ease cinematic), comme un fondu enchaîné.

### 3. Typographie monumentale
- **Numéro géant** ("01", "02"...) en filigrane, taille `clamp(18rem, 28vw, 32rem)`, ultra-light, opacité ~6 %, qui glisse en parallax à contre-sens du scroll.
- Titre étape en `clamp(3rem, 6vw, 5.5rem)`, font-light italic, avec animation `SplitText` à chaque changement.
- Description en colonne étroite (max-w-md), centrée ou alignée à gauche selon parité d'étape (alternance gauche/droite/centré pour rythmer).

### 4. Timeline horizontale en bas (au lieu de verticale à gauche)
- Une fine ligne horizontale en bas du viewport avec 6 points.
- Le point actif grossit, glow électrique, label "Étape 01 — Découverte".
- Trait de progression qui se remplit de gauche à droite.
- Cliquable pour sauter à une étape (scroll vers la fenêtre correspondante).

### 5. Compteur cinéma en haut
- Petit overlay top-right : `01 / 06` en mono, façon générique de film, avec une petite barre de progression linéaire de l'étape en cours (basée sur `stepProgress` du hook existant).

### 6. Effets sensoriels
- **Grain animé** subtil (réutiliser `NoiseGrain` existant) en overlay full-screen pour la texture cinéma.
- **Halo électrique** qui pulse derrière le numéro géant, couleur `--electric`.
- **Vignette** radiale sombre sur les bords pour concentrer le regard.
- Léger **parallax inversé** entre image (descend) et texte (monte) pendant `stepProgress`.

### 7. Sortie immersive
- Une dernière sous-section après l'étape 06 : un écran "fin de méthode" plein noir avec le CTA `Démarrer la conversation` centré, en gros, magnétique. La section se "referme" avant de laisser place à la suivante.

## Détails techniques

- **Fichier modifié** : `src/components/MethodePinned.tsx` uniquement.
- **Hook réutilisé** : `usePinnedSectionProgress` (déjà en place, parfait pour activeIndex + stepProgress).
- **Hauteur de section** : passer de `100 + steps * 68 vh` à `100 + steps * 90 vh` pour donner plus d'air à chaque étape (lecture cinéma plus lente).
- **Composants réutilisés** : `SplitText`, `NoiseGrain`, `MaskReveal` (pour l'entrée), `MagneticCard` (pour le CTA final).
- **Images** : conserver les 6 URLs Unsplash existantes ou en proposer de plus cinématographiques (intérieurs feutrés, mains/écriture, vue Bordeaux). À confirmer si vous souhaitez que je propose un nouveau set.
- **Mobile** : `MethodeMobile.tsx` n'est pas touché (la version mobile actuelle est déjà très lisible et adaptée au scroll fluide).
- **Performance** : `will-change: transform` sur l'image active uniquement, `AnimatePresence mode="wait"` pour le crossfade, `loading="eager"` sur la première image, `loading="lazy"` sur les suivantes.
- **Accessibilité** : respect de `useReducedMotion` (désactive ken-burns, parallax et crossfades — passe en simple fade), timeline cliquable au clavier, `aria-current="step"` sur l'étape active.

## Ce qui ne change pas
- Le contenu des 6 étapes (textes inchangés).
- La version mobile.
- Le lien vers `/notre-methode`.
- L'id `#methode` (ancres préservées).
