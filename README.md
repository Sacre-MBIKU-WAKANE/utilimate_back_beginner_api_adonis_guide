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

## Etape 3 - Controller User + page d'inscription + stockage en memoire

### Objectif
Creer un controller `User`, exposer deux routes, afficher un formulaire d'inscription et simuler l'enregistrement d'un utilisateur dans un tableau en memoire.

### 1) C'est quoi un controller ?
Un **controller** est une classe qui regroupe la logique d'une fonctionnalite ou d'une ressource.  
Au lieu d'ecrire toute la logique dans `routes.ts`, on delegue a des methodes claires et reutilisables.

**Avantages d'un module dedie**
- **Separation des responsabilites** : les routes restent lisibles, la logique va dans le controller.
- **Lisibilite** : chaque ressource a son fichier et ses methodes.
- **Testabilite** : plus simple d'ecrire des tests sur des methodes isolees.
- **Evolution** : on ajoute des methodes sans surcharger `routes.ts`.

### 2) Creer le controller avec le CLI
Commande :
```bash
node ace make:controller users
```

Fichier genere :
`app/controllers/users_controller.ts`

### 3) Exporter le controller
Dans AdonisJS, un controller est exporte via `export default` :

```ts
export default class UsersController {
  // ...
}
```

### 4) Importer le controller dans `routes.ts`
On utilise l'alias `#controllers` pour l'import :

```ts
import UsersController from '#controllers/users_controller'
```

### 5) Specifier la methode dans une route
On passe un tableau `[Controller, 'methode']` :

```ts
router.get('/register', [UsersController, 'showRegister'])
router.post('/users', [UsersController, 'store'])
```

### 6) Ajouter les deux routes
Dans `start/routes.ts`, voici le bloc complet pour l'inscription :

```ts
import router from '@adonisjs/core/services/router'
import UsersController from '#controllers/users_controller'

function renderHome(ctx) {
  return ctx.view.render('pages/home')
}

router.get('/', renderHome)
router.get('/register', [UsersController, 'showRegister'])
router.post('/users', [UsersController, 'store'])
```

### 7) Ecrire la logique du controller
On utilise un tableau en memoire pour stocker des utilisateurs (simulation).

Chemin : `app/controllers/users_controller.ts`

```ts
import type { HttpContext } from '@adonisjs/core/http'

type User = {
  id: number
  name: string
  email: string
  password: string
}

const users: User[] = []

export default class UsersController {
  async showRegister({ view }: HttpContext) {
    return view.render('pages/register')
  }

  async store({ request, response }: HttpContext) {
    const payload = request.only(['name', 'email', 'password'])
    const user: User = {
      id: users.length + 1,
      name: payload.name,
      email: payload.email,
      password: payload.password,
    }

    users.push(user)

    return response.json({
      message: 'Utilisateur enregistre en memoire',
      user,
      users,
    })
  }
}
```

### 8) Creer la page d'inscription
Chemin : `resources/views/pages/register.edge`

```edge
@component("layouts/app", {title: "Inscription"})
@slot('main')
  <div class="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <h1 class="text-2xl font-semibold">Inscription</h1>
    <p class="mt-1 text-sm text-slate-600">
      Creez un compte en remplissant ce formulaire.
    </p>

    <form class="mt-6 space-y-4" action="/users" method="POST">
      {{csrfField()}}

      <div class="space-y-1">
        <label class="text-sm font-medium" for="name">Nom complet</label>
        <input
          id="name"
          name="name"
          type="text"
          class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
          placeholder="Jean Dupont"
          required
        />
      </div>

      <div class="space-y-1">
        <label class="text-sm font-medium" for="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
          placeholder="jean@exemple.com"
          required
        />
      </div>

      <div class="space-y-1">
        <label class="text-sm font-medium" for="password">Mot de passe</label>
        <input
          id="password"
          name="password"
          type="password"
          class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
          placeholder="••••••••"
          required
        />
      </div>

      <button
        type="submit"
        class="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
      >
        Creer mon compte
      </button>
    </form>
  </div>
@endslot
@end
```

