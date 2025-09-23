# Guide de Test - URLs /categorie/slug

## ✅ Vérification des URLs

Votre structure d'URLs est correcte :
- **Page de catégorie** : `/categorie/slug` (ex: `/categorie/clothing`)
- **Endpoint API** : `/api/woocommerce/category/slug`
- **Endpoint WordPress** : `/wp-json/custom/v1/categories` et `/wp-json/custom/v1/products/{id}`

## 🧪 Comment Tester

### Étape 1: Démarrer le serveur
```bash
npm run dev
```

### Étape 2: Tester les URLs
```bash
node test-categorie-url.js
```

### Étape 3: Tester via le navigateur

#### Page de test des URLs :
```
http://localhost:3000/test-categorie-url
```

#### Test direct d'une catégorie :
```
http://localhost:3000/categorie/clothing
```

#### Test de l'API :
```
http://localhost:3000/api/woocommerce/category/clothing
```

## 🔍 Vérifications Importantes

### 1. Structure des URLs
- ✅ `/categorie/slug` - Page de catégorie
- ✅ `/api/woocommerce/category/slug` - API de catégorie
- ✅ `/api/api/v1/categories` - Liste des catégories
- ✅ `/api/api/v1/products/category/{id}` - Produits par catégorie

### 2. Fonctionnement des endpoints
- L'endpoint `/api/woocommerce/category/[...slug].ts` fonctionne déjà
- Il utilise les endpoints WordPress existants
- Il gère correctement les slugs de catégories

### 3. Page de catégorie
- La page `/categorie/[...slug].vue` utilise le bon endpoint
- Elle affiche les produits de la catégorie
- Elle gère les erreurs et les états de chargement

## 🚀 Utilisation

### Navigation vers une catégorie
```vue
<template>
  <NuxtLink to="/categorie/clothing">
    Voir la catégorie Clothing
  </NuxtLink>
</template>
```

### Utilisation du composant Nouveaute
```vue
<template>
  <Nouveaute 
    category-slug="clothing"
    :grid-columns="4"
    :products-per-page="12"
  />
</template>
```

### Récupération programmatique
```javascript
// Récupérer les données d'une catégorie
const { data } = await $fetch('/api/woocommerce/category/clothing')
console.log(data.category) // Informations de la catégorie
console.log(data.products) // Liste des produits
```

## 🐛 Dépannage

### Problème : Page 404 pour /categorie/slug
- Vérifiez que la catégorie existe dans WordPress
- Vérifiez que le slug est correct (en minuscules)
- Vérifiez les logs du serveur Nuxt

### Problème : Aucun produit affiché
- Vérifiez que des produits sont assignés à la catégorie
- Vérifiez que les produits sont publiés
- Vérifiez que les produits sont en stock

### Problème : Erreur API
- Vérifiez que `WC_STORE_URL` est correct
- Vérifiez que WordPress est accessible
- Vérifiez que les endpoints WordPress fonctionnent

## 📝 Notes Importantes

1. **Slug de catégorie** : Doit être en minuscules et sans espaces
2. **URLs SEO-friendly** : `/categorie/slug` est optimisé pour le SEO
3. **Cache** : Les données sont mises en cache pour de meilleures performances
4. **Responsive** : La page s'adapte à tous les écrans

## 🎯 Résultat Attendu

Si tout fonctionne correctement :
- ✅ L'URL `/categorie/clothing` affiche la catégorie Clothing
- ✅ Les produits de la catégorie sont visibles
- ✅ La navigation fonctionne correctement
- ✅ L'API retourne les bonnes données
- ✅ Le composant Nouveaute fonctionne

