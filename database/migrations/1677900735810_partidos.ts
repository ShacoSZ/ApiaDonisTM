import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'partidos'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('local').unsigned().references('id').inTable('equipos').onDelete('CASCADE').onUpdate('CASCADE').nullable();
      table.integer('visitante').unsigned().references('id').inTable('equipos').onDelete('CASCADE').onUpdate('CASCADE').nullable();
      table.date('fecha');
      table.time('hora');

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
