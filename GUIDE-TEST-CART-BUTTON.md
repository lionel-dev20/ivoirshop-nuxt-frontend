# Guide de Test - Bouton Ajouter au Panier

## 🛒 Fonctionnalités du Bouton

Le bouton "Ajouter au panier" dans `ProductCard.vue` a été amélioré avec :

### ✅ **Fonctionnalités ajoutées**
- ✅ Intégration avec le store Pinia `useCartStore`
- ✅ Gestion des états (chargement, désactivé, etc.)
- ✅ Vérification du stock avant ajout
- ✅ Animation de chargement
- ✅ Ouverture automatique du panier
- ✅ Support des propriétés WordPress
- ✅ Gestion des erreurs

### 🎨 **États du bouton**
- **Normal** : Bleu, "Ajouter au panier"
- **Chargement** : Spinner, "Ajout..."
- **Indisponible** : Gris, "Indisponible" (si rupture de stock)
- **Désactivé** : Gris, clic désactivé

## 🧪 Tests de Diagnostic

### Étape 1: Script de test automatique
```bash
node test-cart-button.js
```

### Étape 2: Page de test visuelle
```
http://localhost:3000/test-cart
```

### Étape 3: Test avec le composant Nouveaute
```
http://localhost:3000/test-nouveaute
```

## 🔍 Vérifications Importantes

### 1. Données du produit
Le bouton nécessite ces propriétés :
- ✅ `id` - ID du produit
- ✅ `name` - Nom du produit
- ✅ `slug` - Slug du produit
- ✅ `regular_price` - Prix régulier
- ✅ `stock_status` - Statut du stock

### 2. Statuts de stock supportés
- ✅ `instock` - En stock (ajout possible)
- ✅ `onbackorder` - Sur commande (ajout possible)
- ❌ `outofstock` - Rupture de stock (bouton désactivé)

### 3. Images du produit
- ✅ Utilise `product.images[0]` si disponible
- ✅ Fallback vers `product.thumbnail`
- ✅ Placeholder si aucune image

## 🚀 Utilisation

### Dans un composant
```vue
<template>
  <ProductCard :product="product" />
</template>

<script setup>
// Le composant gère automatiquement :
// - L'ajout au panier
// - L'ouverture du panier
// - La gestion des états
// - Les animations
</script>
```

### Données requises
```javascript
const product = {
  id: 123,
  name: "Nom du produit",
  slug: "nom-du-produit",
  regular_price: 29.99,
  sale_price: 19.99, // Optionnel
  stock_status: "instock",
  images: [{
    id: 456,
    src: "https://example.com/image.jpg",
    alt: "Description"
  }]
}
```

## 🐛 Dépannage

### Problème : Bouton ne fonctionne pas
- Vérifiez que `useCartStore` est importé
- Vérifiez que le plugin `cart.client.ts` est chargé
- Vérifiez les logs de la console

### Problème : Produit non ajouté
- Vérifiez que `stock_status` est `instock` ou `onbackorder`
- Vérifiez que les données du produit sont complètes
- Vérifiez les logs de la console

### Problème : Panier ne s'ouvre pas
- Vérifiez que `cartStore.openCart()` est appelé
- Vérifiez que le composant `CartSidebar` existe
- Vérifiez les logs de la console

## 📋 Checklist de Test

- [ ] Bouton s'affiche correctement
- [ ] Animation de chargement fonctionne
- [ ] Produit s'ajoute au panier
- [ ] Panier s'ouvre automatiquement
- [ ] Bouton se désactive pour les produits en rupture
- [ ] Images s'affichent dans le panier
- [ ] Prix corrects dans le panier
- [ ] Quantité correcte dans le panier
- [ ] Aucune erreur dans la console

## 🎯 Résultat Attendu

Après correction, le bouton devrait :
- ✅ Afficher l'état correct selon le stock
- ✅ Ajouter le produit au panier au clic
- ✅ Ouvrir le panier automatiquement
- ✅ Afficher une animation de chargement
- ✅ Gérer les erreurs gracieusement
- ✅ Fonctionner avec les données WordPress

## 🔧 Personnalisation

### Changer le style du bouton
```vue
<!-- Dans ProductCard.vue -->
<button
  :class="[
    'mt-3 w-full text-sm py-2 rounded-lg transition',
    // Vos classes personnalisées ici
  ]"
>
```

### Changer le comportement
```javascript
// Dans ProductCard.vue
const addToCart = async () => {
  // Votre logique personnalisée ici
  cartStore.addItem(cartProduct, 1)
  // Autres actions...
}
```

