# quentinbertails.github.io

Site vitrine de Quentin Bertails : création, refonte, maintenance, hébergement et traduction de sites web.
En ligne sur **https://quentinbertails.github.io**, publié automatiquement par GitHub Pages à chaque modification de la branche `main`.

## Contenu du dépôt

| Fichier ou dossier | Rôle |
|---|---|
| `index.html` | Page d'accueil : services, formules, réalisation, conseils, questions, contact. |
| `services/` | Une page par service : création de site vitrine, refonte, maintenance et hébergement, traduction en anglais. |
| `conseils/` | Les articles de conseils et leur page d'accueil (`conseils/index.html`). |
| `realisations/blade-runner-2049/` | Le projet d'étude (site d'analyse de fan), autonome, avec ses propres styles et scripts. Non indexé par Google. Aucune image ni réplique du film : à garder ainsi. |
| `mentions-legales.html` | Mentions légales et politique de confidentialité. |
| `404.html` | Page affichée quand une adresse n'existe pas. |
| `assets/css/site.css` | Styles communs à toutes les pages. |
| `assets/js/site.js` | Scripts communs : menu mobile, comparateur avant/après, formulaire de contact. |
| `assets/fonts/` | Police Schibsted Grotesk, hébergée sur le site (licence `OFL.txt`). |
| `favicon.svg`, `assets/icons/`, `assets/og-image.png` | Icônes et image affichée quand le lien est partagé. |
| `manifest.webmanifest`, `robots.txt`, `sitemap.xml` | Réglages pour les téléphones et les moteurs de recherche. |

## Modifier le site

Le plus simple : ouvrir le fichier sur GitHub, cliquer sur le crayon, modifier, puis **Commit changes**. Le site se met à jour en une à deux minutes (suivi dans l'onglet **Actions**).

- Le **menu** et le **pied de page** sont répétés dans chaque page : une modification doit être faite dans tous les fichiers `.html`.
- Une **nouvelle page** doit aussi être ajoutée à `sitemap.xml`.
- La balise `google-site-verification` en haut de `index.html` ne doit jamais être supprimée (elle prouve à Google que le site t'appartient).

## À faire

- [ ] **SIRET** : une fois la micro-entreprise créée, remplacer « En cours d'attribution » dans `mentions-legales.html`.
- [ ] **Adresse** : la loi demande une adresse dans les mentions légales d'un site professionnel. Mettre une adresse de domiciliation à la place de « Communiquée sur simple demande par email ».
- [ ] **Formspree** (facultatif) : créer un formulaire sur formspree.io, puis coller son adresse dans `FORM_ENDPOINT`, en haut de `assets/js/site.js`. Mettre alors à jour la ligne « Comment » de la section Données personnelles des mentions légales (les messages transitent par Formspree).
- [ ] **Réalisations** : compléter par de vrais sites clients dès qu'ils existent, avec l'accord du client.
- [ ] **Blade Runner, page Avis** : réécrire le texte avec ton propre ressenti (c'est présenté comme ton avis).
- [ ] **Google Business Profile** : créer la fiche en « zone desservie » (l'adresse n'est pas affichée).
- [ ] **Nom de domaine** (facultatif) : après achat, le renseigner dans Settings → Pages → Custom domain, puis remplacer `https://quentinbertails.github.io` dans tous les fichiers `.html`, `sitemap.xml` et `robots.txt`.

## Identité visuelle

Couleurs, typographie, logo et composants sont décrits dans la charte graphique : vert pin `#1D6A4C`, encre `#14201A`, brume `#F2F6F3`, police Schibsted Grotesk.
L'exemple « Camping du Lac » de l'accueil utilise volontairement une autre identité (bleu nuit, sable, orange) : c'est un site client fictif.
