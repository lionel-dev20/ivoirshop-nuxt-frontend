// server/utils/woocommerce.ts
// Utilitaire pour gérer l'import dynamique de WooCommerceRestApi

let WooCommerceRestApi: any = null

export async function getWooCommerceApi() {
  if (!WooCommerceRestApi) {
    try {
      const WooCommerceModule = await import('@woocommerce/woocommerce-rest-api')
      
      
      // Le module peut être exporté de différentes façons selon l'environnement
      // Priorité: .default > module lui-même
      if (WooCommerceModule.default) {
        WooCommerceRestApi = WooCommerceModule.default
        
        // Si .default est lui-même un objet avec default
        if (typeof WooCommerceRestApi === 'object' && WooCommerceRestApi.default) {
          WooCommerceRestApi = WooCommerceRestApi.default
        }
      } else {
        // Sinon, essayer le module lui-même
        WooCommerceRestApi = WooCommerceModule
      }
      
      // Vérification finale
      if (typeof WooCommerceRestApi !== 'function') {
        throw new Error(`Module importé mais n'est pas une fonction (type: ${typeof WooCommerceRestApi})`)
      }
    } catch (error: any) {
      throw new Error('Impossible d\'importer WooCommerceRestApi: ' + error.message)
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
  
  // Vérifier que WooCommerceClass est bien un constructeur
  if (typeof WooCommerceClass !== 'function') {
    throw new Error(`WooCommerceRestApi n'est pas un constructeur (type: ${typeof WooCommerceClass})`)
  }
  
  
  try {
    return new WooCommerceClass({
      url: config.url,
      consumerKey: config.consumerKey,
      consumerSecret: config.consumerSecret,
      version: config.version || 'wc/v3',
    })
  } catch (error: any) {
    throw error
  }
}




