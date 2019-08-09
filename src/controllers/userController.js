'use strict'

var bcrypt = require("bcrypt-nodejs");
var User = require('../models/user');
var Voto = require('../models/voto');
var Partido = require('../models/partido');
var Candidato = require('../models/candidato');
var jwt = require('../services/jwt');
var path = require('path');
var fs = require('fs');

function registrar(req, res) {
    var user = new User();
    var params = req.body;

    if (params.nombre && params.nick && params.email && params.password) {
        user.nombre = params.nombre;
        user.apellido = params.apellido;
        user.nick = params.nick;
        user.email = params.email;
        user.password = params.password;
        user.rol = 'ROL_USER';
        user.image = null;

        User.find({
            $or: [
                { email: user.email.toLowerCase() },
                { nick: user.nick.toLowerCase() }
            ]
        }).exec((err, users) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' })

            if (users && users.length >= 1) {
                return res.status(500).send({ message: 'El usuario ya existe' })
            } else {
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    user.password = hash;

                    user.save((err, userGuardado) => {
                        if (err) return res.status(500).send({ message: 'Error a la hora de guardar el usuario' })

                        if (userGuardado) {
                            res.status(200).send({ user: userGuardado })
                        } else {
                            res.status(404).send({ message: 'No se ha podido registrar al usuario' })
                        }
                    })
                })
            }
        })
    } else {
        res.status(200).send({
            message: 'Rellene los datos necesarios'
        })
    }
}
 
function createAdmin(){
    var usuario = new User();
    User.findOne({email:'chino'},(err,adminFound)=>{
        if(err) false;
        if(!adminFound){
            usuario.nombre ='chino';
            usuario.apellido='chino';
            usuario.nick='chino';
            usuario.email='chino'
            usuario.password='123';
            usuario.rol='admin';
           
            
            bcrypt.hash(usuario.password,null,null,(err,hash)=>{
                usuario.password = hash;
                usuario.save((err,userStored)=>{
                    if(err) return false;
                    if(userStored) return false;
                    else return true
                })
            });
        }
    })
}
//--------------- Partido-----------------------------------------------------------//
function registrarPartido(req, res) {
    var partido = new Partido();
    var params = req.body;

    if (params.nombre) {
        partido.nombre = params.nombre; 
        partido.descripcion = params.descripcion;

        Partido.find({
            $or: [
                { nombre: partido.nombre }
            ]
        }).exec((err, partidos) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' })

            if (partidos && partidos.length >= 1) {
                return res.status(500).send({ message: 'El partido ya existe' })
            } else {
                partido.save((err, partidoGuardado) => {
                    if (err) return res.status(500).send({ message: 'Error a la hora de guardar el partido' })
                    if (partidoGuardado) return res.status(200).send({partido: partidoGuardado})
                    else return res.status(404).send({ message: 'No se a podido registrar el partido' })
                    
                })
            }
        })
    } else {
        res.status(200).send({
            message: 'Rellene los datos necesarios'
        })
    }
}
 
function editarPartido(req, res) {
    var partidoId = req.params.id;
    var params = req.body;
    Partido.findByIdAndUpdate(partidoId , params, {new:true},(err, partidoActualizado)=>{
        if(err) return res.status(500).send({message: 'error en la peticion'});

        if(!partidoActualizado) return res.status(404).send({message: 'no se a podido actualizar al usuario'});

        return res.status(200).send({partido: partidoActualizado});
    })
} 

function eleminarPartido(req,res){
    var partidoId = req.params.id;
    var params = req.body;
    Partido.findByIdAndDelete(partidoId, params,(err, partidoEliminado)=>{
        if(err) return res.status(500).send({message: 'error en la peticion'}) 
        if(!partidoEliminado) return res.status(404).send({message: 'no se apodido actuliazar el sistema'}) 
        return res.status(200).send({message: 'alumno Eliminada'}); 
    }) 
}

function getPartido(req, res) {
    var partidoId = req.params.id;
    Partido.findById(partidoId, (err, partido)=>{
        if(err) return res.status(500).send({message: 'error en la peticion'}) 
        if(!partido) return res.status(404).send({message: 'no se apodido eoncontrar en el sistema'}) 
        return res.status(200).send({partido: partido}); 
    })
}

