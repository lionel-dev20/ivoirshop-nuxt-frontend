import { defineEventHandler, getHeader } from 'h3'
import { createWooCommerceClient } from '../../utils/woocommerce'

export default defineEventHandler(async (event) => {
  try {
    const token = getHeader(event, 'authorization')?.replace('Bearer ', '')
    if (!token) return { error: 'Non autorisé' }

    const payload = token.split('.')[1]
    if (!payload) return { error: 'Token invalide' }
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString())
    const customerId = decoded.data.user.id

    const api = await createWooCommerceClient({
      url: process.env.WORDPRESS_URL!,
      consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY!,
      consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET!,
      version: 'wc/v3',
    })

    const { data } = await api.get(`orders`, { customer: customerId })
    return data
  } catch (err) {
    return { error: 'Impossible de récupérer les commandes' }
  }
})
