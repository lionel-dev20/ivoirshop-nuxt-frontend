
<!-- =========================================== -->
<!-- UTILISATION DANS LA PAGE D'ACCUEIL        -->
<!-- =========================================== -->

<!-- pages/index.vue -->
<template>
  <div class="homepage">
    
    <!-- Hero section -->
    <HeroSection />
    
    <!-- Section Shirts -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <ProductsByCategory
          category-slug="shirts"
          :display-limit="8"
          :grid-columns="4"
          custom-title="Collection Shirts"
          :show-description="true"
          :featured-only="false"
          @product-click="handleProductClick"
          @add-to-cart="handleAddToCart"
        />
      </div>
    </section>
    
    <!-- Section Promotions -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <ProductsByCategory
          category-slug="all"
          :display-limit="8"
          :grid-columns="4"
          custom-title="🔥 Promotions du moment"
          :on-sale-only="true"
          :show-filters="false"
          card-style="detailed"
        />
      </div>
    </section>
    
    <!-- Section Nouveautés -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <ProductsByCategory
          category-slug="nouveautes"
          :display-limit="6"
          :grid-columns="3"
          custom-title="✨ Nouveautés"
          sort-by="date"
        />
      </div>
    </section>
    
  </div>
</template>

<script setup>
// Configuration SEO
useHead({
  title: 'Accueil - Notre Boutique',
  meta: [
    { 
      name: 'description', 
      content: 'Découvrez notre collection de shirts, promotions et nouveautés. Livraison gratuite dès 50€.' 
    }
  ]
})

// Import des composants
const HeroSection = resolveComponent('HeroSection')

// Gestion des événements globaux
const handleProductClick = (product) => {
  // Analytics tracking
  gtag('event', 'product_click', {
    item_id: product.id,
    item_name: product.name,
    item_category: product.categories?.[0]?.name
  })
  
  navigateTo(`/product/${product.slug}`)
}

const handleAddToCart = async ({ product, quantity }) => {
  // Logique d'ajout au panier
  const cartStore = useCartStore()
  
  try {
    await cartStore.addItem(product, quantity)
    
    // Analytics tracking
    gtag('event', 'add_to_cart', {
      currency: 'FCFA',
      value: product.price * quantity,
      items: [{
        item_id: product.id,
        item_name: product.name,
        quantity: quantity,
        price: product.price
      }]
    })
    
    $toast.success(`${product.name} ajouté au panier`)
  } catch (error) {
    $toast.error('Erreur lors de l\'ajout au panier')
  }
}
</script>