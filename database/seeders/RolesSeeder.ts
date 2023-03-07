import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'

export default class extends BaseSeeder {
  public async run () {
    Role.create({
      nombre: 'Administrador',
    });

    Role.create({
      nombre: 'Moderador',
    });

    Role.create({
      nombre: 'Usuario',
    });
  }
}
