# 🎯 Workflow de Création de Commande avec Mobile Money

## 📋 Vue d'ensemble

Ce système crée automatiquement une commande dans WooCommerce **UNIQUEMENT** si le paiement Mobile Money réussit. Toutes les données nécessaires sont transmises via les metadata du webhook.

---

## 🔄 Flux Complet

```
┌─────────────────────────────────────────────────────────┐
│ 1. CLIENT AU CHECKOUT                                   │
│    - Remplit le formulaire                              │
│    - Panier déjà préparé                                │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ 2. GÉNÉRATION D'UN ORDER ID TEMPORAIRE                  │
│    Format: ORD-TIMESTAMP-RANDOM                         │
│    Exemple: ORD-1736316240123-A7F3KP                   │
│                                                         │
│    Données préparées:                                   │
│    ✅ order_id (temporaire)                            │
│    ✅ customer_name                                     │
│    ✅ customer_email                                    │
│    ✅ customer_phone                                    │
│    ✅ customer_city                                     │
│    ✅ customer_commune                                  │
│    ✅ customer_address_details                          │
│    ✅ cart_items (panier complet)                       │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ 3. CRÉATION DU LIEN DE PAIEMENT                         │
│    POST /api/payment/mobile-money/create-link           │
│                                                         │
│    ➜ Toutes les données sont mises dans les metadata   │
│    ➜ API DjoNanko STOCKE les metadata                  │
│    ➜ Retourne un lien de paiement                      │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ 4. CLIENT REDIRIGÉ VERS LA PAGE DE PAIEMENT             │
│    - Choisit son opérateur (Orange/MTN/Moov)            │
│    - Valide le paiement                                 │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ 5. API DJONANKO APPELLE LE WEBHOOK                      │
│    POST https://ivoirshop.ci/api/payment/               │
│         mobile-money/callback                           │
│                                                         │
│    Payload contient:                                    │
│    - status: "success" / "pending" / "failed"           │
│    - transaction_id                                     │
│    - amount                                             │
│    - metadata: { TOUTES LES DONNÉES }                  │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ 6. WEBHOOK VÉRIFIE LE STATUT                            │
│                                                         │
│    ❓ Status === "success" ?                           │
│    │                                                    │
│    ├─ OUI ➜ CRÉER LA COMMANDE WOOCOMMERCE             │
│    │         POST /wp-json/custom/v1/create-order      │
│    │         ✅ Commande créée avec un VRAI ID         │
│    │         ✅ Marquée comme PAYÉE                    │
│    │         ✅ Statut: "processing"                   │
│    │                                                    │
│    └─ NON  ➜ Ne rien faire                            │
│              (attendre confirmation ou échec)           │
└─────────────────────────────────────────────────────────┘
```

---

## 🔢 Génération du Numéro de Commande

### Order ID Temporaire (Frontend)

**Format :** `ORD-{TIMESTAMP}-{RANDOM}`

**Exemples :**
- `ORD-1736316240123-A7F3KP`
- `ORD-1736316245678-B9H2LM`
- `ORD-1736316250912-C4K8NX`

**Caractéristiques :**
- ✅ **Unique** : Timestamp + random garantit l'unicité
- ✅ **Traçable** : Identifiable dans les logs
- ✅ **Temporaire** : Remplacé par l'ID WooCommerce après création

**Code de génération :**
```typescript
const tempOrderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
```

### Order ID Réel (WooCommerce)

Après création de la commande, WooCommerce attribue un **ID numérique réel** :
- Exemple : `12345`, `12346`, `12347`

**Traçabilité :**
Les deux IDs sont stockés dans les meta_data WooCommerce :
```json
{
  "_temp_order_id": "ORD-1736316240123-A7F3KP",
  "_transaction_id": "TXN-ABC123"
}
```

---

## 📦 Données Transmises

### Dans checkout.vue → create-link.post.ts

```typescript
const paymentData = {
  // Montant et référence
  amount: 41500,
  order_id: "ORD-1736316240123-A7F3KP",  // 📝 Temporaire
  merchant_reference: "ivoirshop",
  
  // Contact
  phone: "+2250101010101",              // Pour Mobile Money
  customer_phone: "0101010101",         // 📞 Téléphone client
  customer_email: "client@example.com",
  customer_name: "John Doe",
  
  // Localisation
  customer_city: "Abidjan",             // 🏙️ Ville
  customer_commune: "Cocody",           // 📍 Commune/Région
  customer_address_details: "Riviera 2, près de...", // 🏠 Détails
  
  // Panier
  cart_items: [                         // 🛒 Produits
    {
      product_id: 456,
      name: "iPhone 15 Pro",
      quantity: 1,
      price: 40000,
      total: 40000
    }
  ],
  
  // URLs de retour
  successUrl: "...",
  failedUrl: "...",
  webhookUrl: "..."
}
```

### Dans create-link.post.ts → API DjoNanko

Toutes ces données sont mises dans `metadata` :

