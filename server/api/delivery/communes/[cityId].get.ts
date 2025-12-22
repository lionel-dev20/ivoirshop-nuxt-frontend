export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const cityId = getRouterParam(event, 'cityId')
    
    if (!cityId) {
      throw createError({
        statusCode: 400,
        message: 'ID de ville requis'
      })
    }
    
    try {
      const response = await $fetch(
        `${config.public.wpUrl}/wp-json/ci-delivery/v1/communes/${cityId}`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      )
      
      return response
    } catch (error) {
      throw createError({
        statusCode: 500,
        message: 'Erreur lors du chargement des communes'
      })
    }
  })