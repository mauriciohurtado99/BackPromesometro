'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var EncuestaSchema = Schema({
    titulo: String,
    descripcion: String,
    
    candidato: {type: Schema.ObjectId, ref: 'Candidato'}
});

module.exports = mongoose.model('Encuesta', EncuestaSchema)