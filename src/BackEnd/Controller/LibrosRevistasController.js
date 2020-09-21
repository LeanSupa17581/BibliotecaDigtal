'use strict'

var Libro = require('../Models/Libros')
var Revista = require('../Models/Revistas')
var path = require('path')
var fs = require('fs')

function registrarLibro(req,res){
    var libro = new Libro();
    var params = req.body
    console.log(req.file)

    if(params.autor && params.titulo && params.edicion && params.descripcion && params.copias && params.palabra && params.tema && req.file){
        libro.autor = params.autor
        libro.titulo = params.titulo
        libro.edicion = params.edicion
        libro.descripcion = params.descripcion
        libro.copias = params.copias
        libro.disponibles = params.copias
        libro.prestamo = 0
        libro.busqueda = 0
        libro.imagen = req.file.filename
        console.log(libro)
        console.log(req.file.path)
        Libro.find({autor: params.autor, titulo: params.titulo}).exec((err, libros)=>{
            if(err) return res.status(500).send({message: 'Error en la petición de Libros'})
            if(libros && libros.length >= 1){
                return res.status(500).send({message: 'El libro ya existe'})
            }else{
                libro.save((err, libroGuardado)=>{
                    if(err)  return res.status(500).send({message: 'Error al guadar el libro'})
                    if(libroGuardado){
                        var palabrasSplit = params.palabra.split(',');
                        var temaSplit = params.tema.split(',');
                        console.log(palabrasSplit.length)
                        console.log(temaSplit.length)
                        for (let index = 0; index < palabrasSplit.length; index++) {
                            Libro.findByIdAndUpdate(libroGuardado._id, {$push:{palabrasClave:{palabra: palabrasSplit[index]}}}, (err, palabraAdd)=>{
                                console.log(libroGuardado._id)
                                console.log(palabrasSplit[index])
                            })
                            
                        }
                        for (let index = 0; index < temaSplit.length; index++) {
                            Libro.findByIdAndUpdate(libroGuardado._id, {$push:{temas:{tema: temaSplit[index]}}}, (err, temaAdd)=>{
                                console.log(temaSplit[index])
                            })
                            
                        }
                        return res.status(200).send({message: 'Libro registrado exitosamente'})
                    }else{
                        res.status(404).send({message: 'No se ha podido registrar el libro'})
                    }
                })
            }
        })
    }else{
        res.status(200).send({message: 'Rellene todos los datos necesarios'})
    }
}

function addPalabra(id, palabra){
    Libro.findByIdAndUpdate(id, {$push:{palabrasClave:{palabra: palabra}}}, (err, palabraNueva))
}

function addTema(id, tema){
    Libro.findByIdAndUpdate(id, {$push:{temas:{tema: tema}}})
}

function editarLibro(req, res){
    var libro = new Libro();
    var libroId = req.params.id;
    var params = req.body;
    Libro.findById(libroId, (err, libroImagen)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion de imagen'})
        if(!libroImagen) return res.status(404).send({message: 'No se encontro libro'})
        if(req.file){
            params.imagen = req.file.filename
        }else{
            params.imagen = libroImagen.imagen
        }
        console.log(libroImagen.imagen)
        console.log(params.imagen)
        Libro.findByIdAndUpdate(libroId,params,{new: true}, (err, libroActualizado)=>{
            if(err) return res.status(500).send({message: 'Error en la particion'})
            if(!libroActualizado) return res.status(404).send({message: 'No se ha podido editar el libro'})
            return res.status(200).send({libro: libroActualizado, message: 'Libro actualizaco correctamente'})
        })
    })
}

function eliminarLibro(req, res){
    var libroId = req.params.id;
    var path_file = '';

    Libro.findByIdAndDelete(libroId, (err, libroEliminado)=>{
        if(err) return res.status(500).send({message: 'Error al eliminar'})
        if(!libroEliminado) return res.status(404).send({message: 'No se pudo eliminar el libro'})
        return res.status(200).send({libro: libroEliminado, message: 'Libro eliminado con exito'})
    })
}

