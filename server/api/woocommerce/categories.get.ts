export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const MENU_NAME = 'main-menu' // Remplace par ton slug exact

  if (!config.WORDPRESS_URL) throw new Error('Veuillez définir WORDPRESS_URL dans .env')

  try {
    const res = await $fetch(`${config.WORDPRESS_URL}/wp-json/menus/v1/menus/${MENU_NAME}`)
    
    type MenuItem = {
      id: number;
      title: string;
      url: string;
      children: MenuItem[];
    };

    const buildTree = (items: any[], parentId = 0): MenuItem[] =>
      items
        .filter(item => item.menu_item_parent == parentId)
        .map((item: any): MenuItem => ({
          id: item.ID,
          title: item.title,
          url: item.url,
          children: buildTree(items, item.ID)
        }))

    return buildTree(res.items || [])
  } catch (err: any) {
    throw createError({ statusCode: 500, statusMessage: err.message || 'Erreur WordPress' })
  }
})
