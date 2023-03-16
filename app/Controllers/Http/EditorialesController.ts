// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { schema } from '@ioc:Adonis/Core/Validator'
import Editorial from 'App/Models/Editorial'

export default class EditorialesController {
    public async createEditoriales({request})
    {
        
        await request.validate({
            schema: schema.create({
                nombre: schema.string(),
                correo: schema.string(),
                direccion: schema.string(),
                telefono: schema.number()
            }),
            messages:{
                required: 'El campo {{ field }} es obligatorio'
            }
        })
        const editorial = await Editorial.create({
            nombre: request.body().nombre,
            correo: request.body().correo,
            direccion: request.body().direccion,
            telefono: request.body().telefono
        })
        return editorial
    }

    public async readEditoriales()
    {
        const Editoriales = await Editorial.all()
        return Editoriales
    }

    public async updateEditoriales({params , request})
    {
        const editorial = await Editorial.find(params.id)
        if(editorial)
        {
            await request.validate({
                schema: schema.create({
                    nombre: schema.string(),
                    correo: schema.string(),
                    direccion: schema.string(),
                    telefono: schema.number()
                }),
                messages:{
                    required: 'El campo {{ field }} es obligatorio'
                }
            })
            editorial.nombre = request.body().nombre,
            editorial.correo = request.body().correo,
            editorial.direccion = request.body().direccion,
            editorial.telefono = request.body().telefono
            editorial.save()
            return editorial
        }
        else
        {
            return {message:"Editorial no encontrado"}
        }
    }
    
    public async deleteEditoriales({params})
    {
        const editorial = await Editorial.find(params.id)
        if(editorial)
        {
            await editorial.delete()
            return {message:"Categoria eliminado correctamente"}
        }
        else
        {
            return {message:"Categoria no encontrado"}
        }
    }
}