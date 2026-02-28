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
  private async authorizeAdmin(ctx: HttpContext) {
    await ctx.bouncer.authorize('manageModule')
  }

  async showCreate(ctx: HttpContext) {
    await this.authorizeAdmin(ctx)
    const { view } = ctx
    return view.render('pages/modules_create')
  }

  async store(ctx: HttpContext) {
    await this.authorizeAdmin(ctx)
    const { request, response, view } = ctx
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

  async showEdit(ctx: HttpContext) {
    await this.authorizeAdmin(ctx)
    const { params, view, response } = ctx
    const moduleItem = await Module.find(params.id)

    if (!moduleItem) {
      return response.notFound('Module introuvable')
    }

    return view.render('pages/modules_edit', {
      moduleItem,
    })
  }

  async update(ctx: HttpContext) {
    await this.authorizeAdmin(ctx)
    const { params, request, response, view } = ctx
    const moduleItem = await Module.find(params.id)

    if (!moduleItem) {
      return response.notFound('Module introuvable')
    }

    let payload: { title: string; description: string }
    try {
      payload = await request.validateUsing(moduleValidator)
    } catch (error) {
      const errors = normalizeErrors(error)
      return response.status(422).send(
        await view.render('pages/modules_edit', {
          moduleItem,
          errors,
          errorMap: mapErrors(errors),
          values: request.only(['title', 'description']),
        })
      )
    }

    moduleItem.merge({
      title: payload.title,
      description: payload.description,
    })
    await moduleItem.save()

    return response.redirect('/modules')
  }

  async destroy(ctx: HttpContext) {
    await this.authorizeAdmin(ctx)
    const { params, response } = ctx
    const moduleItem = await Module.find(params.id)

    if (!moduleItem) {
      return response.notFound('Module introuvable')
    }

    await moduleItem.delete()

    return response.redirect('/modules')
  }
}
