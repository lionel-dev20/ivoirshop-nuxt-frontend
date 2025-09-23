# Guide de Test - Catégorie Clothing

## ✅ Corrections Appliquées

### 1. Endpoints WordPress identifiés
Votre `functions.php` contient déjà les endpoints parfaits :
- `/wp-json/custom/v1/categories` - Récupération des catégories
- `/wp-json/custom/v1/products/{category_id}` - Récupération des produits par catégorie

### 2. Endpoints Nuxt créés
- `server/api/api/v1/categories.get.ts` - Proxy vers WordPress
- `server/api/api/v1/products/category/[categoryId].get.ts` - Proxy vers WordPress

### 3. Composant corrigé
- `Nouveaute.vue` utilise maintenant les bons endpoints locaux

## 🧪 Comment Tester

### Étape 1: Vérifier la configuration
Assurez-vous que votre `.env` contient :
```env
WC_STORE_URL=http://ivoir-shop.local
```

### Étape 2: Démarrer le serveur
```bash
npm run dev
```

### Étape 3: Tester les endpoints
```bash
node test-endpoints.js
```

### Étape 4: Tester via le navigateur

#### Test direct WordPress :
```
http://ivoir-shop.local/wp-json/custom/v1/categories
```

#### Test via Nuxt :
```
http://localhost:3000/api/api/v1/categories
```

#### Test de la page de test :
```
http://localhost:3000/test-clothing
```

## 🔍 Vérifications Importantes

### 1. Vérifier que la catégorie "Clothing" existe
Dans l'admin WordPress :
- Aller dans **Produits > Catégories**
- Chercher "Clothing" ou "Vêtements"
- Vérifier que le slug est "clothing" (en minuscules)
- Vérifier qu'il y a des produits dans cette catégorie

### 2. Vérifier les produits
- Les produits doivent être **publiés**
- Les produits doivent être **en stock**
- Les produits doivent être assignés à la catégorie "Clothing"

### 3. Vérifier les logs
Regardez les logs de votre serveur Nuxt pour voir les erreurs éventuelles.

## 🚀 Utilisation du Composant

### Dans une page Vue :
```vue
<template>
  <div>
    <h1>Produits Clothing</h1>
    <Nouveaute 
      category-slug="clothing"
      :grid-columns="4"
      :products-per-page="12"
    />
  </div>
</template>
```

### Avec l'ID de catégorie :
```vue
<template>
  <div>
    <h1>Produits Clothing</h1>
    <Nouveaute 
      :category-id="15"
      :grid-columns="4"
      :products-per-page="12"
    />
  </div>
</template>
```

## 🐛 Dépannage

### Problème : Aucune catégorie trouvée
- Vérifiez que `WC_STORE_URL` est correct
- Vérifiez que WordPress est accessible
- Vérifiez les logs du serveur

### Problème : Catégorie trouvée mais aucun produit
- Vérifiez que des produits sont assignés à la catégorie
- Vérifiez que les produits sont publiés
- Vérifiez que les produits sont en stock

### Problème : Erreur 500
- Vérifiez les logs du serveur Nuxt
- Vérifiez la connectivité avec WordPress
- Vérifiez que WooCommerce est activé

## 📝 Notes Importantes

1. **Slug de catégorie** : Le slug doit être exactement "clothing" (en minuscules)
2. **Produits en stock** : Seuls les produits en stock sont affichés
3. **Cache** : Les données sont mises en cache, redémarrez le serveur si nécessaire
4. **Logs** : Consultez les logs pour diagnostiquer les problèmes

## 🎯 Résultat Attendu

Si tout fonctionne correctement, vous devriez voir :
- La liste des catégories avec "Clothing" inclus
- Les produits de la catégorie "Clothing" affichés dans le composant
- Aucune erreur dans les logs du serveur

