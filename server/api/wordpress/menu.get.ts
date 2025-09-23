// server/api/wordpress/menu.get.ts
export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const MENU_SLUG = 'nav-menus' // remplacer par le slug exact de ton menu WordPress

  if (!config.WORDPRESS_URL) {
    throw new Error('Veuillez définir WORDPRESS_URL dans .env')
  }

  try {
    // Appel à l'API REST WP
    const res = await $fetch(`${config.WORDPRESS_URL}/wp-json/menus/v1/menus/${MENU_SLUG}`) as { items?: any[] }

    if (!res.items || res.items.length === 0) {
      return { error: true, message: 'Menu introuvable ou vide', items: [] }
    }

    // Créer un menu hiérarchique
    const itemsMap: Record<number, any> = {}
    const rootItems: any[] = []

    res.items.forEach(item => {
      itemsMap[item.ID] = { ...item, children: [] }
    })

    res.items.forEach(item => {
      if (item.menu_item_parent && item.menu_item_parent !== '0') {
        itemsMap[item.menu_item_parent]?.children.push(itemsMap[item.ID])
      } else {
        rootItems.push(itemsMap[item.ID])
      }
    })

    return rootItems

  } catch (error: any) {
    console.error('Erreur récupération menu:', error)
    return { error: true, message: error.message || 'Erreur serveur', items: [] }
  }
})
