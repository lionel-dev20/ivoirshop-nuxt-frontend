# Filtres de Catégorie - Documentation

## Vue d'ensemble

Le système de filtres dynamiques pour les pages de catégories affiche automatiquement tous les attributs et marques de produits configurés dans WooCommerce.

## Fonctionnalités

### 1. **Filtres par Attributs WooCommerce**
- Affichage automatique de tous les attributs de produits (couleur, taille, stockage, etc.)
- Comptage du nombre de produits pour chaque valeur d'attribut
- Labels en français personnalisables
- Support des attributs avec variations

### 2. **Filtres par Marques**
- Support de plusieurs méthodes de gestion des marques :
  - Taxonomie personnalisée `brands` (Perfect Brands, YITH Brands, etc.)
  - Attribut WooCommerce `brand` ou `marque`
- Comptage du nombre de produits par marque

### 3. **Autres Filtres**
- Filtrage par prix (min/max)
- Filtrage par note
- Filtrage par disponibilité (en stock)
- Filtrage par promotion

## Architecture

### APIs Créées

#### 1. `/api/woocommerce/attributes`
Récupère tous les attributs de produits depuis WooCommerce avec leurs termes.

**Réponse :**
```json
{
  "attributes": [
    {
      "id": 1,
      "name": "Couleur",
      "slug": "color",
      "type": "select",
      "terms": [
        {
          "id": 10,
          "name": "Rouge",
          "slug": "rouge",
          "count": 5
        }
      ]
    }
  ],
  "total": 1
}
```

#### 2. `/api/woocommerce/brands`
Récupère toutes les marques disponibles.

**Réponse :**
```json
{
  "brands": [
    {
      "id": 1,
      "name": "Samsung",
      "slug": "samsung",
      "count": 10,
      "image": "https://..."
    }
  ],
  "total": 1
}
```

#### 3. `/api/woocommerce/category/[...slug]`
Modifié pour inclure les attributs et marques disponibles pour la catégorie.

**Réponse :**
```json
{
  "category": {...},
  "products": [...],
  "attributes": [
    {
      "name": "Couleur",
      "slug": "couleur",
      "label": "Couleur",
      "options": [
        {
          "value": "Rouge",
          "label": "Rouge",
          "count": 3
        }
      ]
    }
  ],
  "brands": [
    {
      "name": "Samsung",
      "slug": "samsung",
      "count": 5
    }
  ]
}
```

### Composants Modifiés

#### 1. `ProductFilters.vue`
- Ajout du support des marques
- Affichage dynamique des attributs avec compteurs
- Interface améliorée avec scroll pour les listes longues

**Props :**
- `products`: Liste des produits
- `attributes`: Attributs disponibles (optionnel, générés automatiquement si non fourni)
- `brands`: Marques disponibles (optionnel)

**Events :**
- `filter`: Émis quand les filtres changent
- `clear`: Émis quand les filtres sont effacés

#### 2. Page `categorie/[...slug].vue`
- Support du filtrage par marques
- Support du filtrage par attributs WooCommerce
- Vérification améliorée des filtres actifs

### Logique de Filtrage

#### Attributs
Le filtrage des attributs vérifie :
1. Le tableau `attributes` du produit WooCommerce
2. Les `meta_data` avec les clés `pa_${attrName}` ou `attribute_${attrName}`

#### Marques
Le filtrage des marques vérifie :
1. Le tableau `brands` du produit
2. L'attribut `brand` ou `marque` dans les attributes

## Configuration WooCommerce

### Ajout d'Attributs

1. **Dans le Dashboard WooCommerce** :
   - Allez dans `Produits > Attributs`
   - Créez un nouvel attribut (ex: "Couleur", "Taille")
   - Ajoutez des termes à cet attribut

2. **Sur les Produits** :
   - Éditez un produit
   - Allez dans l'onglet "Attributs"
   - Ajoutez l'attribut et cochez "Utilisé pour les variations" si nécessaire
   - Sélectionnez les valeurs appropriées

### Ajout de Marques

#### Méthode 1 : Plugin de Marques
Installez un plugin comme :
- Perfect Brands for WooCommerce
- YITH WooCommerce Brands
- WooCommerce Brands

#### Méthode 2 : Attribut WooCommerce
1. Créez un attribut nommé "Marque" ou "Brand"
2. Ajoutez les termes (noms de marques)
3. Assignez-les aux produits

## Labels Personnalisés

Les labels français sont automatiquement générés dans `server/api/woocommerce/category/[...slug].ts` :

```typescript
const labels: Record<string, string> = {
  'color': 'Couleur',
  'size': 'Taille',
  'storage': 'Stockage',
  'ram': 'Mémoire RAM',
  'brand': 'Marque',
  // ... ajoutez vos propres labels ici
}
```

Pour ajouter un nouveau label, modifiez simplement cette liste.

## Exemple d'Utilisation

```vue
<ProductFilters
  :products="allProducts"
  :attributes="categoryAttributes"
  :brands="categoryBrands"
  @filter="handleFilter"
  @clear="handleClearFilters"
/>
```

## Personnalisation

### Modifier l'Ordre des Filtres

Dans `ProductFilters.vue`, réorganisez les sections :
- Prix
- Note
- Marques
- Attributs
- Disponibilité

### Ajouter un Nouveau Type de Filtre

1. Ajoutez le champ dans l'interface `ProductFilters`
2. Ajoutez l'input dans le template de `ProductFilters.vue`
3. Ajoutez la logique de filtrage dans `categorie/[...slug].vue`

### Modifier le Style

Les filtres utilisent Tailwind CSS. Modifiez les classes dans `ProductFilters.vue` pour personnaliser l'apparence.

## Dépannage

### Les attributs ne s'affichent pas
- Vérifiez que les attributs sont marqués "Utilisé pour les variations" dans WooCommerce
- Vérifiez que les produits ont bien ces attributs assignés
- Consultez les logs du serveur pour voir si l'API retourne les données

### Les marques ne s'affichent pas
- Vérifiez que vous avez un plugin de marques installé OU un attribut "brand"/"marque"
- Vérifiez que les produits ont des marques assignées
- Consultez la réponse de l'API `/api/woocommerce/brands`

### Le filtrage ne fonctionne pas
- Vérifiez la structure des données produits dans les logs du navigateur
- Vérifiez que les attributs ont la bonne structure dans la réponse API
- Testez avec `console.log(product.attributes)` dans le filtrage

## Performance

- Les attributs sont calculés côté serveur pour chaque catégorie
- Le filtrage est effectué côté client pour une expérience fluide
- Les listes d'attributs avec plus de 10 options ont un scroll automatique

## Prochaines Améliorations

- [ ] Cache des attributs pour éviter de recalculer à chaque visite
- [ ] Filtres avec recherche pour les longues listes
- [ ] Filtres par plage (prix, poids, etc.) avec slider
- [ ] URL avec paramètres de filtres pour le partage/bookmarking
- [ ] Filtres repliables pour économiser l'espace

