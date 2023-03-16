import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'libros'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nombre',50).notNullable()
      table.bigInteger('ISBN').notNullable()
      table.date('fecha_de_creacion').notNullable()
      table.integer('autor_id').unsigned().references('id').inTable('autores').onDelete('CASCADE').onUpdate('CASCADE').notNullable()
      table.integer('categoria_id').unsigned().references('id').inTable('categorias').onDelete('CASCADE').onUpdate('CASCADE').notNullable()
      table.integer('editorial_id').unsigned().references('id').inTable('editoriales').onDelete('CASCADE').onUpdate('CASCADE').notNullable()
      table.integer("paginas").notNullable()
      table.string("descripcion",500).notNullable()
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
