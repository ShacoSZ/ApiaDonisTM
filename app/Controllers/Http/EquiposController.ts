import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Equipo from 'App/Models/Equipo';
import Database from '@ioc:Adonis/Lucid/Database'
import Jugador from 'App/Models/Jugador';

export default class EquiposController 
{
  public async agregar({ request, response }: HttpContextContract) 
  {
    const validationSchema = schema.create
    ({
      nombre: schema.string([
        rules.required(),
        rules.minLength(3),
        rules.maxLength(35),
      ]),
      division: schema.number([
        rules.required(),
        rules.range(1, 3),
      ]),
      campeonatos: schema.number([
        rules.required(),
        rules.range(0, 20),
      ]),
      estado: schema.number([
        rules.required(),
        rules.range(1,32),
        rules.exists({ table: 'estados', column: 'id' })
      ]),
      propietario: schema.number([
        rules.required(),
        rules.range(1,32),
        rules.exists({ table: 'propietarios', column: 'id' })
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
        }
      );

      const { nombre,division,campeonatos,estado,propietario } = data;
      
      const equipo = new Equipo();
      equipo.nombre = nombre;
      equipo.division = division;
      equipo.campeonatos = campeonatos;
      equipo.estado = estado;
      equipo.propietario = propietario;
      await equipo.save();

      return response.status(201).json({ data: equipo })
    }

    catch(error) 
    {          
      response.badRequest({ message: error.messages });
    }
  }

  public async editar({ request, response, params }: HttpContextContract)
  {
    const validationSchema = schema.create
    ({
      nombre: schema.string([
        rules.required(),
        rules.minLength(3),
        rules.maxLength(35),
      ]),
      division: schema.number([
        rules.required(),
        rules.range(1, 3),
      ]),
      campeonatos: schema.number([
        rules.required(),
        rules.range(0, 20),
      ]),
      estado: schema.number([
        rules.required(),
        rules.range(1,32),
        rules.exists({ table: 'estados', column: 'id' })
      ]),
      propietario: schema.number([
        rules.required(),
        rules.range(1,32),
        rules.exists({ table: 'propietarios', column: 'id' })
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
        }
      );

      const equipo = await Equipo.findOrFail(params.id);
        
      if(equipo)
      {
        equipo.nombre = data.nombre;
        equipo.division = data.division;
        equipo.campeonatos = data.campeonatos;
        equipo.estado = data.estado;
        equipo.propietario = data.propietario;
        await equipo.save();
          
        return response.status(200).json({ data: equipo });
      }
      
      return response.notFound({ message: 'El equipo no existe.' });
    }
    
    catch (error) 
    {    
      response.badRequest({ message: error.messages });
    }
  }

  public async eliminar({ response, params }: HttpContextContract)
  {
    const equipo = await Equipo.find(params.id);

    if(equipo)
    {
      await equipo.delete();
      return response.ok({ message: 'El equipo ha sido eliminado correctamente.' });
    }

    return response.notFound({ message: 'El equipo no existe' });
  }

  public async mostrar({ response }: HttpContextContract)
  {
    const equipo = await Database
    .from('estados')
    .join('equipos', 'estados.id', '=', 'equipos.estado')
    .join('propietarios', 'propietarios.id', '=', 'equipos.propietario')
    .select('equipos.id', 'equipos.nombre', 'equipos.division', 'equipos.campeonatos', 'estados.nombre as estado', 'propietarios.nombre as propietario')
    .orderBy('equipos.id', 'asc')  

    if(equipo)
    {
      return equipo;
    }

    else
    {
      return response.notFound({ message: 'No hay equipos registrados.' });
    }
  }

  public async mostrarUnico({ response, params }: HttpContextContract)
  {
    const equipo = await Equipo.find(params.id);

    if(equipo)
    {
      return equipo;
    }

    else
    {
      return response.notFound({ message:'El equipo no existe.' });
    }
  }

  public async mostrarJugadoresCiertoEquipo({ response, params }: HttpContextContract)
  {
    const equipo = await Equipo.find(params.id);

    if(equipo)
    {
      const jugadores = await Database
      .from('equipos')
      .join('jugadors', 'equipos.id', '=', 'jugadors.equipo')
      .select('jugadors.id', 'jugadors.nombre', 'jugadors.ap_paterno ','jugadors.ap_materno','jugadors.sexo','jugadors.f_nac', 'equipos.nombre as equipo')
      .where('equipos.id', params.id)
      .orderBy('jugadors.id', 'asc')

      if(jugadores)
      {
        return jugadores;
      }

      else
      {
        return response.notFound({ message: 'El equipo no tiene jugadores.' });
      }
    }

    return response.notFound({ message: 'El equipo no existe.' });
  }

  public async cambiarEquipoJugadores({ response, request, params }: HttpContextContract)
  {
    const equipo = await Equipo.find(params.id);

    if(equipo)
    {
      const jugadores = request.input('jugadores');

      for (let i = 0; i < jugadores.length; i++) 
      {
        const jugador = jugadores[i];
        const player = await Jugador.find(jugador);
      
        if (player) 
        {
          player.equipo = params.id;
          await player.save();
        }
      }
      
      return response.ok({ message: 'El equipo ha sido cambiado correctamente.' });
    }

    return response.notFound({ message: 'El equipo no existe.' });
  }
}