```json
{
  "amount": 41500,
  "merchant_reference": "ivoirshop",
  "return_url": "...",
  "cancel_url": "...",
  "metadata": {
    "order_id": "ORD-1736316240123-A7F3KP",
    "customer_name": "John Doe",
    "email": "client@example.com",
    "phoneNumber": "+2250101010101",
    "customer_phone": "0101010101",
    "customer_city": "Abidjan",
    "customer_commune": "Cocody",
    "customer_address_details": "Riviera 2, près de...",
    "cart_items": [...]
  }
}
```

### Dans Webhook → WooCommerce

Le webhook reçoit tout et crée la commande :

```typescript
const orderData = {
  payment_method: 'mobile_money',
  payment_method_title: 'Mobile Money',
  set_paid: true,              // ✅ Marquée comme payée
  status: 'processing',        // Statut: en traitement
  billing: {
    first_name: "John",
    last_name: "Doe",
    email: "client@example.com",
    phone: "0101010101",       // 📞 Du metadata
    address_1: "Cocody",       // 📍 Commune
    address_2: "Riviera 2...", // 🏠 Détails
    city: "Abidjan",           // 🏙️ Ville
    country: "CI"
  },
  shipping: { /* same as billing */ },
  line_items: [                // 🛒 Du metadata
    {
      product_id: 456,
      quantity: 1,
      price: 40000
    }
  ],
  meta_data: [
    { key: '_transaction_id', value: 'TXN-ABC123' },
    { key: '_temp_order_id', value: 'ORD-1736316240123-A7F3KP' },
    { key: '_mobile_money_phone', value: '+2250101010101' },
    { key: '_payment_amount', value: 41500 }
  ]
}
```

---

## 📝 Logs Générés

### 1. Frontend (checkout.vue)

```
============================================
📤 REDIRECTION VERS PAIEMENT
============================================
Order ID: ORD-1736316240123-A7F3KP
Client: John Doe
Téléphone: 0101010101
Ville: Abidjan
Commune: Cocody
Email: client@example.com
🛒 Panier: 2 produits
💰 Montant: 41500 FCFA
============================================
```

### 2. Backend (create-link.post.ts)

```
============================================
📤 PAYLOAD ENVOYÉ À L'API DE PAIEMENT:
============================================
Body: {
  "amount": 41500,
  "metadata": {
    "order_id": "ORD-1736316240123-A7F3KP",
    "customer_name": "John Doe",
    "customer_phone": "0101010101",
    "customer_city": "Abidjan",
    "customer_commune": "Cocody",
    "cart_items": [...]
  }
}
============================================
```

### 3. Webhook (callback.post.ts) - Réception

```
============================================
📥 WEBHOOK PAYLOAD REÇU
============================================
Status: success
Transaction ID: TXN-ABC123
Amount: 41500
---
🛒 DÉTAILS DE LA COMMANDE:
Order ID Temporaire: ORD-1736316240123-A7F3KP
Client: John Doe
Email: client@example.com
Téléphone Client: 0101010101
Téléphone Mobile Money: +2250101010101
Ville: Abidjan
Commune: Cocody
Adresse: Riviera 2, près de...
---
📦 PANIER (2 produits):
  1. iPhone 15 Pro x1 - 40000 FCFA
  2. Coque x1 - 1500 FCFA
============================================
✅ PAIEMENT RÉUSSI - Création de la commande WooCommerce...
```

### 4. Webhook (callback.post.ts) - Création Réussie

```
============================================
✅ COMMANDE WOOCOMMERCE CRÉÉE AVEC SUCCÈS !
============================================
Order ID WooCommerce: 12345
Order ID Temporaire: ORD-1736316240123-A7F3KP
Transaction ID: TXN-ABC123
Montant: 41500 FCFA
============================================
```

---

## ✅ Avantages de ce Système

### 1. Sécurité
- ✅ La commande n'est créée **QUE** si le paiement réussit
- ✅ Pas de commandes orphelines
- ✅ Pas de double création

### 2. Traçabilité
- ✅ Order ID temporaire conservé dans les meta_data
- ✅ Transaction ID lié à la commande
- ✅ Toutes les données client sauvegardées

### 3. Données Complètes
- ✅ Téléphone client récupéré
- ✅ Ville et région incluses
- ✅ Adresse complète
- ✅ Panier complet avec tous les produits

### 4. Logs Détaillés
- ✅ Chaque étape est loggée
- ✅ Facile de débugger
- ✅ Audit trail complet

---

## 🔧 Configuration Requise

### Variables d'Environnement

```bash
# URL de l'API WooCommerce
WC_STORE_URL=https://admin.ivoirshop.ci

# URL publique du site (pour webhook)
SITE_URL=https://ivoirshop.ci

# Clés API DjoNanko
MOBILE_MONEY_API_URL=https://apidjonanko.tech
MOBILE_MONEY_API_KEY=votre_api_key
MOBILE_MONEY_API_SECRET=votre_api_secret
MOBILE_MONEY_REFERENCE=ivoirshop
```

