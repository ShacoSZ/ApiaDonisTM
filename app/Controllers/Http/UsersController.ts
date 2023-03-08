
import Hash from '@ioc:Adonis/Core/Hash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import Route from '@ioc:Adonis/Core/Route'
import Mail from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'




export default class UsersController
{

    public async register({ request, response }: HttpContextContract)
    {
        const validationSchema = schema.create({
            name: schema.string({ trim: true }, [
                rules.minLength(3),
                rules.maxLength(50),
            ]),
            email: schema.string({ trim: true }, [
                rules.email(),
                rules.unique({ table: 'users', column: 'email' }),
            ]),
            password: schema.string({ trim: true }, [
                rules.minLength(8),
                rules.maxLength(50),
            ]),
            phone: schema.number([
                rules.required()
            ]),

        })

        try {
            const data = await request.validate({
                schema: validationSchema,
                messages: {
                    'name.required': 'El nombre es requerido',
                    'name.string': 'El nombre debe ser un texto',
                    'name.minLength': 'El nombre debe tener al menos 3 caracteres',
                    'name.maxLength': 'El nombre debe tener como máximo 50 caracteres',

                    'email.required': 'El email es requerido',
                    'email.string': 'El email debe ser un texto',
                    'email.email': 'El email debe ser un email válido',
                    'email.unique': 'El email ya está en uso',
                    
                    'password.required': 'La contraseña es requerida',
                    'password.string': 'La contraseña debe ser un texto',
                    'password.minLength': 'La contraseña debe tener al menos 8 caracteres',
                    'password.maxLength': 'La contraseña debe tener como máximo 50 caracteres',

                    'phone.required': 'El teléfono es requerido',
                    'phone.number': 'El teléfono debe ser un número',
                },
            });

            const { name, email, password, phone } = data;
                const user = new User();
                user.name = name;
                user.email = email;
                user.password = await Hash.make(password);
                user.phone = phone;
            
            await user.save();
                
            const verificarCodigo =Env.get('SERVER') +Route.makeSignedUrl('verificarCodigo', {id:user.id},{expiresIn: '1h'})          
            
            const enviarCodigo = Env.get('SERVER') +Route.makeSignedUrl ('enviarCodigo', {id:user.id},{expiresIn: '1h'})

            
                await Mail.sendLater((message) => 
                {
                    message
                        .from('pabloalvaradovazquez10@gmail.com')
                        .to(request.input('email'))
                        .subject('Verificación de correo')
                        .htmlView('emails/correo', {url:enviarCodigo,user:user} )
                })
                return response.status(201).json({
                    message: 'Usuario registrado correctamente',
                    user: user,
                    id: user.id,
                    url: verificarCodigo
                });

        
        } 
        catch (error) {
            return response.status(400).json({
                message: 'Error al registrar el usuario',
                data: error,
            });
        }
    }

    public async login({ request, response,auth }: HttpContextContract)
    {
        const validationSchema = schema.create({
            email: schema.string({ trim: true }, [
                rules.email(),
            ]),
            password: schema.string({ trim: true }, [
                rules.minLength(8),
                rules.maxLength(50),
            ]),

        })

        try {
            const data = await request.validate({
                schema: validationSchema,
                messages: {
                    'email.required': 'El email es requerido',
                    'email.string': 'El email debe ser un texto',
                    'email.email': 'El email debe ser un email válido',

                    'password.required': 'La contraseña es requerida',
                    'password.string': 'La contraseña debe ser un texto',
                    'password.minLength': 'La contraseña debe tener al menos 8 caracteres',
                    'password.maxLength': 'La contraseña debe tener como máximo 50 caracteres',
                },
            });

            const { email, password } = data;

            const user = await User.findByOrFail('email', email);

            if (!(await Hash.verify(user.password, password)))
             {
                return response.status(400).json({
                    message: 'Email o contraseña incorrectos',
                    data: null,
                });
            }
            
                try {
                    const token = await auth.use('api').generate(user);
                    return response.status(200).json({
                        message: 'Inicio de sesión exitoso',
                        user: user,
                        token: token.token,
                    });
                }
                catch (error) {
                    return response.status(400).json({
                        message: 'Error al iniciar sesión',
                        data: error,
                    });
                }

        } catch (error) {
            return response.status(400).json({
                message: 'Error al iniciar sesión',
                data: error,
            });
        }
    }

    public async logout({ response, auth }: HttpContextContract)
    {
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

    public async mostrarUsuarios({ response }: HttpContextContract)
    {
        try {
            const users = await User.all();
            return users;
        }
        catch (error) {
            return response.status(400).json({
                message: 'Error al obtener los usuarios',
                data: error,
            });
        }
    }

    public async eliminarUsuario({ params, response }: HttpContextContract)
    {
        try {
            const user = await User.findOrFail(params.id);
            await user.delete();
            return response.status(200).json({
                message: 'Usuario eliminado correctamente',
                data: user,
            });
        }
        catch (error) {         
            return response.status(400).json({
                message: 'Error al eliminar el usuario',
                data: error,
            });
        }
    }

    public async cambiarRol ({ params, request, response }: HttpContextContract)
    {
        try {
            const validationSchema = schema.create({
                role: schema.number([
                    rules.required()
                ]),
            })
            const data = await request.validate({
                schema: validationSchema,
                messages: {
                    'role.required': 'El rol es requerido',
                    'role.number': 'El rol debe ser un número',
                },
            });



            const user = await User.findOrFail(params.id);
            
            if(user)
            {
                const role = request.input('role');
                user.role = role;
                await user.save();
                return response.status(200).json({
                    message: 'Rol cambiado correctamente',
                    data: user,
                });
            }
            else
            {
                return response.status(400).json({
                    message: 'Error al cambiar el rol',
                    data: null,
                });
            }
        }
        catch (error) {
            return response.status(400).json({
                message: 'Error al cambiar el rol',
                data: error,
            });
        }

    }

    public async cambiarStatus ({ params, request, response }: HttpContextContract)
       {
              try {
                        const validationSchema = schema.create({
                                status: schema.number([
                                    rules.required()
                                ]),
                        })
                        const data = await request.validate({
                                schema: validationSchema,
                                messages: {
                                    'status.required': 'El status es requerido',
                                    'status.number': 'El status debe ser un número',
                                },
                        });
                        const user = await User.findOrFail(params.id);
                        if(user)
                        {
                                const status = request.input('status');
                                user.status = status;
                                await user.save();
                                return response.status(200).json({
                                    message: 'Status cambiado correctamente',
                                    data: user,
                                });
                        }
                        else
                        {
                                return response.status(400).json({
                                    message: 'Error al cambiar el status',
                                    data: null,
                                });
                        }
                }
                catch (error) {
                        return response.status(400).json({
                            message: 'Error al cambiar el status',
                            data: error,
                        });
                }

       }
       
       public async mostrarUsuario({ params, response }: HttpContextContract)
       {
           try {
               const user = await User.findOrFail(params.id);
               return response.status(200).json({
                   message: 'Usuario obtenido correctamente',
                   data: user,
               });
           }
           catch (error) {
               return response.status(400).json({
                   message: 'Error al obtener el usuario',
                   data: error,
               });
           }
           
       }

}
