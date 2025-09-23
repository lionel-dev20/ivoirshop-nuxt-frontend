<template>
  <!-- Lien simple si pas d'enfants -->
  <a
    v-if="!item.children || !item.children.length"
    :href="item.url"
    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
  >
    {{ item.title }}
  </a>

  <!-- Menu déroulant si enfants -->
  <Menu v-else as="div" class="relative group">
    <MenuButton
      class="flex justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
    >
      {{ item.title }}
      <svg class="ml-2 h-4 w-4 text-gray-400 group-hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
    </MenuButton>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        class="absolute left-full top-0 z-20 mt-0 w-48 origin-top-left rounded-md bg-white shadow-lg outline outline-black/5"
      >
        <MenuItem
          v-for="child in item.children"
          :key="child.ID"
          v-slot="{ active }"
        >
          <MenuRecursive :item="child" />
        </MenuItem>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { defineProps } from 'vue'

// Props
defineProps<{
  item: {
    ID: number
    title: string
    url: string
    children?: Array<any>
  }
}>()
</script>
