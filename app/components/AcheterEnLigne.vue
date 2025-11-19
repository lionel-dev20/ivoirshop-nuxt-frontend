<template>
  <div class="p-2.5 md:p-8 bg-white rounded-[4px]">
    <h2 class="text-xl font-bold text-gray-800 mb-4">Acheter en Ligne</h2>
    <div
      class="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-1 md:gap-2 border-t border-l border-gray-200"
    >
      <NuxtLink
        v-for="(item, index) in displayedItems"
        :key="index"
        :to="item.link"
        class="flex flex-col items-center justify-center p-2 md:p-1 text-center border-r border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <img :src="item.image" :alt="item.name" class="w-auto h-24 md:w-auto md:h-24 object-contain mb-2" width="24" height="24" />
        <span class="text-xs md:text-sm font-medium text-gray-700">{{ item.name }}</span>
      </NuxtLink>
    </div>
    
    <!-- Bouton "Voir plus" sur mobile uniquement -->
    <!-- <div v-if="!showAll && isMobile" class="mt-4 flex justify-center md:hidden">
      <button
        @click="showAll = true"
        class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-accent-300 transition-colors text-sm font-medium"
      >
        Voir plus ({{ items.length - mobileLimit }})
      </button>
    </div> -->
    
    <!-- Bouton "Voir moins" sur mobile quand tout est affiché -->
    <div v-if="showAll && isMobile" class="mt-4 flex justify-center md:hidden">
      <button
        @click="showAll = false"
        class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
      >
        Voir moins
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const items = [
  { image: '/categorieImage/Idée-cadeaux.png', name: 'Idée cadeaux', link: '/categorie/telephones' },
  { image: '/categorieImage/Micro-Onde.png', name: 'Micro-Onde', link: '/categorie/electronique' },
  { image: '/categorieImage/Bazar.png', name: 'Bazar', link: '/categorie/mode' },
  { image: '/categorieImage/Haut-parleur.png', name: 'Haut parleur', link: '/categorie/maison' },
  { image: '/categorieImage/Bebe.png', name: 'Bébé', link: '/categorie/beaute' },
  { image: '/categorieImage/Phone.png', name: 'Phones', link: '/categorie/sports' },
  { image: '/categorieImage/ventilateur-clim.png', name: 'Ventilateur clim', link: '/categorie/aliments' },
  { image: '/categorieImage/PlaqueGaz.png', name: 'Plaque Gaz', link: '/categorie/livres' },
  { image: '/categorieImage/bouilloire.png', name: 'Bouilloire', link: '/categorie/jouets' },
  { image: '/categorieImage/Hoofer.png', name: 'Hoofer', link: '/categorie/auto' },
  { image: '/categorieImage/television.png', name: 'television', link: '/categorie/jardin' },
  { image: '/categorieImage/congelateur.png', name: 'Congelateur', link: '/categorie/musique' },
  { image: '/categorieImage/refigerateur.png', name: 'Refrigerateur', link: '/categorie/bijoux' },
  { image: '/categorieImage/Gazinière.png', name: 'Gazinière', link: '/categorie/animaux' },
  { image: '/categorieImage/Mixeur.png', name: 'Mixeur', link: '/categorie/bureau' },
  { image: '/categorieImage/trotinette.png', name: 'Trotinette', link: '/categorie/voyages' },
]

// État pour afficher tous les items ou seulement les premiers
const showAll = ref(false)
const isMobile = ref(false)

// Limite pour mobile : 4 lignes × 3 colonnes = 12 items
const mobileLimit = 12

// Items affichés selon l'état et la taille d'écran
const displayedItems = computed(() => {
  // Sur desktop, afficher tous les items
  if (!isMobile.value) {
    return items
  }
  
  // Sur mobile, limiter à 12 items (4 lignes) ou afficher tous si "Voir plus" cliqué
  return showAll.value ? items : items.slice(0, mobileLimit)
})

// Détection de la taille d'écran
const checkScreenSize = () => {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth < 768 // Breakpoint md: de Tailwind
  }
}

// Lifecycle
onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', checkScreenSize)
  }
})
</script>

<style scoped>
/* Les styles Tailwind CSS sont déjà appliqués directement dans le template */
</style>
