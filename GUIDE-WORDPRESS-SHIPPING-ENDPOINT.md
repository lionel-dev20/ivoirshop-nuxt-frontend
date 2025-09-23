# Guide Endpoint WordPress - Billing et Shipping

## 🎯 Problème Résolu

**Problème :** Les données shipping n'apparaissaient pas dans WooCommerce.

**Solution :** Ajout des données shipping dans l'endpoint Nuxt et mise à jour de l'endpoint WordPress.

## 🔧 Code WordPress Requis

### **Dans functions.php :**

```php
// Endpoint pour créer une commande avec billing et shipping
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
    $shipping = $data['shipping'] ?? $billing; // Utilise billing si shipping manquant
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
    
    // Configuration du shipping
    $order->set_shipping_first_name($shipping['first_name'] ?? '');
    $order->set_shipping_last_name($shipping['last_name'] ?? '');
    $order->set_shipping_email($shipping['email'] ?? '');
    $order->set_shipping_phone($shipping['phone'] ?? '');
    $order->set_shipping_address_1($shipping['address_1'] ?? '');
    $order->set_shipping_city($shipping['city'] ?? '');
    $order->set_shipping_state($shipping['state'] ?? '');
    $order->set_shipping_postcode($shipping['postcode'] ?? '');
    $order->set_shipping_country($shipping['country'] ?? 'CI');
    
    // Ajout des produits
    foreach ($items as $item) {
        $product = wc_get_product($item['product_id']);
        if ($product) {
            $order->add_product($product, $item['quantity']);
        }
    }
    
    // Configuration des frais de livraison
    if ($shipping_cost > 0) {
        $shipping_item = new WC_Order_Item_Shipping();
        $shipping_item->set_method_title('Livraison');
        $shipping_item->set_method_id('delivery');
        $shipping_item->set_total($shipping_cost);
        $order->add_item($shipping_item);
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

## 📋 Structure des Données

### **Données envoyées par Nuxt :**

```javascript
{
  customer: {
    firstName: 'Eric',
    lastName: 'Atangana',
    email: 'lioneleda.dev@gmail.com',
    phone: '671242099',
    notes: 'Test de commande'
  },
  billing: {
    first_name: 'Eric',
    last_name: 'Atangana',
    email: 'lioneleda.dev@gmail.com',
    phone: '671242099',
    address_1: 'Cocody',    // Commune sélectionnée
    city: 'Abidjan',        // Ville sélectionnée
    state: '',
    postcode: '',
    country: 'CI'
  },
  shipping: {
    first_name: 'Eric',
    last_name: 'Atangana',
    email: 'lioneleda.dev@gmail.com',
    phone: '671242099',
    address_1: 'Cocody',    // Commune sélectionnée
    city: 'Abidjan',        // Ville sélectionnée
    state: '',
    postcode: '',
    country: 'CI'
  },
  items: [...],
  shipping_cost: 5.00,
  total: 105.00,
  payment_method: 'cod'
}
```

## 🧪 Tests

### **1. Script de test :**
```bash
node test-billing-data.js
```

### **2. Test manuel :**
1. Aller sur `/checkout`
2. Remplir les informations personnelles
3. Sélectionner une ville et une commune
4. Soumettre la commande
5. Vérifier dans WooCommerce

### **3. Vérification dans WooCommerce :**

**Champs billing attendus :**
- **Prénom :** Eric
- **Nom :** Atangana
- **Email :** lioneleda.dev@gmail.com
- **Téléphone :** 671242099
- **Adresse :** Cocody
- **Ville :** Abidjan
- **Pays :** Côte d'Ivoire

**Champs shipping attendus :**
- **Adresse :** Cocody
- **Ville :** Abidjan
- **Pays :** Côte d'Ivoire
- **Téléphone :** 671242099

## 🔍 Debugging

### **Logs à vérifier :**

1. **Logs Nuxt :**
   ```bash
   npm run dev
   # Regarder la console pour les logs de commande
   ```

2. **Logs WordPress :**
   ```bash
   # Regarder wp-content/debug.log
   tail -f wp-content/debug.log
   ```

3. **Test de l'endpoint :**
   ```bash
   curl -X POST http://localhost:3000/api/orders/test-billing \
     -H "Content-Type: application/json" \
     -d '{"billing": {...}, "shipping": {...}}'
   ```

## ✅ Résultat Attendu

**Dans WooCommerce :**
- ✅ Billing : Eric Atangana, Abidjan, Cocody, Côte d'Ivoire
- ✅ Shipping : Abidjan, Cocody, Côte d'Ivoire
- ✅ Téléphone : 671242099
- ✅ Email : lioneleda.dev@gmail.com

**Plus de champs vides !** 🎉

