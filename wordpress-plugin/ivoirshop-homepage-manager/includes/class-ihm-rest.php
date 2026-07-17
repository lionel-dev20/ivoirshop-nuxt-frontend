<?php
/**
 * Endpoint REST public exposant la configuration de la page d'accueil.
 *
 * GET /wp-json/ivoirshop/v1/homepage
 *
 * @package IvoirShopHomepageManager
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class IHM_REST {

	public static function init() {
		add_action( 'rest_api_init', array( __CLASS__, 'register_routes' ) );
	}

	public static function register_routes() {
		register_rest_route(
			IHM_REST_NAMESPACE,
			'/homepage',
			array(
				'methods'             => WP_REST_Server::READABLE, // GET
				'callback'            => array( __CLASS__, 'get_homepage' ),
				'permission_callback' => '__return_true', // Lecture publique.
			)
		);
	}

	/**
	 * Renvoie la configuration complète de la page d'accueil.
	 *
	 * @return WP_REST_Response
	 */
	public static function get_homepage() {
		$config = IHM_Config::get();

		$response = new WP_REST_Response(
			array(
				'success'   => true,
				'version'   => IHM_VERSION,
				'updatedAt' => get_option( 'ivoirshop_homepage_updated_at', '' ),
				'data'      => $config,
			),
			200
		);

		// Cache : 5 min navigateur, 10 min CDN. Le contenu de la home change peu.
		$response->header( 'Cache-Control', 'public, max-age=300, s-maxage=600' );

		return $response;
	}
}
