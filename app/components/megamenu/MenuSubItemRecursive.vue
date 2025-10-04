<template>
  <li>
    <a
      :href="item.url"
      class="block px-2 py-1 hover:bg-gray-700 transition-colors duration-200 whitespace-nowrap"
    >
      {{ item.title }}
    </a>

    <ul v-if="item.children && item.children.length" class="ml-2 mt-1 flex flex-col space-y-1">
      <MenuSubItemRecursive v-for="child in item.children" :key="child.ID" :item="child" />
    </ul>
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
