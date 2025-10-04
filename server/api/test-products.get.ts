// server/api/test-products.get.ts
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { categorySlug } = query

  console.log('=== Test Products API ===')
  console.log('Category slug:', categorySlug)

  // Produits de test basés sur la catégorie
  const testProducts: any = {
    smartphones: [
      {
        id: 1,
        name: 'iPhone 15 Pro Max',
        slug: 'iphone-15-pro-max',
        description: 'Le dernier iPhone avec puce A17 Pro et caméra Pro 48MP',
        price: '1199.99',
        regularPrice: '1199.99',
        salePrice: null,
        image: '/images/placeholder-product.jpg',
        images: ['/images/placeholder-product.jpg'],
        stockStatus: 'instock',
        onSale: false,
        featured: true,
        categories: [
          { id: 1, name: 'Smartphones', slug: 'smartphones' }
        ]
      },
      {
        id: 2,
        name: 'Samsung Galaxy S24 Ultra',
        slug: 'samsung-galaxy-s24-ultra',
        description: 'Smartphone Android premium avec S Pen et caméra 200MP',
        price: '1299.99',
        regularPrice: '1399.99',
        salePrice: '1299.99',
        image: '/images/placeholder-product.jpg',
        images: ['/images/placeholder-product.jpg'],
        stockStatus: 'instock',
        onSale: true,
        featured: true,
        categories: [
          { id: 1, name: 'Smartphones', slug: 'smartphones' }
        ]
      },
      {
        id: 3,
        name: 'Google Pixel 8 Pro',
        slug: 'google-pixel-8-pro',
        description: 'Smartphone Google avec IA intégrée et caméra Magic Eraser',
        price: '999.99',
        regularPrice: '999.99',
        salePrice: null,
        image: '/images/placeholder-product.jpg',
        images: ['/images/placeholder-product.jpg'],
        stockStatus: 'instock',
        onSale: false,
        featured: false,
        categories: [
          { id: 1, name: 'Smartphones', slug: 'smartphones' }
        ]
      },
      {
        id: 4,
        name: 'OnePlus 12',
        slug: 'oneplus-12',
        description: 'Smartphone Android avec charge rapide 100W',
        price: '799.99',
        regularPrice: '899.99',
        salePrice: '799.99',
        image: '/images/placeholder-product.jpg',
        images: ['/images/placeholder-product.jpg'],
        stockStatus: 'instock',
        onSale: true,
        featured: false,
        categories: [
          { id: 1, name: 'Smartphones', slug: 'smartphones' }
        ]
      },
      {
        id: 5,
        name: 'Xiaomi 14 Pro',
        slug: 'xiaomi-14-pro',
        description: 'Smartphone Xiaomi avec écran LTPO et caméra Leica',
        price: '699.99',
        regularPrice: '699.99',
        salePrice: null,
        image: '/images/placeholder-product.jpg',
        images: ['/images/placeholder-product.jpg'],
        stockStatus: 'instock',
        onSale: false,
        featured: false,
        categories: [
          { id: 1, name: 'Smartphones', slug: 'smartphones' }
        ]
      }
    ],
    electromenager: [
      {
        id: 6,
        name: 'Réfrigérateur Samsung 4 Portes',
        slug: 'refrigerateur-samsung-4-portes',
        description: 'Réfrigérateur 4 portes avec technologie Twin Cooling Plus',
        price: '1299.99',
        regularPrice: '1499.99',
        salePrice: '1299.99',
        image: '/images/placeholder-product.jpg',
        images: ['/images/placeholder-product.jpg'],
        stockStatus: 'instock',
        onSale: true,
        featured: true,
        categories: [
          { id: 2, name: 'Électroménager', slug: 'electromenager' }
        ]
      },
      {
        id: 7,
        name: 'Lave-linge LG 10kg',
        slug: 'lave-linge-lg-10kg',
        description: 'Lave-linge LG 10kg avec technologie Direct Drive',
        price: '699.99',
        regularPrice: '799.99',
        salePrice: '699.99',
        image: '/images/placeholder-product.jpg',
        images: ['/images/placeholder-product.jpg'],
        stockStatus: 'instock',
        onSale: true,
        featured: true,
        categories: [
          { id: 2, name: 'Électroménager', slug: 'electromenager' }
        ]
      },
      {
        id: 8,
        name: 'Lave-vaisselle Bosch',
        slug: 'lave-vaisselle-bosch',
        description: 'Lave-vaisselle Bosch 12 couverts avec classe A+++',
        price: '599.99',
        regularPrice: '599.99',
        salePrice: null,
        image: '/images/placeholder-product.jpg',
        images: ['/images/placeholder-product.jpg'],
        stockStatus: 'instock',
        onSale: false,
        featured: false,
        categories: [
          { id: 2, name: 'Électroménager', slug: 'electromenager' }
        ]
      },
      {
        id: 9,
        name: 'Four Electrolux',
        slug: 'four-electrolux',
        description: 'Four électrique Electrolux avec chaleur tournante',
        price: '399.99',
        regularPrice: '399.99',
        salePrice: null,
        image: '/images/placeholder-product.jpg',
        images: ['/images/placeholder-product.jpg'],
        stockStatus: 'instock',
        onSale: false,
        featured: false,
        categories: [
          { id: 2, name: 'Électroménager', slug: 'electromenager' }
        ]
      }
    ]
  }

  const products = categorySlug && testProducts[categorySlug] 
    ? testProducts[categorySlug] 
    : []

  return {
    products,
    total: products.length,
    page: 1,
    limit: 12,
    category: categorySlug || 'all'
  }
})