function addCopias(req, res){
    var libroId = req.params.id;
    var params = req.body;
    Libro.findByIdAndUpdate(libroId,{$inc:{copias: params.copias, disponibles: params.copias}},{new: true}, (err, libroActualizado)=>{
        if(err) return res.status(500).send({message: 'Error en la particion'})
        if(!libroActualizado) return res.status(404).send({message: 'No se ha podido editar el libro'})
        return res.status(200).send({libro: libroActualizado, message: 'Copias actualizadas correctamente'})
    })
}

function removeImage(imagePath){
    var path_file = `src/uploads/${imagePath}`;
    fs.unlink(path_file);
}

function listarPalabrasClave(req, res){
    Libro.findById(req.params.id, (err, libro)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})
        if(!libro) return res.status(200).send({message: 'No se pudieron listar los libros'})
        return res.status(200).send({palabras: libro.palabrasClave})
    })
}

function agregarPalabraClave(req, res){
    console.log(req.body.palabra)
    var palabrasSplit = req.body.palabra.split(',');
    for (let index = 0; index < palabrasSplit.length; index++) {
        Libro.findByIdAndUpdate(req.params.id, {$push:{palabrasClave:{palabra: palabrasSplit[index]}}}, {new: true}, (err, palabraActualizada)=>{
            
        })
    }
    return res.status(200).send({message: 'Palabra Clave agregada con exito'})
}

function eliminarPalabraClave(req, res){
    Libro.findOneAndUpdate({_id: req.params.id, "palabrasClave._id": req.body.idPalabra}, {$pull:{"palabrasClave": {_id: req.body.idPalabra}}}, {new: true}, (err, palabraEliminada)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})
        if(!palabraEliminada) return res.status(200).send({message: 'No se pudo eliminar la palabra clave'})
        return res.status(200).send({palabras: palabraEliminada})
    })
}

function editarPalabraClave(req, res){
    Libro.findOneAndUpdate({_id: req.params.id, "palabrasClave._id": req.body.idPalabra}, {'palabrasClave.$.palabra': req.body.palabra}, {new: true}, (err, palabraActualizada)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})
        if(!palabraActualizada) return res.status(200).send({message: 'No se pudo editar la palabra clave'})
        return res.status(200).send({palabras: palabraActualizada})
    })
}

function listarTemas(req, res){
    Libro.findById(req.params.id, (err, libro)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})
        if(!libro) return res.status(200).send({message: 'No se pudieron listar los libros'})
        return res.status(200).send({temas: libro.temas})
    })
}

function agregarTemas(req, res){
    console.log(req.body.tema)
    var temaSplit = req.body.tema.split(',');
    for (let index = 0; index < temaSplit.length; index++) {
        Libro.findByIdAndUpdate(req.params.id, {$push:{temas:{tema: temaSplit[index]}}}, {new: true}, (err,temaActualizado)=>{
            
            
        })
    }
    return res.status(200).send({message: 'Tema agregado con exito'})
}

function eliminarTemas(req, res){
    Libro.findOneAndUpdate({_id: req.params.id, "temas._id": req.body.idTema}, {$pull:{"temas": {_id: req.body.idTema}}}, {new: true}, (err, temaEliminado)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})
        if(!temaEliminado) return res.status(200).send({message: 'No se pudo eliminar el tema'})
        return res.status(200).send({temas: temaEliminado})
    })
}

function editarTemas(req, res){
    Libro.findOneAndUpdate({_id: req.params.id, "temas._id": req.body.idTema}, {'temas.$.tema': req.body.tema}, {new: true}, (err, temaActualizado)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})
        if(!temaActualizado) return res.status(200).send({message: 'No se pudo editar el tema'})
        return res.status(200).send({temas: temaActualizado})
    })
}

function listarLibros(req, res){
    Libro.find((err, libros)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})
        if(!libros) return res.status(404).send({message: 'No se pudieron listar los libros'})
        return res.status(200).send({libros: libros})
    })
}

