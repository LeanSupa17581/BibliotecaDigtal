'use strict'

var bcrypt = require('bcrypt-nodejs')
var User = require('../Models/Usuarios')
var jwt  = require('../Services/jwt');

function registerAdmin(req, res){
    var usuarios = new User();
    User.find({nombre: 'admin', usuario: 'admin', rol: 'admin'}).exec((err, usuario)=>{
        if(err) return res.status(500).send({message: 'Error en la petición de Usuarios'})
        if(usuario && usuario.length >= 1){
            console.log('Ya existe')
        }else{
            usuarios.nombre = 'admin'
            usuarios.apellido = 'admin'
            usuarios.usuario = 'admin'
            usuarios.carnet_CUI = '0000000'
            usuarios.rol = 'admin'
            bcrypt.hash('admin', null, null, (err, hash)=>{
                usuarios.password = hash;

                usuarios.save((err, usuarioGuardado)=>{
                  if(err){
                        console.log('Error')
                      return res.status(500).send({message: 'Error al guadar el usuario'});
                  }
                  if(usuarioGuardado){
                      res.status(200).send({user: usuarioGuardado, message: 'Usuarios registrado exitosamente'})
                      console.log('Registrado')
                  }else{
                      res.status(404).send({message: 'No se ha podido registrar el usuario'})
                      console.log('No registrado')
                  }
                })
            })
        }
    })
}

function registrarUsuario(req,res){
    var usuario = new User();
    var params = req.body

        if(params.nombre && params.apellido && params.rol && params.password && params.usuario && params.carnet_CUI){
            usuario.carnet_CUI = params.carnet_CUI
            usuario.nombre = params.nombre
            usuario.apellido = params.apellido
            usuario.rol = params.rol
            usuario.usuario = params.usuario
    
            User.find({
                $or: [
                {usuario: usuario.usuario},
                {carnet_CUI: usuario.carnet_CUI}
            ]
            }).exec((err, usuarios)=>{
                if(err) return res.status(500).send({message: 'Error en la petición de Usuarios'})
                if(usuarios && usuarios.length >= 1){
                    return res.status(500).send({message: 'El Usuario ya existe'})
                }else{
                    bcrypt.hash(params.password, null, null, (err, hash)=>{
                        usuario.password = hash;
    
                        usuario.save((err, usuarioGuardado)=>{
                          if(err)  return res.status(500).send({message: 'Error al guadar el usuario'})
                          if(usuarioGuardado){
                              res.status(200).send({user: usuarioGuardado, message: 'Usuarios registrado exitosamente'})
                          }else{
                              res.status(404).send({message: 'No se ha podido registrar el usuario'})
                          }
                        })
                    })
                }
            })
        }else{
            res.status(200).send({message: 'Rellene todos los cambios necesarios'})
        }
    
}

function login(req, res){
    var params = req.body

    User.findOne({usuario: params.usuario}, (err, usuario)=>{
        if(err) return res.status(500).send({message: 'Error en la particion'})
        if(usuario)
        {
            bcrypt.compare(params.password, usuario.password, (err,check)=>{
                if(check)
                {
                    return res.status(200).send({
                        token: jwt.createToken(usuario), rol: usuario.rol
                    })
                }
                else
                {
                    return res.status(404).send({message: 'El usuario no se ha podido identificar'})
                }
            })
        }
        else
        {
            return res.status(404).send({message: 'El usuario no se ha podido logear'})
        }
    })
}

function editarUsuario(req, res){
    var usuarioId = req.params.id;
    var params = req.body;

    // borrar la propiedad del password
    delete params.password

    User.findByIdAndUpdate(usuarioId,params,{new: true}, (err, usuariosActualizado)=>{
        if(err) return res.status(500).send({message: 'Error en la particion'})
        if(!usuariosActualizado) return res.status(404).send({message: 'No se ha podido editar el usuario'})
        return res.status(200).send({user: usuariosActualizado, message: 'Usuario Actualizado Correctamente'})
    })

}

function eliminarUsuario(req, res){

    User.findByIdAndDelete(req.params.id, (err, usuariosEliminado)=>{
        if(err) return res.status(500).send({message: 'Error al eliminar'})
        if(usuariosEliminado)
        return res.status(200).send({message: 'Usuario eliminado exitosamente'})
    })
}

function listarUsuarios(req, res){
    User.find((err, usuarios)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})
        if(!usuarios) return res.status(200).send({message: 'No se pudieron listar los usuarios'})
        return res.status(200).send({usuarios: usuarios})
    })
}

function buscarUsuario(req, res){
    User.findById(req.params.id, (err, usuario)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})
        if(!usuario) return res.status(200).send({message: 'No se pudieron listar los usuarios'})
        return res.status(200).send({usuarios: usuario})
    })
}

module.exports = {
    registrarUsuario, login, editarUsuario, eliminarUsuario, listarUsuarios, buscarUsuario, registerAdmin
}