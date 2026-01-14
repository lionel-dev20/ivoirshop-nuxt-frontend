<!-- layouts/default.vue -->
<template>
  <div 
    :class="['min-h-screen flex flex-col', isIndexPage ? 'homepage-bg' : 'bg-gray-50']"
    :style="isIndexPage ? homepageBgStyle : {}"
  >
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

const homepageBgStyle = computed(() => {
  if (!isIndexPage.value) return {}
  
  return {
    backgroundImage: `url('/images/bg-ivoirshop.jpg')`,
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    backgroundSize: 'cover'
  }
})
</script>

<style scoped>
.homepage-bg {
  position: relative;
  min-height: 100vh;
  width: 100%;
}

/* Assurer que le background est visible */
.homepage-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}
</style>