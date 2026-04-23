

# Plan — Niveau "Immersive Garden" appliqué à la gestion de patrimoine

L'objectif : pousser les sections intermédiaires (entre le hero et le CTA final, déjà forts) au même niveau cinématique. Pas de gadget — chaque effet sert le message patrimonial : précision, durée, structure.

## Principes directeurs (identité IG x Kanti)

- **Scroll = narration** : chaque section raconte un chapitre, le scroll en est le réalisateur.
- **Typographie kinétique** mais sobre : révélations mot-à-mot ou par fragments, jamais clinquantes.
- **Profondeur** : couches de parallaxe, grain subtil, bruit lumineux, halos navy.
- **Transitions inter-sections** : fondus orchestrés, pas de "cuts" secs.
- **WebGL léger** uniquement là où ça compte (1 shader hero-like ré-utilisable).
- **Curseur enrichi** : labels contextuels au survol (ex: "Découvrir" sur les cartes).
- **Sound design** : OFF par défaut, toggle discret en bas (optionnel — phase 2).

## Refontes section par section

### 1. Identification — "Vos enjeux" → **Mur de questions kinétique**
- Remplacer la grille statique par une **grille magnétique** : chaque carte se révèle avec un délai en cascade, s'incline légèrement vers le curseur (effet 3D tilt subtil, max 4°).
- Les numéros (01–06) deviennent **géants en filigrane** derrière chaque titre, coupés par le bord de la carte.
- Ligne séparatrice qui se trace en SVG quand la carte entre dans le viewport.
- Hover : carte se soulève + glow navy diffus + le mot-clé central (ex. "Optimiser") se souligne en italique.

### 2. Promesse — **Phrase qui se compose au scroll**
- Garder le fond image parallaxe, mais transformer la phrase en **kinetic typography pilotée par le scroll** : chaque fragment ("indépendant", "globale", "dans la durée") apparaît avec un blur→sharp + déplacement vertical micro.
- Les mots emphasés en italique reçoivent un **dégradé animé** (lumière qui balaye de gauche à droite, 1 fois).
- Image de droite : ajouter une **distorsion WebGL très légère** (shader displacement à base de bruit) — donne l'impression d'une fenêtre vivante.
- Citation finale qui se révèle ligne par ligne avec un ratio cinéma (clip-path).

### 3. About — **Compteurs orchestrés + portrait éditorial**
- Garder les count-ups mais les **synchroniser** : déclenchement séquentiel (15 ans → 500+ → 98%), chaque compteur précédé d'un trait qui se trace.
- Ajouter à droite (sous les chiffres) une **vignette image éditoriale** du cabinet avec masque circulaire qui s'ouvre au scroll.
- Le H2 se révèle mot par mot (split text), l'italique "sur votre patrimoine" arrive 200ms plus tard avec un effet swap.

### 4. ExpertisesPinned — **Galerie scrollytelling enrichie**
La structure pinned est déjà bien. On ajoute :
- **Zoom-in cinématique** sur l'image active (échelle 1.05 → 1.0 sur 600ms au lieu de 0.42).
- **Mask reveal** entre deux images consécutives : transition par wipe diagonal au lieu de fade.
- Numéro géant transparent **"01/06"** en filigrane derrière la carte, qui défile en mode tachymètre.
- Les bullets de la timeline gauche émettent un **halo bleu pulsant** quand actifs.
- Bouton "Découvrir" : effet **magnetic + label curseur** "→ Voir".

### 5. MethodePinned — **Timeline ascendante avec lumière volumétrique**
Déjà très bonne. Ajouts :
- La **ligne verticale qui se remplit** devient un **trait lumineux qui pulse** à chaque étape franchie.
- Numéro géant ghost (déjà présent) animé : **léger flottement** (y: ±4px, 6s loop).
- Ajouter un **halo bleu volumétrique** derrière la carte active (radial gradient animé).
- Transition entre étapes : **morph crossfade** au lieu de exit/enter (les 2 cartes se chevauchent 200ms).

### 6. HomeCasClients — **Cartes "dossiers ouverts" cinématiques**
- Refonte visuelle : chaque carte ressemble à une **fiche cliente épurée** (texture papier subtile, en-tête typé "DOSSIER N°").
- Au scroll : les 3 cartes arrivent **en éventail** (légères rotations -2°/0°/+2° + translation Y décalée).
- Hover : la carte se redresse à 0°, les 2 autres reculent légèrement (effet focus).
- Ajouter un **petit chiffre clé** par carte (ex. "Économie fiscale estimée : 42 K€/an") pour ancrer la démonstration.

### 7. CTAFinal — **Déjà fort**, micro-ajouts
- Garder tel quel sur le fond. Ajouter :
- **Particules navy très subtiles** (10–15 points) qui dérivent lentement sur le visuel de fond.
- Le H2 "Parlons de votre patrimoine" passe en **split-letter reveal** (chaque lettre 30ms decalage).
- Le bouton blanc reçoit un **ring glow** pulsant lent (4s loop) pour attirer l'œil sans agresser.

## Briques techniques transverses (créées une fois, réutilisées partout)

| Brique | Fichier | Usage |
|---|---|---|
| `<SplitText />` | `src/components/motion/SplitText.tsx` | Reveal mot-à-mot ou lettre-à-lettre |
| `<MagneticCard />` | `src/components/motion/MagneticCard.tsx` | Tilt 3D au survol (Identification, CasClients) |
| `<NoiseGrain />` | `src/components/motion/NoiseGrain.tsx` | Overlay grain SVG (Promesse, Methode) |
| `<AmbientParticles />` | `src/components/motion/AmbientParticles.tsx` | Particules dérivantes Canvas (CTAFinal) |
| `<MaskReveal />` | `src/components/motion/MaskReveal.tsx` | Wipe transitions (Expertises, About) |
| Hook `useMagneticCursor` | `src/hooks/useMagneticCursor.ts` | Étend `PremiumCursor` avec labels contextuels |

Performance : tout désactivé sous `prefers-reduced-motion` et au-dessous de 768px (fallback statique propre).

## Phasage proposé

1. **Phase 1 — Briques + Identification + Promesse** (haute valeur immédiate, sections les plus vues).
2. **Phase 2 — About + ExpertisesPinned + MethodePinned** (cœur du parcours).
3. **Phase 3 — HomeCasClients + polish CTAFinal** (avant-conversion).

Chaque phase est livrable indépendamment et publiable.

## Hors scope (à valider plus tard si tu veux)

- Page-transitions globales (route morph)
- Page de chargement signature avec compteur
- Sound design (toggle discret)
- Curseur custom enrichi avec labels FR ("Voir", "Lire", "Contacter")

