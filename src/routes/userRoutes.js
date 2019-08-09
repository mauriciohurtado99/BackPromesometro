'use strict'

var express = require("express");
var UserController = require("../controllers/userController");
var md_auth = require('../middleware/authenticated');

var multiparty = require('connect-multiparty');
var md_subir = multiparty({uploadDir: './src/uploads/partidos'}); 
var md_subir1 = multiparty({uploadDir: './src/uploads/candidatos'})

var api = express.Router();
api.post('/registrar', UserController.registrar);
api.post('/registrar-partido', md_auth.ensureAuth, UserController.registrarPartido); 
api.post('/registrar-candidato/:id', md_auth.ensureAuth, UserController.registrarCandidato );
api.post('/login', UserController.login);
api.post('/subir-imagen-partido/:id', [md_auth.ensureAuth, md_subir], UserController.subirImagenPartido)
api.post('/subir-imagen-candidato/:id', [md_auth.ensureAuth, md_subir1], UserController.subirImagenCandidato)
api.get('/obtener-imagen-partido/:imageFile', UserController.getImageFile) 
api.get('/obtener-imagen-candidato/:imageFile', UserController.getImageFileC) 
api.get('/partidos',  md_auth.ensureAuth, UserController.getPartidos) 
api.get('/partido/:id', md_auth.ensureAuth, UserController.getPartido) 
api.get('/candidatos',  md_auth.ensureAuth, UserController.getCandidatos) 
api.get('/candidato/:id', md_auth.ensureAuth, UserController.getCandidato)  
api.get('/pxc/:id', md_auth.ensureAuth, UserController.listarCandidatosPorPartido)
api.put('/editar-usuario/:id', md_auth.ensureAuth, UserController.editarUsuario) 
api.put('/e-partido/:id', md_auth.ensureAuth,UserController.editarPartido)
api.put('/e-candidato/:id', md_auth.ensureAuth,UserController.editarCandidato)  
api.delete('/eliminar-partido/:id', md_auth.ensureAuth, UserController.eleminarPartido)  
api.delete('/eliminar-candidato/:id', md_auth.ensureAuth, UserController.eleminarCandidato) 
api.post('/vote/:id', UserController.votar);
api.get('/results/:id', UserController.ObtainResults);


module.exports = api;