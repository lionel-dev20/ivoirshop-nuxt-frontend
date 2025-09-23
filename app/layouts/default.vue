<!-- layouts/default.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <TopBanner />
    <AppHeader />
    <main>
      <slot />
    </main>
    <CartSidebar />
  </div>
</template>

<script setup lang="ts">
// Ce layout sera utilisé automatiquement par Nuxt
</script>