import { defineEventHandler } from 'h3'
import { createWooCommerceClient } from '../../utils/woocommerce'

export default defineEventHandler(async (event) => {
  try {
    console.log('🔍 Test connexion WooCommerce...')
    console.log('WORDPRESS_URL:', process.env.WORDPRESS_URL)
    console.log('WOOCOMMERCE_CONSUMER_KEY:', process.env.WOOCOMMERCE_CONSUMER_KEY ? '✅ Présent' : '❌ Manquant')
    console.log('WOOCOMMERCE_CONSUMER_SECRET:', process.env.WOOCOMMERCE_CONSUMER_SECRET ? '✅ Présent' : '❌ Manquant')

    if (!process.env.WORDPRESS_URL || !process.env.WOOCOMMERCE_CONSUMER_KEY || !process.env.WOOCOMMERCE_CONSUMER_SECRET) {
      return {
        success: false,
        error: 'Variables d\'environnement manquantes',
        env: {
          WORDPRESS_URL: process.env.WORDPRESS_URL || 'MANQUANT',
          WOOCOMMERCE_CONSUMER_KEY: process.env.WOOCOMMERCE_CONSUMER_KEY ? 'PRÉSENT' : 'MANQUANT',
          WOOCOMMERCE_CONSUMER_SECRET: process.env.WOOCOMMERCE_CONSUMER_SECRET ? 'PRÉSENT' : 'MANQUANT'
        }
      }
    }

    // Test de connexion WooCommerce
    const api = await createWooCommerceClient({
      url: process.env.WORDPRESS_URL,
      consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY,
      consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET,
      version: 'wc/v3',
    })

    console.log('📡 Test API WooCommerce...')
    
    // Test 1: Récupérer les informations du site
    const { data: systemStatus } = await api.get('system_status')
    console.log('✅ System Status récupéré')

    // Test 2: Lister les clients (limité à 1)
    const { data: customers } = await api.get('customers', { per_page: 1 })
    console.log('✅ Clients récupérés:', customers.length)

    // Test 3: Créer un client de test
    const testCustomer = {
      email: 'test-' + Date.now() + '@example.com',
      first_name: 'Test',
      last_name: 'User',
      username: 'testuser' + Date.now(),
      password: 'testpass123'
    }

    console.log('🧪 Test création client...')
    const { data: newCustomer } = await api.post('customers', testCustomer)
    console.log('✅ Client créé avec ID:', newCustomer.id)

    // Nettoyer: supprimer le client de test
    await api.delete(`customers/${newCustomer.id}`, { force: true })
    console.log('🧹 Client de test supprimé')

    return {
      success: true,
      message: 'Connexion WooCommerce réussie !',
      tests: {
        systemStatus: systemStatus ? '✅ OK' : '❌ Échec',
        customersList: customers ? '✅ OK' : '❌ Échec',
        createCustomer: newCustomer ? '✅ OK' : '❌ Échec'
      },
      env: {
        WORDPRESS_URL: process.env.WORDPRESS_URL,
        WOOCOMMERCE_CONSUMER_KEY: process.env.WOOCOMMERCE_CONSUMER_KEY ? 'PRÉSENT' : 'MANQUANT',
        WOOCOMMERCE_CONSUMER_SECRET: process.env.WOOCOMMERCE_CONSUMER_SECRET ? 'PRÉSENT' : 'MANQUANT'
      }
    }

  } catch (err: any) {
    console.error('❌ Erreur test WooCommerce:', err)
    
    return {
      success: false,
      error: err.message || 'Erreur inconnue',
      details: {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data
      },
      env: {
        WORDPRESS_URL: process.env.WORDPRESS_URL || 'MANQUANT',
        WOOCOMMERCE_CONSUMER_KEY: process.env.WOOCOMMERCE_CONSUMER_KEY ? 'PRÉSENT' : 'MANQUANT',
        WOOCOMMERCE_CONSUMER_SECRET: process.env.WOOCOMMERCE_CONSUMER_SECRET ? 'PRÉSENT' : 'MANQUANT'
      }
    }
  }
})









