# Stand Errant

Jeu 2D jouable dans le navigateur, rendu avec WebGPU. Choisis un Stand parmi dix, arpente la ville de Saint-Mirage et affronte les autres utilisateurs de Stand.

**Jouer :** https://framagstudio.github.io/stand-errant/ — dans un navigateur compatible WebGPU (Chrome ou Edge récents, ou Safari / Firefox récents avec WebGPU activé).

## Cartes

| Carte | Ce qu'on peut y faire |
| --- | --- |
| Saint-Mirage | Ville et canal. La fontaine soigne, les tonneaux rouges explosent, les caisses lâchent des soins. |
| Archipel de Brumevent | Dix îles reliées par des ponts. Les geysers te projettent d'une île à l'autre. |
| Temple du Sablier | Pièges à piques qui blessent aussi les ennemis, sables mouvants, oasis qui soignent. Frapper le Grand Sablier ralentit les ennemis. |
| Fonderie Néon | Lave, tapis roulants, sols électriques par cycles, disjoncteurs qui coupent le courant, portails entre les coins de l'usine. |

## Commandes

| Action | Clavier | Mobile |
| --- | --- | --- |
| Marcher | ZQSD / WASD / flèches | Joystick |
| Rafale | J ou Espace (maintenu) | Bouton Rafale |
| Pouvoir (appuyer à nouveau pour l'arrêter) | K ou Maj | Bouton Pouvoir |
| Téléportation (Ancre Nomade) | L | Bouton Téléport |
| Son | M | — |
| Pause, paramètres, retour au menu | Échap | Bouton Pause |

## Musique

Le menu « Musique » liste les fichiers du dossier [`music/`](music/) (nom du fichier sans extension), plus un thème original généré par le jeu. Pour ajouter un morceau, dépose-le dans `music/` : le déploiement met la liste à jour tout seul.

On peut aussi ajouter un fichier audio depuis l'écran de choix du Stand : il reste alors enregistré dans le navigateur, sans être mis en ligne.

## OST des pouvoirs

Le dossier [`ost/`](ost/) contient un sous-dossier par pouvoir et un dossier `rafale/` commun. Les fichiers audio qui y sont déposés remplacent les bruitages synthétisés ; un dossier vide garde le son par défaut. Détails dans [`ost/README.md`](ost/README.md).

## Technique

Un seul fichier `index.html`, sans dépendance ni étape de build : WebGPU pour le rendu (shaders WGSL), Web Audio pour les sons et la musique.
