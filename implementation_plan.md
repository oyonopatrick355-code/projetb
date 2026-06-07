# Plan d'implémentation - Site Internet Clinique CareLumina

Création d'un site web moderne, premium, réactif (responsive) et dynamique pour la clinique privée **CareLumina**. Le site intégrera un design élégant (style glassmorphism, palettes de couleurs HSL soignées, typographie premium), des animations fluides au défilement et au survol, ainsi qu'une interactivité avancée (prise de rendez-vous en étapes, accordéon FAQ, slider de témoignages, et sélecteur de thème sombre/clair).

---

## User Review Required

> [!IMPORTANT]
> - **Palette de couleurs et thèmes** : Le site disposera par défaut d'une transition fluide entre un thème clair épuré (médical professionnel, bleu royal et menthe) et un thème sombre ultra-premium (bleu nuit profond, détails cyan et néon).
> - **Animations CSS & JS** : Nous utiliserons Intersection Observer pour déclencher des animations d'apparition fluides au défilement (Scroll Animations) et des micro-interactions au survol (hover) sur les cartes et boutons.
> - **Aucune dépendance lourde** : Tout sera construit en Vanilla HTML, CSS et JavaScript pour une performance optimale et un contrôle total sur le design. Les icônes proviendront du CDN Lucide Icons pour des visuels nets.

---

## Proposed Changes

### Structure & Styles

#### [MODIFY] [index.html](file:///c:/Users/Bibiche/Desktop/projetb/index.html)
- Création de la structure HTML5 sémantique :
  - `header` avec navbar flottante adaptative (hamburger menu mobile).
  - Section `hero` avec slogan percutant, boutons d'action (CTA) dynamiques, et un panneau d'indicateurs de performance clés (KPIs) avec compteur animé.
  - Section `services` avec cartes filtrables dynamiquement (Cardiologie, Pédiatrie, Neurologie, etc.).
  - Section `appointment` avec un formulaire interactif en 3 étapes (Département -> Docteur & Date -> Infos patient) avec barre de progression animée.
  - Section `doctors` avec un carrousel/grille de profils interactifs et survol dynamique.
  - Section `testimonials` avec un slider interactif de retours d'expérience.
  - Section `faq` avec accordéon fluide en pur CSS/JS.
  - Section `contact` avec formulaire et carte stylisée (mockup interactif).
  - `footer` avec liens rapides, réseaux sociaux et inscription à la newsletter.

#### [MODIFY] [style.css](file:///c:/Users/Bibiche/Desktop/projetb/style.css)
- Conception du système de design (Design System) avec variables CSS (couleurs HSL, ombres, arrondis).
- Support natif du mode sombre (via la classe `.dark-theme`).
- Reset CSS moderne et import de polices Google Fonts (Inter et Outfit).
- Rangement propre des styles par section.
- Animations de transition, effets de survol (`hover`), effet de verre (`glassmorphism`) pour les composants flottants.
- Règles CSS Responsive (Media Queries) pour s'assurer que le site est impeccable sur mobile, tablette et écran large.

#### [NEW] [app.js](file:///c:/Users/Bibiche/Desktop/projetb/app.js)
- Gestion du changement de thème (Sombre/Clair) avec mémorisation dans le `localStorage`.
- Menu mobile (hamburger) avec transition d'ouverture fluide.
- Compteur dynamique pour la section Hero (statistiques s'incrémentant lors du défilement).
- Système de filtrage interactif des services.
- Logique du formulaire de rendez-vous en étapes avec validation dynamique et transition visuelle.
- Carrousel interactif des témoignages (défilement automatique avec boutons d'arrêt et de navigation).
- Accordéon FAQ interactif (hauteur dynamique de l'élément).
- Effet de parallaxe ou micro-mouvements légers sur les cartes au survol de la souris.

---

## Verification Plan

### Automated Tests
*Aucun framework de test unitaire n'est requis pour ce site statique, la vérification se fera par l'analyse syntaxique et l'exécution dans le navigateur.*

### Manual Verification
- **Aperçu dans le navigateur** : Lancement d'un serveur de développement local et test sur différents viewports (Mobile, Tablette, Bureau).
- **Validation Responsiveness** : Vérification de la flexibilité de la grille de services et de la navigation sur écran tactile/mobile.
- **Validation Animations** : Contrôle visuel des transitions de thèmes, des animations d'entrée des cartes, des effets hover et du défilement fluide.
- **Formulaire de réservation** : Test complet du flux de réservation en plusieurs étapes avec contrôle des validations et de la transition finale de confirmation.
