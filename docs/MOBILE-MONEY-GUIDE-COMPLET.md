# 📱 Guide Complet du Système de Paiement Mobile Money

## 📂 Architecture des Fichiers

```
server/api/payment/mobile-money/
├── create-link.post.ts      ⭐ RECOMMANDÉ - Crée un lien de paiement
├── initiate.post.ts         🔧 Ancien système - Paiement direct avec numéro
├── verify.post.ts           ✅ Vérifie le statut d'un paiement
├── callback.post.ts         📥 Webhook - Reçoit les notifications
├── set-webhook.post.ts      ⚙️  Configure l'URL du webhook
└── success.get.ts           🎉 Gère le retour après succès

app/components/
└── MobileMoneyPayment.vue   🎨 Composant UI pour le paiement
```

---

## 🎯 Systèmes de Paiement Disponibles

### 1️⃣ **Système Moderne : Lien de Paiement** ⭐ RECOMMANDÉ

**Fichier :** `create-link.post.ts`

**Comment ça marche :**
1. Vous créez un lien de paiement
2. Client est redirigé vers une page externe
3. Il choisit son opérateur (Orange, MTN, Moov)
4. Il paie sur la plateforme sécurisée
5. API vous notifie via webhook

**Avantages :**
✅ Plus simple pour le client  
✅ Interface professionnelle  
✅ Gère automatiquement tous les opérateurs  
✅ Meilleure traçabilité avec metadata  
✅ Pas besoin de gérer les numéros de téléphone  

**Utilisation :**
```typescript
const response = await $fetch('/api/payment/mobile-money/create-link', {
  method: 'POST',
  body: {
    amount: 50000,
    order_id: '123',
    customer_name: 'John Doe',
    customer_email: 'john@example.com',
    phone: '+2250101010101',
    cart_items: [...] // Liste des produits
  }
})

// Rediriger vers le lien de paiement
window.location.href = response.payment_url
```

---

### 2️⃣ **Système Ancien : Paiement Direct**

**Fichier :** `initiate.post.ts`

**Comment ça marche :**
1. Client entre son numéro de téléphone
2. Notification USSD envoyée sur son téléphone
3. Client compose le code USSD pour valider
4. Vous vérifiez le statut avec `verify.post.ts`

**Inconvénients :**
❌ Plus complexe pour le client  
❌ Dépend de l'opérateur  
❌ Peut échouer si le réseau est mauvais  
❌ Nécessite de demander le numéro  

**Utilisation :**
```typescript
const response = await $fetch('/api/payment/mobile-money/initiate', {
  method: 'POST',
  body: {
    phone: '0101010101', // 10 chiffres sans +225
    amount: 50000,
    order_id: '123',
    customer_name: 'John Doe'
  }
})

// Puis vérifier régulièrement
const status = await $fetch('/api/payment/mobile-money/verify', {
  method: 'POST',
  body: { transaction_id: response.transaction_id }
})
```

---

## 📋 Détail de Chaque Fichier

### 📄 `create-link.post.ts` - Création de Lien de Paiement

**Endpoint :** `POST /api/payment/mobile-money/create-link`

**Ce qu'il fait :**
1. ✅ Valide les données (amount, order_id)
2. ✅ Valide le format du téléphone (optionnel)
3. ✅ Prépare les metadata avec le panier
4. ✅ Appelle l'API DjoNanko pour créer le lien
5. ✅ Retourne l'URL de paiement

**Paramètres requis :**
- `amount` (number) - Montant en FCFA
- `order_id` (string/number) - ID de la commande

**Paramètres optionnels :**
- `customer_name` (string)
- `customer_email` (string)
- `phone` (string) - Format: +225XXXXXXXXXX
- `cart_items` (array) - Liste des produits
- `return_url` (string) - URL de retour après succès
- `cancel_url` (string) - URL si paiement annulé

**Metadata automatiques :**
```typescript
metadata: {
  order_id: '123',
  email: 'customer@email.com',
  phoneNumber: '+2250101010101',
  customer_name: 'John Doe',
  cart_items: [
    { product_id, name, quantity, price, total }
  ]
}
```

