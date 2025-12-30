# 🌐 Configuration des URLs de Paiement

## ✅ URLs Automatiquement Générées

Le système génère automatiquement les bonnes URLs selon votre environnement (développement ou production).

---

## 📋 URLs Configurées

### 🎯 En Production (ivoirshop.ci)

```javascript
{
  // URL de succès - Après un paiement réussi
  successUrl: "https://admin.ivoirshop.ci/thank-you?order_id=123",
  
  // URL d'échec - Après un paiement échoué
  failedUrl: "https://admin.ivoirshop.ci/checkout?payment_failed=true&order_id=123",
  
  // URL du webhook - Pour recevoir les notifications
  webhookUrl: "https://admin.ivoirshop.ci/api/payment/mobile-money/callback"
}
```

### 🧪 En Développement (localhost)

```javascript
{
  // URL de succès
  successUrl: "http://localhost:3000/thank-you?order_id=123",
  
  // URL d'échec
  failedUrl: "http://localhost:3000/checkout?payment_failed=true&order_id=123",
  
  // URL du webhook (nécessite ngrok pour tester)
  webhookUrl: "http://localhost:3000/api/payment/mobile-money/callback"
}
```

---

## 🔧 Comment ça fonctionne ?

### 1. Détection automatique de l'environnement

Le code utilise `WC_STORE_URL` du fichier `.env` :

```javascript
// Dans server/api/payment/mobile-money/initiate.post.ts
const baseUrl = config.public.WC_STORE_URL || 'http://localhost:3000'

const successUrl = `${baseUrl}/thank-you?order_id=${body.order_id}`
const failedUrl = `${baseUrl}/checkout?payment_failed=true&order_id=${body.order_id}`
const webhookUrl = `${baseUrl}/api/payment/mobile-money/callback`
```

### 2. Variables d'environnement

**Fichier `.env`** :
```env
WC_STORE_URL=https://admin.ivoirshop.ci  # Production
# OU
WC_STORE_URL=http://localhost:3000        # Développement
```

---

## 🎯 Flux de Paiement

### Scénario A : Paiement Réussi ✅

```
1. Utilisateur clique "Initier le paiement"
   ↓
2. Appel API → /api/payment/mobile-money/initiate
   ↓
3. API de paiement traite la demande
   ↓
4. Paiement confirmé
   ↓
5. Redirection → successUrl
   ↓
6. Page "thank-you" s'affiche
   ↓
7. Webhook reçu → /api/payment/mobile-money/callback
```

### Scénario B : Paiement Échoué ❌

```
1. Utilisateur clique "Initier le paiement"
   ↓
2. Appel API → /api/payment/mobile-money/initiate
   ↓
3. API de paiement traite la demande
   ↓
4. Paiement échoué (fonds insuffisants, annulation, etc.)
   ↓
5. Redirection → failedUrl
   ↓
6. Retour sur checkout avec message d'erreur
   ↓
7. Alerte rouge affichée: "Paiement échoué"
```

---

## 📱 Message d'Erreur sur Checkout

Quand le paiement échoue, l'utilisateur voit :

```
┌──────────────────────────────────────────┐
│ ⚠️  Paiement échoué                      │
│                                           │
│ Le paiement Mobile Money n'a pas pu être │
│ traité. Veuillez réessayer ou choisir    │
│ une autre méthode de paiement.           │
│                                           │
│ [Fermer ce message]                      │
└──────────────────────────────────────────┘
```

Le message se ferme automatiquement quand l'utilisateur clique dessus ou sélectionne une autre méthode de paiement.

---

## 🔗 Configuration pour votre API de Paiement

### Données envoyées à votre API

Quand un paiement est initié, votre API reçoit :

```json
{
  "amount": 50000,
  "merchant_reference": "ivoirshop",
  "phone": "0101010101",
  "order_id": 123,
  "customer_name": "Jean Dupont",
  "customer_email": "jean@example.com",
  
  // URLs de retour
  "successUrl": "https://admin.ivoirshop.ci/thank-you?order_id=123",
  "failedUrl": "https://admin.ivoirshop.ci/checkout?payment_failed=true&order_id=123",
  "webhookUrl": "https://admin.ivoirshop.ci/api/payment/mobile-money/callback"
}
```

