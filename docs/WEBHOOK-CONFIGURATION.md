# 🔔 Configuration du Webhook - Paiement Mobile Money

## 📋 Vue d'ensemble

Le webhook permet à l'API de paiement DjoNanko de notifier automatiquement votre application lorsqu'un paiement est effectué. C'est essentiel pour la mise à jour automatique des commandes.

---

## 🎯 URL du Webhook

### En développement (local)
```
http://localhost:3000/api/payment/mobile-money/callback
```

### En production
```
https://ivoirshop.ci/api/payment/mobile-money/callback
```

---

## 🚀 Configuration automatique (Recommandé)

### Option 1 : Via l'API Nuxt

Appelez simplement cet endpoint pour configurer automatiquement le webhook :

```bash
POST http://localhost:3000/api/payment/mobile-money/set-webhook
```

**Exemple avec curl :**
```bash
curl --location --request POST 'http://localhost:3000/api/payment/mobile-money/set-webhook' \
--header 'Content-Type: application/json'
```

**En production :**
```bash
curl --location --request POST 'https://ivoirshop.ci/api/payment/mobile-money/set-webhook' \
--header 'Content-Type: application/json'
```

✅ **Avantages :** Utilise automatiquement vos variables d'environnement (API_KEY, API_SECRET, SITE_URL)

---

## 🔧 Configuration manuelle

### Avec curl (en local)

```bash
curl --location --request PATCH 'https://apidjonanko.tech/web-merchant/set-webhook-url' \
--header 'x-api-key: DJN-029e1d50-d88a-4539-af75-fe7445bf9060' \
--header 'x-api-secret: e123594f545226d9ffc7f65dd2df1558f531b6b37b91b78736a1f2619c3641b3' \
--header 'Content-Type: application/json' \
--data '{
    "reference": "ivoirshop",
    "webhookUrl": "http://localhost:3000/api/payment/mobile-money/callback"
}'
```

### Avec curl (en production)

```bash
curl --location --request PATCH 'https://apidjonanko.tech/web-merchant/set-webhook-url' \
--header 'x-api-key: DJN-029e1d50-d88a-4539-af75-fe7445bf9060' \
--header 'x-api-secret: e123594f545226d9ffc7f65dd2df1558f531b6b37b91b78736a1f2619c3641b3' \
--header 'Content-Type: application/json' \
--data '{
    "reference": "ivoirshop",
    "webhookUrl": "https://ivoirshop.ci/api/payment/mobile-money/callback"
}'
```

⚠️ **Important :** Remplacez `x-api-key` et `x-api-secret` par vos vraies clés d'API.

---

## 📝 Variables d'environnement requises

Assurez-vous que ces variables sont configurées dans votre fichier `.env` :

```env
# API DjoNanko
MOBILE_MONEY_API_KEY=DJN-029e1d50-d88a-4539-af75-fe7445bf9060
MOBILE_MONEY_API_SECRET=e123594f545226d9ffc7f65dd2df1558f531b6b37b91b78736a1f2619c3641b3
MOBILE_MONEY_REFERENCE=ivoirshop
MOBILE_MONEY_API_URL=https://apidjonanko.tech

# URL du site (pour le webhook)
NUXT_PUBLIC_SITE_URL=https://ivoirshop.ci
# En local: NUXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 🔍 Tester le webhook

### 1. Vérifier que l'endpoint existe

```bash
curl --location --request POST 'http://localhost:3000/api/payment/mobile-money/callback' \
--header 'Content-Type: application/json' \
--data '{
    "transaction_id": "TEST-123",
    "status": "success",
    "amount": 1000,
    "createdAt": "2025-01-06T20:00:00Z",
    "updatedAt": "2025-01-06T20:05:00Z"
}'
```

**Réponse attendue :**
```json
{
  "success": true,
  "message": "Paiement confirmé et enregistré"
}
```

### 2. Utiliser un service de test (ngrok)

Si vous développez en local et voulez tester avec la vraie API, utilisez ngrok :

```bash
# Installer ngrok
npm install -g ngrok

# Créer un tunnel
ngrok http 3000
```

Vous obtiendrez une URL publique comme : `https://abc123.ngrok.io`

Configurez ensuite le webhook avec cette URL :
```bash
curl --location --request PATCH 'https://apidjonanko.tech/web-merchant/set-webhook-url' \
--header 'x-api-key: DJN-029e1d50-d88a-4539-af75-fe7445bf9060' \
--header 'x-api-secret: e123594f545226d9ffc7f65dd2df1558f531b6b37b91b78736a1f2619c3641b3' \
--header 'Content-Type: application/json' \
--data '{
    "reference": "ivoirshop",
    "webhookUrl": "https://abc123.ngrok.io/api/payment/mobile-money/callback"
}'
```

---

## 📊 Format des données reçues par le webhook

Lorsqu'un paiement est effectué, l'API DjoNanko envoie une notification POST à votre webhook avec ce format :

```json
{
  "transaction_id": "TXN-12345",
  "status": "success",
  "amount": 50000,
  "createdAt": "2025-01-06T20:00:00Z",
  "updatedAt": "2025-01-06T20:05:00Z",
  "metadata": {
    "order_id": "12345FGGVD",
    "email": "customer@email.com",
    "phoneNumber": "+2250709483463"
  }
}
```

**Statuts possibles :**
- `success` ou `completed` : Paiement réussi ✅
- `pending` : Paiement en attente ⏳
- `failed` ou `error` : Paiement échoué ❌

---

## 🛠️ Endpoint du webhook

**Fichier :** `server/api/payment/mobile-money/callback.post.ts`

**URL :** `/api/payment/mobile-money/callback`

**Méthode :** POST

**Ce que fait le webhook :**
1. Reçoit la notification de paiement
2. Valide les données
3. Met à jour le statut de la commande (TODO: intégration WooCommerce)
4. Retourne une confirmation à l'API

---

## ✅ Vérification de la configuration

Pour vérifier que votre webhook est bien configuré :

1. Consultez les logs de votre application lors de la configuration
2. Effectuez un paiement test
3. Vérifiez que la notification est bien reçue dans les logs

**Exemple de logs attendus :**
```
============================================
📤 CONFIGURATION DU WEBHOOK:
URL: https://apidjonanko.tech/web-merchant/set-webhook-url
Method: PATCH
Headers: {...}
Body: {
  "reference": "beautyshop",
  "webhookUrl": "https://ivoirshop.ci/api/payment/mobile-money/callback"
}
============================================
```

---

## 🔐 Sécurité

⚠️ **Recommandations de sécurité :**

1. **Valider la source** : Vérifiez que les requêtes proviennent bien de l'API DjoNanko
2. **Vérifier la signature** : Implémentez la validation de signature si l'API le supporte
3. **Utiliser HTTPS** : En production, utilisez toujours HTTPS
4. **Logger les webhooks** : Conservez un historique des notifications reçues

---

## 📞 Support

En cas de problème :

1. Vérifiez les logs de votre application
2. Vérifiez que l'URL du webhook est accessible publiquement
3. Testez manuellement avec curl
4. Contactez le support DjoNanko si nécessaire

---

## 📚 Ressources

- Documentation API : `docs/MOBILE-MONEY-PAYMENT.md`
- Configuration des URLs : `docs/URLS-PAIEMENT-CONFIGURATION.md`
- Mode simulation : `docs/MODE-SIMULATION-PAIEMENT.md`

