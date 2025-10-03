<template>
  <div v-if="!pending && !error && navigation?.length">
    <a 
      v-for="item in navigation" 
      :key="item.ID" 
      :href="item.url" 
      :aria-current="item.url === current ? 'page' : undefined"
      class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
    >
      {{ item.title }}
    </a>
  </div>
  
  <!-- Fallback menu en cas d'erreur -->
  <div v-else-if="error || !navigation?.length" class="flex space-x-4">
    <NuxtLink to="/" class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">Accueil</NuxtLink>
    <NuxtLink to="/categorie" class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">Catégories</NuxtLink>
    <NuxtLink to="/recherche" class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">Recherche</NuxtLink>
  </div>
  
         <!-- Loading state -->
         <MenuSkeleton v-else />
</template>

<script setup>
const route = useRoute()
const current = route.fullPath

// Utiliser l'endpoint local avec gestion d'erreur
const { data: navigation, pending, error, refresh } = await useFetch('/api/wordpress/menu', {
  default: () => [],
  server: false // Charger côté client pour éviter les erreurs SSR
})
</script>