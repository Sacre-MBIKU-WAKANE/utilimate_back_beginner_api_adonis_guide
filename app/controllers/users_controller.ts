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
