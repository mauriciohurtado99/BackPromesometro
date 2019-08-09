'use strict'

var Encuesta = require('../models/encuesta'); 
var Candidato = require('../models/candidato');

function getEncuestas(req, res){
    Encuesta.find().populate('user').exec((err, encuestas)=>{
        if(err) return res.status(500).send({message: 'Error en las encuestas'})
        if(!encuestas) return res.status(400).send({message: 'Error al listar las encuestas'})

        return res.status(200).send({encuestas})
    })
}

function getEncuesta(req, res){
    var encuestaId = req.params.id;

    Encuesta.findById(encuestaId, (err, encuesta)=>{
        if(err) return res.status(500).send({message: 'Error en la encuesta'})
        if(!encuesta) return res.status(400).send({message: 'Error al listar la encuesta'})

        return res.status(200).send({encuesta})
    })
}

function addEncuesta(req, res){
    var encuesta = new Encuesta();
    var params = req.body;

    if(params.titulo && params.descripcion){
        encuesta.titulo = params.titulo;
        encuesta.descripcion = params.descripcion;
      
        encuesta.candidato = req.params.id;
        

        encuesta.save((err, encuestaGuardada)=>{
            if(err) return res.status(500).send({message: 'Error en la encuesta'})
            if(!encuestaGuardada) return res.status(500).send({message: 'Error al agregar la encuesta'})

            return res.status(200).send({encuesta: encuestaGuardada})
        })
    }else{
        res.status(200).send({
            message: 'Rellene los datos necesarios'
        })
    }
} 

function editarEnc(req, res) {
    var encuestaId = req.params.id;
    var params = req.body;

    Encuesta.findByIdAndUpdate(encuestaId, params, { new: true }, (err, encActualizado) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' })

        if (!encActualizado) return res.status(404).send({ message: 'No se a podido actualizar al usuario' })

        return res.status(200).send({ encuesta: encActualizado });
    }) 
} 
function deleteEnc(req,res){
    var encuestaId = req.params.id;
   

    Encuesta.findByIdAndDelete(encuestaId,(err,EncBorrado)=>{
        if(err) return res.status(200).send({message:'Error en la petición.'});
        if(! EncBorrado){
            return res.status(200).send({message:'El partido no se ha eliminado.'});
        }else{
            return res.status(200).send({EncBorrado});
        } 
    });
} 
function listarEncPorCandidato(req, res){
    let candidatoId = req.params.id 
    Encuesta.find({candidato: candidatoId}, (err, encuesta) =>{
        if (err) return res.status(500).send({ message: 'err' }) 
        if (!encuesta) return res.status(404).send({ message: 'no hay usuarios' })
        return res.status(200).send({ Encuesta: encuesta });
    })
}


module.exports = {
    getEncuesta,
    getEncuestas,
    addEncuesta,
    editarEnc,
    deleteEnc, 
    listarEncPorCandidato, 

}