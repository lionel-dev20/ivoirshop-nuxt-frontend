<!-- layouts/default.vue -->
<template>
  <div :class="['min-h-screen flex flex-col', isIndexPage ? 'bg-red-500' : 'bg-gray-50']">
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