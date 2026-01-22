<?php
/**
 * CODE À AJOUTER DANS functions.php DE VOTRE THÈME WORDPRESS
 * 
 * Ce code crée l'endpoint custom/v1/create-order pour les paiements Mobile Money
 * 
 * Instructions:
 * 1. Ouvrir WordPress Admin
 * 2. Aller dans Apparence → Éditeur de fichiers
 * 3. Sélectionner functions.php
 * 4. COPIER TOUT CE CODE À LA FIN du fichier
 * 5. Sauvegarder
 */

// ============================================
// 1. CRÉER L'ENDPOINT CUSTOM POUR MOBILE MONEY
// ============================================

add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/create-order', array(
        'methods' => 'POST',
        'callback' => 'create_mobile_money_order',
        'permission_callback' => '__return_true' // Accès public pour webhook
    ));
});

/**
 * Créer une commande WooCommerce depuis le paiement Mobile Money
 */
function create_mobile_money_order($request) {
    // Récupérer les données de la requête
    $params = $request->get_json_params();
    
    // Log pour debugging
    error_log('📦 CRÉATION COMMANDE MOBILE MONEY');
    error_log('Données reçues: ' . print_r($params, true));
    
    try {
        // Vérifier que WooCommerce est actif
        if (!function_exists('wc_create_order')) {
            return new WP_Error(
                'woocommerce_inactive',
                'WooCommerce n\'est pas actif',
                array('status' => 500)
            );
        }
        
        // Créer la commande
        $order = wc_create_order();
        
        if (is_wp_error($order)) {
            error_log('❌ Erreur création commande: ' . $order->get_error_message());
            return new WP_Error(
                'order_creation_failed',
                $order->get_error_message(),
                array('status' => 500)
            );
        }
        
        // ============================================
        // AJOUTER LES PRODUITS À LA COMMANDE
        // ============================================
        if (isset($params['line_items']) && is_array($params['line_items'])) {
            foreach ($params['line_items'] as $item) {
                $product_id = isset($item['product_id']) ? intval($item['product_id']) : 0;
                $quantity = isset($item['quantity']) ? intval($item['quantity']) : 1;
                $price = isset($item['price']) ? floatval($item['price']) : 0;
                
                if ($product_id > 0) {
                    $product = wc_get_product($product_id);
                    
                    if ($product) {
                        $order->add_product($product, $quantity, array(
                            'subtotal' => $price * $quantity,
                            'total' => $price * $quantity
                        ));
                    } else {
                        error_log("⚠️ Produit {$product_id} non trouvé");
                    }
                }
            }
        }
        
        // ============================================
        // AJOUTER LES FRAIS DE LIVRAISON
        // ============================================
        if (isset($params['shipping_cost']) && $params['shipping_cost'] > 0) {
            $shipping_item = new WC_Order_Item_Shipping();
            $shipping_item->set_method_title('Livraison');
            $shipping_item->set_total($params['shipping_cost']);
            $order->add_item($shipping_item);
        }
        
        // ============================================
        // INFORMATIONS DE FACTURATION
        // ============================================
        if (isset($params['billing']) && is_array($params['billing'])) {
            $order->set_billing_first_name($params['billing']['first_name'] ?? '');
            $order->set_billing_last_name($params['billing']['last_name'] ?? '');
            $order->set_billing_email($params['billing']['email'] ?? '');
            $order->set_billing_phone($params['billing']['phone'] ?? '');
            $order->set_billing_address_1($params['billing']['address_1'] ?? '');
            $order->set_billing_address_2($params['billing']['address_2'] ?? '');
            $order->set_billing_city($params['billing']['city'] ?? '');
            $order->set_billing_state($params['billing']['state'] ?? '');
            $order->set_billing_postcode($params['billing']['postcode'] ?? '');
            $order->set_billing_country($params['billing']['country'] ?? 'CI');
        }
        
        // ============================================
        // INFORMATIONS DE LIVRAISON
        // ============================================
        if (isset($params['shipping']) && is_array($params['shipping'])) {
            $order->set_shipping_first_name($params['shipping']['first_name'] ?? '');
            $order->set_shipping_last_name($params['shipping']['last_name'] ?? '');
            $order->set_shipping_address_1($params['shipping']['address_1'] ?? '');
            $order->set_shipping_address_2($params['shipping']['address_2'] ?? '');
            $order->set_shipping_city($params['shipping']['city'] ?? '');
            $order->set_shipping_state($params['shipping']['state'] ?? '');
            $order->set_shipping_postcode($params['shipping']['postcode'] ?? '');
            $order->set_shipping_country($params['shipping']['country'] ?? 'CI');
        }
        
        // ============================================
        // CLIENT ID (si connecté)
        // ============================================
        if (isset($params['customer_id']) && $params['customer_id'] > 0) {
            $order->set_customer_id($params['customer_id']);
        }
        
        // ============================================
        // MÉTHODE DE PAIEMENT
        // ============================================
        $order->set_payment_method('mobile_money');
        $order->set_payment_method_title($params['payment_method_title'] ?? 'Mobile Money');
        
        // ============================================
        // TRANSACTION ID
        // ============================================
        if (isset($params['transaction_id'])) {
            $order->set_transaction_id($params['transaction_id']);
        }
        
        // ============================================
        // NOTE CLIENT
        // ============================================
        if (isset($params['customer_note'])) {
            $order->set_customer_note($params['customer_note']);
        }
        
        // ============================================
        // MÉTADONNÉES PERSONNALISÉES
        // ============================================
        if (isset($params['meta_data']) && is_array($params['meta_data'])) {
            foreach ($params['meta_data'] as $meta) {
                if (isset($meta['key']) && isset($meta['value'])) {
                    $order->update_meta_data($meta['key'], $meta['value']);
                }
            }
        }
        
        // ============================================
        // STATUT DE LA COMMANDE
        // ============================================
        $status = 'paye-par-mobile-money'; // Statut personnalisé
        
        // Vérifier si le statut personnalisé existe, sinon utiliser 'processing'
        $available_statuses = wc_get_order_statuses();
        if (!isset($available_statuses['wc-' . $status])) {
            $status = 'processing'; // Fallback
        }
        
        $order->set_status($status);
        
        // ============================================
        // MARQUER COMME PAYÉ
        // ============================================
        if (isset($params['set_paid']) && $params['set_paid'] === true) {
            $order->payment_complete($params['transaction_id'] ?? '');
        }
        
        // ============================================
        // CALCULER LES TOTAUX
        // ============================================
        $order->calculate_totals();
        
        // Sauvegarder la commande
        $order->save();
        
        // Log de succès
        $order_id = $order->get_id();
        error_log("✅ Commande #{$order_id} créée avec succès !");
        error_log("Statut: {$status}");
        error_log("Total: " . $order->get_total());
        
        // Retourner la réponse
        return new WP_REST_Response(array(
            'success' => true,
            'order_id' => $order_id,
            'order_number' => $order->get_order_number(),
            'status' => $order->get_status(),
            'total' => $order->get_total(),
            'message' => 'Commande créée avec succès'
        ), 200);
        
    } catch (Exception $e) {
        error_log('❌ ERREUR: ' . $e->getMessage());
        return new WP_Error(
            'order_creation_error',
            $e->getMessage(),
            array('status' => 500)
        );
    }
}

