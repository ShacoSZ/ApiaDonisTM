import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'

export default class extends BaseSeeder {
  public async run () {
    const rolAdmin = new Role();
    rolAdmin.rol = 'Administrador';
    await rolAdmin.save();

    const rolModerdor = new Role();
    rolModerdor.rol = 'Usuario';
    await rolModerdor.save();

    const rolUsuario = new Role();
    rolUsuario.rol = 'Invitado';
    await rolUsuario.save();
  }
}
