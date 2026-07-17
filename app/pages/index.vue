<template>
  <div class="max-w-[1440px] mx-auto my-4" :style="backgroundStyle">
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
    <ProductCarousel v-bind="carouselProps(0)" @add-to-cart="handleAddToCart" @product-click="handleProductClick" @quick-view="handleQuickView" @wishlist-toggle="handleWishlistToggle" />

    <AcheterEnLigne />
    <div class="md:h-4 h-4"></div>
    <CollectionHomepageDoubleBanner :banners="banners(0)" />
    <div class="md:h-4 h-4"></div>

    <ProductCarousel v-bind="carouselProps(1)" @add-to-cart="handleAddToCart" @product-click="handleProductClick" @quick-view="handleQuickView" @wishlist-toggle="handleWishlistToggle" />

    <div class="md:h-4 h-4"></div>
    <ProductCarousel v-bind="carouselProps(2)" @add-to-cart="handleAddToCart" @product-click="handleProductClick" @quick-view="handleQuickView" @wishlist-toggle="handleWishlistToggle" />

    <div class="md:h-6 h-4"></div>
    <CollectionHomepageDoubleBanner :banners="banners(1)" />

    <div class="md:h-6 h-4"></div>
    <ProductCarousel v-bind="carouselProps(3)" @add-to-cart="handleAddToCart" @product-click="handleProductClick" @quick-view="handleQuickView" @wishlist-toggle="handleWishlistToggle" />

    <div class="md:h-4 h-4"></div>
    <ProductCarousel v-bind="carouselProps(4)" @add-to-cart="handleAddToCart" @product-click="handleProductClick" @quick-view="handleQuickView" @wishlist-toggle="handleWishlistToggle" />

    <div class="md:h-4 h-4"></div>
    <CollectionHomepageDoubleBanner :banners="banners(2)" />
    <div class="md:h-4 h-4"></div>

    <ProductCarousel v-bind="carouselProps(5)" @add-to-cart="handleAddToCart" @product-click="handleProductClick" @quick-view="handleQuickView" @wishlist-toggle="handleWishlistToggle" />

    <div class="md:h-6 h-4"></div>
    <CollectionHomepageDoubleBanner :banners="banners(3)" />
    <div class="md:h-6 h-4"></div>

    <ProductCarousel v-bind="carouselProps(6)" @add-to-cart="handleAddToCart" @product-click="handleProductClick" @quick-view="handleQuickView" @wishlist-toggle="handleWishlistToggle" />

    <div class="md:h-4 h-4"></div>
    <ProductCarousel v-bind="carouselProps(7)" @add-to-cart="handleAddToCart" @product-click="handleProductClick" @quick-view="handleQuickView" @wishlist-toggle="handleWishlistToggle" />

    <div class="md:h-4 h-4"></div>
    <ProductCarousel v-bind="carouselProps(8)" @add-to-cart="handleAddToCart" @product-click="handleProductClick" @quick-view="handleQuickView" @wishlist-toggle="handleWishlistToggle" />

    <div class="md:h-6 h-4"></div>
    <CollectionHomepageDoubleBanner :banners="banners(4)" />
    <div class="md:h-6 h-4"></div>

    <ProductCarousel v-bind="carouselProps(9)" @add-to-cart="handleAddToCart" @product-click="handleProductClick" @quick-view="handleQuickView" @wishlist-toggle="handleWishlistToggle" />

    <div class="md:h-4 h-4"></div>
    <ProductCarousel v-bind="carouselProps(10)" @add-to-cart="handleAddToCart" @product-click="handleProductClick" @quick-view="handleQuickView" @wishlist-toggle="handleWishlistToggle" />

    <div class="md:h-4 h-4"></div>
    <CollectionHomepageDoubleBanner :banners="banners(5)" />
    <div class="md:h-4 h-4"></div>

    <ProductCarousel v-bind="carouselProps(11)" @add-to-cart="handleAddToCart" @product-click="handleProductClick" @quick-view="handleQuickView" @wishlist-toggle="handleWishlistToggle" />

    <div class="md:h-4 h-4"></div>
    <ProductCarousel v-bind="carouselProps(12)" @add-to-cart="handleAddToCart" @product-click="handleProductClick" @quick-view="handleQuickView" @wishlist-toggle="handleWishlistToggle" />

    <div class="md:h-4 h-4"></div>
    <Nouveaute
     :category-id="nouveauteCfg.categoryId"
     :header-background-color="nouveauteCfg.headerBg"
     :header-color="nouveauteCfg.headerColor"
     :grid-columns="nouveauteCfg.gridColumns"
     :products-per-page="nouveauteCfg.productsPerPage"
     :products-limit="nouveauteCfg.productsLimit"
   />
   <div class="h-8"></div>

   <CollapseSeoText />
   <div class="md:h-12 h-4"></div>

  </div>
</template>

