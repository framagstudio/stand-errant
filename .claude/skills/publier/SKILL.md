---
name: publier
description: Publier une modification de Stand Errant — commit et push sur main (déploiement GitHub Pages automatique), et mise à jour optionnelle de l'artefact claude.ai.
---

# Publier

1. `node tools/check.cjs` doit passer (skill `tester-le-jeu`).
2. Commit sur `main` avec un message en français qui décrit le changement pour un joueur, puis push :
   ```bash
   git add -A
   git -c user.name="framagstudio" -c user.email="$(git log -1 --format=%ae)" commit -m "Titre court

   Détail si utile."
   git push origin main
   ```
   (L'identité reprend celle des commits précédents.) Terminer le message de commit par les lignes d'attribution demandées par l'environnement, s'il y en a.
3. Le workflow `.github/workflows/pages.yml` déploie le site en une à deux minutes. Il régénère aussi `music/tracks.json` et `ost/manifest.json` à partir des fichiers audio présents.
4. Vérifier le déploiement si possible : `gh api repos/framagstudio/stand-errant/actions/runs --jq '.workflow_runs[0] | [.status,.conclusion] | @tsv'`.

## Artefact claude.ai (optionnel)

Une copie jouable existe aussi comme artefact claude.ai privé : https://claude.ai/artifact/Mbv7ZBhqNif3xpQVrane1g. Pour la mettre à jour depuis une conversation claude.ai :

1. `node tools/to-artifact.cjs /chemin/scratchpad/stand-errant.html` (retire le squelette `<html>/<head>/<body>`, que l'outil Artifact ajoute lui-même) ;
2. publier ce fichier avec l'outil Artifact en passant cette URL (lire l'artefact d'abord si la conversation ne l'a pas encore lu).

Dans l'artefact, les dossiers `music/` et `ost/` n'existent pas : seuls le thème original et les sons synthétisés y sont disponibles.
