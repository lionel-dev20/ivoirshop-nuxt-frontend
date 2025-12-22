export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    
    try {
      const response = await $fetch(`${config.public.wpUrl}/wp-json/ci-delivery/v1/cities`, {
        headers: {
          'Accept': 'application/json'
        }
      })
      
      return response
    } catch (error) {
      throw createError({
        statusCode: 500,
        message: 'Erreur lors du chargement des villes'
      })
    }
  })