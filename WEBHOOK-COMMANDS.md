# 🚀 Commandes Webhook - Guide Rapide

## 📋 Informations du projet

**Merchant Reference:** `ivoirshop`  
**API URL:** `https://apidjonanko.tech`  
**API Key:** `DJN-029e1d50-d88a-4539-af75-fe7445bf9060`  
**API Secret:** `e123594f545226d9ffc7f65dd2df1558f531b6b37b91b78736a1f2619c3641b3`

---

## 🎯 URLs du Webhook

### En développement (local)
```
http://localhost:3000/api/payment/mobile-money/callback
```

### En production
```
https://ivoirshop.ci/api/payment/mobile-money/callback
```

---

## ⚡ Configuration Automatique (RECOMMANDÉ)

### En local
```bash
curl --location --request POST 'http://localhost:3000/api/payment/mobile-money/set-webhook'
```

### En production
```bash
curl --location --request POST 'https://ivoirshop.ci/api/payment/mobile-money/set-webhook'
```

✅ **Avantage:** Utilise automatiquement vos variables d'environnement

---

## 🔧 Configuration Manuelle avec curl

### En développement (local)

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

### En production

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

---

## 🧪 Test du Webhook (local)

### Test avec données simulées

```bash
curl --location --request POST 'http://localhost:3000/api/payment/mobile-money/callback' \
--header 'Content-Type: application/json' \
--data '{
    "transaction_id": "TEST-123456",
    "status": "success",
    "amount": 50000,
    "createdAt": "2025-01-06T20:00:00Z",
    "updatedAt": "2025-01-06T20:05:00Z",
    "metadata": {
        "order_id": "12345FGGVD",
        "email": "customer@email.com",
        "phoneNumber": "+2250709483463"
    }
}'
```

**Réponse attendue:**
```json
{
  "success": true,
  "message": "Paiement confirmé et enregistré"
}
```

---

## 🪟 Scripts PowerShell (Windows)

### Configuration du webhook
```powershell
.\scripts\configure-webhook.ps1
```

### Test du webhook
```powershell
.\scripts\test-webhook.ps1
```

---

## 📊 Format du Payload Webhook

Lorsqu'un paiement est effectué, DjoNanko envoie cette notification :

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

**Statuts possibles:**
- `success` ou `completed` ✅
- `pending` ⏳
- `failed` ou `error` ❌

---

## 🔍 Vérification

### 1. Vérifier que le serveur est démarré
```bash
npm run dev
```

### 2. Tester l'endpoint webhook
```bash
curl http://localhost:3000/api/payment/mobile-money/callback
```

### 3. Consulter les logs
Les logs afficheront toutes les notifications reçues :
```
Callback de paiement reçu: { transaction_id: 'TEST-123', status: 'success', ... }
```

---

## 🌐 Utiliser ngrok pour tester en local avec l'API réelle

Si vous voulez tester avec la vraie API DjoNanko depuis votre machine locale :

### 1. Installer ngrok
```bash
npm install -g ngrok
```

### 2. Créer un tunnel
```bash
ngrok http 3000
```

Vous obtiendrez une URL publique comme : `https://abc123.ngrok.io`

### 3. Configurer le webhook avec l'URL ngrok
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

## 📁 Fichiers créés

1. **Endpoint de configuration:** `server/api/payment/mobile-money/set-webhook.post.ts`
2. **Endpoint webhook:** `server/api/payment/mobile-money/callback.post.ts` (existant)
3. **Documentation:** `docs/WEBHOOK-CONFIGURATION.md`
4. **Script PowerShell config:** `scripts/configure-webhook.ps1`
5. **Script PowerShell test:** `scripts/test-webhook.ps1`
6. **Ce guide:** `WEBHOOK-COMMANDS.md`

---

## ✅ Checklist de déploiement

- [ ] Variables d'environnement configurées dans `.env`
- [ ] Serveur Nuxt démarré (`npm run dev` ou en production)
- [ ] Webhook configuré avec l'API DjoNanko
- [ ] Test du webhook effectué avec succès
- [ ] Logs vérifiés pour confirmer la réception des notifications

---

## 📞 Support

En cas de problème, consultez :
- `docs/WEBHOOK-CONFIGURATION.md` - Documentation complète
- `docs/MOBILE-MONEY-PAYMENT.md` - Documentation du système de paiement
- Les logs de votre application Nuxt

---

**Dernière mise à jour:** 6 janvier 2025

