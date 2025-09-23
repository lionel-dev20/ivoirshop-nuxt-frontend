<template>
    <div>
      <a v-for="item in navigation" :key="item.name" :href="item.href" :aria-current="item.href === current ? 'page' : undefined">{{ item.name }}</a>
    </div>
</template>
<script setup>
const route = useRoute()
// Replace 'http://localhost:3000' with your frontend location
const current = 'http://localhost:3000' + route.fullPath
// IMPORTANT
// If your frontend is http then use http
// in your useFetch endpoint
// If it is https then use https 
// Replace 'http://wp.websitegoblin.com' with your backend location
const { data: navigation, pending, error, refresh } = await useFetch('http://wp.websitegoblin.com/wp-json/wp/v2/menu-principal');
</script>