function obtenerImagen(req, res){
    var nombreImagen = req.params.imagen;
    var path_file = `./src/uploads/${nombreImagen}`
    fs.exists(path_file, (exists)=>{
        if(exists){
            return res.sendFile(path.resolve(path_file))
        }else{
            return res.status(404).send({message: 'No se pudieron obtener la imagen'})
        }
    })
}

function buscarLibro(req, res){
    Libro.findById(req.params.id, (err, libro)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})
        if(!libro) return res.status(200).send({message: 'No se pudieron listar los libros'})
        return res.status(200).send({libros: libro})
    })
}

function buscarLibroTitulo(req, res){
    Libro.find({titulo: req.body.titulo}, (err, libros)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})
        if(!libros) return res.status(200).send({message: 'No se pudieron listar los libros'})
        Libro.updateMany({titulo: req.body.titulo}, {$inc:{busqueda: 1}}, (err, edit)=>{
            if(err) return res.status(500).send({message: 'Error en la peticion de editar'})
            if(!edit) return res.status(200).send({message: 'No se pudieron editar los libros'})
            return res.status(200).send({libros: libros})
        })
    })
}

function buscarLibroPalabra(req, res){
    Libro.find({"palabrasClave.palabra": req.body.palabra}, (err, libros)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})
        if(!libros) return res.status(200).send({message: 'No se pudieron listar los libros'})
        Libro.updateMany({"palabrasClave.palabra": req.body.palabra}, {$inc:{busqueda: 1}}, (err, edit)=>{
            if(err) return res.status(500).send({message: 'Error en la peticion de editar'})
            if(!edit) return res.status(200).send({message: 'No se pudieron editar los libros'})
            return res.status(200).send({libros: libros})
        })
    })
}

function buscarLibroTema(req, res){
    Libro.find({"temas.tema": req.body.tema}, (err, libros)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})
        if(!libros) return res.status(200).send({message: 'No se pudieron listar los libros'})
        Libro.updateMany({"temas.tema": req.body.tema}, {$inc:{busqueda: 1}}, (err, edit)=>{
            if(err) return res.status(500).send({message: 'Error en la peticion de editar'})
            if(!edit) return res.status(200).send({message: 'No se pudieron editar los libros'})
            return res.status(200).send({libros: libros})
        })
    })
}

function librosMasPrestados(req,res){
    Libro.find().sort({prestamo: -1}).limit(5).exec((err, libros)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})
        if(!libros) return res.status(404).send({message: 'Nos  encontraton libros'})
        return res.status(200).send({libros: libros})
    })
}

function librosMasBuscados(req,res){
    Libro.find().sort({busqueda: -1}).limit(5).exec((err, libros)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})
        if(!libros) return res.status(404).send({message: 'Nos  encontraton libros'})
        return res.status(200).send({libros: libros})
    })
}

function librosMenosPrestados(req,res){
    Libro.find().sort({prestamo: 1}).limit(5).exec((err, libros)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})
        if(!libros) return res.status(404).send({message: 'Nos  encontraton libros'})
        return res.status(200).send({libros: libros})
    })
}

function librosMenosBuscados(req,res){
    Libro.find().sort({busqueda: 1}).limit(5).exec((err, libros)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})
        if(!libros) return res.status(404).send({message: 'Nos  encontraton libros'})
        return res.status(200).send({libros: libros})
    })
}

