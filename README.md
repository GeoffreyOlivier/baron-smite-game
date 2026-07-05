# Baron Smite

Mini-jeu dans l'univers de *League of Legends* : sécurise le Baron Nashor en
Smitant au bon moment. Le Smite inflige **1200 dégâts bruts** — vise le plus
près possible de 1200 PV sans dépasser (1200 = jackpot, sous 1000 = volé).

Vanilla **HTML / CSS / JS (modules ES)** — aucune dépendance, aucun build.

## Lancer

Les modules ES nécessitent un serveur HTTP (ils ne se chargent pas en `file://`) :

```bash
python3 serve.py      # sert le dossier sur http://127.0.0.1:4599
```

Puis ouvrir http://127.0.0.1:4599/ dans le navigateur.

## Architecture

```
baron-smite/
├── index.html          Shell : markup + liens CSS + <script type="module">
├── css/
│   ├── base.css        Tokens, reset, page, particules, en-tête
│   ├── components.css  Baron, barre de vie, bouton Smite, équipe, résultat
│   └── screens.css     Écran de démarrage
└── src/
    ├── config.js       Constantes & réglages (dégâts, cadence, grades, URLs Riot)
    ├── state.js        État mutable partagé (aucune dépendance)
    ├── dom.js          Références DOM mises en cache
    ├── render.js       Rendu de l'état → DOM (barre, phase, scores)
    ├── particles.js    Fond de particules
    ├── scoring.js      Jugement du Smite (fonction pure, sans DOM)
    ├── results.js      Vue de l'overlay de résultat
    ├── dragon.js       Riot Data Dragon : icône Smite + équipe de champions
    ├── baron.js        Chargement du vrai render Baron Nashor (wiki LoL)
    ├── game.js         Cœur : cycle de manche + moteur de dégâts + résolution
    ├── input.js        Clavier, boutons, transition démarrage/rejouer
    └── main.js         Point d'entrée : assemble les modules et démarre
```

Graphe de dépendances (sans cycle) : `state` et `config` sont les feuilles ;
`game` orchestre la logique ; `main` câble le tout.

## Assets Riot

- **Data Dragon** (`ddragon.leagueoflegends.com`, CDN statique, sans clé) :
  icône de Smite + 5 champions aléatoires.
- **Wiki officiel LoL** : le render du Baron Nashor.

Tout est optionnel et encapsulé dans des `try/catch` / fallbacks : hors-ligne,
le jeu garde l'emoji 🔥 et le dessin SVG du Baron, et reste 100 % jouable.
