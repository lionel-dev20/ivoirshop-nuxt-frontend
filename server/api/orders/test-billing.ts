import { defineEventHandler, readBody, createError } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    console.log('=== TEST BILLING ===')
    console.log('Données reçues:', JSON.stringify(body, null, 2))

    if (!process.env.WC_STORE_URL) {
      throw createError({
        statusCode: 500,
        statusMessage: 'WC_STORE_URL manquant'
      })
    }

    // Configuration axios
    const axiosConfig = {
      timeout: 10000,
      headers: {
        'User-Agent': 'Nuxt-WooCommerce-Client/1.0',
        'Content-Type': 'application/json'
      }
    }

    // Test de l'endpoint WordPress
    try {
      const response = await axios.post(
        `${process.env.WC_STORE_URL}/wp-json/custom/v1/create-order`,
        body,
        axiosConfig
      )

      console.log('✅ Réponse WordPress:', response.data)

      return {
        success: true,
        message: 'Test billing et shipping réussi',
        data_sent: {
          billing: body.billing,
          shipping: body.shipping || body.billing
        },
        response_received: response.data
      }

    } catch (error: any) {
      console.error('❌ Erreur WordPress:', error.message)
      console.error('Status:', error.response?.status)
      console.error('Data:', error.response?.data)

      return {
        success: false,
        message: 'Erreur lors du test billing',
        error: error.message,
        status: error.response?.status,
        data: error.response?.data,
        data_sent: body
      }
    }

  } catch (err: any) {
    console.error('❌ ERREUR TEST BILLING:', err)
    throw createError({
      statusCode: 500,
      statusMessage: `Erreur: ${err.message}`
    })
  }
})
