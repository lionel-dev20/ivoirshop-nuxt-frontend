# 🧪 Guide de test - Améliorations de la Recherche

## Test rapide (2 minutes)

### ✅ Test 1 : Mobile - Entrée redirige (30s)

**Sur mobile ou responsive mode** :

1. Ouvrir votre navigateur en mode responsive (F12 → Toggle device toolbar)
2. Choisir "iPhone 12" ou similaire
3. Cliquer sur la barre de recherche
4. Taper : `Samsung`
5. Appuyer sur **Entrée** ⏎

**✅ Résultat attendu** :
```
✓ Redirection vers /recherche?q=Samsung
✓ Clavier mobile se ferme automatiquement
✓ Page de résultats s'affiche
```

**❌ Si ça ne marche pas** :
- Vérifier que vous êtes bien en mode responsive (≤ 768px)
- Vérifier la console pour les erreurs (F12)

---

### ✅ Test 2 : Desktop - Clic droit sur produit (30s)

**Sur desktop** :

1. Ouvrir le site en plein écran (desktop)
2. Cliquer sur la barre de recherche
3. Taper : `iPhone`
4. **Attendre les suggestions** (1-2 secondes)
5. **Clic droit** sur un produit suggéré
6. Sélectionner "Ouvrir le lien dans un nouvel onglet"

**✅ Résultat attendu** :
```
✓ Menu contextuel du navigateur s'ouvre
✓ Option "Ouvrir dans un nouvel onglet" disponible
✓ Clic ouvre le produit dans un nouvel onglet
✓ Onglet actuel ne bouge pas
```

**❌ Si ça ne marche pas** :
- Les suggestions apparaissent mais pas de menu au clic droit → Bug
- Vérifier que vous cliquez bien sur une suggestion de **produit** (pas catégorie)

---

### ✅ Test 3 : Desktop - URL au survol (20s)

**Sur desktop** :

1. Cliquer sur la barre de recherche
2. Taper : `Samsung`
3. **Survoler** (sans cliquer) une suggestion de produit
4. **Regarder en bas à gauche du navigateur**

**✅ Résultat attendu** :
```
✓ URL visible en bas à gauche
✓ Format : https://votre-site.com/produit/samsung-galaxy-s21
✓ URL change quand vous changez de suggestion survolée
```

---

### ✅ Test 4 : Mobile - Recherche directe sans suggestions (20s)

**Sur mobile** :

1. Mode responsive (iPhone, etc.)
2. Cliquer sur la barre de recherche
3. Taper rapidement : `Test123` (terme qui ne donne pas de suggestions)
4. Appuyer immédiatement sur **Entrée** ⏎

**✅ Résultat attendu** :
```
✓ Redirection vers /recherche?q=Test123
✓ Pas d'erreur même sans suggestions
✓ Page "Aucun résultat" s'affiche correctement
```

---

### ✅ Test 5 : Desktop - Clic normal fonctionne toujours (20s)

**Sur desktop** :

1. Barre de recherche → Taper `Apple`
2. Attendre les suggestions
3. **Clic gauche normal** sur un produit

**✅ Résultat attendu** :
```
✓ Navigation vers la page produit
✓ Suggestions se ferment
✓ Pas d'erreur console
```

---

## 🐛 Problèmes connus et solutions

### Problème 1 : Clavier ne se ferme pas sur mobile

**Symptôme** : Sur mobile, après avoir appuyé sur Entrée, le clavier reste affiché.

**Solution** :
1. Vérifier que vous êtes bien en mode responsive (≤ 768px)
2. Essayer sur un vrai appareil mobile
3. Vérifier la console pour les erreurs JavaScript

### Problème 2 : Clic droit ne fonctionne pas

**Symptôme** : Clic droit sur une suggestion ne montre pas le menu contextuel.

**Causes possibles** :
- Vous cliquez sur une suggestion de "Recherche" au lieu d'un "Produit"
- Un autre événement JavaScript bloque le clic droit

**Solution** :
- Vérifier que vous cliquez bien sur un **produit** (avec image)
- Ouvrir la console et chercher les erreurs

### Problème 3 : URL ne s'affiche pas au survol

**Symptôme** : En survolant une suggestion, pas d'URL visible en bas du navigateur.

**Solution** :
- C'est peut-être un comportement du navigateur (certains masquent l'URL)
- Essayer dans Chrome/Firefox
- Vérifier que c'est bien un `<NuxtLink>` (Inspecter l'élément → doit être un `<a>`)

---

