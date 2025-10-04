<!-- components/MobileMenu.vue -->
<template>
  <nav class="flex flex-col w-full">
    <!-- Menu WordPress -->
    <template v-if="!pending && !error && navigation?.length">
      <div v-for="item in navigation" :key="item.ID" class="border-b border-gray-100">
        <!-- Item principal -->
        <div class="relative">
          <NuxtLink 
            :href="item.url" 
            @click="closeMenu"
            class="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span class="font-medium">{{ item.title }}</span>
            <svg 
              v-if="item.children && item.children.length"
              class="w-5 h-5 transition-transform duration-200"
              :class="{ 'rotate-180': expandedItems.includes(item.ID) }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </NuxtLink>

          <!-- Bouton pour ouvrir/fermer les sous-menus -->
          <button 
            v-if="item.children && item.children.length"
            @click="toggleExpanded(item.ID)"
            class="absolute inset-0 w-full h-full"
            aria-label="Toggle submenu"
          ></button>
        </div>

        <!-- Sous-menus -->
        <div 
          v-if="item.children && item.children.length"
          class="overflow-hidden transition-all duration-300"
          :class="expandedItems.includes(item.ID) ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'"
        >
          <div class="bg-gray-50">
            <div v-for="child in item.children" :key="child.ID" class="border-b border-gray-200">
              <!-- Sous-item principal -->
              <div class="relative">
                <NuxtLink 
                  :href="child.url"
                  @click="closeMenu"
                  class="flex items-center justify-between px-8 py-3 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <span class="font-medium">{{ child.title }}</span>
                  <svg 
                    v-if="child.children && child.children.length"
                    class="w-4 h-4 transition-transform duration-200"
                    :class="{ 'rotate-180': expandedItems.includes(child.ID) }"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </NuxtLink>

                <!-- Bouton pour ouvrir/fermer les sous-sous-menus -->
                <button 
                  v-if="child.children && child.children.length"
                  @click="toggleExpanded(child.ID)"
                  class="absolute inset-0 w-full h-full"
                  aria-label="Toggle submenu"
                ></button>
              </div>

              <!-- Sous-sous-menus -->
              <div 
                v-if="child.children && child.children.length"
                class="overflow-hidden transition-all duration-300"
                :class="expandedItems.includes(child.ID) ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'"
              >
                <div class="bg-gray-100">
                  <NuxtLink 
                    v-for="sub in child.children" 
                    :key="sub.ID"
                    :href="sub.url"
                    @click="closeMenu"
                    class="block px-12 py-2 text-gray-600 hover:bg-gray-200 hover:text-[#ff9900] transition-colors"
                  >
                    {{ sub.title }}
                  </NuxtLink>

                  <!-- Niveau 3 (si nécessaire) -->
                  <template v-for="sub in child.children" :key="sub.ID">
                    <template v-if="sub.children && sub.children.length">
                      <NuxtLink 
                        v-for="sub2 in sub.children" 
                        :key="sub2.ID"
                        :href="sub2.url"
                        @click="closeMenu"
                        class="block px-16 py-1 text-sm text-gray-500 hover:bg-gray-200 hover:text-[#ff9900] transition-colors"
                      >
                        {{ sub2.title }}
                      </NuxtLink>
                    </template>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    
    <!-- Menu de fallback en cas d'erreur -->
    <template v-else-if="error || !navigation?.length">
      <NuxtLink 
        to="/" 
        @click="closeMenu"
        class="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
      >
        Accueil
      </NuxtLink>
      <NuxtLink 
        to="/categorie" 
        @click="closeMenu"
        class="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
      >
        Catégories
      </NuxtLink>
      <NuxtLink 
        to="/recherche" 
        @click="closeMenu"
        class="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
      >
        Recherche
      </NuxtLink>
    </template>
    
    <!-- État de chargement -->
    <template v-else>
      <div v-for="i in 5" :key="i" class="border-b border-gray-100">
        <div class="px-4 py-3">
          <div class="animate-pulse bg-gray-200 h-4 rounded" :class="`w-${16 + i * 2}`"></div>
        </div>
      </div>
    </template>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const { data: navigation, pending, error } = await useFetch('/api/wordpress/menu', {
  default: () => [],
  server: false
})

const expandedItems = ref<number[]>([])

// Émettre l'événement de fermeture
const emit = defineEmits<{
  close: []
}>()

const toggleExpanded = (itemId: number) => {
  const index = expandedItems.value.indexOf(itemId)
  if (index > -1) {
    expandedItems.value.splice(index, 1)
  } else {
    expandedItems.value.push(itemId)
  }
}

// Fonction pour fermer le menu
const closeMenu = () => {
  emit('close')
}
</script>
