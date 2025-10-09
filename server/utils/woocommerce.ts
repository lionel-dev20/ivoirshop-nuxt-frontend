// server/utils/woocommerce.ts
// Utilitaire pour gérer l'import de WooCommerceRestApi

export async function createWooCommerceClient(config: {
  url: string
  consumerKey: string
  consumerSecret: string
  version?: string
}) {
  try {
    console.log('🔧 Création client WooCommerce...')
    
    // Import dynamique avec la bonne structure
    const WooCommerceModule = await import('@woocommerce/woocommerce-rest-api')
    
    // Le constructeur est dans WooCommerceModule.default.default
    const WooCommerceRestApi = WooCommerceModule.default.default || WooCommerceModule.default
    
    console.log('Type constructeur:', typeof WooCommerceRestApi)
    
    if (typeof WooCommerceRestApi !== 'function') {
      console.error('Structure du module:', WooCommerceModule)
      throw new Error(`WooCommerceRestApi n'est pas un constructeur (type: ${typeof WooCommerceRestApi})`)
    }
    
    const api = new WooCommerceRestApi({
      url: config.url,
      consumerKey: config.consumerKey,
      consumerSecret: config.consumerSecret,
      version: config.version || 'wc/v3',
    })
    
    console.log('✅ Client WooCommerce créé')
    return api
  } catch (error) {
    console.error('Erreur lors de la création du client WooCommerce:', error)
    throw new Error(`Impossible de créer le client WooCommerce: ${error.message}`)
  }
}




