<!-- layouts/default.vue -->
<template>
  <div :class="['min-h-screen flex flex-col', isIndexPage ? 'homepage-bg' : 'bg-gray-50']">
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
</script>

<style>
.homepage-bg {
  background-image: url('/images/bg-ivoirshop.jpg');
  /* background-size: fill; */
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  min-height: 100vh;
  width: 100%;
}
</style>