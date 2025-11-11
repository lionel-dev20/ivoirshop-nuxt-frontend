// server/api/wordpress/menu.get.ts
export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  
  if (!config.WORDPRESS_URL) {
    console.warn('WORDPRESS_URL non défini, utilisation du menu de fallback')
    return getFallbackMenu()
  }

  try {
    console.log('Tentative de récupération du menu depuis WordPress...')
    
    // Essayer l'endpoint menu-items en premier, car il est conçu pour la hiérarchie
    try {
      const menuResponse = await $fetch('/api/wordpress/menu-items', {
        params: { menuId: 160 }
      })

      if (menuResponse && menuResponse.success && menuResponse.items?.length > 0) {
        console.log(`Menu WordPress trouvé via menu-items: ${menuResponse.items.length} éléments`)
        return buildMenuHierarchy(menuResponse.items)
      }
    } catch (menuItemsError) {
      console.log('Endpoint menu-items non disponible ou vide:', menuItemsError.message)
    }

    // Puis, les catégories WooCommerce (qui ont une structure hiérarchique définie dans buildMenuFromCategories)
    console.log('Tentative avec les catégories WooCommerce...')
    try {
      const categories = await $fetch(`${config.WORDPRESS_URL}/wp-json/wc/v3/products/categories`, {
        params: {
          per_page: 100, // Augmenté de 20 à 100
          orderby: 'count',
          order: 'desc',
          hide_empty: true,
          consumer_key: config.WOOCOMMERCE_CONSUMER_KEY,
          consumer_secret: config.WOOCOMMERCE_CONSUMER_SECRET
        }
      })

      if (categories && Array.isArray(categories) && categories.length > 0) {
        console.log(`Menu créé à partir de ${categories.length} catégories WooCommerce`)
        return buildMenuFromCategories(categories)
      }
    } catch (wcCategoriesError) {
      console.log('Endpoint catégories WooCommerce non disponible:', wcCategoriesError.message)
    }

    // Enfin, les catégories personnalisées (qui créent un menu plat) comme dernier recours
    try {
      const categories = await $fetch(`${config.WORDPRESS_URL}/wp-json/custom/v1/categories`)
      
      if (categories && Array.isArray(categories) && categories.length > 0) {
        console.log(`Menu créé à partir de ${categories.length} catégories personnalisées`)
        return buildMenuFromCustomCategories(categories)
      }
    } catch (customCategoriesError) {
      console.log('Endpoint catégories personnalisées non disponible:', customCategoriesError.message)
    }

  } catch (error: any) {
    console.error('Erreur lors de la récupération du menu:', error.message)
  }

  console.warn('Aucun menu WordPress trouvé, utilisation du menu de fallback')
  return getFallbackMenu()
})

function buildMenuHierarchy(items: any[]) {
  const itemsMap: Record<number, any> = {}
  const rootItems: any[] = []

  // Créer la map des items
  items.forEach(item => {
    itemsMap[item.ID] = { 
      ID: item.ID,
      title: item.title?.rendered || item.title,
      url: item.url,
      children: [] 
    }
  })

  // Construire la hiérarchie
  items.forEach(item => {
    const parentId = item.menu_item_parent || item.parent
    if (parentId && parentId !== '0' && parentId !== 0 && itemsMap[parentId]) {
      itemsMap[parentId].children.push(itemsMap[item.ID])
    } else {
      rootItems.push(itemsMap[item.ID])
    }
  })

  return rootItems
}

function buildMenuFromCustomCategories(categories: any[]) {
  // Utiliser directement les catégories personnalisées
  const menuItems = categories.map(category => ({
    ID: category.id,
    title: category.name,
    url: `/categorie/${category.slug}`,
    children: []
  }))

  // Ajouter des éléments de menu supplémentaires
  // const additionalItems = [
  //   {
  //     ID: 999,
  //     title: 'Accueil',
  //     url: '/',
  //     children: []
  //   },
  //   {
  //     ID: 998,
  //     title: 'Nouveautés',
  //     url: '/categorie/nouveaute',
  //     children: []
  //   },
  //   {
  //     ID: 997,
  //     title: 'Meilleurs Deals',
  //     url: '/categorie/meilleurs-deals',
  //     children: []
  //   }
  // ]

  return [...additionalItems, ...menuItems]
}

