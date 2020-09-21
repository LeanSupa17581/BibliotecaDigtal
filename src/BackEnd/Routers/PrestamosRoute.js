'use strict'

var express = require("express")
var PrestamosController = require("../Controller/PrestamosController")
var md_auth = require("../mindlewares/authenticated")

//Rutas
var api = express.Router();
api.post('/registrarPrestamoLibro', md_auth.ensureAuth, PrestamosController.registrarPrestamo)
api.post('/registrarPrestamoRevista', md_auth.ensureAuth, PrestamosController.registrarPrestamoRevista)
api.get('/devolucion/:id', md_auth.ensureAuth, PrestamosController.devolucion)
api.get('/prestamos', md_auth.ensureAuth, PrestamosController.listarPrestamos)
api.get('/getPrestamo/:id', md_auth.ensureAuth, PrestamosController.buscarPrestamo)

module.exports = api;