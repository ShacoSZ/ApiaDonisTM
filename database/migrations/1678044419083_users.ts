import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name')
      table.string('email', 255).notNullable().unique()
      table.string('password', 180).notNullable()
      table.string('phone', 10).notNullable().unique()
      table.string('remember_me_token').nullable()
      table.integer('role').unsigned().references('id').inTable('roles').onDelete('CASCADE').onUpdate('CASCADE').defaultTo(3);
      table.bigInteger('code').nullable();
      table.bigInteger('status').defaultTo(0);

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
