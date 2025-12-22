// server/api/wordpress/homepage-products.get.ts
import { defineEventHandler, getQuery, createError } from 'h3'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  
  const { 
    categories = '', 
    products_per_category = '8',
    featured_only = 'false',
    on_sale_only = 'false',
    include_hero_products = 'true'
  } = query

  if (!config.WORDPRESS_URL) {
    throw createError({
      statusCode: 500,
      statusMessage: 'WORDPRESS_URL not configured'
    })
  }

  try {
    
    // Construire les paramètres pour l'endpoint WordPress
    const params = new URLSearchParams({
      products_per_category: products_per_category as string,
      featured_only: featured_only as string,
      on_sale_only: on_sale_only as string,
      include_hero_products: include_hero_products as string
    })

    if (categories) {
      params.append('categories', categories as string)
    }

    // Appeler l'endpoint personnalisé WordPress
    const response = await $fetch(`${config.WORDPRESS_URL}/wp-json/api/v1/homepage-products?${params.toString()}`)

    if (response) {
      return response
    }

  } catch (error: any) {
  }

  // Fallback vers des produits de test
  return getFallbackHomepageProducts()
})

function getFallbackHomepageProducts() {
  return {
    hero_products: [
      {
        id: 1,
        name: 'Smartphone Samsung Galaxy S24',
        slug: 'smartphone-samsung-galaxy-s24',
        price: '299.99',
        regular_price: '349.99',
        sale_price: '299.99',
        on_sale: true,
        image: {
          src: '/images/placeholder-product.jpg',
          alt: 'Smartphone Samsung Galaxy S24'
        },
        short_description: 'Smartphone haut de gamme avec écran AMOLED 6.1 pouces',
        categories: [
          { id: 1, name: 'Électronique', slug: 'electronique' }
        ]
      },
      {
        id: 2,
        name: 'Ordinateur Portable HP Pavilion',
        slug: 'ordinateur-portable-hp-pavilion',
        price: '599.99',
        regular_price: '599.99',
        sale_price: null,
        on_sale: false,
        image: {
          src: '/images/placeholder-product.jpg',
          alt: 'Ordinateur Portable HP Pavilion'
        },
        short_description: 'Ordinateur portable performant pour le travail et les loisirs',
        categories: [
          { id: 1, name: 'Électronique', slug: 'electronique' }
        ]
      }
    ],
    categories_products: [
      {
        category: {
          id: 1,
          name: 'Nouveautés',
          slug: 'nouveaute',
          description: 'Découvrez nos derniers produits',
          products_count: 25
        },
        products: [
          {
            id: 3,
            name: 'Écouteurs Bluetooth Sony',
            slug: 'ecouteurs-bluetooth-sony',
            price: '89.99',
            regular_price: '89.99',
            sale_price: null,
            on_sale: false,
            image: {
              src: '/images/placeholder-product.jpg',
              alt: 'Écouteurs Bluetooth Sony'
            },
            permalink: '/produit/ecouteurs-bluetooth-sony'
          },
          {
            id: 4,
            name: 'Montre Connectée Apple Watch',
            slug: 'montre-connectee-apple-watch',
            price: '399.99',
            regular_price: '449.99',
            sale_price: '399.99',
            on_sale: true,
            image: {
              src: '/images/placeholder-product.jpg',
              alt: 'Montre Connectée Apple Watch'
            },
            permalink: '/produit/montre-connectee-apple-watch'
          }
        ]
      },
      {
        category: {
          id: 2,
          name: 'Électronique',
          slug: 'electronique',
          description: 'Smartphones, ordinateurs, accessoires',
          products_count: 150
        },
        products: [
          {
            id: 5,
            name: 'Tablette iPad Air',
            slug: 'tablette-ipad-air',
            price: '499.99',
            regular_price: '499.99',
            sale_price: null,
            on_sale: false,
            image: {
              src: '/images/placeholder-product.jpg',
              alt: 'Tablette iPad Air'
            },
            permalink: '/produit/tablette-ipad-air'
          },
          {
            id: 6,
            name: 'Casque Gaming Razer',
            slug: 'casque-gaming-razer',
            price: '129.99',
            regular_price: '149.99',
            sale_price: '129.99',
            on_sale: true,
            image: {
              src: '/images/placeholder-product.jpg',
              alt: 'Casque Gaming Razer'
            },
            permalink: '/produit/casque-gaming-razer'
          }
        ]
      }
    ],
    stats: {
      total_categories: 2,
      total_products: 4,
      cache_generated_at: new Date().toISOString()
    }
  }
}
