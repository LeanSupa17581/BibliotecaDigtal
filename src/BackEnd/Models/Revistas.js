'use strict'

var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var RevistaSchema = Schema({
    autor: String,
    titulo: String,
    edicion: String,
    descripcion: String,
    frecuencia: String,
    ejemplar: String,
    temas: [{
        tema: String
    }],
    palabrasClave: [{
        palabra: String
    }],
    copias: Number,
    disponibles: Number,
    imagen: String,
    busqueda: Number,
    prestamo: Number
})

module.exports = mongoose.model("revista", RevistaSchema);