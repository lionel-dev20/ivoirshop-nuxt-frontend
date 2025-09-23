<!-- components/AppHeader.vue -->
<template>
  <header class="bg-white shadow-sm border-b sticky top-0 z-30 scroll-smooth">
    <div class="lg:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-0">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <NuxtLink to="/" class="text-xl font-bold text-gray-900">
            <NuxtImg
              src="/logo/ivoirshopci-coteivoir.png"
              alt="IvoirShop Logo"
              width="200"
              height="70"
              class="h-14 w-auto mt-3" />
          </NuxtLink>
        </div>


        <!-- Actions -->
        <div class="flex items-center space-x-4">
          <!-- Recherche avec autocomplétion -->
          <div class="hidden md:block w-80">
            <SearchBox />
          </div>

          <!-- Panier -->
          <button
            @click="cartStore.toggleCart()"
            class="relative p-2 text-gray-400 hover:text-gray-500 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 21v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v2" />
            </svg>
            <!-- Badge compteur -->
            <span
              v-if="cartStore.itemsCount > 0"
              class="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"
            >
              {{ cartStore.itemsCount }}
            </span>
          </button>

          <!-- Recherche mobile -->
          <MobileSearch />

          <!-- Menu mobile -->
          <button class="md:hidden p-2 text-gray-400 hover:text-gray-500">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const cartStore = useCartStore()
</script>