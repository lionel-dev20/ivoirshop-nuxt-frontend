// server/api/debug/test.get.ts
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { categorySlug } = query


  // Produits de test simples
  const testProducts = [
    {
      id: 1,
      name: 'Test Product 1',
      slug: 'test-product-1',
      description: 'Produit de test 1',
      price: '99.99',
      regularPrice: '99.99',
      salePrice: null,
      image: '/images/placeholder-product.jpg',
      images: ['/images/placeholder-product.jpg'],
      stockStatus: 'instock',
      onSale: false,
      featured: true,
      categories: [
        { id: 1, name: 'Test', slug: categorySlug || 'test' }
      ]
    },
    {
      id: 2,
      name: 'Test Product 2',
      slug: 'test-product-2',
      description: 'Produit de test 2',
      price: '199.99',
      regularPrice: '249.99',
      salePrice: '199.99',
      image: '/images/placeholder-product.jpg',
      images: ['/images/placeholder-product.jpg'],
      stockStatus: 'instock',
      onSale: true,
      featured: false,
      categories: [
        { id: 1, name: 'Test', slug: categorySlug || 'test' }
      ]
    },
    {
      id: 3,
      name: 'Test Product 3',
      slug: 'test-product-3',
      description: 'Produit de test 3',
      price: '299.99',
      regularPrice: '299.99',
      salePrice: null,
      image: '/images/placeholder-product.jpg',
      images: ['/images/placeholder-product.jpg'],
      stockStatus: 'instock',
      onSale: false,
      featured: false,
      categories: [
        { id: 1, name: 'Test', slug: categorySlug || 'test' }
      ]
    }
  ]

  return {
    products: testProducts,
    total: testProducts.length,
    page: 1,
    limit: 12,
    category: categorySlug || 'test',
    timestamp: new Date().toISOString()
  }
})

