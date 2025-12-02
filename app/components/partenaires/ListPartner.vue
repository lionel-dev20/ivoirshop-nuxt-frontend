<template>
    <div class="flex justify-between items-center gap-x-3">
        <!-- Left here baner -->
        <NuxtLink v-for="(item, index) in bannerAdsPartener" :key="index" to="https://ivoirshop.ci/recherche?q=ilux"
            class="hidden md:block object-cover md:min-h-[380px] md:min-w-[250px]  rounded-md justify-start items-center gap-x-2 bg-white py-1.5 px-1.5 border-1 border-gray-100 shadow-md shadow-gray-100">
            <img :src="item.image" alt="Publicité 1" loading="lazy"
                class="object-cover h-[380px] w-[250px] rounded-md" />
        </NuxtLink>


        <!-- Middle here partenaires -->
        <div>
            <h2
                class="block bg-white md:p-2.5 p-3 rounded-[4px] text-left font-extrabold text-lg md:text-xl mb-1.5 md:mb-4 border-1 border-gray-100 shadow-md shadow-gray-100">
                Nos partenaires</h2>
            <div class="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-5 md:gap-1.5 gap-1 h-full">
                <NuxtLink :to="item.link" v-for="(item, index) in listParnerImg" :key="index"
                    :class="{'hidden': index >= listParnerImg.length - 3 && screenWidth < 768}"
                    class="object-cover h-full w-full rounded-md flex justify-start items-center gap-x-0.5 md:gap-x-1 md:gap-y-1 md:py-0.5 py-0.5 px-0.5 md:px-0.5 bg-white border-1 border-gray-100 shadow-md shadow-gray-100 hover:scale-103 transition-transform duration-200">
                    <img :src="item.image" :alt="item.title" loading="lazy"
                        class="object-cover h-12 w-auto md:w-auto md:h-full block items-center justify-center rounded-md shadow-gray-100" />
                </NuxtLink>
            </div>
        </div>


        <!-- Right here baner -->
        <NuxtLink v-for="(item, index) in bannerAdsPartener" :key="index" to="https://ivoirshop.ci/recherche?q=leadder"
            class="hidden md:block object-cover md:min-h-[380px] md:min-w-[250px]  rounded-md flex justify-start items-center gap-x-3 bg-white py-1.5 px-1.5 border-1 border-gray-100 shadow-md shadow-gray-100">
            <img
                src="/images/partenaire_leadder.png"
                alt="Publicité 1" loading="lazy" class="object-cover h-[380px] w-[250px] rounded-md" />
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">

const bannerAdsPartener = [
    {
        image: '/images/partenaireilux.png',
        title: 'Bienvenue chez vous'
    }
]
const listParnerImg = [
    {
        image: '/marques/Leadder.png',
        title: 'Leadder',
        link: 'https://ivoirshop.ci/recherche?q=leadder'
    },
    {
        image: '/marques/Ilux.png',
        title: 'Ilux',
        link: 'https://ivoirshop.ci/recherche?q=ilux'
    },
    {
        image: '/marques/Roch.png',
        title: 'Roch',
        link: 'https://ivoirshop.ci/recherche?q=roch'
    },
    {
        image: '/marques/Smart_.png',
        title: 'Smart',
        link: 'https://ivoirshop.ci/recherche?q=smart'
    },
    {
        image: '/marques/Binatone.png',
        title: 'Binatone',
        link: 'https://ivoirshop.ci/recherche?q=binatone'
    },
    {
        image: '/marques/Oraimo.png',
        title: 'Oraimo',
        link: 'https://ivoirshop.ci/recherche?q=oraimo'
    },
    {
        image: '/marques/RAF.png',
        title: 'RAF',
        link: 'https://ivoirshop.ci/recherche?q=raf'
    },
    {
        image: '/marques/Wildbaby.png',
        title: 'Wildbaby',
        link: 'https://ivoirshop.ci/recherche?q=wildbaby'
    },
    {
        image: '/marques/SiverCrest.png',
        title: 'SiverCrest',
        link: 'https://ivoirshop.ci/recherche?q=sivercrest'
    },
    {
        image: '/marques/Nasco.png',
        title: 'Nasco',
        link: 'https://ivoirshop.ci/recherche?q=nasco'
    },
    {
        image: '/marques/tecno.png',
        title: 'tecno',
        link: 'https://ivoirshop.ci/recherche?q=tecno'
    },
    {
        image: '/marques/Infinix.png',
        title: 'Infinix',
        link: 'https://ivoirshop.ci/recherche?q=infinix'
    },
    {
        image: '/marques/HP.png',
        title: 'HP',
        link: 'https://ivoirshop.ci/recherche?q=hp'
    },
    {
        image: '/marques/Lenovo.png',
        title: 'Lenovo',
        link: 'https://ivoirshop.ci/recherche?q=lenovo'
    },
    {
        image: '/marques/Iphone.png',
        title: 'Iphone',
        link: 'https://ivoirshop.ci/recherche?q=iphone'
    },
]

const screenWidth = ref(0);

const isLargeScreen = computed(() => screenWidth.value >= 768);

onMounted(() => {
  screenWidth.value = window.innerWidth;
  window.addEventListener('resize', () => {
    screenWidth.value = window.innerWidth;
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', () => {
    screenWidth.value = window.innerWidth;
  });
});
</script>

<style scoped></style>