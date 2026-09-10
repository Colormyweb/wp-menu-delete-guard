# WP Menu Delete Guard

Petit plugin WordPress qui remplace la suppression native du menu (`Apparence > Menus`) par une modale de confirmation type-to-confirm.

## Ce que ça fait

- Masque le lien natif "Supprimer le menu" (uniquement celui du menu global, **pas** les liens "Retirer" individuels des items).
- Ajoute un bouton "Supprimer le menu" à droite de la zone de publication, séparé du bouton "Enregistrer".
- Ouvre une modale d'alerte demandant de **taper le nom exact du menu** pour activer la suppression (convention GitHub).
- Support clavier complet : `Entrée` valide, `Échap` annule, focus trap, focus restitué au déclencheur à la fermeture.
- Respect de `prefers-reduced-motion`.

## Installation en plugin classique (pour tester)

1. Copier le dossier `wp-menu-delete-guard/` dans `wp-content/plugins/`.
2. Activer via `Extensions`.
3. Aller sur `Apparence > Menus`, sélectionner un menu existant.

## Passage en mu-plugin

Une fois validé :

1. Copier uniquement le fichier `wp-menu-delete-guard.php` dans `wp-content/mu-plugins/`.
2. Créer un sous-dossier `wp-content/mu-plugins/wp-menu-delete-guard-assets/` et y placer le dossier `assets/`.
3. Dans le PHP, adapter la constante `WPMDG_URL` pour pointer vers ce sous-dossier :
   ```php
   define( 'WPMDG_URL', WPMU_PLUGIN_URL . '/wp-menu-delete-guard-assets/' );
   ```
   (les mu-plugins ne peuvent pas être dans des sous-dossiers, mais leurs assets si — via un dossier annexe).

Alternative plus simple : garder tout le plugin dans un sous-dossier `mu-plugins/wp-menu-delete-guard/` et créer un fichier loader `mu-plugins/wp-menu-delete-guard-loader.php` qui contient juste :
```php
<?php
require_once __DIR__ . '/wp-menu-delete-guard/wp-menu-delete-guard.php';
```

## Compatibilité

- Autonome : aucune interférence avec du JS custom de menu.
- N'affecte que l'écran `nav-menus.php`.
- Sélecteurs restreints : `#delete-action .submitdelete` et `.submitdelete.deletion.menu-delete` uniquement (le lien "Retirer" des items utilise la même classe mais dans un contexte différent).

## Licence

GPL-2.0-or-later — voir [LICENSE](LICENSE)
