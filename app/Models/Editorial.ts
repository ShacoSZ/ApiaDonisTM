import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Editorial extends BaseModel {
  static table = 'editoriales'

  @column({ isPrimary: true })
  public id: number

  @column()
  public nombre: string

  @column()
  public correo: string

  @column()
  public direccion: string

  @column()
  public telefono: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
