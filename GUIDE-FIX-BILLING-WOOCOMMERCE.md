# Guide Correction Billing WooCommerce

## 🚨 Problème Identifié

**Problème :** Les données billing ne sont pas correctement transmises à WooCommerce.

**Symptômes :**
- Billing: Eric Atangana, France
- Pas d'adresse de livraison
- Données manquantes

## 🔍 Diagnostic

### 1. **Vérification de l'endpoint WordPress**

L'endpoint `/wp-json/custom/v1/create-order` doit être configuré dans `functions.php` pour traiter les données billing.

### 2. **Structure des données attendue**

```php
// Dans functions.php - Endpoint create-order
function create_custom_order($request) {
    $data = $request->get_json_params();
    
    // Récupération des données billing
    $billing = $data['billing'] ?? [];
    
    // Création de la commande WooCommerce
    $order = wc_create_order();
    
    // Configuration du billing
    $order->set_billing_first_name($billing['first_name'] ?? '');
    $order->set_billing_last_name($billing['last_name'] ?? '');
    $order->set_billing_email($billing['email'] ?? '');
    $order->set_billing_phone($billing['phone'] ?? '');
    $order->set_billing_address_1($billing['address_1'] ?? '');
    $order->set_billing_city($billing['city'] ?? '');
    $order->set_billing_state($billing['state'] ?? '');
    $order->set_billing_postcode($billing['postcode'] ?? '');
    $order->set_billing_country($billing['country'] ?? 'CI');
    
    // Configuration du shipping (même que billing)
    $order->set_shipping_first_name($billing['first_name'] ?? '');
    $order->set_shipping_last_name($billing['last_name'] ?? '');
    $order->set_shipping_address_1($billing['address_1'] ?? '');
    $order->set_shipping_city($billing['city'] ?? '');
    $order->set_shipping_state($billing['state'] ?? '');
    $order->set_shipping_postcode($billing['postcode'] ?? '');
    $order->set_shipping_country($billing['country'] ?? 'CI');
    
    // Sauvegarde
    $order->save();
    
    return new WP_REST_Response([
        'success' => true,
        'order_id' => $order->get_id(),
        'order_number' => $order->get_order_number(),
        'order_status' => $order->get_status(),
        'total' => $order->get_total()
    ], 200);
}
```

## 🔧 Corrections Apportées

### 1. **Endpoint Nuxt corrigé**

**Fichier :** `server/api/orders/create.ts`

**Changements :**
- ✅ Ajout de la structure `billing` dans les données envoyées
- ✅ Utilisation des données de la zone de livraison
- ✅ Structure compatible WooCommerce

### 2. **Structure des données**

**Avant :**
```javascript
customer: {
  firstName: 'Eric',
  lastName: 'Atangana',
  email: 'lioneleda.dev@gmail.com',
  phone: '671242099',
  address: '', // ← Manquant
  city: '',    // ← Manquant
  // ...
}
```

**Après :**
```javascript
billing: {
  first_name: 'Eric',
  last_name: 'Atangana',
  email: 'lioneleda.dev@gmail.com',
  phone: '671242099',
  address_1: 'Cocody',    // ← Commune sélectionnée
  city: 'Abidjan',        // ← Ville sélectionnée
  state: '',
  postcode: '',
  country: 'CI'
}
```

## 🧪 Tests

### 1. **Script de test**

```bash
node test-billing-data.js
```

### 2. **Test manuel**

1. Aller sur `/checkout`
2. Remplir les informations personnelles
3. Sélectionner une ville et une commune
4. Soumettre la commande
5. Vérifier dans WooCommerce

### 3. **Endpoint de test**

```bash
curl -X POST http://localhost:3000/api/orders/test-billing \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "firstName": "Eric",
      "lastName": "Atangana",
      "email": "lioneleda.dev@gmail.com",
      "phone": "671242099"
    },
    "billing": {
      "first_name": "Eric",
      "last_name": "Atangana",
      "email": "lioneleda.dev@gmail.com",
      "phone": "671242099",
      "address_1": "Cocody",
      "city": "Abidjan",
      "country": "CI"
    },
    "items": [{"id": 1, "name": "Test", "quantity": 1, "price": 100}],
    "total": 100
  }'
```

