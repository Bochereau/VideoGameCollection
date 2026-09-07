# VideoGameCollection (VGC)

Gestion de collection de jeux vidéo — même logique que le blog : Vite + API serverless Vercel + MongoDB Atlas (`MongoClient`), projet Vercel **dédié**.

## Stack

- Front : Vite, React 19, TypeScript, Tailwind, Clerk
- API : `api/**/*.js` (Vercel Serverless), driver natif `mongodb`
- BDD : Atlas, database `vgc` (collections `games`, `consoles`)

## Créer le projet Vercel (nouveau)

1. [vercel.com](https://vercel.com) → **Add New Project** → importer le repo **VideoGameCollection** (pas le blog)
2. Framework : Vite (auto)
3. Variables d’environnement (Production + Preview) :
   - `MONGODB_URI`
   - `CLERK_SECRET_KEY`
   - `VITE_CLERK_PUBLISHABLE_KEY`
4. Deploy
5. Dans Clerk → Domains : ajoute `https://ton-projet.vercel.app` et `http://localhost:5173`
6. Atlas → Network Access : `0.0.0.0/0` (comme pour le blog)

## Local (même approche que le blog)

Le blog en local appelle l’API **déjà déployée** sur Vercel. Ici :

1. Déploie une première fois sur ton nouveau projet Vercel
2. Dans `.env` local :
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
   VITE_API_URL=https://TON-PROJET-VGC.vercel.app
   ```
   (`CLERK_SECRET_KEY` et `MONGODB_URI` restent sur Vercel pour l’API)
3. `npm install` puis `npm run dev`
4. Ouvre `http://localhost:5173`

En production, laisse `VITE_API_URL` vide : le front et l’API sont sur le même domaine.

## Scripts

- `npm run dev` — front Vite
- `npm run build` — build production
