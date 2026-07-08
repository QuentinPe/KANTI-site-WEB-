
# Refonte v2 — Page Cabinet, direction "Éditorial magazine bordelais"

Ambition : abandonner le hero plein écran générique et construire une page qui se lit comme une **revue papier** — grilles cassées, grandes typos, numérotation, filets, marginalia, ancrage Bordeaux comme fil rouge.

Palette locked (retenue) : `#0F1620` (encre), `#F5F1E8` (papier), `#C9A15A` (or patrimonial), `#8A8073` (pierre).

---

## Nouvelle structure

```
00. MASTHEAD ÉDITORIAL              (remplace le hero plein écran)
01. HERO CINÉMATIQUE SÉQUENCÉ       (nouveau — cœur de la refonte)
02. LE MANIFESTE                    (retravaillé façon édito)
03. QUENTIN PERROMAT                (conservé, restylé mise en page magazine)
04. LES QUATRE ENGAGEMENTS          (repensé en "colonnes de journal")
05. CARNET BORDELAIS                (nouveau — marginalia + galerie bureaux)
06. BLOC ADRESSE                    (conservé, restylé)
07. CTA                             (conservé)
```

Retrait : ancien `CabinetHero.tsx` (image rue plein écran + parallax générique).

---

## 00. Masthead éditorial (fin du header, avant hero)

Bande fine papier ivoire (`#F5F1E8`), typographie serif d'édition :
- Colonne gauche : `KANTI` en display serif, tracking large.
- Colonne centrale : `NUMÉRO 01 — LE CABINET · BORDEAUX · MMXXVI`.
- Colonne droite : filet + `Édition permanente`.
Filet horizontal fin encre en bas. Sensation : couverture de revue haut de gamme (System, Apartamento, Perfect).

## 01. Hero cinématique séquencé — `CabinetHeroSequence.tsx`

**Concept** : au lieu d'une image fixe, 4 plans qui s'enchaînent au scroll via `useScroll` + `useTransform`, pinned pendant ~2× viewport height.

Plans (crossfade + micro-zoom, chaque plan a sa légende éditoriale style capsule de magazine, numérotée `I / II / III / IV`) :

1. **Grand angle Bordeaux** — Pont de Pierre / Place de la Bourse au crépuscule. Légende : *"Une ville qui a inventé le négoce moderne."*
2. **Rue du Triangle d'Or** — façades pierre blonde. Légende : *"Un quartier où l'on parle patrimoine depuis trois siècles."*
3. **Façade du cabinet** — porte cochère, plaque discrète. Légende : *"Une adresse. Pas une vitrine."*
4. **Détail intérieur** — main, papier, stylo (ou détail bibliothèque). Légende : *"Ici, on écrit les décisions à la main d'abord."*

Overlay papier subtil (`#F5F1E8` à ~8% + grain), texte encre. Sous la séquence, tirage éditorial pleine largeur :

> "Le Cabinet."  
> *Ancré à Bordeaux. Exigeant partout ailleurs.*

Rendu asymétrique : titre calé sur la marge de gauche, sous-titre décalé de 2 colonnes, filet or vertical qui les relie.

## 02. Manifeste — grille magazine

Grille 12 colonnes, texte en 2 colonnes serif justifiées façon article, **drop cap** or sur la première lettre. Chiffres-clés en marge droite (marginalia) alignés sur des filets fins, style "encart de magazine".

Titre : `Qui sommes-nous.` (point final éditorial).

## 03. Quentin Perromat — restylage magazine

- Portrait en pleine hauteur, ratio 4/5, cadre papier avec **filet or double**, chapeau photo comme dans un magazine (`Portrait — Quentin Perromat, Associé fondateur. Bordeaux, 2026.`).
- Bio en 2 colonnes serif, drop cap.
- Citation en display italique très grand corps (60–80 px), guillemets or ouvrants/fermants surdimensionnés.
- Timeline parcours : plus de rail vertical central — passage à un **tableau éditorial** style CV de revue (année | rôle | maison, alignés sur des filets fins), très typographique.
- Diplômes : passage en ligne unique de "credentials" séparés par des puces or (`Master 2 GP · CIF · ORIAS · DU Fiscalité`).

## 04. Quatre engagements — colonnes de journal

