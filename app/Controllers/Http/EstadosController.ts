import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Estado from 'App/Models/Estado'

export default class EstadosController
{
    public async agregar({ request, response }: HttpContextContract)
    {
        const validacionSchema = schema.create
        ({
            nombre: schema.string([
                rules.required(),
                rules.minLength(3),
                rules.maxLength(20),
            ])
        })
      
        try
        {
            const data = await request.validate(
                {
                    schema: validacionSchema,
                    messages: {
                        'nombre.required': 'El nombre es requerido', 
                        'nombre.string': 'El nombre debe ser una cadena de caracteres',
                        'nombre.minLength': 'El nombre debe tener al menos 3 caracteres',
                        'nombre.maxLength': 'El nombre debe tener como máximo 20 caracteres',   
                    },
                }
            );
           
            const { nombre } = data;
            
            const estado = new Estado();
            estado.nombre = nombre;
            await estado.save();
            
            return response.status(201).json({ data: estado });
        }

        catch(error) 
        {  
          response.badRequest({ message: error.messages });
        }
    }

    public async editar({ request, params, response }: HttpContextContract) 
    {
        const validationSchema = schema.create
        ({
            nombre: schema.string([
                rules.required(),
                rules.maxLength(20),
                rules.minLength(3),
            ])
        });

        try 
        {
            const data = await request.validate(
                {
                    schema: validationSchema,
                    messages: {
                        'nombre.required': 'El nombre es obligatorio',
                        'nombre.string': 'El nombre debe ser una cadena de caracteres',
                        'nombre.maxLength': 'El nombre debe tener como máximo 20 caracteres',
                        'nombre.minLength': 'El nombre debe tener al menos 3 caracteres',
                    },
                }
            );

            const estado = await Estado.findOrFail(params.id);
    
            if(estado) 
            {
                estado.nombre = data.nombre;
                await estado.save();

                return response.status(200).json({ data: estado });
            }
    
            return response.notFound({ message: 'El estado no existe.' });
        }

        catch(error) 
        {
            response.badRequest({ message: error.messages });
        }
       
    }

    public async eliminar({ params, response }:HttpContextContract)
    {
        const estado = await Estado.find(params.id);

        if(estado)
        {        
            await estado.delete()
            return response.status(200).json({ message:"El estado se elimino correctamente." });
        }

        return response.notFound({ message:"El estado no existe." });
    }

    public async mostrar({ response }:HttpContextContract)
    {
        const estados = await Estado.query().orderBy('id','asc');

        if(estados)
        {
            return estados
        }

        else
        {
            return response.notFound({ message: 'No hay estados registrados.' });
        }
    }

    public async mostrarUnico({ params, response }: HttpContextContract)
    {
        const estado = await Estado.find(params.id);

        if(estado)
        {
            return estado   
        }

        else
        {
            return response.notFound({ message:"El estado no existe." });
        }
    }
}
