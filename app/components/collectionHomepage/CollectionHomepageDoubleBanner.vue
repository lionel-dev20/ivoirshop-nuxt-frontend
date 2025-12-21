<template>
  <div class="bg-white flex flex-col md:flex-row md:gap-x-3 gap-x-0 gap-y-1 md:gap-y-0 justify-between items-center border-slate-100 md:p-3 p-1 rounded-[12px]">
    <NuxtLink 
      v-for="(banner, index) in banners" 
      :key="index"
      :to="banner.link"
      class="flex-1"
    >
      <img 
        :src="banner.image" 
        :alt="banner.alt || 'Banner'" 
        class="object-cover  h-full w-full rounded-[8px]" 
      />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
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
</script>

<style scoped></style>

