# Documentation d'apprentissage (coach) - API RESTful avec AdonisJS

Ce document guide pas a pas la creation d'une API RESTful avec AdonisJS. Il est pense pour des apprenants : on avance par etapes claires, avec objectifs, actions et validations.

---

## C'est quoi une API RESTful ?

Une API RESTful est une interface qui permet a des applications de communiquer via HTTP en respectant un style d'architecture appele REST (Representational State Transfer).

Principes essentiels :
- **Ressources** : tout est organise autour de ressources (ex: `users`, `courses`, `sessions`).
- **URLs claires** : une ressource est accessible via une URL (ex: `/users`, `/users/12`).
- **Verbes HTTP** : `GET` (lire), `POST` (creer), `PUT` / `PATCH` (mettre a jour), `DELETE` (supprimer).
- **Stateless** : chaque requete est autonome, le serveur ne "se souvient" pas des requetes precedentes.
- **Formats standards** : les reponses sont souvent en JSON.

En pratique : une API RESTful expose des routes et des regles coherentes pour creer, lire, modifier et supprimer des donnees.

---

## Etape 1 - Initialisation du projet

### Objectif
Creer un projet AdonisJS pret a accueillir une API REST.

### Pre-requis
- Node.js installe (version LTS recommandee)
- Un terminal
- Un editeur de code

### 1) Creer le projet
```bash
npm init adonisjs@latest
```

Pendant l'assistant d'installation :
- Choisis un nom de projet (ex: `my-classroom-api`)
- Choisis le type de projet : `API` (ou un template "API" si propose)
- Valide l'installation

### 2) Entrer dans le dossier
```bash
cd my-classroom-api
```

### 3) Installer les dependances (si non fait automatiquement)
```bash
npm install
```

### 4) Lancer le serveur de developpement
```bash
node ace serve --watch
```

Ou

```bash
npm run dev
```

Si tout va bien, le serveur tourne et tu verras une URL locale dans le terminal (ex: `http://localhost:3333`).

### 5) Verifier que le serveur repond
Dans ton navigateur ou via `curl` :
```bash
curl http://localhost:3333
```

Tu dois obtenir une reponse par defaut (selon le template).  
C'est le signe que l'application est bien initialisee.

---

## Etape 2 - Premiere route et page home avec layout partageable

### Objectif
Creer la premiere route (page d'accueil) et une page `home` avec un layout reutilisable pour partager plus tard le header et le footer avec Tailwind CSS.

### 1) Creer la route home
Dans `start/routes.ts`, ajoute (ou garde) une route qui renvoie la vue `pages/home`.
Ici on passe par une fonction pour rendre la vue :

```ts
import router from '@adonisjs/core/services/router'

function renderHome(ctx) {
  return ctx.view.render('pages/home')
}

router.get('/', renderHome)
```

Cette route repond sur `/` et affiche la vue `resources/views/pages/home.edge`.

**Explication de l'argument `ctx`**
`ctx` signifie **context**. C'est l'objet qui contient tout ce qui concerne la requete en cours et la reponse a renvoyer.  
Dans AdonisJS, il regroupe plusieurs elements utiles, par exemple :
- `ctx.request` : lire les donnees qui entrent (query params, body, headers, etc.).
- `ctx.response` : definir la reponse HTTP (status, headers, type de contenu).
- `ctx.view` : rendre une vue Edge (comme ici avec `ctx.view.render`).
- `ctx.params` : recuperer les parametres d'URL (ex: `/users/:id`).

Dans notre cas, on utilise uniquement `ctx.view` pour retourner la page `home`.

### 2) Creer le layout commun (component + slot)
On utilise un layout sous forme de **component** avec un slot pour le contenu principal.
Le layout contiendra le header, le footer et une zone de contenu.

Chemin a creer : `resources/views/layouts/app.edge`

```edge
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title> {{ title || "Page"}} </title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="min-h-screen bg-slate-50 text-slate-900">
    @include('partials/header')

    <main class="mx-auto max-w-5xl px-6 py-10">
      {{{ await $slots.main() }}}
    </main>

    @include('partials/footer')
  </body>
</html>
```

### 3) Creer le header et le footer (partials)
Ces fichiers seront reutilises par toutes les pages.

Chemin a creer : `resources/views/partials/header.edge`

```edge
<header class="border-b bg-white">
  <div class="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
    <a href="/" class="text-lg font-semibold">VDL-Soir Juin 2025</a>
    <nav class="text-sm text-slate-600">
      <ul class="flex items-center gap-3">
        <li><a href="/">Accueil</a></li>
        <li><a href="/">Apprenants</a></li>
        <li><a href="/">Modules</a></li>
      </ul>
    </nav>
    <ul>
      <li><a href="/">Connexion</a></li>
      <li><a href="/">Inscription</a></li>
    </ul>
  </div>
</header>
```

Chemin a creer : `resources/views/partials/footer.edge`

```edge
<footer class="border-t bg-white">
  <div class="mx-auto max-w-5xl px-6 py-4 text-sm text-slate-500">
    © 2026 Kadea Dev soir Juin/2025. Tous droits reserves.
  </div>
</footer>
```

### 4) Creer la page home en partant de zero
Cette page utilise le layout comme component et remplit le slot `main`.

Chemin a creer : `resources/views/pages/home.edge`

```edge
@component("layouts/app", {title: "Accueil"})
@slot('main')
  <h1 class="text-3xl font-bold">Bienvenue sur VDL Soir</h1>
  <p class="mt-2 text-slate-600">
    Cette page d'accueil est notre premiere vue. Le header et le footer viennent du layout.
  </p>
@endslot
@end
```

### 5) Verifier dans le navigateur
Relance le serveur si besoin, puis ouvre :
```
http://localhost:3333
```

Si tout est correct, tu verras la page d'accueil avec le header et le footer.

---

## Prochaine etape

Quand tu es pret, on passe a l'etape 3 (par exemple : structure du projet, creation des routes REST, ou configuration de la base de donnees).
