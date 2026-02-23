/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

function renderHome(ctx) {
  return ctx.view.render('pages/home')
}
router.get('/', renderHome)
