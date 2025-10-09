<!-- layouts/default.vue -->
<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
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
// Ce layout sera utilisé automatiquement par Nuxt
</script>