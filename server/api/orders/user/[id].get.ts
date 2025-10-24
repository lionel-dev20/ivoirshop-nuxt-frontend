import { defineEventHandler, createError } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  if (!config.public.woocommerceUrl || !config.private.woocommerceKey || !config.private.woocommerceSecret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Configuration WooCommerce manquante dans le backend.'
    });
  }

  const userId = event.context.params?.id;

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID utilisateur manquant.'
    });
  }

  try {
    // Appeler l'API WooCommerce pour récupérer les commandes de l'utilisateur
    const response = await axios.get(
      `${config.public.woocommerceUrl}/wp-json/custom/v1/orders/user/${userId}`,
      {
        params: {
          consumer_key: config.private.woocommerceKey,
          consumer_secret: config.private.woocommerceSecret,
        },
        timeout: 10000,
        headers: {
          'User-Agent': 'Nuxt-WooCommerce-Client/1.0',
        },
      }
    );
    
    // L'API WordPress est censée renvoyer directement la liste des commandes
    return response.data;

  } catch (err: any) {
    console.error(`Erreur récupération commandes pour user ${userId}:`, {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data, // Loguer les données de la réponse WordPress
      config: err.config, // Loguer la configuration de la requête Axios
      url: err.config?.url // Loguer l'URL exacte appelée
    });

    throw createError({
      statusCode: err.response?.status || 500,
      statusMessage: err.response?.data?.message || err.message || 'Erreur interne du serveur lors de la récupération des commandes.'
    });
  }
});
