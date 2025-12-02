<template>
        <div class="flex-col w-64 rounded-lg flex items-center justify-between gap-y-4 overflow-hidden">
          <div class="bg-white py-3.5 border-1 border-gray-100 shadow-md shadow-gray-100 w-full h-full rounded-md flex flex-col">
           <div  v-for="(item, index) in avantsliste" :key="index" class="flex justify-start items-center gap-x-2">
            <NuxtLink to="/" class="object-cover h-full w-full rounded-md flex justify-start items-center gap-x-3 py-2 px-5">
              <div class=" border-amber-500 rounded-full p-2 border-2 bg-white">
               <img
              :src="item.image"
              alt="Publicité 1"
              loading="lazy"
              class="object-cover h-5 w-5" />
              </div>
              <div class="flex flex-col items-start gap-y-0.5">
                <h3 class="text-center text-[13px] font-semibold text-gray-800">{{ item.title }}</h3>
                <p class="text-center text-[12px] text-gray-600">{{ item.description }}</p>
              </div>
              </NuxtLink>
           </div>
          </div>
          <div class="h-full md:mt-3 w-full rounded-md flex items-center justify-center">
            <NuxtLink to="/" class="object-cover h-full w-full rounded-md">
            <img
              src="https://web.archive.org/web/20240216010846im_/https://www.ivoirshop.ci/wp-content/uploads/2023/10/IVS_ET_woofer-LEADDER.gif"
              alt="Publicité 1"
              loading="lazy"
              class="object-cover h-full w-full rounded-md shadow-gray-100" />
              </NuxtLink>
          </div>

        </div>
</template>

<script setup lang="ts">
const avantsliste = [
  {
    image: 'https://web.archive.org/web/20240216010846im_/https://www.ivoirshop.ci/wp-content/uploads/elementor/thumbs/package-qe9j2dlhr4ce1m402cmweq43vvum88hifemmcjbsti.png',
    title: 'Bienvenue chez vous',
    description: '+500 articles'
  },
  {
    image: 'https://web.archive.org/web/20240216010846im_/https://www.ivoirshop.ci/wp-content/uploads/2023/10/delivery.png',
    title: 'Livraison rapide',
    description: 'Entre 1 et 3jours'
  },
  {
    image: 'https://web.archive.org/web/20240216010846im_/https://www.ivoirshop.ci/wp-content/uploads/2023/10/asking.png',
    title: 'Service client',
    description: 'Disponible 7j/7'
  }
]
</script>

<style scoped>

</style>