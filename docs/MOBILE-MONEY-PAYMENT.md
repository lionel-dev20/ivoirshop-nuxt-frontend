# Système de Paiement Mobile Money - IvoirShop.ci

## 📋 Vue d'ensemble

Ce système de paiement mobile money a été développé pour gérer les transactions par Orange Money, MTN Money, Moov Money et Wave en Côte d'Ivoire. Il supporte deux modes de paiement selon le montant de la commande.

## 🔑 Configuration

### 1. Variables d'environnement

Ajoutez ces variables dans votre fichier `.env` :

```env
# Mobile Money Payment Configuration
MOBILE_MONEY_API_KEY=DJN-ef383bb7-2c4d-4efa-92a0-4e23f0dcf1d5
MOBILE_MONEY_API_SECRET=3e44f3e16cbd39a6107f4e8a642c908b7bdeed0966b7b9baf68ae4382b583bca
MOBILE_MONEY_REFERENCE=ivoirshop
MOBILE_MONEY_API_URL=https://api-checkout.cinetpay.com/v2

# Seuil de paiement (en FCFA)
PAYMENT_THRESHOLD=150000
```

### 2. Provider de paiement

Le système utilise actuellement **CinetPay** comme provider de paiement. CinetPay supporte tous les opérateurs mobiles de Côte d'Ivoire :
- Orange Money
- MTN Money
- Moov Money
- Wave

## 📊 Logique de paiement

### Cas 1 : Commandes < 150 000 FCFA

Pour les commandes inférieures à 150 000 FCFA, deux options sont disponibles :

#### Option A : Paiement à la livraison
- ✅ **Disponible uniquement à Abidjan-Lagunes**
- Le client paie en espèces lors de la réception
- Aucun paiement en ligne requis

#### Option B : Paiement par Mobile Money
- ✅ **Disponible dans toutes les régions et villes**
- Paiement du montant total en ligne
- Confirmation immédiate

### Cas 2 : Commandes ≥ 150 000 FCFA

Pour les commandes de 150 000 FCFA et plus :

- ⚠️ **Paiement partiel OBLIGATOIRE**
- 50% du montant total doit être payé par Mobile Money
- Le reste (50%) sera payé à la livraison
- Disponible dans toutes les régions
- ❌ Pas de paiement à la livraison uniquement

**Exemple :**
- Commande de 200 000 FCFA
- À payer maintenant : 100 000 FCFA (via Mobile Money)
- À payer à la livraison : 100 000 FCFA (en espèces)

## 🔧 Structure technique

### API Endpoints

#### 1. Initiation du paiement
```
POST /api/payment/mobile-money/initiate
```

**Body :**
```json
{
  "phone": "0101010101",
  "amount": 50000,
  "order_id": 123,
  "customer_name": "John",
  "customer_surname": "Doe",
  "customer_email": "john@example.com",
  "customer_id": 45
}
```

**Response :**
```json
{
  "success": true,
  "transaction_id": "ivoirshop-123-1234567890",
  "payment_token": "abc123...",
  "payment_url": "https://...",
  "message": "Paiement initié avec succès"
}
```

#### 2. Vérification du statut
```
POST /api/payment/mobile-money/verify
```

**Body :**
```json
{
  "transaction_id": "ivoirshop-123-1234567890"
}
```

**Response :**
```json
{
  "success": true,
  "status": "completed",
  "transaction_id": "ivoirshop-123-1234567890",
  "amount": 50000,
  "operator": "ORANGE_MONEY",
  "payment_method": "MOBILE",
  "message": "Paiement confirmé avec succès"
}
```

#### 3. Callback de notification
```
POST /api/payment/mobile-money/callback
```

Cet endpoint reçoit automatiquement les notifications du provider de paiement.

### Composants

#### MobileMoneyPayment.vue

Composant réutilisable pour le formulaire de paiement mobile money.

**Props :**
- `amount` : Montant à payer
- `totalAmount` : Montant total de la commande
- `isPartialPayment` : Boolean indiquant si c'est un paiement partiel
- `orderId` : ID de la commande
- `customerName` : Nom du client
- `customerEmail` : Email du client
- `customerId` : ID du client

**Events :**
- `@payment-success` : Émis quand le paiement est confirmé
- `@payment-failed` : Émis quand le paiement échoue

**Exemple d'utilisation :**
```vue
<MobileMoneyPayment
  :amount="50000"
  :total-amount="100000"
  :is-partial-payment="true"
  :order-id="123"
  customer-name="John Doe"
  customer-email="john@example.com"
  :customer-id="45"
  @payment-success="handlePaymentSuccess"
  @payment-failed="handlePaymentFailed"
/>
```

## 📱 Validation du numéro de téléphone

Le système valide automatiquement les numéros de téléphone ivoiriens :

### Format requis
- **10 chiffres sans l'indicatif pays** (+225)
- Exemples valides : `0101010101`, `0501020304`, `0707080901`

### Préfixes valides
- `01` : Orange (Orange Money)
- `05` : MTN (MTN Money, MoMo)
- `07` : Moov (Moov Money, Flooz)

