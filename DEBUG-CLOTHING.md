# Guide de débogage - Catégorie Clothing

## Problème identifié
Le composant `Nouveaute.vue` n'affichait pas les produits de la catégorie "Clothing" car il utilisait des endpoints API inexistants.

## Solutions appliquées

### 1. Endpoints API créés
- ✅ `server/api/api/v1/categories.get.ts` - Récupération des catégories
- ✅ `server/api/api/v1/products/category/[categoryId].get.ts` - Récupération des produits par catégorie

### 2. Composant corrigé
- ✅ URLs d'API mises à jour dans `Nouveaute.vue`
- ✅ Utilisation des endpoints locaux au lieu des endpoints externes

### 3. Page de test créée
- ✅ `app/pages/test-clothing.vue` - Page de test pour vérifier le fonctionnement

## Comment tester

### Étape 1: Démarrer le serveur
```bash
npm run dev
```

### Étape 2: Tester les endpoints
```bash
node test-endpoints.js
```

### Étape 3: Visiter la page de test
Ouvrir: `http://localhost:3000/test-clothing`

## Vérifications à faire

### 1. Vérifier que la catégorie "Clothing" existe
- Aller sur `http://localhost:3000/api/api/v1/categories`
- Chercher une catégorie avec `slug: "clothing"` ou `name` contenant "Clothing"

### 2. Vérifier les produits de la catégorie
- Si l'ID de la catégorie Clothing est 15, aller sur:
- `http://localhost:3000/api/api/v1/products/category/15`

### 3. Vérifier la configuration WooCommerce
- S'assurer que `WC_STORE_URL` est correctement configuré dans `.env`
- Vérifier que l'endpoint `/wp-json/custom/v1/categories` fonctionne sur votre WordPress

## Problèmes possibles

### 1. Catégorie "Clothing" n'existe pas
- Vérifier dans l'admin WordPress que la catégorie existe
- Vérifier que le slug est bien "clothing" (en minuscules)
- Vérifier que la catégorie est publiée

### 2. Aucun produit dans la catégorie
- Vérifier que des produits sont assignés à cette catégorie
- Vérifier que les produits sont publiés
- Vérifier que les produits sont en stock

### 3. Erreurs d'API
- Vérifier les logs du serveur Nuxt
- Vérifier la connectivité avec WordPress
- Vérifier les permissions WooCommerce

## Utilisation du composant

```vue
<template>
  <Nouveaute 
    category-slug="clothing"
    :grid-columns="4"
    :products-per-page="12"
  />
</template>
```

Ou avec l'ID de la catégorie:
```vue
<template>
  <Nouveaute 
    :category-id="15"
    :grid-columns="4"
    :products-per-page="12"
  />
</template>
```

