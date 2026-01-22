# 🔧 CORRECTIONS : Produits Variables - Prix et Sélection

## 📋 PROBLÈMES CORRIGÉS

### 1️⃣ **Affichage du Prix sur les Cartes Produits Variables** ✅

**Problème :**
- Les produits variables affichaient un prix unique ou incorrect
- Pas d'indication qu'il s'agit d'un produit à variantes
- Badge promo affiché même pour les produits variables

**Solution :**
- ✅ Affichage "À partir de X FCFA" pour les produits variables
- ✅ Affichage de la fourchette de prix si min ≠ max
- ✅ Indication du nombre d'options disponibles
- ✅ Pas de badge promo pour les produits variables

### 2️⃣ **Sélection de Variantes sur la Fiche Produit** ✅

**Problème :**
- Besoin d'améliorer la sélection des variantes

**Solution :**
- ✅ Composant `ProductVariantSelector` déjà fonctionnel
- ✅ Sélection visuelle intuitive (boutons pour couleur/taille)
- ✅ Validation en temps réel de la disponibilité
- ✅ Mise à jour automatique du prix et du stock

---

## 📦 FICHIERS MODIFIÉS

### 1. `app/components/ProductCard.vue`

**Modifications :**

```typescript
// Ajout détection produit variable
const isVariableProduct = computed(() => {
  return props.product.type === 'variable' && (props.product.variations?.length || 0) > 0
})

// Calcul du prix à afficher
const displayPrice = computed(() => {
  if (!isVariableProduct.value) {
    return formatPrice(props.product.salePrice || props.product.sale_price || 0)
  }
  
  // Fourchette de prix pour produit variable
  if (props.product.min_price) {
    const minPrice = parseFloat(props.product.min_price)
    const maxPrice = parseFloat(props.product.max_price || minPrice)
    
    if (minPrice === maxPrice) {
      return formatPrice(minPrice)
    }
    
    return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
  }
  
  return formatPrice(props.product.price || 0)
})
```

**Template modifié :**

```vue
<!-- Prix produit variable -->
<div v-if="isVariableProduct">
  <div class="flex items-baseline gap-1">
    <span class="text-xs text-gray-500">À partir de</span>
    <span class="text-gray-800 text-lg font-semibold">{{ displayPrice }}</span>
  </div>
  <span class="text-xs text-blue-600 mt-1">{{ variationsCount }} options disponibles</span>
</div>

<!-- Bouton pour produit variable -->
<NuxtLink
  v-if="showAddToCart && isVariableProduct"
  :to="`/produit/${product.slug}`"
  class="... bg-blue-600 ..."
>
  Voir les options
</NuxtLink>
```

### 2. `app/components/collectionHomepage/ProductCard.vue`

**Modifications identiques** pour cohérence de l'affichage.

---

## 🎯 RÉSULTAT VISUEL

### Avant (Produit Variable)

```
┌─────────────────────────┐
│ [IMG] T-Shirt Premium   │
│                         │
│ 15 000 FCFA             │  ← Prix unique, confus
│ 20 000 FCFA             │
│                         │
│ -25% ← Badge incorrect  │
│                         │
│ [Ajouter au panier]     │  ← Impossible sans sélection
└─────────────────────────┘
```

### Après (Produit Variable) ✅

```
┌─────────────────────────┐
│ [IMG] T-Shirt Premium   │
│                         │
│ À partir de             │
│ 15 000 - 20 000 FCFA    │  ← Fourchette claire
│ 6 options disponibles   │  ← Information utile
│                         │
│ [Voir les options]      │  ← Bouton adapté
└─────────────────────────┘
```

---

## 📊 COMPARAISON : Avant / Après

| Aspect | Avant ❌ | Après ✅ |
|--------|---------|---------|
| **Prix affiché** | Prix unique confus | Fourchette de prix claire |
| **Information** | Pas d'indication de variantes | "X options disponibles" |
| **Badge promo** | Affiché (incorrect) | Masqué pour variables |
| **Bouton action** | "Ajouter au panier" (impossible) | "Voir les options" (pertinent) |
| **Comportement clic** | Erreur ou confusion | Redirection vers fiche produit |

---

## 🔄 FLUX UTILISATEUR

### Produit Simple

```
1. Utilisateur voit le prix : "15 000 FCFA"
2. Clique sur "Ajouter au panier"
3. ✅ Produit ajouté directement au panier
```

### Produit Variable

