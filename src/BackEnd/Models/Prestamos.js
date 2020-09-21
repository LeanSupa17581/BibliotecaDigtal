'use strict'

var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var PrestamoSchema = Schema({
    fechaPrestamo: Date,
    libroP: Boolean,
    revistaP: Boolean,
    libro: {type: Schema.ObjectId, ref: 'libros'},
    revista: {type: Schema.ObjectId, ref: 'revistas'},
    devolucion: Boolean,
    fechaDevolucion: Date,
    usuario: {type: Schema.ObjectId, ref: 'usuarios'}
})

module.exports = mongoose.model("prestamos", PrestamoSchema);