function getPartidos( req, res){
    Partido.find((err, partido)=>{
        if(err) return res.status(500).send({message: 'erro en el contacto'})
        if(!partido) return res.status(400).send({message: 'error al listar el contacto'}) 
        return res.status(200).send({partido})
    })
}
//----------------------- candidato---------------------------------------
function registrarCandidato(req, res){
    var candidato = new Candidato();
    var params = req.body;

    if(params.nombre && params.apellido && params.puesto){
        candidato.nombre = params.nombre;
        candidato.apellido = params.apellido;
        candidato.puesto = params.puesto;
        candidato.partido = req.params.id;

        Candidato.find({$or:[
            {nombre: candidato.nombre},
            {apellido: candidato.apellido}
        ]}).exec((err, candidatos)=>{
            if(err) return res.status(500).send({message: 'Error en la peticion'})
            if(candidatos && candidatos.length >= 1){
                return res.status(500).send({message: 'El candidato ya existe'})
            }else{
                candidato.save((err, candidatoGuardado)=>{
                    if(err) return res.status(500).send({message: 'Error a la hora de guardar al candidato'})
                    if(candidatoGuardado) return res.status(200).send({candidato: candidatoGuardado})
                    else return res.status(404).send({message: 'No se ha podido registrar al candidato'})
                });
            }
        })
    }else{
        res.status(200).send({
            message: 'Rellene los datos necesarios'
        })
    }
}
 

function editarCandidato(req, res) {
    var candidatoId = req.params.id;
    var params = req.body;
    Candidato.findByIdAndUpdate(candidatoId , params, {new:true},(err, candidatoActualizado)=>{
        if(err) return res.status(500).send({message: 'error en la peticion'});

        if(!candidatoActualizado) return res.status(404).send({message: 'no se a podido actualizar al usuario'});

        return res.status(200).send({candidato: candidatoActualizado});
    })
} 

function eleminarCandidato(req,res){
    var candidatoId = req.params.id;
    var params = req.body;
    Candidato.findByIdAndDelete(candidatoId, params,(err, candidatoEliminado)=>{
        if(err) return res.status(500).send({message: 'error en la peticion'}) 
        if(!candidatoEliminado) return res.status(404).send({message: 'no se apodido actuliazar el sistema'}) 
        return res.status(200).send({message: 'alumno Eliminada'}); 
    }) 
}

function getCandidato(req, res) {
    var candidatoId = req.params.id;
    Candidato.findById(candidatoId, (err, candidato)=>{
        if(err) return res.status(500).send({message: 'error en la peticion'}) 
        if(!candidato) return res.status(404).send({message: 'no se apodido eoncontrar en el sistema'}) 
        return res.status(200).send({candidato: candidato}); 
    })
}

function getCandidatos( req, res){
    Candidato.find((err, candidato)=>{
        if(err) return res.status(500).send({message: 'erro en el contacto'})
        if(!candidato) return res.status(400).send({message: 'error al listar el contacto'}) 
        return res.status(200).send({candidato})
    })
}
 
function listarCandidatosPorPartido(req, res){
    let partidoId = req.params.id 
    Candidato.find({partido: partidoId}, (err, candidato) =>{
        if (err) return res.status(500).send({ message: 'err' }) 
        if (!candidato) return res.status(404).send({ message: 'no hay usuarios' })
        return res.status(200).send({ Candidato: candidato });
    })
}
//------------------------- Login--------------------------------------------
function login(req, res) {
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({ email: email }, (err, user) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' })

        if (user) {
            bcrypt.compare(password, user.password, (err, check) => {
                if (check) {
                    if (params.gettoken) {
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        });
                    } else {
                        user.password = undefined;
                        return res.status(200).send({ user })
                    }
                } else {
                    return res.status(404).send({ message: 'El ususario no a podido identificarse' })
                }
            })
        } else {
            return res.status(404).send({ message: 'El usuario no a podido logearse' })
        }
    })
}





function subirImagenPartido(req, res) {
    var partidoId = req.params.id;

    if (req.files) {
        var file_path = req.files.image.path;
        console.log(file_path);

        var file_split = file_path.split('\\');
        console.log(file_split);

        var file_name = file_split[3];
        console.log(file_name);

        var ext_xplit = file_name.split('\.');
        console.log(ext_xplit);

        var file_ext = ext_xplit[1];
        console.log(file_ext);

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            Partido.findByIdAndUpdate(partidoId, { image: file_name }, { new: true }, (err, partidoActualizado) => {
                if (err) return res.status(500).send({ message: 'Error en la peticion' })

                if (!partidoActualizado) return res.status(404).send({ message: 'no se a podido actualizar el usuario' })

                return res.status(200).send({ partido: partidoActualizado })
            })
        } else {
            return removeFilerOfUploads(res, file_path, 'Extension no valida')
        }
    }
}