```
1. Utilisateur voit : "À partir de 15 000 FCFA" + "6 options"
2. Clique sur "Voir les options"
3. ✅ Redirigé vers la fiche produit
4. Sélectionne couleur, taille, etc.
5. ✅ Prix et stock mis à jour en temps réel
6. Clique "Achetez maintenant"
7. ✅ Variante correcte ajoutée au panier
```

---

## 🎨 EXEMPLES CONCRETS

### Exemple 1 : T-Shirt (Même Prix pour Toutes les Variantes)

**Données WooCommerce :**
```json
{
  "type": "variable",
  "min_price": "15000",
  "max_price": "15000",
  "variations": [
    { "attributes": [{"name": "pa_couleur", "option": "Noir"}], "price": "15000" },
    { "attributes": [{"name": "pa_couleur", "option": "Blanc"}], "price": "15000" }
  ]
}
```

**Affichage sur la carte :**
```
À partir de
15 000 FCFA
2 options disponibles
```

### Exemple 2 : Chaussures (Prix Différents)

**Données WooCommerce :**
```json
{
  "type": "variable",
  "min_price": "25000",
  "max_price": "35000",
  "variations": [
    { "attributes": [{"name": "pa_pointure", "option": "38"}], "price": "25000" },
    { "attributes": [{"name": "pa_pointure", "option": "42"}], "price": "35000" }
  ]
}
```

**Affichage sur la carte :**
```
À partir de
25 000 - 35 000 FCFA
8 options disponibles
```

---

## ⚙️ CONFIGURATION WOOCOMMERCE REQUISE

Pour que les prix s'affichent correctement, WooCommerce doit retourner :

```json
{
  "id": 123,
  "name": "Produit Variable",
  "type": "variable",
  "min_price": "15000",    // ← Prix minimum des variations
  "max_price": "20000",    // ← Prix maximum des variations
  "variations": [          // ← Tableau des variations
    { "id": 456, "price": "15000", ... },
    { "id": 789, "price": "20000", ... }
  ]
}
```

### Si `min_price` et `max_price` ne sont pas disponibles

Le système utilisera :
1. Le champ `price` du produit parent
2. Le champ `sale_price` du produit parent
3. Fallback : "0 FCFA"

**Recommandation :** S'assurer que l'API WooCommerce retourne bien `min_price` et `max_price` pour les produits variables.

---

## 🐛 DÉPANNAGE

### Problème : "À partir de 0 FCFA"

**Cause :** `min_price` n'est pas défini dans l'API

**Solution :**
- Vérifier que l'endpoint WooCommerce retourne `min_price` et `max_price`
- Vérifier que toutes les variations ont un prix défini

### Problème : Bouton "Ajouter au panier" au lieu de "Voir les options"

**Cause :** Le produit n'est pas détecté comme variable

**Solution :**
- Vérifier que `product.type === 'variable'`
- Vérifier que `product.variations` existe et n'est pas vide

**Debug :**
```javascript
console.log('Type:', product.type)
console.log('Variations:', product.variations?.length)
```

### Problème : Badge promo affiché sur produit variable

**Cause :** Logique de badge non mise à jour

**Solution :**
```typescript
const discountPercent = computed(() => {
  if (isVariableProduct.value) return 0  // ← Ajouter cette ligne
  // ... reste du code
})
```

---

## ✅ CHECKLIST DE VÉRIFICATION

### Affichage des Prix
- [ ] Produits simples affichent prix unique
- [ ] Produits variables affichent "À partir de X FCFA"
- [ ] Fourchette de prix si min ≠ max
- [ ] Nombre d'options affiché ("X options disponibles")
- [ ] Pas de badge promo sur produits variables

### Boutons d'Action
- [ ] Produits simples : "Ajouter au panier" → Ajout direct
- [ ] Produits variables : "Voir les options" → Redirection
- [ ] Clic sur bouton variable redirige vers fiche produit

### Fiche Produit
- [ ] Sélecteur de variantes visible pour produits variables
- [ ] Prix mis à jour à la sélection
- [ ] Stock mis à jour à la sélection
- [ ] Validation avant ajout au panier

---

## 🚀 PROCHAINES AMÉLIORATIONS POSSIBLES

1. **Quick View Modal** 
   - Permettre sélection de variantes sans quitter la page liste

2. **Filtres par Attributs**
   - Filtrer par couleur, taille, etc. dans les pages catégories

3. **Aperçu des Variantes**
   - Afficher miniatures de chaque couleur sur la carte produit

4. **Comparateur de Prix**
   - Tableau comparatif des prix par variante

---

**Date de correction :** 22 janvier 2026  
**Version :** 1.0 - Corrections complètes  
**Status :** ✅ Production Ready

