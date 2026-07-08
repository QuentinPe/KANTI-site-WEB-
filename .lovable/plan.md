
# Refonte v3 — Page Cabinet en DA "Liquid Glass" (celle de la home)

On garde **la structure éditoriale** (masthead, hero séquencé 4 plans, chapitres numérotés, tableau parcours, engagements en colonnes, carnet, adresse) et on **change complètement l'habillage** pour repasser dans le langage visuel de la home : fond navy profond, verre dépoli, orb cursor-tracked, halos floutés dorés, animations framer-motion, filets luminescents.

Palette : on retire les tokens `paper/ink` de cette page et on utilise les tokens existants — `navy`, `navy-deep`, `ivory`, `glass-*`, `gold` (steel-blue existant), `electric`.

Typo : on abandonne Fraunces pour cette page, retour à `font-heading` (Cormorant Garamond) déjà utilisée sur la home + numéraux Cormorant en italique. Le fichier `@fontsource/fraunces` reste installé (peu de poids) mais n'est plus référencé — je le retirerai si vous préférez.

---

## Traduction section par section

### 00. Masthead → **TopStrip glass sombre**
Bande fine `glass-dark` en haut sous le Header, filet or, mêmes 3 colonnes (KANTI · Numéro 01 · Édition permanente) mais en typographie Cormorant, texte ivoire à faible opacité, séparateur doré lumineux.

