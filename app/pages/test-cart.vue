<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Test du Bouton Ajouter au Panier</h1>
    
    <!-- Informations du panier -->
    <div class="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h2 class="text-lg font-semibold mb-2">État du Panier</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <strong>Articles:</strong> {{ cartStore.itemsCount }}
        </div>
        <div>
          <strong>Total:</strong> {{ cartStore.formattedTotal }}
        </div>
        <div>
          <strong>Vide:</strong> {{ cartStore.isEmpty ? 'Oui' : 'Non' }}
        </div>
      </div>
      
      <div class="mt-4 flex gap-2">
        <button 
          @click="cartStore.openCart"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ouvrir le Panier
        </button>
        <button 
          @click="cartStore.clearCart"
          class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Vider le Panier
        </button>
      </div>
    </div>

    <!-- Test des produits -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Test avec des produits :</h2>
      
      <div v-if="productsLoading" class="text-blue-600">Chargement des produits...</div>
      <div v-else-if="productsError" class="text-red-600">Erreur: {{ productsError }}</div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="product in products" 
          :key="product.id"
          class="border rounded-lg p-4"
        >
          <h3 class="font-medium mb-2">{{ product.name }}</h3>
          
          <!-- Informations du produit -->
          <div class="text-sm space-y-1 mb-4">
            <p><strong>ID:</strong> {{ product.id }}</p>
            <p><strong>Prix:</strong> {{ product.regular_price }}€</p>
            <p v-if="product.sale_price"><strong>Prix promo:</strong> {{ product.sale_price }}FCFA</p>
            <p><strong>Stock:</strong> {{ product.stock_status }}</p>
            <p><strong>SKU:</strong> {{ product.sku || 'N/A' }}</p>
          </div>
          
          <!-- Test du composant ProductCard -->
          <div class="border-t pt-4">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Composant ProductCard :</h4>
            <ProductCard :product="product" />
          </div>
        </div>
      </div>
    </div>

    <!-- Test avec des produits de test -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Test avec des produits de test :</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="testProduct in testProducts" 
          :key="testProduct.id"
          class="border rounded-lg p-4"
        >
          <h3 class="font-medium mb-2">{{ testProduct.name }}</h3>
          
          <!-- Test du composant ProductCard -->
          <ProductCard :product="testProduct" />
        </div>
      </div>
    </div>

    <!-- Instructions -->
    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <h3 class="font-medium text-yellow-900 mb-2">Instructions de test :</h3>
      <ul class="text-sm text-yellow-800 space-y-1">
        <li>1. Cliquez sur "Ajouter au panier" pour tester la fonctionnalité</li>
        <li>2. Vérifiez que le panier s'ouvre automatiquement</li>
        <li>3. Vérifiez que les articles s'ajoutent correctement</li>
        <li>4. Testez avec différents statuts de stock</li>
        <li>5. Vérifiez les animations et états du bouton</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
// Store du panier
const cartStore = useCartStore()

// Récupérer des produits de test
const { data: categories, pending: categoriesLoading, error: categoriesError } = await useLazyFetch('/api/api/v1/categories')

// Récupérer les produits de la première catégorie
const firstCategory = computed(() => categories.value?.[0])

const { data: productsData, pending: productsLoading, error: productsError } = await useLazyFetch(
  () => firstCategory.value ? `/api/api/v1/products/category/${firstCategory.value.id}` : null
)

const products = computed(() => productsData.value?.products?.slice(0, 3) || [])

// Produits de test
const testProducts = ref([
  {
    id: 999,
    name: 'Produit Test - En Stock',
    slug: 'produit-test-en-stock',
    regular_price: 29.99,
    sale_price: 19.99,
    on_sale: true,
    stock_status: 'instock',
    sku: 'TEST-001',
    images: [{
      id: 1,
      src: '/images/placeholder-product.jpg',
      alt: 'Produit test'
    }]
  },
  {
    id: 998,
    name: 'Produit Test - Rupture de Stock',
    slug: 'produit-test-rupture',
    regular_price: 49.99,
    stock_status: 'outofstock',
    sku: 'TEST-002',
    images: [{
      id: 2,
      src: '/images/placeholder-product.jpg',
      alt: 'Produit test rupture'
    }]
  },
  {
    id: 997,
    name: 'Produit Test - Sur Commande',
    slug: 'produit-test-commande',
    regular_price: 39.99,
    stock_status: 'onbackorder',
    sku: 'TEST-003',
    images: [{
      id: 3,
      src: '/images/placeholder-product.jpg',
      alt: 'Produit test commande'
    }]
  }
])

// SEO
useHead({
  title: 'Test Bouton Panier - Ivoir Shop',
  meta: [
    { name: 'description', content: 'Test du bouton ajouter au panier dans Ivoir Shop' }
  ]
})
</script>

