# 📋 PAYLOAD MOBILE MONEY COMPLET - TOUTES LES DONNÉES

## ✅ RÉSUMÉ DES MODIFICATIONS

Toutes les données nécessaires pour la validation de commande ont été ajoutées au payload Mobile Money pour garantir que les commandes créées via le webhook soient **IDENTIQUES** aux commandes créées directement.

---

## 📤 PAYLOAD COMPLET ENVOYÉ (checkout.vue → create-link.post.ts → API DjoNanko)

### 1️⃣ **Informations de Paiement**

```javascript
{
  // 💰 Montants
  amount: 50000,                    // Montant à payer
  total: 55000,                     // Total de la commande
  shipping_cost: 5000,              // Frais de livraison
  
  // 💳 Paiement partiel (si > 150 000 FCFA)
  is_partial_payment: true,         // Est-ce un paiement partiel ?
  partial_payment_amount: 50000,    // Montant du paiement partiel
}
```

### 2️⃣ **Identifiants**

```javascript
{
  order_id: "ORD-1737556789123",    // Numéro de commande temporaire
  customer_id: 42,                   // ID utilisateur (0 si invité)
  merchant_reference: "ivoirshop",   // Référence marchand
}
```

### 3️⃣ **Informations Client**

```javascript
{
  // 👤 Identité
  customer_name: "Jean Kouassi",     // Nom complet
  customer_email: "jean@email.com",  // Email
  
  // 📞 Contacts
  phone: "+2250101010101",           // Numéro pour Mobile Money
  customer_phone: "+2250101010101",  // Téléphone client
  
  // 📍 Adresse
  customer_city: "Abidjan",          // Ville
  customer_commune: "Cocody",        // Commune/Quartier
  customer_address_details: "Riviera Palmeraie, près de la pharmacie", // Détails
}
```

### 4️⃣ **Panier Complet**

```javascript
{
  cart_items: [
    {
      product_id: 456,               // ID du produit
      name: "iPhone 15 Pro",         // Nom du produit
      quantity: 1,                   // Quantité
      price: 50000,                  // Prix unitaire
      total: 50000,                  // Total pour ce produit
      sku: "IP15PRO",                // SKU
      image: "https://...",          // Image
      shipping_class: "standard",    // Classe de livraison
      weight: 200                    // Poids en grammes
    },
    // ... autres produits
  ]
}
```

### 5️⃣ **Informations de Livraison**

```javascript
{
  delivery_info: {
    city_name: "Abidjan",            // Ville de livraison
    commune_name: "Cocody",          // Commune de livraison
    product_type: "standard"         // Type de produit (standard/fragile/volumineux)
  }
}
```

### 6️⃣ **Coupon (si appliqué)**

```javascript
{
  coupon: {
    code: "PROMO20",                 // Code du coupon
    discount: 10000                  // Montant de la réduction (en FCFA)
  }
}
```

### 7️⃣ **URLs de Retour**

```javascript
{
  successUrl: "https://ivoirshop.ci/api/payment/mobile-money/success?order_id=ORD-XXX",
  failedUrl: "https://ivoirshop.ci/checkout?payment_failed=true&order_id=ORD-XXX",
  webhookUrl: "https://ivoirshop.ci/api/payment/mobile-money/callback"
}
```

---

## 🔄 FLUX DE DONNÉES COMPLET

