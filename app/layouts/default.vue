<!-- layouts/default.vue -->
<template>
  <div 
    :class="['min-h-screen flex flex-col', isIndexPage ? 'homepage-bg' : 'bg-gray-50']"
    :style="isIndexPage ? homepageBgStyle : {}"
  >
    <!-- <div class="min-h-screen flex flex-col"> -->
    <TopBanner />
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
    <CartSidebar />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const isIndexPage = computed(() => route.path === '/')

// Style dynamique pour l'image de fond qui fonctionne en production
// Utilisation d'un style inline pour éviter les problèmes de résolution de chemins CSS en production
const homepageBgStyle = computed(() => {
  // Chemin de l'image - les fichiers dans public/ sont servis depuis la racine en production
  // En utilisant un style inline, le navigateur résout correctement le chemin
  const imagePath = '/images/bg-ivoirshop.jpg'
  
  return {
    backgroundImage: `url('${imagePath}')`,
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    width: '100%',
    backgroundSize: 'cover'
  }
})
</script>

<style>
.homepage-bg {
  /* Les styles sont maintenant appliqués via :style dans le template */
  background-size: cover;
}
</style>