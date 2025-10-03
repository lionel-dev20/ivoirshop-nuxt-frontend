// server/api/wordpress/menu-items.get.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  
  const { menuSlug = 'header-menu' } = query

  if (!config.WORDPRESS_URL) {
    throw createError({
      statusCode: 500,
      statusMessage: 'WORDPRESS_URL not configured'
    })
  }

  try {
    console.log(`Récupération des éléments de menu pour: ${menuSlug}`)
    
    // Essayer différentes approches pour récupérer le menu
    const approaches = [
      // Approche 1: API WordPress standard avec authentification
      {
        name: 'wp/v2/menu-items with auth',
        url: `${config.WORDPRESS_URL}/wp-json/wp/v2/menu-items?menu=${menuSlug}`,
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
            menu: menuSlug,
            consumer_key: config.WOOCOMMERCE_CONSUMER_KEY,
            consumer_secret: config.WOOCOMMERCE_CONSUMER_SECRET
          }
        }
      },
      // Approche 3: API WordPress sans authentification (si publique)
      {
        name: 'wp/v2/menu-items public',
        url: `${config.WORDPRESS_URL}/wp-json/wp/v2/menu-items?menu=${menuSlug}`,
        options: {}
      }
    ]

    for (const approach of approaches) {
      try {
        console.log(`Tentative: ${approach.name}`)
        
        const response = await $fetch(approach.url, approach.options)
        
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
            menuSlug,
            items: menuItems,
            total: menuItems.length
          }
        }
      } catch (error: any) {
        console.log(`Échec de ${approach.name}:`, error.message)
        continue
      }
    }

    // Si aucune approche ne fonctionne, retourner un menu de fallback
    console.warn(`Aucun menu trouvé pour ${menuSlug}, utilisation du menu de fallback`)
    return {
      success: false,
      menuSlug,
      items: getFallbackMenuItems(),
      total: 0,
      message: 'Menu non trouvé, utilisation du menu de fallback'
    }

  } catch (error: any) {
    console.error('Erreur lors de la récupération du menu:', error.message)
    
    return {
      success: false,
      menuSlug,
      items: getFallbackMenuItems(),
      total: 0,
      error: error.message
    }
  }
})

function getFallbackMenuItems() {
  return [
    {
      ID: 1,
      title: 'Accueil',
      url: '/',
      menu_item_parent: '0',
      children: []
    },
    {
      ID: 2,
      title: 'Nouveautés',
      url: '/categorie/nouveaute',
      menu_item_parent: '0',
      children: []
    },
    {
      ID: 3,
      title: 'Électronique',
      url: '/categorie/electronique',
      menu_item_parent: '0',
      children: []
    },
    {
      ID: 4,
      title: 'Électroménager',
      url: '/categorie/electromenager',
      menu_item_parent: '0',
      children: []
    },
    {
      ID: 5,
      title: 'Mode & Beauté',
      url: '/categorie/mode-beaute',
      menu_item_parent: '0',
      children: []
    }
  ]
}
