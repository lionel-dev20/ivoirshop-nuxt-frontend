import { defineEventHandler, createError } from 'h3'
import { useRuntimeConfig } from '#imports'
import { createWooCommerceClient } from '../../utils/woocommerce'

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    
    // Vérifier la configuration
    if (!runtimeConfig.WORDPRESS_URL) {
      throw createError({
        statusCode: 500,
        statusMessage: 'WORDPRESS_URL non configuré'
      })
    }

    if (!runtimeConfig.WOOCOMMERCE_CONSUMER_KEY) {
      throw createError({
        statusCode: 500,
        statusMessage: 'WOOCOMMERCE_CONSUMER_KEY non configuré'
      })
    }

    if (!runtimeConfig.WOOCOMMERCE_CONSUMER_SECRET) {
      throw createError({
        statusCode: 500,
        statusMessage: 'WOOCOMMERCE_CONSUMER_SECRET non configuré'
      })
    }

    // Tester l'instanciation de WooCommerceRestApi
    let api
    try {
      api = await createWooCommerceClient({
        url: runtimeConfig.WORDPRESS_URL,
        consumerKey: runtimeConfig.WOOCOMMERCE_CONSUMER_KEY,
        consumerSecret: runtimeConfig.WOOCOMMERCE_CONSUMER_SECRET,
        version: 'wc/v3',
      })
    } catch (constructorError: any) {
      throw createError({
        statusCode: 500,
        statusMessage: `Erreur constructeur WooCommerceRestApi: ${constructorError.message}`
      })
    }

    // Tester une requête simple
    let testResult
    try {
      const { data } = await api.get('products', {
        per_page: 1,
        status: 'publish'
      })
      testResult = {
        success: true,
        productsFound: data.length,
        firstProduct: data[0] ? {
          id: data[0].id,
          name: data[0].name
        } : null
      }
    } catch (apiError: any) {
      testResult = {
        success: false,
        error: apiError.message,
        status: apiError.response?.status,
        data: apiError.response?.data
      }
    }

    return {
      config: {
        WORDPRESS_URL: runtimeConfig.WORDPRESS_URL,
        CONSUMER_KEY: runtimeConfig.WOOCOMMERCE_CONSUMER_KEY ? '***' + runtimeConfig.WOOCOMMERCE_CONSUMER_KEY.slice(-4) : 'undefined',
        CONSUMER_SECRET: runtimeConfig.WOOCOMMERCE_CONSUMER_SECRET ? '***' + runtimeConfig.WOOCOMMERCE_CONSUMER_SECRET.slice(-4) : 'undefined',
      },
      constructor: {
        success: true,
        message: 'WooCommerceRestApi instancié avec succès'
      },
      apiTest: testResult
    }

  } catch (err: any) {
    return {
      error: {
        message: err.message,
        statusCode: err.statusCode || 500,
        stack: err.stack
      }
    }
  }
})
