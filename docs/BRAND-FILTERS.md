# Filtres de Marques (Brands) - Documentation

## Vue d'ensemble

Cette documentation décrit l'implémentation des filtres de marques WooCommerce dans les pages de catégories et de résultats de recherche.

## Fonctionnalités

✅ **Affichage en grille** : 2-4 marques par ligne selon la taille de l'écran
✅ **Multi-sources** : Compatible avec plusieurs plugins de marques WooCommerce
✅ **Responsive** : Adapté à tous les écrans (mobile, tablette, desktop)
✅ **Interactif** : Indication visuelle des marques sélectionnées
✅ **Performance** : Scroll optimisé avec hauteur maximale

## Architecture

### 1. Endpoint WordPress (`functions.php`)

L'endpoint `/wp-json/custom/v1/brands` récupère les marques depuis plusieurs sources :

#### Sources supportées :
1. **Perfect Brands for WooCommerce** (`pwb-brand` taxonomy)
2. **YITH WooCommerce Brands** (`product_brand` taxonomy)
3. **Attributs WooCommerce** (`pa_brand` ou `pa_marque`)

#### Exemple de réponse :
```json
{
  "brands": [
    {
      "id": 12,
      "name": "Apple",
      "slug": "apple",
      "count": 45,
      "image": "https://example.com/apple-logo.jpg"
    },
    {
      "id": 13,
      "name": "Samsung",
      "slug": "samsung",
      "count": 38,
      "image": null
    }
  ],
  "total": 2
}
```

### 2. API Nuxt (`server/api/woocommerce/category/[...slug].ts`)

L'API de catégorie extrait les marques des produits et les passe au frontend :

```typescript
// Extraction des marques depuis les produits
products.forEach((product: any) => {
  if (product.brands && Array.isArray(product.brands)) {
    product.brands.forEach((brand: any) => {
      brandsSet.add(brand.name)
    })
  }
})

// Format de retour
const categoryBrands = Array.from(brandsSet).map(brand => ({
  name: brand,
  slug: brand.toLowerCase().replace(/\s+/g, '-'),
  count: products.filter((p: any) => 
    p.brands?.some((b: any) => b.name === brand)
  ).length
}))
```

### 3. Composant ProductFilters.vue

Le composant affiche les marques en grille avec les caractéristiques suivantes :

#### Affichage responsive :
- **Mobile** : 2 colonnes (`grid-cols-2`)
- **Tablette** : 3 colonnes (`md:grid-cols-3`)
- **Desktop Large** : 4 colonnes (`xl:grid-cols-4`)

#### Styles visuels :
```vue
<div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
  <label class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg border border-gray-200 transition-all hover:border-blue-400 hover:shadow-sm"
    :class="{ 'bg-blue-50 border-blue-500 shadow-sm': filters.brands.includes(brand.name) }">
    <!-- Checkbox et nom de la marque -->
  </label>
</div>
```

## Utilisation

### Dans la page de catégorie

```vue
<ProductFilters 
  :products="allProducts" 
  :attributes="categoryAttributes" 
  :brands="categoryBrands"
  @filter="handleFilter" 
  @clear="handleClearFilters" 
/>
```

### Dans la page de recherche

```vue
<ProductFilters
  :products="allProducts"
  :attributes="searchAttributes"
  :brands="searchBrands"
  @filter="handleFilter"
  @clear="handleClearFilters"
/>
```

## Personnalisation

### Modifier le nombre de colonnes

Pour changer le nombre de colonnes par taille d'écran, modifiez les classes Tailwind :

```vue
<!-- 3 colonnes sur mobile, 4 sur tablette, 5 sur desktop -->
<div class="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2">
```

### Modifier la hauteur maximale

```vue
<!-- Augmenter la hauteur de scroll -->
<div class="max-h-96 overflow-y-auto">  <!-- au lieu de max-h-64 -->
```

### Personnaliser les couleurs

```vue
<!-- Changer la couleur de sélection -->
:class="{ 'bg-green-50 border-green-500 shadow-sm': filters.brands.includes(brand.name) }"
```

## Configuration WooCommerce

### Option 1 : Installer un plugin de marques

**Perfect Brands for WooCommerce** (Recommandé)
- Installation : Via WordPress Admin > Extensions > Ajouter
- Avantages : Support des images de marques, SEO optimisé

**YITH WooCommerce Brands**
- Alternative populaire avec plus de fonctionnalités
- Support des widgets et shortcodes

### Option 2 : Créer un attribut personnalisé

1. Aller dans **Produits > Attributs**
2. Créer un nouvel attribut nommé "Brand" ou "Marque"
3. Activer "Utiliser comme filtre"
4. Ajouter les termes (Apple, Samsung, etc.)
5. Assigner l'attribut aux produits

## Filtrage des produits

Le filtrage par marque est géré dans la page de catégorie :

```typescript
const filteredProducts = computed(() => {
  let filtered = [...allProducts.value]
  
  // Filtrage par marques
  if (currentFilters.value.brands.length > 0) {
    filtered = filtered.filter(product => 
      product.brands?.some((brand: any) => 
        currentFilters.value.brands.includes(brand.name)
      )
    )
  }
  
  return filtered
})
```

## Tests

### Tester l'endpoint brands

```bash
# Test endpoint WordPress
curl https://votre-site.com/wp-json/custom/v1/brands

# Devrait retourner :
{
  "brands": [...],
  "total": N
}
```

### Vérifier l'affichage

1. Ouvrir une page de catégorie
2. Vérifier que les marques s'affichent en grille
3. Cocher une marque et vérifier le filtrage
4. Tester sur mobile/tablette/desktop

## Dépannage

### Les marques ne s'affichent pas

1. Vérifier que les produits ont des marques assignées
2. Vérifier l'endpoint : `/wp-json/custom/v1/brands`
3. Vérifier la console du navigateur pour les erreurs
4. Vérifier que `categoryBrands` contient des données

### Les filtres ne fonctionnent pas

1. Vérifier que les produits ont le champ `brands` dans leur structure
2. Vérifier la fonction `handleFilter` dans la page de catégorie
3. Vérifier `currentFilters.value.brands` dans la console

### Style non appliqué

1. Vérifier que Tailwind CSS est configuré correctement
2. Purge du cache Nuxt : `npm run dev` (redémarrer)
3. Vérifier les classes CSS dans l'inspecteur

## Améliorations futures

- [ ] Ajouter les images de marques
- [ ] Recherche de marques (si plus de 20 marques)
- [ ] Tri alphabétique des marques
- [ ] Compteur de produits par marque dynamique
- [ ] Animation de transition lors du filtrage
- [ ] Sauvegarde des filtres dans l'URL

## Support

Pour toute question ou problème :
1. Vérifier cette documentation
2. Consulter les logs WordPress : `wp-content/debug.log`
3. Consulter la console du navigateur

## Changelog

### v1.0.0 (2024)
- ✨ Implémentation initiale
- ✨ Support multi-plugins de marques
- ✨ Affichage en grille responsive
- ✨ Filtrage fonctionnel

