import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'libro_idiomas'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('libro_id').unsigned().references('id').inTable('libros').onDelete('CASCADE').onUpdate('CASCADE').notNullable()
      table.integer('idioma_id').unsigned().references('id').inTable('idiomas').onDelete('CASCADE').onUpdate('CASCADE').notNullable()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.dateTime('created_at', { useTz: true })
      table.dateTime('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
