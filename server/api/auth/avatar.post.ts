import { defineEventHandler, readBody, getCookie, createError } from 'h3'
import { createWooCommerceClient } from '../../utils/woocommerce'

export default defineEventHandler(async (event) => {
  try {
    const token = getCookie(event, 'auth_token')
    if (!token) {
      throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })
    }

    const body = await readBody(event) as { userId: number; avatar: string }

    if (!body.userId || !body.avatar) {
      throw createError({ statusCode: 400, statusMessage: 'Données manquantes' })
    }

    const api = await createWooCommerceClient({
      url: process.env.WORDPRESS_URL!,
      consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY!,
      consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET!,
      version: 'wc/v3',
    })

    // Sauvegarder l'avatar dans les meta_data du customer
    await api.put(`customers/${body.userId}`, {
      meta_data: [
        { key: 'avatar_base64', value: body.avatar }
      ]
    })

    return { success: true }
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'Erreur lors de la sauvegarde de l\'avatar'
    })
  }
})