## 📋 Vérification dans WooCommerce

### **Champs billing attendus :**
- **Prénom :** Eric
- **Nom :** Atangana
- **Email :** lioneleda.dev@gmail.com
- **Téléphone :** 671242099
- **Adresse :** Cocody (commune sélectionnée)
- **Ville :** Abidjan (ville sélectionnée)
- **Pays :** Côte d'Ivoire

### **Champs shipping attendus :**
- **Adresse :** Cocody (commune sélectionnée)
- **Ville :** Abidjan (ville sélectionnée)
- **Pays :** Côte d'Ivoire

## 🔧 Code WordPress Requis

### **Dans functions.php :**

```php
// Endpoint pour créer une commande
add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/create-order', array(
        'methods' => 'POST',
        'callback' => 'create_custom_order',
        'permission_callback' => '__return_true'
    ));
});

function create_custom_order($request) {
    $data = $request->get_json_params();
    
    // Récupération des données
    $customer = $data['customer'] ?? [];
    $billing = $data['billing'] ?? [];
    $items = $data['items'] ?? [];
    $shipping_cost = $data['shipping_cost'] ?? 0;
    $total = $data['total'] ?? 0;
    $payment_method = $data['payment_method'] ?? 'cod';
    
    // Création de la commande
    $order = wc_create_order();
    
    // Configuration du billing
    $order->set_billing_first_name($billing['first_name'] ?? '');
    $order->set_billing_last_name($billing['last_name'] ?? '');
    $order->set_billing_email($billing['email'] ?? '');
    $order->set_billing_phone($billing['phone'] ?? '');
    $order->set_billing_address_1($billing['address_1'] ?? '');
    $order->set_billing_city($billing['city'] ?? '');
    $order->set_billing_state($billing['state'] ?? '');
    $order->set_billing_postcode($billing['postcode'] ?? '');
    $order->set_billing_country($billing['country'] ?? 'CI');
    
    // Configuration du shipping (même que billing)
    $order->set_shipping_first_name($billing['first_name'] ?? '');
    $order->set_shipping_last_name($billing['last_name'] ?? '');
    $order->set_shipping_address_1($billing['address_1'] ?? '');
    $order->set_shipping_city($billing['city'] ?? '');
    $order->set_shipping_state($billing['state'] ?? '');
    $order->set_shipping_postcode($billing['postcode'] ?? '');
    $order->set_shipping_country($billing['country'] ?? 'CI');
    
    // Ajout des produits
    foreach ($items as $item) {
        $product = wc_get_product($item['product_id']);
        if ($product) {
            $order->add_product($product, $item['quantity']);
        }
    }
    
    // Configuration des frais de livraison
    if ($shipping_cost > 0) {
        $shipping = new WC_Order_Item_Shipping();
        $shipping->set_method_title('Livraison');
        $shipping->set_method_id('delivery');
        $shipping->set_total($shipping_cost);
        $order->add_item($shipping);
    }
    
    // Configuration du paiement
    $order->set_payment_method($payment_method);
    $order->set_payment_method_title('Paiement à la livraison');
    
    // Sauvegarde
    $order->save();
    
    return new WP_REST_Response([
        'success' => true,
        'order_id' => $order->get_id(),
        'order_number' => $order->get_order_number(),
        'order_status' => $order->get_status(),
        'total' => $order->get_total(),
        'message' => 'Commande créée avec succès'
    ], 200);
}
```

## 🚀 Prochaines Étapes

1. **Vérifier l'endpoint WordPress** dans `functions.php`
2. **Tester avec** `node test-billing-data.js`
3. **Vérifier dans WooCommerce** que les données sont correctes
4. **Ajuster si nécessaire** l'endpoint WordPress

## ✅ Résumé

**Problème :** Données billing manquantes dans WooCommerce
**Solution :** Correction de l'endpoint Nuxt et vérification de l'endpoint WordPress
**Résultat :** Données billing correctement transmises avec ville et commune sélectionnées

