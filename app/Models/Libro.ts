import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Libro extends BaseModel {
  static table = 'libros'

  @column({ isPrimary: true })
  public id: number

  @column()
  public nombre: string

  @column()
  public ISBN: string

  @column()
  public fecha_de_creacion: string

  @column()
  public autor_id: number
  
  @column()
  public categoria_id: number

  @column()
  public editorial_id: number
  
  @column()
  public paginas: string
  
  @column()
  public descripcion: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
