# 📦 Configuration des Shipping Classes WooCommerce

## Date : Novembre 2024

---

## ✅ Ce qui a été mis en place

Le système de frais de livraison utilise maintenant automatiquement les **Shipping Classes** de WooCommerce. Les frais sont calculés selon le produit le plus lourd du panier.

### Correspondance avec delivery-zones.json

| Shipping Class WooCommerce | Champ dans delivery-zones.json | Description |
|---------------------------|-------------------------------|-------------|
| `light` (léger) | `price_light` | Produits < 2kg |
| `medium` (moyen) | `price_medium` | Produits 2-10kg |
| `heavy` (lourd) | `price_heavy` | Produits > 10kg |

---

## 🔧 Configuration dans WordPress/WooCommerce

### Étape 1: Créer les Shipping Classes

1. **Connectez-vous à WordPress Admin**
   - `https://admin.ivoirshop.ci/wp-admin`

2. **Allez dans WooCommerce → Réglages → Expédition → Classes d'expédition**

3. **Créez 3 classes d'expédition:**

   | Nom | Slug | Description |
   |-----|------|-------------|
   | Produit léger | `light` | Pour les articles de moins de 2kg |
   | Produit moyen | `medium` | Pour les articles entre 2kg et 10kg |
   | Produit lourd | `heavy` | Pour les articles de plus de 10kg |

   **⚠️ IMPORTANT:** Le slug doit être exactement `light`, `medium` ou `heavy` pour que le système fonctionne.

### Étape 2: Assigner les classes aux produits

1. **Éditez un produit**
   - WooCommerce → Produits → Modifier un produit

2. **Dans l'onglet "Expédition"**
   - Trouvez le champ "Classe d'expédition"
   - Sélectionnez la classe appropriée (léger, moyen ou lourd)
   - Entrez le poids du produit (optionnel mais recommandé)

3. **Sauvegardez le produit**

---

## 🚀 Comment ça fonctionne

### Logique automatique

1. **Ajout au panier:**
   - Quand un produit est ajouté, sa `shipping_class` est récupérée de WooCommerce
   - Si le produit n'a pas de shipping class, le système utilise le poids:
     - < 2kg → `light`
     - 2-10kg → `medium`
     - > 10kg → `heavy`
   - Par défaut (pas de classe ni de poids) → `medium`

2. **Calcul des frais:**
   - Le système détecte automatiquement le produit le **plus lourd** du panier
   - Les frais de livraison sont calculés selon ce produit
   - Exemple: Si le panier contient 2 produits légers et 1 produit lourd, les frais "lourd" sont appliqués

3. **Affichage au checkout:**
   - La catégorie de livraison est affichée automatiquement
   - L'utilisateur voit "Léger", "Moyen" ou "Lourd"
   - Les frais correspondants sont calculés selon la commune sélectionnée

---

## 📋 Exemples de configuration

### Exemple 1: Téléphone mobile

```
Produit: iPhone 14 Pro
Poids: 0.206 kg
Shipping Class: light
→ Utilisera price_light du fichier delivery-zones.json
```

### Exemple 2: Ordinateur portable

```
Produit: MacBook Pro 16"
Poids: 2.1 kg
Shipping Class: medium
→ Utilisera price_medium du fichier delivery-zones.json
```

### Exemple 3: Télévision

```
Produit: Samsung TV 55"
Poids: 18 kg
Shipping Class: heavy
→ Utilisera price_heavy du fichier delivery-zones.json
```

### Exemple 4: Panier mixte

```
Panier:
- 2x Écouteurs (light)
- 1x Ordinateur portable (medium)
- 1x Télévision (heavy)

→ Le système détecte le plus lourd: heavy
→ Applique price_heavy pour les frais de livraison
```

---

## 🔍 Vérification

### Comment vérifier que ça fonctionne

1. **Vérifiez dans WordPress:**
   ```
   GET https://admin.ivoirshop.ci/wp-json/custom/v1/product/{slug}
   ```
   La réponse doit contenir:
   ```json
   {
     "product": {
       "id": 123,
       "name": "Produit Test",
       "shipping_class": "light",
       "weight": "1.5",
       ...
     }
   }
   ```

2. **Vérifiez dans le panier (Console navigateur):**
   ```javascript
   // Ouvrez la console et tapez:
   useCartStore().items
   // Chaque item doit avoir shipping_class et weight
   ```

3. **Vérifiez au checkout:**
   - Ajoutez des produits au panier
   - Allez au checkout
   - Sélectionnez une ville et commune
   - Vous devriez voir: "Type de livraison déterminé automatiquement"
   - La catégorie (Léger/Moyen/Lourd) s'affiche automatiquement
   - Les frais correspondent au bon prix dans delivery-zones.json

---

## ⚠️ Points importants

1. **Les slugs doivent être exacts:**
   - ✅ `light`, `medium`, `heavy`
   - ❌ `leger`, `Moyen`, `HEAVY`, `produit-leger`

2. **Backup automatique par poids:**
   - Si un produit n'a pas de shipping class, le système utilise le poids
   - Recommandé: Toujours renseigner le poids même avec une shipping class

3. **Produits sans classe ni poids:**
   - Par défaut, ils sont considérés comme `medium`
   - Pensez à configurer les produits pour optimiser les frais

4. **Modification du fichier delivery-zones.json:**
   - Chaque commune doit avoir les 3 prix: `price_light`, `price_medium`, `price_heavy`
   - Les prix sont en FCFA

---

## 📝 Fichiers modifiés

| Fichier | Modification |
|---------|-------------|
| `functions.php` (WordPress) | Ajout de shipping_class dans les endpoints |
| `app/stores/cart.ts` | Ajout getter `heaviestShippingClass` |
| `app/components/ProductCard.vue` | Passage de shipping_class au panier |
| `app/pages/checkout.vue` | Utilisation automatique du shipping_class |

---

## 🆘 Dépannage

### Problème: Les frais ne changent pas selon le produit

**Solution:**
1. Vérifiez que les produits ont bien une shipping class assignée
2. Videz le cache du navigateur et du panier
3. Vérifiez dans la console: `useCartStore().heaviestShippingClass`

### Problème: Tous les produits sont considérés comme "medium"

**Solution:**
1. Les produits n'ont probablement pas de shipping class dans WooCommerce
2. Assignez les classes dans WooCommerce → Produits → Modifier
3. Vérifiez que les slugs sont corrects (`light`, `medium`, `heavy`)

### Problème: L'erreur "Cannot read property 'shipping_class'"

**Solution:**
1. Videz le localStorage: `localStorage.clear()`
2. Rechargez la page
3. Ajoutez à nouveau les produits au panier

---

## 📞 Support

Pour toute question sur la configuration, contactez le support technique.