**Réponse :**
```json
{
  "success": true,
  "payment_url": "https://pay.djonanko.tech/xxx",
  "transaction_id": "TXN-123",
  "reference": "REF-456"
}
```

**Variables d'environnement utilisées :**
- `MOBILE_MONEY_API_URL` - URL de l'API (https://apidjonanko.tech)
- `MOBILE_MONEY_API_KEY` - Clé API
- `MOBILE_MONEY_API_SECRET` - Secret API
- `MOBILE_MONEY_REFERENCE` - Référence marchand (ex: 'ivoirshop')
- `SITE_URL` - URL de votre site (pour les URLs de retour)

---

### 📄 `callback.post.ts` - Webhook de Notification

**Endpoint :** `POST /api/payment/mobile-money/callback`

**Ce qu'il fait :**
1. ✅ Reçoit le payload de l'API de paiement
2. ✅ Extrait et log les informations importantes
3. ✅ Affiche le panier (cart_items) dans les logs
4. ✅ Retourne le payload sans traitement

**Payload reçu (exemple) :**
```json
{
  "status": "success",
  "transaction_id": "TXN-123",
  "amount": 50000,
  "createdAt": "2025-01-08T10:30:00Z",
  "updatedAt": "2025-01-08T10:35:00Z",
  "metadata": {
    "order_id": "123",
    "email": "john@example.com",
    "phoneNumber": "+2250101010101",
    "customer_name": "John Doe",
    "cart_items": [...]
  }
}
```

**Réponse :**
```json
{
  "received": true,
  "timestamp": "2025-01-08T10:35:01.234Z",
  "payload": { /* payload complet */ }
}
```

**Logs générés :**
```
============================================
📥 WEBHOOK PAYLOAD REÇU
============================================
Status: success
Transaction ID: TXN-123
Amount: 50000
---
🛒 DÉTAILS DE LA COMMANDE:
Order ID: 123
Client: John Doe
---
📦 PANIER (2 produits):
  1. iPhone 15 Pro x1 - 50000 FCFA
  2. Coque iPhone x2 - 5000 FCFA
============================================
```

**Configuration du webhook :**

L'URL du webhook doit être configurée dans l'API de paiement :
```
https://ivoirshop.ci/api/payment/mobile-money/callback
```

Utilisez `set-webhook.post.ts` pour le faire automatiquement.

---

### 📄 `set-webhook.post.ts` - Configuration du Webhook

**Endpoint :** `POST /api/payment/mobile-money/set-webhook`

**Ce qu'il fait :**
1. ✅ Construit l'URL du webhook automatiquement
2. ✅ Appelle l'API pour enregistrer l'URL
3. ✅ Affiche les logs de configuration

**Utilisation :**
```bash
# PowerShell
Invoke-RestMethod -Method POST -Uri "https://ivoirshop.ci/api/payment/mobile-money/set-webhook"
```

```typescript
// Frontend
await $fetch('/api/payment/mobile-money/set-webhook', { method: 'POST' })
```

**Réponse :**
```json
{
  "success": true,
  "message": "Webhook configuré avec succès",
  "webhookUrl": "https://ivoirshop.ci/api/payment/mobile-money/callback",
  "merchant_reference": "ivoirshop"
}
```

---

### 📄 `verify.post.ts` - Vérification de Statut

**Endpoint :** `POST /api/payment/mobile-money/verify`

**Ce qu'il fait :**
1. ✅ Vérifie le statut d'une transaction
2. ✅ Appelle l'API de paiement
3. ✅ Retourne le statut (completed, pending, failed)

**Utilisation :**
```typescript
const status = await $fetch('/api/payment/mobile-money/verify', {
  method: 'POST',
  body: { transaction_id: 'TXN-123' }
})

if (status.status === 'completed') {
  console.log('✅ Paiement confirmé!')
}
```

**Réponse :**
```json
{
  "success": true,
  "status": "completed",
  "transaction_id": "TXN-123",
  "amount": 50000,
  "message": "Paiement confirmé avec succès"
}
```

**Statuts possibles :**
- `completed` / `success` - Paiement réussi ✅
- `pending` - En attente ⏳
- `failed` / `error` - Échec ❌
- `unknown` - Statut inconnu ❓

