// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { schema } from '@ioc:Adonis/Core/Validator'
import Categoria from 'App/Models/Categoria'

export default class CategoriasController {
    public async createCategorias({request})
    {
        
        await request.validate({
            schema: schema.create({
                categoria: schema.string()
            }),
            messages:{
                required: 'El campo {{ field }} es obligatorio'
            }
        })
        const autor = await Categoria.create({
            categoria: request.body().categoria
        })
        return autor
    }

    public async readCategorias()
    {
        const categorias = await Categoria.all()
        return categorias
    }

    public async updateCategorias({params , request})
    {
        const autor = await Categoria.find(params.id)
        if(autor)
        {
            await request.validate({
                schema: schema.create({
                    categoria: schema.string()
                }),
                messages:{
                    required: 'El campo {{ field }} es obligatorio'
                }
            })
            autor.categoria = request.body().categoria
            autor.save()
            return autor
        }
        else
        {
            return {message:"Autor no encontrado"}
        }
    }
    
    public async deleteCategorias({params})
    {
        const autor = await Categoria.find(params.id)
        if(autor)
        {
            await autor.delete()
            return {message:"Categoria eliminado correctamente"}
        }
        else
        {
            return {message:"Categoria no encontrado"}
        }
    }
}
