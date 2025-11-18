<template>
  <div class="w-full  px-0 md:max-w-[62%] mx-auto shadow-sm shadow-gray-100 md:border-1 border-0 border-gray-100">
    <Swiper
      :modules="[Navigation, Pagination, Autoplay]"
      :slides-per-view="1"
      :space-between="12"
      :autoplay="{ delay: 5000, disableOnInteraction: false }"
      :loop="true"
      :breakpoints="{
        360: {slidesPerView: 1.25},
        640: { slidesPerView: 2.5 },   // mobile
        768: { slidesPerView: 1 },   // tablette
        1024: { slidesPerView: 1 }   // desktop
      }"
      :navigation="showNavigation"
      pagination
      class="w-full  md:h-[446px] rounded-sm"
    >
      <!-- Slides -->
      <SwiperSlide
        v-for="(slide, i) in slides"
        :key="i"
        class="flex items-center h-auto justify-center bg-gray-200 rounded-lg shadow "
      >
      <NuxtLink :to="slide.link" target="_blank">
        <img :src="slide.image" :alt="'slide ' + i" class="w-full md:h-[446px] object-cover rounded-sm" />
      </NuxtLink>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

// Import des styles Swiper
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { ref, onMounted, onUnmounted, computed } from 'vue'

const screenWidth = ref(0);

onMounted(() => {
  screenWidth.value = window.innerWidth;
  window.addEventListener('resize', () => {
    screenWidth.value = window.innerWidth;
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', () => {
    screenWidth.value = window.innerWidth;
  });
});

const showNavigation = computed(() => {
  return screenWidth.value >= 768; // Afficher la navigation à partir des tablettes
});

const slides = [
  { image: '/images/Electromenager.png', link: 'https://ivoirshop.ci/categorie/electromenager' },
  { image: '/images/gros-electromenager.png', link: 'https://ivoirshop.ci/categorie/gros-electromenager' },
  { image: '/images/Petit-electromenager.png', link: 'https://ivoirshop.ci/categorie/petit-electromenager' },
] as const
</script>

<style scoped>
/* Optionnel : personnaliser la pagination */
.swiper-pagination-bullet {
  background: #000 !important;
}
.swiper-button-next,
.swiper-button-prev {
  color: #000 !important;
  background: rgba(255, 255, 255, 0.4) !important;
  width: 40px !important;
  height: 40px !important;
  border-radius: 50% !important;
}

.swiper-button-next::after,
.swiper-button-prev::after {
  font-size: 24px !important;
}




</style>
