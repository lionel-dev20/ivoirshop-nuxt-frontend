# 🚀 Guide de démarrage rapide - Filtres de Marques

## En 3 étapes simples

### Étape 1 : Vérifier l'endpoint WordPress ✅

Ouvrez votre navigateur et testez :
```
https://votre-site.com/wp-json/custom/v1/brands
```

**Résultat attendu** :
```json
{
  "brands": [...],
  "total": N
}
```

✅ Si ça fonctionne → Passez à l'étape 2  
❌ Si erreur → Vérifiez que le code a bien été ajouté dans `functions.php`

---

### Étape 2 : Configurer les marques dans WooCommerce ⚙️

**Option A : Installer un plugin (Recommandé)**

1. Aller dans WordPress Admin
2. Extensions → Ajouter
3. Rechercher "Perfect Brands for WooCommerce"
4. Installer et activer

**Option B : Utiliser un attribut**

1. WooCommerce → Produits → Attributs
2. Créer un attribut "Brand" ou "Marque"
3. Ajouter des termes : Apple, Samsung, Sony...

---

### Étape 3 : Assigner des marques aux produits 🏷️

1. Éditer un produit
2. Section "Marques" (ou "Attributs")
3. Sélectionner la marque
4. Mettre à jour

**Conseil** : Assignez des marques à au moins 5-10 produits pour voir le résultat !

---

## Test final 🎯

1. Ouvrir une page de catégorie : `/categorie/electronique`
2. Regarder la colonne de filtres à gauche
3. Voir la section "Marques" avec affichage en grille
4. Cocher une marque et voir les produits filtrés

---

## Résultat attendu

```
┌─────────────────────────────────────┐
│           MARQUES (12)              │
├─────────────────────────────────────┤
│  ☑ Apple   │ ☐ Samsung │ ☐ Sony    │
│    (45)    │   (38)    │   (27)    │
│────────────┼───────────┼───────────│
│  ☐ LG      │ ☑ Xiaomi  │ ☐ Huawei  │
│    (22)    │   (34)    │   (18)    │
└─────────────────────────────────────┘
```

---

## En cas de problème 🔧

### Les marques n'apparaissent pas ?
→ Vérifiez que vos produits ont bien des marques assignées

### L'affichage est bizarre ?
→ Redémarrez le serveur Nuxt : `npm run dev`

### Les filtres ne fonctionnent pas ?
→ Ouvrez la console du navigateur (F12) et cherchez les erreurs

---

## Besoin d'aide ? 📚

- 📖 Documentation complète : `docs/BRAND-FILTERS.md`
- 🎨 Exemple visuel : `docs/brand-filters-example.html`
- 📝 Résumé : `docs/BRAND-FILTERS-SUMMARY.md`

---

## C'est tout ! 🎉

Vous avez maintenant des filtres de marques modernes et responsives sur votre site e-commerce ! 

**Astuce** : Ouvrez `docs/brand-filters-example.html` dans votre navigateur pour voir une démo interactive du résultat final.

