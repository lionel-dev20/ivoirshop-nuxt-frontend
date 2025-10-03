<template>
  <div class="relative flex">
    <!-- Menu principal -->
    <nav class="hidden sm:block w-64 bg-gray-800 text-white min-h-screen">
      <ul class="flex flex-col">
        <!-- Menu WordPress -->
        <template v-if="!pending && !error && navigation?.length">
          <MenuItemRecursive
            v-for="item in navigation"
            :key="item.ID"
            :item="item"
          />
        </template>
        
        <!-- Menu de fallback -->
        <template v-else-if="error || !navigation?.length">
          <li class="px-4 py-2 hover:bg-gray-700">
            <NuxtLink href="/" class="block">Accueil</NuxtLink>
          </li>
          <li class="px-4 py-2 hover:bg-gray-700">
            <NuxtLink href="/categorie" class="block">Catégories</NuxtLink>
          </li>
          <li class="px-4 py-2 hover:bg-gray-700">
            <NuxtLink href="/recherche" class="block">Recherche</NuxtLink>
          </li>
        </template>
        
               <!-- État de chargement -->
               <template v-else>
                 <li v-for="i in 5" :key="i" class="px-4 py-2">
                   <div class="animate-pulse bg-gray-600 h-4 rounded" :class="`w-${16 + i * 2}`"></div>
                 </li>
               </template>
      </ul>
    </nav>

    <!-- Bouton mobile -->
    <div class="sm:hidden">
      <button @click="isOpen = !isOpen" class="p-2 text-gray-600">
        <span v-if="!isOpen">☰ Menu</span>
        <span v-else>✕ Fermer</span>
      </button>
      <div v-show="isOpen" class="absolute top-0 left-0 w-64 bg-gray-800 text-white min-h-screen z-50">
        <ul>
          <!-- Menu WordPress mobile -->
          <template v-if="!pending && !error && navigation?.length">
            <MenuItemRecursive
              v-for="item in navigation"
              :key="item.ID"
              :item="item"
            />
          </template>
          
          <!-- Menu de fallback mobile -->
          <template v-else-if="error || !navigation?.length">
            <li class="px-4 py-2 hover:bg-gray-700">
              <NuxtLink href="/" class="block">Accueil</NuxtLink>
            </li>
            <li class="px-4 py-2 hover:bg-gray-700">
              <NuxtLink href="/categorie" class="block">Catégories</NuxtLink>
            </li>
            <li class="px-4 py-2 hover:bg-gray-700">
              <NuxtLink href="/recherche" class="block">Recherche</NuxtLink>
            </li>
          </template>
          
                 <!-- État de chargement mobile -->
                 <template v-else>
                   <li v-for="i in 5" :key="i" class="px-4 py-2">
                     <div class="animate-pulse bg-gray-600 h-4 rounded" :class="`w-${16 + i * 2}`"></div>
                   </li>
                 </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)

// Fetch menu WordPress avec gestion d'erreur
const { data: navigation, pending, error } = await useFetch('/api/wordpress/menu', {
  default: () => [],
  server: false
})
</script>
