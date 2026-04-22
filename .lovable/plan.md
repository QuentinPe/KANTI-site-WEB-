

# Recommandations pour amener KANTI au niveau supérieur

Après audit complet du site, voici les chantiers que je te recommande, classés par **impact** (conversion / crédibilité / SEO).

---

## 1. Conversion & génération de leads (impact business immédiat)

**a. Vrai formulaire fonctionnel**
Le formulaire de contact n'envoie rien (`onSubmit={(e) => e.preventDefault()}`). Connecter à Lovable Cloud :
- Table `contact_requests` (nom, email, profil, sujet, message, date)
- Edge function qui envoie un email de notification au cabinet + accusé de réception au prospect (Resend)
- Anti-spam léger (honeypot + rate limiting)

**b. Module de prise de rendez-vous en ligne**
Aujourd'hui le CTA "Prendre rendez-vous" mène au formulaire. Ajouter :
- Soit intégration **Calendly / Cal.com** dans une modale
- Soit un mini-calendrier maison (créneaux × 2 conseillers) avec confirmation email

**c. Lead magnets / contenus à télécharger**
- Guide PDF "10 leviers de défiscalisation 2026"
- Checklist "Préparer sa transmission"
- Échange : email → PDF → entrée dans le CRM

**d. Exit-intent et bandeau de réassurance**
- Bandeau discret en bas (cookie) : "Premier échange offert · 30 min · Confidentiel"
- Modal exit-intent sur les pages expertise

---

## 2. Pages & contenu manquants

**a. Page "Honoraires & transparence"**
Différenciateur fort vs banques. Détailler le modèle (honoraires conseil vs commissions), grille indicative, charte de transparence.

**b. Page "Témoignages clients"**
Aujourd'hui réduit à `Confiance.tsx`. Construire une vraie page :
- Verbatims longs anonymisés
- Vidéos courtes (placeholder)
- Logos partenaires institutionnels (sociétés de gestion, assureurs)

**c. Blog / Actualités enrichi**
La page existe mais semble vide de vrai contenu. Créer 6-8 articles piliers SEO :
- "PER ou assurance-vie en 2026 ?"
- "Loi de finances 2026 : ce qui change"
- "Pacte Dutreil : mode d'emploi"
- Format éditorial cohérent (déjà en place visuellement)

**d. Page "Carrières / Rejoindre KANTI"**
Signal de croissance, attire CGP seniors.

---

## 3. SEO & visibilité locale "Bordeaux"

- **Meta tags dynamiques** par page (react-helmet-async) : title + description optimisés
- **Données structurées JSON-LD** : `FinancialService`, `LocalBusiness`, `FAQPage`, `BreadcrumbList`
- **Sitemap.xml** + robots.txt enrichi
- **Open Graph images** par page (générées ou créées)
- **Maillage interne** : composant "Pages liées" en bas de chaque page expertise
- **Pages locales secondaires** : "CGP Bassin d'Arcachon", "Conseil patrimoine Médoc" (si pertinent géographiquement)

---

## 4. UX & accessibilité

**a. Performance**
- Images Unsplash → assets optimisés WebP/AVIF locaux
- Lazy-loading systématique sur images sous le fold
- Preload de la police heading

**b. Accessibilité (WCAG AA)**
- Audit contrastes (le `text-white/35` du footer est probablement sous le seuil)
- `aria-expanded` sur dropdown header, mobile menu, FAQ
- Skip-to-content link
- Focus visible cohérent

**c. États manquants**
- Loading / success / error sur le formulaire
- Page 404 sur-mesure (cohérente avec l'éditorial)
- Toasts de confirmation premium

---

## 5. Différenciation premium (signature KANTI)

**a. "Espace client" simulé**
Une page `/espace-client` (login factice ou réel via Lovable Cloud) qui montre à quoi ressemble le suivi : tableau de bord patrimoine, documents, messagerie. Argument de vente fort.

**b. Comparateur "Banque vs CGP indépendant"**
Tableau interactif côte à côte qui démontre la valeur ajoutée — très partageable.

**c. Mode sombre / clair switch**
Le site joue déjà sur l'alternance. Un toggle utilisateur premium.

**d. Micro-interactions sonores (optionnel)**
Sur clic CTA principal, son discret type "tick" Apple. À activer/désactiver.

**e. Page "Manifeste"**
Un long-form éditorial type Apple/Aesop : la vision, la philosophie, l'histoire du nom KANTI. Renforce la marque.

---

## 6. Conformité & confiance

- **Bandeau cookies RGPD** conforme (Axeptio-like, en interne)
- **Politique de confidentialité** revue avec les vrais traitements (formulaire → DB)
- **Mentions ORIAS cliquables** vers la fiche officielle
- **Badge "Site sécurisé HTTPS"** + logos CNCGP / AMF en footer (visuels)

---

## Plan d'attaque suggéré (3 vagues)

```text
Vague 1 — Conversion (1 itération)
  → Formulaire fonctionnel + email + DB
  → Lead magnet PDF + landing dédiée
  → Méta tags + JSON-LD sur toutes les pages

Vague 2 — Contenu & crédibilité (1-2 itérations)
  → Page Honoraires
  → Page Témoignages enrichie
  → 4 articles de blog piliers
  → Comparateur Banque vs CGP

Vague 3 — Premium & finition (1 itération)
  → Espace client démo
  → Page Manifeste
  → Audit accessibilité + perfs
  → Cookies RGPD propre
```

---

**Ma recommandation prioritaire** : commencer par **la Vague 1**. Sans formulaire fonctionnel + SEO de base, tout le travail design actuel ne convertit pas. Dis-moi par quoi tu veux qu'on commence et je te prépare le plan d'exécution détaillé.

