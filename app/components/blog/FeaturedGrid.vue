<!-- components/blog/FeaturedGrid.vue -->
<!-- Section "À la une" : un article principal, deux articles moyens, trois
     articles compacts. S'adapte automatiquement s'il y a moins de 6 articles
     épinglés (les colonnes vides disparaissent). -->
<template>
  <section v-if="posts.length">
    <BlogSectionTitle :title="title" />

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
      <!-- Article principal -->
      <div v-if="main" class="lg:col-span-5">
        <BlogPostCard :post="main" large />
      </div>

      <!-- Deux articles moyens -->
      <div v-if="middle.length" class="lg:col-span-4 space-y-6">
        <BlogPostCardHorizontal v-for="post in middle" :key="post.id" :post="post" />
      </div>

      <!-- Trois articles compacts -->
      <div v-if="side.length" class="lg:col-span-3 space-y-5 lg:border-l lg:border-gray-100 lg:pl-6">
        <BlogPostCardHorizontal v-for="post in side" :key="post.id" :post="post" compact />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { BlogPost } from '~/composables/useBlog'

const props = withDefaults(defineProps<{ posts: BlogPost[]; title?: string }>(), {
  title: 'À la une',
})

const main = computed(() => props.posts[0] ?? null)
const middle = computed(() => props.posts.slice(1, 3))
const side = computed(() => props.posts.slice(3, 6))
</script>