### Ce que votre API doit faire

1. **Traiter le paiement**
2. **Envoyer le webhook** vers `webhookUrl` avec :
   ```json
   {
     "transaction_id": "50f668cf-2a84-41e7-9bcb-6874b0d5d286",
     "status": "success",
     "amount": 50000,
     "createdAt": "2025-08-28T08:00:00.000Z",
     "updatedAt": "2025-08-28T08:01:00.000Z"
   }
   ```

3. **Rediriger l'utilisateur** :
   - Vers `successUrl` si paiement OK
   - Vers `failedUrl` si paiement KO

---

## 🧪 Tester le Webhook en Local

### Problème

En développement local (`localhost:3000`), votre API de paiement ne peut pas appeler le webhook car `http://localhost:3000` n'est pas accessible depuis Internet.

### Solution : Utiliser ngrok

1. **Installez ngrok** : https://ngrok.com/download

2. **Lancez ngrok** :
   ```bash
   ngrok http 3000
   ```

3. **Copiez l'URL générée** :
   ```
   https://abc123.ngrok.io
   ```

4. **Mettez-la dans `.env`** :
   ```env
   WC_STORE_URL=https://abc123.ngrok.io
   ```

5. **Redémarrez le serveur** :
   ```bash
   npm run dev
   ```

Maintenant votre API peut appeler le webhook :
```
https://abc123.ngrok.io/api/payment/mobile-money/callback
```

---

## 📊 Logs pour Debugging

Les URLs sont automatiquement loggées dans la console :

```
Initiation du paiement mobile money: {
  amount: 50000,
  merchant_reference: 'ivoirshop',
  phone: '0101010101',
  order_id: 123,
  successUrl: 'https://admin.ivoirshop.ci/thank-you?order_id=123',
  failedUrl: 'https://admin.ivoirshop.ci/checkout?payment_failed=true&order_id=123',
  webhookUrl: 'https://admin.ivoirshop.ci/api/payment/mobile-money/callback'
}
```

---

## ✅ Checklist de Configuration

### Pour le Développement Local

- [ ] Vérifier `.env` : `WC_STORE_URL=http://localhost:3000`
- [ ] Serveur lancé : `npm run dev`
- [ ] (Optionnel) ngrok installé et lancé pour tester le webhook

### Pour la Production

- [ ] Vérifier `.env` : `WC_STORE_URL=https://admin.ivoirshop.ci`
- [ ] Variables d'environnement configurées sur l'hébergeur
- [ ] URL du webhook donnée à votre provider de paiement
- [ ] Tester un paiement réel avec un petit montant

---

## 🔒 Sécurité

### Webhook

Le webhook est public (il doit être appelé depuis Internet). Pour le sécuriser :

1. **Vérifier la signature** (si votre API la fournit)
2. **Vérifier l'IP source** (liste blanche)
3. **Valider les données** avant de les utiliser

### URLs de retour

Les `successUrl` et `failedUrl` incluent l'`order_id` en paramètre. Cela permet de :
- Afficher les bonnes informations sur la page de remerciement
- Retrouver la commande en cas d'échec

---

## 📞 Support

Si vous avez des questions sur les URLs ou besoin d'aide pour configurer votre API :

- Documentation complète : `docs/MOBILE-MONEY-PAYMENT.md`
- Mode simulation : `docs/MODE-SIMULATION-PAIEMENT.md`

---

## 🎉 Résumé

✅ **URLs automatiquement générées** selon l'environnement  
✅ **Message d'erreur** affiché en cas d'échec de paiement  
✅ **Webhook configuré** pour recevoir les notifications  
✅ **Logs détaillés** pour le debugging  

**Tout est prêt pour fonctionner avec votre API de paiement !** 🚀

