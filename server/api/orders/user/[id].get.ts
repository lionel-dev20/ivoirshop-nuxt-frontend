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

    const allOrders: any[] = []
    const seenIds = new Set()

    // 1. Chercher par customer_id
    try {
      const { data } = await api.get('orders', {
        customer: parseInt(userId),
        per_page: 100,
        orderby: 'date',
        order: 'desc',
      })
      for (const order of (data || [])) {
        if (!seenIds.has(order.id)) {
          seenIds.add(order.id)
          allOrders.push(order)
        }
      }
    } catch (e) {
      // Continuer avec la recherche par email
    }

    // 2. Chercher les commandes invité par email ou phone dans billing
    if (allOrders.length === 0) {
      try {
        // Récupérer le profil customer pour connaître son username/phone
        let customerPhone = ''
        try {
          const { data: customer } = await api.get(`customers/${parseInt(userId)}`)
          customerPhone = customer?.username || customer?.billing?.phone || ''
        } catch (e) {
          // Ignorer
        }

        const { data } = await api.get('orders', {
          per_page: 100,
          orderby: 'date',
          order: 'desc',
        })
        for (const order of (data || [])) {
          if (seenIds.has(order.id)) continue

          const billingEmail = order.billing?.email?.toLowerCase() || ''
          const billingPhone = order.billing?.phone || ''
          const billingName = order.billing?.first_name || ''

          const matchEmail = userEmail && billingEmail === userEmail.toLowerCase()
          const matchPhone = customerPhone && (billingPhone === customerPhone || billingName === customerPhone)

          if (matchEmail || matchPhone) {
            seenIds.add(order.id)
            allOrders.push(order)
          }
        }
      } catch (e) {
        // Ignorer
      }
    }

    // Trier par date décroissante
    allOrders.sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime())

    // Mapper pour le frontend
    return allOrders.map((order: any) => ({
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