function registrarRevista(req,res){
    var revista = new Revista();
    var params = req.body

    if(params.autor && params.titulo && params.edicion && params.descripcion && params.copias && params.frecuencia && params.ejemplar && params.palabra && params.tema && req.file){
        revista.autor = params.autor
        revista.titulo = params.titulo
        revista.edicion = params.edicion
        revista.descripcion = params.descripcion
        revista.copias = params.copias
        revista.disponibles = params.copias
        revista.frecuencia = params.frecuencia
        revista.ejemplar = params.ejemplar
        revista.imagen = req.file.filename
        revista.prestamo = 0
        revista.busqueda = 0
        Revista.find({autor: params.autor, titulo: params.titulo}).exec((err, revistas)=>{
            if(err) return res.status(500).send({message: 'Error en la petición de Revista'})
            if(revistas && revistas.length >= 1){
                return res.status(500).send({message: 'La revista ya existe'})
            }else{
                revista.save((err, revistaGuardada)=>{
                    if(err)  return res.status(500).send({message: 'Error al guadar la revista'})
                    if(revistaGuardada){
                        var palabraSplit =params.palabra.split(',')
                        for (let index = 0; index < palabraSplit.length; index++) {
                            Revista.findByIdAndUpdate(revistaGuardada._id, {$push:{palabrasClave:{palabra: palabraSplit[index]}}}, {new: true}, (err, palabraActualizada)=>{
                                
                            })
                        }
                        var temaSplit = params.tema.split(',')
                        for (let index = 0; index < temaSplit.length; index++) {
                            Revista.findByIdAndUpdate(revistaGuardada._id, {$push:{temas:{tema: temaSplit[index]}}}, {new: true}, (err,temaActualizado)=>{
                                
                            })
                        }
                        return res.status(200).send({message: 'Revista agregada correctamente'})
                    }else{
                        res.status(404).send({message: 'No se ha podido registrar la revista'})
                    }
                })
            }
        })
    }else{
        res.status(200).send({message: 'Rellene todos los datos necesarios'})
    }
}

function editarRevista(req, res){
    var revistalId = req.params.id;
    var params = req.body;
    Revista.findById(revistalId, (err, revistaImagen)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion de imagen'})
        if(!revistaImagen) return res.status(404).send({message: 'No se encontro revista'})
        if(req.file){
            params.imagen = req.file.filename
        }else{
            params.imagen = revistaImagen.imagen
        }
        console.log(revistaImagen.imagen)
        console.log(params.imagen)
        Revista.findByIdAndUpdate(revistalId,params,{new: true}, (err, revistaActualizada)=>{
            if(err) return res.status(500).send({message: 'Error en la particion'})
            if(!revistaActualizada) return res.status(404).send({message: 'No se ha podido editar la revista'})
            return res.status(200).send({revista: revistaActualizada, message: 'Revista actualizada correctamente'})
        })
    })
}

function eliminarRevista(req, res){
    var revistaId = req.params.id;

    Revista.findByIdAndDelete(revistaId, (err, revistaEliminado)=>{
        if(err) return res.status(500).send({message: 'Error al eliminar'})
        if(!revistaEliminado) return res.status(404).send({message: 'No se pudo eliminar la revista'})
        return res.status(200).send({revista: revistaEliminado, message: 'Revista elimanada correctamente'})
    })
}

function listarRevistas(req, res){
    Revista.find((err, revistas)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})
        if(!revistas) return res.status(200).send({message: 'No se pudieron listar las revistas'})
        return res.status(200).send({revistas: revistas})
    })
}

function buscarRevista(req, res){
    Revista.findById(req.params.id, (err, revista)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})
        if(!revista) return res.status(200).send({message: 'No se pudieron listar la revista'})
        return res.status(200).send({revistas: revista})
    })
}

function addCopiasRevista(req, res){
    var revistaId = req.params.id;
    var params = req.body;
    Revista.findByIdAndUpdate(revistaId,{$inc:{copias: params.copias, disponibles: params.copias}},{new: true}, (err, libroActualizado)=>{
        if(err) return res.status(500).send({message: 'Error en la particion'})
        if(!libroActualizado) return res.status(404).send({message: 'No se ha podido editar el libro'})
        return res.status(200).send({libro: libroActualizado, message: 'Copias actualizadas correctamente'})
    })
}

function listarPalabrasClaveRevista(req, res){
    Revista.findById(req.params.id, (err, revista)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})
        if(!revista) return res.status(200).send({message: 'No se pudieron listar las revistas'})
        return res.status(200).send({palabras: revista.palabrasClave})
    })
}

function agregarPalabraClaveRevista(req, res){
    console.log(req.body.palabra)
    var palabraSplit = req.body.palabra.split(',')
    for (let index = 0; index < palabraSplit.length; index++) {
        Revista.findByIdAndUpdate(req.params.id, {$push:{palabrasClave:{palabra: palabraSplit[index]}}}, {new: true}, (err, palabraActualizada)=>{
            
        })
    }
    return res.status(200).send({message: 'Palabra Clave agregada correctamente'})
}

