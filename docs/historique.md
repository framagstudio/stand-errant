# Historique et décisions

Ce qui a été construit, ce qu'Anthony a aimé et ce qu'il a refusé. À lire avant de proposer de nouvelles idées.

## Ce qu'Anthony aime

- **Les pouvoirs spectaculaires et ceux qui tordent les règles**, surtout autour du **temps** : Chrono Noir (arrêt du temps), Horloge Inverse (rembobiner un ennemi), Retour de Bâton (revenir 3 s en arrière), Best Experience (annulation d'action, création de vie).
- **Les cartes très originales avec beaucoup d'interactions** : le Beffroi des Rouages, le Grand Échiquier et La Cuisine des Géants ont plu (« tu as fait du beau boulot »).
- Les mécaniques qui se combinent : ennemis qui se battent entre eux, membres qu'on perd, objets des cartes qu'on retourne contre les ennemis.
- Des réglages partout (durée et recharge de chaque pouvoir, nombre d'ennemis par type), et que **les ennemis suivent les mêmes réglages**.
- La fluidité : la grande horloge animée de 2 s pour Horloge Inverse a été retirée car elle ralentissait le pouvoir.

## Ce qu'il n'a pas aimé

- Les Stands « élémentaires » ou génériques de la première série : Marée Rouge, Jardin Fractal, Écho Cobalt, Lame Sirocco, Miroir Opale, Gravité Zéro, Spectre Lunaire, Ruche d'Ambre, Fanfare Électrique, puis Foudre Vagabonde (forme électrique sur câbles), Pantin Pourpre (possession), Ancre Nomade (téléportation par marqueurs).
- Les six Stands à noms de chansons qu'il avait lui-même proposés, une fois codés : Take On Me, Pinball Wizard, Paint It Black, Don't Stop Me Now, Cutting Crew, Plastic Beach.
- Les quatre premières cartes (Saint-Mirage, Archipel de Brumevent, Temple du Sablier, Fonderie Néon) : « elles sont nulles ».
- Deux séries de 10 idées refusées en bloc :
  - Mauvaise Langue, Arène Close, Doublure, Copiste, Pièces Détachées, Lanterne Sourde, Hameçon, Coup de Gueule, Fou Rire, Seconde Chance ;
  - Nouvelle Donne, Envers du Décor, Apocalypse de Poche, Colosse, Législateur, Bal Masqué, Comète, Contrecoup Collectif, Maison Hantée, Contresens.
- De la liste de 20 idées : Chassé-Croisé, Ventriloque (codé puis retiré), Le Locataire, Atelier Carmin, Banquise, Échafaudage, La Trappe, Poids Plume, Éclipse, Estomac, Métronome, Le Créancier, Montgolfière n'ont pas été retenus.
- Idées « temps » proposées mais non choisies (pas refusées) : Sablier Fêlé (accélération perso), Écho Temporel (coups répétés 2 s plus tard), Bulle de Temps (zones lentes/rapides), Prémonition (voir 1 s dans le futur).

Tous ces Stands codés puis refusés restent dans le code, désactivés (hors de `ENABLED`).

## Chronologie

1. Jeu WebGPU de base, 10 Stands, ville Saint-Mirage, son synthétisé.
2. Menu pause, paramètres (durée, recharge…), annulation des pouvoirs, choix de musique (fichiers dans `music/`), sons de pouvoir (`ost/`).
3. Déploiement sur GitHub Pages (workflow qui liste `music/` et `ost/`).
4. Cartes multiples, sbires à l'épée et au pistolet, perte de membres, nombre d'ennemis réglable.
5. Remise à zéro : seul Chrono Noir conservé ; ajout de Main Basse, Riposte, Fil d'Ariane, Retour de Bâton, Coup de Dés, Kleptomane, Paratonnerre.
6. Nouvelles cartes Manoir Brisebois et Beffroi des Rouages ; mêlée générale entre ennemis ; navigation des ennemis.
7. Horloge Inverse ; cartes Grand Échiquier et La Cuisine des Géants.
8. Corrections : écran resté en noir et blanc (arrêt du temps déclenché dans le menu), Horloge Inverse utilisable pendant un arrêt du temps ennemi pour le briser, ennemis alignés sur les réglages, silhouette fantôme de destination pour Horloge Inverse.
9. Fichiers de contexte pour Claude (`CLAUDE.md`, skills, outils de test).
10. Best Experience (demandé par Anthony, inspiré de Giorno Giovanna) : K annule toute action contre soi (l'attaquant revient une seconde en arrière, étourdi ; brise aussi un arrêt du temps), L donne vie à une créature protégée par l'annulation. Anthony préfère une seule vie à la fois, que L annule ensuite (l'objet revient, là où se trouve la mouche).
11. Best Experience revu : Anthony trouvait les animations « pourries » et préférait annuler **après coup**. K annule désormais ce qu'on vient de subir pendant une fenêtre réglable (5 s par défaut : dégâts, membre arraché, arme volée, rembobinage, paratonnerre). Nouvelles animations (rayons qui convergent, flash, fantôme de l'attaquant). La créature est une **mouche**.

## Questions ouvertes

- Horloge Inverse : Anthony a signalé que les personnages revenaient « toujours au même endroit ». Non reproduit en test (le retour suit bien l'historique de 5 s). Une silhouette fantôme montre désormais la destination ; à revérifier s'il le signale de nouveau (demander la carte, la situation et la valeur « Temps remonté »).
