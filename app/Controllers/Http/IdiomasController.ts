// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Idioma from 'App/Models/Idioma'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import Env from '@ioc:Adonis/Core/Env'
import Event from '@ioc:Adonis/Core/Event'

export default class IdiomasController {
    public async createIdiomas({request,response}:HttpContextContract)
    {
        
        await request.validate({
            schema: schema.create({
                idioma: schema.string()
            }),
            messages:{
                required: 'El campo {{ field }} es obligatorio'
            }
        })
        var idioma = await Idioma.create({
            idioma: request.body().idioma
        })
        //Event.emit('new:idioma', idioma)
        Event.emit('new:ingrediente', idioma)

        return response.created({
            'status': 201,
            'mensaje': 'Los datos fueron almacenados correctamente.',
            'error': [],
            'data': idioma
          })
//        return idioma
    }

    public async readIdiomas()
    {
        const idiomas = await Idioma.all()
        return idiomas
    }

    public async updateIdiomas({params , request})
    {
        const idioma = await Idioma.find(params.id)
        if(idioma)
        {
            await request.validate({
                schema: schema.create({
                    idioma: schema.string()
                }),
                messages:{
                    required: 'El campo {{ field }} es obligatorio'
                }
            })
            idioma.idioma = request.body().idioma
            await idioma.save()
            Event.emit('update:ingrediente', idioma)
            return idioma
        }
        else
        {
            return {message:"Autor no encontrado"}
        }
    }
    
    public async deleteIdiomas({params})
    {
        const idioma = await Idioma.find(params.id)
        if(idioma)
        {
            await idioma.delete()
            Event.emit('delete:ingrediente', idioma)
            return {message:"Categoria eliminado correctamente"}
        }
        else
        {
            return {message:"Categoria no encontrado"}
        }
    }

    public async streamIngredientes({response}){
        const stream = response.response;
        stream.writeHead(200, 
            {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Access-Control-Allow-Origin': '*',
            })
        Event.on('new:ingrediente', (ingrediente) => {
        console.log(ingrediente)
        stream.write(`data: ${JSON.stringify("Se agrego un idioma")}\n\n`)
        });
        Event.on('update:ingrediente', (ingrediente) => {
        console.log(ingrediente)
        stream.write(`data: ${JSON.stringify("Se edito un idioma")}\n\n`)    }
        );
        Event.on('delete:ingrediente', (ingrediente) => {
        console.log(ingrediente)
        stream.write(`data: ${JSON.stringify("Se elimino un idioma")}\n\n`)
        }
        );
    }
}
