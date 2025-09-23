<template>
  <nav class="bg-white shadow p-4">
    <ul class="flex space-x-4">
      <li v-for="item in menu" :key="item.id" class="relative group">
        <NuxtLink :to="item.url" class="font-medium hover:text-blue-600">{{ item.title }}</NuxtLink>

        <!-- Sous-menu -->
        <ul v-if="item.children && item.children.length" class="absolute left-0 top-full bg-white shadow-lg mt-2 hidden group-hover:block min-w-[200px]">
          <li v-for="child in item.children" :key="child.id" class="px-4 py-2 hover:bg-gray-100">
            <NuxtLink :to="child.url">{{ child.title }}</NuxtLink>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface MenuItem {
  id: number | string
  title: string
  url: string
  children?: MenuItem[]
}

const menu = ref<MenuItem[]>([])

const fetchMenu = async () => {
  try {
    const data = await $fetch<MenuItem[]>('/api/wordpress/menu')
    menu.value = data
    console.log('Menu:', data)
  } catch (err) {
    console.error('Erreur chargement menu:', err)
  }
}

onMounted(fetchMenu)
</script>

<style scoped>
.group:hover > ul {
  display: block;
}
</style>
