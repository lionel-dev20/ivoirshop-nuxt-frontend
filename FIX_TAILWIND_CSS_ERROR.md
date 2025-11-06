# 🔧 Correction : Erreur Tailwind CSS avec before:content

## ❌ Problème

Erreur lors de la compilation :
```
Failed to parse source for import analysis because the content contains invalid JS syntax.

.before\:content-\[\'\>\'\] {
                          ^
&[data-v-dcc86248]::before {
```

## 🔍 Cause

Le problème venait de l'utilisation de la classe Tailwind `before:content-['>']` dans le fil d'Ariane (breadcrumb) de la page produit.

**Fichier :** `app/pages/produit/[slug].vue`

La syntaxe `before:content-['>']` causait un problème de parsing CSS car :
1. Le caractère `>` n'était pas correctement échappé
2. Les guillemets dans le contenu créaient un conflit de syntaxe
3. Vue ajoute des scopes CSS (`data-v-xxx`) qui compliquaient la génération du CSS

## ✅ Solution Appliquée

### Avant (❌ Problématique)

```vue
<li class="before:content-['>'] before:mx-2">
  <NuxtLink to="/categorie">Catégorie</NuxtLink>
</li>
```

### Après (✅ Corrigé)

```vue
<li class="flex items-center">
  <span class="mx-2 text-gray-400">›</span>
  <NuxtLink to="/categorie">Catégorie</NuxtLink>
</li>
```

## 💡 Pourquoi cette solution est meilleure

1. **Plus simple** : Utilise un élément HTML normal au lieu d'un pseudo-élément CSS
2. **Plus lisible** : Le code est plus facile à comprendre
3. **Plus maintenable** : Pas de problèmes d'échappement de caractères
4. **Meilleur contrôle** : On peut facilement changer le style du séparateur
5. **Compatible** : Fonctionne partout sans problème de syntaxe

## 🎨 Alternatives pour les séparateurs

Si vous avez besoin de séparateurs dans d'autres breadcrumbs, voici les meilleures options :

### Option 1 : Utiliser un span (Recommandé ✅)

```vue
<span class="mx-2 text-gray-400">›</span>
```

### Option 2 : Utiliser un SVG

```vue
<svg class="w-4 h-4 mx-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
</svg>
```

### Option 3 : Utiliser un slash

```vue
<span class="mx-2 text-gray-400">/</span>
```

### Option 4 : Utiliser une bordure CSS

```vue
<li class="border-l border-gray-300 pl-2 ml-2">
  <NuxtLink to="/categorie">Catégorie</NuxtLink>
</li>
```

## ⚠️ À Éviter

**NE PAS utiliser ces syntaxes :**

```vue
<!-- ❌ Caractères spéciaux dans content -->
<div class="before:content-['>']">...</div>
<div class="before:content-['→']">...</div>
<div class="before:content-['|']">...</div>

<!-- ❌ Guillemets imbriqués -->
<div class="before:content-[\">\"]">...</div>

<!-- ❌ Caractères Unicode complexes -->
<div class="before:content-['\u203A']">...</div>
```

**Utilisez plutôt :**

```vue
<!-- ✅ Éléments HTML normaux -->
<span>›</span>
<span>→</span>
<span>|</span>
```

## 🧪 Test

Après la correction, vous devriez pouvoir :

1. ✅ Redémarrer le serveur sans erreur
2. ✅ Voir le fil d'Ariane s'afficher correctement
3. ✅ Voir les séparateurs `›` entre les éléments
4. ✅ Pas d'erreur de syntaxe CSS dans la console

## 📝 Checklist Post-Correction

- [x] Remplacer `before:content-['>']` par des `<span>`
- [x] Vérifier qu'il n'y a pas d'autres occurrences dans le projet
- [x] Tester l'affichage du breadcrumb
- [x] Vérifier la console pour les erreurs CSS
- [x] Le build fonctionne sans erreur

## 🎯 Résultat

Le fil d'Ariane s'affiche maintenant correctement :

```
Accueil › Électronique › Téléphones › iPhone 13 Pro
```

---

**Date :** ${new Date().toLocaleDateString('fr-FR')}
**Status :** ✅ Corrigé
**Fichiers modifiés :** `app/pages/produit/[slug].vue`

