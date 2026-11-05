---
name: creer-un-stand
description: Ajouter un nouveau Stand jouable à Stand Errant (pouvoir du joueur, porteur ennemi, réglages, son, dessin), puis le tester et le publier. À utiliser quand Anthony choisit un Stand à coder.
---

# Créer un Stand

Tout se passe dans `index.html`. Chercher chaque point d'ancrage par son texte (les numéros de ligne bougent). Prendre un Stand existant proche comme modèle : `horloge` (vise un ennemi), `paratonnerre` (effet à durée), `riposte` (fenêtre courte), `ariane` (actif qu'on coupe avec K).

## 0. Avant de coder

- Si Anthony n'a pas encore choisi : utiliser le skill `proposer-des-idees`.
- Vérifier `docs/historique.md` : ne pas reproposer une idée refusée, ni un Stand protégé de JoJo.

## 1. Données (section `DATA`)

1. **`STANDS`** : ajouter une entrée (avant ` {id:'ancre'`) :
   `{id, name, c:[r,g,b], k:[r,g,b], cry:'ONOMATOPÉE', crest:'nomCrête', ab:'Nom du pouvoir', desc:"…", st:{P,V,Po,En,Pr,Pt}, cd}`
   `c` = couleur principale, `k` = couleur d'accent, `st` = notes A à E (puissance, vitesse, portée, endurance, précision, potentiel).
2. **`ENABLED`** : ajouter l'`id` (sinon le Stand n'apparaît ni au menu ni chez les ennemis).
3. **`ABIL_DEF`** : `id:{cd:…, dur:…}` (`dur:null` si le pouvoir est instantané).
4. **`DUR_LABEL`** : libellé du curseur de durée si `dur` n'est pas `null`.
5. **`CANCEL`** : ajouter l'`id` si le pouvoir dure et peut être coupé avec K (la recharge commence alors à la fin).
6. **`USERS`** : un porteur ennemi `{name, s:id, shirt, hair, line, lose}` (prénom + nom français originaux).

## 2. Pouvoir du joueur (section `abilities`)

- Dans `useAbility(p)` : vérifications préalables avant la recharge (cible à portée, etc.) avec un `ftext(…, {font:FB})` explicatif et `return` sans consommer la recharge.
- Ajouter un `case 'id':` dans le `switch(st.id)` de `useAbility`. Utiliser `dur` (= `durOf(st)`), jamais une durée en dur.
- Si le pouvoir est dans `CANCEL`, ajouter son nettoyage dans `endAbility(p)`.
- Pour une touche secondaire (L), voir la gestion de `tpPressed` dans `updatePlayer`.

## 3. Porteur ennemi (`npcPower`)

- Ajouter un `case 'id':` dans `npcPower(e, st, d, dt, T)`. `T` peut être le joueur (`isP`), un autre ennemi ou un leurre (`T.isDecoy`) : la mêlée est générale.
- Infliger des dégâts avec `strike(e, T, dégâts, couleur)` ; mettre `used=false` si les conditions ne sont pas réunies.
- **Mêmes réglages que le joueur** : utiliser `durOf(st)` pour les durées. La recharge ennemie est calculée automatiquement à partir de `cdOf(st)`. Si le son du pouvoir doit être coupé à la fin, compléter la liste des durées près de `ENEMY_DUR` / `const ed=`.

## 4. Son, dessin, interface

- **Son** : `case 'id':` dans `sfxAbility` (bruitage synthétisé) ; `OST_DIR` (`id:'nom-du-dossier'`) et créer `ost/nom-du-dossier/README.md` (modèle : un dossier existant) + une ligne dans `ost/README.md`.
- **Crête** : `case 'nomCrête':` dans `drawStand` (formes `circ/ell/box/ring/dia/star/line`, alpha `a`, couleurs `c` et `k`).
- **Effets visuels en jeu** : dans `drawPowers()`.
- **HUD** : texte d'aide dans `updateHUD` (`if(st.id==='id')txt=…`).
- **Paramètres** : une explication dans `NOTES` (objet juste avant `function slider`).

## 5. Vérifier et publier

1. `node tools/check.cjs` puis un cas ciblé : `node tools/headless.cjs --stands id --seconds 30`.
2. Pour une mécanique précise, écrire un petit test dans le style de `tools/headless-scenario.js` (placer un ennemi, appeler `useAbility`, vérifier l'état).
3. Skill `publier`. Puis mettre à jour `CLAUDE.md` (liste « Stands jouables ») et `docs/historique.md`.
4. Répondre à Anthony en français : ce que fait le pouvoir (touches, durée par défaut), ce que fait le porteur ennemi, ce qui a été vérifié.
