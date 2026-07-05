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

## Classement mondial (Supabase)

Optionnel — sans clés, le classement est masqué et le jeu fonctionne. Pour
l'activer (aucune inscription côté joueurs, juste un pseudo mémorisé en local) :

1. Créer un projet sur [supabase.com](https://supabase.com) (gratuit).
2. **SQL Editor** → coller et exécuter :

   ```sql
   create table public.scores (
     id         bigint generated always as identity primary key,
     pseudo     text not null check (char_length(pseudo) between 1 and 20),
     score      int  not null check (score >= 0 and score <= 100),
     created_at timestamptz not null default now()
   );
   alter table public.scores enable row level security;

   -- lecture publique du classement
   create policy "read scores"   on public.scores for select using (true);
   -- envoi d'un score par un visiteur anonyme (bornes garanties par les CHECK)
   create policy "insert scores" on public.scores for insert with check (true);

   create index scores_score_idx on public.scores (score desc);
   ```

3. **Settings → API** → copier *Project URL* et la clé *anon public*.
4. Les coller dans [`src/config.js`](src/config.js) → objet `SUPABASE`.
5. `git commit` + `git push` → Vercel redéploie → classement en ligne.

> ⚠️ La clé *anon* est publique par conception (protégée par RLS) — sans danger
> dans le repo. Sans serveur de validation, un score reste *falsifiable* ; les
> `CHECK` limitent au moins les valeurs (score 0-100, pseudo 1-20). Pour bloquer
> la triche il faudrait une fonction serveur (hors périmètre « au plus simple »).

## Assets Riot

- **Data Dragon** (`ddragon.leagueoflegends.com`, CDN statique, sans clé) :
  icône de Smite + 5 champions aléatoires.
- **Wiki officiel LoL** : le render du Baron Nashor.

Tout est optionnel et encapsulé dans des `try/catch` / fallbacks : hors-ligne,
le jeu garde l'emoji 🔥 et le dessin SVG du Baron, et reste 100 % jouable.
