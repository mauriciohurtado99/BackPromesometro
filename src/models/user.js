'use strict'

var mongooose = require("mongoose");
var Schema = mongooose.Schema;

var UserSchema = Schema({
    nombre: String,
    apellido: String,
    nick: String,
    email: String,
    password: String,
    rol: String,
    image: String
});

module.exports = mongooose.model('User', UserSchema);