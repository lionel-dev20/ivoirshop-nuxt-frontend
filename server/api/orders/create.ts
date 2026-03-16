// server/api/orders/create.ts - Utilise l'API WooCommerce REST officielle
import { defineEventHandler, readBody, createError } from 'h3'
import { createWooCommerceClient } from '../../utils/woocommerce'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Log du body reçu pour debug
    console.log('📥 Body reçu par /api/orders/create:', JSON.stringify(body, null, 2))

    // Validation simple
    if (!body.customer || !body.items || body.items.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Données manquantes'
      })
    }

    const api = await createWooCommerceClient({
      url: process.env.WORDPRESS_URL!,
      consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY!,
      consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET!,
      version: 'wc/v3',
    })

    // Note client
    let customerNote = body.customer.notes || ''
    if (body.delivery_info) {
      const di = body.delivery_info
      if (di.city_name || di.commune_name) {
        customerNote += `${customerNote ? '\n' : ''}Livraison: ${di.commune_name || ''}, ${di.city_name || ''}`
      }
    }

    // Récupérer les infos du client (billing envoyé séparément ou depuis customer)
    const billingFirstName = String(body.billing?.first_name || body.customer.firstName || body.customer.first_name || 'Client')
    const billingLastName = String(body.billing?.last_name || body.customer.lastName || body.customer.last_name || '')
    const billingEmail = String(body.billing?.email || body.customer.email || 'client@ivoirshop.ci')
    const billingPhone = String(body.billing?.phone || body.customer.phone || '')
    const billingAddress = String(body.billing?.address_1 || body.shipping?.address_1 || '')
    const billingCity = String(body.billing?.city || body.shipping?.city || '')

    // Préparer les données pour l'API WooCommerce officielle
    const orderData: any = {
      customer_id: body.customer_id || 0,
      payment_method: body.payment_method || 'cod',
      payment_method_title: body.payment_method === 'mobile_money' ? 'Mobile Money' : 'Paiement à la livraison',
      set_paid: false,
      status: 'processing',
      customer_note: customerNote,
      billing: {
        first_name: billingFirstName,
        last_name: billingLastName,
        email: billingEmail,
        phone: billingPhone,
        address_1: billingAddress,
        address_2: String(body.billing?.address_2 || body.shipping?.address_2 || ''),
        city: billingCity,
        state: '',
        postcode: '',
        country: 'CI'
      },
      shipping: {
        first_name: String(body.shipping?.first_name || billingFirstName),
        last_name: String(body.shipping?.last_name || billingLastName),
        address_1: String(body.shipping?.address_1 || billingAddress),
        address_2: String(body.shipping?.address_2 || ''),
        city: String(body.shipping?.city || billingCity),
        state: '',
        postcode: '',
        country: 'CI'
      },
      line_items: body.items.map((item: any) => ({
        product_id: parseInt(item.id),
        quantity: parseInt(item.quantity),
      })),
      meta_data: [
        { key: '_delivery_city', value: String(body.delivery_info?.city_name || '') },
        { key: '_delivery_commune', value: String(body.delivery_info?.commune_name || '') },
        { key: '_shipping_cost', value: String(body.shipping_cost || 0) },
      ],
    }

    // Ajouter les frais de livraison si présents
    if (body.shipping_cost && parseFloat(body.shipping_cost) > 0) {
      orderData.shipping_lines = [
        {
          method_id: 'flat_rate',
          method_title: 'Livraison',
          total: String(body.shipping_cost)
        }
      ]
    }

    // Ajouter le coupon si présent
    if (body.coupon?.code) {
      orderData.coupon_lines = [
        { code: body.coupon.code }
      ]
    }

    // Log pour debug
    console.log('📦 Création commande WooCommerce:', JSON.stringify({
      customer_id: orderData.customer_id,
      billing: orderData.billing,
      line_items_count: orderData.line_items?.length,
    }, null, 2))

    // Créer la commande via l'API WooCommerce REST officielle
    const { data } = await api.post('orders', orderData)

    return {
      success: true,
      order_id: data.id,
      order_number: data.number,
      order_status: data.status,
      total: data.total,
      message: 'Commande créée avec succès'
    }

  } catch (err: any) {
    let errorMessage = 'Erreur inconnue'

    if (err.code === 'ECONNREFUSED') {
      errorMessage = 'Connexion refusée - Vérifiez que WordPress fonctionne'
    } else if (err.code === 'ENOTFOUND') {
      errorMessage = 'Domaine non trouvé - Vérifiez WORDPRESS_URL'
    } else if (err.code === 'ETIMEDOUT') {
      errorMessage = 'Timeout - WordPress ne répond pas'
    } else if (err.response?.data?.message) {
      errorMessage = err.response.data.message
    } else if (err.message) {
      errorMessage = err.message
    }

    throw createError({
      statusCode: err.response?.status || 500,
      statusMessage: errorMessage
    })
  }
})
