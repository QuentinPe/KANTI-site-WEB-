

# Plan 3D — Localisation du cabinet (12 rue Ferrère, Bordeaux)

## Objectif
Ajouter sur la page **Le Cabinet** une section interactive permettant au visiteur de visualiser en 3D l'emplacement du cabinet au cœur du Triangle d'Or de Bordeaux, avec un effet "wow" cohérent avec le reste du site (premium, cinématique).

## Faisabilité — 3 approches possibles

Il y a **trois manières** réalistes d'intégrer un "plan 3D" du cabinet, du plus simple au plus immersif :

### Option A — Google Maps 3D embed (recommandée, rapide)
- Intégration d'une carte Google Maps en **mode satellite 3D** (vue oblique 45°) centrée sur le 12 rue Ferrère via une simple `<iframe>`.
- Marqueur visible sur le bâtiment, navigation libre (rotation, zoom, Street View accessible en 1 clic).
- **Gratuit**, aucune clé API, fonctionne immédiatement.
- Encadré dans un cadre premium (verrière noire, halo doré, légende éditoriale).

### Option B — Globe / carte 3D interactive (Mapbox GL JS)
- Mini-globe 3D animé qui zoome de l'Europe → France → Bordeaux → 12 rue Ferrère au scroll.
- Bâtiments 3D extrudés (fill-extrusion layer), transition cinématique.
- Nécessite une **clé Mapbox** (gratuite jusqu'à 50k chargements/mois) — à fournir comme secret.
- Effet "wow" très fort, mais plus lourd techniquement.

### Option C — Modélisation 3D custom (Three.js / R3F)
- Scène 3D maison : représentation stylisée du quartier (Triangle d'Or, Place Tourny, Cours de l'Intendance) en blocs minimalistes, le cabinet mis en lumière.
- Style "maquette d'architecte" doré/ivoire, totalement aligné à la charte KANTI.
- **Lourd à produire** (modélisation), pas de données réelles, mais 100 % unique.

## Recommandation

Combinaison **A + accent visuel** : Google Maps 3D embed encadré dans un module éditorial premium. Rapide, fiable, suffisamment immersif, et upgradable plus tard vers Mapbox si souhaité.

## Ce qui sera implémenté (Option A)

### Nouveau composant `src/components/CabinetMap3D.tsx`
- Section pleine largeur, fond ivoire, padding éditorial.
- **Colonne gauche (40 %)** :
  - Eyebrow doré : `Notre adresse`
  - Titre : `Au cœur du Triangle d'Or bordelais`
  - Adresse mise en avant : **12 rue Ferrère — 33000 Bordeaux**
  - 3 points d'orientation : `À 5 min de la Place de la Comédie` · `Parking Tourny à 200 m` · `Tram C — arrêt Quinconces`
  - Boutons : **Itinéraire Google Maps** (deeplink) + **Ouvrir Street View**
- **Colonne droite (60 %)** :
  - Cadre 16:9 avec bord doré subtil + ombre douce.
  - `<iframe>` Google Maps embed mode satellite/3D centré sur le 12 rue Ferrère, zoom 18, tilt 45°.
  - Coin inférieur : badge `Vue 3D — interactive` avec petit indicateur pulsant.
- Animation d'entrée au scroll (reveal existant), parallax léger sur le cadre.

### Intégration `CabinetPage.tsx`
- Section ajoutée **juste après la galerie cinématique des bureaux**, avant le `PageCTA` final.
- Transition fluide : la galerie montre l'intérieur, la map montre l'extérieur/le quartier.

### Détails techniques
- URL iframe : `https://www.google.com/maps/embed?pb=...` générée pour 12 rue Ferrère, mode satellite, tilt activé.
- Lazy loading (`loading="lazy"`), `referrerpolicy="no-referrer-when-downgrade"`, `allowfullscreen`.
- Lien itinéraire : `https://www.google.com/maps/dir/?api=1&destination=12+rue+Ferrere+33000+Bordeaux`.
- Lien Street View : `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=44.8438,-0.5762`.
- Responsive : passe en colonne unique < 1024 px, hauteur iframe 420 px desktop / 320 px mobile.
- A11y : `<iframe title="Plan 3D du cabinet KANTI...">`, alternative texte avec adresse complète.

## Évolution future (optionnelle, non incluse maintenant)
Si tu veux passer à l'Option B (Mapbox 3D animée au scroll), il faudra :
- Créer un compte Mapbox et fournir la clé.
- Installer `mapbox-gl`.
- Réécrire `CabinetMap3D.tsx` avec animation `flyTo` au scroll.

## Fichiers
- **Créé** : `src/components/CabinetMap3D.tsx`
- **Modifié** : `src/pages/CabinetPage.tsx` (import + insertion de la section)

