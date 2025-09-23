// server/api/debug/connection.ts - Test de connexion
import { defineEventHandler } from 'h3'
import axios from 'axios'
import https from 'https'

export default defineEventHandler(async (event) => {
  console.log('=== DIAGNOSTIC CONNEXION ===')
  
  const results = {
    env_vars: {
      WC_STORE_URL: !!process.env.WC_STORE_URL,
      WC_STORE_URL_value: process.env.WC_STORE_URL,
      CONSUMER_KEY: !!process.env.WOOCOMMERCE_CONSUMER_KEY,
      CONSUMER_KEY_length: process.env.WOOCOMMERCE_CONSUMER_KEY?.length || 0,
      CONSUMER_SECRET: !!process.env.WOOCOMMERCE_CONSUMER_SECRET,
      CONSUMER_SECRET_length: process.env.WOOCOMMERCE_CONSUMER_SECRET?.length || 0
    },
    tests: {}
  }

  if (!process.env.WC_STORE_URL) {
    return { error: 'WC_STORE_URL manquant', results }
  }

  const httpsAgent = new https.Agent({ rejectUnauthorized: false })
  const axiosConfig = {
    timeout: 10000,
    headers: { 'User-Agent': 'Nuxt-Diagnostic/1.0' },
    params: {
      consumer_key: process.env.WOOCOMMERCE_CONSUMER_KEY,
      consumer_secret: process.env.WOOCOMMERCE_CONSUMER_SECRET
    },
    ...(process.env.WC_STORE_URL.startsWith('http://') ? {} : { httpsAgent })
  }

  // Test 1: WordPress de base
  try {
    console.log('Test 1: WordPress API...')
    const wpResponse = await axios.get(`${process.env.WC_STORE_URL}/wp-json/`, {
      timeout: 5000,
      ...(process.env.WC_STORE_URL.startsWith('http://') ? {} : { httpsAgent })
    })
    results.tests.wordpress = { success: true, namespaces: wpResponse.data.namespaces }
    console.log('✅ WordPress OK')
  } catch (error: any) {
    results.tests.wordpress = { success: false, error: error.message, code: error.code }
    console.log('❌ WordPress KO:', error.message)
  }

  // Test 2: WooCommerce API
  try {
    console.log('Test 2: WooCommerce API...')
    const wcResponse = await axios.get(`${process.env.WC_STORE_URL}/wp-json/wc/v3/`, axiosConfig)
    results.tests.woocommerce_api = { success: true }
    console.log('✅ WooCommerce API OK')
  } catch (error: any) {
    results.tests.woocommerce_api = { 
      success: false, 
      error: error.message, 
      status: error.response?.status,
      data: error.response?.data
    }
    console.log('❌ WooCommerce API KO:', error.message)
  }

  // Test 3: Produits (si API OK)
  if (results.tests.woocommerce_api?.success) {
    try {
      console.log('Test 3: Liste des produits...')
      const productsResponse = await axios.get(`${process.env.WC_STORE_URL}/wp-json/wc/v3/products?per_page=1`, axiosConfig)
      results.tests.products = { 
        success: true, 
        count: productsResponse.data.length,
        first_product: productsResponse.data[0] ? {
          id: productsResponse.data[0].id,
          name: productsResponse.data[0].name,
          status: productsResponse.data[0].status
        } : null
      }
      console.log('✅ Produits OK')
    } catch (error: any) {
      results.tests.products = { success: false, error: error.message }
      console.log('❌ Produits KO:', error.message)
    }
  }

  // Test 4: Commande test minimale (si produits OK)
  if (results.tests.products?.success && results.tests.products.first_product) {
    try {
      console.log('Test 4: Commande test...')
      const orderData = {
        status: 'pending',
        billing: {
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com'
        },
        line_items: [{
          product_id: results.tests.products.first_product.id,
          quantity: 1
        }]
      }

      const orderResponse = await axios.post(`${process.env.WC_STORE_URL}/wp-json/wc/v3/orders`, orderData, axiosConfig)
      results.tests.order_creation = { 
        success: true, 
        order_id: orderResponse.data.id,
        order_number: orderResponse.data.number
      }
      console.log('✅ Commande test OK')
      
      // Suppression de la commande test
      try {
        await axios.delete(`${process.env.WC_STORE_URL}/wp-json/wc/v3/orders/${orderResponse.data.id}?force=true`, axiosConfig)
        console.log('✅ Commande test supprimée')
      } catch (e) {
        console.log('⚠️ Impossible de supprimer la commande test')
      }
      
    } catch (error: any) {
      results.tests.order_creation = { 
        success: false, 
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      }
      console.log('❌ Commande test KO:', error.message)
    }
  }

  console.log('=== FIN DIAGNOSTIC ===')
  return results
})