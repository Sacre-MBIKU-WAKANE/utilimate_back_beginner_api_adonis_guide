import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    const email = 'michel.buhendwa@example.com'
    const password = 'admin1234'
    const user = await User.findBy('email', email)

    if (user) {
      user.merge({ name: 'MICHEL BUHENDWA', password })
      await user.save()
    } else {
      await User.create({
        name: 'MICHEL BUHENDWA',
        email,
        password,
      })
    }

    const savedUser = user ?? (await User.findByOrFail('email', email))

    const existingRole = await savedUser.related('role').query().first()
    if (existingRole) {
      existingRole.merge({ name: 'ADMIN' })
      await existingRole.save()
    } else {
      await savedUser.related('role').create({
        name: 'ADMIN',
      })
    }
  }
}
