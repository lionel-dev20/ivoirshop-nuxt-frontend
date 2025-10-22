// server/api/orders/create.ts - Version corrigée avec authentification par endpoint personnalisé
import { defineEventHandler, readBody, createError } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    console.log('=== CRÉATION COMMANDE ===')
    console.log('Customer:', body.customer)
    console.log('Items:', body.items?.map((item: any) => ({ id: item.id, name: item.name, quantity: item.quantity })))

    // Validation simple
    if (!body.customer || !body.items || body.items.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Données manquantes'
      })
    }

    if (!process.env.WC_STORE_URL) {
      throw createError({
        statusCode: 500,
        statusMessage: 'WC_STORE_URL manquant'
      })
    }

    // Préparation des données de commande avec structure billing et shipping WooCommerce
    const orderData = {
      customer: {
        firstName: body.customer.firstName || '',
        lastName: body.customer.lastName || '',
        email: body.customer.email || '',
        phone: body.customer.phone || '',
        notes: body.customer.notes || ''
      },
      billing: {
        first_name: body.customer.firstName || '',
        last_name: body.customer.lastName || '',
        email: body.customer.email || '',
        phone: body.customer.phone || '',
        address_1: body.billing?.address_1 || '',
        city: body.billing?.city || '',
        state: '',
        postcode: '',
        country: 'CI'
      },
      shipping: {
        first_name: body.billing?.first_name || body.customer.firstName || '',
        last_name: body.billing?.last_name || body.customer.lastName || '',
        email: body.billing?.email || body.customer.email || '',
        phone: body.billing?.phone || body.customer.phone || '',
        address_1: body.billing?.address_1 || '',
        city: body.billing?.city || '',
        state: '',
        postcode: '',
        country: 'CI'
      },
      items: body.items.map((item: any) => ({
        product_id: parseInt(item.id),
        quantity: parseInt(item.quantity),
        name: item.name,
        price: item.sale_price || item.price
      })),
      shipping_cost: parseFloat(body.shipping_cost || '0'),
      total: parseFloat(body.total || '0'),
      payment_method: body.payment_method || 'cod',
      delivery_info: body.delivery_info || {},
      coupon: body.coupon || null
    }

    console.log('Données préparées:', JSON.stringify(orderData, null, 2))

    // Configuration axios (même que vos autres APIs qui fonctionnent)
    const axiosConfig = {
      timeout: 15000,
      headers: {
        'User-Agent': 'Nuxt-WooCommerce-Client/1.0',
        'Content-Type': 'application/json'
      }
    }

    console.log('URL:', `${process.env.WC_STORE_URL}/wp-json/custom/v1/create-order`)

    // Utilisation de l'endpoint personnalisé au lieu de l'API WooCommerce standard
    const response = await axios.post(
      `${process.env.WC_STORE_URL}/wp-json/custom/v1/create-order`,
      orderData,
      axiosConfig
    )

    console.log('✅ Commande créée:', response.data)

    return {
      success: true,
      order_id: response.data.order_id,
      order_number: response.data.order_number,
      order_status: response.data.order_status || 'pending',
      total: response.data.total,
      message: response.data.message || 'Commande créée avec succès'
    }

  } catch (err: any) {
    console.error('❌ ERREUR COMMANDE:')
    console.error('Message:', err.message)
    console.error('Status:', err.response?.status)
    console.error('Data:', err.response?.data)
    console.error('URL:', err.config?.url)
    
    // Messages d'erreur spécifiques
    let errorMessage = 'Erreur inconnue'
    
    if (err.code === 'ECONNREFUSED') {
      errorMessage = 'Connexion refusée - Vérifiez que WordPress fonctionne'
    } else if (err.code === 'ENOTFOUND') {
      errorMessage = 'Domaine non trouvé - Vérifiez WC_STORE_URL'
    } else if (err.code === 'ETIMEDOUT') {
      errorMessage = 'Timeout - WordPress ne répond pas'
    } else if (err.response?.status === 404) {
      errorMessage = 'Endpoint non trouvé - Ajoutez le code dans functions.php'
    } else if (err.response?.data?.message) {
      errorMessage = err.response.data.message
    } else {
      errorMessage = err.message
    }

    throw createError({
      statusCode: err.response?.status || 500,
      statusMessage: errorMessage
    })
  }
})