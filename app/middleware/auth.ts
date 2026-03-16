export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isLoggedIn, fetchUser, user } = useAuth()

  // Si l'utilisateur n'est pas encore chargé, essayer de le récupérer
  if (!user.value) {
    await fetchUser()
  }

  if (!isLoggedIn.value) {
    return navigateTo('/auth/login')
  }
})