function eliminarPalabraClaveRevista(req, res){
    Revista.findOneAndUpdate({_id: req.params.id, "palabrasClave._id": req.body.idPalabra}, {$pull:{"palabrasClave": {_id: req.body.idPalabra}}}, {new: true}, (err, palabraEliminada)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})
        if(!palabraEliminada) return res.status(200).send({message: 'No se pudo eliminar la palabra clave'})
        return res.status(200).send({palabras: palabraEliminada})
    })
}

function editarPalabraClaveRevista(req, res){
    Revista.findOneAndUpdate({_id: req.params.id, "palabrasClave._id": req.body.idPalabra}, {'palabrasClave.$.palabra': req.body.palabra}, {new: true}, (err, palabraActualizada)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})
        if(!palabraActualizada) return res.status(200).send({message: 'No se pudo editar la palabra clave'})
        return res.status(200).send({palabras: palabraActualizada})
    })
}

function listarTemasRevista(req, res){
    Revista.findById(req.params.id, (err, libro)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})
        if(!libro) return res.status(200).send({message: 'No se pudieron listar los libros'})
        return res.status(200).send({temas: libro.temas})
    })
}

function agregarTemasRevista(req, res){
    console.log(req.body.tema)
    var temaSplit = req.body.tema.split(',')
    for (let index = 0; index < temaSplit.length; index++) {
        Revista.findByIdAndUpdate(req.params.id, {$push:{temas:{tema: temaSplit[index]}}}, {new: true}, (err,temaActualizado)=>{
            
        })
    }
    return res.status(200).send({message: 'Tema agregado correctamente'})
}

function eliminarTemasRevista(req, res){
    Revista.findOneAndUpdate({_id: req.params.id, "temas._id": req.body.idTema}, {$pull:{"temas": {_id: req.body.idTema}}}, {new: true}, (err, temaEliminado)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})
        if(!temaEliminado) return res.status(200).send({message: 'No se pudo eliminar el tema'})
        return res.status(200).send({temas: temaEliminado})
    })
}

function editarTemasRevista(req, res){
    Revista.findOneAndUpdate({_id: req.params.id, "temas._id": req.body.idTema}, {'temas.$.tema': req.body.tema}, {new: true}, (err, temaActualizado)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})
        if(!temaActualizado) return res.status(200).send({message: 'No se pudo editar el tema'})
        return res.status(200).send({temas: temaActualizado})
    })
}

function busquedaRevista(req, res){
    var busqueda = req.body.busqueda;
    Revista.find({titulo: busqueda}, (err, titulos)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})
        if(!titulos) return res.status(200).send({message: 'No se pudieron listar las titulos'})
        console.log(titulos)
    }).populate({path: 'palabrasClave', match: {palabra: busqueda}}).exec((err, revistas)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})
        if(!revistas) return res.status(200).send({message: 'No se pudieron listar las revistas'})
        return res.status(200).send({revistas: revistas})
    })

    /*try{
        var revistasFind = Revista.aggregate([
            {$match:{titulo: busqueda}},
            {$unwind: '$palabrasClave'},
            {$match: {'palabrasClave.palabra': busqueda}},
            {$unwind: '$temas'},
            {$match: {'temas.tema': busqueda}},
            {$group: {_id: '$_id', revistas: {$push: {titulo: '$titulo', autor: '$autor', imagen: '$imagen'}}}}
        ]).exec()
        console.log(revistasFind)
        return res.status(200).send({revistas: revistasFind})
    }catch(err){
        console.log(err)
        return res.status(404).send({message: 'Se produjo un error'})
    }*/
    
        /*Revista.updateMany({$or:[
            {titulo: req.body.busqueda},
            {'palbrasClave.palabra': req.body.busqueda},
            {'temas.tema': req.body.busqueda}
        ]}, {$inc:{busqueda: 1}}).exec((err, edit)=>{
            if(err) return res.status(500).send({message: 'Error en la peticion del edit'})
            if(!edit) return res.status(200).send({message: 'No se pudieron editar las revistas'})*/
            
        //})
}

