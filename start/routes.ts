/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

//probar
import Route from '@ioc:Adonis/Core/Route'
Route.get('/', async () => {
  return { hello: 'Mexico' }
})

//Usuarios--Logeo y registro
Route.group(() => {
  Route.post('/register', 'UsersController.register').as('register') 
  Route.post('/login', 'UsersController.login').as('login')
  Route.post('/logout', 'UsersController.logout').as('logout').middleware('auth')
})
.prefix('/usuarios')

//Auth
Route.group(() => {
  Route.get('/enviarCodigo', 'AuthController.enviarCodigo').as('enviarCodigo')
  Route.post('/verificarCodigo', 'AuthController.verificarCodigo').as('verificarCodigo')
  Route.post('/reenviarCodigo', 'AuthController.reenviarCodigo').as('reenviarCodigo')

  Route.post('verificarToken', 'AuthController.verificarToken').as('verificarToken')
}).prefix('/auth')


//Funciones administrativas 
Route.group(() => {
  Route.get('/', 'UsersController.mostrarUsuarios').as('admin.mostrarUsuarios')
  Route.put('/rol/:id', 'UsersController.cambiarRol').as('admin.cambiarRol')
  Route.put('status/:id', 'UsersController.cambiarStatus').as('admin.cambiarStatus')
  Route.delete('/eliminar/:id', 'UsersController.eliminarUsuario').as('admin.eliminarUsuario')
})
.prefix('/admin').middleware('auth')


//Funciones de usuario y administrador


//Partidos
Route.group(() => {
  Route.get('/', 'PartidosController.mostrar')
  Route.post('/', 'PartidosController.agregar')
  Route.put('/:id', 'PartidosController.editar')
  Route.delete('/:id', 'PartidosController.eliminar')
  Route.get('/:id', 'PartidosController.mostrarUnico')
})
.prefix('/partidos')


//Jugadores
Route.group(() => {
  Route.get('/', 'JugadoresController.mostrar')
  Route.post('/', 'JugadoresController.agregar')
  Route.put('/:id', 'JugadoresController.editar')
  Route.delete('/:id', 'JugadoresController.eliminar')
  Route.get('/:id', 'JugadoresController.mostrarUnico')
})
.prefix('/jugadores')


//Equipos
Route.group(() => {
Route.get('/', 'EquiposController.mostrar')
Route.post('/', 'EquiposController.agregar')
Route.put('/:id', 'EquiposController.editar')
Route.delete('/:id', 'EquiposController.eliminar')
Route.get('/:id', 'EquiposController.mostrarUnico')
})
.prefix('/equipos')


//Propietarios
Route.group(() => {
  Route.get('/', 'PropietariosController.mostrar')
  Route.post('/', 'PropietariosController.agregar')
  Route.put('/:id', 'PropietariosController.editar')
  Route.delete('/:id', 'PropietariosController.eliminar')
  Route.get('/:id', 'PropietariosController.mostrarUnico')
})
.prefix('/propietarios')

//Estados
Route.group(() => {
    Route.get('/', 'EstadosController.mostrar')
    Route.post('/', 'EstadosController.agregar')
    Route.put('/:id', 'EstadosController.editar')
    Route.delete('/:id', 'EstadosController.eliminar')
    Route.get('/:id', 'EstadosController.mostrarUnico')
  })
.prefix('/estados')