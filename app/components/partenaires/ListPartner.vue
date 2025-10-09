<template>
    <div class="flex justify-between items-center gap-x-2">
        <!-- Left here baner -->
        <NuxtLink v-for="(item, index) in bannerAdsPartener" :key="index" to="/"
            class="object-cover md:min-h-[380px] md:min-w-[250px]  rounded-md flex justify-start items-center gap-x-2 bg-white py-1.5 px-1.5 border-1 border-gray-100 shadow-md shadow-gray-100">
            <img :src="item.image" alt="Publicité 1" loading="lazy"
                class="object-cover h-[380px] w-[250px] rounded-md" />
        </NuxtLink>


        <!-- Middle here partenaires -->
        <div>
            <h2
                class="block bg-white p-5 rounded-sm text-left font-extrabold text-lg mb-4 border-1 border-gray-100 shadow-md shadow-gray-100">
                Nos partenaires</h2>
            <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                <NuxtLink to="/" v-for="(item, index) in listParnerImg" :key="index"
                    class="object-cover h-full w-full rounded-md flex justify-start items-center gap-x-2 py-5 px-6 bg-white border-1 border-gray-100 shadow-md shadow-gray-100 hover:scale-103 transition-transform duration-200">
                    <img :src="item.image" :alt="item.title" loading="lazy"
                        class="object-cover block items-center justify-center rounded-md shadow-gray-100" />
                </NuxtLink>
            </div>
        </div>


        <!-- Right here baner -->
        <NuxtLink v-for="(item, index) in bannerAdsPartener" :key="index" to="/"
            class="object-cover md:min-h-[380px] md:min-w-[250px]  rounded-md flex justify-start items-center gap-x-3 bg-white py-1.5 px-1.5 border-1 border-gray-100 shadow-md shadow-gray-100">
            <img
                src="https://web.archive.org/web/20240216010846im_/https://www.ivoirshop.ci/wp-content/uploads/2023/11/Coupe-dafrique-2023.webp"
                alt="Publicité 1" loading="lazy" class="object-cover h-[380px] w-[250px] rounded-md" />
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">

const bannerAdsPartener = [
    {
        image: 'https://web.archive.org/web/20240216010846im_/https://www.ivoirshop.ci/wp-content/uploads/2023/11/Mascote_CAN_2023.png',
        title: 'Bienvenue chez vous'
    }
]
const listParnerImg = [
    {
        image: 'https://web.archive.org/web/20240216010855im_/https://www.ivoirshop.ci/wp-content/uploads/elementor/thumbs/Binatone-logo-qeqsxo5jid5tdcsltmaptnv0bz7xtclcbplbcpnh84.png',
        title: 'Partenaires IvoirShop Binatone'
    },
    {
        image: 'https://web.archive.org/web/20240216010856im_/https://www.ivoirshop.ci/wp-content/uploads/2023/10/bebe.gif',
        title: 'Partenaires IvoirShop Bebe tab'
    },
    {
        image: 'https://web.archive.org/web/20240216010856im_/https://www.ivoirshop.ci/wp-content/uploads/2023/10/Hemani.webp',
        title: 'Partenaires IvoirShop Hemani'
    },
    {
        image: 'https://web.archive.org/web/20240216010855im_/https://www.ivoirshop.ci/wp-content/uploads/2023/10/ilux.gif',
        title: 'Partenaires IvoirShop illux'
    },
    {
        image: 'https://web.archive.org/web/20240216010855im_/https://www.ivoirshop.ci/wp-content/uploads/2023/10/orailo.gif',
        title: 'Partenaires IvoirShop Oraimo'
    },
    {
        image: 'https://web.archive.org/web/20240216010856im_/https://www.ivoirshop.ci/wp-content/uploads/2023/10/hhp.jpg',
        title: 'Partenaires IvoirShop Hp'
    },
    {
        image: 'https://web.archive.org/web/20240216010856im_/https://www.ivoirshop.ci/wp-content/uploads/2023/10/Nacoo.jpg',
        title: 'Partenaires IvoirShop Nasco'
    },
    {
        image: 'https://web.archive.org/web/20240216010856im_/https://www.ivoirshop.ci/wp-content/uploads/2023/10/bose.webp',
        title: 'Partenaires IvoirShop bose'
    },
    {
        image: 'https://web.archive.org/web/20240216010856im_/https://www.ivoirshop.ci/wp-content/uploads/2023/10/tecni.gif',
        title: 'Partenaires IvoirShop Tecno'
    },
    {
        image: 'https://web.archive.org/web/20240216010855im_/https://www.ivoirshop.ci/wp-content/uploads/2023/10/smart.gif',
        title: 'Partenaires IvoirShop Smart'
    },
    {
        image: 'https://web.archive.org/web/20240216010901im_/https://www.ivoirshop.ci/wp-content/uploads/elementor/thumbs/ATTL-qequ2z67u9pfkgsmmh2ie8m83jmm2ikpc5ngkgensk.jpg',
        title: 'Partenaires IvoirShop Atl'
    },
    {
        image: 'https://web.archive.org/web/20240216010856im_/https://www.ivoirshop.ci/wp-content/uploads/2023/10/Will-baby.jpg',
        title: 'Partenaires IvoirShop Will baby'
    },
    {
        image: 'https://web.archive.org/web/20240216010856im_/https://www.ivoirshop.ci/wp-content/uploads/2023/10/east.gif',
        title: 'Partenaires IvoirShop east'
    },
    {
        image: 'https://web.archive.org/web/20240216010856im_/https://www.ivoirshop.ci/wp-content/uploads/elementor/thumbs/7d3d5bd02d518e098-qeqt9h0lbhbf53ngwpy34oncu51ugjg0m4gs9s5j3o.jpg',
        title: 'Partenaires IvoirShop Will baby'
    },
    {
        image: 'https://web.archive.org/web/20240216010856im_/https://www.ivoirshop.ci/wp-content/uploads/2023/10/FORE.jpg',
        title: 'Partenaires IvoirShop force'
    },
]
</script>

<style scoped></style>