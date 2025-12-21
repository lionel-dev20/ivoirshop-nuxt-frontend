<template>
  <div class="max-w-[1440px] mx-auto my-4">
    <div class="flex gap-x-1.5 items-center max-h-[480px]">
      <MegamenuMegaMenuHorizontalColumns />
      <HerosectionMyCarousel />
      <RightDoubleAds class="hidden md:block" />
    </div>
    <div class="md:h-4 h-4"></div>
    <!-- <ListPartner />
    <div class="md:h-6 h-4"></div>     -->
      <!-- <div class="h-8"></div> -->
   
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

    <div class="md:h-8 h-4"></div>
    <ProductCarousel 
      :category-id="353"
      :grid-columns="bannerImageUrl ? 4 : 4"
      :max-products="20"
      :autoplay="true"
      :autoplay-delay="300"
      :show-pagination="true"
      :show-navigation="true"
      :show-view-all-button="true"
      :auto-fetch-title="true"
      header-background-color="bg-white"
      header-color="text-black"
      navigation-color="text-black"
      banner-image-url="/images/newbannerA.webp"
      @add-to-cart="handleAddToCart"
      @product-click="handleProductClick"
      @quick-view="handleQuickView"
      @wishlist-toggle="handleWishlistToggle"
    />

    <div class="md:h-8 h-4"></div>

    <AcheterEnLigne />
    

    <div class="md:h-8 h-4"></div>

    <ProductCarousel 
      :category-id="347"
      :grid-columns="bannerImageUrl ? 4 : 5"
      :max-products="20"
      :autoplay="true"
      :autoplay-delay="300"
      :show-pagination="true"
      :show-navigation="true"
      :show-view-all-button="true"
      :auto-fetch-title="true"
      header-background-color="bg-[#a50a0a]"
      header-color="text-white"
      navigation-color="text-black"
      @add-to-cart="handleAddToCart"
      @product-click="handleProductClick"
      @quick-view="handleQuickView"
      @wishlist-toggle="handleWishlistToggle"
    />

    <div class="md:h-8 h-4"></div>
    <ProductCarousel 
      :category-id="354"
      :grid-columns="bannerImageUrl ? 4 : 5"
      :max-products="20"
      :autoplay="true"
      :autoplay-delay="300"
      :show-pagination="true"
      :show-navigation="true"
      :show-view-all-button="true"
      :auto-fetch-title="true"
      header-background-color="bg-[#019d39]"
      header-color="text-white"
      navigation-color="text-black"
      @add-to-cart="handleAddToCart"
      @product-click="handleProductClick"
      @quick-view="handleQuickView"
      @wishlist-toggle="handleWishlistToggle"
    />

    <div class="md:h-8 h-4"></div>
    <CollectionHomepageDoubleBanner :banners="doubleBanners[0]" />

    <div class="md:h-8 h-4"></div>
    <ProductCarousel 
      :category-id="355"
      :grid-columns="bannerImageUrl ? 4 : 5"
      :max-products="20"
      :autoplay="true"
      :autoplay-delay="300"
      :show-pagination="true"
      :show-navigation="true"
      :show-view-all-button="true"
      :auto-fetch-title="true"
      header-background-color="bg-white"
      header-color="text-black"
      navigation-color="text-black"
      @add-to-cart="handleAddToCart"
      @product-click="handleProductClick"
      @quick-view="handleQuickView"
      @wishlist-toggle="handleWishlistToggle"
    />

    <div class="md:h-8 h-4"></div>
    <ProductCarousel 
      :category-id="356"
      :grid-columns="bannerImageUrl ? 4 : 4"
      :max-products="20"
      :autoplay="true"
      :autoplay-delay="300"
      :show-pagination="true"
      :show-navigation="true"
      :show-view-all-button="true"
      :auto-fetch-title="true"
      header-background-color="bg-white"
      header-color="text-black"
      navigation-color="text-black"
      banner-image-url="/images/newbannerA.webp"
      @add-to-cart="handleAddToCart"
      @product-click="handleProductClick"
      @quick-view="handleQuickView"
      @wishlist-toggle="handleWishlistToggle"
    />

    <div class="md:h-8 h-4"></div>
    <ProductCarousel 
      :category-id="357"
      :grid-columns="bannerImageUrl ? 4 : 5"
      :max-products="20"
      :autoplay="true"
      :autoplay-delay="300"
      :show-pagination="true"
      :show-navigation="true"
      :show-view-all-button="true"
      :auto-fetch-title="true"
      header-background-color="bg-white"
      header-color="text-black"
      navigation-color="text-black"
      @add-to-cart="handleAddToCart"
      @product-click="handleProductClick"
      @quick-view="handleQuickView"
      @wishlist-toggle="handleWishlistToggle"
    />

    <div class="md:h-8 h-4"></div>
    <CollectionHomepageDoubleBanner :banners="doubleBanners[1]" />
    <div class="md:h-8 h-4"></div>

    <ProductCarousel 
      :category-id="358"
      :grid-columns="bannerImageUrl ? 4 : 5"
      :max-products="20"
      :autoplay="true"
      :autoplay-delay="300"
      :show-pagination="true"
      :show-navigation="true"
      :show-view-all-button="true"
      :auto-fetch-title="true"
      header-background-color="bg-white"
      header-color="text-black"
      navigation-color="text-black"
      @add-to-cart="handleAddToCart"
      @product-click="handleProductClick"
      @quick-view="handleQuickView"
      @wishlist-toggle="handleWishlistToggle"
    />

    <div class="md:h-8 h-4"></div>
    <ProductCarousel 
      :category-id="359"
      :grid-columns="bannerImageUrl ? 4 : 5"
      :max-products="20"
      :autoplay="true"
      :autoplay-delay="300"
      :show-pagination="true"
      :show-navigation="true"
      :show-view-all-button="true"
      :auto-fetch-title="true"
      header-background-color="bg-white"
      header-color="text-black"
      navigation-color="text-black"
      banner-image-url="/images/newbannerA.webp"
      @add-to-cart="handleAddToCart"
      @product-click="handleProductClick"
      @quick-view="handleQuickView"
      @wishlist-toggle="handleWishlistToggle"
    />

    <div class="md:h-8 h-4"></div>
    <ProductCarousel 
      :category-id="312"
      :grid-columns="bannerImageUrl ? 4 : 5"
      :max-products="20"
      :autoplay="true"
      :autoplay-delay="300"
      :show-pagination="true"
      :show-navigation="true"
      :show-view-all-button="true"
      :auto-fetch-title="true"
      header-background-color="bg-white"
      header-color="text-black"
      navigation-color="text-black"
      @add-to-cart="handleAddToCart"
      @product-click="handleProductClick"
      @quick-view="handleQuickView"
      @wishlist-toggle="handleWishlistToggle"
    />

    <div class="md:h-8 h-4"></div>
    <CollectionHomepageDoubleBanner :banners="doubleBanners[2]" />
    <div class="md:h-8 h-4"></div>

    <ProductCarousel 
      :category-id="360"
      :grid-columns="bannerImageUrl ? 4 : 5"
      :max-products="20"
      :autoplay="true"
      :autoplay-delay="300"
      :show-pagination="true"
      :show-navigation="true"
      :show-view-all-button="true"
      :auto-fetch-title="true"
      header-background-color="bg-white"
      header-color="text-black"
      navigation-color="text-black"
      @add-to-cart="handleAddToCart"
      @product-click="handleProductClick"
      @quick-view="handleQuickView"
      @wishlist-toggle="handleWishlistToggle"
    />

    <div class="md:h-8 h-4"></div>

    <ProductCarousel 
      :category-id="361"
      :grid-columns="bannerImageUrl ? 4 : 5"
      :max-products="20"
      :autoplay="true"
      :autoplay-delay="300"
      :show-pagination="true"
      :show-navigation="true"
      :show-view-all-button="true"
      :auto-fetch-title="true"
      header-background-color="bg-white"
      header-color="text-black"
      navigation-color="text-black"
      banner-image-url="/images/newbannerA.webp"
      @add-to-cart="handleAddToCart"
      @product-click="handleProductClick"
      @quick-view="handleQuickView"
      @wishlist-toggle="handleWishlistToggle"
    />

    <div class="md:h-8 h-4"></div>
    <div class="md:h-8 h-4"></div>

    <ProductCarousel 
      :category-id="362"
      :grid-columns="bannerImageUrl ? 4 : 5"
      :max-products="20"
      :autoplay="true"
      :autoplay-delay="300"
      :show-pagination="true"
      :show-navigation="true"
      :show-view-all-button="true"
      :auto-fetch-title="true"
      header-background-color="bg-white"
      header-color="text-black"
      navigation-color="text-black"
      banner-image-url="/images/newbannerA.webp"
      @add-to-cart="handleAddToCart"
      @product-click="handleProductClick"
      @quick-view="handleQuickView"
      @wishlist-toggle="handleWishlistToggle"
    />

    <div class="md:h-8 h-4"></div>

    <ProductCarousel 
      :category-id="363"
      :grid-columns="bannerImageUrl ? 4 : 5"
      :max-products="20"
      :autoplay="true"
      :autoplay-delay="300"
      :show-pagination="true"
      :show-navigation="true"
      :show-view-all-button="true"
      :auto-fetch-title="true"
      header-background-color="bg-white"
      header-color="text-black"
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
      header-color="text-black"
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