<script setup>
import { computed } from 'vue';
import Nouveaute from '~/components/collectionHomepage/Nouveaute.vue';
import DualBannerSlider from '~/components/DualBannerSlider.vue';
import RightDoubleAds from '~/components/herosection/RightDoubleAds.vue';
import ListPartner from '~/components/partenaires/ListPartner.vue';
import CategoryBlocks from '~/components/CategoryBlocks.vue';
import ProductCarousel from '~/components/ProductCarousel.vue';
import Countdowns from '~/components/collectionHomepage/Countdowns.vue'; // Import the new component
import countdownsData from '~/data/countdowns.json'; // Import the countdowns data

// Configuration éditable via WordPress (plugin "IvoirShop Homepage Manager").
const { section } = useHomepageConfig()

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

// --------------------------------------------------------------------------
// Compte à rebours (repli sur le JSON local).
// --------------------------------------------------------------------------
const countdowns = computed(() => section('countdowns', null, countdownsData))

// --------------------------------------------------------------------------
// Carrousels de produits.
// Valeurs par défaut = configuration historique de la page (ordre = affichage).
// --------------------------------------------------------------------------
const DEFAULT_CAROUSELS = [
  { categoryId: 353, gridColumns: 4, maxProducts: 20, headerBg: 'bg-white', headerColor: 'text-black', navColor: 'text-black', bannerImageUrl: '/images/newbannerA.webp' },
  { categoryId: 347, gridColumns: 5, maxProducts: 20, headerBg: 'bg-[#a50a0a]', headerColor: 'text-white', navColor: 'text-black', bannerImageUrl: '' },
  { categoryId: 354, gridColumns: 5, maxProducts: 20, headerBg: 'bg-[#019d39]', headerColor: 'text-white', navColor: 'text-black', bannerImageUrl: '' },
  { categoryId: 355, gridColumns: 5, maxProducts: 20, headerBg: 'bg-white', headerColor: 'text-black', navColor: 'text-black', bannerImageUrl: '' },
  { categoryId: 356, gridColumns: 4, maxProducts: 20, headerBg: 'bg-white', headerColor: 'text-black', navColor: 'text-black', bannerImageUrl: '/images/newbannerA.webp' },
  { categoryId: 357, gridColumns: 5, maxProducts: 20, headerBg: 'bg-white', headerColor: 'text-black', navColor: 'text-black', bannerImageUrl: '' },
  { categoryId: 358, gridColumns: 5, maxProducts: 20, headerBg: 'bg-white', headerColor: 'text-black', navColor: 'text-black', bannerImageUrl: '' },
  { categoryId: 359, gridColumns: 4, maxProducts: 20, headerBg: 'bg-white', headerColor: 'text-black', navColor: 'text-black', bannerImageUrl: '/images/newbannerA.webp' },
  { categoryId: 312, gridColumns: 5, maxProducts: 20, headerBg: 'bg-white', headerColor: 'text-black', navColor: 'text-black', bannerImageUrl: '' },
  { categoryId: 360, gridColumns: 5, maxProducts: 20, headerBg: 'bg-white', headerColor: 'text-black', navColor: 'text-black', bannerImageUrl: '' },
  { categoryId: 361, gridColumns: 5, maxProducts: 20, headerBg: 'bg-white', headerColor: 'text-black', navColor: 'text-black', bannerImageUrl: '/images/newbannerA.webp' },
  { categoryId: 362, gridColumns: 5, maxProducts: 20, headerBg: 'bg-white', headerColor: 'text-black', navColor: 'text-black', bannerImageUrl: '/images/newbannerA.webp' },
  { categoryId: 363, gridColumns: 5, maxProducts: 20, headerBg: 'bg-white', headerColor: 'text-black', navColor: 'text-black', bannerImageUrl: '' },
]

const carousels = computed(() => section('productCarousels', null, DEFAULT_CAROUSELS))

// Retourne les props (camelCase) d'un carrousel donné, avec repli sur le défaut.
const carouselProps = (i) => {
  const c = carousels.value?.[i] || DEFAULT_CAROUSELS[i] || {}
  const d = DEFAULT_CAROUSELS[i] || {}
  return {
    categoryId: Number(c.categoryId ?? d.categoryId),
    gridColumns: Number(c.gridColumns ?? d.gridColumns ?? 5),
    maxProducts: Number(c.maxProducts ?? d.maxProducts ?? 20),
    autoplay: true,
    autoplayDelay: 300,
    showPagination: true,
    showNavigation: true,
    showViewAllButton: true,
    autoFetchTitle: true,
    headerBackgroundColor: c.headerBg ?? d.headerBg ?? 'bg-white',
    headerColor: c.headerColor ?? d.headerColor ?? 'text-black',
    navigationColor: c.navColor ?? d.navColor ?? 'text-black',
    bannerImageUrl: c.bannerImageUrl ?? d.bannerImageUrl ?? '',
  }
}

