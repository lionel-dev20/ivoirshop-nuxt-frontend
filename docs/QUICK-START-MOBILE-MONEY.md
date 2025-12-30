# 🚀 Guide de démarrage rapide - Paiement Mobile Money

## ✅ Ce qui a été installé

Le système de paiement mobile money a été entièrement configuré avec les fonctionnalités suivantes :

### 1. API de paiement (Backend)
- ✅ `server/api/payment/mobile-money/initiate.post.ts` - Initiation du paiement
- ✅ `server/api/payment/mobile-money/verify.post.ts` - Vérification du statut
- ✅ `server/api/payment/mobile-money/callback.post.ts` - Réception des notifications

### 2. Composant UI (Frontend)
- ✅ `app/components/MobileMoneyPayment.vue` - Formulaire de paiement
  - Validation automatique du numéro de téléphone ivoirien
  - Interface utilisateur intuitive
  - Gestion des états de paiement

### 3. Page Checkout modifiée
- ✅ Logique de paiement selon le montant de la commande
- ✅ Affichage conditionnel des options de paiement
- ✅ Gestion du paiement partiel (≥ 150 000 FCFA)
- ✅ Restriction du paiement à la livraison (Abidjan-Lagunes uniquement)

### 4. Configuration
- ✅ Variables d'environnement ajoutées dans `nuxt.config.ts`
- ✅ Documentation complète créée

## 🔧 Configuration requise (IMPORTANT)

### Étape 1 : Créer/Modifier le fichier `.env`

