# Configuration des Frais de Livraison

## 🎯 Vue d'ensemble

Ce système calcule automatiquement les frais de livraison en fonction de :
1. La **classe de livraison** (shipping class) du produit le plus lourd dans le panier
2. La **région/ville** de livraison
3. Le **quartier/commune** de livraison

## 📦 Configuration des Shipping Classes dans WooCommerce

### Étape 1 : Créer les Shipping Classes

Dans votre administration WooCommerce, allez dans :
**WooCommerce > Réglages > Livraison > Classes de livraison**

Créez ces 3 classes de livraison :

| Nom de la classe | Slug | Description |
|-----------------|------|-------------|
| Produit Léger | `light` | Pour les produits de moins de 2kg |
| Produit Moyen | `medium` | Pour les produits de 2kg à 10kg |
| Produit Lourd | `heavy` | Pour les produits de plus de 10kg |

**⚠️ IMPORTANT :** Les slugs doivent être exactement `light`, `medium`, ou `heavy` (en minuscules).

### Étape 2 : Assigner les Classes aux Produits

Pour chaque produit :

1. Allez dans **Produits > Tous les produits**
2. Éditez un produit
3. Dans l'onglet **Livraison**, trouvez le champ **Classe de livraison**
4. Sélectionnez la classe appropriée :
   - `light` : si le produit pèse moins de 2kg
   - `medium` : si le produit pèse entre 2kg et 10kg
   - `heavy` : si le produit pèse plus de 10kg

### Variations de noms acceptées

Le système accepte également ces variations (automatiquement normalisées) :

**Pour "light" :**
- `light`
- `leger` ou `léger`
- `produit-leger`, `produit-léger`
- `produit_leger`, `produit_léger`

**Pour "medium" :**
- `medium`
- `moyen`
- `produit-moyen`
- `produit_moyen`

**Pour "heavy" :**
- `heavy`
- `lourd`
- `produit-lourd`
- `produit_lourd`

## 🗺️ Structure du fichier delivery-zones.json

Le fichier `app/data/delivery-zones.json` contient les tarifs de livraison :

```json
{
  "id": 101,
  "name": "Riviera Faya",
  "price_light": 500,    // Prix pour produits légers
  "price_medium": 1000,  // Prix pour produits moyens
  "price_heavy": 1500    // Prix pour produits lourds
}
```

## 🔍 Débogage

### Vérifier dans la console du navigateur

Ouvrez la console de développement (F12) sur la page checkout et vous verrez :

```
🎯 Shipping class le plus lourd du panier: medium
📦 Articles dans le panier:
  - Nom du produit: shipping_class="medium", weight=5, resolved="medium", weight_value=2
💵 getPrice appelé: { cityName: "Abidjan-lagunes", communeName: "Cocody", productType: "medium" }
✅ Ville trouvée: Abidjan-lagunes - Nombre de communes: 22
✅ Commune trouvée: Cocody - Prix: { light: 1500, medium: 2000, heavy: 3000 }
💰 Prix final pour type "medium" (clé: price_medium): 2000
```

### Problèmes courants et solutions

#### 1. Frais de livraison à 0

**Cause :** Les produits n'ont pas de shipping_class dans WooCommerce

**Solution :** 
- Vérifiez que chaque produit a une classe de livraison assignée
- Le système utilisera le poids du produit en backup si disponible
- Par défaut, le système utilisera "medium" si rien n'est défini

#### 2. Mauvais tarif appliqué

**Cause :** La classe de livraison ne correspond pas aux slugs attendus

**Solution :**
- Vérifiez que les slugs dans WooCommerce sont bien `light`, `medium`, ou `heavy`
- Utilisez une des variations acceptées listées ci-dessus

#### 3. Le type ne change pas quand on ajoute des produits

**Cause :** Le système prend toujours la classe la plus lourde du panier

**Solution :**
- C'est le comportement normal
- Si vous avez un produit "heavy" et un "light", le système calculera avec "heavy"
- Cela garantit que les frais couvrent le produit le plus lourd

## 🔧 Fallback automatique

Si un produit n'a pas de shipping_class, le système utilise cette logique :

1. **Vérifier le poids du produit :**
   - Poids < 2kg → `light`
   - 2kg ≤ Poids ≤ 10kg → `medium`
   - Poids > 10kg → `heavy`

2. **Si pas de poids :**
   - Utiliser `medium` par défaut

## ✅ Checklist de vérification

- [ ] Les 3 shipping classes sont créées dans WooCommerce (`light`, `medium`, `heavy`)
- [ ] Chaque produit a une shipping class assignée
- [ ] Le fichier `delivery-zones.json` contient les 3 prix pour chaque commune
- [ ] Les slugs des shipping classes correspondent exactement (ou utilisent les variations acceptées)
- [ ] Le poids est renseigné pour chaque produit (en backup)

## 📞 Support

Si les frais de livraison s'affichent toujours à 0 après ces vérifications :

1. Ouvrez la console du navigateur (F12)
2. Allez sur la page de checkout
3. Copiez tous les logs qui commencent par 🎯, 📦, 💵, ✅, ou ❌
4. Contactez le support technique avec ces logs

