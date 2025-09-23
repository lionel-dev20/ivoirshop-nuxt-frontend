
<!-- =========================================== -->
<!-- UTILISATION DANS UNE PAGE SPÉCIFIQUE      -->
<!-- =========================================== -->

<!-- pages/category/[slug].vue -->
<template>
  <div class="category-page">
    <div class="container mx-auto px-4 py-8">
      
      <!-- Hero section -->
      <div class="hero-section mb-12">
        <div class="text-center">
          <h1 class="text-4xl font-bold mb-4">{{ categoryTitle }}</h1>
          <p class="text-xl text-gray-600">Découvrez notre sélection de produits</p>
        </div>
      </div>
      
      <!-- Produits de la catégorie -->
      <ProductsByCategory
        :category-slug="categorySlug"
        :display-limit="20"
        :grid-columns="4"
        card-style="default"
        :show-header="false"
        :show-pagination="true"
        :show-filters="true"
        @product-click="goToProduct"
        @add-to-cart="addToCart"
        @category-loaded="updatePageInfo"
      />
      
    </div>
  </div>
</template>

<script setup>
// Récupération du slug depuis la route
const route = useRoute()
const categorySlug = ref(route.params.slug)

// État réactif pour le titre
const categoryTitle = ref('Chargement...')

// Méthodes
const goToProduct = (product) => {
  navigateTo(`/product/${product.slug}`)
}

const addToCart = async ({ product, quantity }) => {
  try {
    // Logique d'ajout au panier
    const response = await $fetch('/api/cart/add', {
      method: 'POST',
      body: {
        product_id: product.id,
        quantity: quantity
      }
    })
    
    // Notification de succès
    $toast.success(`${product.name} ajouté au panier`)
  } catch (error) {
    $toast.error('Erreur lors de l\'ajout au panier')
  }
}

const updatePageInfo = ({ category }) => {
  if (category) {
    categoryTitle.value = category.name
    
    // Mise à jour du SEO
    useHead({
      title: `${category.name} - Notre Boutique`,
      meta: [
        { 
          name: 'description', 
          content: category.description || `Découvrez notre collection de ${category.name.toLowerCase()}` 
        }
      ]
    })
  }
}

// Watcher pour réagir aux changements de route
watch(() => route.params.slug, (newSlug) => {
  categorySlug.value = newSlug
})
</script>
