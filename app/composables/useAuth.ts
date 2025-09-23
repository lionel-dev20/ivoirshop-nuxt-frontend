import { ref, computed } from "vue";
import { useRouter } from "vue-router";

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthResponse {
  user: User;
  token?: string;
  meta?: any;
}

export const useAuth = () => {
  const router = useRouter();

  // état utilisateur
  const user = ref<User | null>(null);
  const isLoggedIn = computed(() => !!user.value);

  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Inscription / création de compte
   */
  const register = async (payload: { username: string; email: string; password: string }) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await $fetch<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: payload,
        credentials: "include", // cookie httpOnly
      });

      if (res.user) user.value = res.user;
      return res;
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || "Erreur lors de l'inscription";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Connexion
   */
  const signin = async (payload: { username: string; password: string }) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await $fetch<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: payload,
        credentials: "include",
      });

      if (res.user) user.value = res.user;
      return res;
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || "Erreur lors de la connexion";
      throw err;
    } finally {
      loading.value = false;
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

      user.value = res ?? null;
    } catch {
      user.value = null;
    }
  };

  /**
   * Déconnexion
   */
  const logout = async () => {
    try {
      await $fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } finally {
      user.value = null;
      router.push("/login");
    }
  };

  return {
    user,
    isLoggedIn,
    loading,
    error,
    register,
    signin,
    fetchUser,
    logout,
  };
};
