# Stand Errant — guide pour Claude

Jeu 2D jouable dans le navigateur, inspiré de JoJo's Bizarre Adventure : on choisit un Stand (un pouvoir), une carte, puis on affronte des utilisateurs de Stand et des sbires armés qui se battent aussi entre eux.

- Jeu en ligne : https://framagstudio.github.io/stand-errant/
- Dépôt : `framagstudio/stand-errant` (branche `main`, déployée automatiquement sur GitHub Pages)
- L'auteur s'appelle Anthony. Il écrit et joue en **français** : réponses, textes du jeu, commits et docs en français.

## Règles de travail

1. **Tout le jeu tient dans `index.html`** (≈ 2 700 lignes, sans dépendance ni build). C'est la seule source de vérité.
2. **Toujours vérifier avant de pousser** : `node tools/check.cjs` (syntaxe, shader WGSL via naga, parties automatiques sur toutes les cartes). Voir le skill `tester-le-jeu`.
3. **Pousser sur `main` après chaque changement demandé** : Anthony veut voir le résultat en ligne. Voir le skill `publier`.
4. **Proposer avant de coder un nouveau Stand ou une nouvelle carte** quand la demande est ouverte (« propose-moi des idées »). Numéroter ET nommer les idées, et demander les noms dans la réponse : une confusion de numéros a déjà eu lieu.
5. Ne jamais reproduire un Stand, un personnage ou une musique protégés de JoJo : on s'en inspire, avec des noms et des mécaniques originaux. Les fichiers audio sont fournis par Anthony dans `music/` et `ost/` ; ne pas en ajouter soi-même.
6. Les ennemis doivent utiliser **exactement les mêmes réglages** (durée, recharge) que ceux fixés pour chaque pouvoir dans Paramètres (`durOf(st)`, `cdOf(st)`).

## Commandes

```bash
node tools/check.cjs                 # vérification complète (à lancer avant chaque push)
node tools/check.cjs --fast          # syntaxe + shader seulement
node tools/headless.cjs --maps chess --stands horloge --seconds 20   # simuler un cas précis
node tools/headless.cjs --wgsl /tmp/s.wgsl --seconds 0 && naga /tmp/s.wgsl
node tools/to-artifact.cjs /tmp/stand-errant.html                   # version pour un artefact claude.ai
```

Valider le WGSL demande `naga` (`cargo install naga-cli`). Sans lui, une erreur de shader donne simplement un écran noir dans le navigateur.

## Architecture de `index.html`

Les sections sont repérables par leurs commentaires `/* ===== … ===== */` et `/* ----- … ----- */`.