### 8.1) Comprendre `action="/users"` et `method="POST"`
- `action="/users"` signifie que le formulaire enverra la requete HTTP vers l'URL `/users`.
- `method="POST"` indique que c'est une requete de creation (elle correspond a `router.post('/users', ...)`).

### 8.2) Pourquoi `{{csrfField()}}` est important (SSR)
`{{csrfField()}}` genere un champ cache avec un **token CSRF**.  
Ce token permet au serveur de verifier que le formulaire vient bien de ton site (et pas d'un site malveillant).

Sans `{{csrfField()}}`, une requete POST peut etre :
- **refusee par le serveur** si la protection CSRF est active,
- **vulnerable aux attaques CSRF** : un site externe peut forcer un utilisateur connecte a envoyer un formulaire a sa place.

### 8.3) Et si on ne veut pas utiliser `{{csrfField()}}` ?
Tu dois **desactiver la protection CSRF** pour la route ou globalement (dans la configuration de Shield).  
Sinon, le serveur refusera les requetes POST sans token.

Fichier : `config/shield.ts`  
Section : `csrf`

Deux options possibles :

1) **Desactiver globalement**
```ts
csrf: {
  enabled: false,
  // ...
}
```

2) **Exclure seulement certaines routes**
```ts
csrf: {
  enabled: true,
  exceptRoutes: ['/users'],
  // ...
}
```

**Risques sans CSRF en SSR**
- Soumissions de formulaires non voulues
- Actions sensibles executees a l'insu de l'utilisateur connecte

### 9) A retenir
- Le stockage en memoire est **temporaire** : il disparait au redemarrage du serveur.
- Le formulaire poste vers `/users` et renvoie du JSON pour verifier l'ajout.
- En vrai projet, **ne stocke jamais un mot de passe en clair**. Ici c'est uniquement pour apprendre.

### 10) Comprendre `request.only(...)`
`request.only(['name', 'email', 'password'])` permet de **filtrer** le body et ne garder que certains champs.  
C'est pratique pour eviter d'enregistrer des donnees non prevues par le formulaire.

Exemple :
```ts
const payload = request.only(['name', 'email', 'password'])
```

### 11) Alternative : `request.body()`
Si tu veux lire tout le body tel quel, tu peux utiliser `request.body()` :

```ts
const body = request.body()
// body.name, body.email, body.password
```

En pratique, on prefere souvent `request.only(...)` pour controler ce qu'on accepte.

### 12) Lien vers /register dans le header
On a modifie le header pour pointer vers la page d'inscription :

Chemin : `resources/views/partials/header.edge`

```edge
<li>
  <a href="/register">Inscription</a>
</li>
```

---

## Etape 4 - Configurer Lucid avec PostgreSQL

### Objectif
Brancher l'ORM Lucid sur une base PostgreSQL via les variables d'environnement.

### 1) Verifier la config Lucid
Adonis utilise le fichier `config/database.ts`.  
Dans ce projet, la connexion par defaut est deja `postgres` :

```ts
const dbConfig = defineConfig({
  connection: 'postgres',
  connections: {
    postgres: {
      client: 'pg',
      connection: {
        host: env.get('DB_HOST'),
        port: env.get('DB_PORT'),
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})
```

### 2) Renseigner les variables d'environnement
Dans `.env`, adapte les valeurs a ta base PostgreSQL locale :

```
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=root
DB_PASSWORD=root
DB_DATABASE=app
```

Tu peux aussi mettre les memes valeurs dans `.env.example` pour partager la config avec l'equipe.

### 3) Pre-requis PostgreSQL
Assure-toi que :
- PostgreSQL tourne en local
- La base `DB_DATABASE` existe
- L'utilisateur `DB_USER` a les droits

### 4) A retenir
- La connexion est pilotee par les variables `DB_*`.
- Le driver PostgreSQL utilise le package `pg` (deja present dans `package.json`).

---

## Etape 5 - Modele User + migration

### Objectif
Creer le modele `User`, definir un schema minimal (`name`, `email`, `password`) et executer la migration.

