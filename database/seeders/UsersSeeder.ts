import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run () {
    User.create({
      name: 'Administrador',
      email: 'admin@gmail.com',
      password: '12345678',
      phone: 1234567890,
      role: 1,
      status: 1
    });
  }
}
