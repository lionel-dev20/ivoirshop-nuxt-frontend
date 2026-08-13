<!-- pages/marque/index.vue -->
<!-- Annuaire des marques : donne un contenu réel à /marque et un maillage
     interne vers chaque page /marque/[slug]. -->
<template>
  <div class="max-w-[1440px] mx-auto p-3 md:p-6">
    <nav class="text-xs text-gray-500 mb-3 flex flex-wrap items-center gap-1.5">
      <NuxtLink to="/" class="hover:text-[#ff9900] transition-colors">Accueil</NuxtLink>
      <span class="text-gray-300">/</span>
      <span class="text-gray-700">Marques</span>
    </nav>

    <div class="bg-white border border-gray-100 shadow-md shadow-gray-50 rounded-md p-4 md:p-5 mb-6">
      <h1 class="text-xl md:text-2xl font-extrabold text-gray-900">Toutes nos marques</h1>
      <p class="text-sm text-gray-500 mt-1">
        Retrouvez l’ensemble des marques disponibles chez IvoirShop.
      </p>
    </div>

    <!-- Chargement -->
    <div v-if="pending" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 animate-pulse">
      <div v-for="i in 15" :key="i" class="bg-white border border-gray-100 rounded-md h-28"></div>
    </div>

    <!-- Liste -->
    <div v-else-if="brands.length" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      <NuxtLink
        v-for="b in brands"
        :key="b.id"
        :to="`/marque/${b.slug}`"
        class="bg-white border border-gray-100 shadow-md shadow-gray-100 rounded-md p-3 flex flex-col items-center justify-center text-center hover:border-[#ff9900] hover:scale-[1.02] transition-all duration-200">
        <img
          v-if="logoFor(b)"
          :src="logoFor(b)!"
          :alt="b.name"
          loading="lazy"
          class="h-12 w-auto max-w-full object-contain bg-white mb-2" />
        <div v-else
          class="h-12 w-12 rounded-full bg-gray-100 text-gray-500 font-bold flex items-center justify-center mb-2">
          {{ b.name.charAt(0).toUpperCase() }}
        </div>
        <span class="text-sm font-semibold text-gray-800 truncate w-full">{{ b.name }}</span>
        <span class="text-xs text-gray-500">{{ b.count }} produit{{ b.count > 1 ? 's' : '' }}</span>
      </NuxtLink>
    </div>

    <!-- Vide -->
    <div v-else class="bg-white border border-gray-100 rounded-md p-10 text-center">
      <h2 class="text-base font-semibold text-gray-900">Aucune marque disponible</h2>
      <p class="text-sm text-gray-500 mt-1">Les marques n’ont pas pu être chargées pour le moment.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Brand {
  id: number
  name: string
  slug: string
  count: number
  image: string | null
}

const LOCAL_LOGOS: Record<string, string> = {
  leadder: '/marques/Leadder.png',
  ilux: '/marques/Ilux.png',
  roch: '/marques/Roch.png',
  'smart-technology': '/marques/Smart_.png',
  binatone: '/marques/Binatone.png',
  oraimo: '/marques/Oraimo.png',
  raf: '/marques/RAF.png',
  'silver-crest': '/marques/SiverCrest.png',
  nasco: '/marques/Nasco.png',
  tecno: '/marques/tecno.png',
  infinix: '/marques/Infinix.png',
  hp: '/marques/HP.png',
  lenovo: '/marques/Lenovo.png',
}

const { data, pending } = await useFetch<{ brands: Brand[] }>('/api/woocommerce/brands', {
  default: () => ({ brands: [] }),
})

// Les marques sans produit ne sont pas listées : leur page serait vide.
const brands = computed(() =>
  (data.value?.brands ?? [])
    .filter((b) => b.count > 0)
    .sort((a, b) => a.name.localeCompare(b.name, 'fr'))
)

const logoFor = (b: Brand) => b.image || LOCAL_LOGOS[b.slug] || null

useSeoMeta({
  title: 'Toutes nos marques | IvoirShop',
  description:
    'Parcourez toutes les marques disponibles chez IvoirShop : électroménager, téléphonie, informatique et plus encore.',
})
</script>
