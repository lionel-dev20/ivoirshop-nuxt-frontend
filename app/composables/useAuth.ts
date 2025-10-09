import { ref, computed } from "vue";
import type { Ref, ComputedRef } from "vue";

interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

interface AuthResponse {
  user: User;
  success?: boolean;
  token?: string;
  meta?: any;
}

// État global partagé entre toutes les instances du composable
const globalUser = ref<User | null>(null);
const globalLoading = ref(false);
const globalError = ref<string | null>(null);

export const useAuth = () => {
  const isLoggedIn = computed(() => !!globalUser.value);
  const isAuthenticated = computed(() => !!globalUser.value);

  /**
   * Inscription / création de compte
   */
  const register = async (payload: { username: string; email: string; password: string }) => {
    globalLoading.value = true;
    globalError.value = null;

    try {
      const res = await $fetch<any>("/api/auth/register", {
        method: "POST",
        body: payload,
        credentials: "include", // cookie httpOnly
      });

      if (res.success && res.user) {
        globalUser.value = res.user;
      }
      
      return res;
    } catch (err: any) {
      const errorMsg = err?.data?.message || err?.message || "Erreur lors de l'inscription";
      globalError.value = errorMsg;
      console.error("Erreur inscription:", err);
      throw new Error(errorMsg);
    } finally {
      globalLoading.value = false;
    }
  };

  /**
   * Connexion
   */
  const signin = async (payload: { username: string; password: string }) => {
    globalLoading.value = true;
    globalError.value = null;

    try {
      const res = await $fetch<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: payload,
        credentials: "include",
      });

      if (res.user) {
        globalUser.value = res.user;
      }
      
      return res;
    } catch (err: any) {
      const errorMsg = err?.data?.message || err?.message || "Identifiants incorrects";
      globalError.value = errorMsg;
      console.error("Erreur connexion:", err);
      throw new Error(errorMsg);
    } finally {
      globalLoading.value = false;
    }
  };

  /**
   * Récupérer l'utilisateur connecté depuis le cookie httpOnly
   */
  const fetchUser = async () => {
    try {
      const res = await $fetch<User | null>("/api/auth/me", {
        credentials: "include",
      });

      globalUser.value = res ?? null;
      return res;
    } catch (err) {
      console.error("Erreur récupération utilisateur:", err);
      globalUser.value = null;
      return null;
    }
  };

  /**
   * Déconnexion
   */
  const logout = async () => {
    try {
      await $fetch("/api/auth/logout", { 
        method: "POST", 
        credentials: "include" 
      });
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
    } finally {
      globalUser.value = null;
      globalError.value = null;
      
      // Rediriger vers la page d'accueil
      if (process.client) {
        await navigateTo('/');
      }
    }
  };

  return {
    user: globalUser as Ref<User | null>,
    isLoggedIn,
    isAuthenticated,
    loading: globalLoading as Ref<boolean>,
    error: globalError as Ref<string | null>,
    register,
    signin,
    fetchUser,
    logout,
  };
};
