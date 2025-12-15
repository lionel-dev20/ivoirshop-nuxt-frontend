<template>
  <div class="max-w-[1440px] mx-auto my-4">
    <div class="flex gap-x-1.5 items-center max-h-[480px]">
      <MegamenuMegaMenuHorizontalColumns />
      <HerosectionMyCarousel />
      <RightDoubleAds class="hidden md:block" />
    </div>
    <div class="md:h-4 h-4"></div>
    <ListPartner />
    <div class="md:h-6 h-4"></div>      <!-- <div class="h-8"></div> -->
   
    <!-- Carrousels de produits et compte à rebours -->
    <div v-for="countdown in countdowns" :key="countdown.id">
      <Countdowns
        :countdown-id="countdown.id"
        :title="countdown.title"
        :category-slug="countdown.categorySlug"
        :end-time="countdown.endTime"
        :grid-columns="countdown.gridColumns"
        :products-per-page="countdown.productsPerPage"
        @add-to-cart="handleAddToCart"
        @product-click="handleProductClick"
        @quick-view="handleQuickView"
        @wishlist-toggle="handleWishlistToggle"
      />
    </div>
    <AcheterEnLigne />
    <div class="md:h-8 h-4"></div>
    <ProductCarousel 
      category-slug="plaque-a-gaz"
      :grid-columns="bannerImageUrl ? 4 : 5"
      :max-products="20"
      :autoplay="true"
      :autoplay-delay="300"
      :show-pagination="true"
      :show-navigation="true"
      :show-view-all-button="true"
      :auto-fetch-title="true"
      header-background-color="bg-red-500"
      header-color="text-white"
      navigation-color="text-black"
      @add-to-cart="handleAddToCart"
      @product-click="handleProductClick"
      @quick-view="handleQuickView"
      @wishlist-toggle="handleWishlistToggle"
    />

    <div class="md:h-8 h-4"></div>

    <!-- Carousel de produits -->
    <ProductCarousel 
       category-slug="televisions"
       :grid-columns="bannerImageUrl ? 4 : 5"
      :max-products="20"
      :autoplay="true"
      :autoplay-delay="4000"
      :show-pagination="true"
      :show-navigation="true"
      :auto-fetch-title="true"
      @add-to-cart="handleAddToCart"
      @product-click="handleProductClick"
      @quick-view="handleQuickView"
      @wishlist-toggle="handleWishlistToggle"
    />
    
    <div class="md:h-8 h-4"></div>
    <CollectionHomepageDoubleBanner />
   <div class="h-8"></div>
    <!-- Carousel de promotions -->
    <ProductCarousel
category-slug="maison-cuisine-jardin"
:grid-columns="bannerImageUrl ? 4 : 5"
:max-products="12"
:autoplay="false"
:show-pagination="true"
:show-navigation="true"
:auto-fetch-title="true"
@add-to-cart="handleAddToCart"
@product-click="handleProductClick"
@quick-view="handleQuickView"
@wishlist-toggle="handleWishlistToggle"
/>
   <div class="md:h-8 h-4"></div>
    <!-- Carousel de promotions -->
    <ProductCarousel
category-slug="petit-electromenager"
:grid-columns="bannerImageUrl ? 4 : 4"
:max-products="12"
:autoplay="false"
:show-pagination="true"
:show-navigation="true"
:auto-fetch-title="true"
banner-image-url="/images/newbannerA.webp"
@add-to-cart="handleAddToCart"
@product-click="handleProductClick"
@quick-view="handleQuickView"
@wishlist-toggle="handleWishlistToggle"
/>

<div class="md:h-8 h-4"></div>
    <!-- Carousel de promotions -->
    <ProductCarousel
category-slug="televisions"
:grid-columns="bannerImageUrl ? 4 : 4"
:max-products="12"
:autoplay="false"
:show-pagination="true"
:show-navigation="true"
:auto-fetch-title="true"
banner-image-url="/images/bannertvs.webp"
@add-to-cart="handleAddToCart"
@product-click="handleProductClick"
@quick-view="handleQuickView"
@wishlist-toggle="handleWishlistToggle"
/>
    <div class="md:h-8 h-4"></div>
    <CollectionHomepageDoubleBanner1 />
<div class="md:h-8 h-4"></div>
    <ProductCarousel 
       category-slug="cuiseurs-a-riz"
       :grid-columns="bannerImageUrl ? 4 : 5"
      :max-products="20"
      :autoplay="true"
      :autoplay-delay="300"
      :show-pagination="true"
      :show-navigation="true"
      :auto-fetch-title="true"
      header-background-color="bg-[#ff9900]"
      header-color="text-white"
      navigation-color="text-black"
      @add-to-cart="handleAddToCart"
      @product-click="handleProductClick"
      @quick-view="handleQuickView"
      @wishlist-toggle="handleWishlistToggle"
    />
    <div class="md:h-8 h-4"></div>
    <Nouveaute 
     :category-id="300"
     header-background-color="'bg-orange-500'"
      header-color="text-white"
     :grid-columns="5"
     :products-per-page="30"
     :products-limit="30"
   />
   <div class="h-8"></div>

   <CollapseSeoText />
   <div class="md:h-12 h-4"></div>

  </div>
</template>

<script setup>
import Nouveaute from '~/components/collectionHomepage/Nouveaute.vue';
import DualBannerSlider from '~/components/DualBannerSlider.vue';
import RightDoubleAds from '~/components/herosection/RightDoubleAds.vue';
import ListPartner from '~/components/partenaires/ListPartner.vue';
import CategoryBlocks from '~/components/CategoryBlocks.vue';
import ProductCarousel from '~/components/ProductCarousel.vue';
import Countdowns from '~/components/collectionHomepage/Countdowns.vue'; // Import the new component
import countdownsData from '~/data/countdowns.json'; // Import the countdowns data


// Gestionnaires d'événements pour le carousel
const handleAddToCart = (product) => {
  // Logique d'ajout au panier
}

const handleProductClick = (product) => {
  // Navigation vers la page produit
  navigateTo(`/produit/${product.slug}`);
}

const handleQuickView = (product) => {
  // Ouvrir modal de vue rapide
}

const handleWishlistToggle = (product) => {
  // Ajouter/retirer des favoris
}

// Expose countdownsData to the template
const countdowns = ref(countdownsData);
</script>

<style scoped>
a.view-more-link {
  padding: 10px !important;
    border-radius: 4px !important;
    margin-left: 12px !important;
    color: #000 !important;
}
</style>

