# 🎨 SYSTÈME DE VARIANTES DE PRODUITS

## 📋 VUE D'ENSEMBLE

Le système de variantes permet aux utilisateurs de choisir différentes options (couleur, taille, etc.) pour un produit avant de l'ajouter au panier. Ce guide explique comment tout fonctionne.

---

## ✅ FONCTIONNALITÉS

### 1️⃣ **Sélection de Variantes**
- ✅ Sélection visuelle par boutons (couleur, taille)
- ✅ Sélection par dropdown (autres attributs)
- ✅ Validation de disponibilité en temps réel
- ✅ Options indisponibles désactivées automatiquement

### 2️⃣ **Mise à Jour Dynamique**
- ✅ Prix mis à jour selon la variante sélectionnée
- ✅ Stock mis à jour automatiquement
- ✅ SKU mis à jour
- ✅ Image du produit change si la variante a une image

### 3️⃣ **Affichage dans le Panier**
- ✅ Nom du produit + attributs sélectionnés
- ✅ Prix de la variante
- ✅ SKU de la variante
- ✅ Image de la variante

---

## 🏗️ ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│ PAGE PRODUIT (app/pages/produit/[slug].vue)                │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 1. Récupération des données produit                 │  │
│  │    - Produit de base                                 │  │
│  │    - Variations (si produit variable)               │  │
│  │    - Attributs de variation                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 2. Affichage conditionnel                           │  │
│  │    - SI type = 'variable' → Afficher sélecteur      │  │
│  │    - SINON → Produit simple (comportement normal)   │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 3. Composant ProductVariantSelector                 │  │
│  │    - Affiche les options disponibles                │  │
│  │    - Gère la sélection utilisateur                  │  │
│  │    - Émet l'événement variant-selected              │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 4. Mise à jour de l'affichage                       │  │
│  │    - Prix → displayData (produit ou variante)       │  │
│  │    - Stock → displayData.stock_status               │  │
│  │    - Image → Image de la variante si disponible     │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 5. Ajout au panier                                  │  │
│  │    - Vérifie qu'une variante est sélectionnée       │  │
│  │    - Ajoute la variante (pas le produit parent)     │  │
│  │    - Stocke les attributs sélectionnés              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ PANIER (CartSidebar.vue / CartStore)                       │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Affichage de la variante                            │  │
│  │  - Nom du produit                                   │  │
│  │  - Attributs sélectionnés (Couleur: Noir, etc.)    │  │
│  │  - Prix de la variante                              │  │
│  │  - SKU de la variante                               │  │
│  │  - Image de la variante                             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 STRUCTURE DE DONNÉES

### Produit Variable (de WooCommerce)

```typescript
{
  id: 123,
  name: "T-Shirt Premium",
  type: "variable",  // ← Type important !
  price: "15000",
  sku: "TSHIRT-PARENT",
  
  // Attributs de variation
  attributes: [
    {
      name: "pa_couleur",
      label: "Couleur",
      variation: true,  // ← Attribut utilisé pour les variations
      visible: true,
      options: ["Noir", "Blanc", "Rouge"]
    },
    {
      name: "pa_taille",
      label: "Taille",
      variation: true,
      visible: true,
      options: ["S", "M", "L", "XL"]
    }
  ],
  
  // Variations disponibles
  variations: [
    {
      id: 456,
      sku: "TSHIRT-NOIR-M",
      price: "15000",
      regular_price: "15000",
      sale_price: null,
      stock_status: "instock",
      stock_quantity: 10,
      attributes: [
        { name: "pa_couleur", option: "Noir" },
        { name: "pa_taille", option: "M" }
      ],
      image: {
        src: "https://...",
        alt: "T-Shirt Noir M"
      }
    },
    // ... autres variations
  ]
}
```

### Produit dans le Panier (avec variante)

```typescript
{
  id: 456,  // ID de la VARIANTE
  variation_id: 456,
  parent_id: 123,  // ID du produit parent
  name: "T-Shirt Premium",
  sku: "TSHIRT-NOIR-M",
  price: "15000",
  quantity: 1,
  
  // Attributs sélectionnés pour affichage
  selected_attributes: [
    { name: "pa_couleur", option: "Noir" },
    { name: "pa_taille", option: "M" }
  ],
  
  image: {
    src: "https://...",
    alt: "T-Shirt Noir M"
  }
}
```

---

## 🎯 COMPOSANT ProductVariantSelector

### Props

