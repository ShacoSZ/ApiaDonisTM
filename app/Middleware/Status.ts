import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Status {
  public async handle({ auth,response }: HttpContextContract, next: () => Promise<void>) {
    console.log(auth)
    const user = await auth.use('api').authenticate()
    console.log(user)
    if (user.status === 0) {
      return response.abort('Usuario Bloqueado', 401)
    }

    await next()
  }
}