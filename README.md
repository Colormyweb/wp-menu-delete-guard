# WP Menu Delete Guard

Plugin WordPress qui remplace la suppression native d'un menu (Apparence > Menus) par une modale de confirmation type-to-confirm : il faut taper le nom exact du menu pour valider la suppression.

## Objectif

Empêcher la suppression accidentelle d'un menu, en particulier sur les sites clients où du JavaScript personnalisé dépend de la structure des menus.

## Installation

Deux modes sont prévus :

1. **Plugin classique** — à activer depuis Apparence > Extensions, pour tester.
2. **Mu-plugin** — une fois validé, à déplacer dans `wp-content/mu-plugins/` pour un fonctionnement permanent, non désactivable depuis l'admin.

## Compatibilité

Vérifié sans conflit avec les scripts JS personnalisés de menus (ex. off-canvas) : les assets du plugin ne sont chargés que sur l'écran d'administration `nav-menus.php`, jamais en front, avec des sélecteurs/DOM/globals JS totalement distincts.

## Auteur

ColorMyWeb — https://www.colormyweb.fr

## Licence

GPLv3 — voir [LICENSE](LICENSE)
