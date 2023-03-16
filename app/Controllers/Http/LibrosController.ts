// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { schema } from '@ioc:Adonis/Core/Validator'
import Libro from 'App/Models/Libro'

export default class LibrosController {
    public async createLibros({request})
    {
        
        await request.validate({
            schema: schema.create({
                nombre: schema.string(),
                ISBN: schema.number(),
                fecha_de_creacion: schema.date(),
                autor_id: schema.number(),
                categoria_id: schema.number(),
                editorial_id: schema.number(),
                paginas: schema.number(),
                descripcion: schema.string(),
            }),
            messages:{
                required: 'El campo {{ field }} es obligatorio'
            }
        })
        const libro = await Libro.create({
            nombre: request.body().nombre,
            ISBN: request.body().ISBN,
            fecha_de_creacion: request.body().fecha_de_creacion,
            autor_id: request.body().autor_id,
            categoria_id: request.body().categoria_id,
            editorial_id: request.body().editorial_id,
            paginas: request.body().paginas,
            descripcion: request.body().descripcion,
        })
        return libro
    }

    public async readLibros()
    {
        const libros = await Libro.all()
        return libros
    }

    public async updateLibros({params , request})
    {
        const libro = await Libro.find(params.id)
        if(libro)
        {
            await request.validate({
                schema: schema.create({
                    nombre: schema.string(),
                    ISBN: schema.number(),
                    fecha_de_creacion: schema.date(),
                    autor_id: schema.number(),
                    categoria_id: schema.number(),
                    editorial_id: schema.number(),
                    paginas: schema.number(),
                    descripcion: schema.string(),
                }),
                messages:{
                    required: 'El campo {{ field }} es obligatorio'
                }
            })
            libro.nombre = request.body().nombre,
            libro.ISBN = request.body().ISBN,
            libro.fecha_de_creacion = request.body().fecha_de_creacion,
            libro.autor_id = request.body().autor_id,
            libro.categoria_id = request.body().categoria_id,
            libro.editorial_id = request.body().editorial_id,
            libro.paginas = request.body().paginas,
            libro.descripcion = request.body().descripcion,
            libro.save()
            return libro
        }
        else
        {
            return {message:"Autor no encontrado"}
        }
    }
    
    public async deleteLibros({params})
    {
        const libro = await Libro.find(params.id)
        if(libro)
        {
            await libro.delete()
            return {message:"Categoria eliminado correctamente"}
        }
        else
        {
            return {message:"Categoria no encontrado"}
        }
    }

    public async datosLibro()
    {
        const libro = await Libro.query().select('libros.id','libros.nombre','libros.ISBN','libros.descripcion', 'libros.paginas', 'libros.fecha_de_creacion',
        'autores.nombre as autor_id', 'editoriales.nombre as editorial_id','categorias.categoria as categoria_id','autores.id as ai','categorias.id as ci','editoriales.id as ei')
        .from('libros')
        .join('autores','autores.id',"=",'libros.autor_id')
        .join('editoriales','editoriales.id',"=",'libros.editorial_id')
        .join('categorias','categorias.id',"=",'libros.categoria_id')
        return libro
    }

    public async libro({params}){
        const libro = await Libro.find(params.id)
        return libro
    }
}
