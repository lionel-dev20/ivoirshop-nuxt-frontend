// server/utils/catalog.ts
// Helpers de mise en forme du catalogue WooCommerce (classes de livraison,
// facettes de filtrage) partagés par les endpoints de listing.
//
// Note : server/api/woocommerce/category/[...slug].ts contient encore ses
// propres copies de ces fonctions. Elles n'ont pas été retirées pour ne pas
// toucher au parcours catégorie, qui fonctionne. À unifier si l'occasion se
// présente.

/** Libellés français des attributs WooCommerce affichés dans les filtres. */
const ATTRIBUTE_LABELS: Record<string, string> = {
  color: 'Couleur',
  colour: 'Couleur',
  size: 'Taille',
  storage: 'Stockage',
  capacity: 'Capacité',
  ram: 'Mémoire RAM',
  brand: 'Marque',
  marque: 'Marque',
  material: 'Matériau',
  weight: 'Poids',
  dimensions: 'Dimensions',
  'screen-size': "Taille d'écran",
  processor: 'Processeur',
  'operating-system': "Système d'exploitation",
  connectivity: 'Connectivité',
  warranty: 'Garantie',
}

export function formatAttributeLabel(name: string): string {
  const normalized = name.toLowerCase().replace(/[_\s]+/g, '-')
  return ATTRIBUTE_LABELS[normalized] || name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ')
}

/**
 * Classe de livraison d'un produit : valeur explicite si présente, sinon
 * déduite du poids. Même logique que le parcours catégorie, afin que le
 * calcul des frais de livraison reste cohérent d'une page à l'autre.
 */
export function determineShippingClass(product: any): 'light' | 'medium' | 'heavy' {
  const raw = String(product?.shipping_class || '').toLowerCase()

  if (raw === 'light' || raw === 'leger' || raw === 'léger') return 'light'
  if (raw === 'medium' || raw === 'moyen') return 'medium'
  if (raw === 'heavy' || raw === 'lourd') return 'heavy'

  const weight = parseFloat(product?.weight)
  if (Number.isFinite(weight) && weight > 0) {
    if (weight < 2) return 'light'
    if (weight <= 10) return 'medium'
    return 'heavy'
  }

  return 'medium'
}

/**
 * Construit les facettes de filtrage (attributs de variation + catégories)
 * à partir d'une liste de produits, au format attendu par ProductFilters.vue.
 */
export function buildProductFacets(products: any[]) {
  const attributesMap = new Map<string, Set<string>>()
  const categoriesMap = new Map<number, { id: number; name: string; slug: string; parent: number; count: number }>()

  for (const product of products) {
    if (Array.isArray(product.attributes)) {
      for (const attr of product.attributes) {
        if (!attr?.variation) continue
        if (!attributesMap.has(attr.name)) attributesMap.set(attr.name, new Set())
        for (const option of attr.options || []) {
          attributesMap.get(attr.name)?.add(option)
        }
      }
    }

    if (Array.isArray(product.categories)) {
      for (const cat of product.categories) {
        if (!cat?.id) continue
        const existing = categoriesMap.get(cat.id)
        if (existing) {
          existing.count += 1
        } else {
          categoriesMap.set(cat.id, {
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            // Les catégories embarquées dans un produit n'exposent pas leur
            // parent : on les traite toutes comme racines dans les filtres.
            parent: 0,
            count: 1,
          })
        }
      }
    }
  }

  const attributes = Array.from(attributesMap.entries()).map(([name, values]) => ({
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    label: formatAttributeLabel(name),
    options: Array.from(values).map((value) => ({
      value,
      label: value,
      count: products.filter((p: any) =>
        p.attributes?.some((a: any) => a.name === name && a.options?.includes(value))
      ).length,
    })),
  }))

  const categories = Array.from(categoriesMap.values()).sort((a, b) => b.count - a.count)

  return { attributes, categories }
}