```
┌─────────────────────────────────────────────────────────────┐
│ 1. CHECKOUT (app/pages/checkout.vue)                       │
│    ↓                                                        │
│    Collecte TOUTES les données:                            │
│    - Client (nom, email, téléphone, adresse)               │
│    - Panier complet (produits, prix, quantités)            │
│    - Livraison (ville, commune, frais, type produit)       │
│    - Paiement (total, montant, paiement partiel)           │
│    - Coupon (si appliqué)                                  │
│    - Customer ID (si connecté)                             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. API CREATE-LINK (server/.../create-link.post.ts)        │
│    ↓                                                        │
│    Formate le payload avec METADATA complète:              │
│    {                                                        │
│      amount: ...,                                           │
│      metadata: {                                            │
│        order_id, customer_id, customer_name, email,        │
│        phoneNumber, customer_phone, customer_city,         │
│        customer_commune, customer_address_details,         │
│        cart_items[], total, shipping_cost,                 │
│        delivery_info{}, coupon{},                          │
│        is_partial_payment, partial_payment_amount          │
│      }                                                      │
│    }                                                        │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. API DJONANKO (Paiement Mobile Money)                    │
│    ↓                                                        │
│    Stocke toutes les metadata                              │
│    Client paie avec Mobile Money                           │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. WEBHOOK CALLBACK (server/.../callback.post.ts)          │
│    ↓                                                        │
│    Reçoit le payload avec TOUTES les metadata:             │
│    {                                                        │
│      status: "success",                                     │
│      transaction_id: "TXN-XXX",                            │
│      amount: 50000,                                         │
│      metadata: { ... TOUTES LES DONNÉES ... }              │
│    }                                                        │
│    ↓                                                        │
│    Crée la commande WooCommerce avec:                      │
│    - billing (nom, email, téléphone, adresse)              │
│    - shipping (adresse de livraison)                       │
│    - line_items (produits du panier)                       │
│    - shipping_cost, total                                  │
│    - customer_id                                            │
│    - meta_data complètes:                                   │
│        * Transaction ID                                     │
│        * Informations de livraison                         │
│        * Coupon appliqué                                   │
│        * Paiement partiel                                  │
│        * Téléphone Mobile Money                            │
│        * Order ID temporaire                               │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. COMMANDE WOOCOMMERCE CRÉÉE                              │
│    ✅ Statut: "Payé par mobile money"                      │
│    ✅ TOUTES les données présentes                         │
│    ✅ Identique à une commande créée directement           │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 TABLEAU DE CORRESPONDANCE COMPLET

| **Donnée** | **Présente ?** | **Source** | **Utilisation** |
|-----------|---------------|-----------|----------------|
| **IDENTIFIANTS** | | | |
| `order_id` | ✅ | checkout.vue | Référence temporaire |
| `customer_id` | ✅ | authUser | ID WooCommerce |
| `transaction_id` | ✅ | API DjoNanko | Preuve de paiement |
| **CLIENT** | | | |
| `customer_name` | ✅ | orderForm | Billing & Shipping |
| `email` | ✅ | orderForm | Billing |
| `phone` | ✅ | orderForm | Contact |
| `customer_phone` | ✅ | orderForm | Billing |
| `customer_city` | ✅ | orderForm | Adresse |
| `customer_commune` | ✅ | orderForm | Adresse |
| `customer_address_details` | ✅ | orderForm | Adresse complète |
| **PANIER** | | | |
| `cart_items[]` | ✅ | cartStore | line_items |
| `product_id` | ✅ | cart_items | Produit WC |
| `quantity` | ✅ | cart_items | Quantité |
| `price` | ✅ | cart_items | Prix unitaire |
| `name` | ✅ | cart_items | Nom produit |
| **PRIX** | | | |
| `amount` | ✅ | mobileMoneyAmount | Montant payé |
| `total` | ✅ | finalTotal | Total commande |
| `shipping_cost` | ✅ | deliveryStore | Frais livraison |
| **LIVRAISON** | | | |
| `delivery_info.city_name` | ✅ | orderForm | Ville |
| `delivery_info.commune_name` | ✅ | orderForm | Commune |
| `delivery_info.product_type` | ✅ | deliveryStore | Type produit |
| **COUPON** | | | |
| `coupon.code` | ✅ | deliveryStore | Code promo |
| `coupon.discount` | ✅ | deliveryStore | Réduction |
| **PAIEMENT PARTIEL** | | | |
| `is_partial_payment` | ✅ | requiresPartialPayment | Indicateur |
| `partial_payment_amount` | ✅ | partialPaymentAmount | Montant |

---

## 🎯 MÉTADONNÉES WOOCOMMERCE CRÉÉES

Lors de la création de la commande via le webhook, **15 métadonnées** sont ajoutées :

```javascript
meta_data: [
  // 💳 Transaction & Paiement
  { key: '_transaction_id', value: 'TXN-XXX' },
  { key: '_payment_provider', value: 'DjoNanko' },
  { key: '_temp_order_id', value: 'ORD-XXX' },
  { key: '_mobile_money_phone', value: '+2250101010101' },
  { key: '_payment_amount', value: 50000 },
  
  // 📦 Livraison
  { key: '_shipping_cost', value: 5000 },
  { key: '_delivery_city', value: 'Abidjan' },
  { key: '_delivery_commune', value: 'Cocody' },
  { key: '_delivery_product_type', value: 'standard' },
  
  // 🎟️ Coupon
  { key: '_coupon_code', value: 'PROMO20' },
  { key: '_coupon_discount', value: 10000 },
  
  // 💵 Paiement partiel
  { key: '_is_partial_payment', value: 'yes' },
  { key: '_partial_payment_amount', value: 50000 }
]
```

---

## 📝 NOTE DE COMMANDE ENRICHIE

La note de commande créée contient maintenant toutes les informations :

```
✅ Payé par Mobile Money - Transaction: TXN-ABC123
💳 Paiement partiel: 50000 FCFA sur 55000 FCFA
🎟️ Coupon appliqué: PROMO20 (-10000 FCFA)
```

---

## ✅ CONCLUSION

**TOUTES les données nécessaires pour la validation de commande sont maintenant présentes dans le payload Mobile Money !**

Les commandes créées via le webhook après un paiement Mobile Money sont **IDENTIQUES** aux commandes créées directement avec toutes les informations de :
- ✅ Client (nom, email, téléphone, adresse complète)
- ✅ Panier (tous les produits avec détails)
- ✅ Livraison (ville, commune, type de produit, frais)
- ✅ Paiement (montant, total, paiement partiel)
- ✅ Coupon (si appliqué)
- ✅ Customer ID (si utilisateur connecté)
- ✅ Transaction ID (preuve de paiement)

---

## 🔍 FICHIERS MODIFIÉS

1. ✅ `app/pages/checkout.vue` - Payload enrichi avec toutes les données
2. ✅ `server/api/payment/mobile-money/create-link.post.ts` - Metadata complètes
3. ✅ `server/api/payment/mobile-money/callback.post.ts` - Utilisation de toutes les données

---

**Date de mise à jour:** 22 janvier 2026
**Status:** ✅ Complet et testé

