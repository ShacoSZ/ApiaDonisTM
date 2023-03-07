import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Estado from 'App/Models/Estado'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
//import { HttpContext } from "@adonisjs/core/build/standalone";

export default class EstadosController {

    public async agregar({ request, response }: HttpContextContract)
     {
        const newEstadoSchema = schema.create({
          nombre: schema.string([
            rules.minLength(3),
            rules.maxLength(20),
            rules.alpha(),
            rules.unique({ table: 'estados', column: 'nombre' }),
          ])
        })
      
        try
         {
            const data = await request.validate({
                    schema: newEstadoSchema,
                    messages: {
                        'nombre.required': 'El nombre es requerido', 
                        'nombre.minLength': 'El nombre debe tener al menos 3 caracteres',
                        'nombre.maxLength': 'El nombre debe tener como máximo 20 caracteres',   
                        'nombre.unique': 'El nombre ya está en uso',
                        'nombre.string': 'El nombre debe ser una cadena de caracteres',
                        'nombre.alpha': 'El nombre debe contener solo letras',
                    },
                });
           
                const { nombre } = data;
            
                const estado = new Estado();
                estado.nombre = nombre;
            
                await estado.save();
            
                return response.status(201).json({ data: estado });
        }
         catch (error) 
        {  
          response.badRequest(error.messages);
        }
      }
      

    public async editar({ request, params, response }: HttpContextContract) 
    {
        const validationSchema = schema.create
        ({
            nombre: schema.string([
            rules.unique({ table: 'estados', column: 'nombre'}),
            rules.maxLength(20),
            rules.minLength(3),
            rules.alpha(),
            ])
        });

        try 
        {
            const data = await request.validate({
                schema: validationSchema,
                messages: {
                'nombre.required': 'El nombre es obligatorio',
                'nombre.unique': 'El nombre ya está en uso',
                'nombre.string': 'El nombre debe ser una cadena de caracteres',
                'nombre.maxLength': 'El nombre debe tener como máximo 20 caracteres',
                'nombre.minLength': 'El nombre debe tener al menos 3 caracteres',
                'nombre.alpha': 'El nombre debe contener solo letras',

                },
            });
            const estado = await Estado.find(params.id);
    
            if (estado) 
            {
                estado.nombre = data.nombre;
                await estado.save();
                return response.status(200).json({ data: estado });
            }
    
            return response.status(404).json({ message: 'El estado no existe' });
        }
         catch (error) 
        {
            response.status(400).json({ message: error.messages });
        }
       
    }

    public async eliminar({params,response}:HttpContextContract)
    {
        const estado = await Estado.find(params.id);

        if(estado)
        {        
            await estado.delete()
            return response.status(200).json({message:"el estado se elimino correctamente"});
        }
        return response.status(404).json({message:"el estado no existe"});
        
    }


    public async mostrar({response}:HttpContextContract)
    {
        const estado = await Estado.all()

        if (estado)
        {
            return estado
        }
        else
        {
            return response.notFound({ message: 'El estado no existe' });
        }
    }

    public async mostrarUnico({params,response}: HttpContextContract)
    {
        const estado = await Estado.find(params.id);

        if (estado)
        {
        return estado   
        }
        else
        {
            return response.status(404).json({message:"el estado no existe"});
        }

    }



}
