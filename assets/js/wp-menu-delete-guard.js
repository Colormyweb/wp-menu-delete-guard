/**
 * WP Menu Delete Guard — script admin
 *
 * Remplace le lien natif "Supprimer le menu" par une modale type-to-confirm.
 * N'affecte PAS les liens "Retirer" des items individuels.
 */
( function ( $ ) {
	'use strict';

	var i18n = ( window.wpmdg && window.wpmdg.i18n ) || {};

	/* ------------------------------------------------------------
	 * Helpers
	 * ------------------------------------------------------------ */

	function getMenuName() {
		var name = $( '#menu-name' ).val();
		return name ? name.trim() : '';
	}

	function getDeleteUrl() {
		// UNIQUEMENT le lien de suppression du menu global.
		return $( '#delete-action .submitdelete' ).attr( 'href' ) ||
			$( '.submitdelete.deletion.menu-delete' ).attr( 'href' );
	}

	function escapeHtml( str ) {
		return String( str )
			.replace( /&/g, '&amp;' )
			.replace( /</g, '&lt;' )
			.replace( />/g, '&gt;' )
			.replace( /"/g, '&quot;' )
			.replace( /'/g, '&#039;' );
	}

	/* ------------------------------------------------------------
	 * Remplacement du lien natif par notre bouton
	 * ------------------------------------------------------------ */

	function replaceDeleteLink() {
		// Neutralise le lien natif du menu global (le CSS le masque déjà).
		$( '#delete-action .submitdelete, .submitdelete.deletion.menu-delete' )
			.css( 'display', 'none' )
			.attr( 'tabindex', '-1' )
			.attr( 'aria-hidden', 'true' );

		if ( $( '.wpmdg-delete-button' ).length ) {
			return;
		}

		if ( ! getDeleteUrl() ) {
			return; // Pas de menu existant (écran de création).
		}

		var $btn = $(
			'<button type="button" class="wpmdg-delete-button" aria-haspopup="dialog">' +
				'<span class="dashicons dashicons-trash" aria-hidden="true"></span>' +
				'<span>' + escapeHtml( i18n.deleteTitle ) + '</span>' +
			'</button>'
		);

		var $publishingArea = $( '.major-publishing-actions' ).last();
		if ( $publishingArea.length ) {
			$publishingArea.append( $btn );
		}
	}

	/* ------------------------------------------------------------
	 * Focus trap pour la modale (a11y)
	 * ------------------------------------------------------------ */

	function trapFocus( $modal, event ) {
		var focusables = $modal.find(
			'button:not(:disabled), input:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])'
		).filter( ':visible' );

		if ( ! focusables.length ) {
			return;
		}

		var first = focusables[ 0 ];
		var last  = focusables[ focusables.length - 1 ];

		if ( event.shiftKey && document.activeElement === first ) {
			event.preventDefault();
			last.focus();
		} else if ( ! event.shiftKey && document.activeElement === last ) {
			event.preventDefault();
			first.focus();
		}
	}

	/* ------------------------------------------------------------
	 * Modale de confirmation
	 * ------------------------------------------------------------ */

	function openDeleteModal( triggerEl ) {
		var menuName  = getMenuName();
		var deleteUrl = getDeleteUrl();

		if ( ! menuName || ! deleteUrl ) {
			return;
		}

		var intro = i18n.deleteIntro.replace( '%s', escapeHtml( menuName ) );

		var $overlay = $(
			'<div class="wpmdg-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="wpmdg-modal-title" aria-describedby="wpmdg-modal-desc">' +
				'<div class="wpmdg-modal">' +
					'<div class="wpmdg-modal-header">' +
						'<h2 id="wpmdg-modal-title">' +
							'<span class="dashicons dashicons-warning" aria-hidden="true"></span>' +
							escapeHtml( i18n.deleteTitle ) +
						'</h2>' +
					'</div>' +
					'<div class="wpmdg-modal-body">' +
						'<p id="wpmdg-modal-desc">' + intro + '</p>' +
						'<label for="wpmdg-modal-input">' + escapeHtml( i18n.deletePlaceholder ) + '</label>' +
						'<input type="text" id="wpmdg-modal-input" class="wpmdg-modal-input" autocomplete="off" spellcheck="false" aria-required="true" />' +
					'</div>' +
					'<div class="wpmdg-modal-footer">' +
						'<button type="button" class="button wpmdg-modal-cancel">' + escapeHtml( i18n.deleteCancel ) + '</button>' +
						'<button type="button" class="button wpmdg-button-danger wpmdg-modal-confirm" disabled aria-disabled="true">' + escapeHtml( i18n.deleteConfirm ) + '</button>' +
					'</div>' +
				'</div>' +
			'</div>'
		);

		$( 'body' ).append( $overlay );

		var $input   = $overlay.find( '.wpmdg-modal-input' );
		var $confirm = $overlay.find( '.wpmdg-modal-confirm' );

		setTimeout( function () { $input.trigger( 'focus' ); }, 50 );

		$input.on( 'input', function () {
			var match = $( this ).val().trim() === menuName;
			$confirm.prop( 'disabled', ! match ).attr( 'aria-disabled', ! match );
			$( this ).toggleClass( 'wpmdg-match', match );
		} );

		$input.on( 'keydown', function ( e ) {
			if ( e.key === 'Enter' && ! $confirm.prop( 'disabled' ) ) {
				e.preventDefault();
				$confirm.trigger( 'click' );
			}
		} );

		$overlay.on( 'keydown', function ( e ) {
			if ( e.key === 'Escape' ) {
				e.preventDefault();
				closeModal();
			} else if ( e.key === 'Tab' ) {
				trapFocus( $overlay, e );
			}
		} );

		$overlay.on( 'click', function ( e ) {
			if ( e.target === this ) {
				closeModal();
			}
		} );

		$overlay.find( '.wpmdg-modal-cancel' ).on( 'click', closeModal );

		$confirm.on( 'click', function () {
			window.location.href = deleteUrl;
		} );

		function closeModal() {
			$overlay.remove();
			if ( triggerEl ) {
				triggerEl.focus(); // Restitue le focus au déclencheur (a11y).
			}
		}
	}

	/* ------------------------------------------------------------
	 * INIT
	 * ------------------------------------------------------------ */

	$( function () {
		if ( ! $( '#menu-to-edit' ).length && ! $( '.major-publishing-actions' ).length ) {
			return;
		}

		replaceDeleteLink();

		$( document ).on( 'click', '.wpmdg-delete-button', function ( e ) {
			e.preventDefault();
			e.stopPropagation();
			openDeleteModal( this );
		} );

		// Filet de sécurité : si le lien natif du menu réapparaît, on l'intercepte.
		// Sélecteur restreint pour ne PAS toucher aux "Retirer" des items.
		$( document ).on( 'click', '#delete-action .submitdelete, .submitdelete.deletion.menu-delete', function ( e ) {
			e.preventDefault();
			e.stopPropagation();
			openDeleteModal( this );
			return false;
		} );
	} );

} )( jQuery );
