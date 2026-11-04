# quentinbertails.github.io

Site vitrine de Quentin Bertails : création, refonte, maintenance, hébergement et traduction de sites web.
En ligne sur **https://quentinbertails.github.io**, publié automatiquement par GitHub Pages à chaque modification de la branche `main`.

## Contenu du dépôt

| Fichier ou dossier | Rôle |
|---|---|
| `index.html` | Page d'accueil : services, formules, réalisation, conseils, questions, contact. |
| `realisations/blade-runner-2049/` | Le projet d'étude (site d'analyse de fan), autonome, avec ses propres styles et scripts. Non indexé par Google. Aucune image ni réplique du film : à garder ainsi. |
| `mentions-legales.html` | Mentions légales et politique de confidentialité. |
| `404.html` | Page affichée quand une adresse n'existe pas. |
| `assets/css/site.css` | Styles communs à toutes les pages. |
| `assets/js/site.js` | Scripts communs : menu mobile, comparateur avant/après, formulaire de contact. |
| `assets/fonts/` | Police Schibsted Grotesk, hébergée sur le site (licence `OFL.txt`). |
| `favicon.svg`, `assets/icons/`, `assets/og-image.png` | Icônes et image affichée quand le lien est partagé. |
| `manifest.webmanifest`, `robots.txt`, `sitemap.xml` | Réglages pour les téléphones et les moteurs de recherche. |

## Modifier le site

### Avec l'interface d'édition (recommandé)

1. Aller sur **https://app.pagescms.org** et se connecter avec le compte GitHub `quentinbertails`.
2. Autoriser l'accès au dépôt `quentinbertails.github.io`, puis l'ouvrir.
3. Choisir une rubrique dans le menu : Réglages du site, Page d'accueil, Formules, Questions fréquentes, Articles de conseils, Pages services.
4. Modifier, puis cliquer sur **Save**. Le site se met à jour en une à deux minutes.

Pour écrire un nouvel article : **Articles de conseils → Add an entry**. Il apparaît automatiquement sur la page Conseils, sur l'accueil, dans le pied de page et dans le plan du site.

### Organisation des fichiers

Le site est construit par Jekyll (intégré à GitHub Pages) :

| Dossier ou fichier | Contenu |
|---|---|
| `_data/reglages.yml` | Email, téléphone, secteur, SIRET, adresse, Formspree. |
| `_data/accueil.yml`, `_data/formules.yml`, `_data/faq.yml` | Textes de la page d'accueil. |
| `_conseils/*.md` | Un fichier par article. |
| `_services/*.md` | Un fichier par page service. |
| `_layouts/`, `_includes/` | Gabarits (mise en page commune, en-tête, pied de page). |
| `index.html`, `conseils/index.html`, `mentions-legales.html`, `404.html` | Pages qui utilisent ces gabarits. |
| `.pages.yml` | Configuration de l'interface d'édition. |

La balise `google-site-verification` (dans `_includes/head.html`) ne doit jamais être supprimée.

## À faire

- [ ] **SIRET** : une fois la micro-entreprise créée, le renseigner dans **Réglages du site**.
- [ ] **Adresse** : la loi demande une adresse dans les mentions légales d'un site professionnel. La renseigner dans **Réglages du site** (une domiciliation suffit).
- [ ] **Formspree** (facultatif) : créer un formulaire sur formspree.io, puis coller son adresse dans `FORM_ENDPOINT`, dans **Réglages du site** de l'interface d'édition (le texte des mentions légales s'adapte tout seul).
- [ ] **Réalisations** : compléter par de vrais sites clients dès qu'ils existent, avec l'accord du client.
- [ ] **Blade Runner, page Avis** : réécrire le texte avec ton propre ressenti (c'est présenté comme ton avis).
- [ ] **Google Business Profile** : créer la fiche en « zone desservie » (l'adresse n'est pas affichée).
- [ ] **Nom de domaine** (facultatif) : après achat, le renseigner dans Settings → Pages → Custom domain, puis remplacer `https://quentinbertails.github.io` dans `_config.yml` et `robots.txt`.

## Identité visuelle

Couleurs, typographie, logo et composants sont décrits dans la charte graphique : vert pin `#0B6A87`, encre `#102033`, brume `#EEF5F8`, police Schibsted Grotesk.
L'exemple « Camping du Lac » de l'accueil utilise volontairement une autre identité (bleu nuit, sable, orange) : c'est un site client fictif.
