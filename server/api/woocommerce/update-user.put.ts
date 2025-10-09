import { defineEventHandler, getCookie, readBody } from 'h3'
import { createWooCommerceClient } from '../../utils/woocommerce'

export default defineEventHandler(async (event) => {
  try {
    // Récupérer le token depuis le cookie
    const token = getCookie(event, 'auth_token')
    
    if (!token) {
      return { 
        data: null, 
        error: 'Non autorisé - veuillez vous connecter' 
      }
    }

    // Décoder le token JWT pour obtenir l'ID utilisateur
    const payload = token.split('.')[1]
    if (!payload) {
      return { data: null, error: 'Token invalide' }
    }
    
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString())
    const customerId = decoded.data?.user?.id || decoded.user_id

    if (!customerId) {
      return { data: null, error: 'ID utilisateur introuvable dans le token' }
    }

    const body = await readBody(event)

    // Mettre à jour les informations du client
    const api = await createWooCommerceClient({
      url: process.env.WORDPRESS_URL!,
      consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY!,
      consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET!,
      version: 'wc/v3',
    })

    const { data } = await api.put(`customers/${customerId}`, body)
    
    return { 
      data,
      error: null 
    }
  } catch (err: any) {
    console.error('Erreur mise à jour profil:', err)
    return { 
      data: null,
      error: err.message || 'Impossible de mettre à jour le profil' 
    }
  }
})
