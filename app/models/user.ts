import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import Role from '#models/role'
import Actualite from '#models/actualite'
import Module from '#models/module'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'full_name' })
  declare name: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasOne(() => Role)
  declare role: HasOne<typeof Role>

  @hasMany(() => Actualite)
  declare actualites: HasMany<typeof Actualite>

  @manyToMany(() => Module, {
    pivotTable: 'users_modules',
  })
  declare modules: ManyToMany<typeof Module>
}
