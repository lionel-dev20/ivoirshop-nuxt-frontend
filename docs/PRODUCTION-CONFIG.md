# 🚀 Configuration pour la production

## Date : Octobre 2025

### 🎯 Problème identifié
L'erreur "Configuration manquante" sur la version en ligne indique que les variables d'environnement ne sont pas correctement configurées en production.

---

## ✅ Solution appliquée

### **Correction du code serveur**
Le fichier `server/api/woocommerce/product/[slug].ts` a été corrigé pour utiliser `useRuntimeConfig()` au lieu d'accéder directement aux variables d'environnement.

**Changements effectués :**
```typescript
// ❌ Avant (ne fonctionne pas en production)
if (!process.env.WC_STORE_URL) {
  throw createError({ 
    statusCode: 500, 
    statusMessage: 'Configuration manquante' 
  })
}

// ✅ Après (fonctionne en production)
const runtimeConfig = useRuntimeConfig()
if (!runtimeConfig.WC_STORE_URL && !runtimeConfig.WORDPRESS_URL) {
  throw createError({ 
    statusCode: 500, 
    statusMessage: 'Configuration manquante' 
  })
}
```

---

## 🔧 Configuration requise pour la production

### **Variables d'environnement à définir :**

```bash
# URL de votre site WordPress/WooCommerce
WORDPRESS_URL=https://admin.ivoirshop.ci
WC_STORE_URL=https://admin.ivoirshop.ci

# Clés API WooCommerce (remplacez par vos vraies clés)
WOOCOMMERCE_CONSUMER_KEY=ck_your_consumer_key_here
WOOCOMMERCE_CONSUMER_SECRET=cs_your_consumer_secret_here

# URL de l'API WooCommerce
WOOCOMMERCE_API_URL=https://admin.ivoirshop.ci/wp-json/wc/v3

# Configuration Node.js
NODE_ENV=production
```

---

## 🚀 Déploiement selon la plateforme

### **1. Vercel**
```bash
# Dans le dashboard Vercel, allez dans Settings > Environment Variables
WORDPRESS_URL=https://admin.ivoirshop.ci
WC_STORE_URL=https://admin.ivoirshop.ci
WOOCOMMERCE_CONSUMER_KEY=ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WOOCOMMERCE_CONSUMER_SECRET=cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WOOCOMMERCE_API_URL=https://admin.ivoirshop.ci/wp-json/wc/v3
NODE_ENV=production
```

### **2. Netlify**
```bash
# Dans le dashboard Netlify, allez dans Site settings > Environment variables
WORDPRESS_URL=https://admin.ivoirshop.ci
WC_STORE_URL=https://admin.ivoirshop.ci
WOOCOMMERCE_CONSUMER_KEY=ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WOOCOMMERCE_CONSUMER_SECRET=cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WOOCOMMERCE_API_URL=https://admin.ivoirshop.ci/wp-json/wc/v3
NODE_ENV=production
```

### **3. Railway**
```bash
# Dans le dashboard Railway, allez dans Variables
WORDPRESS_URL=https://admin.ivoirshop.ci
WC_STORE_URL=https://admin.ivoirshop.ci
WOOCOMMERCE_CONSUMER_KEY=ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WOOCOMMERCE_CONSUMER_SECRET=cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WOOCOMMERCE_API_URL=https://admin.ivoirshop.ci/wp-json/wc/v3
NODE_ENV=production
```

### **4. Serveur VPS/Dédié**
```bash
# Créez un fichier .env à la racine de votre projet
nano .env

# Ajoutez les variables
WORDPRESS_URL=https://admin.ivoirshop.ci
WC_STORE_URL=https://admin.ivoirshop.ci
WOOCOMMERCE_CONSUMER_KEY=ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WOOCOMMERCE_CONSUMER_SECRET=cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WOOCOMMERCE_API_URL=https://admin.ivoirshop.ci/wp-json/wc/v3
NODE_ENV=production

# Redémarrez votre application
pm2 restart your-app-name
```

---

## 🔑 Récupération des clés WooCommerce

### **Étapes pour obtenir vos clés API :**

1. **Connectez-vous à votre WordPress admin**
   - Allez sur `https://admin.ivoirshop.ci/wp-admin`

2. **Accédez aux paramètres WooCommerce**
   - WooCommerce > Settings > Advanced > REST API

3. **Créez une nouvelle clé API**
   - Cliquez sur "Add Key"
   - Description : "API Nuxt.js"
   - User : Sélectionnez un utilisateur administrateur
   - Permissions : "Read/Write"

4. **Copiez les clés générées**
   - Consumer Key : `ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Consumer Secret : `cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## 🧪 Test de la configuration

### **Après le déploiement, testez :**

1. **Page d'accueil** : `https://votre-domaine.com`
2. **Page produit** : `https://votre-domaine.com/produit/ilux-fer-a-repasser-a-vapeur-il-8098-2200-w-violet`
3. **API directe** : `https://votre-domaine.com/api/woocommerce/product/ilux-fer-a-repasser-a-vapeur-il-8098-2200-w-violet`

### **Logs à vérifier :**
```bash
# Si vous avez accès aux logs de votre plateforme
# Recherchez ces messages :
✅ "Recherche du produit: ilux-fer-a-repasser-a-vapeur-il-8098-2200-w-violet"
✅ "Produit trouvé: Ilux Fer à repasser à vapeur IL-8098"

# Évitez ces erreurs :
❌ "Configuration manquante"
❌ "Error: Missing configuration"
```

---

## 🔧 Dépannage

### **Si l'erreur persiste :**

1. **Vérifiez les variables d'environnement**
   ```bash
   # Testez l'API directement
   curl -X GET "https://admin.ivoirshop.ci/wp-json/custom/v1/product/ilux-fer-a-repasser-a-vapeur-il-8098-2200-w-violet"
   ```

2. **Vérifiez les clés API**
   ```bash
   # Testez avec vos clés
   curl -X GET "https://admin.ivoirshop.ci/wp-json/wc/v3/products" \
     -u "ck_votre_cle:cs_votre_secret"
   ```

3. **Vérifiez les CORS**
   - Assurez-vous que votre domaine est autorisé dans WordPress

4. **Vérifiez les permissions**
   - L'utilisateur associé aux clés API doit avoir les bonnes permissions

---

## 📝 Checklist de déploiement

### **Avant le déploiement :**
- [ ] Variables d'environnement configurées
- [ ] Clés API WooCommerce valides
- [ ] URL WordPress accessible
- [ ] Code mis à jour avec `useRuntimeConfig()`

### **Après le déploiement :**
- [ ] Test de la page d'accueil
- [ ] Test d'une page produit
- [ ] Test de la recherche
- [ ] Vérification des logs

### **En cas de problème :**
- [ ] Vérifier les variables d'environnement
- [ ] Tester l'API WooCommerce directement
- [ ] Vérifier les logs de la plateforme
- [ ] Contacter le support si nécessaire

---

**Statut :** ✅ **CORRIGÉ**  
**Date :** Octobre 2025  
**Action requise :** Configurer les variables d'environnement en production




