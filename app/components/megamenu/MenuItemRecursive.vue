<template>
  <li class="relative group">
    <!-- Item sans enfants -->
    <a
      v-if="!item.children || !item.children.length"
      :href="item.url"
      class="block px-4 py-2 hover:bg-gray-700 transition-colors duration-200 whitespace-nowrap"
    >
      {{ item.title }}
    </a>

    <!-- Item avec enfants -->
    <div v-else class="relative">
      <div
        class="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-700 transition-colors duration-200 whitespace-nowrap"
      >
        <span>{{ item.title }}</span>
        <svg
          class="w-4 h-4 text-gray-400 group-hover:text-gray-200 transform transition-transform duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </div>

      <!-- Sous-menu qui s'ouvre vers la droite -->
      <ul
        class="absolute top-0 left-full ml-1 w-48 max-h-0 opacity-0 overflow-hidden
               group-hover:opacity-100 group-hover:max-h-[1000px]
               transition-all duration-300 ease-in-out bg-gray-700 z-50"
      >
        <MenuItemRecursive
          v-for="child in item.children"
          :key="child.ID"
          :item="child"
        />
      </ul>
    </div>
  </li>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

defineProps<{
  item: {
    ID: number
    title: string
    url: string
    children?: Array<any>
  }
}>()
</script>
