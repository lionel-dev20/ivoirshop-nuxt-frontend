import { defineEventHandler, createError } from 'h3'
import axios from 'axios'

export default defineEventHandler(async () => {
  try {
    if (!process.env.WC_STORE_URL) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Configuration manquante'
      })
    }

    const axiosConfig = {
      timeout: 10000,
      headers: {
        'User-Agent': 'Nuxt-WooCommerce-Client/1.0',
        'Content-Type': 'application/json'
      }
    }

    console.log('Test des endpoints de coupons...')

    // Test 1: Vérifier l'endpoint personnalisé
    try {
      const { data: customCoupons } = await axios.get(
        `${process.env.WC_STORE_URL}/wp-json/custom/v1/coupons`,
        axiosConfig
      )
      console.log('✅ Endpoint personnalisé accessible:', customCoupons.length, 'coupons')
      
      return {
        success: true,
        custom_endpoint: {
          url: `${process.env.WC_STORE_URL}/wp-json/custom/v1/coupons`,
          accessible: true,
          coupons_count: customCoupons.length,
          sample_coupons: customCoupons.slice(0, 3).map((c: any) => ({
            code: c.code,
            description: c.description,
            discount_type: c.discount_type,
            amount: c.amount
          }))
        }
      }
    } catch (customError: any) {
      console.warn('❌ Endpoint personnalisé non accessible:', customError.message)
      
      // Test 2: Fallback vers l'API WooCommerce standard
      try {
        const wcConfig = {
          ...axiosConfig,
          auth: {
            username: process.env.WOOCOMMERCE_CONSUMER_KEY || '',
            password: process.env.WOOCOMMERCE_CONSUMER_SECRET || ''
          }
        }
        
        const { data: wcCoupons } = await axios.get(
          `${process.env.WC_STORE_URL}/wp-json/wc/v3/coupons`,
          wcConfig
        )
        
        console.log('✅ API WooCommerce accessible:', wcCoupons.length, 'coupons')
        
        return {
          success: true,
          custom_endpoint: {
            url: `${process.env.WC_STORE_URL}/wp-json/custom/v1/coupons`,
            accessible: false,
            error: customError.message
          },
          woocommerce_endpoint: {
            url: `${process.env.WC_STORE_URL}/wp-json/wc/v3/coupons`,
            accessible: true,
            coupons_count: wcCoupons.length,
            sample_coupons: wcCoupons.slice(0, 3).map((c: any) => ({
              code: c.code,
              description: c.description,
              discount_type: c.discount_type,
              amount: c.amount
            }))
          }
        }
      } catch (wcError: any) {
        console.error('❌ API WooCommerce non accessible:', wcError.message)
        
        return {
          success: false,
          custom_endpoint: {
            url: `${process.env.WC_STORE_URL}/wp-json/custom/v1/coupons`,
            accessible: false,
            error: customError.message
          },
          woocommerce_endpoint: {
            url: `${process.env.WC_STORE_URL}/wp-json/wc/v3/coupons`,
            accessible: false,
            error: wcError.message
          },
          message: 'Aucun endpoint de coupons accessible'
        }
      }
    }

  } catch (err: any) {
    console.error('Erreur test coupons:', err)
    throw createError({
      statusCode: 500,
      statusMessage: `Erreur: ${err.message}`
    })
  }
})