### Validation automatique
- ❌ Nombre de chiffres incorrect
- ❌ Préfixe invalide
- ❌ Caractères non numériques
- ✅ Format correct avec préfixe valide

## 🎯 Flux de paiement

### Pour le client

1. **Sélection du mode de paiement**
   - Le système affiche automatiquement les options disponibles selon le montant et la région

2. **Saisie du numéro de téléphone**
   - Format : 10 chiffres sans +225
   - Validation en temps réel

3. **Initiation du paiement**
   - Le client clique sur "Initier le paiement"
   - Une requête est envoyée au provider

4. **Confirmation sur le téléphone**
   - Le client reçoit un message sur son mobile
   - Il compose son code PIN pour valider

5. **Vérification automatique**
   - Le système vérifie le statut toutes les 5 secondes
   - Affiche la confirmation une fois le paiement validé

6. **Finalisation de la commande**
   - Le client peut finaliser sa commande
   - La commande est créée dans WooCommerce

### Pour le développeur

1. L'utilisateur soumet le formulaire de paiement
2. API `/api/payment/mobile-money/initiate` est appelée
3. Le provider (CinetPay) initie la transaction
4. Le client valide sur son téléphone
5. API `/api/payment/mobile-money/verify` vérifie le statut
6. Event `payment-success` est émis
7. Le `transaction_id` est stocké
8. La commande est créée avec le statut de paiement

## 🔒 Sécurité

### Validation côté serveur
- Tous les montants sont validés côté serveur
- Les numéros de téléphone sont vérifiés avec regex
- Les clés API ne sont jamais exposées au client

### Prévention des fraudes
- Vérification du statut avant création de commande
- Transaction ID unique par commande
- Callback sécurisé avec signature (à implémenter)

## 🧪 Tests

### Test Cas 1 (< 150 000 FCFA)

**Scénario A : Abidjan-Lagunes**
1. Ajouter des produits pour un total < 150 000 FCFA
2. Sélectionner "Abidjan-Lagunes" comme région
3. ✅ Vérifier que "Paiement à la livraison" est disponible
4. ✅ Vérifier que "Paiement Mobile Money" est disponible

**Scénario B : Autre région**
1. Ajouter des produits pour un total < 150 000 FCFA
2. Sélectionner une autre région (ex: Yamoussoukro)
3. ❌ Vérifier que "Paiement à la livraison" n'est PAS disponible
4. ✅ Vérifier que "Paiement Mobile Money" est disponible

### Test Cas 2 (≥ 150 000 FCFA)

1. Ajouter des produits pour un total ≥ 150 000 FCFA
2. Aller au checkout
3. ✅ Vérifier l'alerte orange "Paiement partiel requis"
4. ✅ Vérifier que le montant affiché = 50% du total
5. ✅ Vérifier que "Mobile Money" est obligatoire
6. ❌ Vérifier que "Paiement à la livraison" n'est PAS disponible
7. Tester le paiement avec un numéro de test

## 📝 Notes importantes

### Provider de paiement (CinetPay)

- **Mode Test** : Utilisez les clés API de test fournies
- **Mode Production** : Remplacez par vos clés de production
- **Frais** : Vérifiez les frais de transaction avec CinetPay
- **Support** : https://cinetpay.com/support

### Numéros de test

Pour tester en environnement de développement, utilisez les numéros de test fournis par CinetPay (généralement des numéros spéciaux qui simulent les paiements).

### Callback URL

Assurez-vous que l'URL de callback est accessible publiquement :
```
https://votre-domaine.com/api/payment/mobile-money/callback
```

Configurez cette URL dans votre compte CinetPay.

## 🚀 Déploiement

### 1. Variables d'environnement en production

```bash
# Sur Vercel, Netlify, etc.
MOBILE_MONEY_API_KEY=votre_clé_production
MOBILE_MONEY_API_SECRET=votre_secret_production
MOBILE_MONEY_REFERENCE=ivoirshop
MOBILE_MONEY_API_URL=https://api-checkout.cinetpay.com/v2
PAYMENT_THRESHOLD=150000
```

### 2. Webhook/Callback

Configurez l'URL de callback dans votre compte CinetPay :
```
https://ivoirshop.ci/api/payment/mobile-money/callback
```

### 3. Test en production

1. Faites un premier test avec un petit montant
2. Vérifiez les logs du serveur
3. Confirmez la réception du callback
4. Vérifiez la mise à jour de la commande

## 📞 Support

Pour toute question ou problème :
- **Email** : support@ivoirshop.ci
- **Téléphone** : +225 07 01 51 88 45
- **Documentation CinetPay** : https://docs.cinetpay.com

## 🔄 Mises à jour futures

### À implémenter
- [ ] Validation de signature du callback
- [ ] Gestion des remboursements
- [ ] Historique des transactions
- [ ] Dashboard d'administration
- [ ] Notifications par email/SMS
- [ ] Multi-devise (si expansion)

---

**Version** : 1.0.0  
**Dernière mise à jour** : Décembre 2025  
**Auteur** : Équipe IvoirShop.ci

