import { defineEventHandler, createError, getQuery } from 'h3'
import { createWooCommerceClient } from '../../../utils/woocommerce'

export default defineEventHandler(async (event) => {
  const userId = event.context.params?.id
  const query = getQuery(event)
  const userEmail = query.email as string | undefined

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID utilisateur manquant.'
    })
  }

  try {
    const api = await createWooCommerceClient({
      url: process.env.WORDPRESS_URL!,
      consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY!,
      consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET!,
      version: 'wc/v3',
    })

    // 1. Chercher les commandes par customer_id
    const { data: ordersByCustomer } = await api.get('orders', {
      customer: parseInt(userId),
      per_page: 100,
      orderby: 'date',
      order: 'desc',
    })

    let allOrders = ordersByCustomer || []

    // 2. Si pas de résultats et qu'on a un email, chercher aussi par email (commandes invité)
    if (allOrders.length === 0 && userEmail) {
      const { data: ordersByEmail } = await api.get('orders', {
        search: userEmail,
        per_page: 100,
        orderby: 'date',
        order: 'desc',
      })
      allOrders = ordersByEmail || []
    }

    // 3. Si toujours rien, essayer de récupérer TOUTES les commandes récentes et filtrer par email billing
    if (allOrders.length === 0 && userEmail) {
      const { data: recentOrders } = await api.get('orders', {
        per_page: 100,
        orderby: 'date',
        order: 'desc',
      })
      allOrders = (recentOrders || []).filter((order: any) =>
        order.billing?.email?.toLowerCase() === userEmail.toLowerCase()
      )
    }

    // Dédupliquer par ID
    const seen = new Set()
    const uniqueOrders = allOrders.filter((order: any) => {
      if (seen.has(order.id)) return false
      seen.add(order.id)
      return true
    })

    // Mapper les données pour le frontend
    return uniqueOrders.map((order: any) => ({
      id: order.id,
      order_number: order.number,
      status: order.status,
      date_created: order.date_created,
      total: order.total,
      currency: order.currency_symbol || 'FCFA',
      payment_method: order.payment_method,
      payment_method_title: order.payment_method_title,
      shipping_total: order.shipping_total,
      discount_total: order.discount_total,
      customer_note: order.customer_note,
      billing: order.billing || {},
      items: (order.line_items || []).map((item: any) => ({
        product_id: item.product_id,
        name: item.name,
        quantity: item.quantity,
        total: item.total,
        image: item.image?.src || null,
      })),
    }))

  } catch (err: any) {
    console.error('Erreur récupération commandes:', err.response?.data || err.message)
    throw createError({
      statusCode: err.response?.status || 500,
      statusMessage: err.response?.data?.message || err.message || 'Erreur lors de la récupération des commandes.'
    })
  }
})