## 📊 Checklist complète

Cochez au fur et à mesure :

### Mobile (≤ 768px)
- [ ] Entrée redirige vers page de recherche
- [ ] Clavier se ferme automatiquement
- [ ] Pas d'erreur dans la console
- [ ] Suggestions se ferment après recherche
- [ ] Fonctionne sur Chrome mobile
- [ ] Fonctionne sur Safari iOS

### Desktop (> 768px)
- [ ] Clic normal sur suggestion fonctionne
- [ ] Clic droit → "Ouvrir dans nouvel onglet" fonctionne
- [ ] URL visible au survol
- [ ] Catégories cliquables
- [ ] Produits cliquables
- [ ] Pas de soulignement bleu sur les liens
- [ ] Hover change le fond en gris clair

### Général
- [ ] Autocomplétion fonctionne toujours
- [ ] Cache des suggestions fonctionne
- [ ] Navigation au clavier (flèches) fonctionne
- [ ] Échap ferme les suggestions
- [ ] Pas d'erreur dans la console
- [ ] Performance reste fluide

---

## 🎥 Scénario de test complet (5 minutes)

### Scénario utilisateur mobile typique

1. **Ouverture du site** sur mobile
2. **Recherche d'un produit**
   - Tap sur la barre de recherche
   - Clavier s'ouvre
   - Tape "Samsung Galaxy"
   - Voit les suggestions
   - Tap sur Entrée
   - ✅ Clavier se ferme + redirection
3. **Nouvelle recherche avec suggestion**
   - Tap sur la barre de recherche
   - Tape "iPhone"
   - Voit les suggestions
   - Tap sur un produit suggéré
   - ✅ Va directement sur la page produit

### Scénario utilisateur desktop typique

1. **Ouverture du site** sur desktop
2. **Recherche exploratoire**
   - Clic sur barre de recherche
   - Tape "Samsung"
   - Survole les suggestions
   - ✅ Voit les URLs au survol
   - Clic droit sur un produit
   - "Ouvrir dans un nouvel onglet"
   - ✅ Nouvel onglet s'ouvre
3. **Recherche rapide**
   - Tape "Apple Watch"
   - Appuie sur Entrée
   - ✅ Page de recherche s'affiche

---

## 🚨 Que faire en cas de bug ?

### 1. Capturer l'information

```bash
# Console du navigateur (F12)
- Copier les messages d'erreur
- Noter la ligne et le fichier

# Informations système
- Navigateur : Chrome 120 / Firefox 121 / Safari 17
- OS : Windows 11 / macOS 14 / iOS 17
- Taille d'écran : 375x667 (mobile) / 1920x1080 (desktop)
```

### 2. Vérifier les bases

```javascript
// Ouvrir la console et taper :
console.log(window.innerWidth)
// Résultat attendu : 375 (mobile) ou 1920 (desktop)

// Vérifier que NuxtLink existe
document.querySelectorAll('a[href^="/produit/"]').length
// Résultat attendu : > 0 (au moins un lien produit)
```

### 3. Réessayer après

- Vider le cache (Ctrl+Shift+R)
- Redémarrer le serveur Nuxt (`npm run dev`)
- Essayer en navigation privée

---

## ✅ Tout fonctionne !

Si tous les tests passent :

🎉 **Félicitations !** Les améliorations de recherche sont opérationnelles.

**Prochaines étapes** :
1. Tester sur un vrai appareil mobile (pas seulement responsive mode)
2. Tester sur différents navigateurs
3. Demander à des utilisateurs de tester
4. Monitorer les analytics de recherche

---

## 📝 Rapport de test

Remplissez ce rapport après vos tests :

```
Date : _____________
Testeur : _____________

Mobile (iPhone 12 Pro, Chrome)
✅ Test 1 : Entrée redirige - OK
✅ Test 2 : Clavier se ferme - OK
❌ Test 3 : Suggestions - BUG (détails : _________)

Desktop (Windows 11, Chrome)
✅ Test 1 : Clic droit - OK
✅ Test 2 : URL au survol - OK
✅ Test 3 : Navigation - OK

Bugs trouvés :
1. _____________
2. _____________

Notes supplémentaires :
_____________
```

---

## 📚 Ressources

- **Documentation complète** : `docs/SEARCH-IMPROVEMENTS.md`
- **Fichier source** : `app/components/SearchBox.vue`
- **API d'autocomplétion** : `server/api/search/autocomplete.get.ts`

Pour toute question, consultez d'abord la documentation complète ! 🚀

