 import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
 import { schema, rules } from '@ioc:Adonis/Core/Validator'
    import Jugador from 'App/Models/Jugador';
export default class JugadoresController 
{
    public async agregar({ request, response }: HttpContextContract)
    {
        const validationSchema = schema.create({
            nombre: schema.string([
                rules.minLength(3),
                rules.maxLength(20),
                ]),
            ap_paterno: schema.string( [
                rules.minLength(3),
                rules.maxLength(20),
                ]),
            ap_materno: schema.string({}, [
                rules.required(),
                rules.minLength(3),
                rules.maxLength(20),
                ]),
                sexo: schema.string({}, [
                    rules.required(),
                    rules.minLength(1),
                    rules.maxLength(1),
                    rules.sexo(),
                    ]),
            f_nac: schema.date(),
            equipo_id: schema.number( [
                rules.required(),
                rules.range(1,32),
                rules.exists({ table: 'equipos', column: 'id' })
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
                    'ap_paterno.required': 'El apellido paterno es requerido',
                    'ap_paterno.string': 'El apellido paterno debe ser una cadena de caracteres',
                    'ap_paterno.minLength': 'El apellido paterno debe tener al menos 3 caracteres',
                    'ap_paterno.maxLength': 'El apellido paterno debe tener como máximo 35 caracteres',
                    'ap_materno.required': 'El apellido materno es requerido',
                    'ap_materno.string': 'El apellido materno debe ser una cadena de caracteres',
                    'ap_materno.minLength': 'El apellido materno debe tener al menos 3 caracteres',
                    'ap_materno.maxLength': 'El apellido materno debe tener como máximo 35 caracteres',
                    'sexo.required': 'El sexo es requerido',
                    'sexo.string': 'El sexo debe ser una cadena de caracteres',
                    'sexo.sexo': 'El sexo debe ser M o F',
                    'f_nac.required': 'La fecha de nacimiento es requerida',
                    'equipo_id.required': 'El equipo es requerido',
                    'equipo_id.range': 'El equipo debe estar entre 1 y 32',
                    'equipo_id.exists': 'El equipo no existe',
                },
            });

            const { nombre, ap_paterno, ap_materno, sexo, f_nac, equipo_id } = data
            const jugador = new Jugador();
            
            jugador.nombre = nombre
            jugador.ap_paterno = ap_paterno
            jugador.ap_materno = ap_materno
            jugador.sexo = sexo
            jugador.f_nac = f_nac
            jugador.equipo_id = equipo_id
            await jugador.save()
           return response.status(201).json({ data: jugador});

        }
        catch (error)
        {
            return response.status(400).json({ message: error.messages })
        }

    }

    public async editar({ request, response, params }: HttpContextContract)
    {
        const validationSchema = schema.create({
            nombre: schema.string({}, [
                rules.required(),
                rules.minLength(3),
                rules.maxLength(20),
                ]),
            ap_paterno: schema.string({}, [
                rules.required(),
                rules.minLength(3),
                rules.maxLength(35),
                ]),
            ap_materno: schema.string({}, [
                rules.required(),
                rules.minLength(3),
                rules.maxLength(35),
                ]),
            sexo: schema.string([
                rules.required(),
                rules.sexo(),
                rules.minLength(1),
                rules.maxLength(1),
                ]),
            f_nac: schema.date({}, [
                rules.required(),
                ]),
            equipo_id: schema.number( [
                rules.required(),
                rules.range(1,32),
                rules.exists({ table: 'equipos', column: 'id' })
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
                    'equipo_id.required': 'El equipo es requerido',
                    'equipo_id.range': 'El equipo debe estar entre 1 y 32',
                    'equipo_id.exists': 'El equipo no existe',
                },
            })
            const jugador = await Jugador.find(params.id)
            if (jugador) {
                jugador.nombre = data.nombre
                jugador.ap_paterno = data.ap_paterno
                jugador.ap_materno = data.ap_materno
                jugador.sexo = data.sexo
                jugador.f_nac = data.f_nac
                jugador.equipo_id = data.equipo_id
                await jugador.save()
                return response.status(200).json({ message: 'Jugador actualizado', data: jugador })
            }
            return response.status(404).json({ message: 'Jugador no encontrado' })
        } catch (error) {
            return response.status(400).json({ message: 'Error al actualizar el jugador', error: error.messages })
        }
    }


    public async eliminar({ response, params }: HttpContextContract)
    {
        const jugador = await Jugador.find(params.id)
        if (jugador) {
            await jugador.delete()
            return response.status(200).json({ message: 'Jugador eliminado' })
        }
        return response.status(404).json({ message: 'Jugador no encontrado' })

    }

    public mostrar({ response }: HttpContextContract)
    {
        const jugadores = Jugador.all()

        if (jugadores)
        {
            return jugadores;
        }
        else
        {
            return response.status(404).json({ message: 'No hay jugadores' })
        }
    }

    public async mostrarUnico({ response, params }: HttpContextContract)
    {
        const jugador = await Jugador.find(params.id)

        if (jugador)
        {
            return response.status(200).json({ data: jugador })
        }
        else
        {
            return response.status(404).json({ message: 'Jugador no encontrado' })
        }
    }



}
