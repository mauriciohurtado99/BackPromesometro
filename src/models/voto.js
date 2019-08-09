'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VotoSchema = Schema({
    encuesta: {type: Schema.ObjectId, ref: 'Encuesta'},
    usuario: {type: Schema.ObjectId, ref: "User"},
    voto: String
    });

module.exports = mongoose.model('Votos', VotoSchema);