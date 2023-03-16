// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { schema } from '@ioc:Adonis/Core/Validator'
import LibroIdioma from 'App/Models/LibroIdioma'

export default class LibroIdiomasController {
    public async createLibro_Idiomas({request})
    {
        
        await request.validate({
            schema: schema.create({
                libro_id: schema.number(),
                idioma_id: schema.number(),
            }),
            messages:{
                required: 'El campo {{ field }} es obligatorio'
            }
        })
        const libroIdioma = await LibroIdioma.create({
            libro_id: request.body().libro_id,
            idioma_id: request.body().idioma_id,
        })
        return libroIdioma
    }

    public async readLibro_Idiomas()
    {
        const Libro_Idiomas = await LibroIdioma.all()
        return Libro_Idiomas
    }

    public async updateLibro_Idiomas({params , request})
    {
        const libroIdioma = await LibroIdioma.find(params.id)
        if(libroIdioma)
        {
            await request.validate({
                schema: schema.create({
                    libro_id: schema.number(),
                    idioma_id: schema.number(),
                }),
                messages:{
                    required: 'El campo {{ field }} es obligatorio'
                }
            })
            libroIdioma.libro_id = request.body().libro_id,
            libroIdioma.idioma_id = request.body().idioma_id,
            libroIdioma.save()
            return libroIdioma
        }
        else
        {
            return {message:"libroIdioma no encontrado"}
        }
    }
    
    public async deleteLibro_Idiomas({params})
    {
        const libroIdioma = await LibroIdioma.find(params.id)
        if(libroIdioma)
        {
            await libroIdioma.delete()
            return {message:"Conexion eliminado correctamente"}
        }
        else
        {
            return {message:"Conexion no encontrado"}
        }
    }

    public async libro({params})
    {
        const libross = await LibroIdioma.query()
        .select('libro_idiomas.id','libros.nombre','libros.id as libro_id','idiomas.id as idioma_id','idiomas.idioma')
        .from('libro_idiomas')
        .leftJoin('libros','libros.id','=','libro_idiomas.libro_id')
        .leftJoin('idiomas','idiomas.id','=','libro_idiomas.idioma_id')
        .where('libros.id','=',params.id)

        return libross
    }
}