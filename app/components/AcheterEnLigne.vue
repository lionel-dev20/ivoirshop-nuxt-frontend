<template>
  <div class="p-2.5 md:p-8 bg-white rounded-[4px]">
    <h2 class="text-xl font-bold text-gray-800 mb-4">Acheter en Ligne</h2>
    <div
      class="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-1 md:gap-2 border-t border-l border-gray-200"
    >
      <NuxtLink
        v-for="(item, index) in items"
        :key="index"
        :to="item.link"
        class="flex flex-col items-center justify-center p-2 md:p-1 text-center border-r border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <img :src="item.image" :alt="item.name" class="w-auto h-24 md:w-16 md:h-16 object-contain mb-2" width="24" height="24" />
        <span class="text-xs md:text-sm font-medium text-gray-700">{{ item.name }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
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
];
</script>

<style scoped>
/* Les styles Tailwind CSS sont déjà appliqués directement dans le template */
</style>