### Endpoint WooCommerce Requis

L'endpoint suivant doit exister dans WordPress :

```
POST https://admin.ivoirshop.ci/wp-json/custom/v1/create-order
```

**Accepte :**
```json
{
  "payment_method": "mobile_money",
  "set_paid": true,
  "status": "processing",
  "billing": { ... },
  "shipping": { ... },
  "line_items": [ ... ],
  "meta_data": [ ... ]
}
```

**Retourne :**
```json
{
  "id": 12345,
  "order_number": "12345",
  "status": "processing",
  ...
}
```

---

## 🧪 Tests

### Test 1 : Paiement Réussi

1. **Ajouter des produits au panier**
2. **Aller au checkout**
3. **Remplir le formulaire** :
   - Nom: John Doe
   - Téléphone: 0101010101
   - Email: test@example.com
   - Ville: Abidjan
   - Commune: Cocody
4. **Cliquer sur "Payer avec Mobile Money"**
5. **Observer les logs** :
   ```
   Order ID: ORD-1736316240123-A7F3KP
   Client: John Doe
   Téléphone: 0101010101
   Ville: Abidjan
   🛒 Panier: 2 produits
   ```
6. **Simuler le webhook** avec status "success"
7. **Vérifier** :
   - ✅ Commande créée dans WooCommerce
   - ✅ Order ID réel attribué
   - ✅ Commande marquée comme payée
   - ✅ Statut "processing"

### Test 2 : Paiement Échoué

1. **Même processus que Test 1**
2. **Simuler le webhook** avec status "failed"
3. **Vérifier** :
   - ✅ Aucune commande créée
   - ✅ Log: "Paiement pas encore confirmé"

### Test 3 : Vérifier les Données

Après création de la commande WooCommerce :

```bash
# Vérifier que toutes les données sont présentes
curl https://admin.ivoirshop.ci/wp-json/wc/v3/orders/12345
```

**Vérifier :**
- ✅ `billing.phone` = téléphone client
- ✅ `billing.city` = ville
- ✅ `billing.address_1` = commune
- ✅ `billing.address_2` = détails adresse
- ✅ `line_items` = produits du panier
- ✅ `meta_data._temp_order_id` = order ID temporaire
- ✅ `meta_data._transaction_id` = transaction ID

---

## 📊 Statuts Possibles

| Statut Webhook | Action | Commande WooCommerce |
|----------------|--------|----------------------|
| `success` ✅ | **Créer la commande** | Créée, payée, status "processing" |
| `completed` ✅ | **Créer la commande** | Créée, payée, status "processing" |
| `pending` ⏳ | Ne rien faire | Pas créée (attendre) |
| `failed` ❌ | Ne rien faire | Pas créée |
| Autre ❓ | Ne rien faire | Pas créée |

---

## 🚨 Gestion des Erreurs

### Erreur lors de la Création de Commande

Si la création échoue :
1. ✅ Le webhook retourne quand même 200 OK (pour ne pas être rappelé)
2. ✅ L'erreur est loggée
3. ✅ `order_creation_status: "failed"` dans la réponse

**Réponse du webhook en cas d'erreur :**
```json
{
  "received": true,
  "timestamp": "2025-01-08T10:30:00.000Z",
  "order_creation_status": "failed",
  "woocommerce_order_id": null,
  "temp_order_id": "ORD-1736316240123-A7F3KP",
  "transaction_id": "TXN-ABC123",
  "payload": { ... }
}
```

**Action à prendre :**
Vous pouvez chercher dans les logs le `temp_order_id` et créer manuellement la commande avec les données du webhook.

---

## 📚 Fichiers Modifiés

### ✅ `app/pages/checkout.vue`
- Génération d'un order ID temporaire
- Ajout des champs : téléphone, ville, commune, adresse
- Logs détaillés

### ✅ `server/api/payment/mobile-money/create-link.post.ts`
- Réception et transmission de toutes les nouvelles données
- Metadata enrichies

### ✅ `server/api/payment/mobile-money/callback.post.ts`
- Affichage de toutes les données reçues
- **Création automatique de la commande WooCommerce si paiement réussi**
- Logs détaillés de chaque étape

---

## 🎯 Prochaines Étapes (Optionnelles)

### 1. Notification Client

Envoyer un email/SMS au client après création de la commande :

```typescript
if (orderCreationStatus === 'success') {
  await sendOrderConfirmation(payload.metadata.email, woocommerceOrderId)
}
```

### 2. Mise à Jour de Stock

Le stock est normalement géré automatiquement par WooCommerce lors de la création de la commande.

### 3. Gestion des Retries

Si la création échoue, implémenter un système de retry automatique.

---

**Date de mise à jour :** 8 janvier 2025  
**Statut :** ✅ Implémenté et testé  
**Impact :** 🔴 Critique - Système de commande complet

