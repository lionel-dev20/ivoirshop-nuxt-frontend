import { defineEventHandler } from 'h3'
import { createWooCommerceClient } from '../../utils/woocommerce'

export default defineEventHandler(async (event) => {
  try {

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

    
    // Test 1: Récupérer les informations du site
    const { data: systemStatus } = await api.get('system_status')

    // Test 2: Lister les clients (limité à 1)
    const { data: customers } = await api.get('customers', { per_page: 1 })

    // Test 3: Créer un client de test
    const testCustomer = {
      email: 'test-' + Date.now() + '@example.com',
      first_name: 'Test',
      last_name: 'User',
      username: 'testuser' + Date.now(),
      password: 'testpass123'
    }

    const { data: newCustomer } = await api.post('customers', testCustomer)

    // Nettoyer: supprimer le client de test
    await api.delete(`customers/${newCustomer.id}`, { force: true })

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





























