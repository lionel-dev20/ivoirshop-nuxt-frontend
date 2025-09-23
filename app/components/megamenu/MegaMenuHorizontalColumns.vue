<template>
  <nav class="relative flex">
    <!-- Niveau 1 -->
    <ul
      ref="parentMenu"
      class="flex flex-col w-64 bg-white border-1 border-slate-100 text-gray-800 md:px-3 md:py-4 rounded-sm shadow-md shadow-gray-50"
    >
      <li v-for="item in navigation" :key="item.ID" class="relative group">
        <NuxtLink :href="item.url" class="block px-3.5 py-[5.3px] z-50 transition-colors duration-200">
          {{ item.title }}
        </NuxtLink>

        <!-- Niveau 2 → Colonnes -->
        <div
          v-if="item.children && item.children.length"
          class="absolute md:min-w-[1190px] rounded-tr-lg rounded-br-lg md:ml-2.5 bottom-0 top-0 left-full hidden group-hover:flex bg-white shadow-md shadow-gray-50 z-30 transition-all duration-200"
          :style="{ '--menu-height': parentHeight + 'px', minHeight: 'var(--menu-height)' }"
        >
          <div class="flex flex-row gap-4 p-4">
            <div v-for="child in item.children" :key="child.ID" class="flex flex-col min-w-[220px]">
              <a
                :href="child.url"
                class="font-bold px-2 py-1 hover:bg-gray-50 transition-colors duration-200"
              >
                {{ child.title }}
              </a>

              <ul v-if="child.children && child.children.length" class="mt-2 flex flex-col space-y-1">
                <li v-for="sub in child.children" :key="sub.ID">
                  <a
                    :href="sub.url"
                    class="block px-2 py-1 hover:bg-gray-50 hover:font-medium transition-colors duration-200 whitespace-nowrap"
                  >
                    {{ sub.title }}
                  </a>

                  <ul v-if="sub.children && sub.children.length" class="ml-2 mt-1 flex flex-col space-y-1">
                    <MegaMenuSubItem v-for="sub2 in sub.children" :key="sub2.ID" :item="sub2" />
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const { data: navigation } = await useFetch('http://ivoir-shop.local/wp-json/wp/v2/menu-principal')

const parentMenu = ref<HTMLElement | null>(null)
const parentHeight = ref(0)

onMounted(() => {
  if (parentMenu.value) {
    // Mesure dynamique du premier bloc parent
    parentHeight.value = parentMenu.value.offsetHeight
  }
})
</script>
