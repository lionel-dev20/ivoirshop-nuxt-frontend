export default defineNuxtRouteMiddleware((to, from) => {
  // Vérifier si l'utilisateur est connecté
  const { isLoggedIn } = useAuth()
  
  if (!isLoggedIn.value) {
    return navigateTo('/auth/login')
  }
})

