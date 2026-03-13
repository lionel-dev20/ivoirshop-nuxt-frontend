<template>
  <div class="min-h-screen flex items-start justify-center bg-gray-50 px-4 pt-[12vh] pb-8">
    <div class="w-full max-w-md">
        <!-- Mobile Logo -->
        <div class="lg:hidden text-center mb-8">
          <div class="w-14 h-14 bg-[#ff9900] rounded-sm flex items-center justify-center mx-auto mb-3">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900">IvoirShop</h1>
        </div>

        <!-- Form Card -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900 text-center">Connexion</h2>
            <p class="text-gray-500 mt-2 text-center">Connectez-vous à votre compte pour continuer</p>
          </div>

          <form @submit.prevent="login" class="space-y-5">
            <!-- Switcher Téléphone / Email -->
            <div class="flex bg-gray-100 rounded-md p-1">
              <button
                type="button"
                @click.prevent="switchMode('phone')"
                :class="[
                  'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-sm text-sm font-semibold transition-all cursor-pointer',
                  loginMode === 'phone'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                ]"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Téléphone
              </button>
              <button
                type="button"
                @click.prevent="switchMode('email')"
                :class="[
                  'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-sm text-sm font-semibold transition-all cursor-pointer',
                  loginMode === 'email'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                ]"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                E-mail
              </button>
            </div>

            <!-- Phone Field -->
            <div v-show="loginMode === 'phone'">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Numéro de tel</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  v-model="phone"
                  type="tel"
                  placeholder="+225 XX XX XX XX XX"
                  :class="[
                    'w-full pl-11 pr-4 py-3 border rounded-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all',
                    fieldErrors.phone
                      ? 'border-[#ff9900] focus:ring-[#ff9900]/20 focus:border-[#ff9900]'
                      : 'border-gray-200 focus:ring-[#ff9900]/20 focus:border-[#ff9900]'
                  ]"
                  @input="fieldErrors.phone = ''"
                />
              </div>
              <p v-if="fieldErrors.phone" class="text-sm text-[#ff9900] mt-1.5">{{ fieldErrors.phone }}</p>
            </div>

            <!-- Email Field -->
            <div v-show="loginMode === 'email'">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Adresse e-mail</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  v-model="email"
                  type="email"
                  placeholder="exemple@email.com"
                  :class="[
                    'w-full pl-11 pr-4 py-3 border rounded-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all',
                    fieldErrors.email
                      ? 'border-[#ff9900] focus:ring-[#ff9900]/20 focus:border-[#ff9900]'
                      : 'border-gray-200 focus:ring-[#ff9900]/20 focus:border-[#ff9900]'
                  ]"
                  @input="fieldErrors.email = ''"
                />
              </div>
              <p v-if="fieldErrors.email" class="text-sm text-[#ff9900] mt-1.5">{{ fieldErrors.email }}</p>
            </div>

            <!-- Password -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="block text-sm font-semibold text-gray-700">Mot de passe</label>
                <a href="#" class="text-sm text-[#ff9900] hover:text-[#e68a00] font-medium transition-colors">
                  Mot de passe oublié ?
                </a>
              </div>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Entrez votre mot de passe"
                  :class="[
                    'w-full pl-11 pr-12 py-3 border rounded-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all',
                    fieldErrors.password
                      ? 'border-[#ff9900] focus:ring-[#ff9900]/20 focus:border-[#ff9900]'
                      : 'border-gray-200 focus:ring-[#ff9900]/20 focus:border-[#ff9900]'
                  ]"
                  @input="fieldErrors.password = ''"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
              <p v-if="fieldErrors.password" class="text-sm text-[#ff9900] mt-1.5">{{ fieldErrors.password }}</p>
            </div>

            <!-- Error Message (API errors) -->
            <p v-if="localError || error" class="text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-lg">
              {{ localError || error }}
            </p>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-[#ff9900] cursor-pointer text-white py-3.5 rounded-sm font-semibold text-base hover:bg-[#e68a00] focus:outline-none focus:ring-2 focus:ring-[#ff9900]/50 focus:ring-offset-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg v-if="loading" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ loading ? 'Connexion en cours...' : 'Se connecter' }}</span>
            </button>
          </form>

          <!-- Divider -->
          <!-- <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-white text-gray-400">ou</span>
            </div>
          </div> -->

          <!-- Social Login -->
          <!-- <div class="space-y-3">
            <button
              type="button"
              class="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continuer avec Google
            </button>

            <button
              type="button"
              class="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all"
            >
              <svg class="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Continuer avec Facebook
            </button>
          </div> -->
        </div>

        <!-- Sign up link -->
        <p class="text-center mt-6 text-gray-500">
          Pas encore de compte ?
          <NuxtLink to="/auth/signup" class="text-[#ff9900] hover:text-[#e68a00] font-semibold transition-colors">
            Créer un compte
          </NuxtLink>
        </p>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { signin, loading, error } = useAuth()

const loginMode = ref<'email' | 'phone'>('phone')
const email = ref('')
const phone = ref('')
const password = ref('')
const localError = ref('')
const showPassword = ref(false)
const fieldErrors = reactive<{ phone: string; email: string; password: string }>({
  phone: '',
  email: '',
  password: ''
})

const switchMode = (mode: 'email' | 'phone') => {
  loginMode.value = mode
  localError.value = ''
  fieldErrors.phone = ''
  fieldErrors.email = ''
  fieldErrors.password = ''
}

const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
const isValidPhone = (val: string) => /^\+?[0-9\s\-]{8,}$/.test(val.trim())

const login = async () => {
  localError.value = ''
  fieldErrors.phone = ''
  fieldErrors.email = ''
  fieldErrors.password = ''

  let hasError = false

  if (loginMode.value === 'phone') {
    if (!phone.value.trim()) {
      fieldErrors.phone = 'Vous n\'avez pas renseigné un numéro de téléphone'
      hasError = true
    } else if (!isValidPhone(phone.value)) {
      fieldErrors.phone = 'Veuillez entrer un numéro de téléphone valide'
      hasError = true
    }
  } else {
    if (!email.value.trim()) {
      fieldErrors.email = 'Vous n\'avez pas renseigné une adresse e-mail'
      hasError = true
    } else if (!isValidEmail(email.value)) {
      fieldErrors.email = 'Veuillez entrer une adresse e-mail valide'
      hasError = true
    }
  }

  if (!password.value) {
    fieldErrors.password = 'Vous n\'avez pas renseigné le mot de passe'
    hasError = true
  }

  if (hasError) return

  const identifier = loginMode.value === 'email' ? email.value : phone.value

  try {
    const result = await signin({
      username: identifier,
      password: password.value
    })

    if (result && result.user) {
      await navigateTo('/auth/profil')
    }
  } catch (err: any) {
    localError.value = err.message || error.value || 'Erreur lors de la connexion'
  }
}
</script>