// ============================================
// 2. ENREGISTRER LE STATUT PERSONNALISÉ
// ============================================

// Enregistrer le statut "Payé par mobile money"
add_action('init', function() {
    register_post_status('wc-paye-par-mobile-money', array(
        'label' => 'Payé par mobile money',
        'public' => true,
        'exclude_from_search' => false,
        'show_in_admin_all_list' => true,
        'show_in_admin_status_list' => true,
        'label_count' => _n_noop(
            'Payé par mobile money <span class="count">(%s)</span>',
            'Payé par mobile money <span class="count">(%s)</span>'
        )
    ));
});

// Ajouter le statut à la liste WooCommerce
add_filter('wc_order_statuses', function($order_statuses) {
    $order_statuses['wc-paye-par-mobile-money'] = 'Payé par mobile money';
    return $order_statuses;
});

// Marquer ce statut comme "payé"
add_filter('woocommerce_order_is_paid_statuses', function($statuses) {
    $statuses[] = 'paye-par-mobile-money';
    return $statuses;
});

// Ajouter une icône verte dans le dashboard
add_action('admin_head', function() {
    ?>
    <style>
        .order-status.status-paye-par-mobile-money {
            background: #10b981;
            color: white;
            padding: 4px 12px;
            border-radius: 4px;
            font-weight: 500;
        }
    </style>
    <?php
});

// ============================================
// 3. AJOUTER LA MÉTHODE DE PAIEMENT MOBILE MONEY
// ============================================

add_filter('woocommerce_payment_gateways', function($gateways) {
    // Vérifier si la classe n'existe pas déjà
    if (!class_exists('WC_Gateway_Mobile_Money')) {
        class WC_Gateway_Mobile_Money extends WC_Payment_Gateway {
            public function __construct() {
                $this->id = 'mobile_money';
                $this->method_title = 'Mobile Money';
                $this->method_description = 'Paiement via Mobile Money (DjoNanko)';
                $this->has_fields = false;
                
                $this->init_form_fields();
                $this->init_settings();
                
                $this->title = $this->get_option('title', 'Mobile Money');
                $this->description = $this->get_option('description', 'Payez avec Orange Money, MTN Money, Moov Money');
                
                add_action('woocommerce_update_options_payment_gateways_' . $this->id, array($this, 'process_admin_options'));
            }
            
            public function init_form_fields() {
                $this->form_fields = array(
                    'enabled' => array(
                        'title' => 'Activer/Désactiver',
                        'type' => 'checkbox',
                        'label' => 'Activer Mobile Money',
                        'default' => 'yes'
                    ),
                    'title' => array(
                        'title' => 'Titre',
                        'type' => 'text',
                        'description' => 'Titre affiché au checkout',
                        'default' => 'Mobile Money',
                        'desc_tip' => true
                    ),
                    'description' => array(
                        'title' => 'Description',
                        'type' => 'textarea',
                        'description' => 'Description affichée au checkout',
                        'default' => 'Payez avec Orange Money, MTN Money, Moov Money'
                    )
                );
            }
            
            public function process_payment($order_id) {
                // Le paiement est géré par le frontend Nuxt
                return array(
                    'result' => 'success',
                    'redirect' => $this->get_return_url(wc_get_order($order_id))
                );
            }
        }
    }
    
    $gateways[] = 'WC_Gateway_Mobile_Money';
    return $gateways;
});

error_log('✅ Endpoint Mobile Money et statut personnalisé enregistrés !');

