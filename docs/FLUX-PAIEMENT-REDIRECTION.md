# 🔄 Flux de Paiement par Redirection

## 📋 Vue d'ensemble

Le système utilise maintenant un **flux de redirection** vers une page de paiement externe. Le client est redirigé vers `https://apidjonanko.tech/web-merchant/create-web-payment-link` pour effectuer le paiement, puis revient sur votre site.

---

## 🔄 Flux Complet

### 1️⃣ Client remplit le checkout

```
1. Client ajoute des produits au panier
2. Va au checkout (/checkout)
3. Remplit :
   - Informations personnelles (nom, prénom, email, téléphone)
   - Adresse de livraison (région, commune, détails)
   - Sélectionne "Paiement Mobile Money"
4. Entre son numéro de téléphone mobile (ex: 0101010101)
5. Clique sur "Payer maintenant"
```

### 2️⃣ Création de la commande

```
1. Le système crée la commande dans WooCommerce
2. Statut initial : "pending" (en attente)
3. Enregistrement de toutes les informations :
   - Produits commandés
   - Adresse de livraison
   - Montant total
   - Frais de livraison
   - Numéro de téléphone pour le paiement
```

### 3️⃣ Redirection vers la page de paiement

```
Le client est redirigé vers :
https://apidjonanko.tech/web-merchant/create-web-payment-link

Avec ces paramètres :
- amount : Montant à payer (ex: 50000)
- merchant_reference : "ivoirshop"
- phone : Numéro de téléphone (ex: 0101010101)
- order_id : ID de la commande WooCommerce
- customer_name : Nom complet du client
- customer_email : Email du client
- successUrl : URL de retour en cas de succès
- failedUrl : URL de retour en cas d'échec
- webhookUrl : URL pour les notifications serveur
```

**Exemple d'URL complète :**
```
https://apidjonanko.tech/web-merchant/create-web-payment-link?amount=50000&merchant_reference=ivoirshop&phone=0101010101&order_id=123&customer_name=Jean+Dupont&customer_email=jean@example.com&successUrl=https://ivoirshop.ci/thank-you?order_id=123&failedUrl=https://ivoirshop.ci/checkout?payment_failed=true&order_id=123&webhookUrl=https://ivoirshop.ci/api/payment/mobile-money/callback
```

### 4️⃣ Client paie sur la page externe

```
1. Client arrive sur la page de paiement d'apidjonanko.tech
2. Confirme les détails du paiement
3. Entre son code PIN Mobile Money
4. Valide le paiement
```

### 5️⃣ Retour après paiement

#### ✅ Si paiement réussi

```
1. La page externe redirige vers : successUrl
   https://ivoirshop.ci/thank-you?order_id=123

2. La page thank-you affiche :
   - Confirmation de commande
   - Numéro de commande
   - Récapitulatif des produits
   - Informations de livraison
   - Montant payé

3. Le webhook est également appelé par le serveur de paiement
   POST https://ivoirshop.ci/api/payment/mobile-money/callback
   
   Body :
   {
     "transaction_id": "xxx-xxx-xxx",
     "status": "success",
     "amount": 50000,
     "createdAt": "2025-12-30T...",
     "updatedAt": "2025-12-30T..."
   }

4. Le statut de la commande peut être mis à jour automatiquement
```

#### ❌ Si paiement échoué

```
1. La page externe redirige vers : failedUrl
   https://ivoirshop.ci/checkout?payment_failed=true&order_id=123

2. Le client revient au checkout avec :
   - Message d'erreur affiché
   - Possibilité de réessayer
   - Toutes les informations pré-remplies
   - Commande toujours en status "pending"
```

---

## 📊 Schéma du Flux

```
┌─────────────┐
│   CLIENT    │
│   PANIER    │
└──────┬──────┘
       │
       ↓
┌──────────────────────┐
│   CHECKOUT PAGE      │
│ - Infos client       │
│ - Adresse            │
│ - Tel Mobile Money   │
└──────┬───────────────┘
       │ Click "Payer"
       ↓
┌──────────────────────┐
│  CRÉATION COMMANDE   │
│  WooCommerce         │
│  Status: pending     │
└──────┬───────────────┘
       │
       ↓
┌─────────────────────────────────────┐
│  REDIRECTION VERS PAGE EXTERNE      │
│  https://apidjonanko.tech/...       │
│  - Client entre code PIN            │
│  - Validation paiement              │
└─────────┬──────────┬────────────────┘
          │          │
     SUCCESS         FAILED
          │          │
          ↓          ↓
    ┌─────────┐  ┌──────────┐
    │ THANK   │  │ CHECKOUT │
    │ YOU     │  │ + ERROR  │
    └─────────┘  └──────────┘
          │
          ↓
    ┌──────────┐
    │ WEBHOOK  │
    │ CALLBACK │
    └──────────┘
```

---

## 🔧 Configuration Technique

### URLs Générées Automatiquement

Le système génère automatiquement les URLs selon l'environnement :

