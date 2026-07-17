# IvoirShop Homepage Manager

Plugin WordPress qui rend éditable **tout le contenu de la page d'accueil** du site Nuxt (frontend `ivoirshop.ci`) sans toucher au code : carrousel Hero, bloc avantages, partenaires, carrousels de produits (couleurs & bannières), grille « Acheter en ligne », bannières doubles, ventes flash, bloc Nouveautés, texte SEO, et **couleur/image de fond** de la page.

Le contenu est exposé via une API REST publique et consommé automatiquement par le frontend Nuxt.

---

## 1. Installation

1. Zipper le dossier `ivoirshop-homepage-manager/` (ou récupérer le `.zip` déjà généré).
2. WordPress → **Extensions → Ajouter → Téléverser une extension**.
3. Choisir le `.zip`, **Installer**, puis **Activer**.
4. Un nouveau menu **« Page d'accueil »** apparaît dans la barre latérale de l'admin.

> À l'activation, la configuration par défaut reproduit **exactement** le contenu actuel du site. Tant que rien n'est modifié, l'affichage reste identique.

---

## 2. Utilisation

- Menu **Page d'accueil** → onglets par bloc (Fond de page, Carrousel Hero, Partenaires, Carrousels produits, …).
- Les images se choisissent via le bouton **« Choisir dans la médiathèque »** (médiathèque WordPress). On peut aussi coller une URL ou un chemin relatif (`/images/...`).
- Boutons **+ Ajouter** / **Supprimer** pour gérer les listes (slides, marques, vignettes…).
- **Enregistrer les modifications** en bas de page.

Les changements sont visibles sur le site en quelques minutes (cache de 5–10 min).

---

## 3. API REST

```
GET https://admin.ivoirshop.ci/wp-json/ivoirshop/v1/homepage
```

Réponse :

```json
{
  "success": true,
  "version": "1.0.0",
  "updatedAt": "2026-07-17 12:00:00",
  "data": { "background": {…}, "hero": {…}, "partners": {…}, … }
}
```

Le frontend Nuxt l'appelle via `/api/wordpress/homepage` (proxy avec repli).

---

## 4. Architecture (côté Nuxt)

| Élément | Rôle |
|--------|------|
| `server/api/wordpress/homepage.get.ts` | Proxy vers le plugin, repli si WP indisponible |
| `app/plugins/homepage-config.ts` | Récupère la config une fois (SSR), la met en état partagé |
| `app/composables/useHomepageConfig.ts` | Lecture synchrone de la config + repli par défaut |
| Composants (`MyCarousel`, `ListPartner`, `AcheterEnLigne`, `CollapseSeoText`, `index.vue`, …) | Lisent la config, **valeurs par défaut = contenu historique** |

**Sécurité anti-régression :** si WordPress ne répond pas, chaque composant utilise ses valeurs par défaut internes → le site s'affiche normalement.

---

## 5. Notes

- Aucune dépendance externe (pas besoin d'ACF). API native WordPress uniquement.
- Les images uploadées dans WordPress sont servies depuis `admin.ivoirshop.ci`. Les chemins relatifs (`/images/...`) restent servis par le frontend Nuxt.
- Le champ **Texte SEO → Contenu détaillé (HTML)** remplace les sections SEO par défaut s'il est rempli.
