'use strict'

var jwt = require("jwt-simple")
var moment = require("moment")
var secret = 'hola_password'

exports.createToken = function(user){
    var payload={
        sub: user._id,
        nombre: user.nombre,
        usuario: user.usuario,
        iat: moment().unix(),
        exp: moment().day(30, 'days').unix()
    }

    return jwt.encode(payload, secret)
}