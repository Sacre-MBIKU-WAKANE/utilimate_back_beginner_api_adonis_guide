import { BaseSeeder } from '@adonisjs/lucid/seeders'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    const user = await User.create({
      name: 'MICHEL BUHENDWA',
      email: 'michel.buhendwa@example.com',
      password: await hash.make('password'),
    })

    await user.related('role').create({
      name: 'ADMIN',
    })
  }
}