// --------------------------------------------------------------------------
// Bannières doubles (6 emplacements, repli sur les valeurs historiques).
// --------------------------------------------------------------------------
const DEFAULT_DOUBLE_BANNERS = [
  [
    { image: '/categorieImage/Mixeur.jpg', link: 'https://ivoirshop.ci/produit/ilux-blender-grinder-2-en-1-lx-358-bol-1-5-l-300w-blanc-noir', alt: 'Mixeurs' },
    { image: '/categorieImage/Machinbe pilé foutou.jpg', link: ' https://ivoirshop.ci/produit/binatone-machine-a-piler-foutou-6l-1000w', alt: 'Machinbe pilé foutou.jpg' },
  ],
  [
    { image: '/categorieImage/Plaque gaz.jpg', link: 'https://www.ivoirshop.ci/produit/ilux-cuisiniere-a-gaz-rechaud-3-feux-lxg-7403-sx95-bleu', alt: 'Plaque gaz' },
    { image: '/categorieImage/Gazinière.jpg', link: ' https://www.ivoirshop.ci/produit/ilux-cuisiniere-gaz-4-feux-lxg-40w-50x50-cm-blanc-garantie-6-mois', alt: 'Gazinière.jpg' },
  ],
  [
    { image: '/categorieImage/TV.jpg', link: ' https://www.ivoirshop.ci/produit/ilux-tv-led-full-hd-43-pouces-decodeur-integre-hdmi-usb-vga-noir-garantie-06-mois', alt: 'TV' },
    { image: '/categorieImage/Audio.jpg', link: 'https://www.ivoirshop.ci/produit/alitop-woofer-chaine-hifi-bluetooth-usb-fm-tvsd-noir-garantie-01-mois', alt: 'Audio' },
  ],
  [
    { image: '/categorieImage/Micro onde.jpg', link: 'https://www.ivoirshop.ci/produit/ilux-micro-onde-lxm-2090b-20-litres-700w-noir', alt: 'Micro onde' },
    { image: '/categorieImage/refrigerateur.jpg', link: ' https://www.ivoirshop.ci/produit/ilux-refrigerateur-2-battants-118-l-ilr118-gris-garantie-6-mois', alt: 'efrigerateur' },
  ],
  [
    { image: '/categorieImage/Ventilateur.jpg', link: ' https://www.ivoirshop.ci/produit/ilux-2-ventilateurs-18-pouces-lxf-823-7-helices-copie', alt: 'Ventilateur' },
    { image: '/categorieImage/Climatiseur.jpg', link: ' https://www.ivoirshop.ci/produit/split-1-cv-smart-fonctionnant-en-mode-on-off-r410-sts-09_ultra-blanc-garantie-12-mois', alt: 'Climatiseur' },
  ],
]

const doubleBanners = computed(() => section('doubleBanners', null, DEFAULT_DOUBLE_BANNERS))
const banners = (i) => doubleBanners.value?.[i]

// --------------------------------------------------------------------------
// Bloc "Nouveautés".
// --------------------------------------------------------------------------
const DEFAULT_NOUVEAUTE = { categoryId: 300, headerBg: 'bg-orange-500', headerColor: 'text-black', gridColumns: 5, productsPerPage: 30, productsLimit: 30 }
const nouveauteCfg = computed(() => {
  const c = section('nouveaute', null, DEFAULT_NOUVEAUTE)
  return {
    categoryId: Number(c.categoryId ?? DEFAULT_NOUVEAUTE.categoryId),
    headerBg: c.headerBg ?? DEFAULT_NOUVEAUTE.headerBg,
    headerColor: c.headerColor ?? DEFAULT_NOUVEAUTE.headerColor,
    gridColumns: Number(c.gridColumns ?? DEFAULT_NOUVEAUTE.gridColumns),
    productsPerPage: Number(c.productsPerPage ?? DEFAULT_NOUVEAUTE.productsPerPage),
    productsLimit: Number(c.productsLimit ?? DEFAULT_NOUVEAUTE.productsLimit),
  }
})

// --------------------------------------------------------------------------
// Fond de page (nouveau : couleur ou image, désactivé par défaut).
// --------------------------------------------------------------------------
const backgroundStyle = computed(() => {
  const bg = section('background', null, { type: 'none' })
  if (!bg || bg.type === 'none') return {}
  if (bg.type === 'color' && bg.color) {
    return { backgroundColor: bg.color }
  }
  if (bg.type === 'image' && bg.image) {
    return {
      backgroundImage: `url('${bg.image}')`,
      backgroundSize: bg.size || 'cover',
      backgroundRepeat: bg.repeat || 'no-repeat',
      backgroundPosition: 'center',
    }
  }
  return {}
})
</script>

<style scoped>
a.view-more-link {
  padding: 10px !important;
  border-radius: 4px !important;
  margin-left: 12px !important;
  color: #000 !important;
}
</style>
