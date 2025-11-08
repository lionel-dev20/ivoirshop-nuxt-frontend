# 🔄 Flux de données - Filtres de Marques

## Architecture globale

```
┌─────────────────────────────────────────────────────────────────┐
│                         UTILISATEUR                              │
│                    (Visite /categorie/...)                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NUXT.JS (Frontend)                          │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Page: /categorie/[...slug].vue                          │  │
│  │                                                           │  │
│  │  1. Charge les produits de la catégorie                  │  │
│  │  2. Extrait les marques des produits                     │  │
│  │  3. Passe les marques à ProductFilters                   │  │
│  └────────────────────┬──────────────────────────────────────┘  │
│                       │                                          │
│                       ▼                                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Composant: ProductFilters.vue                           │  │
│  │                                                           │  │
│  │  - Affiche les marques en grille (2-4 colonnes)          │  │
│  │  - Gère la sélection (checkbox)                          │  │
│  │  - Émet l'événement @filter au parent                    │  │
│  └────────────────────┬──────────────────────────────────────┘  │
│                       │                                          │
│                       ▼                                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Filtrage côté client                                    │  │
│  │                                                           │  │
│  │  filteredProducts = products.filter(p =>                 │  │
│  │    p.brands.some(b =>                                    │  │
│  │      selectedBrands.includes(b.name)                     │  │
│  │    )                                                     │  │
│  │  )                                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   SERVER API (Nuxt Server)                       │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  /api/woocommerce/category/[...slug].ts                  │  │
│  │                                                           │  │
│  │  1. Reçoit le slug de la catégorie                       │  │
│  │  2. Appelle WordPress REST API                           │  │
│  │  3. Récupère produits + marques                          │  │
│  │  4. Formate et retourne les données                      │  │
│  └────────────────────┬──────────────────────────────────────┘  │
└────────────────────────┼────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    WORDPRESS + WOOCOMMERCE                       │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Endpoint: /wp-json/custom/v1/brands                     │  │
│  │                                                           │  │
│  │  function get_woocommerce_brands() {                     │  │
│  │    // Méthode 1: pwb-brand (Perfect Brands)              │  │
│  │    // Méthode 2: product_brand (YITH)                    │  │
│  │    // Méthode 3: pa_brand (Attribut WC)                  │  │
│  │    return brands;                                        │  │
│  │  }                                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Endpoint: /wp-json/custom/v1/products/{category_id}     │  │
│  │                                                           │  │
│  │  function get_woocommerce_products_by_category() {       │  │
│  │    foreach ($products as $product) {                     │  │
│  │      // Récupère les marques du produit                  │  │
│  │      $product_data['brands'] = get_product_brands();     │  │
│  │    }                                                     │  │
│  │    return $product_data;                                 │  │
│  │  }                                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Base de données WooCommerce                             │  │
│  │                                                           │  │
│  │  - wp_terms (marques)                                    │  │
│  │  - wp_term_relationships (produit ↔ marque)             │  │
│  │  - wp_posts (produits)                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Flux détaillé étape par étape

### 1️⃣ Chargement de la page

```
Utilisateur visite → /categorie/electronique
                     │
                     ▼
            Page [...slug].vue
                     │
                     ├─→ useLazyFetch('/api/woocommerce/category/electronique')
                     │
                     ▼
         Server API [...slug].ts
                     │
                     ├─→ GET /wp-json/custom/v1/categories
                     ├─→ GET /wp-json/custom/v1/products/{category_id}
                     │
                     ▼
              WordPress returns:
                     {
                       category: {...},
                       products: [{
                         id: 1,
                         name: "iPhone 13",
                         brands: [{ name: "Apple", slug: "apple" }]
                       }]
                     }
```

### 2️⃣ Extraction des marques

```javascript
// Dans server/api/woocommerce/category/[...slug].ts

const brandsSet = new Set<string>()

products.forEach((product: any) => {
  if (product.brands && Array.isArray(product.brands)) {
    product.brands.forEach((brand: any) => {
      brandsSet.add(brand.name)  // Apple, Samsung, Sony...
    })
  }
})

