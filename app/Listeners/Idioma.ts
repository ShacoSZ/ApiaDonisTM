import { EventsList } from '@ioc:Adonis/Core/Event'
import Env from '@ioc:Adonis/Core/Env'

export default class Idioma {
  public async onNewIdioma(idioma: EventsList['new:idioma']) {
    console.log('New consola created with id: ' + idioma.id)
    Env.set('EVENT_LISTENER', 'true')
  }
}