### 01. Hero cinématique 4 plans → **immersion navy premium**
- Même mécanique (4 images crossfadées au scroll, section pinnée), mais overlay `linear-gradient(180deg, navy-deep/85, navy/70, navy-deep/95)` au lieu de wash papier.
- Ajout de : orb cursor-tracked (comme `CabinetHero` original), 2 halos floutés dorés flottants (`float-soft`, `float-slow`), grain léger.
- Numéraux I–IV en haut : capsules `glass-dark` avec point lumineux or animé pour le plan actif (au lieu d'opacités plates).
- Captions plan par plan : dans une carte `glass-dark` arrondie (rounded-2xl, ring blanc/10, backdrop-blur), texte ivoire, italique Cormorant.
- Titre final H1 grande typo blanche + italique ivoire (calque exact du hero home), sous-titre décalé de 2 colonnes, filet or vertical qui les relie.
- Indicateur de scroll bas de page (petit trait vertical dégradé, comme la home).

### 02. Manifeste → **grille glass sur fond navy dégradé**
- Section `bg-navy-deep` + gradient radial subtil.
- Bloc principal : carte `glass-dark` large avec ring blanc/10, radius généreux, ombre `shadow-float`.
- Texte body sur deux colonnes reste, mais dans le glass card, texte ivoire/70.
- Marginalia chiffres-clés à droite : chaque chiffre dans une mini-capsule `glass-dark` empilée, filet or entre chaque, animation reveal séquencé.

### 03. Quentin Perromat → **portrait + glass**
- Portrait dans un cadre `glass-dark` avec ring blanc/15, outline or offset (le double-filet éditorial est remplacé par un halo doré flouté derrière la carte, comme sur les cartes de la home).
- Légende sous portrait en italique ivoire.
- Bio 2 colonnes conservée dans un panneau `glass-dark` avec drop cap dorée.
- Citation XL : grand corps Cormorant italique blanche, guillemets or lumineux, filet or vertical à gauche + halo diffus.
- Parcours (tableau) : chaque ligne devient une carte discrète `glass-dark` (ring blanc/5, hover subtle lift), séparateurs remplacés par des filets or/20. On garde la grille 12-col.
- Credentials : ligne unique de badges glass séparés par des puces dorées lumineuses.

### 04. Quatre engagements → **colonnes glass**
- 4 cartes verticales `glass-dark` côte à côte, radius 2xl, ring blanc/10, hover : légère élévation + intensification du halo intérieur (comme cards home).
- Numéraux I–IV en Cormorant italique or, très grands, avec petit point lumineux animé (pulse doux).
- Titre serif blanc, corps ivoire/70.
- Filets verticaux dorés fantômes entre les colonnes (opacity 0.15).

### 05. Carnet bordelais → **section navy + parallax léger**
- Fond `bg-navy` avec halos.
- Chaque note = grille 12 cols, image dans un cadre glass avec **parallax scroll** (`useScroll` + `useTransform` — pattern déjà présent dans `ParallaxImage.tsx`, on le réutilise).
- Marginalia à côté : carte `glass-dark` compacte, filet or à gauche, date en italique or.
- Alternance gauche/droite conservée.

### 06. Adresse → **glass premium**
- Photo façade dans cadre glass avec halo doré derrière.
- Panneau adresse à droite : grande carte `glass-dark`, chaque item (adresse / horaires / contact) séparé par filet or/20.
- Cachet "Établi à Bordeaux depuis 2009" : conservé, restylé en badge circulaire glass ring or lumineux, léger tilt.
- CTA "Prendre rendez-vous" : bouton primary arrondi de la home (`bg-primary text-primary-foreground` + shadow-xl hover, comme actuellement partout ailleurs).

### 07. CTA final
`PageCTA` conservé tel quel (déjà dans la DA de la home).

---

## Animations (framer-motion, déjà installé)

Reprise stricte des patterns de la home :
- `useReducedMotion` respecté partout.
- Reveal in-view : `initial={{opacity:0, y:24}}` → `whileInView={{opacity:1, y:0}}`, easing `[0.22, 1, 0.36, 1]`, durée 0.8–1s, stagger sur les listes.
- Halos `float-soft` / `float-slow` (utilitaires déjà dans `index.css`).
- Orb cursor-tracked dans le hero (mousemove → radial-gradient repositionné, hors `useReducedMotion`).
- Parallax images du carnet via `ParallaxImage` existant.
- Numéraux du hero : pulse doux `animate-pulse` sur le point actif.
- Cards glass : hover `-translate-y-0.5` + `shadow-glass-lg` (transitions déjà tokenisées).

Pas d'effet lourd (pas de WebGL, pas de canvas), tout tient en CSS + framer-motion pour rester rapide.

---

## Fichiers touchés

**Modifiés (restylage complet, structure conservée) :**
- `src/pages/CabinetPage.tsx` — fonds `bg-navy-deep`/`bg-navy`, suppression des `paper-grain`, sections rehabillées.
- `src/components/cabinet/CabinetMasthead.tsx` → **renommé** `CabinetTopStrip.tsx` (glass sombre).
- `src/components/cabinet/CabinetHeroSequence.tsx` — overlay navy, orb, halos, cartes glass pour captions et numéraux.
- `src/components/cabinet/QuentinPerromat.tsx` — portrait glass, panneau bio glass, tableau parcours en cartes glass, credentials glass.
- `src/components/cabinet/CarnetBordelais.tsx` — fond navy, images via `ParallaxImage`, marginalia glass.
- `src/components/cabinet/CabinetAdresse.tsx` — carte glass premium, badge cachet glass ring or.

**Ajouts éventuels :**
- Petite classe utilitaire `.hairline-gold` dans `index.css` (filet or dégradé horizontal) si non déjà présente.

**Non-touchés :**
- `Header`, `Footer`, `PageCTA`, `VirtualTourFAB`, `ParallaxImage`, tokens design system.
- Home et autres pages.

**Retraits :**
- Import Fraunces dans `main.tsx` (typos et utilitaires `.drop-cap`/`.magazine-columns` restent définis mais ne sont plus utilisés sur cette page — je les laisse pour ne rien casser ailleurs, on peut nettoyer en pass ultérieure si vous le souhaitez).
- Tokens `--paper`/`--ink` : conservés en CSS (aucun coût), mais plus référencés dans les composants Cabinet.

---

## Ce qui reste identique par rapport à v2 (rassurant)

- Structure de la page en 8 sections.
- Contenu textuel (manifeste, bio Quentin, citation, parcours, engagements, notes carnet, adresse) — 100 % conservé.
- Séquence des 4 plans du hero — 4 images identiques, même ordre.
- Comportement responsive et accessibilité (alt, semantics, reduced-motion).

**À valider avant build :** OK pour vous que je supprime la sensation "papier édito" complètement (drop cap ivoire dorée, colonnes justifiées, filets encre) au profit du 100 % glass sombre / navy, ou souhaitez-vous garder **un seul** clin d'œil éditorial (par ex. les numéraux de chapitre `I / II / III` en italique or) ?
