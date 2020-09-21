'use strcit'

var Libro = require('../Models/Libros')
var Revista = require('../Models/Revistas')
var Prestamo = require('../Models/Prestamos')

function registrarPrestamo(req,res){
    var prestamo = new Prestamo();
    var params = req.body

    Prestamo.find({usuario: req.user.sub}, (err, prestamos)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion de prestamo'})
        if(!prestamos) return res.status(404).send({message: 'No se encontro prestamos'})
        if(prestamos && prestamos.length < 10){
            if(params.libroId && req.user){
                prestamo.fechaPrestamo = Date.now()
                prestamo.libroP = true
                prestamo.revistaP = false
                prestamo.devolucion = false
                prestamo.usuario = req.user.sub
                Libro.findById(params.libroId, (err, libroEncontrado)=>{
                    if(err) return res.status(500).send({message: 'Error en la peticion de Libros'})
                    if(!libroEncontrado) return res.status(404).send({message: 'No se encontro el libro'})
                    if(libroEncontrado.disponibles >= 1){
                        prestamo.libro = libroEncontrado._id
                        prestamo.save((err, addPrestamo)=>{
                            if(err) return res.status(500).send({message: 'Error en la peticion a prestamos'})
                            if(!addPrestamo) return res.status(404).send({message: 'No se puedo realizar el prestamo'})
                            Libro.findOneAndUpdate({_id: params.libroId}, {$inc:{disponibles: -1, prestamo: 1}}, {new: true}, (err, libroActualizado)=>{
                                if(err) return res.status(500).send({message: 'Error en la peticion al actualizar libro'})
                                if(!libroActualizado) return res.status(404).send({message: 'No se pudo actualizar libro'})
                                return res.status(200).send({prestamo: addPrestamo, message: 'Prestamo realizado exitosamente'})
                            })
                        })
                    }else{
                        return res.status(200).send({message: 'No hay libros disponibles en este momento'})
                    }
                })
        
            }else{
                return res.status(500).send({message: 'No se tiene todos los datos necesaios'})
            }
        }else{
            return res.status(500).send({message: 'El usuarios ya llego a su limite de 10 prestamos'})
        }
    })
}

function registrarPrestamoRevista(req, res){
    var prestamo = new Prestamo();
    var params = req.body

    Prestamo.find({usuario: req.user.sub}, (err, prestamos)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion de prestamo'})
        if(!prestamos) return res.status(404).send({message: 'No se encontro prestamos'})
        if(prestamos && prestamos.length < 10){
            if(params.revistaId && req.user){
                prestamo.fechaPrestamo = Date.now()
                prestamo.libroP = false
                prestamo.revistaP = true
                prestamo.devolucion = false
                prestamo.usuario = req.user.sub
                Revista.findById(params.revistaId, (err, revistaEncontrada)=>{
                    if(err) return res.status(500).send({message: 'Error en la peticion de Revistas'})
                    if(!revistaEncontrada) return res.status(404).send({message: 'No se encontro la Revista'})
                    if(revistaEncontrada.disponibles >= 1){
                        prestamo.revista = revistaEncontrada._id
                        prestamo.save((err, addPrestamo)=>{
                            if(err) return res.status(500).send({message: 'Error en la peticion a prestamos'})
                            if(!addPrestamo) return res.status(404).send({message: 'No se puedo realizar el prestamo'})
                            Revista.findOneAndUpdate({_id: params.revistaId}, {$inc:{disponibles: -1, prestamo: 1}}, {new: true}, (err, revataActualizada)=>{
                                if(err) return res.status(500).send({message: 'Error en la peticion al actualizar revista'})
                                if(!revataActualizada) return res.status(404).send({message: 'No se pudo actualizar revista'})
                                return res.status(200).send({prestamo: addPrestamo, message: 'Prestamo realizado exitosamente'})
                            })
                        })
                    }else{
                        return res.status(200).send({message: 'No hay revistas disponibles en este momento'})
                    }
                })
        
            }else{
                return res.status(500).send({message: 'No se tiene todos los datos necesaios'})
            }
        }else{
            return res.status(500).send({message: 'El usuarios ya llego a su limite de 10 prestamos'})
        }
    })
}

function devolucion(req, res){
    prestamosId = req.params.id;
    Prestamo.findOneAndUpdate({_id: prestamosId, usuario: req.user.sub}, {devolucion: true, fechaDevolucion: Date.now()}, {new: true}, (err, devolucionRealizada)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion de devolucion'})
        if(!devolucionRealizada) return res.status(404).send({message: 'No se pudo realizar la devolucion'})
        if(devolucionRealizada.libroP){
            Libro.findOneAndUpdate({_id: devolucionRealizada.libro}, {$inc:{disponibles: 1}}, {new: true}, (err, libroActualizado)=>{
                if(err) return res.status(500).send({message: 'Error en la peticion al actualizar libro'})
                if(!libroActualizado) return res.status(404).send({message: 'No se pudo actualizar libro'})
                return res.status(200).send({devolucion: devolucionRealizada, message: 'Devolución realizada exitosamente'})
            })
        }else if(devolucionRealizada.revistaP){
            Revista.findOneAndUpdate({_id: devolucionRealizada.revista}, {$inc:{disponibles: 1}}, {new: true}, (err, revataActualizada)=>{
                if(err) return res.status(500).send({message: 'Error en la peticion al actualizar revista'})
                if(!revataActualizada) return res.status(404).send({message: 'No se pudo actualizar revista'})
                return res.status(200).send({devolucion: devolucionRealizada, message: 'Devolución realizada exitosamente'})
            })
        }
    })
}

function listarPrestamos(req, res){
    console.log(req.user.sub)
    Prestamo.find({devolucion: false, usuario: req.user.sub}, (err, prestamos)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion al listar prestamos'})
        if(!prestamos) return res.status(404).send({message: 'No se pudo listar prestamos'})
        console.log(prestamos)
        Libro.populate(prestamos, {path: 'libro'}, (err, librosPrestamos)=>{
            if(err) return res.status(500).send({message: 'Error en la peticion al listar libros'})
            if(!librosPrestamos) return res.status(404).send({message: 'No se pudo listar libros'})
            console.log(librosPrestamos)
            Revista.populate(librosPrestamos, {path: 'revista'}, (err, revistaPrestamo)=>{
                if(err) return res.status(500).send({message: 'Error en la peticion al listar revistas'})
                if(!revistaPrestamo) return res.status(404).send({message: 'No se pudo listar revistas'})
                console.log(revistaPrestamo)
                return res.status(200).send({prestamos: revistaPrestamo })
            })
        })
    })
}

function buscarPrestamo(req, res){
    Prestamo.findById(req.params.id, (err, prestamo)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion al buscar Prestamo'})
        if(!prestamo) return res.status(404).send({message: 'No se pudo encontrar Prestamo'})
        console.log(prestamo)
        return res.status(200).send({prestamos: prestamo})
    })
}

module.exports = {
    registrarPrestamo, registrarPrestamoRevista, devolucion, listarPrestamos, buscarPrestamo
}