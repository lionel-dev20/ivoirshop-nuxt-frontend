import { defineEventHandler, getCookie } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')
  if (!token) return null

  try {
    // Récupérer les infos de base depuis WordPress
    const { data: wpUser } = await axios.get(
      `${process.env.WORDPRESS_URL}/wp-json/wp/v2/users/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    let userDetails = {
      id: wpUser.id,
      username: wpUser.username || wpUser.name,
      email: wpUser.email || '',
      first_name: wpUser.first_name || '',
      last_name: wpUser.last_name || '',
    }

    // Essayer de récupérer les détails complets depuis WooCommerce
    try {
      const WooCommerceModule = await import('@woocommerce/woocommerce-rest-api')
      const WooCommerceRestApi = WooCommerceModule.default
      
      const api = new WooCommerceRestApi({
        url: process.env.WORDPRESS_URL!,
        consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY!,
        consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET!,
        version: 'wc/v3',
      })

      const { data: customer } = await api.get(`customers/${wpUser.id}`)
      
      if (customer) {
        userDetails = {
          id: customer.id,
          username: customer.username || userDetails.username,
          email: customer.email || userDetails.email,
          first_name: customer.first_name || userDetails.first_name,
          last_name: customer.last_name || userDetails.last_name,
        }
      }
    } catch (wcErr) {
      // Si WooCommerce échoue, on retourne les infos WordPress
      console.warn('Impossible de récupérer les détails WooCommerce:', wcErr)
    }

    return userDetails
  } catch (err) {
    console.error('Erreur récupération utilisateur:', err)
    return null
  }
})
