import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'equipos'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nombre',35)
      table.bigInteger('division')
      table.bigInteger('campeonatos')

      table.integer('estado').unsigned().references('id').inTable('estados').onUpdate('CASCADE').onDelete('CASCADE').nullable()
      table.integer('propietario').unsigned().references('id').inTable('propietarios').onUpdate('CASCADE').onDelete('CASCADE').nullable()

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
