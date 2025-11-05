// server/api/wordpress/menu-items.get.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  
  // Extraire menuId ou menuSlug, avec un fallback pour menuSlug
  const { menuId, menuSlug: fallbackMenuSlug = 'nav-menus' } = query
  
  // Déterminer le paramètre à utiliser dans l'URL de l'API WordPress
  // Si menuId est présent, l'utiliser. Sinon, utiliser le fallbackMenuSlug
  const targetMenuParam = menuId ? `&menu=${menuId}` : `?menu=${fallbackMenuSlug}`
  // Identifiant pour les logs et les retours
  const targetMenuIdentifier = menuId || fallbackMenuSlug

  if (!config.WORDPRESS_URL) {
    throw createError({
      statusCode: 500,
      statusMessage: 'WORDPRESS_URL not configured'
    })
  }

  try {
    console.log(`Récupération des éléments de menu pour: ${targetMenuIdentifier}`)
    
    // Essayer différentes approches pour récupérer le menu
    const approaches = [
      // Approche 1: API WordPress standard avec authentification
      {
        name: 'wp/v2/menu-items with auth',
        url: `${config.WORDPRESS_URL}/wp-json/wp/v2/menu-items${targetMenuParam}`,
        options: {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${config.WOOCOMMERCE_CONSUMER_KEY}:${config.WOOCOMMERCE_CONSUMER_SECRET}`).toString('base64')}`
          }
        }
      },
      // Approche 2: API WordPress avec paramètres d'authentification
      {
        name: 'wp/v2/menu-items with params',
        url: `${config.WORDPRESS_URL}/wp-json/wp/v2/menu-items`,
        options: {
          params: {
            menu: targetMenuIdentifier, // Utilise l'ID ou le slug
            consumer_key: config.WOOCOMMERCE_CONSUMER_KEY,
            consumer_secret: config.WOOCOMMERCE_CONSUMER_SECRET
          }
        }
      },
      // Approche 3: API WordPress sans authentification (si publique)
      {
        name: 'wp/v2/menu-items public',
        url: `${config.WORDPRESS_URL}/wp-json/wp/v2/menu-items${targetMenuParam}`,
        options: {}
      }
    ]

    for (const approach of approaches) {
      try {
        console.log(`Tentative: ${approach.name}`)
        
        const response = await $fetch(approach.url, approach.options)
        console.log(`Réponse brute de l'API WordPress pour ${approach.name}:`, JSON.stringify(response, null, 2))
        
        if (response && Array.isArray(response) && response.length > 0) {
          console.log(`Menu trouvé avec ${approach.name}: ${response.length} éléments`)
          
          // Transformer les éléments de menu
          const menuItems = response.map(item => ({
            ID: item.id,
            title: item.title?.rendered || item.title,
            url: item.url,
            menu_item_parent: item.menu_item_parent || item.parent,
            children: []
          }))

          return {
            success: true,
            menuSlug: targetMenuIdentifier, // Retourne l'identifiant réellement utilisé
            items: menuItems,
            total: menuItems.length
          }
        }
      } catch (error: any) {
        console.log(`Échec de ${approach.name}:`, error.message)
        continue
      }
    }

    // Si aucune approche ne fonctionne, retourner un objet vide pour signifier l'échec
    console.warn(`Aucun menu trouvé pour ${targetMenuIdentifier}, le menu sera vide.`)
    return {
      success: false,
      menuSlug: targetMenuIdentifier, // Retourne l'identifiant réellement utilisé
      items: [], // Retourne un tableau vide au lieu du menu de fallback
      total: 0,
      message: 'Menu non trouvé, le menu est vide.'
    }

  } catch (error: any) {
    console.error('Erreur lors de la récupération du menu:', error.message)
    
    return {
      success: false,
      menuSlug: targetMenuIdentifier, // Retourne l'identifiant réellement utilisé
      items: [], // Retourne un tableau vide au lieu du menu de fallback
      total: 0,
      error: error.message
    }
  }
})

function getFallbackMenuItems() {
 
}
