<template>
    <div v-if="enabled">
        <NuxtLink :to="link"
            class="object-cover flex justify-center items-center shadow-md shadow-gray-100"
            :style="{ backgroundColor: bgColor }">
            <img
                :src="image"
                alt="Publicité 1" loading="lazy" class="" />
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">
// Contenu piloté par WordPress (plugin "IvoirShop Homepage Manager").
const { section } = useHomepageConfig()

const enabled = computed(() => {
  const v = section<any>('topBanner', 'enabled', true)
  // Le réglage peut arriver comme booléen (défaut) ou chaîne '1'/'0' (WP).
  return v !== false && v !== '0' && v !== 0 && v !== ''
})
const image = computed(() => section('topBanner', 'image', '/images/Slider_IVS_Bonne_Annee_Sticky.gif'))
const link = computed(() => section('topBanner', 'link', '/'))
const bgColor = computed(() => section('topBanner', 'bgColor', '#ff5a00'))
</script>

<style scoped>

</style>