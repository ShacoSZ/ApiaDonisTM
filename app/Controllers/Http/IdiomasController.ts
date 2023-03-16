// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Idioma from 'App/Models/Idioma'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import Event from '@ioc:Adonis/Core/Event'
// import { Readable } from 'stream';

export default class IdiomasController {
    public async createIdiomas({request})
    {
        
        await request.validate({
            schema: schema.create({
                idioma: schema.string()
            }),
            messages:{
                required: 'El campo {{ field }} es obligatorio'
            }
        })
        const idioma = await Idioma.create({
            idioma: request.body().idioma
        })
        //Event.emit('new:idioma', idioma)
        return idioma
    }

    public async readIdiomas()
    {
        const idiomas = await Idioma.all()
        return idiomas
    }

    public async eventos({response}:HttpContextContract)
    {
        response.header('Content-Type','text/event-stream');
        response.header('Cache-Control','no-cache');
        response.header('Connection','keep-alive');

        const idiomas = await Idioma.all()

        response.send(`event: notice\ndata: ${JSON.stringify(idiomas)}\n\n`)
    }

    // public async stream({ response }) {
    //     const streamA = new Readable();
    //     streamA._read = () => {};
    //     const idiomas = await Idioma.all();
    //     const data = {
    //         message: 'Nuevos datos disponibles',
    //         idiomas
    //     };
    //     streamA.push(`data: ${JSON.stringify(data)}\n\n`);
    //     // setInterval(sendEvent, 5000);
    //     // response.on('close', () => {
    //     //   clearInterval(intervalId);
    //     //   stream.destroy();
    //     // });
    //     // response.writeHead(200, {
    //     //   'Content-Type': 'text/event-stream',
    //     //   'Cache-Control': 'no-cache',
    //     //   'Connection': 'keep-alive'
    //     // });
    //     streamA.pipe(response);
    // }

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
            idioma.save()
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
            return {message:"Categoria eliminado correctamente"}
        }
        else
        {
            return {message:"Categoria no encontrado"}
        }
    }
}
