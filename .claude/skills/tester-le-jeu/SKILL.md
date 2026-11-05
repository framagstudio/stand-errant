---
name: tester-le-jeu
description: Vérifier Stand Errant sans navigateur (syntaxe, shader WGSL, parties automatiques) avant chaque push ou pour reproduire un bug signalé par Anthony.
---

# Tester le jeu

Il n'y a pas de navigateur WebGPU dans l'environnement : on teste avec les outils de `tools/`, qui chargent le vrai script de `index.html` avec des bouchons et appellent la vraie boucle `frame()`.

## Vérification standard (avant chaque push)

```bash
node tools/check.cjs
```

1. Syntaxe JavaScript (avec la ligne de `index.html` en cas d'erreur).
2. Shader WGSL validé par naga. Si naga manque : `cargo install naga-cli` (environ 2 min), il s'installe dans `~/.cargo/bin`.
3. Parties automatiques de 10 s sur chaque carte avec chaque Stand jouable. Échec si un personnage reste coincé dans un obstacle ou si une erreur JS survient.

## Cas ciblés

```bash
node tools/headless.cjs --maps manor,chess --stands horloge --seconds 60
```

Colonnes affichées : temps de calcul par image (hors rendu GPU), ennemis hors jeu (dont ceux éliminés par d'autres ennemis), images où le joueur est coincé.

## Reproduire un bug précis

Copier `tools/headless-scenario.js` dans le dossier scratchpad, le modifier pour mettre en place la situation (par exemple : `MAPI=…; startGame(SI('horloge')); const e=S.npcs.find(…); e.x=…; useAbility(S.player);`), faire avancer la boucle avec `frame(t)` et afficher l'état utile avec `console.log`. Pour l'exécuter, adapter `tools/headless.cjs` pour qu'il lise ce fichier à la place (ou passer par une copie).

Points de vigilance déjà rencontrés :
- un pouvoir ennemi déclenché pendant le menu laissait l'écran en noir et blanc (les pouvoirs ennemis sont désormais bloqués hors partie) ;
- une variable utilisée dans la section WORLD avant sa déclaration plante tout le jeu au chargement ;
- une accolade en trop dans un objet de `MAPS` casse toute la page : relancer `node tools/check.cjs --fast` après chaque gros patch.

Ce que les tests ne voient pas : le rendu visuel réel et le ressenti. Le dire à Anthony quand c'est pertinent.
