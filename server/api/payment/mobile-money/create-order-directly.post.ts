// server/api/payment/mobile-money/create-order-directly.post.ts
import { defineEventHandler, readBody, createError } from 'h3'

/**
 * Créer une commande WooCommerce DIRECTEMENT après paiement mobile money
 * (Solution de secours si le webhook ne fonctionne pas)
 * 
 * Appelé depuis le frontend après retour de paiement réussi
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  try {
    const body = await readBody(event)
    
    console.log('============================================')
    console.log('📦 CRÉATION DIRECTE DE COMMANDE (Sans webhook)')
    console.log('============================================')
    console.log('Données reçues:', JSON.stringify(body, null, 2))
    
    // Validation
    if (!body.order_id || !body.customer_name || !body.cart_items) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Données manquantes (order_id, customer_name ou cart_items)'
      })
    }
    
    // Préparer les données pour WooCommerce
    const [firstName, ...lastNameParts] = body.customer_name.split(' ')
    const lastName = lastNameParts.join(' ') || firstName
    
    let customerNote = `✅ Payé par Mobile Money - Transaction: ${body.transaction_id || 'En attente'}`
    if (body.is_partial_payment) {
      customerNote += `\n💳 Paiement partiel: ${body.partial_payment_amount} FCFA sur ${body.total} FCFA`
    }
    if (body.coupon) {
      customerNote += `\n🎟️ Coupon appliqué: ${body.coupon.code} (-${body.coupon.discount} FCFA)`
    }
    
    const orderData = {
      payment_method: 'mobile_money',
      payment_method_title: 'Mobile Money',
      set_paid: true,
      status: 'paye-par-mobile-money',
      transaction_id: body.transaction_id || 'PENDING',
      customer_id: body.customer_id || 0,
      customer_note: customerNote,
      
      billing: {
        first_name: firstName,
        last_name: lastName,
        email: body.customer_email || body.email || 'client@ivoirshop.ci',
        phone: body.customer_phone || body.phone,
        address_1: body.customer_commune || '',
        address_2: body.customer_address_details || '',
        city: body.customer_city || '',
        state: '',
        postcode: '',
        country: 'CI'
      },
      
      shipping: {
        first_name: firstName,
        last_name: lastName,
        address_1: body.customer_commune || '',
        address_2: body.customer_address_details || '',
        city: body.customer_city || '',
        state: '',
        postcode: '',
        country: 'CI'
      },
      
      line_items: body.cart_items.map((item: any) => ({
        product_id: item.product_id || item.id,
        quantity: item.quantity,
        price: item.price
      })),
      
      shipping_cost: body.shipping_cost || 0,
      total: body.total || body.amount,
      
      meta_data: [
        { key: '_transaction_id', value: body.transaction_id || 'PENDING' },
        { key: '_payment_provider', value: 'DjoNanko' },
        { key: '_temp_order_id', value: body.order_id },
        { key: '_mobile_money_phone', value: body.phone || body.phoneNumber },
        { key: '_payment_amount', value: body.amount || body.total },
        { key: '_shipping_cost', value: body.shipping_cost || 0 },
        { key: '_delivery_city', value: body.delivery_info?.city_name || '' },
        { key: '_delivery_commune', value: body.delivery_info?.commune_name || '' },
        { key: '_delivery_product_type', value: body.delivery_info?.product_type || '' },
        { key: '_coupon_code', value: body.coupon?.code || '' },
        { key: '_coupon_discount', value: body.coupon?.discount || 0 },
        { key: '_is_partial_payment', value: body.is_partial_payment ? 'yes' : 'no' },
        { key: '_partial_payment_amount', value: body.partial_payment_amount || 0 }
      ]
    }
    
    console.log('📤 Envoi à WooCommerce...')
    console.log('Données:', JSON.stringify(orderData, null, 2))
    
    // Appeler l'API WooCommerce MOBILE MONEY
    const WORDPRESS_API = config.public.WC_STORE_URL || 'https://admin.ivoirshop.ci'
    const response = await fetch(`${WORDPRESS_API}/wp-json/custom/v1/create-order-mobile-money`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Erreur WooCommerce:', errorText)
      throw createError({
        statusCode: response.status,
        statusMessage: `Erreur WooCommerce: ${errorText}`
      })
    }
    
    const result = await response.json()
    const woocommerceOrderId = result.id || result.order_id
    
    console.log('============================================')
    console.log('✅ COMMANDE CRÉÉE AVEC SUCCÈS !')
    console.log('============================================')
    console.log('Order ID WooCommerce:', woocommerceOrderId)
    console.log('Order ID Temporaire:', body.order_id)
    console.log('Transaction ID:', body.transaction_id)
    console.log('============================================')
    
    return {
      success: true,
      woocommerce_order_id: woocommerceOrderId,
      temp_order_id: body.order_id,
      transaction_id: body.transaction_id,
      message: 'Commande créée avec succès dans WooCommerce'
    }
    
  } catch (err: any) {
    console.error('❌ ERREUR:', err)
    
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.message || 'Erreur lors de la création de la commande'
    })
  }
})

