
import Hash from '@ioc:Adonis/Core/Hash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import Route from '@ioc:Adonis/Core/Route'
import Mail from '@ioc:Adonis/Addons/Mail'
//import Env from '@ioc:Adonis/Core/Env'
import Role from 'App/Models/Role'
const local = "http://192.168.119.190:3333"





export default class UsersController
{

    public async register({ request, response }: HttpContextContract)
    {
        console.log(request.all())
        try
        {
          await request.validate({
            schema: schema.create({
                name: schema.string(),
                email: schema.string(
                ),
                password: schema.string(),
                phone: schema.number(),
            }),
            messages: {
                required: 'El campo {{ field }} es obligatorio.',
            }
        })
    
            const user = await User.create({
              name: request.input('name'),
              email: request.input('email'),
              password: request.input('password'),
              phone: request.input('phone'),
              rol_id: 2,
            })
    
            const URL2 = local + Route.makeSignedUrl('codigo', {id: user.id},{ expiresIn: '30m' })
            const URL = local + Route.makeSignedUrl('verificarTelefono', {id: user.id},{ expiresIn: '30m' })
            
            try {
              await Mail.sendLater((message) => {
                  message
                      .from('alejandrosalazarcom25@gmail.com')
                      .to(user.email)
                      .subject('Verifica Tu Cuenta!')
                      .htmlView('emails/primero', {
                          user: { name: user.name },
                          url: URL,
                      })
              })
          
              return response.status(201).json({
                message: 'Usuario registrado correctamente',
                data: user,
                url: URL2,
            });
    
            return response.ok({
              'status': 201,
              'mensaje': 'Usuario registrado correctamente',
              'error': [],
              'data': user,
              'url': URL2,
          })
            
          } catch (error) {
              console.log(error)
              return response.status(500).json({
                  status: 500,
                  mensaje: 'Error al enviar el correo electrónico',
                  error: error.message,
                  data: null,
                  url: null,
              })
          }
          
        }
        catch(error)
        {
          console.log(error)
          return response.status(500).json({
              status: 500,
              mensaje: 'Error al enviar el correo electrónico',
              error: error.message,
              data: null,
              url: null,
          })
        }
    }

    public async login({ request, response,auth }: HttpContextContract)
    {
        await request.validate({
          schema: schema.create({
              email: schema.string([
                  rules.email(),
                  rules.trim(),
              ]),
              password: schema.string([
                  rules.maxLength(20),
                  rules.trim(),
              ]),
          }),
          messages: {
              required: 'El campo {{ field }} es obligatorio.',
              string: 'El campo {{ field }} debe ser una cadena de caracteres.',
              trim: 'El campo {{ field }} no debe contener espacios en blanco.',
              email: 'El campo {{ field }} debe ser un correo electrónico válido.',
              maxLength: 'El campo {{ field }} debe tener un máximo de {{ options.maxLength }} caracteres.',
          }
      })
    
      const user = await User.query().where('email', request.input('email')).where('status', '1').first()
    
      if (!user) {
          return response.badRequest({
              'status': 400,
              'mensaje': 'No existe ningún usuario con este correo o su cuenta está desactivada.',
              'error': [],
              'data': [],
          })
      }
    
      if(!await Hash.verify(user.password, request.input('password'))) {
          return response.badRequest({
              'status': 400,
              'mensaje': 'Credenciales de usuario incorrectas.',
              'error': [],
              'data': [],
          })
      }
    
      const token = await auth.use('api').generate(user)
      user.rememberMeToken = token.token
      await user.save()
    
      return response.ok({
          'status': 200,
          'mensaje': 'Sesión iniciada correctamente.',
          'error': [],
          'data': user,
          'UserID': user.id,
          'rol_id': user.rol_id,
          'name'  : user.name,
          'Token': token.token,
      })
    }

    public async logout({ response, auth }: HttpContextContract)
    {
        console.log(auth);
        try {


            await auth.use('api').revoke();
            return response.status(200).json({
                message: 'Sesión cerrada correctamente',
                data: null,
                revoked: true,
            });
        }
        catch (error) {
            return response.status(400).json({
                message: 'Error al cerrar sesión',
                data: error,
            });
        }

    }

    public async ValidarToken({params,response}: HttpContextContract) 
  {
    const user = await User
    .query()
    .where('remember_me_token', params.token)
    .first()
    if(user)
    {
      if(user.status == 1 && user.rol_id == params.rol)
      {
        return response.ok({
          'status': 200,
          'mensaje': true,
      })
      }
      else
      {
        return response.badRequest({
          'status': 400,
          'mensaje': false,
      })
      }
    }
    else
    {
      return response.badRequest({
        'status': 400,
        'mensaje': false,
    })
    }
    
  }

  public async ValidarRol({params,response}: HttpContextContract) 
  {
    const user = await User
    .query()
    .where('remember_me_token', params.token)
    .first()
    if(user)
    {
      if(user.status == 1 && user.rol_id == params.rol && (user.rol_id == 1 || user.rol_id == 2))
      {
        return response.ok({
          'status': 200,
          'mensaje': true,
      })
      }
      else
      {
        return response.badRequest({
          'status': 400,
          'mensaje': false,
      })
      }
    }
    else
    {
      return response.badRequest({
        'status': 400,
        'mensaje': false,
    })
    }
  }

  public async ValidarEliminar({params,response}: HttpContextContract) 
  {
    const user = await User
    .query()
    .where('remember_me_token', params.token)
    .first()
    if(user)
    {
      if(user.status == 1 && user.rol_id == params.rol && user.rol_id == 1)
      {
        return response.ok({
          'status': 200,
          'mensaje': true,
      })
      }
      else
      {
        return response.badRequest({
          'status': 400,
          'mensaje': false,
      })
      }
    }
    else
    {
      return response.badRequest({
        'status': 400,
        'mensaje': false,
    })
    }
  }

  public async Usuarios({}: HttpContextContract) 
  {
    const users = await User
    .query()
    .select('users.id','users.name','users.email','users.phone','users.status','roles.rol')
    .join('roles','users.rol_id','roles.id')

    return users
  }

  public async roles({}: HttpContextContract) 
  {
    const roles = await Role.all()
    return roles
  }

  public async actualizarRoles({params}: HttpContextContract) 
  {
    const user = await User.find(params.id)
    if(user?.rol_id == 1)
    {
      user.rol_id = 2
      await user.save()
    }
    else if(user?.rol_id == 2)
    {
      user.rol_id = 3
      await user.save()
    }
    else if(user?.rol_id == 3)
    {
      user.rol_id = 1
      await user.save()
    }
  }

  public async cambiarRol({params}: HttpContextContract) 
  {
    const user = await User.find(params.id)
    if(user)
    {
      user.rol_id = params.rol
      await user.save()
    }
  }

  public async cambiarStatus({params}: HttpContextContract) 
  {
    const user = await User.find(params.id)
    if(user?.status == 1)
    {
      user.status = 0
      await user.save()
    }
    else if(user?.status == 0)
    {
      user.status = 1
      await user.save()
    }
  }

}