#### En Production
```javascript
successUrl:  https://ivoirshop.ci/thank-you?order_id=123
failedUrl:   https://ivoirshop.ci/checkout?payment_failed=true&order_id=123
webhookUrl:  https://ivoirshop.ci/api/payment/mobile-money/callback
```

#### En Développement Local
```javascript
successUrl:  http://localhost:3000/thank-you?order_id=123
failedUrl:   http://localhost:3000/checkout?payment_failed=true&order_id=123
webhookUrl:  http://localhost:3000/api/payment/mobile-money/callback
```

### Paramètres Envoyés

| Paramètre | Type | Description | Exemple |
|-----------|------|-------------|---------|
| `amount` | number | Montant en FCFA | 50000 |
| `merchant_reference` | string | Référence marchand | ivoirshop |
| `phone` | string | Numéro mobile (10 chiffres) | 0101010101 |
| `order_id` | number | ID commande WooCommerce | 123 |
| `customer_name` | string | Nom complet | Jean Dupont |
| `customer_email` | string | Email | jean@example.com |
| `successUrl` | string | URL de retour succès | https://... |
| `failedUrl` | string | URL de retour échec | https://... |
| `webhookUrl` | string | URL webhook serveur | https://... |

---

## 💡 Avantages de ce Flux

### ✅ Pour le Client
- Interface de paiement dédiée et sécurisée
- Pas besoin d'attendre sur votre site
- Expérience familière (comme PayPal, Stripe)
- Retour automatique après paiement

### ✅ Pour Vous
- Commande créée avant le paiement (pas de perte)
- Gestion simplifiée des retours
- Webhook pour confirmation serveur
- Moins de code côté frontend
- Plus sécurisé (pas de traitement sensible côté client)

---

## 🧪 Test du Flux

### En Développement Local

1. **Lancez le serveur**
   ```bash
   npm run dev
   ```

2. **Ajoutez des produits au panier**

3. **Allez au checkout**
   ```
   http://localhost:3000/checkout
   ```

4. **Remplissez le formulaire**
   - Nom, prénom, téléphone
   - Sélectionnez région et commune
   - Choisissez "Paiement Mobile Money"
   - Entrez un numéro : 0101010101

5. **Cliquez sur "Payer maintenant"**
   - La commande est créée
   - Vous êtes redirigé vers la page de paiement externe

6. **Sur la page externe**
   - Validez le paiement
   - Vous êtes redirigé vers thank-you

### ⚠️ Note pour les Tests Locaux

Pour tester le webhook en local, vous devez utiliser **ngrok** ou un tunnel similaire :

```bash
# Terminal 1 : Lancez votre serveur
npm run dev

# Terminal 2 : Lancez ngrok
ngrok http 3000

# Copiez l'URL générée (ex: https://abc123.ngrok.io)
# Mettez-la dans .env :
NUXT_PUBLIC_SITE_URL=https://abc123.ngrok.io
```

Puis redémarrez le serveur. Maintenant le webhook pourra être appelé depuis Internet.

---

## 🔒 Sécurité

### Webhook

Le webhook reçoit des notifications du serveur de paiement. Il faut :

1. **Vérifier la signature** (si fournie par l'API)
2. **Valider l'IP source** (liste blanche)
3. **Vérifier les données** (montant, order_id, etc.)
4. **Ne jamais faire confiance uniquement au retour client** (successUrl)

### Protection CSRF

Les redirections passent par des URLs publiques. Pour éviter les abus :

1. La commande est créée AVANT la redirection
2. L'order_id est passé dans l'URL
3. Le webhook valide le paiement côté serveur

---

## 📝 Page de Paiement Externe

La page `https://apidjonanko.tech/web-merchant/create-web-payment-link` doit :

1. **Recevoir les paramètres** en GET
2. **Afficher les détails** du paiement
3. **Traiter le paiement** Mobile Money
4. **Rediriger vers successUrl** si OK
5. **Rediriger vers failedUrl** si KO
6. **Appeler le webhookUrl** pour notifier le serveur

---

## 🎯 Checklist de Déploiement

### Avant de déployer en production :

- [ ] Tester le flux complet en local
- [ ] Vérifier que la page externe fonctionne
- [ ] Configurer `NUXT_PUBLIC_SITE_URL=https://ivoirshop.ci` en production
- [ ] Vérifier que le webhook est accessible depuis Internet
- [ ] Tester avec un vrai paiement (petit montant)
- [ ] Vérifier que la commande est créée dans WooCommerce
- [ ] Vérifier que le statut est mis à jour après paiement
- [ ] Tester le cas d'échec (failedUrl)

---

## 🆘 Dépannage

### La redirection ne fonctionne pas

- Vérifiez la console du navigateur (F12)
- Vérifiez que la commande est créée
- Vérifiez l'URL de redirection générée

### Le webhook n'est pas appelé

- Vérifiez que l'URL est accessible depuis Internet
- Utilisez ngrok en local
- Vérifiez les logs du serveur

### Le client revient mais la commande n'est pas mise à jour

- Le webhook n'a peut-être pas été appelé
- Vérifiez les logs du webhook
- Implémentez la vérification de signature

---

**Le système est maintenant prêt pour les paiements par redirection !** 🚀

