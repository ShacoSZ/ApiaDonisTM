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
Route.get('/', async ({ view }) => {
  const html = await view.render('welcome', {
    greeting: 'Hello'
  })
  
  return html
})

Route.get('/ins/:id','verificarsController.telefono').as('verificarTelefono')
Route.post('/verificarcodigo/:id','verificarsController.codigo').as('codigo')

Route.get('/ValidarToken/:token/:rol',    'UsersController.ValidarToken')
Route.get('/ValidarRol/:token/:rol',      'UsersController.ValidarRol')
Route.get('/ValidarEliminar/:token/:rol', 'UsersController.ValidarEliminar')

//Usuarios--Logeo y registro
Route.group(() => {
  Route.post('/reg', 'UsersController.register').as('register') 
  Route.post('/in', 'UsersController.login').as('login')
  Route.post('/out', 'UsersController.logout').as('logout').middleware('auth')
})


Route.get('stream','IdiomasController.streamIngredientes')

Route.group(() => {
  Route.group(() => {
    Route.group(()=>{
      Route.get('Autor','AutoresController.readAutores')
      Route.get('Categoria','CategoriasController.readCategorias')
      Route.get('Editorial','EditorialesController.readEditoriales')
      Route.get('Idioma','IdiomasController.readIdiomas')
      Route.get('Libro','LibrosController.readLibros')
      Route.get('LibroDatos','LibrosController.datosLibro')
      Route.get('Lib/:id','LibrosController.libro').where('id', /^[0-9]+$/)
      Route.get('Libro_Idioma','LibroIdiomasController.readLibro_Idiomas')
      Route.get('Libro_Idioma/libro/:id','LibroIdiomasController.libro').where('id', /^[0-9]+$/)
      Route.get('/consultas/Usuarios', 'UsersController.Usuarios')
      Route.get('/cambiarR/:id',       'UsersController.cambiarRol')
      Route.get('/cambiarS/:id',       'UsersController.cambiarStatus')
      Route.get('/Roles',              'UsersController.roles')
      Route.get('/Roles/:id/:rol',     'UsersController.actualizarRoles')
      // Route.post('/out', 'Auth/LoginController.logout')
    }).middleware('rol:1,2,3')
    Route.group(()=>{
      Route.post('Autor','AutoresController.createAutores')
      Route.put('Autor/:id','AutoresController.updateAutores').where('id', /^[0-9]+$/)
      Route.post('Categoria','CategoriasController.createCategorias')
      Route.put('Categoria/:id','CategoriasController.updateCategorias').where('id', /^[0-9]+$/)
      Route.post('Editorial','EditorialesController.createEditoriales')
      Route.put('Editorial/:id','EditorialesController.updateEditoriales').where('id', /^[0-9]+$/)
      Route.post('Idioma','IdiomasController.createIdiomas')
      Route.put('Idioma/:id','IdiomasController.updateIdiomas').where('id', /^[0-9]+$/)
      Route.post('Libro','LibrosController.createLibros')
      Route.put('Libro/:id','LibrosController.updateLibros').where('id', /^[0-9]+$/)
      Route.post('Libro_Idioma','LibroIdiomasController.createLibro_Idiomas')
      Route.put('Libro_Idioma/:id','LibroIdiomasController.updateLibro_Idiomas').where('id', /^[0-9]+$/)
    }).middleware('rol:1,2')
    Route.group(()=>{
      Route.delete('Autor/:id','AutoresController.deleteAutores').where('id', /^[0-9]+$/)
      Route.delete('Categoria/:id','CategoriasController.deleteCategorias').where('id', /^[0-9]+$/)
      Route.delete('Editorial/:id','EditorialesController.deleteEditoriales').where('id', /^[0-9]+$/)
      Route.delete('Idioma/:id','IdiomasController.deleteIdiomas').where('id', /^[0-9]+$/)
      Route.delete('Libro/:id','LibrosController.deleteLibros').where('id', /^[0-9]+$/)
      Route.delete('Libro_Idioma/:id','LibroIdiomasController.deleteLibro_Idiomas').where('id', /^[0-9]+$/)
    }).middleware('rol:1')
  }).middleware(['status'])
}).middleware('auth')