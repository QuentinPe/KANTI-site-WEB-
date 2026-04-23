## Vidéo sticky en hero — traveling vers l'intérieur du bureau

Remplacer l'image d'accueil par une vidéo cinématique d'un bureau (vue depuis la porte, traveling vers l'intérieur), où la progression du scroll contrôle l'avancement de la vidéo. L'effet "sticky video" : la vidéo reste fixée à l'écran pendant que le scroll fait défiler les frames du traveling.

### Ce que vous verrez

- Au chargement : plan large depuis l'embrasure de la porte du cabinet (boiseries, lumière douce, mobilier en arrière-plan flou).
- En scrollant vers le bas : la caméra avance lentement dans la pièce (dolly-in / traveling avant), révélant le bureau, les fauteuils, la fenêtre lumineuse.
- Le titre éditorial *"Votre patrimoine mérite…"* reste superposé en transparence, avec un léger fade-out quand la séquence touche à sa fin.
- À la fin du traveling, le scroll reprend normalement et enchaîne sur la section suivante (Identification).

### Approche technique

Trois options selon la qualité souhaitée et le délai :


| Option                                      | Source vidéo                                                                 | Rendu                                 | Avantage                    |
| ------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------- | --------------------------- |
| **A — Stock cinématique**                   | Vidéo libre de droits (Pexels/Coverr) d'un bureau haussmannien avec dolly-in | Le plus rapide, qualité pro immédiate | Recommandé pour livrer vite |
| **B — Vidéo générée (Remotion + image IA)** | Image bureau générée puis animée en traveling via parallaxe/zoom             | Sur-mesure, brandé KANTI              | ~2 min de génération        |
| **C — Vidéo fournie par vous**              | Vous uploadez un .mp4 tourné sur place                                       | Authentique, exclusif                 | Idéal long terme            |


Je recommande **Option C,  la video sera transmise par mes soins.** 

### Implémentation (scroll-driven video)

1. **Nouveau composant `HeroSticky.tsx**` remplaçant `<Hero />` dans `src/pages/Index.tsx`.
2. **Structure** :
  ```text
   <section h="200vh">          ← zone de scroll qui pilote la vidéo
     <div sticky top-0 h-screen>
       <video muted playsInline preload="auto" />   ← vidéo silencieuse
       <overlay gradient navy />
       <h1 "Votre patrimoine mérite…">
       <scroll-indicator ↓ />
     </div>
   </section>
  ```
3. **Pilotage du scroll** via Framer Motion `useScroll` + `useTransform` :
  - `scrollYProgress` (0 → 1 sur la zone de 200vh)
  - mappé sur `video.currentTime = progress * video.duration`
  - mise à jour dans un `requestAnimationFrame` pour la fluidité
4. **Préchargement** : `preload="auto"`, `poster` (première frame) affiché instantanément pour éviter le flash blanc.
5. **Performance** :
  - Vidéo encodée en H.264 720p (~3-5 Mo, 6-8 secondes de traveling).
  - Désactivée sur mobile (< 768px) → fallback sur l'image actuelle, car le scroll-driven video est lourd sur iOS Safari.
  - Respect de `prefers-reduced-motion` → image statique.
6. **Overlay éditorial** : dégradé navy translucide identique au hero actuel, halo bleu cursor-tracked conservé, typographie inchangée (Cormorant Garamond + Inter).
7. **Transition de sortie** : à `progress > 0.85`, fade-out doux du titre + léger blur sur la vidéo pour amener la section Identification.

### Fichiers touchés

- `src/components/HeroSticky.tsx` *(nouveau)*
- `src/pages/Index.tsx` (remplacement `<Hero />` par `<HeroSticky />`)
- `public/video/hero-office-dolly.mp4` *(nouveau, ~4 Mo)*
- `public/video/hero-office-poster.jpg` *(nouveau, première frame)*
- `Hero.tsx` conservé en fallback pour reduced-motion / mobile

### Points d'attention

- **iOS Safari** ne permet pas toujours le contrôle frame-précis de `currentTime` sur vidéo non-bufferisée → on utilise `preload="auto"` et on attend `canplaythrough` avant d'activer le scroll-driving.
- **Poids** : on garde la vidéo sous 5 Mo pour ne pas pénaliser le LCP. Une version WebM peut être servie en complément.
- **SEO/LCP** : le `poster` (image statique) sert de Largest Contentful Paint, donc pas de régression Lighthouse.

### Question avant de lancer