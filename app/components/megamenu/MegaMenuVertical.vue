<template>
  <div class="relative flex">
    <!-- Menu principal -->
    <nav class="hidden sm:block w-64 bg-gray-800 text-white min-h-screen">
      <ul class="flex flex-col">
        <MenuItemRecursive
          v-for="item in navigation"
          :key="item.data.ID"
          :item="item"
        />
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
          <MenuItemRecursive
            v-for="item in navigation"
            :key="item.ID"
            :item="item"
          />
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)

// Fetch menu WordPress
const { data: navigation } = await useFetch('http://ivoir-shop.local/wp-json/wp/v2/menu-principal')
</script>
