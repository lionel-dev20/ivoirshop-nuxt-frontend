# 📱 Alignement du header du carousel sur mobile

## ✅ Modification effectuée

Le header du composant `ProductCarousel.vue` a été modifié pour **garder le titre et les boutons de navigation sur la même ligne** sur mobile, avec le titre **aligné à gauche**.

---

## 🎯 Comportement

### Avant ❌

**Sur mobile** :
```
┌─────────────────────────────┐
│  Produits recommandés       │  ← Titre centré
│         (seul)              │
├─────────────────────────────┤
│                    ← →      │  ← Boutons en bas
└─────────────────────────────┘
```

- Titre et boutons en **colonne** (`flex-col`)
- Titre au **centre**
- Beaucoup d'espace vertical perdu
- UX moins optimale

### Après ✅

**Sur mobile** :
```
┌─────────────────────────────┐
│ Produits          ← →       │  ← Titre à gauche + Boutons à droite
└─────────────────────────────┘
```

- Titre et boutons sur la **même ligne** (`flex-row`)
- Titre **aligné à gauche**
- Boutons de navigation **à droite**
- Plus compact et moderne
- Meilleure UX mobile

---

## 🔧 Modifications CSS

### Titre principal

```css
/* Avant */
.carousel-title {
  @apply md:text-2xl text-lg font-bold mb-0;
}

/* Après */
.carousel-title {
  @apply md:text-2xl text-base font-bold mb-0 text-left flex-1;
}
```