const categoryBrands = Array.from(brandsSet).map(brand => ({
  name: brand,
  slug: brand.toLowerCase().replace(/\s+/g, '-'),
  count: products.filter(p => 
    p.brands?.some(b => b.name === brand)
  ).length
}))

// Retour: [
//   { name: "Apple", slug: "apple", count: 45 },
//   { name: "Samsung", slug: "samsung", count: 38 }
// ]
```

### 3️⃣ Affichage dans ProductFilters

```vue
<!-- Page catégorie -->
<ProductFilters 
  :brands="categoryBrands"  <!-- Passe les marques -->
  @filter="handleFilter"
/>

<!-- ProductFilters.vue -->
<div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
  <label v-for="brand in props.brands" :key="brand.slug">
    <input 
      v-model="filters.brands" 
      :value="brand.name" 
      type="checkbox" 
    />
    {{ brand.name }} ({{ brand.count }})
  </label>
</div>
```

### 4️⃣ Filtrage des produits

```vue
<!-- Page catégorie -->
<script>
const filteredProducts = computed(() => {
  let filtered = [...allProducts.value]
  
  // Si des marques sont sélectionnées
  if (currentFilters.value.brands.length > 0) {
    filtered = filtered.filter(product => 
      product.brands?.some((brand: any) => 
        currentFilters.value.brands.includes(brand.name)
      )
    )
  }
  
  return filtered
})
</script>
```

---

## Diagramme de séquence

```
Utilisateur          Page              ProductFilters      API Server       WordPress
    │                 │                      │                 │                │
    │─────visit────→│                      │                 │                │
    │                 │                      │                 │                │
    │                 │──fetch products────→│                 │                │
    │                 │                      │                 │                │
    │                 │                      │──GET category──→│                │
    │                 │                      │                 │                │
    │                 │                      │                 │──query DB────→│
    │                 │                      │                 │                │
    │                 │                      │                 │←─products────│
    │                 │                      │                 │   + brands    │
    │                 │                      │←─return data───│                │
    │                 │                      │                 │                │
    │                 │←─products + brands──│                 │                │
    │                 │                      │                 │                │
    │                 │──render filters────→│                 │                │
    │                 │   :brands="..."      │                 │                │
    │                 │                      │                 │                │
    │←────display─────│                      │                 │                │
    │   with brands   │                      │                 │                │
    │                 │                      │                 │                │
    │──check brand───→│                      │                 │                │
    │                 │                      │                 │                │
    │                 │                      │──@filter event─→│                │
    │                 │                      │                 │                │
    │                 │←─filter products────│                 │                │
    │                 │   (client-side)      │                 │                │
    │                 │                      │                 │                │
    │←─display filtered products────────────│                 │                │
    │                 │                      │                 │                │
```

---

## Points clés 🔑

1. **Données source** : Les marques viennent de la base WordPress/WooCommerce
2. **API intermédiaire** : Nuxt Server API récupère et formate les données
3. **Composant réutilisable** : ProductFilters affiche les marques en grille
4. **Filtrage client** : Le filtrage se fait côté client pour la performance
5. **Réactivité** : Vue.js gère automatiquement les mises à jour d'affichage

---

## Performance ⚡

- ✅ **Cache Nuxt** : Les données sont mises en cache côté serveur
- ✅ **Filtrage client** : Pas de rechargement de page
- ✅ **Lazy loading** : Chargement progressif des produits
- ✅ **Computed properties** : Recalcul optimisé uniquement si nécessaire

---

## Sécurité 🔒

- ✅ **Permission callback** : `__return_true` pour endpoint public
- ✅ **Sanitization** : Données nettoyées dans WordPress
- ✅ **CORS** : Géré par Nuxt automatiquement
- ✅ **No SQL injection** : Utilisation des fonctions WP sécurisées

---

## Évolutivité 🚀

Le système est conçu pour :
- ✅ Supporter plusieurs plugins de marques
- ✅ S'adapter à un grand nombre de marques (scroll)
- ✅ Être facilement personnalisable (CSS Tailwind)
- ✅ S'intégrer avec d'autres filtres (prix, note, etc.)

