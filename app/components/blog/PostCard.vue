<!-- components/blog/PostCard.vue -->
<!-- Carte verticale : image en haut, titre, extrait, métadonnées.
     Utilisée dans la grille "Derniers articles" et pour l'article principal
     de la section "À la une" (variante `large`). -->
<template>
  <article
    class="group bg-white border border-gray-100 rounded-md overflow-hidden shadow-sm shadow-slate-100 hover:shadow-md transition-shadow flex flex-col h-full"
  >
    <NuxtLink :to="postUrl(post)" class="block overflow-hidden bg-gray-100" :class="imageWrapperClass">
      <img
        v-if="post.image"
        :src="post.image"
        :alt="post.imageAlt"
        loading="lazy"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <span v-else class="w-full h-full flex items-center justify-center text-gray-300 text-sm">
        IvoirShop
      </span>
    </NuxtLink>

    <div class="flex flex-col flex-1 p-4">
      <NuxtLink :to="postUrl(post)">
        <h3
          class="font-bold text-gray-900 leading-snug group-hover:text-[#ff9900] transition-colors"
          :class="large ? 'text-xl md:text-2xl' : 'text-base md:text-lg'"
        >
          {{ post.title }}
        </h3>
      </NuxtLink>

      <p v-if="post.excerpt" class="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-2">
        {{ post.excerpt }}
      </p>

      <div class="mt-auto pt-4">
        <BlogPostMeta :post="post" />
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { BlogPost } from '~/composables/useBlog'

const props = withDefaults(defineProps<{ post: BlogPost; large?: boolean }>(), { large: false })

const { postUrl } = useBlog()

const imageWrapperClass = computed(() => (props.large ? 'h-56 md:h-72' : 'h-44 md:h-52'))
</script>
