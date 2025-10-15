import { defineEventHandler, readBody, createError } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (!body.coupon_code) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Code coupon manquant'
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
        'User-Agent': 'Nuxt-WooCommerce-Client/1.0',
        'Content-Type': 'application/json'
      }
    }

    // Récupération du coupon via l'API WooCommerce
    const { data: coupons } = await axios.get(
      `${process.env.WC_STORE_URL}/wp-json/custom/v1/coupons/${body.coupon_code}`,
      axiosConfig
    )

    if (!coupons || coupons.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Code coupon invalide ou expiré'
      })
    }

    const coupon = coupons[0]

    // Calcul de la réduction
    let discount = 0
    const cartTotal = parseFloat(body.cart_total || '0')

    if (coupon.discount_type === 'percent') {
      discount = (cartTotal * parseFloat(coupon.amount)) / 100
    } else if (coupon.discount_type === 'fixed_cart') {
      discount = parseFloat(coupon.amount)
    }

    // Vérification du montant minimum
    if (coupon.minimum_amount && cartTotal < parseFloat(coupon.minimum_amount)) {
      throw createError({
        statusCode: 400,
        statusMessage: `Montant minimum requis: ${coupon.minimum_amount}FCFA`
      })
    }

    // S'assurer que la réduction ne dépasse pas le total
    discount = Math.min(discount, cartTotal)

    return {
      success: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discount_type: coupon.discount_type,
        amount: coupon.amount,
        discount: discount,
        formatted_discount: new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'XOF'
        }).format(discount).replace('XOF', 'FCFA')
      }
    }

  } catch (err: any) {
    console.error('Erreur application coupon:', {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data
    })

    if (err.statusCode) {
      throw err
    }

    throw createError({
      statusCode: err.response?.status || 500,
      statusMessage: `Erreur: ${err.message}`
    })
  }
})