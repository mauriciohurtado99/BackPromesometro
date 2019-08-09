'use strict'

var express = require('express');
var EncuestaController = require('../controllers/encuestaController');
var md_auth = require('../middleware/authenticated');

var api = express.Router();
api.get('/encuestas', md_auth.ensureAuth, EncuestaController.getEncuestas);
api.get('/encuesta/:id', md_auth.ensureAuth, EncuestaController.getEncuesta);
api.post('/a-encuesta/:id', md_auth.ensureAuth, EncuestaController.addEncuesta); 
api.put('/edit-enc/:id',md_auth.ensureAuth,EncuestaController.editarEnc);
api.delete('/delete-enc/:id',md_auth.ensureAuth,EncuestaController.deleteEnc);
api.get('/enciestaXv/:id', md_auth.ensureAuth, EncuestaController.listarEncPorCandidato);
module.exports = api;