import { defineEventHandler, readBody, createError } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (!body.commune_id || !body.product_type) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Données manquantes'
      })
    }

    if (!process.env.WC_STORE_URL) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Configuration manquante'
      })
    }

    const axiosConfig = {
      timeout: 10000,
      headers: {
        'User-Agent': 'Nuxt-Delivery-Client/1.0',
        'Content-Type': 'application/json'
      }
    }

    const { data } = await axios.post(
      `${process.env.WC_STORE_URL}/wp-json/delivery/v1/calculate-shipping`,
      {
        commune_id: body.commune_id,
        product_type: body.product_type
      },
      axiosConfig
    )

    return {
      success: true,
      shipping: data
    }

  } catch (err: any) {

    throw createError({
      statusCode: err.response?.status || 500,
      statusMessage: `Erreur: ${err.message}`
    })
  }
})