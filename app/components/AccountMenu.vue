<!-- components/AccountMenu.vue -->
<template>
  <div class="relative group">
    <!-- Bouton compte -->
    <button
      class="relative p-2 text-gray-400 cursor-pointer hover:text-gray-500 transition-colors"
      @click="toggleMenu"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </button>

    <!-- Menu dropdown -->
    <div
      v-if="isMenuOpen"
      class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
      @click.stop
    >
      <!-- Utilisateur connecté -->
      <div v-if="isAuthenticated" class="px-4 py-2 border-b border-gray-100">
        <p class="text-sm font-medium text-gray-900">{{ user?.first_name || 'Utilisateur' }}</p>
        <p class="text-xs text-gray-500">{{ user?.email }}</p>
      </div>

      <!-- Menu items -->
      <div class="py-1">
        <!-- Non connecté -->
        <template v-if="!isAuthenticated">
          <NuxtLink
            to="/auth/login"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            @click="closeMenu"
          >
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Se connecter
            </div>
          </NuxtLink>
          <NuxtLink
            to="/auth/signup"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            @click="closeMenu"
          >
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              S'inscrire
            </div>
          </NuxtLink>
        </template>

        <!-- Connecté -->
        <template v-else>
          <NuxtLink
            to="/auth/profil"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            @click="closeMenu"
          >
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Mon profil
            </div>
          </NuxtLink>
          <NuxtLink
            to="/mes-commandes"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            @click="closeMenu"
          >
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Mes commandes
            </div>
          </NuxtLink>
          <button
            @click="handleLogout"
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Se déconnecter
            </div>
          </button>
        </template>
      </div>
    </div>

    <!-- Overlay pour fermer le menu -->
    <div
      v-if="isMenuOpen"
      class="fixed inset-0 z-40"
      @click="closeMenu"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isMenuOpen = ref(false)
const { isAuthenticated, user, logout } = useAuth()

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const handleLogout = async () => {
  try {
    await logout()
    closeMenu()
    await navigateTo('/')
  } catch (error) {
  }
}

// Fermer le menu avec Escape
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

