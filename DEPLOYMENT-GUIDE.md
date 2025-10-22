# 🚀 Guide de déploiement - Correction de l'erreur "Configuration manquante"

## ✅ Problème résolu

L'erreur **"Configuration manquante"** sur la version en ligne a été corrigée en modifiant le code pour utiliser `useRuntimeConfig()` au lieu d'accéder directement aux variables d'environnement.

---

## 🔧 Actions à effectuer pour le déploiement

### **1. Mettre à jour le code en production**

Le fichier `server/api/woocommerce/product/[slug].ts` a été corrigé. Vous devez déployer cette version mise à jour.

### **2. Configurer les variables d'environnement**

Sur votre plateforme de déploiement, configurez ces variables :

```bash
# URL de votre site WordPress
WORDPRESS_URL=https://admin.ivoirshop.ci
WC_STORE_URL=https://admin.ivoirshop.ci

# Clés API WooCommerce (obtenez-les depuis WordPress admin)
WOOCOMMERCE_CONSUMER_KEY=ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WOOCOMMERCE_CONSUMER_SECRET=cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# URL de l'API WooCommerce
WOOCOMMERCE_API_URL=https://admin.ivoirshop.ci/wp-json/wc/v3

# Environnement
NODE_ENV=production
```

---

## 🎯 Instructions par plateforme

### **Vercel**
1. Allez dans votre projet Vercel
2. Settings → Environment Variables
3. Ajoutez toutes les variables ci-dessus
4. Redéployez

### **Netlify**
1. Allez dans votre site Netlify
2. Site settings → Environment variables
3. Ajoutez toutes les variables ci-dessus
4. Redéployez

### **Railway**
1. Allez dans votre projet Railway
2. Variables
3. Ajoutez toutes les variables ci-dessus
4. Redéployez

### **Serveur VPS/Dédié**
1. Connectez-vous à votre serveur
2. Créez un fichier `.env` à la racine du projet
3. Ajoutez toutes les variables ci-dessus
4. Redémarrez votre application (PM2, Docker, etc.)

---

## 🔑 Récupération des clés WooCommerce

### **Étapes :**

1. **Connectez-vous à WordPress admin**
   - `https://admin.ivoirshop.ci/wp-admin`

2. **Allez dans WooCommerce**
   - WooCommerce → Settings → Advanced → REST API

3. **Créez une nouvelle clé**
   - Cliquez sur "Add Key"
   - Description : "API Nuxt.js Production"
   - User : Sélectionnez un admin
   - Permissions : "Read/Write"

4. **Copiez les clés générées**
   - Consumer Key : `ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Consumer Secret : `cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## 🧪 Test après déploiement

### **URLs à tester :**

1. **Page d'accueil** : `https://votre-domaine.com`
2. **Page produit** : `https://votre-domaine.com/produit/ilux-fer-a-repasser-a-vapeur-il-8098-2200-w-violet`
3. **API directe** : `https://votre-domaine.com/api/woocommerce/product/ilux-fer-a-repasser-a-vapeur-il-8098-2200-w-violet`

### **Script de test (optionnel)**

Vous pouvez utiliser le script de test créé :
```bash
node scripts/test-production-config.cjs
```

---

## 📋 Checklist de déploiement

### **Avant le déploiement :**
- [ ] Code mis à jour déployé
- [ ] Variables d'environnement configurées
- [ ] Clés API WooCommerce valides
- [ ] URL WordPress accessible

### **Après le déploiement :**
- [ ] Page d'accueil fonctionne
- [ ] Page produit s'affiche correctement
- [ ] Plus d'erreur "Configuration manquante"
- [ ] Recherche fonctionne

### **En cas de problème :**
- [ ] Vérifier les variables d'environnement
- [ ] Tester l'API WooCommerce directement
- [ ] Vérifier les logs de la plateforme
- [ ] Contacter le support si nécessaire

---

## 🎉 Résultat attendu

Après avoir suivi ces étapes, votre site en production devrait :

- ✅ **Afficher correctement** les fiches produits
- ✅ **Ne plus montrer** l'erreur "Configuration manquante"
- ✅ **Fonctionner** comme la version locale
- ✅ **Avoir toutes les fonctionnalités** opérationnelles

---

**Date :** Octobre 2025  
**Statut :** ✅ **Prêt pour le déploiement**  
**Action requise :** Configurer les variables d'environnement et redéployer














