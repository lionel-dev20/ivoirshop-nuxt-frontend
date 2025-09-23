import { defineEventHandler, getHeader, readBody } from 'h3'
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api'

export default defineEventHandler(async (event) => {
  try {
    const token = getHeader(event, 'authorization')?.replace('Bearer ', '')
    if (!token) return { error: 'Non autorisé' }

    const payload = token.split('.')[1]
    if (!payload) return { error: 'Token invalide' }
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString())
    const customerId = decoded.data.user.id

    const body = await readBody(event)

    const api = new WooCommerceRestApi({
      url: process.env.WC_URL!,
      consumerKey: process.env.WC_KEY!,
      consumerSecret: process.env.WC_SECRET!,
      version: 'wc/v3',
    })

    const { data } = await api.put(`customers/${customerId}`, body)
    return data
  } catch (err) {
    return { error: 'Impossible de mettre à jour le profil' }
  }
})