```typescript
interface Props {
  variations: Variation[]  // Toutes les variations du produit
  attributes: Attribute[]   // Attributs de variation avec options
}
```

### Événements

```typescript
emit('variant-selected', variant: Variation | null)
```

### Logique de Sélection

```
Utilisateur clique sur "Noir"
  ↓
selectedAttributes = { pa_couleur: "Noir" }
  ↓
Recherche variation correspondante:
  - variation.attributes contient { name: "pa_couleur", option: "Noir" }
  - ET tous les autres attributs sélectionnés
  ↓
SI trouvée → Émettre variant-selected(variation)
SINON → Émettre variant-selected(null) + Message d'erreur
```

### Validation de Disponibilité

```typescript
// Vérifie si une option est disponible
isOptionAvailable(attributeName, option) {
  // Simule la sélection de cette option
  const tempSelection = { ...selectedAttributes, [attributeName]: option }
  
  // Cherche si une variation correspondante existe ET est en stock
  return variations.some(variation => {
    return variation.attributes.match(tempSelection) 
           && variation.stock_status === 'instock'
  })
}
```

---

## 🎨 STYLES D'AFFICHAGE

### Attributs affichés comme BOUTONS
- `pa_couleur` / `pa_color` / `couleur` / `color`
- `pa_taille` / `pa_size` / `taille` / `size`

```vue
<button
  :class="[
    'px-4 py-2 border-2 rounded-md',
    isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-300',
    !isAvailable ? 'opacity-50 cursor-not-allowed line-through' : ''
  ]"
>
  Noir
</button>
```

### Autres attributs affichés en DROPDOWN

```vue
<select>
  <option value="">Choisir...</option>
  <option :disabled="!isAvailable">Option 1</option>
  <option :disabled="!isAvailable">Option 2</option>
</select>
```

---

## 🔄 FLUX UTILISATEUR

### 1. Utilisateur arrive sur la fiche produit

```
┌─────────────────────────────────────────┐
│ T-Shirt Premium                         │
│ 15 000 FCFA                             │
│                                         │
│ ⚠️ Sélectionnez des options pour voir  │
│    le prix                              │
│                                         │
│ 🎨 Couleur:                             │
│  [Noir] [Blanc] [Rouge]                │
│                                         │
│ 📏 Taille:                              │
│  [S] [M] [L] [XL]                       │
│                                         │
│ [Sélectionner les options]             │
└─────────────────────────────────────────┘
```

### 2. Utilisateur sélectionne "Noir"

```
┌─────────────────────────────────────────┐
│ T-Shirt Premium                         │
│ 15 000 FCFA                             │
│                                         │
│ 🎨 Couleur: Noir                        │
│  [●Noir] [Blanc] [Rouge]               │
│                                         │
│ 📏 Taille:                              │
│  [S] [M] [L] [XL-barré]  ← XL indispo  │
│                                         │
│ [Sélectionner les options]             │
└─────────────────────────────────────────┘
```

### 3. Utilisateur sélectionne "M"

```
┌─────────────────────────────────────────┐
│ T-Shirt Premium                         │
│ 15 000 FCFA                             │
│                                         │
│ 🎨 Couleur: Noir                        │
│  [●Noir] [Blanc] [Rouge]               │
│                                         │
│ 📏 Taille: M                            │
│  [S] [●M] [L] [XL-barré]               │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ ✅ Variante sélectionnée            │ │
│ │ Prix: 15 000 FCFA                   │ │
│ │ Disponibilité: En stock             │ │
│ │ SKU: TSHIRT-NOIR-M                  │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [🛒 Achetez maintenant]                │
└─────────────────────────────────────────┘
```

### 4. Ajout au panier

```
┌─────────────────────────────────────────┐
│ Panier (1)                              │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ [IMG] T-Shirt Premium               │ │
│ │       Couleur: Noir                 │ │
│ │       Taille: M                     │ │
│ │       SKU: TSHIRT-NOIR-M            │ │
│ │                                     │ │
│ │       Qté: 1        15 000 FCFA     │ │
│ │       [Supprimer]                   │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Total: 15 000 FCFA                      │
│ [Passer commande]                       │
└─────────────────────────────────────────┘
```

---

## 📝 FICHIERS MODIFIÉS / CRÉÉS

