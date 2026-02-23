/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const UsersController = () => import('#controllers/users_controller')
const ModulesController = () => import('#controllers/modules_controller')

function renderHome(ctx) {
  return ctx.view.render('pages/home')
}
router.get('/', renderHome)
router.get('/register', [UsersController, 'showRegister'])
router.post('/users', [UsersController, 'store'])
router.get('/login', [UsersController, 'showLogin'])
router.post('/login', [UsersController, 'login'])
router.post('/logout', [UsersController, 'logout']).use(middleware.auth())
router.get('/apprenants', [UsersController, 'showApprenants']).use(middleware.auth())
router.get('/modules', [UsersController, 'showModules']).use(middleware.auth())
router
  .get('/modules/create', [ModulesController, 'showCreate'])
  .use(middleware.auth())
  .use(middleware.admin())
router.post('/modules', [ModulesController, 'store']).use(middleware.auth()).use(middleware.admin())
router
  .get('/modules/:id/edit', [ModulesController, 'showEdit'])
  .use(middleware.auth())
  .use(middleware.admin())
router
  .put('/modules/:id', [ModulesController, 'update'])
  .use(middleware.auth())
  .use(middleware.admin())
router
  .delete('/modules/:id', [ModulesController, 'destroy'])
  .use(middleware.auth())
  .use(middleware.admin())
