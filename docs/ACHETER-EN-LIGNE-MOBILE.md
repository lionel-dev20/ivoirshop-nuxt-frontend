# 📱 Limitation Mobile - Composant "Acheter en Ligne"

## ✅ Modification effectuée

Le composant `AcheterEnLigne.vue` a été modifié pour **afficher seulement 4 lignes** (12 items) sur mobile au lieu d'afficher tous les 16 items.

---

## 🎯 Comportement

### Sur Mobile (< 768px)

1. **Affichage initial** : 4 lignes × 3 colonnes = **12 items**
2. **Bouton "Voir plus"** : Affiche les 4 items restants
3. **Bouton "Voir moins"** : Retourne à l'affichage initial de 12 items

### Sur Desktop (≥ 768px)

- **Affichage complet** : Tous les 16 items sont affichés
- **Pas de bouton** : Pas besoin de "Voir plus/moins"

---

## 📊 Calcul

```
Mobile : 3 colonnes (grid-cols-3)
Desktop : 8 colonnes (md:grid-cols-8)

Items total : 16

Mobile :
- Affichage initial : 4 lignes × 3 colonnes = 12 items
- Items cachés : 16 - 12 = 4 items
- Bouton "Voir plus (4)"
```

---

## 🔧 Code implémenté

### Template

```vue
<!-- Grille d'items -->
<div class="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8...">
  <NuxtLink v-for="item in displayedItems" ...>
    <!-- Item -->
  </NuxtLink>
</div>

<!-- Bouton "Voir plus" sur mobile -->
<div v-if="!showAll && isMobile" class="mt-4 flex justify-center md:hidden">
  <button @click="showAll = true">
    Voir plus ({{ items.length - mobileLimit }})
  </button>
</div>

<!-- Bouton "Voir moins" sur mobile -->
<div v-if="showAll && isMobile" class="mt-4 flex justify-center md:hidden">
  <button @click="showAll = false">
    Voir moins
  </button>
</div>
```

### Script

```typescript
import { ref, computed, onMounted, onUnmounted } from 'vue'

// État
const showAll = ref(false)         // Afficher tous les items ?
const isMobile = ref(false)        // Est-on sur mobile ?
const mobileLimit = 12             // Limite sur mobile (4 lignes × 3)

// Items affichés dynamiquement
const displayedItems = computed(() => {
  if (!isMobile.value) return items  // Desktop : tous les items
  return showAll.value ? items : items.slice(0, mobileLimit)
})

// Détection mobile
const checkScreenSize = () => {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth < 768
  }
}

// Lifecycle
onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})
```

---

## 🧪 Tests

### Test 1 : Affichage initial mobile (30s)

1. Ouvrir le site en mode responsive (≤ 768px)
2. Faire défiler jusqu'au composant "Acheter en Ligne"
3. **✅ Vérifier** : 12 items affichés (4 lignes × 3 colonnes)
4. **✅ Vérifier** : Bouton "Voir plus (4)" visible en bas

### Test 2 : Bouton "Voir plus" (20s)

1. Mode responsive mobile
2. Cliquer sur le bouton **"Voir plus (4)"**
3. **✅ Vérifier** : 16 items maintenant affichés
4. **✅ Vérifier** : Bouton devient "Voir moins"

### Test 3 : Bouton "Voir moins" (20s)

1. Après avoir cliqué sur "Voir plus"
2. Cliquer sur **"Voir moins"**
3. **✅ Vérifier** : Retour à 12 items
4. **✅ Vérifier** : Bouton devient "Voir plus (4)"

### Test 4 : Desktop - Tous affichés (15s)

1. Ouvrir en mode desktop (> 768px)
2. Aller au composant "Acheter en Ligne"
3. **✅ Vérifier** : Tous les 16 items affichés
4. **✅ Vérifier** : Pas de bouton "Voir plus/moins"

### Test 5 : Responsive - Transition (30s)

1. Ouvrir en mode mobile
2. Cliquer sur "Voir plus"
3. **Redimensionner** la fenêtre vers desktop
4. **✅ Vérifier** : Tous les items restent affichés
5. **✅ Vérifier** : Bouton disparaît

---

## 📐 Layout

### Mobile (< 768px)

```
┌─────────────────────────────────┐
│  Acheter en Ligne               │
├─────────┬─────────┬─────────────┤
│ Item 1  │ Item 2  │ Item 3      │  ← Ligne 1
├─────────┼─────────┼─────────────┤
│ Item 4  │ Item 5  │ Item 6      │  ← Ligne 2
├─────────┼─────────┼─────────────┤
│ Item 7  │ Item 8  │ Item 9      │  ← Ligne 3
├─────────┼─────────┼─────────────┤
│ Item 10 │ Item 11 │ Item 12     │  ← Ligne 4
└─────────┴─────────┴─────────────┘
┌─────────────────────────────────┐
│      [ Voir plus (4) ]          │  ← Bouton
└─────────────────────────────────┘
```

### Après "Voir plus"

