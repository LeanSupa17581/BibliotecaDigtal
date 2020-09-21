'use strict'

var mongoose = require("mongoose")
var app = require("./app")

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/DB_BibliotecaDigital2018295' , { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{ 
    console.log("Se encuentra conectado a la base de datos")

    app.set('port', process.env.PORT || 3000)
    app.listen(app.get('port'), ()=> {
        console.log(`El servidor esta corriendo en el puerto: ${app.get('port')} `);
    })
}).catch(err => console.log(err))