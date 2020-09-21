'use strict'

//VARIABLES GLOBALES
var express = require("express")
var app = express()
var bodyParser = require("body-parser")
var corse = require("cors")
var path = require("path")

app.use(corse())

//CARGAR RUTAS
var usuario_routes = require("./Routers/UsuarioRoute")
var librosRevistas_routes = require("./Routers/LibroRevistaRoute")
var prestamos_routes = require("./Routers/PrestamosRoute")
const multer = require("multer")

//MIDDLE
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//CABECERAS
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authoruzation, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE')

    next();
})

//RUTAS
app.use('/api', usuario_routes)
app.use('/api', librosRevistas_routes)
app.use('/api', prestamos_routes)

//UPLOADS
//app.use('uploads', express.static(path.resolve('uploads')));

//EXPORTAR 
module.exports = app;