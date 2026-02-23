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
import UsersController from '#controllers/users_controller'

function renderHome(ctx) {
  return ctx.view.render('pages/home')
}
router.get('/', renderHome)
router.get('/register', [UsersController, 'showRegister'])
router.post('/users', [UsersController, 'store'])
router.get('/login', [UsersController, 'showLogin'])
router.post('/login', [UsersController, 'login'])
router.get('/apprenants', [UsersController, 'showApprenants']).use(middleware.auth())
router.get('/modules', [UsersController, 'showModules']).use(middleware.auth())
