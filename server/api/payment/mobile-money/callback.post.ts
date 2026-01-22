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
    console.log('Customer ID:', payload.metadata.customer_id || 'Invité')
    console.log('Client:', payload.metadata.customer_name)
    console.log('Email:', payload.metadata.email)
    console.log('Téléphone Client:', payload.metadata.customer_phone)
    console.log('Téléphone Mobile Money:', payload.metadata.phoneNumber)
    console.log('Ville:', payload.metadata.customer_city)
    console.log('Commune:', payload.metadata.customer_commune)
    console.log('Adresse:', payload.metadata.customer_address_details)
    
    console.log('---')
    console.log('💵 INFORMATIONS DE PRIX:')
    console.log('Total commande:', payload.metadata.total || 'N/A', 'FCFA')
    console.log('Frais de livraison:', payload.metadata.shipping_cost || 0, 'FCFA')
    console.log('Montant payé:', payload.amount, 'FCFA')
    
    if (payload.metadata.is_partial_payment) {
      console.log('💳 Paiement partiel:', payload.metadata.partial_payment_amount, 'FCFA')
      console.log('Reste à payer:', (payload.metadata.total - payload.metadata.partial_payment_amount), 'FCFA')
    }
    
    if (payload.metadata.coupon) {
      console.log('---')
      console.log('🎟️ COUPON APPLIQUÉ:')
      console.log('Code:', payload.metadata.coupon.code)
      console.log('Réduction:', payload.metadata.coupon.discount, 'FCFA')
    }
    
    if (payload.metadata.delivery_info) {
      console.log('---')
      console.log('📦 INFORMATIONS DE LIVRAISON:')
      console.log('Ville:', payload.metadata.delivery_info.city_name)
      console.log('Commune:', payload.metadata.delivery_info.commune_name)
      console.log('Type de produit:', payload.metadata.delivery_info.product_type)
    }
    
    // Afficher le panier si disponible
    if (payload.metadata.cart_items && payload.metadata.cart_items.length > 0) {
      console.log('---')
      console.log('📦 PANIER (' + payload.metadata.cart_items.length + ' produits):')
      payload.metadata.cart_items.forEach((item: any, index: number) => {
        console.log(`  ${index + 1}. ${item.name} x${item.quantity} - ${item.price} FCFA (Total: ${item.total || item.price * item.quantity} FCFA)`)
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
      
      // 🔧 Construire la note de commande complète
      let customerNote = `✅ Payé par Mobile Money - Transaction: ${payload.transaction_id || payload.id}`
      if (payload.metadata.is_partial_payment) {
        customerNote += `\n💳 Paiement partiel: ${payload.metadata.partial_payment_amount} FCFA sur ${payload.metadata.total} FCFA`
      }
      if (payload.metadata.coupon) {
        customerNote += `\n🎟️ Coupon appliqué: ${payload.metadata.coupon.code} (-${payload.metadata.coupon.discount} FCFA)`
      }
      
      const orderData = {
        payment_method: 'mobile_money',
        payment_method_title: 'Mobile Money',
        set_paid: true, // Marquer comme payé
        status: 'paye-par-mobile-money', // Statut: Payé par mobile money
        transaction_id: payload.transaction_id || payload.id, // ID de transaction
        customer_id: payload.metadata.customer_id || 0, // ID client si connecté
        customer_note: customerNote,
        
        // 📍 Informations de facturation
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
        
        // 📦 Informations de livraison
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
        
        // 🛒 Articles commandés
        line_items: payload.metadata.cart_items.map((item: any) => ({
          product_id: item.product_id || item.id, // Fallback sur 'id' si 'product_id' n'existe pas
          quantity: item.quantity,
          price: item.price
        })),
        
        // 💵 Informations de prix
        shipping_cost: payload.metadata.shipping_cost || 0,
        total: payload.metadata.total || payload.amount,
        
        // 📋 Métadonnées complètes
        meta_data: [
          // Transaction & Paiement
          { key: '_transaction_id', value: payload.transaction_id || payload.id },
          { key: '_payment_provider', value: 'DjoNanko' },
          { key: '_temp_order_id', value: payload.metadata.order_id },
          { key: '_mobile_money_phone', value: payload.metadata.phoneNumber },
          { key: '_payment_amount', value: payload.amount },
          
          // Livraison
          { key: '_shipping_cost', value: payload.metadata.shipping_cost || 0 },
          { key: '_delivery_city', value: payload.metadata.delivery_info?.city_name || '' },
          { key: '_delivery_commune', value: payload.metadata.delivery_info?.commune_name || '' },
          { key: '_delivery_product_type', value: payload.metadata.delivery_info?.product_type || '' },
          
          // Coupon
          { key: '_coupon_code', value: payload.metadata.coupon?.code || '' },
          { key: '_coupon_discount', value: payload.metadata.coupon?.discount || 0 },
          
          // Paiement partiel
          { key: '_is_partial_payment', value: payload.metadata.is_partial_payment ? 'yes' : 'no' },
          { key: '_partial_payment_amount', value: payload.metadata.partial_payment_amount || 0 }
        ]
      }
      
      console.log('📤 Création de la commande WooCommerce...')
      console.log('Données envoyées:', JSON.stringify(orderData, null, 2))
      
      // Appeler l'API WooCommerce pour créer la commande MOBILE MONEY
      const WORDPRESS_API = config.public.WC_STORE_URL || 'https://admin.ivoirshop.ci'
      const response = await fetch(`${WORDPRESS_API}/wp-json/custom/v1/create-order-mobile-money`, {
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
        console.log('Customer ID:', payload.metadata.customer_id || 'Invité')
        console.log('Transaction ID:', payload.transaction_id || payload.id)
        console.log('Statut: Payé par mobile money')
        console.log('Montant payé:', payload.amount, 'FCFA')
        console.log('Total commande:', payload.metadata.total || payload.amount, 'FCFA')
        console.log('Frais de livraison:', payload.metadata.shipping_cost || 0, 'FCFA')
        if (payload.metadata.coupon) {
          console.log('Coupon:', payload.metadata.coupon.code, '(-' + payload.metadata.coupon.discount + ' FCFA)')
        }
        if (payload.metadata.is_partial_payment) {
          console.log('Type: Paiement partiel')
          console.log('Reste à payer:', (payload.metadata.total - payload.metadata.partial_payment_amount), 'FCFA')
        }
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

