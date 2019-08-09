'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CandidatoSchema = Schema({
    nombre: String,
    apellido: String,
    puesto: String,
    image: String,
    partido: {type: Schema.ObjectId, ref: 'Partido'}
});

module.exports = mongoose.model('Candidato', CandidatoSchema)