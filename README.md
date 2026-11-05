# Stand Errant

Jeu 2D jouable dans le navigateur, rendu avec WebGPU. Choisis un Stand parmi dix, arpente la ville de Saint-Mirage et affronte les autres utilisateurs de Stand.

**Jouer :** https://framagstudio.github.io/stand-errant/ — dans un navigateur compatible WebGPU (Chrome ou Edge récents, ou Safari / Firefox récents avec WebGPU activé).

## Cartes

| Carte | Ce qu'on peut y faire |
| --- | --- |
| Manoir Brisebois | Seize pièces et des passages secrets : fausses cloisons à briser, bibliothèques qui pivotent quand on frappe un chandelier mural, cheminées reliées deux par deux, dalle qui lève une grille, lustres à faire tomber, armures qui frappent, et une chambre forte absente du plan avec un calice qui soigne tout. |
| Beffroi des Rouages | Le cadran d'une horloge géante dans le vide. Les aiguilles balaient le cadran, les engrenages font tourner ce qui se tient dessus, des pendules fauchent les passerelles. La cloche sonne les ennemis, le coucou les picore, le remontoir inverse la mécanique, deux tremplins font voler d'un bout à l'autre. Chrono Noir fige toute la mécanique. |
| La Cuisine des Géants | Minuscule sur un plan de travail. Le couteau tranche la planche (son ombre prévient), le rouleau à pâtisserie écrase la pâte, le batteur aspire vers ses fouets, les plaques rougissent puis brûlent, l'évier entraîne vers le siphon qui te recrache ailleurs. Le bouton coupe les plaques, le robinet triple le courant, le sel assomme, le poivre fait éternuer les ennemis, le grille-pain propulse. |
| Grand Échiquier | Une partie d'échecs géante. Les pièces jouent seules et écrasent ce qui se trouve sur leur trajet (les cases d'arrivée s'allument en rouge). On peut les renverser, et faire tomber un roi fait s'effondrer tout son camp. Les pendules d'échecs font jouer un camp pour toi pendant 10 secondes. |

Tous les ennemis s'affrontent entre eux quand ils se croisent : utilisateurs de Stand, spadassins et tireurs.

## Sbires et blessures

En plus des utilisateurs de Stand, chaque carte abrite des sbires sans Stand : des spadassins à l'épée et des tireurs au pistolet. Leurs coups peuvent te faire perdre un bras (rafale plus faible) ou une jambe (déplacement plus lent). Les zones de soin régénèrent un membre toutes les 4 secondes, la Floraison du Jardin Fractal les régénère tous, et tout revient quand tu te réveilles après un K.O.

Le nombre d'utilisateurs de Stand, de spadassins et de tireurs se règle dans Paramètres → Ennemis.

## Commandes

| Action | Clavier | Mobile |
| --- | --- | --- |
| Marcher | ZQSD / WASD / flèches | Joystick |
| Rafale | J ou Espace (maintenu) | Bouton Rafale |
| Pouvoir (appuyer à nouveau pour l'arrêter) | K ou Maj | Bouton Pouvoir |
| Action secondaire : téléport (Ancre Nomade), flipper (Pinball Wizard), claquement de doigts (Plastic Beach) | L | Bouton dédié |
| Son | M | — |
| Pause, paramètres, retour au menu | Échap | Bouton Pause |

## Musique

Le menu « Musique » liste les fichiers du dossier [`music/`](music/) (nom du fichier sans extension), plus un thème original généré par le jeu. Pour ajouter un morceau, dépose-le dans `music/` : le déploiement met la liste à jour tout seul.

On peut aussi ajouter un fichier audio depuis l'écran de choix du Stand : il reste alors enregistré dans le navigateur, sans être mis en ligne.

## OST des pouvoirs

Le dossier [`ost/`](ost/) contient un sous-dossier par pouvoir et un dossier `rafale/` commun. Les fichiers audio qui y sont déposés remplacent les bruitages synthétisés ; un dossier vide garde le son par défaut. Détails dans [`ost/README.md`](ost/README.md).

## Technique

Un seul fichier `index.html`, sans dépendance ni étape de build : WebGPU pour le rendu (shaders WGSL), Web Audio pour les sons et la musique.

## Développement

- `node tools/check.cjs` : vérifie la syntaxe, le shader WGSL (avec [naga](https://github.com/gfx-rs/wgpu/tree/trunk/naga)) et joue des parties automatiques sur chaque carte.
- `node tools/headless.cjs --help` : parties automatiques ciblées (cartes, Stands, durée).
- `CLAUDE.md`, `.claude/skills/` et `docs/historique.md` : contexte et procédures pour travailler sur le jeu avec Claude (créer un Stand, créer une carte, tester, publier).

