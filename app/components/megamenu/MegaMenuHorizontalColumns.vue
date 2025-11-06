<template>
  <nav class="relative flex items-center">
    <!-- Niveau 1 -->
    <ul
      ref="parentMenu"
      class="lg:flex hidden flex-col w-64 bg-white border-1 border-slate-100 text-gray-800 md:px-3 md:py-4 rounded-sm shadow-md shadow-gray-50"
    >
      <!-- Menu WordPress -->
      <template v-if="!pending && !error && menuItems.length">
        <li v-for="item in menuItems" :key="item.ID" class="relative"
            @mouseenter="showSubMenu(item.ID)"
            @mouseleave="hideSubMenuWithDelay(item.ID)">
          <NuxtLink :to="item.url" class="block px-3.5 py-[5.3px] z-50 hover:bg-gray-50 transition-colors duration-200">
            {{ item.title }}
          </NuxtLink>

          <!-- Niveau 2 → Colonnes -->
          <div
            v-if="item.children && item.children.length && activeSubMenu === item.ID"
            class="absolute md:w-[914px] md:h-[446px] rounded-tr-lg rounded-br-lg md:ml-2.5 top-0 left-full flex bg-white shadow-md shadow-gray-50 z-30 transition-all duration-200"
            :style="{ minHeight: parentHeight + 'px' }"
            @mouseenter="showSubMenu(item.ID)"
            @mouseleave="hideSubMenuWithDelay(item.ID)"
          >
            <div class="flex flex-row gap-4 p-4">
              <div v-for="child in item.children" :key="child.ID" class="flex flex-col min-w-[220px]">
                <a
                  :href="child.url"
                  class="font-bold px-2 py-1 hover:bg-gray-50 transition-colors duration-200"
                >
                  {{ child.title }}
                </a>

                <ul v-if="child.children && child.children.length" class="mt-2 flex flex-col space-y-1">
                  <li v-for="sub in child.children" :key="sub.ID">
                    <a
                      :href="sub.url"
                      class="block px-2 py-1 hover:bg-gray-50 hover:font-medium transition-colors duration-200 whitespace-nowrap"
                    >
                      {{ sub.title }}
                    </a>

                    <ul v-if="sub.children && sub.children.length" class="ml-2 mt-1 flex flex-col space-y-1">
                      <MenuSubItemRecursive v-for="sub2 in sub.children" :key="sub2.ID" :item="sub2" />
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </li>
      </template>
      
      <!-- État de chargement -->
      <template v-else-if="pending">
        <li v-for="i in 5" :key="i" class="relative group">
          <div class="block px-3.5 py-[5.3px] z-50">
            <div class="animate-pulse bg-gray-200 h-4 rounded w-24"></div>
          </div>
        </li>
      </template>
      
      <!-- Menu de fallback en cas d'erreur -->
      <template v-else-if="error || !menuItems.length">
        <li class="relative group">
          <NuxtLink to="/" class="block px-3.5 py-[5.3px] z-50 hover:bg-gray-50 transition-colors duration-200">
            Accueil
          </NuxtLink>
        </li>
        <li class="relative group">
          <NuxtLink to="/categorie" class="block px-3.5 py-[5.3px] z-50 hover:bg-gray-50 transition-colors duration-200">
            Catégories
          </NuxtLink>
        </li>
        <li class="relative group">
          <NuxtLink to="/recherche" class="block px-3.5 py-[5.3px] z-50 hover:bg-gray-50 transition-colors duration-200">
            Recherche
          </NuxtLink>
        </li>
        
        <!-- Message d'erreur en mode debug (à retirer en production) -->
        <li v-if="error" class="px-3.5 py-2 text-xs text-red-500">
          Erreur menu: {{ error }}
        </li>
      </template>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

interface MenuItem {
  ID: number
  title: string
  url: string
  menu_item_parent: string
  children?: MenuItem[]
}

interface MenuResponse {
  success: boolean
  menuSlug?: string
  menuId?: string
  items: MenuItem[]
  total: number
  message?: string
  error?: string
}

// 🔥 OPTION 1: Utiliser le SLUG du menu (recommandé si vous ne connaissez pas l'ID)
const { data: menuData, pending, error: fetchError } = await useFetch<MenuResponse>('/api/wordpress/menu-items', {
  query: {
    menuSlug: 'menu-principal'  // ✅ Votre vrai slug de menu
  },
  default: () => ({
    success: false,
    items: [],
    total: 0
  })
})

// 🔥 OPTION 2: Si vous connaissez l'ID du menu, décommentez ceci:
/*
const { data: menuData, pending, error: fetchError } = await useFetch<MenuResponse>('/api/wordpress/menu-items', {
  query: {
    menuId: '2'  // ⬅️ Remplacez par l'ID réel de votre menu
  },
  default: () => ({
    success: false,
    items: [],
    total: 0
  })
})
*/

// Computed pour extraire les items du menu
const menuItems = computed(() => {
  if (!menuData.value || !menuData.value.success) {
    return []
  }
  return menuData.value.items || []
})

// Gestion des erreurs
const error = computed(() => {
  if (fetchError.value) {
    return fetchError.value.message || 'Erreur de chargement du menu'
  }
  if (menuData.value && !menuData.value.success) {
    return menuData.value.message || menuData.value.error || 'Menu non trouvé'
  }
  return null
})

const parentMenu = ref<HTMLElement | null>(null)
const parentHeight = ref(0)
const activeSubMenu = ref<number | null>(null)
const hoverTimeout = ref<NodeJS.Timeout | null>(null)

const showSubMenu = (menuId: number) => {
  if (hoverTimeout.value) {
    clearTimeout(hoverTimeout.value)
    hoverTimeout.value = null
  }
  activeSubMenu.value = menuId
}

const hideSubMenuWithDelay = (menuId: number) => {
  if (activeSubMenu.value === menuId) {
    hoverTimeout.value = setTimeout(() => {
      activeSubMenu.value = null
      hoverTimeout.value = null
    }, 100) // Délai de 100ms
  }
}

onMounted(() => {
  if (parentMenu.value) {
    parentHeight.value = parentMenu.value.offsetHeight
  }
  
  // Debug: Afficher les données du menu dans la console
  console.log('📋 Menu Data:', menuData.value)
  console.log('📋 Menu Items:', menuItems.value)
  console.log('⚠️ Error:', error.value)
})
</script>