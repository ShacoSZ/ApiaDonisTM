import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Propietario from 'App/Models/Propietario'

export default class PropietariosController 
{
    public async agregar({ request, response }: HttpContextContract) 
    {
        const validationSchema = schema.create
        ({
            nombre: schema.string([
                rules.required(),
                rules.minLength(3),
                rules.maxLength(20),
            ]),
            ap_paterno: schema.string([
                rules.required(),
                rules.minLength(3),
                rules.maxLength(20),
            ]),
            ap_materno: schema.string([
                rules.required(),
                rules.minLength(3),
                rules.maxLength(20),
            ]),
            f_nac: schema.date({
                format: 'yyyy-mm-dd',
            },
            [
                rules.required(),
            ]),
            sexo: schema.string([
                rules.required(),
                rules.sexo(),
            ]),
        })

        try
        {
            const data = await request.validate(
                {
                    schema: validationSchema,
                    messages: {
                        'nombre.required': 'El nombre es requerido',
                        'nombre.minLength': 'El nombre debe tener al menos 3 caracteres',
                        'nombre.maxLength': 'El nombre debe tener como máximo 20 caracteres',
                        'nombre.string': 'El nombre debe ser una cadena de caracteres',

                        'ap_paterno.required': 'El apellido paterno es requerido',
                        'ap_paterno.minLength': 'El apellido paterno debe tener al menos 3 caracteres',
                        'ap_paterno.maxLength': 'El apellido paterno debe tener como máximo 20 caracteres',
                        'ap_paterno.string': 'El apellido paterno debe ser una cadena de caracteres',

                        'ap_materno.required': 'El apellido materno es requerido',
                        'ap_materno.minLength': 'El apellido materno debe tener al menos 3 caracteres',
                        'ap_materno.maxLength': 'El apellido materno debe tener como máximo 20 caracteres',
                        'ap_materno.string': 'El apellido materno debe ser una cadena de caracteres',

                        'f_nac.required': 'La fecha de nacimiento es requerida',
                        'f_nac.date': 'La fecha de nacimiento debe ser una fecha',

                        'sexo.required': 'El sexo es requerido',
                        'sexo.string': 'El sexo debe ser una cadena de caracteres',
                        'sexo.sexo': 'El sexo debe ser M o F',
                    },
                }
            );

            const { nombre, ap_paterno, ap_materno, f_nac,sexo } = data;

            const propietario = new Propietario();
            propietario.nombre = nombre;
            propietario.ap_paterno = ap_paterno;
            propietario.ap_materno = ap_materno;
            propietario.f_nac = f_nac;
            propietario.sexo = sexo;
            await propietario.save();
          
            return response.status(201).json({ data: propietario });
        }

        catch(error) 
        {
            response.badRequest({ message: error.messages });
        }
    }
      
    public async editar({ request, response,params }: HttpContextContract) 
    {
        const validationSchema = schema.create
        ({
            nombre: schema.string([
                rules.minLength(3),
                rules.maxLength(20),
            ]),
              ap_paterno: schema.string([
                rules.required(),
                rules.minLength(3),
                rules.maxLength(20),
            ]),
            ap_materno: schema.string( [
                rules.required(),
                rules.minLength(3),
                rules.maxLength(20),
            ]),
            f_nac: schema.date({
                format: 'yyyy-mm-dd',
            },
            [
                rules.required(),
            ]),
            sexo: schema.string([
                rules.sexo(),
            ]),
        })
      
        try 
        {
            const data = await request.validate(
                {
                    schema: validationSchema,
                    messages: {
                        'nombre.required': 'El nombre es requerido',
                        'nombre.string': 'El nombre debe ser una cadena de caracteres',
                        'nombre.minLength': 'El nombre debe tener al menos 3 caracteres',
                        'nombre.maxLength': 'El nombre debe tener como máximo 20 caracteres',

                        'ap_paterno.required': 'El apellido paterno es requerido',
                        'ap_paterno.string': 'El apellido paterno debe ser una cadena de caracteres',
                        'ap_paterno.minLength': 'El apellido paterno debe tener al menos 3 caracteres',
                        'ap_paterno.maxLength': 'El apellido paterno debe tener como máximo 20 caracteres',

                        'ap_materno.required': 'El apellido materno es requerido',
                        'ap_materno.string': 'El apellido materno debe ser una cadena de caracteres',
                        'ap_materno.minLength': 'El apellido materno debe tener al menos 3 caracteres',
                        'ap_materno.maxLength': 'El apellido materno debe tener como máximo 20 caracteres',

                        'sexo.required': 'El sexo es requerido',
                        'sexo.string': 'El sexo debe ser una cadena de caracteres',
                        'sexo.sexo': 'El sexo debe ser M o F',

                        'f_nac.required': 'La fecha de nacimiento es requerida',
                        'f_nac.date': 'La fecha de nacimiento debe ser una fecha válida',
                    },
                }
            );

            const propietario = await Propietario.findOrFail(params.id);

            if (propietario) 
            { 
                propietario.nombre = data.nombre;
                propietario.ap_paterno = data.ap_paterno;
                propietario.ap_materno = data.ap_materno;
                propietario.f_nac = data.f_nac;
                propietario.sexo = data.sexo;
                await propietario.save();

                return response.ok({ data: propietario });
            }
  
            return response.notFound({ message: 'El propietario no existe.' });
        }

        catch (error) 
        {  
            response.badRequest({ message: error.messages });
        }
    }
      
    public async eliminar({params,response}:HttpContextContract)
    {
        const propietario = await Propietario.find(params.id);

        if(propietario)
        {        
            await propietario.delete()
            return response.ok({ message:"El propietario se eliminó correctamente." });
        }
        return response.notFound({ message:"El propietario no existe." });
        
    }

    public async mostrar({response}:HttpContextContract)
    {
        const propietario = await Propietario.query().orderBy('id', 'asc');

        if(propietario)
        {
            return propietario
        }

        else
        {
            return response.notFound({ message: 'No hay propietaripos registrados.' });
        }
    }

    public async mostrarUnico({params,response}: HttpContextContract)
    {
        const propietario = await Propietario.find(params.id);

        if(propietario)
        {
            return propietario  
        }

        else
        {
            return response.notFound({ message: 'El propietario no existe.' });
        }
    }
}
