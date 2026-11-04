# quentinbertails.github.io

Site vitrine de Quentin Bertails, création, refonte, maintenance et hébergement de sites web.
En ligne sur **https://quentinbertails.github.io**, publié automatiquement par GitHub Pages à chaque modification de la branche `main`.

## Contenu du dépôt

| Fichier | Rôle |
|---|---|
| `index.html` | La page d'accueil complète (styles et scripts inclus dans le fichier). |
| `mentions-legales.html` | Mentions légales et politique de confidentialité. |
| `404.html` | Page affichée quand une adresse n'existe pas. |
| `favicon.svg`, `assets/icons/` | Icône d'onglet, icônes pour téléphone et raccourcis. |
| `assets/og-image.png` | Image affichée quand le lien est partagé (WhatsApp, Facebook, LinkedIn…). |
| `assets/fonts/` | Police Schibsted Grotesk, hébergée sur le site (licence `OFL.txt`). |
| `manifest.webmanifest` | Nom, couleurs et icônes quand le site est ajouté à l'écran d'accueil. |
| `robots.txt`, `sitemap.xml` | Indications pour Google et les autres moteurs de recherche. |
| `.nojekyll` | Demande à GitHub Pages de publier les fichiers tels quels. |

## Modifier le site

Le plus simple : ouvrir le fichier sur GitHub, cliquer sur le crayon, modifier, puis **Commit changes**. Le site se met à jour en une à deux minutes (suivi dans l'onglet **Actions**).

Pour remplacer un fichier entier : **Add file → Upload files**, en gardant exactement le même nom.

## À faire

- [ ] **SIRET** : une fois la micro-entreprise créée, remplacer « En cours d'attribution » dans `mentions-legales.html`.
- [ ] **Adresse** : la loi demande une adresse dans les mentions légales d'un site professionnel. Mettre une adresse de domiciliation à la place de « Communiquée sur simple demande par email ».
- [ ] **Formspree** (facultatif) : créer un formulaire sur formspree.io, puis coller son adresse dans `FORM_ENDPOINT` (en bas de `index.html`). Mettre alors à jour la ligne « Comment » de la section Données personnelles des mentions légales (les messages transitent par Formspree).
- [ ] **Tarifs** : vérifier les prix « à partir de » (490 €, 890 €, 29 €/mois), dans la section Tarifs et dans les données structurées en haut de `index.html` (`minPrice`).
- [ ] **Réalisations** : remplacer les vignettes dessinées par de vraies captures dès qu'un site client est en ligne, avec l'accord du client.
- [ ] **Google** : déclarer le site dans Google Search Console et y envoyer `sitemap.xml`. Créer une fiche Google Business Profile si une zone d'intervention est affichée.
- [ ] **Nom de domaine** (facultatif) : après achat, le renseigner dans Settings → Pages → Custom domain, puis remplacer `https://quentinbertails.github.io` dans `index.html`, `mentions-legales.html`, `sitemap.xml` et `robots.txt`.

## Identité visuelle

Couleurs, typographie, logo et composants sont décrits dans la charte graphique. Vert pin `#1D6A4C`, encre `#14201A`, brume `#F2F6F3`, police Schibsted Grotesk.