function buildMenuFromCategories(categories: any[]) {
  // Créer un menu hiérarchique avec des sous-catégories
  // const menuItems = [
  //   {
  //     ID: 1,
  //     title: 'Électronique',
  //     url: '/categorie/electronique',
  //     children: [
  //       {
  //         ID: 11,
  //         title: 'Téléphones & Tablettes',
  //         url: '/categorie/telephones-tablettes',
  //         children: [
  //           { ID: 111, title: 'Smartphones', url: '/categorie/smartphones' },
  //           { ID: 112, title: 'Tablettes', url: '/categorie/tablettes' },
  //           { ID: 113, title: 'Accessoires', url: '/categorie/accessoires-telephones' }
  //         ]
  //       },
  //       {
  //         ID: 12,
  //         title: 'Informatique',
  //         url: '/categorie/informatique',
  //         children: [
  //           { ID: 121, title: 'Ordinateurs', url: '/categorie/ordinateurs' },
  //           { ID: 122, title: 'Périphériques', url: '/categorie/peripheriques' },
  //           { ID: 123, title: 'Gaming', url: '/categorie/gaming' }
  //         ]
  //       },
  //       {
  //         ID: 13,
  //         title: 'Audio & Vidéo',
  //         url: '/categorie/audio-video',
  //         children: [
  //           { ID: 131, title: 'Écouteurs', url: '/categorie/ecouteurs' },
  //           { ID: 132, title: 'Haut-parleurs', url: '/categorie/haut-parleurs' },
  //           { ID: 133, title: 'TV & Moniteurs', url: '/categorie/tv-moniteurs' }
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     ID: 2,
  //     title: 'Électroménager',
  //     url: '/categorie/electromenager',
  //     children: [
  //       {
  //         ID: 21,
  //         title: 'Gros Électroménager',
  //         url: '/categorie/gros-electromenager',
  //         children: [
  //           { ID: 211, title: 'Réfrigérateurs', url: '/categorie/refrigerateurs' },
  //           { ID: 212, title: 'Lave-linge', url: '/categorie/lave-linge' },
  //           { ID: 213, title: 'Cuisinières', url: '/categorie/cuisinieres' }
  //         ]
  //       },
  //       {
  //         ID: 22,
  //         title: 'Petit Électroménager',
  //         url: '/categorie/petit-electromenager',
  //         children: [
  //           { ID: 221, title: 'Cafetières', url: '/categorie/cafetieres' },
  //           { ID: 222, title: 'Mixeurs', url: '/categorie/mixeurs' },
  //           { ID: 223, title: 'Aspirateurs', url: '/categorie/aspirateurs' }
  //         ]
  //       },
  //       {
  //         ID: 23,
  //         title: 'Climatisation',
  //         url: '/categorie/climatisation',
  //         children: [
  //           { ID: 231, title: 'Climatiseurs', url: '/categorie/climatiseurs' },
  //           { ID: 232, title: 'Ventilateurs', url: '/categorie/ventilateurs' },
  //           { ID: 233, title: 'Chauffage', url: '/categorie/chauffage' }
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     ID: 3,
  //     title: 'Mode & Beauté',
  //     url: '/categorie/mode-beaute',
  //     children: [
  //       {
  //         ID: 31,
  //         title: 'Vêtements',
  //         url: '/categorie/vetements',
  //         children: [
  //           { ID: 311, title: 'Homme', url: '/categorie/vetements-homme' },
  //           { ID: 312, title: 'Femme', url: '/categorie/vetements-femme' },
  //           { ID: 313, title: 'Enfant', url: '/categorie/vetements-enfant' }
  //         ]
  //       },
  //       {
  //         ID: 32,
  //         title: 'Beauté',
  //         url: '/categorie/beaute',
  //         children: [
  //           { ID: 321, title: 'Cosmétiques', url: '/categorie/cosmetiques' },
  //           { ID: 322, title: 'Parfums', url: '/categorie/parfums' },
  //           { ID: 323, title: 'Soins', url: '/categorie/soins' }
  //         ]
  //       },
  //       {
  //         ID: 33,
  //         title: 'Accessoires',
  //         url: '/categorie/accessoires-mode',
  //         children: [
  //           { ID: 331, title: 'Sacs', url: '/categorie/sacs' },
  //           { ID: 332, title: 'Montres', url: '/categorie/montres' },
  //           { ID: 333, title: 'Bijoux', url: '/categorie/bijoux' }
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     ID: 4,
  //     title: 'Maison & Jardin',
  //     url: '/categorie/maison-jardin',
  //     children: [
  //       {
  //         ID: 41,
  //         title: 'Décoration',
  //         url: '/categorie/decoration',
  //         children: [
  //           { ID: 411, title: 'Tableaux', url: '/categorie/tableaux' },
  //           { ID: 412, title: 'Vases', url: '/categorie/vases' },
  //           { ID: 413, title: 'Éclairage', url: '/categorie/eclairage' }
  //         ]
  //       },
  //       {
  //         ID: 42,
  //         title: 'Cuisine',
  //         url: '/categorie/cuisine',
  //         children: [
  //           { ID: 421, title: 'Ustensiles', url: '/categorie/ustensiles' },
  //           { ID: 422, title: 'Vaisselle', url: '/categorie/vaisselle' },
  //           { ID: 423, title: 'Électroménager', url: '/categorie/electromenager-cuisine' }
  //         ]
  //       },
  //       {
  //         ID: 43,
  //         title: 'Jardin',
  //         url: '/categorie/jardin',
  //         children: [
  //           { ID: 431, title: 'Outils', url: '/categorie/outils-jardin' },
  //           { ID: 432, title: 'Plantes', url: '/categorie/plantes' },
  //           { ID: 433, title: 'Mobilier', url: '/categorie/mobilier-jardin' }
  //         ]
  //       }
  //     ]
  //   }
  // ]

  // Ajouter des éléments de menu supplémentaires
  // const additionalItems = [
  //   {
  //     ID: 999,
  //     title: 'Accueil',
  //     url: '/',
  //     children: []
  //   },
  //   {
  //     ID: 998,
  //     title: 'Nouveautés',
  //     url: '/categorie/nouveaute',
  //     children: []
  //   },
  //   {
  //     ID: 997,
  //     title: 'Meilleurs Deals',
  //     url: '/categorie/meilleurs-deals',
  //     children: []
  //   }
  // ]

  return [...additionalItems, ...menuItems]
}

function getFallbackMenu() {
  return [
    // {
    //   ID: 1,
    //   title: 'Accueil',
    //   url: '/',
    //   children: []
    // },
    // {
    //   ID: 2,
    //   title: 'Catégories',
    //   url: '/categorie',
    //   children: []
    // },
    // {
    //   ID: 3,
    //   title: 'Recherche',
    //   url: '/recherche',
    //   children: []
    // }
  ]
}
