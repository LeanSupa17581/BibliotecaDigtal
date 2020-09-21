'use strict'

var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var LibroSchema = Schema({
    autor: String,
    titulo: String,
    edicion: String,
    palabrasClave: [{
        palabra: String
    }],
    descripcion: String,
    temas: [{
        tema: String
    }],
    copias: Number,
    disponibles: Number,
    imagen: String,
    busqueda: Number,
    prestamo: Number
})

module.exports = mongoose.model("libro", LibroSchema);