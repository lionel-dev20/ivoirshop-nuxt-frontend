<template>
  <div class="w-full px-1.5 px-0 md:max-w-[62%] mx-auto shadow-sm shadow-gray-100 md:border-1 border-0 border-gray-100">
    <Swiper
      :modules="[Navigation, Pagination, Autoplay]"
      :slides-per-view="1"
      :space-between="20"
      :autoplay="{ delay: 5000, disableOnInteraction: false }"
      :loop="true"
      :breakpoints="{
        640: { slidesPerView: 1 },   // mobile
        768: { slidesPerView: 1 },   // tablette
        1024: { slidesPerView: 1 }   // desktop
      }"
      navigation
      pagination
      class="w-full h-[446px] rounded-sm"
    >
      <!-- Slides -->
      <SwiperSlide
        v-for="(slide, i) in slides"
        :key="i"
        class="flex items-center justify-center bg-gray-200 rounded-lg shadow "
      >
        <img :src="slide.image" :alt="'slide ' + i" class="w-full h-[446px] object-cover rounded-sm" />
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

const slides = [
  { image: 'https://web.archive.org/web/20240216010857if_/https://www.ivoirshop.ci/wp-content/uploads/2024/01/IVS_SLIDER_TV.jpg' },
  { image: 'https://web.archive.org/web/20240216010935if_/https://app.ivoirshop.ci/wp-content/uploads/2023/11/Slider-8.png' },
  { image: 'https://web.archive.org/web/20240216010855if_/https://www.ivoirshop.ci/wp-content/uploads/2024/01/IVS_SLIDER_GEN_2.jpg' },
  { image: 'https://web.archive.org/web/20240216010935if_/https://app.ivoirshop.ci/wp-content/uploads/2023/11/Slider-8.png' }
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
