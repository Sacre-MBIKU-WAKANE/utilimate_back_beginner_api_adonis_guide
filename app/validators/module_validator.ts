import vine from '@vinejs/vine'

export const moduleValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(2),
    description: vine.string().trim().minLength(10),
  })
)
