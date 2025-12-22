<template>
  <div v-if="hasValidBanners" class="bg-white flex flex-col md:flex-row md:gap-x-3 gap-x-0 gap-y-1 md:gap-y-0 justify-between items-center border-slate-100 md:p-3 p-1 rounded-[12px]">
    <NuxtLink 
      v-for="(banner, index) in validBanners" 
      :key="index"
      :to="banner.link"
      class="flex-1"
    >
      <img 
        :src="banner.image" 
        :alt="banner.alt || 'Banner'" 
        class="object-cover h-full w-full rounded-[8px]"
      />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Banner {
  image: string
  link: string
  alt?: string
}

interface Props {
  banners: Banner[]
}

const props = withDefaults(defineProps<Props>(), {
  banners: () => []
})

// Filtrer les banners qui ont une image valide
const validBanners = computed(() => {
  return props.banners.filter(banner => banner.image && banner.image.trim() !== '')
})

// Vérifier s'il y a au moins un banner valide
const hasValidBanners = computed(() => {
  return validBanners.value.length > 0
})
</script>

<style scoped></style>

