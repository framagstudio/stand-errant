# OST des pouvoirs

Un dossier par pouvoir, plus `rafale/` pour la rafale commune à tous les Stands. Dépose les fichiers audio dans le bon dossier puis pousse : le déploiement génère `manifest.json`, et le jeu joue ces fichiers à la place des bruitages synthétisés. Un dossier vide garde le bruitage par défaut.

Les ennemis utilisent les mêmes fichiers quand ils déclenchent leur pouvoir, avec un volume qui baisse avec la distance. Le volume global se règle dans Paramètres → Musique.

| Dossier | Pouvoir | Quand c'est joué |
| --- | --- | --- |
| `chrono-noir/` | Arrêt du temps (Chrono Noir) | Joué quand le temps s'arrête, coupé quand il reprend (fin ou arrêt manuel). |
| `foudre-vagabonde/` | Forme électrique (Foudre Vagabonde) | Joué à la transformation, coupé quand la forme électrique prend fin. |
| `jardin-fractal/` | Floraison (Jardin Fractal) | Joué en entier au lancement du soin et des racines. |
| `echo-cobalt/` | Salve d'échos (Écho Cobalt) | Joué en entier au tir des trois sphères. |
| `lame-sirocco/` | Tourbillon tranchant (Lame Sirocco) | Joué en entier au lancement des lames. |
| `miroir-opale/` | Reflet parfait (Miroir Opale) | Joué à l'apparition du bouclier, coupé quand il disparaît. |
| `gravite-zero/` | Puits stellaire (Gravité Zéro) | Joué à l'ouverture du puits, coupé à l'implosion. |
| `spectre-lunaire/` | Voile lunaire (Spectre Lunaire) | Joué quand tu deviens invisible, coupé quand tu réapparais. |
| `ruche-ambre/` | Essaim (Ruche d'Ambre) | Joué à l'apparition des drones, coupé quand ils disparaissent. |
| `pantin-pourpre/` | Possession (Pantin Pourpre) | Joué quand tu prends possession d'un ennemi, coupé quand tu le relâches. |
| `ancre-nomade/` | Ancrage (Ancre Nomade) | Joué à chaque téléportation (poser un marqueur garde le petit son par défaut). |
| `take-on-me/` | Croquis vivant (Take On Me) | Joué à l'aplatissement en croquis, coupé quand tu reprends forme. |
| `pinball-wizard/` | Cinétique de flipper (Pinball Wizard) | Joué en entier à chaque bumper posé. |
| `paint-it-black/` | Ancrage d'ombre (Paint It Black) | Joué quand l'ombre part, coupé quand elle est relâchée. |
| `dont-stop-me-now/` | Locomotive humaine (Don't Stop Me Now) | Joué au départ de la course, coupé à l'arrêt. |
| `cutting-crew/` | Découpe d'écran (Cutting Crew) | Joué en entier quand tu traces la ligne de coupe. |
| `plastic-beach/` | Polystyrène statique (Plastic Beach) | Joué en entier quand les billes sont libérées. |
| `ventriloque/` | Voix fantôme (Ventriloque) | Joué en entier quand tu poses un leurre. |
| `main-basse/` | Arrachage (Main Basse) | Joué en entier quand tu arraches un membre. |
| `riposte/` | Parade (Riposte) | Joué en entier à l'ouverture de la parade. |
| `fil-d-ariane/` | Rembobinage (Fil d'Ariane) | Joué quand le fil commence à se dérouler, coupé quand tu rembobines. |
| `retour-de-baton/` | Rétrospective (Retour de Bâton) | Joué en entier au retour en arrière. |
| `coup-de-des/` | Lancer de dé (Coup de Dés) | Joué en entier à chaque lancer. |
| `rafale/` | Rafale (Toutes les Stands) | Joué en boucle tant que tu maintiens la rafale, coupé dès que tu la relâches. Commun à tous les Stands. |

Ce dossier est servi publiquement sur GitHub Pages : n'y mets que des sons que tu as le droit de diffuser.
