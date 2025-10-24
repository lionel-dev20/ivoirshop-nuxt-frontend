<template>
  <nav class="relative flex items-center">
    <!-- Niveau 1 -->
    <ul
      ref="parentMenu"
      class="lg:flex hidden flex-col w-64 bg-white border-1 border-slate-100 text-gray-800 md:px-3 md:py-4 rounded-sm shadow-md shadow-gray-50"
    >
      <!-- Menu WordPress -->
      <template v-if="!pending && !error && navigation.length">
        <li v-for="item in navigation" :key="item.ID" class="relative"
            @mouseenter="showSubMenu(item.ID)"
            @mouseleave="hideSubMenuWithDelay(item.ID)">
          <NuxtLink :href="item.url" class="block px-3.5 py-[5.3px] z-50 transition-colors duration-200">
            {{ item.title }}
          </NuxtLink>

          <!-- Niveau 2 → Colonnes -->
          <div
            v-if="item.children && item.children.length && activeSubMenu === item.ID"
            class="absolute md:w-[914px] md:h-[446px] rounded-tr-lg rounded-br-lg md:ml-2.5 top-0 left-full flex bg-white shadow-md shadow-gray-50 z-30 transition-all duration-200"
            :style="{ minHeight: parentHeight + 'px' }"
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
      
      <!-- Menu de fallback en cas d'erreur -->
      <template v-else-if="error || !navigation.length">
        <li class="relative group">
          <NuxtLink href="/" class="block px-3.5 py-[5.3px] z-50 transition-colors duration-200">
            Accueil
          </NuxtLink>
        </li>
        <li class="relative group">
          <NuxtLink href="/categorie" class="block px-3.5 py-[5.3px] z-50 transition-colors duration-200">
            Catégories
          </NuxtLink>
        </li>
        <li class="relative group">
          <NuxtLink href="/recherche" class="block px-3.5 py-[5.3px] z-50 transition-colors duration-200">
            Recherche
          </NuxtLink>
        </li>
      </template>
      
             <!-- État de chargement -->
             <template v-else-if="pending">
               <li v-for="i in 5" :key="i" class="relative group">
                 <div class="block px-3.5 py-[5.3px] z-50">
                   <div class="animate-pulse bg-gray-200 h-4 rounded" :class="`w-${16 + i * 2}`"></div>
                 </div>
               </li>
             </template>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { PropType } from 'vue'

interface Item {
  ID: number;
  title: string;
  url: string;
  children?: Item[];
}

const { data, pending, error } = await useFetch('/api/wordpress/menu', {
  default: () => [] as Item[],
  server: false
})

const navigation = computed(() => (data.value || []) as Item[])

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
})
</script>
