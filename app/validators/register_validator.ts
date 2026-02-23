import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2),
    email: vine.string().trim().email(),
    password: vine.string().minLength(6),
  })
)
