# 🚚 Système de Calcul des Frais de Livraison - Guide Complet

## ✅ Problème Résolu

Le problème des **frais de livraison à 0 FCFA** a été corrigé. Le système calcule maintenant correctement les frais en fonction :
- De la **shipping class** (produit léger/moyen/lourd) du produit le plus lourd dans le panier
- De la **région/ville** de livraison
- Du **quartier/commune** de livraison

## 📁 Fichiers Créés/Modifiés

### Nouveaux fichiers

1. **`app/utils/shipping-class-mapper.ts`** - Utilitaire de mapping des shipping classes
2. **`app/components/DeliveryDebugPanel.vue`** - Composant de debug visuel
3. **`scripts/verify-delivery-zones.mjs`** - Script de vérification du fichier JSON
4. **`CONFIGURATION_LIVRAISON.md`** - Guide de configuration détaillé
5. **`CORRECTIONS_FRAIS_LIVRAISON.md`** - Résumé des corrections techniques

### Fichiers modifiés

1. **`app/stores/cart.ts`** - Amélioration du calcul du shipping_class
2. **`app/pages/checkout.vue`** - Amélioration de l'affichage et du calcul des frais

## 🚀 Comment Utiliser

### 1. Vérifier l'intégrité des données

```bash
node scripts/verify-delivery-zones.mjs
```

Ce script vérifie que toutes les communes ont des prix valides. Résultat actuel :
- ✅ **83 communes** vérifiées
- ✅ **Aucun prix à 0**
- ⚠️ **1 commune** avec prix incohérents (Point relais Faya - probablement intentionnel)

### 2. Configurer WooCommerce

#### Créer les Shipping Classes

Dans **WooCommerce > Réglages > Livraison > Classes de livraison**, créez :

| Nom | Slug | Description |
|-----|------|-------------|
| Produit Léger | `light` | Moins de 2kg |
| Produit Moyen | `medium` | 2kg à 10kg |
| Produit Lourd | `heavy` | Plus de 10kg |

**Important :** Les slugs doivent être **exactement** `light`, `medium`, ou `heavy`.

#### Assigner aux Produits

Pour chaque produit :
1. Éditer le produit
2. Onglet **Livraison**
3. Champ **Classe de livraison** → Sélectionner la classe appropriée
4. Sauvegarder

### 3. Tester le Système

1. Ajoutez des produits au panier
2. Allez sur `/checkout`
3. Ouvrez la console du navigateur (F12)
4. Sélectionnez ville et quartier
5. Vérifiez les logs :

```
🎯 Shipping class le plus lourd du panier: heavy
💵 getPrice appelé: { cityName: "Abidjan-lagunes", communeName: "Cocody", productType: "heavy" }
✅ Ville trouvée: Abidjan-lagunes - Nombre de communes: 22
✅ Commune trouvée: Cocody - Prix: { light: 1500, medium: 2000, heavy: 3000 }
💰 Prix final pour type "heavy" (clé: price_heavy): 3000
```

6. Les frais doivent s'afficher : **3,000 FCFA**

### 4. Debug Visuel (Optionnel)

Pour activer le panneau de debug sur la page checkout, ajoutez temporairement :

```vue
<template>
  <div>
    <!-- Votre code existant -->
    
    <DeliveryDebugPanel 
      :show="true"
      :selected-city="orderForm.city"
      :selected-commune="orderForm.commune"
      :product-type="selectedProductType"
    />
  </div>
</template>
```

Le panneau affichera en temps réel :
- 🛒 Articles du panier et leurs shipping classes
- 📍 Sélection actuelle (ville, commune, type)
- 💰 Prix pour chaque type de produit
- ✅ Status et problèmes détectés

## 🔧 Fonctionnalités du Système

### Mapping Intelligent

Le système accepte plusieurs variations de noms pour les shipping classes :

**Pour "light" :**
- `light`, `leger`, `léger`
- `produit-leger`, `produit leger`, `produit_leger`

**Pour "medium" :**
- `medium`, `moyen`
- `produit-moyen`, `produit moyen`, `produit_moyen`

**Pour "heavy" :**
- `heavy`, `lourd`
- `produit-lourd`, `produit lourd`, `produit_lourd`

### Fallback Automatique

Si un produit n'a pas de shipping_class :

1. **Utiliser le poids :**
   - Poids < 2kg → `light`
   - 2kg ≤ Poids ≤ 10kg → `medium`
   - Poids > 10kg → `heavy`

2. **Par défaut :** `medium`

### Sélection de la Classe la Plus Lourde

Si le panier contient plusieurs produits avec différentes shipping classes, le système utilise **automatiquement la plus lourde** :

Exemple :
- Produit 1 : `light`
- Produit 2 : `heavy`
- Produit 3 : `medium`

→ Le système calcule avec `heavy` (la plus lourde)

## 📊 Structure des Données

### delivery-zones.json

```json
{
  "id": 1,
  "name": "Abidjan-lagunes",
  "communes": [
    {
      "id": 103,
      "name": "Cocody",
      "price_light": 1500,   // Prix pour produits légers
      "price_medium": 2000,  // Prix pour produits moyens
      "price_heavy": 3000    // Prix pour produits lourds
    }
  ]
}
```

**Statistiques actuelles :**
- 2 régions
- 83 communes
- Tous les prix sont non-nuls ✅

## ❓ Dépannage

### Les frais affichent toujours 0

**Cause possible :** Les produits n'ont pas de shipping_class dans WooCommerce

**Solutions :**
1. Vérifier que les shipping classes existent dans WooCommerce avec les bons slugs
2. Vérifier que chaque produit a une classe assignée
3. Ajouter le poids des produits en backup
4. Vider le cache du navigateur et le localStorage
5. Activer le panneau de debug pour voir les valeurs en temps réel

### Les prix sont incorrects

**Cause possible :** Mauvais mapping des shipping classes

**Solutions :**
1. Vérifier les slugs dans WooCommerce (doivent être `light`, `medium`, `heavy`)
2. Regarder les logs de la console pour voir quel type est détecté
3. Vérifier les prix dans `delivery-zones.json`

### Le shipping_class ne change pas

**Comportement normal :** Le système prend toujours la classe la plus lourde du panier

Si vous avez un produit `heavy` et un `light`, le système calculera avec `heavy`.

## 📞 Support

Pour toute aide supplémentaire :

1. Exécutez : `node scripts/verify-delivery-zones.mjs`
2. Activez le panneau de debug
3. Copiez les logs de la console
4. Consultez `CONFIGURATION_LIVRAISON.md` pour plus de détails

## 🎉 Prochaines Étapes

1. ✅ Créer les shipping classes dans WooCommerce
2. ✅ Assigner les classes à tous les produits
3. ✅ Tester avec différents types de produits
4. ✅ Vérifier que les frais s'affichent correctement
5. ⚠️ Corriger "Point relais Faya" si les prix incohérents ne sont pas intentionnels

---

**Version :** 1.0
**Date :** ${new Date().toLocaleDateString('fr-FR')}
**Status :** ✅ Système opérationnel

