# Documentation d'apprentissage (coach) - API RESTful avec AdonisJS

Ce document guide pas a pas la creation d'une API RESTful avec AdonisJS. Il est pense pour des apprenants : on avance par etapes claires, avec objectifs, actions et validations.

---

## C'est quoi une API RESTful ?

Une API RESTful est une interface qui permet a des applications de communiquer via HTTP en respectant un style d'architecture appele REST (Representational State Transfer).

Principes essentiels :
- **Ressources** : tout est organise autour de ressources (ex: `users`, `courses`, `sessions`).
- **URLs claires** : une ressource est accessible via une URL (ex: `/users`, `/users/12`).
- **Verbes HTTP** : on utilise les verbes HTTP pour l'action a faire sur la ressource :
  - `GET` : lire (ex: obtenir une liste d'utilisateurs)
  - `POST` : creer
  - `PUT` / `PATCH` : mettre a jour
  - `DELETE` : supprimer
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
npm run develop
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

## Prochaine etape

Quand tu es pret, on passe a l'etape 2 (par exemple : structure du projet, creation des routes, ou configuration de la base de donnees).
