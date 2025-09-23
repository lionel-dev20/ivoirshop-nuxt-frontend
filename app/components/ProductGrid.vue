<template>
  <div class="w-full">
    <div
      class="grid gap-4 sm:gap-6 
             grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
    >
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductCard from './ProductCard.vue'


interface Product {
  id: number
  name: string
  slug: string
  thumbnail: string
  regularPrice: number
  salePrice?: number
  isNew?: boolean
}

const props = defineProps<{
  products: Product[]
}>()
</script>
