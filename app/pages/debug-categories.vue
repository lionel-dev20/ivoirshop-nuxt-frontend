<template>
  <div class="max-w-7xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">🔍 Debug - Catégories disponibles</h1>
    
    <div v-if="pending" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Chargement des catégories...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
      <h2 class="text-xl font-semibold text-red-800 mb-2">❌ Erreur</h2>
      <p class="text-red-600">{{ error }}</p>
    </div>

    <div v-else-if="categories" class="space-y-4">
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-blue-900 mb-2">📊 Résumé</h2>
        <p class="text-blue-700">Total : <strong>{{ categories.length }}</strong> catégories trouvées</p>
      </div>

      <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produits</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="category in categories" :key="category.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ category.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ category.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <code class="px-2 py-1 bg-gray-100 text-sm text-blue-600 rounded">{{ category.slug }}</code>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ category.count || 0 }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ category.parent || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button 
                  @click="copySlug(category.slug)"
                  class="text-blue-600 hover:text-blue-800 font-medium"
                >
                  📋 Copier slug
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bg-green-50 border border-green-200 rounded-lg p-6 mt-6">
        <h2 class="text-xl font-semibold text-green-900 mb-4">💡 Comment utiliser (AUTOMATIQUE)</h2>
        <div class="space-y-3 text-green-800">
          <div class="bg-white border border-green-300 rounded p-4">
            <p class="font-semibold mb-2">✨ Méthode 1 : Par SLUG (flexible)</p>
            <pre class="text-sm"><code>&lt;Nouveaute category-slug="votre-slug" /&gt;</code></pre>
            <p class="text-sm mt-2">👉 Le composant trouvera automatiquement la catégorie, même si le slug a légèrement changé !</p>
          </div>
          
          <div class="bg-white border border-green-300 rounded p-4">
            <p class="font-semibold mb-2">🎯 Méthode 2 : Par ID (recommandé - plus stable)</p>
            <pre class="text-sm"><code>&lt;Nouveaute :category-id="123" /&gt;</code></pre>
            <p class="text-sm mt-2">✅ L'ID ne change jamais, c'est la méthode la plus fiable !</p>
          </div>

          <div class="bg-blue-50 border border-blue-300 rounded p-4">
            <p class="font-semibold text-blue-900 mb-2">🔍 En cas de problème</p>
            <p class="text-sm text-blue-800">
              • Vérifiez la console du navigateur (F12) pour voir les logs détaillés<br>
              • Le composant suggérera automatiquement le bon slug/ID à utiliser<br>
              • Une recherche flexible est effectuée si le slug exact n'est pas trouvé
            </p>
          </div>
        </div>
      </div>

      <div class="bg-orange-50 border border-orange-200 rounded-lg p-6 mt-4">
        <h2 class="text-xl font-semibold text-orange-900 mb-4">⚡ Nouveautés</h2>
        <ul class="space-y-2 text-orange-800">
          <li>✅ Recherche intelligente par slug (même si le slug change légèrement)</li>
          <li>✅ Support de l'ID de catégorie (méthode recommandée)</li>
          <li>✅ Logs détaillés dans la console pour débogage facile</li>
          <li>✅ Messages d'erreur clairs avec suggestions</li>
          <li>✅ Lien direct vers cette page depuis les erreurs</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: categories, pending, error } = await useLazyAsyncData(
  'debug-categories',
  async () => {
    try {
      const cats = await $fetch('/api/api/v1/categories')
      console.log('✅ Catégories récupérées:', cats)
      return cats
    } catch (err) {
      console.error('❌ Erreur:', err)
      throw err
    }
  }
)

const copySlug = (slug) => {
  navigator.clipboard.writeText(slug)
  alert(`✅ Slug copié : "${slug}"`)
}
</script>

