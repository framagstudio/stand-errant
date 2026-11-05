---
name: creer-une-carte
description: Ajouter une nouvelle carte originale et interactive à Stand Errant (sol en WGSL, objets, mécanismes, mini-carte), puis la tester et la publier. À utiliser quand Anthony demande une nouvelle map.
---

# Créer une carte

Anthony aime les cartes **très originales avec beaucoup d'interactions** (horloge géante, échiquier vivant, cuisine de géants) et a rejeté les cartes génériques (ville, îles, désert, usine). Une bonne carte :

- a un concept fort et inattendu (changement d'échelle, objet géant, lieu détourné) ;
- a 4 à 7 mécanismes qui blessent tout le monde, **annoncés avant de frapper** (ombre, case rouge, lueur) ;
- a 3 ou 4 objets que le joueur frappe pour retourner la carte contre les ennemis (avec une recharge et un bandeau `banner()`) ;
- se fige pendant l'arrêt du temps de Chrono Noir (avancer avec `S_FX.mech` et ne rien faire si `S.ts.active>0`).

Modèles à copier : `clock` (mécanismes rotatifs), `chess` (objets qui se déplacent de case en case), `kitchen` (plusieurs zones à cycles), `manor` (murs, passages secrets, navigation).

## 1. Données et logique (section `WORLD / CARTES`)

Ajouter avant `const MAPS=[` une sous-section `/* ---------- Nom ---------- */` avec les constantes et fonctions de la carte, puis une entrée dans `MAPS` :

```js
{id, name, kicker, ground:N, seed, col:[r,g,b], spawn:{x,y}, desc, feats:[…], intro,
 blocked(x,y,r){…},        // true si la position est hors de la zone praticable (vide, bord…)
 avoid(x,y){…},            // optionnel : zones où les ennemis ne doivent pas apparaître
 mini(x,y){return [r,g,b]},// couleur de la mini-carte (0–255)
 build(){…},               // remplit trees / buildings / zones / inter (this = la carte)
 update(dt){…},            // mécanismes ; ne rien faire si S.ts.active>0
 drawUnder(){…}, drawOver(){…}, overlay(g,SX,SY,u){…}}  // dessin sous / au-dessus des personnages, texte
```

- Le monde fait 3600×3600. `ground:N` est l'index du sol dans le shader (manoir 0, horloge 1, échiquier 2, cuisine 3 : prendre le suivant).
- Objets frappables : les pousser dans `trees` avec un `kind` ; ajouter le `kind` à `PROPS`, un bloc dans `propHit`, un `case` dans `drawTree` et une couleur dans `MINI_PROP`. `ghost:true` pour un objet sans collision.
- Murs : `buildings` avec un `style` dessiné dans `drawBuilding` ; mettre `NAV.dirty=true` quand un mur s'ouvre ou se ferme (les ennemis recalculent leur chemin).
- Effets sur les personnages : boucler sur `mechEnts()` et appeler `mechHit(ent, dégâts, kx, ky, couleur, étourdissement)`.
- Nouveaux compteurs (recharges, minuteries) : les ajouter dans `S_FX` via `resetFx()`.
- Tremplin : `inter.push({type:'spring', x, y, lx, ly})` (vol automatique géré par `updateMap`).

## 2. Sol (WGSL)

1. Dans la section `code WGSL généré`, écrire `GEN.<id>` : une chaîne de code WGSL (corps de fonction se terminant par `return col;`) générée à partir des données de la carte. Fonctions disponibles : `hash`, `vnoise`, `inR(w, vec4f)`, `sdBox`, `sdSeg`, `parquet`, `marble`, `flagstone`, et les uniforms `u.time`, `u.mech`, `u.p1`, `u.p2`, `u.p3`.
2. Dans la chaîne `WGSL`, déclarer `fn ground<Nom>(w: vec2f, n: f32) -> vec3f {\n${GEN.<id>}}` à côté des autres.
3. Dans `fsBg`, ajouter `else if (m == N) { col = ground<Nom>(w, n); }`.
4. Pour piloter le shader depuis le JS (état d'un mécanisme), utiliser `uni[13]`, `uni[14]` ou `uni[15]` dans `render()` (= `u.p1`, `u.p2`, `u.p3`).
5. Toujours valider avec naga (`node tools/check.cjs`) : une erreur WGSL donne un écran noir sans message.

## 3. Vérifier et publier

1. `node tools/check.cjs`, puis `node tools/headless.cjs --maps <id> --seconds 60`. Aucune image « coincé » ne doit apparaître.
2. Tester chaque mécanisme avec un petit scénario (placer un ennemi dans la zone, faire avancer `updateMap`, vérifier ses PV ou sa position).
3. Ajouter une ligne au tableau « Cartes » de `README.md`, mettre à jour `CLAUDE.md` et `docs/historique.md`, puis skill `publier`.
4. Réponse à Anthony : le concept en une phrase, puis chaque mécanisme et chaque objet interactif, et ce qui a été vérifié.