**Mode simulation :**
Si `transaction_id` commence par `SIM-`, retourne automatiquement `completed`.

---

### 📄 `initiate.post.ts` - Initiation Paiement Direct

**Endpoint :** `POST /api/payment/mobile-money/initiate`

**Ce qu'il fait :**
1. ✅ Valide le numéro de téléphone (10 chiffres)
2. ✅ Vérifie l'opérateur (Orange/MTN/Moov)
3. ✅ Envoie notification USSD au téléphone
4. ✅ Retourne l'ID de transaction

**Utilisation :**
```typescript
const response = await $fetch('/api/payment/mobile-money/initiate', {
  method: 'POST',
  body: {
    phone: '0101010101', // 10 chiffres, sans +225
    amount: 50000,
    order_id: '123',
    customer_name: 'John Doe',
    customer_email: 'john@example.com'
  }
})
```

**Validation du téléphone :**
- ✅ Doit être 10 chiffres
- ✅ Sans l'indicatif +225
- ✅ Doit commencer par 01 (Orange), 05 (MTN), ou 07 (Moov)

**Exemples valides :**
- `0101010101` (Orange)
- `0501010101` (MTN)
- `0701010101` (Moov)

**Exemples invalides :**
- `+2250101010101` (ne pas mettre +225)
- `123456789` (pas assez de chiffres)
- `0201010101` (opérateur invalide)

**Mode simulation :**
Si `MOBILE_MONEY_API_URL = "SIMULATION"` ou API non disponible, retourne un ID de transaction simulé commençant par `SIM-`.

---

### 📄 `success.get.ts` - Gestion du Retour

**Endpoint :** `GET /api/payment/mobile-money/success`

**Ce qu'il fait :**
1. ✅ Reçoit les paramètres de retour après paiement
2. ✅ Redirige vers `/payment/process-success`
3. ✅ Permet de finaliser la commande côté client

**Utilisation :**
Automatique - L'API de paiement redirige vers cette URL après succès.

**URL configurée automatiquement :**
```
https://ivoirshop.ci/api/payment/mobile-money/success?order_id=123&transaction_id=TXN-456
```

---

### 📄 `MobileMoneyPayment.vue` - Composant UI

**Composant :** `<MobileMoneyPayment />`

**Props :**
```typescript
{
  amount: number,           // Montant à payer
  totalAmount: number,      // Montant total de la commande
  isPartialPayment?: boolean, // Si paiement partiel (50%)
  orderId?: number,         // ID de la commande
  customerName?: string,    // Nom du client
  customerEmail?: string,   // Email du client
  customerId?: number       // ID du client
}
```

**Events :**
```typescript
@payment-success="handleSuccess"  // Émis quand paiement initié
@payment-failed="handleError"     // Émis en cas d'erreur
```

**Utilisation dans checkout.vue :**
```vue
<template>
  <MobileMoneyPayment
    :amount="cartTotal"
    :total-amount="cartTotal"
    :order-id="orderData?.id"
    :customer-name="customerData.billing.first_name + ' ' + customerData.billing.last_name"
    :customer-email="customerData.billing.email"
    @payment-success="redirectToPayment"
  />
</template>

<script setup>
const redirectToPayment = async () => {
  // Créer le lien de paiement
  const response = await $fetch('/api/payment/mobile-money/create-link', {
    method: 'POST',
    body: { /* ... */ }
  })
  
  // Rediriger
  window.location.href = response.payment_url
}
</script>
```

---

## ⚙️ Variables d'Environnement

Ajoutez ces variables dans votre `.env` :

```bash
# API de Paiement DjoNanko
MOBILE_MONEY_API_URL=https://apidjonanko.tech
MOBILE_MONEY_API_KEY=votre_api_key
MOBILE_MONEY_API_SECRET=votre_api_secret
MOBILE_MONEY_REFERENCE=ivoirshop

# URL de votre site (pour webhook et retours)
SITE_URL=https://ivoirshop.ci

# Mode simulation (optionnel)
# MOBILE_MONEY_API_URL=SIMULATION
```

