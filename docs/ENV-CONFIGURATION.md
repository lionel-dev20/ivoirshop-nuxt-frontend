# 🔧 Configuration des Variables d'Environnement

## 📋 Fichier `.env` complet

Créez un fichier `.env` à la racine du projet avec ces variables :

```env
# ============================================
# CONFIGURATION MOBILE MONEY - DJONANKO PAY
# ============================================

# API DjoNanko - Clés de production
MOBILE_MONEY_API_KEY=DJN-029e1d50-d88a-4539-af75-fe7445bf9060
MOBILE_MONEY_API_SECRET=e123594f545226d9ffc7f65dd2df1558f531b6b37b91b78736a1f2619c3641b3
MOBILE_MONEY_REFERENCE=ivoirshop
MOBILE_MONEY_API_URL=https://apidjonanko.tech

# ============================================
# CONFIGURATION WOOCOMMERCE
# ============================================

# URL de votre WordPress/WooCommerce (backend)
WORDPRESS_URL=https://admin.ivoirshop.ci
WC_STORE_URL=https://admin.ivoirshop.ci

# Clés API WooCommerce
WOOCOMMERCE_CONSUMER_KEY=votre_consumer_key
WOOCOMMERCE_CONSUMER_SECRET=votre_consumer_secret

# URL de l'API WooCommerce
WOOCOMMERCE_API_URL=https://admin.ivoirshop.ci/wp-json/wc/v3

# ============================================
# CONFIGURATION SITE
# ============================================

# URL du site frontend (Nuxt)
NUXT_PUBLIC_SITE_URL=https://ivoirshop.ci
# En local: NUXT_PUBLIC_SITE_URL=http://localhost:3000

# Seuil de paiement (en FCFA)
# Au-dessus de ce montant, paiement partiel obligatoire (50%)
PAYMENT_THRESHOLD=150000

# ============================================
# ENVIRONNEMENT
# ============================================

NODE_ENV=production
# En local: NODE_ENV=development
```

---

## 🎯 Variables par environnement

### 🔵 Développement (Local)

```env
MOBILE_MONEY_API_KEY=DJN-029e1d50-d88a-4539-af75-fe7445bf9060
MOBILE_MONEY_API_SECRET=e123594f545226d9ffc7f65dd2df1558f531b6b37b91b78736a1f2619c3641b3
MOBILE_MONEY_REFERENCE=ivoirshop
MOBILE_MONEY_API_URL=https://apidjonanko.tech
NUXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
```

### 🟢 Production

```env
MOBILE_MONEY_API_KEY=DJN-029e1d50-d88a-4539-af75-fe7445bf9060
MOBILE_MONEY_API_SECRET=e123594f545226d9ffc7f65dd2df1558f531b6b37b91b78736a1f2619c3641b3
MOBILE_MONEY_REFERENCE=ivoirshop
MOBILE_MONEY_API_URL=https://apidjonanko.tech
NUXT_PUBLIC_SITE_URL=https://ivoirshop.ci
NODE_ENV=production
```

---

## 📖 Description des variables

### Mobile Money (DjoNanko)

| Variable | Description | Valeur |
|----------|-------------|--------|
| `MOBILE_MONEY_API_KEY` | Clé API DjoNanko | `DJN-029e1d50-d88a-4539-af75-fe7445bf9060` |
| `MOBILE_MONEY_API_SECRET` | Secret API DjoNanko | `e123594f545226d9ffc7f65dd2df1558f531b6b37b91b78736a1f2619c3641b3` |
| `MOBILE_MONEY_REFERENCE` | Référence merchant | `ivoirshop` |
| `MOBILE_MONEY_API_URL` | URL de l'API | `https://apidjonanko.tech` |

### Site & URLs

| Variable | Description | Valeur (prod) | Valeur (dev) |
|----------|-------------|---------------|--------------|
| `NUXT_PUBLIC_SITE_URL` | URL du site frontend | `https://ivoirshop.ci` | `http://localhost:3000` |
| `WORDPRESS_URL` | URL WordPress backend | `https://admin.ivoirshop.ci` | - |
| `WC_STORE_URL` | URL WooCommerce | `https://admin.ivoirshop.ci` | - |

### WooCommerce

| Variable | Description |
|----------|-------------|
| `WOOCOMMERCE_CONSUMER_KEY` | Clé consommateur WC |
| `WOOCOMMERCE_CONSUMER_SECRET` | Secret consommateur WC |
| `WOOCOMMERCE_API_URL` | URL API WooCommerce |

### Autres

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `PAYMENT_THRESHOLD` | Seuil paiement partiel (FCFA) | `150000` |
| `NODE_ENV` | Environnement | `production` ou `development` |

---

## ✅ Vérification

Pour vérifier que vos variables sont bien configurées :

```bash
# Démarrer le serveur
npm run dev

# Les logs devraient afficher la configuration
# Si des variables manquent, vous verrez des erreurs
```

---

## 🔒 Sécurité

⚠️ **IMPORTANT :**

- ❌ Ne jamais committer le fichier `.env` dans Git
- ✅ Le fichier `.env` doit être dans `.gitignore`
- ✅ Garder les clés API secrètes
- ✅ Utiliser des clés différentes pour dev et production (si disponible)

---

## 📚 Ressources

- Configuration webhook : `docs/WEBHOOK-CONFIGURATION.md`
- Commandes webhook : `WEBHOOK-COMMANDS.md`
- Système de paiement : `docs/MOBILE-MONEY-PAYMENT.md`

---

**Dernière mise à jour :** 6 janvier 2025