### 1) Creer le modele + migration (CLI)
Commande :
```bash
node ace make:model User -m
```

Cela cree :
- `app/models/user.ts` (le modele)
- `database/migrations/<timestamp>_create_users_table.ts` (la migration)

Si le modele existe deja, Adonis peut afficher **SKIPPED** pour le fichier.

### 2) Definir le schema minimal
Dans la migration, ajoute les colonnes :

```ts
table.increments('id')
table.string('name').notNullable()
table.string('email').notNullable()
table.string('password').notNullable()

table.timestamp('created_at')
table.timestamp('updated_at')
```

**Si ta migration initiale contient `full_name`**
Tu as deux options :
- renommer `full_name` en `name` via une migration d'alteration ;
- ou **mapper** la colonne dans le modele.

Exemple de mapping dans le modele :
```ts
@column({ columnName: 'full_name' })
declare name: string
```

### 2.1) Comprendre `table` et `table.increments('id')`
Dans `this.schema.createTable('users', (table) => { ... })`, l'argument `table` est un **table builder**.  
Il sert a definir les colonnes et leurs contraintes (ex: `string`, `integer`, `notNullable`, etc.).

`table.increments('id')` cree une colonne auto-incrementee et la marque comme **cle primaire**.  
En PostgreSQL, cela correspond a un type `serial`.

Docs utiles :
```
https://lucid.adonisjs.com/docs/table-builder
https://lucid.adonisjs.com/docs/schema-builder
```

Dans le modele `User`, declare les champs :

```ts
@column()
declare name: string

@column()
declare email: string

@column({ serializeAs: null })
declare password: string
```

### 2.2) Comprendre `@column()` et `serializeAs: null`
`@column()` indique a Lucid que la propriete est une **colonne** de la table.  
Cela ne cree pas la colonne dans la base : les types et contraintes se definissent **dans les migrations**.

`@column({ serializeAs: null })` retire la propriete lors de la **serialisation** du modele en JSON.  
C'est utile pour eviter d'exposer le mot de passe quand on renvoie un utilisateur via une API.

Docs utiles :
```
https://lucid.adonisjs.com/docs/models
```

### 3) Executer la migration
```bash
node ace migration:run
```

Si la migration echoue, verifie que PostgreSQL tourne, que la base existe et que les variables `DB_*` sont correctes.

---

## Etape 6 - Modele Role + relation one-to-one

### Objectif
Ajouter un modele `Role` et etablir une relation **one-to-one** entre `User` et `Role`.

### 1) Creer le modele + migration
```bash
node ace make:model Role -m
```

