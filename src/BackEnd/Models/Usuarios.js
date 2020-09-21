'use strict'

var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
    carnet_CUI: String,
    usuario: String,
    nombre: String,
    apellido: String,
    rol: String,
    password: String
})

module.exports = mongoose.model("usuario", UsuarioSchema);