<template>
  <div class="max-w-[1440px] mx-auto my-4">
    <div class="flex gap-x-1.5 items-center max-h-[480px]">
      <MegamenuMegaMenuHorizontalColumns />
      <HerosectionMyCarousel />
      <RightDoubleAds class="hidden md:block" />
    </div>
    <div class="md:h-6 h-4"></div>
    <ListPartner />
    <div class="md:h-6 h-4"></div>    
      <div class="h-8"></div>
   
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


    <AcheterEnLigne />
    <div class="md:h-4 h-4"></div>
    <CollectionHomepageDoubleBanner :banners="doubleBanners[0]" />
    <div class="md:h-4 h-4"></div>



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

    <div class="md:h-4 h-4"></div>
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

    <div class="md:h-6 h-4"></div>
    <CollectionHomepageDoubleBanner :banners="doubleBanners[1]" />

    <div class="md:h-6 h-4"></div>
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

    <div class="md:h-4 h-4"></div>
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

    <div class="md:h-4 h-4"></div>
    <CollectionHomepageDoubleBanner :banners="doubleBanners[2]" />
    <div class="md:h-4 h-4"></div>

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

    <div class="md:h-6 h-4"></div>
    <CollectionHomepageDoubleBanner :banners="doubleBanners[3]" />
    <div class="md:h-6 h-4"></div>

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

    <div class="md:h-4 h-4"></div>
    <ProductCarousel 
      :category-id="359"
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

    <div class="md:h-4 h-4"></div>
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

    <div class="md:h-6 h-4"></div>
    <CollectionHomepageDoubleBanner :banners="doubleBanners[4]" />
    <div class="md:h-6 h-4"></div>

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

    <div class="md:h-4 h-4"></div>
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

    <div class="md:h-4 h-4"></div>
    <CollectionHomepageDoubleBanner :banners="doubleBanners[5]" />
    <div class="md:h-4 h-4"></div>

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

    <div class="md:h-4 h-4"></div>

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

    
    <div class="md:h-4 h-4"></div>
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
      image: '/categorieImage/Mixeur.jpg',
      link: 'https://ivoirshop.ci/produit/ilux-blender-grinder-2-en-1-lx-358-bol-1-5-l-300w-blanc-noir',
      alt: 'Mixeurs'
    },
    {
      image: '/categorieImage/Machinbe pilé foutou.jpg',
      link: ' https://ivoirshop.ci/produit/binatone-machine-a-piler-foutou-6l-1000w',
      alt: 'Machinbe pilé foutou.jpg'
    }
  ],
  // Deuxième bannière (ligne 161)
  [
    {
      image: '/categorieImage/Plaque gaz.jpg',
      link: ' https://www.ivoirshop.ci/produit/ilux-cuisiniere-gaz-4-feux-lxg-40w-50x50-cm-blanc-garantie-6-mois',
      alt: 'Plaque gaz'
    },
    {
      image: '/categorieImage/Gazinière.jpg',
      link: 'https://www.ivoirshop.ci/produit/ilux-cuisiniere-a-gaz-rechaud-3-feux-lxg-7403-sx95-bleu',
      alt: 'Gazinière.jpg'
    }
  ],
  // Troisième bannière (ligne 225)
  [
    {
      image: '/categorieImage/TV.jpg',
      link: ' https://www.ivoirshop.ci/produit/ilux-tv-led-full-hd-43-pouces-decodeur-integre-hdmi-usb-vga-noir-garantie-06-mois',
      alt: 'TV'
    },
    {
      image: '/categorieImage/Audio.jpg',
      link: 'https://www.ivoirshop.ci/produit/alitop-woofer-chaine-hifi-bluetooth-usb-fm-tvsd-noir-garantie-01-mois',
      alt: 'Audio'
    }
  ],
  // Troisième bannière (ligne 225)
  [
    {
      image: '/categorieImage/Micro onde.jpg',
      link: 'https://www.ivoirshop.ci/produit/ilux-micro-onde-lxm-2090b-20-litres-700w-noir',
      alt: 'Micro onde'
    },
    {
      image: '/categorieImage/refrigerateur.jpg',
      link: ' https://www.ivoirshop.ci/produit/ilux-refrigerateur-2-battants-118-l-ilr118-gris-garantie-6-mois',
      alt: 'efrigerateur'
    }
  ],
  // Troisième bannière (ligne 225)
  [
    {
      image: '/categorieImage/Ventilateur.jpg',
      link: ' https://www.ivoirshop.ci/produit/ilux-2-ventilateurs-18-pouces-lxf-823-7-helices-copie',
      alt: 'Ventilateur'
    },
    {
      image: '/categorieImage/Climatiseur.jpg',
      link: ' https://www.ivoirshop.ci/produit/split-1-cv-smart-fonctionnant-en-mode-on-off-r410-sts-09_ultra-blanc-garantie-12-mois',
      alt: 'Climatiseur'
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

