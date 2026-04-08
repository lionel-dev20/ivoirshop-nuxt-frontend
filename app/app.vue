<template>
  <div>
    <!-- <NuxtLayout>
      <NuxtLoadingIndicator />
      <NuxtPage />
    </NuxtLayout> -->
    <div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-3xl font-bold underline mb-4">Nous sommes en maintenance !</h1>
    <p class="text-lg">Nous sommes en train de faire des mises à jour sur le site. Veuillez réessayer plus tard.</p>
    <p class="text-lg">Merci pour votre patience.</p>
    <p class="text-base">Nous vous remercions de votre compréhension.</p>
    <p class="text-base">Nous vous remercions de votre compréhension.</p>
    </div>
  </div>
</template>


<script setup lang="ts">
import { NuxtLoadingIndicator } from '#components'
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
  min-height: 100vh;
}
</style>