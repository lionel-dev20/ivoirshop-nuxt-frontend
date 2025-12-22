// server/api/wordpress/menu-items.get.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  // 🔥 Utilisez directement le slug
  const menuSlug = 'menu-principal'

  try {
    
    const authHeader = Buffer.from(
      `${config.WOOCOMMERCE_CONSUMER_KEY}:${config.WOOCOMMERCE_CONSUMER_SECRET}`
    ).toString('base64')

    // 🔥 Utilisez l'endpoint BY SLUG directement
    const response = await $fetch(
      `${config.WORDPRESS_URL}/wp-json/ivoirshop/v1/menu-items/slug/${menuSlug}`,
      {
        headers: {
          'Authorization': `Basic ${authHeader}`
        }
      }
    )


    if (response && Array.isArray(response) && response.length > 0) {
      // Construire la hiérarchie
      const itemsMap = new Map()
      const rootItems: any[] = []

      response.forEach((item: any) => {
        itemsMap.set(item.ID.toString(), { ...item, children: [] })
      })

      response.forEach((item: any) => {
        const currentItem = itemsMap.get(item.ID.toString())
        if (item.menu_item_parent === '0' || !item.menu_item_parent) {
          rootItems.push(currentItem)
        } else {
          const parent = itemsMap.get(item.menu_item_parent.toString())
          if (parent) {
            parent.children.push(currentItem)
          }
        }
      })

      return {
        success: true,
        menuSlug,
        items: rootItems,
        total: rootItems.length
      }
    }

    return {
      success: false,
      items: [],
      total: 0
    }

  } catch (error: any) {
    return {
      success: false,
      items: [],
      error: error.message
    }
  }
})