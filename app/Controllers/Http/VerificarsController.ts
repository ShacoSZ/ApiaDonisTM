// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Mail from '@ioc:Adonis/Addons/Mail';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema } from '@ioc:Adonis/Core/Validator'
import View from '@ioc:Adonis/Core/View';


export default class VerificarsController {
  public async telefono({params}: HttpContextContract) 
  {
    const code = Math.floor(Math.random() * 9999);
    const user = await User.find(params.id)
    if(user)
    {
    try {
      user.verificationCode = code
      await user.save()

      const accountSid = 'ACf63b989af81a71902cf5f6837438e15b';
      const authToken = 'adca546b451f160ecaf26af54d9c6856';
      const client = require('twilio')(accountSid, authToken);
      
      client.messages
          .create({
              body: 'su codigo es: ' + code + ' Inserte su codigo en la pantalla de "Verificacion de codigo"',
              from: '+19856024418',
              to: '+528714423397'
          })
//          .then(message => console.log(message.sid))
//          .done();
          

          await Mail.sendLater((messagesao) => {
            messagesao
            .from('alejandrosalazarcom25@gmail.com')
            .to(user.email)
            .subject('Verifica Tu Cuenta!')
            .htmlView('emails/segundo', {})
          })

          return View.render('emails/segundo')
    
    } catch (error) {
      return{message:error} 
    }
   }
   else
   {
    return {message:"Usuario no encontrado"}
   }
  }

  public async codigo({params,request}: HttpContextContract) 
  {
    console.log(request.all())
    console.log(params.id)
    const user = await User.find(params.id)
    console.log(user)
    if(request.hasValidSignature())
    {
        if(user)
        {
          await request.validate({
            schema: schema.create({
                Code: schema.number(),
            }),
            messages:{
                required: 'El campo {{ field }} es obligatorio',
            }
        })
          const codeDB = user.verificationCode
          const codeRQ = request.input('Code')
          if(codeDB == codeRQ)
          {
            user.status = 1
            await user.save()
            return {message:"Codigo correcto"}
          }
        }
        else
        {
          return {message:"Autor no encontrado"}
        }
      }
  }
}
