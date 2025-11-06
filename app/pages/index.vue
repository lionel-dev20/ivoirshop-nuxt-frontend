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
        title="Illux | Partenaire officiel"
        category-slug="plaque-a-gaz"
        :grid-columns="bannerImageUrl ? 4 : 5"
        :max-products="20"
        :autoplay="true"
        :autoplay-delay="300"
        :show-pagination="true"
        :show-navigation="true"
        :show-view-all-button="true"
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
        title="Nouveautés"
         category-slug="televisions"
         :grid-columns="bannerImageUrl ? 4 : 5"
        :max-products="20"
        :autoplay="true"
        :autoplay-delay="4000"
        :show-pagination="true"
        :show-navigation="true"
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
  title="Nos meilleurs offres"
  category-slug="maison-cuisine-jardin"
  :grid-columns="bannerImageUrl ? 4 : 5"
  :max-products="12"
  :autoplay="false"
  :show-pagination="true"
  :show-navigation="true"
  @add-to-cart="handleAddToCart"
  @product-click="handleProductClick"
  @quick-view="handleQuickView"
  @wishlist-toggle="handleWishlistToggle"
/>
     <div class="h-8"></div>
      <!-- Carousel de promotions -->
      <ProductCarousel
  title="Nos meilleurs offres electromenager"
  category-slug="petit-electromenager"
  :grid-columns="bannerImageUrl ? 4 : 4"
  :max-products="12"
  :autoplay="false"
  :show-pagination="true"
  :show-navigation="true"
  banner-image-url="/images/newbannerA.webp"
  @add-to-cart="handleAddToCart"
  @product-click="handleProductClick"
  @quick-view="handleQuickView"
  @wishlist-toggle="handleWishlistToggle"
/>

<div class="h-8"></div>
      <!-- Carousel de promotions -->
      <ProductCarousel
  title="Nos meilleurs offres tvs"
  category-slug="televisions"
  :grid-columns="bannerImageUrl ? 4 : 4"
  :max-products="12"
  :autoplay="false"
  :show-pagination="true"
  :show-navigation="true"
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
        title="Bonne degustation"
         category-slug="cuiseurs-a-riz"
         :grid-columns="bannerImageUrl ? 4 : 5"
        :max-products="20"
        :autoplay="true"
        :autoplay-delay="300"
        :show-pagination="true"
        :show-navigation="true"
        header-background-color="bg-[#00ea00]"
        header-color="text-white"
        navigation-color="text-black"
        @add-to-cart="handleAddToCart"
        @product-click="handleProductClick"
        @quick-view="handleQuickView"
        @wishlist-toggle="handleWishlistToggle"
      />
      <div class="h-8"></div>
      <Nouveaute 
       category-slug="plaque-a-gaz"
       header-background-color="'bg-orange-500'"
        header-color="text-white"
       :grid-columns="5"
       :products-per-page="20"
     />
     <div class="h-8"></div>

     <CollapseSeoText />
  
      <!-- Blocs de catégories -->
      <!-- <CategoryBlocks />
      
      <div class="h-8"></div>
      <Nouveaute 
       category-slug="clothing"
       :grid-columns="4"
       :products-per-page="12"
     /> -->
     <div class="md:h-8 h-4"></div>
      <!-- <div class="container mx-auto px-4">
          <DualBannerSlider
            :limit="6"
            :auto-rotate="true"
            :rotation-interval="8000"
            aspect-ratio="16/9"
            border-radius="16px"
            gap="24px"
            @banner-click="handleBannerClick"
            @banner-view="trackBannerView"
          />
        </div> -->
  
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

  const newProducts = [
    {
      id: 1,
      name: 'Chaussures de sport',
      slug: 'chaussures-de-sport',
      thumbnail: '/images/shoes.jpg',
      regularPrice: 79.99,
      isNew: true
    },
    {
      id: 2,
      name: 'Sac à dos',
      slug: 'sac-a-dos',
      thumbnail: '/images/bag.jpg',
      regularPrice: 49.99,
      salePrice: 39.99
    }
  ]
  
  const saleProducts = [
    {
      id: 3,
      name: 'T-shirt coton',
      slug: 'tshirt-coton',
      thumbnail: '/images/tshirt.jpg',
      regularPrice: 19.99,
      salePrice: 14.99
    }
  ]
  
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

</style>