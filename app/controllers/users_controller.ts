import type { HttpContext } from '@adonisjs/core/http'
import { registerValidator } from '#validators/register_validator'
import { loginValidator } from '#validators/login_validator'

type User = {
  id: number
  name: string
  email: string
  password: string
}

const users: User[] = []

type ValidationErrorItem = {
  field: string
  message: string
}

function normalizeErrors(error: unknown): ValidationErrorItem[] {
  const maybeMessages = (error as { messages?: unknown })?.messages
  if (Array.isArray(maybeMessages)) {
    return maybeMessages as ValidationErrorItem[]
  }
  const nested = (maybeMessages as { errors?: unknown })?.errors
  if (Array.isArray(nested)) {
    return nested as ValidationErrorItem[]
  }
  return []
}

function mapErrors(errors: ValidationErrorItem[]) {
  return errors.reduce<Record<string, string>>((acc, item) => {
    acc[item.field] = item.message
    return acc
  }, {})
}

export default class UsersController {
  async showRegister({ view }: HttpContext) {
    return view.render('pages/register')
  }

  async showLogin({ view }: HttpContext) {
    return view.render('pages/login')
  }

  async store({ request, response, view }: HttpContext) {
    let payload: { name: string; email: string; password: string }
    try {
      payload = await request.validateUsing(registerValidator)
    } catch (error) {
      const errors = normalizeErrors(error)
      return response.status(422).send(
        await view.render('pages/register', {
          errors,
          errorMap: mapErrors(errors),
          values: request.only(['name', 'email']),
        })
      )
    }
    const user: User = {
      id: users.length + 1,
      name: payload.name,
      email: payload.email,
      password: payload.password,
    }

    users.push(user)

    return response.json({
      message: 'Utilisateur enregistre en memoire',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      users,
    })
  }

  async login({ request, response, view }: HttpContext) {
    let payload: { email: string; password: string }
    try {
      payload = await request.validateUsing(loginValidator)
    } catch (error) {
      const errors = normalizeErrors(error)
      return response.status(422).send(
        await view.render('pages/login', {
          errors,
          errorMap: mapErrors(errors),
          values: request.only(['email']),
        })
      )
    }
    const user = users.find(
      (item) => item.email === payload.email && item.password === payload.password
    )

    if (!user) {
      return response.unauthorized({
        message: 'Email ou mot de passe incorrect',
      })
    }

    return response.json({
      message: 'Connexion reussie',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  }
}
