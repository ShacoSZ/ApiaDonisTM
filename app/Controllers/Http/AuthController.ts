import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';
import axios from 'axios';
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Route from '@ioc:Adonis/Core/Route'
import Env from '@ioc:Adonis/Core/Env'


export default class AuthController {

  public async enviarCodigo({view,params }: HttpContextContract) 
  {
    
    const usuario = await User.findOrFail(params.id);
    

    const code = Math.floor(Math.random() * 9999);
    usuario.code = code;
    await usuario.save();

    try {
      const response = await axios.post('https://rest.nexmo.com/sms/json', {
        from: 'Equipos Api ',
        text: `Tu código de verificación  es: ${code}`,
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

  public async verificarCodigo({response, request,params }: HttpContextContract)
  {

    const validationSchema = schema.create({
      code: schema.number(),
    })

    const data = await request.validate({
       schema: validationSchema,
       messages: {
          'code.required': 'El código es requerido',
          'code.number': 'El código debe ser un número',
    
    }});


    
    const usuario = await User.findOrFail(params.id);

    if(usuario.code == data.code)
    {
      usuario.status = 1;
      await usuario.save();
      return response.status(200).json({message: 'Código correcto'});
    }
    else
    {
      return response.status(400).json({message: 'Código incorrecto'});
    }

  }

  public async reenviarCodigo({ response,request,params }: HttpContextContract)
  {
    
    const verificarCodigo =Env.get('SERVE') +Route.makeSignedUrl('verificarCodigo', {id:params.id},{expiresIn: '1h'})          

    const usuario = await User.findOrFail(params.id);
    
    const code = Math.floor(Math.random() * 9999);
    usuario.code = code;
    await usuario.save();

    try 
    {
          const response = await axios.post('https://rest.nexmo.com/sms/json', {
            from: 'Equipos Api ',
            text: `Tu  nuevo código de verificación  es: ${code}`,
            to: `52${usuario.phone}`,
            api_key: 'c2e5605a',
            api_secret: 'gbvxqZPChrgzv0W4',
          });

          return verificarCodigo;
          

    } catch (error) 
    {
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
