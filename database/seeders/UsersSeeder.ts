import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run () {
    const user = new User();
    user.name = 'Administrador';
    user.email = "admin@gmail.com";
    user.password = "123456789"
    user.phone = 1234567890;
    user.rol_id = 1;
    user.status = 1;
    await user.save();
  }
}
