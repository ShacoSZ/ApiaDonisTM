import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Partido extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public local: number

  @column()
  public visitante: number

  @column.date()
  public fecha: DateTime

  @column.dateTime()
  public hora: DateTime
  
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
