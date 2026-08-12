<?php
/**
 * Ajustements de l'API REST des articles, pour le blog du frontend Nuxt.
 *
 * WordPress n'autorise pas `orderby=comment_count` sur /wp-json/wp/v2/posts :
 * la valeur est refusée par la validation du contrôleur (erreur 400). On
 * l'ajoute à la liste blanche pour permettre au blog d'afficher une section
 * « Articles populaires » classée par nombre de commentaires.
 *
 * Sans ce fichier, le frontend retombe sur un tri local parmi les articles
 * récents : le blog reste fonctionnel, simplement moins précis.
 *
 * @package IvoirShopHomepageManager
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class IHM_Posts {

	public static function init() {
		add_filter( 'rest_post_collection_params', array( __CLASS__, 'allow_comment_count_orderby' ) );
		add_filter( 'rest_post_query', array( __CLASS__, 'apply_comment_count_orderby' ), 10, 2 );
		add_action( 'rest_api_init', array( __CLASS__, 'register_comment_count_field' ) );
	}

	/**
	 * Expose le nombre de commentaires dans /wp-json/wp/v2/posts.
	 * WordPress ne le renvoie pas par défaut, alors qu'il sert au classement
	 * des articles populaires du blog.
	 *
	 * @return void
	 */
	public static function register_comment_count_field() {
		register_rest_field(
			'post',
			'comment_count',
			array(
				'get_callback' => function ( $post ) {
					return (int) get_comments_number( $post['id'] );
				},
				'schema'       => array(
					'description' => 'Nombre de commentaires approuvés.',
					'type'        => 'integer',
					'context'     => array( 'view', 'edit' ),
					'readonly'    => true,
				),
			)
		);
	}

	/**
	 * Autorise `orderby=comment_count` dans la validation du endpoint.
	 *
	 * @param array $params Paramètres de collection.
	 * @return array
	 */
	public static function allow_comment_count_orderby( $params ) {
		if ( isset( $params['orderby']['enum'] ) && is_array( $params['orderby']['enum'] )
			&& ! in_array( 'comment_count', $params['orderby']['enum'], true ) ) {
			$params['orderby']['enum'][] = 'comment_count';
		}
		return $params;
	}

	/**
	 * Répercute le tri sur la requête WP_Query.
	 *
	 * @param array           $args    Arguments WP_Query.
	 * @param WP_REST_Request $request Requête REST.
	 * @return array
	 */
	public static function apply_comment_count_orderby( $args, $request ) {
		if ( 'comment_count' === $request->get_param( 'orderby' ) ) {
			$args['orderby'] = 'comment_count';
		}
		return $args;
	}
}
