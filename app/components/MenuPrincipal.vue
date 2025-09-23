<template>
  <Disclosure as="nav" class="relative bg-gray-800" v-slot="{ open }">
    <!-- ... header & logo -->

    <!-- Desktop Menu -->
    <div class="hidden sm:ml-6 sm:block">
      <div class="flex space-x-4">
        <template v-for="item in navigation" :key="item.ID">
          <!-- Pas d’enfants -->
          <a
            v-if="!item.children.length"
            :href="item.url"
            :aria-current="item.url === current ? 'page' : undefined"
            class="text-gray-300 hover:bg-white/5 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
          >
            {{ item.title }}
          </a>

          <!-- Avec enfants récursifs -->
          <Menu v-else as="div" class="relative">
            <MenuButton
              class="text-gray-300 hover:bg-white/5 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
            >
              {{ item.title }}
            </MenuButton>

            <MenuItems
              class="absolute left-0 z-10 mt-2 w-48 origin-top-left rounded-md bg-white py-1 shadow-lg outline outline-black/5"
            >
              <MenuRecursive
                v-for="child in item.children"
                :key="child.ID"
                :item="child"
              />
            </MenuItems>
          </Menu>
        </template>
      </div>
    </div>
  </Disclosure>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItems } from '@headlessui/vue'
import MenuRecursive from './MenuRecursive.vue'
const route = useRoute()
const current = 'http://localhost:3000' + route.fullPath

// Fetch menu depuis WP
const { data: navigation } = await useFetch('http://ivoir-shop.local/wp-json/wp/v2/menu-principal')
</script>