**Mode Simulation :**
Pour tester sans vraie API, mettez :
```bash
MOBILE_MONEY_API_URL=SIMULATION
```

Toutes les transactions retourneront automatiquement `success` avec des IDs commençant par `SIM-`.

---

## 🔄 Flux Recommandé (Production)

### 1️⃣ Configuration Initiale

```bash
# 1. Configurer les variables d'environnement
# Éditer .env

# 2. Configurer le webhook auprès de l'API
POST /api/payment/mobile-money/set-webhook
```

### 2️⃣ Lors d'un Achat

```typescript
// 1. Client termine son panier et va au checkout
// 2. Créer le lien de paiement
const response = await $fetch('/api/payment/mobile-money/create-link', {
  method: 'POST',
  body: {
    amount: cartTotal,
    order_id: orderId,
    customer_name: customerName,
    customer_email: customerEmail,
    phone: customerPhone,
    cart_items: cartItems // 🛒 Important pour traçabilité !
  }
})

// 3. Rediriger le client
window.location.href = response.payment_url

// 4. Le client paie sur la plateforme externe

// 5. Webhook appelé automatiquement par l'API
// POST /api/payment/mobile-money/callback
// Vous recevez le statut + metadata + panier

// 6. Client redirigé vers success.get.ts puis /thank-you
```

---

## 🧪 Tests

### Test 1 : Créer un lien de paiement

```bash
curl -X POST http://localhost:3000/api/payment/mobile-money/create-link \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000,
    "order_id": "TEST-123",
    "customer_name": "Test User",
    "customer_email": "test@example.com",
    "cart_items": [
      {
        "product_id": 1,
        "name": "Produit Test",
        "quantity": 1,
        "price": 1000,
        "total": 1000
      }
    ]
  }'
```

### Test 2 : Simuler un webhook

```bash
curl -X POST http://localhost:3000/api/payment/mobile-money/callback \
  -H "Content-Type: application/json" \
  -d '{
    "status": "success",
    "transaction_id": "TEST-TXN",
    "amount": 1000,
    "metadata": {
      "order_id": "TEST-123",
      "cart_items": [...]
    }
  }'
```

### Test 3 : Configurer le webhook

```bash
curl -X POST http://localhost:3000/api/payment/mobile-money/set-webhook
```

---

## 🐛 Debugging

### Problème : Webhook ne reçoit rien

**Solutions :**
1. ✅ Vérifier que l'URL du webhook est accessible publiquement
2. ✅ Configurer le webhook avec `set-webhook.post.ts`
3. ✅ Vérifier les logs serveur
4. ✅ Tester avec un tunnel (ngrok) en local

### Problème : Paiement réussit mais commande pas créée

**Solutions :**
1. ✅ Vérifier que le webhook est bien appelé (logs)
2. ✅ Vérifier que `cart_items` est bien envoyé
3. ✅ Ajouter traitement dans `callback.post.ts`

### Problème : "Configuration de paiement mobile manquante"

**Solutions :**
1. ✅ Vérifier que `.env` contient les clés API
2. ✅ Redémarrer le serveur Nuxt après modification du `.env`
3. ✅ Vérifier `nuxt.config.ts` expose les variables

---

## 📚 Documentation Connexe

- 📄 `MOBILE-MONEY-METADATA-PANIER.md` - Guide détaillé sur les metadata et panier
- 📄 `MOBILE-MONEY-PAYMENT.md` - Documentation originale
- 📄 `QUICK-START-MOBILE-MONEY.md` - Guide de démarrage rapide
- 📄 `WEBHOOK-CONFIGURATION.md` - Configuration du webhook

---

## 🎯 Choix Recommandés

| Critère | Ancien Système (initiate) | Nouveau Système (create-link) |
|---------|---------------------------|-------------------------------|
| Simplicité | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| UX Client | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Traçabilité | ⭐⭐ | ⭐⭐⭐⭐⭐ (metadata + panier) |
| Fiabilité | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Multi-opérateur | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

**🏆 RECOMMANDATION : Utilisez le système de lien de paiement (`create-link.post.ts`)**

---

**✅ Système complet et documenté !**

