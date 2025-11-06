// server/utils/woocommerce.ts
// Utilitaire pour gérer l'import dynamique de WooCommerceRestApi

let WooCommerceRestApi: any = null

export async function getWooCommerceApi() {
  if (!WooCommerceRestApi) {
    try {
      console.log('📦 Import du module @woocommerce/woocommerce-rest-api...')
      const WooCommerceModule = await import('@woocommerce/woocommerce-rest-api')
      
      console.log('📦 Module importé, type:', typeof WooCommerceModule)
      console.log('📦 Module.default type:', typeof WooCommerceModule.default)
      console.log('📦 Clés du module:', Object.keys(WooCommerceModule))
      
      // Le module peut être exporté de différentes façons selon l'environnement
      // Priorité: .default > module lui-même
      if (WooCommerceModule.default) {
        WooCommerceRestApi = WooCommerceModule.default
        
        // Si .default est lui-même un objet avec default
        if (typeof WooCommerceRestApi === 'object' && WooCommerceRestApi.default) {
          console.log('📦 Double default détecté')
          WooCommerceRestApi = WooCommerceRestApi.default
        }
      } else {
        // Sinon, essayer le module lui-même
        WooCommerceRestApi = WooCommerceModule
      }
      
      console.log('✅ WooCommerceRestApi final:', {
        type: typeof WooCommerceRestApi,
        isFunction: typeof WooCommerceRestApi === 'function',
        isConstructor: typeof WooCommerceRestApi === 'function' && WooCommerceRestApi.prototype !== undefined
      })
      
      // Vérification finale
      if (typeof WooCommerceRestApi !== 'function') {
        throw new Error(`Module importé mais n'est pas une fonction (type: ${typeof WooCommerceRestApi})`)
      }
    } catch (error: any) {
      console.error('❌ Erreur lors de l\'import de WooCommerceRestApi:', error.message)
      console.error('Stack:', error.stack)
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
    console.error('❌ WooCommerceClass n\'est pas une fonction:', typeof WooCommerceClass)
    console.error('Valeur:', WooCommerceClass)
    throw new Error(`WooCommerceRestApi n'est pas un constructeur (type: ${typeof WooCommerceClass})`)
  }
  
  console.log('🔧 Création client WooCommerce pour:', config.url)
  
  try {
    return new WooCommerceClass({
      url: config.url,
      consumerKey: config.consumerKey,
      consumerSecret: config.consumerSecret,
      version: config.version || 'wc/v3',
    })
  } catch (error: any) {
    console.error('❌ Erreur lors de la création du client WooCommerce:', error.message)
    throw error
  }
}




