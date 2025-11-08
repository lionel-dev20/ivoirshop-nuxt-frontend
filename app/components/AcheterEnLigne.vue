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
  { image: 'https://ci.jumia.is/cms/1_2025/W41/Freelink/Reduction.gif', name: 'Categorie de Noel', link: '/categorie/telephones' },
  { image: 'https://ci.jumia.is/cms/1_2025/W41/Freelink/Nouveaute.gif', name: 'Electromenager', link: '/categorie/electronique' },
  { image: 'https://ci.jumia.is/cms/1_2025/W41/Freelink/Bebe.png', name: 'Espace culturel', link: '/categorie/mode' },
  { image: 'https://ci.jumia.is/cms/1_2025/W41/Freelink/Informatique.png', name: 'Ma cave', link: '/categorie/maison' },
  { image: 'https://ci.jumia.is/cms/1_2025/W41/Freelink/Boutique.gif', name: 'Pharmacie', link: '/categorie/beaute' },
  { image: 'https://ci.jumia.is/cms/1_2025/W41/Freelink/Pourcentage.png', name: 'Maison', link: '/categorie/sports' },
  { image: 'https://ci.jumia.is/cms/1_2025/W41/Freelink/FBJ.png', name: 'Vetements & chaussure', link: '/categorie/aliments' },
  { image: 'https://ci.jumia.is/cms/1_2025/W41/Freelink/Beaute.png', name: 'Purecultures', link: '/categorie/livres' },
  { image: 'https://ci.jumia.is/cms/1_2025/W41/Freelink/Indispensables.png', name: 'Jouets', link: '/categorie/jouets' },
  { image: 'https://ci.jumia.is/cms/1_2025/W41/Freelink/Marche.png', name: 'Jardin', link: '/categorie/auto' },
  { image: 'https://ci.jumia.is/cms/1_2025/W41/Freelink/CI_W41_THUMBNAIL_HOME_PAGE_VIDE_GRNIER_livraison.png', name: 'Jardin', link: '/categorie/jardin' },
  { image: 'https://ci.jumia.is/cms/1_2025/W41/Freelink/JForce.gif', name: 'Auto-moto', link: '/categorie/musique' },
  { image: 'https://ci.jumia.is/cms/1_2025/W41/Freelink/Boutique.gif', name: 'Animalerie', link: '/categorie/bijoux' },
  { image: 'https://ci.jumia.is/cms/1_2025/W41/Freelink/Bebe.png', name: 'Bricolage', link: '/categorie/animaux' },
  { image: 'https://ci.jumia.is/cms/1_2025/W41/Freelink/Reduction.gif', name: 'Sport & loisirs', link: '/categorie/bureau' },
  { image: 'https://ci.jumia.is/cms/1_2025/W41/Freelink/Beaute.png', name: 'heigh-tech', link: '/categorie/voyages' },
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
