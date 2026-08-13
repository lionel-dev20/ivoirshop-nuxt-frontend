<template>
    <div class="flex justify-between items-center gap-x-3">
        <!-- Left here baner -->
        <NuxtLink :to="leftBanner.link"
            class="hidden md:block object-cover md:min-h-[380px] md:min-w-[250px]  rounded-md justify-start items-center gap-x-2 bg-white py-1.5 px-1.5 border-1 border-gray-100 shadow-md shadow-gray-100">
            <img :src="leftBanner.image" alt="Publicité 1" loading="lazy"
                class="object-cover h-[380px] w-[250px] rounded-md" />
        </NuxtLink>


        <!-- Middle here partenaires -->
        <div class="w-full">
            <h2
                class="block bg-white md:p-4 p-3 rounded-[4px] text-left font-extrabold text-lg md:text-xl mb-1.5 md:mb-4 border-1 border-gray-100 shadow-md shadow-gray-100">
                {{ partnersTitle }}</h2>
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
        <NuxtLink :to="rightBanner.link"
            class="hidden md:block object-cover md:min-h-[380px] md:min-w-[250px]  rounded-md flex justify-start items-center gap-x-3 bg-white py-1.5 px-1.5 border-1 border-gray-100 shadow-md shadow-gray-100">
            <img
                :src="rightBanner.image"
                alt="Publicité 1" loading="lazy" class="object-cover h-[380px] w-[250px] rounded-md" />
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">

// Valeurs par défaut = contenu historique (repli si WordPress indisponible).
//
// Les liens pointent vers les pages de marque /marque/<slug>, où <slug> est le
// slug de la taxonomie « marques » de WooCommerce — pas le nom affiché ici :
// « Smart » correspond à smart-technology et « SiverCrest » à silver-crest.
// Wildbaby et Iphone n'existent pas encore comme marques dans WooCommerce :
// ils restent sur la recherche tant qu'ils n'y sont pas créés.
const DEFAULT_LEFT_BANNER = { image: '/images/partenaireilux.png', link: '/marque/ilux' }
const DEFAULT_RIGHT_BANNER = { image: '/images/partenaire_leadder.png', link: '/marque/leadder' }
const DEFAULT_LOGOS = [
    {
        image: '/marques/Leadder.png',
        title: 'Leadder',
        link: '/marque/leadder'
    },
    {
        image: '/marques/Ilux.png',
        title: 'Ilux',
        link: '/marque/ilux'
    },
    {
        image: '/marques/Roch.png',
        title: 'Roch',
        link: '/marque/roch'
    },
    {
        image: '/marques/Smart_.png',
        title: 'Smart',
        link: '/marque/smart-technology'
    },
    {
        image: '/marques/Binatone.png',
        title: 'Binatone',
        link: '/marque/binatone'
    },
    {
        image: '/marques/Oraimo.png',
        title: 'Oraimo',
        link: '/marque/oraimo'
    },
    {
        image: '/marques/RAF.png',
        title: 'RAF',
        link: '/marque/raf'
    },
    {
        image: '/marques/Wildbaby.png',
        title: 'Wildbaby',
        link: '/recherche?q=wildbaby'
    },
    {
        image: '/marques/SiverCrest.png',
        title: 'SiverCrest',
        link: '/marque/silver-crest'
    },
    {
        image: '/marques/Nasco.png',
        title: 'Nasco',
        link: '/marque/nasco'
    },
    {
        image: '/marques/tecno.png',
        title: 'tecno',
        link: '/marque/tecno'
    },
    {
        image: '/marques/Infinix.png',
        title: 'Infinix',
        link: '/marque/infinix'
    },
    {
        image: '/marques/HP.png',
        title: 'HP',
        link: '/marque/hp'
    },
    {
        image: '/marques/Lenovo.png',
        title: 'Lenovo',
        link: '/marque/lenovo'
    },
    {
        image: '/marques/Iphone.png',
        title: 'Iphone',
        link: '/recherche?q=iphone'
    },
]

// Contenu piloté par WordPress (repli sur les valeurs par défaut).
const { section } = useHomepageConfig()
const partnersTitle = computed(() => section('partners', 'title', 'Nos partenaires'))
const leftBanner = computed(() => section('partners', 'leftBanner', DEFAULT_LEFT_BANNER))
const rightBanner = computed(() => section('partners', 'rightBanner', DEFAULT_RIGHT_BANNER))
const listParnerImg = computed(() => section('partners', 'logos', DEFAULT_LOGOS))

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