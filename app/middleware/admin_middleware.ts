import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth.user

    if (!user) {
      return ctx.response.redirect('/login')
    }

    if (!user.role) {
      await user.load('role')
    }

    if (user.role?.name !== 'ADMIN') {
      return ctx.response.forbidden('Acces reserve aux administrateurs')
    }

    return next()
  }
}
