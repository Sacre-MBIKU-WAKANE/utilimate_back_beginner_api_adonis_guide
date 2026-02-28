import { Bouncer } from '@adonisjs/bouncer'
import User from '#models/user'

export const manageModule = Bouncer.ability(async (user: User) => {
  if (!user.role) {
    await user.load('role')
  }

  return user.role?.name === 'ADMIN'
})
