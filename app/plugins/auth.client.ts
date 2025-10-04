export default defineNuxtPlugin(async () => {
  const { fetchUser } = useAuth()
  
  // Initialiser l'utilisateur au démarrage de l'application
  await fetchUser()
})

