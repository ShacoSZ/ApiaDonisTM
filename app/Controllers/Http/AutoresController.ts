// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContext } from '@adonisjs/core/build/standalone'
import { schema } from '@ioc:Adonis/Core/Validator'
import Autor from "App/Models/Autor"
import Ws from 'App/Services/Ws'

export default class AutoresController {
    
    public async createAutores({request,response}:HttpContext)
    {
        
        await request.validate({
            schema: schema.create({
                nombre: schema.string()
            }),
            messages:{
                required: 'El campo {{ field }} es obligatorio'
            }
        })
        const autor = await Autor.create({
            nombre: request.body().nombre
        })
        Ws.io.emit('autores',autor)
        // const autores = await Autor.all()
        // return autores
        response.send(autor)
    }

    public async readAutor()
    {
        const autores = await Autor.all()
        return autores
    }

    public async readAutores({response}: HttpContext)
    {
        const autores = await Autor.all()
        console.log(autores)
        Ws.io.emit('autores',autores)
        // const autores = await Autor.all()
        // return autores
        response.send(autores)
    }

    public async updateAutores({params , request, response})
    {
        const autor = await Autor.find(params.id)
        if(autor)
        {
            await request.validate({
                schema: schema.create({
                    nombre: schema.string()
                }),
                messages:{
                    required: 'El campo {{ field }} es obligatorio'
                }
            })
            autor.nombre = request.body().nombre
            autor.save()
            return autor
        }
        else
        {
            return response.badRequest({
                'status': 400,
                'mensaje': 'Autor no encontrado',
                'error': [],
                'data': [],
            })
        }
    }
    
    public async deleteAutores({params})
    {
        const autor = await Autor.find(params.id)
        if(autor)
        {
            await autor.delete()
            return {message:"Autor eliminado correctamente"}
        }
        else
        {
            return {message:"Autor no encontrado"}
        }
    }
}
