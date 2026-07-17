<?php
/**
 * Plugin Name:       IvoirShop Homepage Manager
 * Plugin URI:        https://ivoirshop.ci
 * Description:        Gère tout le contenu éditable de la page d'accueil du frontend Nuxt (hero slider, partenaires, bannières, carrousels, textes SEO, couleur/image de fond…) et l'expose via une API REST.
 * Version:           1.0.0
 * Author:            IvoirShop
 * Text Domain:       ivoirshop-homepage-manager
 * License:           GPL-2.0-or-later
 *
 * @package IvoirShopHomepageManager
 */

// Sécurité : empêcher l'accès direct au fichier.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// --------------------------------------------------------------------------
// Constantes du plugin.
// --------------------------------------------------------------------------
define( 'IHM_VERSION', '1.0.0' );
define( 'IHM_OPTION_KEY', 'ivoirshop_homepage_config' );
define( 'IHM_REST_NAMESPACE', 'ivoirshop/v1' );
define( 'IHM_PLUGIN_FILE', __FILE__ );
define( 'IHM_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'IHM_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

// --------------------------------------------------------------------------
// Chargement des classes.
// --------------------------------------------------------------------------
require_once IHM_PLUGIN_DIR . 'includes/class-ihm-config.php';
require_once IHM_PLUGIN_DIR . 'includes/class-ihm-rest.php';
require_once IHM_PLUGIN_DIR . 'includes/class-ihm-admin.php';

// --------------------------------------------------------------------------
// Activation : on s'assure qu'une config par défaut existe.
// --------------------------------------------------------------------------
register_activation_hook( __FILE__, function () {
	if ( false === get_option( IHM_OPTION_KEY ) ) {
		add_option( IHM_OPTION_KEY, IHM_Config::defaults() );
	}
} );

// --------------------------------------------------------------------------
// Initialisation.
// --------------------------------------------------------------------------
add_action( 'plugins_loaded', function () {
	IHM_REST::init();
	if ( is_admin() ) {
		IHM_Admin::init();
	}
} );