### 2) Definir la table `roles`
La table contient :
- `user_id` unique (garantit qu'un utilisateur n'a qu'un seul role)
- `name` avec les valeurs `ADMIN` ou `APPRENANTS`

Exemple de migration :

```ts
table.increments('id')
table
  .integer('user_id')
  .notNullable()
  .unique()
  .references('id')
  .inTable('users')
  .onDelete('CASCADE')
table.enum('name', ['ADMIN', 'APPRENANTS']).notNullable().defaultTo('APPRENANTS')

table.timestamp('created_at')
table.timestamp('updated_at')
```

### 3) Definir la relation dans les modeles
Dans `Role` (belongsTo) :

```ts
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export type RoleName = 'ADMIN' | 'APPRENANTS'

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'user_id' })
  declare userId: number

  @column()
  declare name: RoleName

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
```

Dans `User` (hasOne) :

```ts
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import Role from '#models/role'

export default class User extends BaseModel {
  @hasOne(() => Role)
  declare role: HasOne<typeof Role>
}
```

### 4) A retenir
- `user_id` **unique** = un seul role par utilisateur.
- `belongsTo` + `hasOne` = relation one-to-one.

### 5) Explications detaillees

#### 5.1) Qu'est-ce que `hasOne` ?
`hasOne` signifie : **un User possede un seul Role**.  
On l'ecrit dans le modele `User` parce que c'est l'entite "parente" qui **detient** un role unique.

#### 5.2) Pourquoi `belongsTo` dans Role ?
`belongsTo` signifie : **le Role appartient a un User**.  
On l'ecrit dans `Role` parce que la table `roles` porte la **cle etrangere** `user_id`.  
Autrement dit, le role "sait" a quel utilisateur il est rattache.

#### 5.3) Pourquoi la cle etrangere est dans `roles` ?
On veut garantir **un role par utilisateur**.  
Le plus simple est de mettre `user_id` dans la table `roles` et de la rendre `unique`.  
Ainsi, chaque `user_id` ne peut apparaitre qu'une seule fois dans `roles`.

#### 5.4) Detail des methodes dans la migration
```ts
table
  .integer('user_id')
  .notNullable()
  .unique()
  .references('id')
  .inTable('users')
  .onDelete('CASCADE')
```

Explication de chaque partie :
- `integer('user_id')` : cree une colonne `user_id` de type entier.
- `notNullable()` : interdit les valeurs `NULL` (un role doit avoir un user).
- `unique()` : impose l'unicite (un user = un seul role).
- `references('id')` : `user_id` reference la colonne `id`.
- `inTable('users')` : la cle referencee se trouve dans la table `users`.
- `onDelete('CASCADE')` : si un user est supprime, son role est supprime automatiquement.

---

## Etape 7 - Modele Actualite + relation hasMany

### Objectif
Permettre aux apprenants de publier des actualites.  
Un `User` peut publier plusieurs `Actualite` (relation **hasMany**).

### 1) Creer le modele + migration
```bash
node ace make:model Actualite -m
```

### 2) Definir la table `actualites`
```ts
table.increments('id')
table
  .integer('user_id')
  .notNullable()
  .references('id')
  .inTable('users')
  .onDelete('CASCADE')
table.string('title').notNullable()
table.text('content').notNullable()

table.timestamp('created_at')
table.timestamp('updated_at')
```

### 3) Definir la relation dans les modeles
Dans `Actualite` (belongsTo) :

```ts
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class Actualite extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'user_id' })
  declare userId: number

  @column()
  declare title: string

  @column()
  declare content: string

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
```

Dans `User` (hasMany) :

```ts
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Actualite from '#models/actualite'

export default class User extends BaseModel {
  @hasMany(() => Actualite)
  declare actualites: HasMany<typeof Actualite>
}
```

### 4) Explications detaillees (comme hasOne)

#### 4.1) Qu'est-ce que `hasMany` ?
`hasMany` signifie : **un User peut avoir plusieurs Actualites**.  
On l'ecrit dans `User` car c'est l'entite "parente" qui publie plusieurs actualites.

#### 4.2) Pourquoi `belongsTo` dans Actualite ?
`belongsTo` signifie : **l'Actualite appartient a un User**.  
On l'ecrit dans `Actualite` parce que la table `actualites` porte la **cle etrangere** `user_id`.

#### 4.3) Pourquoi la cle etrangere est dans `actualites` ?
Chaque actualite doit etre rattachee a **un seul user**.  
Donc `user_id` est stocke dans `actualites`, et plusieurs lignes peuvent pointer vers le meme user.

#### 4.4) Detail des methodes dans la migration
```ts
table
  .integer('user_id')
  .notNullable()
  .references('id')
  .inTable('users')
  .onDelete('CASCADE')
```

Explication :
- `integer('user_id')` : cree une colonne `user_id` entiere.
- `notNullable()` : l'actualite doit avoir un user.
- `references('id')` : `user_id` reference `users.id`.
- `inTable('users')` : la cle referencee se trouve dans la table `users`.
- `onDelete('CASCADE')` : si un user est supprime, ses actualites sont supprimees.

---

## Etape 8 - Modele Module + relation many-to-many

### Objectif
Creer un modele `Module` et une relation **many-to-many** avec `User` (un user suit plusieurs modules, et un module a plusieurs users).

### 1) Creer le modele + migration
```bash
node ace make:model Module -m
```

### 2) Ajouter la table pivot
Pour une relation many-to-many, on ajoute une table **pivot** :
```bash
node ace make:migration users_modules
```

### 3) Definir la table `modules`
```ts
table.increments('id')
table.string('title').notNullable()
table.text('description').notNullable()

table.timestamp('created_at')
table.timestamp('updated_at')
```

### 4) Definir la table pivot `users_modules`
```ts
table.increments('id')
table
  .integer('user_id')
  .unsigned()
  .notNullable()
  .references('id')
  .inTable('users')
  .onDelete('CASCADE')
table
  .integer('module_id')
  .unsigned()
  .notNullable()
  .references('id')
  .inTable('modules')
  .onDelete('CASCADE')
table.unique(['user_id', 'module_id'])

table.timestamp('created_at')
table.timestamp('updated_at')
```

### 5) Definir la relation dans les modeles
Dans `Module` :

```ts
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class Module extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare description: string

  @manyToMany(() => User, { pivotTable: 'users_modules' })
  declare users: ManyToMany<typeof User>
}
```

Dans `User` :

```ts
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Module from '#models/module'

export default class User extends BaseModel {
  @manyToMany(() => Module, { pivotTable: 'users_modules' })
  declare modules: ManyToMany<typeof Module>
}
```

### 6) Explications detaillees (comme hasOne)

#### 6.1) Qu'est-ce que `manyToMany` ?
`manyToMany` signifie : **un User peut suivre plusieurs Modules, et un Module peut avoir plusieurs Users**.  
On l'utilise des deux cotes pour naviguer dans les deux sens.

#### 6.2) Pourquoi une table pivot ?
Une relation many-to-many ne peut pas etre representee par une seule cle etrangere.  
On utilise donc une table intermediaire (pivot) qui stocke les paires `user_id` / `module_id`.

#### 6.3) Pourquoi les cles etrangeres sont dans `users_modules` ?
Chaque ligne de la table pivot relie **un user** a **un module**.  
C'est pour cela qu'on y place `user_id` et `module_id`.

#### 6.4) Detail des methodes dans la migration
```ts
table
  .integer('user_id')
  .unsigned()
  .notNullable()
  .references('id')
  .inTable('users')
  .onDelete('CASCADE')
```
```ts
table
  .integer('module_id')
  .unsigned()
  .notNullable()
  .references('id')
  .inTable('modules')
  .onDelete('CASCADE')
```

Explication :
- `integer(...)` : colonne entiere.
- `unsigned()` : interdit les valeurs negatives.
- `notNullable()` : la relation est obligatoire.
- `references('id')` + `inTable(...)` : cree la cle etrangere.
- `onDelete('CASCADE')` : supprime la relation si le user/module est supprime.
- `unique(['user_id', 'module_id'])` : empeche les doublons.

---

## Etape 9 - Seeder d'un admin (MICHEL BUHENDWA)

### Objectif
Creer un utilisateur admin par defaut avec le role `ADMIN`.

### C'est quoi un seed ?
Un **seed** (ou seeder) est un script qui **injecte des donnees** dans la base.  
Il sert a initialiser un projet (ex: admin par defaut, roles, modules) ou a creer des donnees de test.

### 1) Creer le seeder
```bash
node ace make:seeder user
```

Fichier genere :
`database/seeders/user_seeder.ts`

### 2) Ecrire le seeder
```ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    const user = await User.create({
      name: 'MICHEL BUHENDWA',
      email: 'michel.buhendwa@example.com',
      password: await hash.make('password'),
    })

    await user.related('role').create({
      name: 'ADMIN',
    })
  }
}
```

**Pourquoi utiliser `hash` ?**
On ne stocke **jamais** un mot de passe en clair.  
`hash.make(...)` transforme le mot de passe en une valeur chiffrée et irreversible.  
Ainsi, meme si la base est compromise, les mots de passe restent difficiles a exploiter.

### 3) Executer le seeder
```bash
node ace db:seed
```

Si tu veux lancer un seeder precis, tu peux utiliser :
```bash
node ace db:seed --files "database/seeders/user_seeder.ts"
```
