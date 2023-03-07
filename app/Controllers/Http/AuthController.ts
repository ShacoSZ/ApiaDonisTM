import { Response } from '@adonisjs/core/build/standalone';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';
import axios from 'axios';
import View from '@ioc:Adonis/Core/View'


export default class AuthController {

  public async enviarCodigo({ request,view }: HttpContextContract) 
  {


    const code = Math.floor(Math.random() * 9999);
    
    const usuario = await User.findOrFail(request.input('id'));
    usuario.code = code;
    await usuario.save();

    try {
      const response = await axios.post('https://rest.nexmo.com/sms/json', {
        from: 'Equipos Api ',
        text: `Tu código de verificación papa es: ${code}`,
        to: `52${usuario.phone}`,
        api_key: 'c2e5605a',
        api_secret: 'gbvxqZPChrgzv0W4',
      });
      const html = await view.render('emails/welcome')
      
      return html

    } catch (error) 
    {
      return error;
    }
  }

  public async verificarCodigo({ request, auth }: HttpContextContract)
  {
    const usuario = await User.findOrFail(request.input('id'));
    if(usuario.code == request.input('code'))
    {
      
      await usuario.save();
      return auth.use('api').login(usuario);
    }
    else
    {
      return 'Código incorrecto';
    }

  }

  public async reenviarCodigo({ request }: HttpContextContract)
  {
    const usuario = await User.findOrFail(request.input('id'));
    const code = Math.floor(Math.random() * 9999);
    usuario.code = code;
    await usuario.save();

    try {
    
    
    } catch (error) {
      return error;
    }
  }

  public async verificarToken({ request,auth }: HttpContextContract)
  {
    try {
      const usuario = User.findOrFail(request.input('id'));

      if(usuario)
      {
        return  usuario;
      }
      else
      {
        return 'No autorizado';
      }
    }
    catch (error) {
      return 'No autorizado';
    }
  }
}