// Tableau de données pour les bannières doubles
const doubleBanners = ref([
  // Première bannière (ligne 97)
  [
    {
      image: 'https://site.glotelho.cm/media/wysiwyg/DOUBLE-BANNER0110_01.webp',
      link: '/',
      alt: 'Banner 1'
    },
    {
      image: 'https://site.glotelho.cm/media/wysiwyg/DOUBLE-BANNER0110_02.webp',
      link: '/',
      alt: 'Banner 2'
    }
  ],
  // Deuxième bannière (ligne 161)
  [
    {
      image: 'https://site.glotelho.cm/media/wysiwyg/DOUBLE-BANNER1209_02.webp',
      link: '/',
      alt: 'Banner 3'
    },
    {
      image: 'https://site.glotelho.cm/media/wysiwyg/DOUBLE-BANNER1209_01.webp',
      link: '/',
      alt: 'Banner 4'
    }
  ],
  // Troisième bannière (ligne 225)
  [
    {
      image: 'https://site.glotelho.cm/media/wysiwyg/DOUBLE-BANNER0110_01.webp',
      link: '/',
      alt: 'Banner 5'
    },
    {
      image: 'https://site.glotelho.cm/media/wysiwyg/DOUBLE-BANNER0110_02.webp',
      link: '/',
      alt: 'Banner 6'
    }
  ]
]);
</script>

<style scoped>
a.view-more-link {
  padding: 10px !important;
    border-radius: 4px !important;
    margin-left: 12px !important;
    color: #000 !important;
}
</style>

