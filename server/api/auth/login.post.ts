import { defineEventHandler, readBody, setCookie, createError } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ username: string; password: string }>(event)

  if (!body.username || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Veuillez renseigner vos identifiants',
    })
  }

  try {
    // Authentification JWT
    const { data } = await axios.post(
      `${process.env.WORDPRESS_URL}/wp-json/jwt-auth/v1/token`,
      {
        username: body.username,
        password: body.password,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )

    if (!data.token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Identifiants incorrects',
      })
    }

    // Stocke le token dans un cookie httpOnly sécurisé
    setCookie(event, 'auth_token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    })

    // Récupérer les informations complètes de l'utilisateur depuis WooCommerce
    let userDetails = {
      id: data.user_id || data.data?.user?.id,
      username: data.user_display_name || data.user_nicename,
      email: data.user_email,
      first_name: '',
      last_name: '',
    }

    try {
      // Essayer de récupérer plus d'infos depuis WooCommerce
      const WooCommerceModule = await import('@woocommerce/woocommerce-rest-api')
      const WooCommerceRestApi = WooCommerceModule.default
      
      const api = new WooCommerceRestApi({
        url: process.env.WORDPRESS_URL!,
        consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY!,
        consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET!,
        version: 'wc/v3',
      })

      const { data: customer } = await api.get(`customers/${userDetails.id}`)
      
      if (customer) {
        userDetails.first_name = customer.first_name || ''
        userDetails.last_name = customer.last_name || ''
        userDetails.email = customer.email || userDetails.email
      }
    } catch (wcErr) {
      // Si on ne peut pas récupérer depuis WooCommerce, on continue avec les données JWT
      console.warn('Impossible de récupérer les détails WooCommerce:', wcErr)
    }

    return {
      user: userDetails,
      success: true,
    }
  } catch (err: any) {
    console.error('Erreur login:', err)
    
    const statusCode = err.response?.status || err.statusCode || 401
    const message = err.response?.data?.message || err.statusMessage || 'Identifiants incorrects'
    
    throw createError({
      statusCode,
      statusMessage: message,
    })
  }
})
