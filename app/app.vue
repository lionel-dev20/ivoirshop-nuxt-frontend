<template>
  <div>
    <NuxtLayout >
  <NuxtLoadingIndicator />
  <NuxtPage />
  </NuxtLayout>
  </div>
</template>


<script setup lang="ts">
import {NuxtLoadingIndicator} from '#components'
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&family=Sora:wght@100..800&display=swap');
body {
  margin: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: "Sora", sans-serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
  font-size: 0.8rem;
  padding: 0;
  background: #ffe4e4 !important;
  min-height: 100vh;
}
</style>