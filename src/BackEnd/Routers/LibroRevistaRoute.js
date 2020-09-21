'use strict'

var express = require("express")
var LibrosRevistasController = require("../Controller/LibrosRevistasController")
var md_auth = require("../mindlewares/authenticated")
var multer = require('../libs/multer')

//Rutas
var api = express.Router();
api.post('/addLibro',multer.single('image'), LibrosRevistasController.registrarLibro)
api.post('/editLibro/:id',multer.single('image'), LibrosRevistasController.editarLibro)
api.post('/addRevista',multer.single('image'), LibrosRevistasController.registrarRevista)
api.post('/editRevista/:id',multer.single('image'), LibrosRevistasController.editarRevista)
api.get('/libros', LibrosRevistasController.listarLibros)
api.get('/getLibro/:id', LibrosRevistasController.buscarLibro)
api.get('/revistas', LibrosRevistasController.listarRevistas)
api.get('/getRevista/:id', LibrosRevistasController.buscarRevista)
api.delete('/deleteLibro/:id', LibrosRevistasController.eliminarLibro)
api.delete('/deleteRevista/:id', LibrosRevistasController.eliminarRevista)
api.get('/obtenerImagen/:imagen', LibrosRevistasController.obtenerImagen)
api.get('/obtenerPalabras/:id', LibrosRevistasController.listarPalabrasClave)
api.post('/addPalabraClaveLibro/:id', LibrosRevistasController.agregarPalabraClave)
api.post('/deletePalabra/:id', LibrosRevistasController.eliminarPalabraClave)
api.post('/editPalabra/:id', LibrosRevistasController.editarPalabraClave)
api.get('/obtenerTemas/:id', LibrosRevistasController.listarTemas)
api.post('/addTemasLibro/:id', LibrosRevistasController.agregarTemas)
api.post('/deleteTema/:id', LibrosRevistasController.eliminarTemas)
api.post('/editTema/:id', LibrosRevistasController.editarTemas)
api.get('/obtenerPalabrasRevista/:id', LibrosRevistasController.listarPalabrasClaveRevista)
api.post('/addPalabraClaveRevista/:id', LibrosRevistasController.agregarPalabraClaveRevista)
api.post('/deletePalabraRevista/:id', LibrosRevistasController.eliminarPalabraClaveRevista)
api.post('/editPalabraRevista/:id', LibrosRevistasController.editarPalabraClaveRevista)
api.get('/obtenerTemasRevista/:id', LibrosRevistasController.listarTemasRevista)
api.post('/addTemasRevista/:id', LibrosRevistasController.agregarTemasRevista)
api.post('/deleteTemaRevista/:id', LibrosRevistasController.eliminarTemasRevista)
api.post('/editTemaRevista/:id', LibrosRevistasController.editarTemasRevista)
api.post('/addCopias/:id', LibrosRevistasController.addCopias)
api.post('/addCopiasRevista/:id', LibrosRevistasController.addCopiasRevista)
api.post('/buscarLibroTitulo', LibrosRevistasController.buscarLibroTitulo)
api.post('/buscarLibroPalabra', LibrosRevistasController.buscarLibroPalabra)
api.post('/buscarLibroTema', LibrosRevistasController.buscarLibroTema)
api.post('/buscarRevistaTitulo', LibrosRevistasController.buscarRevistaTitulo)
api.post('/buscarRevistaPalabra', LibrosRevistasController.buscarRevistaPalabra)
api.post('/buscarRevistaTema', LibrosRevistasController.buscarRevistaTema)
api.get('/busquedaRevista', LibrosRevistasController.busquedaRevista)
api.get('/librosMasPrestados', LibrosRevistasController.librosMasPrestados)
api.get('/librosMasBuscados', LibrosRevistasController.librosMasBuscados)
api.get('/librosMenosPrestados', LibrosRevistasController.librosMenosPrestados)
api.get('/librosMenosBuscados', LibrosRevistasController.librosMenosBuscados)
api.get('/revistasMasPrestadas', LibrosRevistasController.revistasMasPrestados)
api.get('/revistasMasBuscadas', LibrosRevistasController.revistasMasBuscados)
api.get('/revistasMenosPrestadas', LibrosRevistasController.revistasMenosPrestados)
api.get('/revistasMenosBuscadas', LibrosRevistasController.revistasMenosBuscados)

module.exports = api;