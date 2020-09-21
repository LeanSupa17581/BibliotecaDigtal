'use strict'

var express = require("express")
var UsuarioController = require("../Controller/UsuarioController")
var md_auth = require("../mindlewares/authenticated")


//Rutas
var api = express.Router();
api.post('/register', UsuarioController.registrarUsuario)
api.post('/login', UsuarioController.login)
api.get('/usuarios', UsuarioController.listarUsuarios)
api.get('/getUsuario/:id', UsuarioController.buscarUsuario)
api.post('/editUsuario/:id', UsuarioController.editarUsuario)
api.delete('/deleteUsuario/:id', UsuarioController.eliminarUsuario)
api.get('/addAdmin', UsuarioController.registerAdmin)

module.exports = api;