4 colonnes verticales séparées par des filets encre fins, chaque colonne :
- Numéro romain grand corps (`I`, `II`, `III`, `IV`) or.
- Titre serif.
- Texte en sans-serif petit corps, justifié.
Aucune carte, aucune ombre — la mise en page fait tout le travail. Fond papier.

## 05. Carnet bordelais (nouveau) — remplace la transition actuelle

Section éditoriale bâtie autour de la galerie des bureaux existante mais recomposée : image large à gauche, **marginalia** à droite (petites notes datées `— Août 2024`, adresses, extraits, anecdotes courtes). Deux ou trois blocs empilés. Ambiance carnet d'atelier / notebook. Réutilise les 4 images bureaux existantes en les intégrant à ce carnet plutôt qu'en galerie cinématique séparée.

Suppression de l'actuelle section "Du dedans au dehors" (redondante avec ce carnet) et de `CinematicGallery` sur cette page (garder le composant, juste ne plus l'appeler ici).

## 06. Bloc adresse

Conservé (`CabinetAdresse.tsx`) mais restylé avec la nouvelle palette papier/encre et une typographie serif cohérente. Ajout d'un cachet "Établi à Bordeaux depuis 2009" style tampon or.

## 07. CTA

Conservé (`PageCTA`) — pas de changement.

---

## Détails techniques

**Fichiers créés :**
- `src/components/cabinet/CabinetMasthead.tsx` — bande éditoriale.
- `src/components/cabinet/CabinetHeroSequence.tsx` — hero cinématique 4 plans (framer-motion, pinned, crossfade + scale, respect `useReducedMotion`).
- `src/components/cabinet/CarnetBordelais.tsx` — section marginalia + galerie.

**Fichiers modifiés :**
- `src/pages/CabinetPage.tsx` — recomposition complète (retire `CabinetHero`, `CinematicGallery` de la page, section "Du dedans au dehors" ; ajoute Masthead, HeroSequence, Carnet).
- `src/components/cabinet/QuentinPerromat.tsx` — restylage magazine (drop cap, tableau parcours, credentials en ligne, guillemets XL).
- `src/components/cabinet/CabinetAdresse.tsx` — restylage papier + tampon.
- `src/index.css` — ajout tokens `--paper`, `--ink`, `--stone` + utilitaires `.drop-cap`, `.rule-gold`, texture papier légère.
- `tailwind.config.ts` — extension palette (`paper`, `ink`, `stone`) + font stack serif éditoriale.

**Fichiers retirés (imports) :**
- `src/components/CabinetHero.tsx` — plus utilisé (fichier laissé au repo pour l'instant).

**Assets à générer (imagegen standard) :**
- `src/assets/cabinet-seq-01-bordeaux.jpg` — pont/place au crépuscule.
- `src/assets/cabinet-seq-02-triangle.jpg` — rue façades pierre blonde.
- `src/assets/cabinet-seq-03-facade.jpg` — porte cochère du cabinet (remplace `facade-cabinet.jpg` ou coexiste).
- `src/assets/cabinet-seq-04-detail.jpg` — détail intérieur main/papier/stylo.

**Typographie :**
- Body : conservation de la sans existante.
- Display magazine : ajout de `@fontsource/fraunces` (serif éditoriale contemporaine, très expressive) via `bun add @fontsource/fraunces`, import dans `main.tsx`, ajout de la famille `fraunces` dans `tailwind.config.ts` sous une clé `font-editorial`. Utilisation limitée aux titres, drop caps et citation de cette page.

**Animations :**
- Séquence hero : `useScroll` + `useTransform` avec 4 checkpoints, chaque image crossfade (opacity) + micro-scale (1 → 1.06). Section pinnée via hauteur artificielle (`h-[280vh]`) et bloc sticky interne (`h-screen sticky top-0`).
- Reveal magazine : `MaskReveal` / `SplitText` existants réutilisés pour titres et drop caps.
- Respect `useReducedMotion` partout (crossfade immédiat, pas de zoom).

**Design system :**
- Aucun hex en dur dans les composants — nouveaux tokens `paper` / `ink` / `stone` / `gold` (déjà existant) référencés via classes Tailwind.

---

## Ce qu'il faudra ensuite

- Valider les 4 images générées (surtout la façade du cabinet — je génère un placeholder crédible mais si vous avez la vraie photo, on la substitue).
- Ajuster/relire les légendes éditoriales des 4 plans.
- Fournir la vraie photo de Quentin Perromat (chemin `src/assets/quentin-perromat.jpg`).
