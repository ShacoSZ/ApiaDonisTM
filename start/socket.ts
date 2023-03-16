// import Autor from 'App/Models/Autor'
import Ws from 'App/Services/Ws'
Ws.boot()

/**
 * Listen for incoming socket connections
 */
Ws.io.on('connection', (socket) => {

  console.log(socket)

  Ws.io.on('autores',(autores)=>{
    console.log(autores)
  })

})
