<!-- components/AppHeader.vue -->
<template>
  <header class="bg-white shadow-sm border-b sticky top-0 z-30 scroll-smooth">
    <div class="lg:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-0">
      <div class="flex justify-between items-center h-16">

        <!-- Menu mobile toggle -->
        <button 
            @click="toggleMobileMenu"
            class="md:hidden p-2 text-gray-400 hover:text-gray-500 transition-colors"
          >
            <svg v-if="!isMobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

        <!-- Logo -->
        <div class="flex-shrink-0">
          <NuxtLink to="/" class="text-xl font-bold text-gray-900">
            <img
              src="/logo/ivoirshopci-coteivoir.png"
              alt="IvoirShop Logo"
              class="h-13 w-auto mt-3 mr-12" />
          </NuxtLink>
        </div>

        <!-- Menu desktop -->
        <div class="hidden md:block flex-1 mx-8">
          <NuxtLink to="/" class="text-gray-700 hover:text-[#ff9900] px-3 py-2 text-sm font-medium">Devenir vendeur</NuxtLink>
          <NuxtLink to="/categorie" class="text-gray-700 hover:text-[#ff9900] px-3 py-2 text-sm font-medium">Les meilleurs Deals</NuxtLink>
          <NuxtLink to="/recherche" class="text-gray-700 hover:text-[#ff9900] px-3 py-2 text-sm font-medium">Recherche</NuxtLink>
        </div>

        <!-- Actions -->
        <div class="flex items-center space-x-4">
          <!-- Recherche avec autocomplétion -->
          <div class="hidden md:block w-80">
            <SearchBox />
          </div>

          <!-- Menu compte -->
          <AccountMenu />

          <!-- Panier -->
          <button
            @click="cartStore.toggleCart()"
            class="relative p-0 text-gray-400 cursor-pointer hover:text-gray-500 transition-colors"
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

          
        </div>
      </div>
    </div>

    <!-- Overlay pour mobile/tablette -->
    <div 
      v-if="isMobileMenuOpen"
      @click="closeMobileMenu"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300"
    ></div>

    <!-- Menu mobile -->
    <div 
      :class="[
        'fixed top-0 left-0 h-full w-3/4 max-w-sm bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- Header du menu mobile -->
      <div class="flex items-center justify-between p-4 border-b">
        <NuxtLink to="/" @click="closeMobileMenu" class="text-xl font-bold text-gray-900">
          <img
            src="/logo/ivoirshopci-coteivoir.png"
            alt="IvoirShop Logo"
            class="h-8 w-auto" />
        </NuxtLink>
        <button 
          @click="closeMobileMenu"
          class="p-2 text-gray-400 hover:text-gray-500 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Navigation mobile -->
      <nav class="flex flex-col py-4">
        <!-- Recherche mobile dans le menu -->
        <div class="px-4 mb-4">
          <SearchBox />
        </div>

        <!-- Menu WordPress dynamique -->
        <div class="flex-1 overflow-y-auto">
          <MobileMenu @close="closeMobileMenu" />
        </div>

        <!-- Séparateur -->
        <div class="border-t my-4"></div>

        <!-- Compte utilisateur -->
        <div class="px-6 py-3">
          <AccountMenu />
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

const cartStore = useCartStore()

// État du menu mobile
const isMobileMenuOpen = ref(false)

// Fonctions pour gérer le menu mobile
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Fermer le menu avec la touche Échap
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isMobileMenuOpen.value) {
    closeMobileMenu()
  }
}

// Empêcher le scroll du body quand le menu est ouvert
const toggleBodyScroll = (isOpen: boolean) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

// Watcher pour gérer le scroll du body
watch(isMobileMenuOpen, (newValue) => {
  toggleBodyScroll(newValue)
})

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  // S'assurer que le scroll est réactivé si le composant est démonté
  document.body.style.overflow = ''
})
</script>