```
┌─────────────────────────────────┐
│  Acheter en Ligne               │
├─────────┬─────────┬─────────────┤
│ Item 1  │ Item 2  │ Item 3      │
├─────────┼─────────┼─────────────┤
│ Item 4  │ Item 5  │ Item 6      │
├─────────┼─────────┼─────────────┤
│ Item 7  │ Item 8  │ Item 9      │
├─────────┼─────────┼─────────────┤
│ Item 10 │ Item 11 │ Item 12     │
├─────────┼─────────┼─────────────┤
│ Item 13 │ Item 14 │ Item 15     │  ← Ligne 5
├─────────┼─────────┼─────────────┤
│ Item 16 │         │             │  ← Ligne 6 (partielle)
└─────────┴─────────┴─────────────┘
┌─────────────────────────────────┐
│      [ Voir moins ]             │  ← Bouton
└─────────────────────────────────┘
```

### Desktop (≥ 768px)

```
┌────────────────────────────────────────────────────────────────┐
│  Acheter en Ligne                                              │
├───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┤
│ Item1 │ Item2 │ Item3 │ Item4 │ Item5 │ Item6 │ Item7 │ Item8 │
├───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┤
│ Item9 │Item10 │Item11 │Item12 │Item13 │Item14 │Item15 │Item16│
└───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┘
(Pas de bouton)
```

---

## 🎨 Styles du bouton

### Bouton "Voir plus"

```css
bg-primary              → Couleur primaire du site
text-white              → Texte blanc
rounded-lg              → Coins arrondis
hover:bg-primary-accent → Hover plus foncé
px-6 py-2               → Padding
text-sm font-medium     → Taille et poids du texte
```

### Bouton "Voir moins"

```css
bg-gray-200             → Fond gris clair
text-gray-700           → Texte gris foncé
hover:bg-gray-300       → Hover gris
```

---

## 🔧 Personnalisation

### Changer le nombre de lignes mobiles

```typescript
// Dans le script, ligne 67
const mobileLimit = 12  // Changer à 9 pour 3 lignes, 15 pour 5 lignes, etc.
```

### Changer le breakpoint mobile/desktop

```typescript
// Dans checkScreenSize(), ligne 83
isMobile.value = window.innerWidth < 768
//                                    ^^^
// Changer 768 à 1024 pour inclure les tablettes
```

### Masquer complètement le bouton

```vue
<!-- Dans le template, commenter les lignes 18-36 -->
<!-- Bouton "Voir plus" sur mobile uniquement -->
<!-- <div v-if="!showAll && isMobile"...> -->
```

---

## 💡 Pourquoi 4 lignes ?

### Avant (tous les items)

```
Mobile : 16 items / 3 colonnes = 5,33 lignes
→ Beaucoup de scroll
→ Page très longue
→ UX dégradée
```

### Après (4 lignes)

```
Mobile : 12 items / 3 colonnes = 4 lignes
→ Scroll réduit
→ Page plus légère
→ Option "Voir plus" pour les intéressés
→ Meilleure UX ✨
```

---

## 🎯 Avantages

### UX
- ⚡ **Page plus rapide** à charger visuellement
- 📱 **Moins de scroll** sur mobile
- 👍 **Choix utilisateur** : "Voir plus" si besoin
- 🎯 **Focus** sur les catégories principales

### Performance
- 🚀 **Moins d'éléments DOM** initialement
- 📊 **Rendu plus rapide** sur mobile
- 💾 **Économie de bande passante** (images lazy-load)

### Maintenance
- 🔧 **Facilement ajustable** : changer `mobileLimit`
- 📝 **Code propre** : computed property réactive
- 🧪 **Testable** : détection mobile claire

---

## 🐛 Dépannage

### Problème 1 : Bouton ne s'affiche pas

**Symptôme** : Pas de bouton "Voir plus" sur mobile

**Solutions** :
1. Vérifier que vous êtes en mode mobile (< 768px)
2. Vérifier que `items.length > mobileLimit` (16 > 12)
3. Ouvrir la console et taper : `window.innerWidth`

### Problème 2 : Tous les items affichés sur mobile

**Symptôme** : Les 16 items apparaissent même sur mobile

**Solutions** :
1. Vérifier que `isMobile` est `true` dans la console
2. Forcer un refresh (Ctrl+Shift+R)
3. Vérifier que le script setup est bien chargé

### Problème 3 : Bouton reste affiché sur desktop

**Symptôme** : Le bouton "Voir plus" apparaît sur grand écran

**Solutions** :
1. Vérifier la classe `md:hidden` sur le bouton
2. Redimensionner la fenêtre pour déclencher le resize
3. Vérifier que `window.innerWidth >= 768`

---

## ✅ Checklist

- [x] Code modifié
- [x] Limite mobile à 12 items (4 lignes)
- [x] Bouton "Voir plus" ajouté
- [x] Bouton "Voir moins" ajouté
- [x] Détection mobile/desktop
- [x] Responsive au redimensionnement
- [x] Desktop affiche tous les items
- [x] Documentation créée
- [ ] Tests sur appareils réels
- [ ] Validation UX

---

## 📚 Fichier modifié

```
📦 app/components/
└── ✏️ AcheterEnLigne.vue
    ├── Template : Boutons Voir plus/moins
    ├── Script : Détection mobile + computed
    └── Logic : Limite à 12 items sur mobile
```

---

## 🎉 Résultat

Sur mobile, le composant "Acheter en Ligne" affiche maintenant **seulement 4 lignes** (12 items) au lieu de toutes les afficher, avec un bouton "Voir plus" pour les utilisateurs intéressés.

**Meilleure UX mobile ! 📱✨**

