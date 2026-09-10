<?php
/**
 * Plugin Name:       WP Menu Delete Guard
 * Description:       Remplace la suppression native du menu WordPress par une modale de confirmation type-to-confirm. L'utilisateur doit taper le nom exact du menu pour valider la suppression.
 * Version:           1.0.1
 * Requires at least: 5.8
 * Requires PHP:      7.4
 * Author:            ColorMyWeb
 * License:           GPL-2.0-or-later
 * Text Domain:       wp-menu-delete-guard
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'WPMDG_VERSION', '1.0.1' );
define( 'WPMDG_URL', plugin_dir_url( __FILE__ ) );
define( 'WPMDG_PATH', plugin_dir_path( __FILE__ ) );

/**
 * Charge les assets uniquement sur l'écran nav-menus.php.
 */
function wpmdg_enqueue_assets( $hook ) {
	if ( 'nav-menus.php' !== $hook ) {
		return;
	}

	wp_enqueue_style(
		'wp-menu-delete-guard',
		WPMDG_URL . 'assets/css/wp-menu-delete-guard.css',
		array(),
		WPMDG_VERSION
	);

	wp_enqueue_script(
		'wp-menu-delete-guard',
		WPMDG_URL . 'assets/js/wp-menu-delete-guard.js',
		array( 'jquery' ),
		WPMDG_VERSION,
		true
	);

	wp_localize_script(
		'wp-menu-delete-guard',
		'wpmdg',
		array(
			'i18n' => array(
				'deleteTitle'       => __( 'Supprimer le menu', 'wp-menu-delete-guard' ),
				/* translators: %s: nom du menu */
				'deleteIntro'       => __( 'Cette action est <strong>irréversible</strong>. Pour confirmer, tape le nom exact du menu : <strong>%s</strong>', 'wp-menu-delete-guard' ),
				'deletePlaceholder' => __( 'Nom du menu', 'wp-menu-delete-guard' ),
				'deleteConfirm'     => __( 'Supprimer définitivement', 'wp-menu-delete-guard' ),
				'deleteCancel'      => __( 'Annuler', 'wp-menu-delete-guard' ),
			),
		)
	);
}
add_action( 'admin_enqueue_scripts', 'wpmdg_enqueue_assets' );