| Section | Contenu |
| --- | --- |
| CSS + HTML | menu (choix Stand, carte, musique), HUD, pause, paramètres, contrôles tactiles |
| `DATA` | `STANDS` (définitions), `ENABLED` (Stands jouables), `ABIL_DEF` (durée/recharge par défaut), `DUR_LABEL`, `CANCEL` (pouvoirs qu'on peut couper avec K), `SET` (paramètres, `localStorage` clé `standErrant.settings.v1`), `USERS` (ennemis à Stand) |
| `WORLD / CARTES` | collisions `solid()`, objets `trees` (props), `buildings` (murs), `zones`, `inter` ; puis une sous-section par carte et le tableau `MAPS` |
| `code WGSL généré` | `GEN.<carte>` : le code WGSL du sol de chaque carte, généré en JS à partir des données de la carte |
| `WGSL` | shader unique : `fsBg` (sol, choisi par `u.mapId`) + `vsI/fsI` (formes instanciées : ellipse, rectangle arrondi, anneau, losange, étoile) |
| `RENDERER` | WebGPU ; uniforms (16 floats) : `cam, view, zoom, time, ts, rippleR, rippleC, flash, mapId, mech, p1, p2, p3` ; `Q()` + `circ/ell/box/ring/dia/star/line` |
| `STATE` | objet `S` (mode, joueur, ennemis, projectiles, particules, textes, `ts` = arrêt du temps…) |
| audio / musique / OST | bruitages synthétisés (`sfx*`), musique (`music/`), sons de pouvoir (`ost/<dossier>/`, `OST_DIR`) |
| `navigation` | grille 72×72 + parcours en largeur (`navDir`) pour que les ennemis contournent murs et vide ; `NAV.dirty=true` quand un mur change |
| `mêlée générale` | `updateTarget`, `hostilesOf`, `strike(att, cible, …)` : chaque ennemi vise le plus proche (joueur, autre ennemi ou leurre) |
| `combat` | `hitNPC` (joueur → ennemi), `hurtPlayer`, `npcDamage` (ennemi → ennemi), membres (`loseLimb`, `npcLoseLimb`), `defeatNPC` |
| `abilities` | `useAbility(p)` (pouvoir du joueur, touche K), `endAbility(p)` |
| `update` | `updatePlayer`, `updateNPC` (+ `npcPower` : pouvoirs ennemis), `updateGrunt` (sbires), `updateWorld`, `updatePowers`, `recordTime` |
| `DRAW` | `drawPerson`, `drawStand` (crête par Stand), `drawBuilding`, `drawTree` (un `case` par type d'objet), `drawPowers`, `drawWorld` (tri par profondeur) |
| overlay / minimap / HUD | textes sur un canvas 2D par-dessus WebGPU, mini-carte, barre de pouvoir |
| `MENU`, `PARAMÈTRES`, `BOOT` | cartes de menu, réglages, démarrage |

### À savoir avant de modifier

- **Ordre d'initialisation** : la section WORLD s'exécute au chargement (`MAPDATA`, `loadMap`) avant que `S` et le reste soient définis. N'y utiliser que des choses déclarées plus haut (sinon erreur « Cannot access … before initialization »).
- **Arrêt du temps** : `S.ts = {active, by}`. `frozenFor(e)` dit si un ennemi est figé. Les mécanismes des cartes avancent avec `S_FX.mech`, qui ne bouge pas pendant un arrêt du temps.
- **Props** (`trees`) : `kind` détermine le dessin (`drawTree`) et l'interaction (`PROPS` + `propHit`). `ghost:true` = pas de collision et pas trié dans la scène ; `mv` = objet en mouvement (non solide).
- **Effets des cartes sur les personnages** : `mechEnts()` (joueur + ennemis actifs) et `mechHit(ent, dégâts, kx, ky, couleur, étourdissement)`.
- **Stands désactivés** : beaucoup de Stands existent encore dans le code mais sont retirés de `ENABLED` à la demande d'Anthony. Ne pas les réactiver sans qu'il le demande.
- Effets d'annulation : `S.undoFx` (éclat, fantôme de l'attaquant, mouche qui se défait) et `S.flashT` (flash blanc du monde).
- Ondes de choc : `S.rings` (rayon négatif = anneau qui se resserre), mises à jour dans `updatePowers` et dessinées dans `drawPowers`.
- Les textes affichés utilisent `ftext()` (dans le monde), `banner()` (bandeau), `say()` (bulle).

## Contenu actuel

- **Stands jouables** (`ENABLED`) : Chrono Noir (arrêt du temps), Best Experience (annulation après coup : chaque action subie est notée dans `undoLog` via `logUndo`, et K pendant la « fenêtre » — la durée réglée — annule tout avec `bestUndo` ; L met en pause et ouvre `#lifePick` pour choisir une vie (`LIFE` : arbre-abri statique `lifetree` qui coupe la vue via `lifeCover`, mouche 3 dégâts, alligator lent 5 dégâts) ; une seule à la fois, L de nouveau l'annule ; seconde recharge `cd2`), Horloge Inverse (rembobine un ennemi, brise un arrêt du temps), Kleptomane, Paratonnerre, Main Basse, Riposte, Fil d'Ariane, Retour de Bâton, Coup de Dés. Chacun a un porteur ennemi dans `USERS`.
- **Cartes** (`MAPS`) : `manor` Manoir Brisebois (passages secrets), `clock` Beffroi des Rouages (horloge géante), `kitchen` La Cuisine des Géants, `chess` Grand Échiquier.
- **Ennemis** : utilisateurs de Stand + sbires (épée, pistolet), nombre réglable ; tous s'affrontent entre eux ; perte de membres.

Pour le détail des décisions et des idées refusées : `docs/historique.md`. Pour ajouter du contenu : skills `creer-un-stand` et `creer-une-carte` dans `.claude/skills/`.
