<template>
    <div class="md:min-h-screen flex md:items-center mx-auto my-10 md:my-0  px-3 md:px-0 justify-center bg-gray-50">
      <div class="w-full max-w-md bg-white p-8 rounded shadow">
    <h1 class="text-2xl font-bold mb-6 text-center">Créer un compte</h1>

    <form @submit.prevent="handleRegister" class="space-y-4">
      <!-- Nom complet -->
      <div>
        <label class="block text-sm font-medium mb-1">Nom complet</label>
        <input
          v-model="form.name"
          type="text"
          class="w-full border rounded-md px-3 py-2"
          placeholder="John Doe"
        />
        <p v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</p>
      </div>

      <!-- Email -->
      <div>
        <label class="block text-sm font-medium mb-1">Email</label>
        <input
          v-model="form.email"
          type="email"
          class="w-full border rounded-md px-3 py-2"
          placeholder="exemple@mail.com"
        />
        <p v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</p>
      </div>

      <!-- Mot de passe -->
      <div>
        <label class="block text-sm font-medium mb-1">Mot de passe</label>
        <input
          v-model="form.password"
          type="password"
          class="w-full border rounded-sm px-3 py-2"
          placeholder="********"
        />
        <p v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</p>
      </div>

      <!-- Bouton -->
      <button
        type="submit"
        class="w-full bg-[#ff9900] text-white py-3 rounded-sm hover:bg-[#ff9900]/80 transition"
        :disabled="loading"
      >
        {{ loading ? "Inscription en cours..." : "S’inscrire" }}
      </button>

      <p v-if="errorMessage" class="text-red-500 text-center mt-3">{{ errorMessage }}</p>
    </form>
  </div>
</div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useAuth } from '@/composables/useAuth'

const { register } = useAuth()

const form = reactive({
  name: "",
  email: "",
  password: "",
});

const errors = reactive<{ name?: string; email?: string; password?: string }>({});
const loading = ref(false);
const errorMessage = ref("");

// Validation simple
const validate = () => {
  errors.name = !form.name ? "Le nom est requis" : "";
  errors.email = !form.email ? "L'email est requis" : "";
  errors.password = form.password.length < 6 ? "6 caractères minimum" : "";
  return !errors.name && !errors.email && !errors.password;
};

const handleRegister = async () => {
  if (!validate()) return;

  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await register({
      username: form.name,
      email: form.email,
      password: form.password,
    });

    if (response && response.success) {
      // Redirection vers la page de connexion après inscription
      alert('Inscription réussie ! Vous pouvez maintenant vous connecter.')
      await navigateTo("/auth/login");
    } else {
      errorMessage.value = response?.error || "Erreur lors de l'inscription";
    }
  } catch (err: any) {
    errorMessage.value = err.message || "Erreur lors de l'inscription";
    console.error('Erreur inscription:', err)
  } finally {
    loading.value = false;
  }
};
</script>