function removeFilerOfUploads(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        return res.status(200).send({ message: message })
    })
}

function getImageFile(req, res) {
    var image_file = req.params.imageFile;
    var path_file = './src/uploads/partidos/' + image_file;

    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'no existe la imagen' })
        }
    })
}
 

//---- Imagen Candidato -------
function subirImagenCandidato(req, res) {
    var candidatoId = req.params.id;

    if (req.files) {
        var file_path = req.files.image.path;
        console.log(file_path);

        var file_split = file_path.split('\\');
        console.log(file_split);

        var file_name = file_split[3];
        console.log(file_name);

        var ext_xplit = file_name.split('\.');
        console.log(ext_xplit);

        var file_ext = ext_xplit[1];
        console.log(file_ext);

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            Candidato.findByIdAndUpdate(candidatoId, { image: file_name }, { new: true }, (err, candidatoActualizado) => {
                if (err) return res.status(500).send({ message: 'Error en la peticion' })

                if (!candidatoActualizado) return res.status(404).send({ message: 'no se a podido actualizar el usuario' })

                return res.status(200).send({ candidato: candidatoActualizado })
            })
        } else {
            return removeFilerOfUploads(res, file_path, 'Extension no valida')
        }
    }
}
 

function getImageFileC(req, res) {
    var image_file = req.params.imageFile;
    var path_file = './src/uploads/candidatos/' + image_file;

    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'no existe la imagen' })
        }
    })
}

function editarUsuario(req, res) {
    var userId = req.params.id;
    var params = req.body;

    delete params.password;

    if (userId != req.user.sub) {
        return res.status(500).send({ message: 'No tiene los permisos para editar este usuario' })
    }

    User.findByIdAndUpdate(userId, params, { new: true }, (err, usuarioActualizado) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' })

        if (!usuarioActualizado) return res.status(404).send({ message: 'No se a podido actualizar al usuario' })

        return res.status(200).send({ user: usuarioActualizado });
    })
}

//-----------------------------------------Votacion----------------------------------------

function votar(req, res){
    var encuestaId = req.params.id;
    var voto = req.body;

    Voto.findOne({$and: [{Encuesta: encuestaId}, {usuario: voto.usuario}]}, (err, votofind) =>{
        if(err){
            res.status(200).send({message: 'Error al votar.'});
        }else{
            if(!votofind){
                var avoto = new Voto();
                avoto.encuesta = voto.encuesta;
                avoto.usuario = voto.usuario; 
                avoto.voto = voto.voto;

                avoto.save((err, votoStored) =>{
                    if(err){
                        res.status(200).send({message: 'Error al intentar guardar el voto.'});
                    }else{
                        if(!votoStored){
                            res.status(200).send({message: 'No se guardó el voto.'});
                        }else{
                            res.status(200).send({votoStored});
                        }
                    }
                })
            }else{
                res.status(200).send({message: 'No puedes volver a votar, ya votaste anteriormente.'})
            }
        }
    })
}

function ObtainResults(req, res){
    var encuestaId = req.params.id;

    Voto.find({$and: [{encuesta: encuestaId},{voto: 'favor'}]},(err, countFavor) => {
        if(err){
            console.log(err)
            res.status(200).send({message: 'Error al obtener los resultados.'});
        }else{
            if(countFavor){
                Voto.find({$and: [{encuesta: encuestaId}, {voto: 'contra'}]}, (err, countContra) => {
                    res.status(200).send({favor: countFavor.length, contra: countContra.length})
                })
            }
        }
    })
}

module.exports = {
    registrar,
    registrarPartido, 
    editarPartido,
    eleminarPartido,
    getPartido,
    getPartidos,
    registrarCandidato, 
    editarCandidato,
    eleminarCandidato,
    getCandidato,
    listarCandidatosPorPartido,
    login,
   
    subirImagenPartido, 
    subirImagenCandidato,
    getImageFile, 
    getImageFileC,
    getCandidatos,
    editarUsuario,
    createAdmin,
    votar,
    ObtainResults 

}