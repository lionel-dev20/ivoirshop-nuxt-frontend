// server/utils/woocommerce.ts
// Utilitaire pour gérer l'import dynamique de WooCommerceRestApi

let WooCommerceRestApi: any = null

export async function getWooCommerceApi() {
  if (!WooCommerceRestApi) {
    try {
      const WooCommerceModule = await import('@woocommerce/woocommerce-rest-api')
      WooCommerceRestApi = WooCommerceModule.default
    } catch (error) {
      console.error('Erreur lors de l\'import de WooCommerceRestApi:', error)
      throw new Error('Impossible d\'importer WooCommerceRestApi')
    }
  }
  return WooCommerceRestApi
}

export async function createWooCommerceClient(config: {
  url: string
  consumerKey: string
  consumerSecret: string
  version?: string
}) {
  const WooCommerceClass = await getWooCommerceApi()
  return new WooCommerceClass({
    url: config.url,
    consumerKey: config.consumerKey,
    consumerSecret: config.consumerSecret,
    version: config.version || 'wc/v3',
  })
}