**Changements** :
- `text-base` au lieu de `text-lg` sur mobile (plus petit)
- `text-left` ajouté (alignement à gauche)
- `flex-1` ajouté (prend l'espace disponible)

### Header responsive (mobile)

```css
/* Avant */
@media (max-width: 640px) {
  .carousel-header {
    @apply flex-col items-start space-y-4;  /* Colonne */
  }
  
  .carousel-navigation {
    @apply self-end;
  }
}

/* Après */
@media (max-width: 640px) {
  .carousel-header {
    @apply flex-row items-center justify-between gap-2;  /* Ligne */
  }
  
  .carousel-title {
    @apply text-left text-sm;  /* Aligné à gauche */
  }
  
  .carousel-navigation {
    @apply flex-shrink-0 space-x-1;  /* Ne rétrécit pas */
  }
  
  .nav-button {
    @apply w-7 h-7;  /* Boutons plus petits */
  }
  
  .nav-button svg {
    @apply w-4 h-4;  /* Icônes plus petites */
  }
}
```

**Changements** :
- `flex-row` au lieu de `flex-col` → Garde tout sur une ligne
- `items-center justify-between` → Titre à gauche, boutons à droite
- `gap-2` → Petit espace entre titre et boutons
- `text-sm` → Titre encore plus petit sur mobile
- Boutons : `w-7 h-7` au lieu de `w-8 h-8` → Plus compacts
- Icônes : `w-4 h-4` au lieu de `w-5 h-5` → Plus petites

---

## 📐 Layout comparatif

### Desktop (> 640px)

**Pas de changement** - Reste identique :

```
┌──────────────────────────────────────────────────────┐
│  Produits recommandés              [Voir tout]  ← →  │
└──────────────────────────────────────────────────────┘
```

### Mobile (≤ 640px)

**AVANT** :
```
┌─────────────────────────────┐
│                             │
│  Produits recommandés       │  ← Titre centré (text-lg)
│                             │
│                             │
│                    ← →      │  ← Boutons en bas
│                             │
└─────────────────────────────┘
    ↑ Beaucoup d'espace perdu
```

**APRÈS** :
```
┌─────────────────────────────┐
│ Produits rec...   ← →       │  ← Tout sur une ligne
└─────────────────────────────┘
    ↑ Compact et efficace
```

---

## 🎨 Tailles de texte

| Écran | Avant | Après |
|-------|-------|-------|
| **Mobile (≤ 640px)** | `text-lg` (1.125rem) | `text-sm` (0.875rem) |
| **Desktop (> 640px)** | `text-2xl` (1.5rem) | `text-2xl` (1.5rem) ✅ |

Sur mobile, le titre est maintenant plus petit pour laisser de la place aux boutons.

---

## 🎯 Tailles des boutons

| Écran | Avant | Après |
|-------|-------|-------|
| **Mobile (≤ 640px)** | 32px × 32px | 28px × 28px ✨ |
| **Desktop (> 640px)** | 32px × 32px | 32px × 32px ✅ |

Les boutons sont légèrement plus petits sur mobile pour un meilleur équilibre.

---

## 🧪 Tests

### Test 1 : Affichage mobile (30s)

1. Ouvrir le site en mode responsive (F12)
2. Sélectionner "iPhone 12" ou similaire (≤ 640px)
3. Trouver un carousel avec titre (ex: "Produits recommandés")

**✅ Résultat attendu** :
- Titre et boutons sur la **même ligne**
- Titre **aligné à gauche**
- Boutons de navigation **à droite**
- Titre **plus petit** que sur desktop

### Test 2 : Redimensionnement (20s)

1. Commencer en mode desktop
2. **Observer** : Titre grand, tout sur une ligne
3. **Redimensionner** vers mobile (< 640px)
4. **Observer** : Titre plus petit, toujours sur une ligne

**✅ Résultat attendu** :
- Transition fluide
- Pas de "saut" ou flash
- Layout reste cohérent

### Test 3 : Boutons fonctionnels (15s)

1. Mode mobile
2. **Cliquer** sur bouton ← (précédent)
3. **Cliquer** sur bouton → (suivant)

**✅ Résultat attendu** :
- Boutons fonctionnent normalement
- Carousel glisse
- Pas de bug visuel

### Test 4 : Titre long (20s)

1. Mode mobile
2. Trouver un carousel avec un titre très long

**✅ Résultat attendu** :
- Titre tronqué avec "..." si trop long
- Boutons restent visibles
- Pas de débordement horizontal

---

## 📱 Breakpoint

Le changement s'applique à **640px** :

```css
@media (max-width: 640px) {
  /* Styles mobiles */
}
```

**Pourquoi 640px ?**
- Standard Tailwind pour `sm:`
- Couvre la plupart des smartphones
- Cohérent avec le reste du site

---

## 🔧 Personnalisation

### Changer la taille du titre mobile

```css
/* Dans @media (max-width: 640px) */
.carousel-title {
  @apply text-left text-xs;  /* Plus petit */
  /* ou */
  @apply text-left text-base;  /* Plus grand */
}
```

### Changer le breakpoint

```css
/* Appliquer sur tablettes aussi */
@media (max-width: 768px) {
  /* ... */
}

/* Ou seulement petits mobiles */
@media (max-width: 480px) {
  /* ... */
}
```

### Remettre l'ancien style (colonne)

```css
@media (max-width: 640px) {
  .carousel-header {
    @apply flex-col items-start space-y-4;  /* Revient à l'ancien */
  }
}
```

---

## 💡 Avantages

### UX
- ⚡ **Plus compact** : Moins d'espace vertical perdu
- 👍 **Plus moderne** : Layout horizontal sur mobile
- 🎯 **Meilleur équilibre** : Titre à gauche, boutons à droite
- 📱 **Mobile-first** : Optimisé pour petits écrans

### Lisibilité
- 👀 **Titre visible** : Toujours à gauche (position naturelle)
- 🔘 **Boutons accessibles** : Toujours visibles à droite
- 📏 **Proportion adaptée** : Tailles ajustées au mobile

### Cohérence
- ✨ **Design uniforme** : Même layout que les autres sections
- 🎨 **Hiérarchie claire** : Titre principal, actions secondaires
- 📐 **Grille respectée** : Alignement propre

---

## 🐛 Dépannage

### Problème 1 : Titre toujours centré

**Symptôme** : Le titre reste au centre au lieu d'être à gauche.

**Solutions** :
1. Vérifier que vous êtes en mode mobile (≤ 640px)
2. Forcer un refresh : Ctrl+Shift+R
3. Vérifier qu'il n'y a pas de style inline qui surcharge

### Problème 2 : Boutons en dessous

**Symptôme** : Les boutons passent en dessous du titre.

**Solutions** :
1. Vérifier la largeur de l'écran
2. Le titre est peut-être trop long → Sera tronqué automatiquement
3. Vérifier `flex-row` dans les DevTools

### Problème 3 : Texte trop petit

**Symptôme** : Le titre est illisible sur mobile.

**Solution** :
```css
.carousel-title {
  @apply text-left text-base;  /* Au lieu de text-sm */
}
```

---

## ✅ Checklist

- [x] Code CSS modifié
- [x] Titre aligné à gauche sur mobile
- [x] Boutons restent à droite
- [x] Tout sur une ligne (flex-row)
- [x] Tailles réduites sur mobile
- [x] Breakpoint à 640px
- [x] Desktop inchangé
- [x] Documentation créée
- [ ] Tests sur appareils réels
- [ ] Validation UX

---

## 📚 Fichier modifié

```
📦 app/components/
└── ✏️ ProductCarousel.vue
    └── <style scoped>
        ├── .carousel-title (ligne 433-435)
        │   └── Ajout : text-left flex-1
        │   └── Modif : text-base au lieu de text-lg
        │
        └── @media (max-width: 640px) (ligne 536-556)
            ├── .carousel-header : flex-row au lieu de flex-col
            ├── .carousel-title : text-left text-sm
            ├── .carousel-navigation : flex-shrink-0
            ├── .nav-button : w-7 h-7
            └── .nav-button svg : w-4 h-4
```

---

## 🎉 Résultat

Sur mobile, le header du carousel est maintenant **aligné horizontalement** avec :
- ✅ Titre **à gauche**
- ✅ Boutons de navigation **à droite**
- ✅ Tout sur **une seule ligne**
- ✅ Tailles **optimisées** pour mobile

**UX mobile améliorée ! 📱✨**