Créez un fichier `.env` à la racine du projet (si ce n'est pas déjà fait) et ajoutez ces variables :

```env
# Variables existantes (ne pas modifier)
WORDPRESS_URL=https://admin.ivoirshop.ci
WC_STORE_URL=https://admin.ivoirshop.ci
WOOCOMMERCE_API_URL=https://admin.ivoirshop.ci/wp-json/wc/v3
WOOCOMMERCE_CONSUMER_KEY=votre_clé_existante
WOOCOMMERCE_CONSUMER_SECRET=votre_secret_existant

# NOUVELLES VARIABLES - Mobile Money Payment
MOBILE_MONEY_API_KEY=DJN-ef383bb7-2c4d-4efa-92a0-4e23f0dcf1d5
MOBILE_MONEY_API_SECRET=3e44f3e16cbd39a6107f4e8a642c908b7bdeed0966b7b9baf68ae4382b583bca
MOBILE_MONEY_REFERENCE=ivoirshop
MOBILE_MONEY_API_URL=https://api-checkout.cinetpay.com/v2
PAYMENT_THRESHOLD=150000
```

### Étape 2 : Installer les dépendances (si nécessaire)

```bash
npm install
```

### Étape 3 : Redémarrer le serveur de développement

```bash
npm run dev
```

## 🧪 Test en local

### Test 1 : Commande < 150 000 FCFA à Abidjan-Lagunes

1. Ajoutez des produits dans le panier (total < 150 000 FCFA)
2. Allez au checkout : `http://localhost:3000/checkout`
3. Sélectionnez **Région** : "Abidjan-Lagunes"
4. Sélectionnez une commune
5. ✅ Vérifiez que vous avez 2 options :
   - **Paiement à la livraison**
   - **Paiement Mobile Money**

### Test 2 : Commande < 150 000 FCFA hors Abidjan-Lagunes

1. Ajoutez des produits dans le panier (total < 150 000 FCFA)
2. Allez au checkout
3. Sélectionnez une autre région (ex: "Yamoussoukro")
4. ✅ Vérifiez que vous avez seulement :
   - **Paiement Mobile Money**
5. ❌ Le paiement à la livraison ne doit PAS être disponible

### Test 3 : Commande ≥ 150 000 FCFA (toutes régions)

1. Ajoutez des produits dans le panier (total ≥ 150 000 FCFA)
2. Allez au checkout
3. Sélectionnez n'importe quelle région
4. ✅ Vérifiez :
   - Une alerte orange apparaît : "Paiement partiel requis"
   - Le montant à payer = 50% du total
   - Seule l'option **Paiement Mobile Money** est disponible
   - L'option est marquée comme "(Obligatoire)"

### Test 4 : Validation du numéro de téléphone

1. Sélectionnez "Paiement Mobile Money"
2. Testez ces numéros :
   - ✅ `0101010101` (Orange) - Doit être accepté
   - ✅ `0501020304` (MTN) - Doit être accepté
   - ✅ `0707080901` (Moov) - Doit être accepté
   - ❌ `0901020304` - Doit être refusé (préfixe invalide)
   - ❌ `01010101` - Doit être refusé (trop court)
   - ❌ `010101010101` - Doit être refusé (trop long)

## 📋 Checklist avant production

### Configuration
- [ ] Variables d'environnement ajoutées dans `.env`
- [ ] Variables d'environnement configurées sur votre hébergeur (Vercel/Netlify/etc.)
- [ ] Clés API CinetPay de PRODUCTION configurées
- [ ] Seuil de paiement vérifié (150 000 FCFA)

### Compte CinetPay
- [ ] Compte CinetPay créé (https://cinetpay.com)
- [ ] Clés API de production récupérées
- [ ] URL de callback configurée : `https://votre-domaine.com/api/payment/mobile-money/callback`
- [ ] Compte vérifié et activé

### Tests
- [ ] Test de paiement avec un montant < 150 000 FCFA
- [ ] Test de paiement avec un montant ≥ 150 000 FCFA
- [ ] Test de validation du numéro de téléphone
- [ ] Test de la restriction Abidjan-Lagunes pour COD
- [ ] Test du callback de paiement

### WooCommerce (Backend)
- [ ] Plugin WooCommerce installé et activé
- [ ] Endpoint personnalisé `/wp-json/custom/v1/create-order` fonctionnel
- [ ] Gestion des commandes avec paiement mobile money
- [ ] Statuts de commande configurés

## 🚨 Problèmes courants

### Erreur : "Configuration de paiement mobile manquante"

**Solution :** Vérifiez que toutes les variables d'environnement sont bien définies dans `.env`

```bash
# Vérifier les variables
echo $MOBILE_MONEY_API_KEY
echo $MOBILE_MONEY_API_SECRET
```

### Erreur : "Service de paiement indisponible"

**Solution :** 
1. Vérifiez votre connexion internet
2. Vérifiez que l'URL de l'API est correcte
3. Vérifiez que vos clés API sont valides

### Le formulaire de paiement ne s'affiche pas

**Solution :**
1. Vérifiez que le composant `MobileMoneyPayment.vue` existe
2. Vérifiez la console du navigateur pour les erreurs
3. Assurez-vous que `orderForm.paymentMethod === 'mobile_money'`

### Le paiement à la livraison ne s'affiche pas à Abidjan-Lagunes

**Solution :**
1. Vérifiez que le total est < 150 000 FCFA
2. Vérifiez que la région sélectionnée est exactement "Abidjan-Lagunes" (sensible à la casse)
3. Vérifiez le fichier `data/delivery-zones.json`

## 📞 Support

### Documentation complète
Consultez `docs/MOBILE-MONEY-PAYMENT.md` pour la documentation détaillée.

### Contacts
- **Email** : support@ivoirshop.ci
- **Téléphone** : +225 07 01 51 88 45

### Ressources CinetPay
- **Documentation** : https://docs.cinetpay.com
- **Support** : https://cinetpay.com/support
- **Dashboard** : https://dashboard.cinetpay.com

## 🎉 C'est tout !

Votre système de paiement mobile money est maintenant configuré et prêt à l'emploi.

**Prochaines étapes recommandées :**
1. Configurez vos clés API de production
2. Testez en mode sandbox
3. Configurez le callback URL
4. Déployez en production
5. Faites des tests réels avec de petits montants

---

**Besoin d'aide ?** N'hésitez pas à consulter la documentation complète ou à contacter le support.

