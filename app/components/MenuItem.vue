<template>
  <li>
    <a :href="item.url">{{ item.title }}</a>
    <ul v-if="item.children && item.children.length">
      <MenuItem v-for="child in item.children" :key="child.ID" :item="child" />
    </ul>
  </li>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

defineProps<{
  item: {
    ID: number
    title: string
    url: string
    children?: Array<any>
  }
}>()
</script>

<style scoped>
ul {
  list-style: none;
  padding-left: 15px;
}
li {
  margin: 5px 0;
}
a {
  text-decoration: none;
  color: #333;
}
</style>
