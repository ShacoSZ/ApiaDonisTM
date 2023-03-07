import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Equipo from 'App/Models/Equipo';

export default class EquiposController {
    public async agregar({ request, response }: HttpContextContract) 
    {
        const validationSchema = schema.create({
            nombre: schema.string([
                rules.minLength(3),
                rules.maxLength(35),
                rules.alpha(),
              ]),
              division: schema.number( [
                rules.required(),
                rules.range(1, 3),
              ]),
              campeonatos: schema.number( [
                rules.required(),
                rules.range(0, 20),
              ]),
              estado_id: schema.number( [
                rules.required(),
                rules.range(1,32),
                rules.exists({ table: 'estados', column: 'id' })
              ]),
              propietario_id: schema.number( [
                rules.required(),
                rules.range(1,32),
                rules.exists({ table: 'propietarios', column: 'id' })
              ]),
          })
      
        try {
          
          const data = await request.validate({
            schema: validationSchema,
            messages: {
                'nombre.required': 'El nombre es requerido',
                'nombre.string': 'El nombre debe ser una cadena de caracteres',
                'nombre.minLength': 'El nombre debe tener al menos 3 caracteres',
                'nombre.maxLength': 'El nombre debe tener como máximo 20 caracteres',

                'division.required': 'La división es requerida',
                'division.number': 'La división debe ser un número',
                'division.range': 'La división debe ser 1, 2 o 3',

                'campeonatos.required': 'El número de campeonatos es requerido',
                'campeonatos.number': 'El número de campeonatos debe ser un número',
                'campeonatos.range': 'El número de campeonatos debe ser entre 0 y 20',

                'estado_id.required': 'El estado es requerido',
                'estado_id.number': 'El estado debe ser un número',
                'estado_id.range': 'El estado debe ser un número entre 1 y 32',
                'estado_id.exists': 'El estado no existe',

                'propietario_id.required': 'El propietario es requerido',
                'propietario_id.number': 'El propietario debe ser un número',
                'propietario_id.range': 'El propietario debe ser un número entre 1 y 32',
                'propietario_id.exists': 'El propietario no existe',
            },
          });
      
          const { nombre,division,campeonatos,estado_id,propietario_id } = data;
      
          const propietario = new Equipo();
          propietario.nombre = nombre;
          propietario.division = division;
          propietario.campeonatos = campeonatos;
          propietario.estado_id = estado_id;
          propietario.propietario_id = propietario_id;

      
          await propietario.save();
      
          return response.created({ data: propietario });

          
        }
         catch (error) 
         {
          
          response.badRequest(error.messages);
        }
    }

    public async editar({ request, response,params }: HttpContextContract)
    {
      const validationSchema = schema.create({
        nombre: schema.string([
            rules.minLength(3),
            rules.maxLength(35),
            rules.alpha(),
          ]),
          division: schema.number( [
            rules.required(),
            rules.range(1, 3),
          ]),
          campeonatos: schema.number( [
            rules.required(),
            rules.range(0, 20),
          ]),
          estado_id: schema.number( [
            rules.required(),
            rules.range(1,32),
            rules.exists({ table: 'estados', column: 'id' })
          ]),
          propietario_id: schema.number( [
            rules.required(),
            rules.range(1,32),
            rules.exists({ table: 'propietarios', column: 'id' })
          ]),
      })
  
    try {
      
      const data = await request.validate({
        schema: validationSchema,
        messages: {
            'nombre.required': 'El nombre es requerido',
            'nombre.string': 'El nombre debe ser una cadena de caracteres',
            'nombre.minLength': 'El nombre debe tener al menos 3 caracteres',
            'nombre.maxLength': 'El nombre debe tener como máximo 20 caracteres',

            'division.required': 'La división es requerida',
            'division.number': 'La división debe ser un número',
            'division.range': 'La división debe ser 1, 2 o 3',

            'campeonatos.required': 'El número de campeonatos es requerido',
            'campeonatos.number': 'El número de campeonatos debe ser un número',
            'campeonatos.range': 'El número de campeonatos debe ser entre 0 y 20',

            'estado_id.required': 'El estado es requerido',
            'estado_id.number': 'El estado debe ser un número',
            'estado_id.range': 'El estado debe ser un número entre 1 y 32',
            'estado_id.exists': 'El estado no existe',

            'propietario_id.required': 'El propietario es requerido',
            'propietario_id.number': 'El propietario debe ser un número',
            'propietario_id.range': 'El propietario debe ser un número entre 1 y 32',
            'propietario_id.exists': 'El propietario no existe',
        },
      });
  
    
        const equipo = await Equipo.find(params.id);
        
        if(equipo)
        {
          equipo.nombre = data.nombre;
          equipo.division = data.division;
          equipo.campeonatos = data.campeonatos;
          equipo.estado_id = data.estado_id;
          equipo.propietario_id = data.propietario_id;
          await equipo.save();
          
        return response.created({ data: equipo });
        }
        return response.notFound({error: 'Equipo no encontrado'});
      
  
      }
       catch (error) 
       {
        
        response.badRequest(error.messages);
      }
  
    }

    public async eliminar({ response,params }: HttpContextContract)
    {
      const equipo = await Equipo.find(params.id);
      if(equipo)
      {
        await equipo.delete();
        return response.ok({message: 'Equipo eliminado'});
      }
      return response.notFound({error: 'Equipo no encontrado'});
    }

    public async mostrar({ response}: HttpContextContract)
    {
      const equipo = await Equipo.all();

      if(equipo)
      {
        return equipo;
      }
      else{
        return response.notFound({error: 'Equipo no encontrado'});
      }
    }

    public async mostrarUnico({ response,params }: HttpContextContract)
    {
      const equipo = await Equipo.find(params.id);

      if (equipo)
      {
        return equipo;
      }
      else{
        return response.notFound({error: 'Equipo no encontrado'});
      }
    }
      
}