import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'

export default class extends BaseSeeder {
  public async run () {
    const rolAdmin = new Role();
    rolAdmin.nombre = 'Administrador';
    await rolAdmin.save();

    const rolModerdor = new Role();
    rolModerdor.nombre = 'Moderador';
    await rolModerdor.save();

    const rolUsuario = new Role();
    rolUsuario.nombre = 'Usuario';
    await rolUsuario.save();
  }
}