function buscarRevistaTitulo(req, res){
    Revista.find({titulo: req.body.titulo}, (err, revistas)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})
        if(!revistas) return res.status(200).send({message: 'No se pudieron listar las revistas'})
        Revista.updateMany({titulo: req.body.titulo}, {$inc:{busqueda: 1}}, (err, edit)=>{
            if(err) return res.status(500).send({message: 'Error en la peticion'})
            if(!edit) return res.status(200).send({message: 'No se pudieron editart las revistas'})
            return res.status(200).send({revistas: revistas})
        })
    })
}

function buscarRevistaPalabra(req, res){
    Revista.find({"palabrasClave.palabra": req.body.palabra}, (err, revistas)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})
        if(!revistas) return res.status(200).send({message: 'No se pudieron listar las revistas'})
        Revista.updateMany({"palabrasClave.palabra": req.body.palabra}, {$inc:{busqueda: 1}}, (err, edit)=>{
            if(err) return res.status(500).send({message: 'Error en la peticion'})
            if(!edit) return res.status(200).send({message: 'No se pudieron editart las revistas'})
            return res.status(200).send({revistas: revistas})
        })
    })
}

function buscarRevistaTema(req, res){
    Revista.find({"temas.tema": req.body.tema}, (err, revistas)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})
        if(!revistas) return res.status(200).send({message: 'No se pudieron listar las revistas'})
        Revista.updateMany({"temas.tema": req.body.tema}, {$inc:{busqueda: 1}}, (err, edit)=>{
            if(err) return res.status(500).send({message: 'Error en la peticion'})
            if(!edit) return res.status(200).send({message: 'No se pudieron editart las revistas'})
            return res.status(200).send({revistas: revistas})
        })
    })
}

function revistasMasPrestados(req,res){
    Revista.find().sort({prestamo: -1}).limit(5).exec((err, libros)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})
        if(!libros) return res.status(404).send({message: 'Nos  encontraton libros'})
        return res.status(200).send({libros: libros})
    })
}

function revistasMasBuscados(req,res){
    Revista.find().sort({busqueda: -1}).limit(5).exec((err, libros)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})
        if(!libros) return res.status(404).send({message: 'Nos  encontraton libros'})
        return res.status(200).send({libros: libros})
    })
}

function revistasMenosPrestados(req,res){
    Revista.find().sort({prestamo: 1}).limit(5).exec((err, libros)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})
        if(!libros) return res.status(404).send({message: 'Nos  encontraton libros'})
        return res.status(200).send({libros: libros})
    })
}

function revistasMenosBuscados(req,res){
    Revista.find().sort({busqueda: 1}).limit(5).exec((err, libros)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})
        if(!libros) return res.status(404).send({message: 'Nos  encontraton libros'})
        return res.status(200).send({libros: libros})
    })
}


module.exports = {
    registrarLibro, editarLibro, eliminarLibro, registrarRevista, editarRevista, eliminarRevista, listarLibros, buscarLibro, listarRevistas, buscarRevista, obtenerImagen, listarPalabrasClave
    ,agregarPalabraClave, eliminarPalabraClave, editarPalabraClave, listarTemas, agregarTemas, eliminarTemas, editarTemas, listarPalabrasClaveRevista, agregarPalabraClaveRevista
    ,eliminarPalabraClaveRevista, editarPalabraClaveRevista, listarTemasRevista, agregarTemasRevista, eliminarTemasRevista, editarTemasRevista, addCopias, addCopiasRevista,
    buscarLibroTitulo, buscarLibroPalabra, buscarLibroTema, buscarRevistaTitulo, buscarRevistaPalabra, buscarRevistaTema, busquedaRevista, librosMasPrestados, librosMasBuscados
    ,librosMenosPrestados, librosMenosBuscados, revistasMasPrestados, revistasMasBuscados, revistasMenosPrestados, revistasMenosBuscados
}