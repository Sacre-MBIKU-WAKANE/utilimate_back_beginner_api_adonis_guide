import type { HttpContext } from '@adonisjs/core/http'
import Module from '#models/module'
import { moduleValidator } from '#validators/module_validator'

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

export default class ModulesController {
  async showCreate({ view }: HttpContext) {
    return view.render('pages/modules_create')
  }

  async store({ request, response, view }: HttpContext) {
    let payload: { title: string; description: string }
    try {
      payload = await request.validateUsing(moduleValidator)
    } catch (error) {
      const errors = normalizeErrors(error)
      return response.status(422).send(
        await view.render('pages/modules_create', {
          errors,
          errorMap: mapErrors(errors),
          values: request.only(['title', 'description']),
        })
      )
    }

    await Module.create({
      title: payload.title,
      description: payload.description,
    })

    return response.redirect('/modules')
  }
}
