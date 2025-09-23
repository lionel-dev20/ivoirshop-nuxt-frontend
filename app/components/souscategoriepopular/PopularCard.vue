<template>
    <div class="flex gap-x-4 ">
        <NuxtLink v-for="(item, index) in catPopular" :key="index" to="/"
            class="object-cover h-full w-full rounded-md flex flex-col justify-start items-center gap-x-2 py-5 px-6 bg-white border-1 border-gray-100 shadow-md shadow-gray-100 hover:scale-103 transition-transform duration-200">
            <NuxtImg :src="item.image" :alt="item.title" loading="lazy"
                class="object-cover block items-center justify-center w-28 h-28 rounded-md shadow-gray-100 w-" />
                <h3 class="mt-4 text-[15px] font-semibold">{{ item.title }}</h3>
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">
const catPopular = [
    {
        image: 'https://web.archive.org/web/20240216010848im_/https://www.ivoirshop.ci/wp-content/uploads/elementor/thumbs/XCM_CUTTLE_1369852_1914619_FR_300x300_2X_en_US-qfyb7fxor8suet33fpphb3loruopd583n61xb2kk1k.jpg',
        title: 'Idée cadeau Noël'
    },
    {
        image: 'https://web.archive.org/web/20240216010849im_/https://www.ivoirshop.ci/wp-content/uploads/2023/11/Untitled-1_07-copy.png',
        title: 'Vente Flash'
    },
    {
        image: 'https://web.archive.org/web/20240216010849im_/https://www.ivoirshop.ci/wp-content/uploads/2023/11/Untitled-1_031.png',
        title: 'Meilleures ventes'
    },
    {
        image: 'https://web.archive.org/web/20240216010849im_/https://www.ivoirshop.ci/wp-content/uploads/2023/11/mixeurs1.png',
        title: 'Mixeurs'
    },
    {
        image: 'https://web.archive.org/web/20240216010850im_/https://www.ivoirshop.ci/wp-content/uploads/2023/11/televisions.png',
        title: 'Télévisions'
    },
    {
        image: 'https://web.archive.org/web/20240216010849im_/https://www.ivoirshop.ci/wp-content/uploads/2023/11/audio.png',
        title: 'Home cinéma'
    }
]
</script>

<style scoped>

</style>