| Fichier | Rôle | Modifications |
|---------|------|---------------|
| **`app/components/ProductVariantSelector.vue`** | Composant de sélection | ✨ **CRÉÉ** - Sélection de variantes |
| **`app/pages/produit/[slug].vue`** | Page produit | ✅ Modifié - Intégration variantes |
| **`app/components/CartSidebar.vue`** | Panier latéral | ✅ Modifié - Affichage attributs |

---

## 🔧 CONFIGURATION WOOCOMMERCE

### Créer un Produit Variable

1. **Créer les Attributs**
   - WooCommerce → Produits → Attributs
   - Créer : "Couleur", "Taille", etc.
   - Ajouter les termes : "Noir", "Blanc", "S", "M", "L"

2. **Créer le Produit Parent**
   - Type de produit : **Variable**
   - Attributs → Ajouter attributs
   - Cocher "Utilisé pour les variations"
   - Sélectionner les valeurs

3. **Créer les Variations**
   - Onglet Variations
   - "Créer toutes les variations à partir des attributs"
   - Définir prix, stock, SKU pour chaque variation
   - Ajouter image pour chaque variation (optionnel)

---

## ✅ CHECKLIST DE VÉRIFICATION

### Configuration Produit
- [ ] Type de produit = "variable"
- [ ] Attributs créés avec "variation = true"
- [ ] Toutes les variations créées
- [ ] Prix défini pour chaque variation
- [ ] Stock défini pour chaque variation
- [ ] SKU unique pour chaque variation
- [ ] Images pour les variations (optionnel)

### Affichage Frontend
- [ ] Sélecteur de variantes visible
- [ ] Options indisponibles désactivées
- [ ] Prix mis à jour à la sélection
- [ ] Stock mis à jour à la sélection
- [ ] Image change si variante a une image
- [ ] Message si aucune variante sélectionnée

### Panier
- [ ] Variante ajoutée (pas le produit parent)
- [ ] Attributs affichés dans le panier
- [ ] Prix correct
- [ ] SKU correct
- [ ] Image correcte

---

## 🐛 DÉPANNAGE

### Problème : Sélecteur de variantes ne s'affiche pas

**Cause possible :**
- Le produit n'est pas de type "variable"
- Pas de variations créées
- Attributs non marqués comme "variation = true"

**Solution :**
```javascript
console.log('Type:', product.value?.type)  // Doit être "variable"
console.log('Variations:', product.value?.variations)  // Doit être un tableau non vide
console.log('Attributs:', product.value?.attributes)  // Doit avoir variation: true
```

### Problème : Toutes les options sont désactivées

**Cause possible :**
- Toutes les variations sont en rupture de stock
- Les attributs ne correspondent pas aux variations

**Solution :**
- Vérifier le stock des variations dans WooCommerce
- Vérifier que les noms d'attributs correspondent exactement

### Problème : Prix ne change pas

**Cause possible :**
- `displayData` n'est pas utilisé dans le template
- Variante sélectionnée n'a pas de prix

**Solution :**
```vue
<!-- Utiliser displayData au lieu de product -->
<span>{{ formatPrice(displayData.price) }}</span>
```

---

## 🎯 EXEMPLE COMPLET

### Produit dans WooCommerce

```
Nom: Chaussures de Sport
Type: Variable
Prix: 25 000 - 30 000 FCFA

Attributs:
  - Couleur: [Noir, Blanc, Bleu]
  - Pointure: [38, 39, 40, 41, 42]

Variations (6 créées):
  1. Noir-38  → 25000 FCFA, Stock: 5
  2. Noir-40  → 25000 FCFA, Stock: 3
  3. Blanc-39 → 27000 FCFA, Stock: 0 (rupture)
  4. Blanc-41 → 27000 FCFA, Stock: 8
  5. Bleu-40  → 30000 FCFA, Stock: 2
  6. Bleu-42  → 30000 FCFA, Stock: 4
```

### Affichage sur la Fiche Produit

```
Utilisateur voit:
  - Couleur: [Noir] [Blanc] [Bleu]
  - Pointure: [38] [39] [40] [41] [42]

Utilisateur sélectionne Blanc:
  - 39 devient désactivé (rupture de stock)
  - Prix affiché: "27 000 - 27 000 FCFA"

Utilisateur sélectionne 41:
  - Prix: 27 000 FCFA
  - Stock: En stock
  - SKU: CHAUSSURE-BLANC-41
  - Bouton: "🛒 Achetez maintenant"
```

---

**Date de création:** 22 janvier 2026  
**Version:** 1.0 - Système complet  
**Status:** ✅ Prêt pour production

