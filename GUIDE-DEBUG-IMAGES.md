# Guide de Debug - Images de Produits

## 🖼️ Problème Identifié

Les images des produits ne s'affichent pas dans le composant `ProductCard.vue`.

## 🔍 Causes Possibles

### 1. Format de données incorrect
- Le composant attend `product.thumbnail` mais WordPress retourne `product.images[]`
- Les propriétés de prix ne correspondent pas (`regularPrice` vs `regular_price`)

### 2. Images non accessibles
- URLs d'images incorrectes
- Images supprimées du serveur WordPress
- Problèmes de CORS ou de permissions

### 3. Configuration WordPress
- Images non uploadées correctement
- Problème de configuration des tailles d'images
- Permissions de fichiers incorrectes

## ✅ Corrections Appliquées

### 1. Mise à jour du composant ProductCard.vue
- ✅ Support du format `images[]` de WordPress
- ✅ Fallback vers `thumbnail` si disponible
- ✅ Image placeholder en cas d'erreur
- ✅ Support des propriétés WordPress (`regular_price`, `sale_price`, `on_sale`)

### 2. Fonctions ajoutées
- ✅ `getProductImage()` - Récupère la bonne image
- ✅ `handleImageError()` - Gère les erreurs d'images
- ✅ Support des propriétés WordPress

### 3. Image placeholder créée
- ✅ `/public/images/placeholder-product.jpg`
- ✅ Affichage en cas d'image manquante

## 🧪 Tests de Diagnostic

### Étape 1: Script de test des images
```bash
node test-product-images.js
```

### Étape 2: Page de test visuelle
```
http://localhost:3000/test-images
```

### Étape 3: Test du composant Nouveaute
```
http://localhost:3000/test-nouveaute
```

## 🔧 Solutions

### Solution 1: Vérifier les données WordPress
```javascript
// Dans la console du navigateur
fetch('/api/api/v1/categories')
  .then(r => r.json())
  .then(data => {
    console.log('Première catégorie:', data[0]);
    return fetch(`/api/api/v1/products/category/${data[0].id}`);
  })
  .then(r => r.json())
  .then(data => {
    console.log('Premier produit:', data.products[0]);
    console.log('Images:', data.products[0].images);
  });
```

### Solution 2: Vérifier l'accessibilité des images
```javascript
// Tester une URL d'image spécifique
fetch('URL_DE_L_IMAGE')
  .then(response => {
    if (response.ok) {
      console.log('Image accessible');
    } else {
      console.log('Image non accessible:', response.status);
    }
  });
```

### Solution 3: Utiliser le composant corrigé
```vue
<template>
  <ProductCard :product="product" />
</template>

<script setup>
// Le composant gère maintenant automatiquement :
// - product.images[] (format WordPress)
// - product.thumbnail (format alternatif)
// - Image placeholder en cas d'erreur
</script>
```

## 📋 Checklist de Vérification

- [ ] Les données WordPress contiennent `images[]`
- [ ] Les URLs d'images sont accessibles
- [ ] Le composant `ProductCard.vue` est mis à jour
- [ ] L'image placeholder existe (`/public/images/placeholder-product.jpg`)
- [ ] Les propriétés de prix sont correctes
- [ ] Les images s'affichent dans la page de test
- [ ] Aucune erreur dans la console

## 🎯 Format de Données Attendu

### Format WordPress (correct)
```javascript
{
  id: 123,
  name: "Nom du produit",
  slug: "nom-du-produit",
  images: [
    {
      id: 456,
      src: "https://example.com/image.jpg",
      alt: "Description de l'image"
    }
  ],
  regular_price: "29.99",
  sale_price: "19.99",
  on_sale: true,
  stock_status: "instock"
}
```

### Format utilisé par ProductCard
```javascript
{
  id: 123,
  name: "Nom du produit",
  slug: "nom-du-produit",
  thumbnail: "https://example.com/image.jpg", // Optionnel
  images: [...], // Utilisé en priorité
  regularPrice: 29.99, // Mappé depuis regular_price
  salePrice: 19.99, // Mappé depuis sale_price
  onSale: true // Mappé depuis on_sale
}
```

## 🚀 Résolution Attendue

Après correction, vous devriez voir :
- ✅ Les images s'affichent dans ProductCard
- ✅ Image placeholder pour les produits sans image
- ✅ Prix et promotions correctement affichés
- ✅ Aucune erreur dans la console
- ✅ Composant Nouveaute fonctionnel

