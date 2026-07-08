# Refonte de la page "Le Cabinet"

Objectif : une page plus originale, plus premium, plus personnelle — centrée sur Quentin Perromat et l'ancrage bordelais.

## Nouvelle structure de la page

```
1. HERO immersif "Rue de Bordeaux"           (nouveau)
2. Manifeste — Qui sommes-nous               (existant, retravaillé)
3. Quentin Perromat, Associé Fondateur       (NOUVEAU — bloc signature)
   ├─ Portrait + bio + citation
   ├─ Parcours financier (timeline verticale)
   └─ Diplômes & certifications
4. Quatre engagements                        (existant, restylé)
5. Galerie cinématographique des bureaux     (conservée)
6. Transition éditoriale "Triangle d'Or"     (conservée, nettoyée — bug typo actuel)
7. Bloc adresse premium                      (remplace la carte 3D)
8. CTA final                                 (conservé)
```

Suppression : `CabinetMap3D` (retiré de la page, composant laissé au repo mais non importé).

## 1. Hero immersif "Rue de Bordeaux"

Reprend exactement le langage visuel du `Hero` de la home :
- Image plein écran d'une rue du Triangle d'Or (façades haussmanniennes bordelaises, lumière rasante).
- Parallax + scale au scroll (framer-motion `useScroll` / `useTransform`), orbe cursor-tracked, overlays gradient navy → gold subtil.
- Eyebrow `KANTI · BORDEAUX · TRIANGLE D'OR`, H1 `Le Cabinet` avec italique éditorial ("un ancrage bordelais"), sous-titre court, trust-bar (ORIAS · CNCEF · 2009 · 500+ familles).
- Indicateur de scroll bas de page.

Image : générée en `standard` (photo éditoriale rue bordelaise, façades pierre blonde, réverbères, ambiance dorée fin de journée), sauvegardée dans `src/assets/hero-rue-bordeaux.jpg`.

## 2. Section Quentin Perromat (le cœur de la refonte)

Layout asymétrique en trois temps, sur fond ivoire :

**A. Portrait + bio + citation** — grille 12 colonnes
- Colonne gauche (5 col) : portrait grand format en ratio 4/5, cadre glass avec fine bordure gold, ombre douce, léger tilt au hover (magnetic). Placeholder pro en attendant votre photo (silhouette élégante générée + note dans le code pour remplacement facile via `src/assets/quentin-perromat.jpg`).
- Colonne droite (7 col) :
  - Eyebrow `Associé Fondateur`
  - H2 `Quentin Perromat`
  - Bio courte 2–3 paragraphes (placeholder éditorial que vous pourrez ajuster)
  - Citation en display italique, filet gold à gauche

**B. Parcours financier — timeline verticale**
- Rail vertical fin en gold à gauche, points lumineux à chaque étape.
- Alternance dates / cartes glass avec institution + rôle + une ligne de contexte.
- Étapes placeholders réalistes (Banque privée → Family office → Fondation KANTI 2009), éditables en un tableau JS en haut du composant.
- Reveal séquencé au scroll (framer-motion, staggered).

**C. Diplômes & certifications**
- Bande horizontale, 4 cartes minimalistes (Master Gestion de Patrimoine, CIF, ORIAS, DU Fiscalité) — icône fine, intitulé, année, organisme. Fond ivoire clair, ring subtle.

Tout le contenu textuel de la section est centralisé en haut du fichier dans des constantes pour édition facile.

## 3. Autres retouches

- Sous-titre du `PageHero` actuel supprimé (remplacé par le nouveau hero immersif → on n'utilise plus `PageHero` sur cette page).
- Section "Manifeste" : typographie retravaillée, chiffres-clés passés en grille horizontale bas de section plutôt qu'en colonne latérale, pour respirer.
- Section "engagements" : passage en cartes glass avec numérotation `01 · 02 · 03 · 04` et hover subtil, au lieu du simple filet.
- Transition "Triangle d'Or" : correction du bug d'affichage actuel (`, Du dedans au dehors -` mal encodé → `— Du dedans au dehors —`).
- Nouveau bloc adresse remplaçant la carte : carte visuelle éditoriale (image façade cabinet + adresse, horaires, téléphone, CTA `Prendre rendez-vous`), pas de carte interactive.

## Détails techniques

- Fichiers modifiés :
  - `src/pages/CabinetPage.tsx` — nouvelle composition
  - `src/components/CabinetHero.tsx` — **nouveau**, hero parallax rue Bordeaux
  - `src/components/cabinet/QuentinPerromat.tsx` — **nouveau**, section signature (bio + timeline + diplômes)
  - `src/components/cabinet/CabinetAdresse.tsx` — **nouveau**, bloc adresse premium
- Assets générés :
  - `src/assets/hero-rue-bordeaux.jpg` (image `standard`)
  - `src/assets/quentin-perromat-placeholder.jpg` (portrait placeholder discret — à remplacer par votre photo, même chemin)
  - `src/assets/facade-cabinet.jpg` (façade pour bloc adresse — placeholder)
- Aucune modification du design system (tokens, couleurs, fonts inchangés — réutilisation `hsl(var(--electric))`, `gold`, `glass-card`, etc.).
- `CabinetMap3D` retiré des imports mais fichier conservé.
- `VirtualTourFAB` conservé.
- Animations : framer-motion (déjà installé), même easing `[0.22, 1, 0.36, 1]` que la home pour cohérence.

## Ce que je vous demanderai après implémentation
- Votre vraie photo de Quentin Perromat (drop dans `src/assets/quentin-perromat.jpg`).
- Validation / correction du texte de bio, de la citation et des étapes de parcours (j'utilise des placeholders crédibles mais génériques).
