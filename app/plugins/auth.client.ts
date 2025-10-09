export default defineNuxtPlugin(async (nuxtApp) => {
  const { fetchUser, user } = useAuth()
  
  // Initialiser l'utilisateur au démarrage de l'application
  try {
    await fetchUser()
    
    if (user.value) {
      console.log('✅ Utilisateur connecté:', user.value.username)
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de l\'authentification:', error)
    // Ne pas bloquer l'application si l'initialisation échoue
  }
})

