import { defineEventHandler, readBody, createError, getCookie } from 'h3'
import { createWooCommerceClient } from '../../../utils/woocommerce'

export default defineEventHandler(async (event) => {
  try {
    // Vérifier l'authentification
    const token = getCookie(event, 'auth_token')
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Non authentifié'
      })
    }

    // Récupérer l'ID depuis l'URL
    const userId = event.context.params?.id
    if (!userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID utilisateur manquant'
      })
    }

    // Récupérer les données du body
    const body = await readBody(event)
    
    console.log('==========================================')
    console.log('👤 MISE À JOUR PROFIL UTILISATEUR')
    console.log('==========================================')
    console.log('User ID:', userId)
    console.log('Données reçues:', body)

    // Validation de base
    if (!body.email || !body.first_name || !body.last_name) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email, prénom et nom sont obligatoires'
      })
    }

    // Préparer les données pour WooCommerce
    const customerData: any = {
      email: body.email,
      first_name: body.first_name,
      last_name: body.last_name,
    }

    // Ajouter le billing et shipping si fournis
    if (body.billing) {
      customerData.billing = {
        first_name: body.billing.first_name || body.first_name,
        last_name: body.billing.last_name || body.last_name,
        address_1: body.billing.address_1 || '',
        address_2: body.billing.address_2 || '',
        city: body.billing.city || '',
        postcode: body.billing.postcode || '',
        country: body.billing.country || 'CI',
        email: body.billing.email || body.email,
        phone: body.billing.phone || ''
      }
    }

    if (body.shipping) {
      customerData.shipping = {
        first_name: body.shipping.first_name || body.first_name,
        last_name: body.shipping.last_name || body.last_name,
        address_1: body.shipping.address_1 || '',
        address_2: body.shipping.address_2 || '',
        city: body.shipping.city || '',
        postcode: body.shipping.postcode || '',
        country: body.shipping.country || 'CI'
      }
    }

    console.log('📦 Données préparées pour WooCommerce:', customerData)

    // Créer le client WooCommerce
    const api = await createWooCommerceClient({
      url: process.env.WORDPRESS_URL!,
      consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY!,
      consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET!,
      version: 'wc/v3',
    })

    // Mettre à jour le client
    console.log('🔄 Mise à jour dans WooCommerce...')
    const { data: updatedCustomer } = await api.put(`customers/${userId}`, customerData)

    console.log('✅ Profil mis à jour avec succès')
    console.log('==========================================')

    return {
      success: true,
      user: {
        id: updatedCustomer.id,
        username: updatedCustomer.username,
        email: updatedCustomer.email,
        first_name: updatedCustomer.first_name,
        last_name: updatedCustomer.last_name,
        billing: updatedCustomer.billing,
        shipping: updatedCustomer.shipping
      },
      message: 'Profil mis à jour avec succès'
    }

  } catch (err: any) {
    console.error('==========================================')
    console.error('❌ ERREUR MISE À JOUR PROFIL')
    console.error('==========================================')
    console.error('Message:', err.message)
    console.error('Status:', err.response?.status)
    console.error('Data:', err.response?.data)
    console.error('==========================================')
    
    let errorMessage = 'Erreur lors de la mise à jour du profil'
    
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message
    } else if (err.response?.data?.code === 'woocommerce_rest_customer_invalid_email') {
      errorMessage = 'Adresse email invalide'
    } else if (err.response?.data?.code === 'woocommerce_rest_customer_invalid_id') {
      errorMessage = 'Utilisateur non trouvé'
    } else if (err.message) {
      errorMessage = err.message
    }

    throw createError({
      statusCode: err.response?.status || 500,
      statusMessage: errorMessage
    })
  }
})

