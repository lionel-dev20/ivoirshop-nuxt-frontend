// server/api/payment/mobile-money/callback.post.ts
import { defineEventHandler, readBody, setResponseStatus } from 'h3'

/**
 * Webhook URL: https://ivoirshop.ci/api/payment/mobile-money/callback
 * 
 * Ce webhook reçoit les notifications de paiement avec:
 * - Status du paiement (success, pending, failed)
 * - Metadata contenant toutes les infos de la commande
 * 
 * SI le paiement est SUCCESS → Crée la commande dans WooCommerce
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  // Récupérer le payload envoyé en POST
  const payload = await readBody(event)
  
  // Logger le payload complet
  console.log('============================================')
  console.log('📥 WEBHOOK PAYLOAD REÇU')
  console.log('============================================')
  console.log('Status:', payload.status)
  console.log('Transaction ID:', payload.transaction_id || payload.id)
  console.log('Amount:', payload.amount)
  console.log('Metadata:', JSON.stringify(payload.metadata, null, 2))
  
  // Extraire les infos importantes si metadata existe
  if (payload.metadata) {
    console.log('---')
    console.log('🛒 DÉTAILS DE LA COMMANDE:')
    console.log('Order ID Temporaire:', payload.metadata.order_id)
    console.log('Client:', payload.metadata.customer_name)
    console.log('Email:', payload.metadata.email)
    console.log('Téléphone Client:', payload.metadata.customer_phone)
    console.log('Téléphone Mobile Money:', payload.metadata.phoneNumber)
    console.log('Ville:', payload.metadata.customer_city)
    console.log('Commune:', payload.metadata.customer_commune)
    console.log('Adresse:', payload.metadata.customer_address_details)
    
    // Afficher le panier si disponible
    if (payload.metadata.cart_items && payload.metadata.cart_items.length > 0) {
      console.log('---')
      console.log('📦 PANIER (' + payload.metadata.cart_items.length + ' produits):')
      payload.metadata.cart_items.forEach((item: any, index: number) => {
        console.log(`  ${index + 1}. ${item.name} x${item.quantity} - ${item.price} FCFA`)
      })
    }
  }
  
  console.log('============================================')
  
  // 🎯 SI LE PAIEMENT EST RÉUSSI → CRÉER LA COMMANDE DANS WOOCOMMERCE
  let woocommerceOrderId = null
  let orderCreationStatus = 'not_attempted'
  
  if ((payload.status === 'success' || payload.status === 'completed') && payload.metadata) {
    console.log('✅ PAIEMENT RÉUSSI - Création de la commande WooCommerce...')
    
    try {
      // Préparer les données de la commande pour WooCommerce
      const [firstName, ...lastNameParts] = payload.metadata.customer_name.split(' ')
      const lastName = lastNameParts.join(' ') || firstName
      
      const orderData = {
        payment_method: 'mobile_money',
        payment_method_title: 'Mobile Money',
        set_paid: true, // Marquer comme payé
        status: 'processing', // Statut: en cours de traitement
        transaction_id: payload.transaction_id || payload.id, // ID de transaction
        customer_note: `✅ Payé par Mobile Money - Transaction: ${payload.transaction_id || payload.id}`,
        billing: {
          first_name: firstName,
          last_name: lastName,
          email: payload.metadata.email,
          phone: payload.metadata.customer_phone || payload.metadata.phoneNumber,
          address_1: payload.metadata.customer_commune || '',
          address_2: payload.metadata.customer_address_details || '',
          city: payload.metadata.customer_city || '',
          state: '',
          postcode: '',
          country: 'CI'
        },
        shipping: {
          first_name: firstName,
          last_name: lastName,
          address_1: payload.metadata.customer_commune || '',
          address_2: payload.metadata.customer_address_details || '',
          city: payload.metadata.customer_city || '',
          state: '',
          postcode: '',
          country: 'CI'
        },
        line_items: payload.metadata.cart_items.map((item: any) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price
        })),
        meta_data: [
          { key: '_transaction_id', value: payload.transaction_id || payload.id },
          { key: '_payment_provider', value: 'DjoNanko' },
          { key: '_temp_order_id', value: payload.metadata.order_id },
          { key: '_mobile_money_phone', value: payload.metadata.phoneNumber },
          { key: '_payment_amount', value: payload.amount }
        ]
      }
      
      console.log('📤 Création de la commande WooCommerce...')
      console.log('Données envoyées:', JSON.stringify(orderData, null, 2))
      
      // Appeler l'API WooCommerce pour créer la commande
      const WORDPRESS_API = config.public.WC_STORE_URL || 'https://admin.ivoirshop.ci'
      const response = await fetch(`${WORDPRESS_API}/wp-json/custom/v1/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })
      
      if (response.ok) {
        const result = await response.json()
        woocommerceOrderId = result.id || result.order_id
        orderCreationStatus = 'success'
        
        console.log('============================================')
        console.log('✅ COMMANDE WOOCOMMERCE CRÉÉE AVEC SUCCÈS !')
        console.log('============================================')
        console.log('Order ID WooCommerce:', woocommerceOrderId)
        console.log('Order ID Temporaire:', payload.metadata.order_id)
        console.log('Transaction ID:', payload.transaction_id || payload.id)
        console.log('Montant:', payload.amount, 'FCFA')
        console.log('============================================')
      } else {
        const errorText = await response.text()
        console.error('❌ Erreur lors de la création de la commande WooCommerce:', errorText)
        orderCreationStatus = 'failed'
      }
      
    } catch (error: any) {
      console.error('❌ ERREUR lors de la création de la commande:', error)
      orderCreationStatus = 'error'
    }
  } else {
    console.log('⏸️  Paiement pas encore confirmé - Statut:', payload.status)
  }
  
  console.log('============================================')
  
  // Forcer le statut à 200 OK
  setResponseStatus(event, 200)
  
  // Retourner le payload avec les infos de création de commande
  return {
    received: true,
    timestamp: new Date().toISOString(),
    order_creation_status: orderCreationStatus,
    woocommerce_order_id: woocommerceOrderId,
    temp_order_id: payload.metadata?.order_id,
    transaction_id: payload.transaction_id || payload.id,
    payload: payload
  }
})

