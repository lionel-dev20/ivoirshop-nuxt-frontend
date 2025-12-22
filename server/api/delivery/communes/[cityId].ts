import { defineEventHandler, getRouterParams, createError } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  try {
    const params = getRouterParams(event)
    const cityId = params.cityId

    if (!cityId || isNaN(parseInt(cityId))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de ville invalide'
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

    const { data } = await axios.get(
      `${process.env.WC_STORE_URL}/wp-json/delivery/v1/cities/${cityId}/communes`,
      axiosConfig
    )

    return {
      success: true,
      communes: data || []
    }

  } catch (err: any) {
    throw createError({
      statusCode: err.response?.status || 500,
      statusMessage: `Erreur: ${err.message}`
    })
  }
})