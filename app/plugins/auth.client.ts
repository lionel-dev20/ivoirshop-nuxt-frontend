export default defineNuxtPlugin(async (nuxtApp) => {
  const { fetchUser, user } = useAuth()
  
  // Initialiser l'utilisateur au démarrage de l'application
  try {
    await fetchUser()
    
    if (user.value) {
    }
  } catch (error) {
    // Ne pas bloquer l'application si l'initialisation échoue
  }
})

